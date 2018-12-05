import { Decider } from '../source/js/Decider'
require('chai').should()

describe('Age score', () => {
  const decider = new Decider()

  it('defaults to 50, even with no employee', () => {
    decider.ageScore().should.equal(50)
  })

  it('is 50 if age is < 25', () => {
    const employee1 = { age: 24 }
    const employee2 = { age: 25 }
    decider.ageScore(employee1).should.equal(50)
    decider.ageScore(employee2).should.not.equal(50)
  })

  it('scales up by 0.85 per year between 25 and 65', () => {
    const employee1 = { age: 25 }
    const employee2 = { age: 26 }
    const employee3 = { age: 27 }
    decider.ageScore(employee1).should.equal(50 + 0.8)
    decider.ageScore(employee2).should.equal(50 + 2 * 0.8)
    decider.ageScore(employee3).should.equal(50 + 3 * 0.8)
  })

  it('is 100 if age > 65', () => {
    const employee = { age: 66 }
    decider.ageScore(employee).should.equal(100)
  })
})
