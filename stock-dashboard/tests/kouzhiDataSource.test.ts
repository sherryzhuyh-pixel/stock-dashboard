import { describe, it, expect } from 'vitest';
import { KouzhiDataSource } from '../src/datasources/kouzhiDataSource';
import { DataQuery } from '../src/data/datasource';

describe('KouzhiDataSource', () => {
  it('fetch returns data', async () => {
    const ds = new KouzhiDataSource();
    const res = await ds.fetch({ source: 'kouzhi' } as DataQuery);
    expect(res).toHaveProperty('data');
  });
});
