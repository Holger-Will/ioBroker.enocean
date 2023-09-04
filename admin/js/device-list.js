import {LitElement, html, css} from './lit-all.min.js';
import './device-list-item.js'

class EnoceanDeviceList extends LitElement{
  constructor() {
    super();
    // Declare reactive properties
    this.devices = []
  }
  static properties = {
    devices: {type: Array},
  };
  static styles = css`
    :host {

    }
    #list{display:flex; flex-direction: row; flex-flow: row wrap;}
  `;
  notifyChange(id,state){
    let tmp = id.split(".")
    tmp.pop()
    try{
    this.shadowRoot.getElementById(tmp.join(".")).notify(id,state)
    }catch(err){
      console.log(err)
    }
  }
  render() {
    
  console.log(this.devices)
    return html`<div id="list">${this.devices.filter(item=>!item.id.endsWith(".gateway")).map(item=>html`<enocean-device-list-item id="${item.id}" data="${JSON.stringify(item)}"></enocean-device-list-item>`)}</div>`;
  }
}
customElements.define('enocean-device-list', EnoceanDeviceList);