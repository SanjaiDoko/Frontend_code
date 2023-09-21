/* eslint-disable react/prop-types */
import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./index.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import { addCompanyValidation } from "../../../../../validationSchema/addCompanyValidation";
import Loader from "../../../../../components/Loader/Loader";
import { useInsertCompany } from "../../../../../hooks/sales";

const AddCompany = () => {
  const navigate = useNavigate();
  const onSuccess = () => {
    navigate("/user/company");
  };
  const { mutate } = useInsertCompany(onSuccess);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addCompanyValidation),
    mode: "onTouched",
    defaultValues: {
      companyName: "",
      contact: "",
    },
  });


  const onSubmit = (data) => {
    mutate(data);
  };


  return (
    <div className={classes.mainDiv}>
      <div className={classes.AddTicketDiv}>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.addDiv}>
          <div>
            <div className={classes.addDivHeading}>
              <h2>Add Company</h2>
            </div>
            <div className={classes.inputDiv}>
              <Form.Group className="pt-2">
                <Form.Label htmlFor="companyName" className="formlabel">
                Company Name
                </Form.Label>
                <Controller
                  name="companyName"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="text"
                      id="companyName"
                      placeholder="Enter Company Name"
                    />
                  )}
                />
                {errors.companyName && (
                  <span className={classes.error}>
                    {errors.companyName.message}
                  </span>
                )}
              </Form.Group>
            </div>
            
            <div className={classes.inputDiv}>
              <Form.Group className="pt-2">
                <Form.Label htmlFor="contact" className="formlabel">
                  Mobile Number
                </Form.Label>
                <Controller
                  name="contact"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      type="text"
                      {...field}
                      id="contact"
                      placeholder="Enter Mobile Number"
                    />
                  )}
                />
                {errors.contact && (
                  <span className={classes.error}>{errors.contact.message}</span>
                )}
              </Form.Group>
            </div>
            <button type="submit" className={classes.savebtn}>
              Create Company
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompany;
