import { InputRef } from "antd";
import { RefObject } from "react";
import { DateFilter } from "../date-filter.interface";

interface SearchProps {
  gameName: RefObject<InputRef>;
  setFilterDates: (value: DateFilter | ((prev: DateFilter) => DateFilter)) => void;
  onSearch: () => void;
  isLoading: boolean;
  error: Error | null;
}

export { type SearchProps };