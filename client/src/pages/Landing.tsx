import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import Logo from "@/components/Logo";

export default function Landing() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <header className="flex items-center justify-between py-6 border-b border-gray-200">
          <div className="flex items-center">
            <Logo className="w-16 h-16 md:w-20 md:h-20" />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate("/account")}>Account</Button>
            <Button onClick={() => navigate("/app")}>Open Calculator</Button>
          </div>
        </header>

        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Know your tax before the taxman does.
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-8">
              Estimate your Nigerian tax obligations based on the 2026 reforms—fast and accurate.
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => navigate("/app")} className="px-6 py-6 h-12 text-base">
                Calculate My Tax
              </Button>
              <Button variant="outline" onClick={() => navigate("/account")} className="px-6 py-6 h-12 text-base">
                Create Account
              </Button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
            <div className="mb-3 font-semibold text-gray-900">Instant Calculations</div>
            <p className="text-gray-600">Accurate tax estimates in seconds.</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
            <div className="mb-3 font-semibold text-gray-900">Reform Ready</div>
            <p className="text-gray-600">Uses 2026 Tax reform (effective Jan 1, 2026).</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
            <div className="mb-3 font-semibold text-gray-900">Save Results</div>
            <p className="text-gray-600">Create an account and save securely.</p>
          </div>
        </section>

        <footer className="py-6 border-t border-gray-200 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Taxease. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

