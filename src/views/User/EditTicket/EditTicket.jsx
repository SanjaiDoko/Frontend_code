/* eslint-disable react/prop-types */
import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./index.module.css";
import { addTicketValidation } from "../../../validationSchema/addTicketValidation";
import { openFileNewWindow } from "../../../helper";
import { useEffect, useRef, useState } from "react";
import { useGetSpecificTicketById } from "../../../hooks/ticketHooks";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllGroups } from "../../../hooks/groupManagement";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Loader from "../../../components/Loader/Loader";
import Chat from "../../../components/chat/Chat";
import { io } from "socket.io-client";
import { useGetChatById, useInsertChat } from "../../../hooks/chat";
import { useSelector } from "react-redux";
import moment from "moment";
import { useGetUserDetailsById } from "../../../hooks/userManagement";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import SendIcon from "@mui/icons-material/Send";
import { SOCKETPORT } from "../../../config";

const EditTicket = () => {
  const messagesDivRef = useRef(null);

  const createdBy = localStorage.getItem("allMasterId");

  const type = useSelector((state) => state.profile.type);

  const [chatMessage, setChatMessage] = useState([]);

  const [sendMessage, setSendMessage] = useState("");

  const [uploadFile, setUploadFile] = useState([]);

  const [socket, setSocket] = useState(null);

  const [liveUser, setLiveUser] = useState(null);

  const { id } = useParams();

  const role = useSelector((state) => state.profile.role);

  const navigate = useNavigate();

  const onChatSuccessFunction = (data) => {
    setChatMessage(data);
  };

  const { isLoading: chatLoading } = useGetChatById(id, onChatSuccessFunction);

  const { data: userData } = useGetUserDetailsById(createdBy, type);

  const { mutate: mutateChat } = useInsertChat();

  const {
    data: uniqueTicketData,
    isLoading: ticketLoading,
    isSuccess: ticketSuccess,
  } = useGetSpecificTicketById(id);

  const { data: allGroupData, isLoading: groupLoading } = useGetAllGroups();

  const {
    control,
    reset,
    watch,
    setValue,
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
    setSocket(io(SOCKETPORT));
  }, []);

  useEffect(() => {
    if (messagesDivRef.current) {
      messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;
    }
  }, [socket, messagesDivRef.current, chatMessage]);

  useEffect(() => {
    socket?.emit("users", id, createdBy, role);
    socket?.on("getUsers", (users) => {
      setLiveUser(users);
    });

    socket?.on("getMessage", (data) => {
      console.log(data, "emit");
      const newChat = {
        message: { message: data.text, createdAt: data.createdAt },
        senderId: data.senderId,
        senderName: data.senderName,
      };
      setChatMessage((prev) => [...prev, newChat]);
    });
  }, [socket, id, createdBy]);

  useEffect(() => {
    if (ticketSuccess) {
      reset(uniqueTicketData[0]);
      setUploadFile(uniqueTicketData[0].files);
    }
  }, [ticketSuccess]);

  if (groupLoading || ticketLoading || chatLoading) {
    return <Loader />;
  }

  const editorConfiguration = {
    toolbar: {
      items: [],
    },
  };

  console.log(uniqueTicketData[0]);
  const sendChatMessage = (e) => {
    e.preventDefault();
    const newChat = {
      message: {
        message: sendMessage,
        createdAt: moment().toISOString(),
      },
      senderId: createdBy,
    };

    setChatMessage((prev) => [...prev, newChat]);

    socket.emit("sendMessage", {
      senderId: createdBy,
      senderName: userData.fullName,
      receiverId: [
        uniqueTicketData[0].assignedTo,
        uniqueTicketData[0].managerBy,
      ],
      text: sendMessage,
      createdAt: moment().toISOString(),
    });

    mutateChat({
      ticketId: id,
      messageFrom: createdBy,
      content: sendMessage,
    });

    setSendMessage("");
  };

  return (
    <div className="container">
      <div className={classes.mainDiv}>
        <div className={uniqueTicketData[0].assignedTo ? `${classes.AddTicketDiv}`: `${classes.AddTicketDivCenter}`}>
          <form className={classes.addDiv}>
            <div className={classes.leftviewTicket}>
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
              <p
                style={{
                  fontWeight: "bold",
                  marginBottom: "0",
                  textTransform: "uppercase",
                }}
              >
                {uniqueTicketData[0].ticketId}
              </p>
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
                      <span className={classes.error}>
                        {errors.type.message}
                      </span>
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
                      disabled
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
                    <span className={classes.error}>
                      {errors.mailTo.message}
                    </span>
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
                        <p
                          title={e.fileName}
                          onClick={() => openFileNewWindow(e.filePath)}
                          className={classes.filename}
                        >
                          {e.fileName}
                        </p>
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
          {uniqueTicketData[0].assignedTo &&
          <div className={classes.rightchat}>
          <div className={classes.chattitle}>
            <h4>Chat</h4>
          </div>
          <div className={classes.chat} ref={messagesDivRef}>
            <div className={classes.chatdiv}>
            <div className={chatMessage.length <2 ? `${classes.msgdiv}` : ""}>
              {chatMessage.map((chat, i) => (
                <Chat
                  key={i}
                  message={chat.message}
                  beforeDate = {chatMessage[i-1]?.message.createdAt}
                  senderName={chat.senderName}
                  senderId={chat.senderId === createdBy}
                />
              ))}
              </div>
              <div className={classes.chatInput}>
                <input
                  type="text"
                  className={classes.chatInputBox}
                  value={sendMessage}
                  placeholder="Message"
                  onChange={(e) => setSendMessage(e.target.value)}
                />
                {sendMessage ? (
                  <SendIcon
                    className={classes.sendMessage}
                    width={10}
                    onClick={sendChatMessage}
                  />
                ) : (
                  <CancelScheduleSendIcon
                    className={classes.sendMessage}
                    width={10}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
          }
          
        </div>
      </div>
    </div>
  );
};

export default EditTicket;
