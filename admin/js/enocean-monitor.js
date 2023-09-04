import {LitElement, html, css} from './lit-all.min.js';
import ESP3Packet from './ESP3Packet.js'
import RadioERP1 from './radio-erp1.js'
class EnoceanMonitor extends LitElement{
  constructor() {
    super();
    // Declare reactive properties
    this.memory = []
    this.ignoreKnownIDs = false
    this.devices = []
  }
  static properties = {
    memory: {type: Array},
  };
  static styles = css`
    :host {

    }
    .sync{color:gray}
    .header{color:gray}
    .telegram{font-size: 12px}
    .crc-header{color:gray}
    .rorg{color: gold;font-weight:bold}
    .r_f6{color:violet}
    .r_a5{color: firebrick}
    .r_d2{color:royalblue}
    
    .payload{font-weight:bold;color:#ddd}
    .status{color:#ddd}
    .sender-id{color:orange;font-weight:bold}
    .sub-tel-num{color:gray}
    .crc-data{color: gray}
    .destination-id{color: gray}
    .security-level{color: gray}
    .rssi{font-weight: bold; color: turquoise}
    #monitor-display{background:#333;height:calc(100% - 50px);padding: 10px;width:500px; overflow:scroll;}
    .telegram.teachin:after{content:'¹'; color: red;}
    .telegram.known:after{content:'²'; color: red;}
    .telegram.known.teachin:after{content:'¹·²'; color: red;}
    #footnodes{font-size:8px;color:gray}
  `;
  addNewTelegram(telegram){
    let packet = ESP3Packet.from(telegram)
    if(packet.packetType===1){
      this.memory.push(RadioERP1.from(telegram))
    }else{
      //his.memory.push(RadioERP1.from(packet))
    }
    this.requestUpdate();
    
  }
  addKnownDevice(id){
    this.devices.push(id)
  }
  updated(){
    let monit = this.shadowRoot.getElementById("monitor-display")
    monit.scrollTop = monit.scrollHeight;
  }
  checkIgnore(evt){
    this.ignoreKnownIDs = evt.currentTarget.checked
    this.requestUpdate()
  }
  render() {
    let filter=(item)=>{
      let ret = true
      ret &= this.ignoreKnownIDs?!this.devices.includes(item.senderId.toString(16)):true
      return ret
    }
    return html`<div id="monitor-display">${this.memory.filter(filter).map(item=>html`
      <div class="telegram ${item.teachIn?"teachin":""} ${this.devices.includes(item.senderId.toString(16))?"known":""}">
        <span class="sync">55</span>
        <span class="header">${item.header.toString("hex")}</span>
        <span class="crc-header">${item.crc8Header.toString(16).padStart(2,"0")}</span>
        <span class="rorg r_${item.RORG.toString(16).padStart(2,"0")}">${item.RORG.toString(16).padStart(2,"0")}</span>
        <span class="payload">${item.payload.toString("hex")}</span>
        <span class="sender-id">${item.senderId.toString("hex")}</span>
        <span class="status">${item.status.toString(16).padStart(2,"0")}</span>
        <span class="sub-tel-num">${item.subTelNum.toString(16).padStart(2,"0")}</span>
        <span class="destination-id">${item.destinationId.toString("hex")}</span>
        <span class="rssi">${item.RSSI.toString(16).padStart(2,"0")}</span>
        <span class="security-level">${item.securityLevel.toString(16).padStart(2,"0")}</span>
        <span class="crc-data">${item.crc8Data.toString(16).padStart(2,"0")}</span>
      </div>
      
    `)}</div><input type="checkbox" @change="${this.checkIgnore}"/> hide known senderIds <span id="footnodes">1) teachin, 2) known sender</span>`;
  }
}
customElements.define('enocean-monitor', EnoceanMonitor);