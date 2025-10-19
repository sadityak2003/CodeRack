"use client";
import ResourceCard from "@/components/ResourceCard";
import TUF from "../../public/images/tuf.png";
import Geeks from "../../public/images/geeksforgeeks.png";
import LeetCode from "../../public/images/leetcode.png";
import Codeforces from "../../public/images/codeforces.png";
import InterviewBit from "../../public/images/interviewbit.png";
import CodeChef from "../../public/images/codechef.png";
import CS50 from "../../public/images/cs50.png"; 
import FreeCodeCamp from "../../public/images/freecodecamp.png"; 

const Resources = {
    tuf: {
        imageUrl: TUF,
        name: "Striver's A2Z DSA Sheet",
        desc: "A complete DSA roadmap for SDE roles structured & instructed by Raj Vikramaditya (SWE-III at Google).",
        link: "https://takeuforward.org/"
    },
    geeks: {
        imageUrl: Geeks,
        name: "GeeksforGeeks",
        desc: "A complete computer science portal for your all needs.",
        link: "https://www.geeksforgeeks.org/"
    },
    leetcode: {
        imageUrl: LeetCode,
        name: "LeetCode",
        desc: "Platform to practice coding problems and prepare for tech interviews.",
        link: "https://leetcode.com/"
    },
    codeforces: {
        imageUrl: Codeforces,
        name: "Codeforces",
        desc: "Competitive programming platform for sharpening problem-solving skills.",
        link: "https://codeforces.com/"
    },
    interviewbit: {
        imageUrl: InterviewBit,
        name: "InterviewBit",
        desc: "Free platform to prepare for coding interviews through curated problems.",
        link: "https://www.interviewbit.com/"
    },
    codechef: {
        imageUrl: CodeChef,
        name: "CodeChef",
        desc: "Competitive programming contests and practice problems to improve your coding skills.",
        link: "https://www.codechef.com/"
    },
    cs50: {
        imageUrl: CS50,
        name: "Harvard's CS50",
        desc: "World-famous introductory computer science course by Harvard — free for everyone.",
        link: "https://cs50.harvard.edu/x/"
    },
    freecodecamp: {
        imageUrl: FreeCodeCamp,
        name: "freeCodeCamp",
        desc: "Learn to code for free through interactive tutorials and projects.",
        link: "https://www.freecodecamp.org/"
    },
}


export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 items-center justify-center md:pt-60 pt-30 md:px-20 px-5 pb-20 relative">
      <div className="flex flex-col items-center">
          <h1 className="md:text-5xl text-2xl font-bold mb-4 text-gray-700">
            Welcome to Coding Geeks
          </h1>
          <p className="md:text-lg text-sm mb-8 text-gray-500">
            Your one-stop community for coding solutions!
          </p>
          <a
            href="/solutions"
            className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Explore Solutions
          </a>
        </div>

        <div className="md:w-50 md:h-50 w-20 h-20 bg-amber-600 shadow transform rotate-35 absolute md:top-40 md:left-100 top-25 left-10 opacity-20 z-0">
        </div>
        

        <div className="items-start mt-30">
            <h2 className="md:text-2xl text-lg text-gray-600 font-semibold">Resources</h2>
            <p className="md:text-md text-xs text-gray-500">Explore our curated resources to enhance your coding skills.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ResourceCard 
              imageURL={Resources.tuf.imageUrl}
              name={Resources.tuf.name}
              desc={Resources.tuf.desc}
              link={Resources.tuf.link}       
            />
            <ResourceCard 
              imageURL={Resources.geeks.imageUrl}
              name={Resources.geeks.name}
              desc={Resources.geeks.desc}
              link={Resources.geeks.link}
            />
             <ResourceCard 
              imageURL={Resources.leetcode.imageUrl}
              name={Resources.leetcode.name}
              desc={Resources.leetcode.desc}
              link={Resources.leetcode.link}
            />
            <ResourceCard 
              imageURL={Resources.codeforces.imageUrl}
              name={Resources.codeforces.name}
              desc={Resources.codeforces.desc}
              link={Resources.codeforces.link}
            />
            <ResourceCard 
              imageURL={Resources.codechef.imageUrl}
              name={Resources.codechef.name}
              desc={Resources.codechef.desc}
              link={Resources.codechef.link}
            />
             <ResourceCard 
              imageURL={Resources.cs50.imageUrl}
              name={Resources.cs50.name}
              desc={Resources.cs50.desc}
              link={Resources.cs50.link}
            />
            <ResourceCard 
              imageURL={Resources.freecodecamp.imageUrl}
              name={Resources.freecodecamp.name}
              desc={Resources.freecodecamp.desc}
              link={Resources.freecodecamp.link}
            />
            <ResourceCard 
              imageURL={Resources.interviewbit.imageUrl}
              name={Resources.interviewbit.name}
              desc={Resources.interviewbit.desc}
              link={Resources.interviewbit.link}
            />
            </div>

        <div className="flex flex-col items-center mt-30">
          <h2 className="md:text-3xl text-xl font-semibold text-gray-600">Join Us Today!</h2>
          <p className="md:text-md text-xs text-center text-gray-500">Become a part of our vibrant community & help geeks with your solutions.</p>
        </div>
    </div>
  );
} 