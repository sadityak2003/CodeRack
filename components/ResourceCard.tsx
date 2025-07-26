import Link from "next/link";
import Image from "next/image";
import type { StaticImageData } from "next/image";

export default function ResourceCard({ link, imageURL, name, desc }: { 
  link: string; 
  imageURL: string | StaticImageData; 
  name: string; 
  desc: string; 
}) {
  return (
    <Link href={link} className="flex flex-col w-full p-2 bg-white shadow-md rounded-lg mt-4 cursor-pointer hover:shadow-lg transition hover:shadow-orange-500">
      <div className="flex w-full h-60 bg-gray-200 p-5 rounded-lg items-center justify-center">
        <Image src={imageURL} width={300} height={300} alt={name} />
      </div>
      <h2 className="md:text-lg text-md text-gray-600 mt-5">{name}</h2>
      <p className="md:text-sm text-xs text-gray-500 mt-2">{desc}</p>
    </Link>
  );
}