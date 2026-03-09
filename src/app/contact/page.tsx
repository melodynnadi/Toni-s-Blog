'use client';

import { useState } from 'react';
import { FiMail, FiSend, FiInstagram, FiTwitter } from 'react-icons/fi';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1
          className="text-3xl font-bold gradient-pink-text mb-3"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Get in Touch
        </h1>
        <p className="text-sm text-text-light" style={{ fontFamily: 'var(--font-serif)' }}>
          Have a question, suggestion, or just want to say hi? I&apos;d love to hear from you.
        </p>
      </div>

      <hr className="section-divider" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          {[
            { icon: FiMail, label: 'Email', value: 'hello@tonisblog.com' },
            { icon: FiInstagram, label: 'Instagram', value: '@tonisblog' },
            { icon: FiTwitter, label: 'Twitter', value: '@tonisblog' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center gap-2 mb-1">
                <item.icon size={14} className="text-text-light" />
                <h3 className="text-[11px] tracking-[0.1em] uppercase text-text font-medium">{item.label}</h3>
              </div>
              <p className="text-sm text-text-light">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] tracking-[0.1em] uppercase text-text-light mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                placeholder="Your name"
                className="w-full px-4 py-3 border border-pink-soft text-sm focus:outline-none focus:border-pink-accent transition-colors bg-white rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.1em] uppercase text-text-light mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={200}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-pink-soft text-sm focus:outline-none focus:border-pink-accent transition-colors bg-white rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.1em] uppercase text-text-light mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                maxLength={5000}
                rows={5}
                placeholder="What's on your mind?"
                className="w-full px-4 py-3 border border-pink-soft text-sm focus:outline-none focus:border-pink-accent transition-colors bg-white resize-none rounded-lg"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="px-6 py-3 gradient-pink-btn text-[11px] tracking-[0.15em] uppercase rounded-full flex items-center gap-2"
              >
                <FiSend size={12} />
                Send Message
              </button>
              {submitted && (
                <span className="text-sm text-green-600 animate-[fadeIn_0.3s_ease-out]">
                  Message sent! I&apos;ll get back to you soon.
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
