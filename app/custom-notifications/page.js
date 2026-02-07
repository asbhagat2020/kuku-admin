"use client";
import { CustomNotification } from "@/components/CustomNotification";
import React from "react";

const page = () => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <CustomNotification />
    </div>
  );
};

export default page;
