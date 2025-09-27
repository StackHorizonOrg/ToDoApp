import {z} from 'zod';
import {router, taskProcedure} from '../trpc';
import { pool } from '../../utils/db';

export const tasksRouter = router({
    addTask: taskProcedure.input(z.object({
        idUser: z.number(),
        titolo: z.string(),
        descrizione: z.string(),
        scadenza: z.string()
    })).mutation(async ({input}) => {
        const {idUser, titolo, descrizione, scadenza} = input;
        try {
            await pool.query('INSERT INTO Evento (idUtente, titolo, descrizione, dataOra) VALUES (?, ?, ?, ?)', [idUser, titolo, descrizione, scadenza]);
            return {
                success: true,
                message: 'Task aggiunto con successo'
            };
        } catch (error) {
            console.error('Errore inserimento task:', error);
            throw new Error('Errore inserimento task');
        }
    }),
    getTasks: taskProcedure.input(z.object({
        idUser: z.number()
    })).mutation(async ({input}) => {
        const {idUser} = input;
        try {
            const [rows] = await pool.query('SELECT id, titolo AS title, descrizione AS description, dataOra AS date, stato AS completed FROM Evento WHERE idUtente = ? ORDER BY (completed = \'in corso\') DESC, dataOra ASC', [idUser]);
            return rows as any[];
        } catch (error) {
            console.error('Errore recupero tasks:', error);
            throw new Error('Errore recupero tasks');
        }
    }),
    deleteTask: taskProcedure.input(z.object({
        id: z.number()
    })).mutation(async ({input}) => {
        const {id} = input;
        try {
            await pool.query('DELETE FROM Evento WHERE id = ?', [id]);
            return {
                success: true,
                message: 'Task eliminato con successo'
            };
        } catch (error) {
            console.error('Errore eliminazione task:', error);
            throw new Error('Errore eliminazione task');
        }
    }),
    updateTaskStatus: taskProcedure.input(z.object({
        id: z.number(),
    })).mutation(async ({input}) => {
        const {id} = input;
        try {
            await pool.query('UPDATE Evento SET stato=\'completato\' WHERE id = ?', [id]);
            return {
                success: true,
                message: 'Stato task aggiornato con successo'
            };
        } catch (error) {
            console.error('Errore aggiornamento stato task:', error);
            throw new Error('Errore aggiornamento stato task');
        }
    })
});