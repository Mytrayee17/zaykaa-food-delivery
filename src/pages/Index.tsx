import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import Footer from '@/components/Footer';
import zaykaaLogo from '../assets/zaykaa-logo.png';
const Index = () => {
  return <div className="min-h-screen bg-background">
      {/* Logo Top Left */}
      <div className="absolute left-0 top-0 p-6 z-20">
        <Link to="/">
          <img src={zaykaaLogo} alt="Zaykaa Logo" style={{ height: 48, width: 48 }} className="rounded-full bg-white p-2 drop-shadow-lg object-contain" />
        </Link>
      </div>
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">Zaykaa</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Authentic flavors delivered fresh to your doorstep
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/menu">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8">
                  Order Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="https://wa.me/918500157859" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-white hover:bg-white font-semibold text-lg px-8 text-orange-500">
                  Contact Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Orders will Delivery from evening 5:00 PM to 11:00 PM</h3>
              <p className="text-muted-foreground">
                Hot, fresh food delivered in Evening 30-45 minutes
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Food</h3>
              <p className="text-muted-foreground">
                Made with fresh ingredients and authentic spices
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Coverage</h3>
              <p className="text-muted-foreground">
                Serving across Guntur City in Andhra Pradesh with love
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Order?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover our delicious menu filled with authentic Indian flavors
          </p>
          <Link to="/menu">
            <Button size="lg" className="bg-gradient-primary hover:shadow-lg font-semibold text-lg px-8">
              View Our Menu
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;