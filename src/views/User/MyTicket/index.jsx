import styles from "./index.module.css";
import { useGetAllTicketById } from "../../../hooks/ticketHooks";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const id = localStorage.getItem("allMasterId");

  const { data, isloading } = useGetAllTicketById(id);

  const navigate = useNavigate();

  const columns = [
    {
      field: "issueName",
      flex: 1,
      headerName: "IssueName",
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
      headerName: "TYPE",
      width: 200,
    },
    {
      flex: 1,
      field: "Options",
      sortable: false,
      width: 100,
      renderCell: () => <button className={styles.editBtn}>Update</button>,
    },
  ];

  if (isloading) {
    return <p>Loading....</p>;
  }

  const rowClickFunction = (data) => {
    if (data.field === "Options") {
      navigate("/user/editticket/" + data.row._id);
    }
  };

  if (data !== undefined) {
    return (
      <div className={styles.mainDiv}>
        <div className={styles.subDiv}>
          <h3 style={{ marginTop: "1em" }}>My Ticket </h3>
        </div>
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
    );
  }
}

export default Dashboard;
