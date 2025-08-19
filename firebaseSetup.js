// firebaseSetup.js

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR-API-KEY",
  authDomain: "YOUR-PROJECT.firebaseapp.com",
  projectId: "YOUR-PROJECT-ID",
  storageBucket: "YOUR-PROJECT.appspot.com",
  messagingSenderId: "XXXXXXXXXX",
  appId: "YOUR-APP-ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// إنشاء مستخدم جديد في المجموعه "users"
async function createUser(uid, userData) {
  await setDoc(doc(db, "users", uid), {
    username: userData.username,
    email: userData.email || "",
    age: userData.age || null,
    gender: userData.gender || "male",
    bio: userData.bio || "",
    profilePicUrl: userData.profilePicUrl || "",
    coverPicUrl: userData.coverPicUrl || "",
    favoriteSongUrl: userData.favoriteSongUrl || "",
    followers: userData.followers || [],
    following: userData.following || [],
    type: userData.type || "member",
    createdAt: serverTimestamp(),
  });
}

// إنشاء غرفة جديدة في "rooms"
async function createRoom(roomId, roomData) {
  await setDoc(doc(db, "rooms", roomId), {
    name: roomData.name,
    flag: roomData.flag || "",
    createdAt: serverTimestamp(),
    onlineUsers: []
  });
}

// إرسال رسالة في غرفة عامة
async function sendMessageToRoom(roomId, message) {
  const messagesRef = collection(db, "rooms", roomId, "messages");
  await addDoc(messagesRef, {
    senderId: message.senderId,
    senderName: message.senderName,
    message: message.message,
    type: message.type || "text", // text, image, code...
    timestamp: serverTimestamp()
  });
}

// إنشاء محادثة خاصة
async function createPrivateChat(chatId, participants) {
  await setDoc(doc(db, "privateChats", chatId), {
    participants: participants, // Array of user ids
    createdAt: serverTimestamp()
  });
}

// إرسال رسالة في محادثة خاصة
async function sendMessageToPrivateChat(chatId, message) {
  const messagesRef = collection(db, "privateChats", chatId, "messages");
  await addDoc(messagesRef, {
    senderId: message.senderId,
    senderName: message.senderName,
    message: message.message,
    type: message.type || "text",
    timestamp: serverTimestamp()
  });
}

export {
  createUser,
  createRoom,
  sendMessageToRoom,
  createPrivateChat,
  sendMessageToPrivateChat,
  db
};
