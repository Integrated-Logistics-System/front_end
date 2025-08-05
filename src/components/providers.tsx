// frontend/src/components/providers.tsx
'use client';

import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';


export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5,
                retry: 1,
            },
        },
    }));

    return (
        <RecoilRoot>
            <QueryClientProvider client={queryClient}>
                {children}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#333',
                                color: '#fff',
                            },
                        }}
                    />
                {/* React Query DevTools - 개발 중에만 표시 */}
                {process.env.NODE_ENV === 'development' && (
                    <ReactQueryDevtools 
                        initialIsOpen={false} 
                        buttonPosition="bottom-left"
                        position="bottom"
                    />
                )}
            </QueryClientProvider>
        </RecoilRoot>
    );
}