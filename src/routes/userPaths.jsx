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

//sales
const Companies = lazy(() => import("../views/User/Sales/Companies/index"))
const AddCompanies = lazy(() => import("../views/User/Sales/Companies/AddCompanies/AddCompany"))

const EmployeeComponent = lazy(() => import("../views/User/Sales/Employee/index"))
//Create Sales Call
const SalesCallComponent = lazy(() => import("../views/User/Sales/SalesCall/index"))
const CreateSalesCallComponent = lazy(() => import("../views/User/Sales/SalesCall/CreateSalesCall/CreateSalesCall"))
const ViewSalesCallComponent = lazy(() => import("../views/User/Sales/SalesCall/ViewSalesCall/index"))

//Assigned Sales call
const AssignedSalesCallComponent = lazy(() => import("../views/User/Sales/AssignedSalesCall/index"))
const UpdateAssingedCall = lazy(() => import("../views/User/Sales/AssignedSalesCall/UpdateAssignedCall/index"))

//Assigne Demo Calls
const DemoCallComponent = lazy(() => import("../views/User/Sales/DemoCalls/index"))
const CreateDemoCallComponent = lazy(() => import("../views/User/Sales/DemoCalls/CreateDemoCall/CreateDemoCall"))
const ViewDemoCallComponent = lazy(() => import("../views/User/Sales/DemoCalls/ViewDemoCall/index"))

//My Demo Calls
const MyDemoCallComponent = lazy(() => import("../views/User/Sales/MyDemoCalls/index"))
const UpdateDemoCallComponent = lazy(() => import("../views/User/Sales/MyDemoCalls/UpdateDemoCall/index"))

//My Demo Calls
const ManagerDemoCallComponent = lazy(() => import("../views/User/Sales/ManagerDemoCall/index"))
const ViewManagerDemoCallComponent = lazy(() => import("../views/User/Sales/ManagerDemoCall/ViewManagerDemoCall/index"))


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
      {
        path: "manageticket",
        element: ManageTicketComponent,
      },
      {
        path: "updatemanageticket/:id",
        element: UpdateManageTicketComponent,
      },
      {
        path: "dashboard/:id",
        element: UpdateDashboardComponent,
      },
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
      {
        path: "manager/eodview",
        element: ManageEodMailComponent,
      },
      {
        path: "company",
        element: Companies,
      },
      {
        path: "addCompany",
        element: AddCompanies,
      },
      {
        path: "employee",
        element: EmployeeComponent,
      },
      {
        path: "salescall",
        element: SalesCallComponent,
      },
      {
        path: "createsalescall",
        element: CreateSalesCallComponent,
      },
      {
        path: "viewsalescall/:id",
        element: ViewSalesCallComponent,
      },
      {
        path: "viewdemocall/:id",
        element: ViewDemoCallComponent,
      },
      {
        path: "democall",
        element: DemoCallComponent,
      },
      {
        path: "createdemocall",
        element: CreateDemoCallComponent,
      },
      {
        path: "assginedsalescall",
        element: AssignedSalesCallComponent,
      },
      {
        path: "updateassginedsalescall/:id",
        element: UpdateAssingedCall,
      },
      {
        path: "mydemocall",
        element: MyDemoCallComponent,
      },
      {
        path: "updatedemocall/:id",
        element: UpdateDemoCallComponent,
      },
      {
        path: "managerdemo",
        element: ManagerDemoCallComponent,
      },
      {
        path: "viewmanagerdemo/:id",
        element: ViewManagerDemoCallComponent,
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
      <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
    </Routes>
  );
}

export default UserApp;
