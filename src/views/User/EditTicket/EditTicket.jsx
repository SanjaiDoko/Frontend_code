/* eslint-disable react/prop-types */
import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./index.module.css";
import { addTicketValidation } from "../../../validationSchema/addTicketValidation";
import { openFileNewWindow } from "../../../helper";
import { useEffect, useState } from "react";
import {
  useGetSpecificTicketById,
  useUpdateTicket,
} from "../../../hooks/ticketHooks";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllGroups } from "../../../hooks/groupManagement";
import { URL } from "../../../config";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import moment from "moment";

const EditTicket = () => {
  const [uploadFile, setUploadFile] = useState([]);

  const { id } = useParams();

  const navigate = useNavigate();

  const { data: uniqueTicketData, isLoading: ticketLoading } =
    useGetSpecificTicketById(id);

  const createdBy = localStorage.getItem("allMasterId");

  const { data: allGroupData, isLoading: groupLoading } = useGetAllGroups();

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
      mailList: "",
      managerName: "",
      managedId: "",
      createdBy: createdBy,
    },
  });

  useEffect(() => {
    if (uniqueTicketData) {
      reset(uniqueTicketData[0]);
      setUploadFile(uniqueTicketData[0].files);
    }
  }, [uniqueTicketData]);

  if (groupLoading || ticketLoading) {
    return <p>Loading...</p>;
  }

  if (ticketLoading) {
    return <p>Loading...</p>;
  }

  const editorConfiguration = {
    toolbar: {
      items: [],
    },
  };

  const onSubmit = (data) => {
    const values = getValues();
    data.managedBy = values["managedId"];
    data.mailList = [data.mailList];
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
              <h3>View Ticket</h3>
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
                        style={{ textTransform: "capitalize" }}
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
                        style={{ textTransform: "capitalize" }}
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
              </div>
              <div>
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
                        disabled
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
                        style={{ textTransform: "capitalize" }}
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

              <Form.Group className="pt-2">
                {uploadFile && uploadFile.length > 0 && (
                  <Form.Label htmlFor="mailList" className="formlabel">
                    Uploaded File
                  </Form.Label>
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
                        style={{ textDecoration: "none" }}
                        href={`${URL}${e.filePath}`}
                      >
                        {e.fileName}
                      </a>
                    )}
                    <div>
                      {/* <DeleteIcon
                        sx={{
                          cursor: "pointer",
                          color: "red",
                        }}
                        onClick={() => removeFileHandler(uploadFile, i)}
                      /> */}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => navigate("/user/mytickets")}
              className={classes.savebtn}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTicket;
