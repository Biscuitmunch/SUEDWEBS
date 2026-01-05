import { extend } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import "./App.css";
import Countdown from "./components/Countdown";
import BossList from "./components/BossList";
import Rules from "./components/Rules";

extend(relativeTime);
extend(duration);

function App() {
  return (
    <>
      <Countdown />
      <BossList />
      <Rules />
    </>
  );
}

export default App;
