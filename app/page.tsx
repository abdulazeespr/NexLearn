"use client"
import { Button } from "@/components/ui/button";
import 'react-phone-number-input/style.css'
import Image from "next/image";
import LoginCard from "@/components/logincard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PhoneInput from "react-phone-number-input/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { FloatingInput } from "@/components/floatinginput";


export default function Home() {
  const [step, setStep] = useState<'phone' | 'sms'>('phone');
  const [phone, setPhone] = useState<string | undefined>();
  const [smsCode, setSmsCode] = useState('');

  const handleGetStarted = () => {
    setStep('sms');
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
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Enter SMS Code</CardTitle>
              <CardDescription>Enter the verification code sent to your mobile number</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="smsCode">SMS Code</Label>
              <Input
                id="smsCode"
                type="text"
                value={smsCode}
                onChange={e => setSmsCode(e.target.value)}
                placeholder="Enter SMS code"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
              />
            </CardContent>
            <CardFooter className="mt-10">
              <Button className="w-full" disabled={!smsCode}>Verify</Button>
            </CardFooter>
          </Card>
        )}
      </LoginCard>
    </div>
  );
}
