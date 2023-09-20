import styles from "./index.module.css";
import { useGetAllTicketById } from "../../../hooks/ticketHooks";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import { useState } from "react";
import searchLogo from "../../../assets/Images/searchLogo.png";

function Dashboard() {
  const id = localStorage.getItem("allMasterId");

  const { data, isloading } = useGetAllTicketById(id);

  const [searchValue, setSearchValue] = useState("");

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
      renderCell: (params) => {
        return params.row.assignedName ? params.row.assignedName : "NA";
      },
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
      renderCell: () => <button className={styles.editBtn}>View Ticket</button>,
    },
  ];

  if (isloading) {
    return <Loader />;
  }

  const rowClickFunction = (data) => {
    if (data.field === "Options") {
      navigate("/user/editticket/" + data.row._id);
    }
  };

  if (data !== undefined) {
    return (
      <div className="container">
        <div className={styles.mainDiv}>
          <div className={styles.subDiv}>
            <h3>My Ticket </h3>
            <button
              onClick={() => navigate("/user/addticket")}
              className={styles.addTicketBtn}
            >
              Create Ticket
            </button>
          </div>
          {data && data.length > 0 ? (
            <>
              <div className={styles.searchDiv}>
                <img src={searchLogo} alt="searchlogo" />
                <input
                  type="text"
                  className={styles.searchInput}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search by Ticket ID"
                />
              </div>
              <div className={styles.girdoverflow}>
                <DataGrid
                  className={styles.dataGrid}
                  sx={{ textTransform: "capitalize", minHeight: "400px" }}
                  rows={
                    data && searchValue !== ""
                      ? data.filter((e) =>
                          e.ticketId
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())
                        )
                      : data
                  }
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
            </>
          ) : (
            <div className={styles.nogroup}>
              <h4>Do you face any Issue ?</h4>
              <h4>Create a Ticket for the Solution.</h4>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Dashboard;
