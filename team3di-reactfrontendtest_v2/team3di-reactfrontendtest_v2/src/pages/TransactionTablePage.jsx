
import React, { useState }  from "react";
import axios from "axios";
import _ from "lodash"

const TransactionTablePage = () => {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({})
    // Fix: correct destructuring – second element is the setter, first (unused) is the value
    const [, setError] = useState({})

    const getData = async (apiUrl, body, header) => {
        try {
            const resp = await axios.put(apiUrl, body, { header });
            setData(resp.data);
        } catch (err) {
            // Handle Error Here
            setError(err.response.data)
            alert(err.response.data)
        }
    };

    const handleSubmit = event => {
        event.preventDefault();

        // ES6 destructuring – includes new date range fields
        const { sortCode, accountNumber, startDate, endDate } = formData;

        if (_.isEmpty(sortCode) || _.isEmpty(accountNumber)) {
            setError({ message: 'Sort code and account number cannot be blank' })
            alert('Sort code and account number cannot be blank')
            return
        }

        const url = '/api/v1/alltransactions'

        // Task 2: include startDate and endDate in the payload.
        // When both are provided the backend filters transactions by initiationDate range.
        // When omitted (null) the backend returns all transactions (backward-compatible).
        const accountInput = {
            sortCode,
            accountNumber,
            startDate: startDate || null,
            endDate:   endDate   || null,
        }

        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT',
        };
        getData(url, accountInput, headers);
    }

    const handleChange = event => {
        const { name, value } = event.target
        setFormData({
            ...formData,       // Spread operator – preserve existing fields
            [name]: value      // ES6 computed property name
        })
    }

    return (
        <>
            {/* ── Top Navigation Bar ── */}
            <nav className="bank-nav">
                <div className="bank-nav__logo">
                    <div className="bank-nav__icon">🏦</div>
                    <div>
                        <div className="bank-nav__name">Trust<span>Bank</span></div>
                        <div className="bank-nav__tag">Online Banking</div>
                    </div>
                </div>
                <div className="bank-nav__tag">Secure &amp; Encrypted</div>
            </nav>

            {/* ── Page Body ── */}
            <div className="bank-page">
                <div className="bank-container">

                    <div className="bank-page-title">Account Statement</div>
                    <div className="bank-page-subtitle">
                        Enter your sort code and account number to view your balance and transactions.
                    </div>

                    {/* ── Search Form Card ── */}
                    <div className="bank-card">
                        <div className="bank-card__title">
                            🔍 Account Lookup
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="bank-form-grid">
                                {/* Sort Code */}
                                <div className="bank-field">
                                    <label htmlFor="sortCode">Sort Code:</label>
                                    <input
                                        id="sortCode"
                                        type="text"
                                        name="sortCode"
                                        placeholder="e.g. 53-68-92"
                                        onChange={(e) => handleChange(e)}
                                        value={formData.sortCode || ''}
                                    />
                                    <span className="bank-hint">Format: XX-XX-XX</span>
                                </div>

                                {/* Account Number */}
                                <div className="bank-field">
                                    <label htmlFor="accountNumber">Account Number:</label>
                                    <input
                                        id="accountNumber"
                                        type="text"
                                        name="accountNumber"
                                        placeholder="e.g. 73084635"
                                        onChange={(e) => handleChange(e)}
                                        value={formData.accountNumber || ''}
                                    />
                                    <span className="bank-hint">8-digit account number</span>
                                </div>

                                {/* Task 2: Start Date */}
                                <div className="bank-field">
                                    <label htmlFor="startDate">Start Date <em style={{fontWeight:400,color:'#9ca3af'}}>(optional)</em></label>
                                    <input
                                        id="startDate"
                                        type="date"
                                        name="startDate"
                                        onChange={(e) => handleChange(e)}
                                        value={formData.startDate || ''}
                                    />
                                    <span className="bank-hint">Filter transactions from this date</span>
                                </div>

                                {/* Task 2: End Date */}
                                <div className="bank-field">
                                    <label htmlFor="endDate">End Date <em style={{fontWeight:400,color:'#9ca3af'}}>(optional)</em></label>
                                    <input
                                        id="endDate"
                                        type="date"
                                        name="endDate"
                                        onChange={(e) => handleChange(e)}
                                        value={formData.endDate || ''}
                                    />
                                    <span className="bank-hint">Filter transactions up to this date</span>
                                </div>
                            </div>

                            <div className="bank-info-row">
                                <span className="bank-chip">📅 Date range is inclusive</span>
                                <span className="bank-chip">💡 Leave dates empty for all transactions</span>
                            </div>

                            <button type="submit" className="bank-btn" aria-label="Submit">
                                🔎 Submit
                            </button>
                        </form>
                    </div>

                    {/* ── Results (shown only when data is loaded) ── */}
                    {!_.isEmpty(data) && (
                        <>
                            {/* Balance Banner */}
                            <div className="bank-balance">
                                <div>
                                    <div className="bank-balance__label">Current Balance</div>
                                    <div className="bank-balance__amount">
                                        £{data.currentBalance != null
                                            ? data.currentBalance.toFixed(2)
                                            : 'N/A'}
                                    </div>
                                </div>
                                <div className="bank-balance__meta">
                                    <p>Account <strong>{data.accountNumber}</strong></p>
                                    <p>Sort Code <strong>{formData.sortCode}</strong></p>
                                </div>
                            </div>

                            {/* Transaction Table Card */}
                            <div className="bank-card">
                                <div className="bank-card__title">
                                    📋 Transaction History
                                    <span style={{marginLeft:'auto', fontSize:'12px', fontWeight:400, color:'#6b7280'}}>
                                        {data?.transactions?.length ?? 0} record(s)
                                    </span>
                                </div>

                                <div className="bank-table-wrap">
                                    <table className="bank-table">
                                        <thead>
                                            <tr>
                                                <th>Account Number</th>
                                                <th>Target Owner Name</th>
                                                <th>Amount (£)</th>
                                                <th>Initiation Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.transactions?.length > 0
                                                ? data.transactions.map(transaction => (
                                                    <tr key={transaction.id}>
                                                        <td>{data.accountNumber}</td>
                                                        <td>{transaction.targetOwnerName}</td>
                                                        <td className="amount-cell">£{transaction.amount}</td>
                                                        <td className="date-cell">{transaction.initiationDate}</td>
                                                    </tr>
                                                ))
                                                : (
                                                    <tr>
                                                        <td colSpan="4" className="bank-empty">
                                                            No transactions found for the selected date range.
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="bank-footer">
                        &copy; 2024 TrustBank plc &nbsp;·&nbsp; All transactions are protected by 256-bit SSL encryption
                    </div>
                </div>
            </div>
        </>
    );
}

export default TransactionTablePage;