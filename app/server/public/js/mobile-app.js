(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
/**
 * The buffer module from node.js, for the browser.
 *
 * Author:   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * License:  MIT
 *
 * `npm install buffer`
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
   // Detect if browser supports Typed Arrays. Supported browsers are IE 10+,
   // Firefox 4+, Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+.
  if (typeof Uint8Array !== 'function' || typeof ArrayBuffer !== 'function')
    return false

  // Does the browser support adding properties to `Uint8Array` instances? If
  // not, then that's the same as no `Uint8Array` support. We need to be able to
  // add all the node Buffer API methods.
  // Bug in Firefox 4-29, now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var arr = new Uint8Array(0)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // Assume object is an array
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof Uint8Array === 'function' &&
      subject instanceof Uint8Array) {
    // Speed optimization -- use set if we're copying from a Uint8Array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  // copy!
  for (var i = 0; i < end - start; i++)
    target[i + target_start] = this[i + start]
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array === 'function') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment the Uint8Array *instance* (not the class!) with Buffer methods
 */
function augment (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

},{"base64-js":3,"ieee754":4}],3:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var ZERO   = '0'.charCodeAt(0)
	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS)
			return 62 // '+'
		if (code === SLASH)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	module.exports.toByteArray = b64ToByteArray
	module.exports.fromByteArray = uint8ToBase64
}())

},{}],4:[function(require,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],5:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],6:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require("C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js"))
},{"C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js":5}],7:[function(require,module,exports){
var meta =  '<meta charset="utf-8" />';
meta += '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />';
$('head').append(meta);

var router = require('../shared/Router'),
    foldify = require('foldify'),
    conf = require('confify');
conf({displayType: "mobile"});

var routes = ((function(){ var bind = function bind(fn){ var args = Array.prototype.slice.call(arguments, 1); return function(){ var onearg = args.shift(); var newargs = args.concat(Array.prototype.slice.call(arguments,0)); var returnme = fn.apply(onearg, newargs ); return returnme; };  };var fold = require('foldify'), proxy = {}, map = false;var returnMe = bind( fold, {foldStatus: true, map: map}, proxy);returnMe["error"] = require("C:\\node\\work\\personal\\cellvia.github.io\\app\\client\\js\\mobile\\routes\\error.js");returnMe["posts"] = require("C:\\node\\work\\personal\\cellvia.github.io\\app\\client\\js\\mobile\\routes\\posts.js");for(var p in returnMe){ proxy[p] = returnMe[p]; }return returnMe;})()),
    LayoutView = require('./views/layout');

//grab global collections
Backbone.collections = ((function(){ var bind = function bind(fn){ var args = Array.prototype.slice.call(arguments, 1); return function(){ var onearg = args.shift(); var newargs = args.concat(Array.prototype.slice.call(arguments,0)); var returnme = fn.apply(onearg, newargs ); return returnme; };  };var fold = require('foldify'), proxy = {}, map = false;var returnMe = bind( fold, {foldStatus: true, map: map}, proxy);returnMe["Html"] = require("C:\\node\\work\\personal\\cellvia.github.io\\app\\client\\js\\shared\\collections\\Html.js");returnMe["Posts"] = require("C:\\node\\work\\personal\\cellvia.github.io\\app\\client\\js\\shared\\collections\\Posts.js");for(var p in returnMe){ proxy[p] = returnMe[p]; }return returnMe;})());

//attach routes
routes(router);

//attach global collections
Backbone.sections = ['code', 'music', 'art', 'thoughts', 'projects'];
Backbone.sections.forEach(function(type){
	Backbone.collections[type] = Backbone.collections.Posts({identifier: "~"+type+"~"});
});
Backbone.collections.html = Backbone.collections.Html();

//transitioner
Backbone.transition = function(){
	var mobileTransition = require("pageslide");
	Backbone.transition = mobileTransition( $("body") );
	Backbone.transition.apply(Backbone.transition, [].slice.apply(arguments));
}

//start history
Backbone.history.start({
  pushState: !!!~window.location.href.indexOf("github.io")
});

},{"../shared/Router":14,"./views/layout":11,"C:\\node\\work\\personal\\cellvia.github.io\\app\\client\\js\\mobile\\routes\\error.js":8,"C:\\node\\work\\personal\\cellvia.github.io\\app\\client\\js\\mobile\\routes\\posts.js":9,"C:\\node\\work\\personal\\cellvia.github.io\\app\\client\\js\\shared\\collections\\Html.js":19,"C:\\node\\work\\personal\\cellvia.github.io\\app\\client\\js\\shared\\collections\\Posts.js":20,"confify":22,"foldify":25,"pageslide":32}],8:[function(require,module,exports){
var ErrorView = require('../views/error');

module.exports = function(router){

	router.error = function(status){
    	router.view( ErrorView, {errorCode: status, group: "errors"} );
  	};

	router.route('500', 'error', router.error.bind(router, 500) );
	router.route('404', 'error', router.error.bind(router, 404) );
	router.route('403', 'error', router.error.bind(router, 403) );

}
},{"../views/error":10}],9:[function(require,module,exports){
var PostsView = require('../views/posts');
var LayoutView = require('../views/layout');
var PostView = require('../views/post');

module.exports = function(router){

	router.route('', 'blog', function(type){
    	router.view( LayoutView );
	});

	router.route('tag/:tag', 'taggedPosts', function(tag){
    	router.view( PostsView, {"tag": tag} );
	});

	router.route('articles/:type', 'posts', function(type){
    	router.view( PostsView, {"type": type} );
	});

	router.route('article/:type/:slug', 'post', function(type, slug){
    	router.view( PostView, {"slug": slug, "type": type} );
	});
	
}

},{"../views/layout":11,"../views/post":12,"../views/posts":13}],10:[function(require,module,exports){
var View = require('../../shared/View');

module.exports = View.extend({
	el: "body",
	initialize: function(opts){
		alert("error!"+opts.errorCode);		
	}
})

},{"../../shared/View":15}],11:[function(require,module,exports){
var View = require('../../shared/View');
var insertCss = require('insert-css');
var foldify = require('foldify');
var topcoatCss = ((function(){ var bind = function bind(fn){ var args = Array.prototype.slice.call(arguments, 1); return function(){ var onearg = args.shift(); var newargs = args.concat(Array.prototype.slice.call(arguments,0)); var returnme = fn.apply(onearg, newargs ); return returnme; };  };var fold = require('foldify'), proxy = {}, map = false;var returnMe = bind( fold, {foldStatus: true, map: map}, proxy);returnMe["topcoat-mobile-light.css"] = "/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n.button-bar {\n  display: table;\n  table-layout: fixed;\n  white-space: nowrap;\n  margin: 0;\n  padding: 0;\n}\n\n.button-bar__item {\n  display: table-cell;\n  width: auto;\n  border-radius: 0;\n}\n\n.button-bar__item > input {\n  position: absolute;\n  overflow: hidden;\n  padding: 0;\n  border: 0;\n  opacity: 0.001;\n  z-index: 1;\n  vertical-align: top;\n  outline: none;\n}\n\n.button-bar__button {\n  border-radius: inherit;\n}\n\n.button-bar__item:disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n.button,\n.topcoat-button,\n.topcoat-button--quiet,\n.topcoat-button--large,\n.topcoat-button--large--quiet,\n.topcoat-button--cta,\n.topcoat-button--large--cta,\n.topcoat-button-bar__button,\n.topcoat-button-bar__button--large {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  text-decoration: none;\n}\n\n.button--quiet {\n  background: transparent;\n  border: 1px solid transparent;\n  box-shadow: none;\n}\n\n.button--disabled,\n.topcoat-button:disabled,\n.topcoat-button--quiet:disabled,\n.topcoat-button--large:disabled,\n.topcoat-button--large--quiet:disabled,\n.topcoat-button--cta:disabled,\n.topcoat-button--large--cta:disabled,\n.topcoat-button-bar__button:disabled,\n.topcoat-button-bar__button--large:disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n.topcoat-button,\n.topcoat-button--quiet,\n.topcoat-button--large,\n.topcoat-button--large--quiet,\n.topcoat-button--cta,\n.topcoat-button--large--cta,\n.topcoat-button-bar__button,\n.topcoat-button-bar__button--large {\n  padding: 0 1.25rem;\n  font-size: 16px;\n  line-height: 3rem;\n  letter-spacing: 1px;\n  color: #454545;\n  text-shadow: 0 1px #fff;\n  vertical-align: top;\n  background-color: #e5e9e8;\n  box-shadow: inset 0 1px #fff;\n  border: 1px solid #a5a8a8;\n  border-radius: 6px;\n}\n\n.topcoat-button:hover,\n.topcoat-button--quiet:hover,\n.topcoat-button--large:hover,\n.topcoat-button--large--quiet:hover,\n.topcoat-button-bar__button:hover,\n.topcoat-button-bar__button--large:hover {\n  background-color: #edf1f1;\n}\n\n.topcoat-button:active,\n.topcoat-button--large:active,\n.topcoat-button-bar__button:active,\n.topcoat-button-bar__button--large:active,\n:checked + .topcoat-button-bar__button {\n  background-color: #d3d7d7;\n  box-shadow: inset 0 1px rgba(0,0,0,0.12);\n}\n\n.topcoat-button:focus,\n.topcoat-button--quiet:focus,\n.topcoat-button--large:focus,\n.topcoat-button--large--quiet:focus,\n.topcoat-button--cta:focus,\n.topcoat-button--large--cta:focus,\n.topcoat-button-bar__button:focus,\n.topcoat-button-bar__button--large:focus {\n  border: 1px solid #0940fd;\n  box-shadow: 0 0 0 2px #6fb5f1;\n  outline: 0;\n}\n\n.topcoat-button--quiet {\n  background: transparent;\n  border: 1px solid transparent;\n  box-shadow: none;\n}\n\n.topcoat-button--quiet:hover,\n.topcoat-button--large--quiet:hover {\n  text-shadow: 0 1px #fff;\n  border: 1px solid #a5a8a8;\n  box-shadow: inset 0 1px #fff;\n}\n\n.topcoat-button--quiet:active,\n.topcoat-button--large--quiet:active {\n  color: #454545;\n  text-shadow: 0 1px #fff;\n  background-color: #d3d7d7;\n  border: 1px solid #a5a8a8;\n  box-shadow: inset 0 1px rgba(0,0,0,0.12);\n}\n\n.topcoat-button--large,\n.topcoat-button--large--quiet,\n.topcoat-button-bar__button--large {\n  font-size: 1.3rem;\n  font-weight: 400;\n  line-height: 4.375rem;\n  padding: 0 1.25rem;\n}\n\n.topcoat-button--large--quiet {\n  background: transparent;\n  border: 1px solid transparent;\n  box-shadow: none;\n}\n\n.topcoat-button--cta,\n.topcoat-button--large--cta {\n  border: 1px solid #143250;\n  background-color: #288edf;\n  box-shadow: inset 0 1px rgba(255,255,255,0.36);\n  color: #fff;\n  font-weight: 500;\n  text-shadow: 0 -1px rgba(0,0,0,0.36);\n}\n\n.topcoat-button--cta:hover,\n.topcoat-button--large--cta:hover {\n  background-color: #509bef;\n}\n\n.topcoat-button--cta:active,\n.topcoat-button--large--cta:active {\n  background-color: #0380e8;\n  box-shadow: inset 0 1px rgba(0,0,0,0.12);\n}\n\n.topcoat-button--large--cta {\n  font-size: 1.3rem;\n  font-weight: 400;\n  line-height: 4.375rem;\n  padding: 0 1.25rem;\n}\n\n.button-bar,\n.topcoat-button-bar {\n  display: table;\n  table-layout: fixed;\n  white-space: nowrap;\n  margin: 0;\n  padding: 0;\n}\n\n.button-bar__item,\n.topcoat-button-bar__item {\n  display: table-cell;\n  width: auto;\n  border-radius: 0;\n}\n\n.button-bar__item > input,\n.topcoat-button-bar__item > input {\n  position: absolute;\n  overflow: hidden;\n  padding: 0;\n  border: 0;\n  opacity: 0.001;\n  z-index: 1;\n  vertical-align: top;\n  outline: none;\n}\n\n.button-bar__button {\n  border-radius: inherit;\n}\n\n.button-bar__item:disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n/* topdoc\n  name: Button Bar\n  description: Component of grouped buttons\n  modifiers:\n    :disabled: Disabled state\n  markup:\n    <div class=\"topcoat-button-bar\">\n      <div class=\"topcoat-button-bar__item\">\n        <button class=\"topcoat-button-bar__button\">One</button>\n      </div>\n      <div class=\"topcoat-button-bar__item\">\n        <button class=\"topcoat-button-bar__button\">Two</button>\n      </div>\n      <div class=\"topcoat-button-bar__item\">\n        <button class=\"topcoat-button-bar__button\">Three</button>\n      </div>\n    </div>\n  examples:\n    mobile button bar: http://codepen.io/Topcoat/pen/kdKyg\n  tags:\n    - desktop\n    - light\n    - dark\n    - mobile\n    - button\n    - group\n    - bar\n*/\n\n.topcoat-button-bar > .topcoat-button-bar__item:first-child {\n  border-top-left-radius: 6px;\n  border-bottom-left-radius: 6px;\n}\n\n.topcoat-button-bar > .topcoat-button-bar__item:last-child {\n  border-top-right-radius: 6px;\n  border-bottom-right-radius: 6px;\n}\n\n.topcoat-button-bar__item:first-child > .topcoat-button-bar__button,\n.topcoat-button-bar__item:first-child > .topcoat-button-bar__button--large {\n  border-right: none;\n}\n\n.topcoat-button-bar__item:last-child > .topcoat-button-bar__button,\n.topcoat-button-bar__item:last-child > .topcoat-button-bar__button--large {\n  border-left: none;\n}\n\n.topcoat-button-bar__button {\n  border-radius: inherit;\n}\n\n.topcoat-button-bar__button:focus,\n.topcoat-button-bar__button--large:focus {\n  z-index: 1;\n}\n\n/* topdoc\n  name: Large Button Bar\n  description: A button bar, only larger\n  modifiers:\n    :disabled: Disabled state\n  markup:\n    <div class=\"topcoat-button-bar\">\n      <div class=\"topcoat-button-bar__item\">\n        <button class=\"topcoat-button-bar__button--large\">One</button>\n      </div>\n      <div class=\"topcoat-button-bar__item\">\n        <button class=\"topcoat-button-bar__button--large\">Two</button>\n      </div>\n      <div class=\"topcoat-button-bar__item\">\n        <button class=\"topcoat-button-bar__button--large\">Three</button>\n      </div>\n    </div>\n  tags:\n    - desktop\n    - light\n    - dark\n    - mobile\n    - button\n    - group\n    - bar\n    - large\n*/\n\n.topcoat-button-bar__button--large {\n  border-radius: inherit;\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n.button {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  text-decoration: none;\n}\n\n.button--quiet {\n  background: transparent;\n  border: 1px solid transparent;\n  box-shadow: none;\n}\n\n.button--disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n.button,\n.topcoat-button,\n.topcoat-button--quiet,\n.topcoat-button--large,\n.topcoat-button--large--quiet,\n.topcoat-button--cta,\n.topcoat-button--large--cta {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  text-decoration: none;\n}\n\n.button--quiet {\n  background: transparent;\n  border: 1px solid transparent;\n  box-shadow: none;\n}\n\n.button--disabled,\n.topcoat-button:disabled,\n.topcoat-button--quiet:disabled,\n.topcoat-button--large:disabled,\n.topcoat-button--large--quiet:disabled,\n.topcoat-button--cta:disabled,\n.topcoat-button--large--cta:disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n/* topdoc\n  name: Button\n  description: A simple button\n  modifiers:\n    :active: Active state\n    :disabled: Disabled state\n    :hover: Hover state\n    :focus: Focused\n  markup:\n    <button class=\"topcoat-button\">Button</button>\n    <button class=\"topcoat-button\" disabled>Button</button>\n  examples:\n    mobile button: http://codepen.io/Topcoat/pen/DpKtf\n  tags:\n    - desktop\n    - light\n    - mobile\n    - button\n*/\n\n.topcoat-button,\n.topcoat-button--quiet,\n.topcoat-button--large,\n.topcoat-button--large--quiet,\n.topcoat-button--cta,\n.topcoat-button--large--cta {\n  padding: 0 1.25rem;\n  font-size: 16px;\n  line-height: 3rem;\n  letter-spacing: 1px;\n  color: #454545;\n  text-shadow: 0 1px #fff;\n  vertical-align: top;\n  background-color: #e5e9e8;\n  box-shadow: inset 0 1px #fff;\n  border: 1px solid #a5a8a8;\n  border-radius: 6px;\n}\n\n.topcoat-button:hover,\n.topcoat-button--quiet:hover,\n.topcoat-button--large:hover,\n.topcoat-button--large--quiet:hover {\n  background-color: #edf1f1;\n}\n\n.topcoat-button:active,\n.topcoat-button--large:active {\n  background-color: #d3d7d7;\n  box-shadow: inset 0 1px rgba(0,0,0,0.12);\n}\n\n.topcoat-button:focus,\n.topcoat-button--quiet:focus,\n.topcoat-button--large:focus,\n.topcoat-button--large--quiet:focus,\n.topcoat-button--cta:focus,\n.topcoat-button--large--cta:focus {\n  border: 1px solid #0940fd;\n  box-shadow: 0 0 0 2px #6fb5f1;\n  outline: 0;\n}\n\n/* topdoc\n  name: Quiet Button\n  description: A simple, yet quiet button\n  modifiers:\n    :active: Quiet button active state\n    :disabled: Disabled state\n    :hover: Hover state\n    :focus: Focused\n  markup:\n    <button class=\"topcoat-button--quiet\">Button</button>\n    <button class=\"topcoat-button--quiet\" disabled>Button</button>\n  tags:\n    - desktop\n    - light\n    - mobile\n    - button\n    - quiet\n*/\n\n.topcoat-button--quiet {\n  background: transparent;\n  border: 1px solid transparent;\n  box-shadow: none;\n}\n\n.topcoat-button--quiet:hover,\n.topcoat-button--large--quiet:hover {\n  text-shadow: 0 1px #fff;\n  border: 1px solid #a5a8a8;\n  box-shadow: inset 0 1px #fff;\n}\n\n.topcoat-button--quiet:active,\n.topcoat-button--large--quiet:active {\n  color: #454545;\n  text-shadow: 0 1px #fff;\n  background-color: #d3d7d7;\n  border: 1px solid #a5a8a8;\n  box-shadow: inset 0 1px rgba(0,0,0,0.12);\n}\n\n/* topdoc\n  name: Large Button\n  description: A big ol button\n  modifiers:\n    :active: Active state\n    :disabled: Disabled state\n    :hover: Hover state\n    :focus: Focused\n  markup:\n    <button class=\"topcoat-button--large\" >Button</button>\n    <button class=\"topcoat-button--large\" disabled>Button</button>\n  tags:\n    - desktop\n    - light\n    - mobile\n    - button\n    - large\n*/\n\n.topcoat-button--large,\n.topcoat-button--large--quiet {\n  font-size: 1.3rem;\n  font-weight: 400;\n  line-height: 4.375rem;\n  padding: 0 1.25rem;\n}\n\n/* topdoc\n  name: Large Quiet Button\n  description: A large, yet quiet button\n  modifiers:\n    :active: Active state\n    :disabled: Disabled state\n    :hover: Hover state\n    :focus: Focused\n  markup:\n    <button class=\"topcoat-button--large--quiet\" >Button</button>\n    <button class=\"topcoat-button--large--quiet\" disabled>Button</button>\n  tags:\n    - desktop\n    - light\n    - mobile\n    - button\n    - large\n    - quiet\n*/\n\n.topcoat-button--large--quiet {\n  background: transparent;\n  border: 1px solid transparent;\n  box-shadow: none;\n}\n\n/* topdoc\n  name: Call To Action Button\n  description: A CALL TO ARMS, er, ACTION!\n  modifiers:\n    :active: Active state\n    :disabled: Disabled state\n    :hover: Hover state\n    :focus: Focused\n  markup:\n    <button class=\"topcoat-button--cta\" >Button</button>\n    <button class=\"topcoat-button--cta\" disabled>Button</button>\n  tags:\n    - desktop\n    - light\n    - mobile\n    - button\n    - call to action\n*/\n\n.topcoat-button--cta,\n.topcoat-button--large--cta {\n  border: 1px solid #143250;\n  background-color: #288edf;\n  box-shadow: inset 0 1px rgba(255,255,255,0.36);\n  color: #fff;\n  font-weight: 500;\n  text-shadow: 0 -1px rgba(0,0,0,0.36);\n}\n\n.topcoat-button--cta:hover,\n.topcoat-button--large--cta:hover {\n  background-color: #509bef;\n}\n\n.topcoat-button--cta:active,\n.topcoat-button--large--cta:active {\n  background-color: #0380e8;\n  box-shadow: inset 0 1px rgba(0,0,0,0.12);\n}\n\n/* topdoc\n  name: Large Call To Action Button\n  description: Like call to action, but bigger\n  modifiers:\n    :active: Active state\n    :disabled: Disabled state\n    :hover: Hover state\n    :focus: Focused\n  markup:\n    <button class=\"topcoat-button--large--cta\" >Button</button>\n    <button class=\"topcoat-button--large--cta\" disabled>Button</button>\n  tags:\n    - desktop\n    - light\n    - mobile\n    - button\n    - large\n    - call to action\n*/\n\n.topcoat-button--large--cta {\n  font-size: 1.3rem;\n  font-weight: 400;\n  line-height: 4.375rem;\n  padding: 0 1.25rem;\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\ninput[type=\"checkbox\"] {\n  position: absolute;\n  overflow: hidden;\n  padding: 0;\n  border: 0;\n  opacity: 0.001;\n  z-index: 1;\n  vertical-align: top;\n  outline: none;\n}\n\n.checkbox {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.checkbox__label {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.checkbox--disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n.checkbox:before,\n.checkbox:after {\n  content: '';\n  position: absolute;\n}\n\n.checkbox:before {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\ninput[type=\"checkbox\"] {\n  position: absolute;\n  overflow: hidden;\n  padding: 0;\n  border: 0;\n  opacity: 0.001;\n  z-index: 1;\n  vertical-align: top;\n  outline: none;\n}\n\n.checkbox,\n.topcoat-checkbox__checkmark {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.checkbox__label,\n.topcoat-checkbox {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.checkbox--disabled,\ninput[type=\"checkbox\"]:disabled + .topcoat-checkbox__checkmark {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n.checkbox:before,\n.checkbox:after,\n.topcoat-checkbox__checkmark:before,\n.topcoat-checkbox__checkmark:after {\n  content: '';\n  position: absolute;\n}\n\n.checkbox:before,\n.topcoat-checkbox__checkmark:before {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n}\n\n/* topdoc\n  name: Checkbox\n  description: Default skin for Topcoat checkbox\n  modifiers:\n    :focus: Focus state\n    :disabled: Disabled state\n  markup:\n    <label class=\"topcoat-checkbox\">\n      <input type=\"checkbox\">\n      <div class=\"topcoat-checkbox__checkmark\"></div>\n      Default\n    </label>\n    <br>\n    <br>\n    <label class=\"topcoat-checkbox\">\n      <input type=\"checkbox\" disabled>\n      <div class=\"topcoat-checkbox__checkmark\"></div>\n      Disabled\n    </label>\n  examples:\n    mobile checkbox: http://codepen.io/Topcoat/pen/piHcs\n  tags:\n    - desktop\n    - light\n    - mobile\n    - checkbox\n*/\n\n.topcoat-checkbox__checkmark {\n  height: 2rem;\n}\n\ninput[type=\"checkbox\"] {\n  height: 2rem;\n  width: 2rem;\n  margin-top: 0;\n  margin-right: -2rem;\n  margin-bottom: -2rem;\n  margin-left: 0;\n}\n\ninput[type=\"checkbox\"]:checked + .topcoat-checkbox__checkmark:after {\n  opacity: 1;\n}\n\n.topcoat-checkbox {\n  line-height: 2rem;\n}\n\n.topcoat-checkbox__checkmark:before {\n  width: 2rem;\n  height: 2rem;\n  background: #e5e9e8;\n  border: 1px solid #a5a8a8;\n  border-radius: 3px;\n  box-shadow: inset 0 1px #fff;\n}\n\n.topcoat-checkbox__checkmark {\n  width: 2rem;\n  height: 2rem;\n}\n\n.topcoat-checkbox__checkmark:after {\n  top: 1px;\n  left: 2px;\n  opacity: 0;\n  width: 28px;\n  height: 11px;\n  background: transparent;\n  border: 7px solid #666;\n  border-width: 7px;\n  border-top: none;\n  border-right: none;\n  border-radius: 2px;\n  -webkit-transform: rotate(-50deg);\n  -ms-transform: rotate(-50deg);\n  transform: rotate(-50deg);\n}\n\ninput[type=\"checkbox\"]:focus + .topcoat-checkbox__checkmark:before {\n  border: 1px solid #0940fd;\n  box-shadow: 0 0 0 2px #6fb5f1;\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n.button,\n.topcoat-icon-button,\n.topcoat-icon-button--quiet,\n.topcoat-icon-button--large,\n.topcoat-icon-button--large--quiet {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  text-decoration: none;\n}\n\n.button--quiet {\n  background: transparent;\n  border: 1px solid transparent;\n  box-shadow: none;\n}\n\n.button--disabled,\n.topcoat-icon-button:disabled,\n.topcoat-icon-button--quiet:disabled,\n.topcoat-icon-button--large:disabled,\n.topcoat-icon-button--large--quiet:disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n/* topdoc\n  name: Icon Button\n  description: Like button, but it has an icon.\n  modifiers:\n    :active: Active state\n    :disabled: Disabled state\n    :hover: Hover state\n    :focus: Focused\n  markup:\n    <button class=\"topcoat-icon-button\">\n      <span class=\"topcoat-icon\" style=\"background-color:#A5A7A7;\"></span>\n    </button>\n    <button class=\"topcoat-icon-button\" disabled>\n      <span class=\"topcoat-icon\" style=\"background-color:#A5A7A7;\"></span>\n    </button>\n  tags:\n    - desktop\n    - light\n    - mobile\n    - button\n    - icon\n*/\n\n.topcoat-icon-button,\n.topcoat-icon-button--quiet,\n.topcoat-icon-button--large,\n.topcoat-icon-button--large--quiet {\n  padding: 0 0.75rem;\n  line-height: 3rem;\n  letter-spacing: 1px;\n  color: #454545;\n  text-shadow: 0 1px #fff;\n  vertical-align: baseline;\n  background-color: #e5e9e8;\n  box-shadow: inset 0 1px #fff;\n  border: 1px solid #a5a8a8;\n  border-radius: 6px;\n}\n\n.topcoat-icon-button:hover,\n.topcoat-icon-button--quiet:hover,\n.topcoat-icon-button--large:hover,\n.topcoat-icon-button--large--quiet:hover {\n  background-color: #edf1f1;\n}\n\n.topcoat-icon-button:active {\n  background-color: #d3d7d7;\n  box-shadow: inset 0 1px rgba(0,0,0,0.12);\n}\n\n.topcoat-icon-button:focus,\n.topcoat-icon-button--quiet:focus,\n.topcoat-icon-button--quiet:hover:focus,\n.topcoat-icon-button--large:focus,\n.topcoat-icon-button--large--quiet:focus,\n.topcoat-icon-button--large--quiet:hover:focus {\n  border: 1px solid #0940fd;\n  box-shadow: 0 0 0 2px #6fb5f1;\n  outline: 0;\n}\n\n/* topdoc\n  name: Quiet Icon Button\n  description: Like quiet button, but it has an icon.\n  modifiers:\n    :active: Active state\n    :disabled: Disabled state\n    :hover: Hover state\n    :focus: Focused\n  markup:\n    <button class=\"topcoat-icon-button--quiet\">\n      <span class=\"topcoat-icon\" style=\"background-color:#A5A7A7;\"></span>\n    </button>\n    <button class=\"topcoat-icon-button--quiet\" disabled>\n      <span class=\"topcoat-icon\" style=\"background-color:#A5A7A7;\"></span>\n    </button>\n  tags:\n    - desktop\n    - light\n    - mobile\n    - button\n    - icon\n    - quiet\n*/\n\n.topcoat-icon-button--quiet {\n  background: transparent;\n  border: 1px solid transparent;\n  box-shadow: none;\n}\n\n.topcoat-icon-button--quiet:hover,\n.topcoat-icon-button--large--quiet:hover {\n  text-shadow: 0 1px #fff;\n  border: 1px solid #a5a8a8;\n  box-shadow: inset 0 1px #fff;\n}\n\n.topcoat-icon-button--quiet:active,\n.topcoat-icon-button--large--quiet:active {\n  color: #454545;\n  text-shadow: 0 1px #fff;\n  background-color: #d3d7d7;\n  border: 1px solid #a5a8a8;\n  box-shadow: inset 0 1px rgba(0,0,0,0.12);\n}\n\n/* topdoc\n  name: Large Icon Button\n  description: Like large button, but it has an icon.\n  modifiers:\n    :active: Active state\n    :disabled: Disabled state\n    :hover: Hover state\n    :focus: Focused\n  markup:\n    <button class=\"topcoat-icon-button--large\">\n      <span class=\"topcoat-icon--large\" style=\"background-color:#A5A7A7;\"></span>\n    </button>\n    <button class=\"topcoat-icon-button--large\" disabled>\n      <span class=\"topcoat-icon--large\" style=\"background-color:#A5A7A7;\"></span>\n    </button>\n  tags:\n    - desktop\n    - light\n    - mobile\n    - button\n    - icon\n    - large\n*/\n\n.topcoat-icon-button--large,\n.topcoat-icon-button--large--quiet {\n  width: 4.375rem;\n  height: 4.375rem;\n  line-height: 4.375rem;\n}\n\n.topcoat-icon-button--large:active {\n  background-color: #d3d7d7;\n  box-shadow: inset 0 1px rgba(0,0,0,0.12);\n}\n\n/* topdoc\n  name: Large Quiet Icon Button\n  description: Like large button, but it has an icon and this one is quiet.\n  modifiers:\n    :active: Active state\n    :disabled: Disabled state\n    :hover: Hover state\n  markup:\n    <button class=\"topcoat-icon-button--large--quiet\">\n      <span class=\"topcoat-icon--large\" style=\"background-color:#A5A7A7;\"></span>\n    </button>\n    <button class=\"topcoat-icon-button--large--quiet\" disabled>\n      <span class=\"topcoat-icon--large\" style=\"background-color:#A5A7A7;\"></span>\n    </button>\n  tags:\n    - desktop\n    - light\n    - mobile\n    - button\n    - icon\n    - large\n    - quiet\n*/\n\n.topcoat-icon-button--large--quiet {\n  background: transparent;\n  border: 1px solid transparent;\n  box-shadow: none;\n}\n\n.topcoat-icon,\n.topcoat-icon--large {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  overflow: hidden;\n  width: 1.62rem;\n  height: 1.62rem;\n  vertical-align: middle;\n  top: -1px;\n}\n\n.topcoat-icon--large {\n  width: 2.499999998125rem;\n  height: 2.499999998125rem;\n  top: -2px;\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n.input {\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  vertical-align: top;\n  outline: none;\n}\n\n.input:disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n.list {\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n}\n\n.list__header {\n  margin: 0;\n}\n\n.list__container {\n  padding: 0;\n  margin: 0;\n  list-style-type: none;\n}\n\n.list__item {\n  margin: 0;\n  padding: 0;\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n.list,\n.topcoat-list {\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n}\n\n.list__header,\n.topcoat-list__header {\n  margin: 0;\n}\n\n.list__container,\n.topcoat-list__container {\n  padding: 0;\n  margin: 0;\n  list-style-type: none;\n}\n\n.list__item,\n.topcoat-list__item {\n  margin: 0;\n  padding: 0;\n}\n\n/* topdoc\n  name: List\n  description: Topcoat default list skin\n  markup:\n    <div class=\"topcoat-list\">\n      <h3 class=\"topcoat-list__header\">Category</h3>\n      <ul class=\"topcoat-list__container\">\n        <li class=\"topcoat-list__item\">\n          Item\n        </li>\n        <li class=\"topcoat-list__item\">\n          Item\n        </li>\n        <li class=\"topcoat-list__item\">\n          Item\n        </li>\n      </ul>\n    </div>\n  tags:\n    - mobile\n    - list\n*/\n\n.topcoat-list {\n  border-top: 1px solid #bcbfbf;\n  border-bottom: 1px solid #eff1f1;\n  background-color: #dfe2e2;\n}\n\n.topcoat-list__header {\n  padding: 4px 20px;\n  font-size: 0.9em;\n  font-weight: 400;\n  background-color: #cccfcf;\n  color: #656565;\n  text-shadow: 0 1px 0 rgba(255,255,255,0.5);\n  border-top: 1px solid rgba(255,255,255,0.5);\n  border-bottom: 1px solid rgba(255,255,255,0.23);\n}\n\n.topcoat-list__container {\n  border-top: 1px solid #bcbfbf;\n  color: #454545;\n}\n\n.topcoat-list__item {\n  padding: 1.25rem;\n  border-top: 1px solid #eff1f1;\n  border-bottom: 1px solid #bcbfbf;\n}\n\n.topcoat-list__item:first-child {\n  border-top: 1px solid rgba(0,0,0,0.05);\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n.navigation-bar {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  white-space: nowrap;\n  overflow: hidden;\n  word-spacing: 0;\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.navigation-bar__item {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n}\n\n.navigation-bar__title {\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n.navigation-bar,\n.topcoat-navigation-bar {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  white-space: nowrap;\n  overflow: hidden;\n  word-spacing: 0;\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.navigation-bar__item,\n.topcoat-navigation-bar__item {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n}\n\n.navigation-bar__title,\n.topcoat-navigation-bar__title {\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n/* topdoc\n  name: Navigation Bar\n  description: A place where navigation goes to drink\n  markup:\n    <div class=\"topcoat-navigation-bar\">\n        <div class=\"topcoat-navigation-bar__item center full\">\n            <h1 class=\"topcoat-navigation-bar__title\">Header</h1>\n        </div>\n    </div>\n  tags:\n    - desktop\n    - light\n    - mobile\n    - navigation\n    - bar\n*/\n\n.topcoat-navigation-bar {\n  height: 4.375rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  background: #e5e9e8;\n  color: #000;\n  box-shadow: inset 0 -1px #b9bcbc, 0 1px #d4d6d6;\n}\n\n.topcoat-navigation-bar__item {\n  margin: 0;\n  line-height: 4.375rem;\n  vertical-align: top;\n}\n\n.topcoat-navigation-bar__title {\n  font-size: 1.3rem;\n  font-weight: 400;\n  color: #000;\n}\n\n/*\nCopyright 2012 Adobe Systems Inc.;\nLicensed under the Apache License, Version 2.0 (the \"License\");\nyou may not use this file except in compliance with the License.\nYou may obtain a copy of the License at\n\nhttp://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an \"AS IS\" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n.notification {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  text-decoration: none;\n}\n\n/*\nCopyright 2012 Adobe Systems Inc.;\nLicensed under the Apache License, Version 2.0 (the \"License\");\nyou may not use this file except in compliance with the License.\nYou may obtain a copy of the License at\n\nhttp://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an \"AS IS\" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n.notification,\n.topcoat-notification {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  text-decoration: none;\n}\n\n/* topdoc\n  name: Notification\n  description: Notification badge\n  markup:\n    <span class=\"topcoat-notification\">1</span>\n  tags:\n    - desktop\n    - light\n    - mobile\n    - notification\n*/\n\n.topcoat-notification {\n  padding: 0.15em 0.5em 0.2em;\n  border-radius: 2px;\n  background-color: #ec514e;\n  color: #fff;\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\ninput[type=\"radio\"] {\n  position: absolute;\n  overflow: hidden;\n  padding: 0;\n  border: 0;\n  opacity: 0.001;\n  z-index: 1;\n  vertical-align: top;\n  outline: none;\n}\n\n.radio-button {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.radio-button__label {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.radio-button:before,\n.radio-button:after {\n  content: '';\n  position: absolute;\n  border-radius: 100%;\n}\n\n.radio-button:after {\n  top: 50%;\n  left: 50%;\n  -webkit-transform: translate(-50%, -50%);\n  -ms-transform: translate(-50%, -50%);\n  transform: translate(-50%, -50%);\n}\n\n.radio-button:before {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n}\n\n.radio-button--disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\ninput[type=\"radio\"] {\n  position: absolute;\n  overflow: hidden;\n  padding: 0;\n  border: 0;\n  opacity: 0.001;\n  z-index: 1;\n  vertical-align: top;\n  outline: none;\n}\n\n.radio-button,\n.topcoat-radio-button__checkmark {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.radio-button__label,\n.topcoat-radio-button {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.radio-button:before,\n.radio-button:after,\n.topcoat-radio-button__checkmark:before,\n.topcoat-radio-button__checkmark:after {\n  content: '';\n  position: absolute;\n  border-radius: 100%;\n}\n\n.radio-button:after,\n.topcoat-radio-button__checkmark:after {\n  top: 50%;\n  left: 50%;\n  -webkit-transform: translate(-50%, -50%);\n  -ms-transform: translate(-50%, -50%);\n  transform: translate(-50%, -50%);\n}\n\n.radio-button:before,\n.topcoat-radio-button__checkmark:before {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n}\n\n.radio-button--disabled,\ninput[type=\"radio\"]:disabled + .topcoat-radio-button__checkmark {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n/* topdoc\n  name: Radio Button\n  description: A button that can play music, but usually just plays ads.\n  modifiers:\n  markup:\n    <!-- NO LABEL -->\n    <label class=\"topcoat-radio-button\">\n      <input type=\"radio\" name=\"topcoat\">\n      <div class=\"topcoat-radio-button__checkmark\"></div>\n    </label>\n    <br>\n    <br>\n    <!-- LEFT LABEL -->\n    <label class=\"topcoat-radio-button\">\n      Left label\n      <input type=\"radio\" name=\"topcoat\">\n      <div class=\"topcoat-radio-button__checkmark\"></div>\n    </label>\n    <br>\n    <br>\n    <!-- RIGHT LABEL -->\n    <label class=\"topcoat-radio-button\">\n      <input type=\"radio\" name=\"topcoat\">\n      <div class=\"topcoat-radio-button__checkmark\"></div>\n      Right label\n    </label>\n    <br>\n    <br>\n    <!-- DISABLED -->\n    <label class=\"topcoat-radio-button\">\n      <input type=\"radio\" name=\"topcoat\" Disabled>\n      <div class=\"topcoat-radio-button__checkmark\"></div>\n      Disabled\n    </label>\n  examples:\n    Mobile Radio Button: http://codepen.io/Topcoat/pen/HDcJj\n  tags:\n    - desktop\n    - light\n    - mobile\n    - Radio\n*/\n\ninput[type=\"radio\"] {\n  height: 1.875rem;\n  width: 1.875rem;\n  margin-top: 0;\n  margin-right: -1.875rem;\n  margin-bottom: -1.875rem;\n  margin-left: 0;\n}\n\ninput[type=\"radio\"]:checked + .topcoat-radio-button__checkmark:after {\n  opacity: 1;\n}\n\n.topcoat-radio-button {\n  color: #454545;\n  line-height: 1.875rem;\n}\n\n.topcoat-radio-button__checkmark:before {\n  width: 1.875rem;\n  height: 1.875rem;\n  background: #e5e9e8;\n  border: 1px solid #a5a8a8;\n  box-shadow: inset 0 1px #fff;\n}\n\n.topcoat-radio-button__checkmark {\n  position: relative;\n  width: 1.875rem;\n  height: 1.875rem;\n}\n\n.topcoat-radio-button__checkmark:after {\n  opacity: 0;\n  width: 0.875rem;\n  height: 0.875rem;\n  background: #666;\n  border: 1px solid rgba(0,0,0,0.1);\n  box-shadow: 0 1px rgba(255,255,255,0.5);\n  -webkit-transform: none;\n  -ms-transform: none;\n  transform: none;\n  top: 7px;\n  left: 7px;\n}\n\ninput[type=\"radio\"]:focus + .topcoat-radio-button__checkmark:before {\n  border: 1px solid #0940fd;\n  box-shadow: 0 0 0 2px #6fb5f1;\n}\n\n/*\nCopyright 2012 Adobe Systems Inc.;\nLicensed under the Apache License, Version 2.0 (the \"License\");\nyou may not use this file except in compliance with the License.\nYou may obtain a copy of the License at\n\nhttp://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an \"AS IS\" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.\n*/\n\n/*\nCopyright 2012 Adobe Systems Inc.;\nLicensed under the Apache License, Version 2.0 (the \"License\");\nyou may not use this file except in compliance with the License.\nYou may obtain a copy of the License at\n\nhttp://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an \"AS IS\" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.\n*/\n\n.range {\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  vertical-align: top;\n  outline: none;\n  -webkit-appearance: none;\n}\n\n.range__thumb {\n  cursor: pointer;\n}\n\n.range__thumb--webkit {\n  cursor: pointer;\n  -webkit-appearance: none;\n}\n\n.range:disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n/*\nCopyright 2012 Adobe Systems Inc.;\nLicensed under the Apache License, Version 2.0 (the \"License\");\nyou may not use this file except in compliance with the License.\nYou may obtain a copy of the License at\n\nhttp://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an \"AS IS\" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.\n*/\n\n/*\nCopyright 2012 Adobe Systems Inc.;\nLicensed under the Apache License, Version 2.0 (the \"License\");\nyou may not use this file except in compliance with the License.\nYou may obtain a copy of the License at\n\nhttp://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software\ndistributed under the License is distributed on an \"AS IS\" BASIS,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\nSee the License for the specific language governing permissions and\nlimitations under the License.\n*/\n\n.range,\n.topcoat-range {\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  vertical-align: top;\n  outline: none;\n  -webkit-appearance: none;\n}\n\n.range__thumb,\n.topcoat-range::-moz-range-thumb {\n  cursor: pointer;\n}\n\n.range__thumb--webkit,\n.topcoat-range::-webkit-slider-thumb {\n  cursor: pointer;\n  -webkit-appearance: none;\n}\n\n.range:disabled,\n.topcoat-range:disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n/* topdoc\n  name: Range\n  description: Range input\n  modifiers:\n    :active: Active state\n    :disabled: Disabled state\n    :hover: Hover state\n    :focus: Focused\n  markup:\n    <input type=\"range\" class=\"topcoat-range\">\n    <input type=\"range\" class=\"topcoat-range\" disabled>\n  examples:\n    mobile range: http://codepen.io/Topcoat/pen/BskEn\n  tags:\n    - desktop\n    - mobile\n    - range\n*/\n\n.topcoat-range {\n  border-radius: 6px;\n  border: 1px solid #a5a8a8;\n  background-color: #d3d7d7;\n  height: 1rem;\n  border-radius: 30px;\n}\n\n.topcoat-range::-moz-range-track {\n  border-radius: 6px;\n  border: 1px solid #a5a8a8;\n  background-color: #d3d7d7;\n  height: 1rem;\n  border-radius: 30px;\n}\n\n.topcoat-range::-webkit-slider-thumb {\n  height: 3rem;\n  width: 2rem;\n  background-color: #e5e9e8;\n  border: 1px solid #a5a8a8;\n  border-radius: 6px;\n  box-shadow: inset 0 1px #fff;\n}\n\n.topcoat-range::-moz-range-thumb {\n  height: 3rem;\n  width: 2rem;\n  background-color: #e5e9e8;\n  border: 1px solid #a5a8a8;\n  border-radius: 6px;\n  box-shadow: inset 0 1px #fff;\n}\n\n.topcoat-range:focus::-webkit-slider-thumb {\n  border: 1px solid #0940fd;\n  box-shadow: 0 0 0 2px #6fb5f1;\n}\n\n.topcoat-range:focus::-moz-range-thumb {\n  border: 1px solid #0940fd;\n  box-shadow: 0 0 0 2px #6fb5f1;\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n.search-input {\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  vertical-align: top;\n  outline: none;\n  -webkit-appearance: none;\n}\n\ninput[type=\"search\"]::-webkit-search-cancel-button {\n  -webkit-appearance: none;\n}\n\n.search-input:disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n.search-input,\n.topcoat-search-input,\n.topcoat-search-input--large {\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  vertical-align: top;\n  outline: none;\n  -webkit-appearance: none;\n}\n\ninput[type=\"search\"]::-webkit-search-cancel-button {\n  -webkit-appearance: none;\n}\n\n.search-input:disabled,\n.topcoat-search-input:disabled,\n.topcoat-search-input--large:disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n/* topdoc\n  name: Search Input\n  description: A text input designed for searching.\n  modifiers:\n    :disabled: Disabled state\n  markup:\n    <input type=\"search\" value=\"\" placeholder=\"search\" class=\"topcoat-search-input\">\n    <input type=\"search\" value=\"\" placeholder=\"search\" class=\"topcoat-search-input\" disabled>\n  tags:\n    - desktop\n    - light\n    - mobile\n    - text\n    - input\n    - search\n    - form\n*/\n\n.topcoat-search-input,\n.topcoat-search-input--large {\n  line-height: 3rem;\n  font-size: 16px;\n  border: 1px solid #a5a8a8;\n  background-color: #d3d7d7;\n  box-shadow: inset 0 1px rgba(0,0,0,0.12);\n  color: #454545;\n  padding: 0 0 0 2rem;\n  border-radius: 30px;\n  background-image: url(\"../img/search.svg\");\n  background-position: 1em center;\n  background-repeat: no-repeat;\n  background-size: 16px;\n}\n\n.topcoat-search-input:focus,\n.topcoat-search-input--large:focus {\n  background-image: url(\"../img/search_dark.svg\");\n  background-color: #edf1f1;\n  color: #000;\n  border: 1px solid #0940fd;\n  box-shadow: 0 0 0 2px #6fb5f1;\n}\n\n.topcoat-search-input::-webkit-search-cancel-button,\n.topcoat-search-input::-webkit-search-decoration,\n.topcoat-search-input--large::-webkit-search-cancel-button,\n.topcoat-search-input--large::-webkit-search-decoration {\n  margin-right: 5px;\n}\n\n.topcoat-search-input:focus::-webkit-input-placeholder,\n.topcoat-search-input:focus::-webkit-input-placeholder {\n  color: #c6c8c8;\n}\n\n.topcoat-search-input:disabled::-webkit-input-placeholder {\n  color: #000;\n}\n\n.topcoat-search-input:disabled::-moz-placeholder {\n  color: #000;\n}\n\n.topcoat-search-input:disabled:-ms-input-placeholder {\n  color: #000;\n}\n\n/* topdoc\n  name: Large Search Input\n  description: A large text input designed for searching.\n  modifiers:\n    :disabled: Disabled state\n  markup:\n    <input type=\"search\" value=\"\" placeholder=\"search\" class=\"topcoat-search-input--large\">\n    <input type=\"search\" value=\"\" placeholder=\"search\" class=\"topcoat-search-input--large\" disabled>\n  tags:\n    - desktop\n    - light\n    - mobile\n    - text\n    - input\n    - search\n    - form\n    - large\n*/\n\n.topcoat-search-input--large {\n  line-height: 4.375rem;\n  font-size: 1.3rem;\n  font-weight: 200;\n  padding: 0 0 0 2.9rem;\n  border-radius: 40px;\n  background-position: 1.2em center;\n  background-size: 1.3rem;\n}\n\n.topcoat-search-input--large:disabled {\n  color: #000;\n}\n\n.topcoat-search-input--large:disabled::-webkit-input-placeholder {\n  color: #000;\n}\n\n.topcoat-search-input--large:disabled::-moz-placeholder {\n  color: #000;\n}\n\n.topcoat-search-input--large:disabled:-ms-input-placeholder {\n  color: #000;\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n.switch {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n}\n\n.switch__input {\n  position: absolute;\n  overflow: hidden;\n  padding: 0;\n  border: 0;\n  opacity: 0.001;\n  z-index: 1;\n  vertical-align: top;\n  outline: none;\n}\n\n.switch__toggle {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.switch__toggle:before,\n.switch__toggle:after {\n  content: '';\n  position: absolute;\n  z-index: -1;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n}\n\n.switch--disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n.switch,\n.topcoat-switch {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n}\n\n.switch__input,\n.topcoat-switch__input {\n  position: absolute;\n  overflow: hidden;\n  padding: 0;\n  border: 0;\n  opacity: 0.001;\n  z-index: 1;\n  vertical-align: top;\n  outline: none;\n}\n\n.switch__toggle,\n.topcoat-switch__toggle {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.switch__toggle:before,\n.switch__toggle:after,\n.topcoat-switch__toggle:before,\n.topcoat-switch__toggle:after {\n  content: '';\n  position: absolute;\n  z-index: -1;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n}\n\n.switch--disabled,\n.topcoat-switch__input:disabled + .topcoat-switch__toggle {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n/* topdoc\n  name: Switch\n  description: Default skin for Topcoat switch\n  modifiers:\n    :focus: Focus state\n    :disabled: Disabled state\n  markup:\n    <label class=\"topcoat-switch\">\n      <input type=\"checkbox\" class=\"topcoat-switch__input\">\n      <div class=\"topcoat-switch__toggle\"></div>\n    </label>\n    <br>\n    <br>\n    <label class=\"topcoat-switch\">\n      <input type=\"checkbox\" class=\"topcoat-switch__input\" checked>\n      <div class=\"topcoat-switch__toggle\"></div>\n    </label>\n    <br>\n    <br>\n    <label class=\"topcoat-switch\">\n      <input type=\"checkbox\" class=\"topcoat-switch__input\" disabled>\n      <div class=\"topcoat-switch__toggle\"></div>\n    </label>\n  examples:\n    mobile switch: http://codepen.io/Topcoat/pen/upxds\n  tags:\n    - desktop\n    - light\n    - mobile\n    - switch\n*/\n\n.topcoat-switch {\n  font-size: 16px;\n  padding: 0 1.25rem;\n  border-radius: 6px;\n  border: 1px solid #a5a8a8;\n  overflow: hidden;\n  width: 6rem;\n}\n\n.topcoat-switch__toggle:before,\n.topcoat-switch__toggle:after {\n  top: -1px;\n  width: 5rem;\n}\n\n.topcoat-switch__toggle:before {\n  content: 'ON';\n  color: #0083e8;\n  background-color: #e0f0fa;\n  right: 1rem;\n  padding-left: 1.5rem;\n}\n\n.topcoat-switch__toggle {\n  line-height: 3rem;\n  height: 3rem;\n  width: 2rem;\n  border-radius: 6px;\n  color: #454545;\n  text-shadow: 0 1px #fff;\n  background-color: #e5e9e8;\n  border: 1px solid #a5a8a8;\n  margin-left: -1.3rem;\n  margin-bottom: -1px;\n  margin-top: -1px;\n  box-shadow: inset 0 1px #fff;\n  -webkit-transition: margin-left 0.05s ease-in-out;\n  transition: margin-left 0.05s ease-in-out;\n}\n\n.topcoat-switch__toggle:after {\n  content: 'OFF';\n  background-color: #d3d7d7;\n  left: 1rem;\n  padding-left: 2rem;\n}\n\n.topcoat-switch__input:checked + .topcoat-switch__toggle {\n  margin-left: 2.7rem;\n}\n\n.topcoat-switch__input:focus + .topcoat-switch__toggle {\n  border: 1px solid #0940fd;\n  box-shadow: 0 0 0 2px #6fb5f1;\n}\n\n.topcoat-switch__input:disabled + .topcoat-switch__toggle:after,\n.topcoat-switch__input:disabled + .topcoat-switch__toggle:before {\n  background: transparent;\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n.button,\n.topcoat-tab-bar__button {\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  text-decoration: none;\n}\n\n.button--quiet {\n  background: transparent;\n  border: 1px solid transparent;\n  box-shadow: none;\n}\n\n.button--disabled,\n.topcoat-tab-bar__button:disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n.button-bar,\n.topcoat-tab-bar {\n  display: table;\n  table-layout: fixed;\n  white-space: nowrap;\n  margin: 0;\n  padding: 0;\n}\n\n.button-bar__item,\n.topcoat-tab-bar__item {\n  display: table-cell;\n  width: auto;\n  border-radius: 0;\n}\n\n.button-bar__item > input,\n.topcoat-tab-bar__item > input {\n  position: absolute;\n  overflow: hidden;\n  padding: 0;\n  border: 0;\n  opacity: 0.001;\n  z-index: 1;\n  vertical-align: top;\n  outline: none;\n}\n\n.button-bar__button {\n  border-radius: inherit;\n}\n\n.button-bar__item:disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n/* topdoc\n  name: Tab Bar\n  description: Component of tab buttons\n  modifiers:\n    :disabled: Disabled state\n  markup:\n    <div class=\"topcoat-tab-bar\">\n      <label class=\"topcoat-tab-bar__item\">\n        <input type=\"radio\" name=\"tab-bar\">\n        <button class=\"topcoat-tab-bar__button\">One</button>\n      </label>\n      <label class=\"topcoat-tab-bar__item\">\n        <input type=\"radio\" name=\"tab-bar\">\n        <button class=\"topcoat-tab-bar__button\">Two</button>\n      </label>\n      <label class=\"topcoat-tab-bar__item\">\n        <input type=\"radio\" name=\"tab-bar\">\n        <button class=\"topcoat-tab-bar__button\">Three</button>\n      </label>\n    </div>\n  examples:\n    mobile tab bar: http://codepen.io/Topcoat/pen/rJICF\n  tags:\n    - desktop\n    - light\n    - dark\n    - mobile\n    - tab\n    - group\n    - bar\n*/\n\n.topcoat-tab-bar__button {\n  padding: 0 1.25rem;\n  height: 3rem;\n  line-height: 3rem;\n  letter-spacing: 1px;\n  color: #454545;\n  text-shadow: 0 1px #fff;\n  vertical-align: top;\n  background-color: #e5e9e8;\n  box-shadow: inset 0 1px #fff;\n  border-top: 1px solid #a5a8a8;\n}\n\n.topcoat-tab-bar__button:active,\n.topcoat-tab-bar__button--large:active,\n:checked + .topcoat-tab-bar__button {\n  color: #0083e8;\n  background-color: #e0f0fa;\n  box-shadow: inset 0 0 2px #c0ced8;\n}\n\n.topcoat-tab-bar__button:focus,\n.topcoat-tab-bar__button--large:focus {\n  z-index: 1;\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n.input,\n.topcoat-text-input,\n.topcoat-text-input--large {\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  vertical-align: top;\n  outline: none;\n}\n\n.input:disabled,\n.topcoat-text-input:disabled,\n.topcoat-text-input--large:disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n/* topdoc\n  name: Text input\n  description: Topdoc text input\n  modifiers:\n    :disabled: Disabled state\n    :focus: Focused\n    :invalid: Hover state\n  markup:\n    <input type=\"text\" class=\"topcoat-text-input\" placeholder=\"text\" value=\"\">\n    <br>\n    <br>\n    <input type=\"text\" class=\"topcoat-text-input\" placeholder=\"text\" value=\"\" disabled>\n    <br>\n    <br>\n    <input type=\"text\" class=\"topcoat-text-input\" placeholder=\"text\" value=\"fail\" pattern=\"not-fail\">\n  tags:\n    - desktop\n    - mobile\n    - text\n    - input\n*/\n\n.topcoat-text-input,\n.topcoat-text-input--large {\n  line-height: 3rem;\n  font-size: 16px;\n  letter-spacing: 1px;\n  padding: 0 1.25rem;\n  border: 1px solid #a5a8a8;\n  border-radius: 6px;\n  background-color: #d3d7d7;\n  box-shadow: inset 0 1px rgba(0,0,0,0.12);\n  color: #454545;\n  vertical-align: top;\n}\n\n.topcoat-text-input:focus,\n.topcoat-text-input--large:focus {\n  background-color: #edf1f1;\n  color: #000;\n  border: 1px solid #0940fd;\n  box-shadow: 0 0 0 2px #6fb5f1;\n}\n\n.topcoat-text-input:disabled::-webkit-input-placeholder {\n  color: #000;\n}\n\n.topcoat-text-input:disabled::-moz-placeholder {\n  color: #000;\n}\n\n.topcoat-text-input:disabled:-ms-input-placeholder {\n  color: #000;\n}\n\n.topcoat-text-input:invalid {\n  border: 1px solid #d83b75;\n}\n\n/* topdoc\n  name: Large Text Input\n  description: A bigger input, still for text.\n  modifiers:\n    :disabled: Disabled state\n    :focus: Focused\n    :invalid: Hover state\n  markup:\n    <input type=\"text\" class=\"topcoat-text-input--large\" value=\"\" placeholder=\"text\">\n    <br>\n    <br>\n    <input type=\"text\" class=\"topcoat-text-input--large\" value=\"\" placeholder=\"text\" disabled>\n    <br>\n    <br>\n    <input type=\"text\" class=\"topcoat-text-input--large\" placeholder=\"text\" value=\"fail\" pattern=\"not-fail\">\n  tags:\n    - desktop\n    - light\n    - mobile\n    - form\n    - input\n    - large\n*/\n\n.topcoat-text-input--large {\n  line-height: 4.375rem;\n  font-size: 1.3rem;\n}\n\n.topcoat-text-input--large:disabled {\n  color: #000;\n}\n\n.topcoat-text-input--large:disabled::-webkit-input-placeholder {\n  color: #000;\n}\n\n.topcoat-text-input--large:disabled::-moz-placeholder {\n  color: #000;\n}\n\n.topcoat-text-input--large:disabled:-ms-input-placeholder {\n  color: #000;\n}\n\n.topcoat-text-input--large:invalid {\n  border: 1px solid #d83b75;\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n.textarea {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  vertical-align: top;\n  resize: none;\n  outline: none;\n}\n\n.textarea:disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n/**\n*\n* Copyright 2012 Adobe Systems Inc.;\n*\n* Licensed under the Apache License, Version 2.0 (the \"License\");\n* you may not use this file except in compliance with the License.\n* You may obtain a copy of the License at\n*\n* http://www.apache.org/licenses/LICENSE-2.0\n*\n* Unless required by applicable law or agreed to in writing, software\n* distributed under the License is distributed on an \"AS IS\" BASIS,\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n* See the License for the specific language governing permissions and\n* limitations under the License.\n*\n*/\n\n.textarea,\n.topcoat-textarea,\n.topcoat-textarea--large {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  vertical-align: top;\n  resize: none;\n  outline: none;\n}\n\n.textarea:disabled,\n.topcoat-textarea:disabled,\n.topcoat-textarea--large:disabled {\n  opacity: 0.3;\n  cursor: default;\n  pointer-events: none;\n}\n\n/* topdoc\n  name: Textarea\n  description: A whole area, just for text.\n  modifiers:\n    :disabled: Disabled state\n  markup:\n    <textarea class=\"topcoat-textarea\" rows=\"6\" cols=\"36\" placeholder=\"Textarea\"></textarea>\n    <br>\n    <br>\n    <textarea class=\"topcoat-textarea\" rows=\"6\" cols=\"36\" placeholder=\"Textarea\" disabled></textarea>\n  tags:\n    - desktop\n    - light\n    - mobile\n    - form\n    - input\n    - textarea\n*/\n\n.topcoat-textarea,\n.topcoat-textarea--large {\n  padding: 2rem;\n  font-size: 2.5rem;\n  font-weight: 200;\n  border-radius: 6px;\n  line-height: 3rem;\n  border: 1px solid #a5a8a8;\n  background-color: #d3d7d7;\n  box-shadow: inset 0 1px rgba(0,0,0,0.12);\n  color: #454545;\n  letter-spacing: 1px;\n}\n\n.topcoat-textarea:focus,\n.topcoat-textarea--large:focus {\n  background-color: #edf1f1;\n  color: #000;\n  border: 1px solid #0940fd;\n  box-shadow: 0 0 0 2px #6fb5f1;\n}\n\n.topcoat-textarea:disabled::-webkit-input-placeholder {\n  color: #000;\n}\n\n.topcoat-textarea:disabled::-moz-placeholder {\n  color: #000;\n}\n\n.topcoat-textarea:disabled:-ms-input-placeholder {\n  color: #000;\n}\n\n/* topdoc\n  name: Large Textarea\n  description: A whole area, just for text; now available in large.\n  modifiers:\n    :disabled: Disabled state\n  markup:\n    <textarea class=\"topcoat-textarea--large\" rows=\"6\" cols=\"36\" placeholder=\"Textarea\"></textarea>\n    <br>\n    <br>\n    <textarea class=\"topcoat-textarea--large\" rows=\"6\" cols=\"36\" placeholder=\"Textarea\" disabled></textarea>\n  tags:\n    - desktop\n    - light\n    - mobile\n    - form\n    - input\n    - textarea\n*/\n\n.topcoat-textarea--large {\n  font-size: 3rem;\n  line-height: 4.375rem;\n}\n\n.topcoat-textarea--large:disabled {\n  color: #000;\n}\n\n.topcoat-textarea--large:disabled::-webkit-input-placeholder {\n  color: #000;\n}\n\n.topcoat-textarea--large:disabled::-moz-placeholder {\n  color: #000;\n}\n\n.topcoat-textarea--large:disabled:-ms-input-placeholder {\n  color: #000;\n}\n\n@font-face {\n  font-family: \"Source Sans\";\n  src: url(\"../font/SourceSansPro-Regular.otf\");\n}\n\n@font-face {\n  font-family: \"Source Sans\";\n  src: url(\"../font/SourceSansPro-Light.otf\");\n  font-weight: 200;\n}\n\n@font-face {\n  font-family: \"Source Sans\";\n  src: url(\"../font/SourceSansPro-Semibold.otf\");\n  font-weight: 600;\n}\n\nbody {\n  margin: 0;\n  padding: 0;\n  background: #dfe2e2;\n  color: #000;\n  font: 16px \"Source Sans\", helvetica, arial, sans-serif;\n  font-weight: 200;\n}\n\n:focus {\n  outline-color: transparent;\n  outline-style: none;\n}\n\n.topcoat-icon--menu-stack {\n  background: url(\"../img/hamburger_dark.svg\") no-repeat;\n  background-size: cover;\n}\n\n.quarter {\n  width: 25%;\n}\n\n.half {\n  width: 50%;\n}\n\n.three-quarters {\n  width: 75%;\n}\n\n.third {\n  width: 33.333%;\n}\n\n.two-thirds {\n  width: 66.666%;\n}\n\n.full {\n  width: 100%;\n}\n\n.left {\n  text-align: left;\n}\n\n.center {\n  text-align: center;\n}\n\n.right {\n  text-align: right;\n}\n\n.reset-ui {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  background-clip: padding-box;\n  position: relative;\n  display: inline-block;\n  vertical-align: top;\n  padding: 0;\n  margin: 0;\n  font: inherit;\n  color: inherit;\n  background: transparent;\n  border: none;\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n/* This file should include color and image variables corresponding to the dark theme */\n\n/* Call To Action */\n\n/* Icons */\n\n/* Navigation Bar */\n\n/* Text Input */\n\n/* Search Input */\n\n/* List */\n\n/* Checkbox */\n\n/* Overlay */\n\n/* Progress bar */\n\n/* Checkbox */\n\n/* Radio Button */\n\n/* Tab bar */\n\n/* Switch */\n\n/* Icon Button */\n\n/* Navigation bar */\n\n/* List */\n\n/* Search Input */\n\n/* Textarea */\n\n/* Checkbox */\n\n/* Radio */\n\n/* Range input */\n\n/* Search Input */\n\n/* Switch */\n\n/* This file should include color and image variables corresponding to the light theme */\n\n/* Call To Action */\n\n/* Icons */\n\n/* Navigation Bar */\n\n/* Text Input */\n\n/* List */\n\n/* Overlay */\n\n/* Progress bar */\n\n/* Checkbox */\n\n/* Range input */\n\n/* Radio Button */\n\n/* Tab bar */\n\n/* Switch */\n\n/* Containers */\n\n/* Icon Button */\n\n/* Navigation bar */\n\n/* List */\n\n/* Search Input */\n\n/* Text Area */\n\n/* Checkbox */\n\n/* Radio */\n\n/* Range input */\n\n/* Search Input */\n\n/* Switch */\n\n/* Text Input */\n\n/* Radio input */\n\n/* Overlay */\n\n/* Textarea */\n\n/* Progress bar container */\n\n/* Progress bar progress */\n\n/* Search input */\n\n/* Switch */\n\n/* Notification */";for(var p in returnMe){ proxy[p] = returnMe[p]; }return returnMe;})());

insertCss(
	topcoatCss["topcoat-mobile-light.css"]
		.replace(/..\/font\/(.*?)\.otf/g, 
			function(match, p1){
				p1 = p1 + ".otf";
				return "data:application/octet-stream;base64,"+topcoatFonts[p1];
			}
		)
);

module.exports = View.extend({
	events: {
		"click a": "link"
	},
	link: function(e){
		e.preventDefault();
		Backbone.trigger("go", {href: e.currentTarget.getAttribute('href')});
	},
	render: function(){
		if(this.rendered) return
		var map = { 
			'#title a': { href: "/", _text: "Brandon's Blog" },
			'#menu': Backbone.sections.map(function(section){
				return { 'a': { href: '/articles/'+section, _text: section } }
			})
		}
		var rendered = this.html.render("body.html", map);		
		Backbone.transition( this.$el.html( rendered ) );
		this.rendered = true;
	},
	initialize: function(){
		this.html = Backbone.collections.html;
		this.listenToOnce(this.html, "fetched", this.render );
		this.html.fetch();
	}
});

},{"../../shared/View":15,"foldify":25,"insert-css":30}],12:[function(require,module,exports){
var View = require('../../shared/View');

module.exports = View.extend({
	render: function(){
		if(this.rendered) return
		var rendered = this.html.render("post.html", 
			{
				'.link': { href: "/article/"+this.type+"/"+this.slug},
				'.title': this.post.get("title"),
				'.created': this.post.get("created"),
				'.content': { _html: this.post.get("content") }
			}
		);
		Backbone.transition( this.$el.html( rendered ) );
		this.rendered = true;
	},
	fetchPost: function(){
		if(this.fetched || !this.posts.fetched || !this.html.fetched) return
		this.post = this.posts.findWhere({"slug": this.slug});
	
		if(!this.post) return Backbone.trigger("go", {href: "/403", message: "Post does not exist!"});

		this.listenToOnce( this.post, "fetched", this.render );
		this.post.fetch();
		this.fetched = true;
	},
	initialize: function(opts){

		this.slug = opts.slug;
		this.type = opts.type;

		this.posts = Backbone.collections[this.type];
		this.listenToOnce( this.posts, "fetched", this.fetchPost );
		this.posts.fetch();

		this.html = Backbone.collections.html;
		this.listenToOnce( this.html, "fetched", this.fetchPost );
		this.html.fetch();
	}
});
},{"../../shared/View":15}],13:[function(require,module,exports){
var View = require('../../shared/View');

module.exports = View.extend({
	render: function(){
		if(this.rendered || !this.posts.fetched || !this.html.fetched ) return
		var map = { 
			'#title a': { href: "/", _text: this.type },
			'#menu': this.posts.map(function(post){
				return { 'a': { href: "/article/" + post.get("type") + "/" + post.get("slug"), 
								_text: post.get("title") } 
						}
			})
		}
		var rendered = this.html.render("body.html", map);		
		Backbone.transition( this.$el.html( rendered ) );
		this.rendered = true;
	},
	compileByTag: function(coll, models){
		this.posts = coll;
		models.forEach(function(model){
			if(!this.posts.get({id: model.get("id")}))
				this.posts.add(model);
		}.bind(this));
		this.posts.fetched = true;
		this.render();
	},
	initialize: function(options){
		this.counter = 0;

		this.type = options.type;
		if(options.tag){
			this.posts = {};
			var models = [];
			for(var coll in Backbone.collections){
				if(coll === "html") continue;
				this.counter++;
				this.listenToOnce( Backbone.collections[coll], "fetched", function(coll){
					models = models.concat( Backbone.collections[coll].filter(function(item){
						var tags = item.get('tags');
						return tags && ~tags.indexOf(options.tag); 
					}) );
					if(!--this.counter) this.compileByTag(Backbone.collections[coll], models);	
				}.bind(this, coll));
				Backbone.collections[coll].fetch();
			}
		}else{
			this.posts = Backbone.collections[this.type];
			this.listenToOnce(this.posts, "fetched", this.render );
			this.posts.fetch();			
		}

		this.html = Backbone.collections.html;
		this.listenToOnce(this.html, "fetched", this.render );
		this.html.fetch();
	}
});
},{"../../shared/View":15}],14:[function(require,module,exports){
var ViewCore = require('./ViewCore');

var Router = Backbone.Router.extend({
    go: function(data){
      this.navigate(data.href, {
        trigger: (data.trigger === false) ? false : true 
      });
    },
    initialize: function(){
      $.ajaxSetup({ cache: false });
      Backbone.on('go', $.proxy(this.go, this));
    }
});

Router = Router.extend(ViewCore);

module.exports = new Router();
},{"./ViewCore":16}],15:[function(require,module,exports){
var ViewCore = require('./ViewCore');
module.exports = Backbone.View.extend(ViewCore);
},{"./ViewCore":16}],16:[function(require,module,exports){
(function (process){
module.exports = {
    _destroyViews: function(group, options, subview){
      options = options || {};
      if(!this._views.hasOwnProperty(group)) return;
      this._views[group].forEach( function(view){
        view.destroy(undefined, {}, true);
        view.stopListening();
        view.undelegateEvents();
        if(options.replace !== true || Backbone.isMobile || subview) return
        var el = view.$el;
        if(el && el.length)
            el.replaceWith("<div id="+el.attr('id')+">");        
      });
      delete this._views[group];
    },
    view: function(View, options){
      options = options || {};
      options.group = options.group || "global";
      if(!this._views) this._views = {};
      if(!this._views[options.group]){
        this._views[options.group] = [];
      }else{
        if( options.resetAll === true )
          this.destroy(null, options);
        else if( options.reset !== false )
          this.destroy(options.group, options);        
      }
      this._views[options.group] = [];
      process.nextTick(function(){          
        var newview = new View(options);
        newview.parent = this;
        newview.group = options.group;
        newview.label = options.label;
        this._views[options.group].push(newview);
      }.bind(this));
    },
    destroy: function(group, options, subview){
      if(group && this._views[group]){
        this._destroyViews(group, options, subview)
      }
      else{
        for(var group in this._views){
          this._destroyViews(group, options, subview);
        }
      }
    },
    page_error: function(model, resp){
        if(Number(resp.status) === 401){
          window.location.href = '/sign-out';
          return;
        }
        Backbone.trigger('go', { href: '/'+resp.status });
    }    
}
}).call(this,require("C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js"))
},{"C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js":5}],17:[function(require,module,exports){
(function (process){
var store = require('./store');
var useAdapter = Backbone.isIE && Backbone.isIE < 10;

module.exports = function(options){
	return useAdapter 
		? newstore(options)
		: new IDBStore(options);
}

function newstore(options){
	
	process.nextTick(function(){
		if(options.onStoreReady)
			options.onStoreReady();		
	});

	return {
		putBatch: function(arr, cb){
			arr.forEach(this.put);
			return cb();
		},
		get: function(id, cb){
			return cb(store.get(""+id));
		},
		put: function(item){
			return store.set(""+item.id, item);
		},
		iterate: function(iter, obj){
			var all = store.getAll();
			all.forEach(iter);
			return obj.onEnd ? obj.onEnd() : false;
		}
	}
}

}).call(this,require("C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js"))
},{"./store":18,"C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js":5}],18:[function(require,module,exports){
/* Copyright (c) 2010-2013 Marcus Westin */
(function(e){function o(){try{return r in e&&e[r]}catch(t){return!1}}var t={},n=e.document,r="localStorage",i="script",s;t.disabled=!1,t.set=function(e,t){},t.get=function(e){},t.remove=function(e){},t.clear=function(){},t.transact=function(e,n,r){var i=t.get(e);r==null&&(r=n,n=null),typeof i=="undefined"&&(i=n||{}),r(i),t.set(e,i)},t.getAll=function(){},t.forEach=function(){},t.serialize=function(e){return JSON.stringify(e)},t.deserialize=function(e){if(typeof e!="string")return undefined;try{return JSON.parse(e)}catch(t){return e||undefined}};if(o())s=e[r],t.set=function(e,n){return n===undefined?t.remove(e):(s.setItem(e,t.serialize(n)),n)},t.get=function(e){return t.deserialize(s.getItem(e))},t.remove=function(e){s.removeItem(e)},t.clear=function(){s.clear()},t.getAll=function(){var e={};return t.forEach(function(t,n){e[t]=n}),e},t.forEach=function(e){for(var n=0;n<s.length;n++){var r=s.key(n);e(r,t.get(r))}};else if(n.documentElement.addBehavior){var u,a;try{a=new ActiveXObject("htmlfile"),a.open(),a.write("<"+i+">document.w=window</"+i+'><iframe src="/favicon.ico"></iframe>'),a.close(),u=a.w.frames[0].document,s=u.createElement("div")}catch(f){s=n.createElement("div"),u=n.body}function l(e){return function(){var n=Array.prototype.slice.call(arguments,0);n.unshift(s),u.appendChild(s),s.addBehavior("#default#userData"),s.load(r);var i=e.apply(t,n);return u.removeChild(s),i}}var c=new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]","g");function h(e){return e.replace(/^d/,"___$&").replace(c,"___")}t.set=l(function(e,n,i){return n=h(n),i===undefined?t.remove(n):(e.setAttribute(n,t.serialize(i)),e.save(r),i)}),t.get=l(function(e,n){return n=h(n),t.deserialize(e.getAttribute(n))}),t.remove=l(function(e,t){t=h(t),e.removeAttribute(t),e.save(r)}),t.clear=l(function(e){var t=e.XMLDocument.documentElement.attributes;e.load(r);for(var n=0,i;i=t[n];n++)e.removeAttribute(i.name);e.save(r)}),t.getAll=function(e){var n={};return t.forEach(function(e,t){n[e]=t}),n},t.forEach=l(function(e,n){var r=e.XMLDocument.documentElement.attributes;for(var i=0,s;s=r[i];++i)n(s.name,t.deserialize(e.getAttribute(s.name)))})}try{var p="__storejs__";t.set(p,p),t.get(p)!=p&&(t.disabled=!0),t.remove(p)}catch(f){t.disabled=!0}t.enabled=!t.disabled,typeof module!="undefined"&&module.exports&&this.module!==module?module.exports=t:typeof define=="function"&&define.amd?define(t):e.store=t})(Function("return this")())

},{}],19:[function(require,module,exports){
(function (process){
var foldify = require('foldify'),
	hyperglue = require('hyperglue'),
	conf = require('confify');

module.exports = function(options){
	var HTMLCollection = Backbone.Collection.extend({
		model: Backbone.Model,
		url: function(){
			return '/HTMLCollection/' + this.id;
		},
		parse: function(resp){
			process.nextTick($.proxy( function(){
				this.trigger("fetched");
			}, this));
			this.fetched = true;
			var output = [];
			for(var name in resp){
				output.push({id: name, template: resp[name]});
			}
			return output;
		},
		initialize: function(models, options){
			this.options || (this.options = options || {});
			this.id = this.options.id || 0;
		},
		render: function(template, map){
			if((template = this.get(template)) && (template = template.get("template")) ){
				return hyperglue(template, map);
			}
		},
		fetch: function () {
			if(true){
				this.fetched = true;
				var self = this;
				var htmls = ((function(){ var bind = function bind(fn){ var args = Array.prototype.slice.call(arguments, 1); return function(){ var onearg = args.shift(); var newargs = args.concat(Array.prototype.slice.call(arguments,0)); var returnme = fn.apply(onearg, newargs ); return returnme; };  };var fold = require('foldify'), proxy = {}, map = false;var returnMe = bind( fold, {foldStatus: true, map: map}, proxy);returnMe["body.html"] = "<body>\r\n\r\n\t<div id=\"header\">\r\n\t\t<h1 id=\"title\"><a></a></h1>\r\n\t\t<div id=\"menu\">\r\n\t\t\t<a></a>\r\n\t\t</div>\r\n\t</div>\r\n\t<div id=\"page\"></div>\r\n\t<div id=\"footer\"></div>\r\n</body>";returnMe["post.html"] = "<div class=\"post\">\r\n\t<a class=\"link\"><h1 class=\"title\"></h1><span class=\"created\"></span></a>\r\n\t<div class=\"content\">\r\n\r\n\t</div>\r\n</div>";returnMe["posts.html"] = "<div class=\"posts\">\r\n\t<h1><a class=\"title\"></a></h1>\r\n\t<div class=\"post\">\r\n\t\t<a class=\"link\"><span class=\"title\"></span> (<span class=\"created\"></span>)</a>\r\n\t</div>\r\n</div>";for(var p in returnMe){ proxy[p] = returnMe[p]; }return returnMe;})());
				for(var name in htmls)
					self.add({id: name, template: htmls[name]});
				process.nextTick(function(){
					self.trigger('fetched');
				});
			}else{
				return Backbone.fetch.apply(this, arguments);			
			}
	    }     
	});

	return new HTMLCollection([], options);
};
}).call(this,require("C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js"))
},{"C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js":5,"confify":22,"foldify":25,"hyperglue":28}],20:[function(require,module,exports){
(function (process){
var foldify = require('foldify'),
	digistify = require('digistify'),
	dbAdapter = require('../adapters/dbAdapter.js');

var Post = require('../models/Post')

module.exports = function(options){
	var GistCollection = Backbone.Collection.extend({
		model: Post,
		comparator: function(gist){
			return -gist.get("id");
		},
		toCollection: function(){
			var self = this;
			var gists = [];
			Backbone.gists.iterate(function(gist){
				if(!~gist.description.indexOf(self.options.identifier)) return
				if(!gist.type) gist.type = self.options.identifier.split("~").join("");
				if(!gist.title) gist.title = gist.description.replace(self.options.identifier, '');
				if(!gist.slug) gist.slug = slug(gist.title);
				gists.push(gist);
			}, {onEnd: onEnd});

			function onEnd(){
				self.add(gists);
		    	self.fetched = true;
		    	process.nextTick(function(){		    		
					self.trigger('fetched');
		    	});
			}
		},
		addGists: function(err, data){
			if(data === "unmodified"){
				Backbone.gists.updated = true;
				return Backbone.trigger("gistsUpdated");					
			}

			var gists = data.data;
			gists = gists.map(function(gist){
				var tags;
				for(var file in gist.files){
					if(!~file.indexOf("tags:")) continue;
					file = file.replace("tags:", "");
					tags = file.split(/, */);
				}
				var ret = { id: +gist.id,	
						 description: gist.description,
						 created: gist.created_at,
						 modified: gist.updated_at }
				if(tags) ret.tags = tags;
				return ret;
			});
			gists.push({id:1, etag: data.etag, description: "etag"});
			Backbone.gists.putBatch(gists, function(){
				Backbone.gists.updated = true;
				Backbone.trigger("gistsUpdated");
			});
		},
		digistify: function(checkData){
			digistify("cellvia", checkData, this.addGists );
		},
		checkGists: function(){
			if(Backbone.gists.updating) return
			Backbone.gists.updating = true;
			Backbone.gists.get(1, this.digistify.bind(this), this.digistify.bind(this) );
		},
		fetch: function () {
			if(!this.fetched){

				if(!Backbone.gists.initialized)
					return this.listenToOnce( Backbone, "db", this.fetch );

				/* if IE load manually
					var conf = require('confify');
					var gists = foldify(conf.paths.root, {whitelist: "gists.json"});
					this.addGists(false, {data: gists})
					return this.toCollection();
				*/

				if(!Backbone.gists.updated){
					this.listenToOnce( Backbone, "gistsUpdated", this.fetch );
					return this.checkGists();					
				}
				this.toCollection();
			}else{
				process.nextTick(function(){
					this.trigger("fetched");				
				}.bind(this));
			}
	    },
		initialize: function(models, options){
			if(!options.identifier) throw new Error("must supply options.identifier!");
			this.options || (this.options = options || {});
			if(!Backbone.gists){
				var self = this;
				Backbone.gists = dbAdapter({
				  dbVersion: 1,
				  storeName: "gists",
				  keyPath: 'id',
				  autoIncrement: false,
				  onStoreReady: function(){
				  	Backbone.gists.initialized = true;
				    Backbone.trigger("db");
				  }
				});				
			}
		}
	});

	return new GistCollection([], options);
};

function slug(input, identifier)
{
	if(identifier) input = input.replace(identifier, '') // Trim identifier
    return input
        .replace(/^\s\s*/, '') // Trim start
        .replace(/\s\s*$/, '') // Trim end
        .toLowerCase() // Camel case is bad
        .replace(/[^a-z0-9_\-~!\+\s]+/g, '') // Exchange invalid chars
        .replace(/[\s]+/g, '-'); // Swap whitespace for single hyphen
}
}).call(this,require("C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js"))
},{"../adapters/dbAdapter.js":17,"../models/Post":21,"C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js":5,"digistify":23,"foldify":25}],21:[function(require,module,exports){
(function (process){
var digistify = require('digistify');
var marked = require('marked');

module.exports = Backbone.Model.extend({
	getGist: function(){
		if(this.get('content')){
			this.fetched = true;
			var self = this;
			process.nextTick(function(){
				self.trigger("fetched");				
			});
		}else{
			var self = this;
			digistify(self.id, {}, function(err, data){
				var contents = data.data;
				if(contents.length === 1){
					self.set("content", marked(contents[0].content) );
				}else{
					self.set("content",marked(contents.filter(function(file){
							return !~file.filename.indexOf("tags:");
						})[0].content)
					);
				}
				Backbone.gists.put(self.toJSON());
				self.fetched = true;
				self.trigger('fetched');
			});
		}
	},
	fetch: function(){	
		if(!this.fetched){
			this.getGist();
		}else{
			process.nextTick(function(){
				this.trigger("fetched");				
			}.bind(this));
		}
	}
})
}).call(this,require("C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js"))
},{"C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js":5,"digistify":23,"marked":31}],22:[function(require,module,exports){
(function (process){
function merge(a, b){
    for(var prop in b){
        a[prop] = b[prop];
    }
}

module.exports = function browser(srcObj){
	if(!process.browser && typeof srcObj === "string") srcObj = require(srcObj);
    merge(browser, srcObj);
};

}).call(this,require("C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js"))
},{"C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js":5}],23:[function(require,module,exports){
(function (process){
var request = require('request');

var exportObj = {
	defaults: {},
	setDefault: function(prop, val){
		if(typeof prop === "object")
			merge(exportObj.defaults, prop);
		else
			exportObj.defaults[prop] = val;		
	},
	getGists: function (user, options, cb){
		if(!isNaN(user)) return exportObj.getFiles.apply(exportObj, arguments);
		if(typeof options === "function"){
			cb = options;
			options = {};
		};
		options = merge(options, exportObj.defaults);
		var gists = [];
		var counter = 0;
		var limit = options.limit || 0;
		var offset = options.offset || 0;
		var identifier = options.identifier || "";
		var transform;

		switch(options.transform){
			case "article":
				transform = function(gist){
					return { id: +gist.id,
							 title: gist.description.replace(identifier, ""),
							 created: gist.created_at,
							 modified: gist.updated_at }
				}
			break;
			default:
				transform = typeof options.transform === "function" ? options.transform : false;
			break;
		}

		var opts = {json: true, headers: {} };
		if(options.etag){
			opts.headers['If-None-Match'] = options.etag;
			delete options.etag; 
		}
		if(typeof options.headers === "object") merge(opts.headers, options.headers);
		if(typeof exportObj.defaults.headers === "object") merge(opts.headers, exportObj.defaults.headers);
		if(!process.browser && !opts.headers['User-Agent']) opts.headers['User-Agent'] = options.userAgent || 'node.js';

		var etag;

		function recurs(){
			opts.url = get_gists_url(user, {per_page: 100, page: ++counter});
			request( opts, function(err, resp, newgists){
				if(resp.statusCode == 304) return cb(null, "unmodified");
				if(err) return cb(err);
				if(resp.statusCode != 200) return cb(new Error("invalid url: "+ opts.url));
				if(!etag) etag = resp.headers ? resp.headers['ETag'] : resp.getResponseHeader('ETag');
				if(typeof newgists !== "object" || typeof newgists.length === "undefined" || newgists.message) return cb(new Error("error: "+ newgists));
				if(!newgists.length) return finalize();

				newgists = newgists.filter(function(gist){
					var test = gist.public 
						&& gist.description 
						&& gist.files
						&& (!options.identifier || ~gist.description.indexOf(options.identifier))
						&& (!options.search || ~gist.description.toLowerCase().indexOf(options.search.toLowerCase()))
						&& (!options.filter || !~gist.description.toLowerCase().indexOf(options.filter.toLowerCase()));

					if (!test) return false;

					if(options.language){
						for( var file in gist.files ){
							if( test = gist.files[file].language.toLowerCase() === options.language.toLowerCase() )
								return test
						}				
					}
					return test
				});

				gists = gists.concat(newgists);
				if(newgists.length < 100 || limit && limit <= gists.length) return finalize();

				recurs();

			});
		}
		recurs();

		function finalize(){
			if(offset || limit) gists = gists.slice(offset, limit);
			if( transform ) gists = gists.map(transform);
			console.log("gists");
			console.log(gists);
			cb(null, { data: gists, etag: etag });
		}
	},

	getFiles: function(id, options, cb){
		if(typeof options === "function"){
			cb = options;
			options = {};
		};
		merge(options, exportObj.defaults);
		var contents = [];
		var transform;

		switch(options.fileTransform){
			case "article":
				transform = function(file){
					return file.content
				}
			break;
			default:
				transform = typeof options.fileTransform === "function" ? options.fileTransform : false;
			break;
		}

		var opts = {json: true, headers: {}, url: get_gist_url(id) };
		if(options.etag){
			opts.headers['If-None-Match'] = options.etag;
			delete options.etag; 
		}
		if(typeof options.headers === "object") merge(opts.headers, options.headers);
		if(typeof exportObj.defaults.headers === "object") merge(opts.headers, exportObj.defaults.headers);
		if(!process.browser && !opts.headers['User-Agent']) opts.headers['User-Agent'] = options.userAgent || 'node.js';

		request( opts, function(err, resp, gist){
			if(resp.statusCode == 304) return cb(null, "unmodified");
			if(err) return cb(err);
			if(resp.statusCode != 200) return cb(new Error("invalid url? "+ opts.url));
			var etag = resp.headers ? resp.headers['ETag'] : resp.getResponseHeader('ETag');
			for(var file in gist.files){
				if(options.language && gist.files[file].language.toLowerCase() !== options.language.toLowerCase()) continue
				contents.push(gist.files[file]);
			}
			if(transform) contents = contents.map(transform);
			cb(null, { data: contents, etag: etag });
		});
	}
}

function get_gists_url(user, options){ return "https://api.github.com/users/"+user+"/gists?per_page="+options.per_page+"&page="+options.page; };
function get_gist_url(id){ return "https://api.github.com/gists/"+id; };
function merge(a, b){ a = a || {}; for (var x in b){ if(typeof a[x] !== "undefined") continue; a[x] = b[x]; } return a; };

module.exports = exportObj.getGists;
module.exports.setDefault = exportObj.setDefault;

}).call(this,require("C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js"))
},{"C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js":5,"request":24}],24:[function(require,module,exports){
// Browser Request
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var XHR = XMLHttpRequest
if (!XHR) throw new Error('missing XMLHttpRequest')

module.exports = request
request.log = {
  'trace': noop, 'debug': noop, 'info': noop, 'warn': noop, 'error': noop
}

var DEFAULT_TIMEOUT = 3 * 60 * 1000 // 3 minutes

//
// request
//

function request(options, callback) {
  // The entry-point to the API: prep the options object and pass the real work to run_xhr.
  if(typeof callback !== 'function')
    throw new Error('Bad callback given: ' + callback)

  if(!options)
    throw new Error('No options given')

  var options_onResponse = options.onResponse; // Save this for later.

  if(typeof options === 'string')
    options = {'uri':options};
  else
    options = JSON.parse(JSON.stringify(options)); // Use a duplicate for mutating.

  options.onResponse = options_onResponse // And put it back.

  if (options.verbose) request.log = getLogger();

  if(options.url) {
    options.uri = options.url;
    delete options.url;
  }

  if(!options.uri && options.uri !== "")
    throw new Error("options.uri is a required argument");

  if(typeof options.uri != "string")
    throw new Error("options.uri must be a string");

  var unsupported_options = ['proxy', '_redirectsFollowed', 'maxRedirects', 'followRedirect']
  for (var i = 0; i < unsupported_options.length; i++)
    if(options[ unsupported_options[i] ])
      throw new Error("options." + unsupported_options[i] + " is not supported")

  options.callback = callback
  options.method = options.method || 'GET';
  options.headers = options.headers || {};
  options.body    = options.body || null
  options.timeout = options.timeout || request.DEFAULT_TIMEOUT

  if(options.headers.host)
    throw new Error("Options.headers.host is not supported");

  if(options.json) {
    options.headers.accept = options.headers.accept || 'application/json'
    if(options.method !== 'GET')
      options.headers['content-type'] = 'application/json'

    if(typeof options.json !== 'boolean')
      options.body = JSON.stringify(options.json)
    else if(typeof options.body !== 'string')
      options.body = JSON.stringify(options.body)
  }

  // If onResponse is boolean true, call back immediately when the response is known,
  // not when the full request is complete.
  options.onResponse = options.onResponse || noop
  if(options.onResponse === true) {
    options.onResponse = callback
    options.callback = noop
  }

  // XXX Browsers do not like this.
  //if(options.body)
  //  options.headers['content-length'] = options.body.length;

  // HTTP basic authentication
  if(!options.headers.authorization && options.auth)
    options.headers.authorization = 'Basic ' + b64_enc(options.auth.username + ':' + options.auth.password);

  return run_xhr(options)
}

var req_seq = 0
function run_xhr(options) {
  var xhr = new XHR
    , timed_out = false
    , is_cors = is_crossDomain(options.uri)
    , supports_cors = ('withCredentials' in xhr)

  req_seq += 1
  xhr.seq_id = req_seq
  xhr.id = req_seq + ': ' + options.method + ' ' + options.uri
  xhr._id = xhr.id // I know I will type "_id" from habit all the time.

  if(is_cors && !supports_cors) {
    var cors_err = new Error('Browser does not support cross-origin request: ' + options.uri)
    cors_err.cors = 'unsupported'
    return options.callback(cors_err, xhr)
  }

  xhr.timeoutTimer = setTimeout(too_late, options.timeout)
  function too_late() {
    timed_out = true
    var er = new Error('ETIMEDOUT')
    er.code = 'ETIMEDOUT'
    er.duration = options.timeout

    request.log.error('Timeout', { 'id':xhr._id, 'milliseconds':options.timeout })
    return options.callback(er, xhr)
  }

  // Some states can be skipped over, so remember what is still incomplete.
  var did = {'response':false, 'loading':false, 'end':false}

  xhr.onreadystatechange = on_state_change
  xhr.open(options.method, options.uri, true) // asynchronous
  if(is_cors)
    xhr.withCredentials = !! options.withCredentials
  xhr.send(options.body)
  return xhr

  function on_state_change(event) {
    if(timed_out)
      return request.log.debug('Ignoring timed out state change', {'state':xhr.readyState, 'id':xhr.id})

    request.log.debug('State change', {'state':xhr.readyState, 'id':xhr.id, 'timed_out':timed_out})

    if(xhr.readyState === XHR.OPENED) {
      request.log.debug('Request started', {'id':xhr.id})
      for (var key in options.headers)
        xhr.setRequestHeader(key, options.headers[key])
    }

    else if(xhr.readyState === XHR.HEADERS_RECEIVED)
      on_response()

    else if(xhr.readyState === XHR.LOADING) {
      on_response()
      on_loading()
    }

    else if(xhr.readyState === XHR.DONE) {
      on_response()
      on_loading()
      on_end()
    }
  }

  function on_response() {
    if(did.response)
      return

    did.response = true
    request.log.debug('Got response', {'id':xhr.id, 'status':xhr.status})
    clearTimeout(xhr.timeoutTimer)
    xhr.statusCode = xhr.status // Node request compatibility

    // Detect failed CORS requests.
    if(is_cors && xhr.statusCode == 0) {
      var cors_err = new Error('CORS request rejected: ' + options.uri)
      cors_err.cors = 'rejected'

      // Do not process this request further.
      did.loading = true
      did.end = true

      return options.callback(cors_err, xhr)
    }

    options.onResponse(null, xhr)
  }

  function on_loading() {
    if(did.loading)
      return

    did.loading = true
    request.log.debug('Response body loading', {'id':xhr.id})
    // TODO: Maybe simulate "data" events by watching xhr.responseText
  }

  function on_end() {
    if(did.end)
      return

    did.end = true
    request.log.debug('Request done', {'id':xhr.id})

    xhr.body = xhr.responseText
    if(options.json) {
      try        { xhr.body = JSON.parse(xhr.responseText) }
      catch (er) { return options.callback(er, xhr)        }
    }

    options.callback(null, xhr, xhr.body)
  }

} // request

request.withCredentials = false;
request.DEFAULT_TIMEOUT = DEFAULT_TIMEOUT;

//
// defaults
//

request.defaults = function(options, requester) {
  var def = function (method) {
    var d = function (params, callback) {
      if(typeof params === 'string')
        params = {'uri': params};
      else {
        params = JSON.parse(JSON.stringify(params));
      }
      for (var i in options) {
        if (params[i] === undefined) params[i] = options[i]
      }
      return method(params, callback)
    }
    return d
  }
  var de = def(request)
  de.get = def(request.get)
  de.post = def(request.post)
  de.put = def(request.put)
  de.head = def(request.head)
  return de
}

//
// HTTP method shortcuts
//

var shortcuts = [ 'get', 'put', 'post', 'head' ];
shortcuts.forEach(function(shortcut) {
  var method = shortcut.toUpperCase();
  var func   = shortcut.toLowerCase();

  request[func] = function(opts) {
    if(typeof opts === 'string')
      opts = {'method':method, 'uri':opts};
    else {
      opts = JSON.parse(JSON.stringify(opts));
      opts.method = method;
    }

    var args = [opts].concat(Array.prototype.slice.apply(arguments, [1]));
    return request.apply(this, args);
  }
})

//
// CouchDB shortcut
//

request.couch = function(options, callback) {
  if(typeof options === 'string')
    options = {'uri':options}

  // Just use the request API to do JSON.
  options.json = true
  if(options.body)
    options.json = options.body
  delete options.body

  callback = callback || noop

  var xhr = request(options, couch_handler)
  return xhr

  function couch_handler(er, resp, body) {
    if(er)
      return callback(er, resp, body)

    if((resp.statusCode < 200 || resp.statusCode > 299) && body.error) {
      // The body is a Couch JSON object indicating the error.
      er = new Error('CouchDB error: ' + (body.error.reason || body.error.error))
      for (var key in body)
        er[key] = body[key]
      return callback(er, resp, body);
    }

    return callback(er, resp, body);
  }
}

//
// Utility
//

function noop() {}

function getLogger() {
  var logger = {}
    , levels = ['trace', 'debug', 'info', 'warn', 'error']
    , level, i

  for(i = 0; i < levels.length; i++) {
    level = levels[i]

    logger[level] = noop
    if(typeof console !== 'undefined' && console && console[level])
      logger[level] = formatted(console, level)
  }

  return logger
}

function formatted(obj, method) {
  return formatted_logger

  function formatted_logger(str, context) {
    if(typeof context === 'object')
      str += ' ' + JSON.stringify(context)

    return obj[method].call(obj, str)
  }
}

// Return whether a URL is a cross-domain request.
function is_crossDomain(url) {
  var rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/

  // jQuery #8138, IE may throw an exception when accessing
  // a field from window.location if document.domain has been set
  var ajaxLocation
  try { ajaxLocation = location.href }
  catch (e) {
    // Use the href attribute of an A element since IE will modify it given document.location
    ajaxLocation = document.createElement( "a" );
    ajaxLocation.href = "";
    ajaxLocation = ajaxLocation.href;
  }

  var ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || []
    , parts = rurl.exec(url.toLowerCase() )

  var result = !!(
    parts &&
    (  parts[1] != ajaxLocParts[1]
    || parts[2] != ajaxLocParts[2]
    || (parts[3] || (parts[1] === "http:" ? 80 : 443)) != (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? 80 : 443))
    )
  )

  //console.debug('is_crossDomain('+url+') -> ' + result)
  return result
}

// MIT License from http://phpjs.org/functions/base64_encode:358
function b64_enc (data) {
    // Encodes string using MIME base64 algorithm
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc="", tmp_arr = [];

    if (!data) {
        return data;
    }

    // assume utf8 data
    // data = this.utf8_encode(data+'');

    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1<<16 | o2<<8 | o3;

        h1 = bits>>18 & 0x3f;
        h2 = bits>>12 & 0x3f;
        h3 = bits>>6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    switch (data.length % 3) {
        case 1:
            enc = enc.slice(0, -2) + '==';
        break;
        case 2:
            enc = enc.slice(0, -1) + '=';
        break;
    }

    return enc;
}

},{}],25:[function(require,module,exports){
(function (process){
var fs = require('fs'),
	path = require('path'),
	minimatch = require('minimatchify');

module.exports = fold;

function fold(toBeFolded){
	if(!toBeFolded) return false;
	var moreArgs = [].slice.call(arguments, 1),
		mergeToMe = {},
		options,
		individual,
		originalFullPath;

	if(isArray(toBeFolded)){
		options = moreArgs[0];
		originalFullPath = options.fullPath;
		toBeFolded.forEach(function(toFold){
			individual = fold.call(this, toFold, options)
			for(var prop in individual){
				if(mergeToMe[prop]){
					options.fullPath = true;
					individual = fold.call(this, toFold, options);
					options.fullPath = originalFullPath;
					break;
				}
			}
			for (var prop in individual) {
	          mergeToMe[prop] = individual[prop];
	        }
		});
		return bind( fold, {foldStatus: true}, mergeToMe );
	}

	var	beingFolded = this && this.foldStatus,
		isObj = typeof toBeFolded === "object" && !beingFolded,
		isFoldObj = typeof toBeFolded === "object" && beingFolded,
		isDir = typeof toBeFolded === "string",
		args,
		output,
		combined;
	
	switch(false){
		case !isDir:
			options = moreArgs[0] || {};
			output = populate.apply(this, [toBeFolded, options]);
		break;
		case !isFoldObj:
			args = moreArgs[0] || [];
			args = isArray(args, true) ? args : [args]
			if(this.foldStatus === "foldOnly"){
				args2 = moreArgs[1] || [];
				args2 = isArray(args2) ? args2 : [args2]
				args = args.concat(args2);
				options = moreArgs[2] || {};				
			}else{
				options = moreArgs[1] || {};
			}			
			output = evaluate.apply(this, [toBeFolded, args, options]);
		break;
		case !isObj:
			options = moreArgs[0] || {};
			for(var name in toBeFolded){
				if( (options.whitelist && !checkList(options.whitelist, name))
				  || (options.blacklist && checkList(options.blacklist, name)) )
					continue
				fold[name] = toBeFolded[name];
			}
			output = bind( fold, {foldStatus: true}, fold );
		break;
	}

	return output;

};

function populate(dirname, options){
	if(process.browser) throw "you must run the foldify browserify transform (foldify/transform.js) for foldify to work in the browser!";
	var proxy = {},
		toString = options.output && options.output.toLowerCase() === "string",
		toArray = options.output && options.output.toLowerCase() === "array",
		encoding = options.encoding || options.enc || "utf-8",
		returnMe,
		existingProps = [],
		newdirname,
		separator,
		parts,
		map = options.tree ? {} : false,
		files = [];

	if(toString){
		returnMe = "";
	}else if(toArray){
		returnMe = [];
	}else{
		returnMe = bind( fold, { foldStatus: true, map: map }, proxy );
	}

    try{
	    if(~dirname.indexOf("/"))
	        separator = "/";
	    if(~dirname.indexOf("\\"))
	        separator = "\\";
	    parts = dirname.split(separator);
        newdirname = path.dirname( require.resolve( parts[0] ) );
    	if(!~newdirname.indexOf("node_modules")) throw "not a node module";
        dirname = newdirname + path.sep + parts.slice(1).join(path.sep);
    }catch(err){}


    function recurs(thisDir){
        fs.readdirSync(thisDir).forEach(function(file){
            var filepath = path.join( thisDir, file);
            if(path.extname(file) === ''){
              if(options.recursive || options.tree) recurs(filepath);
              return  
            } 
            files.push(filepath);        		
        });
    }
    recurs(dirname);

    if(options.whitelist) files = whitelist(options.whitelist, files, dirname)
    if(options.blacklist) files = blacklist(options.blacklist, files, dirname)

	files.forEach(function(filepath){
		var ext = path.extname(filepath),
			name = path.basename(filepath, ext),
			filename = name + ext,
			isJs = (ext === ".js" || ext === ".json"),
			isDir = ext === '',
			propname,
			add,
			last = false;

		if( toString ){
			returnMe += fs.readFileSync(filepath, encoding);					
			return
		}

		if( toArray ){
			returnMe.push( fs.readFileSync(filepath, encoding) );
			return
		}

		if(!options.includeExt && (isJs || options.includeExt === false) )
			propname = name;
		else
			propname = filename;

		if(!options.tree){
	        if(options.fullPath || ~existingProps.indexOf(propname) )
	            propname = path.relative(dirname, filepath);
	        else
	            existingProps.push(propname);			
		}

		if((isJs && options.jsToString) || !isJs )
			add = fs.readFileSync(filepath, encoding);
		else
			add = require(filepath);

		if(map){
			var paths = path.relative(dirname, filepath).split(path.sep);
			var last, thismap;
			for(var x = 0, len = paths.length; x<len; x++){
				if(x===0){
					if(!returnMe[ paths[x] ] )
						returnMe[ paths[x] ] = {};
					last = returnMe[ paths[x] ]
					if(!map[ paths[x] ] )
						map[ paths[x] ] = {};
					thismap = map[ paths[x] ]
				}else if(x < (len-1)){
					if(!last[ paths[x] ] )
						last[ paths[x] ] = {};
					last = last[paths[x]];
					if(!thismap[ paths[x] ] )
						thismap[ paths[x] ] = {};
					thismap = thismap[ paths[x] ];
				}else{
					last[ propname ] = add;
					thismap[ propname ] = true;
				}
			}
		}else{
			returnMe[propname] = add;
		}
		
	});

	for(var p in returnMe) proxy[p] = returnMe[p];
	return returnMe;
}	

function evaluate(srcObj, args, options){
	var proxy = {}, returnObj;
	if(options.evaluate === false){
		this.foldStatus = "foldOnly";
		returnObj = bind( fold, this, proxy, args );
	}
	else
		returnObj = bind( fold, this, proxy );

	var objpaths = flatten.call(this.map, srcObj);

	for(var objpath in objpaths){
		var isWhitelisted = false,
			isBlacklisted = false,
			skip = false,
			add = false,
			node = false,
			last = false;

		if(options.whitelist && checkList(options.whitelist, objpath))
			isWhitelisted = true;

		if(options.blacklist && checkList(options.blacklist, objpath))
			isBlacklisted = true;

		skip = (options.whitelist && !isWhitelisted) || isBlacklisted;

		if(skip && options.trim) continue;

		add = node = objpaths[objpath];

		if(!skip && typeof node === "function")
			add = options.evaluate !== false ? node.apply( srcObj, args) : bind.apply( bind, [node, srcObj].concat(args) );
		
		if(typeof add === "undefined" && options.allowUndefined !== true && options.trim)
			continue

		if(typeof add === "undefined" && options.allowUndefined !== true)
			add = node

		if(this.map){
			paths = objpath.split(path.sep);
			for(var x = 0, len = paths.length; x<len; x++){
				if(x===0){
					if(!returnObj[ paths[x] ] )
						returnObj[ paths[x] ] = {};
					last = returnObj[ paths[x] ]
				}else if(x < (len-1)){
					if(!last[ paths[x] ] )
						last[ paths[x] ] = {};
					last = last[paths[x]];
				}else{
					last[ paths[x] ] = add;
				}
			}			
		}else{
			returnObj[objpath] = add;
		}
	}

	for(var p in returnObj) proxy[p] = returnObj[p];
	return returnObj;
}

function checkList(list, name){
	list = isArray(list) ? list : [list];
	return list.some(function(rule){
		return minimatch(name, path.normalize(rule));
	});
}

function whitelist(whitelist, files, rootdir){
    if(!whitelist || !files) return
    rootdir = rootdir || "";
    var output = [];
    whitelist = isArray(whitelist) ? whitelist : [whitelist];
    whitelist.forEach(function(rule){
        rule = path.join( rootdir, rule );
        files.forEach( function(name){
            if(~output.indexOf(name)) return
            if( minimatch(name, rule) )
                output.push(name);
        }) 
    });
    return output;
}

function blacklist(blacklist, files, rootdir){
    if(!blacklist || !files) return
    rootdir = rootdir || "";
    blacklist = isArray(blacklist) ? blacklist : [blacklist];

    return files.filter(function(name){
        return !blacklist.some(function(rule){
            rule = path.join( rootdir, rule );
            return minimatch(name, rule)
        });
    });
}

function flatten(obj, _path, result) {
  if(!this) return obj;
  var key, val, __path;
  _path = _path || [];
  result = result || {};
  for (key in obj) {
    val = obj[key];
    __path = _path.concat([key]);
    if (this[key] && this[key] !== true) {
      flatten.call(this[key], val, __path, result);
    } else {
      result[__path.join(path.sep)] = val;
    }
  }
  return result;
};

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
      if ( this === undefined || this === null ) {
        throw new TypeError( '"this" is null or not defined' );
      }

      var length = this.length >>> 0; // Hack to convert object.length to a UInt32

      fromIndex = +fromIndex || 0;

      if (Math.abs(fromIndex) === Infinity) {
        fromIndex = 0;
      }

      if (fromIndex < 0) {
        fromIndex += length;
        if (fromIndex < 0) {
          fromIndex = 0;
        }
      }

      for (;fromIndex < length; fromIndex++) {
        if (this[fromIndex] === searchElement) {
          return fromIndex;
        }
      }

      return -1;
    };
  }
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t)
        fun.call(thisArg, t[i], i, t);
    }
  };
}
if (!Array.prototype.some) {
  Array.prototype.some = function(fun /*, thisArg */)
  {
    'use strict';

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function')
      throw new TypeError();

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t && fun.call(thisArg, t[i], i, t))
        return true;
    }

    return false;
  };
};

