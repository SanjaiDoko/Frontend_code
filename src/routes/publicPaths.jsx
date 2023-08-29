import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { lazy } from "react";


const ChangePasswordComponent = lazy(() =>
  import("../views/PublicPages/ChangePassword/index")
);

const LoginPageComponent = lazy(() =>
  import("../views/PublicPages/Login/index")
);

const RegisterComponent = lazy(() =>
  import("../views/PublicPages/Register/index")
);

const ResetPasswordComponent = lazy(() =>
  import("../views/PublicPages/ResetPassword/index")
);

const publicPaths = [
  {
    path: "change-password/:id/:type",
    element: ChangePasswordComponent,
  },
  {
    path: "login",
    element: LoginPageComponent,
  },
  {
    path: "register",
    element: RegisterComponent,
  },
  {
    path: "resetpassword",
    element: ResetPasswordComponent,
  }
];

function PublicApp() {
  const location = useLocation();
  return (
    <Routes>
      {publicPaths.map((e, index) => (
        <Route key={index} path={e.path} element={<e.element />} />
      ))}
      <Route
        path="*"
        element={<Navigate state={{ from: location }} to="/login" />}
      />
    </Routes>
  );
}

export default PublicApp;
