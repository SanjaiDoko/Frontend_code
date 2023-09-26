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
import { useGetAllUsers } from "../../hooks/userManagement";
import Loader from "../Loader/Loader";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import { Checkbox } from "@mui/material";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
			textTransform: "capitalize",
		},
	},
};


export const RoomPopup = ({ open, titleText, roomId }) => {
  const userId = localStorage.getItem("allMasterId");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSuccessFunctions = () => {
    dispatch(closePopup());
    navigate("/room/myroombookings");
  };
  const {data: usersData, isLoading: userDataLoading} = useGetAllUsers()
  const { mutate } = useInsertRoomBooking(onSuccessFunctions);
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset
  } = useForm({
    resolver: yupResolver(bookRoomValidation),
    mode: "onTouched",
    defaultValues: {
      bookedReason: "",
      startsAt: null,
      endsAt: null,
      emailcc: [],
      headCount: "",
    },
  });

  const onSubmit = (data) => {
    data.roomId = roomId;
    data.bookedBy = userId;
    mutate(data);
  };

  if(userDataLoading){
    return <Loader />
  }

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
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
        <Button
          onClick={() => {reset();dispatch(closePopup())}}
          className={styles.closebtns}
        >
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
                    placeholder="Enter Meeting Strength"
                    onWheel={() => document.activeElement.blur()}
                  />
                )}
              />
              {errors.headCount && (
                <span className="error">{errors?.headCount?.message}</span>
              )}
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
                      sx={{ display: "block" }}
                      {...field}
                      type="date"
                      ampm={false}
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
                      sx={{ display: "block" }}
                      disabled={!Boolean(watch("startsAt"))}
                      // views={["year", "month", "day"]}
                      // format="DD-MM-YYYY"
                      ampm={false}
                      minDate={moment(watch("startsAt")) ?? null}
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
              <Form.Label id="emailcc">
              Participating Members
              </Form.Label>
              <Controller
                control={control}
                name="emailcc"
                render={({ field: { onChange, value } }) => (
                  <Select
                    fullWidth
                    id="emailcc"
                    multiple
                    displayEmpty
                    value={value}
                    onChange={onChange}
                    className={styles.costheadingSelect}
                    sx={{
                      fontSize: "14px",
                    }}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <span>Choose Users</span>;
                      }
                      return selected.join(", ");
                    }}
                    MenuProps={MenuProps}
                  >
                    {usersData &&
                      usersData.filter(user => user._id != userId).map((user) => (
                        <MenuItem key={user._id} value={user.email}>
                          <Checkbox
                            checked={
                              watch("emailcc").indexOf(user.email) > -1
                            }
                          />
                          <ListItemText primary={user.fullName} />
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
              <p className={styles.error}>{errors.emailcc?.message}</p>
            </Form.Group>
          </div>
          <div className={styles.buttonDiv}>
            <button type="submit" className={styles.yesbtn}>
              Yes
            </button>
            <button
              type="button"
              className={styles.nobtn}
              onClick={() => {reset(); dispatch(closePopup())}}
            >
              No
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
