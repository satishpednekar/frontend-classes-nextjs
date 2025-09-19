"use client";

export default function CookieSettingsButton() {
  const handleCookieSettings = () => {
    // This would trigger the cookie settings modal
    localStorage.removeItem("cookie-consent");
    window.location.reload();
  };

  return (
    <button 
      onClick={handleCookieSettings}
      className="text-gray-400 hover:text-white transition-colors"
    >
      Cookie Settings
    </button>
  );
}
