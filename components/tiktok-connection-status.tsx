"use client"
import { useEffect, useState } from "react"
import { supabase, User } from "@/lib/supabase/client/supabase"
import { CheckCircle2, AlertCircle, Send } from "lucide-react"
import TikTokAuthButton from "./tiktok-auth-button"
import { getSignedUrl } from "@/hooks/use-signed-url"
import { Button } from "./ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import TikTokShareConfirmationModal from "@/components/tiktok-share-confirmation-modal"

export function TikTokConnectionStatus() {
    const [isConnected, setIsConnected] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [accountInfo, setAccountInfo] = useState<{
        display_name?: string
        avatar_url?: string
        access_token?: string
    }>({})
    const [videoHistory, setVideoHistory] = useState<any[]>([])
    const [token, setToken] = useState<string>("")

    // State to control the confirmation modal and custom title
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false)
    const [selectedVideo, setSelectedVideo] = useState<string>("")
    const [customTitle, setCustomTitle] = useState("")
    const [privacyOptions, setPrivacyOptions] = useState<string[]>([])
    const [selectedPrivacy, setSelectedPrivacy] = useState("")

    useEffect(() => {
        const checkConnection = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            setUser(user)

            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            setToken(session.access_token)

            const { data } = await supabase
                .from('tiktok_accounts')
                .select('tiktok_id, display_name, avatar_url, tiktok_access_token')
                .eq('user_id', user.id)
                .single()

            console.log("data", data)

            setIsConnected(!!data?.tiktok_id)
            if (data) {
                setAccountInfo({
                    display_name: data.display_name,
                    avatar_url: data.avatar_url,
                    access_token: data.tiktok_access_token
                })
            }

            const { data: videoData } = await supabase
                .from('video_history')
                .select('*')
                .eq('user_id', user.id)

            let tempVideoHistory: any[] = []

            videoData?.forEach((video) => {
                getSignedUrl(`${video.video_id}.mp4`, 'output-bucket', session.access_token).then((signedUrl) => {
                    // get the host from the signed url
                    const host = new URL(signedUrl!).host
                    tempVideoHistory.push(signedUrl!.replace(host, 'output-bucket.ugc.farm'))
                })
            })
            console.log("tempVideoHistory", tempVideoHistory)
            setVideoHistory(tempVideoHistory)

            // Fetch creator info to get privacy options
            // if (data?.tiktok_access_token) {
            //     try {
            //         const res = await fetch("/api/tiktok-proxy/creator-info", {
            //             method: "POST",
            //             headers: {
            //                 Authorization: `Bearer ${data.tiktok_access_token}`,
            //                 "Content-Type": "application/json",
            //             },
            //         })
            //         if (res.ok) {
            //             const creatorData = await res.json()
            //             // Assume the creatorData contains a field 'privacy_options'
            //             if (creatorData.data.privacy_level_options) {
            //                 setPrivacyOptions(creatorData.data.privacy_level_options)
            //                 // Set default privacy value to first option
            //                 setSelectedPrivacy("Choose Display Option")
            //             }
            //         } else {
            //             toast.error("Failed to get privacy options")
            //         }
            //     } catch (error) {
            //         console.error("Error fetching creator info:", error)
            //     }
            // }
        }

        checkConnection()
    }, [])

    async function postToTikTok(videoUrl: string, accessToken: string, title: string, privacy: string) {
        try {
            // First query creator info
            const creatorInfo = await fetch('/api/tiktok-proxy/creator-info', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!creatorInfo.ok) {
                toast.error('Failed to get creator info')
                throw new Error('Failed to get creator info');
            }

            console.log("creatorInfo", creatorInfo)

            // Then initialize the video post using the provided title and privacy option
            const postResponse = await fetch('/api/tiktok-proxy/v2/post/publish/video/init/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'x-tts-version': '2.0'
                },
                body: JSON.stringify({
                    post_info: {
                        title: title,
                        privacy_level: privacy,
                        disable_duet: true,
                        disable_comment: true,
                        disable_stitch: true,
                        commercial_content_tags: [],
                        branded_content_tags: [],
                        video_cover_timestamp_ms: 0
                    },
                    source_info: {
                        source: "PULL_FROM_URL",
                        video_url: videoUrl
                    },
                    device_info: {
                        device_id: "ugc-farm-web",
                        device_platform: "web"
                    }
                })
            });

            const responseData = await postResponse.json();

            if (!postResponse.ok) {
                throw new Error(responseData.error.message || 'Failed to initialize post');
            }

            return responseData.data.publish_id;
        } catch (error) {
            console.error('Error posting to TikTok:', error);
            throw error;
        }
    }

    async function postVideo(videoUrl: string, title: string, privacy: string) {
        try {
            const publishId = await postToTikTok(videoUrl, accountInfo.access_token!, title, privacy);

            toast.success(`Video posted successfully! ${publishId}`)

            // Optional: Poll for post status here using the publishId
        } catch (error) {
            toast.error(`Failed to post video: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    // Handler when the user clicks the Post button; open the confirmation modal.
    const handlePostClick = (video: string) => {
        setSelectedVideo(video)
        setCustomTitle("") // Reset title input for each new share
        setConfirmModalOpen(true)
    }

    // When confirmed in the modal, post the video with the custom title and selected privacy.
    const handleConfirmShare = (
        title: string,
        privacy: string,
        interactions: { comment: boolean; duet: boolean; stitch: boolean }
    ) => {
        console.log("Interaction settings:", interactions)
        if (selectedVideo) {
            postVideo(selectedVideo, title, privacy)
        }
        setConfirmModalOpen(false)
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomTitle(e.target.value)
    }

    const handlePrivacyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPrivacy(e.target.value)
    }

    if (!user || !token) return null

    return (
        <div className="flex flex-col items-center gap-4">
            <Card className="p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 mr-12">
                        {accountInfo.avatar_url && (
                            <img src={accountInfo.avatar_url} className="w-10 h-10 rounded-full" />
                        )}

                        <div className="space-y-1">
                            <h3 className="text-sm font-medium">
                                {accountInfo.display_name || 'TikTok Account'}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                {isConnected ? 'Account connected' : 'Account not connected'}
                            </p>
                        </div>


                    </div>

                    {isConnected ? (
                        <Badge variant="outline" className="gap-2 py-1.5">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Connected</span>
                        </Badge>
                    ) : (
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                            <TikTokAuthButton
                                user_id={user.id}
                            />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 relative">
                    <TikTokAuthButton
                        user_id={user.id}
                    />
                </div>
            </Card>
            <div>
                {videoHistory.map((video) => {
                    return (
                        <div key={video} className="w-[200px] h-[200px] flex flex-col gap-3">
                            <video src={video} className="rounded-lg" />
                            <Button onClick={() => handlePostClick(video)}>
                                <Send className="h-4 w-4" />
                                Post
                            </Button>
                        </div>
                    )
                })}
            </div>

            {/* Confirmation Modal with Title and Privacy Option */}
            <TikTokShareConfirmationModal
                open={isConfirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirmShare}
                titleValue={customTitle}
                onTitleChange={handleTitleChange}
                privacyOptions={privacyOptions}
                selectedPrivacy={selectedPrivacy}
                onPrivacyChange={handlePrivacyChange}
            />
        </div>
    )
} 