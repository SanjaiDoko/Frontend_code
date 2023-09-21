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
  useGetAllEmployee,
  useGetSalesCallByCallId,
  useInsertDemoCalls,
  useInsertRemarks,
} from "../../../../../hooks/sales";
import { updateReportValidation } from "../../../../../validationSchema/updateReportValidation";
import { getSalesMessage, salesStatus } from "../../../../../helper";

const Index = () => {
  const messagesDivRef = useRef(null);

  const [assigneData, setAssigneData] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const [sendMessage, setSendMessage] = useState("");

  const role = useSelector((state) => state.profile.role);

  const groupId = localStorage.getItem("groupId");

  const { id } = useParams();

  const onChatSuccessFunction = (data) => {
    console.log(data, ":asasa");
    setAssigneData(data[0], "data");
  };

  const { data: employee, isloading: employeeLoading } = useGetAllEmployee();

  const { data, isLoading } = useGetSalesCallByCallId(
    id,
    onChatSuccessFunction
  );

  const userId = localStorage.getItem("allMasterId");

  const navigate = useNavigate();

  const onSuccess = () => {
    navigate("/user/assginedsalescall");
  };
  
  const { mutate } = useInsertRemarks(onSuccess);
  const onSuccessFunction = () => {
  };
  const { mutate :demoInsert } = useInsertDemoCalls(onSuccessFunction);

  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateReportValidation),
    mode: "onTouched",
    defaultValues: {
      status: data && data[0].status,
      remark: "",
      assignedTo: "",
    },
  });

  const onSubmit = (data) => {
    data.callId = id;
    mutate(data);
    if(data.assignedTo.length > 0){
      const postData = {
        callId : data.callId,
        assignedTo: data.assignedTo
      }
      demoInsert(postData)
    }
    
  };

  if (isLoading || employeeLoading) {
    return <Loader />;
  }


  return (
    <div className="container">
      <div className={classes.mainDiv}>
        <div className={classes.AddTicketDiv}>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.addDiv}>
            <div>
              <div className={classes.addDivHeading}>
                <h3>Update Sales Call</h3>
               
              </div>
              <div className={classes.flexdiv}>
                <div className={classes.infodiv}>
                  <div
                    className={classes.inputdiv}
                    style={{ marginBottom: "20px" }}
                  >
                    <p
                      style={{
                        fontWeight: "bold",
                        marginBottom: "0",
                        textTransform: "uppercase",
                      }}
                    >
                      {/* {uniqueTicketData[0].ticketId} */}
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
                              value={getSalesMessage(data[0].status)}
                            />
                          )}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  {
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
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <div>
                              {data[0].remarks?.map((remark, i) => {
                                return (
                                  <div key={remark._id}>
                                    <p>
                                      {"Date"}:{" "}
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
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
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
                                    {salesStatus &&
                                      salesStatus
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
                              <Form.Label
                                htmlFor="remark"
                                className="formlabel"
                              >
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
                            {data[0].status === 3 ||
                              (watch().status == 3 && (
                                <Form.Group className="pt-2">
                                  <Form.Label
                                    htmlFor="assignedTo"
                                    className="formlabel"
                                  >
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
                                        {employee &&
                                          employee.map((e, i) => {
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
                              ))}
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
                  }
                  {console.log(data[0].status)}
                  {!showReport && data[0].status !== 1 && data[0].status !== 3 && data[0].status !== 4 && (
                    <button
                      type="button"
                      onClick={() => setShowReport(true)}
                      className={classes.addTicketBtn}
                    >
                      Update Note
                    </button>
                  )}
                </div>
                {/* <div className={classes.inputdivs}> */}
                {/* <div>
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
                    Update Sales Call
                  </button> */}

                {/* <button
                    type="button"
                    className={classes.savebtn}
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </button> */}
                {/* </div> */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
