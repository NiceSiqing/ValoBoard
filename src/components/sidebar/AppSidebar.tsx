import { Calendar, Home, Inbox, Search, Settings, FolderOpen, UsersRound, Contact } from "lucide-react"

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar"
import {SidebarUser} from "@/components/sidebar/sidebar_components/SidebarUser"
import { NavSecondary } from "./sidebar_components/NavSecondary"
import { NavMain } from "./sidebar_components/NavMain"


const data = {
  user: {
    name: "Siqing",
    email: "Siqing@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Projects",
      url: "#",
      icon: FolderOpen,
    },
    {
      title: "Team",
      url: "#",
      icon: UsersRound,
    },
    {
      title: "Contact",
      url: "#",
      icon: Contact,
    }
  ],
  NavSecondary: [
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ]
}

export function AppSidebar({...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b-1 border-gray-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <img src="./ValoBoard_Icon.ico" className="w-6 h-6" />
                <span className="text-lg font-semibold text-gray-600">ValoBoard Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <NavSecondary items={data.NavSecondary} companyCode="888666" className="text-primary font-medium" />
      <SidebarFooter className="border-t-1 border-gray-200">
        <SidebarUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}