// client/src/App.js
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';


const socket = io('http://localhost:5000');

function App() {
    const [connectedUsers, setConnectedUsers] = useState({})
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [senderId, setSenderId] = useState(null)
    const [recipientId, setRecipientId] = useState('');

    useEffect(() => {


        socket.on('usersConnected', (users) => {
            console.log(users)
            setConnectedUsers(users)
        })

        socket.on('mySocketId', (id) => {
            setSenderId(id)
        })

        socket.on('receiveMessage', ({ from, message }) => {
            console.log('message recieved...')
            setMessages((prevMessages) => [...prevMessages, { from, message }]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    useEffect(() => {
        console.log('sender is', connectedUsers[senderId])
        console.log('reciever is', connectedUsers[recipientId])
    }, [senderId, recipientId])

    const registerUser = () => {
        if (username) {
            socket.emit('registerUser', username);
        }
    };

    const sendMessage = () => {
        if (message && recipientId) {
            socket.emit('sendMessage', { recipientId, message });
            const msgObject = {from:username, message}
            setMessages((prevMessages) => [...prevMessages, msgObject]);

            setMessage('');
        }
    };

    const connectWith = (id) => {
        console.log('connected with', connectedUsers[id])
        setRecipientId(id)
    }

    messages && messages.map((msg)=>{
        console.log(msg)
    })

    return (
        <div className='flex gap-2  w-screen h-screen p-2'>

            <div className="recentChats flex flex-col rounded-lg w-[20%] p-2 bg-slate-600">

                <div className="flex justify-between"><input className='rounded-lg' type="text" placeholder='Enter Your Name...' value={username} onChange={(e) => { setUsername(e.target.value) }} /> <button className='bg-white rounded-lg' onClick={() => { registerUser() }}>Go Online</button></div>

                    {
                        Object.keys(connectedUsers).map((userId, index) => {
                            return <div key={index} className='flex items-center gap-4 border rounded-lg p-1' onClick={() => { connectWith(userId) }}>
                                     <span className='profilePhoto w-[50px] h-[50px]  border rounded-full'></span>
                                     <span className=''>{connectedUsers[userId]}</span>
                                   </div>

                        })
                    }





            </div>

            <div className="chatWindowAndInputBox rounded-lg flex flex-col gap-2 w-[80%] h-full">

                <div className="chat border h-full rounded-lg  bg-slate-600 p-4">
                    {
                        messages.map((msgObject, index) => {
                            return <div key={index} className="messageBox showFromTop  relative rounded-lg h-[30px] w-full">
                                <span className={`capitalize rounded-b-lg pl-4  absolute ${msgObject.from==username ? 'right-0 bg-purple-600 pr-6' : 'bg-pink-600 pr-4 rounded-tr-lg'}  text-white`}>{msgObject.message}</span>
                            </div>
                        })
                    }
                </div>


                <div className='flex justify-between gap-2 h-[50px] w-full '>
                    <input className='w-full rounded-lg text-lg pl-2 bg-slate-600' type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button className='bg-slate-600 text-white font-semibold px-6 rounded-lg' onClick={sendMessage}>Send</button>
                </div>

            </div>



        </div>
    );
}

export default App;
