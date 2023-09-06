import styles from "./index.module.css";
import { useGetManageTicketById } from "../../../hooks/ticketHooks";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Index() {
  const id = localStorage.getItem("allMasterId");

  const role = useSelector((state) => state.profile.role);

  const { data, isloading } = useGetManageTicketById(id, role);

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
console.log(data)
  const columns = [
    {
      field: "issueName",
      flex: 1,
      headerName: "Issue Name",
      width: 150,
    },
    {
      field: "assignedName",
      flex: 1,
      headerName: "Issue Group",
      width: 150,
      renderCell: (params) => {
        return params.row.issueGroupName 
      },
    },
    {
      field: "managerName",
      flex: 1,
      headerName: "Managed By",
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
        <button className={styles.editBtn}>{params.row.status === 0 ?"Update Ticket" : "View Ticket"}</button> 
      ),
    },
  ];

  if (isloading) {
    return <p>Loading....</p>;
  }

  const rowClickFunction = (data) => {
    if (data.field === "Options") {
      navigate("/user/updatemanageticket/" + data.row._id);
    }
  };

  if (data !== undefined) {
    return (
      <div className="container">
        <div className={styles.mainDiv}>
          <h3>Manage Ticket </h3>
          {data && data.length > 0 ? (
            <DataGrid
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
          ) : (
            <p>No Data Found</p>
          )}
        </div>
      </div>
    );
  }
}

export default Index;
