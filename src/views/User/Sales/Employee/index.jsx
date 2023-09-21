import styles from "./index.module.css";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import searchLogo from "../../../../assets/Images/searchLogo.png";
import { useGetMyEmployee } from "../../../../hooks/sales";
import Loader from "../../../../components/Loader/Loader";
import Select from "@mui/material/Select";
import EmployeePopup from "../../../../components/EmployeePopup";
import { useSelector, useDispatch } from "react-redux";
import { openPopup } from "../../../../redux/slices/roomPopup";

function Index() {
  const id = localStorage.getItem("allMasterId");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const popup = useSelector((state) => state.roomPopup.popupStatus);

  const { data, isloading } = useGetMyEmployee();

  console.log(data)

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
      field: "username",
      flex: 1,
      headerName: "username",
      width: 150,
    },
  ];

  if (isloading) {
    return <Loader />;
  }

  // const rowClickFunction = (data) => {
  //   if (data.field === "Options") {
  //     navigate("/user/editticket/" + data.row._id);
  //   }
  // };

  if (data !== undefined) {
    return (
      <div className="container">
        <div className={styles.mainDiv}>
          <div className={styles.subDiv}>
            <h3>Employee</h3>
            <button
              onClick={() =>  dispatch(openPopup())}
              className={styles.addTicketBtn}
            >
              Add Employee
            </button>
          </div>
          <div className={styles.searchDiv}>
            <img src={searchLogo} alt="searchlogo" />
            <input
              type="text"
              className={styles.searchInput}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by User Name"
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
                        e.username
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      )
                    : data
                }
                columns={columns}
                getRowId={(data) => data._id}
                hideFooterSelectedRowCount={true}
                // onCellClick={(row) => rowClickFunction(row)}
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
              <h4>Do you face any Issue ?</h4>
              <h4>Create a Ticket for the Solution.</h4>
            </div>
          )}
        </div>
        <EmployeePopup  titleText="Add Employee" />
      </div>
    );
  }
}

export default Index;
