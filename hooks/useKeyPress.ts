import { useEffect, useCallback } from 'react'

type KeyHandler = {
    key: string
    callback: () => void
    ctrl?: boolean
    shift?: boolean
    alt?: boolean
}

export function useKeyPress(handlers: KeyHandler[]) {
    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        handlers.forEach(({ key, callback, ctrl, shift, alt }) => {
            const ctrlMatches = ctrl ? event.ctrlKey : true
            const shiftMatches = shift ? event.shiftKey : true
            const altMatches = alt ? event.altKey : true

            if (
                event.key === key &&
                ctrlMatches &&
                shiftMatches &&
                altMatches
            ) {
                event.preventDefault()
                callback()
            }
        })
    }, [handlers])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [handleKeyPress])
} 