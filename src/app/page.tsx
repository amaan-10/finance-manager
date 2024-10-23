import { SignedIn, SignedOut, SignInButton, SignUp, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div> 
      <div className=" sign-in-container">
        <SignedOut>
          <SignInButton mode='modal' />
          <SignUpButton mode="modal"/>
        </SignedOut>
      </div>
      
      <SignedIn>
        <UserButton />
      </SignedIn>
      <section>
      <h2>Welcome to Personal Finance Manager</h2>
      <p>Track your expenses, create budgets, and manage your investments.</p>
    </section>
      
    </div>
  );
}
