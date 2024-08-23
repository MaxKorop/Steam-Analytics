import React from "react"
import { Button, DatePicker, Flex, Input, Spin } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { DateFilter, SearchProps } from "../../interfaces/interfaces";
import styles from './styles.module.css';

const Search: React.FC<SearchProps> = ({ gameName, setFilterDates, onSearch, isLoading, error }) => {
  const handleDateChange = (date: Dayjs | null, dateType: 'from' | 'to') => {
    setFilterDates((prev: DateFilter) => ({
      ...prev,
      [dateType]: date ? date.format('YYYY-MM-DD') : null,
    }));
  };

  return (
    <Flex vertical style={{ padding: "50px 0" }} justify="space-between">
      <span className={styles["message"]} style={error ? { color: "crimson" } : { color: "darkgrey" }}>{error ? error.message : "Input the same game name as in the Steam"}</span>
      <Flex className={styles["container__horizontal"]}>
        <Input ref={gameName} style={{ marginRight: 10 }} />
        <Button
          onClick={() => !isLoading && onSearch()}
          className={styles["button"]}
        >
          {!isLoading ? "Get stats!" : <Spin />}
        </Button>
      </Flex>
      <Flex justify="space-around" className={styles["container__horizontal"]}>
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