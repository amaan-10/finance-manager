// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>
        <a className=" text-black" href="/dashboard">
          Overview
        </a>
        <a className=" text-black" href="/dashboard/expenses">
          Expenses
        </a>
        <a className=" text-black" href="/dashboard/budgets">
          Budgets
        </a>
        <a className=" text-black" href="/dashboard/investments">
          Investments
        </a>
      </nav>
      <div>{children}</div>
    </div>
  );
}
