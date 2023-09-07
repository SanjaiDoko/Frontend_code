import { useSelector } from "react-redux";
import {
  useGetAllReceivedTicketById,
  useGetManageTicketById,
} from "../../../hooks/ticketHooks";
import styles from "./index.module.css";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  let openTickets = 0,
    completedTickets = 0,
    managerTickets = 0;
  const id = localStorage.getItem("allMasterId");
  const role = useSelector((state) => state.profile.role);
  const {
    data,
    isLoading,
    isSuccess: receivedTickets,
  } = useGetAllReceivedTicketById(id, role);
  const { data: managerTicketsData, isSuccess: managerTicketsSuccess } =
    useGetManageTicketById(id, role);
  const navigate = useNavigate();

  const returnStatus = (status) => {
    let ticketStatus = "";
    if (status == 0) {
      ticketStatus = "Progress";
    }
    if (status == 1) {
      ticketStatus = "Completed";
    }
    if (status == 2) {
      ticketStatus = "Progress";
    }
    if (status == 3) {
      ticketStatus = "Rejected";
    }
    return ticketStatus;
  };

  const columns = [
    {
      field: "ticketId",
      flex: 1,
      headerName: "Ticket ID",
      width: 150,
    },
    {
      field: "issueName",
      flex: 1,
      headerName: "Issue Name",
      width: 150,
    },
    {
      field: "managerName",
      flex: 1,
      headerName: "Managed By",
      width: 150,
    },
    {
      field: "assignedName",
      flex: 1,
      headerName: "Assigned To",
      width: 150,
    },
    {
      field: "type",
      flex: 1,
      headerName: "Type",
      width: 200,
    },
    {
      field: "status",
      flex: 1,
      headerName: "Status",
      width: 200,
      renderCell: (params) => returnStatus(params.row.status),
    },
    {
      flex: 1,
      field: "Options",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <button className={styles.editBtn}>
          {" "}
          {params.row.status === 1 ? "View" : "Update"}
        </button>
      ),
    },
  ];

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (receivedTickets) {
    data.forEach((ticket) => {
      if (ticket.status === 1) {
        completedTickets += 1;
      } else if (ticket.status === 2) {
        openTickets += 1;
      } else {
        return false;
      }
    });
  }

  if (role === 3 && managerTicketsSuccess) {
    managerTicketsData.forEach((ticket) => {
      if (ticket.status === 0) {
        managerTickets += 1;
      }
    });
  }

  const rowClickFunction = (data) => {
    if (data.field === "Options") {
      navigate("/user/dashboard/" + data.row._id);
    }
  };

  return (
    <div className="container">
      <div className={styles.mainDiv}>
        <div className={`container ${styles.overviewcontainer}`}>
          <div className={styles.overview}>
            <h1 className={styles.overviewtxt}>Overview</h1>
          </div>
          <div className={styles.gridcontainer}>
            <div
              onClick={() => navigate("/admin/group")}
              className={`${styles.griditem} ${styles.item1}`}
            >
              <h1>{openTickets}</h1>
              <h5>Open Tickets</h5>
            </div>
            <div
              onClick={() => navigate("/admin/user")}
              className={`${styles.griditem} ${styles.item}`}
            >
              <h1>{completedTickets}</h1>
              <h5>Completed Tickets</h5>
            </div>
            {role === 3 && (
              <div
                onClick={() => navigate("/admin/group")}
                className={`${styles.griditem} ${styles.item}`}
              >
                <h1>{managerTickets}</h1>
                <h5>Managed Tickets</h5>
              </div>
            )}
          </div>
        </div>
        <div className={styles.subDiv}>
          <h3 style={{ marginTop: "1em" }}>Received Tickets </h3>
        </div>
        <div>
          {data && data.length > 0 ? (
            <div className={styles.girdoverflow}>
              <DataGrid
                className={styles.dataGrid}
                sx={{ textTransform: "capitalize" }}
                rows={data}
                columns={columns}
                getRowId={(data) => data._id}
                hideFooterSelectedRowCount={true}
                onCellClick={(row) => rowClickFunction(row)}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
              />
            </div>
          ) : (
            <div className={styles.nogroup}>
              <h4>Until now, You have not received any tickets to solve.</h4>
              <h4>Please wait for one to be created</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
