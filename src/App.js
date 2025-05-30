"use client"

import { useState } from "react"
import { CalendarDays, FileDown, Download, AlertCircle, Eye, Code } from "lucide-react"
import "./App.css"

// Sample data for preview with Tally-specific fields
const sampleSalesData = [
  {
    voucherNo: "FYND/2024/001",
    date: "2024-01-15",
    partyLedger: "John Doe Enterprises",
    grossAmount: 1059.32,
    taxAmount: 190.68,
    netAmount: 1250.0,
    items: 3,
    type: "Sales",
    reference: "ORD001",
  },
  {
    voucherNo: "FYND/2024/002",
    date: "2024-01-15",
    partyLedger: "Jane Smith & Co.",
    grossAmount: 754.66,
    taxAmount: 135.84,
    netAmount: 890.5,
    items: 2,
    type: "Sales",
    reference: "ORD002",
  },
  {
    voucherNo: "FYND/2024/003",
    date: "2024-01-14",
    partyLedger: "Bob Johnson Ltd",
    grossAmount: 1780.3,
    taxAmount: 320.45,
    netAmount: 2100.75,
    items: 5,
    type: "Sales",
    reference: "ORD003",
  },
  {
    voucherNo: "FYND/2024/004",
    date: "2024-01-14",
    partyLedger: "Alice Brown Inc",
    grossAmount: 572.25,
    taxAmount: 103.0,
    netAmount: 675.25,
    items: 1,
    type: "Sales",
    reference: "ORD004",
  },
  {
    voucherNo: "FYND/2024/005",
    date: "2024-01-13",
    partyLedger: "Charlie Wilson Traders",
    grossAmount: 1228.81,
    taxAmount: 221.19,
    netAmount: 1450.0,
    items: 4,
    type: "Sales",
    reference: "ORD005",
  },
]

const sampleXML = `<?xml version="1.0" encoding="UTF-8"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
      </REQUESTDESC>
      <REQUESTDATA>
        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <VOUCHER VCHTYPE="Sales" ACTION="Create">
            <DATE>20240115</DATE>
            <VOUCHERTYPENAME>Sales</VOUCHERTYPENAME>
            <VOUCHERNUMBER>FYND/2024/001</VOUCHERNUMBER>
            <REFERENCE>ORD001</REFERENCE>
            <PARTYLEDGERNAME>John Doe Enterprises</PARTYLEDGERNAME>
            <EFFECTIVEDATE>20240115</EFFECTIVEDATE>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Sales Account</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>-1059.32</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>CGST</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>-95.34</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>SGST</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>-95.34</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>John Doe Enterprises</LEDGERNAME>
              <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
              <AMOUNT>1250.00</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
          </VOUCHER>
        </TALLYMESSAGE>
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`

