/* eslint-disable react/prop-types */
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./index.css";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { closePopup } from "../../redux/slices/roomPopup";
import { Controller, useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { resolutionValidation } from "../../validationSchema/resolutaionValidation";
import { useNavigate } from "react-router-dom";
import Select from "@mui/material/Select";
import { useGetUnAssignedEmployee, useInsertEmployee } from "../../hooks/sales";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import { Checkbox } from "@mui/material";
import { addEmployeeValidation } from "../../validationSchema/addEmployeeValidation";

function EmployeePopup({  titleText }) {
  const popupStatus = useSelector((state) => state.roomPopup.popupStatus);
  const navigate = useNavigate();
console.log("open")
  const onSuccess = () => {
    navigate("/user/employee");
  };
  const {data:allEmployee, isLoading:employeeLoading} = useGetUnAssignedEmployee()

  const { mutate } = useInsertEmployee(onSuccess);
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(addEmployeeValidation),
    mode: "onTouched",
    defaultValues: {
      employeeId: [],
    },
  });

  const onSubmit = (data) => {
    mutate(data);
    dispatch(closePopup());
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
          {/* <p className="contentText">{contentText}</p> */}
        </DialogContentText>
        <DialogContentText className="contenttxt" id="alert-dialog-description">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ margin: "10px" }}>
              <Form.Group className="pt-2">
                <Form.Label htmlFor="employeeId" className="formlabel">
                Assign Employee
                </Form.Label>
                <Controller
                control={control}
                name="employeeId"
                render={({ field: { onChange, value } }) => (
                  <Select
                    fullWidth
                    id="employeeId"
                    multiple
                    displayEmpty
                    value={value}
                    onChange={onChange}
                    // className={styles.costheadingSelect}
                    sx={{
                      textTransform: "capitalize",
                      fontSize: "14px",
                    }}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <span>Choose Users</span>;
                      }
                      return allEmployee.filter((emp) => selected.includes(emp._id)).map((emp) => emp.username).join(", ");
                    }}
                    // MenuProps={MenuProps}
                  >
                    {console.log(allEmployee)}
                    {allEmployee &&
                      allEmployee.map((user) => (
                        <MenuItem key={user._id} value={user._id}>
                          <Checkbox
                            checked={
                              watch("employeeId").indexOf(user._id) > -1
                            }
                          />
                          <ListItemText primary={user.username} />
                        </MenuItem>
                      ))}
                  </Select>
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
export default EmployeePopup;
