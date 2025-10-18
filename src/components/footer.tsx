import Link from 'next/link';
import { Briefcase, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Briefcase className="h-6 w-6 text-blue-600" aria-hidden="true" />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                JobPortal
              </span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              Connecting talented professionals with amazing opportunities worldwide.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">For Job Seekers</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/jobs" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/companies" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Browse Companies
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Career Advice
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Salary Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">For Employers</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/admin" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Browse Candidates
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Employer Branding
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
