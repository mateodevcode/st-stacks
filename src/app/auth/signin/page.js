import SignInPage from "@/components/auth/SigninPage";
import React, { Suspense } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

const page = () => {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SignInPage />
    </Suspense>
  );
};

export default page;
