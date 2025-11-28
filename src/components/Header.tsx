import { Outlet } from "react-router";
import { FaBolt, FaGithub} from "react-icons/fa";
import { ImProfile } from "react-icons/im";

export default function Header() {
  return ( 
    <>
    <header className="justify-items-center sm:justify-items-normal sm:justify-start shadow p-4  mb-2 border-b-2 border-background bg-dark grid grid-cols-1 sm:grid-cols-2 gap-4 ">
      <h1 className="  mt-2 text-3xl font-bold  text-white hover:text-gray-300 whitespace-nowrap"><a href="/">Electrician Toolkit</a>   <FaBolt className=" inline h-[1em]" /></h1>
      <nav className="flex sm:justify-end  items-center gap-4  justify-evenly flex-wrap text-white">
        <a className=" hover:text-gray-300" href="https://github.com/jelenis/sparky">View on GitHub<FaGithub className="inline mb-1 ml-3 h-8 w-8" /></a>
        <div className="divider"></div>

        <div className="divider"></div>
        <a className=" hover:text-gray-300" href="https://johnelenis.ca">
          My Personal Website<ImProfile className="inline mb-1 ml-3 h-8 w-8" />
        </a>
      </nav>
    </header>
      <Outlet />
    </>
  );
}