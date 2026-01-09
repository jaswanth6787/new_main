import { Navbar } from "@/components/Navbar";
import { RotateCcw, XCircle, CheckCircle, Clock, AlertTriangle, Mail, Phone, ShoppingBag } from "lucide-react";

const RefundCancellationPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
            <RotateCcw className="w-8 h-8 text-pink-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Refund & Cancellation Policy
          </h1>
          <p className="text-lg text-gray-600">
            Your satisfaction is our priority
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          
          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              At <strong>NHC Service</strong>, we are committed to providing you with high-quality wellness products 
              and exceptional customer service. We understand that sometimes you may need to cancel an order or request 
              a refund, and we want to make this process as smooth and transparent as possible.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This policy applies to all orders placed through our website or via WhatsApp. Please read this policy 
              carefully to understand your rights and our procedures regarding cancellations and refunds.
            </p>
          </section>

          {/* Order Cancellation Policy */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Order Cancellation Policy</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              You may cancel your order under the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Before shipment:</strong> If your order has not yet been shipped, you can cancel it by 
                contacting us immediately. We will process the cancellation and issue a full refund.</li>
              <li><strong>After shipment:</strong> Once your order has been shipped, cancellation may not be possible. 
                In such cases, you may need to return the product following our return policy.</li>
              <li><strong>WhatsApp orders:</strong> Orders placed via WhatsApp follow the same cancellation policy. 
                Please contact us through WhatsApp or email to request cancellation.</li>
            </ul>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
              <p className="text-gray-800 font-semibold mb-2">
                💡 Quick Tip
              </p>
              <p className="text-gray-700 leading-relaxed">
                To cancel an order, please contact us as soon as possible. The sooner you reach out, the higher 
                the chance of successful cancellation before shipment.
              </p>
            </div>
          </section>

          {/* Refund Eligibility */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Refund Eligibility</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We offer refunds in the following situations:
            </p>
            <div className="space-y-4 mt-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Eligible for Refund
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                  <li><strong>Damaged products:</strong> Products received in damaged condition due to shipping or handling</li>
                  <li><strong>Incorrect products:</strong> Wrong items delivered that differ from what was ordered</li>
                  <li><strong>Defective products:</strong> Products that are faulty or not functioning as intended</li>
                  <li><strong>Missing items:</strong> Incomplete orders with missing products</li>
                </ul>
              </div>
            </div>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mt-4">
              <p className="text-gray-800 font-semibold mb-2">
                ⚠️ Important Notice
              </p>
              <p className="text-gray-700 leading-relaxed">
                To be eligible for a refund, you must report any issues (damaged, incorrect, or defective products) 
                <strong> within 48 hours of delivery</strong>. Please inspect your order upon receipt and contact us 
                immediately if you notice any problems.
              </p>
            </div>
          </section>

          {/* Refund Process */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Refund Process</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              To request a refund, please follow these steps:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
              <li>
                <strong>Contact us immediately:</strong> Reach out to us via email at 
                <a href="mailto:support@nhcservice.in" className="text-pink-600 hover:text-pink-700 hover:underline mx-1">
                  support@nhcservice.in
                </a>
                or phone within 48 hours of delivery. Include your order number and a description of the issue.
              </li>
              <li>
                <strong>Provide evidence:</strong> Send us photos or videos clearly showing the damage, defect, 
                or incorrect item. This helps us process your request faster.
              </li>
              <li>
                <strong>Return the product (if required):</strong> In some cases, we may ask you to return the 
                product. We will provide you with return instructions and cover the return shipping costs for 
                eligible refunds.
              </li>
              <li>
                <strong>Verification:</strong> Once we receive your request and verify the issue, we will process 
                your refund.
              </li>
              <li>
                <strong>Refund processing:</strong> Refunds will be processed to your original payment method 
                within 7 working days after verification.
              </li>
            </ol>
            <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded mt-4">
              <p className="text-gray-800 font-semibold mb-2">
                📧 Contact Information
              </p>
              <p className="text-gray-700 leading-relaxed">
                For refund requests, please include your order number, photos of the issue, and a brief description 
                in your email to ensure quick processing.
              </p>
            </div>
          </section>

          {/* Non-Refundable Cases */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Non-Refundable Cases</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Please note that refunds will <strong>not</strong> be provided in the following situations:
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Opened or consumed products:</strong> Products that have been opened, used, or consumed 
                  are not eligible for refunds due to health and safety reasons.</li>
                <li><strong>Change of mind:</strong> Refunds are not available simply because you changed your mind 
                  about the purchase after receiving the product.</li>
                <li><strong>Late reporting:</strong> Issues reported after 48 hours of delivery may not be eligible 
                  for refunds, as we cannot verify the condition of the product at the time of delivery.</li>
                <li><strong>Normal wear and tear:</strong> Minor cosmetic issues that do not affect the product's 
                  functionality or safety.</li>
                <li><strong>Improper storage:</strong> Products damaged due to improper storage or handling by the 
                  customer after delivery.</li>
                <li><strong>Allergic reactions:</strong> Refunds are not available for allergic reactions, as customers 
                  are responsible for checking ingredients before purchase.</li>
              </ul>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              We recommend carefully reviewing product descriptions, ingredients, and usage instructions before 
              making a purchase to ensure the product meets your needs.
            </p>
          </section>

          {/* Refund Timeline */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Refund Timeline</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Here's what you can expect regarding refund processing times:
            </p>
            <div className="space-y-3 mt-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-pink-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Request Submission</p>
                  <p className="text-sm text-gray-600">Within 48 hours of delivery</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-pink-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Verification & Processing</p>
                  <p className="text-sm text-gray-600">1-3 working days after request submission</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-pink-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Refund Credit</p>
                  <p className="text-sm text-gray-600">Within 7 working days to your original payment method</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
              <p className="text-gray-800 font-semibold mb-2">
                ⏱️ Processing Time
              </p>
              <p className="text-gray-700 leading-relaxed">
                Refunds will be processed to your <strong>original payment method</strong> within 
                <strong> 7 working days</strong> after we verify and approve your refund request. 
                The actual time for the refund to appear in your account may vary depending on your 
                bank or payment provider (typically 3-5 additional business days).
              </p>
            </div>
          </section>

          {/* WhatsApp Orders */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">WhatsApp Orders</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Orders placed via WhatsApp are covered by the same refund and cancellation policy. 
              Whether you order through our website or WhatsApp, you have the same rights and protections.
            </p>
            <p className="text-gray-700 leading-relaxed">
              To request a refund or cancellation for a WhatsApp order:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Contact us via WhatsApp with your order details</li>
              <li>Or email us at 
                <a href="mailto:support@nhcservice.in" className="text-pink-600 hover:text-pink-700 hover:underline mx-1">
                  support@nhcservice.in
                </a>
                with your order information
              </li>
              <li>Follow the same refund process and timeline as website orders</li>
            </ul>
          </section>

          {/* Contact for Support */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Contact for Support</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have any questions, concerns, or need assistance with cancellations or refunds, 
              our customer support team is here to help. Please don't hesitate to reach out to us:
            </p>
            
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 space-y-4 border border-pink-100">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Mail className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">Email</p>
                  <a href="mailto:support@nhcservice.in" className="text-pink-600 hover:text-pink-700 hover:underline">
                    support@nhcservice.in
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Phone className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">Phone</p>
                  <a href="tel:+917660922416" className="text-pink-600 hover:text-pink-700 hover:underline">
                    +917660922416
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mt-4">
              <p className="text-gray-800 font-semibold mb-2">
                💬 We're Here to Help
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our customer support team is available to assist you with any questions or concerns. 
                We aim to respond to all inquiries within 24-48 hours during business days.
              </p>
            </div>
          </section>

          {/* Additional Information */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify this Refund & Cancellation Policy at any time. 
              Any changes will be posted on this page with an updated "Last updated" date. 
              We encourage you to review this policy periodically to stay informed about our refund and cancellation procedures.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this policy or need clarification on any aspect of our refund 
              and cancellation process, please contact our support team using the information provided above.
            </p>
          </section>

          {/* Footer Note */}
          <div className="pt-6 border-t border-gray-200 mt-8">
            <p className="text-center text-sm text-gray-500 mb-4">
              Thank you for choosing NHC Service. We value your trust and are committed to ensuring your satisfaction.
            </p>
            <div className="text-center">
              <a 
                href="/" 
                className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium hover:underline"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundCancellationPolicy;

