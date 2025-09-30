import type { AppType } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { trpc } from '../utils/trpc';
import Head from 'next/head';

const MyApp: AppType = ({ Component, pageProps }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
        <Head>
            <meta name="description" content="Insubrica. Applicazione web per la gestione delle task." />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Todo</title>
            {/* altri meta tag */}
        </Head>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
};

export default trpc.withTRPC(MyApp);
