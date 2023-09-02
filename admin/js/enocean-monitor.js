import {LitElement, html, css} from './lit-all.min.js';
import ESP3Packet from './ESP3Packet.js'
import RadioERP1 from './radio-erp1.js'
class EnoceanMonitor extends LitElement{
  constructor() {
    super();
    // Declare reactive properties
    this.memory = []
    this.name = 'World';
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
    #monitor-display{background:#333;height:calc(100% - 50px);padding: 10px;width:500px}
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
  render() {
    return html`<div id="monitor-display">${this.memory.map(item=>html`
      <div class="telegram">
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
    `)}</div>`;
  }
}
customElements.define('enocean-monitor', EnoceanMonitor);