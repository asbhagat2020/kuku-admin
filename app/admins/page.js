"use client";
import Admin from "@/components/Admin";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined" && Cookies.get("token")
        ? JSON.parse(Cookies.get("token"))
        : null;
    if (!token) {
      router.push("/login");
    }
  }, []);
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <Admin />
    </div>
  );
};

export default Page;
