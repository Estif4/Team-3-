import Board from "./Board";

/**
 * BoardPage — renders the existing Board component inside the
 * main AppLayout shell. The boardId can later be read from a
 * URL param or auth state; for now we use the demo board ID.
 */
const DEMO_BOARD_ID =
  import.meta.env.VITE_DEMO_BOARD_ID || "683c68ece89e57e964be30e0";

export default function BoardPage() {
  return <Board boardId={DEMO_BOARD_ID} />;
}
