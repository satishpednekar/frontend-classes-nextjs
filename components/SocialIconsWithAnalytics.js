"use client";

import { useState } from 'react';

const SocialIconsWithAnalytics = ({ 
  className = "",
  variant = "header", // "header", "footer", "minimal"
  showLabels = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Social media platforms configuration
  const socialPlatforms = {
    twitter: {
      name: 'X (Twitter)',
      url: 'https://x.com/Frontendpedia',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: 'hover:text-blue-400'
    },
    linkedin: {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/frontendpedia',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      color: 'hover:text-blue-600'
    },
    medium: {
      name: 'Medium',
      url: 'https://medium.com/@codevelopersolutions',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 32 32">
          <path d="M4,4V28H28V4ZM23.9385,9.6865,22.6514,10.92a.3766.3766,0,0,0-.1431.3613v9.0674a.3765.3765,0,0,0,.1431.3613l1.257,1.2339v.271h-6.323v-.271L18.8877,20.68c.1279-.128.1279-.1656.1279-.3609V12.99l-3.62,9.1958H14.906L10.6907,12.99v6.1631a.8505.8505,0,0,0,.2334.7071l1.6936,2.0547v.2709H7.8154v-.2709L9.509,19.86a.82.82,0,0,0,.2183-.7071V12.0264A.6231.6231,0,0,0,9.5239,11.5L8.0186,9.6865v-.271h4.6743l3.613,7.9239,3.1765-7.9239h4.4561Z"/>
        </svg>
      ),
      color: 'hover:text-gray-600'
    }
  };

  // Track social media click
  const trackSocialClick = async (platform, action = 'click') => {
    try {
      const analyticsData = {
        platform,
        action,
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        screenResolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        // Hardware info (without permissions)
        deviceMemory: navigator.deviceMemory || 'unknown',
        hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
        connectionType: navigator.connection?.effectiveType || 'unknown',
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack || 'unknown',
        // Social media specific data
        socialUrl: socialPlatforms[platform]?.url,
        clickSource: 'header_icons'
      };

      await fetch('/api/analytics/social-share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analyticsData)
      });
    } catch (error) {
      console.error('Failed to track social click:', error);
    }
  };

  // Handle social media click
  const handleSocialClick = async (platform, url) => {
    setIsLoading(true);
    
    try {
      // Track the click
      await trackSocialClick(platform, 'click');
      
      // Open the social media URL
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Social click failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render different variants
  const renderIcon = (platform, config) => {
    const baseClasses = variant === 'footer' 
      ? "text-gray-400 hover:text-white transition-colors"
      : "text-gray-600 hover:text-blue-500 dark:text-gray-400 transition-colors duration-200";
    
    const iconSize = variant === 'footer' ? "h-5 w-5" : "w-5 h-5";
    const iconSizeMobile = variant === 'footer' ? "h-6 w-6" : "w-6 h-6";

    if (variant === 'minimal') {
      return (
        <button
          key={platform}
          onClick={() => handleSocialClick(platform, config.url)}
          disabled={isLoading}
          className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 ${baseClasses} ${config.color} disabled:opacity-50`}
          aria-label={`Follow us on ${config.name}`}
        >
          {config.icon}
        </button>
      );
    }

    if (variant === 'footer') {
      return (
        <a
          key={platform}
          href={config.url}
          onClick={() => handleSocialClick(platform, config.url)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${baseClasses} ${config.color} disabled:opacity-50`}
          aria-label={`Follow us on ${config.name}`}
        >
          <svg className={iconSize} fill="currentColor" viewBox="0 0 24 24">
            {config.icon.props.children}
          </svg>
        </a>
      );
    }

    // Header variant (default)
    return (
      <a
        key={platform}
        href={config.url}
        onClick={() => handleSocialClick(platform, config.url)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${config.color} disabled:opacity-50`}
        aria-label={`Follow us on ${config.name}`}
      >
        <svg className={`${iconSize} md:${iconSize}`} fill="currentColor" viewBox="0 0 24 24">
          {config.icon.props.children}
        </svg>
        {showLabels && (
          <span className="ml-1 text-sm font-medium hidden sm:inline">
            {config.name}
          </span>
        )}
      </a>
    );
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {Object.entries(socialPlatforms).map(([platform, config]) => 
        renderIcon(platform, config)
      )}
    </div>
  );
};

export default SocialIconsWithAnalytics;
