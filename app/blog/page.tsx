"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function BlogPage() {
  // Access user data from the Redux store
  const { user, isLoggedIn } = useSelector((state: RootState) => state.search);

  useEffect(() => {
    if (user) {
      console.log("User details in About page:", user);
    } else {
      console.log("No user data available.");
    }
  }, [user]); // This effect will run whenever `user` changes

  return (
    <div>
      <h1>About Page</h1>
      {isLoggedIn ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          {/* You can access and display any other user details here */}
        </div>
      ) : (
        <p>Please log in to see this page.</p>
      )}
    </div>
  );
}
