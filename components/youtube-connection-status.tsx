"use client"
import { useEffect, useState } from "react"
import { supabase, User } from "@/lib/supabase/client/supabase"
import { CheckCircle2, AlertCircle } from "lucide-react"
import YouTubeAuthButton from "./youtube-auth-button"
import { Badge } from "@/components/ui/badge"

export function YouTubeConnectionStatus() {
    const [isConnected, setIsConnected] = useState(false)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const checkConnection = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            setUser(user)

            const { data } = await supabase
                .from('youtube_accounts')
                .select('access_token')
                .eq('user_id', user.id)
                .single()

            setIsConnected(!!data?.access_token)
        }

        checkConnection()
    }, [])

    if (!user) return null

    return (
        <div className="space-y-4">
            {isConnected ? (
                <Badge variant="outline" className="gap-2 py-1.5">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Connected</span>
                </Badge>
            ) : (
                <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <YouTubeAuthButton user_id={user.id} />
                </div>
            )}
        </div>
    )
} 