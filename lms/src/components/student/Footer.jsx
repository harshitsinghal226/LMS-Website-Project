import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-slate-900 w-full mt-10 text-slate-300">
      <div className="md:px-36 px-8 py-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex flex-col md:items-start items-center w-full md:w-auto">
            <div className="flex items-center space-x-2 mb-3">
              <img src={assets.logo_dark} alt="SKILLFORGE Logo" className="w-6 h-6" />
              <span className="text-sm font-medium text-white">SKILLFORGE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed text-center md:text-left max-w-md">
              SkillForge is a dynamic learning ecosystem built on the belief that everyone has something to learn and something to teach. Our platform empowers you to be both a student mastering new skills and an educator sharing your passion with a global audience.
            </p>
          </div>
          <p className="text-xs text-slate-400 text-center md:text-right">
            Copyright 2025 © Skillforge. All Right Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
