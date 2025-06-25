"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Copy,
  ExternalLink,
  Shield,
  Wallet,
  Zap,
  Globe,
  Lock,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Key,
  LinkIcon,
  Plus,
  CreditCard,
  Send,
  HandCoins,
  Banknote,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DePayLogo from "@/assets/depay-logo";
import { DePayConnectForm } from "@/components/ConnectDePayForm";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";

type UserData = {
  accountNumber: string;
  linkDepay: boolean;
};

const iconMap = {
  WALLET: Wallet,
  ADD_MONEY: CreditCard,
  SEND: Send,
  REQUEST: HandCoins,
  HISTORY: History,
  BANK_LINK: Banknote,
};

type IconSymbol = keyof typeof iconMap;

type WalletDataItem = {
  name: string;
  symbol: IconSymbol;
  enabled: boolean;
};

export default function DepayIntegration() {
  const [apiKey, setApiKey] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [enableP2P, setEnableP2P] = useState(true);
  const [enableMerchant, setEnableMerchant] = useState(true);
  const [autoConvert, setAutoConvert] = useState(false);

  const [isConnected, setIsConnected] = useState(false);
  const [isConnectFormOpen, setIsConnectFormOpen] = useState(false);
  const [userData, setUserData] = useState<UserData>();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoaded && isSignedIn && user) {
        const res = fetch(
          `/api/connect/depay?email=${user?.emailAddresses[0]?.emailAddress}`
        );
        res
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Failed to fetch connected accounts");
            }
          })
          .then((data) => {
            if (data.status === "success" && data.user.linkDepay === true) {
              setUserData({
                accountNumber: data.user.accountNumber,
                linkDepay: data.user.linkDepay,
              });
              setWalletAddress(data.user.accountNumber);
              toast({
                title: "Connected",
                description: "DePay account connected successfully.",
                variant: "default",
              });
              setIsConnected(true);
            }
          })
          .catch((error) => {
            console.error("Error fetching connected accounts:", error);
            toast({
              title: "Error",
              description: "Failed to fetch connected accounts.",
              variant: "destructive",
            });
          });
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn, user]);

  const handleConnect = () => {
    setIsConnected(true);
    setIsConnectFormOpen(false);
  };

  const handleDisconnect = () => {
    // setConnectionStatus("disconnected");
    setWalletAddress("");
    setApiKey("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const walletData: WalletDataItem[] = [
    { name: "Wallet Balance", symbol: "WALLET", enabled: true },
    { name: "Add Money", symbol: "ADD_MONEY", enabled: true },
    { name: "Send to Friend", symbol: "SEND", enabled: true },
    { name: "Request Money", symbol: "REQUEST", enabled: true },
    { name: "Transaction History", symbol: "HISTORY", enabled: true },
    { name: "Linked Bank Account", symbol: "BANK_LINK", enabled: false },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <div className="flex justify-center items-center fixed bottom-5 md:top-5 md:bottom-auto left-0 right-0 z-50">
        <header className="border-b rounded-xl w-[85%] md:w-[55%] lg:w-[60%] xl:w-[65%] bg-white backdrop-blur-sm z-50 mx-auto">
          <div className="w-full px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <DePayLogo className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold">
                    DePay Integration
                  </h1>
                  <p className="text-[8px] sm:text-[10px] md:text-[11px] lg:text-sm text-muted-foreground">
                    Connect your decentralized payment gateway
                  </p>
                </div>
              </div>
              <Button
                className="text-[10px] md:text-[11px] lg:text-sm px-2 md:px-4 py-1 md:py-2"
                variant="outline"
                onClick={() => window.history.back()}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </header>
      </div>

      <main className="container mx-auto mt-20 py-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-8 mb-8">
          <div className="absolute right-[-75px] md:right-[-30px] top-0 md:top-[-32px] -rotate-12 flex overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <DePayLogo
                className="w-96 h-96 text-white/5"
                fills={[
                  "rgba(226, 232, 240, 0.4)",
                  "rgba(255, 255, 255, 0.175)",
                  "rgba(203, 213, 225, 0.175)",
                  "rgba(96, 165, 250, 0.175)",
                  "rgba(203, 213, 225, 0.175)",
                ]}
              />
            </motion.div>
          </div>
          <div className="relative z-10">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs md:text-sm font-medium">
                    Powered by DePay
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Connect Your Decentralized Payment Gateway
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6">
                  Enable seamless digital wallet payments, lower fees, and
                  enhanced security with DePay's decentralized infrastructure.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    <span className="text-sm">Bank-level Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm">Instant Transactions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-400" />
                    <span className="text-sm">Global Payments</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Connection Status */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Connection Status
                    {isConnected ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs lg:text-sm">
                    {isConnected
                      ? "Your DePay integration is active and ready to use"
                      : "Connect your wallet to enable DePay payments"}
                  </CardDescription>
                </div>
                <Badge variant={isConnected ? "default" : "destructive"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
            </CardHeader>
            {isConnected === true && walletAddress && (
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">
                        Wallet Connected
                      </p>
                      <p className="text-sm text-green-700 font-mono">
                        {walletAddress}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(walletAddress)}
                    className="border-green-200"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </section>

        {/* Main Content */}
        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger className="text-xs md:text-sm" value="setup">
              Setup
            </TabsTrigger>
            <TabsTrigger className="text-xs md:text-sm" value="configuration">
              Configuration
            </TabsTrigger>
            <TabsTrigger className="text-xs md:text-sm" value="security">
              Security
            </TabsTrigger>
            <TabsTrigger className="text-xs md:text-sm" value="help">
              Help
            </TabsTrigger>
          </TabsList>

          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Connection Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Connect Wallet
                  </CardTitle>
                  <CardDescription>
                    Connect your digital wallet to enable DePay payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isConnected && user ? (
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-900 to-emerald-900 border-green-800/80 rounded-xl backdrop-blur-sm">
                      <div className="flex items-center space-x-4">
                        <div className="w-12">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="w-auto">
                          <h3 className="text-base md:text-lg font-medium text-white">
                            DePay Account Connected
                          </h3>
                          <p className="text-green-400 text-sm md:text-sm">
                            Your SpendLess is now synced with DePay Account
                          </p>
                          <h3 className="text-sm md:text-base font-medium text-white">
                            Acc No. {userData?.accountNumber}
                          </h3>
                        </div>
                      </div>
                      <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                        Active
                      </Badge>
                    </div>
                  ) : (
                    <div className="py-6">
                      <div>
                        {/* QR Scan Button */}
                        <div className="flex justify-center">
                          <div
                            onClick={() => setIsConnectFormOpen(true)}
                            className="group cursor-pointer relative"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/30 to-teal-600/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-110"></div>

                            <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-700/60 rounded-3xl p-12 shadow-2xl hover:shadow-emerald-900/20 transition-all duration-500 group-hover:border-emerald-600/50 group-hover:bg-slate-900/100">
                              <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-500/60 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300 animate-pulse"></div>
                              <div className="absolute bottom-6 left-6 w-1 h-1 bg-teal-400/50 rounded-full opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>

                              <div className="absolute top-6 left-6 w-3 h-3 border-l-2 border-t-2 border-emerald-500/30 group-hover:border-emerald-400/60 transition-colors duration-300"></div>
                              <div className="absolute bottom-6 right-6 w-3 h-3 border-r-2 border-b-2 border-emerald-500/30 group-hover:border-emerald-400/60 transition-colors duration-300"></div>

                              <div className="flex flex-col items-center space-y-5">
                                <div className="relative">
                                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-900/50 to-teal-800/50 rounded-2xl flex items-center justify-center group-hover:from-emerald-800/60 group-hover:to-teal-700/60 transition-all duration-300 shadow-lg border border-emerald-700/30 group-hover:border-emerald-600/50">
                                    <div className="relative">
                                      <div>
                                        <DePayLogo
                                          className="h-7 w-7 text-emerald-300 group-hover:text-emerald-200 rounded-[1px] transition-colors duration-300"
                                          fill="green"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="absolute inset-0 rounded-2xl border border-emerald-600/30 opacity-0 group-hover:opacity-100 animate-ping"></div>
                                  <div
                                    className="absolute inset-0 rounded-2xl border border-emerald-500/20 opacity-0 group-hover:opacity-100 animate-ping"
                                    style={{ animationDelay: "0.5s" }}
                                  ></div>
                                </div>

                                <div className="text-center space-y-1">
                                  <h3 className="text-lg font-semibold text-slate-100 tracking-tight">
                                    Connect DePay Account
                                  </h3>
                                </div>
                              </div>

                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-sm shadow-emerald-400/50"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground text-center mt-7">
                        A form will pop up to integrate DePay and connect your
                        wallet securely.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* API Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure your DePay API settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">DePay API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="api-key"
                        type="password"
                        placeholder="Enter your DePay API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                      <Button variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Get your API key from{" "}
                      <a
                        href="https://depayment.vercel.app"
                        className="text-primary hover:underline"
                      >
                        DePay Dashboard
                      </a>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="webhook-url"
                        placeholder="https://your-app.com/webhooks/depay"
                        value="https://spendless.vercel.app/api/webhooks/depay"
                        readOnly
                      />
                      <Button variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button className="w-full" disabled={!apiKey}>
                    Save Configuration
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Setup Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Setup Steps</CardTitle>
                <CardDescription>
                  Follow these steps to complete your DePay integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      step: 1,
                      title: "Create DePay Account",
                      description:
                        "Sign up for a DePay account at depayment.vercel.app",
                      completed: true,
                    },
                    {
                      step: 2,
                      title: "Connect Wallet",
                      description: "Connect your preferred digital wallet",
                      completed: isConnected === true,
                    },
                    {
                      step: 3,
                      title: "Configure API",
                      description:
                        "Add your DePay API key and configure webhooks",
                      completed: !!apiKey,
                    },
                    {
                      step: 4,
                      title: "Test Integration",
                      description:
                        "Perform a test transaction to verify everything works",
                      completed: false,
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          item.completed
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.completed ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          item.step
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="configuration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Settings</CardTitle>
                  <CardDescription>
                    Configure your payment preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Peer-to-Peer Payments</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable direct payments between users
                      </p>
                    </div>
                    <Switch
                      checked={enableP2P}
                      onCheckedChange={setEnableP2P}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Merchant Payments</Label>
                      <p className="text-sm text-muted-foreground">
                        Accept payments from merchants
                      </p>
                    </div>
                    <Switch
                      checked={enableMerchant}
                      onCheckedChange={setEnableMerchant}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-Convert to USD</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically convert money to USD
                      </p>
                    </div>
                    <Switch
                      checked={autoConvert}
                      onCheckedChange={setAutoConvert}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                  <CardDescription>
                    Features provided by DePayment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {walletData.map((network) => {
                      const Icon = iconMap[network?.symbol];
                      return (
                        <div
                          key={network.symbol}
                          className={`flex items-center justify-between p-3 border rounded-lg ${
                            network.enabled ? "opacity-100" : "opacity-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                              <Icon className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <span className="font-medium text-sm">
                              {network.name}
                            </span>
                          </div>
                          <Badge
                            variant={network.enabled ? "default" : "secondary"}
                          >
                            {network.enabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Features
                </CardTitle>
                <CardDescription>
                  DePay provides enterprise-grade security for your transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: <Lock className="h-6 w-6 text-blue-500" />,
                      title: "End-to-End Encryption",
                      description:
                        "All transactions are encrypted using industry-standard protocols",
                    },
                    {
                      icon: <Shield className="h-6 w-6 text-green-500" />,
                      title: "Multi-Signature Security",
                      description:
                        "Transactions require multiple signatures for enhanced security",
                    },
                    {
                      icon: <Globe className="h-6 w-6 text-purple-500" />,
                      title: "Decentralized Network",
                      description:
                        "No single point of failure with distributed infrastructure",
                    },
                    {
                      icon: <CheckCircle className="h-6 w-6 text-orange-500" />,
                      title: "Smart Contract Audits",
                      description:
                        "All smart contracts are audited by leading security firms",
                    },
                  ].map((feature, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0">{feature.icon}</div>
                      <div>
                        <h4 className="font-medium mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Security Tip:</strong> Never share your private keys or
                seed phrases. DePay will never ask for this information.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Help Tab */}
          <TabsContent value="help" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">What is DePay?</h4>
                    <p className="text-sm text-muted-foreground">
                      DePay is a decentralized payment gateway that enables
                      seamless digital payments with lower fees and enhanced
                      security.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">
                      Which wallets are supported?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      We support MetaMask, WalletConnect, Coinbase Wallet, Trust
                      Wallet, and many other popular digital wallets.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Are there any fees?</h4>
                    <p className="text-sm text-muted-foreground">
                      DePay charges minimal network fees, typically 50-80% lower
                      than traditional payment processors.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                  <CardDescription>
                    Get support for your DePay integration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    DePay Documentation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Integration Guide
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <DePayConnectForm
        open={isConnectFormOpen}
        onOpenChange={setIsConnectFormOpen}
        walletName={`@${user?.username}`}
        onConnect={handleConnect}
      />
    </div>
  );
}
