"use client";
import { User } from "@/components/User";
import React from "react";

const page = () => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <User />
    </div>
  );
};

export default page;
