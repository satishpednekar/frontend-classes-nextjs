"use client";

import { useState, useEffect } from 'react';
import { 
  ShareIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const SocialShareButtons = ({ 
  url, 
  title, 
  description, 
  className = "",
  showCounts = true,
  variant = "default" // "default", "minimal", "compact"
}) => {
  const [shareCounts, setShareCounts] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Get current page URL if not provided
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const currentTitle = title || (typeof document !== 'undefined' ? document.title : '');
  const currentDescription = description || '';

  // Encode URL and text for sharing
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(currentTitle);
  const encodedDescription = encodeURIComponent(currentDescription);

  // Social media share URLs
  const socialPlatforms = {
    twitter: {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: 'hover:text-blue-400'
    },
    linkedin: {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      color: 'hover:text-blue-600'
    },
    reddit: {
      name: 'Reddit',
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.175c0 .1.008.199.024.295.036.375.11.719.28 1.006.17.288.42.515.726.663.306.148.662.223 1.068.223.406 0 .762-.075 1.068-.223.306-.148.556-.375.726-.663.17-.287.244-.631.28-1.006.016-.096.024-.195.024-.295a3.111 3.111 0 0 1 .042-.175c.575-.281 1.01-.898 1.01-1.614 0-.968-.786-1.754-1.754-1.754-.477 0-.899.182-1.207.491-1.194-.856-2.85-1.418-4.674-1.488l.8-3.747 2.597.547c0-.688.562-1.249 1.25-1.249zm-9.25 1.25c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.175c0 .1.008.199.024.295.036.375.11.719.28 1.006.17.288.42.515.726.663.306.148.662.223 1.068.223.406 0 .762-.075 1.068-.223.306-.148.556-.375.726-.663.17-.287.244-.631.28-1.006.016-.096.024-.195.024-.295a3.111 3.111 0 0 1 .042-.175c.575-.281 1.01-.898 1.01-1.614 0-.968-.786-1.754-1.754-1.754-.477 0-.899.182-1.207.491-1.194-.856-2.85-1.418-4.674-1.488l.8-3.747 2.597.547c0-.688.562-1.249 1.25-1.249z"/>
        </svg>
      ),
      color: 'hover:text-orange-500'
    },
    email: {
      name: 'Email',
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${currentUrl}`,
      icon: <EnvelopeIcon className="w-5 h-5" />,
      color: 'hover:text-gray-600'
    },
    copy: {
      name: 'Copy Link',
      url: '#',
      icon: <ShareIcon className="w-5 h-5" />,
      color: 'hover:text-gray-600',
      isCopy: true
    }
  };

  // Track social share click
  const trackShareClick = async (platform, action = 'share') => {
    try {
      const analyticsData = {
        platform,
        action,
        url: currentUrl,
        title: currentTitle,
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
        doNotTrack: navigator.doNotTrack || 'unknown'
      };

      await fetch('/api/analytics/social-share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analyticsData)
      });
    } catch (error) {
      console.error('Failed to track social share:', error);
    }
  };

  // Handle share button click
  const handleShareClick = async (platform, shareUrl, isCopy = false) => {
    setIsLoading(true);
    
    try {
      if (isCopy) {
        // Copy to clipboard
        await navigator.clipboard.writeText(currentUrl);
        // Show temporary feedback
        const button = document.querySelector(`[data-platform="${platform}"]`);
        if (button) {
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          setTimeout(() => {
            button.textContent = originalText;
          }, 2000);
        }
      } else {
        // Open share URL
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
      
      // Track the click
      await trackShareClick(platform, isCopy ? 'copy' : 'share');
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load share counts on component mount
  useEffect(() => {
    const loadShareCounts = async () => {
      try {
        const response = await fetch(`/api/analytics/share-counts?url=${encodeURIComponent(currentUrl)}`);
        if (response.ok) {
          const counts = await response.json();
          setShareCounts(counts);
        }
      } catch (error) {
        console.error('Failed to load share counts:', error);
      }
    };

    if (showCounts) {
      loadShareCounts();
    }
  }, [currentUrl, showCounts]);

  // Render different variants
  const renderButton = (platform, config) => {
    const count = shareCounts[platform] || 0;
    
    if (variant === 'minimal') {
      return (
        <button
          key={platform}
          onClick={() => handleShareClick(platform, config.url, config.isCopy)}
          disabled={isLoading}
          className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors duration-200 ${config.color} disabled:opacity-50`}
          aria-label={`Share on ${config.name}`}
          data-platform={platform}
        >
          {config.icon}
        </button>
      );
    }

    if (variant === 'compact') {
      return (
        <button
          key={platform}
          onClick={() => handleShareClick(platform, config.url, config.isCopy)}
          disabled={isLoading}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors duration-200 ${config.color} disabled:opacity-50`}
          aria-label={`Share on ${config.name}`}
          data-platform={platform}
        >
          {config.icon}
          <span className="text-sm font-medium">{config.name}</span>
          {showCounts && count > 0 && (
            <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
              {count}
            </span>
          )}
        </button>
      );
    }

    // Default variant
    return (
      <button
        key={platform}
        onClick={() => handleShareClick(platform, config.url, config.isCopy)}
        disabled={isLoading}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors duration-200 ${config.color} disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700`}
        aria-label={`Share on ${config.name}`}
        data-platform={platform}
      >
        {config.icon}
        <span className="text-sm font-medium">{config.name}</span>
        {showCounts && count > 0 && (
          <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
            {count}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {Object.entries(socialPlatforms).map(([platform, config]) => 
        renderButton(platform, config)
      )}
    </div>
  );
};

export default SocialShareButtons;
