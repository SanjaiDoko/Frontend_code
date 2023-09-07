/* eslint-disable react/prop-types */
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
import { useUpdateTicket } from "../../hooks/ticketHooks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CommanPopup({ uniqueTicketData, contentText, titleText }) {
  const popupStatus = useSelector((state) => state.popup.popupStatus);
  const navigate = useNavigate();

  const onSuccess = () => {
    navigate("/user/dashboard/");
  };
  const { mutate } = useUpdateTicket(onSuccess);
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resolutionValidation),
    mode: "onTouched",
    defaultValues: {
      problem: "",
      resolution: "",
    },
  });

  const onSubmit = (data) => {
    let payload = uniqueTicketData;
    payload.id = uniqueTicketData._id
      ? uniqueTicketData._id
      : uniqueTicketData.id;
    delete payload._id;
    payload.problem = data.problem;
    payload.resolution = data.resolution;
    payload.status = 1;
    console.log(uniqueTicketData, "uniuu");
    console.log(payload, "ffff");
    if (payload.actualEndTime && payload.timeLog) {
      mutate(payload);
      dispatch(closePopup());
    } else {
      toast.error("Actual End time and Time log can not be empty");
      dispatch(closePopup());
    }
  };

  return (
    <Dialog
      open={popupStatus}
      fullWidth
      maxWidth="xs"
      onClose={() => dispatch(closePopup())}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" className="titletext">
        <p className="title">{titleText}</p>
        <Button onClick={() => dispatch(closePopup())} className="closebtns">
          <AiOutlineClose />
        </Button>
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="contenttxt" id="alert-dialog-description">
          <p className="contentText">{contentText}</p>
        </DialogContentText>
        <DialogContentText className="contenttxt" id="alert-dialog-description">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ margin: "10px" }}>
              <Form.Group className="pt-2">
                <Form.Label htmlFor="problem" className="formlabel">
                  Problem
                </Form.Label>
                <Controller
                  name="problem"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="text"
                      id="problem"
                      placeholder="Enter Problem "
                    />
                  )}
                />
                {errors.problem && (
                  <span style={{ color: "red" }}>{errors.problem.message}</span>
                )}
              </Form.Group>
              <Form.Group className="pt-2">
                <Form.Label htmlFor="resolution" className="formlabel">
                  Resolution
                </Form.Label>
                <Controller
                  name="resolution"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="text"
                      id="resolution"
                      placeholder="Enter Resolution"
                    />
                  )}
                />
                {errors.resolution && (
                  <span style={{ color: "red" }}>
                    {errors.resolution.message}
                  </span>
                )}
              </Form.Group>
            </div>
            <div className="buttonDiv">
              <button type="submit" className="yesbtn">
                Yes
              </button>
              <button
                type="button"
                className="nobtn"
                onClick={() => dispatch(closePopup())}
              >
                No
              </button>
            </div>
          </form>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
export default CommanPopup;
