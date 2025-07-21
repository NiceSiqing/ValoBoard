import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import React, {useState} from "react";



export default function LoginTabs() {
    // const [tryLogin, setTryLogin] = useState<boolean>(false);

    // 切换登录和注册表单
    // function handleTryLogin() {
    //     setTryLogin(prev => !prev);
    // }
  return (
    <Tabs defaultValue="Register" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="Register">Register</TabsTrigger>
        <TabsTrigger value="Login">Login</TabsTrigger>
      </TabsList>
      <TabsContent value="Register">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@peduarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="Login">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
    // <Tabs defaultValue="register" className="w-full">
    //     <TabsList className="grid w-full grid-cols-2">
    //         <TabsTrigger value="register" onClick={handleTryLogin} >Register</TabsTrigger>
    //         <TabsTrigger value="login" onClick={handleTryLogin} >Login</TabsTrigger>

    //     </TabsList>
    //     {tryLogin ? 
    //     <TabsContent value="login">
    //         <h2 className="text-lg font-semibold mb-4">Login</h2>
    //         <p>Type in your email and password to login.</p>

            
    //     </TabsContent> :
    //           <TabsContent value="register">Use your email to register.
        
    //         <div className="p-4">
    //         <h2 className="text-lg font-semibold mb-4">Register Form</h2>
            
    //         </div>
    //     </TabsContent>
    //     }

    // </Tabs>
    
  );
}