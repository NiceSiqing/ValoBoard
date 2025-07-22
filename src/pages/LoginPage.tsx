import React from "react";
import { Link, useNavigate } from "react-router-dom"; 

import LoginTabs from "@/components/login/LoginTabs";


export default function LoginPage() {
  const navigate = useNavigate();
    const handleLoginSuccess = () => {
    navigate("/index");
  };
  return (
    <div className="min-h-screen w-full bg-background flex">
      {/* 左侧大图和介绍（仅大屏显示） */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-4  bg-[#efefef]">
        {/* 顶部 logo + 文本 */}
        <div className="flex items-center text-2xl font-semibold ">
          <img src="/ValoBoard_grey.png" alt="Logo" className="h-20 mr-2" />
          <span className="text-primary">ValoBoard</span>
        </div>
        {/* 底部引用 */}
        <blockquote className="leading-normal text-balance text-primary ">
          &ldquo;Efficient Collaboration, Smart Management, Connect Teams to Drive Tomorrow.&rdquo; 
        </blockquote>
      </div>
      {/* 右侧表单 */}
      <div className="flex-1 flex flex-col items-center justify-start pt-14 p-4 text-primary ">
        <div className="mx-auto flex w-full flex-col justify-center gap-4 sm:w-[480px]">
          <div className="flex flex-col gap-2 text-center items-center">
            <img src="/ValoBoard_white.png" alt="Logo" className="h-30 w-30 rounded-4xl border border-gray-100 mb-2" />
            <h1 className="text-2xl font-semibold  tracking-tight">
              Welcome to ValoBoard 
            </h1>
          </div>
          <LoginTabs onLoginSuccess={handleLoginSuccess} />

          <div className="text-center text-sm pt-4">
            Forgot your Password?{" "}
            <Link to="/login" className="underline hover:text-primary">
              Click Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
