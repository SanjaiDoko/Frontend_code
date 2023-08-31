import { Route, Routes, Navigate } from "react-router-dom";
import { lazy } from "react";
import { useSelector } from "react-redux";

const DashboardComponent = lazy(() => import("../views/User/Dashboard"));
const MainUserLayoutComponent = lazy(() =>
  import("../components/MainUserLayout/MainUserLayout")
);

const userPaths = [
  {
    path: "user",
    element: MainUserLayoutComponent,
    children: [
      {
        path: "dashboard",
        element: DashboardComponent,
      },
    ],
    status: [1],
  },
];

function UserApp() {
  const profileData = useSelector((state) => state.profile.profileData);
  console.log(profileData , 'profileData')
  return (
    <Routes>
      {userPaths.map(
        (parentElement, parentIndex) => (
          <Route
            key={parentIndex}
            path={parentElement.path}
            element={<parentElement.element />}
          >
            {parentElement?.children?.map((childrenElement, childrenIndex) => (
              <Route
                path={childrenElement.path}
                element={<childrenElement.element />}
                key={childrenIndex}
              >
                {childrenElement?.children?.map(
                  (nestedChild, nestedChildIndex) => (
                    <Route
                      key={nestedChildIndex}
                      path={nestedChild.path}
                      element={<nestedChild.element />}
                    />
                  )
                )}
              </Route>
            ))}
          </Route>
        )
      )}
      <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
    </Routes>
  );
}

export default UserApp;
