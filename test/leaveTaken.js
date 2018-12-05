import { Decider } from '../source/js/Decider'
require('chai').should()

describe('leaveTaken score', () => {
  const decider = new Decider()

  it('defaults to 100, even with no employee', () => {
    decider.leaveTakenScore().should.equal(100)
  })

  it('is 100 if leaveTaken is <= 25', () => {
    const employee1 = { leaveTaken: 24 }
    const employee2 = { leaveTaken: 25 }
    const employee3 = { leaveTaken: 26 }
    decider.leaveTakenScore(employee1).should.equal(100)
    decider.leaveTakenScore(employee2).should.equal(100)
    decider.leaveTakenScore(employee3).should.not.equal(100)
  })

  it('scales up exponentially between 26 and 365', () => {
    const employee1 = { leaveTaken: 26 }
    const employee2 = { leaveTaken: 27 }
    const employee3 = { leaveTaken: 29 }
    decider.leaveTakenScore(employee1).should.equal(100 - Math.pow(1,2)) // = 99
    decider.leaveTakenScore(employee2).should.equal(100 - Math.pow(2,2)) // = 96
    decider.leaveTakenScore(employee3).should.equal(100 - Math.pow(4,2)) // = 91
  })

  it('should not be less than 0', () => {
    const employee = { leaveTaken: 365 }
    decider.leaveTakenScore(employee).should.equal(0)
  })
 
})