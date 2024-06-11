import { Card, Button } from "antd";
import Link from "next/link";

const ChannelCard: React.FC<any> = ({ username, user_id }) => {
  return (
    <Card className="card" title={username} size="small">
      <Link href={`/channels/${user_id}`}> Watch Stream</Link>
    </Card>
  );
};

export default ChannelCard;
