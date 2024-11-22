import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

import { DotsHorizontalIcon, ExclamationTriangleIcon} from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";

import { useChatsContext } from "@/contexts/ChatContext";

export function ChatList() {
  const { chats, loading, error } = useChatsContext();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 p-2">
        <Skeleton className="w-full h-8 p-2"/>
        <Skeleton className="w-full h-8 p-2"/>
        <Skeleton className="w-full h-8 p-2"/>
        <Skeleton className="w-full h-8 p-2"/>
        <Skeleton className="w-full h-8 p-2"/>
        <Skeleton className="w-full h-8 p-2"/>
        <Skeleton className="w-full h-8 p-2"/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <ExclamationTriangleIcon className="w-6 h-6 text-red-500"/>
        <p className="ml-2 text-red-500">Failed to load chats</p>
      </div>
    )
  }

  return (
    <SidebarMenu>
      {chats.map((chat: { _id: string, title: string }) => (
        <SidebarMenuItem key={chat._id}>
          <SidebarMenuButton asChild>
            <a href={`/chat/${chat._id}`}>
              <span>{chat.title}</span>
            </a>
          </SidebarMenuButton>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction>
                <DotsHorizontalIcon />
              </SidebarMenuAction>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="right" align="start">
              <DropdownMenuItem>
                <span>Rename Chat</span>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <span>Delete Chat</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};