import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";
import OperationAdminApp from "./adminPaths";
import PublicApp from "./publicPaths";
import UserApp from "./userPaths";
// import { useLogoutUser } from "../hooks/userAuthManagement";
// import { useIdleTimer } from "react-idle-timer";
import { removeProfileData } from "../redux/slices/profileSlice";
// import { openPopup } from "../redux/slices/sessionPopupSlice";

function RouteChecker() {
  const profileData = useSelector((state) => state.profile);

  // const { mutate } = useLogoutUser();

  const dispatch = useDispatch();

  // const onIdle = () => {
  // 	if (profileData.signedIn === true) {
  // 		mutate();
  // 		dispatch(openPopup());
  // 	}
  // };

  // useIdleTimer({
  // 	onIdle,
  // 	crossTab: true, // sync the time between tabs
  // 	syncTimers: 200, // sync the time between tabs in 0.2 sec
  // 	timeout: 1500000, // it is in ms and idleTime is set for 25 minutes
  // });

  if (profileData.signedIn === false) {
    return <PublicApp />;
  } else {
    try {
      const token = localStorage.getItem("allMasterToken");
      if (token == null) {
        dispatch(removeProfileData());
        return <PublicApp />;
      }
      const decodedData = jwtDecode(token);
      if (decodedData.exp * 1000 < new Date().getTime()) {
        toast.error("Session Expired");
        // mutate();
      } else {
        switch (profileData.role) {
          case 1:
            return <UserApp />;
          case 2:
            return <OperationAdminApp />;
          case 3:
            return <UserApp />;
          default:
            return null;
        }
      }
    } catch (error) {
      dispatch(removeProfileData());
      return <PublicApp />;
    }
  }
}

export default function RouterRender() {
  return (
    <BrowserRouter>
      <RouteChecker />
    </BrowserRouter>
  );
}
