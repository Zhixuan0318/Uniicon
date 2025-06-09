import Image from "next/image";
import chicken from "../../public/chicken.gif";
import fly from "../../public/fly.gif";
import crocodile from "../../public/crocodile.gif";
import hotair_balloon from "../../public/hotair-balloon.gif";

export default function Showcase() {
  return (
    <div className="flex flex-row flex-nowrap justify-center gap-4 mt-12 mb-8 px-10">
      <div className="rounded-4xl overflow-hidden px-5 py-4 bg-white shadow-gray-100 shadow-md">
        <Image src={chicken} alt="Chicken GIF" className="object-contain" unoptimized/>
      </div>
      <div className="rounded-4xl overflow-hidden px-5 py-4 bg-white shadow-gray-100 shadow-md">
        <Image src={crocodile} alt="Crocs GIF" className="object-contain"  unoptimized/>
      </div>
      <div className="rounded-4xl overflow-hidden px-5 py-4 bg-white shadow-gray-100 shadow-md">
        <Image src={hotair_balloon} alt="Hotair Balloon GIF" className="object-contain" unoptimized/>
      </div>
      <div className="rounded-4xl overflow-hidden px-5 py-4 bg-white shadow-gray-100 shadow-md">
        <Image src={fly} alt="Fly GIF" className="object-contain" unoptimized/>
      </div>
    </div>
  );
}
