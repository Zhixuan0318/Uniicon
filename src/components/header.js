"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../public/uniicon-logo.png";
import Button from "./header-button";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
    <div className="mt-5" />
    <header
      className={`fixed top-5 h-20 flex items-center justify-between px-6 shadow-gray-100 shadow-md rounded-3xl border border-gray-100 bg-white transition-all duration-300 z-50`}
      style={{
        left: scrolled ? "calc(15vw + 10%)" : "15vw",
        right: scrolled ? "calc(15vw + 10%)" : "15vw",
      }}
    >
      {/* Logo Section */}
      <div className="flex items-center">
        <Image src={logo} alt="Uniicon Logo" height={42} />
      </div>

      {/* Button Section */}
      <div className="flex space-x-3">
        <Button>Agent Kit</Button>
        <Button>MCP Server</Button>
      </div>
    </header>
    </>
  );
}
