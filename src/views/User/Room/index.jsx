import { useState } from "react";
import { useGetAllRooms } from "../../../hooks/room";
import Loader from "../../../components/Loader/Loader";
import { RoomCard } from "../../../components/RoomCard";
import classes from "./index.module.css";
import { useSelector } from "react-redux";
import { RoomPopup } from "../../../components/RoomPopup";
import { TbMoodEmpty } from "react-icons/tb";

const Room = () => {
  const { data: roomData, isLoading: roomLoading } = useGetAllRooms();
  const popup = useSelector((state) => state.roomPopup.popupStatus);
  const [roomId, setRoomId] = useState("");

  if (roomLoading) {
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
        {roomData && roomData.length > 0 ? (
          <div className={classes.roomsContainer}>
            {roomData &&
              roomData.length > 0 &&
              roomData
                .filter((e) => e.status === 1)
                ?.map((room) => (
                  <RoomCard
                    key={room.roomId}
                    roomDetails={room}
                    setRoomId={setRoomId}
                  />
                ))}
          </div>
        ) : (
          <div className={classes.nodatafound}>
            <h4>Looks Empty</h4>
            <TbMoodEmpty style={{ fontSize: "30px" }} />
          </div>
        )}
        <RoomPopup open={popup} roomId={roomId} titleText="Room Book" />
      </div>
    </div>
  );
};

export default Room;
