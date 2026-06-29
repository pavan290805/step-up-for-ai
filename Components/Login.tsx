'use client';

import { Suspense } from "react";
import AuthExperience from "./AuthExperience";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthExperience mode="login" />
    </Suspense>
  );
}
