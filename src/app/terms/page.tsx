import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — AlphaSync",
  description: "AlphaSync Terms of Service. By using alqedge.com, you agree to these terms.",
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

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a1a]">
      {/* Header */}
      <header className="border-b border-indigo-500/10 bg-[#0a0a1a]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg hover:text-indigo-300 transition-colors">
            AlphaSync
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-gray-200 transition-colors">
              Privacy Policy
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
            Terms of Service
          </h1>
          <p className="text-gray-400">
            AlphaSync (源析) — alqedge.com
          </p>
        </div>

        {/* Table of Contents */}
        <div className="mb-12 p-6 rounded-xl bg-[#12122a] border border-indigo-500/10">
          <h2 className="text-lg font-semibold text-white mb-4">Table of Contents</h2>
          <ol className="grid md:grid-cols-2 gap-x-8 gap-y-1.5 list-decimal list-inside text-indigo-400 text-sm">
            <TocItem href="#section-1" label="Acceptance of These Terms" />
            <TocItem href="#section-2" label="Service Area — United States Only" />
            <TocItem href="#section-3" label="What AlphaSync Is (and Is Not)" />
            <TocItem href="#section-4" label="Accounts" />
            <TocItem href="#section-5" label="Subscriptions, Pricing, and Free Trial" />
            <TocItem href="#section-6" label="Payment Processing — Waffo Pancake" />
            <TocItem href="#section-7" label="Cancellation and Refunds" />
            <TocItem href="#section-8" label="Acceptable Use" />
            <TocItem href="#section-9" label="Intellectual Property" />
            <TocItem href="#section-10" label="Third-Party Services and Data" />
            <TocItem href="#section-11" label="Disclaimers" />
            <TocItem href="#section-12" label="Limitation of Liability" />
            <TocItem href="#section-13" label="Indemnification" />
            <TocItem href="#section-14" label="Termination" />
            <TocItem href="#section-15" label="Changes to These Terms" />
            <TocItem href="#section-16" label="Governing Law and Dispute Resolution" />
            <TocItem href="#section-17" label="Contact" />
          </ol>
        </div>

        {/* Sections */}
        <div className="space-y-10 text-gray-300 leading-relaxed">
          {/* Section 1 */}
          <section id="section-1">
            <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of These Terms</h2>
            <p className="mb-3">
              By creating an account, subscribing, or otherwise using AlphaSync (the &ldquo;<strong>Service</strong>&rdquo;) at <strong>alqedge.com</strong>, you agree to these Terms of Service (&ldquo;<strong>Terms</strong>&rdquo;). If you do not agree, do not use the Service.
            </p>
            <p>
              You must be (i) at least 18 years old, (ii) a legal resident of the United States (50 states + the District of Columbia), and (iii) legally able to enter into a binding contract in your state of residence. By using the Service you represent that all three conditions are true.
            </p>
          </section>

          {/* Section 2 */}
          <section id="section-2">
            <h2 className="text-xl font-bold text-white mb-4">2. Service Area — United States Only</h2>
            <p className="mb-3">
              <strong>AlphaSync only serves customers located in the United States.</strong> Users in other jurisdictions are not permitted to register, subscribe to, or use the Service. We block access from sanctioned countries (OFAC-sanctioned jurisdictions) and from all non-U.S. locations. We may require you to confirm your U.S. location at signup or subscription time.
            </p>
            <p>
              If you access the Service from outside the United States, you do so at your own risk and you are responsible for compliance with local law. We may suspend or terminate access if we determine you are not in the United States.
            </p>
          </section>

          {/* Section 3 */}
          <section id="section-3">
            <h2 className="text-xl font-bold text-white mb-4">3. What AlphaSync Is (and Is Not)</h2>
            <p className="mb-3">
              AlphaSync is an <strong>information analysis tool</strong> that provides general educational content and data-driven analysis of publicly available SEC filings (10-K, 10-Q, 8-K, etc.) and other public market data, using multiple AI agents working in parallel.
            </p>
            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/10 mb-3">
              <p className="font-semibold text-amber-300 mb-2">AlphaSync is NOT:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Not investment advice.</strong> AlphaSync does not provide investment, financial, trading, legal, tax, or any other professional advice.</li>
                <li><strong>Not a broker-dealer or investment adviser.</strong> AlphaSync is not registered as an investment adviser under the Investment Advisers Act of 1940 or under any state law. AlphaSync does not act as a fiduciary for any user.</li>
                <li><strong>Not a recommendation engine.</strong> Reports do not contain buy/sell/hold calls, target prices, or price predictions. All analyses are descriptive rather than prescriptive.</li>
                <li><strong>Not real-time market data.</strong> Quotes and filings are sourced with up to 15-minute delay from third-party providers.</li>
              </ul>
            </div>
            <p>
              You should <strong>always consult a qualified, licensed financial professional</strong> before making any investment decision. All investments carry risk; past performance does not guarantee future results. AlphaSync is not a registered investment adviser.
            </p>
          </section>

          {/* Section 4 */}
          <section id="section-4">
            <h2 className="text-xl font-bold text-white mb-4">4. Accounts</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Registration:</strong> You must provide a valid email address and authenticate via email/password or Google OAuth. You agree to provide accurate information and to keep it current.</li>
              <li><strong>Security:</strong> You are responsible for safeguarding your account credentials and for all activity under your account. Notify us immediately at <a href="mailto:support@alqedge.com" className="text-indigo-400 hover:text-indigo-300 underline">support@alqedge.com</a> if you suspect unauthorized access.</li>
              <li><strong>One account per person:</strong> Multiple accounts for the same person are not permitted. We may merge or terminate duplicate accounts.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="section-5">
            <h2 className="text-xl font-bold text-white mb-4">5. Subscriptions, Pricing, and Free Trial</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-indigo-500/20">
                    <th className="text-left py-2 pr-4 text-gray-400 font-medium">Plan</th>
                    <th className="text-left py-2 pr-4 text-gray-400 font-medium">Price</th>
                    <th className="text-left py-2 text-gray-400 font-medium">Includes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-indigo-500/10">
                    <td className="py-2 pr-4 text-white">Free</td>
                    <td className="py-2 pr-4">$0</td>
                    <td className="py-2">3 stock analyses per 30-day rolling window</td>
                  </tr>
                  <tr className="border-b border-indigo-500/10">
                    <td className="py-2 pr-4 text-white font-medium">Pro</td>
                    <td className="py-2 pr-4">$19.00 / month (USD)</td>
                    <td className="py-2">60 analyses per hour (soft cap); 7-day free trial</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-white">Team</td>
                    <td className="py-2 pr-4">$49.00 / month</td>
                    <td className="py-2">Up to 5 seats; 300 analyses per hour</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>Currency:</strong> All prices are in U.S. dollars. Sales tax (where applicable) is collected by our payment processor.</li>
              <li><strong>7-day free trial:</strong> New Pro subscribers receive a 7-day free trial. You may cancel at any time during the trial at no charge.</li>
              <li><strong>30-day rolling quota window:</strong> Free-tier usage resets on a rolling 30-day basis.</li>
              <li><strong>Price changes:</strong> We may change subscription prices with at least 30 days&apos; prior notice by email.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section id="section-6">
            <h2 className="text-xl font-bold text-white mb-4">6. Payment Processing — Waffo Pancake (Merchant of Record)</h2>
            <p className="mb-3">
              All payments are processed by <strong>Waffo Pancake</strong>, operated by <strong>Waffo.com Limited</strong>, which acts as the <strong>Merchant of Record</strong> (&ldquo;<strong>MoR</strong>&rdquo;).
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>What this means:</strong> Waffo.com Limited is the legal seller of the subscription. Your purchase contract for the paid plan is with Waffo.com Limited, not directly with AlphaSync.</li>
              <li><strong>AlphaSync does not directly collect, transmit, or store your payment-card information.</strong> You provide payment data directly to Waffo Pancake&apos;s PCI-DSS-compliant checkout.</li>
              <li><strong>Pricing transparency:</strong> The displayed price is the price you pay; applicable U.S. sales tax is added at checkout.</li>
              <li><strong>Waffo Pancake terms:</strong> Your payment-related rights and obligations are governed by Waffo Pancake&apos;s own terms and privacy policy.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section id="section-7">
            <h2 className="text-xl font-bold text-white mb-4">7. Cancellation and Refunds</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>Cancellation:</strong> You may cancel your Pro subscription at any time through your account settings or by contacting <a href="mailto:support@alqedge.com" className="text-indigo-400 hover:text-indigo-300 underline">support@alqedge.com</a>.</li>
              <li><strong>7-day money-back guarantee (first payment only):</strong> Refund requests for the first monthly charge are handled by Waffo.com Limited within 7 days of the original charge, provided you have used fewer than 3 analyses.</li>
              <li><strong>Trial-period cancellation:</strong> Canceling during the 7-day free trial incurs no charge.</li>
              <li><strong>Chargebacks:</strong> If you initiate a chargeback without first contacting us, we may suspend your account pending resolution.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section id="section-8">
            <h2 className="text-xl font-bold text-white mb-4">8. Acceptable Use</h2>
            <p className="mb-3">You agree <strong>not</strong> to:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Use the Service for any unlawful purpose or in violation of any applicable U.S. law or regulation.</li>
              <li>Resell, redistribute, or sublicense the Service or any report without our prior written consent.</li>
              <li>Use the Service to provide investment, financial, or trading advice to third parties in a manner that would require registration as an investment adviser or broker-dealer.</li>
              <li>Reverse-engineer, decompile, or attempt to extract the source code of the Service.</li>
              <li>Interfere with, disrupt, or attempt to gain unauthorized access to the Service or its systems.</li>
              <li>Use any automated means (bots, scrapers, scripts) to access the Service except through published APIs.</li>
              <li>Upload content that is infringing, defamatory, obscene, or otherwise unlawful.</li>
              <li>Use the Service from outside the United States.</li>
            </ol>
            <p className="mt-3 text-sm">We may suspend or terminate your account for violations of this section.</p>
          </section>

          {/* Section 9 */}
          <section id="section-9">
            <h2 className="text-xl font-bold text-white mb-4">9. Intellectual Property</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>Our IP:</strong> The Service, including its software, design, branding, and reports, is owned by AlphaSync or its licensors.</li>
              <li><strong>License to you:</strong> We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your personal, non-commercial investment research.</li>
              <li><strong>Your data:</strong> You retain ownership of any personal data you submit. See our <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 underline">Privacy Policy</Link>.</li>
              <li><strong>Feedback:</strong> If you provide suggestions or feedback, we may use them without restriction or compensation.</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section id="section-10">
            <h2 className="text-xl font-bold text-white mb-4">10. Third-Party Services and Data</h2>
            <p className="mb-3 text-sm">The Service relies on third-party providers. By using the Service you acknowledge:</p>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-indigo-500/20">
                    <th className="text-left py-2 pr-4 text-gray-400 font-medium">Provider</th>
                    <th className="text-left py-2 pr-4 text-gray-400 font-medium">Role</th>
                    <th className="text-left py-2 text-gray-400 font-medium">What it handles</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Waffo Pancake (Waffo.com Limited)", "Payment processor / MoR", "Payment data, billing"],
                    ["Supabase Inc.", "Database, auth, file storage", "Account email, queries, reports (US-East)"],
                    ["Finnhub.io", "Market-data feed", "Ticker symbols (no personal data)"],
                    ["SEC EDGAR", "Public-filing data source", "Public filings (no personal data)"],
                    ["DeepSeek", "LLM provider", "Ticker + market context (no PII)"],
                    ["Resend", "Transactional email", "Email address"],
                    ["Sentry", "Error monitoring", "Error logs, IP"],
                    ["PostHog", "Product analytics", "Behavioral events"],
                    ["Google OAuth (optional)", "Authentication", "Email, name, OAuth token"],
                  ].map(([provider, role, handles], i) => (
                    <tr key={i} className="border-b border-indigo-500/10">
                      <td className="py-2 pr-4 text-white">{provider}</td>
                      <td className="py-2 pr-4">{role}</td>
                      <td className="py-2">{handles}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm">We are not responsible for the availability, accuracy, or content of third-party services.</p>
          </section>

          {/* Section 11 */}
          <section id="section-11">
            <h2 className="text-xl font-bold text-white mb-4">11. Disclaimers</h2>
            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/10 mb-3">
              <p className="font-semibold text-amber-300 mb-2">THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE,&rdquo; WITHOUT WARRANTIES OF ANY KIND.</p>
              <p className="text-sm">Specifically, AlphaSync does not warrant that:</p>
              <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                <li>AI-generated analyses will be accurate, complete, or free of errors or &ldquo;hallucinations&rdquo;;</li>
                <li>Data sourced from SEC EDGAR, Finnhub, or other third-party providers is error-free or current;</li>
                <li>The Service will be uninterrupted, secure, or free of harmful components;</li>
                <li>Any specific investment outcome will result from use of the Service.</li>
              </ul>
            </div>
            <p className="text-sm">Reports are intended for <strong>educational and informational purposes only</strong> and should not be the sole basis for any investment decision.</p>
          </section>

          {/* Section 12 */}
          <section id="section-12">
            <h2 className="text-xl font-bold text-white mb-4">12. Limitation of Liability</h2>
            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/10 mb-3">
              <p className="font-semibold text-amber-300 mb-2">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>IN NO EVENT WILL ALPHASYNC BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.</li>
                <li>OUR TOTAL CUMULATIVE LIABILITY WILL NOT EXCEED THE GREATER OF (A) THE TOTAL AMOUNTS YOU PAID IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) US$100.</li>
              </ul>
            </div>
            <p className="text-sm">Some U.S. states do not allow the exclusion or limitation of certain damages; in those states the limitations above apply to the maximum extent permitted by applicable law.</p>
          </section>

          {/* Section 13 */}
          <section id="section-13">
            <h2 className="text-xl font-bold text-white mb-4">13. Indemnification</h2>
            <p className="text-sm">
              You agree to defend, indemnify, and hold harmless AlphaSync and its owner, affiliates, and licensors from and against any claims, damages, obligations, losses, and expenses (including reasonable attorneys&apos; fees) arising from (a) your use of the Service, (b) your violation of these Terms, (c) your violation of any third-party right, or (d) any investment decision you make based on the Service.
            </p>
          </section>

          {/* Section 14 */}
          <section id="section-14">
            <h2 className="text-xl font-bold text-white mb-4">14. Termination</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>By you:</strong> You may terminate your account at any time by emailing <a href="mailto:support@alqedge.com" className="text-indigo-400 hover:text-indigo-300 underline">support@alqedge.com</a> or via account settings.</li>
              <li><strong>By us:</strong> We may suspend or terminate your account at any time for conduct that violates these Terms or as required by law.</li>
              <li><strong>Effect:</strong> Upon termination, your right to use the Service ceases. Sections that by their nature should survive will survive termination.</li>
              <li><strong>Data:</strong> Account data will be deleted in accordance with our Privacy Policy (default: 30 days post-termination).</li>
            </ul>
          </section>

          {/* Section 15 */}
          <section id="section-15">
            <h2 className="text-xl font-bold text-white mb-4">15. Changes to These Terms</h2>
            <p className="text-sm">
              We may update these Terms from time to time. If we make material changes, we will give you at least 30 days&apos; prior notice by email and/or by a prominent notice on the Service. Continued use of the Service after the effective date of the updated Terms constitutes acceptance.
            </p>
          </section>

          {/* Section 16 */}
          <section id="section-16">
            <h2 className="text-xl font-bold text-white mb-4">16. Governing Law and Dispute Resolution</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>Governing law:</strong> These Terms are governed by the laws of the State of Delaware, United States.</li>
              <li><strong>Forum:</strong> Any dispute will be brought exclusively in the state or federal courts located in Delaware.</li>
              <li><strong>Waiver of class action:</strong> You agree to resolve disputes on an individual basis and waive any right to participate in a class action.</li>
              <li><strong>Equitable relief:</strong> Either party may seek injunctive or other equitable relief to protect its intellectual property or confidential information.</li>
            </ul>
          </section>

          {/* Section 17 */}
          <section id="section-17">
            <h2 className="text-xl font-bold text-white mb-4">17. Contact</h2>
            <div className="p-4 rounded-lg bg-[#12122a] border border-indigo-500/10">
              <ul className="space-y-2 text-sm">
                <li><strong>Email:</strong> <a href="mailto:support@alqedge.com" className="text-indigo-400 hover:text-indigo-300 underline">support@alqedge.com</a></li>
                <li><strong>Privacy requests:</strong> <a href="mailto:privacy@alqedge.com" className="text-indigo-400 hover:text-indigo-300 underline">privacy@alqedge.com</a></li>
                <li><strong>Domain:</strong> alqedge.com</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-indigo-500/10 text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2026 AlphaSync. All rights reserved. |{" "}
            <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
