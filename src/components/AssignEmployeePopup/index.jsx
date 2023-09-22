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
import { useGetEmployeeById, useInsertEmployee, useInsertSales } from "../../hooks/sales";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import { Checkbox } from "@mui/material";
import { createSalesCallValidation } from "../../validationSchema/createSalesCallValidation";

function AssignEmployeePopup({  titleText,content,rowId, rowData }) {
  const popupStatus = useSelector((state) => state.roomPopup.popupStatus);
  const navigate = useNavigate();
  console.log(rowId,"rowId")
console.log("open")
  const onSuccess = () => {
    navigate("/user/company")
  };
  const { data: employeeData, isloading: employeeLoading } =
  useGetEmployeeById();

  const { mutate } = useInsertSales(onSuccess);

  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(createSalesCallValidation),
    mode: "onTouched",
    defaultValues: {
      assignedTo:""
    },
  });

  const onSubmit = (data) => {
    console.log(data)
    data.companyId = rowId
    mutate(data);
    reset()
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
        {/* <DialogContentText className="contenttxt" id="alert-dialog-description">
          <p className="contentText" style={{fontWeight:"bold", marginBottom:"10px"}}>Selected Companies</p>
          {rowData.map((data,i)=>{
            console.log(data,"row")
            return<p style={{marginLeft:"20px",marginBottom:"5px"}} key={data._id}>{i+1}. {data.companyName}</p>
          })}
        </DialogContentText> */}
        <DialogContentText className="contenttxt" id="alert-dialog-description">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ margin: "10px" }}>
            <Form.Group className="pt-2">
                <Form.Label htmlFor="assignedTo" className="formlabel">
                  Assign To
                </Form.Label>
                <Controller
                  name="assignedTo"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Form.Select
                      className={`formcontrol`}
                      style={{ textTransform: "capitalize" }}
                      {...field}
                      id="assignedTo"
                    >
                      <option value={""} hidden>
                        Choose Employee
                      </option>

                      {employeeData &&
                        employeeData.map((e, i) => {
                          console.log(e);
                          return (
                            <option key={i} value={e._id}>
                              {e.username}
                            </option>
                          );
                        })}
                    </Form.Select>
                  )}
                />

                {errors.assignedTo && (
                  <span className="error">
                    {errors.assignedTo.message}
                  </span>
                )}
              </Form.Group>
              <p style={{ marginTop:"20px"}}>{content}</p>
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
export default AssignEmployeePopup;
