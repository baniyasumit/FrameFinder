import React, { useRef, useState } from 'react'
import './ViewMessage.css'
import { IoSend } from "react-icons/io5";
import { useNavigate, useParams } from 'react-router-dom';
import { createMessage, getMessages } from '../../services/MessageServices';
import { toast } from 'sonner';
import { useEffect } from 'react';
import useAuthStore from '../../stateManagement/useAuthStore';

const ViewMessage = () => {
    const { bookingId } = useParams();
    const { user } = useAuthStore()
    const [chatBuddy, setChatBuddy] = useState();
    const [messages, setMessages] = useState([]);

    const [pageNum, setPageNum] = useState(1);

    const navigate = useNavigate();

    const [newMessage, setNewMessage] = useState("")

    const chatContainerRef = useRef();
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (chatContainerRef.current && pageNum === 1) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [pageNum, messages]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const result = await getMessages(bookingId, pageNum);
                if (pageNum === 1) {
                    setChatBuddy(result.chatBuddy)
                    setMessages(result.messages)
                } else {
                    setMessages((prev) => [...result.messages, ...prev]);

                }
                setHasMore(result.hasMore)
            } catch (error) {
                console.error("Load Booking Error: ", error)
                toast.error(error)
                navigate("/messages", { replace: true })
            } finally {
                setLoading(false)
            }
        };
        fetchMessages();
    }, [pageNum, bookingId, setChatBuddy, navigate]);



    const handleScroll = () => {
        if (!chatContainerRef.current || loading || !hasMore) return;

        const { scrollTop } = chatContainerRef.current;
        if (scrollTop <= 30) {
            setPageNum(prev => prev + 1);
        }
    };


    const handleSend = async () => {
        if (newMessage.trim() === "") return;
        try {
            const response = await createMessage(bookingId, newMessage);

            setMessages(prev => [...prev, response.newMessage]);
            setTimeout(() => {
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTo({
                        top: chatContainerRef.current.scrollHeight,
                        behavior: "smooth", // smooth scroll animation
                    });
                }
            }, 50);
            setNewMessage("");

        } catch (err) {
            console.error("Send message error:", err);
            toast.error(err.message || "Failed to send message", {
                position: 'top-center',
            });
        }

    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (<>
        <main className='main message-page'>
            <div className='container message-page'>
                <section className='profile-information card message-page '>
                    <div className='profile-picture-container message-page'>
                        <img src={chatBuddy?.picture} alt="Profile" />
                    </div>
                    <div className='profile-basic-details message-page'>
                        <h2>{chatBuddy?.firstname} {chatBuddy?.lastname}</h2>
                        <p>Online</p>
                    </div>
                </section>
                <section className='messages-container card message-page'>
                    {messages.length === 0 ?
                        <div className='empty-message'>
                            <p>Send your first message to start the conversation.</p>
                        </div>

                        :
                        <>
                            <div className='messages-wrapper' ref={chatContainerRef} onScroll={handleScroll}>
                                <div className="scroll-bottom-spacer"></div>
                                {messages.map((message, index) => (
                                    <div className={`message-container ${message.sender === user._id ? "" : "right"}`} key={index}>
                                        <div className={`message-box ${message.sender === user._id ? "" : "right"}`}>
                                            <p>{message.text}</p>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </>
                    }

                </section>
                <section className='message-input-container card message-page'>
                    <input
                        className='message-input'
                        placeholder='Enter a new message to send.'
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}>
                    </input>
                    <button type="button"
                        className='send-button'
                        onClick={handleSend}>
                        Send  <IoSend />
                    </button>
                </section>
            </div>
        </main >
    </>)
}

export default ViewMessage