'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from 'react'

export default function QueryProvider({ children }: { children: React.ReactNode }) {

    /**
     * なせuseState
     * QueryProviderコンポーネントの初回レンダリングのみqueryClientを作成して、
     * その同じインスタンスを再利用することで、データ取得のキャッシュが保持
     * https://tanstack.com/query/latest/docs/framework/react/guides/ssr
     */
    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}