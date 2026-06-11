import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#2a2a2d]">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg font-bold bg-gradient-to-r from-[#0a84ff] to-[#00c6ff] bg-clip-text text-transparent">
                PDFCraft
              </span>
            </Link>
            <p className="text-[13px] text-[#8e8e93] leading-relaxed">
              Professional, browser-based tools to edit, annotate, merge, and optimize your PDF documents with absolute privacy.
            </p>
          </div>

          {/* Tools Column */}
          <div>
            <h3 className="text-[12px] font-semibold text-white uppercase tracking-wider mb-4">
              Products & Tools
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/pdf-editor"
                  className="text-[13px] text-[#8e8e93] hover:text-[#0a84ff] transition-colors"
                >
                  PDF Editor & Annotator
                </Link>
              </li>
              <li>
                <Link
                  href="/pdf-editor"
                  className="text-[13px] text-[#8e8e93] hover:text-[#0a84ff] transition-colors"
                >
                  PDF Merge Tool
                </Link>
              </li>
              <li>
                <Link
                  href="/pdf-editor"
                  className="text-[13px] text-[#8e8e93] hover:text-[#0a84ff] transition-colors"
                >
                  Whiteout/Masking tool
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-[12px] font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="text-[13px] text-[#8e8e93] hover:text-[#0a84ff] transition-colors"
                >
                  About Me
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-[13px] text-[#8e8e93] hover:text-[#0a84ff] transition-colors"
                >
                  Blog & Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[13px] text-[#8e8e93] hover:text-[#0a84ff] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust Column */}
          <div>
            <h3 className="text-[12px] font-semibold text-white uppercase tracking-wider mb-4">
              Security & Privacy
            </h3>
            <p className="text-[13px] text-[#8e8e93] leading-relaxed">
              All processing happens 100% locally in your browser. Your files never leave your computer. Privacy is guaranteed.
            </p>
          </div>
        </div>

        <div className="border-t border-[#2a2a2d] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-[#48484a]">
            &copy; {currentYear} PDFCraft. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-[12px] text-[#8e8e93] hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[12px] text-[#8e8e93] hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
