"use client";
import { useState } from "react";

interface Member {
  id: string;
  name: string;
  amountPaid: number;
  balance?: number;
}

const SettleUpApp = () => {
  const [totalBill, setTotalBill] = useState<number>(0);
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<
    { from: string; to: string; amount: number }[]
  >([]);

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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 "
              value={totalBill}
              onChange={(e) => setTotalBill(parseFloat(e.target.value))}
              required
            />
          </div>
          <button
            onClick={addMember}
            className="border focus:outline-none focus:ring-2 font-medium rounded-lg text-sm px-5 py-2.5 me-2 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700"
          >
            {/* <FaUserPlus /> */}
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
            className="border focus:outline-none focus:ring-2 font-medium rounded-lg text-sm px-5 py-2.5 me-2 bg-gray-200 text-black border-gray-300 hover:bg-gray-300 hover:border-gray-100 focus:ring-gray-200"
          >
            {/* <FaCalculator /> */}
            <span>Calculate Settlements</span>
          </button>
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
                  className="w-[17px] h-[17px] absolute inset-y-0 left-0 ml-[10px] mt-[1px] self-center font-mono text-gray-500"
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
                  className="w-full pl-8 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full pl-8 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount paid"
                />
              </div>
            </div>
          ))}
        </div>

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
      </section>
    </>
  );
};

export default SettleUpApp;
