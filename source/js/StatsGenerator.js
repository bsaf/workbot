import Utils from './Utils'

export default {

  demeanorString (emotions) {
    emotions.neutral = 0
    const max = Object.keys(emotions).reduce(
      function (a, b) {
        return emotions[a] > emotions[b] ? a : b
      })
    switch (max.toString()) {
      case 'disgust':
        return 'Tired'
      case 'contempt':
        return 'Arrogant'
      case 'anger':
        return 'Angry'
      case 'happiness':
        return 'Happy'
      case 'surprise':
        return 'Nice'
      case 'fear':
        return 'Stressed'
      case 'sadness':
        return 'Sad'
      default:
        return 'Neutral'
    }
  },

  teamSize() {
    return Utils.randomInt(2, 51)
  },

  // hours
  scheduledWork() {
    return Utils.randomInt(1, 10)
  },

  // days
  leaveTaken() {
    return Utils.randomInt(10, 60)
  },

  // months
  tenure() {
    return Utils.randomInt(1, 100)
  },

  // percentage
  productivity() {
    return Utils.randomInt(30, 121)
  }

}
