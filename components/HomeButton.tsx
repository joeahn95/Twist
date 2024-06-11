import Link from "next/link";

export default function HomeButton() {
  return (
    <Link
      href="/"
      className="py-2 px-3 flex rounded-md no-underline hover:bg-btn-background-hover border"
    >
      Home
    </Link>
  );
}
