import Container from "@/components/container";

export const metadata = {
  title: "Terms of Service - Frontendpedia",
  description: "Terms of Service for Frontendpedia - Read our terms and conditions for using our website and services.",
};

export default function TermsOfService() {
  return (
    <Container>
      <div className="mx-auto max-w-4xl py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Terms of Service
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Acceptance of Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              By accessing and using Frontendpedia (&quot;the Website&quot;), you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Use License
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Permission is granted to temporarily download one copy of the materials on Frontendpedia for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
              <li>attempt to decompile or reverse engineer any software contained on the website</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Content and Intellectual Property
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              All content, including but not limited to text, graphics, logos, images, audio clips, video, 
              and software, is the property of Frontendpedia or its content suppliers and is protected by 
              international copyright laws.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              You may not reproduce, distribute, display, sell, lease, transmit, create derivative works from, 
              translate, modify, reverse-engineer, disassemble, decompile or otherwise exploit this Website or 
              any portion of it unless expressly permitted by Frontendpedia in writing.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              User Conduct
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You agree not to use the Website to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Upload, post, or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
              <li>Impersonate any person or entity or misrepresent your affiliation with a person or entity</li>
              <li>Upload, post, or transmit any content that infringes any patent, trademark, trade secret, copyright, or other proprietary rights</li>
              <li>Upload, post, or transmit any unsolicited or unauthorized advertising, promotional materials, spam, or any other form of solicitation</li>
              <li>Interfere with or disrupt the Website or servers or networks connected to the Website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Disclaimer
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The materials on Frontendpedia are provided on an &apos;as is&apos; basis. Frontendpedia makes no warranties, 
              expressed or implied, and hereby disclaims and negates all other warranties including without limitation, 
              implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement 
              of intellectual property or other violation of rights.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Further, Frontendpedia does not warrant or make any representations concerning the accuracy, likely results, 
              or reliability of the use of the materials on its website or otherwise relating to such materials or on 
              any sites linked to this site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Limitations
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              In no event shall Frontendpedia or its suppliers be liable for any damages (including, without limitation, 
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
              to use the materials on Frontendpedia, even if Frontendpedia or a Frontendpedia authorized representative 
              has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do 
              not allow limitations on implied warranties, or limitations of liability for consequential or incidental 
              damages, these limitations may not apply to you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Accuracy of Materials
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              The materials appearing on Frontendpedia could include technical, typographical, or photographic errors. 
              Frontendpedia does not warrant that any of the materials on its website are accurate, complete, or current. 
              Frontendpedia may make changes to the materials contained on its website at any time without notice. 
              However, Frontendpedia does not make any commitment to update the materials.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Links
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Frontendpedia has not reviewed all of the sites linked to our website and is not responsible for the 
              contents of any such linked site. The inclusion of any link does not imply endorsement by Frontendpedia 
              of the site. Use of any such linked website is at the user&apos;s own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Modifications
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Frontendpedia may revise these terms of service for its website at any time without notice. By using 
              this website you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Governing Law
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              These terms and conditions are governed by and construed in accordance with the laws of the United States 
              and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Email:</strong> legal@frontendpedia.com<br />
                <strong>Website:</strong> <a href="/contact" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Contact Page</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
}
