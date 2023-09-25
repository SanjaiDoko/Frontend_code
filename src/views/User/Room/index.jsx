import React, { useState } from "react";
import { useGetAllRooms } from "../../../hooks/room";
import Loader from "../../../components/Loader/Loader";
import { RoomCard } from "../../../components/RoomCard";
import classes from "./index.module.css";
import { useSelector, useDispatch } from "react-redux";
import { openPopup } from "../../../redux/slices/roomPopup";
import { RoomPopup } from "../../../components/RoomPopup";


const Room = () => {
  const { data: roomData, isLoading: roomLoading } = useGetAllRooms();
  const popup = useSelector((state) => state.roomPopup.popupStatus);
  const [roomId,setRoomId] = useState("")
  
  if (!roomLoading) {
    return <Loader />;
  }

  return (
    <div className="container">
        <div className={classes.maindiv}>
      <div className={classes.headingdiv}>
        <div className={classes.titlediv}>
          <h3 className={classes.title}>Room Booking</h3>
        </div>
      </div>
      {roomData ? 
      <div className={classes.roomsContainer}>
        { roomData && roomData.length > 0 &&
          roomData.map((room) => <RoomCard key={room.roomId} roomDetails={room} setRoomId={setRoomId} />)}
      </div>
      :
      <div className={classes.nodata}>
        <h3>No Rooms found</h3>
      </div>
      }
      <RoomPopup open={popup} roomId={roomId} titleText="Room Book" />
      </div>
    </div>
  );
};

export default Room;
