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
import { useGetDemoCallByCallId, useInsertRemarks } from "../../../../../hooks/sales";
import { updateReportValidation } from "../../../../../validationSchema/updateReportValidation";
import { getDemoMessage } from "../../../../../helper";

const Index = () => {

  const array = [1, 2, 3, 4, 5];

  const { id } = useParams();

  const onChatSuccessFunction = (data) => {
    console.log(data,":asasa")
    // setAssigneData(data[0], "data");
  };


  const { data, isLoading } = useGetDemoCallByCallId(
    id,
    onChatSuccessFunction
  );

  // const userId = localStorage.getItem("allMasterId");

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
                <h3>Demo Call</h3>
                
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
                              value={moment(data[0].assignedOn).format("DD-MM-YYYY")}
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
                    <div style={{ display: "flex", flexDirection: "column" }}>
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
                    </div>
                  </div>
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
