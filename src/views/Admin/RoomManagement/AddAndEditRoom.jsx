import { Form } from "react-bootstrap";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ReactComponent as CloseIcon } from "../../../assets/Icons/closeIcon.svg";
import styles from "./index.module.css";
import { createRoomValidation } from "../../../validationSchema/roomValidation";
import { MdDeleteForever } from "react-icons/md";
import { useEffect, useState } from "react";
import Loader from "../../../components/Loader/Loader";
import { CircularProgress } from "@mui/material";
import { useInsertRoom, useUpdateRoom } from "../../../hooks/room";

const AddAndEditRoom = ({ onCloseButtonClick, editData, isEdit, type }) => {

  const { mutate: insertMutate, isLoading: insertLoading } =
    useInsertRoom(onCloseButtonClick);

  const { mutate: updateMutate, isLoading: updateLoading } =
    useUpdateRoom(onCloseButtonClick);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(createRoomValidation),
    mode: "onTouched",
    defaultValues: {
      roomNo: isEdit ? editData.roomNo : "",
      roomName: isEdit ? editData.roomName : "",
      status: isEdit ? `${editData.status}` : "1",
    },
  });

  function onSubmit(data) {
    data.status = parseInt(data.status);
    if (isEdit) {
      data.id = editData.roomId;
      updateMutate(data);
    } else {
      insertMutate(data);
    }
  }
  if (insertLoading || updateLoading) {
    return <Loader />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.addDiv}>
      <div>
        <div className={styles.addDivHeading}>
          <div>
            <h3 className={styles.addtitle}>{isEdit ? "Edit" : "Add"} Room</h3>
          </div>
          <CloseIcon
            type="button"
            onClick={() => {
              onCloseButtonClick();
            }}
            style={{ cursor: "pointer" }}
          />
        </div>
        <Form.Group className="pt-2">
          <Form.Label htmlFor="roomNo" className="formlabel">
            Room Number
          </Form.Label>
          <Controller
            name="roomNo"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                style={{ textTransform: "capitalize" }}
                type="text"
                id="roomNo"
                placeholder="Enter Room Number"
              />
            )}
          />
          {errors.roomNo && (
            <span className="error">{errors.roomNo.message}</span>
          )}
        </Form.Group>
        <Form.Group className="pt-2">
          <Form.Label htmlFor="roomName" className="formlabel">
            Room Name
          </Form.Label>
          <Controller
            name="roomName"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                style={{ textTransform: "capitalize" }}
                type="text"
                id="roomName"
                placeholder="Enter Room Name"
              />
            )}
          />
          {errors.roomName && (
            <span className="error">{errors.roomName.message}</span>
          )}
        </Form.Group>
        <div className="pt-4">
          <ToggleButtonGroup
            sx={{ width: "100%" }}
            // value={alignment}
            exclusive
            // onChange={handleAlignment}
            aria-label="text alignment"
            className="togglebtn"
          >
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <ToggleButton
                  {...field}
                  sx={{ width: "50%" }}
                  selected={field.value === "1"}
                  className="togglechildbtn"
                  value="1"
                  aria-label="left aligned"
                >
                  Active
                </ToggleButton>
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <ToggleButton
                  {...field}
                  sx={{ width: "50%" }}
                  selected={field.value === "2"}
                  className="togglechildbtn"
                  value="2"
                  aria-label="centered"
                >
                  Deactive
                </ToggleButton>
              )}
            />
          </ToggleButtonGroup>
        </div>
      </div>
      <button
        className={styles.savebtn}
        type="submit"
        // disabled={insertLoading || updateLoading}
      >
        {false || false ? (
          <CircularProgress />
        ) : isEdit ? (
          "Update Room"
        ) : (
          "Add Room"
        )}
      </button>
    </form>
  );
};

export default AddAndEditRoom;
