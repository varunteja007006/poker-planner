import { useParams } from "react-router";

export default function PokerBoard() {
  const params = useParams();
  return (
    <div>
      PokerBoard
      <pre>{JSON.stringify(params, null, 3)}</pre>
    </div>
  );
}
