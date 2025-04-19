"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useClerk, useSession, useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  User,
  Settings,
  Bell,
  Shield,
  CreditCard,
  History,
  LogOut,
  Edit,
  Check,
  X,
  ChevronRight,
  Upload,
  Wallet,
  Landmark,
  Mail,
  Lock,
  TrendingUp,
  Plus,
  Laptop2,
  MonitorSmartphone,
  AtSign,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { set } from "mongoose";

// Mock user data - in a real app, this would come from your API
const mockUserData = {
  id: "user_123456",
  firstName: "Alex",
  lastName: "Morgan",
  email: "alex.morgan@example.com",
  username: "alexmorgan",
  phone: "+1 (555) 123-4567",
  profileImage: "/placeholder.svg?height=128&width=128",
  joinDate: "January 15, 2023",
  accountType: "Premium",
  twoFactorEnabled: true,
  notificationsEnabled: true,
  emailNotifications: true,
  pushNotifications: true,
  marketingEmails: false,
  currency: "INR",
  language: "English",
  theme: "light",
  timezone: "America/New_York",
  securityScore: 85,
  lastLogin: "Today at 9:30 AM",
  lastLoginLocation: "New York, USA",
  lastLoginDevice: "Chrome on macOS",
  connectedAccounts: [
    {
      id: 1,
      name: "Bank of America",
      type: "bank",
      connected: true,
      lastSync: "2 hours ago",
    },
    {
      id: 2,
      name: "Robinhood",
      type: "investment",
      connected: true,
      lastSync: "1 day ago",
    },
    {
      id: 3,
      name: "PayPal",
      type: "payment",
      connected: false,
      lastSync: "Never",
    },
  ],
  recentActivity: [
    {
      id: 1,
      type: "login",
      description: "Logged in from Chrome on macOS",
      date: "Today at 9:30 AM",
    },
    {
      id: 2,
      type: "settings",
      description: "Updated notification preferences",
      date: "Yesterday at 2:15 PM",
    },
    {
      id: 3,
      type: "investment",
      description: "Added new stock investment",
      date: "May 10, 2023 at 11:20 AM",
    },
    {
      id: 4,
      type: "expense",
      description: "Added new expense category",
      date: "May 8, 2023 at 3:45 PM",
    },
    {
      id: 5,
      type: "login",
      description: "Logged in from new device",
      date: "May 5, 2023 at 8:10 AM",
    },
  ],
};

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const [userData, setUserData] = useState(mockUserData);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);
  const [tabValue, setTabValue] = useState("personal");
  const [showAll1, setShowAll1] = useState(false);
  const [showAll2, setShowAll2] = useState(false);

  useEffect(() => {
    if (user) {
      user.getSessions().then((s) => {
        setSessions(s);
      });
    }
  }, [user]);

  const { session } = useSession();
  const sessionId = session?.id;
  const { toast } = useToast();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      if (isLoaded && isSignedIn && user) {
        // In a real app, you would fetch user data from your API here
        // For now, we'll use the mock data but update the name and email
        setUserData({
          ...mockUserData,
          joinDate:
            user.createdAt?.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }) || mockUserData.joinDate,
          username: user.username || mockUserData.username,
          firstName: user.firstName || mockUserData.firstName,
          lastName: user.lastName || mockUserData.lastName,
          email: user.emailAddresses[0]?.emailAddress || mockUserData.email,
          profileImage: user.imageUrl || mockUserData.profileImage,
        });
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn, user]);

  const handleToggleNotification = (type: string) => {
    setUserData((prev) => {
      if (type === "all") {
        const newValue = !prev.notificationsEnabled;
        return {
          ...prev,
          notificationsEnabled: newValue,
          emailNotifications: newValue ? prev.emailNotifications : false,
          pushNotifications: newValue ? prev.pushNotifications : false,
        };
      } else if (type === "email") {
        return {
          ...prev,
          emailNotifications: !prev.emailNotifications,
          notificationsEnabled:
            !prev.emailNotifications || prev.pushNotifications,
        };
      } else if (type === "push") {
        return {
          ...prev,
          pushNotifications: !prev.pushNotifications,
          notificationsEnabled:
            prev.emailNotifications || !prev.pushNotifications,
        };
      } else if (type === "marketing") {
        return {
          ...prev,
          marketingEmails: !prev.marketingEmails,
        };
      }
      return prev;
    });
  };

  const handleToggleTwoFactor = () => {
    setUserData((prev) => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled,
    }));
  };

  const handleThemeChange = (value: string) => {
    setUserData((prev) => ({
      ...prev,
      theme: value,
    }));
  };

  const handleLanguageChange = (value: string) => {
    setUserData((prev) => ({
      ...prev,
      language: value,
    }));
  };

  const handleCurrencyChange = (value: string) => {
    setUserData((prev) => ({
      ...prev,
      currency: value,
    }));
  };

  const handleToggleConnectedAccount = (id: number) => {
    setUserData((prev) => ({
      ...prev,
      connectedAccounts: prev.connectedAccounts.map((account) =>
        account.id === id
          ? { ...account, connected: !account.connected }
          : account
      ),
    }));
  };

  if (loading) {
    return (
      <div className="container pt-32 pb-10">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-[300px] rounded-xl" />
            <Skeleton className="h-[300px] rounded-xl md:col-span-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-[400px] rounded-xl" />
            <Skeleton className="h-[400px] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container pt-32 pb-10"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <Button variant="outline" size="sm" asChild>
            <Link href="/finance" className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to Financial Dashboard
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Profile Overview */}
      <motion.div variants={itemVariants} className="mb-8">
        <Card className="overflow-hidden border-none shadow-md">
          <CardContent className="relative z-10 p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                  <AvatarImage
                    src={userData.profileImage || "/placeholder.svg"}
                    alt={`${userData.firstName} ${userData.lastName}`}
                  />
                  <AvatarFallback className="text-2xl">
                    {userData.firstName.charAt(0)}
                    {userData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full bg-white bg-opacity-80"
                    onClick={() => {
                      openUserProfile();
                    }}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {userData.firstName} {userData.lastName}
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1 text-gray-500">
                      <div className="flex items-center">
                        <AtSign className="h-4 w-4 mt-[2px] mr-1" />
                        {userData.username}
                      </div>
                      <div className="hidden sm:block text-gray-300">•</div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mt-[2px] mr-1" />
                        {userData.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none"
                    >
                      {userData.accountType}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none"
                    >
                      Member since {userData.joinDate}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => openUserProfile()}
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => {
                      window.scrollBy({ top: 320, behavior: "smooth" });
                    }}
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Account Settings
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Sign out of your account?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          You'll need to sign in again to access your dashboard
                          and financial information.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            signOut({ redirectUrl: "/" });
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Sign Out
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={tabValue} onValueChange={setTabValue}>
          <TabsList className="mb-3 bg-slate-200">
            <TabsTrigger value="personal" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Personal Info</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-1"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="connected" className="flex items-center gap-1">
              <Landmark className="h-4 w-4" />
              <span className="hidden sm:inline">Connected Accounts</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-1">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Information */}
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-purple-600" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          First Name
                        </p>
                        <p className="mt-1">{userData.firstName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Last Name
                        </p>
                        <p className="mt-1">{userData.lastName}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Username
                      </p>
                      <p className="mt-1">{userData.username}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Email Address
                      </p>
                      <p className="mt-1">{userData.email}</p>
                    </div>

                    <div className="pt-2">
                      <Button
                        variant="outline"
                        onClick={() => openUserProfile()}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Information
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-600" />
                    Preferences
                  </CardTitle>
                  <CardDescription>
                    Customize your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label>Currency</Label>
                      <Select
                        value={userData.currency}
                        onValueChange={handleCurrencyChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">INR (₹)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          {/* <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="JPY">JPY (¥)</SelectItem> */}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>Theme</Label>
                      <Select
                        value={userData.theme}
                        onValueChange={handleThemeChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-2">
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 w-full">
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div className="flex flex-col gap-4">
                {/* Password */}
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-purple-600" />
                      Password
                    </CardTitle>
                    <CardDescription>Change your password</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="flex items-center font-medium gap-7">
                        <span className="text-sm font-medium text-gray-500">
                          Current Password
                        </span>
                        <span className="text-2xl">••••••••••</span>
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => {
                          toast({
                            description:
                              'Please navigate to the "Security" tab to change your password.',
                            className:
                              "bg-neutral-900 border-neutral-900 text-white",
                          });
                          setTimeout(() => {
                            openUserProfile();
                          }, 2000);
                        }}
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Update Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5 text-purple-600" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>
                      View your recent account activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        {sessions
                          .filter((session) => session.id === sessionId)
                          .map((session) => (
                            <div
                              key={session.id}
                              className="flex justify-between items-start"
                            >
                              <div>
                                <p className="font-semibold text-sm">
                                  {session.latestActivity.deviceType} on{" "}
                                  {session.latestActivity.browserName}
                                </p>
                                <p className="text-xs font-medium text-gray-500">
                                  {session.latestActivity.city},{" "}
                                  {session.latestActivity.country} •{" "}
                                  {session.lastActiveAt.toLocaleString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      hour12: true,
                                    }
                                  )}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-700 border-none"
                              >
                                Current
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>

                    <Button
                      variant="link"
                      size="sm"
                      className="mt-4 p-0 h-auto text-purple-600"
                      onClick={() => {
                        setTabValue("activity");
                        setTimeout(() => {
                          window.open("#active-devices", "_self");
                        }, 100);
                      }}
                    >
                      View all login activity
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <div className="h-full">
                {/* Security Settings */}
                <Card className="border-none shadow-md h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-purple-600" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">
                            Two-Factor Authentication
                          </Label>
                          <p className="text-sm text-gray-500">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch
                          checked={userData.twoFactorEnabled}
                          onCheckedChange={handleToggleTwoFactor}
                        />
                      </div>

                      <Separator />

                      <div>
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">
                            Security Score
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Your score</span>
                              <span className="font-medium">
                                {userData.securityScore}%
                              </span>
                            </div>
                            <Progress
                              value={userData.securityScore}
                              className="h-2"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="h-3 w-3 text-green-600" />
                            </div>
                            <span>Strong password</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            {userData.twoFactorEnabled ? (
                              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                <Check className="h-3 w-3 text-green-600" />
                              </div>
                            ) : (
                              <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                                <X className="h-3 w-3 text-red-600" />
                              </div>
                            )}
                            <span>Two-factor authentication</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <div className="h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center">
                              <Check className="h-3 w-3 text-yellow-600" />
                            </div>
                            <span>Recent password update</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-purple-600" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">All Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Enable or disable all notifications
                      </p>
                    </div>
                    <Switch
                      checked={userData.notificationsEnabled}
                      onCheckedChange={() => handleToggleNotification("all")}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">
                      Notification Channels
                    </h4>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-500">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={userData.emailNotifications}
                        onCheckedChange={() =>
                          handleToggleNotification("email")
                        }
                        disabled={!userData.notificationsEnabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-gray-500">
                          Receive notifications on your device
                        </p>
                      </div>
                      <Switch
                        checked={userData.pushNotifications}
                        onCheckedChange={() => handleToggleNotification("push")}
                        disabled={!userData.notificationsEnabled}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Notification Types</h4>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Account Activity</Label>
                        <Switch
                          defaultChecked
                          disabled={!userData.notificationsEnabled}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>New Investments</Label>
                        <Switch
                          defaultChecked
                          disabled={!userData.notificationsEnabled}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Budget Alerts</Label>
                        <Switch
                          defaultChecked
                          disabled={!userData.notificationsEnabled}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Security Alerts</Label>
                        <Switch
                          defaultChecked
                          disabled={!userData.notificationsEnabled}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Market Updates</Label>
                        <Switch disabled={!userData.notificationsEnabled} />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Marketing Emails</Label>
                      <p className="text-sm text-gray-500">
                        Receive promotional emails and offers
                      </p>
                    </div>
                    <Switch
                      checked={userData.marketingEmails}
                      onCheckedChange={() =>
                        handleToggleNotification("marketing")
                      }
                    />
                  </div>

                  <div className="pt-2">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                      Save Notification Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Connected Accounts Tab */}
          <TabsContent value="connected">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-purple-600" />
                  Connected Accounts
                </CardTitle>
                <CardDescription>
                  Manage your connected financial accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {userData.connectedAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            account.type === "bank"
                              ? "bg-blue-100"
                              : account.type === "investment"
                              ? "bg-green-100"
                              : "bg-purple-100"
                          }`}
                        >
                          {account.type === "bank" ? (
                            <Landmark className={`h-5 w-5 text-blue-600`} />
                          ) : account.type === "investment" ? (
                            <TrendingUp className={`h-5 w-5 text-green-600`} />
                          ) : (
                            <CreditCard className={`h-5 w-5 text-purple-600`} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{account.name}</p>
                          <p className="text-sm text-gray-500 capitalize">
                            {account.type} Account
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {account.connected && (
                          <p className="text-xs text-gray-500">
                            Last synced: {account.lastSync}
                          </p>
                        )}
                        <Switch
                          checked={account.connected}
                          onCheckedChange={() =>
                            handleToggleConnectedAccount(account.id)
                          }
                        />
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div>
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Connect New Account
                    </Button>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      Security Information
                    </h4>
                    <p className="text-sm text-blue-600">
                      We use bank-level security to protect your credentials.
                      Your login information is never stored on our servers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-purple-600" />
                  Account Activity
                </CardTitle>
                <CardDescription>
                  Recent activity on your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(showAll1
                    ? userData.recentActivity
                    : userData.recentActivity.slice(0, 4)
                  ).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center ${
                          activity.type === "login"
                            ? "bg-blue-100"
                            : activity.type === "investment"
                            ? "bg-green-100"
                            : activity.type === "expense"
                            ? "bg-red-100"
                            : "bg-purple-100"
                        }`}
                      >
                        {activity.type === "login" ? (
                          <User className={`h-4 w-4 text-blue-600`} />
                        ) : activity.type === "investment" ? (
                          <TrendingUp className={`h-4 w-4 text-green-600`} />
                        ) : activity.type === "expense" ? (
                          <Wallet className={`h-4 w-4 text-red-600`} />
                        ) : (
                          <Settings className={`h-4 w-4 text-purple-600`} />
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))}

                  {userData.recentActivity.length > 4 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowAll1(!showAll1)}
                    >
                      {showAll1 ? "View Less" : "View Full Activity Log"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md mt-5" id="active-devices">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MonitorSmartphone className="h-5 w-5 text-blue-600" />
                  Active Devices
                </CardTitle>
                <CardDescription>
                  Devices currently signed in to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(showAll2 ? sessions : sessions.slice(0, 1)).map(
                    (session) => (
                      <div key={session.id} className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center ${"bg-purple-100"}`}
                        >
                          <Laptop2 className={`h-4 w-4 text-blue-600`} />
                        </div>
                        <div className="flex-grow">
                          <span className="flex items-center gap-2">
                            <p className="font-medium">
                              {session.latestActivity.deviceType}
                            </p>
                            {session.id === sessionId ? (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-700 border-none"
                              >
                                This Device
                              </Badge>
                            ) : null}
                          </span>

                          <p className="text-sm font-semibold text-gray-500">
                            {session.latestActivity.browserName} •{" "}
                            {session.latestActivity.city},{" "}
                            {session.latestActivity.country}
                          </p>
                          <p className="text-sm text-gray-500">
                            {session.latestActivity.ipAddress}
                          </p>
                          <p className="text-sm text-gray-500">
                            {session.lastActiveAt.toLocaleString("en-UK", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        </div>
                      </div>
                    )
                  )}

                  <div className="pt-2">
                    {sessions.length > 1 && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowAll2(!showAll2)}
                      >
                        {showAll2 ? "View Less" : "View Full Activity Log"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
