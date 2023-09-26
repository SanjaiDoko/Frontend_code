import moment from "moment";
import "./index.css";

const Chat = ({
  message,
  beforeDate,
  afterTime,
  senderId = true,
  senderName,
  prevSenderName
}) => {
  let name = [];

  const shouldDisplayDay = () => {
    const currentMoment = moment(message.createdAt);
    const prevMoment = moment(beforeDate);

    return !currentMoment.isSame(prevMoment, "day");
  };
  const shouldDisplayTime = () => {
    const createdAt = moment(message.createdAt);
    const prevMoment = moment(afterTime);

    return !createdAt.isSame(prevMoment, "minutes");
  };

  if (senderName) {
    const nameArray = senderName.split(" ");
    for (let i = 0; i < nameArray.length; i++) {
      name.push(nameArray[i].slice(0, 1));
    }
  }

  const showDate = (date) => {
    if (moment().diff(moment(date), "days") === 0) {
      return "Today";
    } else if (moment().diff(moment(date), "days") === 1) {
      return "Yesterday";
    } else {
      return moment(date).format("DD-MM-YYYY");
    }
  };

  const shouldShowProfile = () => {
    const previousName = prevSenderName
    const sendName = senderName;


    return !(previousName === sendName);
  };

  return (
    <>
      {shouldDisplayDay() && (
        <p className="day">{showDate(message.createdAt)}</p>
      )}
      <div className={senderId ? "message own" : "message"}>
        <div className="messageTop" style={{marginTop: shouldShowProfile() ? "3px":"0px", paddingTop:shouldShowProfile() ? "10px":"0px"}}>
          { !senderId && shouldShowProfile() && (
            <p title={senderName} className="messageBy">
              {name}
            </p>
          )
          }
          <p className="messageText">{message.message}</p>
        </div>
        {shouldDisplayTime() && (
          <div className="messageTime">
            {moment(message.createdAt).format("hh:mm A")}
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
