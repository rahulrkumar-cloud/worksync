"use client";

import { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import {  Progress } from "@heroui/react";
import Welcome from "../welcome/welcome";
import Cookies from "js-cookie";
import LogInForm from "../loginform/loginform";
export default function LogIn() {
    const router = useRouter();
    const [authChecked, setAuthChecked] = useState(false);  // Track authentication check
    const [cookieLogin, setCookieLogin] = useState(Cookies.get("isLoggedIn") || "false"); // Get from cookies
    const isLoggedIn = useSelector((state: RootState) => state.search.isLoggedIn);
  
    useEffect(() => {
      console.log("Cookie Value:", cookieLogin);
      if (typeof window !== 'undefined')
      setAuthChecked(true); // Indicate that auth check is complete
    }, []);
  
    if (!authChecked) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Progress isIndeterminate aria-label="Loading..." className="max-w-md" size="sm" />
        </div>
      );
    }
  
    return (
      <>
        {cookieLogin === "true" && isLoggedIn ? <Welcome /> : <LogInForm />}
      </>
    );
  }
  
