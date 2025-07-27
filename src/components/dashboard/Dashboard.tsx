import { AppSidebar } from "../sidebar/AppSidebar";
import { SidebarProvider } from "../ui/sidebar";    
import { AIDrawer } from "../aidrawer/AIDrawer";
export default function Dashboard() {
    return (
        <div className="flex h-screen">
            <SidebarProvider>
                <AppSidebar />
            </SidebarProvider>

            <AIDrawer />
        </div>
    )
}