// firebaseSetup.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// تأكد من استبدال هذه القيم بقيم مشروعك الحقيقية
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

/**
 * إنشاء مستخدم جديد في المجموعة "users"
 * @param {string} uid - معرف المستخدم
 * @param {object} userData - بيانات المستخدم
 */
async function createUser(uid, userData) {
  try {
    const defaultData = {
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
    };
    await setDoc(doc(db, "users", uid), defaultData);
    console.log("تم إنشاء المستخدم بنجاح!");
  } catch (error) {
    console.error("حدث خطأ عند إنشاء المستخدم:", error);
  }
}

/**
 * إنشاء غرفة جديدة في "rooms"
 * @param {string} roomId - معرف الغرفة
 * @param {object} roomData - بيانات الغرفة
 */
async function createRoom(roomId, roomData) {
  try {
    await setDoc(doc(db, "rooms", roomId), {
      name: roomData.name,
      flag: roomData.flag || "",
      createdAt: serverTimestamp(),
      onlineUsers: []
    });
    console.log("تم إنشاء الغرفة بنجاح!");
  } catch (error) {
    console.error("حدث خطأ عند إنشاء الغرفة:", error);
  }
}

/**
 * إرسال رسالة في غرفة عامة
 * @param {string} roomId - معرف الغرفة
 * @param {object} message - بيانات الرسالة
 */
async function sendMessageToRoom(roomId, message) {
  try {
    const messagesRef = collection(db, "rooms", roomId, "messages");
    await addDoc(messagesRef, {
      senderId: message.senderId,
      senderName: message.senderName,
      message: message.message,
      type: message.type || "text", // text, image, code...
      timestamp: serverTimestamp()
    });
    console.log("تم إرسال الرسالة بنجاح!");
  } catch (error) {
    console.error("حدث خطأ عند إرسال الرسالة:", error);
  }
}

/**
 * الحصول على رسائل الغرفة في الوقت الفعلي
 * @param {string} roomId - معرف الغرفة
 * @param {function} callback - دالة لإعادة تشغيل البيانات
 * @returns {function} دالة لإلغاء الاشتراك
 */
function getMessagesFromRoom(roomId, callback) {
  const q = query(collection(db, "rooms", roomId, "messages"), orderBy("timestamp"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    // يتم استدعاء دالة رد الاتصال (callback) بالرسائل الجديدة
    callback(messages);
  }, (error) => {
    console.error("حدث خطأ عند الاستماع للرسائل:", error);
  });
  return unsubscribe;
}

/**
 * إنشاء محادثة خاصة
 * @param {string} chatId - معرف المحادثة
 * @param {string[]} participants - مصفوفة من معرفات المستخدمين
 */
async function createPrivateChat(chatId, participants) {
  try {
    await setDoc(doc(db, "privateChats", chatId), {
      participants: participants,
      createdAt: serverTimestamp()
    });
    console.log("تم إنشاء المحادثة الخاصة بنجاح!");
  } catch (error) {
    console.error("حدث خطأ عند إنشاء المحادثة الخاصة:", error);
  }
}

/**
 * إرسال رسالة في محادثة خاصة
 * @param {string} chatId - معرف المحادثة
 * @param {object} message - بيانات الرسالة
 */
async function sendMessageToPrivateChat(chatId, message) {
  try {
    const messagesRef = collection(db, "privateChats", chatId, "messages");
    await addDoc(messagesRef, {
      senderId: message.senderId,
      senderName: message.senderName,
      message: message.message,
      type: message.type || "text",
      timestamp: serverTimestamp()
    });
    console.log("تم إرسال الرسالة في المحادثة الخاصة بنجاح!");
  } catch (error) {
    console.error("حدث خطأ عند إرسال الرسالة في المحادثة الخاصة:", error);
  }
}

export {
  createUser,
  createRoom,
  sendMessageToRoom,
  createPrivateChat,
  sendMessageToPrivateChat,
  getMessagesFromRoom,
  db
};
