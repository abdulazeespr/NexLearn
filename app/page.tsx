"use client"
import { Button } from "@/components/ui/button";
import 'react-phone-number-input/style.css'
import LoginCard from "@/components/logincard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PhoneInput from "react-phone-number-input/input";
import { useState, useEffect } from "react";
import { FloatingInput } from "@/components/floatinginput";
import { sendOtp, verifyOtp, createProfile } from "@/lib/api";
import { useAppDispatch } from "@/store/hooks";
import { setTokens } from "@/store/authSlice";


export default function Home() {
  const [step, setStep] = useState<'phone' | 'sms' | 'details'>('phone');
  const [phone, setPhone] = useState<string | undefined>();
  const [smsCode, setSmsCode] = useState('');

  // details state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [qualification, setQualification] = useState('');
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
        setStep('sms');
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert("Failed to send OTP. Please try again.");
    }
  };

  const dispatch = useAppDispatch();

  const handleVerify = async () => {
    if (!phone || !smsCode) return;
    try {
      const res = await verifyOtp(phone, smsCode);
      if (res.success) {
        if (res.login) {
          // store tokens in redux
          dispatch(setTokens({
            access_token: res.access_token ?? "",
            refresh_token: res.refresh_token ?? "",
            token_type: res.token_type ?? "",
          }));
          // user is logged in — proceed or redirect as needed
          setStep('details');
        } else {
          // not an existing user, proceed to details flow
          setStep('details');
        }
      } else {
        alert(res.message || "OTP verification failed");
      }
    } catch (err) {
      alert("Failed to verify OTP. Please try again.");
    }
  };

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
          dispatch(setTokens({
            access_token: res.access_token ?? "",
            refresh_token: res.refresh_token ?? "",
            token_type: "Bearer",
          }));
        }
        alert(res.message || "Profile saved successfully.");
        // further navigation or state updates can be done here
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
      <LoginCard className="max-w-xl w-full items-center p-6 bg-primary rounded-lg shadow-md">
        {step === 'phone' ? (
          <Card>
            <CardHeader>
              <CardTitle>Enter your phone number</CardTitle>
              <CardDescription>We use your mobile number to identify your account</CardDescription>
            </CardHeader>
            <CardContent>
              <PhoneInput
                country={"IN"}
                placeholder="Enter phone number"
                value={phone}
                onChange={setPhone}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
              />
              <CardDescription className="mt-4">We will send you a verification code to this number.</CardDescription>
            </CardContent>
            <CardFooter className="mt-10">
              <Button className="w-full" onClick={handleGetStarted} disabled={!phone}>Get Started</Button>
            </CardFooter>
          </Card>
        ) : step === 'sms' ? (
          <Card>
            <CardHeader>
              <CardTitle>Enter SMS Code</CardTitle>
              <CardDescription>Enter the verification code sent to your mobile number</CardDescription>
            </CardHeader>
            <CardContent>
              <FloatingInput
                id="smsCode"
                label="SMS Code"
                type="text"
                value={smsCode}
                onChange={e => setSmsCode((e.target as HTMLInputElement).value)}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
              />
            </CardContent>
            <CardFooter className="mt-10">
              <Button className="w-full" disabled={!smsCode} onClick={handleVerify}>Verify</Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Add your details</CardTitle>
              <CardDescription>Provide a photo and basic information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                  {photoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm text-gray-500">Photo</span>
                  )}
                </div>
                <div>
                  <input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  <label htmlFor="photo" className="inline-block cursor-pointer rounded-md bg-primary px-3 py-2 text-white">Upload Photo</label>
                </div>
              </div>

              <div className="space-y-4">
                <FloatingInput
                  id="fullName"
                  label="Full Name"
                  value={name}
                  onChange={e => setName((e.target as HTMLInputElement).value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 md:text-sm"
                />

                <FloatingInput
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail((e.target as HTMLInputElement).value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 md:text-sm"
                />

                <FloatingInput
                  id="qualification"
                  label="Qualification"
                  value={qualification}
                  onChange={e => setQualification((e.target as HTMLInputElement).value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 md:text-sm"
                />
              </div>
            </CardContent>
            <CardFooter className="mt-10">
              <Button className="w-full" disabled={!name || !email || !qualification || !photoFile} onClick={handleFinish}>Finish</Button>
            </CardFooter>
          </Card>
        )}
      </LoginCard>
    </div>
  );
}
