import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return `Hello ${input.name}!`;
    }),

  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(1)
    }))
    .mutation(async ({ input }) => {
      // Simulazione di autenticazione (sostituire con logica reale)
      const { email, password } = input;

      // Qui andresti a verificare nel database
      // Per ora simulo un login di successo
      if (email && password) {
        return {
          success: true,
          message: 'Login effettuato con successo',
          user: {
            id: 1,
            email: email,
            name: 'Utente Test'
          }
        };
      }

      throw new Error('Credenziali non valide');
    }),

  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(1)
    }))
    .mutation(async ({ input }) => {
      // Simulazione di registrazione
      const { email, password, name } = input;

      return {
        success: true,
        message: 'Registrazione completata con successo',
        user: {
          id: Date.now(), // ID temporaneo
          email: email,
          name: name
        }
      };
    })
});
