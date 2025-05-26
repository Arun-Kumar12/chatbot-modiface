import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sendMessage } from '../services/api';
import { GrUserManager } from "react-icons/gr";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { IoSendSharp } from "react-icons/io5";

export default function Chat() {
  const [sessionId] = useState(() => uuidv4());

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    setMessages([
      {
        from: 'bot',
        text: "Hi! I'm your cooking assistant. What would you like to cook today?",
        id: Date.now()
      }
    ]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages(msgs => [
      ...msgs,
      { from: 'user', text, id: `${Date.now()}_user` }
    ]);
    setInput('');
    setIsLoading(true);

    try {
      const { reply } = await sendMessage(text, sessionId);
      setMessages(msgs => [
        ...msgs,
        { from: 'bot', text: reply, id: `${Date.now()}_bot` }
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(msgs => [
        ...msgs,
        { from: 'bot', text: 'Something went wrong. Please try again.', id: `${Date.now()}_error` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvatarContent = (sender) =>
    sender === 'bot' ? '🧑‍🍳' : <GrUserManager />;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>🧑‍🍳 ModiFace ChefBot</h2>
      </div>
      <div className="chat-messages">
        {messages.map(m => (
          <div key={m.id} className={`message ${m.from}`}>
            {m.from === 'bot' && (
              <div className="avatar bot-avatar">
                {getAvatarContent(m.from)}
              </div>
            )}
            <div className="bubble">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {m.text}
              </ReactMarkdown>
            </div>
            {m.from === 'user' && (
              <div className="avatar user-avatar">
                {getAvatarContent(m.from)}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="message bot">
            <div className="avatar bot-avatar">
              {getAvatarContent('bot')}
            </div>
            <div className="bubble loading-bubble">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type a question here..."
        />
        <button onClick={handleSend}>
          <IoSendSharp />
        </button>
      </div>
    </div>
  );
}
