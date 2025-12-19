import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import Logo from "@/components/Logo";
import { CheckCircle, Shield, RefreshCw } from "lucide-react";

export default function Landing() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header - Simple, just CTA */}
        <header className="flex items-center justify-between py-6 border-b border-gray-200">
          <div className="flex items-center">
            <Logo className="w-16 h-16 md:w-20 md:h-20" />
          </div>
          <Button onClick={() => navigate("/app")}>
            Calculate Free →
          </Button>
        </header>

        {/* Hero Section - Single CTA, clear value proposition */}
        <section className="py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            {/* Social Proof Badge */}
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4" />
              Trusted by 5,000+ Nigerians
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
              Know exactly what you owe — before the taxman does.
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-xl mx-auto">
              Accurate estimates using official 2026 FIRS tax bands. No signup. No card.
            </p>

            {/* Single Primary CTA */}
            <Button
              onClick={() => navigate("/app")}
              size="lg"
              className="px-8 py-6 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              Calculate My Tax
            </Button>
          </div>
        </section>

        {/* Feature Cards - Focus on accuracy, updates, privacy */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="mb-2 font-semibold text-gray-900">100% Accurate</div>
            <p className="text-gray-600 text-sm">Uses official FIRS tax bands and the latest 2026 reform calculations.</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <RefreshCw className="w-5 h-5 text-blue-600" />
            </div>
            <div className="mb-2 font-semibold text-gray-900">Always Updated</div>
            <p className="text-gray-600 text-sm">Automatically reflects the latest Nigerian tax laws and rates.</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div className="mb-2 font-semibold text-gray-900">100% Private</div>
            <p className="text-gray-600 text-sm">Your financial data never leaves your device. No tracking, ever.</p>
          </div>
        </section>

        <footer className="py-6 border-t border-gray-200 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Taxease. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
