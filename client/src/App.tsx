import React, { useRef, useState } from "react"
import { Flex, InputRef } from "antd";
import Search from "./components/search/search";
import Chart from "./components/chart/chart";
import { getGameStats } from "./http/http";
import { APIResponse, DateFilter } from "./interfaces/interfaces";
import { ResponseError } from "./exceptions/exceptions";
import styles from './styles.module.css';

const App: React.FC = () => {
  const [error, setError] = useState<ResponseError | null>(null);
  const [filterDates, setFilterDates] = useState<DateFilter>({ from: null, to: null });
  const gameName = useRef<InputRef>(null);
  const [gameStats, setGameStats] = useState<APIResponse>({ mentions: [], followers: [] });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onGameFound = async () => {
    if (!gameName.current?.input?.value) return;

    try {
      setError(null);
      setIsLoading(true);
      const stats = await getGameStats(gameName.current.input.value, filterDates);
      
      setGameStats(stats);
    } catch (error) {
      console.error(error);
      setError(error as ResponseError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Flex className={styles["app"]} justify="center" align="center" vertical>
      <Search
        gameName={gameName}
        setFilterDates={setFilterDates}
        onSearch={onGameFound}
        isLoading={isLoading}
        error={error}
      />
      <Chart data={gameStats} />
    </Flex>
  )
}

export default App;