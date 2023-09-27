import { useState } from "react";
import styles from "./index.module.css";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import searchlogo from "../../../assets/Images/searchlogo.png";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { openSidebar } from "../../../redux/slices/sidebarSlice";
import { useGetAllUsers, useMutateUser } from "../../../hooks/userManagement";
import Loader from "../../../components/Loader/Loader";
import ActiveButton from "../../../components/ActiveButton/ActiveButton";
import { convertFirstLettersAsUpperCase } from "../../../helper";
import moment from "moment";
import { Switch } from "@mui/material";

function IndividualStatusUserList() {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const sidebar = useSelector((state) => state.sidebar);
  const { data, isLoading, isError, error } = useGetAllUsers();

  const { mutate } = useMutateUser();

  function filterArray(data) {
    if (data != null) {
      return data
        .sort((left, right) =>
          moment(right.approvedOn).diff(moment(left.approvedOn))
        )
        .filter(
          (e) =>
            e.fullName &&
            e.fullName
              .toLowerCase()
              .replace(/\s/, "")
              .includes(searchValue.trim().toLowerCase().replace(/\s/, "")) &&
            e.userId == null
        );
    } else {
      return [];
    }
  }

  function handleChange(params) {
    const data = {
      id: params._id,
      status: params.status === 1 ? 2 : 1,
    };
    mutate(data);
  }

  function handleStatus(row) {
    var statusState = "";
    if (row.status === 1) {
      statusState = "Active";
    }
    if (row.status === 1 && row.groupId === null) {
      statusState = "Group not Assigned";
    }
    if (row.status === 2) {
      statusState = "InActive";
    }
    return statusState;
  }

  const columns = [
    {
      field: "fullName",
      headerName: "FULL NAME",
      flex: 1,
      valueFormatter: ({ value }) => convertFirstLettersAsUpperCase(value),
    },
    { field: "mobileNumber", headerName: "MOBILE", width: 180 },
    {
      field: "email",
      headerName: "EMAIL",
      flex: 2,
    },
    {
      field: "status",
      headerName: "STATUS",
      flex: 1,
      renderCell: (value) => handleStatus(value.row),
      // <ActiveButton status={value.row.status}
    },
    {
      flex: 1,
      field: "Actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => {
        return (
          params.row.status !== 3 && (
            <Switch
              disabled={params.row.status === 3}
              inputProps={{ "aria-label": "controlled" }}
              checked={params.row.status === 1}
              onClick={() => handleChange(params.row)}
            />
          )
        );
      },
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className={styles.countrydiv}>
      <div className="container">
        <div className={styles.headingdiv}>
          <div className={styles.titlediv}>
            {!sidebar.sidebarStatus && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={() => dispatch(openSidebar())}
                className="icon"
              >
                <MenuIcon />
              </IconButton>
            )}
            <h3 className={styles.title}>User Management</h3>
          </div>
        </div>
        <div className={styles.searchdiv}>
          <div className={styles.searchbox}>
            <img src={searchlogo} alt="searchlogo" />
            <input
              type="text"
              placeholder="Search by Full Name"
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
        <div
          style={{
            width: "100%",
            marginTop: "10px",
            borderRadius: "5px",
          }}
        >
          <div className={styles.girdoverflow}>
            <DataGrid
              sx={{ minHeight: "350px" }}
              className={styles.dataGrid}
              rows={filterArray(data)}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10]}
              loading={isLoading}
              getRowId={(row) => row._id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndividualStatusUserList;
