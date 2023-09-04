import {LitElement, html, css, svg} from './lit-all.min.js';

class EnoceanTimestampIcon extends LitElement{
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
    .material-icons{font-family:'Material Icons'}
  `;
  
  render() {
    const rtf1 = new Intl.RelativeTimeFormat(undefined, { style: 'short', numeric: "auto" });
    console.log(rtf1.format(3, 'quarter'));
    let t = 0
    let tdiff = (new Date()).getTime() - this.value
    let secs = tdiff/1000
    let mins = secs/60
    let hrs = mins/60
    let days = hrs/24
    if(secs<60){
      t = rtf1.format(-Math.floor(secs), 'seconds')
      console.log(-secs,t,"seconds")
    } else if(mins<60){
      t = rtf1.format(-Math.floor(mins), 'minutes')
    } else if(hrs<24){
      t = rtf1.format(-Math.floor(hrs), 'hours')
    } else {
      t = rtf1.format(-Math.floor(days), 'days')
    }

    console.log(t)
    
    return html`<div id="container">
    <div style="line-height:16px" class="material-icons">schedule</div>
    <div id="value">${t}</div></div>`;
  }
}
customElements.define('timestamp-icon', EnoceanTimestampIcon);