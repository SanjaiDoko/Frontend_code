/* eslint-disable react/prop-types */
import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./index.module.css";
import { updateReceivedTicketValidation } from "../../../validationSchema/updateReceivedTicketValidation";
import { openFileNewWindow } from "../../../helper";
import { useEffect, useRef, useState } from "react";
import { useGetSpecificTicketById } from "../../../hooks/ticketHooks";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllGroups } from "../../../hooks/groupManagement";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { openPopup } from "../../../redux/slices/popupSlice";
import CommanPopup from "../../../components/popup";
import Loader from "../../../components/Loader/Loader";
import Chat from "../../../components/chat/Chat";
import { useGetChatById, useInsertChat } from "../../../hooks/chat";
import { useGetUserDetailsById } from "../../../hooks/userManagement";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import SendIcon from "@mui/icons-material/Send";
import { useSocket } from "../../../hooks/socket";

const EditTicket = () => {
  const messagesDivRef = useRef(null);

  const type = useSelector((state) => state.profile.type);

  const userId = localStorage.getItem("allMasterId");

  const [chatMessage, setChatMessage] = useState([]);

  const [sendMessage, setSendMessage] = useState("");

  const [uploadFile, setUploadFile] = useState([]);

  const socket = useSocket();

  const [liveUser, setLiveUser] = useState(null);

  const role = useSelector((state) => state.profile.role);

  const [payload, setPayload] = useState(null);

  const { id } = useParams();

  const onChatSuccessFunction = (data) => {
    setChatMessage(data);
    console.log(data);
  };

  const { isLoading: chatLoading } = useGetChatById(id, onChatSuccessFunction);

  const { data: userData } = useGetUserDetailsById(userId, type);

  const { mutate: mutateChat } = useInsertChat();

  const {
    data: uniqueTicketData,
    isLoading: ticketLoading,
    isSuccess: ticketSuccess,
  } = useGetSpecificTicketById(id);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createdBy = localStorage.getItem("allMasterId");

  const { data: allGroupData, isLoading: groupLoading } = useGetAllGroups();

  const titleText = "Ticket Resolved !";
  const contentText = "Are you sure that you resolved the Ticket";

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

  useEffect(() => {
    if (ticketSuccess) {
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
  }, [ticketSuccess]);

  if (groupLoading || ticketLoading || chatLoading) {
    return <Loader />;
  }

  const onSubmit = (data) => {
    dispatch(openPopup());
    const values = getValues();
    data.managedBy = values["managedId"];
    data.actualEndTime = moment(data.actualEndTime);
    data.id = uniqueTicketData[0]._id;
    delete data.files;
    delete data.status;
    setPayload(data);
  };

  const sendChatMessage = (e) => {
    e.preventDefault();
    const newChat = {
      message: { message: sendMessage, createdAt: moment().toISOString() },
      senderId: createdBy,
    };

    setChatMessage((prev) => [...prev, newChat]);

    socket.emit("sendMessage", {
      senderId: createdBy,
      senderName: userData.fullName,
      receiverId: [
        uniqueTicketData[0].managerBy,
        uniqueTicketData[0].createdBy,
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
        <div className={classes.AddTicketDiv}>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.addDiv}>
            <div>
              <div className={classes.addDivHeading}>
                <h3>Edit Ticket</h3>
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
              <div className={classes.inputdiv}>
                <div className={classes.flexdiv}>
                  <div className={classes.infodiv}>
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
                          Issue Name :
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
                          Type :
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
                          Issue Group :
                        </Form.Label>
                        <Controller
                          name="issueGroup"
                          control={control}
                          render={({ field }) => (
                            <Form.Select
                              className={`formcontrol`}
                              {...field}
                              id="issueGroup"
                              disabled={
                                role === 3 || uniqueTicketData[0].status !== 0
                              }
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
                          Managed By :
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
                    {uniqueTicketData[0].mailList[0] !== "" && (
                      <div className={classes.mailflexed}>
                        <Form.Group className="pt-2">
                          <Form.Label htmlFor="mailList" className="formlabel">
                            Mail To :
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
                      </div>
                    )}
                    <div>
                      <Form.Label style={{ fontWeight: "bold" }}>
                        Issue Description :
                      </Form.Label>
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
                    <div className={classes.disablediv}>
                      {uniqueTicketData[0]?.problem && (
                        <div className={classes.disablediv}>
                          <Form.Group className="pt-2">
                            <Form.Label htmlFor="type" className="formlabel">
                              Problem :
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
                              Resolution :
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
                  <div className={classes.chattitle}>
                    <h4>Chat</h4>
                  </div>
                  <div className={classes.chat} ref={messagesDivRef}>
                    <div className={classes.chatdiv}>
                      <div
                        className={
                          chatMessage.length < 2 ? `${classes.msgdiv}` : ""
                        }
                      >
                        {chatMessage.map((chat, i) => (
                          <Chat
                            key={i}
                            message={chat.message}
                            beforeDate={chatMessage[i - 1]?.message.createdAt}
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
                <div className={classes.inputdetailsdiv}>
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
                          disabled={uniqueTicketData[0].status === 1}
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
                          disabled={uniqueTicketData[0].status === 1}
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
                  {uniqueTicketData[0].status !== 1 &&
                  uniqueTicketData[0].status !== 3 ? (
                    <button type="submit" className={classes.savebtn}>
                      Resolve Ticket
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
      <div>
        <CommanPopup
          uniqueTicketData={payload}
          titleText={titleText}
          contentText={contentText}
        />
      </div>
    </div>
  );
};

export default EditTicket;
