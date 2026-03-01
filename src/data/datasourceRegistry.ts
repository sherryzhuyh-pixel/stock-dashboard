import { DataSource } from "./datasource";

type Factory<T> = (config?: any) => DataSource<T>;

const registry = new Map<string, Factory<any>>();

export const DataSourceRegistry = {
  register<T>(name: string, factory: Factory<T>): void {
    registry.set(name, factory);
  },
  get<T>(name: string, config?: any): DataSource<T> {
    const f = registry.get(name);
    if (!f) throw new Error(`DataSource not registered: ${name}`);
    return f(config);
  }
};
