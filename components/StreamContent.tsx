"use client";

import { createClient } from "@/utils/supabase/client";
import FollowTag from "./FollowTag";
import StreamScreen from "./StreamScreen";
import ChatRoom from "./ChatRoom";
import LiveTag from "./LiveTag";
import { useEffect, useState } from "react";

const StreamContent: React.FC<any> = ({
  channel_id,
  channel_username,
  user_id,
  user_username,
  followerEmails,
  followerPushes,
}) => {
  const [isLive, setIsLive]: [boolean, Function] = useState(false);
  const supabase = createClient();

  const checkLive = async () => {
    const { data, error } = await supabase
      .from("user_public")
      .select()
      .eq("user_id", channel_id);

    if (error) {
      console.log(error);
      return;
    }

    setIsLive(data[0].is_live);
  };

  useEffect(() => {
    checkLive();
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <FollowTag user_id={user_id} channel_id={channel_id} />
        {user_id === channel_id ? (
          <LiveTag
            setIsLive={setIsLive}
            isLive={isLive}
            channel_id={channel_id}
            followerEmails={followerEmails}
            followerPushes={followerPushes}
          />
        ) : (
          <></>
        )}
      </div>
      <main className="flex">
        <StreamScreen isLive={isLive} />
        <ChatRoom
          receipt_id={channel_id}
          sender_id={user_id}
          sender_username={user_username}
        />
      </main>
    </>
  );
};

export default StreamContent;
