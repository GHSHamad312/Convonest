<div align="center">

  <img src="convonest/src/components/pics/logo.png" alt="ConvoNest Logo" width="280" />

  <h1>ConvoNest</h1>
  <p><strong>A real-time encrypted chat application — your conversations, secured.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.IO" />
    <img src="https://img.shields.io/badge/AES-Encrypted-blue?style=for-the-badge&logo=letsencrypt&logoColor=white" alt="AES Encrypted" />
    <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  </p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-project-structure">Structure</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-api-reference">API</a> •
    <a href="#-team">Team</a>
  </p>

</div>

---

## 📌 About

**ConvoNest** is a full-stack real-time chat application built as a group project by **Team Juice Pilado**. It enables users to chat privately with friends using **end-to-end AES encryption**, ensuring messages remain confidential even in the database.

Key highlights:
- 🔐 All messages are **AES-encrypted** before being stored or transmitted
- ⚡ **Real-time messaging** powered by Socket.IO WebSockets
- ✉️ **Email verification** on sign-up via Nodemailer + Gmail
- 👥 **Friend system** using unique friend codes — add or remove friends anytime
- 🌙 **Premium dark UI** with glassmorphism and gradient aesthetics

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **AES Encryption** | All messages encrypted client-side with CryptoJS before sending |
| ⚡ **Real-time Chat** | Instant message delivery using Socket.IO |
| 👤 **JWT Authentication** | Secure stateless authentication with 1-hour token expiry |
| ✉️ **Email Verification** | 6-digit OTP sent to email on registration via Nodemailer |
| 👥 **Friend Codes** | Add/remove friends using unique random codes |
| 💬 **Chat History** | Messages persisted to MongoDB and retrieved per conversation |
| 🎨 **Dark Theme UI** | Glassmorphism design with gradient accents |
| 📱 **Enter to Send** | Keyboard shortcut support for quick messaging |
| 🔄 **Auto Scroll** | Chat window auto-scrolls to the latest message |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** + Vite | UI framework and build tool |
| **React Router DOM** | Client-side routing |
| **Axios** | HTTP API calls |
| **Socket.IO Client** | Real-time WebSocket communication |
| **CryptoJS** | AES message encryption/decryption |
| **CSS (Vanilla)** | Custom styling with glassmorphism |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** + Express | REST API server |
| **Socket.IO** | WebSocket server for real-time events |
| **MongoDB** + Mongoose | Database for users and messages |
| **bcrypt** | Password hashing |
| **jsonwebtoken** | JWT token generation and verification |
| **Nodemailer** | Email verification via Gmail SMTP |
| **dotenv** | Environment variable management |

---

## 📁 Project Structure

```
chat-applicaton/
├── convonest/                    # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Main.jsx          # Main chat interface
│   │   │   ├── Main.css
│   │   │   ├── frontpage.jsx     # Landing page
│   │   │   ├── frontpage.css
│   │   │   ├── login.jsx         # Login page
│   │   │   ├── login.css
│   │   │   ├── sign_up.jsx       # Registration + email verification
│   │   │   ├── sign_up.css
│   │   │   └── pics/             # Logo and assets
│   │   ├── App.jsx               # Router setup
│   │   └── main.jsx
│   ├── .env.example              # Environment variable template
│   ├── index.html
│   └── package.json
│
├── secure-chat-backend/          # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js               # User schema (name, email, friendCode, friends)
│   │   └── Message.js            # Message schema (sender, receiver, text, timestamp)
│   ├── routes/
│   │   ├── auth.js               # Register, verify, login, add/remove friend
│   │   ├── chat.js               # Send & fetch messages
│   │   └── user.js               # Get users by ID
│   ├── server.js                 # Express + Socket.IO setup
│   ├── .env.example              # Environment variable template
│   └── package.json
│
├── .gitignore                    # Root gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier works)
- Gmail account with an [App Password](https://myaccount.google.com/apppasswords) enabled

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/convonest.git
cd convonest
```

---

### 2. Backend Setup

```bash
cd secure-chat-backend
npm install
```

Create your `.env` file from the template:

```bash
cp .env.example .env
```

Fill in your values in `.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

Start the backend server:

```bash
node server.js
# or with auto-reload:
npx nodemon server.js
```

> Server runs at `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd convonest
npm install
```

Create your `.env` file from the template:

```bash
cp .env.example .env
```

Fill in your values in `.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_SECRET_KEY=your_encryption_secret_key
```

> ⚠️ **Important**: Both users must use the **same** `VITE_SECRET_KEY` to decrypt each other's messages.

Start the development server:

```bash
npm run dev
```

> Frontend runs at `http://localhost:5173`

---

## 📡 API Reference

### Authentication Routes — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | ❌ | Register user, sends OTP to email |
| `POST` | `/verify` | ❌ | Verify email with 6-digit OTP |
| `POST` | `/login` | ❌ | Login, returns JWT token |
| `POST` | `/add_friend` | ✅ | Add friend by friend code |
| `DELETE` | `/remove_friend` | ✅ | Remove friend and delete messages |
| `GET` | `/user` | ✅ | Get current authenticated user |

### User Routes — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | ❌ | Get all users (without passwords) |
| `GET` | `/:id` | ❌ | Get user by ID |

### Message Routes — `/api/messages`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | ✅ | Send an encrypted message |
| `GET` | `/:userId/:friendId` | ❌ | Get message history between two users |

---

## 🔐 Security Model

```
Client A types message
       ↓
  AES Encrypt (CryptoJS)
       ↓
  HTTP POST → Backend
       ↓
  Stored encrypted in MongoDB
       ↓
  Socket.IO broadcast → Client B
       ↓
  AES Decrypt (CryptoJS)
       ↓
Client B reads plain text
```

- **Passwords** are hashed with `bcrypt` (salt rounds: 10)
- **Sessions** use JWT with 1-hour expiry
- **Message content** is never stored in plain text

---

## 🌐 Socket.IO Events

| Event | Direction | Description |
|---|---|---|
| `send_message` | Client → Server | User sends a new message |
| `receive_message` | Server → Client | Broadcast new message to all connected users |

---

## 🧪 How to Test

1. **Register** two accounts on two different browsers/incognito windows
2. Verify both emails with the OTP code
3. **Login** with both accounts
4. Copy your **friend code** (shown in the chat sidebar)
5. Use the **Add Friend** button on the other account and paste the code
6. Start chatting — messages appear in real time!

---

## 👥 Team

**Group Juice Pilado**

| Name | Role |
|---|---|
| Hammad Ali Shah | Full Stack Developer |
| [Team Member 2] | [Role] |
| [Team Member 3] | [Role] |

📧 Contact: [juicepilado@gmail.com](mailto:juicepilado@gmail.com)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>Made with ❤️ by Group Juice Pilado</p>
  <p><em>ConvoNest — Where conversations are safe.</em></p>
</div>
