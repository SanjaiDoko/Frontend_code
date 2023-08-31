import { useState } from "react";
import styles from "./index.module.css";
import searchlogo from "../../../assets/Images/searchlogo.png";
import { DataGrid } from "@mui/x-data-grid";
import { useGetAllUsers } from "../../../hooks/userManagement";
import Loader from "../../../components/Loader/Loader";
import ActiveButton from "../../../components/ActiveButton/ActiveButton";
import { convertFirstLettersAsUpperCase } from "../../../helper";
import moment from "moment";
import RightDrawer from "../../../components/RightDrawer/RightDrawer";
import AddAndEditGroup from "./AddAndEditGroup";
import { useGetAllGroups } from "../../../hooks/groupManagement";

function IndividualStatusUserList() {
  const [searchValue, setSearchValue] = useState("");
  const [selectBoxValue, setSelectedBoxValue] = useState("");
  const { data, isLoading, isError, error } = useGetAllGroups();
  const { data: userList, isLoading: userLoading } = useGetAllUsers();

  function filterArray(data) {
    if (data != null) {
      return data
        .sort((left, right) =>
          moment(right.approvedOn).diff(moment(left.approvedOn))
        )
        .filter(
          (e) =>
            e.name
              .toLowerCase()
              .replace(/\s/, "")
              .includes(searchValue.toLowerCase().replace(/\s/, "")) &&
            e.userId == null
        );
    } else {
      return [];
    }
  }

  const [popup, setPopup] = useState(null);
  const [editData, setEditData] = useState(null);
  const toggleDrawer = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return setPopup(null);
    }
    setPopup(null);
  };
  const columns = [
    {
      field: "name",
      headerName: "GROUP NAME",
      flex: 1,
      valueFormatter: ({ value }) => value,
    },
    {
      field: "managedBy",
      headerName: "MANAGED BY",
      width: 180,
      flex: 1,
      valueGetter: ({ value }) => value.name,
    },
    {
      field: "users",
      headerName: "USERS",
      flex: 2,
      valueFormatter: ({ value }) => value.length,
    },
    {
      field: "status",
      headerName: "STATUS",
      flex: 1,
      renderCell: (value) => <ActiveButton status={Number(value.row.status)} />,
    },
    {
      flex: 1,
      field: "Actions",
      headerName: "ACTIONS",
      sortable: false,
      renderCell: (params) => {
        return (
          params.row.status !== 3 && (
            <button
              className={styles.editbtn}
              onClick={() => {
                setEditData(params.row);
                setPopup("edit");
              }}
            >
              Edit
            </button>
          )
        );
      },
    },
  ];

  if (isLoading || userLoading) {
    return <Loader />;
  }
  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <>
      <div className={styles.countrydiv}>
        <div className="container">
          <div className={styles.headingdiv}>
            <div className={styles.titlediv}>
              <h3 className={styles.title}>Group Management</h3>
              {userList.filter((e) => e.groupId === null).length !== 0 && (
                <button
                  className={styles.grpbtn}
                  onClick={() => setPopup(true)}
                >
                  Add Group
                </button>
              )}
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
              getRowId={(row) => row.groupId}
            />
          </div>
        </div>
      </div>
      <RightDrawer popup={popup !== null} handleDrawer={toggleDrawer}>
        {popup === true ? (
          <AddAndEditGroup
            isEdit={popup === "edit"}
            managedData={userList.filter((e) => e.status === 1)}
            // handleAlignment={handleAlignment}
            onCloseButtonClick={() => setPopup(null)}
            setPopup={setPopup}
            type="add"
          />
        ) : (
          <AddAndEditGroup
            // alignment={alignment}
            managedData={userList.filter((e) => e.status === 1)}
            // handleAlignment={handleAlignment}
            onCloseButtonClick={() => setPopup(null)}
            isEdit={popup === "edit"}
            type="edit"
            editData={editData}
          />
        )}
      </RightDrawer>
    </>
  );
}

export default IndividualStatusUserList;
