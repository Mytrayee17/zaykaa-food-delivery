import React from 'react';
import { MessageCircle, Phone, MapPin } from 'lucide-react';
const Footer: React.FC = () => {
  return <footer className="bg-primary text-primary-foreground py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Zaykaa</h3>
            <p className="text-primary-foreground/80">Authentic Indian flavors delivered fresh to your doorstep across Guntur , Andhra Pradesh</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 85001 57859</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <a href="https://wa.me/918500157859" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Guntur , Andhra Pradesh</span>
              </div>
              <div className="text-xs text-primary-foreground/70 mt-2">
                <strong>Services provided by Sarvagna Innovations</strong>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <a href="/" className="block hover:underline">Home</a>
              <a href="/menu" className="block hover:underline">Menu</a>
              <a href="https://wa.me/918500157859" target="_blank" rel="noopener noreferrer" className="block hover:underline">
                Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 Zaykaa. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;