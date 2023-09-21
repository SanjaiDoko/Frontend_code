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
import {
  useGetDemoCallByCallId,
  useInsertDemoRemarks,
} from "../../../../../hooks/sales";
import { updateReportValidation } from "../../../../../validationSchema/updateReportValidation";
import { demoStatus, getDemoMessage } from "../../../../../helper";

const Index = () => {
  const [showReport, setShowReport] = useState(false);

  const { id } = useParams();

  const { data, isLoading } = useGetDemoCallByCallId(id);

  const navigate = useNavigate();

  const onSuccess = () => {
    // navigate("/user/mydemocall");
    setShowReport(false)
    reset()
  };

  const { mutate } = useInsertDemoRemarks(onSuccess);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateReportValidation),
    mode: "onTouched",
    defaultValues: {
      status: data && data[0].status,
      remark: "",
    },
  });

  const onSubmit = (data) => {
    data.callId = id;
    console.log(data, "dataaa");
    mutate(data);
  };
  console.log(data, "asdasd");
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
                    ></p>
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
                              value={moment(data[0].assignedDate).format(
                                "DD-MM-YYYY"
                              )}
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
                              value={getDemoMessage(data[0].status)}
                            />
                          )}
                        />
                      </Form.Group>
                    </div>
                  </div>
                </div>
                <div>
                  <div className={classes.addDivHeading}>
                    <h3>Notes</h3>
                  </div>
                  <div
                    className={classes.inputdiv}
                    style={{ flexDirection: "column" }}
                  >
                    {data[0].remarks?.length === 0 ? (
                      <p>No data</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div>
                          {data[0].remarks?.map((remark, i) => {
                            return (
                              <div key={remark._id}>
                                <p>
                                  
                                  {moment(remark.enteredDate).format(
                                    "DD-MM-YYYY"
                                  )}{" "}
                                  <p className={classes.reportDiv}>
                                    {remark.data}
                                  </p>
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {showReport && (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Form.Group className="pt-2">
                          <Form.Label
                            htmlFor="assignedTo"
                            className="formlabel"
                          >
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
                                {demoStatus &&
                                  demoStatus
                                    .filter((e) => e.status !== 0)
                                    .map((e, i) => {
                                      return (
                                        <option
                                          key={i}
                                          value={e.status}
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {e.message}
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
                                as="textarea"
                                {...field}
                                id="remark"
                                placeholder="Enter Remark"
                              />
                            )}
                          />
                          {console.log(errors)}
                          {errors.remark && (
                            <span className={classes.error}>
                              {errors.remark.message}
                            </span>
                          )}
                        </Form.Group>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            type="submit"
                            style={{
                              marginRight: "30px",
                              backgroundColor: "#8be877",
                            }}
                            onClick={() => setShowReport(true)}
                            className={classes.addTicketBtn}
                          >
                            Create Note
                          </button>
                          <button
                            type="button"
                            style={{ backgroundColor: "#ee9b9b" }}
                            onClick={() => {
                              setShowReport(false);
                              reset("");
                            }}
                            className={classes.addTicketBtn}
                          >
                            Clear Note
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {!showReport && data[0].status !== 3 && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setShowReport(true)}
                    className={classes.addTicketBtn}
                  >
                    Update Note
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;

/* <div className={classes.inputdivs}>
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
                            {demoStatus &&
                              demoStatus.filter((e) => e.status !== 0).map((e, i) => {
                                return (
                                  <option
                                    key={i}
                                    value={e.status}
                                    style={{ textTransform: "capitalize" }}
                                  >
                                    {e.message}
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
                            as="textarea"
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
                  </button> 
                </div> */
