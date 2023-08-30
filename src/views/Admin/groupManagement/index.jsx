import { useState } from "react";
import styles from "./index.module.css";
import searchlogo from "../../../assets/Images/searchlogo.png";
import { DataGrid } from "@mui/x-data-grid";
import { useGetAllUsers, useMutateUser } from "../../../hooks/userManagement";
import Loader from "../../../components/Loader/Loader";
import ActiveButton from "../../../components/ActiveButton/ActiveButton";
import { convertFirstLettersAsUpperCase } from "../../../helper";
import moment from "moment";
import { Switch } from "@mui/material";

function IndividualStatusUserList() {
  const [searchValue, setSearchValue] = useState("");
  const [selectBoxValue, setSelectedBoxValue] = useState("");
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
            e.fullName
              .toLowerCase()
              .replace(/\s/, "")
              .includes(searchValue.toLowerCase().replace(/\s/, "")) &&
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

  const columns = [
    {
      field: "fullName",
      headerName: "FULL NAME",
      flex: 1,
      valueFormatter: ({ value }) => convertFirstLettersAsUpperCase(value),
    },
    { field: "mobileNumber", headerName: "MOBILE", width: 180, flex: 1 },
    {
      field: "email",
      headerName: "EMAIL",
      flex: 2,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (value) => <ActiveButton status={value.row.status} />,
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
            <h3 className={styles.title}>Group Management</h3>
            <button className={styles.grpbtn}>Add Group</button>
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
          <div className={styles.selectbox}>
            <h4>Filter by</h4>
            <div>
              <select
                style={{ background: "transparent" }}
                value={selectBoxValue}
                id="filterSelect"
                className={styles.selectuser}
                onChange={(e) => {
                  setSelectedBoxValue(e.target.value);
                }}
              >
                <option value={""}>Active</option>
                <option value={1}>Inactive</option>
              </select>
            </div>
          </div>
          {/* )} */}
        </div>
        <div
          style={{
            height: 430,
            width: "100%",
            marginTop: "10px",
            borderRadius: "5px",
          }}
        >
          <DataGrid
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
  );
}

export default IndividualStatusUserList;
