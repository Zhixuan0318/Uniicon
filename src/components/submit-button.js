import icon from "../../public/spark.png";
import usdc from "../../public/usdc.png";
import Image from "next/image";

export default function SubmitButton({ loading }) {
  return (
    <div className="flex flex-col items-center">
      <button
        type="submit"
        disabled={loading}
        className="
          w-72 h-15 mt-5 rounded-[10px] text-lg font-semibold flex items-center justify-center
          transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50
          bg-orange-500 text-white hover:bg-orange-400 disabled:bg-orange-200 disabled:text-white
          [box-shadow:0_0_0_1px_hsl(24,100%,91%),_0_1px_2px_hsl(24,90%,60%),_0_3px_3px_hsl(24,95%,70%),_0_-2px_hsl(24,90%,88%)_inset]
          hover:translate-y-[1px] hover:scale-[0.98] hover:[box-shadow:0_0_0_1px_hsl(24,100%,91%),_0_1px_2px_hsl(24,90%,60%)]
          active:translate-y-[2px] active:scale-[0.97] active:[box-shadow:0_0_0_1px_hsl(24,100%,91%),_inset_0_1px_1px_hsl(24,90%,60%)]
          disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:scale-100
          px-4 mb-2
        "
      >
        <div className="flex items-center justify-center gap-1">
          <Image
            src={icon}
            alt="Spark icon"
            width={25}
            height={25}
            className="-ml-2"
          />
          <span>{loading ? "Processing..." : "Generate"}</span>
        </div>
      </button>

      <p className="text-sm text-gray-400 flex items-center gap-1 pt-3">
        We have a fixed pricing of 1
        <Image
          src={usdc}
          alt="USDC"
          width={25}
          height={25}
          className="inline-block"
        />
        per generation
      </p>
    </div>
  );
}
