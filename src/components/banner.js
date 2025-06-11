export default function Banner() {
  return (
    <a
      href="https://ethglobal.com/events/cannes"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="group w-full h-13 flex items-center justify-center px-4 text-[#333] bg-[#FBF8F5] hover:bg-[#181717] hover:text-white transition-colors duration-300">
        <div className="flex items-center gap-2 text-md font-medium">
          <span>Introducing Uniicon at Coinbase Agents in Action Hackathon</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 256 256"
            className="mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
          </svg>
        </div>
      </div>
    </a>
  );
}
