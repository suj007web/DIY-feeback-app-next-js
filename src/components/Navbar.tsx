"use client"
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">FeedbackApp</Link>
        <div className="space-x-4">
          <Link href="/post-feedback" className="text-white hover:text-gray-300 transition duration-300">Post Feedback</Link>
          <Link href="/feedback" className="text-white hover:text-gray-300 transition duration-300">View Feedback</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;