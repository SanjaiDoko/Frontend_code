import React from "react";
import styles from "./index.module.css";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { bookRoomValidation } from "../../validationSchema/roomValidation";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { AiOutlineClose } from "react-icons/ai";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { closePopup } from "../../redux/slices/roomPopup";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { useDispatch } from "react-redux";
import { useInsertRoomBooking } from "../../hooks/room";
import moment from "moment";

export const RoomPopup = ({ open, titleText, roomId }) => {
  console.log(roomId, "roomId");
  const userId = localStorage.getItem("allMasterId");
  const dispatch = useDispatch();

  const onSuccessFunctions = () => {
    console.log("succres");
  };
  const { mutate } = useInsertRoomBooking(onSuccessFunctions);
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch
  } = useForm({
    resolver: yupResolver(bookRoomValidation),
    mode: "onTouched",
    defaultValues: {
      bookingFor: "",
      description: "",
      startDate: null,
      endDate: null,
      emailcc: "",
      headCount: 0,
    },
  });

  const onSubmit = (data) => {
    data.roomId = roomId;
    data.bookedBy = userId;
    data.emailcc = [data.emailcc];
    data.email = "balreddy@gmail.com";
    console.log(data, "data");
    mutate(data);
  };
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      onClose={() => dispatch(closePopup())}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={styles.maindiv}
      PaperProps={{
        style: {
          padding: "25px 30px",
        },
      }}
    >
      <DialogTitle id="alert-dialog-title" className={styles.titletext}>
        <p className={styles.title}>{titleText}</p>
        <Button onClick={() => dispatch(closePopup())} className={styles.closebtns}>
          <AiOutlineClose />
        </Button>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.addDiv}>
          <div>
            <Form.Group className="pt-2">
              <Form.Label htmlFor="bookingFor" className="formlabel">
                Booking Reason
              </Form.Label>
              <Controller
                name="bookingFor"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    style={{ textTransform: "capitalize" }}
                    type="text"
                    id="bookingFor"
                    placeholder="Enter Booking Reason"
                  />
                )}
              />
              {errors.bookingFor && (
                <span className="error">{errors.bookingFor.message}</span>
              )}
            </Form.Group>
            <Form.Group className="pt-2">
              <Form.Label htmlFor="description" className="formlabel">
                Booking Description
              </Form.Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    style={{ textTransform: "capitalize" }}
                    type="text"
                    id="description"
                    placeholder="Enter Booking Description"
                  />
                )}
              />
              {errors.description && (
                <span className="error">{errors.description.message}</span>
              )}
            </Form.Group>
            <Form.Group className="pt-2">
              <Form.Label htmlFor="headCount" className="formlabel">
                Meeting Strength
              </Form.Label>
              <Controller
                name="headCount"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    style={{ textTransform: "capitalize" }}
                    type="number"
                    id="headCount"
                    placeholder="Enter CC Mails"
                  />
                )}
              />
            </Form.Group>
            <Form.Group className="pt-2">
              <Form.Label htmlFor="startDate" className="formlabel">
                Start Date
              </Form.Label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <MobileDateTimePicker
                    // views={["year", "month", "day"]}
                    // format="DD-MM-YYYY"
                    sx={{display:"block"}}
                    {...field}
                    type="date"
                    disablePast
                    defaultValue={null}
                  />
                )}
              />
              {errors.startDate && (
                <span className="error">{errors.startDate.message}</span>
              )}
            </Form.Group>
            <Form.Group className="pt-2">
              <Form.Label htmlFor="endDate" className="formlabel">
                End Date
              </Form.Label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <MobileDateTimePicker
                    sx={{display:"block"}}
                    // views={["year", "month", "day"]}
                    // format="DD-MM-YYYY"
                    minDate={moment(watch('startDate'))}
                    {...field}
                    type="date"
                    disablePast
                    defaultValue={null}
                  />
                )}
              />
              {errors.endDate && (
                <span className="error">{errors.endDate.message}</span>
              )}
            </Form.Group>

            <Form.Group className="pt-2">
              <Form.Label htmlFor="emailcc" className="formlabel">
                CC Mail
              </Form.Label>
              <Controller
                name="emailcc"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    style={{ textTransform: "capitalize" }}
                    type="text"
                    id="emailcc"
                    placeholder="Enter CC Mails"
                  />
                )}
              />
            </Form.Group>
          </div>
          <div className={styles.buttonDiv}>
            <button type="submit" className={styles.yesbtn}>
              Yes
            </button>
            <button
              type="button"
              className={styles.nobtn}
              onClick={() => dispatch(closePopup())}
            >
              No
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
