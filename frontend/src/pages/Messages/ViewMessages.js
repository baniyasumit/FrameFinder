import React, { useEffect, useState } from 'react'
import './ViewMessages.css'
import { FaMessage } from 'react-icons/fa6';
import { AiOutlineProfile } from 'react-icons/ai';
import { Link, useSearchParams } from 'react-router-dom';
import { getMessageList, getTotalMessages } from '../../services/MessageServices';
import useAuthStore from '../../stateManagement/useAuthStore';

const ViewMessages = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [params, setParams] = useState({
        pageNum: 1,
    })
    const [pagination, setPagination] = useState({
        totalPages: 1,
        firstPage: 1,
        lastPage: 1,
    })

    const [messages, setMessages] = useState();

    const { user } = useAuthStore();


    useEffect(() => {
        setParams((prev) => ({
            ...prev,
            pageNum: searchParams.get('pageNum') || 1,
        }));
    }, [searchParams])
    useEffect(() => {
        const loadTotalMessages = async () => {
            try {
                const result = await getTotalMessages();
                const totalPages = result.totalPages
                setPagination({ totalPages: totalPages })
                const currentPage = parseInt(params.pageNum);
                let start = Math.max(1, currentPage - 1);
                let end = Math.min(totalPages, start + 2);

                // always keep 3 pages if possible
                if (end - start < 2) {
                    start = Math.max(1, end - 2);
                }

                setPagination({
                    totalPages: totalPages,
                    firstPage: start,
                    lastPage: end,
                });
            } catch (error) {
                console.error("Load  Error: ", error)

            }
        };
        loadTotalMessages();
    }, [params.pageNum, searchParams])


    useEffect(() => {
        const loadMessages = async () => {
            try {
                const results = await getMessageList(searchParams.toString());
                setMessages(results.messages)
            } catch (error) {
                console.error("Load  Error: ", error)

            }
        };
        loadMessages();
    }, [searchParams]);



    const handlePagination = (e) => {
        const pageNum = parseInt(e.target.value);
        const updatedParams = { ...params, pageNum: pageNum };
        setParams(updatedParams);
        setSearchParams({ ...updatedParams });
    }

    return (
        <main className='messages'>
            <div className='messages-content-container'>
                <section className='messages-content header'>
                    <h1>My Messages</h1>
                    <span>View your messages.</span>
                </section>

                <section className='messages-content messages-list'>
                    {messages?.map((message, index) => (
                        <div className='message-card' key={index} >
                            <div className='profile-picture-container '>
                                <img src={message.chatBuddy.picture} alt="Profile" />
                            </div>
                            <div className='profile-information messages-page' >
                                <div>
                                    <h1 className='full-name messages-page'>
                                        {message.chatBuddy.firstname} {message.chatBuddy.lastname}
                                    </h1>
                                    <div className='details-contact-container'>
                                        <div className='message-details messages-page'>
                                            <p className='text-message message-page'>{`${message.isSender === true ? 'You: ' : ''}`}{message.latestMessage.text}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='contact-button-container messages-page'>

                                    <Link type="button" className='booking-button messages-page' to={`${user.role === 'client' ? '' : '/photographer'}/view-booking/${message.latestMessage.booking}`}>
                                        <AiOutlineProfile /><span>View Details</span>
                                    </Link>

                                    <Link className='booking-button message messages-page' to={`/message/${message.latestMessage.booking}`}>
                                        <FaMessage className='message-icon' /><span>Message</span>
                                    </Link>

                                </div>

                            </div>
                        </div>
                    ))}
                </section>

                <section className='bookings-content pagination'>
                    <div className='bookings-pagination'>
                        {params.pageNum > 1 &&
                            <button
                                value={parseInt(params.pageNum) - 1}
                                onClick={handlePagination}>Previous</button>
                        }
                        {[...Array(pagination.lastPage - pagination.firstPage + 1)].map((_, i) => (
                            <button
                                key={i}
                                value={pagination.firstPage + i}
                                className={`${parseInt(params.pageNum) === (pagination.firstPage + i) ? "active-page" : ""}`}
                                onClick={handlePagination}
                            >
                                {pagination.firstPage + i}
                            </button>
                        ))}
                        {pagination.lastPage > params.pageNum &&

                            <button
                                value={parseInt(params.pageNum) + 1}
                                onClick={handlePagination}>Next</button>
                        }

                    </div>
                </section>

            </div >
        </main >
    )
}

export default ViewMessages