import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: 'always',
        enable_heatmaps: true,
        enable_recording_console_log: true,
    })
}

export { posthog } 