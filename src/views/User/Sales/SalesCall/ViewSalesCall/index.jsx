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
  useGetDemoCallBySalesId,
  useGetSalesCallByCallId,
  useInsertRemarks,
} from "../../../../../hooks/sales";
import { updateReportValidation } from "../../../../../validationSchema/updateReportValidation";
import { getSalesMessage } from "../../../../../helper";

const Index = () => {
  const [reportData, setReportData] = useState([]);

  const [showReport, setShowReport] = useState(false);

  const { id } = useParams();

  const onChatSuccessFunction = (data) => {
    const isDataAlreadyPresent = data.some((data) =>
      reportData.some((report) => report.id === data.callId)
    );

    if (!isDataAlreadyPresent) {
      const transformedData = data.map((item) =>
        item.remarks.map((remark) => ({
          id: item.callId,
          enteredDate: remark.enteredDate,
          data: remark.data,
          assignedByName: item.assignedByName,
        }))
      );
      const flattenedData = [].concat(...transformedData);
      setReportData((prev) => [...prev, ...flattenedData]);
    }
  };

  console.log(reportData, "show");
  const { data, isLoading, refetch } = useGetSalesCallByCallId(
    id,
    onChatSuccessFunction
  );

  // const {
  //   data: demoData,
  //   isLoading: demoLoading,
  //   refetch: demoRefetch,
  // } = useGetDemoCallBySalesId(id, onChatSuccessFunction);

  useEffect(() => {
    refetch();
    // demoRefetch();
  }, []);

  const navigate = useNavigate();

  const onSuccess = () => {
    navigate("/user/assginedsalescall");
  };

  const { mutate } = useInsertRemarks(onSuccess);
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
    data.callId = id;
    console.log(data, "dataaa");
    mutate(data);
  };
  if (isLoading ) {
    return <Loader />;
  }
  function compareDates(a, b) {
    const dateA = moment(a.enteredDate);
    const dateB = moment(b.enteredDate);
    return dateA - dateB;
  }
console.log(data,"data")
  return (
    <div className="container">
      <div className={classes.mainDiv}>
        <div className={classes.AddTicketDiv}>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.addDiv}>
            <div>
              <div className={classes.addDivHeading}>
                <h3 style={{ textTransform: "capitalize" }}>
                  {data[0].companyName}'s Sales Call
                </h3>
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
                          Company Name :
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
                          Assigned To :
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
                              value={data[0].assignedToName}
                            />
                          )}
                        />
                      </Form.Group>
                    </div>
                    <div className={classes.flexeddiv}>
                      <Form.Group className="pt-2">
                        <Form.Label htmlFor="issueName" className="formlabel">
                          Assigned On :
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
                              value={moment(data[0].assignedOn).format(
                                "DD-MM-YYYY"
                              )}
                            />
                          )}
                        />
                      </Form.Group>
                      <Form.Group className="pt-2">
                        <Form.Label htmlFor="type" className="formlabel">
                          Status :
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
                    {/* <div style={{ display: "flex", flexDirection: "column" }}>
                      <h5 style={{fontWeight:"bold"}}>Reports:</h5>
                      <div>
                        {data[0].remarks?.map((remark, i) => {
                          return (
                            <div key={remark._id} style={{marginLeft:"50px"}}>
                              <p>
                                {i + 1}. { moment(remark.enteredDate).format("DD-MM-YYYY")} - {remark.data}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div> */}
                  </div>
                  {
                    <div>
                      <div className={classes.addDivHeading}>
                        <h3>Reports</h3>
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
                              {reportData
                                .sort(compareDates)
                                .map((remark, i) => {
                                  console.log(remark);
                                  return (
                                    <div
                                      className={classes.reportDiv}
                                      key={remark._id}
                                    >
                                      <div style={{display:"flex", justifyContent:"space-between"}}>
                                      <p className={classes.datatxt}>
                                        {remark.data}
                                      </p>
                                      <p  className={classes.datestyle} style={{ marginBottom: "0px", justifyContent:"flex-end" }}>
                                        {moment(remark.enteredDate).format(
                                          "DD-MM-YYYY hh:mm a"
                                        )}{" "}
                                      </p>
                                      
                                      </div>
                                      {/* <p style={{ marginBottom: "0px" }}>
                                        Reported By : {remark.assignedByName}
                                      </p> */}
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

// <Form.Group className="pt-2">
//                         <Form.Label htmlFor="issueGroup" className="formlabel">
//                           Assigned Date
//                         </Form.Label>
//                         <Controller
//                           name="issueGroup"
//                           control={control}
//                           render={({ field }) => (
//                             <Form.Select
//                               className={`formcontrol`}
//                               {...field}
//                               style={{ textTransform: "capitalize" }}
//                               id="issueGroup"
//                               disabled={role === 3}
//                               onChange={(e) => {
//                                 field.onChange(e);
//                                 // let managedBy =
//                                 //   allGroupData &&
//                                 //   allGroupData.filter(
//                                 //     (e) => e.groupId === watch("issueGroup")
//                                 //   );
//                                 setValue(
//                                   "managedBy",
//                                   managedBy[0].managedBy.name
//                                 );
//                                 setValue(
//                                   "managedId",
//                                   managedBy[0].managedBy.managedBy
//                                 );
//                               }}
//                             >
//                               <option value={""} hidden>
//                                 Choose Type
//                               </option>
//                               {/* {allGroupData &&
//                                 allGroupData
//                                   .filter((e) => e.groupId !== createdBy)
//                                   .map((e, i) => {
//                                     return (
//                                       <option key={i} value={e.groupId}>
//                                         {e.name}
//                                       </option>
//                                     );
//                                   })} */}
//                             </Form.Select>
//                           )}
//                         />

//                       </Form.Group>
