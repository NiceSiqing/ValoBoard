import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User, Building2, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

type UserRole = "administrator" | "employee" | null;
type CompanyAction = "create" | "join" | null;

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [companyAction, setCompanyAction] = useState<CompanyAction>(null);
  const [companyCode, setCompanyCode] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

const handleRoleSelect = (role: UserRole) => {
  setUserRole(role);
  // If employee, skip to join company step
  if (role === "employee") {
    setCompanyAction("join");
  } else {
    setCompanyAction(null);
  }
};

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const canProceedStep1 = userRole !== null;
  const canProceedStep2 = userRole === "administrator" 
    ? companyAction !== null && (companyAction === "create" || companyCode.length === 6)
    : companyCode.length === 6;
  const canProceedStep3 = avatarFile !== null;

  const renderStep1 = () => (
    <Card className="w-full max-w-xl border-0 shadow-xl">
      <CardHeader className="text-center pb-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <UsersRound className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="text-3xl font-semibold text-foreground mb-3 text-primary">Welcome to ValoBoard</CardTitle>
        <CardDescription className="text-muted-foreground text-lg">
          Let's get you set up with the right access level
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 px-8 pb-6">
        <div className="space-y-6">
            <label className="flex justify-center text-2xl font-bold text-foreground px-2 text-primary"><span>Select your role</span></label>

            <div className="relative">
                <div className="relative bg-muted/50 p-1 rounded-xl h-20 border border-border/50">
                    {/* 滑动指示器 */}
                    <div 
                    className={`absolute top-1 bottom-1 w-1/2 bg-background rounded-lg shadow-sm border border-border/30 transition-all duration-300 ease-out ${
                        userRole === "administrator" ? "left-1" : "left-1/2"
                    }`}
                    />
                    
                    {/* Tab按钮 */}
                    <div className="relative grid grid-cols-2 h-full">
                    <button
                        type="button"
                        onClick={() => handleRoleSelect("administrator")}
                        className={`relative z-10 flex items-center justify-center h-full rounded-lg font-medium text-lg transition-all duration-300 ${
                        userRole === "administrator" 
                            ? "text-foreground" 
                            : "text-muted-foreground hover:text-foreground/80"
                        }`}
                    >
                        I'm an Administrator
                    </button>
                    <button
                        type="button"
                        onClick={() => handleRoleSelect("employee")}
                        className={`relative z-10 flex items-center justify-center h-full rounded-lg font-medium text-lg transition-all duration-300 ${
                        userRole === "employee" 
                            ? "text-foreground" 
                            : "text-muted-foreground hover:text-foreground/80"
                        }`}
                    >
                        I'm an Employee
                    </button>
                    </div>
                </div>
            </div>
        </div>
        
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="w-full max-w-xl border-0 shadow-xl">
      <CardHeader className="text-center pb-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Building2 className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="text-3xl font-semibold text-foreground mb-2 text-primary">Company Setup</CardTitle>
        <CardDescription className="text-muted-foreground text-lg">
          {userRole === "administrator" 
            ? "Choose how you'd like to set up your workspace"
            : "Enter your company code to join your team"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 px-8 pb-6">
        {userRole === "administrator" && (
          <div className="space-y-4">
            <Button
              variant={companyAction === "create" ? "default" : "outline"}
              size="lg"
              className={cn(
                "w-full h-16 text-lg font-medium justify-start",
                companyAction === "create" && "bg-primary text-white hover:bg-primary/90"
              )}
              onClick={() => setCompanyAction("create")}
            >
              <Building2 className="mr-4 h-6 w-6" />
              Create new company group
            </Button>
            <Button
              variant={companyAction === "join" ? "default" : "outline"}
              size="lg"
              className={cn(
                "w-full h-14 text-base font-medium justify-start",
                companyAction === "join" && "bg-primary text-white hover:bg-primary/90"
              )}
              onClick={() => setCompanyAction("join")}
            >
              <UsersRound className="mr-3 h-5 w-5" />
              Join an existing company group
            </Button>
          </div>
        )}
        
        {(companyAction === "join" || userRole === "employee") && (
          <div className="space-y-4">
            <label className="flex justify-center text-2xl font-bold text-primary text-foreground">Company Code</label>
            <div className="flex justify-center">
              <InputOTP 
                maxLength={6} 
                value={companyCode} 
                onChange={(value) => setCompanyCode(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-14 h-14 text-xl" />
                  <InputOTPSlot index={1} className="w-14 h-14 text-xl" />
                  <InputOTPSlot index={2} className="w-14 h-14 text-xl" />
                  <InputOTPSlot index={3} className="w-14 h-14 text-xl" />
                  <InputOTPSlot index={4} className="w-14 h-14 text-xl" />
                  <InputOTPSlot index={5} className="w-14 h-14 text-xl" />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Enter the 6-digit code provided by your administrator
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="w-full max-w-lg border-0 shadow-lg">
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold text-foreground text-primary">Complete Your Profile</CardTitle>
        <CardDescription className="text-muted-foreground text-base">
          Upload a profile picture to personalize your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-6">
          <Avatar className="w-32 h-32">
            <AvatarImage src={avatarPreview} />
            <AvatarFallback className="bg-muted">
              <User className="w-12 h-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          
          <div className="w-full flex justify-center ">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              id="avatar-upload"
            />
            <label htmlFor="avatar-upload">
              <Button
                variant="outline"
                size="lg"
                className="w-88 h-14 text-lg font-semibold cursor-pointer border-4 border-gray-500 text-primary rounded-4xl hover:bg-gray-100 transition-colors duration-200"
                asChild
              >
                <span>
                  <Upload className="mr-3 h-6 w-6" />
                  {avatarFile ? "Change Picture" : "Upload Picture"}
                </span>
              </Button>
            </label>
          </div>
          
          {!avatarFile && (
            <p className="text-sm text-muted-foreground text-center">
              Please upload a profile picture to continue
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );


  return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-5xl border-0 bg-transparent shadow-none p-0">
                <div className="bg-background rounded-lg shadow-xl p-6 sm:p-8 lg:p-10 min-h-[600px] flex items-center justify-center">
                <div className="w-full flex justify-center">
                    <div className="w-full max-w-2xl">
                    {/* Progress Bar */}
                    <div className="space-y-4 mb-12">
                        <div className="flex justify-between text-base text-muted-foreground">
                        <span>Step {currentStep} of {totalSteps}</span>
                        <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-3" />
                    </div>

                    {/* Step Content - 居中的卡片容器 */}
                    <div className="flex justify-center mb-12">
                        {/* 这里是你的 renderStep1/2/3 返回的卡片内容 */}
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between gap-6 max-w-2xl mx-auto">
                        <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className="w-28 px-8 py-5 text-base"
                        >
                        Back
                        </Button>
                        <Button
                        onClick={handleNext}
                        disabled={
                            (currentStep === 1 && !canProceedStep1) ||
                            (currentStep === 2 && !canProceedStep2) ||
                            (currentStep === 3 && !canProceedStep3)
                        }
                        className="w-28 px-8 py-5  text-base bg-primary hover:bg-primary/90"
                        >
                        {currentStep === totalSteps ? "Complete" : "Next"}
                        </Button>
                    </div>
                    </div>
                </div>
                </div>
            </DialogContent>
        </Dialog>
  );
}