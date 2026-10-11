import type { StatisticsSummary } from '../entities/StatisticsSummary'; export interface StatisticsRepository { getSummary(): Promise<StatisticsSummary> }
