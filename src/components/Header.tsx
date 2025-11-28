import { Outlet } from "react-router";
import { FaBolt, FaGithub } from "react-icons/fa";
import { ImProfile } from "react-icons/im";

export default function Header() {
  return (
    <>
      <header className="shadow p-4 mb-2 border-b-2 border-background bg-dark flex flex-col sm:flex-row sm:justify-between items-center gap-4">
        {/* Website Title */}
        <h1 className="text-3xl ml-8 font-bold text-white hover:text-neutral-300 whitespace-nowrap shrink-0">
          <a href="/">
            Sparky
          </a>
          <FaBolt className="bolt-icon ml-4 inline h-[1em]" />
        </h1>

        {/* Navigation Links */}
        <nav className="flex items-center gap-4 text-white shrink-0 mr-2">
          {/* GitHub Link */}
          <a 
            className="hover:text-neutral-300 whitespace-nowrap" 
            href="https://github.com/jelenis/sparky"
          >
            <span className="md:inline hidden">View on GitHub</span>
            <FaGithub className="inline mb-1 ml-3 h-8 w-8" />
          </a>

          <div className="divider divider-horizontal"></div>

          {/* Personal Website Link */}
          <a 
            className="hover:text-neutral-300 whitespace-nowrap" 
            href="https://johnelenis.ca"
          >
            <span className="md:inline hidden">My Personal Website</span>
            <ImProfile className="inline mb-1 ml-3 h-8 w-8" />
          </a>
        </nav>
      </header>

      <Outlet />
    </>
  );
}