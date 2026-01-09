import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Calendar, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function CustomerProfile() {
    const [phone, setPhone] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customer, setCustomer] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);

    const handleLogin = async () => {
        if (!phone || phone.length < 10) {
            toast.error("Please enter a valid phone number");
            return;
        }

        setLoading(true);
        try {
            const url = API_BASE_URL
                ? `${API_BASE_URL}/customer-profile/${phone}`
                : `http://localhost:5000/api/customer-profile/${phone}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setCustomer(data.customer);
                setOrders(data.orders);
                setIsLoggedIn(true);
                toast.success("Login Successful");
            } else {
                toast.error("Customer not found", {
                    description: "No profile found with this number. Please verify or place an order first."
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Failed to login. Server might be down.");
        } finally {
            setLoading(false);
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
            <Badge className={`${variant.color} text-white flex items-center gap-1`}>
                <Icon className="w-3 h-3" />
                {status}
            </Badge>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
            <Navbar />

            <div className="container mx-auto px-4 py-8 pt-24">
                {!isLoggedIn ? (
                    <div className="max-w-md mx-auto mt-10">
                        <Card className="shadow-lg border-2 border-pink-100">
                            <CardHeader className="text-center bg-pink-50/50 rounded-t-lg pb-8">
                                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-pink-500" />
                                </div>
                                <CardTitle className="text-2xl font-bold text-gray-800">Track Your Orders</CardTitle>
                                <CardDescription>
                                    Enter your phone number to view your profile and order history
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                    <Input
                                        type="tel"
                                        placeholder="Enter your registered mobile number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="h-12 text-lg"
                                    />
                                </div>
                                <Button
                                    className="w-full h-12 text-lg bg-pink-500 hover:bg-pink-600"
                                    onClick={handleLogin}
                                    disabled={loading}
                                >
                                    {loading ? "Searching..." : "View Profile"}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Profile Overview */}
                        <Card className="shadow-md border-pink-100">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>Welcome, {customer?.name} 🌸</span>
                                    <Button variant="ghost" onClick={() => setIsLoggedIn(false)} className="text-sm text-gray-500">Logout</Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                                    <p className="font-semibold text-lg">{customer?.phone}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-1">Age</p>
                                    <p className="font-semibold text-lg">{customer?.age || "N/A"} years</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                                    <p className="font-semibold text-lg">{orders.length}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order History */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-pink-500" />
                                Order History
                            </h3>

                            {orders.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                                    <p className="text-gray-500">No orders found yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <Card key={order._id} className="overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="p-6">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-mono text-sm text-gray-500">#{order._id.slice(-6).toUpperCase()}</span>
                                                            {getStatusBadge(order.orderStatus)}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                                year: 'numeric', month: 'long', day: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-green-600">₹{order.totalPrice}</p>
                                                        <p className="text-sm text-gray-500">{order.totalQuantity} items</p>
                                                    </div>
                                                </div>

                                                <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700 mb-2">Cycle Details</p>
                                                        <div className="text-sm space-y-1 text-gray-600">
                                                            <p>Phase: <span className="font-medium text-pink-600">{order.phase}</span></p>
                                                            <p>Weight: {order.totalWeight}g</p>
                                                            <p>Cycle Length: {order.cycleLength} days</p>
                                                            {order.message && (
                                                                <p className="mt-2 text-xs italic bg-pink-50 p-2 rounded border border-pink-100">
                                                                    "{order.message}"
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700 mb-2">Delivery Address</p>
                                                        <p className="text-sm text-gray-600 leading-relaxed">
                                                            {order.address.house}, {order.address.area}<br />
                                                            {order.address.landmark && <span className="text-gray-500">Near {order.address.landmark}<br /></span>}
                                                            {order.address.pincode}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
