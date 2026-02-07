"use client";
import { Products } from "@/components/Products";
import React from "react";

const page = () => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <Products />
    </div>
  );
};

export default page;
