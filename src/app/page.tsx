"use client"
import { useState, useEffect } from "react";
import { FaPaperPlane, FaUser } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { auth, db } from "@/lib/firebaseConfig";
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { addDoc, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import Image from "next/image";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>("匿名");
  const [selectedRoom, setSelectedRoom] = useState<string>("general");
  const [rooms] = useState<string[]>(["general", "tech", "gaming", "study"]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUserName(user.displayName || "匿名");
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedRoom) return;

    const q = query(collection(db, `rooms/${selectedRoom}/messages`), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });

    return () => unsubscribe();
  }, [selectedRoom]);

  const onMenuOpen = () => {
    setIsMenuOpen(true);
  }
  
  const onMenuClose = () => {
    setIsMenuOpen(false);
  }

  const handleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(result => {
        setUser(result.user);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => setUser(null))
      .catch(error => console.error(error));
    setIsMenuOpen(false);
  };

  const handleUserNameChange = async () => {
    if (user && userName.trim() !== "") {
      try {
        await updateProfile(user, { displayName: userName });
        setUserName(userName);
      } catch (error) {
        console.error("Error updating profile: ", error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    try {
      await addDoc(collection(db, `rooms/${selectedRoom}/messages`), {
        text: message,
        userId: user.uid,
        userName: user.displayName,
        createdAt: new Date(),
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="sticky left-0 top-0 w-full py-2.5 px-3.5 bg-white border-b flex items-center">
        <div className="flex items-center">
          <div className="w-[30px] mr-2.5">
            <Image src="/logo.svg" alt="Chirp" width={100} height={100} className="rotate-180" />
          </div>
          <select
            className="rounded px-2.5 py-1.5 outline-none"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            {rooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>
        </div>
        <div className="ml-auto">
          {user ? (
            <div className="bg-black p-2.5 text-white rounded-full cursor-pointer" onClick={onMenuOpen}>
              <FaUser />
            </div>
          ) : (
            <div>
              <button onClick={handleSignIn} className="bg-black rounded px-2.5 py-1.5 font-bold text-white outline-none">
                ログイン
              </button>
            </div>
          )}
        </div>
        {isMenuOpen && <div className="absolute top-[50px] right-2.5 bg-white p-2.5 shadow rounded border w-60">
          <FiX className="ml-auto cursor-pointer" onClick={onMenuClose} />
          <ul className="space-y-2.5 p-2.5 pt-0">
            <li>設定</li>
            <li>
              <input 
                type="text" 
                placeholder="ユーザー名を入力" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                className="w-full border rounded px-3.5 py-2.5 outline-none"
              />
            </li>
            <li>
              <button onClick={handleUserNameChange} className="bg-black font-bold outline-none text-white px-2.5 py-1.5 rounded">
                保存
              </button>
            </li>
          </ul>
          <hr />
          <ul className="space-y-2.5 p-2.5">
            <li onClick={handleSignOut} className="cursor-pointer">ログアウト</li>
          </ul>
        </div>}
      </div>
      {/* Chat Messages */}
      <div className="p-5 space-y-5">
        {messages.map((msg, index) => (
          <div key={index} className={`${msg.userId === user?.uid ? "text-right" : "text-left"}`}>
            {msg.text && <p className="bg-gray-200 inline-block rounded px-3.5 py-2.5">{msg.text}</p>}
            <p className="text-xs text-gray-400">{msg.userName}</p>
          </div>
        ))}
      </div>
      {/* Message Input */}
      {user && (
        <div className="fixed left-0 bottom-0 w-full p-5 border-t flex space-x-2.5 z-50 whitespace-nowrap">
          <input
            placeholder="メッセージを入力"
            className="w-full border rounded px-3.5 py-2.5 outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-black rounded px-3.5 py-2.5 font-bold text-white outline-none flex items-center"
            onClick={handleSendMessage}
          >
            送信
            <FaPaperPlane className="ml-2.5" />
          </button>
        </div>
      )}
    </div>
  );
}