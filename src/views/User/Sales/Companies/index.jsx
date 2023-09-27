import styles from "./index.module.css";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import searchLogo from "../../../../assets/Images/searchLogo.png";
import {
  useGetAllCompanies,
  useGetEmployeeById,
  useInsertSales,
  useUpdateCompany,
} from "../../../../hooks/sales";
import Loader from "../../../../components/Loader/Loader";
import AssignEmployeePopup from "../../../../components/AssignEmployeePopup";
import { useDispatch } from "react-redux";
import { openPopup } from "../../../../redux/slices/roomPopup";

function Dashboard() {
  const id = localStorage.getItem("allMasterId");
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const dispatch = useDispatch();
  const { data, isloading } = useGetAllCompanies();
  const { mutate } = useUpdateCompany();
  const onSuccess = () => {
    // navigate("/user/salescall");
  };
  const { mutate: insertSales } = useInsertSales(onSuccess);

  const { data: employeeData, isloading: employeeLoading } =
  useGetEmployeeById();

  const [searchValue, setSearchValue] = useState("");

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
      field: "companyName",
      flex: 1,
      headerName: "Company Name",
      width: 150,
    },
    {
      field: "contact",
      flex: 1,
      headerName: "Mobile Number",
      width: 200,
    },
    {
      field: "status",
      flex: 1,
      headerName: "Status",
      width: 200,
      renderCell: (params) => {
        if (params.row.status === 2) {
          return "Assigned";
        } else {
          return "Not Assigned";
        }
      },
    },
    {
      flex: 1,
      field: "Option",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        return (
          <button
            className={styles.editBtn}
            disabled={params.row.status === 2}
            onClick={() => mutate({ id: params.row._id })}
          >
            Delete
          </button>
        );
      },
    },
  ];

  if (isloading || employeeLoading) {
    return <Loader />;
  }

  const generateRowsWithIndex = (data) => {
    return data
      .filter((item) => item.status != 0)
      .map((row, index) => {
        return { ...row, index: index + 1 };
      });
  };

  if (data !== undefined) {
    const rowsWithIndex = generateRowsWithIndex(data);
    return (
      <div className="container">
        <div className={styles.mainDiv}>
          <div className={styles.subDiv}>
            <h3 style={{ flex: 2 }}>Manage Company</h3>
            {selectedRows.length !== 0 && employeeData.length !== 0 && (
              <button
                style={{ marginRight: "10px" }}
                // onClick={() => navigate("/user/addCompany")}
                className={styles.addTicketBtn}
                onClick={() => dispatch(openPopup())}
              >
                Assign Sales Call
              </button>
            )}
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
          {console.log(data)}
          {data && data.length > 0 ? (
            <div className={styles.girdoverflow}>
              <DataGrid
                className={styles.dataGrid}
                sx={{ textTransform: "capitalize", minHeight: "400px" }}
                rows={
                  rowsWithIndex && searchValue !== ""
                    ? rowsWithIndex.filter((e) =>
                        e.companyName
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      )
                    : rowsWithIndex
                }
                columns={columns}
                checkboxSelection
                disableRowSelectionOnClick
                isRowSelectable={(params) => params.row.status ===1}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                  setSelectedRows(newRowSelectionModel);
                  const filteredArray = data.filter((obj) =>
                    newRowSelectionModel.includes(obj._id)
                  );
                  setSelectedRowsData(filteredArray, "filtered");
                }}
                getRowId={(rowsWithIndex) => rowsWithIndex._id}
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
              <h4>Still, You Did not Added Any Company</h4>
            </div>
          )}
        </div>

        <AssignEmployeePopup
          titleText="Assign Sales Call"
          content="Are You Sure You Want To Assign This Employee for the Selected company"
          rowId={selectedRows}
          rowData={selectedRowsData}
        />
      </div>
    );
  }
}

export default Dashboard;
