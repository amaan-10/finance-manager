"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import DePayLogo from "@/assets/depay-logo";

export default function DePayCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [recevierName, setRecevierName] = useState("");
  const [recevierAccountNumber, setRecevierAccountNumber] = useState("");

  useEffect(() => {
    const amt = searchParams.get("amount");
    const note = searchParams.get("notes") || "";
    const recevier = searchParams.get("name");
    const account = searchParams.get("accountNumber");

    if (amt && recevier && account) {
      setAmount(amt);
      setNotes(note);
      setRecevierName(recevier);
      setRecevierAccountNumber(account);
      setIsDialogOpen(true);
    }
  }, [searchParams]);

  const handleAddExpense = async () => {
    if (!category || !amount) {
      return;
    }

    const newExpense = {
      category,
      amount: Number.parseFloat(amount),
      date: new Date(),
      notes: notes || undefined,
    };

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense),
      });

      const data = await res.json();

      if (res.ok) {
        // Navigate to success screen or dashboard
        router.push("/finance/expenses");

        setIsDialogOpen(false);

        toast({
          description: "Expense added successfully!",
          className: "bg-neutral-900 border-neutral-900 text-white",
        });
      } else {
        toast({
          description: "Failed to add expense.",
          className: "bg-red-700 border-red-700 text-white",
        });
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Select Category</DialogTitle>
            <DialogDescription>
              Payment of ₹{amount} to {recevierName}. Choose a category to log
              the expense.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Label>Select Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Groceries">Groceries</SelectItem>
                <SelectItem value="Transportation">Transportation</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Rent">Rent</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              onClick={handleAddExpense}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!isDialogOpen && (
        <div className="p-6 flex flex-col justify-center items-center text-center h-[100vh]">
          <div className="flex items-center justify-center">
            <DePayLogo
              className="animate-rocket-launch h-14 w-14"
              fills={[
                "white", // white
                "white", // #1a1a1a
                "#333333", // #333333 - wallet
                "#f2f2f2", // #f2f2f2 - clip of wallet
                "#4d4d4d", // #4d4d4d - btn of wallet
              ]}
            />
          </div>
          <h1 className="text-xl font-bold">Processing Payment...</h1>
        </div>
      )}
    </>
  );
}
