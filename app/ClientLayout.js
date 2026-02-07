"use client"; // Allows hooks and client-specific logic

import ReduxProvider from "./ReduxProvider/ReduxProvider";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientLayout({ children }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // Ensure component only renders after hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null; // Render nothing until hydration
  }

  return (
    <ReduxProvider>
      <div className="flex h-screen">
        {!isLoginPage && <Sidebar />}
        <div className="flex-1 flex flex-col">
          {!isLoginPage && <Navbar userName="test" />}
          {children}
        </div>
      </div>
    </ReduxProvider>
  );
}
