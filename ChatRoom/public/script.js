const socket = io();

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const chatroom = document.getElementById('chatroom');
const joinChatBtn = document.getElementById('joinChat');
const usernameInput = document.getElementById('username');
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typing');

// User and message state
let currentUser = "";

// Join chatroom
joinChatBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username) {
    currentUser = username;
    socket.emit('joinChat', username);  // Emit join event to the server
    loginScreen.classList.add('hidden');
    chatroom.classList.remove('hidden');
  }
});

// Send a message
sendBtn.addEventListener('click', () => {
  sendMessage();
});

// Handle Enter key for sending messages
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Send message to server
function sendMessage() {
  const messageText = messageInput.value.trim();
  if (messageText) {
    socket.emit('chatMessage', { user: currentUser, text: messageText });
    messageInput.value = '';
  }
}

// Display incoming messages
socket.on('chatMessage', (msg) => {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML = `<strong>${msg.user}</strong>: ${msg.text}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
});

// Show active users
socket.on('activeUsers', (users) => {
  const userList = document.getElementById('userList');
  userList.innerHTML = `Active Users: ${users.join(', ')}`;
});
