import SentenceGenerator from './SentenceGenerator'

export class Decider {

  // When you create a new instance of Decider, you
  // pass it your algorithm weights, which are what
  // the algorithm uses internally for scoring.
  constructor (weights) {
    this.weights = weights
    if (weights && weights.length) {
      this.capacityWeight     = weights[0].value
      this.seniorityWeight    = weights[1].value
      this.ageWeight          = weights[2].value
      this.genderWeight       = weights[3].value
      this.demeanorWeight     = weights[4].value
      this.tenureWeight       = weights[5].value
      this.leaveWeight        = weights[6].value
      this.productivityWeight = weights[7].value
      this.stockWeight        = weights[8].value
      this.valuationWeight    = weights[9].value
      this.projectionWeight   = weights[10].value
    }
  }

  // Takes an array of employees and returns them, each appended with a score
  score (employees) {
    var scoredEmployees
    if (this.weights.length) {
      scoredEmployees = employees.map(this.scoreIndividual, this)
    }
    return scoredEmployees
  }

  scoreIndividual (employee) {

    var scores = []

    scores.push({
      name: 'age',
      score: this.ageScore(employee),
      weight: this.ageWeight
    })

    scores.push({
      name: 'gender',
      score: this.genderScore(employee),
      weight: this.genderWeight
    })
  
    scores.push({
      name: 'seniority',
      score: this.seniorityScore(employee),
      weight: this.seniorityWeight
    })
  
    scores.push({
      name: 'demeanor',
      score: this.demeanorScore(employee),
      weight: this.demeanorWeight
    })
  
    scores.push({
      name: 'capacity',
      score: this.capacityScore(employee),
      weight: this.capacityWeight
    })
  
    scores.push({
      name: 'productivity',
      score: this.productivityScore(employee),
      weight: this.productivityWeight
    })
  
    scores.push({
      name: 'tenure',
      score: this.tenureScore(employee),
      weight: this.tenureWeight
    })
  
    scores.push({
      name: 'leaveTaken',
      score: this.leaveTakenScore(employee),
      weight: this.leaveWeight
    })
  
    // the decision
    employee.score = this.getAggregateScore(scores)
    employee.decision = this.makeDecision(scores)
    employee.decisionSentence = SentenceGenerator.sentence(scores, employee)

    // an easy-to-parse array to display employee stats
    employee.displayStats = [
      { title: 'Age', value: employee.age },
      { title: 'Team Size', value: employee.teamSize },
      { title: 'Gender', value: employee.gender },
      { title: 'Scheduled Work', value: `${employee.scheduledWork} Hours` },
      { title: 'Demeanor', value: employee.demeanor },
      { title: 'Leave Taken', value: `${employee.leaveTaken} Days` },
      { title: 'Tenure', value: `${employee.tenure} Months` },
      { title: 'Productivity', value: `${employee.productivity}%` }
    ]

    // don't leave any values undefined
    employee.displayStats = employee.displayStats.map((stat) => {
      if (!stat.value) stat.value = '-'
      return stat
    })

    return employee
  }

  // makes an aggregate score from all the scores and weightings
  getAggregateScore(scores) {
    // this adds a weighted score to each score object
    var scoresMultiplied = scores.map((item) => {
      item.weightedScore = item.score * item.weight
      return item
    })

    // get the sum of all weighted scores
    var sumOfWeightedScores = 0
    scores.map((item) => {
      sumOfWeightedScores = sumOfWeightedScores + item.weightedScore
    })

    // get the sum of all weights
    var sumOfWeights = 0
    scores.map((item) => {
      sumOfWeights = sumOfWeights + item.weight
    })

    // just return 50 if all the sliders are switched off
    if (sumOfWeights === 0) return 50
    else return Math.round(sumOfWeightedScores/sumOfWeights)
  }

  // this function returns true or false depending
  // on how high the score is
  makeDecision(scores) {
    if (this.getAggregateScore(scores) > 70) return true
    else return false
  }

  ageScore (employee) {
    var result = 50
    if (!employee || !employee.age) return result
    else if (employee.age > 65) return 100
    else if (employee.age > 24) {
      const yearsOlderThan24 = employee.age - 24
      const upliftPerYear = 0.8
      return result + (upliftPerYear * yearsOlderThan24)
    } else return result
  }

  genderScore (employee) {
    if (employee && employee.gender === 'male') return 100
    return 95
  }

  seniorityScore (employee) {
    if (employee && employee.seniority) return 25 + employee.seniority * 12.5
    else return 25
  }

  demeanorScore (employee) {
    if (!employee || !employee.demeanor) return 25
    var multiplier
    switch (employee.demeanor) {
      case 'Arrogant':
        multiplier = 1
        break
      case 'Angry':
        multiplier = 2
        break
      case 'Tired':
        multiplier = 3
        break
      case 'Happy':
        multiplier = 4
        break
      case 'Nice':
        multiplier = 5
        break
      case 'Stressed':
        multiplier = 6
        break
      case 'Sad':
        multiplier = 7
        break
      default:
        multiplier = 1
        break
    }
    return 25 + multiplier * 12.5
  }

  capacityScore (employee) {
    // not done
    return 50
  }

  productivityScore (employee) {
    return employee.productivity
  }

  tenureScore (employee) {
    if (!employee || !employee.tenure) return 50
    else {
      const yearsOver1 = Math.round(employee.tenure - 1)
      if (employee.tenure < 1) return 50
      else if (employee.tenure > 9) return 100
      else return (55 + yearsOver1 * 5)
    }
  }

  leaveTakenScore (employee) {
    const policy = 25
    if (!employee) return 100
    else if (!employee.leaveTaken) return 100
    else if (employee.leaveTaken <= policy) {
      return 100
    }
    else {
      const daysOverPolicy = employee.leaveTaken - policy
      var score = 100 - Math.pow((daysOverPolicy), 2)
      score = Math.max(score, 0)
      return score
    }
  }

}
