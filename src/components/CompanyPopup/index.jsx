import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./index.css";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { closePopup } from "../../redux/slices/popupSlice";
import { Controller, useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { resolutionValidation } from "../../validationSchema/resolutaionValidation";
import { useAssignedUpdateTicket } from "../../hooks/ticketHooks";
import { useNavigate } from "react-router-dom";

export const CompanyPopup = () => {
  const userId = localStorage.getItem("allMasterId");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSuccessFunctions = () => {
    dispatch(closePopup());
    navigate("/user/myroombookings");
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
      headCount: 0,
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
                CC Mails
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
                      textTransform: "capitalize",
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
}
