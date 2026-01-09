import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Changed from use-toast to sonner as per package.json
import { calculateCycleMessage } from "@/lib/cycleCalculator";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { submitToGoogleSheet } from "@/lib/googleSheets";
import { submitOrder } from "@/lib/orderService";
import { Info, Home, MapPin } from "lucide-react";



interface CycleResult {
  message: string;
  phase: string;
  price_total: number;
  weight: number;
  quantity: number;
  A: number;
  B: number;
  D: number;
  BB: number;
}

export const CycleCompanion = () => {
  const [lastPeriodDate, setLastPeriodDate] = useState("");
  const [averageCycle, setAverageCycle] = useState("");
  const [name, setName] = useState("");
  const [result, setResult] = useState<CycleResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);

  const [checkoutStep, setCheckoutStep] = useState<'phone' | 'details' | 'address'>('phone');
  const [checkingPhone, setCheckingPhone] = useState(false);
  const [age, setAge] = useState("");

  const [fullName, setFullName] = useState("");
  const [house, setHouse] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [label, setLabel] = useState<"Home" | "Work" | "Other">("Home");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [showMapInfo, setShowMapInfo] = useState(false);

  // Function to check if customer exists
  const handlePhoneCheck = async () => {
    if (!phone || phone.length < 10) {
      toast.error("Invalid Phone", {
        description: "Please enter a valid phone number",
      });
      return;
    }

    setCheckingPhone(true);
    try {
      const response = await fetch('http://localhost:5000/api/check-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await response.json();

      if (data.exists && data.data) {
        // Customer exists
        setFullName(data.data.name);
        if (data.data.age) setAge(data.data.age.toString());
        // Pre-fill address if available
        if (data.data.addresses && data.data.addresses.length > 0) {
          const lastAddr = data.data.addresses[data.data.addresses.length - 1];
          setHouse(lastAddr.house || "");
          setArea(lastAddr.area || "");
          setLandmark(lastAddr.landmark || "");
          setPincode(lastAddr.pincode || "");
          setMapLink(lastAddr.mapLink || "");
          setLabel((lastAddr.label as "Home" | "Work" | "Other") || "Home");
        }

        toast.success(`Welcome back, ${data.data.name}!`);
        setCheckoutStep('address');
      } else {
        // New Customer
        setFullName(name); // Use the name from the calculator form if available
        setCheckoutStep('details');
      }
    } catch (error) {
      console.error("Error checking phone:", error);
      toast.error("Connection Error", { description: "Could not verify phone number. Proceeding as new." });
      setCheckoutStep('details');
    } finally {
      setCheckingPhone(false);
    }
  };

  const handleCheck = () => {
    if (!lastPeriodDate || !name || !averageCycle) {
      toast.error("Missing Information", {
        description: "Please fill in all fields",
      });
      return;
    }

    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const data = calculateCycleMessage({
        last_period_date: lastPeriodDate,
        today: today,
        average_cycle: parseInt(averageCycle),
        name: name,
      });

      setResult(data);

      // Scroll to the personalized plan section after a short delay to ensure DOM is updated
      setTimeout(() => {
        const planElement = document.getElementById('personalized-plan');
        if (planElement) {
          planElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

      toast.success("Success! 🌸", {
        description: "Your personalized plan is ready",
      });
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to calculate cycle information. Please check your inputs.",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = () => {
    if (!result) {
      toast.error("No plan yet", {
        description: "Please check your phase first to generate a message.",
      });
      return;
    }

    setCheckoutStep('phone');
    setPhone(""); // Optionally clear phone or keep it
    setAddressOpen(true);
  };

  const handleConfirmAddress = () => {
    if (!result) return;

    if (!fullName || !house || !phone || !area || !pincode) {
      toast.error("Missing address details", {
        description: "Please fill in all required address fields.",
      });
      return;
    }

    const phoneNumber = "919347122416";

    // Determine phase for display
    const message = result.message;
    const isPhase2PreOrder = message.includes("Only") &&
      message.includes("days left to complete Phase-1") &&
      message.includes("Next Phase-2 laddus will start") &&
      message.includes("Pre-orders are available");
    const isPhase2Delivery = message.includes("Today is Day") &&
      message.includes("Phase-2 laddus (Sunflower + Sesame)");
    const displayPhase = (isPhase2PreOrder || isPhase2Delivery) ? "Phase-2" : "Phase-1";

    // Format the WhatsApp message
    const orderSummary = `\n\nPhase: ${displayPhase}\nTotal Quantity 🍪: ${result.quantity} laddus\nTotal Weight ⚖️: ${result.weight}g\nTotal Price 💰: ₹${result.price_total}`;

    const addressLines = [
      `Full Name: ${fullName}`,
      `Age: ${age}`,
      `Phone: ${phone}`,
      `House/Flat No.: ${house}`,
      area && `Area: ${area}`,
      landmark && `Landmark: ${landmark}`,
      pincode && `Pincode: ${pincode}`,
      mapLink && `Map Link: ${mapLink}`,
      `Address Label: ${label}`,
      `Payment method: ${paymentMethod}`,
    ]
      .filter(Boolean)
      .join("\n");

    const text = `${result.message}${orderSummary}\n\nDelivery Details:\n${addressLines}\n\nOrder Confirmed 📦`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank");

    // Format address as: House/Flat No.+Area+Landmark+Pincode+\nMap Link
    const formattedAddress = [
      house,
      area,
      landmark,
      pincode,
      mapLink ? `\n${mapLink}` : ""
    ]
      .filter(Boolean)
      .join("+");

    // Submit order data to Google Sheets with all required columns
    submitToGoogleSheet({
      Timestamp: new Date().toISOString(),
      Full_name: fullName,
      Periods_Started: lastPeriodDate,
      Cycle_length: averageCycle,
      Phase: displayPhase,
      Total_Quantity: result.quantity,
      Total_Weight: result.weight,
      Total_Price: result.price_total,
      Phone: phone,
      address: formattedAddress,
      Message: result.message
    });

    // Submit order data to MongoDB
    const orderData = {
      fullName,
      phone,
      age: parseInt(age) || 0, // Include age
      periodsStarted: lastPeriodDate,
      cycleLength: parseInt(averageCycle),
      phase: displayPhase,
      totalQuantity: result.quantity,
      totalWeight: result.weight,
      totalPrice: result.price_total,
      address: {
        house,
        area,
        landmark: landmark || '',
        pincode,
        mapLink: mapLink || '',
        label: label || 'Home'
      },
      paymentMethod: paymentMethod || 'Cash on Delivery',
      message: result.message
    };

    // Submit to MongoDB backend
    submitOrder(orderData)
      .then((response) => {
        if (response.success) {
          console.log('Order saved to database successfully');
          toast.success("Order Saved!", {
            description: "Your order has been saved to our database.",
          });
        } else {
          console.error('Failed to save order to database:', response.error);
          toast.error("Database Error", {
            description: "Order was sent via WhatsApp but couldn't be saved to database.",
          });
        }
      })
      .catch((error) => {
        console.error('Error submitting order to database:', error);
      });

    setAddressOpen(false);
  };

  return (
    <section id="cycle-phase-checker" className="py-16 px-4 bg-gradient-to-b from-pink-50 to-pink-100/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 flex items-center justify-center gap-3">
            Cycle Phase Checker
          </h2>
          <p className="text-muted-foreground">
            Track your menstrual phase and get personalized laddu delivery plans
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Card - Form */}
          <Card className="shadow-xl border-2 border-wellness-pink/30 transition-all hover:shadow-2xl">
            <CardHeader className="bg-wellness-pink/20 rounded-t-2xl">
              <CardTitle className="text-xl flex items-center gap-2 text-foreground">
                Cycle Phase Checker <span>📅</span>
              </CardTitle>
              <CardDescription>Enter your cycle details below</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="lastPeriodDate" className="text-base font-medium">
                  Last Period Start Date
                </Label>
                <Input
                  id="lastPeriodDate"
                  type="date"
                  value={lastPeriodDate}
                  onChange={(e) => setLastPeriodDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="rounded-xl border-2 border-input focus:border-primary transition-colors h-12 text-foreground bg-card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="averageCycle" className="text-base font-medium">
                  Average Cycle Length (days) 📊
                </Label>
                <Input
                  id="averageCycle"
                  type="number"
                  value={averageCycle}
                  onChange={(e) => setAverageCycle(e.target.value)}
                  min="20"
                  max="45"
                  placeholder="Enter the number like 26,29,31 ..."
                  className="rounded-xl border-2 border-input focus:border-primary transition-colors h-12 text-foreground bg-card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium">
                  Name 💝
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="rounded-xl border-2 border-input focus:border-primary transition-colors h-12 text-foreground bg-card"
                />
              </div>

              <Button
                onClick={handleCheck}
                disabled={loading}
                className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
              >
                {loading ? "Checking..." : "Check My Phase 🔍"}
              </Button>
            </CardContent>
          </Card>

          {/* Right Card - Results */}
          <Card id="personalized-plan" className="shadow-xl border-2 border-wellness-green/30 transition-all hover:shadow-2xl">
            <CardHeader className="bg-wellness-green/20 rounded-t-2xl">
              <CardTitle className="text-xl flex items-center gap-2 text-foreground">
                Your Personalized Plan 🌿
              </CardTitle>
              <CardDescription>
                {result ? "Your cycle information and laddu plan" : "Submit the form to see your plan"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {result ? (
                <div className="space-y-6">
                  {/* Main Message */}
                  <div className="bg-wellness-cream p-6 rounded-2xl border-2 border-wellness-pink/20">
                    <p className="text-foreground leading-relaxed whitespace-pre-line text-base">
                      {result.message}
                    </p>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 bg-card rounded-xl border border-border shadow-sm">
                      <span className="font-semibold text-foreground">Phase:</span>
                      <span className="text-primary font-bold text-lg">
                        {(() => {
                          const message = result.message;
                          // Check if message contains Phase-2 indicators
                          // For Phase-1 pre-order scenario: "Only X days left to complete" + "Phase-1" + "Next Phase-2 laddus will start from" + "Pre-orders are available"
                          const isPhase2PreOrder = message.includes("Only") &&
                            message.includes("days left to complete") &&
                            message.includes("Phase-1") &&
                            message.includes("Next Phase-2 laddus will start from") &&
                            message.includes("Pre-orders are available");
                          // For Phase-2 delivery scenario
                          const isPhase2Delivery = message.includes("Today is Day") &&
                            message.includes("Phase-2 laddus (Sunflower + Sesame)");

                          return (isPhase2PreOrder || isPhase2Delivery) ? "Phase-2" : "Phase-1";
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-card rounded-xl border border-border shadow-sm">
                      <span className="font-semibold text-foreground">Total Quantity 🍪:</span>
                      <span className="text-primary font-bold text-lg">{result.quantity} laddus</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-card rounded-xl border border-border shadow-sm">
                      <span className="font-semibold text-foreground">Total Weight ⚖️:</span>
                      <span className="text-primary font-bold text-lg">{result.weight}g</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-card rounded-xl border border-border shadow-sm">
                      <span className="font-semibold text-foreground">Total Price 💰:</span>
                      <span className="text-primary font-bold text-lg">₹{result.price_total}</span>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <Button
                    onClick={handleBuy}
                    className="w-full h-14 text-lg font-semibold rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-all hover:shadow-xl"
                  >
                    Check out
                  </Button>

                  {/* Debug Info */}
                  {/* <div className="bg-muted/50 p-4 rounded-xl border border-border">
                    <p className="text-sm text-muted-foreground font-mono">
                      Debug: A={result.A}, B={result.B}, D={result.D}, BB={result.BB}
                    </p>
                  </div> */}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="text-6xl mb-4">🌸</div>
                  <p className="text-muted-foreground text-lg">
                    Fill in your details and click "Check My Phase" to see your personalized plan
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-muted-foreground mt-8 text-sm">
          Made with <span className="text-red-400">💝</span> for women's wellness
        </p>
      </div>

      <Dialog open={addressOpen} onOpenChange={setAddressOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {checkoutStep === 'phone' && "Enter Phone Number"}
              {checkoutStep === 'details' && "A few more details"}
              {checkoutStep === 'address' && "Delivery Address"}
            </DialogTitle>
          </DialogHeader>

          {checkoutStep === 'phone' && (
            <div className="space-y-4 py-4">
              <p className="text-muted-foreground">Please enter your phone number to continue.</p>
              <div className="grid gap-2">
                <Label htmlFor="checkPhone">Phone Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="checkPhone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g 9876543210"
                  />
                  <Button onClick={handlePhoneCheck} disabled={checkingPhone}>
                    {checkingPhone ? "Checking..." : "Next"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {checkoutStep === 'details' && (
            <div className="space-y-4 py-4">
              <p className="text-muted-foreground">
                We need a few details to customize your experience.
              </p>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="checkoutName">Full Name</Label>
                  <Input
                    id="checkoutName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="checkoutAge">Age</Label>
                  <Input
                    id="checkoutAge"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter your age"
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button onClick={() => setCheckoutStep('address')}>Next</Button>
              </DialogFooter>
            </div>
          )}

          {checkoutStep === 'address' && (
            <>
              {/* Delivery Note */}
              <div className="bg-wellness-yellow/20 border border-wellness-yellow/40 rounded-lg p-4 mb-4">
                <p className="text-sm text-foreground font-medium">
                  <span className="font-semibold">Delivery Note:</span> Currently, we deliver only within Hyderabad.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4">
                  {/* Name and Phone are already set/confirmed */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-muted-foreground">Name</Label>
                      <div className="font-medium">{fullName}</div>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-muted-foreground">Phone</Label>
                      <div className="font-medium">{phone}</div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="house" className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      House / Flat No.
                    </Label>
                    <Input
                      id="house"
                      required
                      value={house}
                      onChange={(e) => setHouse(e.target.value)}
                      placeholder="e.g., 123, Flat 4B"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      required
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g., Hitech City"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="landmark" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Landmark (optional)
                    </Label>
                    <Input
                      id="landmark"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g., Near Metro Station"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      required
                      type="number"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g., 500081"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mapLink" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Map Link
                      <button
                        type="button"
                        onClick={() => setShowMapInfo(true)}
                        className="inline-flex items-center justify-center rounded-full hover:bg-muted p-1 transition-colors ml-auto"
                        aria-label="Show map link instructions"
                      >
                        <Info className="h-4 w-4 text-primary" />
                      </button>
                    </Label>
                    <Input
                      id="mapLink"
                      value={mapLink}
                      onChange={(e) => setMapLink(e.target.value)}
                      placeholder="https://maps.google.com/..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="label">Address Label</Label>
                    <select
                      id="label"
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                      value={label}
                      onChange={(e) => setLabel(e.target.value as "Home" | "Work" | "Other")}
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <select
                      id="paymentMethod"
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                      value={paymentMethod}
                      disabled
                    >
                      <option value="Cash on Delivery">Cash on Delivery</option>
                    </select>
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setAddressOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmAddress}>Confirm &amp; WhatsApp</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Map Link Info Dialog */}
      <Dialog open={showMapInfo} onOpenChange={setShowMapInfo}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>How to Share Your Map Location</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-4">
                Follow these steps to share your location from Google Maps:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-foreground">
                <li>Open Google Maps on your phone</li>
                <li>Press and hold on your location on the map</li>
                <li>Tap the "Share" option that appears</li>
                <li>Copy the map link and paste it in the Map Link field above</li>
              </ol>
            </div>
            <div className="flex justify-center">
              <img
                src="/map-link-instructions.png"
                alt="How to share map location instructions"
                className="max-w-full h-auto rounded-lg border border-border"
                onError={(e) => {
                  // If image doesn't exist, show a placeholder message
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector('.placeholder-message')) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'placeholder-message text-center p-8 text-muted-foreground';
                    placeholder.textContent = 'Map link instructions image will appear here';
                    parent.appendChild(placeholder);
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowMapInfo(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
