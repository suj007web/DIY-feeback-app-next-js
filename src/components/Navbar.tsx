"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed left-[50%] top-8 -translate-x-[50%] z-50">
      <div className="flex items-center gap-6 rounded-lg border-[1px] border-neutral-700 bg-neutral-900 p-4 text-sm text-neutral-500">
        <Logo />
        <div className="hidden md:flex gap-6">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/post-feedback">Post Feedback</NavLink>
          <NavLink href="/feedback">View Feedback</NavLink>
        </div>
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <MobileMenu setIsOpen={setIsOpen} />
        )}
      </AnimatePresence>
    </nav>
  );
};

const Logo: React.FC = () => {
  return (
    <p className='text-white text-xl font-extrabold'>fb</p>
  );
};

interface NavLinkProps {
  children: string;
  href: string;
}

const NavLink: React.FC<NavLinkProps> = ({ children, href }) => {
  return (
    <Link href={href} className="block overflow-hidden">
      <motion.div
        whileHover={{ y: -20 }}
        transition={{ ease: "backInOut", duration: 0.5 }}
        className="h-[20px]"
      >
        <span className="flex h-[20px] items-center">{children}</span>
        <span className="flex h-[20px] items-center text-neutral-50">
          {children}
        </span>
      </motion.div>
    </Link>
  );
};

interface MobileMenuProps {
  setIsOpen: (isOpen: boolean) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ setIsOpen }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 right-0 mt-2 w-32 bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden"
    >
      <div className="flex flex-col p-4 gap-4">
        <MobileNavLink href="/" setIsOpen={setIsOpen}>Home</MobileNavLink>
        <MobileNavLink href="/post-feedback" setIsOpen={setIsOpen}>Post Feedback</MobileNavLink>
        <MobileNavLink href="/feedback" setIsOpen={setIsOpen}>View Feedback</MobileNavLink>
      </div>
    </motion.div>
  );
};

interface MobileNavLinkProps extends NavLinkProps {
  setIsOpen: (isOpen: boolean) => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ children, href, setIsOpen }) => {
  return (
    <Link 
      href={href} 
      className="text-neutral-300 hover:text-white transition-colors "
      onClick={() => setIsOpen(false)}
    >
      {children}
    </Link>
  );
};

export default Navbar;