import { SignIn } from "@/components/clerk/SignIn";
import React from "react";

export default function Index() {
  return (
    <>
      <SignIn signUpUrl="/sign-up" scheme="tatva" homeUrl="/(protected)" />
    </>
  );
}
