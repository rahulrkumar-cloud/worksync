"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import configureAxios from "@/utils/configureAxios";
import { fetchWithAuth } from "./helper/fetchWithAuth";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/features/search/searchSlice";
import * as HeroUI from "@heroui/react";
import { RootState } from "@/store/store";
import Cookies from "js-cookie";

interface ClientLayoutProps {
  children: ReactNode;
}

function ClientLayout({ children }: ClientLayoutProps) {
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(false); // ✅ Prevents UI flash before checking auth
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const Progress = HeroUI.Progress;

  const user = useSelector((state: RootState) => state.search.user);
  const token = useSelector((state: RootState) => state.search.token);
  const isLoggedIn = useSelector((state: RootState) => state.search.isLoggedIn);
  
  const privateRoutes = ["/blog", "/profile", "/settings"]; // ✅ Private route list
  const isPrivateRoute = privateRoutes.includes(pathname);
const [authChecked, setAuthChecked] = useState(false);  // Track authentication check
    const [cookieLogin, setCookieLogin] = useState(Cookies.get("isLoggedIn") || "false"); // Get from cookies






  useEffect(() => {
    console.log("Cookie Value:", cookieLogin);
    if (typeof window !== 'undefined')
    setAuthChecked(true); // Indicate that auth check is complete
  }, []);






  useEffect(() => {
    const fetchUserData = async () => {
      setCheckingAuth(true); 
      setLoading(true);
      console.log("checkingAuthcheckingAuth",checkingAuth)

      const token = localStorage.getItem("token");
      console.log("Client Token:", token);
      console.log("checkingAuthcheckingAuth",checkingAuth)
      if (!token) {
        setCheckingAuth(false);
        console.log("checkingAuthcheckingAuth",checkingAuth)
        return;
      }
      

      try {
        const response = await fetchWithAuth("http://localhost:5000/users", { method: "GET" });

        console.log("Response Status:", response.status);
        if (response.status === 401) {
          setCheckingAuth(false);
          console.log("checkingAuthcheckingAuth",checkingAuth)
          return;
        }

        const allUsers = await response.json();
        const storedUser = localStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const loggedInUserId = parsedUser?.id;

        if (!loggedInUserId) {
          console.error("Logged-in user ID not found in localStorage!");
          setCheckingAuth(false);
          console.log("checkingAuthcheckingAuth",checkingAuth)
          return;
        }
        

        const loggedInUser = allUsers.find((user: any) => user?.id === loggedInUserId);

        if (!loggedInUser) {
          console.error("User data not found in API response!");
          setCheckingAuth(false);
          console.log("checkingAuthcheckingAuth",checkingAuth)
          return;
        }

        console.log("Logged-in user:", loggedInUser);
        dispatch(loginSuccess({ user: loggedInUser, token: loggedInUser.token }));
        configureAxios(token);
        setCheckingAuth(true);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
        setCheckingAuth(false);
        console.log("checkingAuthcheckingAuth",checkingAuth)
      }
    };

    fetchUserData();
  }, [pathname, router]);
  console.log("checkingAuth",checkingAuth,"isLoggedIn",isLoggedIn,"isPrivateRoute",isPrivateRoute)
  console.log("isLoggedInisLoggedInisLoggedInisLoggedInisLoggedIn",loading)


  // // ✅ Redirect user if not logged in and on a private route  
  // useEffect(() => {
  //   if (!isLoggedIn ) {
  //     router.replace("/"); // ✅ Ensures immediate redirection
  //   }
  // }, [isLoggedIn]);

  // ✅ Show loading bar if checking auth or loading on a private route
  if (!authChecked) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Progress isIndeterminate aria-label="Loading..." className="max-w-md" size="sm" />
      </div>
    );
  }

  return <>{children}</>;
}

export default ClientLayout;
