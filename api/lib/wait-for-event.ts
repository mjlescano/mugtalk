import { EventEmitter } from 'events'
import Error from './error'

interface WaitForEventsOptions {
  /** max amount of milliseconds to wait for the event */
  timeout?: number
}

/**
 * Promisified version to wait once for an event on an eventEmitter
 * @param emitter object of witch to listen event emit
 * @param evtName eventName to listen to once
 * @param options
 */
export default (
  emitter: EventEmitter,
  evtName: string,
  options: WaitForEventsOptions = {}
) => {
  const { timeout = 10000 } = options

  return new Promise((resolve, reject) => {
    const cb = (...args) => {
      clearTimeout(timeoutId)
      resolve(...args)
    }

    emitter.once(evtName, cb)

    const timeoutId = setTimeout(() => {
      emitter.removeListener(evtName, cb)
      const err = new Error(
        `Event "${evtName}" weren't emitted after ${timeout}ms`,
        'EVENT_TIMEOUT'
      )
      reject(err)
    }, timeout)
  })
}
