import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AlphaSync — Not Available in Your Region",
};

export default function ExplainPage() {
  return (
    <main className="min-h-screen bg-[#0a0a1a] flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
          <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Not Available in Your Region
        </h1>

        <p className="text-gray-400 leading-relaxed mb-8">
          AlphaSync currently only serves customers located in the{" "}
          <span className="text-white font-medium">United States</span>.
          We apologize for the inconvenience.
        </p>

        <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
          <p className="text-gray-500 text-sm">
            If you believe you are seeing this message in error, please contact us at{" "}
            <a href="mailto:support@alqedge.com" className="text-indigo-400 hover:text-indigo-300 underline">
              support@alqedge.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
