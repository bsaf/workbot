import { Decider } from '../source/js/Decider'
require('chai').should()

describe('Time in service score', () => {
  const decider = new Decider()

  it('defaults to 50, even with no employee', () => {
    decider.tenureScore().should.equal(50)
  })

  it('is 50 if time in service is < 1 year', () => {
    const employee1 = { tenure: 0.5 }
    const employee2 = { tenure: 1 }
    decider.tenureScore(employee1).should.equal(50)
    decider.tenureScore(employee2).should.not.equal(50)
  })

  it('scales up by 5 per year between 1 and 10', () => {
    const employee1 = { tenure: 1 }
    const employee2 = { tenure: 2 }
    const employee3 = { tenure: 3 }
    decider.tenureScore(employee1).should.equal(50 + 5)
    decider.tenureScore(employee2).should.equal(50 + 2 * 5)
    decider.tenureScore(employee3).should.equal(50 + 3 * 5)
  })

  it('is 100 if time in service > 10', () => {
    const employee = { tenure: 11 }
    decider.tenureScore(employee).should.equal(100)
  })
})
