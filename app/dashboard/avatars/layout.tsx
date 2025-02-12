import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { type ReactNode, Suspense } from 'react'
import { Loader2 } from 'lucide-react'

export default function AvatarsLayout({ children }: { children: ReactNode }) {
    return (
        <NuqsAdapter>
            <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            }>
                {children}
            </Suspense>
        </NuqsAdapter>
    )
}

