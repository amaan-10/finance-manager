import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className=" m-5 z-50 flex justify-center">
      <SignIn />
    </div>
  );
}
