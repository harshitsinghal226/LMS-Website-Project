import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 md:px-36 text-left w-full mt-10 text-slate-300">
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-12 border-b border-white/10">
        <div className="flex flex-col md:items-start items-center w-full">
          <img src={assets.logo_dark} alt="logo" className="w-15" />
          <p className="mt-6 text-center md:text-left text-sm text-white/70">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam
            voluptas eligendi ipsum laborum exercitationem nihil delectus quidem
            magnam expedita architecto cum fugiat, deleniti molestias repellat
            excepturi ipsa vel asperiores soluta!
          </p>
        </div>
        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="font-semibold text-white mb-5">Company</h2>
          <ul className="flex md:flex-col w-full justify-between text-sm text-white/70 md:space-y-2">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">About us</a>
            </li>
            <li>
              <a href="#">Contact us</a>
            </li>
            <li>
              <a href="#">Privacy policy</a>
            </li>
          </ul>
        </div>
        <div className="hidden md:flex flex-col items-start w-full">
          <h2 className="font-semibold text-white mb-5">Subscribe to our newsletter</h2>
          <p className="text-sm text-white/70">The latest news, articles, and resources, sent to your inbox weekly.</p>
          <div className="flex items-center gap-2 pt-4">
            <input type="email" placeholder="Enter your email" className="border border-white/10 bg-slate-800 text-slate-300 placeholder-slate-400 outline-none w-64 h-9 rounded px-2 text-sm"/>
            <button className="bg-emerald-600 w-24 h-9 text-white rounded hover:bg-emerald-500 transition">Subscribe</button>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm text-white/60">
        Copyright 2025 © Harshit Singhal. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
