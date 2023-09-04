import { ByteArray } from './byte-array.js'
import { ESP3Packet } from './ESP3Packet.js'

export const UTE_BIDIRECTIONAL = 0x01
export const UTE_UNIDIRECTIONAL = 0x00
export const UTE_TEACH_IN_SUCCESSFULL = 0x01
export const UTE_DELETION_SUCCESSFULL = 0x10
export const UTE_EEP_NOT_SUPPORTED = 0x11
export const UTE_TEACH_IN_NOT_ACCEPTED = 0x00
export const UTE_QUERY_TEACH_IN_REQUEST = 0x00
export const UTE_QUERY_DELETION_REQUEST = 0x01
export const UTE_QUERY_TEACH_IN_OR_DELETION = 0x10
export const UTE_QUERY_NOT_USED = 0x11
export const UTE_CMD_QUERY = 0x00
export const UTE_CMD_RESPONSE = 0x01

class RadioERP1 extends ESP3Packet {
  get packetType () {
    return 1
  }

  get RORG () {
    return super.data[0]
  }

  get payload () {
    return super.data.slice(1, super.data.length - 5)
  }

  set payload (data) {
    const newData = ByteArray.from(data)
    const oldData = ByteArray.from(super.data)
    oldData.splice(1, (super.dataLength - 6))
    oldData.splice(1, 0, ...newData)
    super.data = oldData
    super.fixPacket()
  }

  get senderId () {
    return super.data.slice(super.data.length - 5, super.data.length - 1).toString(16)
  }

  set senderId (id) {
    const idValue = ByteArray.from(id)
    idValue.length = 4
    const newData = ByteArray.from(super.data)
    newData.set(idValue, super.data.length - 5)
    super.data = newData
    super.fixPacket()
  }

  set status (val) {
    const dat = super.data
    dat[super.data.length - 1] = val
    super.data = dat
    super.fixPacket()
  }

  get status () {
    return super.data[super.data.length - 1]
  }

  get T21 () {
    return ByteArray.from(this.status).getSingleBit(2)
  }

  set T21 (val) {
    this.status = ByteArray.from(this.status).setSingleBit(2, val)[0]
    super.fixPacket()
  }

  get NU () {
    return ByteArray.from(this.status).getSingleBit(3)
  }

  set NU (val) {
    this.status = ByteArray.from(this.status).setSingleBit(3, val)[0]
    super.fixPacket()
  }

  get subTelNum () {
    return super.optionalData[0]
  }

  get destinationId () {
    return super.optionalData.slice(1, 5).toString(16)
  }

  set destinationId (id) {
    const idValue = ByteArray.from(id)
    idValue.length = 4
    const newData = ByteArray.from(super.optionalData)
    newData.set(idValue, super.optionalData.length - 6)
    super.optionalData = newData
    super.fixPacket()
  }

  get RSSI () {
    return super.optionalData[5]
  }

  get securityLevel () {
    return super.optionalData[6]
  }

  get teachIn () {
    const mask = 1 << 3
    if (this.RORG === 0xd5 || this.RORG === 0xa5) {
      return (this.payload[this.payload.length - 1] & mask) === 0
    }
    if (this.RORG === 0xd4 || this.RORG === 0xf6) return true
  }

  set teachIn (val) {
    this.payload = this.payload.setSingleBit((this.payload.length) * 8 - 4, val === true ? 0 : 1)
  }

  get teachInInfo () {
    //return getTeachInInfo(this)
  }

  

  static from (input) {
    let pl
    if (input.constructor.name === 'ESP3Packet') {
      return new RadioERP1(input.toString())
    }
    if (Object.prototype.hasOwnProperty.call(input, 'payload')) {
      let rorg
      pl = ByteArray.from(input.payload)
      switch (pl.length) {
        case 1:
          rorg = 0xf6
          break
        case 4:
          rorg = 0xa5
          break
        default:
          rorg = 0xd2
      }
      return RadioERP1.from({
        data: [input.rorg || rorg, pl, input.id || '00000000', input.status || 0],
        optionalData: [3, 'ffffffff', 'ff', 0], // always the same for sending ERP1
        packetType: 1 // always the same for sending ERP1
      })
    } else {
      const res = new RadioERP1(super.from(input).toString())
      return res
    }
  }
}
export default RadioERP1
export { RadioERP1 }