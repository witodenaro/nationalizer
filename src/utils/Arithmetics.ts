class Arithmetics {
  getAverage(a: number, b: number): number {
    const average = (a + b) / 2;
    return Number(average.toFixed(2));
  }
}

export default new Arithmetics();
