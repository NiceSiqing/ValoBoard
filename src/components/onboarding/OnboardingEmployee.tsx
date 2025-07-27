import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Progress } from "@/components/ui/progress";
import { Building2 } from "lucide-react";
import { supabase } from "@/supabase";
import type { UserData } from "./OnboardingModal";

interface OnboardingEmployeeProps {
  userData: UserData;
  onComplete: () => void;
  onBack: () => void;
}

export default function OnboardingEmployee({ userData, onComplete, onBack }: OnboardingEmployeeProps) {
  const [step, setStep] = useState<4 | 5>(4);
  const [companyCode, setCompanyCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);

  // 第四步：提交申请
  const handleSubmit = async () => {
    setSubmitting(true);
    // 提交到 applications 表，返回申请id
    const { data, error } = await supabase
      .from("applications") // 假设你的待审核表叫 applications
      .insert([{
        ...userData,
        company_code: companyCode,
        status: "pending",
      }])
      .select("id")
      .single();
    setSubmitting(false);

    if (error) {
      alert("申请提交失败：" + error.message);
      return;
    }
    setApplicationId(data.id);
    setStep(5);
  };

  // 轮询/查询审核状态
  const checkApproval = async () => {
    if (!applicationId) return;
    const { data, error } = await supabase
      .from("applications")
      .select("status")
      .eq("id", applicationId)
      .single();
    if (error) return;
    if (data.status === "approved") setApproved(true);
    if (data.status === "rejected") setRejected(true);
  };

  // 自动轮询
  useEffect(() => {
    if (step === 5 && applicationId && !approved && !rejected) {
      const timer = setInterval(checkApproval, 2500);
      return () => clearInterval(timer);
    }
  }, [step, applicationId, approved, rejected]);

  // 步骤4渲染
  const renderStep4 = () => (
    <Card className="w-full max-w-xl border-0 shadow-xl">
      <CardHeader className="text-center pb-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Building2 className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="text-3xl font-semibold text-primary mb-2">Join Your Company</CardTitle>
        <CardDescription className="text-muted-foreground text-lg">
          Enter your company code to join your team
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 px-8 pb-6">
        <div className="space-y-4">
          <label className="flex justify-center text-xl font-semibold text-primary">Company Code</label>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={companyCode}
              onChange={setCompanyCode}
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <InputOTPSlot key={i} index={i} className="w-14 h-14 text-xl" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Enter the 6-digit code provided by your administrator
          </p>
        </div>
      </CardContent>
      <div className="flex justify-end px-8 pb-6">
        <Button
          onClick={handleSubmit}
          disabled={companyCode.length !== 6 || submitting}
          className="w-36"
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </Card>
  );

  // 步骤5渲染
  const renderStep5 = () => (
    <Card className="w-full max-w-xl border-0 shadow-xl">
      <CardHeader className="text-center pb-6">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <CardTitle className="text-3xl font-semibold text-yellow-600 mb-3">
          {rejected ? "Application Rejected" : approved ? "Approved" : "Waiting for Approval"}
        </CardTitle>
        <CardDescription className="text-xl text-muted-foreground mb-6">
          {
            rejected
              ? "Your application was rejected by the administrator."
              : approved
                ? "Your application has been approved! Click Complete to start using the system."
                : "Your application is being reviewed by the administrator. Please wait..."
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center pb-8">
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`w-6 h-6 rounded-full ${approved ? 'bg-green-400' : rejected ? 'bg-red-400' : 'bg-yellow-400'} animate-ping`}></div>
              <p className={`font-semibold text-lg ${approved ? 'text-green-800' : rejected ? 'text-red-800' : 'text-yellow-800'}`}>
                {approved ? "Approved" : rejected ? "Rejected" : "Review in Progress"}
              </p>
            </div>
            {!approved && !rejected && (
              <p className="text-yellow-700 text-base">
                You will receive an email notification once approved.
              </p>
            )}
            {rejected && (
              <p className="text-red-700 text-base">
                If you think this is a mistake, please contact your administrator.
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <div className="flex justify-end px-8 pb-6 gap-4">
        <Button
          onClick={onComplete}
          disabled={!approved}
          className="w-36"
        >
          Complete
        </Button>
        {!approved && !rejected && (
          <Button
            variant="outline"
            onClick={checkApproval}
          >
            Refresh
          </Button>
        )}
      </div>
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
                  <span>Step {step - 3} of 2</span>
                  <span>{step === 4 ? "50%" : "100%"}</span>
                </div>
                <Progress value={step === 4 ? 50 : 100} className="h-3" />
              </div>
              <div className="flex justify-center mb-12">
                {step === 4 && renderStep4()}
                {step === 5 && renderStep5()}
              </div>
              <div className="flex justify-between gap-6 max-w-2xl mx-auto">
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="w-28 px-8 py-5 text-base"
                  disabled={step === 5 && submitting}
                >
                  Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
