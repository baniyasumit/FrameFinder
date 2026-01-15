import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaWallet, FaMoneyBillWave, FaClock, FaArrowDown, FaSearch } from "react-icons/fa";
import "./WalletTransaction.css";
import { getTransactions, getWalletDetails } from "../../services/WalletService";
import WithdrawModal from "../../components/WithdrawModal/WithdrawModal";
import { Link, useSearchParams } from "react-router-dom";

const WalletTransaction = () => {
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);

    const [summary, setSummary] = useState({
        totalEarned: 0,
        availableBalance: 0,
        onHold: 0,
        totalWithdrawn: 0,
    });

    const [searchParams, setSearchParams] = useSearchParams();

    const [params, setParams] = useState({
        type: "all",
        sortBy: "latest",
        start: new Date(new Date().setMonth(new Date().getMonth() - 1))
            .toISOString()
            .split("T")[0],
        end: new Date().toISOString().split("T")[0],
        search: "",
    });

    const [transactions, setTransactions] = useState([]);

    // Sync URL params → component state
    useEffect(() => {
        setParams((prev) => ({
            ...prev,
            type: searchParams.get("type") || "all",
            sortBy: searchParams.get("sortBy") || "latest",
            start:
                searchParams.get("start") ||
                new Date(new Date().setMonth(new Date().getMonth() - 1))
                    .toISOString()
                    .split("T")[0],
            end: searchParams.get("end") || new Date().toISOString().split("T")[0],
            search: searchParams.get("search") || "",
        }));
    }, [searchParams]);

    // Load wallet summary
    useEffect(() => {
        const loadWallet = async () => {
            try {
                const result = await getWalletDetails();
                setSummary({
                    totalEarned: result.wallet.totalEarned,
                    availableBalance: result.wallet.availableBalance,
                    onHold: result.wallet.onHold,
                    totalWithdrawn: result.wallet.totalWithdrawn,
                });
            } catch (error) {
                console.error("Load Wallet Details Error:", error);
            }
        };
        loadWallet();
    }, [setSummary]);

    // 🔥 Dynamic 3-month limit based on selected end date
    const endDate = new Date(params.end);
    const threeMonthsBefore = new Date(endDate);
    threeMonthsBefore.setMonth(endDate.getMonth() - 3);
    const dynamicMinStart = threeMonthsBefore.toISOString().split("T")[0];

    // Handle filters & enforce 3-month limit
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        let updated = { ...params, [name]: value };


        if (name === "end") {
            const end = new Date(value);
            const limit = new Date(end);
            limit.setMonth(limit.getMonth() - 3);

            const limitStr = limit.toISOString().split("T")[0];

            if (new Date(updated.start) < limit) {
                updated.start = limitStr;
            }
        }

        setParams(updated);
        setSearchParams(updated);
    };

    // Load transactions when filters change
    useEffect(() => {
        const loadTransactions = async () => {
            try {
                const result = await getTransactions(searchParams.toString());
                setTransactions(result.transactions || []);
            } catch (error) {
                console.error("Load Transactions Error:", error);
            }
        };
        loadTransactions();
    }, [searchParams]);

    // Apply local filtering after fetch
    const filteredTransactions = transactions
        .filter((t) => {
            if (params.type === "payment" && t.type !== "payment") return false;
            if (params.type === "withdraw" && t.type !== "withdraw") return false;

            const date = new Date(t.date || t.createdOn || t.lastUpdated);
            const start = new Date(params.start);
            const end = new Date(params.end);
            end.setHours(23, 59, 59, 999);

            if (date < start || date > end) return false;

            if (params.search && params.search.trim()) {
                const q = params.search.toLowerCase();
                const matchesDescription = t.description?.toLowerCase().includes(q);
                const matchesBooking = t.booking?.toString()?.toLowerCase().includes(q);
                const matchesSender =
                    t.sender &&
                    (`${t.sender.firstname || ""} ${t.sender.lastname || ""}`)
                        .toLowerCase()
                        .includes(q);
                const matchesAmount = t.amount?.toString().includes(q);

                if (
                    !(
                        matchesDescription ||
                        matchesBooking ||
                        matchesSender ||
                        matchesAmount
                    )
                ) {
                    return false;
                }
            }
            return true;
        })
        .sort((a, b) => {
            if (params.sortBy === "latest")
                return (
                    new Date(b.lastUpdated || b.createdOn) -
                    new Date(a.lastUpdated || a.createdOn)
                );
            if (params.sortBy === "oldest")
                return (
                    new Date(a.lastUpdated || a.createdOn) -
                    new Date(b.lastUpdated || b.createdOn)
                );
            if (params.sortBy === "amount-high") return (b.amount || 0) - (a.amount || 0);
            if (params.sortBy === "amount-low") return (a.amount || 0) - (b.amount || 0);

            return 0;
        });

    return (
        <>
            {showWithdrawModal && (
                <WithdrawModal
                    setShowWithdrawModal={setShowWithdrawModal}
                    setSummary={setSummary}
                />
            )}

            <div className="wallet-page">
                <div className="wallet-container">
                    <div className="wallet-header">
                        <h2>
                            <FaWallet /> Wallet Overview
                        </h2>
                        <button
                            className="withdraw-btn"
                            onClick={() => setShowWithdrawModal(true)}
                        >
                            Withdraw
                        </button>
                    </div>

                    {/* Summary Section */}
                    <div className="wallet-summary">
                        {/* your summary cards unchanged */}
                        <motion.div className="summary-card earned">
                            <FaMoneyBillWave className="summary-icon" />
                            <h3>Total Earned</h3>
                            <p>¥{summary.totalEarned.toFixed(2)}</p>
                        </motion.div>

                        <motion.div className="summary-card available">
                            <FaWallet className="summary-icon" />
                            <h3>Available Balance</h3>
                            <p>¥{summary.availableBalance.toFixed(2)}</p>
                        </motion.div>

                        <motion.div className="summary-card onhold">
                            <FaClock className="summary-icon" />
                            <h3>On Hold</h3>
                            <p>¥{summary.onHold.toFixed(2)}</p>
                        </motion.div>

                        <motion.div className="summary-card withdrawn">
                            <FaArrowDown className="summary-icon" />
                            <h3>Total Withdrawn</h3>
                            <p>¥{summary.totalWithdrawn.toFixed(2)}</p>
                        </motion.div>
                    </div>

                    {/* Filters */}
                    <div className="wallet-filters">
                        <div className="filter-group">
                            <select name="type" value={params.type} onChange={handleFilterChange}>
                                <option value="all">All Transactions</option>
                                <option value="payment">Payments Received</option>
                                <option value="withdraw">Withdrawn</option>
                            </select>

                            <select name="sortBy" value={params.sortBy} onChange={handleFilterChange}>
                                <option value="latest">Sort by Latest</option>
                                <option value="oldest">Sort by Oldest</option>
                                <option value="amount-high">Amount (High → Low)</option>
                                <option value="amount-low">Amount (Low → High)</option>
                            </select>

                            {/* Date Filter */}
                            <div className="date-filter">
                                <label>From</label>
                                <input
                                    type="date"
                                    name="start"
                                    value={params.start}
                                    min={dynamicMinStart}
                                    max={params.end}
                                    onChange={handleFilterChange}
                                />

                                <label>To</label>
                                <input
                                    type="date"
                                    name="end"
                                    value={params.end}
                                    max={new Date().toISOString().split("T")[0]}
                                    onChange={handleFilterChange}
                                />
                            </div>
                        </div>

                        <div className="filter-search-container">
                            <FaSearch className="search-icon" />
                            <input
                                name="search"
                                type="text"
                                placeholder="Search transactions..."
                                onChange={handleFilterChange}
                            />
                        </div>
                    </div>

                    {/* Transactions */}
                    <motion.div className="wallet-transactions">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((transaction) => (
                                        <motion.tr
                                            key={transaction._id}
                                            className={
                                                transaction.type === "withdraw"
                                                    ? "withdrawn"
                                                    : "received"
                                            }
                                        >
                                            <td>
                                                {new Date(
                                                    transaction.lastUpdated
                                                ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "2-digit",
                                                })}
                                            </td>

                                            <td>
                                                {new Date(
                                                    transaction.lastUpdated
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })}
                                            </td>

                                            <td className="type">{transaction.type}</td>

                                            <td>
                                                <span
                                                    className={`transaction-status ${transaction.status}`}
                                                >
                                                    {transaction.status || "Succeeded"}
                                                </span>
                                            </td>

                                            <td className={`amount ${transaction.type} ${transaction.status}`}>
                                                {transaction.type === "withdraw" || transaction.status === 'refunded' ? "-" : "+"}${transaction.amount}
                                            </td>

                                            <td>
                                                {transaction.type === "payment" ? (
                                                    <Link
                                                        className="view-details-btn"
                                                        to={`/photographer/view-booking/${transaction.booking}`}
                                                    >
                                                        View Details
                                                    </Link>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="no-transactions">
                                            No transactions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default WalletTransaction;
