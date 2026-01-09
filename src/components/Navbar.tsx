

import logo from "@/assets/logo-nhc.jpg";
import { User } from "lucide-react";

export function Navbar() {
    return (
        <nav className="w-full bg-transparent absolute top-0 z-50">
            <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <a href="/">
                        <img
                            src={logo}
                            alt="NHC Natural Health Care Services"
                            className="h-16 w-16 md:h-24 md:w-24 object-contain rounded-full"
                        />
                    </a>
                </div>
                <div>
                    <a href="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors" aria-label="Customer Profile">
                        <div className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all border border-pink-100">
                            <User className="h-6 w-6 text-pink-500" />
                        </div>
                    </a>
                </div>
            </div>
        </nav>
    );
}
