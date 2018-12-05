import { Decider } from '../source/js/Decider'
require('chai').should()

describe('Gender score', () => {
  const decider = new Decider()

  it('defaults to 95', () => {
    decider.genderScore().should.equal(95)
  })

  it('is 100 if the employee is male', () => {
    const employee = { gender: 'male' }
    decider.genderScore(employee).should.equal(100)
  })
})
