"use client";
import { Button } from "@/components/ui/button";
import LoginCard from "@/components/logincard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Using FloatingInput for phone entry instead of react-phone-number-input
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FloatingInput } from "@/components/floatinginput";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { sendOtp, verifyOtp, createProfile } from "@/lib/api";
import { useAppDispatch } from "@/store/hooks";
import { setTokens } from "@/store/authSlice";

export default function Home() {
  const [step, setStep] = useState<"phone" | "sms" | "details">("details");
  const [phone, setPhone] = useState<string | undefined>("");
  const [smsCode, setSmsCode] = useState("");

  // details state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [qualification, setQualification] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const handleGetStarted = async () => {
    if (!phone) return;
    try {
      const res = await sendOtp(phone);
      if (res.success) {
        setStep("sms");
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert("Failed to send OTP. Please try again.");
    }
  };

  const dispatch = useAppDispatch();
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();

  const handleVerify = async () => {
    if (!phone || !smsCode) return;
    try {
      const res = await verifyOtp(phone, smsCode);
      if (res.success) {
        if (res.login) {
          // store tokens in redux
          dispatch(
            setTokens({
              access_token: res.access_token ?? "",
              refresh_token: res.refresh_token ?? "",
              token_type: res.token_type ?? "",
            })
          );
          // existing user: navigate to quiz page
          router.push("/quiz");
        } else {
          // not an existing user, proceed to details flow
          setStep("details");
        }
      } else {
        alert(res.message || "OTP verification failed");
      }
    } catch (err) {
      alert("Failed to verify OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    if (!phone) return;
    try {
      const res = await sendOtp(phone);
      if (res.success) {
        alert(res.message || "OTP resent");
        setResendCooldown(30); // 30s cooldown
      } else {
        alert(res.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to resend OTP. Please try again.");
    }
  };

  // cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => {
      setResendCooldown((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setPhotoFile(f);
  };

  const handleFinish = async () => {
    if (!phone || !name || !email || !qualification || !photoFile) {
      alert("Please fill all required fields and upload a photo.");
      return;
    }

    try {
      const res = await createProfile({
        mobile: phone,
        name,
        email,
        qualification,
        profile_image: photoFile,
      });

      if (res.success) {
        if (res.access_token || res.refresh_token) {
          dispatch(
            setTokens({
              access_token: res.access_token ?? "",
              refresh_token: res.refresh_token ?? "",
              token_type: "Bearer",
            })
          );
        }
        alert(res.message || "Profile saved successfully.");
        // navigate to quiz page after successful profile creation
        router.push("/quiz");
      } else {
        alert(res.message || "Failed to save profile.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create profile. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginCard className="max-w-[866] w-full h-full items-center  bg-primary rounded-lg shadow-md">
        {step === "phone" ? (
          <Card className="rounded-[6px]">
            <CardHeader className="pb-5">
              <CardTitle className="text-2xl font-semibold  text-primary">
                Enter your phone number
              </CardTitle>
              <CardDescription className="text-base font-normal text-primary">
                We use your mobile number to identify your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full mb-4">
                <PhoneInput
                  id="phone"
                  defaultCountry="IN"
                  value={phone}
                  onChange={setPhone}
                  placeholder="Enter phone number"
                  className="w-full h-10 px-2 rounded-md border border-input bg-transparent shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
                />
                <label
                  htmlFor="phone"
                  className="absolute left-2 top-[-10px] bg-white px-1 text-xs text-gray-500 pointer-events-none"
                >
                  Phone Number
                </label>
              </div>
              <CardDescription className="mt-4 text-xs font-normal text-primary">
                By tapping Get started, you agree to the{" "}
                <span className="font-medium">Terms & Conditions </span>
              </CardDescription>
            </CardContent>
            <CardFooter className="mt-50">
              <Button
                className="w-full text-md"
                onClick={handleGetStarted}
                disabled={!phone}
              >
                Get Started
              </Button>
            </CardFooter>
          </Card>
        ) : step === "sms" ? (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold  text-primary">
                Enter the code we texted you
              </CardTitle>
              <CardDescription className="text-base font-normal text-primary">
                We’ve sent an SMS to {phone}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FloatingInput
                id="smsCode"
                label="SMS Code"
                type="text"
                value={smsCode}
                onChange={(e) =>
                  setSmsCode((e.target as HTMLInputElement).value)
                }
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
              />
              <CardDescription className="mt-4 text-xs font-normal text-primary">
                Your 6 digit code is on its way. This can sometimes take a few
                moments to arrive.
              </CardDescription>
              <Button
                className="flex-1 text-primary bg-primary-foreground border-b-2 border-primary rounded-[0px] pb-0"
                disabled={!phone || resendCooldown > 0}
                onClick={handleResend}
              >
                {resendCooldown > 0
                  ? `Resend (${resendCooldown}s)`
                  : "Resend Code"}
              </Button>
            </CardContent>
            <CardFooter className="mt-10">
              <div className="w-full flex ">
                <Button
                  className="flex-1"
                  disabled={!smsCode}
                  onClick={handleVerify}
                >
                  Get Started
                </Button>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader className="pb-5">
              <CardTitle>Add your details</CardTitle>
              <CardDescription>
                Provide a photo and basic information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                  {photoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photoPreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">Photo</span>
                  )}
                </div>
                <div>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo"
                    className="inline-block cursor-pointer rounded-md bg-primary px-3 py-2 text-white"
                  >
                    Upload Photo
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <FloatingInput
                  id="fullName"
                  label="Full Name"
                  value={name}
                  onChange={(e) =>
                    setName((e.target as HTMLInputElement).value)
                  }
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 md:text-sm"
                />

                <FloatingInput
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail((e.target as HTMLInputElement).value)
                  }
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 md:text-sm"
                />

                <FloatingInput
                  id="qualification"
                  label="Qualification"
                  value={qualification}
                  onChange={(e) =>
                    setQualification((e.target as HTMLInputElement).value)
                  }
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 md:text-sm"
                />
              </div>
            </CardContent>
            <CardFooter className="mt-10">
              <Button
                className="w-full"
                disabled={!name || !email || !qualification || !photoFile}
                onClick={handleFinish}
              >
                Finish
              </Button>
            </CardFooter>
          </Card>
        )}
      </LoginCard>
    </div>
  );
}
