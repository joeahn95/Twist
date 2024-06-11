"use client";

import { createClient } from "@/utils/supabase/client";
import Switch from "react-switch";

const FollowTag: React.FC<any> = ({
  setIsLive,
  isLive,
  channel_id,
  followerEmails,
  followerPushes,
}) => {
  const supabase = createClient();

  // changes state of live
  const handleSubmit = async () => {
    const { error } = await supabase
      .from("user_public")
      .update({ is_live: !isLive })
      .eq("user_id", channel_id);

    if (error) {
      console.log(error);
      return;
    }

    // if switching TO live, email following users
    if (!isLive) {
      await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: followerEmails.join(", "),
          subject: "stream is live!",
          text: "checkout the live stream!",
        }),
      });

      // send to any relevant users for push notifications
      await supabase.from("notifications").insert(followerPushes);
    }

    // change state
    setIsLive(!isLive);
  };

  return (
    <div className="flex items-center gap-2">
      <span>Go Live!</span>
      <Switch checked={isLive} onChange={handleSubmit} />
    </div>
  );
};

export default FollowTag;
