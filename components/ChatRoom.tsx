"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";

const ChatRoom: React.FC<any> = ({
  receipt_id,
  sender_id,
  sender_username,
}) => {
  const [dataLog, setDataLog]: [any[], Function] = useState([]);
  const [input, setInput]: [string, Function] = useState("");
  const msgContainer: any = useRef(null);
  const supabase = createClient();

  // grab messages
  const fetchMsgs = async () => {
    const { data, error } = await supabase
      .from("chat_log")
      .select("*")
      .eq("receipt_id", receipt_id);

    setDataLog(await data);

    if (error) {
      console.log(error);
      return;
    }
  };

  const submitChat = async () => {
    const { data, error } = await supabase
      .from("chat_log")
      .insert({
        msg: input,
        receipt_id: receipt_id,
        sender_id: sender_id,
        sender_username: sender_username,
      })
      .select();

    if (error) {
      console.log(error);
    }
    const newData = await data?.[0];

    setInput("");
    setDataLog([...dataLog, newData]);
  };

  // can send chat with enter key as well
  const handleEnter = (e: any) => {
    if (e.key === "Enter") {
      submitChat();
    }
  };

  const msgList = dataLog?.map((data, idx) => {
    return (
      <p
        className="text-xs"
        key={idx}
      >{`${data.sender_username}: ${data.msg}`}</p>
    );
  });

  // subscribe to updates in the chat_log database
  // update state only if payload is for this specific user
  const posts = supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "chat_log" },
      (payload) => {
        if (
          payload.new.receipt_id === receipt_id &&
          payload.new.sender_id !== sender_id
        ) {
          setDataLog([...dataLog, payload.new]);
        }
      }
    )
    .subscribe();

  // to keep scrollbar down in list of msgs
  useEffect(() => {
    if (msgContainer.current) {
      msgContainer.current.scrollTop = msgContainer.current.scrollHeight;
    }
  }, [msgList]);

  // get initial list of msgs
  useEffect(() => {
    fetchMsgs();
  }, []);

  return (
    <div className="flex-1 w-48 flex flex-col border-2 ml-4 p-2">
      <main className="flex-1 flex flex-col">
        <div className="border-2 h-60 overflow-auto" ref={msgContainer}>
          {msgList}
        </div>
        <input
          className="text-black text-xs my-2"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleEnter}
        />
        <input
          type="button"
          value="submit"
          className="text-xs border-2"
          onClick={submitChat}
        />
      </main>
    </div>
  );
};

export default ChatRoom;
