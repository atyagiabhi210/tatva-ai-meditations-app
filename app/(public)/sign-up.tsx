import { SignUp as ClerkSignUp } from "@/components/clerk/SignUp";
const SignUp = () => {
  return <ClerkSignUp signInUrl="/" scheme="tatva" homeUrl="/(protected)" />;
};

export default SignUp;
