import React, { useState } from 'react';
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaPaperPlane, FaCheck } from 'react-icons/fa';

const Contact = () => {
  // Form state management
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ visible: false, title: "", description: "" });

  // Form validation function
  const validateForm = () => {
    const errors = {
      name: "",
      email: "",
      subject: "",
      message: ""
    };
    let isValid = true;

    if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (formData.subject.length < 5) {
      errors.subject = "Subject must be at least 5 characters";
      isValid = false;
    }

    if (formData.message.length < 10) {
      errors.message = "Message must be at least 10 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // In a real app, you would send this data to your backend
      console.log(formData);
      
      // Simulate API call
      setTimeout(() => {
        // Show success toast
        setToast({
          visible: true,
          title: "Message sent!",
          description: "We'll get back to you as soon as possible."
        });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
        
        setIsSubmitting(false);
        
        // Hide toast after 5 seconds
        setTimeout(() => {
          setToast({ visible: false, title: "", description: "" });
        }, 5000);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-magazine-navy/10 to-transparent opacity-70 z-0"></div>
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center z-10 relative">
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Get in Touch
              </h1>
              <p className="text-lg md:text-xl mb-8 text-magazine-charcoal/80 max-w-2xl">
                Have a question about your subscription? Want to share a story idea? 
                Or just want to say hello? We'd love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              {/* Contact Form */}
              <div className="animate-on-scroll">
                <div className="border-none shadow-lg bg-white rounded-lg p-6">
                  <h2 className="font-playfair text-2xl font-bold mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        <input 
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-magazine-gold/50"
                        />
                        {formErrors.name && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <input 
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Your email address"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-magazine-gold/50"
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                      <input 
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="What is this regarding?"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-magazine-gold/50"
                      />
                      {formErrors.subject && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.subject}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">Message</label>
                      <textarea 
                        id="message"
                        name="message"
                        placeholder="Tell us what's on your mind..."
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-magazine-gold/50 min-h-[150px] resize-none"
                      />
                      {formErrors.message && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>
                      )}
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="magazine-button w-full flex items-center justify-center py-2 px-4 rounded-md bg-magazine-gold text-white hover:bg-magazine-gold/90 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <FaPaperPlane className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6 animate-on-scroll">
                <h2 className="font-playfair text-2xl font-bold mb-8">Contact Information</h2>
                
                <div className="space-y-8">
                  <div className="overflow-hidden border-none shadow-md bg-gradient-to-br from-magazine-beige to-magazine-cream rounded-lg">
                    <div className="p-6 flex items-start space-x-4">
                      <div className="bg-magazine-gold p-3 rounded-full text-white">
                        <FaMapMarkerAlt className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2 font-playfair">Visit Us</h3>
                        <p className="text-magazine-charcoal/70">
                          PAGES Headquarters<br />
                          123 Magazine Street<br />
                          New York, NY 10001
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden border-none shadow-md bg-gradient-to-br from-magazine-beige to-magazine-cream rounded-lg">
                    <div className="p-6 flex items-start space-x-4">
                      <div className="bg-magazine-gold p-3 rounded-full text-white">
                        <FaEnvelope className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2 font-playfair">Email Us</h3>
                        <p className="text-magazine-charcoal/70">
                          General Inquiries: <br />
                          <a href="mailto:info@pagesmagazine.com" className="hover:text-magazine-gold transition-colors">
                            info@pagesmagazine.com
                          </a>
                        </p>
                        <p className="text-magazine-charcoal/70 mt-2">
                          Subscriptions: <br />
                          <a href="mailto:subscribe@pagesmagazine.com" className="hover:text-magazine-gold transition-colors">
                            subscribe@pagesmagazine.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden border-none shadow-md bg-gradient-to-br from-magazine-beige to-magazine-cream rounded-lg">
                    <div className="p-6 flex items-start space-x-4">
                      <div className="bg-magazine-gold p-3 rounded-full text-white">
                        <FaPhone className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2 font-playfair">Call Us</h3>
                        <p className="text-magazine-charcoal/70">
                          Customer Service: <br />
                          <a href="tel:+1234567890" className="hover:text-magazine-gold transition-colors">
                            (123) 456-7890
                          </a>
                        </p>
                        <p className="text-magazine-charcoal/70 mt-2">
                          Editorial Office: <br />
                          <a href="tel:+1234567899" className="hover:text-magazine-gold transition-colors">
                            (123) 456-7899
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative p-6 rounded-lg border border-magazine-gold/30 mt-8">
                  <div className="absolute -top-3 left-4 bg-magazine-cream px-2">
                    <span className="text-magazine-gold font-medium">Working Hours</span>
                  </div>
                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-magazine-gold/10">
                    <span className="font-medium">Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 md:py-16 bg-magazine-beige/50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="font-playfair text-2xl font-bold mb-8 text-center">Find Us</h2>
            <div className="aspect-video w-full max-w-5xl mx-auto rounded-lg overflow-hidden shadow-lg">
              <iframe 
                className="w-full h-full border-0"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3491.1882178150277!2d77.10134887551257!3d28.95214137549178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390daddf6cade053%3A0xfd7ceeb61e0dbbe1!2sIIT%20Delhi%20Sonipat%20Campus!5e0!3m2!1sen!2sin!4v1744386848955!5m2!1sen!2sin" 
                allowFullScreen
                loading="lazy"
                title="PAGES Magazine Office Location"
                aria-hidden="false"
                tabIndex={0}
              ></iframe>
            </div>
          </div>
        </section>

        {/* FAQ Section - Common questions */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="font-playfair text-2xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="flex items-center text-lg font-medium mb-3 font-playfair">
                  <FaCheck className="h-5 w-5 text-magazine-gold mr-2" />
                  How do I cancel my subscription?
                </h3>
                <p className="text-magazine-charcoal/70">
                  You can cancel your subscription anytime by logging into your account or by contacting our customer service team via email or phone.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="flex items-center text-lg font-medium mb-3 font-playfair">
                  <FaCheck className="h-5 w-5 text-magazine-gold mr-2" />
                  When will I receive my first issue?
                </h3>
                <p className="text-magazine-charcoal/70">
                  New subscribers typically receive their first issue within 4-6 weeks after subscribing, depending on the publishing schedule.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="flex items-center text-lg font-medium mb-3 font-playfair">
                  <FaCheck className="h-5 w-5 text-magazine-gold mr-2" />
                  How can I submit an article?
                </h3>
                <p className="text-magazine-charcoal/70">
                  We welcome submissions! Please send a brief pitch to our editorial team at submissions@pagesmagazine.com with your idea and writing samples.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="flex items-center text-lg font-medium mb-3 font-playfair">
                  <FaCheck className="h-5 w-5 text-magazine-gold mr-2" />
                  Do you offer digital subscriptions?
                </h3>
                <p className="text-magazine-charcoal/70">
                  Yes! We offer both print and digital subscriptions. Digital subscribers get immediate access to our current issue and archive.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md z-50 flex items-start">
          <div className="bg-green-500 rounded-full p-1 mr-3 mt-1">
            <FaCheck className="h-4 w-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{toast.title}</h4>
            <p className="text-sm text-gray-600">{toast.description}</p>
          </div>
          <button 
            onClick={() => setToast({ visible: false, title: "", description: "" })}
            className="ml-auto text-gray-400 hover:text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Contact;