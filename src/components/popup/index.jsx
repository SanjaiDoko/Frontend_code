/* eslint-disable react/prop-types */
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
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

function CommanPopup({
  popUpState,
  setPopupState,
  handleAgree,
  contentText,
  titleText,
}) {
  const popupStatus = useSelector((state) => state.popup.popupStatus);

  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(),
    mode: "onTouched",
    defaultValues: {
      issueName: "",
      issueGroup: "",
    },
  });

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setPopupState({ ...popUpState, [name]: value });
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
        <p>{titleText}</p>
        <Button onClick={() => dispatch(closePopup())} className="closebtns">
          <AiOutlineClose />
        </Button>
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="contenttxt" id="alert-dialog-description">
          {contentText}
        </DialogContentText>
        <DialogContentText className="contenttxt" id="alert-dialog-description">
          <form onSubmit={handleSubmit()}></form>
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
                    required
                    id="issueName"
                    placeholder="Enter Problem "
                    onChange={(e) => handleChange(e)}
                  />
                )}
              />
              {errors.problem && <span>{errors.problem.message}</span>}
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
                    required
                    id="resolution"
                    placeholder="Enter Resolution"
                    onChange={(e) => handleChange(e)}
                  />
                )}
              />
              {errors.issueName && <span>{errors.issueName.message}</span>}
            </Form.Group>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAgree} autoFocus className="yesbtn">
          Yes
        </Button>
        <Button onClick={() => dispatch(closePopup())} className="nobtn">
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default CommanPopup;
