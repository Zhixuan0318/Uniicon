export default function Button({children}){
    return(
        <button className="h-10 rounded-[10px] text-sm font-semibold flex items-center transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 bg-[#fff] text-[#36322F] hover:bg-[#f0f0f0] disabled:bg-[#f5f5f5] disabled:text-[#8c8885] disabled:hover:bg-[#f5f5f5] [box-shadow:0_0_0_1px_hsl(35deg_22%_90%),_0_1px_2px_hsl(32,_10%,_68%),_0_3px_3px_hsl(32,11%,82%),_0_-2px_hsl(58,4%,93%)_inset] hover:translate-y-[1px] hover:scale-[0.98] hover:[box-shadow:0_0_0_1px_hsl(35deg_22%_90%),_0_1px_2px_hsl(32,_10%,_68%)] active:translate-y-[2px] active:scale-[0.97] active:[box-shadow:0_0_0_1px_hsl(35deg_22%_90%),_inset_0_1px_1px_hsl(32,_10%,_68%)] disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:scale-100 px-4 py-1">
          {children}
        </button>
    );
}