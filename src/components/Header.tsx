import { Outlet } from "react-router";
import { FaBolt } from "react-icons/fa";
export default function Header() {
  return ( 
    <>
    <header className=" p-4  mb-2 border-b-2 border-background bg-dark grid  lg:grid-cols-2 grid-cols-1 gap-4 ">
      <h1 className="text-3xl font-bold text-center text-white">Electrician Toolkit   <FaBolt className=" inline h-[1em]" /></h1>
    </header>
      <Outlet />
    </>
  );
}