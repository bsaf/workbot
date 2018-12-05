import { Decider } from '../source/js/Decider'
require('chai').should()

describe('Seniority score', () => {
  const decider = new Decider()

  it('defaults to 25%', () => {
    decider.seniorityScore().should.equal(25)
  })

  it('each level gets 12.5% more than the previous level', () => {
    const employee1 = { seniority: 1 }
    const employee2 = { seniority: 2 }
    const employee3 = { seniority: 3 }
    decider.seniorityScore(employee1).should.equal(25 + 12.5)
    decider.seniorityScore(employee2).should.equal(25 + 2 * 12.5)
    decider.seniorityScore(employee3).should.equal(25 + 3 * 12.5)
  })
})
