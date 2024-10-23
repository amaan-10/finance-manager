// app/layout.tsx
import './globals.css'; // Import global styles
import {ClerkProvider} from '@clerk/nextjs'

export const metadata = {
  title: 'Personal Finance Manager',
  description: 'Manage your expenses and investments efficiently.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body>
        <header>
          <nav>
            <h1>Personal Finance Manager</h1>
            <a href="/dashboard">Dashboard</a>
            <a href="/">Home</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer>© 2024 SpendLess | Personal Finance Manager</footer>
      </body>
    </html>
    </ClerkProvider>
  );
}
