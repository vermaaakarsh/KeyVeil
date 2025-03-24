import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
      <input
        type="text"
        placeholder="Search by name..."
        className="w-full rounded-md border border-border bg-input py-2 pl-10 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
};

export default SearchBar;
