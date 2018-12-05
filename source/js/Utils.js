export default {

  // pass an array, get back a random item
  randomItem (array) {
    const index = this.randomInt(0, array.length)
    return array[index]
  },

  // pass a min and max, get back a random int (excluding max)
  randomInt (min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min // The maximum is exclusive and the minimum is inclusive
  }
}
