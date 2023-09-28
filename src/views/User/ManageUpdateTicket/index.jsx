/* eslint-disable react/prop-types */
import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { ReactComponent as CloseIcon } from "../../../assets/Icons/closeIcon.svg";
import classes from "./index.module.css";
import { updateManageTicketValidation } from "../../../validationSchema/updateManageTicketValidation";
import { openFileNewWindow } from "../../../helper";
import { useEffect, useRef, useState } from "react";
import {
  useGetAllUserByGroupId,
  useGetSpecificTicketById,
  useMangerUpdateTicket,
} from "../../../hooks/ticketHooks";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllGroups } from "../../../hooks/groupManagement";
import { useSelector } from "react-redux";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Loader from "../../../components/Loader/Loader";
import Chat from "../../../components/chat/Chat";
import { useGetChatById, useInsertChat } from "../../../hooks/chat";
import { useGetUserDetailsById } from "../../../hooks/userManagement";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import SendIcon from "@mui/icons-material/Send";
import { useSocket } from "../../../hooks/socket";

const Index = () => {
  const messagesDivRef = useRef(null);

  const [chatMessage, setChatMessage] = useState([]);

  const [sendMessage, setSendMessage] = useState("");

  const [uploadFile, setUploadFile] = useState([]);

  const socket = useSocket();

  const [liveUser, setLiveUser] = useState(null);

  const role = useSelector((state) => state.profile.role);

  const groupId = localStorage.getItem("groupId");

  const { id } = useParams();

  const userId = localStorage.getItem("allMasterId");

  const navigate = useNavigate();

  const createdBy = localStorage.getItem("allMasterId");

  const onChatSuccessFunction = (data) => {
    setChatMessage(data);
  };

  const type = useSelector((state) => state.profile.type);

  const { data: userData } = useGetUserDetailsById(userId, type);

  const { isLoading: chatLoading, refetch } = useGetChatById(
    id,
    onChatSuccessFunction
  );

  const { mutate: mutateChat } = useInsertChat();

  const {
    data: uniqueTicketData,
    isLoading: ticketLoading,
    isSuccess: ticketSuccess,
  } = useGetSpecificTicketById(id);

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
      const newChat = {
        message: { message: data.text, createdAt: data.createdAt },
        senderId: data.senderId,
        senderName: data.senderName,
      };
      setChatMessage((prev) => [...prev, newChat]);
    });
  }, [socket, id, createdBy]);

  const { data: allUser, isLoading: userLoading } =
    useGetAllUserByGroupId(groupId);

  const { data: allGroupData, isLoading: groupLoading } =
    useGetAllGroups(userId);

  const onSuccess = () => {
    navigate("/ticket/manageticket/");
  };

  const editorConfiguration = {
    toolbar: {
      items: [],
    },
  };

  const { mutate } = useMangerUpdateTicket(onSuccess);
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
      // mailList: "",
      managerName: "",
      managedId: "",
      createdBy: createdBy,
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (ticketSuccess) {
      setUploadFile(uniqueTicketData[0].files);
      if (uniqueTicketData[0].endTime) {
        uniqueTicketData[0].endTime = moment(uniqueTicketData[0].endTime);
      } else {
        uniqueTicketData[0].endTime = null;
      }

      let data = {
        issueName: uniqueTicketData[0].issueName,
        issueDescription: uniqueTicketData[0].issueDescription,
        issueGroup: uniqueTicketData[0].issueGroup,
        type: uniqueTicketData[0].type,
        assignedTo: uniqueTicketData[0].assignedTo,
        endTime: uniqueTicketData[0].endTime,
        // mailList: uniqueTicketData[0].mailList.join(','),
        managerName: uniqueTicketData[0].managerName,
        managedId: uniqueTicketData[0].managedId,
        createdBy: uniqueTicketData[0].createdBy,
      };
      reset(data);
    }
  }, [reset, ticketSuccess]);

  if (groupLoading || ticketLoading || userLoading || chatLoading) {
    return <Loader />;
  }

  const onSubmit = (data) => {
    const values = getValues();
    data.managedBy = values["managedId"];
    data.endTime = moment(data.endTime).format("DD-MM-YYYYTHH:mm");
    data.id = uniqueTicketData[0]._id;
    delete data.files;
    mutate(data);
  };
  const sendChatMessage = (e) => {
    e.preventDefault();
    const newChat = {
      message: {
        message: sendMessage,
        createdAt: moment().toISOString(),
      },
      senderId: userId,
    };

    setChatMessage((prev) => [...prev, newChat]);

    socket.emit("sendMessage", {
      senderId: createdBy,
      senderName: userData.fullName,
      receiverId: [
        uniqueTicketData[0].assignedTo,
        uniqueTicketData[0].createdBy,
      ],
      text: sendMessage.trim(),
      createdAt: moment().toISOString(),
    });

    mutateChat({
      ticketId: id,
      messageFrom: userId,
      content: sendMessage.trim(),
    });

    setSendMessage("");
  };
  return (
    <div className="container">
      <div className={classes.mainDiv}>
        <div className={classes.AddTicketDiv}>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.addDiv}>
            <div>
              <div className={classes.addDivHeading}>
                <h3>Assign Ticket</h3>
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
                  <h4 className={classes.reject}>Task is Rejected</h4>
                )}
                {uniqueTicketData[0].status === 1 && (
                  <h4 type="button" className={classes.completed}>
                    Task is Completed
                  </h4>
                )}
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
                      {uniqueTicketData[0].ticketId}
                    </p>
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
                              style={{
                                textOverflow: "ellipsis",
                                maxWidth: "250px",
                                textTransform: "capitalize",
                              }}
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
                    <div className={classes.disableflexdiv}>
                      {uniqueTicketData[0]?.problem && (
                        <div className={classes.disablediv}>
                          <Form.Group className="pt-2">
                            <Form.Label htmlFor="type" className="formlabel">
                              Problem
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={uniqueTicketData[0]?.problem}
                              id="type"
                              disabled
                              placeholder="Enter Type"
                            />
                          </Form.Group>
                        </div>
                      )}
                      {uniqueTicketData[0]?.resolution && (
                        <div className={classes.disablediv}>
                          <Form.Group className="pt-2">
                            <Form.Label htmlFor="type" className="formlabel">
                              Resolution
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={uniqueTicketData[0]?.resolution}
                              id="type"
                              disabled
                              placeholder="Enter Type"
                            />
                          </Form.Group>
                        </div>
                      )}
                    </div>
                  </div>
                  {uniqueTicketData[0].assignedTo &&
                    uniqueTicketData[0].status !== 1 && (
                      <>
                        <div className={classes.chattitle}>
                          <h4>Chat</h4>
                        </div>
                        <div className={classes.chat} ref={messagesDivRef}>
                          <div className={classes.chatdiv}>
                            <div
                              className={
                                chatMessage.length < 2
                                  ? `${classes.msgdiv}`
                                  : ""
                              }
                            >
                              {chatMessage.map((chat, i) => (
                                <Chat
                                  key={i}
                                  message={chat.message}
                                  beforeDate={
                                    chatMessage[i - 1]?.message.createdAt
                                  }
                                  afterTime={
                                    chatMessage[i + 1]?.message.createdAt
                                  }
                                  senderName={chat.senderName}
                                  prevSenderName={
                                    chatMessage[i + 1]?.senderName
                                  }
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
                          </div>
                          <div className={classes.chatInput}>
                            <input
                              type="text"
                              className={classes.chatInputBox}
                              value={sendMessage}
                              placeholder="Message"
                              onChange={(e) => setSendMessage(e.target.value)}
                            />
                            {sendMessage.trim() !== "" ? (
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
                      </>
                    
                    )}
               
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
                              <p
                                title={e.fileName}
                                onClick={() => openFileNewWindow(e.filePath)}
                                className={classes.filename}
                              >
                                {e.fileName}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    {role === 3 && (
                      <Form.Group className="pt-2">
                        <Form.Label htmlFor="assignedTo" className="formlabel">
                          {uniqueTicketData[0].status === 0
                            ? "Assign To"
                            : "Assigned To"}
                        </Form.Label>
                        <Controller
                          name="assignedTo"
                          control={control}
                          render={({ field }) => (
                            <Form.Select
                              className={`formcontrol`}
                              disabled={uniqueTicketData[0].status !== 0}
                              {...field}
                              id="assignedTo"
                            >
                              <option value={""} hidden>
                                Choose Type
                              </option>
                              {allUser &&
                                allUser.map((e, i) => {
                                  return (
                                    <option
                                      key={i}
                                      value={e._id}
                                      style={{ textTransform: "capitalize" }}
                                    >
                                      {e.fullName}{" "}
                                      {e._id === userId && "(Assign Myself)"}
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
                            disabled={uniqueTicketData[0].status !== 0}
                            {...field}
                            ampm={false}
                            slotProps={{
                              textField: {
                                readOnly: true,
                              },
                            }}
                            format="DD-MM-YYYY HH:mm"
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
                    {uniqueTicketData[0].status === 1 && (
                      <Form.Group className="pt-2">
                        <Form.Label htmlFor="endTime" className="formlabel">
                          Actual End Time
                        </Form.Label>
                        <MobileDateTimePicker
                          sx={{ width: "100%" }}
                          disabled
                          value={moment(uniqueTicketData[0].actualEndTime)}
                          ampm={false}
                          slotProps={{
                            textField: {
                              readOnly: true,
                            },
                          }}
                          format="DD-MM-YYYY HH:mm"
                        />
                      </Form.Group>
                    )}
                  </div>
                  {uniqueTicketData[0].status !== 3 &&
                  uniqueTicketData[0].status === 0 ? (
                    <button type="submit" className={classes.savebtn}>
                      Assign Ticket
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
           </div> 
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
