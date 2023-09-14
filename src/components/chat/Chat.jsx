import moment from "moment";
import "./index.css";

const Chat = ({ message, senderId = true, senderName }) => {
  let name =[]
  if(senderName){
    const nameArray = senderName.split(" ")
    for(let i=0; i<nameArray.length; i++){
        name.push(nameArray[i].slice(0,1))
    }

  }

  return (
    <div className={senderId ? "message own" : "message"}>
      <div className="messageTop">
        {!senderId && <p className="messageBy">{name}</p>}
        <p className="messageText">{message.message}</p>
      </div>
      <div className="messageBottom">{(moment(message.createdAt).fromNow())}</div>
    </div>
  );
};

export default Chat;
