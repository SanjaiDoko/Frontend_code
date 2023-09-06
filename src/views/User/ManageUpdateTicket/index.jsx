/* eslint-disable react/prop-types */
import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { ReactComponent as CloseIcon } from "../../../assets/Icons/closeIcon.svg";
import classes from "./index.module.css";
import { updateManageTicketValidation } from "../../../validationSchema/updateManageTicketValidation";
import {openFileNewWindow } from "../../../helper";
import { useEffect, useState } from "react";
import {
  useGetAllUserByGroupId,
  useGetSpecificTicketById,
  useUpdateTicket,
} from "../../../hooks/ticketHooks";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllGroups } from "../../../hooks/groupManagement";
import { useSelector } from "react-redux";
import { URL } from "../../../config";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Index = () => {
  const [uploadFile, setUploadFile] = useState([]);

  const role = useSelector((state) => state.profile.role);

  const groupId = localStorage.getItem("groupId");

  const { id } = useParams();

  const { data: uniqueTicketData, isLoading: ticketLoading } =
    useGetSpecificTicketById(id);

  const { data: allUser, isLoading: userLoading } =
    useGetAllUserByGroupId(groupId);

  const userId = localStorage.getItem("allMasterId");

  const navigate = useNavigate();

  const createdBy = localStorage.getItem("allMasterId");

  const { data: allGroupData, isLoading: groupLoading } =
    useGetAllGroups(userId);

  const onSuccess = () => {
    navigate("/user/manageticket/");
  };

  const editorConfiguration = {
    toolbar: {
      items: [],
    },
  };

  const { mutate } = useUpdateTicket(onSuccess);
  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateManageTicketValidation),
    mode: "onTouched",
    defaultValues: {
      issueName: "",
      issueGroup: "",
      type: "",
      issueDescription: "",
      assignedTo: "",
      endTime: null,
      mailList: "",
      managerName: "",
      managedId: "",
      createdBy: createdBy,
    },
  });

  useEffect(() => {
    if (uniqueTicketData) {
      setUploadFile(uniqueTicketData[0].files);
      if (uniqueTicketData[0].endTime) {
        uniqueTicketData[0].endTime = moment(uniqueTicketData[0].endTime);
      } else {
        uniqueTicketData[0].endTime = null;
      }
      reset(uniqueTicketData[0]);
    }
  }, [reset, uniqueTicketData]);

  if (groupLoading || ticketLoading || userLoading) {
    return <p>Loading...</p>;
  }

  const onSubmit = (data) => {
    const values = getValues();
    data.managedBy = values["managedId"];
    data.endTime = moment(data.endTime);
    data.id = uniqueTicketData[0]._id;
    data.files = uploadFile;
    mutate(data);
  };


  console.log(uniqueTicketData[0], "ffff");

  return (
    <div className="container">
      <div className={classes.mainDiv}>
        <div className={classes.AddTicketDiv}>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.addDiv}>
            <div>
              <div className={classes.addDivHeading}>
                <h3>Edit Ticket</h3>
                {uniqueTicketData[0].status === 0 && (
                  <button
                    type="button"
                    className={classes.rejectBtn}
                    onClick={() => {
                      mutate({ id, status: 3 });
                    }}
                  >
                    Reject Task
                  </button>
                )}

                {uniqueTicketData[0].status === 3 && (
                  <button type="button" className={classes.reject}>
                    Task is Rejected
                  </button>
                )}
                {uniqueTicketData[0].status === 1 && (
                  <button type="button" className={classes.completed}>
                    Task is Completed
                  </button>
                )}
              </div>
              <div className={classes.flexdiv}>
                <div className={classes.infodiv}>
                  <div className={classes.inputdiv}>
                    <div className={classes.flexeddiv}>
                      <Form.Group className="pt-2">
                        <Form.Label htmlFor="issueName" className="formlabel">
                          Issue Name
                        </Form.Label>
                        <Controller
                          name="issueName"
                          control={control}
                          render={({ field }) => (
                            <Form.Control
                              {...field}
                              type="text"
                              id="issueName"
                              disabled
                              placeholder="Enter Issue Name"
                            />
                          )}
                        />
                        {errors.issueName && (
                          <span className={classes.error}>
                            {errors.issueName.message}
                          </span>
                        )}
                      </Form.Group>
                      <Form.Group className="pt-2">
                        <Form.Label htmlFor="type" className="formlabel">
                          Type
                        </Form.Label>
                        <Controller
                          name="type"
                          control={control}
                          render={({ field }) => (
                            <Form.Control
                              type="text"
                              {...field}
                              id="type"
                              disabled
                              placeholder="Enter Type"
                            />
                          )}
                        />
                        {errors.type && (
                          <span className={classes.error}>
                            {errors.type.message}
                          </span>
                        )}
                      </Form.Group>
                    </div>
                    <div className={classes.flexeddiv}>
                      <Form.Group className="pt-2">
                        <Form.Label htmlFor="issueGroup" className="formlabel">
                          Issue Group
                        </Form.Label>
                        <Controller
                          name="issueGroup"
                          control={control}
                          render={({ field }) => (
                            <Form.Select
                              className={`formcontrol`}
                              {...field}
                              id="issueGroup"
                              disabled={role === 3}
                              onChange={(e) => {
                                field.onChange(e);
                                let managedBy =
                                  allGroupData &&
                                  allGroupData.filter(
                                    (e) => e.groupId === watch("issueGroup")
                                  );
                                setValue(
                                  "managedBy",
                                  managedBy[0].managedBy.name
                                );
                                setValue(
                                  "managedId",
                                  managedBy[0].managedBy.managedBy
                                );
                              }}
                            >
                              <option value={""} hidden>
                                Choose Type
                              </option>
                              {allGroupData &&
                                allGroupData
                                  .filter((e) => e.groupId !== createdBy)
                                  .map((e, i) => {
                                    return (
                                      <option key={i} value={e.groupId}>
                                        {e.name}
                                      </option>
                                    );
                                  })}
                            </Form.Select>
                          )}
                        />
                        {errors.issueGroup && (
                          <span className={classes.error}>
                            {errors.issueGroup.message}
                          </span>
                        )}
                      </Form.Group>
                      <Form.Group className="pt-2">
                        <Form.Label htmlFor="managerName" className="formlabel">
                          Managed By
                        </Form.Label>
                        <Controller
                          name="managerName"
                          control={control}
                          render={({ field }) => (
                            <Form.Control
                              type="text"
                              disabled
                              {...field}
                              id="managerName"
                              placeholder="Enter Managed By Name"
                            />
                          )}
                        />
                        {errors.managedBy && (
                          <span className={classes.error}>
                            {errors.managedBy.message}
                          </span>
                        )}
                      </Form.Group>
                    </div>
                    {/* <div className={classes.flexeddiv}> */}
                    <Form.Label style={{ fontWeight: "bold" }}>
                      Issue Description
                    </Form.Label>
                    <Controller
                      name="issueDescription"
                      control={control}
                      render={({ field }) => (
                        <CKEditor
                          sx={{ background: "red" }}
                          editor={ClassicEditor}
                          disabled
                          {...field}
                          data={uniqueTicketData[0].issueDescription}
                          id="issueDescription"
                          config={editorConfiguration}
                        />
                      )}
                    />
                    {errors.issueDescription && (
                      <span className={classes.error}>
                        {errors.issueDescription.message}
                      </span>
                    )}
                    {/* <Form.Group className="pt-2">
                        <Form.Label htmlFor="mailList" className="formlabel">
                          Mail To
                        </Form.Label>
                        <Controller
                          name="mailList"
                          control={control}
                          render={({ field }) => (
                            <Form.Control
                              type="text"
                              {...field}
                              id="mailList"
                              disabled
                              placeholder="Enter Mail To"
                            />
                          )}
                        />
                        {errors.mailTo && (
                          <span className={classes.error}>
                            {errors.mailTo.message}
                          </span>
                        )}
                      </Form.Group> */}
                    {/* </div> */}
                  </div>
                </div>
                <div className={classes.inputdivs}>
                  <div>
                    {uploadFile &&
                      uploadFile.map((e, i) => {
                        return (
                          <div className={classes.filecontainer} key={i}>
                            {e.fileData ? (
                              <p
                                title={e.fileName}
                                onClick={() => openFileNewWindow(e.fileData)}
                                className={classes.filename}
                              >
                                {e.fileName}
                              </p>
                            ) : (
                              <a
                                target="_blank"
                                rel="noreferrer"
                                href={`${URL}${e.filePath}`}
                                style={{
                                  textDecoration: "none",
                                }}
                              >
                                {e.fileName}
                              </a>
                            )}
                            {/* <div>
                              <DeleteIcon
                                sx={{
                                  cursor: "pointer",
                                  color: "red",
                                }}
                                onClick={() => removeFileHandler(uploadFile, i)}
                              />
                            </div> */}
                          </div>
                        );
                      })}
                    {role === 3 && (
                      <Form.Group className="pt-2">
                        <Form.Label htmlFor="assignedTo" className="formlabel">
                          Assigned To
                        </Form.Label>
                        <Controller
                          name="assignedTo"
                          control={control}
                          render={({ field }) => (
                            <Form.Select
                              className={`formcontrol`}
                              {...field}
                              id="assignedTo"
                            >
                              <option value={""} hidden>
                                Choose Type
                              </option>
                              {allUser &&
                                allUser.map((e, i) => {
                                  return (
                                    <option key={i} value={e._id}>
                                      {e.fullName}
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
                    )}
                    <Form.Group className="pt-2">
                      <Form.Label htmlFor="endTime" className="formlabel">
                        End Time
                      </Form.Label>
                      <Controller
                        name="endTime"
                        control={control}
                        render={({ field }) => (
                          <MobileDateTimePicker
                            sx={{ width: "100%" }}
                            {...field}
                            ampm={false}
                            slotProps={{
                              textField: {
                                readOnly: true,
                              },
                            }}
                            format="DD-MM-YYYY HH:MM"
                            onChange={(e) => field.onChange(e)}
                          />
                        )}
                      />
                      {errors.endTime && (
                        <span className={classes.error}>
                          {errors.endTime.message}
                        </span>
                      )}
                    </Form.Group>
                  </div>
                  {uniqueTicketData[0].status !== 3 &&
                  uniqueTicketData[0].status !== 1 ? (
                    <button type="submit" className={classes.savebtn}>
                      Update Ticket
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={classes.savebtn}
                      onClick={() => navigate(-1)}
                    >
                      Back
                    </button>
                  )}
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
