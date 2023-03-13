import { buildUrl } from './src/helps/url'

console.log(
  buildUrl('/simple/get#hash', {
    foo: 123,
    foo1: [123, 345],
    foo2: {
      boo: 123
    },
    foo3: new Date(),
    foo4: null
  })
)
