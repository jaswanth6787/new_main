import { Navbar } from "@/components/Navbar";
import { Shield, Lock, Eye, Users, FileText, Mail, MapPin, Building } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-pink-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Your privacy is important to us
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          
          {/* Introduction */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Welcome to <strong>NHC Service</strong>, a trusted women's health and wellness brand. 
              We are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using our services, you agree to the collection and use of information in accordance with this policy. 
              We respect your privacy and are dedicated to maintaining the confidentiality of your personal information.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              To provide you with the best service experience, we collect the following types of information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Personal Information:</strong> Name, phone number, and delivery address</li>
              <li><strong>Payment Information:</strong> Payment-related details processed securely through our payment gateway</li>
              <li><strong>Order Information:</strong> Details about your purchases, preferences, and transaction history</li>
              <li><strong>Communication Data:</strong> Messages and inquiries you send to us</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We collect this information <strong>only</strong> to process your orders, improve our services, 
              and provide you with a personalized experience. We do not collect any unnecessary information.
            </p>
          </section>

          {/* How We Use Information */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">How We Use Information</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>To process and fulfill your orders</li>
              <li>To communicate with you about your orders and provide customer support</li>
              <li>To improve our products and services based on your feedback</li>
              <li>To send you important updates about our services (only with your consent)</li>
              <li>To ensure the security and integrity of our platform</li>
            </ul>
            <div className="bg-pink-50 border-l-4 border-pink-500 p-4 mt-4 rounded">
              <p className="text-gray-800 font-semibold">
                🔒 Important: We do <strong>NOT</strong> sell, rent, or misuse your personal information. 
                Your data is used solely for the purposes stated above.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We take the security of your personal information seriously. We implement appropriate 
              technical and organizational measures to protect your data against unauthorized access, 
              alteration, disclosure, or destruction.
            </p>
            <p className="text-gray-700 leading-relaxed">
              While we strive to use commercially acceptable means to protect your personal information, 
              no method of transmission over the Internet or electronic storage is 100% secure. 
              However, we continuously work to improve our security practices to safeguard your data.
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Third-Party Services</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We use trusted third-party services to enhance your experience:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>
                <strong>Razorpay:</strong> We use Razorpay for secure payment processing. 
                Your payment information is handled directly by Razorpay and is subject to their privacy policy. 
                We do not store your complete payment card details on our servers.
              </li>
              <li>
                <strong>Delivery Partners:</strong> We share necessary delivery information (name, address, phone) 
                with our delivery partners to fulfill your orders.
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              These third-party services have their own privacy policies, and we encourage you to review them. 
              We are not responsible for the privacy practices of these external services.
            </p>
          </section>

          {/* User Consent */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">User Consent</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              By using our services, you consent to the collection and use of your information as described 
              in this Privacy Policy. You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate or incomplete information</li>
              <li>Request deletion of your personal information (subject to legal and operational requirements)</li>
              <li>Opt-out of marketing communications at any time</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              If you wish to exercise any of these rights, please contact us using the information provided below.
            </p>
          </section>

          {/* Updates to Policy */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Updates to Policy</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or 
              for other operational, legal, or regulatory reasons. We will notify you of any material changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We encourage you to review this Privacy Policy periodically to stay informed about how we 
              protect your information.
            </p>
          </section>

          {/* Compliance */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Compliance</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              NHC Service is committed to complying with Indian data protection practices and applicable laws. 
              We follow industry best practices to ensure the privacy and security of your personal information.
            </p>
          </section>

          {/* Contact Information */}
          <section className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
              please feel free to contact us:
            </p>
            
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 space-y-4 border border-pink-100">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Building className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">Business Name</p>
                  <p className="text-gray-700">NHC Service</p>
                </div>
              </div>
              
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
                  <MapPin className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">Location</p>
                  <p className="text-gray-700">Hyderabad, India</p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Note */}
          <div className="pt-6 border-t border-gray-200 mt-8">
            <p className="text-center text-sm text-gray-500">
              Thank you for trusting NHC Service with your health and wellness journey.
            </p>
            <div className="text-center mt-4">
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

export default PrivacyPolicy;

