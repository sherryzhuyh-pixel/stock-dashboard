import { DataSource } from './datasource'
export class DataSourceRegistry {
  private static map = new Map<string, DataSource>();
  static register(ds: DataSource) { this.map.set(ds.name, ds); }
  static get(name: string) { return this.map.get(name); }
}
