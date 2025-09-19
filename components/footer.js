"use client";

import Link from "next/link";
import Image from "next/image";
import NewsletterSignup from "./NewsletterSignup";
import CookieSettingsButton from "./CookieSettingsButton";
import { 
  EnvelopeIcon, 
  MapPinIcon, 
  PhoneIcon,
  CodeBracketIcon,
  BookOpenIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  HeartIcon
} from "@heroicons/react/24/outline";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="mr-3 flex-shrink-0">
                <Image
                  src="/img/logo-white.svg"
                  alt="Frontendpedia Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12"
                  priority
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Frontendpedia
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Master frontend engineering, design & architecture with expert insights, 
              tutorials & guides that transform learning into real impact.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com/frontendpedia" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a 
                href="https://linkedin.com/company/frontendpedia" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BookOpenIcon className="h-5 w-5 mr-2" />
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/archive" className="text-gray-400 hover:text-white transition-colors">
                  Archive
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-400 hover:text-white transition-colors">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CodeBracketIcon className="h-5 w-5 mr-2" />
              Learn
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/react" className="text-gray-400 hover:text-white transition-colors">
                  React
                </Link>
              </li>
              <li>
                <Link href="/category/nextjs" className="text-gray-400 hover:text-white transition-colors">
                  Next.js
                </Link>
              </li>
              <li>
                <Link href="/category/javascript" className="text-gray-400 hover:text-white transition-colors">
                  JavaScript
                </Link>
              </li>
              <li>
                <Link href="/category/css" className="text-gray-400 hover:text-white transition-colors">
                  CSS
                </Link>
              </li>
              <li>
                <Link href="/category/web-development" className="text-gray-400 hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Report Issue
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <NewsletterSignup />
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-gray-400 text-sm mb-4 md:mb-0">
              <span>© {currentYear} Frontendpedia. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <CookieSettingsButton />
            </div>
      </div>
          
          {/* Advertising Compliance Notice */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center">
              This site uses third-party advertising services. By using this site, you agree to our use of cookies for advertising purposes. 
              <a href="https://www.google.com/settings/ads" className="text-blue-400 hover:text-blue-300 ml-1" target="_blank" rel="noopener noreferrer">
                Opt out of personalized ads
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}