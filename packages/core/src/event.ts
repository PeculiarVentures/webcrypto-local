export class Event<T> {

  public readonly target: T;
  public readonly event: string;

  constructor(target: T, event: string) {
    this.target = target;
    this.event = event;
  }
}
