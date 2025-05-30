"use client"

import { useState } from "react"
import { CalendarDays, FileDown, Download, AlertCircle, Eye, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

export default function FyndTallyExporter() {
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [previewData, setPreviewData] = useState(sampleSalesData)
  const [showPreview, setShowPreview] = useState(false)

  const setDateRange = (days: number) => {
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
  const totalItems = previewData.reduce((sum, item) => sum + item.items, 0)

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Controls */}
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileDown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-800">Fynd → Tally</CardTitle>
                  <p className="text-sm text-gray-600">XML Exporter</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="text-sm text-gray-600 leading-relaxed">
                Export your Fynd sales orders in Tally-compatible XML format for seamless accounting integration.
              </p>

              {/* Date Shortcuts */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Quick Date Ranges</Label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={setYesterday} className="text-xs">
                    Yesterday
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDateRange(15)} className="text-xs">
                    Last 15 days
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDateRange(30)} className="text-xs">
                    Last 30 days
                  </Button>
                </div>
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="from-date" className="text-sm font-medium">
                    From Date
                  </Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="from-date"
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to-date" className="text-sm font-medium">
                    To Date
                  </Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="to-date"
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="py-2 border-green-200 bg-green-50">
                  <Download className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-sm text-green-700">{success}</AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button onClick={loadPreview} variant="outline" className="w-full" disabled={!fromDate || !toDate}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Data
                </Button>

                <Button
                  onClick={exportXML}
                  disabled={loading || !showPreview}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  {loading ? "Exporting..." : "Export Sales XML"}
                </Button>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Version 1.0.0</span>
                  <span>Secure Export</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Panel - Data Preview */}
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-gray-800">Data Preview</CardTitle>
                {showPreview && (
                  <div className="flex gap-2">
                    <Badge variant="secondary">{previewData.length} vouchers</Badge>
                    <Badge variant="outline">
                      ₹{totalNetAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </Badge>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {!showPreview ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                  <Eye className="h-12 w-12 mb-4 text-gray-300" />
                  <p className="text-sm">Select dates and click "Preview Data" to see your sales vouchers</p>
                </div>
              ) : (
                <Tabs defaultValue="grid" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                    <TabsTrigger value="xml">XML Output</TabsTrigger>
                  </TabsList>

                  <TabsContent value="grid" className="space-y-4">
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium">Total Vouchers</p>
                        <p className="text-lg font-bold text-blue-800">{previewData.length}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-xs text-green-600 font-medium">Gross Amount</p>
                        <p className="text-lg font-bold text-green-800">
                          ₹{totalGrossAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="bg-amber-50 p-3 rounded-lg">
                        <p className="text-xs text-amber-600 font-medium">Tax Amount</p>
                        <p className="text-lg font-bold text-amber-800">
                          ₹{totalTaxAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-purple-600 font-medium">Net Amount</p>
                        <p className="text-lg font-bold text-purple-800">
                          ₹{totalNetAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Voucher No.</TableHead>
                            <TableHead className="text-xs">Date</TableHead>
                            <TableHead className="text-xs">Party Ledger</TableHead>
                            <TableHead className="text-xs">Gross Amount</TableHead>
                            <TableHead className="text-xs">Tax Amount</TableHead>
                            <TableHead className="text-xs">Net Amount</TableHead>
                            <TableHead className="text-xs">Items</TableHead>
                            <TableHead className="text-xs">Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {previewData.map((voucher) => (
                            <TableRow key={voucher.voucherNo}>
                              <TableCell className="text-xs font-medium">{voucher.voucherNo}</TableCell>
                              <TableCell className="text-xs">{voucher.date}</TableCell>
                              <TableCell className="text-xs">{voucher.partyLedger}</TableCell>
                              <TableCell className="text-xs">
                                ₹{voucher.grossAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell className="text-xs">
                                ₹{voucher.taxAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell className="text-xs">
                                ₹{voucher.netAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell className="text-xs">{voucher.items}</TableCell>
                              <TableCell className="text-xs">
                                <Badge variant="outline" className="text-xs">
                                  {voucher.type}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="xml" className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">XML Output Preview</span>
                    </div>
                    <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">{sampleXML}</pre>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
