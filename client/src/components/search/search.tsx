import React from "react"
import { Button, DatePicker, Flex, Input, Spin } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { DateFilter, SearchProps } from "../../interfaces/interfaces";

const Search: React.FC<SearchProps> = ({ gameName, setFilterDates, onSearch, isLoading, error }) => {
  const handleDateChange = (date: Dayjs | null, dateType: 'from' | 'to') => {
    setFilterDates((prev: DateFilter) => ({
      ...prev,
      [dateType]: date ? date.format('YYYY-MM-DD') : null,
    }));
  };

  return (
    <Flex vertical style={{ padding: "50px 0" }} justify="space-between">
      <span style={{ marginLeft: 15, fontSize: 14 }}>{error ? error.message : "Input the same game name as in the Steam"}</span>
      <Flex style={{ width: "100%", height: "50%", margin: 10 }}>
        <Input ref={gameName} style={{ marginRight: 10 }} />
        <Button
          onClick={() => !isLoading && onSearch()}
          style={{ width: 100, marginLeft: 10 }}
        >
          {!isLoading ? "Get stats!" : <Spin />}
        </Button>
      </Flex>
      <Flex justify="space-around" style={{ width: "100%", height: "50%", margin: 10 }}>
        <DatePicker
          placeholder="From"
          onChange={(date: Dayjs | null) => handleDateChange(date, 'from')}
          disabledDate={(current) => current && current.isAfter(dayjs().endOf('day'))}
        />
        <DatePicker
          placeholder="To"
          onChange={(date: Dayjs | null) => handleDateChange(date, 'to')}
          disabledDate={(current) => current && current.isAfter(dayjs().endOf('day'))}
        />
      </Flex>
    </Flex>
  )
};

export default Search;