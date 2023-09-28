import { useState } from "react";
import styles from "./index.module.css";
import searchlogo from "../../../assets/Images/searchlogo.png";
import { DataGrid } from "@mui/x-data-grid";
import { useGetAllUsers } from "../../../hooks/userManagement";
import Loader from "../../../components/Loader/Loader";
import ActiveButton from "../../../components/ActiveButton/ActiveButton";
import moment from "moment";
import RightDrawer from "../../../components/RightDrawer/RightDrawer";
import AddAndEditGroup from "./AddAndEditGroup";
import { useGetAllGroups } from "../../../hooks/groupManagement";

function IndividualStatusUserList() {
  const [searchValue, setSearchValue] = useState("");
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
              .includes(searchValue.trim().toLowerCase().replace(/\s/, "")) &&
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
      renderCell: (value) => {
        return (
          <p style={{ textTransform: "capitalize" }}>
            {value.row.managedBy.name ?? ""}
          </p>
        );
      },
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
              <button className={styles.grpbtn} onClick={() => setPopup(true)}>
                Add Group
              </button>
            </div>
          </div>

          {data && data.length > 0 && (
            <>
              <div className={styles.searchdiv}>
                <div className={styles.searchbox}>
                  <img src={searchlogo} alt="searchlogo" />
                  <input
                    type="text"
                    placeholder="Search by Group Name"
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
                    className={styles.dataGrid}
                    sx={{ minHeight: "350px" }}
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
            </>
          )}
        </div>
      </div>
      <RightDrawer popup={popup !== null} handleDrawer={toggleDrawer}>
        {popup === true ? (
          <AddAndEditGroup
            isEdit={popup === "edit"}
            managedData={userList.filter((e) => e.status === 1)}
            onCloseButtonClick={() => setPopup(null)}
            setPopup={setPopup}
            type="add"
          />
        ) : (
          <AddAndEditGroup
            managedData={userList.filter((e) => e.status === 1)}
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
