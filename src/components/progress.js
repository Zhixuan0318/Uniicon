import Image from "next/image";
import note from "../../public/note.png";

export default function ProgressLoader({ percentage }) {
  return (
    <div className="w-full max-w-lg mx-auto space-y-2 mt-2">
      {/* Label & Percentage */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-base font-medium text-black">
          The process takes approx. 2 minutes
        </span>
        <span className="text-sm font-medium text-orange-500">
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-orange-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Description with Icon */}
      <div className="flex items-start gap-2 text-sm text-gray-400">
        <Image src={note} alt="Note icon" width={16} height={16} className="mt-0.5" />
        <p>Do not close this window as it will affect the process.</p>
      </div>
    </div>
  );
}
