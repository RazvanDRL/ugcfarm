"use client"

import React, { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import InteractionSettings from "@/components/interaction-settings"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface TikTokShareConfirmationModalProps {
    open: boolean
    onClose: () => void
    onConfirm: (
        title: string,
        privacy: string,
        interactions: { comment: boolean; duet: boolean; stitch: boolean }
    ) => void
    titleValue: string
    onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    privacyOptions: string[]
    selectedPrivacy: string
    onPrivacyChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    disabledInteractions?: {
        comment: boolean
        duet: boolean
        stitch: boolean
    }
}

export default function TikTokShareConfirmationModal({
    open,
    onClose,
    onConfirm,
    titleValue,
    onTitleChange,
    privacyOptions,
    selectedPrivacy,
    onPrivacyChange,
    disabledInteractions = { comment: false, duet: false, stitch: false },
}: TikTokShareConfirmationModalProps) {
    const [interactions, setInteractions] = useState<{
        comment: boolean
        duet: boolean
        stitch: boolean
    }>({
        comment: false,
        duet: false,
        stitch: false,
    })

    const [consent, setConsent] = useState<boolean>(false)

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share Video on TikTok</DialogTitle>
                    <DialogDescription>
                        You are about to share this video on TikTok. For compliance with
                        TikTok's content sharing guidelines, please ensure that your content
                        meets the guidelines before proceeding.
                    </DialogDescription>
                </DialogHeader>
                <div className="my-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <Input
                        type="text"
                        value={titleValue}
                        onChange={onTitleChange}
                        placeholder="Enter video title"
                    />
                </div>
                <div className="my-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Display Option
                    </label>
                    <select
                        value={selectedPrivacy}
                        onChange={onPrivacyChange}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">
                            Choose an option
                        </option>
                        {privacyOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="my-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Interaction Settings
                    </label>
                    <InteractionSettings
                        disabledInteractions={disabledInteractions}
                        onChange={(newInteractions) => setInteractions(newInteractions)}
                    />
                </div>
                <div className="my-4 flex items-center gap-2">
                    <Checkbox
                        checked={consent}
                        onCheckedChange={(checked) => setConsent(checked === true)}
                    />
                    <Label className="text-sm text-gray-700">
                        By posting, you agree to TikTok's <Link href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en" className="text-primary hover:underline">Music Usage Confirmation</Link>
                    </Label>
                </div>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => onConfirm(titleValue, selectedPrivacy, interactions)}
                        disabled={!consent}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}