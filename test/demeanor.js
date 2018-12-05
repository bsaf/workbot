import { Decider } from '../source/js/Decider'
require('chai').should()

describe('Demeanor score', () => {
  const decider = new Decider()

  it('defaults to 25%', () => {
    decider.demeanorScore().should.equal(25)
  })

  it('each level gets 12.5% more than the previous level', () => {
    const employee1 = { demeanor: "Arrogant" }
    const employee2 = { demeanor: "Angry" }
    const employee3 = { demeanor: "Tired" }
    decider.demeanorScore(employee1).should.equal(25 + 12.5)
    decider.demeanorScore(employee2).should.equal(25 + 2 * 12.5)
    decider.demeanorScore(employee3).should.equal(25 + 3 * 12.5)
  })
})
