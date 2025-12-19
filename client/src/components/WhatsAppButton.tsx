import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function WhatsAppButton() {
  const phoneNumber = "2348073562745";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hi!%20I%20have%20a%20question%20about%20TaxEase.`;
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
      {showTooltip && (
        <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap animate-fade-out">
          Questions? Chat with us on WhatsApp
        </div>
      )}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20BA5A] transition-all hover:scale-110 active:scale-95"
        data-testid="button-whatsapp"
        aria-label="Contact us on WhatsApp for questions"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}
