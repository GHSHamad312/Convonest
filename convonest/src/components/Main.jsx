import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import CryptoJS from "crypto-js";
import "./Main.css";

// Socket connection initialized once outside component
const socket = io(import.meta.env.VITE_SOCKET_URL);

// Encryption secret from environment variable (fallback for dev only)
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || "convonest_fallback_key";

const Main = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [friendCodeInput, setFriendCodeInput] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [addFriendError, setAddFriendError] = useState("");

  const messagesEndRef = useRef(null);

  // Encrypt message before sending
  const encryptMessage = (message) => {
    return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
  };

  // Decrypt message when received
  const decryptMessage = (encryptedMessage) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted || encryptedMessage; // Return raw if decryption fails
    } catch {
      return encryptedMessage; // Return raw text if decryption errors out
    }
  };

  // Scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch current user and friends on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userId = res.data._id;
        const userDetail = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/${userId}`
        );

        setCurrentUser(userDetail.data);

        if (Array.isArray(userDetail.data.friends)) {
          const friendsDetails = await Promise.all(
            userDetail.data.friends.map(async (friendId) => {
              const friendRes = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/users/${friendId}`
              );
              return friendRes.data;
            })
          );
          setUsers(friendsDetails);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  // Fetch messages when a friend is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedFriend || !currentUser) return;

      setLoadingMessages(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/messages/${currentUser._id}/${selectedFriend._id}`
        );
        setMessages(
          res.data.map((msg) => ({ ...msg, text: decryptMessage(msg.text) }))
        );
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedFriend, currentUser]);

  // Handle adding a friend via friend code
  const handleAddFriend = async () => {
    const code = friendCodeInput.trim();
    if (!code) return;

    setAddFriendError("");

    // Check if already a friend
    const isAlreadyFriend = users.some((user) => user.friendCode === code);
    if (isAlreadyFriend) {
      setAddFriendError("This user is already your friend.");
      return;
    }

    // Prevent adding yourself
    if (currentUser?.friendCode === code) {
      setAddFriendError("You cannot add yourself as a friend.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/add_friend`,
        { friendCode: code },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const newFriend = res.data.newFriend;
      const friendDetail = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/${newFriend._id}`
      );

      setUsers((prevUsers) => [...prevUsers, friendDetail.data]);
      setCurrentUser((prev) => ({
        ...prev,
        friends: [...(prev.friends || []), newFriend._id],
      }));
      setFriendCodeInput("");
      setShowAddFriend(false);
    } catch (err) {
      console.error("Error adding friend:", err);
      setAddFriendError(
        err.response?.data?.message || "Failed to add friend. Check the friend code."
      );
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedFriend || !currentUser) return;

    const encryptedMessage = encryptMessage(messageText.trim());

    const messageData = {
      text: encryptedMessage,
      sender: currentUser._id,
      receiver: selectedFriend._id,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/messages`,
        messageData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      socket.emit("send_message", res.data);
      setMessages((prev) => [
        ...prev,
        { ...res.data, text: decryptMessage(res.data.text) },
      ]);
      setMessageText("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Send on Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Listen for incoming messages via Socket.IO
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      if (
        (message.sender === currentUser?._id &&
          message.receiver === selectedFriend?._id) ||
        (message.sender === selectedFriend?._id &&
          message.receiver === currentUser?._id)
      ) {
        setMessages((prev) => {
          // Avoid duplicate messages
          if (prev.some((msg) => msg._id === message._id)) return prev;
          return [
            ...prev,
            { ...message, text: decryptMessage(message.text) },
          ];
        });
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [currentUser, selectedFriend]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const getKey = (user) =>
    user._id || user.friendCode || user.name || Math.random().toString(36).substr(2, 9);

  const handleUnfriend = async (friendId) => {
    if (!window.confirm("Are you sure you want to remove this friend? All messages will be deleted.")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/auth/remove_friend`, {
        data: { friendId },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setUsers((prev) => prev.filter((user) => user._id !== friendId));
      if (selectedFriend?._id === friendId) {
        setSelectedFriend(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Error removing friend:", err);
      alert("Failed to remove friend.");
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo-area">
            <span className="logo-icon">💬</span>
            <h1 className="logo">ConvoNest</h1>
          </div>
          <button className="logout-button" onClick={handleLogout} title="Logout">
            ⏻
          </button>
        </div>

        {/* Current user info */}
        {currentUser && (
          <div className="current-user-card">
            <div className="user-avatar large">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="user-name">{currentUser.name}</span>
              <span className="user-friend-code">#{currentUser.friendCode}</span>
            </div>
          </div>
        )}

        <div className="sidebar-divider" />

        <h2 className="my-chats">MY CHATS</h2>

        <ul className="chat-list">
          {users.length > 0 ? (
            users.map((user) => (
              <li
                key={getKey(user)}
                className={`chat-item ${selectedFriend && selectedFriend._id === user._id ? "active" : ""}`}
                onClick={() => setSelectedFriend(user)}
              >
                <div className="user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                </div>
                <div className="chat-item-info">
                  <span className="chat-item-name">{user.name}</span>
                  <span className="chat-item-code">#{user.friendCode}</span>
                </div>
                {selectedFriend && selectedFriend._id === user._id && (
                  <button
                    className="unfriend-button"
                    title="Remove friend"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnfriend(user._id);
                    }}
                  >
                    🗑️
                  </button>
                )}
              </li>
            ))
          ) : (
            <li className="no-friends">
              <span>No friends yet.</span>
              <small>Add someone using their friend code!</small>
            </li>
          )}
        </ul>

        {/* Add Friend Section */}
        <div className="add-friend-section">
          {showAddFriend ? (
            <div className="add-friend-form">
              <input
                type="text"
                placeholder="Enter friend code..."
                value={friendCodeInput}
                onChange={(e) => setFriendCodeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddFriend()}
                className="friend-code-input"
                autoFocus
              />
              {addFriendError && (
                <span className="add-friend-error">{addFriendError}</span>
              )}
              <div className="add-friend-actions">
                <button className="confirm-add-btn" onClick={handleAddFriend}>
                  Add
                </button>
                <button
                  className="cancel-add-btn"
                  onClick={() => {
                    setShowAddFriend(false);
                    setFriendCodeInput("");
                    setAddFriendError("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              className="add-friend-button"
              onClick={() => setShowAddFriend(true)}
            >
              + Add Friend
            </button>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="chat-window">
        {selectedFriend ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="header-avatar">
                {selectedFriend.name.charAt(0).toUpperCase()}
              </div>
              <div className="header-info">
                <h2 className="header-name">{selectedFriend.name}</h2>
                <span className="header-code">#{selectedFriend.friendCode}</span>
              </div>
              <div className="header-badge">
                <span className="encrypted-badge">🔒 Encrypted</span>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {loadingMessages ? (
                <div className="loading-messages">
                  <div className="spinner" />
                  <span>Loading messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="no-messages">
                  <span>🔐</span>
                  <p>No messages yet. Say hello!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`message ${
                      message.sender === currentUser._id ? "sent" : "received"
                    }`}
                  >
                    <div className="message-bubble">
                      <p className="message-text">{message.text}</p>
                      <span className="message-time">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message... (Enter to send)"
                className="input-box"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="send-button"
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
              >
                ➤
              </button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="no-chat-icon">💬</div>
            <h2>Welcome to ConvoNest</h2>
            <p>Select a friend from the sidebar to start chatting</p>
            {currentUser && (
              <div className="your-code-box">
                <span>Your friend code:</span>
                <strong>#{currentUser.friendCode}</strong>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
