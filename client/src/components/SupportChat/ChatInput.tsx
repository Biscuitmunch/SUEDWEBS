import { useState } from 'react';
import styles from './ChatInput.module.css';

interface ChatInputProps {
  canSend: boolean;
  onSendMessage: (msg: string) => void;
  onClearMessages: () => void;
}

function ChatInput({ canSend, onSendMessage, onClearMessages }: ChatInputProps) {
  const [inputText, setInputText] = useState('');

  const handleInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && canSend) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className={styles.inputContainer}>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleInputKey}
        placeholder="eg.. Whats a good sword for fighting King Slime?"
        className={styles.input}
      />
      <button
        onClick={() => {
          onSendMessage(inputText);
          setInputText('');
        }}
        disabled={!canSend}
        className={styles.inputButton}
      >
        Send
      </button>
      <button
        onClick={() => {
          onClearMessages();
          setInputText('');
        }}
        disabled={!canSend}
        className={styles.inputButton}
      >
        Clear
      </button>
    </div>
  );
}

export default ChatInput;
