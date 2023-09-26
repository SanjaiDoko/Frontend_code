import styles from "./index.module.css";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../../../components/Loader/Loader";
import { useState } from "react";
import { useGetRoomBookingsDetails } from "../../../hooks/room";
import { useParams } from "react-router-dom";
import moment from "moment";

function RoomBookingDetail() {
  const { id: roomId } = useParams();
  const [searchValue, setSearchValue] = useState("");

  const { data, isloading } = useGetRoomBookingsDetails(roomId);

  const returnStatus = (status) => {
    let ticketStatus = "";
    if (status == 1) {
      ticketStatus = "Upcoming";
    }
    if (status == 2) {
      ticketStatus = "In Progress";
    }
    if (status == 3) {
      ticketStatus = "Completed";
    }
    return ticketStatus;
  };

  const columns = [
    {
      field: "userBooked",
      flex: 1,
      headerName: "Booked Person",
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
      field: "bookingReason",
      flex: 1,
      headerName: "Booking Reason",
      width: 200,
      renderCell: (params) => {
        return params.row.bookedReason;
      },
    },
    {
      field: "status",
      flex: 1,
      headerName: "Status",
      width: 200,
      renderCell: (value) => returnStatus(value.row.status),
    },
  ];

  if (isloading) {
    return <Loader />;
  }

  if (data !== undefined) {
    return (
      <div className="container">
        <div className={styles.mainDiv}>
          <h3>Room Booking Details</h3>
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
              <h4>Until now, These room don't have any future meetings.</h4>
              <h4>You need Room, Book Now !</h4>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default RoomBookingDetail;
