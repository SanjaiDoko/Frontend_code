/* eslint-disable react/prop-types */
import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./index.module.css";
import { updateReceivedTicketValidation } from "../../../validationSchema/updateReceivedTicketValidation";
import { openFileNewWindow } from "../../../helper";
import { useEffect, useState } from "react";
import {
  useGetSpecificTicketById,
  useUpdateTicket,
} from "../../../hooks/ticketHooks";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllGroups } from "../../../hooks/groupManagement";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { URL } from "../../../config";
import moment from "moment";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { closePopup, openPopup } from "../../../redux/slices/popupSlice";
import CommanPopup from "../../../components/popup";

const EditTicket = () => {
  const [uploadFile, setUploadFile] = useState([]);
  const role = useSelector((state) => state.profile.role);
  const [popUpState, setPopupState] = useState({
    problem: "",
    resolution: "",
  });

  const { id } = useParams();

  const { data: uniqueTicketData, isLoading: ticketLoading } =
    useGetSpecificTicketById(id);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createdBy = localStorage.getItem("allMasterId");

  const { data: allGroupData, isLoading: groupLoading } = useGetAllGroups();

  const onSuccess = () => {
    navigate("/user/dashboard/");
  };

  const titleText = "Update Status ";
  const contentText = "Are you sure that you want to update Status";

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
    resolver: yupResolver(updateReceivedTicketValidation),
    mode: "onTouched",
    defaultValues: {
      issueName: "",
      issueGroup: "",
      type: "",
      issueDescription: "",
      // assignedTo: "",
      mailList: "",
      managerName: "",
      managedId: "",
      startTime: null,
      actualEndTime: null,
      endTime: null,
      timeLog: "",
      createdBy: createdBy,
    },
  });

  const editorConfiguration = {
    toolbar: {
      items: [],
    },
  };

  useEffect(() => {
    if (uniqueTicketData) {
      if (uniqueTicketData[0].actualEndTime) {
        uniqueTicketData[0].actualEndTime = moment(
          uniqueTicketData[0].actualEndTime
        );
      }
      if (uniqueTicketData[0].endTime) {
        uniqueTicketData[0].endTime = moment(uniqueTicketData[0].endTime);
      }
      uniqueTicketData[0].startTime = moment(uniqueTicketData[0].startTime);
      reset(uniqueTicketData[0]);
      setUploadFile(uniqueTicketData[0].files);
    }
  }, [uniqueTicketData]);

  if (groupLoading || ticketLoading) {
    return <p>Loading...</p>;
  }

  const removeFileHandler = (array, index) => {
    setUploadFile(array.filter((file, i) => i !== index));
  };

  const handleAgree = () => {
    let payload = uniqueTicketData[0];
    payload.id = uniqueTicketData[0]._id;
    delete payload._id;
    payload.status = 1;
    mutate(payload);
  };

  const onSubmit = (data) => {
    dispatch(closePopup());
    const values = getValues();
    data.managedBy = values["managedId"];
    data.actualEndTime = moment(data.actualEndTime);
    data.id = uniqueTicketData[0]._id;
    data.files = uploadFile;
    mutate(data);
  };

  return (
    <div className={classes.mainDiv}>
      <div className={classes.AddTicketDiv}>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.addDiv}>
          <div>
            <div className={classes.addDivHeading}>
              <h2>Edit Ticket</h2>

              {uniqueTicketData && uniqueTicketData[0].status !== 1 && (
                <button
                  type="button"
                  className={classes.rejectBtn}
                  onClick={() => {
                    dispatch(openPopup());
                  }}
                >
                  Complete Task
                </button>
              )}

              {uniqueTicketData[0].status === 1 && (
                <button type="button" className={classes.completed}>
                  Task is Completed
                </button>
              )}
              {uniqueTicketData[0].status === 3 && (
                <button type="button" className={classes.reject}>
                  Task is Rejected
                </button>
              )}
            </div>
            <div className={classes.inputDiv}>
              <div>
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
                    <span className={classes.error}>{errors.type.message}</span>
                  )}
                </Form.Group>
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
                          setValue("managedBy", managedBy[0].managedBy.name);
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
                          allGroupData.map((e, i) => {
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
              <div>
                <Form.Group className="pt-2">
                  <Form.Label htmlFor="startTime" className="formlabel">
                    Start Time
                  </Form.Label>
                  <Controller
                    name="startTime"
                    control={control}
                    render={({ field }) => (
                      <MobileDateTimePicker
                        sx={{ width: "100%", height: "10%" }}
                        {...field}
                        ampm={false}
                        disabled
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
                  {errors.startTime && (
                    <span className={classes.error}>
                      {errors.startTime.message}
                    </span>
                  )}
                </Form.Group>

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
                        disabled
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

                <Form.Group className="pt-2">
                  <Form.Label htmlFor="actualEndTime" className="formlabel">
                    Actual End Time
                  </Form.Label>
                  <Controller
                    name="actualEndTime"
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
                  {errors.actualEndTime && (
                    <span className={classes.error}>
                      {errors.actualEndTime.message}
                    </span>
                  )}
                </Form.Group>

                <Form.Group className="pt-2">
                  <Form.Label htmlFor="timeLog" className="formlabel">
                    Time Log
                  </Form.Label>
                  <Controller
                    name="timeLog"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        type="text"
                        {...field}
                        id="timeLog"
                        placeholder="Enter timelog"
                      />
                    )}
                  />
                  {errors.timeLog && (
                    <span className={classes.error}>
                      {errors.timeLog.message}
                    </span>
                  )}
                </Form.Group>
              </div>
            </div>
            <div>
              <Form.Label>Issue Description</Form.Label>
              <Controller
                name="issueDescription"
                control={control}
                render={({ field }) => (
                  <CKEditor
                    editor={ClassicEditor}
                    {...field}
                    disabled
                    data={uniqueTicketData[0].issueDescription}
                    id="issueDescription"
                    config={editorConfiguration}
                    name="issueDescription"
                  />
                )}
              />
              {errors.issueDescription && (
                <span className={classes.error}>
                  {errors.issueDescription.message}
                </span>
              )}
            </div>
            <div>
              <Form.Group className="pt-2">
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
                  <span className={classes.error}>{errors.mailTo.message}</span>
                )}
              </Form.Group>

              {uploadFile.map((e, i) => {
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
                        style={{ textDecoration: "none", color: "black" }}
                        href={`${URL}${e.filePath}`}
                      >
                        {e.fileName}
                      </a>
                    )}
                    <div>
                      <DeleteIcon
                        sx={{
                          cursor: "pointer",
                          color: "red",
                        }}
                        onClick={() => removeFileHandler(uploadFile, i)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {uniqueTicketData[0].status !== 1 &&
            uniqueTicketData[0].status !== 3 ? (
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
        </form>
      </div>
      <div>
        <CommanPopup
          popUpState={popUpState}
          setPopupState={setPopupState}
          handleAgree={handleAgree}
          titleText={titleText}
          contentText={contentText}
        />
      </div>
    </div>
  );
};

export default EditTicket;
