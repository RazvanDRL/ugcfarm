"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import NumberFlow, { type Value } from "@number-flow/react";

export function ROICalculator() {
    const [videosPerMonth, setVideosPerMonth] = useState([10])

    const AGENCY_COST_PER_VIDEO = 80
    const OUR_COST_PER_VIDEO = videosPerMonth[0] <= 10 ? 1.9 : videosPerMonth[0] <= 50 ? 1.9 : videosPerMonth[0] <= 150 ? 0.98 : 0.86

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
                            max={200}
                            min={1}
                            step={1}
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-4 gap-4">
                        <div className="col-span-2 p-4 rounded-lg bg-red-50">
                            <p className="text-sm text-red-600 font-medium">Agency Cost</p>
                            <div className="text-2xl font-extrabold text-red-700">
                                $<NumberFlow value={agencyCost} />
                            </div>
                        </div>

                        <div className="col-span-2 p-4 rounded-lg bg-green-50">
                            <p className="text-sm text-green-600 font-medium">Our Cost</p>
                            <div className="text-2xl font-extrabold text-green-700">
                                $<NumberFlow value={ourCost} />
                            </div>
                        </div>

                        <div className="col-span-4 row-span-1 p-4 rounded-lg bg-primary/5">
                            <p className="text-sm text-primary font-medium">Your savings with UGC Farm</p>
                            <span className="text-4xl font-black text-primary">
                                $<NumberFlow value={savings} />
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 