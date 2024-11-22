'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
} from "@/components/ui/sidebar"

import { PlusIcon } from "@radix-ui/react-icons"
import { ChatList } from "./ChatList/ChatList"
import { ChatsProvider } from "@/contexts/ChatContext"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          
          <SidebarGroupAction title="Add Chat">
            <PlusIcon />
            <span className="sr-only">Add Chat</span>
          </SidebarGroupAction>

          <SidebarGroupContent>
            <ChatsProvider>
              <ChatList />
            </ChatsProvider>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}