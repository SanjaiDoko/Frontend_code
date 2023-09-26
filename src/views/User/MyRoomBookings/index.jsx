import styles from "./index.module.css";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../../../components/Loader/Loader";
import { useState } from "react";
import searchLogo from "../../../assets/Images/searchLogo.png";
import {
  useCancelRoomBooking,
  useGetRoomBookingsByUserId,
} from "../../../hooks/room";
import moment from "moment";

function RoomBookings() {
  const id = localStorage.getItem("allMasterId");

  const [searchValue, setSearchValue] = useState("");

  const { data, isloading } = useGetRoomBookingsByUserId(id);

  const { mutate } = useCancelRoomBooking();

  const navigate = useNavigate();

  const returnStatus = (status) => {
    let ticketStatus = "";
    if (status == 0) {
      ticketStatus = "Canceled";
    }
    if (status == 1) {
      ticketStatus = "Upcoming";
    }
    if (status == 2) {
      ticketStatus = "InProgress";
    }
    if (status == 3) {
      ticketStatus = "Completed";
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
      field: "startsAt",
      flex: 1,
      headerName: "Start Time",
      width: 200,
      renderCell: (params) => {
        return moment(params.row.startsAt).format("DD-MM-YYYY hh:mm A");
      },
    },
    {
      field: "endsAt",
      flex: 1,
      headerName: "End Time",
      width: 200,
      renderCell: (params) => {
        return moment(params.row.endsAt).format("DD-MM-YYYY hh:mm A");
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
      renderCell: (params) => {
        let status = params.row.status;
        let data = {
          id: params.row.bookingId,
        };
        return (
          <>
            {status ? (
              <button
                disabled={status === 2}
                onClick={(e, params) => mutate(data)}
                className={styles.editBtn}
              >
                Cancel
              </button>
            ) : (
              <button className={styles.cancelBtn}>Canceled</button>
            )}
          </>
        );
      },
    },
  ];

  if (isloading) {
    return <Loader />;
  }

  if (data !== undefined) {
    return (
      <div className="container">
        <div className={styles.mainDiv}>
          <h3>My Room Bookings</h3>
            {data && data.length > 0 &&
          <div className={styles.searchDiv}>
            <img src={searchLogo} alt="searchlogo" />
            <input
              type="text"
              className={styles.searchInput}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by Room Name"
            />
          </div>
  }
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
              <h4>Until now, You don't have any Room Bookings.</h4>
              <h4>You need Room, Book Now !</h4>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default RoomBookings;
