/**
 * Owns exactly one responsibility: start time, completion time, and elapsed
 * time — kept separate from `services/PuzzleSessionImpl.ts` so "how time is
 * tracked" can be tested (and reasoned about) independently of engine
 * orchestration. `now` is injectable so tests can fake elapsed time without
 * real sleeps or fragile timing assertions.
 */
export class SessionClock {
  readonly startedAt: number;
  private completedAtValue: number | null = null;

  constructor(private readonly now: () => number = Date.now) {
    this.startedAt = this.now();
  }

  complete(): void {
    if (this.completedAtValue === null) {
      this.completedAtValue = this.now();
    }
  }

  get completedAt(): number | null {
    return this.completedAtValue;
  }

  get elapsedMs(): number {
    return (this.completedAtValue ?? this.now()) - this.startedAt;
  }
}
