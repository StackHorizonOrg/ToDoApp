
import {z} from 'zod';
import {router, authProcedure} from '../trpc';
import { pool } from '../../utils/db';

import { sendMail } from '../../utils/mailer';

export const authRouter = router({
    login: authProcedure
        .input(z.object({
            email: z.string().min(1).email(),
            password: z.string().min(1)
        }))
        .mutation(async ({input}) => {
            const {email, password} = input;

            const [rows] = await pool.query('SELECT * FROM Utente WHERE email = ? AND password = ?', [email, password]);
            const users = rows as any[];

            delete users[0]?.password;
            delete users[0]?.otp;

            if (users[0]) {
                return {
                    success: true,
                    message: 'Login effettuato con successo',
                    user: {
                        ...users[0]
                    }
                };
            } else {
                throw new Error("Non è stato possibile effettuare il login. Controlla le credenziali e riprova.");
            }
        }),
    uploadUtente: authProcedure
        .input(z.object({
            id: z.number(),
            nome: z.string(),
            cognome: z.string(),
            password: z.string(),
            notifWhatsapp: z.number(),
            notifEmail: z.number()
        }))
        .mutation(async ({input}) => {
            const {id, nome, cognome, password, notifWhatsapp, notifEmail} = input;
            if(password.length > 6){
                await pool.query('UPDATE Utente SET nome = ?, cognome = ?, password = ?, notifWhatsapp = ?, notifEmail = ? WHERE id = ?', [nome, cognome, password, notifWhatsapp, notifEmail, id]);
            }else if(password.length > 0 && password.length <= 6){
                throw new Error("La password deve essere di almeno 6 caratteri.");
            }else{
                await pool.query('UPDATE Utente SET nome = ?, cognome = ?, notifWhatsapp = ?, notifEmail = ? WHERE id = ?', [nome, cognome, notifWhatsapp, notifEmail, id]);
            }
            return {
                success: true,
                message: 'Utente aggiornato con successo'
            }
        }),
    register: authProcedure
        .input(z.object({
            email: z.string().min(1).email(),
            password: z.string().min(1),
            nome: z.string().min(1),
            cognome: z.string().min(1),
            cellulare: z.string().min(1)
        }))
        .mutation(async ({ input }) => {
            const { email, password, nome, cognome, cellulare } = input;
            // Controllo se esiste già l'utente
            const [rows] = await pool.query('SELECT * FROM Utente WHERE email = ?', [email]);
            const users = rows as any[];
            if (users[0]) {
                throw new Error("Esiste già un account con questa email.");
            }
            // Genera OTP numerico casuale di 6 cifre (mai null)
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            if (!otp) {
                throw new Error("Errore generazione OTP");
            }
            // Inserisci utente e OTP
            await pool.query('INSERT INTO Utente (email, password, nome, cognome, cellulare, otp) VALUES (?, ?, ?, ?, ?, ?)', [email, password, nome, cognome, cellulare, otp]);
            const [newUsers] = await pool.query('SELECT * FROM Utente WHERE email = ?', [email]);
            const newUser = (newUsers as any[])[0];
            // Rimuovi password e otp dall'oggetto restituito
            if (newUser) {
                delete newUser.password;
                delete newUser.otp;
            }
            return {
                success: true,
                message: 'Registrazione completata con successo',
                user: {
                     ...newUser
                }
            };
        }),
        otp: authProcedure
        .input(z.object({
            email: z.string().min(1).email(),
            cellulare: z.string().min(1),
            tipo: z.enum(["email", "whatsapp"])
        }))
        .mutation(async ({input}) => {
            const {email, cellulare, tipo} = input;
            // Recupera OTP attuale dal DB
            const [rows] = await pool.query('SELECT otp FROM Utente WHERE email = ?', [email]);
            const user = (rows as any[])[0];
            const otp = user?.otp;
            if (!otp) {
                throw new Error('OTP non trovato per questo utente.');
            }
            if (tipo === 'email') {
                // Invio OTP via email
                await sendMail({
                    to: email,
                    subject: 'Il tuo codice OTP',
                    text: `Il tuo codice OTP è: ${otp}`
                });
                return { success: true, message: 'OTP inviato via email' };
            }
            let numero = cellulare;
            if (!numero.startsWith('+39')) {
                numero = '+39' + numero;
            }
            numero = numero.replace('+', '');
            const body = {
                number: numero,
                text: `Il tuo codice OTP è: ${otp}`
            };
            if (tipo === "whatsapp") {
                const apiUrl = `${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE}`;
                const apikey = process.env.EVOLUTION_API_KEY;
                const res = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": apikey || ""
                   },
                    body: JSON.stringify(body),
                });
                const text = await res.text();
                if (!res.ok) {
                    throw new Error("Errore invio OTP via WhatsApp: " + text);
                }
                return { success: true, message: "OTP inviato via WhatsApp", response: text };
            }
            // Qui puoi aggiungere la logica di invio email con l'OTP
            return { success: true, message: `OTP inviato via ${tipo}` };
        }),
        verifyOtp: authProcedure
        .input(z.object({
            email: z.string().min(1).email(),
            otp: z.string().min(6).max(6)
        }))
        .mutation(async ({ input }) => {
            const { email, otp } = input;
            const [rows] = await pool.query('SELECT OTP FROM Utente WHERE email = ?', [email]);
            const user = (rows as any[])[0];
            if (!user) {
                throw new Error('Utente non trovato.');
            }
            console.log(otp + ' ' + user.OTP);

            if (user.OTP !== otp) {
                throw new Error('OTP non valido.');
            }
            // Aggiorna il campo verificato a 1 e rimuovi OTP
            await pool.query('UPDATE Utente SET verificato = 1  WHERE email = ?', [email]);
            return { success: true, message: 'OTP verificato con successo' };
        }),

});