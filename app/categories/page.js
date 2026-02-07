"use client";
import { Categories } from "@/components/Categories";
import React from "react";

const page = () => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <Categories />
    </div>
  );
};

export default page;
