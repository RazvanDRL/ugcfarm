"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface InteractionSettingsProps {
    /**
     * Flag to indicate if the post is a Photo Post.
     * When true, only Allow Comment is displayed.
     */
    isPhotoPost?: boolean
    /**
     * Indicates which interactions have been disabled by the creator's app settings.
     */
    disabledInteractions: {
        comment: boolean
        duet: boolean
        stitch: boolean
    }
    /**
     * Callback with the interaction settings whenever one changes.
     */
    onChange: (settings: {
        comment: boolean
        duet: boolean
        stitch: boolean
    }) => void
}

export default function InteractionSettings({
    isPhotoPost,
    disabledInteractions,
    onChange,
}: InteractionSettingsProps) {
    // None are checked by default.
    const [allowComment, setAllowComment] = useState(false)
    const [allowDuet, setAllowDuet] = useState(false)
    const [allowStitch, setAllowStitch] = useState(false)

    const handleCommentChange = (checked: boolean) => {
        setAllowComment(checked)
        onChange({
            comment: checked,
            duet: allowDuet,
            stitch: allowStitch,
        })
    }

    const handleDuetChange = (checked: boolean) => {
        setAllowDuet(checked)
        onChange({
            comment: allowComment,
            duet: checked,
            stitch: allowStitch,
        })
    }

    const handleStitchChange = (checked: boolean) => {
        setAllowStitch(checked)
        onChange({
            comment: allowComment,
            duet: allowDuet,
            stitch: checked,
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <Checkbox
                    id="allow-comment"
                    checked={allowComment}
                    onCheckedChange={handleCommentChange}
                    disabled={disabledInteractions.comment}
                    className={disabledInteractions.comment ? "opacity-50 cursor-not-allowed" : ""}
                />
                <Label htmlFor="allow-comment">Allow Comment</Label>
            </div>

            {!isPhotoPost && (
                <>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="allow-duet"
                            checked={allowDuet}
                            onCheckedChange={handleDuetChange}
                            disabled={disabledInteractions.duet}
                            className={disabledInteractions.duet ? "opacity-50 cursor-not-allowed" : ""}
                        />
                        <Label htmlFor="allow-duet">Allow Duet</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="allow-stitch"
                            checked={allowStitch}
                            onCheckedChange={handleStitchChange}
                            disabled={disabledInteractions.stitch}
                            className={disabledInteractions.stitch ? "opacity-50 cursor-not-allowed" : ""}
                        />
                        <Label htmlFor="allow-stitch">Allow Stitch</Label>
                    </div>
                </>
            )}
        </div>
    )
}