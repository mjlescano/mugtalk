export function delay(time) {
  return new Promise(function (accept) {
    setTimeout(accept, time)
  })
}

export function timeout(promise, time) {
  return Promise.race([promise, delay(time).then(function () {
    throw new Error(`Operation timed out after ${time}ms`);
  })])
}
