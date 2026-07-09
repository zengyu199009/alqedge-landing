import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — AlphaSync",
  description: "AlphaSync Privacy Policy. Learn how we collect, use, and protect your personal information.",
};

function TocItem({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <a
        href={href}
        className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm"
      >
        {label}
      </a>
    </li>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a1a]">
      {/* Header */}
      <header className="border-b border-indigo-500/10 bg-[#0a0a1a]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg hover:text-indigo-300 transition-colors">
            AlphaSync
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/terms" className="text-gray-400 hover:text-gray-200 transition-colors">
              Terms of Service
            </Link>
            <Link href="/" className="text-gray-400 hover:text-gray-200 transition-colors">
              Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        {/* Title */}
        <div className="mb-10">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
            Effective: July 9, 2026 · v1.0
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-gray-400">
            AlphaSync (源析) — alqedge.com
          </p>
        </div>

        {/* Table of Contents */}
        <div className="mb-12 p-6 rounded-xl bg-[#12122a] border border-indigo-500/10">
          <h2 className="text-lg font-semibold text-white mb-4">Table of Contents</h2>
          <ol className="grid md:grid-cols-2 gap-x-8 gap-y-1.5 list-decimal list-inside text-indigo-400 text-sm">
            <TocItem href="#section-1" label="Introduction" />
            <TocItem href="#section-2" label="Scope and Service Area" />
            <TocItem href="#section-3" label="Information We Collect" />
            <TocItem href="#section-4" label="How We Use Your Information" />
            <TocItem href="#section-5" label="How We Disclose Information" />
            <TocItem href="#section-6" label="Cookies and Similar Technologies" />
            <TocItem href="#section-7" label="Data Storage and Security" />
            <TocItem href="#section-8" label="Data Retention" />
            <TocItem href="#section-9" label="Your Rights (CCPA / CPRA)" />
            <TocItem href="#section-10" label="Do Not Track / Global Privacy Controls" />
            <TocItem href="#section-11" label="Children" />
            <TocItem href="#section-12" label="International Visitors" />
            <TocItem href="#section-13" label="Changes to This Policy" />
            <TocItem href="#section-14" label="Contact" />
          </ol>
        </div>

        {/* Sections */}
        <div className="space-y-10 text-gray-300 leading-relaxed">
          {/* Section 1 */}
          <section id="section-1">
            <h2 className="text-xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="mb-3">
              This Privacy Policy explains how <strong>AlphaSync</strong> (&ldquo;<strong>we</strong>,&rdquo; &ldquo;<strong>us</strong>,&rdquo; &ldquo;<strong>our</strong>&rdquo;) collects, uses, discloses, and protects personal information when you use the AlphaSync website and AI stock-analysis service at <strong>alqedge.com</strong> (the &ldquo;<strong>Service</strong>&rdquo;).
            </p>
            <p>
              We take a <strong>minimal-data</strong> approach: we collect only what we need to operate the Service, we do not sell personal information, and we do not use your queries to train AI models. By using the Service you agree to this Policy. If you do not agree, please do not use the Service.
            </p>
          </section>

          {/* Section 2 */}
          <section id="section-2">
            <h2 className="text-xl font-bold text-white mb-4">2. Scope and Service Area</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>Audience:</strong> The Service is offered <strong>only to individuals located in the United States</strong> (50 states + DC). We do not knowingly collect personal information from individuals located outside the U.S.</li>
              <li><strong>Children:</strong> The Service is not directed to children under 18, and we do not knowingly collect personal information from anyone under 18.</li>
              <li><strong>Not a U.S. &ldquo;financial institution&rdquo;:</strong> We do not provide investment advice and are not subject to the Gramm-Leach-Bliley Act (&ldquo;GLBA&rdquo;) as a financial institution.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="section-3">
            <h2 className="text-xl font-bold text-white mb-4">3. Information We Collect</h2>

            <h3 className="text-lg font-semibold text-white mb-3">3.1 Information you provide directly</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-indigo-500/20">
                    <th className="text-left py-2 pr-4 text-gray-400 font-medium">Category</th>
                    <th className="text-left py-2 pr-4 text-gray-400 font-medium">Examples</th>
                    <th className="text-left py-2 text-gray-400 font-medium">When collected</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-indigo-500/10">
                    <td className="py-2 pr-4 text-white">Account information</td>
                    <td className="py-2 pr-4">Email address, display name (optional), password hash</td>
                    <td className="py-2">Account registration</td>
                  </tr>
                  <tr className="border-b border-indigo-500/10">
                    <td className="py-2 pr-4 text-white">Authentication profile (Google OAuth)</td>
                    <td className="py-2 pr-4">Email, name, OAuth token</td>
                    <td className="py-2">If you choose &ldquo;Sign in with Google&rdquo;</td>
                  </tr>
                  <tr className="border-b border-indigo-500/10">
                    <td className="py-2 pr-4 text-white">Watchlist / preferences</td>
                    <td className="py-2 pr-4">Tickers you save, alert preferences</td>
                    <td className="py-2">Using watchlist feature</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-white">Support communications</td>
                    <td className="py-2 pr-4">Email content, attachments</td>
                    <td className="py-2">When you contact support</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-white mb-3">3.2 Information collected automatically</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-indigo-500/20">
                    <th className="text-left py-2 pr-4 text-gray-400 font-medium">Category</th>
                    <th className="text-left py-2 pr-4 text-gray-400 font-medium">Examples</th>
                    <th className="text-left py-2 text-gray-400 font-medium">Source</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-indigo-500/10">
                    <td className="py-2 pr-4 text-white">Usage data</td>
                    <td className="py-2 pr-4">Pages viewed, features used, query counts, timestamps</td>
                    <td className="py-2">PostHog analytics</td>
                  </tr>
                  <tr className="border-b border-indigo-500/10">
                    <td className="py-2 pr-4 text-white">Device &amp; log data</td>
                    <td className="py-2 pr-4">IP address, browser type, OS, referrer, error logs</td>
                    <td className="py-2">Sentry, Cloudflare, server logs</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-white">Cookies and similar</td>
                    <td className="py-2 pr-4">Session cookies (auth), PostHog analytics cookies</td>
                    <td className="py-2">Your browser</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-white mb-3">3.3 Information collected via third-party payment processor</h3>
            <p className="mb-3 text-sm">
              <strong>AlphaSync does NOT directly collect, transmit, or store your payment-card information.</strong> When you subscribe, you are redirected to <strong>Waffo Pancake (operated by Waffo.com Limited)</strong>, our Merchant of Record payment processor. Waffo.com Limited collects and processes:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm mb-3">
              <li>Card number, expiration date, CVV, billing address (handled entirely on Waffo&apos;s PCI-DSS-compliant checkout);</li>
              <li>Transaction history (visible to you in your Waffo Pancake customer portal);</li>
              <li>Email address (shared with AlphaSync so we can associate the subscription with your account).</li>
            </ul>
            <p className="text-sm">See Waffo Pancake&apos;s privacy policy on the checkout page for details.</p>

            <h3 className="text-lg font-semibold text-white mb-3 mt-6">3.4 Information we DO NOT collect</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Social Security number, government ID, or similar identifiers;</li>
              <li>Bank account or routing numbers;</li>
              <li>Precise geolocation;</li>
              <li>Biometric data;</li>
              <li>Health, immigration, or other &ldquo;sensitive&rdquo; categories under CCPA;</li>
              <li>Your personal brokerage portfolio or holdings;</li>
              <li>Content of your personal communications outside the Service.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="section-4">
            <h2 className="text-xl font-bold text-white mb-4">4. How We Use Your Information</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-indigo-500/20">
                    <th className="text-left py-2 pr-4 text-gray-400 font-medium">Purpose</th>
                    <th className="text-left py-2 text-gray-400 font-medium">Information used</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Provide and operate the Service", "Account info, queries, watchlist"],
                    ["Authenticate users and prevent fraud", "Account info, IP, device data"],
                    ["Process subscriptions and billing", "Email (from Waffo), subscription status"],
                    ["Communicate with you (service notices, security alerts)", "Email"],
                    ["Send transactional and product emails", "Email"],
                    ["Debug, monitor, and improve the Service", "Usage data, error logs"],
                    ["Comply with legal obligations and enforce our Terms", "All relevant categories"],
                    ["Respond to lawful U.S. legal process", "All relevant categories"],
                  ].map(([purpose, info], i) => (
                    <tr key={i} className="border-b border-indigo-500/10">
                      <td className="py-2 pr-4 text-white">{purpose}</td>
                      <td className="py-2">{info}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <p className="font-semibold text-emerald-300 mb-2">We do NOT:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Sell personal information for money or other &ldquo;valuable consideration&rdquo; (CCPA §1798.140(ad));</li>
                <li>&ldquo;Share&rdquo; personal information for cross-context behavioral advertising (CCPA §1798.140(ah));</li>
                <li>Use your stock-analysis queries or saved watchlist to train AI / machine-learning models;</li>
                <li>Send marketing email without your affirmative consent.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5">
            <h2 className="text-xl font-bold text-white mb-4">5. How We Disclose Information</h2>

            <h3 className="text-lg font-semibold text-white mb-3">5.1 Service providers (processors)</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-indigo-500/20">
                    <th className="text-left py-2 pr-4 text-gray-400 font-medium">Provider</th>
                    <th className="text-left py-2 pr-4 text-gray-400 font-medium">Role</th>
                    <th className="text-left py-2 text-gray-400 font-medium">Categories disclosed</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Waffo Pancake (Waffo.com Limited)", "Payment processor / MoR", "Email, billing address, transaction data"],
                    ["Supabase Inc.", "Database, auth, file storage (US-East)", "Account info, queries, watchlist, reports"],
                    ["DeepSeek", "LLM provider", "Ticker symbols + market context (no PII)"],
                    ["Resend", "Transactional email", "Email address"],
                    ["Sentry", "Error monitoring", "Error logs (may contain IP, browser)"],
                    ["PostHog", "Product analytics", "Usage events (pseudonymous user ID)"],
                    ["Cloudflare", "CDN, edge security, GeoIP block", "IP address, request metadata"],
                    ["Finnhub", "Market data", "Ticker symbol only (no PII)"],
                    ["SEC EDGAR", "Public-filing source", "Public data only (no PII)"],
                    ["Google LLC (OAuth)", "Authentication", "Email, name, OAuth token"],
                  ].map(([provider, role, categories], i) => (
                    <tr key={i} className="border-b border-indigo-500/10">
                      <td className="py-2 pr-4 text-white">{provider}</td>
                      <td className="py-2 pr-4">{role}</td>
                      <td className="py-2">{categories}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-white mb-3">5.2 For legal reasons</h3>
            <p className="text-sm mb-4">We may disclose information when we believe in good faith that it is necessary to comply with applicable U.S. law, regulation, or legal process; enforce our Terms of Service; or protect the rights, property, or safety of AlphaSync, our users, or others.</p>

            <h3 className="text-lg font-semibold text-white mb-3">5.3 Business transfers</h3>
            <p className="text-sm mb-4">If AlphaSync is acquired, merged, or sells substantially all of its assets, your personal information may be transferred as part of that transaction. We will notify you by email at least 30 days before the transfer takes effect.</p>

            <h3 className="text-lg font-semibold text-white mb-3">5.4 Otherwise with your consent</h3>
            <p className="text-sm">We will disclose your information for any other purpose only with your affirmative consent.</p>
          </section>

          {/* Section 6 */}
          <section id="section-6">
            <h2 className="text-xl font-bold text-white mb-4">6. Cookies and Similar Technologies</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-indigo-500/20">
                    <th className="text-left py-2 pr-4 text-gray-400 font-medium">Cookie type</th>
                    <th className="text-left py-2 pr-4 text-gray-400 font-medium">Purpose</th>
                    <th className="text-left py-2 pr-4 text-gray-400 font-medium">Duration</th>
                    <th className="text-left py-2 text-gray-400 font-medium">Required?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-indigo-500/10">
                    <td className="py-2 pr-4 text-white">Auth session cookie</td>
                    <td className="py-2 pr-4">Keep you signed in</td>
                    <td className="py-2 pr-4">Session / 7 days</td>
                    <td className="py-2">Yes</td>
                  </tr>
                  <tr className="border-b border-indigo-500/10">
                    <td className="py-2 pr-4 text-white">PostHog analytics cookie</td>
                    <td className="py-2 pr-4">Aggregate usage analytics</td>
                    <td className="py-2 pr-4">12 months</td>
                    <td className="py-2">No (honor DNT)</td>
                  </tr>
                  <tr className="border-b border-indigo-500/10">
                    <td className="py-2 pr-4 text-white">Cloudflare cookies</td>
                    <td className="py-2 pr-4">Bot protection, GeoIP</td>
                    <td className="py-2 pr-4">Session / 30 days</td>
                    <td className="py-2">Yes (security)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-white">Waffo Pancake cookies</td>
                    <td className="py-2 pr-4">Payment checkout</td>
                    <td className="py-2 pr-4">Per Waffo policy</td>
                    <td className="py-2">Yes, when paying</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm">We do <strong>not</strong> use advertising cookies, third-party tracking pixels, or cross-site behavioral tracking.</p>
          </section>

          {/* Section 7 */}
          <section id="section-7">
            <h2 className="text-xl font-bold text-white mb-4">7. Data Storage and Security</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>Primary database:</strong> Supabase Postgres, hosted on <strong>US-East region (AWS us-east-1)</strong>. Row-Level Security (RLS) is enabled on all user-data tables.</li>
              <li><strong>Application hosting:</strong> Backend (FastAPI on Python) and frontend (Next.js) deployed on U.S.-region infrastructure.</li>
              <li><strong>Backups:</strong> Supabase managed backups retained for 7 days; off-site encrypted snapshots retained for 30 days.</li>
              <li><strong>Encryption:</strong> TLS 1.2+ in transit (HTTPS); AES-256 at rest.</li>
              <li><strong>Access control:</strong> Access to production data is limited to the founder/operator; access is logged and audited.</li>
              <li><strong>Passwords:</strong> Stored hashed using Supabase Auth (bcrypt). We never see plaintext passwords.</li>
            </ul>
            <p className="mt-3 text-sm">
              No system is 100% secure. If we discover a security incident affecting your personal information, we will notify you by email and provide the required breach-notification disclosures.
            </p>
          </section>

          {/* Section 8 */}
          <section id="section-8">
            <h2 className="text-xl font-bold text-white mb-4">8. Data Retention</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-indigo-500/20">
                    <th className="text-left py-2 pr-4 text-gray-400 font-medium">Data category</th>
                    <th className="text-left py-2 text-gray-400 font-medium">Retention</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Account info (email, profile)", "While account is active + 30 days after deletion"],
                    ["Stock analyses / reports", "24 months after creation; then anonymized or deleted"],
                    ["Watchlist", "While account is active"],
                    ["Usage analytics (PostHog)", "12 months, then aggregated or deleted"],
                    ["Error logs (Sentry)", "90 days"],
                    ["Payment transaction records (Waffo)", "Per Waffo&apos;s policy (typically 7 years)"],
                    ["Support emails", "24 months after last interaction"],
                    ["Backup snapshots", "30 days"],
                  ].map(([category, retention], i) => (
                    <tr key={i} className="border-b border-indigo-500/10">
                      <td className="py-2 pr-4 text-white">{category}</td>
                      <td className="py-2">{retention}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section-9">
            <h2 className="text-xl font-bold text-white mb-4">9. Your Rights (CCPA / CPRA and Other U.S. State Laws)</h2>
            <p className="mb-4 text-sm">
              As a U.S. user you have specific rights regarding your personal information. We extend these rights to <strong>all</strong> U.S. users regardless of state of residence.
            </p>

            <h3 className="text-lg font-semibold text-white mb-3">9.1 Rights you have</h3>
            <ul className="list-disc list-inside space-y-2 text-sm mb-4">
              <li><strong>Right to Know (CCPA §1798.110):</strong> Request what personal information we have collected about you.</li>
              <li><strong>Right to Access / Portability:</strong> Request a copy of your personal information in JSON format.</li>
              <li><strong>Right to Delete (CCPA §1798.105):</strong> Request deletion of your personal information.</li>
              <li><strong>Right to Correct (CPRA):</strong> Request correction of inaccurate personal information.</li>
              <li><strong>Right to Limit Use of Sensitive Personal Information:</strong> We do not collect sensitive personal information.</li>
              <li><strong>Right to Non-Discrimination (CCPA §1798.125):</strong> We will not discriminate against you for exercising your rights.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-3">9.2 How to exercise these rights</h3>
            <ul className="list-disc list-inside space-y-2 text-sm mb-4">
              <li><strong>Self-service (recommended):</strong> Log in → Settings → Privacy → &ldquo;Download my data&rdquo; or &ldquo;Delete my account.&rdquo;</li>
              <li><strong>Email request:</strong> <a href="mailto:privacy@alqedge.com" className="text-indigo-400 hover:text-indigo-300 underline">privacy@alqedge.com</a>. We will respond within 45 days.</li>
              <li><strong>Authorized agent:</strong> California residents may designate an authorized agent.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-3">9.3 Verification</h3>
            <p className="text-sm mb-4">We verify your identity before fulfilling requests. We may ask you to confirm control of the email address on file.</p>

            <h3 className="text-lg font-semibold text-white mb-3">9.4 Appeal</h3>
            <p className="text-sm">If we deny your request and you are a California resident, you may appeal by replying to our denial email within 30 days.</p>
          </section>

          {/* Section 10 */}
          <section id="section-10">
            <h2 className="text-xl font-bold text-white mb-4">10. Do Not Track / Global Privacy Controls</h2>
            <p className="text-sm">
              We honor &ldquo;Do Not Track&rdquo; (DNT) browser signals and Global Privacy Control (GPC) headers as opt-outs of non-essential cookies (analytics). However, the Service is not available outside the U.S., so cross-jurisdictional &ldquo;Do Not Sell My Personal Information&rdquo; links are not required.
            </p>
          </section>

          {/* Section 11 */}
          <section id="section-11">
            <h2 className="text-xl font-bold text-white mb-4">11. Children</h2>
            <p className="text-sm">
              The Service is not directed to children under 18. We do not knowingly collect personal information from anyone under 18. If we learn that we have collected personal information from a child under 18, we will delete it as soon as possible. Parents may contact <a href="mailto:privacy@alqedge.com" className="text-indigo-400 hover:text-indigo-300 underline">privacy@alqedge.com</a> to request deletion.
            </p>
          </section>

          {/* Section 12 */}
          <section id="section-12">
            <h2 className="text-xl font-bold text-white mb-4">12. International Visitors</h2>
            <p className="text-sm">
              The Service is offered only in the United States and is not intended for use outside the U.S. If you are visiting the Service from outside the U.S., please be aware that your information will be transferred to, stored in, and processed in the United States. By using the Service, you consent to such transfer and processing.
            </p>
            <p className="mt-3 text-sm">
              We do <strong>not</strong> target or knowingly serve users in the European Economic Area, the United Kingdom, China, or any OFAC-sanctioned jurisdiction.
            </p>
          </section>

          {/* Section 13 */}
          <section id="section-13">
            <h2 className="text-xl font-bold text-white mb-4">13. Changes to This Policy</h2>
            <p className="text-sm">
              We may update this Privacy Policy from time to time. If we make material changes, we will post the updated Policy on this page with a new effective date, email you at least 30 days before the changes take effect, and for California residents, describe the changes in a summary of changes notice.
            </p>
          </section>

          {/* Section 14 */}
          <section id="section-14">
            <h2 className="text-xl font-bold text-white mb-4">14. Contact</h2>
            <div className="p-4 rounded-lg bg-[#12122a] border border-indigo-500/10">
              <ul className="space-y-2 text-sm">
                <li><strong>Privacy email:</strong> <a href="mailto:privacy@alqedge.com" className="text-indigo-400 hover:text-indigo-300 underline">privacy@alqedge.com</a></li>
                <li><strong>General support:</strong> <a href="mailto:support@alqedge.com" className="text-indigo-400 hover:text-indigo-300 underline">support@alqedge.com</a></li>
                <li><strong>Domain:</strong> alqedge.com</li>
              </ul>
              <p className="mt-3 text-xs text-gray-500">
                We aim to respond to all privacy requests within 15 business days; CCPA grants us up to 45 days.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-indigo-500/10 text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2026 AlphaSync. All rights reserved. |{" "}
            <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 underline">Terms of Service</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
