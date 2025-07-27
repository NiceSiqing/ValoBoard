import * as React from "react"
import { Copy } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType
}

export function NavSecondary({
  items,
  companyCode,
  ...props
}: {items : NavItem[]
  companyCode: string
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {

  const [copied, setCopied] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(companyCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000) // 2秒后重置
  }



  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem key="company-code">
            <SidebarMenuButton 
              onClick={handleCopy}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              title="Click to Copy">
              
              {/* 显示公司代码和复制状态 */}
              <span className="flex items-center ml-2">
                <Copy className="h-4 w-4 mr-2"/>
                <span className="mr-2">Company#:</span>
                <span className="font-medium">{isHovered? companyCode : 
              (<span className="tracking-widest" style={{ lineHeight: '1', verticalAlign: 'middle' }}>••••••</span>)
              }</span>
                {copied && (
                  <span className="ml-2 text-green-500">Copied!</span>
                )}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
