import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className=" m-5 z-50 flex justify-center">
      <SignUp />
    </div>
  );
}
