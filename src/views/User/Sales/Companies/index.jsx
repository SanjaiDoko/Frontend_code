import styles from "./index.module.css";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import searchLogo from "../../../../assets/Images/searchLogo.png";
import { useGetAllCompanies } from "../../../../hooks/sales";
import Loader from "../../../../components/Loader/Loader";

function Dashboard() {
  const id = localStorage.getItem("allMasterId");
  const navigate = useNavigate();
  

  const { data, isloading } = useGetAllCompanies();

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
      field: "contact",
      flex: 1,
      headerName: "Contact",
      width: 200,
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
            <h3>Companies</h3>
            <button
              onClick={() => navigate("/user/addCompany")}
              className={styles.addTicketBtn}
            >
              Add Company
            </button>
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
      </div>
    );
  }
}

export default Dashboard;
