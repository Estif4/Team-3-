import { useSelector, useDispatch } from "react-redux";
import {
  increment,
  decrement,
  setMessage,
  reset,
} from "./features/generic/genericSlice";
import type { RootState, AppDispatch } from "./app/store";

function App() {
  const count = useSelector((state: RootState) => state.generic.count);
  const message = useSelector((state: RootState) => state.generic.message);
  const dispatch: AppDispatch = useDispatch();

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Redux Starter</h1>
      <p>{message}</p>
      <p>Count: {count}</p>

      <button onClick={() => dispatch(increment())}>Increment</button>
      <button
        onClick={() => dispatch(decrement())}
        style={{ marginLeft: "0.5rem" }}
      >
        Decrement
      </button>
      <button
        onClick={() => dispatch(setMessage("Redux Toolkit is active"))}
        style={{ marginLeft: "0.5rem" }}
      >
        Set message
      </button>
      <button
        onClick={() => dispatch(reset())}
        style={{ marginLeft: "0.5rem" }}
      >
        Reset
      </button>
    </div>
  );
}

export default App;
