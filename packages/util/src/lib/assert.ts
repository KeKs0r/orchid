export function assert<T>(check: T, message: string): asserts check {
  if (!check) {
    throw new AssertError(message);
  }
}

export class AssertError extends Error {}
