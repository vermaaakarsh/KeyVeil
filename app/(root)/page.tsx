"use client";
import FilterDropdown from "@/components/FilterDropdown";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <div className="flex m-6">
      <section className="flex flex-col md:flex-row lg:flex-row md:justify-center lg:justify-end items-center w-full gap-2 ">
        <SearchBar />
        <FilterDropdown />
      </section>
      <section className=""></section>
      <section className=""></section>
    </div>
  );
}
