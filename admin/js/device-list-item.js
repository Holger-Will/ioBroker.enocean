import {LitElement, html, css} from './lit-all.min.js';
import './rssi-icon.js'
import './timestamp-icon.js'
class EnoceanDeviceListItem extends LitElement{
  constructor() {
    super();
    // Declare reactive properties

  }
  static properties = {
    data: {type: Object},
  };
  static styles = css`
    :host {
      
    }
    /*@import "../../../css/adapter.css"*/
    .outer{
      background-color: transparent;
      width: 300px;
      height: 150px;
      perspective: 1000px; /* Remove this if you don't want the 3D effect */
      margin:5px;
      
    }
    .inner{
      position: relative;
      width: 300px;
      height: 150px;
      transition: transform 0.5s;
      transform-style: preserve-3d;
    }
    .card{
      box-sizing: border-box;
      position: absolute;
      width: 300px;
      height: 150px;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      box-shadow: 1px 1px 1px gray;
      padding: 5px;
      background:white;
      display:flex;
      flex-direction: column;
    }
    .card_front{
      color: black;
    }
    .card_back{
      transform: rotateY(180deg);
    }
    .outer.flipped .inner{
    transform: rotateY(180deg);
    }
    .cardhead{
      display: flex;
      flex-direction: row;
    }
    .cardhead div{
      margin:2px
    }
    .cardbody{
      display:flex;
      flex-direction: row
    }
    .material-icons{font-family:'Material Icons'}
    .title{font-weight:bold}
    .id{}
    .eep{}
    .eep_span{border:1px solid black; display:inline-block;border-radius: 5px}
  `;
  flip(evt){
    evt.currentTarget.classList.toggle("flipped")
  }
  notify(id,state){
    let prop = id.split(".").pop()
    this.data.states[prop] = state
    this.requestUpdate()
  }
  deleteMe(evt){
    let longId = this.data.id.split(".")
    let prop = longId.pop()
    window.sendTo("enocean.0", 'deleteDevice', prop);
    evt.stopPropagation()
    this.parentNode.removeChild(this)
  }
  render() {
    return html`
    <div class="outer" @click="${this.flip}">
      <div class="inner">
        <div class="card_front card">
            <div class="cardhead">
              <div class="title">${this.data.value.native.name}</div>
              <div style="flex: 1"></div>
              <div><timestamp-icon value="${this.data.value.native.eep[0].startsWith("X")?this.data.states.CMD.ts:this.data.states.rssi.ts}"></timestamp-icon></div>
              <div><rssi-icon value="${this.data.value.native.eep[0].startsWith("X")?0:this.data.states.rssi.val}"></rssi-icon></div>
            </div>
            <div class="cardbody">
              <img src="${this.data.value.native.imgURL?this.data.value.native.imgURL:""}" width="100px"/>
              <div class="atts">
                ${Object.keys(this.data.states).map(item=>html`<div>${item}:${this.data.states[item]?this.data.states[item].val:"???"}</div>`)}
              </div>
            </div>
        </div>
        <div class="card_back card">
            <div class="cardhead">
              <div class="title">${this.data.value.native.name}</div>
              <div style="flex: 1"></div>
              <div></div>
              <div @click="${this.deleteMe}"><span class="material-icons">delete</span></div>
            </div>
            <div class="cardbody">
              <img src="https://enocean-js.github.io/device-images/nodon-soft-remote.jpg" width="100px"/>
              <div class="atts">
                <div class="id">id: ${this.data.value.native.id}</div>
                <div class="eep">eep: ${this.data.value.native.eep.map(item=>html`<span class="eep_span">${item}</span>`)}</div>
              </div>
            </div>
        </div>
      </div>
    </div>
    `;
  }
}
customElements.define('enocean-device-list-item', EnoceanDeviceListItem);