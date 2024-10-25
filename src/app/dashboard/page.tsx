import Link from "next/link";

// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <section className=" mt-5">
      <h2>Dashboard Overview</h2>

      <h2 className=" bg-yellow-300">Work in Progress...</h2>
      <div className="mt-2">
        <div>
          Monthly Expenses: <span className=" font-serif">₹</span>500
        </div>
        <div>
          Remaining Budget: <span className=" font-serif">₹</span>200
        </div>
        <div>
          Total Investments: <span className=" font-serif">₹</span>1500
        </div>
      </div>
      <nav className="mt-5">
        <Link className="text-black" href={"/dashboard/expenses"}>
          View Expenses
        </Link>
        <Link className="text-black" href={"/dashboard/investments"}>
          View Investments
        </Link>
      </nav>
    </section>
  );
}
