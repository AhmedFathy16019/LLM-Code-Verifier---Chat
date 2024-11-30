'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"

import { PlusIcon } from "@radix-ui/react-icons"
import { ChatList } from "./ChatList/ChatList"
import { ChatsProvider } from "@/contexts/ChatContext"
import { UserComponent } from "./User/User"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between w-full p-2 !pr-0">
            <span>Chats</span>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="max-w-fit">
                  <SidebarMenuButton>
                    <PlusIcon />
                  </SidebarMenuButton>
                </TooltipTrigger>

                <TooltipContent side="right"><p>Create new chat</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <ChatsProvider>
              <ChatList />
            </ChatsProvider>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserComponent />
      </SidebarFooter>
    </Sidebar>
  )
}