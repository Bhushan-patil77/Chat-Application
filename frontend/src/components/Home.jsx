import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
const socket = io('https://chat-application-pi-five.vercel.app/');



function Home() {
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [senderId, setSenderId] = useState(null);
    const [recipientId, setRecipientId] = useState('');

    const loggedInUser = JSON.parse(localStorage.getItem('user'))

    console.log(loggedInUser[0].username);
    
    
    

    useEffect(() => {
        getUsers()
    }, [])

    useEffect(() => {
        const userLoggedIn = JSON.parse(localStorage.getItem('user'))

        

        if (userLoggedIn && userLoggedIn[0]._id) {
            socket.emit('storeMySocketIdInDB', userLoggedIn[0]);
        } else {
            console.log('User _id is missing');
        }

        socket.on('yourSocketIdIs', (yourSocketIdIs)=>{
            setSenderId(yourSocketIdIs)
        })


     

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

    useEffect(() => {
        console.log(senderId);

    }, [senderId])



    const getUsers = () => {
        fetch('https://chat-application-pi-five.vercel.app/getUsers')
            .then((response) => { return response.json() })
            .then((data) => { setConnectedUsers(data.data) })
    }

    const sendMessage = () => {
        if (message && recipientId) {
            socket.emit('sendMessage', { recipientId, message });
            const msgObject = { from: username, message };
            setMessages((prevMessages) => [...prevMessages, msgObject, msg]);
            setMessage('');
        }
    };

    const connectWith = (id) => {
        setRecipientId(id);
    };


    return (

        <div className='flex gap-2 w-screen h-screen p-2'>
            <div className="recentChats flex gap-2 flex-col rounded-lg w-[20%] p-2 bg-slate-600">

                {
                    connectedUsers.map((user, index) => (
                        <div key={index} className={` ${loggedInUser[0].username === user.username ? 'hidden' : 'flex'} items-center gap-4 p-3 border bg-slate-400 cursor-pointer rounded-lg hover:bg-gray-100 transition duration-200`} onClick={() => { connectWith(userId) }} >
                            <span className='profilePhoto w-[50px] h-[50px] border border-gray-300 rounded-full bg-gray-300 flex items-center justify-center'>
                                <span className='text-gray-600 font-semibold'>{user.username.charAt(0)}</span>
                            </span>
                            <span className='userName text-gray-800 font-semibold'>{user.username}</span>
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