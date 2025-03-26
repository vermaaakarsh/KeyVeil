import dynamic from "next/dynamic";

import AddPassword from "@/components/AddPassword";
import FilterDropdown from "@/components/FilterDropdown";
import SearchBar from "@/components/SearchBar";

const Passwords = dynamic(() => import("@/components/Passwords"));

export default function Home() {
  return (
    <div className="flex flex-col m-6">
      <section className="flex flex-col md:flex-row lg:flex-row justify-center items-center w-full gap-4 ">
        <SearchBar />
        <FilterDropdown />
        <AddPassword />
      </section>
      <section className="mt-10 ml-6.5 mr-6.5">
        <Passwords />
      </section>
      <section className=""></section>
    </div>
  );
}
