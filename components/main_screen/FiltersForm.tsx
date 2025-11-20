import FilterToggle from "@/components/FilterToggle";

import { type PostFilter } from "@/types";
import { Dispatch, SetStateAction } from "react";

const FiltersForm = ({
  setTypeFilter,
  setTitleFilter,
  setStartDateFilter,
  setEndDateFilter,
  setPlaceFilter,
}: {
  setTypeFilter: Dispatch<SetStateAction<PostFilter>>;
  setTitleFilter: Dispatch<SetStateAction<string>>;
  setStartDateFilter: Dispatch<SetStateAction<string>>;
  setEndDateFilter: Dispatch<SetStateAction<string>>;
  setPlaceFilter: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <form className="bg-white rounded-xl p-4 flex flex-col">
      <FilterToggle filter="all" setFilter={setTypeFilter} />
      <div>
        <input
          name="title_filter"
          type="text"
          onChange={(e) => setTitleFilter(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />
      </div>
    </form>
  );
};

export default FiltersForm;
