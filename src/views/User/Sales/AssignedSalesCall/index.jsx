import styles from "./index.module.css";
// import { useGetManageTicketById } from "../../../hooks/ticketHooks";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import searchLogo from "../../../../assets/Images/searchLogo.png";
import Loader from "../../../../components/Loader/Loader";
import {  useGetSalesCallByAssignee } from "../../../../hooks/sales";
import moment from "moment";

function Index() {
  const id = localStorage.getItem("allMasterId");

  const role = useSelector((state) => state.profile.role);

  const [searchValue, setSearchValue] = useState("");

  const { data, isloading } = useGetSalesCallByAssignee();

  console.log(data)

  const navigate = useNavigate();

  const returnStatus = (status) => {
    let ticketStatus = "";
    if (status == 0) {
      ticketStatus = "Not Assigned";
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
      field: "assignedBy",
      flex: 1,
      headerName: "Assigne By",
      width: 150,
    },
    {
      field: "assignedOn",
      flex: 1,
      headerName: "assignedOn",
      width: 150,
      renderCell: (params) => moment(params.row.eodDate).format("DD-MM-YYYY"),
    },
    {
      field: "status",
      flex: 1,
      headerName: "status",
      width: 150,
      
    },
    {
      flex: 1,
      field: "Options",
      sortable: false,
      width: 100,
      renderCell: () => (
        <button className={styles.editBtn}>
          { "Update Report"}
        </button>
      ),
    },
  ];

  if (isloading) {
    return <Loader />;
  }

  const rowClickFunction = (data) => {
    console.log(data)
    if (data.field === "Options") {
      navigate("/user/updateassginedsalescall/" + data.row.callId);
    }
  };

  // if (data !== undefined) {
    return (
      <div className="container">
        <div className={styles.mainDiv}>
          <h3>Assigned Sales Call</h3>
          <div className={styles.searchDiv}>
            <img src={searchLogo} alt="searchlogo" />
            <input
              type="text"
              className={styles.searchInput}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by Ticket ID"
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
              <h4>Until now, You have not received any tickets to solve.</h4>
              <h4>Please wait for one to be created</h4>
            </div>
          )}
        </div>
      </div>
    );
  // }
}

export default Index;
