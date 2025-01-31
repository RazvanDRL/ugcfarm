"use client"
import { useEffect, useState } from "react"
import { supabase, User } from "@/lib/supabase/client/supabase"
import { CheckCircle2, AlertCircle } from "lucide-react"
import TikTokAuthButton from "./tiktok-auth-button"

export function TikTokConnectionStatus() {
    const [isConnected, setIsConnected] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [accountInfo, setAccountInfo] = useState<{
        display_name?: string
        avatar_url?: string
    }>({})

    useEffect(() => {
        const checkConnection = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            setUser(user)

            const { data } = await supabase
                .from('tiktok_accounts')
                .select('tiktok_id, display_name, avatar_url')
                .eq('user_id', user.id)
                .single()

            setIsConnected(!!data?.tiktok_id)
            if (data) {
                setAccountInfo({
                    display_name: data.display_name,
                    avatar_url: data.avatar_url
                })
            }
        }

        checkConnection()
    }, [])

    if (!user) return null

    return (
        <div className="flex items-center gap-2">
            {isConnected ? (
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <div className="flex items-center gap-1.5">
                        {accountInfo.avatar_url && (
                            <img
                                src={accountInfo.avatar_url}
                                alt="TikTok avatar"
                                className="w-6 h-6 rounded-full"
                            />
                        )}
                        <span className="text-sm">
                            {accountInfo.display_name || 'TikTok Account'}
                        </span>
                    </div>
                </div>
            ) : (
                <>
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <TikTokAuthButton user_id={user.id} />
                </>
            )}
        </div>
    )
} 