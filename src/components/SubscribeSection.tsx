import React, { useState } from 'react';
import { MailOpen, CheckCircle } from 'lucide-react';

// Button Component
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl text-sm font-medium px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    />
  );
};

// Input Component
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-magazine-gold ${className}`}
      {...props}
    />
  );
};

const SubscribeSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      console.log('Subscription email:', email);
    }
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gray-900 text-white">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-yellow-500 opacity-10"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-yellow-500 opacity-10"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/20 mb-6">
            <MailOpen className="h-8 w-8 text-yellow-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-lg md:text-xl opacity-80 mb-8 max-w-xl mx-auto">
            Get the latest articles, exclusive interviews, and curated content delivered straight to your inbox.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center space-x-2 text-yellow-500">
              <CheckCircle className="h-5 w-5" />
              <span>Thank you for subscribing!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-grow bg-white/10 border-white/20 text-white placeholder:text-white/60"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button className="bg-yellow-500 hover:bg-yellow-500/90 text-white">
                Subscribe
              </Button>
            </form>
          )}

          <p className="text-sm opacity-60 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SubscribeSection;
