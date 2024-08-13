"use client"
import { useState } from "react";
import { AiOutlineUsb } from "react-icons/ai";
import { FaPaperPlane, FaUser } from "react-icons/fa";
import { FiX } from "react-icons/fi";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const onMenuOpen = () => {
    setIsMenuOpen(true);
  }
  const onMenuClose = () => {
    setIsMenuOpen(false);
  }

  return (
    <div>
      <div className="fixed left-0 top-0 w-full py-2.5 px-3.5 bg-white border-b flex items-center">
        <AiOutlineUsb className="text-[32px] mr-2.5" />
        <h1 className="font-bold">テスト</h1>
        <div className="ml-auto bg-black p-2.5 text-white rounded-full cursor-pointer">
          <FaUser onClick={onMenuOpen} />
        </div>
        {isMenuOpen && <div className="absolute top-[50px] right-2.5 bg-white p-2.5 shadow rounded border w-32">
          <FiX className="ml-auto cursor-pointer" onClick={onMenuClose} />
          <ul className="space-y-2.5 p-2.5 pt-0">
            <li>Profile</li>
            <li>Settings</li>
          </ul>
          <hr />
          <ul className="space-y-2.5 p-2.5">
            <li>Logout</li>
          </ul>
        </div>}
      </div>
      <div className="fixed left-0 bottom-0 w-full p-5 border-t flex space-x-2.5 z-50 whitespace-nowrap">
        <input placeholder="メッセージを入力" className="w-full border rounded px-3.5 py-2.5 outline-none" />
        <button className="bg-black rounded px-3.5 py-2.5 font-bold text-white outline-none flex items-center">
          送信
          <FaPaperPlane className="ml-2.5" />
        </button>
      </div>
    </div>
  )
}