import Container from "@/components/container";

export const metadata = {
  title: "Privacy Policy - Frontendpedia",
  description: "Privacy Policy for Frontendpedia - Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicy() {
  return (
    <Container>
      <div className="mx-auto max-w-4xl py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Privacy Policy
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Information We Collect
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              subscribe to our newsletter, or contact us. This may include your name, email address, 
              and any other information you choose to provide.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              We also automatically collect certain information about your device and usage patterns 
              when you visit our website, including your IP address, browser type, operating system, 
              and pages you visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              How We Use Your Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Send you technical notifications and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns to improve our content</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Google Advertising and Cookies
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</strong>
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</strong>
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Ads Settings</a>. 
              Alternatively, you can direct users to opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">www.aboutads.info</a>.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We also work with other third-party vendors and ad networks that may serve ads on our site. 
              These vendors may use cookies and similar technologies to collect information about your visits 
              to this and other websites in order to provide advertisements about goods and services of interest to you.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              You may visit the websites of these vendors to opt out of the use of cookies for personalized advertising 
              (if the vendor or ad network offers this capability). Alternatively, you can direct users to opt out of 
              some third-party vendors' uses of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">www.aboutads.info</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Data Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Rights
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>The right to access your personal information</li>
              <li>The right to correct inaccurate personal information</li>
              <li>The right to delete your personal information</li>
              <li>The right to restrict processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to object to processing</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Changes to This Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update this privacy policy from time to time. We will notify you of any changes 
              by posting the new privacy policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have any questions about this privacy policy, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Email:</strong> privacy@frontendpedia.com<br />
                <strong>Website:</strong> <a href="/contact" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Contact Page</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
}
