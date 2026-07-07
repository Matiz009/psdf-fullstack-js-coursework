import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  autoConnect: true,    // Connect immediately when the file is imported
  reconnection: true,   // Auto-reconnect if connection drops
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,  // Wait 1s between retries
});

export default socket;  // Import this ONE instance anywhere in your app
