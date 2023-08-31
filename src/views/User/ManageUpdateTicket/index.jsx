/* eslint-disable react/prop-types */
import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { ReactComponent as CloseIcon } from "../../../assets/Icons/closeIcon.svg";
import classes from "./index.module.css";
import { addTicketValidation } from "../../../validationSchema/addTicketValidation";
import { fileReaderFunction, openFileNewWindow } from "../../../helper";
import { useEffect, useState } from "react";
import { ReactComponent as Uploadicon } from "../../../../src/assets/Icons/uploadicon.svg";
import {
  useGetAllTicketById,
  useGetAllUserByGroupId,
  useUpdateTicket,
} from "../../../hooks/ticketHooks";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllGroups } from "../../../hooks/groupManagement";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";

const Index = () => {
  const [uploadFile, setUploadFile] = useState([]);

  const [editData, setEditData] = useState(null);

  const role = useSelector((state) => state.profile.role);

  const { id } = useParams();

  const userId = localStorage.getItem("allMasterId");

  const navigate = useNavigate();

  const { data: allTicketData, isloading } = useGetAllTicketById(userId);

  const createdBy = localStorage.getItem("allMasterId");

  const { data: allGroupData, isLoading: groupLoading } =
    useGetAllGroups(userId);

  const { data: userData, isLoading: userLoading } = useGetAllUserByGroupId();

  const onSuccess = () => {
    navigate("/user/mytickets/");
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
    resolver: yupResolver(addTicketValidation),
    mode: "onTouched",
    defaultValues: {
      issueName: "",
      issueGroup: "",
      type: "",
      issueDescription: "",
      // assignedTo: "",
      endTime: null,
      mailList: "",
      managerName: "",
      managedId: "",
      createdBy: createdBy,
    },
  });

  useEffect(() => {
    let Data = allTicketData && allTicketData.filter((e) => e._id === id);

    if (allGroupData) {
      setEditData(Data);
      Data[0].mailList = Data[0]?.mailList[0];
      reset(Data[0]);
    }
  }, [allGroupData]);

  if (groupLoading || userLoading) {
    return <p>Loading...</p>;
  }

  if (isloading) {
    return <p>Loading...</p>;
  }

  console.log(editData, "edit");

  const onSubmit = (data) => {
    const values = getValues();
    data.managedBy = values["managedId"];
    data.endTime = moment(data.endTime).format("DD-MM-YYYY HH:MM");
    data.id = editData[0]._id;
    mutate(data);
  };

  const uploadMultipleFileFunction = async (event) => {
    const errorMessage = {
      NoFileError: `Upload file first`,
      fileTypeErr: `Upload only Pdf`,
      fileSizeErr: "Please upload file",
    };
    try {
      let fileDataArray = await fileReaderFunction({
        fileEvent: event,
        errorMessage,
        fileType: "pdf",
        noLimit: true,
      });
      let sameFileExists;
      if (fileDataArray.length > 0) {
        fileDataArray = fileDataArray.map(({ fileName, fileData }) => {
          return { fileName, fileData };
        });

        uploadFile.map((file) => {
          fileDataArray.map((uploadfile) => {
            if (file.fileName === uploadfile.fileName) {
              sameFileExists = true;
            }
            return sameFileExists;
          });
          return sameFileExists;
        });

        if (sameFileExists === true) {
          toast.error("File already uploaded");
        } else {
          setUploadFile([...uploadFile, ...fileDataArray]);
        }
      } else {
        uploadFile.map((file) => {
          if (file.fileName === fileDataArray.fileName) {
            sameFileExists = true;
          }
          return sameFileExists;
        });
        if (sameFileExists === true) {
          toast.error("File already uploaded");
        } else {
          setUploadFile([...uploadFile, fileDataArray]);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      event.target.value = "";
    }
  };

  const removeFileHandler = (array, index) => {
    setUploadFile(array.filter((file, i) => i !== index));
  };

  console.log(userData, "userData");

  return (
    <div className={classes.mainDiv}>
      <div className={classes.AddTicketDiv}>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.addDiv}>
          <div>
            <div className={classes.addDivHeading}>
              <h2>Edit Ticket</h2>
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
                        placeholder="Enter Type"
                      />
                    )}
                  />
                  {errors.type && (
                    <span className={classes.error}>{errors.type.message}</span>
                  )}
                </Form.Group>
                <Form.Group className="pt-2">
                  <Form.Label htmlFor="issueDescription" className="formlabel">
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
                        placeholder="Enter Issue Description"
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
              </div>
              <div>
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
                {role === 3 && (
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
                          placeholder="Enter Assigned To Name"
                        />
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
                        placeholder="Enter Mail To"
                      />
                    )}
                  />
                  {errors.mailTo && (
                    <span className={classes.error}>
                      {errors.mailTo.message}
                    </span>
                  )}
                </Form.Group>
                <Form.Group className="pt-2">
                  <Form.Label htmlFor="fileupload" className={`formlabel`}>
                    <Uploadicon /> Upload
                  </Form.Label>
                  <input
                    type="file"
                    className={classes.hidden}
                    id="fileupload"
                    multiple
                    onChange={(event) => uploadMultipleFileFunction(event)}
                  />
                  {uploadFile.map((e, i) => {
                    return (
                      <div className={classes.filecontainer} key={i}>
                        <p
                          title={e.fileName}
                          onClick={() => openFileNewWindow(e.fileData)}
                          className={classes.filename}
                        >
                          {e.fileName}
                        </p>
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
            </Form.Group>  */}
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
            </Form.Group>  */}
              </div>
            </div>
            <button type="submit" className={classes.savebtn}>
              Update Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Index;
