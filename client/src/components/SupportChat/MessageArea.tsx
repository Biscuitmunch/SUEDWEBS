import { useEffect, useRef } from 'react';
import { MsgSenders } from '../../Util';
import type { Message } from '../../Util';
import styles from './MessageArea.module.css';

interface MessageAreaProps {
  msgs: Message[];
}

function MessageArea({ msgs }: MessageAreaProps) {
  const msgContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat on new msg
  useEffect(() => {
    if (msgContainerRef.current) {
      msgContainerRef.current.scrollTop = msgContainerRef.current.scrollHeight;
    }
  }, [msgs]);

  return (
    <div className={styles.msgContainer} ref={msgContainerRef}>
      {msgs.map((msg, idx) => (
        <div
          key={idx}
          className={`${styles.msg} ${(() => {
            switch (msg.role) {
              case MsgSenders.user:
                return styles.msgUser;
              case MsgSenders.bot:
                return styles.msgBot;
              case MsgSenders.info:
                return styles.msgInfo;
              case MsgSenders.error:
                return styles.msgError;
            }
          })()}`}
        >
          <div>
            <p className={styles.msgTxt}>{msg.content}</p>
          </div>
          <p className={styles.msgTime}>
            {msg.time.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      ))}
    </div>
  );
}

export default MessageArea;
