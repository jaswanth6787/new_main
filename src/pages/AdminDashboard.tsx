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
  LogOut, Package, CheckCircle, Clock, Truck, XCircle, RefreshCw
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'orders'>('overview');
  const [orderFilter, setOrderFilter] = useState<string>('all');

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

      // Get orders
      const ordersRes = await fetch(`${API_BASE_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const ordersData = await ordersRes.json();

      // Get customers
      const customersRes = await fetch(`${API_BASE_URL}/customers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const customersData = await customersRes.json();

      // Check if API returned an error
      if (!ordersData.success || !ordersData.data) {
        console.error('API Error:', ordersData.message || ordersData.error);
        toast.error(ordersData.message || "Failed to load orders. MongoDB may not be connected.");
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
        return;
      }

      setOrders(ordersData.data || []);

      // Calculate stats
      const totalOrders = ordersData.data?.length || 0;
      const totalRevenue = ordersData.data?.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0) || 0;
      const pendingOrders = ordersData.data?.filter((o: any) => o.orderStatus === 'Pending').length || 0;
      const deliveredOrders = ordersData.data?.filter((o: any) => o.orderStatus === 'Delivered').length || 0;

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
      toast.error("Error deleting order");
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
      Pending: { color: "bg-yellow-500", icon: Clock },
      Confirmed: { color: "bg-blue-500", icon: CheckCircle },
      Processing: { color: "bg-purple-500", icon: Package },
      Shipped: { color: "bg-indigo-500", icon: Truck },
      Delivered: { color: "bg-green-500", icon: CheckCircle },
      Cancelled: { color: "bg-red-500", icon: XCircle },
    };

    const variant = variants[status] || variants.Pending;
    const Icon = variant.icon;

    return (
      <Badge className={`${variant.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const filteredOrders = orderFilter === 'all'
    ? orders
    : orders.filter(o => o.orderStatus === orderFilter);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Cycle Harmony Laddus CRM</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by Customer ID, Order ID, Phone, or Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => loadDashboardData()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === 'customers' ? 'default' : 'outline'}
            onClick={() => setActiveTab('customers')}
          >
            Customers
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.overview.totalCustomers}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.overview.totalOrders}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.overview.totalRevenue}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.orderStatus.delivered}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest 10 orders</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No recent orders</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.recentOrders.map((order: any) => (
                      <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{order.orderId || order._id}</p>
                          <p className="text-sm text-gray-500">{order.fullName} | {order.phone}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(order.orderStatus)}
                          <span className="font-medium">₹{order.totalPrice}</span>
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
                            ID: <span className="font-mono">{customer.customerId}</span> |
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
                      <div key={order._id} className="p-4 bg-gray-50 rounded-lg border hover:border-pink-200 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-lg">Order: {order.orderId || order._id.slice(-6).toUpperCase()}</p>
                              {getStatusBadge(order.orderStatus)}
                            </div>
                            <p className="text-sm font-medium text-gray-900">{order.fullName} | {order.phone}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Placed on: {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2 text-right">
                            <p className="font-bold text-xl text-green-600">₹{order.totalPrice}</p>
                            <div className="flex items-center gap-2">
                              <Select
                                value={order.orderStatus}
                                onValueChange={(value) => handleStatusUpdate(order._id, value)}
                              >
                                <SelectTrigger className="w-[130px] h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                                  <SelectItem value="Processing">Processing</SelectItem>
                                  <SelectItem value="Shipped">Shipped</SelectItem>
                                  <SelectItem value="Delivered">Delivered</SelectItem>
                                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>

                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-blue-600 hover:text-blue-700"
                                onClick={() => handleEditClick(order)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteClick(order._id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t pt-4">
                          <div>
                            <p className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
                              <Package className="w-4 h-4" /> Order Details
                            </p>
                            <div className="space-y-1 text-gray-600 pl-5">
                              <p><span className="font-medium">Phase:</span> {order.phase}</p>
                              <p><span className="font-medium">Quantity:</span> {order.totalQuantity} laddus</p>
                              <p><span className="font-medium">Weight:</span> {order.totalWeight}g</p>
                              {order.message && (
                                <div className="mt-2 p-2 bg-yellow-50 rounded text-xs italic border border-yellow-100">
                                  " {order.message} "
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
                              <Truck className="w-4 h-4" /> Delivery Address
                            </p>
                            <div className="space-y-1 text-gray-600 pl-5">
                              <p>{order.address.house}, {order.address.area}</p>
                              {order.address.landmark && <p className="text-xs text-gray-500">Landmark: {order.address.landmark}</p>}
                              <p>Pincode: {order.address.pincode}</p>
                              <p className="text-xs bg-gray-200 inline-block px-1 rounded">{order.address.label || 'Home'}</p>

                              {order.address.mapLink && (
                                <a
                                  href={order.address.mapLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-pink-600 hover:underline text-xs flex items-center gap-1 mt-1"
                                >
                                  View Map
                                </a>
                              )}
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
      </div>
    </div>
  );
}


