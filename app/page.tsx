"use client"
import { Button } from "@/components/ui/button";
import 'react-phone-number-input/style.css'
import LoginCard from "@/components/logincard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PhoneInput from "react-phone-number-input/input";
import { useState, useEffect } from "react";
import { FloatingInput } from "@/components/floatinginput";


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

  const handleGetStarted = () => {
    setStep('sms');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setPhotoFile(f);
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
              <Button className="w-full" disabled={!smsCode} onClick={() => setStep('details')}>Verify</Button>
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
              <Button className="w-full" disabled={!name || !email}>Finish</Button>
            </CardFooter>
          </Card>
        )}
      </LoginCard>
    </div>
  );
}
