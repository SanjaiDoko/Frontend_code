import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./index.module.css";
import { addTicketValidation } from "../../../validationSchema/addTicketValidation";
import { editorConfiguration, fileReaderFunction, openFileNewWindow } from "../../../helper";
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
import { useGetAllUsers } from "../../../hooks/userManagement";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import { Checkbox } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
			textTransform: "capitalize",
		},
	},
};

const AddTicket = () => {
  const [uploadFile, setUploadFile] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("allMasterId");
  const createdBy = localStorage.getItem("allMasterId");
  const groupId = localStorage.getItem("groupId");
  const onSuccess = () => {
    navigate("/ticket/mytickets");
  };
  const { mutate } = useInsertTicket(onSuccess);
  const { data: allGroupData, isLoading: groupLoading } = useGetAllGroups();
  const {data: usersData, isLoading: userDataLoading} = useGetAllUsers()
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
      mailList: [],
      createdBy: createdBy,
    },
  });

  if (groupLoading || userDataLoading) {
    return <Loader />;
  }

  const onSubmit = (data) => {
    delete data.managerName;
    const values = getValues();
    data.managedBy = values["managedId"];
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
                    config={editorConfiguration} 
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
                      style={{ textTransform: "capitalize" }}
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
              <Form.Label id="mailList">
              CC Mail (Optional)
              </Form.Label>
              <Controller
                control={control}
                name="mailList"
                render={({ field: { onChange, value } }) => (
                  <Select
                    fullWidth
                    id="mailList"
                    multiple
                    displayEmpty
                    value={value}
                    onChange={onChange}
                    className={classes.costheadingSelect}
                    sx={{
                      fontSize: "14px",
                    }}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <span>Choose Users</span>;
                      }
                      return usersData.filter((user) => selected.includes(user.email)).map((user) => user.fullName).join(", ")
                    }}
                    MenuProps={MenuProps}
                  >
                    {usersData &&
                      usersData.filter(user => (user._id != userId || user.status != 2)).map((user) => (
                        <MenuItem key={user._id} value={user.email}>
                          <Checkbox
                            checked={
                              watch("mailList").indexOf(user.email) > -1
                            }
                          />
                          <ListItemText primary={user.fullName} />
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
              <p className={classes.error}>{errors.mailList?.message}</p>
            </Form.Group>
              <Form.Group className="pt-2">
                <div className={classes.uploaddiv}>
                  <Form.Label
                    htmlFor="fileupload"
                    className={`formlabel`}
                    style={{ marginTop: "0px", marginLeft: "7px" }}
                  >
                    <Uploadicon className={classes.uploadicon} />{" "}
                    <span style={{ marginLeft: "10px", color: "#00a1ff" }}>
                      Upload
                    </span>
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
                            color: "#b2b2b2",
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
