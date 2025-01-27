"use client";
import { useEffect, useState } from "react";

interface Member {
  id: string;
  name: string;
  amountPaid: number;
  balance?: number;
}

interface Transaction {
  _id: string;
  transactionName: string;
  createdAt: Date;
  members: Member[];
}

const SettleUpApp = () => {
  const [totalBill, setTotalBill] = useState<number>(0);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<
    { from: string; to: string; amount: number }[]
  >([]);
  const [isOpen, setOpenInput] = useState(false);
  const [transactionName, setTransactionName] = useState<string>();
  const [pastTransactions, setPastTransactions] = useState<Transaction[]>([]);
  const [expandedTransactionId, setExpandedTransactionId] = useState<
    string | null
  >(null);

  const handleTransactionClick = (id: string) => {
    setExpandedTransactionId(expandedTransactionId === id ? null : id);
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // console.log(members);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/split-up");
        const data = await response.json();
        // console.log(data);

        setPastTransactions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const openInput = async () => {
    setOpenInput(true);
  };

  const handleSaveData = async () => {
    if (!members) {
      alert("Name and amount are required");
      return;
    }

    const response = await fetch("/api/split-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactionName, members }),
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message);

      // setMembers([...members, data.member]);
      // setNewMemberName('');
      // setNewMemberAmount(0);
    } else {
      alert("Failed to add member");
    }
  };

  // Delete a member
  const handleDeleteData = async (id: string) => {
    const response = await fetch("/api/split-up", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setMembers(members.filter((member) => member.id !== id));
    } else {
      alert("Failed to delete member");
    }
  };

  const fairShare = totalBill / members.length;

  const calculateBalances = (
    members: Member[],
    totalBill: number
  ): Member[] => {
    const fairShare = totalBill / members.length;
    return members.map((member) => ({
      ...member,
      balance: member.amountPaid - fairShare,
    }));
  };

  const settleUp = (members: Member[]) => {
    const transactions: { from: string; to: string; amount: number }[] = [];
    const sortedMembers = [...members].sort((a, b) => a.balance! - b.balance!);

    let i = 0;
    let j = sortedMembers.length - 1;

    while (i < j) {
      const debtor = sortedMembers[i];
      const creditor = sortedMembers[j];

      const amountToSettle = Math.min(-debtor.balance!, creditor.balance!);

      if (amountToSettle > 0) {
        transactions.push({
          from: debtor.name,
          to: creditor.name,
          amount: parseFloat(amountToSettle.toFixed(2)),
        });

        debtor.balance! += amountToSettle;
        creditor.balance! -= amountToSettle;
      }

      if (debtor.balance! === 0) i++;
      if (creditor.balance! === 0) j--;
    }

    return transactions;
  };

  const addMember = () => {
    setMembers([
      ...members,
      { id: Date.now().toString(), name: "", amountPaid: 0 },
    ]);
  };

  const updateMember = (
    id: string,
    field: keyof Member,
    value: string | number
  ) => {
    setMembers(
      members.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const handleCalculate = () => {
    const totalPaid = members.reduce(
      (sum, member) => sum + member.amountPaid,
      0
    );
    if (totalPaid !== totalBill) {
      alert("Total amount paid does not match the total bill.");
      return;
    }
    const membersWithBalances = calculateBalances(members, totalBill);
    const settlementTransactions = settleUp(membersWithBalances);
    setTransactions(settlementTransactions);
  };

  return (
    <>
      <section className=" mt-5">
        <h2 className="text-[26px] font-bold">Split-It-Up</h2>
        <p className="pt-2">
          An extenstion to SpendLess that settle balances effortlessly within
          groups.
        </p>

        {/* Total Bill Input */}
        <div className="mt-2 flex flex-col md:flex-row gap-3">
          <div className="relative ">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 320 512"
              >
                <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
              </svg>
            </div>
            <input
              type="number"
              placeholder="Total Bill Amount"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 "
              value={totalBill}
              onChange={(e) => setTotalBill(parseFloat(e.target.value))}
              required
            />
          </div>
          {members.length === 0 && (
            <>
              <button
                onClick={addMember}
                className="border flex focus:outline-none focus:ring-2 font-medium rounded-lg text-sm px-5 py-2.5 me-2 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-white mr-2 mt-[2px]"
                  fill="currentColor"
                  viewBox="0 0 640 512"
                >
                  <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM504 312l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                </svg>
                <span>Add Member</span>
              </button>

              {/* Error Message */}
              {/* {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded-md text-center">
          {error}
        </div>
      )} */}

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                className="border flex focus:outline-none focus:ring-2 font-medium rounded-lg text-sm px-5 py-2.5 me-2 bg-gray-200 text-black border-gray-300 hover:bg-gray-300 hover:border-gray-100 focus:ring-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-black mr-2 mt-[2px]"
                  fill="currentColor"
                  viewBox="0 0 384 512"
                >
                  <path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L64 0zM96 64l192 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32L96 160c-17.7 0-32-14.3-32-32l0-32c0-17.7 14.3-32 32-32zm32 160a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM96 352a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM64 416c0-17.7 14.3-32 32-32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32zM192 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm64-64a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM288 448a32 32 0 1 1 0-64 32 32 0 1 1 0 64z" />
                </svg>
                <span>Calculate Settlements</span>
              </button>
            </>
          )}
        </div>

        {/* Members List */}
        <div className="space-y-4 mt-4">
          {members.length > 0 && (
            <h2 className="text-lg font-semibold text-gray-800">
              Transactions
            </h2>
          )}
          {members.map((member, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Member {index + 1} Name
              </label>
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[17px] h-[17px] absolute inset-y-0 left-0 ml-[11px] mt-[1px] self-center font-mono text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 640 512"
                >
                  <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM504 312l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                </svg>
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) =>
                    updateMember(member.id, "name", e.target.value)
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 "
                  placeholder="Enter name"
                />
              </div>
              <label className="block text-sm font-medium text-gray-700">
                Amount Paid
              </label>
              <div className="relative">
                <svg
                  className="w-4 h-4 absolute inset-y-0 left-0 ml-[10px] mt-[1px] self-center font-mono text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 320 512"
                >
                  <path d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
                </svg>
                <input
                  type="number"
                  value={member.amountPaid}
                  onChange={(e) =>
                    updateMember(
                      member.id,
                      "amountPaid",
                      parseFloat(e.target.value)
                    )
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 "
                  placeholder="Enter amount paid"
                />
              </div>
            </div>
          ))}
        </div>

        {members.length > 0 && (
          <div className="flex mt-4 gap-3">
            <button
              onClick={addMember}
              className="border flex focus:outline-none focus:ring-2 font-medium rounded-lg text-sm px-5 py-2.5 me-2 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white mr-2 mt-[2px]"
                fill="currentColor"
                viewBox="0 0 640 512"
              >
                <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM504 312l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
              </svg>
              <span>Add Member</span>
            </button>

            {/* Error Message */}
            {/* {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded-md text-center">
          {error}
        </div>
      )} */}

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              className="border flex focus:outline-none focus:ring-2 font-medium rounded-lg text-sm px-5 py-2.5 me-2 bg-gray-200 text-black border-gray-300 hover:bg-gray-300 hover:border-gray-100 focus:ring-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-black mr-2 mt-[2px]"
                fill="currentColor"
                viewBox="0 0 384 512"
              >
                <path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L64 0zM96 64l192 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32L96 160c-17.7 0-32-14.3-32-32l0-32c0-17.7 14.3-32 32-32zm32 160a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM96 352a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM64 416c0-17.7 14.3-32 32-32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32zM192 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm64-64a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM288 448a32 32 0 1 1 0-64 32 32 0 1 1 0 64z" />
              </svg>
              <span>Calculate Settlements</span>
            </button>
          </div>
        )}

        {!Number.isNaN(fairShare) && (
          <div className="mt-4 space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">Fare Share</h2>

            <div className="p-3 bg-white rounded-md flex items-center justify-between hover:bg-gray-50 transition-all">
              <span className="text-gray-700">
                <span className="font-medium">Fair Share </span>
              </span>
              <span className="text-green-600 font-semibold">
                <span className=" font-serif">₹</span>
                {fairShare}
              </span>
            </div>
          </div>
        )}

        {/* Settlement Transactions */}
        {transactions.length > 0 && (
          <div className="mt-4 space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Settlement Transactions
            </h2>
            {transactions.map((transaction, index) => (
              <div
                key={index}
                className="p-3 bg-white rounded-md flex items-center justify-between hover:bg-gray-50 transition-all"
              >
                <span className="text-gray-700">
                  <span className="font-medium">{transaction.from}</span> owes{" "}
                  <span className="font-medium">{transaction.to}</span>
                </span>
                <span className="text-green-600 font-semibold">
                  <span className=" font-serif">₹</span>
                  {transaction.amount}
                </span>
              </div>
            ))}
          </div>
        )}
        {members.length > 0 && (
          <div className="flex justify-end mt-4">
            {isOpen ? (
              <div className="mt-2 flex flex-col md:flex-row gap-3">
                <div className="relative ">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 "
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 320 512"
                    >
                      <path d="M192 0c-41.8 0-77.4 26.7-90.5 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-37.5 0C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM72 272a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm104-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zM72 368a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm88 0c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Transaction Name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 "
                    value={transactionName}
                    onChange={(e) => setTransactionName(String(e.target.value))}
                    required
                  />
                </div>
                <button
                  onClick={handleSaveData}
                  className="border flex focus:outline-none focus:ring-2 font-medium rounded-lg text-sm px-5 py-2.5 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-white mr-2 mt-[2px]"
                    fill="currentColor"
                    viewBox="0 0 640 512"
                  >
                    <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-242.7c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32L64 32zm0 96c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32L96 224c-17.7 0-32-14.3-32-32l0-64zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                  </svg>
                  <span>Save Transaction</span>
                </button>
              </div>
            ) : (
              <button
                onClick={openInput}
                className="border flex focus:outline-none focus:ring-2 font-medium rounded-lg text-sm px-5 py-2.5 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-white mr-2 mt-[2px]"
                  fill="currentColor"
                  viewBox="0 0 640 512"
                >
                  <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-242.7c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32L64 32zm0 96c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32L96 224c-17.7 0-32-14.3-32-32l0-64zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                </svg>
                <span>Save</span>
              </button>
            )}
          </div>
        )}

        {/* <div className="space-y-4">
          {pastTransactions.map((transaction) => (
            <div
              key={transaction._id}
              className="p-4 border rounded-lg cursor-pointer"
              onClick={() => handleTransactionClick(transaction._id)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {transaction.transactionName}
                </h3>
                <span className="text-sm text-gray-500">
                  {transaction.createdAt}
                </span>
              </div>
              {expandedTransactionId === transaction._id && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Members:</span>{" "}
                    {transaction.members.join(", ")}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Amount Paid:</span> $
                    {transaction.amountPaid.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div> */}

        <div className="mt-4 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Past Transactions
          </h2>
          {loading ? (
            <p>Loading past transactions...</p> // Loading state
          ) : error ? (
            <p>Error: {error}</p> // Error state
          ) : !pastTransactions || pastTransactions.length === 0 ? (
            <p>- No transactions found.</p> // No data found
          ) : (
            <>
              {pastTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="p-4 bg-white border rounded-lg cursor-pointer"
                  onClick={() => handleTransactionClick(transaction._id)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      {transaction.transactionName}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </span>
                  </div>
                  {expandedTransactionId === transaction._id && (
                    <div className="mt-2 space-y-2">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Members:</span>
                      </p>
                      <ul className="list-disc list-inside">
                        {transaction.members.map((member) => (
                          <li key={member.id} className="text-sm text-gray-700">
                            {member.name} -{" "}
                            <span className=" font-serif">₹</span>
                            {member.amountPaid.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Total Amount Paid:</span>{" "}
                        <span className=" font-serif">₹</span>
                        {transaction.members
                          .reduce(
                            (total, member) => total + member.amountPaid,
                            0
                          )
                          .toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default SettleUpApp;
