/* eslint-disable react/prop-types */
import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./index.module.css";
import { useNavigate } from "react-router-dom";
import {
  useGetUnAssignedCompany,
  useGetEmployeeById,
  useInsertSales,
} from "../../../../../hooks/sales";
import { createSalesCallValidation } from "../../../../../validationSchema/createSalesCallValidation";
import Loader from "../../../../../components/Loader/Loader";
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

const AddTicket = () => {
  const navigate = useNavigate();
  const onSuccess = () => {
    navigate("/user/salescall");
  };
  const { data: unAssignedCompanyData, isloading } = useGetUnAssignedCompany();
  const { data: employeeData, isloading: employeeLoading } =
    useGetEmployeeById();
  const { mutate } = useInsertSales(onSuccess);
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createSalesCallValidation),
    mode: "onTouched",
    defaultValues: {
      companyId: [],
      assignedTo: "",
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };
  if (isloading || employeeLoading) {
    return <Loader />;
  }

  return (
    <div className={classes.mainDiv}>
      <div className={classes.AddTicketDiv}>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.addDiv}>
          <div>
            <div className={classes.addDivHeading}>
              <h2>Create Sales Call</h2>
            </div>
            <div className={classes.inputDiv}>
              <Form.Group className="pt-2">
                <Form.Label id="emailcc">Company Name</Form.Label>
                <Controller
                  control={control}
                  name="companyId"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      fullWidth
                      id="companyId"
                      multiple
                      displayEmpty
                      value={value}
                      onChange={onChange}
                      className={classes.costheadingSelect}
                      sx={{
                        textTransform: "capitalize",
                        fontSize: "14px",
                        height: "40px !important",
                      }}
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <span>Choose Companies</span>;
                        }
                        return unAssignedCompanyData
                          .filter((emp) => selected.includes(emp._id))
                          .map((emp) => emp.companyName)
                          .join(", ");
                      }}
                      MenuProps={MenuProps}
                    >
                      {unAssignedCompanyData &&
                        unAssignedCompanyData.map((e) => (
                          <MenuItem key={e._id} value={e._id}>
                            <Checkbox
                              checked={watch("companyId").indexOf(e._id) > -1}
                            />
                            <ListItemText primary={e.companyName} />
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
                <p className={classes.error}>{errors.companyId?.message}</p>
              </Form.Group>
            </div>
            <div className={classes.inputDiv}>
              <Form.Group className="pt-2">
                <Form.Label htmlFor="assignedTo" className="formlabel">
                  Assign To
                </Form.Label>
                <Controller
                  name="assignedTo"
                  control={control}
                  render={({ field }) => (
                    <Form.Select
                      className={`formcontrol`}
                      style={{ textTransform: "capitalize" }}
                      {...field}
                      id="assignedTo"
                      // onChange={(e) => {
                      //   field.onChange(e);
                      //   let managedBy =
                      //   companyData &&
                      //   companyData.filter(
                      //       (e) => e.groupId === watch("issueGroup")
                      //     );
                      // }}
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
                  <span className={classes.error}>
                    {errors.assignedTo.message}
                  </span>
                )}
              </Form.Group>
            </div>

            <button type="submit" className={classes.savebtn}>
              Create Sales Call
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTicket;
