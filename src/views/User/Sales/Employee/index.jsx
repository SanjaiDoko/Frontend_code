import styles from "./index.module.css";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import searchLogo from "../../../../assets/Images/searchLogo.png";
import {
  useGetMyEmployee,
  useGetUnAssignedEmployee,
  useRemoveUser,
} from "../../../../hooks/sales";
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
  const { data: allEmployee, isLoading: employeeLoading } =
    useGetUnAssignedEmployee();

  const [searchValue, setSearchValue] = useState("");
  const { mutate } = useRemoveUser();

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
      field: "index",
      flex: 1,
      headerName: "S.No",
      width: 150,
    },
    {
      field: "username",
      flex: 1,
      headerName: "Employee Name",
      width: 150,
    },
    {
      flex: 1,
      field: "Option",
      sortable: false,
      width: 100,
      renderCell: () => (
        <button className={styles.editBtn}>{"Remove User"}</button>
      ),
    },
  ];

  if (isloading || employeeLoading) {
    return <Loader />;
  }

  // const rowClickFunction = (data) => {
  //   if (data.field === "Options") {
  //     navigate("/user/editticket/" + data.row._id);
  //   }
  // };

  const generateRowsWithIndex = (data) => {
    return data.map((row, index) => {
      return { ...row, index: index + 1 };
    });
  };

  if (data !== undefined) {
    const rowsWithIndex = generateRowsWithIndex(data);
    return (
      <div className="container">
        <div className={styles.mainDiv}>
          <div className={styles.subDiv}>
            <h3>Manage Employee</h3>
            {allEmployee.length !== 0 && (
              <button
                onClick={() => dispatch(openPopup())}
                className={styles.addTicketBtn}
              >
                Add Employee
              </button>
            )}
          </div>
          {data && data.length > 0 ? (
            <>
              <div className={styles.searchDiv}>
                <img src={searchLogo} alt="searchlogo" />
                <input
                  type="text"
                  className={styles.searchInput}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search by Employee Name"
                />
              </div>
              <div className={styles.girdoverflow}>
                <DataGrid
                  className={styles.dataGrid}
                  sx={{ textTransform: "capitalize", minHeight: "400px" }}
                  rows={
                    rowsWithIndex && searchValue !== ""
                      ? rowsWithIndex.filter((e) =>
                          e.username
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())
                        )
                      : rowsWithIndex
                  }
                  columns={columns}
                  getRowId={(rowsWithIndex) => rowsWithIndex._id}
                  hideFooterSelectedRowCount={true}
                  onCellClick={(row) => mutate(row.id)}
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
              <h4>No Employees Found Under You</h4>
            </div>
          )}
        </div>
        <EmployeePopup titleText="Add Employee" />
      </div>
    );
  }
}

export default Index;
