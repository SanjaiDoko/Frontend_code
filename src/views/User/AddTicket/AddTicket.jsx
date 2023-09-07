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
import { useNavigate } from "react-router-dom";
import { useGetAllGroups } from "../../../hooks/groupManagement";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Loader from "../../../components/Loader/Loader";
// import StylesMap from "@ckeditor/ckeditor5-engine/src/view/stylesmap";
// import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
// import moment from "moment";

const AddTicket = () => {
  const [uploadFile, setUploadFile] = useState([]);
  const navigate = useNavigate();
  const createdBy = localStorage.getItem("allMasterId");
  const groupId = localStorage.getItem("groupId");
  const onSuccess = () => {
    navigate("/user/mytickets");
  };
  const { mutate } = useInsertTicket(onSuccess);
  const { data: allGroupData, isLoading: groupLoading } = useGetAllGroups();
  const {
    handleSubmit,
    control,
    setValue,
    watch,
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
      managerName: "",
      managedId: "",
      mailList: "",
      createdBy: createdBy,
    },
  });

  if (groupLoading) {
    return <Loader />;
  }

  const onSubmit = (data) => {
    delete data.managerName;
    const values = getValues();
    data.managedBy = values["managedId"];
    data.mailList =
      data.mailList && data.mailList.includes(",")
        ? data.mailList.split(",")
        : data.mailList;
    data.files = uploadFile;
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

  return (
    <div className={classes.mainDiv}>
      <div className={classes.AddTicketDiv}>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.addDiv}>
          <div>
            <div className={classes.addDivHeading}>
              <h2>Create Ticket</h2>
            </div>
            <div className={classes.inputDiv}>
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
                <Form.Label htmlFor="issueGroup" className="formlabel">
                  Issue Group
                </Form.Label>
                <Controller
                  name="issueGroup"
                  control={control}
                  render={({ field }) => (
                    <Form.Select
                      className={`formcontrol`}
                      style={{ textTransform: "capitalize" }}
                      {...field}
                      id="issueGroup"
                      onChange={(e) => {
                        field.onChange(e);
                        let managedBy =
                          allGroupData &&
                          allGroupData.filter(
                            (e) => e.groupId === watch("issueGroup")
                          );
                        setValue("managerName", managedBy[0].managedBy.name);
                        setValue("managedId", managedBy[0].managedBy.managedBy);
                      }}
                    >
                      <option value={""} hidden>
                        Choose Type
                      </option>

                      {allGroupData &&
                        allGroupData
                          .filter((e) => e.groupId !== groupId)
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
            <div className="pt-2">
              <Form.Label>Issue Description</Form.Label>
              <Controller
                name="issueDescription"
                control={control}
                render={({ field }) => (
                  <CKEditor
                    editor={ClassicEditor}
                    {...field}
                    id="issueDescription"
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      field.onChange(data);
                    }}
                    defaultValue=""
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
            <div className={classes.inputDiv}>
              <Form.Group className="pt-2">
                <Form.Label htmlFor="type" className="formlabel">
                  Issue Type
                </Form.Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      type="text"
                      {...field}
                      id="type"
                      placeholder="Enter Issue Type"
                    />
                  )}
                />
                {errors.type && (
                  <span className={classes.error}>{errors.type.message}</span>
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
                      placeholder="Managed By"
                    />
                  )}
                />
                {errors.managerName && (
                  <span className={classes.error}>
                    {errors.managerName.message}
                  </span>
                )}
              </Form.Group>
            </div>
            <div>
              <Form.Group className="pt-2">
                <Form.Label htmlFor="mailList" className="formlabel">
                  CC Mail
                </Form.Label>
                <Controller
                  name="mailList"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      type="text"
                      {...field}
                      id="mailList"
                      placeholder="Enter CC Mail"
                    />
                  )}
                />
                {errors.mailList && (
                  <span className={classes.error}>
                    {errors.mailList.message}
                  </span>
                )}
              </Form.Group>
              <Form.Group className="pt-2">
                <div className={classes.uploaddiv}>
                  <Form.Label
                    htmlFor="fileupload"
                    className={`formlabel`}
                    style={{ marginTop: "0px", marginLeft: "7px" }}
                  >
                    <Uploadicon className={classes.uploadicon} />{" "}
                    <span style={{ marginLeft: "10px" }}>Upload</span>
                  </Form.Label>
                </div>
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
                          }}
                          onClick={() => removeFileHandler(uploadFile, i)}
                        />
                      </div>
                    </div>
                  );
                })}
              </Form.Group>
            </div>
            <button type="submit" className={classes.savebtn}>
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTicket;
