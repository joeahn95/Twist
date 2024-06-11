"use client";

import { createClient } from "@/utils/supabase/client";
import { FaHeart } from "react-icons/fa";
import { useEffect, useState } from "react";

const FollowTag: React.FC<any> = ({ user_id, channel_id }) => {
  const supabase = createClient();
  const [isFollowing, setIsFollowing]: [boolean, Function] = useState(false);

  // check if user is following this channel
  const checkFollowing = async () => {
    const { data, error } = await supabase
      .from("followers")
      .select()
      .eq("user_id", user_id)
      .eq("fav_id", channel_id);

    if (error) {
      console.log(error);
      return;
    }

    if (data.length !== 0) {
      setIsFollowing(true);
    }
  };

  // follow or unfollow channel
  const handleClick = async () => {
    if (isFollowing) {
      const { error } = await supabase
        .from("followers")
        .delete()
        .eq("user_id", user_id)
        .eq("fav_id", channel_id);

      if (error) {
        console.log(error);
        return;
      }

      setIsFollowing(false);
    } else {
      const { error } = await supabase
        .from("followers")
        .insert({ user_id: user_id, fav_id: channel_id });

      if (error) {
        console.log(error);
        return;
      }

      setIsFollowing(true);
    }
  };

  useEffect(() => {
    checkFollowing();
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span>Follow</span>
      <FaHeart
        onClick={handleClick}
        className={
          isFollowing ? "text-red-500 cursor-pointer" : "cursor-pointer"
        }
      />
    </div>
  );
};

export default FollowTag;
