import React, { useEffect, useState } from 'react';
import { BsCalendar, BsEye, BsStarFill } from "react-icons/bs";
import { MdMessage, MdOutlineAnalytics } from "react-icons/md";
import useAuthStore from './../../stateManagement/useAuthStore';
import './Dashboard.css'
import { FaDollarSign, FaDotCircle, FaUserEdit } from 'react-icons/fa';
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import { Link } from 'react-router-dom';

import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid } from "recharts";
import { getLineGraphData, getPieChartData, getTotals } from '../../services/DashboardService';
import { getBookingsPhotographer } from './../../services/BookingService';
import { getMessageList } from '../../services/MessageServices';

const Dashboard = () => {
    const { user } = useAuthStore();

    const [totalBookings, setTotalBookings] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState([])
    const [ratingStats, setRatingStats] = useState([])

    const [signs, setSigns] = useState({
        totalSign: 0,
        revenueSign: 0,
    })

    const [revenueData, setRevenueData] = useState([])
    const [pieChartData, setPieChartData] = useState([]);

    const [bookings, setBookings] = useState([])
    const [messages, setMessages] = useState([])


    const getPercentChangeSign = (percentage) => Math.sign(percentage);


    useEffect(() => {
        const loadTotals = async () => {
            try {
                const result = await getTotals();
                setTotalBookings(result.totalBookings)
                setTotalRevenue(result.totalRevenue)
                setRatingStats(result.ratingStats)
                setSigns((prev) => ({
                    ...prev, totalSign: getPercentChangeSign(result.totalBookings.percentageChange),
                    revenueSign: getPercentChangeSign(result.totalRevenue.percentageChange)
                }))
            } catch (error) {
                console.error("Load Pie Chart Error: ", error)

            }
        };
        loadTotals();
    }, [setTotalBookings, setSigns]);


    useEffect(() => {
        const loadLineGraphData = async () => {
            try {
                const result = await getLineGraphData();
                setRevenueData(result.revenueData)
            } catch (error) {
                console.error("Load Pie Chart Error: ", error)

            }
        };
        loadLineGraphData();
    }, [setPieChartData]);

    useEffect(() => {
        const loadPieChartData = async () => {
            try {
                const result = await getPieChartData();
                setPieChartData(result.bookingStatus)
            } catch (error) {
                console.error("Load Pie Chart Error: ", error)

            }
        };
        loadPieChartData();
    }, [setPieChartData]);

    useEffect(() => {
        const fetchRecentBookings = async () => {
            try {
                const query = { 'pageLimit': 3 }
                const queryString = new URLSearchParams(query).toString();
                const result = await getBookingsPhotographer(queryString);
                setBookings(result.bookings)
            } catch (error) {
                console.error("Load Pie Chart Error: ", error)

            }
        };
        fetchRecentBookings();
    }, [setPieChartData]);

    useEffect(() => {
        const fetchRecentMessages = async () => {
            try {
                const query = { 'pageLimit': 3 }
                const queryString = new URLSearchParams(query).toString();
                const result = await getMessageList(queryString);
                setMessages(result.messages)
            } catch (error) {
                console.error("Load Pie Chart Error: ", error)

            }
        };
        fetchRecentMessages();
    }, [setPieChartData]);




    return (
        <>
            <main className="main dashboard-page">
                <div className='container dashboard-page'>
                    <section className='heading-container dashboard-page'>
                        <h1>
                            Welcome Back, {user.firstname}!
                        </h1>
                        <p>Here's what's happening with your photography business</p>
                    </section>
                    <section className='statistics-container dashboard-page' id='statistics'>
                        <div className='card statistic-card'>
                            <div className='statistics-card-content'>
                                <h3>
                                    Total Bookings
                                </h3>
                                <p className='statistic-number'>{totalBookings.currentMonth}</p>
                                <p className={`statistic-percentage ${signs.totalSign === 1 ? 'increase' : ''} ${signs.totalSign === -1 ? 'decrease' : ''}`}>
                                    {signs.totalSign === 1 && <FaArrowUpLong />}
                                    {signs.totalSign === -1 && <FaArrowDownLong />}
                                    {totalBookings.percentageChange}% from last month
                                </p>
                            </div>
                            <div className='statistics-card-icon total-bookings'>
                                <BsCalendar />
                            </div>
                        </div>
                        <div className='card statistic-card'>
                            <div className='statistics-card-content'>
                                <h3>
                                    Monthly Revenue
                                </h3>
                                <p className='statistic-number'>${totalRevenue.currentMonth}</p>
                                <p className={`statistic-percentage ${signs.revenueSign === 1 ? 'increase' : ''} ${signs.revenueSign === -1 ? 'decrease' : ''}`}>
                                    {signs.revenueSign === 1 && <FaArrowUpLong />}
                                    {signs.revenueSign === -1 && <FaArrowDownLong />}
                                    {totalRevenue.percentageChange}% from last month
                                </p>
                            </div>
                            <div className='statistics-card-icon monthly-revenue'>
                                <FaDollarSign />
                            </div>
                        </div><div className='card statistic-card'>
                            <div className='statistics-card-content'>
                                <h3>
                                    Profile Views
                                </h3>
                                <p className='statistic-number'>47</p>
                                <p className='statistic-percentage'> - 12% from last month</p>
                            </div>
                            <div className='statistics-card-icon profile-views'>
                                <BsEye />
                            </div>
                        </div><div className='card statistic-card'>
                            <div className='statistics-card-content'>
                                <h3>
                                    Client Rating
                                </h3>
                                <p className='statistic-number'>{ratingStats.averageRating}</p>
                                <p className='statistic-percentage'> Based on {ratingStats.totalReviews} reviews</p>
                            </div>
                            <div className='statistics-card-icon client-rating'>
                                <BsStarFill />
                            </div>
                        </div>
                    </section>
                    <section className='charts dashboard-page'>

                        <div className='card line-graph'>
                            <div className='heading-section'>
                                <h2>Revenue Overview</h2>
                                <select name='filter-bar-graph' className='filter-bar-graph' >
                                    <option value="6">Last 6 months</option>
                                    <option value="12">Last 1 Year</option>
                                </select>
                            </div>
                            <ResponsiveContainer width="100%" height="90%" maxWidth="100vw" minHeight={320}>
                                <LineChart
                                    data={revenueData}
                                    margin={{ top: 20, right: 30, bottom: 10 }} // adds space on left
                                >
                                    <CartesianGrid strokeDasharray="0" stroke="#eee" horizontal={true}   // ✅ show horizontal lines
                                        vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={10}
                                        padding={{ left: 50, right: 50 }} // 👈 adds space before Jan and after Jun
                                        tickFormatter={(month) => {
                                            // If the chart width is small, show only the first letter
                                            // You can adjust the condition based on your container size
                                            if (window.innerWidth < 500) {
                                                return month.charAt(0);
                                            }
                                            return month;
                                        }}
                                    />
                                    <YAxis
                                        tickFormatter={(v) => `${v / 1000}k`}
                                        interval={0}
                                        tickCount={6}
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={25}
                                    />
                                    <Tooltip />
                                    <Line
                                        type="linear"   // smooth curved line
                                        dataKey="value"
                                        stroke="#4285F4"
                                        strokeWidth={2}

                                        activeDot={{ r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className='card pie-chart' >
                            <h2>Booking Status</h2>
                            <PieChart style={{ width: '100%', maxWidth: '500px', minWidth: '250px', aspectRatio: 1, padding: '20px' }} responsive>
                                <Pie
                                    data={pieChartData}
                                    dataKey="value"
                                    innerRadius="70%"
                                    outerRadius="100%"
                                    paddingAngle={5}
                                    cornerRadius={10}
                                    isAnimationActive={true}
                                >
                                    {pieChartData?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                            <div className='pie-chart-label-container'>
                                {pieChartData?.map((status, index) => (
                                    <p className='pie-chart-label' key={index}>
                                        <span className={`${status.name}`}><FaDotCircle /></span> {status.name}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section className='bookings-messages dashboard-page'>
                        <div className='card view-bookings'>
                            <div className='card-heading-section'>
                                <h2>Recent Bookings</h2>
                                <Link to={"/photographer/bookings"}>View All</Link>
                            </div>
                            {bookings.map((booking, index) => (
                                <Link className='client-profile-information' key={index} to={`/photographer/view-booking/${booking._id}`}>
                                    <div className='profile-picture-container'>
                                        <img src={booking.user.picture} alt="Profile" />
                                    </div>
                                    <div className='profile-information' >
                                        <h3 className='full-name dashboard-page'>{booking.firstName} {booking.lastName}</h3>
                                        <span>{new Date(booking.sessionStartDate).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric"
                                        })} • {new Date(booking.sessionStartDate).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}</span>
                                    </div>
                                    <div className='client-booking-status dashboard-page'>
                                        <p className={`booking-status ${booking.bookingStatus.status} `}>{booking.bookingStatus.status}</p>
                                    </div>
                                </Link>))}

                        </div>
                        <div className='card view-messages'>
                            <div className='card-heading-section'>
                                <h2>Recent Messages</h2>
                                <Link to={"/messages"}>View All</Link>
                            </div>
                            {messages.map((message, index) => (
                                <div className='client-profile-information' key={index}>
                                    <div className='profile-picture-container'>
                                        <img src={message.chatBuddy.picture} alt="Profile" />
                                    </div>
                                    <div className='profile-information view-messages-section' >
                                        <h3 className='full-name dashboard-page'>{message.chatBuddy.firstname} {message.chatBuddy.lastname}</h3>
                                        <span>{message.latestMessage.text}</span>
                                    </div>
                                    <div className='client-booking-status dashboard-page'>
                                        <p className='message-created-time'>2 mins ago</p>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </section>
                    <section className='card quick-actions dashboard-page'>
                        <h2>
                            Quick Actions
                        </h2>
                        <div className='quick-actions-container'>
                            <Link className='quick-actions-card view-bookings-card' to={'/photographer/bookings'}>
                                <div className='view-bookings'><BsCalendar /></div>
                                <h3>View Bookings</h3>
                            </Link>
                            <Link className='quick-actions-card view-messages-card' to={'/messages'}>
                                <div className='view-messages'><MdMessage /></div>
                                <h3>View Messages</h3>
                            </Link>
                            <Link className='quick-actions-card update-portfolio-card' to='/photographer/portfolio'>
                                <div className='update-portfolio'><FaUserEdit /></div>
                                <h3>Edit Portfolio</h3>
                            </Link>
                            <Link className='quick-actions-card wallet-card' to="/photographer/wallet">
                                <div className='wallet'><FaDollarSign /></div>
                                <h3>View Wallet</h3>
                            </Link >
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
};

export default Dashboard;
