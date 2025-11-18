import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function WhatsAppButton() {
  const phoneNumber = "15025589643";
  const whatsappUrl = `https://wa.me/${phoneNumber}`;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
      {isHovered && (
        <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
          Questions? Chat with us on WhatsApp
        </div>
      )}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20BA5A] transition-all hover:scale-110 active:scale-95"
        data-testid="button-whatsapp"
        aria-label="Contact us on WhatsApp for questions"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}
