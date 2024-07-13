export class Batcher {
  constructor(private batchSize: number) {}

  batch<T>(items: T[]): T[][] {
    return items.reduce<T[][]>((batches, item) => {
      const latestBatch = this.getLatest(batches);

      if (this.isFullBatch(latestBatch)) {
        return this.addNewBatch(batches, item);
      }

      return this.extendBatch(batches, item);
    }, []);
  }

  private getLatest<T>(batch: T[][]) {
    return batch.at(-1) || [];
  }

  private isFullBatch<T>(batch: T[]) {
    return batch.length === this.batchSize;
  }

  private addNewBatch<T>(batches: T[][], firstItem: T) {
    return [...batches, [firstItem]];
  }

  private extendBatch<T>(batches: T[][], item: T) {
    return [...batches.slice(0, -1), [...this.getLatest(batches), item]];
  }
}
