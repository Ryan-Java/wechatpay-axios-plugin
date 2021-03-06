const crypto = require('crypto')
const fmt = require('./formatter')

/**
 * Crypto hash functions utils.
 * Specification @link https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=4_3
 */
class Hash {
  /**
   * Calculate the input string with an optional secret `key` in MD5,
   * when the `key` is Falsey, this method works as normal `MD5`.
   *
   * @param {string|buffer} thing - The input string.
   * @param {string} [key] - The secret key string.
   * @return {string} - data signature
   */
  static md5(thing, key = '') {
    return crypto.createHash('md5').update(thing).update(`${key ? `&key=${key}` : ``}`).digest('hex')
  }

  /**
   * Calculate the input string with a secret `key` in HMAC-SHA256
   * @param {string|buffer} thing - The input string.
   * @param {string} key - The secret key string.
   * @return {string} - data signature
   */
  static hmacSha256(thing, key) {
    return crypto.createHmac('sha256', key).update(thing).update(`&key=${key}`).digest('hex')
  }

  /**
   * Calculate the input in SHA1.
   * @param {string|buffer} thing - The input.
   * @return {string} - data signature
   */
  static sha1(thing) {
    return crypto.createHash('sha1').update(thing).digest('hex')
  }

  /**
   * Calculate the input in SHA256.
   * @param {string|buffer} thing - The input.
   * @return {string} - data signature
   */
  static sha256(thing) {
    return crypto.createHash('sha256').update(thing).digest('hex')
  }

  /**
   * Utils of the data signature calculation.
   * @param {string} type - The sign type, one of the MD5 or HMAC-SHA256.
   * @param {object} data - The input data.
   * @param {string} key - The secret key string.
   * @return {object} - With data signature
   */
  static sign(type, data, key) {
    const alias = {
      MD5: this.md5,
      'HMAC-SHA256': this.hmacSha256,
    }

    return alias[type](fmt.queryStringLike(fmt.ksort(data)), key).toUpperCase()
  }
}

module.exports = Hash
module.exports.default = Hash
