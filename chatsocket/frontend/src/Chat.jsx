import { useEffect, useRef, useState } from 'react';
import socket from './socket';

const TYPING_TIMEOUT = 1500;

function Chat() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [roomUsers, setRoomUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [connected, setConnected] = useState(socket.connected);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    const handleReceiveMessage = (data) => setMessages((prev) => [...prev, data]);
    const handleSystem = (msg) =>
      setMessages((prev) => [
        ...prev,
        { id: `sys-${Date.now()}-${Math.random()}`, message: msg, system: true },
      ]);
    const handleRoomUsers = (users) => setRoomUsers(users);
    const handleTyping = ({ username: who, isTyping }) => {
      setTypingUsers((prev) => {
        if (isTyping) return prev.includes(who) ? prev : [...prev, who];
        return prev.filter((u) => u !== who);
      });
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('system', handleSystem);
    socket.on('roomUsers', handleRoomUsers);
    socket.on('typing', handleTyping);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('system', handleSystem);
      socket.off('roomUsers', handleRoomUsers);
      socket.off('typing', handleTyping);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const joinRoom = (e) => {
    e.preventDefault();
    const trimmedUser = username.trim();
    const trimmedRoom = room.trim();
    if (!trimmedUser || !trimmedRoom) return;

    setUsername(trimmedUser);
    setRoom(trimmedRoom);
    socket.emit('joinRoom', { room: trimmedRoom, username: trimmedUser });
    setJoined(true);
  };

  const leaveRoom = () => {
    socket.emit('leaveRoom');
    setJoined(false);
    setMessages([]);
    setRoomUsers([]);
    setTypingUsers([]);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const trimmed = newMsg.trim();
    if (!trimmed) return;

    socket.emit('sendMessage', { room, message: trimmed, username });
    socket.emit('typing', { room, username, isTyping: false });
    clearTimeout(typingTimeoutRef.current);
    setNewMsg('');
  };

  const handleTypingChange = (e) => {
    setNewMsg(e.target.value);
    socket.emit('typing', { room, username, isTyping: true });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { room, username, isTyping: false });
    }, TYPING_TIMEOUT);
  };

  const formatTime = (time) => {
    if (!time) return '';
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!joined) {
    return (
      <div className="chat-page">
        <form className="join-card" onSubmit={joinRoom}>
          <h1>Join a chat room</h1>
          <p className="join-sub">Pick a username and a room to start chatting in real time.</p>

          <label className="field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Ali"
              maxLength={20}
              autoFocus
            />
          </label>

          <label className="field">
            <span>Room</span>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. general"
              maxLength={30}
            />
          </label>

          <button type="submit" className="btn-primary" disabled={!username.trim() || !room.trim()}>
            Join room
          </button>

          <span className={`status-dot ${connected ? 'online' : 'offline'}`}>
            {connected ? 'Connected to server' : 'Connecting…'}
          </span>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-window">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>#{room}</h2>
            <button type="button" className="btn-leave" onClick={leaveRoom}>
              Leave
            </button>
          </div>
          <div className="user-list">
            <h3>Online — {roomUsers.length}</h3>
            <ul>
              {roomUsers.map((u) => (
                <li key={u} className={u === username ? 'me' : ''}>
                  <span className="avatar">{u.charAt(0).toUpperCase()}</span>
                  {u} {u === username && '(you)'}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="chat-main">
          <header className="chat-header">
            <h2>
              #{room} <span className="user-count">· {roomUsers.length} online</span>
            </h2>
            <span className={`status-dot ${connected ? 'online' : 'offline'}`}>
              {connected ? 'Connected' : 'Reconnecting…'}
            </span>
          </header>

          <div className="messages">
            {messages.map((m) => {
              if (m.system) {
                return (
                  <div key={m.id} className="message system">
                    {m.message}
                  </div>
                );
              }
              const isMe = m.username === username;
              return (
                <div key={m.id} className={`message ${isMe ? 'me' : 'other'}`}>
                  {!isMe && <span className="msg-author">{m.username}</span>}
                  <div className="bubble">
                    <span className="msg-text">{m.message}</span>
                    <span className="msg-time">{formatTime(m.time)}</span>
                  </div>
                </div>
              );
            })}
            {typingUsers.length > 0 && (
              <div className="typing-indicator">
                {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing…
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="message-form" onSubmit={sendMessage}>
            <input
              type="text"
              value={newMsg}
              onChange={handleTypingChange}
              placeholder="Type a message…"
              autoFocus
            />
            <button type="submit" className="btn-primary" disabled={!newMsg.trim()}>
              Send
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Chat;
