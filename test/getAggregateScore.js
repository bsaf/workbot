import { Decider } from '../source/js/Decider'
require('chai').should()

describe('Aggregate score', () => {
  const decider = new Decider()

  it('with only one score with a weight of 100 it returns the unweighted score', () => {
    const scores = [
      { name: 'age', score: 50, weight: 100 }
    ]
    decider.getAggregateScore(scores).should.equal(50)
  })

  it('ignores a score if its weight is zero', () => {
    const scores = [
      { name: 'age', score: 50, weight: 0 },
      { name: 'gender', score: 99, weight: 100 }
    ]
    decider.getAggregateScore(scores).should.equal(99)
  })

  it('returns 50 if all weights are zero', () => {
    const scores = [
      { name: 'age', score: 50, weight: 0 },
      { name: 'gender', score: 99, weight: 0 }
    ]
    decider.getAggregateScore(scores).should.equal(50)
  })

})
