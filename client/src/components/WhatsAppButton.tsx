import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phoneNumber = "15025589643";
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20BA5A] transition-all hover:scale-110 active:scale-95"
      data-testid="button-whatsapp"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
