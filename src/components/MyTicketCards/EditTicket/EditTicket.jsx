/* eslint-disable react/prop-types */
import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ReactComponent as CloseIcon } from "../../../assets/Icons/closeIcon.svg";
import classes from "./index.module.css";
import { addTicketValidation } from "../../../validationSchema/addTicketValidation";
import { fileReaderFunction, openFileNewWindow } from "../../../helper";
import { useState } from "react";
import { useUpdateTicket } from "../../../hooks/ticketHooks";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import moment from "moment";

const EditTicket = ({ myTicketData, setPopup, editId }) => {
  const [file, setFile] = useState(null);
  const createdBy = localStorage.getItem("allMasterId");

  const editData = myTicketData && myTicketData.filter((e) => e._id === editId);

  const onSuccess = () => {
    setPopup(null);
  };
  const { mutate } = useUpdateTicket(onSuccess);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addTicketValidation),
    mode: "onTouched",
    defaultValues: {
      issueName: editData[0].issueName,
      issueGroup: editData[0].issueGroup,
      endTime: moment(editData[0].endTime, "DD-MM-YYYY"),
      startTime: moment(editData[0].startTime, "DD-MM-YYYY"),
      actualEndTime: moment(editData[0].actualEndTime, "DD-MM-YYYY"),
      type: editData[0].type,
      issueDescription: editData[0].issueDescription,
      assignedTo: editData[0].assignedTo,
      managedBy: editData[0].managedBy,
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

  console.log(file, "ff");

  const onSubmit = (data) => {
    data.issueGroup = "64eed7d9ab01e0f170cf8224";
    data.id = editData[0]._id;
    data.startTime = moment(data.startTime).format("DD-MM-YYYY HH:MM");
    data.endTime = moment(data.endTime).format("DD-MM-YYYY HH:MM");
    data.actualEndTime = moment(data.actualEndTime).format("DD-MM-YYYY HH:MM");
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.addDiv}>
      <div>
        <div className={classes.addDivHeading}>
          <h2>Edit Ticket</h2>
          <CloseIcon
            type="button"
            onClick={() => {
              setPopup(null);
            }}
            style={{ cursor: "pointer" }}
          />
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
            <span className={classes.error}>{errors.issueName.message}</span>
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
              <Form.Select className={`formcontrol`} {...field} id="issueGroup">
                <option value={""} hidden>
                  Choose Type
                </option>
                <option value={"com"}>common</option>
              </Form.Select>
            )}
          />
          {errors.issueGroup && (
            <span className={classes.error}>{errors.issueGroup.message}</span>
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
            <span className={classes.error}>{errors.managedBy.message}</span>
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
            <span className={classes.error}>{errors.assignedTo.message}</span>
          )}
        </Form.Group>
        <Form.Group className="pt-2">
          <Form.Label htmlFor="Certificate" className="formlabel">
            Attachement
          </Form.Label>
          <Form.Label htmlFor="fileupload" className={`formlabel`}></Form.Label>
          {file === null && (
            <input
              type="file"
              name="fileupload"
              className={classes.hidden}
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
        <Form.Group className="pt-2">
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
            <span className={classes.error}>{errors.startTime.message}</span>
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
                format="DD-MM-YYYY HH:MM"
                onChange={(e) => field.onChange(e)}
              />
            )}
          />
          {errors.endTime && (
            <span className={classes.error}>{errors.endTime.message}</span>
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
      </div>
      <button type="submit" className={classes.savebtn}>
        Update Ticket
      </button>
    </form>
  );
};

export default EditTicket;
