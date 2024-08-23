import React, { useState, useCallback, useRef } from 'react';
import {
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryVoronoiContainer,
  VictoryAxis,
  VictoryLabel,
} from 'victory';
import { CHART_HEIGHT, CHART_WIDTH, TOOLTIP_HEIGHT, TOOLTIP_WIDTH } from '../constants/constants';
import { ChartProps, DataPoint } from '../../interfaces/interfaces';
import styles from './styles.module.css';

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const CustomDataPoint = ({ x, y, datum, index, setActiveTooltip }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
    setActiveTooltip(index);
  }, [index, setActiveTooltip]);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      setActiveTooltip(null);
    }, 200);
  }, [setActiveTooltip]);

  const getTooltipPosition = () => {
    const tooltipWidth = TOOLTIP_WIDTH;
    const tooltipHeight = TOOLTIP_HEIGHT;
    const chartWidth = CHART_WIDTH;
    const chartHeight = CHART_HEIGHT;

    let tooltipX = x - tooltipWidth / 2;
    let tooltipY = y - tooltipHeight - 10;
    let isBelow = false;

    if (tooltipX < 0) tooltipX = 0;
    if (tooltipX + tooltipWidth > chartWidth) tooltipX = chartWidth - tooltipWidth;

    if (tooltipY < 0) {
      tooltipY = y + 10;
      isBelow = true;
    }

    if (tooltipY + tooltipHeight > chartHeight) {
      tooltipY = y - tooltipHeight - 10;
      isBelow = false;
    }

    return { x: tooltipX, y: tooltipY, isBelow };
  };

  const tooltipPosition = getTooltipPosition();

  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={6}
        fill={isHovered ? '#1890ff' : '#722ed1'}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      {isHovered && datum.mention && (
        <foreignObject
          x={tooltipPosition.x}
          y={tooltipPosition.y}
          width={TOOLTIP_WIDTH}
          height={TOOLTIP_HEIGHT}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={styles["container__tooltip"]}>
            <strong>Title:</strong> {truncateText(datum.mention.title || '', 30)}<br />
            <strong>Ups:</strong> {datum.mention.ups}<br />
            <strong>Downs:</strong> {datum.mention.downs}<br />
            <strong>Date:</strong> {new Date(datum.mention.created || '').toLocaleDateString()}<br />
            <a href={`https://www.reddit.com/${datum.mention.permalink}`} target="_blank" rel="noopener noreferrer">Link to mention</a>
          </div>
        </foreignObject>
      )}
    </g>
  );
};

const Chart: React.FC<ChartProps> = ({ data }) => {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  if (!data || !data.followers || !data.mentions) {
    return <div>Loading data...</div>;
  }

  const chartData: DataPoint[] = data.followers;

  data.mentions.forEach((mention) => {
    const mentionDate = new Date(mention.created).toISOString().split('T')[0];
    const index = chartData.findIndex((point) => point.date === mentionDate);
    if (index !== -1) {
      chartData[index].mention = { ...mention };
    }
  });

  return (
    <div style={{ width: '100%', maxWidth: CHART_WIDTH, height: CHART_HEIGHT, margin: '0 auto' }}>
      <VictoryChart
        scale={{ x: 'time' }}
        containerComponent={<VictoryVoronoiContainer />}
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        domainPadding={{ y: [20, 20] }}
      >
        <VictoryAxis
          tickFormat={(x) => new Date(x).toLocaleDateString()}
          tickCount={6}
          style={{
            tickLabels: { fontSize: 10, padding: 5 },
            axis: { stroke: '#ccc' },
            grid: { stroke: '#f0f0f0' },
          }}
        />
        <VictoryAxis
          dependentAxis
          label="Followers"
          axisLabelComponent={<VictoryLabel dy={-20} />}
          style={{
            tickLabels: { fontSize: 10, padding: 5 },
            axis: { stroke: '#ccc' },
            grid: { stroke: '#f0f0f0' },
            axisLabel: { fontSize: 12, padding: 30 },
          }}
        />

        <VictoryLine
          data={chartData}
          x="date"
          y="followers"
          style={{
            data: { stroke: '#1890ff', strokeWidth: 2 },
          }}
        />

        <VictoryScatter
          data={chartData.filter((point) => point.mention)}
          x="date"
          y="followers"
          dataComponent={
            <CustomDataPoint
              activeTooltip={activeTooltip}
              setActiveTooltip={setActiveTooltip}
            />
          }
        />
      </VictoryChart>
    </div>
  );
};

export default Chart;