"use client";

import Link from "next/link";
import Image from "next/image";
import NewsletterSignup from "./NewsletterSignup";
import CookieSettingsButton from "./CookieSettingsButton";
import SocialIconsWithAnalytics from "./SocialIconsWithAnalytics";
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
            <SocialIconsWithAnalytics 
              variant="footer"
              className="space-x-4"
            />
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