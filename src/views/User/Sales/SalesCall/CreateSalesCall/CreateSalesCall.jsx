/* eslint-disable react/prop-types */
import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./index.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUnAssignedCompany, useGetEmployeeById, useInsertSales } from "../../../../../hooks/sales";
import { createSalesCallValidation } from "../../../../../validationSchema/createSalesCallValidation";
import Loader from "../../../../../components/Loader/Loader";

const AddTicket = () => {
  const navigate = useNavigate();
  const onSuccess = () => {
    navigate("/user/salescall");
  };
  // const { data:companyData, isloading } = useGetAllCompanies();
  const { data:unAssignedCompanyData, isloading } = useGetUnAssignedCompany();
  const { data:employeeData, isloading:employeeLoading } = useGetEmployeeById();
// console.log(employeeData)
// console.log(companyData,"com")
  const { mutate } = useInsertSales(onSuccess);
  // const { data: allGroupData, isLoading: groupLoading } = useGetAllGroups();
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createSalesCallValidation),
    mode: "onTouched",
    defaultValues: {
      companyId: "",
      assignedTo: "",
    },
  });


  const onSubmit = (data) => {
    data.companyId = [data.companyId]
    mutate(data);
  };
  if(isloading || employeeLoading){
    return <Loader />
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
                <Form.Label htmlFor="companyId" className="formlabel">
                  Company Name
                </Form.Label>
                <Controller
                  name="companyId"
                  control={control}
                  render={({ field }) => (
                    <Form.Select
                      className={`formcontrol`}
                      style={{ textTransform: "capitalize" }}
                      {...field}
                      id="companyId"
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
                        Choose Company
                      </option>

                      {unAssignedCompanyData &&
                        unAssignedCompanyData
                          .map((e, i) => {
                            return (
                              <option key={i} value={e._id}>
                                {e.companyName}
                              </option>
                            );
                          })}
                    </Form.Select>
                  )}
                />
                
                {errors.companyId && (
                  <span className={classes.error}>
                    {errors.companyId.message}
                  </span>
                )}
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
                        employeeData
                          .map((e, i) => {
                            console.log(e)
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
