'use client'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const loadingToast = toast.loading('Sending your message...')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('✅ Message sent successfully! Check your email for confirmation.', {
          id: loadingToast,
          duration: 5000,
        })

        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        })
      } else {
        throw new Error(data.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error(`❌ ${error.message || 'Failed to send message. Please try again.'}`, {
        id: loadingToast,
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-16 luxury-bg">
      {/* Toast Container */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#212529',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          success: {
            style: {
              background: '#03530aff',
              color: '#F8F9FA',
            },
            iconTheme: {
              primary: '#F8F9FA',
              secondary: '#A8E600',
            },
          },
          error: {
            style: {
              background: '#dc2626',
              color: '#F8F9FA',
            },
            iconTheme: {
              primary: '#F8F9FA',
              secondary: '#dc2626',
            },
          },
          loading: {
            style: {
              background: '#007BFF',
              color: '#F8F9FA',
            },
          },
        }}
      />

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 luxury-bg text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#36454F] leading-tight">
            Contact Us
          </h1>
          <div className="w-20 sm:w-24 h-1 bg-[#ffd700] mx-auto mb-6 sm:mb-8"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-[#212529] max-w-2xl mx-auto leading-relaxed">
            Get in touch with us for any inquiries or support
          </p>
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-8 luxury-bg pb-12 sm:pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
            
            {/* Contact Form */}
            <section className="w-full lg:max-w-2xl">
              <div className="luxury-bg rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-yellow-500/50">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-[#36454F] text-center">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-[#ffd700] font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                      Full Name *
                    </label>
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-[#212529]/20 rounded-lg focus:border-[#ffd700]/70 focus:outline-none focus:ring-2 focus:ring-[#ffd700]/30 text-white text-base sm:text-lg bg-gradient-to-br from-black/40 to-black/20 transition-all"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#ffd700] font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                      Email Address *
                    </label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-[#212529]/20 rounded-lg focus:border-[#ffd700]/70 focus:outline-none focus:ring-2 focus:ring-[#ffd700]/30 text-white text-base sm:text-lg bg-gradient-to-br from-black/40 to-black/20 transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#ffd700] font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                      Phone Number *
                    </label>
                    <input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-[#212529]/20 rounded-lg focus:border-[#ffd700]/70 focus:outline-none focus:ring-2 focus:ring-[#ffd700]/30 text-white text-base sm:text-lg bg-gradient-to-br from-black/40 to-black/20 transition-all"
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#ffd700] font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-[#212529]/20 rounded-lg focus:border-[#ffd700]/70 focus:outline-none focus:ring-2 focus:ring-[#ffd700]/30 h-28 sm:h-32 text-white text-base sm:text-lg bg-gradient-to-br from-black/40 to-black/20 transition-all resize-vertical"
                      placeholder="Tell us about your event..."
                      required
                    />
                  </div>

                  <div className="flex justify-center pt-2">
                    <button       
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto max-w-sm px-8 sm:px-10 py-3.5 sm:py-4 font-bold rounded-xl transition-all text-[#ffd700] shadow-lg transform hover:scale-[1.02] focus:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-[#ffd700]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none bg-gradient-to-r from-[#04520c] to-[#03530a] hover:from-[#03530a] hover:to-[#04520c]"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin -ml-1 h-5 w-5 text-[#ffd700]" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-sm sm:text-base">Sending...</span>
                        </span>
                      ) : (
                        <span className="text-sm sm:text-base">Send Message</span>
                      )}
                    </button>
                  </div>
                </form>

                {/* Quick Action Buttons */}
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        message: ''
                      })
                      toast('📋 Form cleared!', { duration: 2000 })
                    }}
                    className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 font-semibold rounded-lg border-2 border-[#ffd700]/60 text-[#ffd700] hover:bg-[#ffd700]/10 hover:border-[#ffd700] transition-all bg-black/20 backdrop-blur-sm"
                  >
                    Clear Form
                  </button>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <aside className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="text-center lg:text-left mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#36454F]">
                  Get in Touch
                </h2>
                <p className="text-[#212529] text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Have questions? We're here to help! Reach out through any channel below.
                </p>
              </div>

              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                {/* Location */}
                <div className="flex flex-col sm:flex-row items-start bg-gradient-to-br from-black/30 to-black/10 p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-all border-l-4 border-[#ffd700]/70 backdrop-blur-sm">
                  <div className="bg-[#ffd700]/20 p-2 sm:p-3 rounded-lg mb-3 sm:mb-0 sm:mr-4 flex-shrink-0">
                    <svg className="w-5 sm:w-6 h-5 sm:h-6 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 sm:mb-2 text-[#212529] text-sm sm:text-base">Location</h3>
                    <p className="text-[#212529] text-base sm:text-lg opacity-90 leading-relaxed">
                      Srinagar 1st Line, Guntur,<br className="hidden sm:block" />
                      Andhra Pradesh, India
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col sm:flex-row items-start bg-gradient-to-br from-black/30 to-black/10 p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-all border-l-4 border-[#04520c]/80 backdrop-blur-sm">
                  <div className="bg-[#04520c]/20 p-2 sm:p-3 rounded-lg mb-3 sm:mb-0 sm:mr-4 flex-shrink-0">
                    <svg className="w-5 sm:w-6 h-5 sm:h-6 text-[#04520c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 sm:mb-2 text-[#212529] text-sm sm:text-base">Phone</h3>
                    <a
                      href="tel:+918341700901"
                      onClick={() => toast('📞 Opening phone dialer...', { duration: 2000 })}
                      className="text-[#04520c] hover:text-[#ffd700] text-base sm:text-lg font-semibold hover:underline transition-colors block"
                    >
                      +91 83417 00901
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col sm:flex-row items-start bg-gradient-to-br from-black/30 to-black/10 p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-all border-l-4 border-[#ffd700]/70 backdrop-blur-sm">
                  <div className="bg-[#ffd700]/20 p-2 sm:p-3 rounded-lg mb-3 sm:mb-0 sm:mr-4 flex-shrink-0">
                    <svg className="w-5 sm:w-6 h-5 sm:h-6 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 sm:mb-2 text-[#212529] text-sm sm:text-base">Email</h3>
                    <a
                      href="mailto:srivenkateswarakolatasamithi@gmail.com"
                      onClick={() => toast('📧 Opening email client...', { duration: 2000 })}
                      className="text-[#ffd700] hover:text-[#04520c] text-base sm:text-lg font-semibold hover:underline transition-colors block break-all"
                    >
                      srivenkateswarakolatasamithi@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
