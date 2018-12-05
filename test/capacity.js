import { Decider } from '../source/js/Decider'
require('chai').should()

describe('Capacity score', () => {
  const decider = new Decider()

  it('defaults to 50', () => {
    decider.capacityScore().should.equal(50)
  })

})
