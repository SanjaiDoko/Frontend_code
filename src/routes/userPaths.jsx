import { Route, Routes, Navigate } from "react-router-dom";
import { lazy } from "react";

const DashboardComponent = lazy(() => import("../views/User/Dashboard"));
const MyTicketComponent = lazy(() => import("../views/User/MyTicket/index"));
const EditTicketComponent = lazy(() =>
  import("../../src/views/User/EditTicket/EditTicket")
);
const AddTicketComponent = lazy(() =>
  import("../views/User/AddTicket/AddTicket")
);
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
      {
        path: "mytickets",
        element: MyTicketComponent,
      },
      {
        path: "addticket",
        element: AddTicketComponent,
      },
      {
        path: "editticket/:id",
        element: EditTicketComponent,
      },
    ],
    status: [1],
  },
];

function UserApp() {
  return (
    <Routes>
      {userPaths.map((parentElement, parentIndex) => (
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
      ))}
      <Route path="*" element={<Navigate to="/user/dashboard" replace />} />S
    </Routes>
  );
}

export default UserApp;
