"use client";
import Listing from "@/components/Listing";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React from "react";

const page = () => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <Listing />
    </div>
  );
};

export default page;
