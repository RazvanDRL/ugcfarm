"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"

export function ROICalculator() {
    const [videosPerMonth, setVideosPerMonth] = useState([10])

    const AGENCY_COST_PER_VIDEO = 100
    const OUR_COST_PER_VIDEO = 10

    const agencyCost = videosPerMonth[0] * AGENCY_COST_PER_VIDEO
    const ourCost = videosPerMonth[0] * OUR_COST_PER_VIDEO
    const savings = agencyCost - ourCost

    return (
        <Card className="w-full max-w-2xl">
            <CardContent className="pt-6">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <label className="text-lg font-medium">
                            Videos per month: {videosPerMonth[0]}
                        </label>
                        <Slider
                            value={videosPerMonth}
                            onValueChange={setVideosPerMonth}
                            max={100}
                            min={1}
                            step={1}
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-4 gap-4">
                        <div className="col-span-2 p-4 rounded-lg bg-red-50">
                            <p className="text-sm text-red-600 font-medium">Agency Cost</p>
                            <p className="text-2xl font-bold text-red-700">${agencyCost}</p>
                        </div>

                        <div className="col-span-2 p-4 rounded-lg bg-green-50">
                            <p className="text-sm text-green-600 font-medium">Our Cost</p>
                            <p className="text-2xl font-bold text-green-700">${ourCost}</p>
                        </div>

                        <div className="col-span-4 row-span-1 p-4 rounded-lg bg-blue-50">
                            <p className="text-sm text-blue-500 font-medium">Your savings with UGC Farm</p>
                            <p className="text-4xl font-bold text-blue-600">${savings}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 