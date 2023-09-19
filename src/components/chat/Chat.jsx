import moment from "moment";
import "./index.css";

const Chat = ({ message, beforeDate, senderId = true, senderName }) => {
  let name = [];

  const shouldDisplayTime = () => {
    const currentMoment = moment(message.createdAt);
    const prevMoment = moment(beforeDate);

    return !currentMoment.isSame(prevMoment, "day");
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

  return (
    <>
      {shouldDisplayTime() && (
        <p className="day">{showDate(message.createdAt)}</p>
      )}
      <div className={senderId ? "message own" : "message"}>
        <div className="messageTop">
          {!senderId && (
            <p title={senderName} className="messageBy">
              {name}
            </p>
          )}
          <p className="messageText">{message.message}</p>
        </div>
        <div className="messageTime">
          {moment(message.createdAt).format('hh:mm A')}
        </div>
      </div>
    </>
  );
};

export default Chat;
