import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Building2, UsersRound, Mail, CirclePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompanyCreation } from "./useCompanyCreation";
import type { UserData } from "./OnboardingModal";

interface OnboardingAdmProps {
  userData: UserData;
  onComplete: () => void;
  onBack: () => void;
}

type CompanyAction = "create" | "join" | null;

export default function OnboardingAdm({ userData, onComplete, onBack }: OnboardingAdmProps) {
  const [currentStep, setCurrentStep] = useState(4);
  const [companyAction, setCompanyAction] = useState<CompanyAction>(null);
  const [companyCode, setCompanyCode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [pendingApproval, setPendingApproval] = useState(false);
  const { isLoading, generatedCode, emailSent, generateCompanyCode } = useCompanyCreation(userData);


const handleNext = async () => {
  if (currentStep < 5) {
    if (companyAction === "join" && currentStep === 5 && companyCode.length === 6) {
      setPendingApproval(true);
    }
    setCurrentStep(currentStep + 1);
  } else {
    onComplete();  
  }
};

  const handleBack = () => {
    if (currentStep > 4) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 4:
        return companyAction !== null;
      case 5:
        if (companyAction === "create") {
          return generatedCode !== "" || companyName.trim().length > 0;
        }
        if (companyAction === "join") {
          return companyCode.length === 6;
        }
        return false;
      default:
        return false;
    }
  };

  const renderGenerateButton = () => {
    if (!isLoading && !generatedCode) {
      return (
        <Button
          onClick={() => generateCompanyCode(companyName)}
          size="lg"
          disabled={companyName.trim().length === 0}
          className="w-full h-16 text-lg font-semibold"
        >
          <CirclePlus className="mr-3 !h-6 !w-6" />
          Generate My Company Code
        </Button>
      );
    }

    if (isLoading) {
      return (
        <Button
          size="lg"
          disabled
          className="w-full h-16 text-lg font-semibold"
        >
          <CirclePlus className="mr-3 !h-6 !w-6 animate-spin" />
          Generating Company Code...
        </Button>
      );
    }

    return null;
  };


  const renderStep4 = () => (
    <Card className="w-full max-w-xl border-0 shadow-xl">
      <CardHeader className="text-center pb-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Building2 className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="text-3xl font-semibold text-primary mb-2">Company Setup</CardTitle>
        <CardDescription className="text-muted-foreground text-lg">
          Choose how you'd like to set up your workspace
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 px-8 pb-6">
        <div className="space-y-4">
          <Button
            variant={companyAction === "create" ? "default" : "outline"}
            size="lg"
            className={cn(
              "w-full h-16 text-lg font-medium justify-start pl-6 transition-all duration-200",
              companyAction === "create" && "bg-primary text-white hover:bg-primary/90 shadow-lg"
            )}
            onClick={() => setCompanyAction("create")}
          >
            <Building2 className="ml-6 mr-4 !h-6 !w-6" />
            Create New Company Group
          </Button>
          <Button
            variant={companyAction === "join" ? "default" : "outline"}
            size="lg"
            className={cn(
              "w-full h-16 text-lg font-medium justify-start pl-6 transition-all duration-200",
              companyAction === "join" && "bg-primary text-white hover:bg-primary/90 shadow-lg"
            )}
            onClick={() => setCompanyAction("join")}
          >
            <UsersRound className="ml-6 mr-4 !h-6 !w-6" />
            Join An Existing Company Group
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep5 = () => {
    if (companyAction === "create") {
      return (
        <Card className="w-full max-w-xl border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-semibold text-primary mb-2">Create Your Company</CardTitle>
            <CardDescription className="text-muted-foreground text-lg">
              Set up your company and generate a unique code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 px-8 pb-6">
            {!generatedCode ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-lg font-semibold text-primary">Company Name</label>
                  <Input
                    placeholder="Enter your company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="h-14 text-lg"
                  />
                </div>
                <div className="text-center space-y-4">
                  {renderGenerateButton()}
                  <p className="text-sm text-muted-foreground">
                    This will create a unique 6-digit code for your company
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-4 p-6 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Your Company Code Created Successfully!
                    </h3>
                                      {emailSent && (
                    <div className="flex items-center justify-center gap-2 mt-3 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                      <Mail className="h-5 w-5" />
                      <span className="text-sm font-medium">Company code sent to your email</span>
                    </div>
                  )}
                  </div>
                </div>
      
                <div className="space-y-4">
                  <label className="flex justify-center text-xl font-semibold text-primary">Company Code Generated</label>
                  <div className="flex justify-center">
                    <InputOTP 
                      maxLength={6} 
                      value={generatedCode}
                      onChange={() => {}}
                      disabled={true}
                      readOnly={true}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="w-14 h-14 text-xl bg-green-50 border-green-300 text-green-800 font-bold cursor-not-allowed" />
                        <InputOTPSlot index={1} className="w-14 h-14 text-xl bg-green-50 border-green-300 text-green-800 font-bold cursor-not-allowed" />
                        <InputOTPSlot index={2} className="w-14 h-14 text-xl bg-green-50 border-green-300 text-green-800 font-bold cursor-not-allowed" />
                        <InputOTPSlot index={3} className="w-14 h-14 text-xl bg-green-50 border-green-300 text-green-800 font-bold cursor-not-allowed" />
                        <InputOTPSlot index={4} className="w-14 h-14 text-xl bg-green-50 border-green-300 text-green-800 font-bold cursor-not-allowed" />
                        <InputOTPSlot index={5} className="w-14 h-14 text-xl bg-green-50 border-green-300 text-green-800 font-bold cursor-not-allowed" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    if (companyAction === "join") {
      return (
        <Card className="w-full max-w-xl border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <UsersRound className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-semibold text-primary mb-2">Join Company as Administrator</CardTitle>
            <CardDescription className="text-muted-foreground text-lg">
              Enter the company code to request administrator access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 px-8 pb-6">
            <div className="space-y-4">
              <label className="flex justify-center text-xl font-semibold text-primary">Company Code</label>
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
                Enter the company code and your request will be sent for approval
              </p>
              
              {pendingApproval && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                    <p className="text-yellow-800 font-medium">Application Submitted</p>
                  </div>
                  <p className="text-yellow-700 text-sm">
                    Your request to join as administrator is pending approval
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  return (
    <Dialog open={true} >
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
                {currentStep === 4 && renderStep4()}
                {currentStep === 5 && renderStep5()}
              </div>

              <div className="flex justify-between gap-6 max-w-2xl mx-auto">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={emailSent}
                  className="w-28 px-8 py-5 text-base"
                >
                  Back
                </Button>
                <Button
                  onClick={ handleNext}
                  disabled={!canProceed()}
                  className="w-28 px-8 py-5 text-base"
                >
                  {currentStep === 5 ? "Complete" : "Next"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
