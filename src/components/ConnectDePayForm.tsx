"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Shield,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Zap,
  Star,
  TrendingDown,
  BarChart3,
  Target,
  Gift,
  AlertCircle,
  ChromeIcon as Google,
  Apple,
} from "lucide-react";
import DePayLogo from "@/assets/depay-logo";

interface DePayConnectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletName: string;
  onConnect: () => void;
}

const permissions = [
  {
    id: "transactions",
    title: "Transaction History",
    description: "View your spending patterns and categorize transactions",
    icon: BarChart3,
    required: true,
  },
  {
    id: "balance",
    title: "Account Balance",
    description: "Monitor your balance to provide spending insights",
    icon: Eye,
    required: true,
  },
];

const features = [
  { icon: TrendingDown, text: "Reduce spending by up to 30%" },
  { icon: Target, text: "Smart budget tracking" },
  { icon: Gift, text: "Exclusive cashback rewards" },
  { icon: Shield, text: "Bank-level security" },
];

export function DePayConnectForm({
  open,
  onOpenChange,
  walletName,
  onConnect,
}: DePayConnectFormProps) {
  const [step, setStep] = useState(1); // 1: Welcome, 2: Auth, 3: Permissions, 4: Connecting
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    agreeToTerms: false,
    agreeToPrivacy: false,
    selectedPermissions: ["transactions", "balance"] as string[],
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePermissionToggle = (permissionId: string) => {
    const permission = permissions.find((p) => p.id === permissionId);
    if (permission?.required) return; // Can't toggle required permissions

    setFormData((prev) => ({
      ...prev,
      selectedPermissions: prev.selectedPermissions.includes(permissionId)
        ? prev.selectedPermissions.filter((id) => id !== permissionId)
        : [...prev.selectedPermissions, permissionId],
    }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setStep(4);

    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsConnecting(false);
    onConnect();
    onOpenChange(false);

    // Reset form
    setStep(1);
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      agreeToTerms: false,
      agreeToPrivacy: false,
      selectedPermissions: ["transactions", "balance"],
    });
  };

  const handleSocialAuth = (provider: string) => {
    // Simulate social auth
    handleNext();
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return true;
      case 2:
        if (authMode === "signup") {
          return (
            formData.email &&
            formData.password &&
            formData.firstName &&
            formData.lastName &&
            formData.agreeToTerms &&
            formData.agreeToPrivacy
          );
        }
        return formData.email && formData.password;
      case 3:
        return formData.selectedPermissions.length >= 2; // At least required permissions
      default:
        return true;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <DePayLogo className="h-6 w-6 text-white" />
            </div>
            <span>Connect to DePay</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {step === 1 && "Set up your DePay account"}
            {step === 2 && "Create your account or sign in"}
            {step === 3 && "Choose what data to share"}
            {step === 4 && "Connecting to your wallet..."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    i <= step
                      ? "bg-white text-black"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {i < step ? <CheckCircle className="h-4 w-4" /> : i}
                </div>
                {i < 4 && (
                  <div
                    className={`w-6 h-0.5 mx-2 transition-all duration-300 ${
                      i < step ? "bg-white" : "bg-gray-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <DePayLogo className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-medium">Welcome to DePay</h3>
                <p className="text-gray-400">
                  Connect your{" "}
                  <span className="text-white font-medium">{walletName}</span>{" "}
                  to transfer, track, and manage your finances like never
                  before.
                </p>
              </div>

              <Card className="bg-gray-800/30 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-white">
                        Your data is secure
                      </p>
                      <p className="text-xs text-gray-400">
                        Bank-level encryption • Never stored on our servers
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Authentication */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-center space-x-1 mb-6">
                <Button
                  variant={authMode === "login" ? "default" : "ghost"}
                  onClick={() => setAuthMode("login")}
                  className={
                    authMode === "login"
                      ? "bg-white text-black hover:bg-gray-100"
                      : "text-gray-400 hover:text-black"
                  }
                >
                  Sign In
                </Button>
                <Button
                  variant={authMode === "signup" ? "default" : "ghost"}
                  onClick={() => setAuthMode("signup")}
                  className={
                    authMode === "signup"
                      ? "bg-white text-black hover:bg-gray-100"
                      : "text-gray-400 hover:text-black"
                  }
                >
                  Sign Up
                </Button>
              </div>

              {/* Email/Password Form */}
              <div className="space-y-4">
                {authMode === "signup" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-300">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-300">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {authMode === "signup" && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) =>
                          handleInputChange("agreeToTerms", checked as boolean)
                        }
                        className="border-gray-600 data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-300">
                        I agree to the{" "}
                        <span className="text-blue-400 hover:underline cursor-pointer">
                          Terms of Service
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="privacy"
                        checked={formData.agreeToPrivacy}
                        onCheckedChange={(checked) =>
                          handleInputChange(
                            "agreeToPrivacy",
                            checked as boolean
                          )
                        }
                        className="border-gray-600 data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <Label
                        htmlFor="privacy"
                        className="text-sm text-gray-300"
                      >
                        I agree to the{" "}
                        <span className="text-blue-400 hover:underline cursor-pointer">
                          Privacy Policy
                        </span>
                      </Label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Permissions */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium">Data Permissions</h3>
                <p className="text-gray-400 text-sm">
                  Choose what information DePay can access to provide
                  personalized insights
                </p>
              </div>

              <div className="space-y-4">
                {permissions.map((permission) => {
                  const Icon = permission.icon;
                  const isSelected = formData.selectedPermissions.includes(
                    permission.id
                  );
                  const isRequired = permission.required;

                  return (
                    <Card
                      key={permission.id}
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                        isSelected
                          ? "bg-gray-800 border-white"
                          : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                      } ${isRequired ? "opacity-100" : ""}`}
                      onClick={() =>
                        !isRequired && handlePermissionToggle(permission.id)
                      }
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isSelected
                                  ? "bg-white text-black"
                                  : "bg-gray-700 text-gray-400"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <p className="font-medium text-white">
                                  {permission.title}
                                </p>
                                {isRequired && (
                                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs">
                                    Required
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-400 mt-1">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? "border-white bg-white"
                                : "border-gray-600"
                            }`}
                          >
                            {isSelected && (
                              <CheckCircle className="h-3 w-3 text-black" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card className="bg-blue-900/20 border-blue-800/50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-400">
                        Privacy Notice
                      </p>
                      <p className="text-xs text-gray-300 mt-1">
                        Your financial data is encrypted and never shared with
                        third parties. You can revoke these permissions at any
                        time.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Connecting */}
          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    Connecting your wallet...
                  </h3>
                  <p className="text-gray-400">
                    Setting up your DePay account and syncing your {walletName}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm">Account created successfully</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm">Permissions configured</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                  <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Syncing wallet data...</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {step < 4 && (
            <div className="flex space-x-3">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 border-gray-700 text-gray-700 hover:bg-gray-800 hover:text-gray-200"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              <Button
                onClick={step === 3 ? handleConnect : handleNext}
                disabled={!isStepValid()}
                className="flex-1 bg-white text-black hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                {step === 3 ? (
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <span>Connect Wallet</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
