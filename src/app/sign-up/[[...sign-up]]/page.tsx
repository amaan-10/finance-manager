import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="m-5 z-50 flex justify-center pt-32 pb-10">
      <SignUp />
    </div>
  );
}
