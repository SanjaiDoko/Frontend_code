import { Outlet } from "react-router-dom";
import Header from "../Header/Header";

export default function MainUserLayout() {
  function redirectLink(role) {
    switch (role) {
      case 1:
        return "/user/";
    }
  }

  return (
    <>
      <Header redirectLink={redirectLink} />
      <Outlet />
    </>
  );
}
