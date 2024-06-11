import Link from "next/link";

export default async function ChannelsButton() {
  return (
    <Link
      href="/channels"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Channels
    </Link>
  );
}
