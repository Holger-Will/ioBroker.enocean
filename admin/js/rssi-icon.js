import {LitElement, html, css, svg} from './lit-all.min.js';

class EnoceanRSSIIcon extends LitElement{
  constructor() {
    super();
    this.value = -90
  }
  static properties = {
    value: {type: Number},
  };
  static styles = css`
    :host {
      
    }
    #container{
      display:flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    #value{font-size:8px}
  `;
  
  render() {
    let n = 0
    if(this.value>-55){
      n = 4
    }
    if(this.value<-55 && this.value >-65){
      n = 3
    }
    if(this.value<-65 && this.value >-75){
      n = 2
    }
    if(this.value<-75){
      n = 1
    }
    return html`<div id="container"><svg width="16px" height="16px" viewBox="0 0 100 100">
      <rect x="5" y="75" width="15" height="25" fill="${n>=1?"black":"none"}" stroke="black"/>
      <rect x="30" y="50" width="15" height="50" fill="${n>=2?"black":"none"}" stroke="black"/>
      <rect x="55" y="25" width="15" height="75" fill="${n>=3?"black":"none"}" stroke="black"/>
      <rect x="80" y="0" width="15" height="100" fill="${n>=4?"black":"none"}" stroke="black"/>
    </svg>
    <div id="value">${this.value}</div></div>`;
  }
}
customElements.define('rssi-icon', EnoceanRSSIIcon);