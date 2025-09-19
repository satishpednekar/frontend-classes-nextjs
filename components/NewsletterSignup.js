"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessage("Thank you for subscribing!");
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-md">
      <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
      <p className="text-gray-400 mb-4">
        Get the latest frontend tutorials and insights delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button 
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-r-md transition-colors"
        >
          {isSubmitting ? "..." : "Subscribe"}
        </button>
      </form>
      {message && (
        <p className="mt-2 text-sm text-green-400">{message}</p>
      )}
    </div>
  );
}