function bind(fn){
	var args = Array.prototype.slice.call(arguments, 1);
	if (!Function.prototype.bind) {
	     return function(){
			var onearg = args.shift();
			var newargs = args.concat(Array.prototype.slice.call(arguments,0));
			var returnme = fn.apply(onearg, newargs );
	        return returnme;
	     };
	}else{
		return fn.bind.apply(fn, args);
	};
}

function isArray(obj){
	return ~Object.prototype.toString.call(obj).toLowerCase().indexOf("array");
}
}).call(this,require("C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js"))
},{"C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js":5,"fs":1,"minimatchify":26,"path":6}],26:[function(require,module,exports){
(function (process){
if(typeof JSON === "undefined"){

/*
    json2.js
    2014-02-04

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function () {
                return this.valueOf();
            };
    }

    var cx,
        escapable,
        gap,
        indent,
        meta,
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

}

if ('function' !== typeof Array.prototype.reduce) {
  Array.prototype.reduce = function(callback, opt_initialValue){
    'use strict';
    if (null === this || 'undefined' === typeof this) {
      // At the moment all modern browsers, that support strict mode, have
      // native implementation of Array.prototype.reduce. For instance, IE8
      // does not support strict mode, so this check is actually useless.
      throw new TypeError(
          'Array.prototype.reduce called on null or undefined');
    }
    if ('function' !== typeof callback) {
      throw new TypeError(callback + ' is not a function');
    }
    var index, value,
        length = this.length >>> 0,
        isValueSet = false;
    if (1 < arguments.length) {
      value = opt_initialValue;
      isValueSet = true;
    }
    for (index = 0; length > index; ++index) {
      if (this.hasOwnProperty(index)) {
        if (isValueSet) {
          value = callback(value, this[index], index, this);
        }
        else {
          value = this[index];
          isValueSet = true;
        }
      }
    }
    if (!isValueSet) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    return value;
  };
}

if (!Array.prototype.map)
{
  Array.prototype.map = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var res = new Array(len);
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      // NOTE: Absolute correctness would demand Object.defineProperty
      //       be used.  But this method is fairly new, and failure is
      //       possible only if Object.prototype or Array.prototype
      //       has a property |i| (very unlikely), so use a less-correct
      //       but more portable alternative.
      if (i in t)
        res[i] = fun.call(thisArg, t[i], i, t);
    }

    return res;
  };
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function () {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

if(!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+/,'').replace(/\s+$/, '');
  };
}

if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t))
          res.push(val);
      }
    }

    return res;
  };
}

;(function (require, exports, module, platform) {

if (module) module.exports = minimatch
else exports.minimatch = minimatch

minimatch.Minimatch = Minimatch

var LRU = function LRUCache () {
        // not quite an LRU, but still space-limited.
        var cache = {}
        var cnt = 0
        this.set = function (k, v) {
          cnt ++
          if (cnt >= 100) cache = {}
          cache[k] = v
        }
        this.get = function (k) { return cache[k] }
      }
  , cache = minimatch.cache = new LRU({max: 100})
  , GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
  , sigmund = process.browser ? function sigmund (obj) {
        return JSON.stringify(obj)
      } : require("sigmund")

var path = require("path")
  // any single thing other than /
  // don't need to escape / when using new RegExp()
  , qmark = "[^/]"

  // * => any number of characters
  , star = qmark + "*?"

  // ** when dots are allowed.  Anything goes, except .. and .
  // not (^ or / followed by one or two dots followed by $ or /),
  // followed by anything, any number of times.
  , twoStarDot = "(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?"

  // not a ^ or / followed by a dot,
  // followed by anything, any number of times.
  , twoStarNoDot = "(?:(?!(?:\\\/|^)\\.).)*?"

  // characters that need to be escaped in RegExp.
  , reSpecials = charSet("().*{}+?[]^$\\!")

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split("").reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {}
  b = b || {}
  var t = {}
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
}


function minimatch (p, pattern, options) {
  if (typeof pattern !== "string") {
    throw new TypeError("glob pattern string required")
  }

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === "#") {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === "") return p === ""

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options, cache)
  }

  if (typeof pattern !== "string") {
    throw new TypeError("glob pattern string required")
  }

  if (!options) options = {}
  pattern = pattern.trim()

  // windows: need to use /, not \
  // On other platforms, \ is a valid (albeit bad) filename char.
  if (platform === "win32") {
    pattern = pattern.split("\\").join("/")
  }

  // lru storage.
  // these things aren't particularly big, but walking down the string
  // and turning it into a regexp can get pretty costly.
  var cacheKey = pattern + "\n" + sigmund(options)
  var cached = minimatch.cache.get(cacheKey)
  if (cached) return cached
  minimatch.cache.set(cacheKey, this)

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function() {}

Minimatch.prototype.make = make
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === "#") {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = console.error

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return -1 === s.indexOf(false)
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
    , negate = false
    , options = this.options
    , negateOffset = 0

  if (options.nonegate) return

  for ( var i = 0, l = pattern.length
      ; i < l && pattern.charAt(i) === "!"
      ; i ++) {
    negate = !negate
    negateOffset ++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return new Minimatch(pattern, options).braceExpand()
}

Minimatch.prototype.braceExpand = braceExpand
function braceExpand (pattern, options) {
  options = options || this.options
  pattern = typeof pattern === "undefined"
    ? this.pattern : pattern

  if (typeof pattern === "undefined") {
    throw new Error("undefined pattern")
  }

  if (options.nobrace ||
      !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  var escaping = false

  // examples and comments refer to this crazy pattern:
  // a{b,c{d,e},{f,g}h}x{y,z}
  // expected:
  // abxy
  // abxz
  // acdxy
  // acdxz
  // acexy
  // acexz
  // afhxy
  // afhxz
  // aghxy
  // aghxz

  // everything before the first \{ is just a prefix.
  // So, we pluck that off, and work with the rest,
  // and then prepend it to everything we find.
  if (pattern.charAt(0) !== "{") {
    this.debug(pattern)
    var prefix = null
    for (var i = 0, l = pattern.length; i < l; i ++) {
      var c = pattern.charAt(i)
      this.debug(i, c)
      if (c === "\\") {
        escaping = !escaping
      } else if (c === "{" && !escaping) {
        prefix = pattern.substr(0, i)
        break
      }
    }

    // actually no sets, all { were escaped.
    if (prefix === null) {
      this.debug("no sets")
      return [pattern]
    }

   var tail = braceExpand.call(this, pattern.substr(i), options)
    return tail.map(function (t) {
      return prefix + t
    })
  }

  // now we have something like:
  // {b,c{d,e},{f,g}h}x{y,z}
  // walk through the set, expanding each part, until
  // the set ends.  then, we'll expand the suffix.
  // If the set only has a single member, then'll put the {} back

  // first, handle numeric sets, since they're easier
  var numset = pattern.match(/^\{(-?[0-9]+)\.\.(-?[0-9]+)\}/)
  if (numset) {
    this.debug("numset", numset[1], numset[2])
    var suf = braceExpand.call(this, pattern.substr(numset[0].length), options)
      , start = +numset[1]
      , end = +numset[2]
      , inc = start > end ? -1 : 1
      , set = []
    for (var i = start; i != (end + inc); i += inc) {
      // append all the suffixes
      for (var ii = 0, ll = suf.length; ii < ll; ii ++) {
        set.push(i + suf[ii])
      }
    }
    return set
  }

  // ok, walk through the set
  // We hope, somewhat optimistically, that there
  // will be a } at the end.
  // If the closing brace isn't found, then the pattern is
  // interpreted as braceExpand("\\" + pattern) so that
  // the leading \{ will be interpreted literally.
  var i = 1 // skip the \{
    , depth = 1
    , set = []
    , member = ""
    , sawEnd = false
    , escaping = false

  function addMember () {
    set.push(member)
    member = ""
  }

  this.debug("Entering for")
  FOR: for (i = 1, l = pattern.length; i < l; i ++) {
    var c = pattern.charAt(i)
    this.debug("", i, c)

    if (escaping) {
      escaping = false
      member += "\\" + c
    } else {
      switch (c) {
        case "\\":
          escaping = true
          continue

        case "{":
          depth ++
          member += "{"
          continue

        case "}":
          depth --
          // if this closes the actual set, then we're done
          if (depth === 0) {
            addMember()
            // pluck off the close-brace
            i ++
            break FOR
          } else {
            member += c
            continue
          }

        case ",":
          if (depth === 1) {
            addMember()
          } else {
            member += c
          }
          continue

        default:
          member += c
          continue
      } // switch
    } // else
  } // for

  // now we've either finished the set, and the suffix is
  // pattern.substr(i), or we have *not* closed the set,
  // and need to escape the leading brace
  if (depth !== 0) {
    this.debug("didn't close", pattern)
    return braceExpand.call(this, "\\" + pattern, options)
  }

  // x{y,z} -> ["xy", "xz"]
  this.debug("set", set)
  this.debug("suffix", pattern.substr(i))
  var suf = braceExpand.call(this, pattern.substr(i), options)
  // ["b", "c{d,e}","{f,g}h"] ->
  //   [["b"], ["cd", "ce"], ["fh", "gh"]]
  var addBraces = set.length === 1
  this.debug("set pre-expanded", set)
  set = set.map(function (p) {
    return braceExpand.call(this, p, options)
  }, this)
  this.debug("set expanded", set)


  // [["b"], ["cd", "ce"], ["fh", "gh"]] ->
  //   ["b", "cd", "ce", "fh", "gh"]
  set = set.reduce(function (l, r) {
    return l.concat(r)
  })

  if (addBraces) {
    set = set.map(function (s) {
      return "{" + s + "}"
    })
  }

  // now attach the suffixes.
  var ret = []
  for (var i = 0, l = set.length; i < l; i ++) {
    for (var ii = 0, ll = suf.length; ii < ll; ii ++) {
      ret.push(set[i] + suf[ii])
    }
  }
  return ret
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  var options = this.options

  // shortcuts
  if (!options.noglobstar && pattern === "**") return GLOBSTAR
  if (pattern === "") return ""

  var re = ""
    , hasMagic = !!options.nocase
    , escaping = false
    // ? => one single character
    , patternListStack = []
    , plType
    , stateChar
    , inClass = false
    , reClassStart = -1
    , classStart = -1
    // . and .. never match anything that doesn't start with .,
    // even when options.dot is set.
    , patternStart = pattern.charAt(0) === "." ? "" // anything
      // not (start or / followed by . or .. followed by / or end)
      : options.dot ? "(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))"
      : "(?!\\.)"
    , self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case "*":
          re += star
          hasMagic = true
          break
        case "?":
          re += qmark
          hasMagic = true
          break
        default:
          re += "\\"+stateChar
          break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for ( var i = 0, len = pattern.length, c
      ; (i < len) && (c = pattern.charAt(i))
      ; i ++ ) {

    this.debug("%s\t%s %s %j", pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += "\\" + c
      escaping = false
      continue
    }

    SWITCH: switch (c) {
      case "/":
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case "\\":
        clearStateChar()
        escaping = true
        continue

      // the various stateChar values
      // for the "extglob" stuff.
      case "?":
      case "*":
      case "+":
      case "@":
      case "!":
        this.debug("%s\t%s %s %j <-- stateChar", pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === "!" && i === classStart + 1) c = "^"
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
        continue

      case "(":
        if (inClass) {
          re += "("
          continue
        }

        if (!stateChar) {
          re += "\\("
          continue
        }

        plType = stateChar
        patternListStack.push({ type: plType
                              , start: i - 1
                              , reStart: re.length })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === "!" ? "(?:(?!" : "(?:"
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
        continue

      case ")":
        if (inClass || !patternListStack.length) {
          re += "\\)"
          continue
        }

        clearStateChar()
        hasMagic = true
        re += ")"
        plType = patternListStack.pop().type
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        switch (plType) {
          case "!":
            re += "[^/]*?)"
            break
          case "?":
          case "+":
          case "*": re += plType
          case "@": break // the default anyway
        }
        continue

      case "|":
        if (inClass || !patternListStack.length || escaping) {
          re += "\\|"
          escaping = false
          continue
        }

        clearStateChar()
        re += "|"
        continue

      // these are mostly the same in regexp and glob
      case "[":
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += "\\" + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
        continue

      case "]":
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += "\\" + c
          escaping = false
          continue
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
        continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
                   && !(c === "^" && inClass)) {
          re += "\\"
        }

        re += c

    } // switch
  } // for


  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    var cs = pattern.substr(classStart + 1)
      , sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + "\\[" + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  var pl
  while (pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + 3)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2})*)(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = "\\"
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + "|"
    })

    this.debug("tail=%j\n   %s", tail, tail)
    var t = pl.type === "*" ? star
          : pl.type === "?" ? qmark
          : "\\" + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart)
       + t + "\\("
       + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += "\\\\"
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case ".":
    case "[":
    case "(": addPatternStart = true
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== "" && hasMagic) re = "(?=.)" + re

  if (addPatternStart) re = patternStart + re

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [ re, hasMagic ]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? "i" : ""
    , regExp = new RegExp("^" + re + "$", flags)

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) return this.regexp = false
  var options = this.options

  var twoStar = options.noglobstar ? star
      : options.dot ? twoStarDot
      : twoStarNoDot
    , flags = options.nocase ? "i" : ""

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
           : (typeof p === "string") ? regExpEscape(p)
           : p._src
    }).join("\\\/")
  }).join("|")

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = "^(?:" + re + ")$"

  // can match anything, as long as it's not this.
  if (this.negate) re = "^(?!" + re + ").*$"

  try {
    return this.regexp = new RegExp(re, flags)
  } catch (ex) {
    return this.regexp = false
  }
}

minimatch.match = function (list, pattern, options) {
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = match
function match (f, partial) {
  this.debug("match", f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ""

  if (f === "/" && partial) return true

  var options = this.options

  // windows: need to use /, not \
  // On other platforms, \ is a valid (albeit bad) filename char.
  if (platform === "win32") {
    f = f.split("\\").join("/")
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, "split", f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, "set", set)

  var splitFile = path.basename(f.join("/")).split("/")

  for (var i = 0, l = set.length; i < l; i ++) {
    var pattern = set[i], file = f
    if (options.matchBase && pattern.length === 1) {
      file = splitFile
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug("matchOne",
              { "this": this
              , file: file
              , pattern: pattern })

  this.debug("matchOne", file.length, pattern.length)

  for ( var fi = 0
          , pi = 0
          , fl = file.length
          , pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi ++, pi ++ ) {

    this.debug("matchOne loop")
    var p = pattern[pi]
      , f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
        , pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for ( ; fi < fl; fi ++) {
          if (file[fi] === "." || file[fi] === ".." ||
              (!options.dot && file[fi].charAt(0) === ".")) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      WHILE: while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while',
                    file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === "." || swallowee === ".." ||
              (!options.dot && swallowee.charAt(0) === ".")) {
            this.debug("dot detected!", file, fr, pattern, pr)
            break WHILE
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr ++
        }
      }
      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then 
      if (partial) {
        // ran out of file
        this.debug("\n>>> no match, partial?", file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === "string") {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase()
      } else {
        hit = f === p
      }
      this.debug("string match", p, f, hit)
    } else {
      hit = f.match(p)
      this.debug("pattern match", p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === "")
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error("wtf?")
}


// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, "$1")
}


function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

})( typeof require === "function" ? require : null,
    this,
    typeof module === "object" ? module : null,
    typeof process === "object" ? process.platform : "win32"
  )




}).call(this,require("C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js"))
},{"C:\\Users\\Anthropos\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js":5,"path":6,"sigmund":27}],27:[function(require,module,exports){
module.exports = sigmund
function sigmund (subject, maxSessions) {
    maxSessions = maxSessions || 10;
    var notes = [];
    var analysis = '';
    var RE = RegExp;

    function psychoAnalyze (subject, session) {
        if (session > maxSessions) return;

        if (typeof subject === 'function' ||
            typeof subject === 'undefined') {
            return;
        }

        if (typeof subject !== 'object' || !subject ||
            (subject instanceof RE)) {
            analysis += subject;
            return;
        }

        if (notes.indexOf(subject) !== -1 || session === maxSessions) return;

        notes.push(subject);
        analysis += '{';
        Object.keys(subject).forEach(function (issue, _, __) {
            // pseudo-private values.  skip those.
            if (issue.charAt(0) === '_') return;
            var to = typeof subject[issue];
            if (to === 'function' || to === 'undefined') return;
            analysis += issue;
            psychoAnalyze(subject[issue], session + 1);
        });
    }
    psychoAnalyze(subject, 0);
    return analysis;
}

// vim: set softtabstop=4 shiftwidth=4:

},{}],28:[function(require,module,exports){
var domify = require('domify');

module.exports = hyperglue;
function hyperglue (src, updates) {
    if (!updates) updates = {};
    
    var ob = typeof src === 'object';
    var dom = ob
            ? [ src ]
            : domify("<div>"+src+"</div>");
    var returnDom = [];
    var html = "";

    forEach(objectKeys(updates), function (selector) {
        var value = updates[selector];
        if (selector === ':first') {
            bind(ob ? dom[0] : dom[0].firstChild, value);
        }
        else if (/:first$/.test(selector)) {
            var k = selector.replace(/:first$/, '');
            var elem = dom[0].querySelector(k);
            if (elem) bind(elem, value);
        }
        else{
            var nodes = dom[0].querySelectorAll(selector);
            if (nodes.length === 0) return;
            for (var i = 0; i < nodes.length; i++) {
                bind(nodes[i], value);
            }
        }
    });

    if( ob ){
        return dom.length === 1 ? dom[0] : dom;
    }else{
        if (dom[0].childElementCount === 1){
            returnDom = dom[0].removeChild(dom[0].firstChild);
        }else{
            returnDom.innerHTML = returnDom.outerHTML = "";

            while(dom[0].firstChild){
                returnDom.innerHTML += returnDom.outerHTML += dom[0].firstChild.outerHTML;
                returnDom.push(dom[0].removeChild(dom[0].firstChild));
            }            
        }
        returnDom.appendTo = appendTo;
        return returnDom;
    }
}

function bind (node, value) {
    if (isElement(value)) {
        node.innerHTML = '';
        node.appendChild(value);
    }
    else if (isArray(value)) {
        for (var i = 0; i < value.length; i++) {
            var e = hyperglue(node.cloneNode(true), value[i]);
            node.parentNode.insertBefore(e, node);
        }
        node.parentNode.removeChild(node);
    }
    else if (value && typeof value === 'object') {
        forEach(objectKeys(value), function (key) {
            if (key === '_text') {
                setText(node, value[key]);
            }
            else if (key === '_html' && isElement(value[key])) {
                node.innerHTML = '';
                node.appendChild(value[key]);
            }
            else if (key === '_html') {
                node.innerHTML = value[key];
            }
            else node.setAttribute(key, value[key]);
        });
    }
    else setText(node, value);
}

function forEach(xs, f) {
    if (xs.forEach) return xs.forEach(f);
    for (var i = 0; i < xs.length; i++) f(xs[i], i)
}

var objectKeys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
};

function isElement (e) {
    return e && typeof e === 'object' && e.childNodes
        && (typeof e.appendChild === 'function'
        || typeof e.appendChild === 'object')
    ;
}

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

function setText (e, s) {
    e.innerHTML = '';
    var txt = document.createTextNode(String(s));
    e.appendChild(txt);
}

function appendTo(dest) {
    var self = this;
    if(!isArray(self)) self = [self];
    forEach(self, function(src){ 
        if(dest.appendChild) dest.appendChild( src ) 
        else if (dest.append) dest.append ( src )
    } ); 
    return this;
}
},{"domify":29}],29:[function(require,module,exports){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Wrap map from jquery.
 */

var map = {
  option: [1, '<select multiple="multiple">', '</select>'],
  optgroup: [1, '<select multiple="multiple">', '</select>'],
  legend: [1, '<fieldset>', '</fieldset>'],
  thead: [1, '<table>', '</table>'],
  tbody: [1, '<table>', '</table>'],
  tfoot: [1, '<table>', '</table>'],
  colgroup: [1, '<table>', '</table>'],
  caption: [1, '<table>', '</table>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  _default: [0, '', '']
};

/**
 * Parse `html` and return the children.
 *
 * @param {String} html
 * @return {Array}
 * @api private
 */

function parse(html) {
  if ('string' != typeof html) throw new TypeError('String expected');
  
  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) throw new Error('No elements were generated.');
  var tag = m[1];
  
  // body support
  if (tag == 'body') {
    var el = document.createElement('html');
    el.innerHTML = html;
    return [el.removeChild(el.lastChild)];
  }
  
  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = document.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  return orphan(el.children);
}

/**
 * Orphan `els` and return an array.
 *
 * @param {NodeList} els
 * @return {Array}
 * @api private
 */

function orphan(els) {
  var ret = [];

  while (els.length) {
    ret.push(els[0].parentNode.removeChild(els[0]));
  }

  return ret;
}

},{}],30:[function(require,module,exports){
var inserted = {};

module.exports = function (css) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(elem);
};

},{}],31:[function(require,module,exports){
(function (global){
/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = replace(block.blockquote)
  ('def', block.def)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3]
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false, bq);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(this.smartypants(cap[0]));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/--/g, '\u2014')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
  return html.replace(/&([#\w]+);/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function() {
      var out, err;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],32:[function(require,module,exports){
(function (Buffer){
var insertCss = require('insert-css');
var fs = require('fs');

module.exports = function(container, options){
    options = options || {};
    if(options.insertCss !== false)
        insertCss(Buffer("LnBhZ2Ugew0KICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsNCiAgICB0b3A6IDA7DQogICAgbGVmdDogMDsNCiAgICB3aWR0aDogMTAwJTsNCiAgICBoZWlnaHQ6IDEwMCU7DQogICAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDAsIDApOw0KICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMCwgMCk7DQp9DQoNCi5wYWdlLmxlZnQgew0KICAgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgtMTAwJSwgMCwgMCk7DQogICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgtMTAwJSwgMCwgMCk7DQp9DQoNCi5wYWdlLmNlbnRlciB7DQogICAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDAsIDApOw0KICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMCwgMCk7DQp9DQoNCi5wYWdlLnJpZ2h0IHsNCiAgICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMTAwJSwgMCwgMCk7DQogICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKTsNCn0NCg0KLnBhZ2UudHJhbnNpdGlvbiB7DQogICAgLXdlYmtpdC10cmFuc2l0aW9uLWR1cmF0aW9uOiAuMjVzOw0KICAgIHRyYW5zaXRpb24tZHVyYXRpb246IC4yNXM7DQp9","base64"));

    var pageslider = new PageSlide(container, options);

    var returnObj = options.defaultMethod === 'slidePageFrom' ? pageslider.slidePageFrom.bind(pageslider) : pageslider.slidePage.bind(pageslider);
    returnObj.slidePage = pageslider.slidePage.bind(pageslider);
    returnObj.slidePageFrom = pageslider.slidePageFrom.bind(pageslider);
    return returnObj;
}

function PageSlide(container, options) {

    var container = container,
        isJ = container instanceof jQuery,
        currentPage,
        stateHistory = [];

    // Use this function if you want PageSlider to automatically determine the sliding direction based on the state history
    this.slidePage = function(page) {

        var l = stateHistory.length,
            state = window.history && history.pushState ? window.location.pathname : window.location.hash;

        if (l === 0) {
            stateHistory.push(state);
            this.slidePageFrom(page);
            return;
        }
        if (state === stateHistory[l-2]) {
            stateHistory.pop();
            this.slidePageFrom(page, 'left');
        } else {
            stateHistory.push(state);
            this.slidePageFrom(page, 'right');
        }

    };

    // Use this function directly if you want to control the sliding direction outside PageSlider
    this.slidePageFrom = function(page, from) {

        container[isJ ? "append" : "appendChild"](page);

        if (!currentPage || !from) {
            if(isJ){
                page.removeClass("left right transition").addClass("page center");            
            }else{
                page.classList.remove("left", "right", "transition");
                page.classList.add("page", "center");            
            }
            currentPage = page;
            return;
        }

        // Position the page at the starting position of the animation
        var notFrom = from === "left" ? "right" : "left";
        if(isJ){
            page.removeClass(notFrom + " center transition").addClass("page " + from);
        }else{
            page.classList.remove("center", notFrom, "transition");
            page.classList.add("page", from);
        }

        currentPage.one('webkitTransitionEnd', function(e) {
            if(isJ){
                $(e.target).remove();            
            }else{
                e.target.parentNode.removeChild(e.target);
            }
        });

        // Force reflow. More information here: http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
        container[0].offsetWidth;

        // Position the new page and the current page at the ending position of their animation with a transition class indicating the duration of the animation
        if(isJ){
            page.removeClass("left right");
            page.addClass("page transition center");
            currentPage.removeClass("center " + (from === "left" ? "left" : "right"));
            currentPage.addClass("page transition " + (from === "left" ? "right" : "left"));
        }else{
            page.classList.remove("right", "left");
            page.classList.add("page", "transition", "center");
            currentPage.classList.remove("center", from === "left" ? "left" : "right");
            currentPage.classList.add("page", "transition", from === "left" ? "right" : "left");
        }
        currentPage = page;
    };

}

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2012-11-15
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if (typeof document !== "undefined" && !("classList" in document.documentElement)) {

(function (view) {

"use strict";

if (!('HTMLElement' in view) && !('Element' in view)) return;

var
      classListProp = "classList"
    , protoProp = "prototype"
    , elemCtrProto = (view.HTMLElement || view.Element)[protoProp]
    , objCtr = Object
    , strTrim = String[protoProp].trim || function () {
        return this.replace(/^\s+|\s+$/g, "");
    }
    , arrIndexOf = Array[protoProp].indexOf || function (item) {
        var
              i = 0
            , len = this.length
        ;
        for (; i < len; i++) {
            if (i in this && this[i] === item) {
                return i;
            }
        }
        return -1;
    }
    // Vendors: please allow content code to instantiate DOMExceptions
    , DOMEx = function (type, message) {
        this.name = type;
        this.code = DOMException[type];
        this.message = message;
    }
    , checkTokenAndGetIndex = function (classList, token) {
        if (token === "") {
            throw new DOMEx(
                  "SYNTAX_ERR"
                , "An invalid or illegal string was specified"
            );
        }
        if (/\s/.test(token)) {
            throw new DOMEx(
                  "INVALID_CHARACTER_ERR"
                , "String contains an invalid character"
            );
        }
        return arrIndexOf.call(classList, token);
    }
    , ClassList = function (elem) {
        var
              trimmedClasses = strTrim.call(elem.className)
            , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
            , i = 0
            , len = classes.length
        ;
        for (; i < len; i++) {
            this.push(classes[i]);
        }
        this._updateClassName = function () {
            elem.className = this.toString();
        };
    }
    , classListProto = ClassList[protoProp] = []
    , classListGetter = function () {
        return new ClassList(this);
    }
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
    return this[i] || null;
};
classListProto.contains = function (token) {
    token += "";
    return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
    var
          tokens = arguments
        , i = 0
        , l = tokens.length
        , token
        , updated = false
    ;
    do {
        token = tokens[i] + "";
        if (checkTokenAndGetIndex(this, token) === -1) {
            this.push(token);
            updated = true;
        }
    }
    while (++i < l);

    if (updated) {
        this._updateClassName();
    }
};
classListProto.remove = function () {
    var
          tokens = arguments
        , i = 0
        , l = tokens.length
        , token
        , updated = false
    ;
    do {
        token = tokens[i] + "";
        var index = checkTokenAndGetIndex(this, token);
        if (index !== -1) {
            this.splice(index, 1);
            updated = true;
        }
    }
    while (++i < l);

    if (updated) {
        this._updateClassName();
    }
};
classListProto.toggle = function (token, forse) {
    token += "";

    var
          result = this.contains(token)
        , method = result ?
            forse !== true && "remove"
        :
            forse !== false && "add"
    ;

    if (method) {
        this[method](token);
    }

    return !result;
};
classListProto.toString = function () {
    return this.join(" ");
};

if (objCtr.defineProperty) {
    var classListPropDesc = {
          get: classListGetter
        , enumerable: true
        , configurable: true
    };
    try {
        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
    } catch (ex) { // IE 8 doesn't support enumerable:true
        if (ex.number === -0x7FF5EC54) {
            classListPropDesc.enumerable = false;
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        }
    }
} else if (objCtr[protoProp].__defineGetter__) {
    elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

}

}).call(this,require("buffer").Buffer)
},{"buffer":2,"fs":1,"insert-css":30}]},{},[7])