// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
      <div>
        <nav>
          <a href="/dashboard">Overview</a>
          <a href="/dashboard/expenses">Expenses</a>
          <a href="/dashboard/investments">Investments</a>
        </nav>
        <div>{children}</div>
      </div>
    );
  }
  