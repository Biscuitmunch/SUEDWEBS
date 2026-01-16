import { extend } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import './App.css';
import Countdown from './components/Countdown';
import Trackers from './components/Trackers/Trackers';
import Rules from './components/Rules';
import Chat from './components/SupportChat/Chat';
import Links from './components/Links';

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
