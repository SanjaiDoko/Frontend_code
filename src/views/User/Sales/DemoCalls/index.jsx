import styles from "./index.module.css";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import searchLogo from "../../../../assets/Images/searchLogo.png";
import Loader from "../../../../components/Loader/Loader";
import { useGetDemo } from "../../../../hooks/sales";
import moment from "moment";
import { getDemoMessage } from "../../../../helper";

function Dashboard() {
  const id = localStorage.getItem("allMasterId");
  const navigate = useNavigate();
  

  const { data, isloading } = useGetDemo();

  const [searchValue, setSearchValue] = useState("");

console.log(data,"data")

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
      field: "companyName",
      flex: 1,
      headerName: "Company Name",
      width: 150,
    },
    {
      field: "employeeName",
      flex: 1,
      headerName: "Assigned To",
      width: 150,
    },
    {
      field: "assignedOn",
      flex: 1,
      headerName: "assigned On",
      width: 150,
      renderCell: (params) => moment(params.row.eodDate).format("DD-MM-YYYY"),
    },
    {
      field: "status",
      flex: 1,
      headerName: "status",
      width: 150,
      renderCell: (params) => getDemoMessage(params.row.status),
      
    },
    {
      flex: 1,
      field: "Options",
      sortable: false,
      width: 100,
      renderCell: () => (
        <button className={styles.editBtn}>
          { "View Report"}
        </button>
      ),
    },
  ];

  if (isloading) {
    return <Loader />;
  }

  const rowClickFunction = (data) => {
    if (data.field === "Options") {
      navigate("/user/viewdemocall/" + data.row.callId);
    }
  };

  if (data !== undefined) {
    return (
      <div className="container">
        <div className={styles.mainDiv}>
          <div className={styles.subDiv}>
            <h3>Assigned Demo Call</h3>
          </div>
          <div className={styles.searchDiv}>
            <img src={searchLogo} alt="searchlogo" />
            <input
              type="text"
              className={styles.searchInput}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by Company Name"
            />
          </div>
          {data && data.length > 0 ? (
            <div className={styles.girdoverflow}>
              <DataGrid
                className={styles.dataGrid}
                sx={{ textTransform: "capitalize", minHeight: "400px" }}
                rows={
                  data && searchValue !== ""
                    ? data.filter((e) =>
                        e.companyName
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      )
                    : data
                }
                columns={columns}
                getRowId={(data) => data.callId}
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
              <h4>Untill Now, You did not created anu Demo Call</h4>
              <h4>Create a Demo Call.</h4>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Dashboard;
