/* eslint-disable react/prop-types */
import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { ReactComponent as CloseIcon } from "../../../assets/Icons/closeIcon.svg";
import classes from "./index.module.css";
import { useEffect, useRef, useState } from "react";
// import {
//   useGetAllUserByGroupId,
//   useGetSpecificTicketById,
//   useMangerUpdateTicket,
// } from "../../../hooks/ticketHooks";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import SendIcon from "@mui/icons-material/Send";
import { updateReceivedTicketValidation } from "../../../../../validationSchema/updateReceivedTicketValidation";
import Loader from "../../../../../components/Loader/Loader";
import { useGetDemoCallByCallId, useInsertDemoRemarks } from "../../../../../hooks/sales";
import { updateReportValidation } from "../../../../../validationSchema/updateReportValidation";

const Index = () => {

  const array = [1, 2, 3, 4, 5];

  const { id } = useParams();

  const { data, isLoading } = useGetDemoCallByCallId(
    id
  );

  const navigate = useNavigate();


  const onSuccess = () => {
    navigate("/user/mydemocall");
  };

  const { mutate } = useInsertDemoRemarks(onSuccess);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateReportValidation),
    mode: "onTouched",
    defaultValues: {
      status: 1,
      remark: "",
    },
  });

  const onSubmit = (data) => {
    data.callId = id
    console.log(data,"dataaa")
    mutate(data);
  };
console.log(data,"asdasd")
  if (isLoading) {
    return <Loader />;
  }


  return (
    <div className="container">
      <div className={classes.mainDiv}>
        <div className={classes.AddTicketDiv}>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.addDiv}>
            <div>
              <div className={classes.addDivHeading}>
                <h3>Update Demo Calls</h3>
                {/* {uniqueTicketData[0].status === 0 && (
                  <button
                    type="button"
                    className={classes.rejectBtn}
                    onClick={() => {
                      mutate({ id, status: 3 });
                    }}
                  >
                    Reject Task
                  </button>
                )} */}

                {/* {uniqueTicketData[0].status === 3 && (
                  <h4 className={classes.reject}>Task is Rejected</h4>
                )} */}
                {/* {uniqueTicketData[0].status === 1 && (
                  <h4 type="button" className={classes.completed}>
                    Task is Completed
                  </h4>
                )} */}
              </div>
              <div className={classes.flexdiv}>
                <div className={classes.infodiv}>
                  <div className={classes.inputdiv}>
                    <p
                      style={{
                        fontWeight: "bold",
                        marginBottom: "0",
                        textTransform: "uppercase",
                      }}
                    >
                    </p>
                    <div className={classes.flexeddiv}>
                      <Form.Group className="pt-2">
                        <Form.Label htmlFor="issueName" className="formlabel">
                          Company Name
                        </Form.Label>
                        <Controller
                          name="issueName"
                          control={control}
                          render={({ field }) => (
                            <Form.Control
                              {...field}
                              style={{ textTransform: "capitalize" }}
                              type="text"
                              id="issueName"
                              disabled
                              placeholder="Enter Issue Name"
                              value={data[0].companyName}
                            />
                          )}
                        />
                      </Form.Group>
                      <Form.Group className="pt-2">
                        <Form.Label htmlFor="type" className="formlabel">
                          AssignedBy
                        </Form.Label>
                        <Controller
                          name="type"
                          control={control}
                          render={({ field }) => (
                            <Form.Control
                              type="text"
                              style={{ textTransform: "capitalize" }}
                              {...field}
                              id="type"
                              disabled
                              placeholder="Enter Type"
                              value={data[0].assignedByName}
                            />
                          )}
                        />
                      </Form.Group>
                    </div>
                    <div className={classes.flexeddiv}>
                      <Form.Group className="pt-2">
                        <Form.Label htmlFor="issueName" className="formlabel">
                          Assigned On
                        </Form.Label>
                        <Controller
                          name="issueName"
                          control={control}
                          render={({ field }) => (
                            <Form.Control
                              {...field}
                              style={{ textTransform: "capitalize" }}
                              type="text"
                              id="issueName"
                              disabled
                              placeholder="Enter Issue Name"
                              value={moment(data[0].assignedDate).format("DD-MM-YYYY")}
                            />
                          )}
                        />
                      </Form.Group>
                      <Form.Group className="pt-2">
                        <Form.Label htmlFor="type" className="formlabel">
                          Status
                        </Form.Label>
                        <Controller
                          name="type"
                          control={control}
                          render={({ field }) => (
                            <Form.Control
                              type="text"
                              style={{ textTransform: "capitalize" }}
                              {...field}
                              id="type"
                              disabled
                              placeholder="Enter Type"
                              value={data[0].status}
                            />
                          )}
                        />
                      </Form.Group>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <h5>Reports:</h5>
                      <div>
                        {data[0].remarks?.map((remark, i) => {
                          return (
                            <div key={remark._id}>
                              <p>
                                {i + 1}. { moment(remark.enteredDate).format("DD-MM-YYYY")} - {remark.data}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={classes.inputdivs}>
                  <div>
                    <Form.Group className="pt-2">
                      <Form.Label htmlFor="assignedTo" className="formlabel">
                        Status
                      </Form.Label>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Form.Select
                            className={`formcontrol`}
                            // disabled={uniqueTicketData[0].status !== 0}
                            {...field}
                            id="status"
                          >
                            <option value={""} hidden>
                              Choose Type
                            </option>
                            {array &&
                              array.map((e, i) => {
                                return (
                                  <option
                                    key={i}
                                    value={e}
                                    style={{ textTransform: "capitalize" }}
                                  >
                                    {e}
                                  </option>
                                );
                              })}
                          </Form.Select>
                        )}
                      />
                       {errors.status && (
                          <span className={classes.error}>
                            {errors.status.message}
                          </span>
                        )}
                    </Form.Group>

                    <Form.Group className="pt-2">
                        <Form.Label htmlFor="remark" className="formlabel">
                          Remark
                        </Form.Label>
                        <Controller
                          name="remark"
                          control={control}
                          render={({ field }) => (
                            <Form.Control
                              type="text"
                              {...field}
                              id="remark"
                              placeholder="Enter Remark"
                            />
                          )}
                        />
                        {errors.remark && (
                          <span className={classes.error}>
                            {errors.remark.message}
                          </span>
                        )}
                      </Form.Group>
                  </div>
                  <button type="submit" className={classes.savebtn}>
                    Update Demo Calls
                  </button>

                  {/* <button
                    type="button"
                    className={classes.savebtn}
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </button> */}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
