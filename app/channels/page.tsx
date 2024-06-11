"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import "../globals.css"; // Importing the global styles
import Header from "@/components/Header";
import ChannelCard from "@/components/ChannelCard";

const Channels = () => {
  const [channels, setChannels] = useState<any[] | null>(null);
  const [favList, setFavList] = useState<any[] | null>(null);
  const supabase = createClient();

  const getChannels = async () => {
    const { data } = await supabase.from("user_public").select();
    setChannels(data);
  };

  const getFavs = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // if a user is authenticated, grab user's favorites
    if (user) {
      const { data } = await supabase
        .from("favorites")
        .select()
        .eq("user_id", user.id);

      setFavList(data);
    }
  };

  const channelList = channels?.map((channel, idx) => {
    return (
      <ChannelCard
        key={idx}
        username={channel.username}
        user_id={channel.user_id}
      />
    );
  });

  useEffect(() => {
    getChannels();
    getFavs();
  }, []);

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="animate-in flex-1 flex flex-col gap-4 opacity-0 max-w-4xl px-3 my-8 w-4/5">
        <Header title="Channels" />
        <div className="channelCards">{channelList}</div>
      </div>
    </div>
  );
};

export default Channels;
