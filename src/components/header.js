import Image from "next/image";
import logo from "../../public/uniicon-logo.png";
import Button from "./header-button";

export default function Header() {
  return (
    <header className="w-full mt-5 h-20 flex items-center justify-between px-6 shadow-gray-100 shadow-md rounded-3xl border border-gray-100 bg-white">
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
  );
}
