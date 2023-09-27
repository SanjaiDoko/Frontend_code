import { Route, Routes, Navigate } from "react-router-dom";
import { lazy } from "react";

const DashboardComponent = lazy(() => import("../views/User/Dashboard"));
const MyTicketComponent = lazy(() => import("../views/User/MyTicket/index"));
const EditTicketComponent = lazy(() =>
  import("../../src/views/User/EditTicket/EditTicket")
);
const ManageTicketComponent = lazy(() =>
  import("../../src/views/User/ManageTicket/index")
);
const UpdateManageTicketComponent = lazy(() =>
  import("../../src/views/User/ManageUpdateTicket/index")
);
const AddTicketComponent = lazy(() =>
  import("../views/User/AddTicket/AddTicket")
);

const UpdateDashboardComponent = lazy(() =>
  import("../views/User/ReceivedUpdateTicket/index")
);

const MainUserLayoutComponent = lazy(() =>
  import("../components/MainUserLayout/MainUserLayout")
);
const EodMailComponent = lazy(() => import("../views/User/EodMail/eodmail"));
const EodMailListComponent = lazy(() =>
  import("../views/User/UserEodList/eodList")
);
const UserEodMailViewComponent = lazy(() =>
  import("../views/User/UserEodView/UserEodView")
);
const ManageEodMailComponent = lazy(() =>
  import("../views/User/ManageEodView/ManagerEodView")
);

const Room = lazy(() => import("../views/User/Room/index"));

const RoomBookings = lazy(() => import("../views/User/MyRoomBookings/index"));

const RoomBookingDetail = lazy(() =>
  import("../views/User/RoomBookindDetail/index")
);

const LandingPageComponent = lazy(() =>
  import("../views/User/LandingPage/index")
);
const AddRequirement = lazy(() => import("../views/User/Requirement/index"));

const userPaths = [
  // {
  //   path: "user",
  //   element: MainUserLayoutComponent,
  //   children: [
  //     {
  //       path: "dashboard",
  //       element: DashboardComponent,
  //     },
  //     {
  //       path: "mytickets",
  //       element: MyTicketComponent,
  //     },
  //     {
  //       path: "addticket",
  //       element: AddTicketComponent,
  //     },
  //     {
  //       path: "editticket/:id",
  //       element: EditTicketComponent,
  //     },
  //     {
  //       path: "manageticket",
  //       element: ManageTicketComponent,
  //     },
  //     {
  //       path: "updatemanageticket/:id",
  //       element: UpdateManageTicketComponent,
  //     },
  //     {
  //       path: "dashboard/:id",
  //       element: UpdateDashboardComponent,
  //     },
  //     {
  //       path: "eodstatus/:id",
  //       element: UserEodMailViewComponent,
  //     },
  //     {
  //       path: "eodstatus",
  //       element: EodMailComponent,
  //     },
  //     {
  //       path: "eodList",
  //       element: EodMailListComponent,
  //     },
  //     {
  //       path: "rooms",
  //       element: Room,
  //     },
  //     {
  //       path: "myroombookings",
  //       element: RoomBookings,
  //     },
  //     {
  //       path: "roombookingdetails/:id",
  //       element: RoomBookingDetail,
  //     },
  //     {
  //       path: "managereodview",
  //       element: ManageEodMailComponent,
  //     },
  //   ],
  //   status: [1],
  // },
  {
    path: "ticket",
    element: MainUserLayoutComponent,
    children: [
      {
        path: "receivedTicket",
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
      {
        path: "manageticket",
        element: ManageTicketComponent,
      },
      {
        path: "updatemanageticket/:id",
        element: UpdateManageTicketComponent,
      },
      {
        path: "receivedTicket/:id",
        element: UpdateDashboardComponent,
      },
    ],
    status: [1],
  },
  {
    path: "eod",
    element: MainUserLayoutComponent,
    children: [
      {
        path: "eodstatus/:id",
        element: UserEodMailViewComponent,
      },
      {
        path: "eodstatus",
        element: EodMailComponent,
      },
      {
        path: "eodList",
        element: EodMailListComponent,
      },
      {
        path: "manager/eodview",
        path: "managereodview",
        element: ManageEodMailComponent,
      },
    ],
    status: [1],
  },
  {
    path: "room",
    element: MainUserLayoutComponent,
    children: [
      {
        path: "rooms",
        element: Room,
      },
      {
        path: "myroombookings",
        element: RoomBookings,
      },
      {
        path: "roombookingdetails/:id",
        element: RoomBookingDetail,
      },
    ],
    status: [1],
  },
  {
    path: "requirement",
    element: MainUserLayoutComponent,
    children: [
      {
        path: "addrequirement",
        element: AddRequirement,
      },
    ],
    status: [1],
  },
  {
    path: "menu",
    element: LandingPageComponent,
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
      <Route path="*" element={<Navigate to="/menu" replace />} />
    </Routes>
  );
}

export default UserApp;
