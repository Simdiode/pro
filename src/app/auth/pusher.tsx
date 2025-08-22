import { useRouter } from 'next/navigation'
import React from "react";

const SignInEffect = ({ page }: { page: string }) => {
  const router = useRouter();
  React.useEffect(() => {
    router.push(`${page}`);;
  }, []);
  return null;
};

export default SignInEffect;