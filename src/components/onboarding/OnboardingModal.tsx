import { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, UsersRound, SquareUserRound, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import OnboardingAdm from "./OnboardingAdm";
import OnboardingEmployee from "./OnboardingEmployee";
import { supabase } from "@/supabase"; // 按你的实际路径调整

// 类型定义
type UserRole = "administrator" | "employee";
type Gender = "male" | "female" | "private" | null;

export interface UserData {
  fullName: string;
  gender: Gender;
  countryCode: string;
  phoneNumber: string;
  avatarFile: File | null;
  avatarPreview: string;
  userRole: UserRole;
  companyCode: string;
  email: string;
}

interface OnboardingModalProps {
  onComplete: () => void;
}

// 常见国家区号
const countryCodes = [
  { code: "+86", country: "China", flag: "CN" },
  { code: "+1", country: "United States", flag: "US" },
  { code: "+44", country: "United Kingdom", flag: "GB" },
  { code: "+81", country: "Japan", flag: "JP" },
  { code: "+82", country: "South Korea", flag: "KR" },
  { code: "+49", country: "Germany", flag: "DE" },
  { code: "+33", country: "France", flag: "FR" },
  { code: "+91", country: "India", flag: "IN" },
  { code: "+61", country: "Australia", flag: "AU" },
  { code: "+65", country: "Singapore", flag: "SG" },
];

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  // 三步表单的本地状态
  const [currentStep, setCurrentStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<Gender>(null);
  const [countryCode, setCountryCode] = useState("+86");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [userRole, setUserRole] = useState<UserRole>("employee");
  const [email, setEmail] = useState("");
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data?.user?.email || "");
    });
  }, []);

  // 下一步
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(4);
    }
  };

  // 上一步
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 头像本地预览
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

  // 三步校验
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return fullName.trim().length > 1 && gender !== null && phoneNumber.trim().length >= 5;
      case 2:
        return avatarFile !== null;
      case 3:
        return true;
      default:
        return false;
    }
  };

  // 拼装所有用户数据，交给分支组件
  if (currentStep > 3) {
    if (!avatarFile) return null;
    const userData:  UserData = {
      fullName,
      gender,
      countryCode,
      phoneNumber,
      avatarFile: avatarFile as File, // 确保有头像
      avatarPreview,
      userRole,
      companyCode: "",
      email
    };
    if (userRole === "administrator") {
      return (
        <OnboardingAdm
          
          userData={userData}
          onComplete={onComplete}
          onBack={() => setCurrentStep(3)}
        />
      );
    }
    return (
      <OnboardingEmployee
        
        userData={userData}
        onComplete={onComplete}
        onBack={() => setCurrentStep(3)}
      />
    );
  }

  // ========== Step 1 ==========
  const renderStep1 = () => (
    <Card className="w-full max-w-xl border-0 shadow-xl">
      <CardHeader className="text-center pb-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <UserCircle className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="text-3xl font-semibold text-primary mb-3">Personal Information</CardTitle>
        <CardDescription className="text-muted-foreground text-lg">
          Tell us a bit about yourself
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-8 pb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Full Name</label>
          <Input
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-12 text-base"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Gender</label>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant={gender === "male" ? "default" : "outline"}
              onClick={() => setGender("male")}
              className={cn("h-12 text-base", gender === "male" && "bg-primary text-white hover:bg-primary/90")}
            >Male</Button>
            <Button
              variant={gender === "female" ? "default" : "outline"}
              onClick={() => setGender("female")}
              className={cn("h-12 text-base", gender === "female" && "bg-primary text-white hover:bg-primary/90")}
            >Female</Button>
            <Button
              variant={gender === "private" ? "default" : "outline"}
              onClick={() => setGender("private")}
              className={cn("h-12 text-base", gender === "private" && "bg-primary text-white hover:bg-primary/90")}
            >Private</Button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Phone Number</label>
          <div className="flex gap-3">
            <Select value={countryCode} onValueChange={setCountryCode}>
              <SelectTrigger className="!w-32 !h-12 !text-medium !pl-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                {countryCodes.map((country) => (
                  <SelectItem key={country.code} value={country.code} >
                    <span className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.code}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 h-12 text-base tracking-wider"
              type="tel"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // ========== Step 2 ==========
  const renderStep2 = () => (
    <Card className="w-full max-w-lg border-0 shadow-xl">
      <CardHeader className="text-center pb-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <UserCircle className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="text-3xl font-semibold text-primary mb-3">Profile Picture</CardTitle>
        <CardDescription className="text-muted-foreground text-lg">
          Upload a profile picture to personalize your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-6">
          <Avatar className="w-32 h-32">
            <AvatarImage src={avatarPreview} />
            <AvatarFallback className="bg-muted">
              <SquareUserRound className="w-12 h-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="w-full flex justify-center">
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
                className="w-auto px-8 h-14 text-lg font-semibold cursor-pointer border-2 hover:bg-gray-100 transition-colors duration-200"
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

  // ========== Step 3 ==========
  const renderStep3 = () => (
    <Card className="w-full max-w-xl border-0 shadow-xl">
      <CardHeader className="text-center pb-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <UsersRound className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="text-3xl font-semibold text-primary mb-3">Choose Your Role</CardTitle>
        <CardDescription className="text-muted-foreground text-lg">
          Select your role in the organization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 px-8 pb-6">
        <div className="space-y-6">
          <div className="relative">
            <div className="relative bg-muted/50 p-1 rounded-xl h-20 border border-border/50">
              <div
                className={`absolute top-1 bottom-1 w-1/2 bg-background rounded-lg shadow-sm border border-border/30 transition-all duration-300 ease-out ${
                  userRole === "administrator" ? "left-1" : "left-1/2"
                }`}
              />
              <div className="relative grid grid-cols-2 h-full">
                <button
                  type="button"
                  onClick={() => setUserRole("administrator")}
                  className={cn(
                    "relative z-10 flex items-center justify-center h-full rounded-lg font-medium text-lg transition-all duration-300",
                    userRole === "administrator"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground/80"
                  )}
                >
                  I'm an Administrator
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole("employee")}
                  className={cn(
                    "relative z-10 flex items-center justify-center h-full rounded-lg font-medium text-lg transition-all duration-300",
                    userRole === "employee"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground/80"
                  )}
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

  return (
    <Dialog open={true}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-5xl border-0 bg-transparent shadow-none p-0"
      >
        <div className="bg-background rounded-lg shadow-xl p-6 sm:p-8 lg:p-10 min-h-[600px] flex items-center justify-center">
          <div className="w-full flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="space-y-4 mb-12">
                <div className="flex justify-between text-base text-muted-foreground">
                  <span>Step {currentStep} of 5</span>
                  <span>{Math.round((currentStep / 5) * 100)}%</span>
                </div>
                <Progress value={(currentStep / 5) * 100} className="h-3" />
              </div>
              <div className="flex justify-center mb-12">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
              </div>
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
                  disabled={!canProceed()}
                  className="w-28 px-8 py-5 text-base bg-primary hover:bg-primary/90"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
