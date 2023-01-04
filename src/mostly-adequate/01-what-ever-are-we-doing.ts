class Flock {
  constructor(public seagulls: number) {}

  conjoin(other: Flock) {
    this.seagulls += other.seagulls;
    return this;
  }

  breed(other: Flock) {
    this.seagulls = this.seagulls * other.seagulls;
    return this;
  }
}

export const container = (logger: (...v: any) => void) => {
  // A Brief Encounter
  (() => {
    logger('classy');
    const flockA = new Flock(4);
    const flockB = new Flock(2);
    const flockC = new Flock(0);
    const result = flockA
      .conjoin(flockC)
      .breed(flockB)
      .conjoin(flockA.breed(flockB)).seagulls;

    logger(result);
  })();

  (() => {
    logger('functional');
    const conjoin = (flockX: number, flockY: number) => flockX + flockY;
    const breed = (flockX: number, flockY: number) => flockX * flockY;

    const add = (x: number, y: number) => x + y;
    const multiply = (x: number, y: number) => x * y;

    const flockA = 4;
    const flockB = 2;
    const flockC = 0;
    logger(
      conjoin(breed(flockB, conjoin(flockA, flockC)), breed(flockA, flockB))
    );
    logger(
      'original result =',
      add(multiply(flockB, add(flockA, flockC)), multiply(flockA, flockB))
    );
    logger(
      'identity applied =',
      add(multiply(flockB, flockA), multiply(flockA, flockB))
    );
    logger('distributive applied =', multiply(flockB, add(flockA, flockA)));
  })();
};
