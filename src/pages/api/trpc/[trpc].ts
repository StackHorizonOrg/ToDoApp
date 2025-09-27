import {createNextApiHandler} from '@trpc/server/adapters/next';
import {router} from '../../../server/trpc';
import {exampleRouter} from '../../../server/routers/example';
import {authRouter} from '../../../server/routers/auth';
import {tasksRouter} from "@/server/routers/tasks";

const appRouter = router({
    example: exampleRouter,
    auth: authRouter,
    tasks: tasksRouter
});

export type AppRouter = typeof appRouter;

export default createNextApiHandler({
    router: appRouter,
    createContext: () => ({}),
});
