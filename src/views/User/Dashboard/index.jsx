import { useSelector } from "react-redux";
import { useGetAllReceivedTicketById } from "../../../hooks/ticketHooks";
import styles from "./index.module.css";
import { DataGrid } from "@mui/x-data-grid";

function Dashboard() {
  const id = localStorage.getItem("allMasterId");
  const role = useSelector((state) => state.profile.role);
  const { data, isLoading } = useGetAllReceivedTicketById(id, role);

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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const rowClickFunction = (data) => {
    if (data.field === "Options") {
      console.log("clicked");
    }
  };

  console.log(data, "data");

  return (
    <div className={styles.mainDiv}>
      <div className={styles.subDiv}>
        <h3 style={{ marginTop: "1em" }}>Received Ticket </h3>
      </div>
      <div>
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

export default Dashboard;
