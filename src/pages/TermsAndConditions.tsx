import { Navbar } from "@/components/Navbar";
import { FileCheck, AlertCircle, ShoppingCart, DollarSign, UserCheck, Shield, Scale, CheckCircle } from "lucide-react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
            <FileCheck className="w-8 h-8 text-pink-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-600">
            Please read these terms carefully before using our services
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          
          {/* Acceptance of Terms */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Welcome to <strong>NHC Service</strong>. By accessing and using this website, you accept and agree to be bound by 
              the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              These Terms & Conditions apply to all visitors, users, and others who access or use our services. 
              We reserve the right to update, change, or replace any part of these Terms & Conditions at any time 
              without prior notice.
            </p>
          </section>

          {/* Product Information Disclaimer */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Product Information Disclaimer</h2>
            </div>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-4">
              <p className="text-gray-800 font-semibold mb-2">
                ⚠️ Important Health Disclaimer
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our products are designed for <strong>general wellness support</strong> and are not intended to diagnose, 
                treat, cure, or prevent any disease or medical condition. They are not a substitute for professional 
                medical advice, diagnosis, or treatment.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              The information provided on this website and product labels is for educational purposes only. 
              Individual results may vary, and we do not guarantee specific health outcomes.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Please consult with a qualified healthcare professional</strong> before starting any new wellness 
              regimen, especially if you:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Have existing medical conditions or are taking prescription medications</li>
              <li>Are pregnant, nursing, or planning to become pregnant</li>
              <li>Have allergies or sensitivities to any ingredients</li>
              <li>Are under 18 years of age</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              If you experience any adverse reactions or have concerns about our products, discontinue use immediately 
              and consult with a healthcare professional.
            </p>
          </section>

          {/* Orders & Payments */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Orders & Payments</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              When you place an order through our website, you are making an offer to purchase products subject to 
              our acceptance. All orders are subject to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Product availability:</strong> We reserve the right to refuse or cancel any order if products 
                are unavailable or if there are errors in pricing or product information.</li>
              <li><strong>Order confirmation:</strong> Your order is confirmed only after we send you an order confirmation 
                email. We may cancel orders that appear fraudulent or placed with incorrect information.</li>
              <li><strong>Payment processing:</strong> We use secure payment gateways (Razorpay) to process your payments. 
                All payment information is encrypted and secure.</li>
              <li><strong>Order modifications:</strong> Once an order is confirmed, modifications may not always be possible. 
                Please contact us immediately if you need to make changes.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We strive to process and ship orders promptly. However, delivery times may vary based on your location 
              and product availability. We will keep you informed about your order status via email or phone.
            </p>
          </section>

          {/* Pricing */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Pricing</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              All prices displayed on our website are in Indian Rupees (₹) and are subject to change without prior notice. 
              The price you pay is the price displayed at the time of order confirmation.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Modify prices at any time</li>
              <li>Correct pricing errors, even after an order has been placed</li>
              <li>Offer promotional discounts or special pricing that may be limited in duration</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              If a pricing error is discovered after your order is confirmed, we will notify you and provide options to 
              proceed with the corrected price or cancel your order.
            </p>
          </section>

          {/* User Responsibilities */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">User Responsibilities</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              As a user of our services, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide accurate, current, and complete information when placing orders</li>
              <li>Maintain the security of your account information and password (if applicable)</li>
              <li>Use our products responsibly and in accordance with product instructions</li>
              <li>Consult with healthcare professionals when necessary before using our products</li>
              <li>Notify us immediately of any unauthorized use of your account or any other breach of security</li>
              <li>Not use our products for any illegal or unauthorized purpose</li>
              <li>Not attempt to gain unauthorized access to any part of our website or systems</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              You are responsible for maintaining the confidentiality of your account information and for all activities 
              that occur under your account.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Limitation of Liability</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              To the fullest extent permitted by law, NHC Service shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly 
              or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Your use or inability to use our products or services</li>
              <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
              <li>Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content</li>
              <li>Any interruption or cessation of transmission to or from our website</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Our total liability to you for all claims arising from or related to the use of our products or services 
              shall not exceed the amount you paid to us in the twelve (12) months prior to the action giving rise to liability.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of the above 
              limitations may not apply to you.
            </p>
          </section>

          {/* Governing Law */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Governing Law</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              These Terms & Conditions shall be governed by and construed in accordance with the laws of India, 
              without regard to its conflict of law provisions.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Any disputes arising out of or relating to these Terms & Conditions or our products and services 
              shall be subject to the exclusive jurisdiction of the courts located in Hyderabad, India.
            </p>
            <p className="text-gray-700 leading-relaxed">
              NHC Service operates under Indian laws and regulations. We comply with all applicable local, state, 
              and national laws governing the sale and distribution of wellness products in India.
            </p>
          </section>

          {/* Additional Terms */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <FileCheck className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Additional Terms</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Modify or discontinue any aspect of our website or services at any time</li>
              <li>Refuse service to anyone for any reason at any time</li>
              <li>Update these Terms & Conditions at any time, with changes taking effect immediately upon posting</li>
              <li>Limit the quantities of products available for purchase</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              If any provision of these Terms & Conditions is found to be unenforceable or invalid, that provision 
              shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain 
              in full force and effect.
            </p>
          </section>

          {/* Contact Information */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <FileCheck className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Questions About Terms</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms & Conditions, please contact us at:
            </p>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-100">
              <p className="font-semibold text-gray-900 mb-2">Email:</p>
              <a href="mailto:support@nhcservice.in" className="text-pink-600 hover:text-pink-700 hover:underline">
                support@nhcservice.in
              </a>
            </div>
          </section>

          {/* Agreement Statement */}
          <div className="pt-6 border-t-2 border-pink-200 mt-8">
            <div className="bg-pink-50 rounded-xl p-6 border border-pink-100">
              <p className="text-center text-lg font-semibold text-gray-900">
                By using this website, you agree to these Terms & Conditions.
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-6 border-t border-gray-200 mt-8">
            <p className="text-center text-sm text-gray-500 mb-4">
              Thank you for choosing NHC Service for your wellness journey.
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

export default TermsAndConditions;

