"use client"

import { useState } from "react"
import { ArrowUpRight, ChevronRight, type LucideIcon } from "lucide-react"
import { supabase } from "@/lib/supabase/client/supabase"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Link from "next/link"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      toast.error("Feedback cannot be empty")
      return
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) {
      toast.error("Failed to get user")
      return
    }

    if (!user) {
      toast.error("User not found")
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('feedback')
        .insert(
          {
            user_id: user.id,
            q1: feedback,
          }
        )

      if (error) throw error

      toast.success("Thank you for your feedback!")
      setFeedback("")
      setDialogOpen(false)
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast.error("Failed to submit feedback")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SidebarGroup>
      {/* FEEDBACK BUTTON */}
      {/* <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full bg-primary text-primary-foreground">
            GET 3 CREDITS FREE
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Provide Feedback</DialogTitle>
            <DialogDescription>
              We appreciate your feedback to help improve our platform. As a thank you, you will receive <span className="font-bold">3 credits</span> for free.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="What do you think about our platform? Share your thoughts and suggestions..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleSubmitFeedback}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
      <Button variant="outline" className="w-full" asChild>
        <Link href="https://insigh.to/b/ugc-farm" target="_blank">
          <span className="flex items-center gap-1">Suggest a feature <ArrowUpRight className="w-4 h-4" /></span>
        </Link>
      </Button>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup >
  )
}
