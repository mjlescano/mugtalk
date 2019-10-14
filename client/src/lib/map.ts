export default function map<V, T>(
  iterable: Iterable<V>,
  fn: (V) => T
): Array<T> {
  const values: Array<T> = []

  for (let value of iterable) {
    values.push(fn(value))
  }

  return values
}
