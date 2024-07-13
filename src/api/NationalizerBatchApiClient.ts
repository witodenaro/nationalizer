import { Batcher } from '../utils/batcher';
import nationalizerApiClient from './NationalizerApiClient';

class NationalizerBatchApiClient {
  private client = nationalizerApiClient;
  private maxBatchSize = 10;
  private batcher = new Batcher(this.maxBatchSize);

  async fetch(names: string[]) {
    const nameBatches = this.batcher.batch(names);
    return await this.fetchBatch(nameBatches);
  }

  private async fetchBatch(names: string[][]) {
    const responses = await Promise.all(
      names.map((name) => this.client.fetchMany(name))
    );

    return responses.flat();
  }
}

export default new NationalizerBatchApiClient();
