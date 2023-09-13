import styles from "./index.module.css";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../../../components/Loader/Loader";
import { useState } from "react";
import searchLogo from "../../../assets/Images/searchLogo.png";
import { useGetRoomBookingsByUserId } from "../../../hooks/room";
import moment from "moment";


function RoomBookings() {
  const id = localStorage.getItem("allMasterId");

  const [searchValue, setSearchValue] = useState("");

  const { data, isloading } = useGetRoomBookingsByUserId(id);

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
      field: "roomNo",
      flex: 1,
      headerName: "Room No",
      width: 150,
    },
    {
      field: "roomName",
      flex: 1,
      headerName: "Room Name",
      width: 150,
    },
    {
      field: "date",
      flex: 1,
      headerName: "Date",
      width: 150,
      renderCell: (params) => {
        return moment(params.row.startsAt).format("DD-MM-YYYY");
      },
    },
    {
      field: "startsAt",
      flex: 1,
      headerName: "Start Time",
      width: 200,
      renderCell: (params) => {
        return moment(params.row.startsAt).format("HH:MM");
      },
    },
    {
      field: "endsAt",
      flex: 1,
      headerName: "End Time",
      width: 200,
      renderCell: (params) => {
        return moment(params.row.endsAt).format("HH:MM");
      },
    },
    {
      field: "status",
      flex: 1,
      headerName: "Status",
      width: 200,
      renderCell: (params) => returnStatus(params.row.status),
    },
    {
      flex: 1,
      field: "Options",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <button className={styles.editBtn}>
          Cancel
        </button>
      ),
    },
  ];

  if (isloading) {
    return <Loader />;
  }

  const rowClickFunction = (data) => {
    if (data.field === "Options") {
      navigate("/user/updatemanageticket/" + data.row._id);
    }
  };

  console.log(data,"data")

  if (data !== undefined) {
    return (
      <div className="container">
        <div className={styles.mainDiv}>
          <h3>My Room Bookings</h3>
          <div className={styles.searchDiv}>
            <img src={searchLogo} alt="searchlogo" />
            <input
              type="text"
              className={styles.searchInput}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by Room Name"
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
                        e.roomName
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      )
                    : data
                }
                columns={columns}
                getRowId={(data) => data.bookingId}
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
  }
}

export default RoomBookings;
