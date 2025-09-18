import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { MyContext } from "../MyContext";
import "./ChatBox.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import { getRequestById } from "../api/helpApi";

function Chat() {
    const navigate = useNavigate();
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  //   const { request } = useContext(MyContext);
  useEffect(() => {
    const fetchRequest = async () => {
      if (requestId) {
        const res = await getRequestById({ requestId });
        if (res?.success) {
          setRequest(res.request);
        }
      }
    };
    fetchRequest();
  }, [requestId]);

  const user1 = request?.userId._id;
  const user2 = request?.helperId._id;

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const decoded = jwtDecode(token);
  const currentUserId = decoded.id;

  const chatId = [user1, user2].sort().join("_");
  // const chatId = requestId;

  // console.log("Current:", currentUserId, "Helper:", helperId, "ChatId:", chatId);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsubscibe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscibe();
  }, [chatId]);

  useEffect(() => {
    const chatBox = document.querySelector(".chat-box");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage) return;
    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: currentUserId,
      name: username,
      text: newMessage,
      timestamp: serverTimestamp(),
    });
    setNewMessage("");
  };
  return (
    <div className="chat-wrapper-container">
      <div className="chat-header">
        <p onClick={()=> navigate(-1)} className="back-arrow"><i class="fa-solid fa-arrow-left"></i></p>
        <img
          src={
            currentUserId === user1
              ? request?.helperId.profilePicture
              : request?.userId.profilePicture
          }
          alt=""
        />
        <p>
          {currentUserId === user1
            ? request?.helperId.name
            : request?.userId.name}
        </p>
      </div>
      <div className="chat-container">
        <div className="chat-box">
          {messages.map((msg, idx) => {
            const time = msg.timestamp?.toDate
              ? msg.timestamp.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";
            return (
              <div
                key={idx}
                className={
                  msg.senderId === currentUserId ? "sender" : "receiver"
                }
              >
                <p>{msg.text}</p>
                <p
                  className={
                    msg.senderId === currentUserId ? "s-time" : "r-time"
                  }
                >
                  {time}
                </p>
              </div>
            );
          })}
        </div>
        <div className="input-box">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Type message..."
          />
          <button onClick={sendMessage}>
            <i class="fa-regular fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
