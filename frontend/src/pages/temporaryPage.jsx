import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:7896');

const Temp = () => {
    const [senderId, setSenderId] = useState('');
    const [receiverId, setReceiverId] = useState('');
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [typing, setTyping] = useState(false);

    useEffect(() => {
        if (senderId) {
            socket.emit('register', { userId: senderId });
        }

        socket.on('typing', (typingSenderId) => {
            if (typingSenderId !== senderId) {
                setTyping(typingSenderId);
                setTimeout(() => setTyping(false), 2000);
            }
        });

        socket.on('newMessage', ({ senderId: incomingSenderId, message: incomingMessage }) => {
            setChat((prevChat) => [...prevChat, { senderId: incomingSenderId, message: incomingMessage }]);
        });

        return () => {
            socket.off('typing');
            socket.off('newMessage');
        };
    }, [senderId]);

    const handleSendMessage = () => {
        if (message.trim() && senderId && receiverId) {
            const newMessage = { senderId, message };
            setChat((prevChat) => [...prevChat, newMessage]);
            socket.emit('sendMessage', { senderId, receiverId, message });
            setMessage('');
        }
    };

    const handleTyping = () => {
        if (senderId && receiverId) {
            socket.emit('typing', { senderId, receiverId });
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-gray-800 text-white rounded-lg">
            <h2 className="text-xl font-bold mb-4">Dynamic Chat</h2>
            <input
                type="text"
                className="w-full p-2 mb-4 text-black rounded"
                placeholder="Enter Your ID"
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
            />
            <input
                type="text"
                className="w-full p-2 mb-4 text-black rounded"
                placeholder="Enter Receiver ID"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
            />
            <div className="h-64 bg-gray-700 p-2 rounded overflow-y-auto mb-4">
                {chat.map((msg, index) => (
                    <div
                        key={index}
                        className={
                            msg.senderId === senderId
                                ? "text-right text-green-400"
                                : "text-left text-blue-400"
                        }
                    >
                        <strong>{msg.senderId}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            {typing && <p className="text-yellow-400">{typing} is typing...</p>}
            <div className="flex gap-2">
                <input
                    type="text"
                    className="flex-1 p-2 text-black rounded"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyUp={handleTyping}
                />
                <button
                    className="p-2 bg-blue-500 rounded text-white"
                    onClick={handleSendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Temp;
