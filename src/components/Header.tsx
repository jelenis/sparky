import { Outlet } from "react-router";
import { FaBolt, FaGithub } from "react-icons/fa";
export default function Header() {
  return ( 
    <>
    <header className=" p-4  mb-2 border-b-2 border-background bg-dark grid  lg:grid-cols-2 grid-cols-1 gap-4 ">
      <h1 className="text-3xl font-bold text-center text-white hover:text-gray-300"><a href="/">Electrician Toolkit</a>   <FaBolt className=" inline h-[1em]" /></h1>
      <nav className="flex justify-center lg:justify-end items-center gap-4 text-white hover:text-gray-300">
        <a className="" href="https://github.com/jelenis/sparky">View on GitHub<FaGithub className="inline mb-1 ml-3 h-8 w-8" /></a>
      </nav>
    </header>
      <Outlet />
    </>
  );
}