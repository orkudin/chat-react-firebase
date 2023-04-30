import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import Message from "../Message/Message";
import "./Chat.css";

const Chat = (props) => {
  const { userTo } = props;
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [combinedId, setCombinedId] = useState(null);

  const messagesRef = collection(db, "messages");



  function xorEncrypt(data, key) {
    //Шифрование данных при помощи XOR
    const encrypted = [];
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      encrypted.push(charCode);
    }
    return String.fromCharCode(...encrypted);
  }

  function xorDecrypt(encryptedData, key) {
    //Дешифрование данных при помощи XOR
    const decrypted = [];
    for (let i = 0; i < encryptedData.length; i++) {
      const charCode =
        encryptedData.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      decrypted.push(charCode);
    }
    return String.fromCharCode(...decrypted);
  }

  useEffect(() => {
    //Срабатывает при загрузке экрана первый раз и при изменении userTo
    const combinedId = //Скомбинированный Id на основе Id текущего пользователя и того, который был найден при поиске
      auth.currentUser.uid > userTo.uid
        ? auth.currentUser.uid + userTo.uid
        : userTo.uid + auth.currentUser.uid;
    setCombinedId(combinedId);

    const whereCombinedId = where("combinedId", "==", combinedId); //Поиск данных в БД firebase, по параметру "combinedId"

    const queryMessages = query(
      messagesRef, //ссылка на таблицу "messages" в БД
      whereCombinedId,
      orderBy("createdAt") //сортировка по дате создания
    );

    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      //Добаве=ление всех данных в массив
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });

      setMessages(messages); //Выбор всех сообщений из бд в массив
    });

    return () => unsubscribe();
  }, [userTo]);

  const handleSubmit = async (e) => {
    e.preventDefault(); //Отлов ошибок
    if (newMessage === "") {
      return;
    }

    await addDoc(messagesRef, {
      //Добавление сообщения в бд "messages"
      text: xorEncrypt(newMessage, combinedId), //текст сообщения шифруется по ключу "combinedId"
      createdAt: serverTimestamp(), //дата отправки
      user: auth.currentUser.email, //почта текущего юзера
      combinedId,
    });

    setNewMessage(""); //сброс окна смс в пустую строку
    console.log(newMessage);

    ////////////////????\\\\\\\ЗАБЫЛ ДЛЯ ЧЕГО\\\\\\\\\\\\\\
    const fetchData = async () => {
      try {
        await setDoc(doc(db, "userChats", combinedId), {
          userFrom: auth.currentUser.email,
          userTo: userTo.email,
          combinedId,
          lastMessage: newMessage,
        });
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };
    fetchData().catch(console.error);
  };

  return (
    <div>
      <div className="chat-with">Chat with {userTo.email}</div>
      <div className="chat-view">
        {messages.map((message) => (
          <Message
            sender={message.user === auth.currentUser.email ? "user" : "anon"}
            text={xorDecrypt(message.text, message.combinedId)}
            // date={message.createdAt.toDate()}
          />
        ))}
      </div>
      <form className="message-input-container" onSubmit={handleSubmit}>
        <input
          className="message-input"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
          placeholder="Type your message..."
        />
        <button className="send-button" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
