import { extend } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import './App.css';
import Countdown from './components/Countdown';
import Rules from './components/Rules';
import Chat from './components/SupportChat/Chat';
import Links from './components/Links';
import Trackers from './components/Trackers/Trackers';

extend(relativeTime);
extend(duration);

function App() {
  return (
    <>
      <Countdown />
      <Trackers />
      <Rules />
      <Chat />
      <Links />
    </>
  );
}

export default App;
