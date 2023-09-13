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
  


  if (roomLoading) {
    return <Loader />;
  }

  return (
    <div className="container">
        <div className={classes.maindiv}>
      <div className={classes.headingdiv}>
        <div className={classes.titlediv}>
          <h3 className={classes.title}>Room Management</h3>
        </div>
      </div>
      <div className={classes.roomsContainer}>
        {roomData.length > 0 &&
          roomData.map((room) => <RoomCard roomDetails={room} setRoomId={setRoomId} />)}
      </div>
      <RoomPopup open={popup} roomId={roomId} titleText="Room Book" />
      </div>
    </div>
  );
};

export default Room;
