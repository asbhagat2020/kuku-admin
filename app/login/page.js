"use client";  // Ensure this is a client component

import LoginForm from '@/components/LoginForm';
import { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  return (
    <>
      <Toaster />
      <LoginForm />
    </>
  );
}
