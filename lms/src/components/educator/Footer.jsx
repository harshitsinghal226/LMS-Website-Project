import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 border-t border-slate-200 bg-white">
      <div className="flex items-center gap-4">
        <img className="hidden md:block w-20" src={assets.logo} alt="logo" />
        <div className="hidden md:block h-7 w-px bg-slate-300"></div>
        <p className="py-4 text-center text-xs md:text-sm text-slate-600">
          Copyright 2025 © Skillforge. All Right Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
