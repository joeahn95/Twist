import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import StreamContent from "@/components/StreamContent";

// Define the type for your user data
interface ChannelProps {
  params: any;
}

const Channel: React.FC<ChannelProps> = async ({ params }) => {
  const supabase = createClient();

  // get user to check if it is authorized to be here
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if not, redirect to login
  if (!user) {
    return redirect("/login");
  }

  // grab emails of users following this channel
  const getFollowers = async () => {
    const { data, error } = await supabase
      .from("followers")
      .select(
        "*, user_public!followers_user_id_fkey(email, notification_setting)"
      )
      .eq("fav_id", params.id);

    if (error) {
      console.log(error);
      return;
    }

    const emails = await data.map((user) => {
      if (
        user.user_public.notification_setting === "both" ||
        user.user_public.notification_setting === "email"
      ) {
        return user.user_public.email;
      }
    });

    const pushUsers = await data.map((user) => {
      if (
        user.user_public.notification_setting === "both" ||
        user.user_public.notification_setting === "push"
      ) {
        return {
          user_id: user.user_id,
          body: "A stream that you follow is live!",
        };
      }
    });

    return { emails: emails, pushUsers: pushUsers };
  };

  // grab sender username for chat functions later
  const getUsername = async (id: string) => {
    const { data } = await supabase
      .from("user_public")
      .select("username")
      .eq("user_id", id);

    return await data?.[0]?.username;
  };

  const channel_username = await getUsername(params.id);
  const user_username = await getUsername(user.id);
  const followers = await getFollowers();
  const followerEmails = followers?.emails;
  const followerPushes = followers?.pushUsers;

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <div className="animate-in flex-1 flex flex-col gap-4 opacity-0 max-w-4xl px-3 my-8">
        <Header title={`${channel_username}'s Stream`} />
        <StreamContent
          channel_id={params.id}
          channel_username={channel_username}
          user_id={user.id}
          user_username={user_username}
          followerEmails={followerEmails}
          followerPushes={followerPushes}
        />
      </div>
    </div>
  );
};

export default Channel;
