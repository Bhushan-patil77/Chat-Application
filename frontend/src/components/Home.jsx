import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');



function Home() {
    const [connectedUsers, setConnectedUsers] = useState({});
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [senderId, setSenderId] = useState(null);
    const [recipientId, setRecipientId] = useState('');


    
    useEffect(() => {
        const userLoggedIn = JSON.parse(localStorage.getItem('user'))
        console.log(userLoggedIn);
        
        socket.on('usersConnected', (users) => {
            setConnectedUsers(users);
        });

        socket.on('mySocketId', (id) => {
            setSenderId(id);
        });

        socket.on('receiveMessage', ({ from, message }) => {
            setMessages((prevMessages) => [...prevMessages, { from, message, entering: true }]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    const registerUser = () => {
        if (username) {
            socket.emit('registerUser', username);
        }
    };

    const sendMessage = () => {
        if (message && recipientId) {
            socket.emit('sendMessage', { recipientId, message });
            const msgObject = { from: username, message };
            setMessages((prevMessages) => [...prevMessages, msgObject , msg]);
            setMessage('');
        }
    };

    const connectWith = (id) => {
        setRecipientId(id);
    };


  return (
    
    <div className='flex gap-2 w-screen h-screen p-2'>
            <div className="recentChats flex flex-col rounded-lg w-[20%] p-2 bg-slate-600">
                <div className="flex xl:flex-row flex-col justify-between">
                    <input className='rounded-lg' type="text" placeholder='Enter Your Name...' value={username} onChange={(e) => { setUsername(e.target.value) }} />
                    <button className='bg-white rounded-lg' onClick={registerUser}>Go Online</button>
                </div>
                {
                    Object.keys(connectedUsers).map((userId, index) => (
                        <div key={index} className='flex items-center gap-4 border rounded-lg p-1' onClick={() => { connectWith(userId) }}>
                            <span className='profilePhoto w-[50px] h-[50px] border rounded-full'></span>
                            <span>{connectedUsers[userId]}</span>
                        </div>
                    ))
                }
            </div>

            <div className="chatWindowAndInputBox rounded-lg flex flex-col gap-2 w-[80%] h-full">
                <div className="chat border h-full rounded-lg bg-slate-600 p-4">
                    {messages.map((msgObject, index) => (
                        <div key={index} className={`relative rounded-lg h-[30px] w-full transition-opacity duration-300 ${msgObject.entering ? 'opacity-100' : 'opacity-0'}`}>
                            <span className={`capitalize rounded-b-lg pl-4 absolute ${msgObject.from === username ? 'right-0 bg-purple-600 pr-6' : 'bg-pink-600 pr-4 rounded-tr-lg'} text-white`}>
                                {msgObject.message}
                            </span>
                        </div>
                    ))}
                </div>

                <div className='flex justify-between gap-2 h-[50px] w-full'>
                    <input className='w-full rounded-lg text-lg pl-2 bg-slate-600' type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button className='bg-slate-600 text-white font-semibold px-6 rounded-lg' onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
  )
}

export default Home