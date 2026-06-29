'use client';

import { Suspense } from "react";
import AuthExperience from "./AuthExperience";

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthExperience mode="signup" />
    </Suspense>
  );
}
