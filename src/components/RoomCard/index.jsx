import React from "react";
import classes from './index.module.css'
import { openPopup } from "../../redux/slices/roomPopup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const RoomCard = ({ roomDetails, setRoomId }) => {
  console.log(roomDetails,"roomDe")
    const dispatch = useDispatch()
    const navigate = useNavigate()
  return (
    <div className={classes.roomCard}>
      <div className="roomContentContainer">
        <div className={classes.roomContentItem}>
          <p className={classes.label}>Room Number</p>
          <p>: {roomDetails.roomNo}</p>
        </div>
        <div className={classes.roomContentItem}>
          <p className={classes.label}>Room Name</p>
          <p>: {roomDetails.roomName}</p>
        </div>
      </div>

      <div className={classes.roomBootonContainer}>
        <button className="primaryBtn" onClick={() => { setRoomId(roomDetails.roomId); dispatch(openPopup())}}>Book Now</button>
        <button className="secondaryBtn" onClick={() => { navigate("/user/roombookingdetails/" + roomDetails.roomId)}}>Booking Details</button>
      </div>
    </div>
  );
};
