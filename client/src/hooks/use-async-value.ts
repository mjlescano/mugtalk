import { useState, useEffect } from 'react'

export default function useAsyncValue (fn: Function) {
  const [value, setValue] = useState<null | string>(null);

  useEffect(() => {
    if (value !== null) return

    ;(async () => {
      const newValue = await fn()
      setValue(newValue)
    })()
  });

  return value
}
