import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { type ReactNode, Suspense } from 'react'

export default function AvatarsLayout({ children }: { children: ReactNode }) {
    return (
        <NuqsAdapter>
            <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                </div>
            }>
                {children}
            </Suspense>
        </NuqsAdapter>
    )
}

