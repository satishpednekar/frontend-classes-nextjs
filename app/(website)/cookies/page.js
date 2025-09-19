import Container from "@/components/container";

export const metadata = {
  title: "Cookie Policy - Frontendpedia",
  description: "Cookie Policy for Frontendpedia - Learn about how we use cookies and similar technologies.",
};

export default function CookiePolicy() {
  return (
    <Container>
      <div className="mx-auto max-w-4xl py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Cookie Policy
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              What Are Cookies?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and to provide information to website owners.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Cookies allow a website to recognize a user's device and remember information about their visit, 
              such as their preferred language and other settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              How We Use Cookies
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use cookies for several purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly</li>
              <li><strong>Analytics Cookies:</strong> These help us understand how visitors interact with our website</li>
              <li><strong>Advertising Cookies:</strong> These are used to deliver relevant advertisements</li>
              <li><strong>Preference Cookies:</strong> These remember your settings and preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Third-Party Cookies
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>Google Analytics:</strong> We use Google Analytics to analyze the use of our website. 
              Google Analytics gathers information about website use by means of cookies. 
              The information gathered relating to our website is used to create reports about the use of our website.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>Third-Party Advertising:</strong> We use third-party advertising services to display advertisements on our website. 
              These services use cookies to serve ads based on your prior visits to our website or other websites.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong>Social Media:</strong> Our website may include social media features, such as sharing buttons, 
              that may set cookies on your device.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Types of Cookies We Use
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Cookie Type</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Purpose</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Essential</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Website functionality</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Session</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Analytics</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Website performance analysis</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">2 years</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Advertising</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Personalized ads</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">1 year</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Preference</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">User settings</td>
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Managing Cookies
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You can control and manage cookies in various ways:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li><strong>Browser Settings:</strong> Most browsers allow you to refuse cookies or delete them</li>
              <li><strong>Opt-out Tools:</strong> You can opt out of personalized advertising at <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Google Ads Settings</a></li>
              <li><strong>Industry Tools:</strong> Visit <a href="https://www.aboutads.info" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">www.aboutads.info</a> to opt out of third-party advertising cookies</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300">
              Please note that disabling cookies may affect the functionality of our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Cookie Consent
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              When you first visit our website, you will see a cookie consent banner. By continuing to use our website 
              after seeing this banner, you consent to our use of cookies as described in this policy.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              You can change your cookie preferences at any time by clicking the "Cookie Settings" link in our footer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Updates to This Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update this cookie policy from time to time. We will notify you of any changes by posting 
              the new cookie policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have any questions about our use of cookies, please contact us at:
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
