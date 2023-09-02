import { toCRC8 } from './crc8.js'
import ByteArray from './byte-array.js'

class ESP3Packet {
  constructor (input) {
    this._raw = ByteArray.from(input)
  }

  push (...value) {
    this._raw.push(...value)
  }

  shift () {
    this._raw.shift()
  }

  slice (...args) {
    return this._raw.slice(...args)
  }

  findIndex (func) {
    return this._raw.findIndex(func)
  }

  get length () {
    return this._raw.length
  }

  get dataLength () {
    return this._raw[1] * 256 + this._raw[2]
  }

  get optionalLength () {
    return this._raw[3]
  }

  get packetType () {
    return this._raw[4]
  }

  set packetType (value) {
    this._raw[4] = value
  }

  get header () {
    return this._raw.slice(1, 5)
  }

  get data () {
    return this._raw.slice(6, 6 + this.dataLength)
  }

  set data (value) {
    value = ByteArray.from(value)
    const opt = this.optionalData
    this._raw.splice(6, this.dataLength, ...value)
    this._raw.splice(6 + value.length, this.optionalLength, ...opt)
    this._raw.length = 7 + value.length + this.optionalLength
    this._raw.setValue(value.length, 8, 16)
  }

  get optionalData () {
    return this._raw.slice(6 + this.dataLength, 6 + this.dataLength + this.optionalLength)
  }

  set optionalData (value) {
    value = ByteArray.from(value)
    this._raw.splice(6 + this.dataLength, value.length, ...value)
    this._raw.length = 7 + this.dataLength + value.length
    this._raw[3] = value.length
  }

  get body () {
    return this._raw.slice(6, 6 + this.dataLength + this.optionalLength)
  }

  get crc8Data () {
    return this._raw[6 + this.dataLength + this.optionalLength]
  }

  get crc8Header () {
    return this._raw[5]
  }

  isHeaderOK () {
    return this.header.reduce(toCRC8, 0) === this.crc8Header
  }

  isBodyOK () {
    return this.body.reduce(toCRC8, 0) === this.crc8Data
  }

  isPacketOK () {
    return this.isHeaderOK() && this.isBodyOK()
  }

  fixPacket () {
    this._raw[5] = this.header.reduce(toCRC8, 0)
    this._raw[6 + this.dataLength + this.optionalLength] = this.body.reduce(toCRC8, 0)
  }

  toString (encoding) {
    return this._raw.toString(encoding)
  }

  toJSON () {
    return {
      syncByte: 0x55,
      header: {
        dataLength: this.dataLength,
        optionalLength: this.optionalLength,
        packetType: this.packetType
      },
      crc8Header: this._raw[5],
      data: this.data,
      optionalData: this.optionalData,
      crc8Data: this._raw[6 + this.dataLength + this.optionalLength]
    }
  }

  static from (input) {
    let packet
    if (input && Object.prototype.hasOwnProperty.call(input, 'data')) {
      packet = new ESP3Packet('5500010001000000')
      packet.data = input.data
      packet.optionalData = input.optionalData || []
      packet.packetType = input.packetType || 1
      packet.fixPacket()
    } else {
      packet = new ESP3Packet(input)
    }
    return packet
  }

  static fieldExtractor (res, field) {
    if (field.location) {
      if (field.length) {
        const offset = field.offset || 0
        if (field.length === 1) {
          res[field.name] = field.retFunc(this[field.location][offset])
        } else {
          res[field.name] = field.retFunc(this[field.location].slice(offset, offset + field.length))
        }
      } else {
        res[field.name] = field.retFunc(this[field.location])
      }
    } else {
      res[field.name] = field.value
    }
    return res
  }
}

export default ESP3Packet
export { ESP3Packet }