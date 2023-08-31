/* eslint-disable react/prop-types */
import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./index.module.css";
import { addTicketValidation } from "../../../validationSchema/addTicketValidation";
import { fileReaderFunction, openFileNewWindow } from "../../../helper";
import { useState } from "react";
import { useInsertTicket } from "../../../hooks/ticketHooks";
import { ReactComponent as Uploadicon } from "../../../../src/assets/Icons/uploadicon.svg";
// import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
// import moment from "moment";

const AddTicket = ({ setPopup }) => {
  const [file, setFile] = useState(null);
  const createdBy = localStorage.getItem("allMasterId");
  const onSuccess = () => {
    setPopup(null);
  };
  const { mutate } = useInsertTicket(onSuccess);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addTicketValidation),
    mode: "onTouched",
    defaultValues: {
      issueName: "",
      issueGroup: "",
      // endTime: null,
      // startTime: null,
      // actualEndTime: null,
      type: "",
      issueDescription: "",
      assignedTo: "",
      managedBy: "",
      createdBy: createdBy,
    },
  });

  const fileReaderHandler = async (event) => {
    const errorMessage = {
      NoFileError: "Please Upload file",
      fileTypeErr: "Upload only PDF",
      fileSizeErr: "File size should not be more than 5 MB",
    };

    fileReaderFunction({
      fileEvent: event,
      fileType: "pdf",
      fileSize: 1024 * 1024 * 5,
      errorMessage,
      fileRead: "readAsDataURL",
    }).then((result) => setFile(result));

    event.target.value = "";
  };

  const onSubmit = (data) => {
    data.issueGroup = "64eed7d9ab01e0f170cf8224";
    // data.startTime = moment(data.startTime).format("DD-MM-YYYY HH:MM");
    // data.endTime = moment(data.endTime).format("DD-MM-YYYY HH:MM");
    // data.actualEndTime = moment(data.actualEndTime).format("DD-MM-YYYY HH:MM");
    mutate(data);
  };

  return (
    <div className={classes.mainDiv}>
      <div className={classes.AddTicketDiv}>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.addDiv}>
          <div>
            <div className={classes.addDivHeading}>
              <h2>Add Ticket</h2>
            </div>
            <Form.Group className="pt-2">
              <Form.Label htmlFor="Currency" className="formlabel">
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
              <Form.Label htmlFor="ExchangeRate" className="formlabel">
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
                    placeholder="Enter Type"
                  />
                )}
              />
              {errors.type && (
                <span className={classes.error}>{errors.type.message}</span>
              )}
            </Form.Group>
            <Form.Group className="pt-2">
              <Form.Label htmlFor="ExchangeRate" className="formlabel">
                Issue Description
              </Form.Label>
              <Controller
                name="issueDescription"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    type="text"
                    {...field}
                    id="issueDescription"
                    placeholder="Enter CFS Branch Name"
                  />
                )}
              />
              {errors.issueDescription && (
                <span className={classes.error}>
                  {errors.issueDescription.message}
                </span>
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
                  >
                    <option value={""} hidden>
                      Choose Type
                    </option>
                    <option value={"com"}>common</option>
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
              <Form.Label htmlFor="managedBy" className="formlabel">
                Managed By
              </Form.Label>
              <Controller
                name="managedBy"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    type="text"
                    {...field}
                    id="managedBy"
                    placeholder="Enter CFS Branch Name"
                  />
                )}
              />
              {errors.managedBy && (
                <span className={classes.error}>
                  {errors.managedBy.message}
                </span>
              )}
            </Form.Group>
            <Form.Group className="pt-2">
              <Form.Label htmlFor="assignedTo" className="formlabel">
                Assigned To
              </Form.Label>
              <Controller
                name="assignedTo"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    type="text"
                    {...field}
                    id="assignedTo"
                    placeholder="Enter CFS Branch Name"
                  />
                )}
              />
              {errors.assignedTo && (
                <span className={classes.error}>
                  {errors.assignedTo.message}
                </span>
              )}
            </Form.Group>
            <Form.Group className="pt-2">
              <Form.Label htmlFor="fileupload" className={`formlabel`}>
                <Uploadicon />
                <span style={{ margin: "1em" }}>Attachment</span>
              </Form.Label>
              {file === null && (
                <input
                  type="file"
                  name="fileupload"
                  className={classes.hidden}
                  style={{ display: "none" }}
                  id="fileupload"
                  onChange={(event) => fileReaderHandler(event)}
                />
              )}
              <span
                className={classes.attachement}
                onClick={() => openFileNewWindow(file.fileData)}
              >
                {file && file.fileName}
              </span>
            </Form.Group>
            {/* <Form.Group className="pt-2">
              <Form.Label htmlFor="startTime" className="formlabel">
                Start Time
              </Form.Label>
              <Controller
                name="startTime"
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
              {errors.startTime && (
                <span className={classes.error}>
                  {errors.startTime.message}
                </span>
              )}
            </Form.Group> */}
            {/* <Form.Group className="pt-2">
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
                <span className={classes.error}>{errors.endTime.message}</span>
              )}
            </Form.Group> */}
            {/* <Form.Group className="pt-2">
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
            </Form.Group> */}
          </div>
          <button type="submit" className={classes.savebtn}>
            Add Ticket
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTicket;
