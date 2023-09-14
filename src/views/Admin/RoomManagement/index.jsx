import { useState } from "react";
import styles from "./index.module.css";
import searchlogo from "../../../assets/Images/searchlogo.png";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../../../components/Loader/Loader";
import RightDrawer from "../../../components/RightDrawer/RightDrawer";
import { useGetAllRooms } from "../../../hooks/room";
import AddAndEditRoom from './AddAndEditRoom'

const RoomManagement = () => {
  const [searchValue, setSearchValue] = useState("");
  const { data: roomData, isLoading: roomLoading } = useGetAllRooms();
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
      field: "roomNo",
      headerName: "ROOM NO",
      flex: 1,
      valueFormatter: ({ value }) => value,
    },
    {
      field: "roomName",
      headerName: "ROOM NAME",
      width: 180,
      flex: 1,
      valueGetter: ({ value }) => value,
    },
    {
      field: "status",
      headerName: "STATUS",
      flex: 1,
      renderCell: (value) => { console.log(value.value,"value"); return value.value === 1 ? "Active" : "Inactive"} ,
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

  if (roomLoading) {
    return <Loader />;
  }
 

  return (
    <>
      <div className={styles.countrydiv}>
        <div className="container">
          <div className={styles.headingdiv}>
            <div className={styles.titlediv}>
              <h3 className={styles.title}>Room Management</h3>
                <button
                  className={styles.grpbtn}
                  onClick={() => setPopup(true)}
                >
                  Add Room
                </button>
            </div>
          </div>
          <div className={styles.searchdiv}>
            <div className={styles.searchbox}>
              <img src={searchlogo} alt="searchlogo" />
              <input
                type="text"
                placeholder="Search by Room Name"
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
          <div
            style={{
              height: 430,
              width: "100%",
              marginTop: "10px",
              borderRadius: "5px",
            }}
          >
            <div className={styles.girdoverflow}>
              <DataGrid
                className={styles.dataGrid}
                sx={{ textTransform: "capitalize" }}
                rows={ roomData && roomData.length > 0 && searchValue !== ""
                ? roomData.filter((e) =>
                    e.roomName
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  )
                : roomData}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[10]}
                loading={roomLoading}
                getRowId={(row) => row.roomId}
              />
            </div>
          </div>
        </div>
      </div>
      <RightDrawer popup={popup !== null} handleDrawer={toggleDrawer}>
        {popup === true ? (
          <AddAndEditRoom
            isEdit={popup === "edit"}
            // handleAlignment={handleAlignment}
            onCloseButtonClick={() => setPopup(null)}
            setPopup={setPopup}
            type="add"
          />
        ) : (
          <AddAndEditRoom
            // alignment={alignment}
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

export default RoomManagement;
