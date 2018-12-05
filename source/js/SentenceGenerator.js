import Utils from './Utils'

export default {

  sentence(scores, employee) {
    const deserving = employee.decision
    const gender = employee.gender
    var demeanor
    if (employee.demeanor) {
      demeanor = employee.demeanor.toLowerCase()
    }

    var sentence = ""
    var pronoun = ""
    var hisOrHer = ""
    var manOrWoman = ""

    if (gender === 'male') {
      pronoun = "he"
      manOrWoman = "man"
      hisOrHer = "his"
    }
    else if (gender === 'female') {
      pronoun = "she"
      manOrWoman = "woman"
      hisOrHer = "her"
    }
    else {
      pronoun = "they"
    }

    // Start the sentence (she is...)
    if (gender === 'male') {
      sentence = sentence + "He is "
    }
    else if (gender === 'female') {
      sentence = sentence + "She is "
    }
    else {
      sentence = sentence + "They are "
    }

    // Deserving or undeserving
    if (deserving) sentence = sentence + " deserving because "
    else sentence = sentence + " undeserving because "

    // sort scores by weighted score
    scores.sort((a, b) => {
      return b.weightedScore - a.weightedScore
    })

    // if it's a yes, take the top 3 scores and explain them
    if (deserving) {
      scores = scores.slice(0, 3)
    }
    // if it's a no, take the bottom 3 scores and explain then
    else if (!deserving) {
      // get rid of scores with a weightedScore of 0
      scores = scores.filter((item) => {
        return item.weightedScore != 0
      })
      scores = scores.slice((scores.length - 3), scores.length).reverse()
    }

    let index = 0
    for (let attribute of scores) {
      if (index === 0) {}
      else if (index === 1) sentence += ", because "
      else if (index === 2) sentence += " and because "
      index++
      switch (attribute.name) {
        case 'gender':
          if (deserving) sentence += `${pronoun} is a ${manOrWoman}`
          else { sentence += `${pronoun} is a ${manOrWoman}` }
          break
        case 'age':
          if (deserving) sentence += `${pronoun} is older and wiser`
          else sentence += `${pronoun} is too young`
          break
        case 'demeanor':
          if (deserving) sentence += `${pronoun} is ${demeanor}`
          else sentence += `${pronoun} is ${demeanor}`
          break
        case 'leaveTaken':
          if (deserving) sentence += `${pronoun} rarely takes a break`
          else sentence += `${pronoun} has already taken leave`
          break
        case 'tenure':
          if (deserving) sentence += `${pronoun} has been here for so long`
          else sentence += `${pronoun} is relatively new`
          break
        case 'productivity':
          if (deserving) sentence += `${pronoun} has been very productive recently`
          else sentence += `${pronoun} has barely achieved a thing`
          break
        case 'seniority':
          if (deserving) sentence += `${pronoun} is senior`
          else sentence += `${pronoun} is more junior`
          break
        case 'capacity':
          if (deserving) sentence += `${hisOrHer} team have got it covered`
          else sentence += `${hisOrHer} team are maxed out`
          break
        default:
          sentence += `of ${attribute.name}`
          break
      }
    }

    return sentence.trim() + '.'
  }
}
