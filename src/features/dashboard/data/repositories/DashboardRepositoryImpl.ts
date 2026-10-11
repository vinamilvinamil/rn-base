import type { DashboardRepository } from '../../domain/repositories/DashboardRepository'; import { DashboardLocalDataSource } from '../datasources/DashboardLocalDataSource';
export class DashboardRepositoryImpl implements DashboardRepository { constructor(private source = new DashboardLocalDataSource()) {} getSummary() { return this.source.getSummary(); } }
