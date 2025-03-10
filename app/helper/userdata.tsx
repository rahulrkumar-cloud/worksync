import { useSelector } from "react-redux";

import { RootState } from "@/store/store";

export function GetUserData() {
  // Access user data and isLoggedIn state from the Redux store
  const { user, isLoggedIn } = useSelector((state: RootState) => state.search);

  return { user, isLoggedIn };
}
