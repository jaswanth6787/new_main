import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Users, ShoppingCart, DollarSign, TrendingUp, Search,
  LogOut, Package, CheckCircle, Clock, Truck, XCircle, RefreshCw, Download, MapPin, BarChart3,
  Trash2, Edit, MessageSquare, Eye, MoreHorizontal, Calendar, PieChart, ChevronRight, LineChart,
  FileText, Filter, MessageCircle, Check, LayoutDashboard, ShoppingBag, Menu, X
} from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'orders' | 'reports'>('overview');
  const [reportCategory, setReportCategory] = useState<'summary' | 'revenue' | 'orders_report' | 'customers' | 'inventory'>('revenue');
  const [reportMonth, setReportMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [reportYear, setReportYear] = useState<string>(new Date().getFullYear().toString());
  const [mobileReportsSidebarOpen, setMobileReportsSidebarOpen] = useState(false);
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Edit/Delete State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    phase: '',
    totalQuantity: 0,
    totalWeight: 0,
    totalPrice: 0,
    address: {
      house: '',
      area: '',
      landmark: '',
      pincode: ''
    },
    message: ''
  });

  // Customer Edit/Delete State
  const [isEditCustomerDialogOpen, setIsEditCustomerDialogOpen] = useState(false);
  const [isDeleteCustomerDialogOpen, setIsDeleteCustomerDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);
  const [editCustomerForm, setEditCustomerForm] = useState({
    name: '',
    age: '',
    phone: ''
  });




  // View Message State
  const [viewMessageOpen, setViewMessageOpen] = useState(false);
  const [viewMessageData, setViewMessageData] = useState<{ title: string, message: string } | null>(null);

  // WhatsApp Button State
  const [sentMessages, setSentMessages] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('sentWhatsAppMessages');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sentWhatsAppMessages', JSON.stringify(Array.from(sentMessages)));
  }, [sentMessages]);

  useEffect(() => {
    // Check if logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    loadDashboardData();

    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      loadDashboardData();
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      // Build query string
      const searchParams = new URLSearchParams();
      if (searchQuery) searchParams.append('search', searchQuery);

      // Get stats from backend
      const statsRes = await fetch(`${API_BASE_URL}/orders/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsBackend = await statsRes.json();

      // Get recent orders (limited to 10 for performance)
      const ordersRes = await fetch(`${API_BASE_URL}/orders?limit=10&${searchParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const ordersData = await ordersRes.json();

      // Get customers
      const customersRes = await fetch(`${API_BASE_URL}/customers?${searchParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const customersData = await customersRes.json();

      // Check if API returned an error
      if (!ordersData.success || !ordersData.data) {
        console.error('API Error:', ordersData.message || ordersData.error);
        toast.error(ordersData.message || "Failed to load orders. MongoDB may not be connected.");
        setOrders([]);
        setCustomers([]);
        return;
      }

      setOrders(ordersData.data || []);

      // Use backend stats
      const totalOrders = statsBackend.data?.totalOrders || 0;
      const totalRevenue = statsBackend.data?.totalRevenue || 0;
      const pendingOrders = statsBackend.data?.pending || 0;
      const deliveredOrders = statsBackend.data?.delivered || 0;

      // Process Customers
      // Start with real customers from DB
      const dbCustomers = customersData.success ? customersData.data : [];

      const customerMap = new Map();

      // 1. Add DB customers first
      dbCustomers.forEach((c: any) => {
        customerMap.set(c.phone, {
          ...c,
          totalOrders: 0,
          totalSpent: 0
        });
      });

      // 2. Process orders to update stats or add missing customers (from legacy orders)
      ordersData.data?.forEach((order: any) => {
        if (!customerMap.has(order.phone)) {
          // This order has a phone number not in our Customers DB (legacy)
          // We create a temporary object, BUT it won't have an _id for deleting
          customerMap.set(order.phone, {
            phone: order.phone,
            fullName: order.fullName, // orders use fullName, customers use name
            name: order.fullName,
            age: 'N/A',
            customerId: order.customerId || 'N/A',
            totalOrders: 0,
            totalSpent: 0,
            _id: null // Explicitly null if virtual
          });
        }

        const customer = customerMap.get(order.phone);
        customer.totalOrders++;
        customer.totalSpent += order.totalPrice || 0;
        // Ensure name is set if missing (fallback)
        if (!customer.fullName && customer.name) customer.fullName = customer.name;
        if (!customer.name && customer.fullName) customer.name = customer.fullName;
      });

      // Get unique customers count
      const totalCustomers = customerMap.size;

      setStats({
        overview: {
          totalCustomers,
          totalOrders,
          totalRevenue,
          activeCustomers: totalCustomers // Active in the sense they exist
        },
        orderStatus: {
          pending: pendingOrders,
          delivered: deliveredOrders
        },
        recentOrders: ordersData.data?.slice(0, 10) || []
      });

      setCustomers(Array.from(customerMap.values()));
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error("Failed to load data. Please check if the server is running.");
      setOrders([]);
      setCustomers([]);
      setStats({
        overview: {
          totalCustomers: 0,
          totalOrders: 0,
          totalRevenue: 0,
          activeCustomers: 0
        },
        orderStatus: {
          pending: 0,
          delivered: 0
        },
        recentOrders: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success("Order status updated!");
        loadDashboardData();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };



  // Customer Handlers
  const handleEditCustomerClick = (customer: any) => {
    setEditingCustomer(customer);
    setEditCustomerForm({
      name: customer.fullName || customer.name,
      age: customer.age,
      phone: customer.phone
    });
    setIsEditCustomerDialogOpen(true);
  };

  const handleSaveEditCustomer = async () => {
    if (!editingCustomer) return;

    try {
      const token = localStorage.getItem('adminToken');
      // Note: backend expects 'name' but displays as 'fullName' in some contexts
      const response = await fetch(`${API_BASE_URL}/customers/${editingCustomer._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editCustomerForm)
      });

      if (response.ok) {
        toast.success("Customer updated successfully");
        loadDashboardData();
        setIsEditCustomerDialogOpen(false);
      } else {
        toast.error("Failed to update customer");
      }
    } catch (error) {
      toast.error("Error updating customer");
    }
  };

  const handleDeleteCustomerClick = (customerId: string) => {
    setDeletingCustomerId(customerId);
    setIsDeleteCustomerDialogOpen(true);
  };

  const confirmDeleteCustomer = async () => {
    if (!deletingCustomerId) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/customers/${deletingCustomerId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success("Customer and their orders deleted successfully");
        loadDashboardData();
        setIsDeleteCustomerDialogOpen(false);
      } else {
        toast.error("Failed to delete customer");
      }
    } catch (error) {
      toast.error("Error deleting customer");
    }
  };

  const handleDeleteClick = (orderId: string) => {
    setDeletingOrderId(orderId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingOrderId) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/orders/${deletingOrderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success("Order deleted successfully");
        loadDashboardData();
        setIsDeleteDialogOpen(false);
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      console.error('Error deleting order:', error); // Corrected error message for clarity
      toast.error("Error deleting order");
    }
  };

  const [summaryData, setSummaryData] = useState<any>(null);
  const [ordersReportData, setOrdersReportData] = useState<any[]>([]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const url = `${API_BASE_URL}/orders/revenue-chart?month=${reportMonth}&year=${reportYear}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setRevenueData(data.data);
        if (data.data.length === 0) {
          toast.info(`No revenue data found for ${reportMonth}/${reportYear}`);
        } else {
          toast.success("Revenue data updated");
        }
      } else {
        console.error('Server reported failure:', data);
        toast.error(data.message || "Failed to fetch revenue reports");
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      toast.error("Network error fetching reports");
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlySummary = async () => {
    try {
      setLoading(true);
      const url = `${API_BASE_URL}/orders/monthly-summary?month=${reportMonth}&year=${reportYear}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setSummaryData(data.data);
      } else {
        toast.error(data.message || "Failed to fetch summary");
      }
    } catch (error) {
      toast.error("Error fetching summary");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersReport = async () => {
    try {
      setLoading(true);
      const url = `${API_BASE_URL}/orders/report?month=${reportMonth}&year=${reportYear}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setOrdersReportData(data.data);
        if (data.data.length === 0) toast.info("No orders found for this period");
      } else {
        toast.error(data.message || "Failed to fetch orders report");
      }
    } catch (error) {
      toast.error("Error fetching orders report");
    } finally {
      setLoading(false);
    }
  };

  // Initial Data Fetch
  useEffect(() => {
    loadDashboardData();
  }, [orderFilter]); // Re-fetch when filter changes

  // Fetch Revenue Data when category is 'revenue' and filters change
  // Fetch Report Data when category or filters change
  useEffect(() => {
    if (activeTab === 'reports') {
      if (reportCategory === 'revenue') fetchRevenueData();
      if (reportCategory === 'summary') fetchMonthlySummary();
      if (reportCategory === 'orders_report') fetchOrdersReport();
    }
  }, [activeTab, reportCategory, reportMonth, reportYear]);

  const handleApplyFilter = () => {
    if (reportCategory === 'revenue') fetchRevenueData();
    if (reportCategory === 'summary') fetchMonthlySummary();
    if (reportCategory === 'orders_report') fetchOrdersReport();
  };

  const handleDownloadPDF = async () => {
    try {
      setIsExporting(true);
      toast.info("Generating PDF report...");
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/orders/export/pdf?month=${reportMonth}&year=${reportYear}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-report-${reportYear}-${reportMonth.padStart(2, '0')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("PDF Downloaded successfully");
    } catch (error) {
      console.error("PDF Download Error:", error);
      toast.error("Failed to download PDF report");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadReportCSV = async () => {
    try {
      setIsExporting(true);
      toast.info("Generating CSV export...");
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/orders/export/csv?month=${reportMonth}&year=${reportYear}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to generate CSV');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-report-${reportYear}-${reportMonth.padStart(2, '0')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("CSV Exported successfully");
    } catch (error) {
      console.error("CSV Export Error:", error);
      toast.error("Failed to export CSV");
    } finally {
      setIsExporting(false);
    }
  };

  const handleEditClick = (order: any) => {
    setEditingOrder(order);
    setEditForm({
      phase: order.phase,
      totalQuantity: order.totalQuantity,
      totalWeight: order.totalWeight,
      totalPrice: order.totalPrice,
      address: {
        house: order.address.house,
        area: order.address.area,
        landmark: order.address.landmark || '',
        pincode: order.address.pincode
      },
      message: order.message || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingOrder) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/orders/${editingOrder._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        toast.success("Order updated successfully");
        loadDashboardData();
        setIsEditDialogOpen(false);
      } else {
        toast.error("Failed to update order");
      }
    } catch (error) {
      toast.error("Error updating order");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      Pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
      Confirmed: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle },
      Processing: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: Package },
      Shipped: { color: "bg-indigo-100 text-indigo-800 border-indigo-200", icon: Truck },
      Delivered: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      Cancelled: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
    };

    const variant = variants[status] || variants.Pending;
    const Icon = variant.icon;

    return (
      <Badge variant="outline" className={`${variant.color} border px-3 py-1 text-xs font-semibold rounded-full shadow-sm`}>
        <Icon className="w-3.5 h-3.5 mr-1.5" />
        {status}
      </Badge>
    );
  };

  const filteredOrders = orderFilter === 'all'
    ? orders
    : orders.filter(o => o.orderStatus === orderFilter);

  const handleExportCSV = () => {
    const headers = [
      'Order ID', 'Date', 'Customer ID', 'Name', 'Phone', 'Status',
      'Total Price', 'Quantity', 'Phase', 'Address', 'Pincode'
    ];

    // Convert orders to CSV rows
    const rows = filteredOrders.map(order => [
      order.orderId || order._id,
      new Date(order.createdAt).toLocaleDateString(),
      order.customerId || 'N/A',
      `"${order.fullName}"`,
      order.phone,
      order.orderStatus,
      order.totalPrice,
      order.totalQuantity,
      order.phase,
      `"${order.address.house}, ${order.address.area}"`,
      order.address.pincode
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWhatsAppSend = (order: any) => {
    let message = "";
    const customerName = order.fullName || "Valued Customer";
    const orderId = order.orderId || order._id.slice(-6).toUpperCase();

    if (order.orderStatus === 'Confirmed') {
      message = `Hi ${customerName}, your order (ID: ${orderId}) is confirmed ${String.fromCodePoint(0x2705)}`;
    } else if (order.orderStatus === 'Shipped') {
      message = `Hi ${customerName}, your order (ID: ${orderId}) is shipped ${String.fromCodePoint(0x1F69A)}`;
    } else if (order.orderStatus === 'Delivered') {
      message = `Hi ${customerName} ${String.fromCodePoint(0x1F337)}\nYour order (Order ID: ${orderId}) has been delivered successfully ${String.fromCodePoint(0x1F4E6)}\nWe hope it supports your wellness journey ${String.fromCodePoint(0x1F495)}`;
    } else {
      message = `Hi ${customerName}, update on your order (ID: ${orderId}): Status is ${order.orderStatus}.`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${order.phone}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    // Update local state to show "Sanded" (Sent)
    setSentMessages(prev => new Set(prev).add(order._id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate Reports Stats
  const reportTotalRevenue = revenueData.reduce((acc, curr) => acc + curr.revenue, 0);
  const reportTotalOrders = revenueData.reduce((acc, curr) => acc + curr.count, 0);
  const reportAvgOrderValue = reportTotalOrders > 0 ? Math.round(reportTotalRevenue / reportTotalOrders) : 0;

  return (
    <div className="flex bg-gray-50 font-sans text-gray-900 min-h-screen relative overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-100 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">Admin<span className="text-pink-600">Panel</span></h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex-shrink-0 
        transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        h-full overflow-y-auto
      `}>
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Admin<span className="text-pink-600">Panel</span></h1>
            <p className="text-xs font-medium text-green-600 mt-0.5">Cycle Harmony Laddus</p>
          </div>
          {/* Mobile Close Button (Optional, since we have toggler, but good for UX) */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-1">
          <Button
            variant="ghost"
            onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
            className={`w-full justify-start ${activeTab === 'overview' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Overview
          </Button>
          <Button
            variant="ghost"
            onClick={() => { setActiveTab('customers'); setMobileMenuOpen(false); }}
            className={`w-full justify-start ${activeTab === 'customers' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Users className="w-5 h-5 mr-3" />
            Customers
          </Button>
          <Button
            variant="ghost"
            onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
            className={`w-full justify-start ${activeTab === 'orders' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <ShoppingBag className="w-5 h-5 mr-3" />
            Orders
          </Button>
          <Button
            variant="ghost"
            onClick={() => { setActiveTab('reports'); setMobileMenuOpen(false); }}
            className={`w-full justify-start ${activeTab === 'reports' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Reports
          </Button>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-50 bg-white">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-gray-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8 w-full overflow-y-auto h-screen">
        {/* Top Header / Search */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h2>
            <p className="text-sm text-gray-500">Manage your store's {activeTab}</p>
          </div>
          <div className="flex gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white shadow-sm border-gray-200"
              />
            </div>
            <Button variant="outline" onClick={() => loadDashboardData()} className="bg-white shadow-sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white rounded-xl overflow-hidden">
                <div className="h-1 w-full bg-blue-500"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Customers</CardTitle>
                  <Users className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.overview.totalCustomers}</div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white rounded-xl overflow-hidden">
                <div className="h-1 w-full bg-purple-500"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Orders</CardTitle>
                  <ShoppingCart className="h-5 w-5 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.overview.totalOrders}</div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white rounded-xl overflow-hidden">
                <div className="h-1 w-full bg-green-500"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Revenue</CardTitle>
                  <DollarSign className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">₹{stats.overview.totalRevenue.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white rounded-xl overflow-hidden">
                <div className="h-1 w-full bg-orange-500"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Delivered</CardTitle>
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.orderStatus.delivered}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="border border-gray-100 shadow-sm rounded-xl bg-white">
              <CardHeader className="border-b border-gray-50 bg-gray-50/50 rounded-t-xl py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-gray-800">Recent Orders</CardTitle>
                  <Badge variant="secondary" className="font-normal">Latest 10</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {stats.recentOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No recent orders found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {stats.recentOrders.map((order: any) => (
                      <div key={order._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50 transition-colors gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-sm font-semibold text-gray-700 truncate">#{order.orderId || order._id.slice(-6)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-gray-900 font-medium truncate">{order.fullName}</p>
                            <span className="text-gray-300">•</span>
                            <p className="text-sm text-gray-500 truncate">{order.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                          {getStatusBadge(order.orderStatus)}
                          <span className="font-bold text-gray-900 min-w-[3rem] text-right">₹{order.totalPrice}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <Card>
            <CardHeader>
              <CardTitle>All Customers</CardTitle>
              <CardDescription>Total: {customers.length}</CardDescription>
            </CardHeader>
            <CardContent>
              {customers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">No customers found</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Customers will appear here once orders are placed.
                  </p>
                  <p className="text-xs text-gray-400">
                    Note: Make sure MongoDB is connected to save and retrieve orders.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customers.map((customer: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-lg">{customer.fullName}</p>
                          <p className="text-sm text-gray-500">
                            ID: <span className="font-mono">{customer.customerId || 'N/A'}</span> |
                            Phone: {customer.phone}
                          </p>
                          <div className="flex gap-4 mt-2 text-sm">
                            <span>📦 {customer.totalOrders} orders</span>
                            <span className="text-green-600 font-medium">💰 ₹{customer.totalSpent}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-blue-600 hover:text-blue-700"
                            onClick={() => handleEditCustomerClick(customer)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteCustomerClick(customer._id)}
                            disabled={!customer._id}
                            title={!customer._id ? "Customer profile not created yet (Order only)" : "Delete Customer"}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Select value={orderFilter} onValueChange={setOrderFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExportCSV} variant="outline" className="ml-auto">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Orders Management</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">No orders found</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {orderFilter === 'all'
                        ? "Orders will appear here once customers place orders."
                        : `No orders with status "${orderFilter}" found.`
                      }
                    </p>
                    <p className="text-xs text-gray-400">
                      Note: Make sure MongoDB is connected to save and retrieve orders.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map((order: any) => (
                      <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group">
                        {/* Header: ID, Date, Status */}
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-bold text-gray-700 bg-white border px-2 py-1 rounded">
                              #{order.orderId || order._id.slice(-6).toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3.5 h-3.5 mr-1" />
                              {new Date(order.createdAt).toLocaleString(undefined, {
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                            </span>
                          </div>
                          {getStatusBadge(order.orderStatus)}
                        </div>

                        <div className="p-6">
                          {/* Customer & Price Row */}
                          <div className="flex flex-col md:flex-row justify-between mb-8 gap-6">
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Customer</p>
                              <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{order.fullName}</h3>
                              <a href={`tel:${order.phone}`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-green-600 transition-colors">
                                <Users className="w-4 h-4 mr-2" />
                                {order.phone}
                              </a>
                            </div>
                            <div className="md:text-right">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Amount</p>
                              <p className="text-3xl font-extrabold text-green-600">₹{order.totalPrice}</p>
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Order Details */}
                            <div className="bg-blue-50/30 rounded-xl p-5 border border-blue-50">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600">
                                  <Package className="w-4 h-4" />
                                </div>
                                <h4 className="font-bold text-gray-800">Order Details</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm border-b border-blue-100/50 pb-2">
                                  <span className="text-gray-500">Phase</span>
                                  <span className="font-semibold text-gray-900">{order.phase}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-blue-100/50 pb-2">
                                  <span className="text-gray-500">Quantity</span>
                                  <span className="font-semibold text-gray-900">{order.totalQuantity} laddus</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-500">Weight</span>
                                  <span className="font-semibold text-gray-900">{order.totalWeight}g</span>
                                </div>
                              </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="bg-orange-50/30 rounded-xl p-5 border border-orange-50">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="bg-orange-100 p-1.5 rounded-lg text-orange-600">
                                  <MapPin className="w-4 h-4" />
                                </div>
                                <h4 className="font-bold text-gray-800">Delivery Address</h4>
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <p className="font-medium text-gray-900">{order.address.house}, {order.address.area}</p>
                                {order.address.landmark && <p className="text-xs">Near {order.address.landmark}</p>}
                                <p>{order.address.city} - {order.address.pincode}</p>
                                <div className="mt-3 flex gap-2">
                                  <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500 shadow-sm">
                                    {order.address.label || 'Home'}
                                  </span>
                                  {order.address.mapLink && (
                                    <a href={order.address.mapLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center">
                                      View Map
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Message Section */}
                          {order.message && (
                            <div className="mt-6">
                              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <MessageSquare className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">Customer Message</p>
                                  <p className="text-sm text-gray-700 italic truncate">"{order.message}"</p>
                                  {(order.message.length > 50 || order.message.includes('\n')) && (
                                    <button
                                      onClick={() => {
                                        setViewMessageData({ title: `Message from ${order.fullName}`, message: order.message });
                                        setViewMessageOpen(true);
                                      }}
                                      className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-1 hover:underline"
                                    >
                                      View Full Message
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Actions Footer */}
                          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                            <Select
                              value={order.orderStatus}
                              onValueChange={(value) => handleStatusUpdate(order._id, value)}
                            >
                              <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Confirmed">Confirmed</SelectItem>
                                <SelectItem value="Processing">Processing</SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                              </SelectContent>
                            </Select>

                            <Button
                              className={`flex-1 md:flex-none border transition-colors ${sentMessages.has(order._id)
                                ? "bg-green-100/80 text-green-700 border-green-200 hover:bg-green-200"
                                : "bg-sky-100/80 text-sky-700 border-sky-200 hover:bg-sky-200"
                                }`}
                              variant="ghost"
                              onClick={() => handleWhatsAppSend(order)}
                            >
                              {sentMessages.has(order._id) ? (
                                <>
                                  <Check className="w-4 h-4 mr-2" />
                                  Sanded
                                </>
                              ) : (
                                <>
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Send
                                </>
                              )}
                            </Button>

                            <div className="flex gap-2 w-full md:w-auto">
                              <Button
                                variant="outline"
                                className="flex-1 md:flex-none border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50"
                                onClick={() => handleEditClick(order)}
                              >
                                <Edit className="w-4 h-4 mr-2" /> Edit
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1 md:flex-none border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                                onClick={() => handleDeleteClick(order._id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Edit Order Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Order</DialogTitle>
                  <DialogDescription>Update order details for {editingOrder?.fullName}</DialogDescription>
                </DialogHeader>
                {editingOrder && (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="editPhase">Phase</Label>
                      <Input
                        id="editPhase"
                        value={editForm.phase}
                        onChange={(e) => setEditForm({ ...editForm, phase: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="editQuantity">Quantity</Label>
                        <Input
                          id="editQuantity"
                          type="number"
                          value={editForm.totalQuantity}
                          onChange={(e) => setEditForm({ ...editForm, totalQuantity: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="editWeight">Weight (g)</Label>
                        <Input
                          id="editWeight"
                          type="number"
                          value={editForm.totalWeight}
                          onChange={(e) => setEditForm({ ...editForm, totalWeight: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="editPrice">Total Price (₹)</Label>
                      <Input
                        id="editPrice"
                        type="number"
                        value={editForm.totalPrice}
                        onChange={(e) => setEditForm({ ...editForm, totalPrice: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2 border-t pt-2 mt-2">
                      <p className="font-medium text-sm">Delivery Address</p>
                      <div className="grid gap-2">
                        <Label htmlFor="editHouse">House/Flat No</Label>
                        <Input
                          id="editHouse"
                          value={editForm.address.house}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            address: { ...editForm.address, house: e.target.value }
                          })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="editArea">Area</Label>
                        <Input
                          id="editArea"
                          value={editForm.address.area}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            address: { ...editForm.address, area: e.target.value }
                          })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="editPincode">Pincode</Label>
                        <Input
                          id="editPincode"
                          value={editForm.address.pincode}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            address: { ...editForm.address, pincode: e.target.value }
                          })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="editLandmark">Landmark</Label>
                        <Input
                          id="editLandmark"
                          value={editForm.address.landmark}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            address: { ...editForm.address, landmark: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="editMessage">Customer Message</Label>
                      <Input
                        id="editMessage"
                        value={editForm.message}
                        onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveEdit}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Order</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this order? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Reports Sidebar */}
            <div className="flex flex-col gap-6 w-full lg:w-72 shrink-0">
              {/* Mobile Toggle */}
              <div className="lg:hidden">
                <Button variant="outline" className="w-full flex justify-between" onClick={() => setMobileReportsSidebarOpen(!mobileReportsSidebarOpen)}>
                  <span className="flex items-center gap-2"><Filter className="w-4 h-4" /> Report Menu</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${mobileReportsSidebarOpen ? 'rotate-90' : ''}`} />
                </Button>
              </div>

              <div className={`flex flex-col gap-6 ${mobileReportsSidebarOpen ? 'block' : 'hidden'} lg:flex`}>
                {/* Section 1: Monthly Report Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-green-600" /> Monthly Report
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={reportMonth} onValueChange={setReportMonth}>
                        <SelectTrigger className="bg-gray-50 border-gray-200">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                            <SelectItem key={m} value={m.toString()}>
                              {new Date(0, m - 1).toLocaleString('default', { month: 'short' })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={reportYear} onValueChange={setReportYear}>
                        <SelectTrigger className="bg-gray-50 border-gray-200">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {[2024, 2025, 2026].map(y => (
                            <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium h-9" onClick={handleApplyFilter}>
                      Apply Filter
                    </Button>
                  </div>
                </div>

                {/* Section 2: Report Type */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 overflow-hidden">
                  <div className="p-4 pb-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Report Type</h4>
                  </div>
                  <div className="flex flex-col gap-1 p-2">
                    <Button
                      variant="ghost"
                      className={`justify-start ${reportCategory === 'summary' ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                      onClick={() => setReportCategory('summary')}
                    >
                      <PieChart className="w-4 h-4 mr-3" /> Monthly Summary
                    </Button>
                    <Button
                      variant="ghost"
                      className={`justify-start ${reportCategory === 'revenue' ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                      onClick={() => setReportCategory('revenue')}
                    >
                      <LineChart className="w-4 h-4 mr-3" /> Revenue Report
                    </Button>
                    <Button
                      variant="ghost"
                      className={`justify-start ${reportCategory === 'orders_report' ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                      onClick={() => setReportCategory('orders_report')}
                    >
                      <FileText className="w-4 h-4 mr-3" /> Orders Report
                    </Button>
                    <Button
                      variant="ghost"
                      className={`justify-start ${reportCategory === 'customers' ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                      onClick={() => setReportCategory('customers')}
                    >
                      <Users className="w-4 h-4 mr-3" /> Customer Insights
                    </Button>
                    <Button
                      variant="ghost"
                      className={`justify-start ${reportCategory === 'inventory' ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                      onClick={() => setReportCategory('inventory')}
                    >
                      <Package className="w-4 h-4 mr-3" /> Product Inventory
                    </Button>
                  </div>
                </div>

                {/* Section 3: Downloads */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <Download className="w-4 h-4 text-green-600" /> Downloads
                  </h4>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                      onClick={handleDownloadPDF}
                      disabled={isExporting}
                    >
                      {isExporting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin text-red-500" /> : <FileText className="w-4 h-4 mr-2 text-red-500" />}
                      Download PDF
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                      onClick={handleDownloadReportCSV}
                      disabled={isExporting}
                    >
                      {isExporting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin text-green-500" /> : <BarChart3 className="w-4 h-4 mr-2 text-green-500" />}
                      Export CSV
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Reports Content Area */}
            <div className="flex-1 space-y-6">
              {/* DEFAULT: Revenue Report (Mapped to existing 'sales') */}
              {reportCategory === 'revenue' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Revenue Performance</h3>
                        <p className="text-sm text-gray-500">Sales Trends over time</p>
                      </div>
                    </div>

                    {/* Dynamic Revenue Chart */}
                    <div className="h-64 w-full bg-gradient-to-b from-green-50/50 to-white rounded-lg border border-dashed border-green-100 flex items-end justify-between px-6 pb-0 relative">
                      {revenueData.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                          No data for this period
                        </div>
                      ) : (
                        <>
                          <div className="absolute inset-0 flex items-center justify-center text-green-600/10 font-bold text-4xl select-none pointer-events-none">
                            <LineChart className="w-32 h-32 opacity-10" />
                          </div>
                          {revenueData.map((dayStat, i) => {
                            const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 100); // Avoid div by zero
                            const heightPercentage = (dayStat.revenue / maxRevenue) * 80 + 5; // Scale to max 85%, min 5%

                            return (
                              <div
                                key={i}
                                className="flex-1 bg-green-500/80 hover:bg-green-600 rounded-t-sm transition-all cursor-pointer relative group mx-[1px]"
                                style={{ height: `${heightPercentage}%` }}
                                title={`Day ${dayStat.day}: ₹${dayStat.revenue}`}
                              >
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-lg block pointer-events-none">
                                  <p className="font-bold">₹{dayStat.revenue}</p>
                                  <p className="text-[9px] opacity-80">{dayStat.count} orders</p>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-2">
                      {/* Show partial date labels to avoid clutter */}
                      {revenueData.length > 0 && revenueData.filter((_, i) => i % 5 === 0).map((d, i) => (
                        <span key={i}>{d.day}</span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-none shadow-sm bg-blue-50/50">
                      <CardContent className="p-4">
                        <p className="text-xs font-bold text-blue-500 uppercase">Total Revenue</p>
                        <p className="text-2xl font-bold text-blue-900 mt-1">₹{reportTotalRevenue.toLocaleString()}</p>
                        <p className="text-xs text-blue-400 mt-1 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" /> {reportTotalOrders} orders this period
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-purple-50/50">
                      <CardContent className="p-4">
                        <p className="text-xs font-bold text-purple-500 uppercase">Avg. Order Value</p>
                        <p className="text-2xl font-bold text-purple-900 mt-1">₹{reportAvgOrderValue.toLocaleString()}</p>
                        <p className="text-xs text-purple-400 mt-1 flex items-center">
                          Based on selected period
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-orange-50/50">
                      <CardContent className="p-4">
                        <p className="text-xs font-bold text-orange-500 uppercase">Total Orders</p>
                        <p className="text-2xl font-bold text-orange-900 mt-1">{reportTotalOrders}</p>
                        <p className="text-xs text-orange-400 mt-1">Processed successfully</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Monthly Summary View (New) */}
              {reportCategory === 'summary' && summaryData && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phase Analysis */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Phase Breakdown</CardTitle>
                        <CardDescription>Sales by Cycle Phase (excluding cancellations)</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {summaryData.phaseStats?.map((stat: any) => (
                            <div key={stat._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${stat._id === 'Phase 1' ? 'bg-pink-400' : 'bg-purple-400'}`}></div>
                                <span className="font-medium text-gray-700">{stat._id}</span>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">₹{stat.revenue.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">{stat.count} orders</p>
                              </div>
                            </div>
                          ))}
                          {(!summaryData.phaseStats || summaryData.phaseStats.length === 0) && (
                            <p className="text-sm text-gray-400 text-center py-4">No data available</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Status Distribution */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Order Status Distribution</CardTitle>
                        <CardDescription>Breakdown by current status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                          {summaryData.statusStats?.map((stat: any) => (
                            <div key={stat._id} className="p-3 border border-gray-100 rounded-lg text-center">
                              {getStatusBadge(stat._id)}
                              <p className="text-xl font-bold text-gray-900 mt-2">{stat.count}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-green-600 text-white border-none">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <p className="text-green-100 font-medium mb-1">Net Revenue (After Cancellations)</p>
                        <h3 className="text-3xl font-bold">₹{summaryData.netRevenue?.toLocaleString() || 0}</h3>
                      </div>
                      <DollarSign className="w-12 h-12 text-green-400 opacity-50" />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Orders Report Table View (New) */}
              {reportCategory === 'orders_report' && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Transactions Report</CardTitle>
                        <CardDescription>Detailed list of orders for {new Date(0, parseInt(reportMonth) - 1).toLocaleString('default', { month: 'long' })} {reportYear}</CardDescription>
                      </div>
                      <Badge variant="outline">{ordersReportData.length} Records</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                          <tr>
                            <th className="px-6 py-3 font-medium">Date</th>
                            <th className="px-6 py-3 font-medium">Order ID</th>
                            <th className="px-6 py-3 font-medium">Customer</th>
                            <th className="px-6 py-3 font-medium">Phase</th>
                            <th className="px-6 py-3 font-medium text-right">Amount</th>
                            <th className="px-6 py-3 font-medium text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {ordersReportData.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                No orders found for this period
                              </td>
                            </tr>
                          ) : ordersReportData.map((order: any) => (
                            <tr key={order._id} className="hover:bg-gray-50/50">
                              <td className="px-6 py-3 text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-3 font-mono text-gray-600">
                                #{order.orderId || order._id.slice(-6).toUpperCase()}
                              </td>
                              <td className="px-6 py-3">
                                <p className="font-medium text-gray-900">{order.fullName}</p>
                                <p className="text-xs text-gray-400">{order.phone}</p>
                              </td>
                              <td className="px-6 py-3">
                                <Badge variant="secondary" className="bg-pink-50 text-pink-700 border-pink-100">{order.phase}</Badge>
                              </td>
                              <td className="px-6 py-3 text-right font-bold text-gray-900">
                                ₹{order.totalPrice}
                              </td>
                              <td className="px-6 py-3 text-right">
                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold
                                  ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                                    order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                      'bg-yellow-100 text-yellow-700'}`}>
                                  {order.orderStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}


              {/* Customers Report View */}
              {reportCategory === 'customers' && (
                <Card className="border-none shadow-sm bg-white rounded-xl">
                  <CardHeader>
                    <CardTitle>Customer Demographics</CardTitle>
                    <CardDescription>Insights about your customer base</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                      <PieChart className="w-16 h-16 text-gray-200 mb-4" />
                      <h4 className="text-lg font-medium text-gray-900">Demographic Data</h4>
                      <p className="max-w-sm mx-auto mt-2">
                        Detailed customer segmentation by location, age group, and purchasing frequency will appear here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Inventory Report View */}
              {reportCategory === 'inventory' && (
                <Card className="border-none shadow-sm bg-white rounded-xl">
                  <CardHeader>
                    <CardTitle>Inventory Status</CardTitle>
                    <CardDescription>Track stock levels and product performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                      <Package className="w-16 h-16 text-gray-200 mb-4" />
                      <h4 className="text-lg font-medium text-gray-900">Stock Alerts</h4>
                      <p className="max-w-sm mx-auto mt-2">
                        Low stock warnings, best-selling products prediction, and restocking suggestions will be implemented here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Orders Report View (New) */}
              {reportCategory === 'orders_report' && (
                <Card className="border-none shadow-sm bg-white rounded-xl">
                  <CardHeader>
                    <CardTitle>Orders Report</CardTitle>
                    <CardDescription>Detailed order log for {new Date(0, parseInt(reportMonth) - 1).toLocaleString('default', { month: 'long' })} {reportYear}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                      <FileText className="w-16 h-16 text-gray-200 mb-4" />
                      <h4 className="text-lg font-medium text-gray-900">Transactional Report</h4>
                      <p className="max-w-sm mx-auto mt-2">
                        Detailed table of all transactions and order statuses for the selected period.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditCustomerDialogOpen} onOpenChange={setIsEditCustomerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Update profile for {editingCustomer?.fullName || editingCustomer?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="custName">Name</Label>
              <Input
                id="custName"
                value={editCustomerForm.name}
                onChange={(e) => setEditCustomerForm({ ...editCustomerForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="custAge">Age</Label>
              <Input
                id="custAge"
                value={editCustomerForm.age}
                onChange={(e) => setEditCustomerForm({ ...editCustomerForm, age: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="custPhone">Phone</Label>
              <Input
                id="custPhone"
                value={editCustomerForm.phone}
                onChange={(e) => setEditCustomerForm({ ...editCustomerForm, phone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCustomerDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEditCustomer}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Dialog */}
      <Dialog open={isDeleteCustomerDialogOpen} onOpenChange={setIsDeleteCustomerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer?
              <br />
              <span className="text-red-500 font-bold">Warning: This will also delete ALL their orders!</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteCustomerDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteCustomer}>Delete Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* View Message Dialog */}
      <Dialog open={viewMessageOpen} onOpenChange={setViewMessageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewMessageData?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm leading-relaxed whitespace-pre-wrap">
              {viewMessageData?.message}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setViewMessageOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
}
