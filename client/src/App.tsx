import { extend } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import './App.css';
import Countdown from './components/Countdown';
import BossList from './components/BossList';
import Rules from './components/Rules';
import Chat from './components/SupportChat/Chat';
import Links from './components/Links';
import DeathCount from './components/DeathCount';

extend(relativeTime);
extend(duration);

function App() {
  return (
    <>
      <Countdown />
      <DeathCount />
      <BossList />
      <Rules />
      <Chat />
      <Links />
    </>
  );
}

export default App;
