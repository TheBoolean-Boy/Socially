import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className=" m-4">
    
      <SignedOut>
        <SignInButton mode="modal" >
          <Button className=" cursor-pointer" variant={"ghost"}>Sign In</Button>
        </SignInButton>
        <SignUpButton mode="modal" >
          <Button className=" cursor-pointer" variant={"default"}>
            Sign Up
          </Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>

    </div>
  );
}
