export default {

  makeBuffer: function (dataURL) {
    var BASE64_MARKER = ';base64,'
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      throw new Error('non-base64-encoded data URIs are not currently supported')
    } else {
      var parts = dataURL.split(BASE64_MARKER)
      return Buffer.from(parts[1], 'base64')
    }
  }

}
