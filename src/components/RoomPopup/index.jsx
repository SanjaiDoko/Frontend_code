import styles from "./index.module.css";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { bookRoomValidation } from "../../validationSchema/roomValidation";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
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

  const userId = localStorage.getItem("allMasterId");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSuccessFunctions = () => {
    dispatch(closePopup())
    navigate("/user/myroombookings")
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
      bookedReason: "",
      startsAt: null,
      endsAt: null,
      emailcc: "",
      headCount: 0,
    },
  });

  const onSubmit = (data) => {
    
    data.roomId = roomId;
    data.bookedBy = userId;
    data.emailcc = [data.emailcc];
    data.email = "balreddy@gmail.com";
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
          // padding: "25px 30px",
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
              <Form.Label htmlFor="bookedReason" className="formlabel">
                Booking Reason
              </Form.Label>
              <Controller
                name="bookedReason"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    style={{ textTransform: "capitalize" }}
                    type="text"
                    id="bookedReason"
                    placeholder="Enter Booking Reason"
                  />
                )}
              />
              {errors.bookedReason && (
                <span className="error">{errors.bookedReason.message}</span>
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
            <div className={styles.inputdiv}>
            <Form.Group className="pt-2">
              <Form.Label htmlFor="startsAt" className="formlabel">
                Start Date
              </Form.Label>
              <Controller
                name="startsAt"
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
              {errors.startsAt && (
                <span className="error">{errors.startsAt.message}</span>
              )}
            </Form.Group>
            <Form.Group className="pt-2">
              <Form.Label htmlFor="endsAt" className="formlabel">
                End Date
              </Form.Label>
              <Controller
                name="endsAt"
                control={control}
                render={({ field }) => (
                  <MobileDateTimePicker
                    sx={{display:"block"}}
                    disabled={!Boolean(watch('startsAt'))}
                    // views={["year", "month", "day"]}
                    // format="DD-MM-YYYY"
                    minDate={moment(watch('startsAt')) ?? null}
                    {...field}
                    type="date"
                    disablePast
                    defaultValue={null}
                  />
                )}
              />
              {errors.endsAt && (
                <span className="error">{errors.endsAt.message}</span>
              )}
            </Form.Group>
            </div>

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