function App() {
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [previewData, setPreviewData] = useState(sampleSalesData)
  const [showPreview, setShowPreview] = useState(false)
  const [activeTab, setActiveTab] = useState("grid")

  const setDateRange = (days) => {
    const today = new Date()
    const fromDateObj = new Date(today)
    fromDateObj.setDate(today.getDate() - days)

    setToDate(today.toISOString().split("T")[0])
    setFromDate(fromDateObj.toISOString().split("T")[0])
  }

  const setYesterday = () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split("T")[0]

    setFromDate(yesterdayStr)
    setToDate(yesterdayStr)
  }

  const loadPreview = () => {
    if (!fromDate || !toDate) {
      setError("Please select both from and to dates to preview data.")
      return
    }
    setError("")
    setShowPreview(true)
    // Filter sample data based on date range
    const filtered = sampleSalesData.filter((item) => {
      const itemDate = new Date(item.date)
      const from = new Date(fromDate)
      const to = new Date(toDate)
      return itemDate >= from && itemDate <= to
    })
    setPreviewData(filtered)
  }

  const exportXML = async () => {
    if (!fromDate || !toDate) {
      setError("Please select both from and to dates.")
      setSuccess("")
      return
    }

    if (new Date(fromDate) > new Date(toDate)) {
      setError("From date cannot be later than to date.")
      setSuccess("")
      return
    }

    setError("")
    setSuccess("")
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const blob = new Blob([sampleXML], {
        type: "application/xml",
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `fynd-sales-${fromDate}_to_${toDate}.xml`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setSuccess("Sales data exported successfully!")
    } catch (err) {
      setError("Error exporting sales data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Calculate totals for summary
  const totalGrossAmount = previewData.reduce((sum, item) => sum + item.grossAmount, 0)
  const totalTaxAmount = previewData.reduce((sum, item) => sum + item.taxAmount, 0)
  const totalNetAmount = previewData.reduce((sum, item) => sum + item.netAmount, 0)

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="grid-layout">
          {/* Left Panel - Controls */}
          <div className="card control-panel">
            <div className="card-header">
              <div className="header-content">
                <div className="logo-container">
                  <FileDown className="logo-icon" />
                </div>
                <div>
                  <h1 className="title">Fynd → Tally</h1>
                  <p className="subtitle">XML Exporter</p>
                </div>
              </div>
            </div>

            <div className="card-content">
              <p className="description">
                Export your Fynd sales orders in Tally-compatible XML format for seamless accounting integration.
              </p>

              {/* Date Shortcuts */}
              <div className="section">
                <label className="section-label">Quick Date Ranges</label>
                <div className="button-group">
                  <button className="btn btn-outline btn-sm" onClick={setYesterday}>
                    Yesterday
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => setDateRange(15)}>
                    Last 15 days
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => setDateRange(30)}>
                    Last 30 days
                  </button>
                </div>
              </div>

              {/* Date Inputs */}
              <div className="date-inputs">
                <div className="input-group">
                  <label htmlFor="from-date" className="input-label">
                    From Date
                  </label>
                  <div className="input-container">
                    <CalendarDays className="input-icon" />
                    <input
                      id="from-date"
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="date-input"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="to-date" className="input-label">
                    To Date
                  </label>
                  <div className="input-container">
                    <CalendarDays className="input-icon" />
                    <input
                      id="to-date"
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="date-input"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="alert alert-error">
                  <AlertCircle className="alert-icon" />
                  <span className="alert-text">{error}</span>
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  <Download className="alert-icon" />
                  <span className="alert-text">{success}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons">
                <button onClick={loadPreview} className="btn btn-outline btn-full" disabled={!fromDate || !toDate}>
                  <Eye className="btn-icon" />
                  Preview Data
                </button>

                <button onClick={exportXML} disabled={loading || !showPreview} className="btn btn-primary btn-full">
                  <FileDown className="btn-icon" />
                  {loading ? "Exporting..." : "Export Sales XML"}
                </button>
              </div>

              <div className="footer">
                <span>Version 1.0.0</span>
                <span>Secure Export</span>
              </div>
            </div>
          </div>

          {/* Right Panel - Data Preview */}
          <div className="card preview-panel">
            <div className="card-header">
              <div className="preview-header">
                <h2 className="preview-title">Data Preview</h2>
                {showPreview && (
                  <div className="badges">
                    <span className="badge badge-secondary">{previewData.length} vouchers</span>
                    <span className="badge badge-outline">
                      ₹{totalNetAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="card-content">
              {!showPreview ? (
                <div className="empty-state">
                  <Eye className="empty-icon" />
                  <p className="empty-text">Select dates and click "Preview Data" to see your sales vouchers</p>
                </div>
              ) : (
                <div className="tabs">
                  <div className="tab-list">
                    <button
                      className={`tab ${activeTab === "grid" ? "tab-active" : ""}`}
                      onClick={() => setActiveTab("grid")}
                    >
                      Grid View
                    </button>
                    <button
                      className={`tab ${activeTab === "xml" ? "tab-active" : ""}`}
                      onClick={() => setActiveTab("xml")}
                    >
                      XML Output
                    </button>
                  </div>

                  {activeTab === "grid" && (
                    <div className="tab-content">
                      <div className="summary-cards">
                        <div className="summary-card summary-blue">
                          <p className="summary-label">Total Vouchers</p>
                          <p className="summary-value">{previewData.length}</p>
                        </div>
                        <div className="summary-card summary-green">
                          <p className="summary-label">Gross Amount</p>
                          <p className="summary-value">
                            ₹{totalGrossAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="summary-card summary-amber">
                          <p className="summary-label">Tax Amount</p>
                          <p className="summary-value">
                            ₹{totalTaxAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="summary-card summary-purple">
                          <p className="summary-label">Net Amount</p>
                          <p className="summary-value">
                            ₹{totalNetAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>

                      <div className="table-container">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Voucher No.</th>
                              <th>Date</th>
                              <th>Party Ledger</th>
                              <th>Gross Amount</th>
                              <th>Tax Amount</th>
                              <th>Net Amount</th>
                              <th>Items</th>
                              <th>Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            {previewData.map((voucher) => (
                              <tr key={voucher.voucherNo}>
                                <td className="font-medium">{voucher.voucherNo}</td>
                                <td>{voucher.date}</td>
                                <td>{voucher.partyLedger}</td>
                                <td>₹{voucher.grossAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                                <td>₹{voucher.taxAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                                <td>₹{voucher.netAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                                <td>{voucher.items}</td>
                                <td>
                                  <span className="type-badge">{voucher.type}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === "xml" && (
                    <div className="tab-content">
                      <div className="xml-header">
                        <Code className="xml-icon" />
                        <span className="xml-title">XML Output Preview</span>
                      </div>
                      <div className="xml-container">
                        <pre className="xml-content">{sampleXML}</pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
