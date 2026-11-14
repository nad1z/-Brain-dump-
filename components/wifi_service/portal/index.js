(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function n(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(i){if(i.ep)return;i.ep=!0;const a=n(i);fetch(i.href,a)}})();const $t={mode:"absolute",position:"bottom",height:"6rem",strength:2,divCount:5,exponential:!1,opacity:1,curve:"linear",zIndex:2},st={linear:e=>e,bezier:e=>e*e*(3-2*e),"ease-in":e=>e*e,"ease-out":e=>1-Math.pow(1-e,2),"ease-in-out":e=>e<.5?2*e*e:1-Math.pow(-2*e+2,2)/2};function Ht(e){switch(e){case"top":return"to top";case"left":return"to left";case"right":return"to right";default:return"to bottom"}}function Ft(){if(typeof CSS>"u"||typeof CSS.supports!="function")return!1;const e=CSS.supports("backdrop-filter","blur(1px)")||CSS.supports("-webkit-backdrop-filter","blur(1px)"),t=CSS.supports("mask-image","linear-gradient(to bottom, transparent, black)")||CSS.supports("-webkit-mask-image","linear-gradient(to bottom, transparent, black)");return e&&t}function Kt(e){const t={...$t,...e},n=document.createElement("div"),r=document.createElement("div"),i=Ht(t.position),a=Ft(),l=t.position==="top"||t.position==="bottom";if(n.className="gradual-blur",t.className&&n.classList.add(t.className),a||(n.classList.add("gradual-blur--fallback"),n.style.background=`linear-gradient(${i}, transparent 0%, ${t.fallbackColor||"rgba(255, 255, 255, 0.95)"} 100%)`),n.style.position=t.mode,n.style.pointerEvents="none",n.style.zIndex=String(t.zIndex),n.style.opacity="0",n.style.borderRadius="inherit",l?(n.style.height=t.height,n.style.width=t.width||"100%",n.style[t.position]="0",t.mode==="fixed"?(n.style.left="50%",n.style.right="auto",n.style.transform="translateX(-50%)"):(n.style.left="0",n.style.right="0")):(n.style.width=t.width||t.height,n.style.height="100%",n.style.top="0",n.style.bottom="0",n.style[t.position]="0"),r.className="gradual-blur__inner",n.appendChild(r),a){const d=100/t.divCount,c=st[t.curve]||st.linear;for(let v=1;v<=t.divCount;v+=1){const y=document.createElement("div"),T=c(v/t.divCount);let b=0;t.exponential?b=Math.pow(2,T*4)*.0625*t.strength:b=.0625*(T*t.divCount+1)*t.strength;const f=Math.round((d*v-d)*10)/10,p=Math.round(d*v*10)/10,w=Math.round((d*v+d)*10)/10,A=Math.round((d*v+d*2)*10)/10;let E=`transparent ${f}%, black ${p}%`;w<=100&&(E+=`, black ${w}%`),A<=100&&(E+=`, transparent ${A}%`),y.className="gradual-blur__layer",y.style.maskImage=`linear-gradient(${i}, ${E})`,y.style.webkitMaskImage=`linear-gradient(${i}, ${E})`,y.style.backdropFilter=`blur(${b.toFixed(3)}rem)`,y.style.setProperty("-webkit-backdrop-filter",`blur(${b.toFixed(3)}rem)`),y.style.opacity=String(t.opacity),r.appendChild(y)}}return window.getComputedStyle(t.mount).position==="static"&&(t.mount.style.position="relative"),t.mount.appendChild(n),{element:n,setVisible(d){n.style.opacity=d?"1":"0"},destroy(){n.remove()}}}const Rt=`:host {\r
  display: inline-flex;\r
  align-items: center;\r
  justify-content: center;\r
  min-height: 1.75rem;\r
  padding: 0 var(--spacing-sm);\r
  border: var(--border-01) solid var(--color-border);\r
  border-radius: var(--radius-full);\r
  background-color: var(--color-bg-selected);\r
  color: var(--color-text-secondary);\r
  font-size: var(--font-size-caption);\r
  font-weight: var(--font-weight-semibold);\r
  line-height: 1;\r
  white-space: nowrap;\r
}\r
\r
*,\r
*::before,\r
*::after {\r
  box-sizing: border-box;\r
}\r
\r
.badge {\r
  display: inline-flex;\r
  align-items: center;\r
  justify-content: center;\r
  white-space: inherit;\r
}\r
`,Ut=document.createElement("template");Ut.innerHTML=`
  <style>${Rt}</style>
  <span class="badge">
    <slot></slot>
  </span>
`;const Gt=`:host {\r
  display: inline-flex;\r
  height: 44px;\r
  width: auto;\r
  min-width: 96px;\r
  vertical-align: middle;\r
}\r
\r
*,\r
*::before,\r
*::after {\r
  box-sizing: border-box;\r
}\r
\r
button {\r
  all: unset;\r
  box-sizing: border-box;\r
  position: relative;\r
  display: inline-flex;\r
  align-items: center;\r
  justify-content: center;\r
  height: 44px;\r
  width: auto;\r
  min-height: 44px;\r
  min-width: 96px;\r
  padding: var(--spacing-3xs) var(--spacing-sm);\r
  border: var(--border-01) solid transparent;\r
  border-radius: var(--button-radius);\r
  background-color: var(--color-text-secondary);\r
  color: var(--color-text-inverse);\r
  cursor: pointer;\r
  font-family: var(--font-family);\r
  font-size: var(--font-size-label);\r
  font-weight: var(--font-weight-regular);\r
  line-height: 1.25;\r
  text-align: center;\r
}\r
\r
button:focus-visible {\r
  outline: var(--focus-ring-width) solid var(--focus-ring-color);\r
  outline-offset: var(--focus-ring-offset);\r
}\r
\r
button:disabled {\r
  background-color: var(--color-bg-mute);\r
  color: var(--color-text-mute);\r
  cursor: default;\r
}\r
\r
:host([variant="primary"]) button {\r
  background-color: var(--color-bg-brand);\r
  color: var(--color-text-inverse);\r
}\r
\r
:host([variant="primary"]) button:not(:disabled):is(:hover, :active) {\r
  background-color: var(--color-bg-brand-hover);\r
}\r
\r
:host([variant="secondary"]) button {\r
  background-color: var(--color-bg-active);\r
  color: var(--color-fg-active);\r
}\r
\r
:host([variant="secondary"]) button:not(:disabled):is(:hover, :active) {\r
  background-color: var(--color-bg-active);\r
  color: var(--color-fg-active);\r
}\r
\r
:host([variant="outline"]) button {\r
  background-color: transparent;\r
  border-color: var(--color-border);\r
  color: var(--color-text-secondary);\r
}\r
\r
:host([variant="outline"]) button:not(:disabled):is(:hover, :active) {\r
  background-color: var(--color-border);\r
  border-color: var(--color-border);\r
}\r
\r
:host([variant="ghost"]) button {\r
  background-color: transparent;\r
  border-color: transparent;\r
  color: var(--color-text-secondary);\r
}\r
\r
:host([variant="ghost"]) button:not(:disabled):is(:hover, :active) {\r
  background-color: var(--color-overlay);\r
}\r
\r
:host([inverse]) button {\r
  color: var(--color-text-inverse);\r
}\r
\r
:host([variant="outline"][inverse]) button {\r
  border-color: var(--color-text-inverse);\r
}\r
\r
:host([variant="outline"][inverse]) button:not(:disabled):is(:hover, :active),\r
:host([variant="ghost"][inverse]) button:not(:disabled):is(:hover, :active) {\r
  background-color: var(--color-overlay);\r
  border-color: var(--color-text-inverse);\r
}\r
\r
:host([rounded]) button {\r
  border-radius: var(--radius-full);\r
  padding: var(--spacing-xs) var(--spacing-lg);\r
}\r
\r
::slotted(svg) {\r
  flex-shrink: 0;\r
}\r
`,U="ui-button",mt=document.createElement("template");mt.innerHTML=`
  <style>${Gt}</style>
  <button type="button" part="button">
    <slot></slot>
  </button>
`;function at(e){return e==="submit"||e==="reset"?e:"button"}class Zt extends HTMLElement{static get observedAttributes(){return["disabled","aria-label","type"]}constructor(){super();const t=this.attachShadow({mode:"open",delegatesFocus:!0});t.append(mt.content.cloneNode(!0)),this.button=t.querySelector("button")}connectedCallback(){this.dataset.component=U,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(t){this.toggleAttribute("disabled",t)}get type(){return at(this.getAttribute("type"))}set type(t){this.setAttribute("type",at(t))}focus(t){this.button.focus(t)}click(){this.button.click()}syncAttributes(){this.button.disabled=this.disabled,this.button.type=this.type,this.tabIndex=this.disabled?-1:0;const t=this.getAttribute("aria-label");t?this.button.setAttribute("aria-label",t):this.button.removeAttribute("aria-label")}}function Wt(){customElements.get(U)||customElements.define(U,Zt)}const Jt=`:host {\r
  display: contents;\r
}\r
\r
:host([hidden]) {\r
  display: none;\r
}\r
\r
*,\r
*::before,\r
*::after {\r
  box-sizing: border-box;\r
}\r
\r
.bottom-sheet-dialog {\r
  position: fixed;\r
  inset: auto 0 0 0;\r
  display: flex;\r
  width: 100%;\r
  max-height: 96vh;\r
  padding: 0;\r
  border: 0;\r
  background: transparent;\r
  color: var(--color-text);\r
  overflow: visible;\r
  transform: translateY(100%);\r
  max-width: 768px;\r
  margin: auto;\r
}\r
\r
.bottom-sheet-dialog:not([open]) {\r
  pointer-events: none;\r
  visibility: hidden;\r
}\r
\r
.bottom-sheet-dialog[open] {\r
  animation: bottom-sheet-open 320ms ease forwards;\r
}\r
\r
.bottom-sheet-dialog.closing {\r
  animation: bottom-sheet-close 320ms ease forwards;\r
}\r
\r
.bottom-sheet-dialog::backdrop {\r
  background: var(--color-overlay);\r
  backdrop-filter: blur(4px) saturate(180%);\r
  -webkit-backdrop-filter: blur(4px) saturate(180%);\r
}\r
\r
.bottom-sheet-content {\r
  display: flex;\r
  flex-direction: column;\r
  width: 100%;\r
  min-height: 0;\r
  border-top: var(--border-01) solid var(--color-border);\r
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;\r
  background: var(--color-bg);\r
  box-shadow: 0 -8px 24px rgb(0 0 0 / 0.16);\r
  overflow: hidden;\r
}\r
\r
.bottom-sheet-header {\r
  display: flex;\r
  align-items: flex-start;\r
  justify-content: space-between;\r
  gap: var(--spacing-sm);\r
  padding: var(--spacing-sm) var(--spacing-md);\r
  padding-right: var(--spacing-sm);\r
  border-bottom: var(--border-01) solid var(--color-border);\r
}\r
\r
.bottom-sheet-header-copy {\r
  display: grid;\r
  gap: var(--spacing-3xs);\r
  min-width: 0;\r
}\r
\r
.bottom-sheet-title,\r
.bottom-sheet-description {\r
  margin: 0;\r
}\r
\r
.bottom-sheet-title {\r
  font-size: var(--font-size-heading);\r
  font-weight: var(--font-weight-semibold);\r
  line-height: 1.2;\r
}\r
\r
.bottom-sheet-description {\r
  color: var(--color-text-secondary);\r
  font-size: var(--font-size-label);\r
  line-height: 1.5;\r
}\r
\r
.bottom-sheet-header-actions {\r
  display: flex;\r
  align-items: center;\r
  justify-content: flex-end;\r
  gap: var(--spacing-xs);\r
  flex-shrink: 0;\r
}\r
\r
.bottom-sheet-body {\r
  display: flex;\r
  flex-direction: column;\r
  gap: var(--spacing-sm);\r
  min-height: 0;\r
  padding: var(--spacing-md);\r
  overflow: auto;\r
}\r
\r
.bottom-sheet-footer {\r
  display: flex;\r
  flex-wrap: wrap;\r
  justify-content: flex-end;\r
  gap: var(--spacing-sm);\r
  /* Extra bottom padding so the footer buttons clear the iOS home indicator / safe area and\r
     aren't clipped at the bottom of the sheet. */\r
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-6xl);\r
  border-top: var(--border-01) solid var(--color-border);\r
  background: var(--color-bg);\r
}\r
\r
.bottom-sheet-title[hidden],\r
.bottom-sheet-description[hidden],\r
.bottom-sheet-header-actions[hidden],\r
.bottom-sheet-footer[hidden] {\r
  display: none;\r
}\r
\r
::slotted([slot="footer"]) {\r
  flex-shrink: 0;\r
}\r
\r
@keyframes bottom-sheet-open {\r
  from {\r
    transform: translateY(100%);\r
  }\r
\r
  to {\r
    transform: translateY(0);\r
  }\r
}\r
\r
@keyframes bottom-sheet-close {\r
  from {\r
    transform: translateY(0);\r
  }\r
\r
  to {\r
    transform: translateY(100%);\r
  }\r
}\r
`,G="ui-bottom-sheet",bt=document.createElement("template"),jt=["a[href]","button:not([disabled])","details summary","input:not([disabled])","select:not([disabled])","textarea:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(", ");let F=0;bt.innerHTML=`
  <style>${Jt}</style>
  <dialog class="bottom-sheet-dialog" part="dialog">
    <div class="bottom-sheet-content" part="content">
      <div class="bottom-sheet-header" part="header">
        <div class="bottom-sheet-header-copy">
          <h2 class="bottom-sheet-title" part="title"></h2>
          <p class="bottom-sheet-description" part="description"></p>
        </div>
        <div class="bottom-sheet-header-actions" part="header-actions">
          <slot name="header-actions"></slot>
        </div>
      </div>
      <div class="bottom-sheet-body" part="body">
        <slot></slot>
      </div>
      <div class="bottom-sheet-footer" part="footer">
        <slot name="footer"></slot>
      </div>
    </div>
    <div class="bottom-sheet-floating" part="floating-content">
      <slot name="floating-content"></slot>
    </div>
  </dialog>
`;function lt(e){const t=getComputedStyle(e);return e.hasAttribute("hidden")||e.getAttribute("aria-hidden")==="true"||t.display==="none"||t.visibility==="hidden"?!1:e.tagName.includes("-")?t.display==="contents"||!!e.getClientRects().length:e.offsetParent!==null||t.position==="fixed"||!!e.getClientRects().length}function K(e){if(!e.shadowRoot)return[];const t=[],n=new Set;function r(i){if(i instanceof HTMLSlotElement){const a=i.assignedElements({flatten:!0});a.length>0?a.forEach(r):Array.from(i.children).forEach(r);return}if(i instanceof HTMLElement&&lt(i)){if(i.shadowRoot){Array.from(i.shadowRoot.childNodes).forEach(r);return}!n.has(i)&&i.matches(jt)&&lt(i)&&(n.add(i),t.push(i)),Array.from(i.children).forEach(r)}}return Array.from(e.shadowRoot.childNodes).forEach(r),t}function Yt(e,t){if(t===e||t.contains(e))return!0;let n=e;for(;n;){if(n===t)return!0;const r=n.getRootNode();if(!(r instanceof ShadowRoot))break;n=r.host}return!1}function R(e){return e.assignedNodes({flatten:!0}).some(t=>t.nodeType===Node.TEXT_NODE?t.textContent?.trim().length:t.nodeType===Node.ELEMENT_NODE)}class Xt extends HTMLElement{constructor(){super(),this.isAnimatingClose=!1,this.isSyncingOpenAttribute=!1,this.previousDocumentOverflow="",this.previousBodyOverflow="",this.triggerElement=null;const t=this.attachShadow({mode:"open"});t.append(bt.content.cloneNode(!0)),this.dialog=t.querySelector(".bottom-sheet-dialog"),this.titleElement=t.querySelector(".bottom-sheet-title"),this.descriptionElement=t.querySelector(".bottom-sheet-description"),this.headerActionsContainer=t.querySelector(".bottom-sheet-header-actions"),this.footerContainer=t.querySelector(".bottom-sheet-footer"),this.floatingContainer=t.querySelector(".bottom-sheet-floating"),this.headerActionsSlot=t.querySelector('slot[name="header-actions"]'),this.footerSlot=t.querySelector('slot[name="footer"]'),this.floatingSlot=t.querySelector('slot[name="floating-content"]'),F+=1,this.titleId=`bottomSheetTitle${F}`,this.descriptionId=`bottomSheetDescription${F}`,this.handleAnimationEndBound=this.handleAnimationEnd.bind(this),this.handleCancelBound=this.handleCancel.bind(this),this.handleClickBound=this.handleClick.bind(this),this.handleKeyDownBound=this.handleKeyDown.bind(this),this.handleSlotChangeBound=this.syncSlotVisibility.bind(this)}static get observedAttributes(){return["description","open","title"]}connectedCallback(){this.dataset.component=G,this.dialog.addEventListener("animationend",this.handleAnimationEndBound),this.dialog.addEventListener("cancel",this.handleCancelBound),this.dialog.addEventListener("click",this.handleClickBound),this.dialog.addEventListener("keydown",this.handleKeyDownBound),this.addEventListener("keydown",this.handleKeyDownBound),this.headerActionsSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.footerSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.floatingSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.syncAttributes(),this.syncSlotVisibility(),this.hasAttribute("open")&&this.openInternal()}disconnectedCallback(){this.dialog.removeEventListener("animationend",this.handleAnimationEndBound),this.dialog.removeEventListener("cancel",this.handleCancelBound),this.dialog.removeEventListener("click",this.handleClickBound),this.dialog.removeEventListener("keydown",this.handleKeyDownBound),this.removeEventListener("keydown",this.handleKeyDownBound),this.headerActionsSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.footerSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.floatingSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.dialog.open&&this.dialog.close(),this.unlockDocumentScroll()}attributeChangedCallback(t){if(t==="open"){if(!this.isConnected||this.isSyncingOpenAttribute)return;this.hasAttribute("open")?this.openInternal():this.startClosing();return}this.syncAttributes()}get open(){return this.hasAttribute("open")}set open(t){this.toggleAttribute("open",t)}openBottomSheet(){this.open&&!this.isAnimatingClose||(this.triggerElement=document.activeElement instanceof HTMLElement?document.activeElement:null,this.open=!0)}closeBottomSheet(){!this.open&&!this.dialog.open||(this.open=!1)}focus(t){(K(this)[0]??this.dialog).focus(t)}syncAttributes(){const t=this.getAttribute("title")||"",n=this.getAttribute("description")||"";this.titleElement.id=this.titleId,this.titleElement.textContent=t,this.titleElement.hidden=t.length===0,this.descriptionElement.id=this.descriptionId,this.descriptionElement.textContent=n,this.descriptionElement.hidden=n.length===0,t.length>0?this.dialog.setAttribute("aria-labelledby",this.titleId):this.dialog.removeAttribute("aria-labelledby"),n.length>0?this.dialog.setAttribute("aria-describedby",this.descriptionId):this.dialog.removeAttribute("aria-describedby")}syncSlotVisibility(){this.headerActionsContainer.hidden=!R(this.headerActionsSlot),this.footerContainer.hidden=!R(this.footerSlot),this.floatingContainer.hidden=!R(this.floatingSlot)}handleAnimationEnd(t){!this.isAnimatingClose||t.target!==this.dialog||(this.dialog.classList.remove("closing"),this.dialog.close(),this.isAnimatingClose=!1,this.unlockDocumentScroll(),this.restoreTriggerFocus(),this.dispatchEvent(new Event("close",{bubbles:!0,composed:!0})))}handleCancel(t){t.preventDefault(),this.closeBottomSheet()}handleClick(t){this.isAnimatingClose||t.target===this.dialog&&this.closeBottomSheet()}handleKeyDown(t){if(t.currentTarget===this&&t.composedPath().includes(this.dialog))return;if(t.key==="Escape"){t.preventDefault(),this.closeBottomSheet();return}if(t.key!=="Tab")return;const n=K(this);if(n.length===0){t.preventDefault(),this.dialog.focus();return}const r=t.composedPath()[0],i=r instanceof HTMLElement?r:document.activeElement instanceof HTMLElement?document.activeElement:null,a=i===null?-1:n.findIndex(v=>Yt(i,v)),l=t.shiftKey?-1:1,d=t.shiftKey?n.length-1:0,c=a===-1?d:(a+l+n.length)%n.length;t.preventDefault(),n[c].focus()}openInternal(){this.syncAttributes(),this.syncSlotVisibility(),this.isAnimatingClose&&(this.dialog.classList.remove("closing"),this.isAnimatingClose=!1),this.dialog.open?this.lockDocumentScroll():(this.lockDocumentScroll(),this.dialog.showModal()),requestAnimationFrame(()=>{if(!this.dialog.open)return;(K(this)[0]??this.dialog).focus()})}startClosing(){!this.dialog.open||this.isAnimatingClose||(this.dialog.classList.add("closing"),this.isAnimatingClose=!0)}lockDocumentScroll(){this.previousDocumentOverflow.length===0&&this.previousBodyOverflow.length===0&&(this.previousDocumentOverflow=document.documentElement.style.overflow,this.previousBodyOverflow=document.body.style.overflow),document.documentElement.style.overflow="hidden",document.body.style.overflow="hidden"}unlockDocumentScroll(){document.documentElement.style.overflow=this.previousDocumentOverflow,document.body.style.overflow=this.previousBodyOverflow,this.previousDocumentOverflow="",this.previousBodyOverflow=""}restoreTriggerFocus(){this.triggerElement&&document.contains(this.triggerElement)&&this.triggerElement.focus(),this.triggerElement=null}}function Qt(){customElements.get(G)||customElements.define(G,Xt)}const te=`:host {\r
  display: block;\r
  width: 100%;\r
}\r
\r
:host([hidden]) {\r
  display: none;\r
  visibility: hidden;\r
}\r
\r
*,\r
*::before,\r
*::after {\r
  box-sizing: border-box;\r
}\r
\r
h2 {\r
  margin: 0;\r
}\r
\r
.card-component {\r
  background-color: var(--color-bg-input);\r
  border-radius: var(--radius-lg);\r
  border: var(--border-01) solid var(--color-border);\r
  box-shadow: none;\r
}\r
\r
.card-component__container {\r
  position: relative;\r
  display: flex;\r
  flex-direction: column;\r
  width: 100%;\r
  background-color: var(--color-bg);\r
  border-radius: inherit;\r
  padding: var(--spacing-lg);\r
  box-shadow: none;\r
}\r
\r
.card-component__header {\r
  position: relative;\r
  display: flex;\r
  align-items: center;\r
  width: 100%;\r
  margin-bottom: var(--spacing-sm);\r
}\r
\r
.card-icon {\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
}\r
\r
.card-component__icon {\r
  width: 24px;\r
  height: 24px;\r
  fill: var(--color-text-secondary);\r
  margin-right: var(--spacing-xs);\r
}\r
\r
.card-component__title {\r
  font-size: var(--font-size-heading);\r
  font-weight: var(--font-weight-semibold);\r
  margin: 0;\r
}\r
\r
.card-component__content {\r
  position: relative;\r
  display: flex;\r
  flex-direction: column;\r
  width: 100%;\r
  margin-top: var(--spacing-xs);\r
  gap: var(--spacing-md);\r
}\r
\r
.connection-notification {\r
  position: relative;\r
  display: flex;\r
  width: 100%;\r
  flex-direction: column;\r
  margin-bottom: var(--spacing-sm);\r
  color: var(--color-text-secondary);\r
  font-size: var(--font-size-label);\r
}\r
\r
.connection-notification[hidden] {\r
  display: none;\r
}\r
\r
.connection-notification[data-status="warning"] {\r
  color: var(--color-text-warning);\r
}\r
\r
.connection-notification[data-status="success"] {\r
  color: var(--color-meter-green);\r
}\r
\r
.connection-notification[data-status="error"],\r
.connection-notification[data-status="danger"] {\r
  color: var(--color-text-danger);\r
}\r
\r
.card-actions {\r
  margin-top: var(--spacing-xl);\r
}\r
\r
.wifi-connection-form__actions {\r
  position: relative;\r
  display: flex;\r
  align-items: center;\r
  width: 100%;\r
  gap: var(--spacing-sm);\r
}\r
\r
.card-component__footer[hidden] {\r
  display: none;\r
}\r
\r
::slotted(.card-component__description) {\r
  font-size: var(--font-size-label);\r
  line-height: 1.5;\r
  margin-bottom: var(--spacing-md);\r
  color: var(--color-text-secondary);\r
}\r
\r
::slotted([slot="footer"]) {\r
  width: auto;\r
}\r
`,Z="ui-card",vt=document.createElement("template");vt.innerHTML=`
  <style>${te}</style>
  <div class="card-component">
    <div class="card-component__container">
      <div class="card-component__header">
        <span class="card-icon">
          <span class="card-component__icon"></span>
        </span>
        <h2 class="card-component__title"></h2>
      </div>
      <div
        class="connection-notification"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        hidden
      ></div>
      <div class="card-component__content">
        <slot></slot>
      </div>
      <div class="card-actions wifi-connection-form__actions card-component__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
`;function ee(e,t){return e.includes("class=")?e.replace("<svg",`<svg class="${t}"`):e.replace("<svg",`<svg class="${t}"`)}class ne extends HTMLElement{static get observedAttributes(){return["title"]}constructor(){super();const t=this.attachShadow({mode:"open"});t.append(vt.content.cloneNode(!0)),this.footerContainer=t.querySelector(".card-component__footer"),this.footerSlot=t.querySelector('slot[name="footer"]'),this.footerSlot.addEventListener("slotchange",()=>{this.syncFooterVisibility()}),this.iconElement=t.querySelector(".card-component__icon"),this.notificationElement=t.querySelector(".connection-notification"),this.titleElement=t.querySelector(".card-component__title")}connectedCallback(){this.dataset.component=Z,this.syncAttributes(),this.syncFooterVisibility()}attributeChangedCallback(){this.syncAttributes()}get iconSvg(){return this.iconElement.innerHTML}set iconSvg(t){this.iconElement.innerHTML=t?ee(t,"card-component__icon"):""}setNotification(t,n="info"){if(!t){this.notificationElement.hidden=!0,this.notificationElement.textContent="",this.notificationElement.removeAttribute("data-status"),this.notificationElement.setAttribute("role","status"),this.notificationElement.setAttribute("aria-live","polite");return}this.notificationElement.hidden=!1,this.notificationElement.textContent=t,this.notificationElement.setAttribute("data-status",n),n==="error"||n==="danger"?(this.notificationElement.setAttribute("role","alert"),this.notificationElement.setAttribute("aria-live","assertive")):n==="warning"?(this.notificationElement.setAttribute("role","alert"),this.notificationElement.setAttribute("aria-live","polite")):(this.notificationElement.setAttribute("role","status"),this.notificationElement.setAttribute("aria-live","polite"))}syncAttributes(){this.titleElement.textContent=this.getAttribute("title")||""}syncFooterVisibility(){const t=this.footerSlot.assignedElements({flatten:!0}).length>0;this.footerContainer.hidden=!t}}function re(){customElements.get(Z)||customElements.define(Z,ne)}const ie=`:host {\r
  display: block;\r
  width: 100%;\r
}\r
\r
*,\r
*::before,\r
*::after {\r
  box-sizing: border-box;\r
}\r
\r
.form-control {\r
  position: relative;\r
  display: flex;\r
  flex-direction: column;\r
  width: 100%;\r
}\r
\r
.form-control label {\r
  font-size: var(--font-size-label);\r
  font-weight: var(--font-weight-regular);\r
  margin-bottom: var(--spacing-xs);\r
}\r
\r
.form-control__input-wrapper {\r
  position: relative;\r
  display: flex;\r
  align-items: center;\r
  width: 100%;\r
  gap: var(--spacing-sm);\r
}\r
\r
.duration-fields {\r
  align-items: center;\r
}\r
\r
.duration-fields ui-input {\r
  min-width: 0;\r
  flex: 1 1 0;\r
}\r
`,oe=document.createElement("template");oe.innerHTML=`
  <style>${ie}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper duration-fields">
      <ui-input variant="number" inputmode="numeric"></ui-input>
      <ui-input variant="number" inputmode="numeric"></ui-input>
    </div>
  </div>
`;const se=`:host {\r
  display: block;\r
  width: 100%;\r
}\r
\r
*,\r
*::before,\r
*::after {\r
  box-sizing: border-box;\r
}\r
\r
input,\r
textarea {\r
  margin: 0;\r
  font: inherit;\r
  color: inherit;\r
  -webkit-user-select: auto;\r
}\r
\r
p {\r
  margin: 0;\r
}\r
\r
.form-control {\r
  position: relative;\r
  display: flex;\r
  flex-direction: column;\r
  width: 100%;\r
}\r
\r
.form-control label {\r
  font-size: var(--font-size-label);\r
  font-weight: var(--font-weight-regular);\r
  margin-bottom: var(--spacing-xs);\r
}\r
\r
.form-control__input-wrapper {\r
  position: relative;\r
  display: flex;\r
  align-items: center;\r
  width: 100%;\r
  gap: var(--spacing-sm);\r
}\r
\r
.form-control__input-wrapper input {\r
  position: relative;\r
  display: flex;\r
  align-items: center;\r
  width: 100%;\r
  border: var(--border-01) solid var(--color-border);\r
  min-height: 44px;\r
  padding: var(--spacing-sm);\r
  border-radius: var(--input-radius);\r
  background-color: var(--color-bg-input);\r
  color: var(--color-text);\r
  font-size: var(--font-size-label);\r
}\r
\r
.form-control__input-wrapper input:focus-visible {\r
  outline: var(--focus-ring-width) solid var(--focus-ring-color);\r
  outline-offset: var(--focus-ring-offset);\r
}\r
\r
.form-control__input-wrapper input::file-selector-button {\r
  background-color: transparent;\r
  border: var(--border-01) solid var(--color-border);\r
  background-color: var(--color-bg);\r
  color: var(--color-text);\r
  border-radius: var(--radius-sm);\r
  min-height: 24px;\r
  font-size: var(--font-size-label);\r
  padding: var(--spacing-xs) var(--spacing-md);\r
  margin-right: var(--spacing-md);\r
}\r
\r
.progress-bar {\r
  position: relative;\r
  width: 100%;\r
}\r
\r
.progress-bar[hidden] {\r
  display: none;\r
}\r
\r
.progress-bar progress[value] {\r
  -webkit-appearance: none;\r
  appearance: none;\r
  border: none;\r
  width: 100%;\r
  height: 12px;\r
  border-radius: var(--radius-lg);\r
  overflow: hidden;\r
  margin-top: var(--spacing-sm);\r
}\r
\r
.progress-bar progress[value]::-webkit-progress-bar {\r
  background-color: var(--color-bg-active);\r
  border-radius: var(--radius-lg);\r
}\r
\r
.progress-bar progress[value]::-webkit-progress-value {\r
  background-color: var(--color-meter-green);\r
  border-radius: var(--radius-lg);\r
}\r
\r
.progress-bar__message {\r
  font-size: var(--font-size-label);\r
  line-height: 1.25;\r
  color: var(--color-text-secondary);\r
  margin-top: var(--spacing-xs);\r
}\r
\r
.form-helper-text {\r
  margin-top: var(--spacing-lg);\r
  font-size: var(--font-size-caption);\r
  line-height: 1.5;\r
  color: var(--color-text-secondary);\r
}\r
`,W="ui-file-upload",yt=document.createElement("template");yt.innerHTML=`
  <style>${se}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <input type="file" />
    </div>
    <div class="progress-bar">
      <progress value="0" max="100"></progress>
      <div class="progress-bar__message"></div>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;class ae extends HTMLElement{static get observedAttributes(){return["accept","aria-label","disabled","label","multiple","name","progress-max","progress-message","progress-value","warning-text"]}constructor(){super();const t=this.attachShadow({mode:"open",delegatesFocus:!0});t.append(yt.content.cloneNode(!0)),this.helperText=t.querySelector(".form-helper-text"),this.input=t.querySelector("input"),this.labelElement=t.querySelector("label"),this.progressBar=t.querySelector("progress"),this.progressContainer=t.querySelector(".progress-bar"),this.progressMessage=t.querySelector(".progress-bar__message"),this.input.addEventListener("change",n=>{n.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.input.addEventListener("input",n=>{n.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))})}connectedCallback(){this.dataset.component=W,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get accept(){return this.input.accept}set accept(t){this.setAttribute("accept",t)}get disabled(){return this.hasAttribute("disabled")}set disabled(t){this.toggleAttribute("disabled",t)}get files(){return this.input.files}get progressHidden(){return this.progressContainer.hidden}set progressHidden(t){this.progressContainer.hidden=t}get progressMax(){return this.progressBar.max}set progressMax(t){this.progressBar.max=t}get progressMessageText(){return this.progressMessage.textContent||""}set progressMessageText(t){this.progressMessage.textContent=t}get progressValue(){return this.progressBar.value}set progressValue(t){this.progressBar.value=t}get value(){return this.input.value}get warningText(){return this.helperText.textContent||""}set warningText(t){this.helperText.textContent=t}focus(t){this.input.focus(t)}syncAttributes(){const t=this.id||"file-upload",n=this.getAttribute("label")||"",r=this.getAttribute("warning-text")||"";this.input.id=t,this.input.accept=this.getAttribute("accept")||"",this.input.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.input.multiple=this.hasAttribute("multiple"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("name"),this.hasAttribute("progress-max")&&(this.progressBar.max=Number(this.getAttribute("progress-max"))||100),this.hasAttribute("progress-value")&&(this.progressBar.value=Number(this.getAttribute("progress-value"))||0),this.hasAttribute("progress-message")&&(this.progressMessage.textContent=this.getAttribute("progress-message")||""),this.labelElement.htmlFor=t,this.labelElement.textContent=n,this.labelElement.hidden=n.length===0,this.helperText.textContent=r,this.helperText.hidden=r.length===0}syncStringAttribute(t){const n=this.getAttribute(t);if(n===null){this.input.removeAttribute(t);return}this.input.setAttribute(t,n)}}function le(){customElements.get(W)||customElements.define(W,ae)}const ce=`:host {\r
  display: inline-flex;\r
  width: 44px;\r
  height: 44px;\r
  min-width: 44px;\r
  vertical-align: middle;\r
}\r
\r
*,\r
*::before,\r
*::after {\r
  box-sizing: border-box;\r
}\r
\r
button {\r
  all: unset;\r
  box-sizing: border-box;\r
  position: relative;\r
  display: inline-flex;\r
  align-items: center;\r
  justify-content: center;\r
  width: 44px;\r
  height: 44px;\r
  min-width: 44px;\r
  min-height: 44px;\r
  padding: 0;\r
  border: var(--border-01) solid transparent;\r
  border-radius: var(--button-radius);\r
  background-color: var(--color-text-secondary);\r
  color: var(--color-text-inverse);\r
  cursor: pointer;\r
}\r
\r
button:focus-visible {\r
  outline: var(--focus-ring-width) solid var(--focus-ring-color);\r
  outline-offset: var(--focus-ring-offset);\r
}\r
\r
button:disabled {\r
  background-color: var(--color-bg-mute);\r
  color: var(--color-text-mute);\r
  cursor: default;\r
}\r
\r
:host([variant="primary"]) button {\r
  background-color: var(--color-bg-brand);\r
  color: var(--color-text-inverse);\r
}\r
\r
:host([variant="primary"]) button:not(:disabled):is(:hover, :active) {\r
  background-color: var(--color-bg-brand-hover);\r
}\r
\r
:host([variant="secondary"]) button {\r
  background-color: var(--color-bg-active);\r
  color: var(--color-fg-active);\r
}\r
\r
:host([variant="secondary"]) button:not(:disabled):is(:hover, :active) {\r
  background-color: var(--color-bg-active);\r
  color: var(--color-fg-active);\r
}\r
\r
:host([variant="outline"]) button {\r
  background-color: transparent;\r
  border-color: var(--color-border);\r
  color: var(--color-text-secondary);\r
}\r
\r
:host([variant="outline"]) button:not(:disabled):is(:hover, :active) {\r
  background-color: var(--color-border);\r
  border-color: var(--color-border);\r
}\r
\r
:host([variant="ghost"]) button {\r
  background-color: transparent;\r
  border-color: transparent;\r
  color: var(--color-text-secondary);\r
}\r
\r
:host([variant="ghost"]) button:not(:disabled):is(:hover, :active) {\r
  background-color: var(--color-overlay);\r
}\r
\r
:host([inverse]) button {\r
  color: var(--color-text-inverse);\r
}\r
\r
:host([variant="outline"][inverse]) button {\r
  border-color: var(--color-text-inverse);\r
}\r
\r
:host([variant="outline"][inverse]) button:not(:disabled):is(:hover, :active),\r
:host([variant="ghost"][inverse]) button:not(:disabled):is(:hover, :active) {\r
  background-color: var(--color-overlay);\r
  border-color: var(--color-text-inverse);\r
}\r
\r
:host([rounded]) button {\r
  border-radius: var(--radius-full);\r
}\r
\r
::slotted(svg) {\r
  width: 24px;\r
  height: 24px;\r
  flex-shrink: 0;\r
  fill: currentColor;\r
}\r
`,J="ui-icon-button",wt=document.createElement("template");wt.innerHTML=`
  <style>${ce}</style>
  <button type="button" part="button">
    <slot></slot>
  </button>
`;function ct(e){return e==="submit"||e==="reset"?e:"button"}class de extends HTMLElement{static get observedAttributes(){return["disabled","aria-label","type"]}constructor(){super();const t=this.attachShadow({mode:"open",delegatesFocus:!0});t.append(wt.content.cloneNode(!0)),this.button=t.querySelector("button")}connectedCallback(){this.dataset.component=J,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(t){this.toggleAttribute("disabled",t)}get type(){return ct(this.getAttribute("type"))}set type(t){this.setAttribute("type",ct(t))}focus(t){this.button.focus(t)}click(){this.button.click()}syncAttributes(){this.button.disabled=this.disabled,this.button.type=this.type,this.tabIndex=this.disabled?-1:0;const t=this.getAttribute("aria-label");t?this.button.setAttribute("aria-label",t):this.button.removeAttribute("aria-label")}}function ue(){customElements.get(J)||customElements.define(J,de)}const he='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>',ge='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>',pe=`:host {\r
  display: block;\r
  width: 100%;\r
}\r
\r
*,\r
*::before,\r
*::after {\r
  box-sizing: border-box;\r
}\r
\r
input,\r
button,\r
select,\r
textarea {\r
  margin: 0;\r
  font: inherit;\r
  color: inherit;\r
}\r
\r
input,\r
textarea {\r
  -webkit-user-select: auto;\r
}\r
\r
p {\r
  margin: 0;\r
}\r
\r
.form-control__input-wrapper input,\r
.password-toggle-btn {\r
  font: inherit;\r
}\r
\r
.form-control {\r
  position: relative;\r
  display: flex;\r
  flex-direction: column;\r
  width: 100%;\r
}\r
\r
.form-control label {\r
  font-size: var(--font-size-label);\r
  font-weight: var(--font-weight-regular);\r
  margin-bottom: var(--spacing-xs);\r
}\r
\r
.form-helper-text {\r
  margin-top: var(--spacing-xs);\r
  font-size: var(--font-size-caption);\r
  line-height: 1.25;\r
  color: var(--color-text-secondary);\r
}\r
\r
.form-control__input-wrapper {\r
  position: relative;\r
  display: flex;\r
  align-items: center;\r
  width: 100%;\r
  gap: var(--spacing-sm);\r
}\r
\r
.form-control__input-wrapper input {\r
  position: relative;\r
  display: flex;\r
  align-items: center;\r
  width: 100%;\r
  border: var(--border-01) solid var(--color-border);\r
  min-height: 44px;\r
  padding: var(--spacing-xs) var(--spacing-sm);\r
  border-radius: var(--input-radius);\r
  background-color: var(--color-bg-input);\r
  color: var(--color-text);\r
  font-size: var(--font-size-label);\r
  line-height: normal;\r
  appearance: none;\r
  -webkit-appearance: none;\r
}\r
\r
.form-control__input-wrapper input::placeholder {\r
  color: var(--color-text-mute);\r
}\r
\r
.form-control__input-wrapper input[type="time"]::-webkit-calendar-picker-indicator,\r
.form-control__input-wrapper input[type="date"]::-webkit-calendar-picker-indicator {\r
  display: none;\r
  -webkit-appearance: none;\r
}\r
\r
.form-control__input-wrapper input:focus-visible,\r
.password-toggle-btn:focus-visible {\r
  outline: var(--focus-ring-width) solid var(--focus-ring-color);\r
  outline-offset: var(--focus-ring-offset);\r
}\r
\r
:host(.error) input,\r
:host([invalid]) input,\r
:host([aria-invalid="true"]) input,\r
.form-control__input-wrapper input.error {\r
  outline: var(--focus-ring-width) solid var(--color-meter-red);\r
  outline-offset: var(--focus-ring-offset);\r
}\r
\r
.duration-fields {\r
  align-items: center;\r
}\r
\r
.duration-fields input {\r
  min-width: 0;\r
  flex: 1 1 0;\r
}\r
\r
.duration-fields__unit {\r
  flex: 0 0 auto;\r
  font-size: var(--font-size-caption);\r
  font-weight: var(--font-weight-regular);\r
  color: var(--color-text-secondary);\r
  text-transform: uppercase;\r
}\r
\r
.duration-fields__unit[hidden] {\r
  display: none;\r
}\r
\r
.password-toggle-btn {\r
  position: absolute;\r
  right: 6px;\r
  display: flex;\r
  width: 36px;\r
  height: 36px;\r
  align-items: center;\r
  justify-content: center;\r
  padding: 0;\r
  border: none;\r
  border-radius: var(--radius-xs);\r
  background-color: transparent;\r
  color: var(--color-text-secondary);\r
  cursor: pointer;\r
  appearance: none;\r
  -webkit-appearance: none;\r
}\r
\r
.password-toggle-btn:disabled {\r
  color: var(--color-text-mute);\r
  cursor: default;\r
}\r
\r
.password-toggle-btn:not(:disabled):is(:hover, :active) {\r
  background-color: var(--color-overlay);\r
}\r
\r
.password-icon {\r
  width: 24px;\r
  height: 24px;\r
  fill: var(--color-text-secondary);\r
}\r
`,j="ui-input",xt=document.createElement("template");xt.innerHTML=`
  <style>${pe}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <input />
      <span class="duration-fields__unit"></span>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;function fe(e){return e==="number"||e==="password"||e==="time"||e==="date"?e:"text"}function me(e){return e==="password"||e==="number"||e==="time"||e==="date"?e:"text"}class be extends HTMLElement{constructor(){super(),this.isPasswordVisible=!1,this.customValidationMessage="";const t=this.attachShadow({mode:"open",delegatesFocus:!0});t.append(xt.content.cloneNode(!0)),this.input=t.querySelector("input"),this.helperText=t.querySelector(".form-helper-text"),this.label=t.querySelector("label"),this.suffix=t.querySelector(".duration-fields__unit"),this.toggleButton=document.createElement("button"),this.wrapper=t.querySelector(".form-control__input-wrapper"),this.toggleButton.className="password-toggle-btn",this.toggleButton.type="button",this.input.addEventListener("input",n=>{this.syncValidationState(),n.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}),this.input.addEventListener("change",n=>{this.syncValidationState(),n.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.input.addEventListener("invalid",()=>{this.syncValidationState()}),this.toggleButton.addEventListener("click",()=>{this.togglePasswordVisibility()})}static get observedAttributes(){return["aria-label","aria-invalid","autocomplete","disabled","helper-text","invalid","inputmode","label","max","maxlength","min","name","placeholder","readonly","required","step","suffix","type","value","variant"]}connectedCallback(){this.hasAttribute("variant")||this.setAttribute("variant","text"),this.dataset.component=j,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(t){this.toggleAttribute("disabled",t)}get type(){return this.input.type}set type(t){this.setAttribute("type",t)}get value(){return this.input.value}set value(t){this.input.value=t,this.syncValidationState()}focus(t){this.input.focus(t)}select(){this.input.select()}get validationMessage(){return this.input.validationMessage}get validity(){return this.input.validity}get willValidate(){return this.input.willValidate}checkValidity(){const t=this.input.checkValidity();return this.syncValidationState(),t}reportValidity(){const t=this.input.reportValidity();return this.syncValidationState(),t}setCustomValidity(t){this.customValidationMessage=t,this.input.setCustomValidity(t),this.syncValidationState()}syncAttributes(){const t=fe(this.getAttribute("variant")),n=this.getAttribute("helper-text")||"",r=this.id?`${this.id}Input`:"input",i=this.getAttribute("label")||"",a=this.getAttribute("suffix")||"",l=t==="password"?this.isPasswordVisible?"text":"password":this.getAttribute("type")||me(t);if(this.input.id=r,this.input.type=l,this.input.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.input.readOnly=this.hasAttribute("readonly"),this.input.required=this.hasAttribute("required"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("autocomplete"),this.syncStringAttribute("inputmode"),this.syncStringAttribute("max"),this.syncStringAttribute("maxlength"),this.syncStringAttribute("min"),this.syncStringAttribute("name"),this.syncStringAttribute("placeholder"),this.syncStringAttribute("step"),this.hasAttribute("value")&&this.input.value!==this.getAttribute("value")&&(this.input.value=this.getAttribute("value")||""),this.input.setCustomValidity(this.customValidationMessage),this.label.htmlFor=r,this.label.textContent=i,this.label.hidden=i.length===0,this.helperText.textContent=n,this.helperText.hidden=n.length===0,this.wrapper.classList.toggle("duration-fields",t==="number"),this.suffix.textContent=a,this.suffix.hidden=t!=="number"||a.length===0,n.length>0){const d=`${r}HelperText`;this.helperText.id=d,this.input.setAttribute("aria-describedby",d)}else this.helperText.removeAttribute("id"),this.input.removeAttribute("aria-describedby");t==="password"?(this.toggleButton.isConnected||this.wrapper.append(this.toggleButton),this.toggleButton.disabled=this.disabled,this.toggleButton.setAttribute("aria-label",this.isPasswordVisible?"Hide password":"Show password"),this.toggleButton.innerHTML=ve(this.isPasswordVisible?he:ge,"password-icon")):(this.isPasswordVisible=!1,this.toggleButton.remove()),this.syncValidationState()}syncStringAttribute(t){const n=this.getAttribute(t);if(n===null){this.input.removeAttribute(t);return}this.input.setAttribute(t,n)}togglePasswordVisibility(){this.isPasswordVisible=!this.isPasswordVisible,this.syncAttributes()}syncValidationState(){const t=this.hasAttribute("invalid")||this.getAttribute("aria-invalid")==="true"||!this.input.validity.valid;this.classList.toggle("error",t),this.input.classList.toggle("error",t),this.hasAttribute("invalid")!==t&&this.toggleAttribute("invalid",t),this.getAttribute("aria-invalid")!==String(t)&&this.setAttribute("aria-invalid",String(t)),this.input.getAttribute("aria-invalid")!==String(t)&&this.input.setAttribute("aria-invalid",String(t))}}function ve(e,t){return e.includes("class=")?e.replace("<svg",`<svg class="${t}"`):e.replace("<svg",`<svg class="${t}"`)}function ye(){customElements.get(j)||customElements.define(j,be)}const we=`:host {\r
  display: block;\r
  width: 100%;\r
}\r
\r
:host([hidden]) {\r
  display: none;\r
}\r
\r
*,\r
*::before,\r
*::after {\r
  box-sizing: border-box;\r
}\r
\r
ol,\r
ul,\r
menu,\r
summary {\r
  margin: 0;\r
  padding: 0;\r
  list-style: none;\r
}\r
\r
p {\r
  margin: 0;\r
}\r
\r
.networks {\r
  position: relative;\r
  width: 100%;\r
  display: flex;\r
  flex-direction: column;\r
  margin-bottom: var(--spacing-lg);\r
}\r
\r
.networks__list {\r
  position: relative;\r
  display: flex;\r
  width: 100%;\r
  flex-direction: column;\r
  height: 320px;\r
  overflow-y: auto;\r
  border: var(--border-01) solid var(--color-border);\r
  padding: var(--spacing-xs);\r
  border-radius: var(--radius-lg);\r
}\r
\r
.networks__list:focus {\r
  outline: var(--focus-ring-width) solid var(--focus-ring-color);\r
  outline-offset: var(--focus-ring-offset);\r
}\r
\r
.networks__list-empty-state {\r
  position: relative;\r
  display: flex;\r
  flex-direction: column;\r
  align-items: center;\r
  justify-content: center;\r
  width: 100%;\r
  height: 100%;\r
  color: var(--color-text-secondary);\r
  font-size: var(--font-size-heading);\r
}\r
\r
.wifi-find-icon {\r
  width: 64px;\r
  height: 64px;\r
  fill: var(--color-text-mute);\r
}\r
\r
.networks__item {\r
  position: relative;\r
  width: 100%;\r
  display: flex;\r
  align-items: center;\r
  cursor: pointer;\r
  padding: var(--spacing-sm) var(--spacing-xs);\r
  border: var(--border-01) solid transparent;\r
  min-height: 32px;\r
  font-size: var(--font-size-label);\r
  justify-content: space-between;\r
  border-radius: var(--radius-xs);\r
}\r
\r
.networks__item-ssid {\r
  font-weight: var(--font-weight-semibold);\r
}\r
\r
.networks__item-details {\r
  display: flex;\r
  align-items: center;\r
  gap: var(--spacing-md);\r
}\r
\r
.networks__item ~ .networks__item {\r
  border-top: var(--border-01) solid var(--color-bg-selected);\r
}\r
\r
.networks__item[aria-selected="true"] {\r
  background-color: var(--color-bg-active);\r
  outline: var(--focus-ring-width) solid var(--color-fg-active);\r
  outline-offset: var(--focus-ring-offset);\r
}\r
\r
.wifi-security-icon,\r
.wifi-signal-icon,\r
.wifi-connected-icon {\r
  width: 16px;\r
  height: 16px;\r
  fill: var(--color-text-secondary);\r
}\r
`,Y="ui-network-list",St="networkList",X="network-list-label",Tt=document.createElement("template");Tt.innerHTML=`
  <style>${we}</style>
  <div class="networks">
    <span id="${X}" hidden>Available networks</span>
    <ul
      id="${St}"
      class="networks__list"
      role="listbox"
      aria-labelledby="${X}"
      tabindex="0"
    ></ul>
  </div>
`;class xe extends HTMLElement{static get observedAttributes(){return["aria-label","label"]}constructor(){super();const t=this.attachShadow({mode:"open",delegatesFocus:!0});t.append(Tt.content.cloneNode(!0)),this.labelElement=t.querySelector(`#${X}`),this.listElement=t.querySelector(`#${St}`),this.listElement.addEventListener("keydown",n=>{(n.key==="ArrowDown"||n.key==="ArrowUp"||n.key==="Home"||n.key==="End"||n.key===" ")&&n.preventDefault()})}connectedCallback(){this.tabIndex=0,this.dataset.component=Y,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}appendItem(t){this.listElement.appendChild(t)}clearItems(){this.listElement.innerHTML=""}focus(t){this.listElement.focus(t)}getOptions(){return Array.from(this.listElement.querySelectorAll('[role="option"]'))}scrollOptionIntoView(t){const n=this.getOptions()[t];if(!n)return;const r=this.listElement.scrollTop,i=r+this.listElement.clientHeight,a=n.offsetTop,l=a+n.offsetHeight;if(a<r){this.listElement.scrollTop=a;return}l>i&&(this.listElement.scrollTop=l-this.listElement.clientHeight)}setActiveDescendant(t){if(t){this.listElement.setAttribute("aria-activedescendant",t);return}this.listElement.removeAttribute("aria-activedescendant")}setEmptyState(t){this.clearItems(),this.appendItem(t)}syncAttributes(){const t=this.getAttribute("label")||"Available networks",n=this.getAttribute("aria-label");this.labelElement.textContent=t,n?this.listElement.setAttribute("aria-label",n):this.listElement.removeAttribute("aria-label")}}function Se(){customElements.get(Y)||customElements.define(Y,xe)}const Te=`:host {\r
  display: block;\r
  width: 100%;\r
}\r
\r
:host([hidden]) {\r
  display: none;\r
}\r
\r
*,\r
*::before,\r
*::after {\r
  box-sizing: border-box;\r
}\r
\r
.wifi-status-card {\r
  position: relative;\r
  display: flex;\r
  width: 100%;\r
  align-items: center;\r
  background-color: var(--color-bg-brand);\r
  padding: var(--spacing-md) var(--spacing-md);\r
  border-radius: var(--radius-lg);\r
}\r
\r
.wifi-status-card__content {\r
  position: relative;\r
  display: flex;\r
  align-items: center;\r
  justify-content: space-between;\r
  gap: var(--spacing-sm);\r
  flex-wrap: wrap;\r
  width: 100%;\r
}\r
\r
.wifi-status-card__content .wifi-icon {\r
  width: 32px;\r
  height: 32px;\r
  fill: var(--color-text-inverse);\r
}\r
\r
.wifi-status-card__actions {\r
  position: relative;\r
  display: flex;\r
  align-items: center;\r
  gap: var(--spacing-sm);\r
  margin-left: auto;\r
}\r
\r
.wifi-status-card__status {\r
  position: relative;\r
  display: flex;\r
  align-items: center;\r
  gap: var(--spacing-xs);\r
  min-width: 0;\r
}\r
\r
.wifi-status-card__label {\r
  font-size: var(--font-size-label);\r
  color: var(--color-text-inverse);\r
  font-weight: var(--font-weight-medium);\r
}\r
\r
.wifi-status-card__network {\r
  font-size: var(--font-size-label);\r
  color: var(--color-text-inverse);\r
  font-weight: var(--font-weight-semibold);\r
  min-width: 0;\r
  overflow-wrap: anywhere;\r
}\r
`,Q="ui-network-status",At="actionBtn",kt="settingsBtn",Et="wifiStatusLabel",Ct="wifiStatusIcon",_t="wifiStatusNetwork",Lt=document.createElement("template");Lt.innerHTML=`
  <style>${Te}</style>
  <div class="wifi-status-card">
    <div class="wifi-status-card__content">
      <div class="wifi-status-card__status">
        <span class="card-icon" id="${Ct}"></span>
        <span id="${Et}" class="wifi-status-card__label">
          Disconnected
        </span>
        <span
          id="${_t}"
          class="wifi-status-card__network"
        ></span>
      </div>
      <div class="wifi-status-card__actions">
        <ui-button
          id="${At}"
          variant="outline"
          inverse
          aria-label="Connect"
        >
          Connect
        </ui-button>
        <ui-button
          id="${kt}"
          variant="outline"
          inverse
          aria-label="Settings"
        >
          Settings
        </ui-button>
      </div>
    </div>
  </div>
`;function Ae(e,t){return e.includes("class=")?e.replace("<svg",`<svg class="${t}"`):e.replace("<svg",`<svg class="${t}"`)}class ke extends HTMLElement{static get observedAttributes(){return["action-label","network","status-label"]}constructor(){super();const t=this.attachShadow({mode:"open"});t.append(Lt.content.cloneNode(!0)),this.actionButton=t.querySelector(`#${At}`),this.actionButton.addEventListener("click",n=>{n.stopPropagation(),this.dispatchEvent(new Event("action",{bubbles:!0,composed:!0}))}),this.iconElement=t.querySelector(`#${Ct}`),this.labelElement=t.querySelector(`#${Et}`),this.networkElement=t.querySelector(`#${_t}`),this.settingsButton=t.querySelector(`#${kt}`),this.settingsButton.addEventListener("click",n=>{n.stopPropagation(),this.dispatchEvent(new Event("settings",{bubbles:!0,composed:!0}))})}connectedCallback(){this.dataset.component=Q,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get actionDisabled(){return!!this.actionButton.disabled}set actionDisabled(t){this.actionButton.disabled=t}get iconSvg(){return this.iconElement.innerHTML}set iconSvg(t){this.iconElement.innerHTML=t?Ae(t,"wifi-icon"):""}get network(){return this.getAttribute("network")||""}set network(t){this.setAttribute("network",t)}get actionLabel(){return this.getAttribute("action-label")||"Connect"}set actionLabel(t){this.setAttribute("action-label",t)}get statusLabel(){return this.getAttribute("status-label")||"Disconnected"}set statusLabel(t){this.setAttribute("status-label",t)}syncAttributes(){this.actionButton.textContent=this.actionLabel,this.actionButton.setAttribute("aria-label",this.actionLabel),this.labelElement.textContent=this.statusLabel,this.networkElement.textContent=this.network,this.networkElement.hidden=this.network.length===0}}function Ee(){customElements.get(Q)||customElements.define(Q,ke)}const Ce=`:host {\r
  display: block;\r
  width: 100%;\r
}\r
\r
*,\r
*::before,\r
*::after {\r
  box-sizing: border-box;\r
}\r
\r
input,\r
textarea {\r
  margin: 0;\r
  font: inherit;\r
  color: inherit;\r
  -webkit-user-select: auto;\r
}\r
\r
.form-control {\r
  position: relative;\r
  display: flex;\r
  flex-direction: column;\r
  width: 100%;\r
}\r
\r
.form-control label {\r
  font-size: var(--font-size-label);\r
  font-weight: var(--font-weight-regular);\r
  margin-bottom: var(--spacing-xs);\r
}\r
\r
.range-slider {\r
  width: 100%;\r
  display: flex;\r
  align-items: center;\r
  gap: var(--spacing-sm);\r
}\r
\r
.range-slider__range {\r
  -webkit-appearance: none;\r
  appearance: none;\r
  width: 100%;\r
  height: 34px;\r
  border-radius: var(--radius-full);\r
  background: var(--color-bg-input);\r
  outline: none;\r
}\r
\r
.range-slider__range:focus-visible {\r
  outline: var(--focus-ring-width) solid var(--focus-ring-color);\r
  outline-offset: var(--focus-ring-offset);\r
}\r
\r
.range-slider__range::-webkit-slider-thumb {\r
  -webkit-appearance: none;\r
  appearance: none;\r
  width: 30px;\r
  height: 30px;\r
  border-radius: 50%;\r
  background: var(--color-bg);\r
  border: var(--border-03) solid var(--color-bg-brand);\r
  box-shadow: 0px 2px 6px -2px rgba(32, 32, 32, 0.4);\r
  cursor: pointer;\r
  transition: background 0.15s ease-in-out;\r
}\r
\r
.range-slider__range::-webkit-slider-thumb:hover {\r
  background: var(--color-bg);\r
}\r
\r
.range-slider__range:active::-webkit-slider-thumb {\r
  background: var(--color-bg);\r
}\r
\r
.range-slider__range::-moz-range-thumb {\r
  width: 30px;\r
  height: 30px;\r
  border: var(--border-03) solid var(--color-bg-brand);\r
  border-radius: 50%;\r
  background: var(--color-bg);\r
  box-shadow: 0px 2px 6px -2px rgba(32, 32, 32, 0.4);\r
  cursor: pointer;\r
  transition: background 0.15s ease-in-out;\r
}\r
\r
.range-slider__range::-moz-range-thumb:hover {\r
  background: var(--color-bg);\r
}\r
\r
.range-slider__range:active::-moz-range-thumb {\r
  background: var(--color-bg);\r
}\r
\r
.range-slider__value {\r
  display: inline-flex;\r
  align-items: center;\r
  justify-content: center;\r
  min-width: 48px;\r
  height: 28px;\r
  font-size: var(--font-size-label);\r
  font-weight: var(--font-weight-semibold);\r
  color: var(--color-text-inverse);\r
  background: var(--color-bg-brand);\r
  border-radius: var(--radius-md);\r
}\r
`,_e=document.createElement("template");_e.innerHTML=`
  <style>${Ce}</style>
  <div class="form-control">
    <label></label>
    <div class="range-slider">
      <input class="range-slider__range" type="range" />
      <span class="range-slider__value"></span>
    </div>
  </div>
`;const Le='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80 240-320l57-57 183 183 183-183 57 57L480-80ZM298-584l-58-56 240-240 240 240-58 56-182-182-182 182Z"/></svg>',Ie=`:host {\r
  display: block;\r
  width: 100%;\r
}\r
\r
*,\r
*::before,\r
*::after {\r
  box-sizing: border-box;\r
}\r
\r
input,\r
button,\r
select,\r
textarea {\r
  margin: 0;\r
  font: inherit;\r
  color: inherit;\r
}\r
\r
input,\r
textarea {\r
  -webkit-user-select: auto;\r
}\r
\r
p {\r
  margin: 0;\r
}\r
\r
.form-control {\r
  position: relative;\r
  display: flex;\r
  flex-direction: column;\r
  width: 100%;\r
}\r
\r
.form-control label {\r
  font-size: var(--font-size-label);\r
  font-weight: var(--font-weight-regular);\r
  margin-bottom: var(--spacing-xs);\r
}\r
\r
.form-helper-text {\r
  margin-top: var(--spacing-xs);\r
  font-size: var(--font-size-caption);\r
  line-height: 1.25;\r
  color: var(--color-text-secondary);\r
}\r
\r
.form-control__input-wrapper {\r
  position: relative;\r
  display: flex;\r
  align-items: center;\r
  width: 100%;\r
  gap: var(--spacing-sm);\r
}\r
\r
.form-control__input-wrapper select {\r
  position: relative;\r
  display: flex;\r
  align-items: center;\r
  width: 100%;\r
  border: var(--border-01) solid var(--color-border);\r
  min-height: 44px;\r
  padding: var(--spacing-xs) var(--spacing-sm);\r
  border-radius: var(--input-radius);\r
  background-color: var(--color-bg-input);\r
  color: var(--color-text);\r
  font-size: var(--font-size-label);\r
  line-height: normal;\r
  appearance: none;\r
  -webkit-appearance: none;\r
}\r
\r
.select-icon {\r
  position: absolute;\r
  width: 32px;\r
  height: 18px;\r
  background-color: transparent;\r
  border-radius: var(--radius-xs);\r
  right: 2px;\r
  fill: var(--color-text-secondary);\r
  pointer-events: none;\r
}\r
\r
.form-control__input-wrapper select:focus-visible {\r
  outline: var(--focus-ring-width) solid var(--focus-ring-color);\r
  outline-offset: var(--focus-ring-offset);\r
}\r
\r
:host(.error) select,\r
:host([invalid]) select,\r
:host([aria-invalid="true"]) select,\r
.form-control__input-wrapper select.error {\r
  outline: var(--focus-ring-width) solid var(--color-meter-red);\r
  outline-offset: var(--focus-ring-offset);\r
}\r
`,tt="ui-select",It=document.createElement("template");It.innerHTML=`
  <style>${Ie}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <select></select>
      <span class="select-icon"></span>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;class Be extends HTMLElement{constructor(){super(),this.customValidationMessage="";const t=this.attachShadow({mode:"open",delegatesFocus:!0});t.append(It.content.cloneNode(!0)),this.helperText=t.querySelector(".form-helper-text"),this.labelElement=t.querySelector("label"),this.select=t.querySelector("select");const n=t.querySelector(".select-icon");n.innerHTML=ze(Le,"select-icon"),this.select.addEventListener("change",r=>{this.syncValidationState(),r.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.select.addEventListener("input",r=>{this.syncValidationState(),r.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}),this.select.addEventListener("invalid",()=>{this.syncValidationState()})}static get observedAttributes(){return["aria-invalid","aria-label","disabled","helper-text","invalid","label","name","required","value"]}connectedCallback(){this.moveLightDomOptions(),this.dataset.component=tt,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(t){this.toggleAttribute("disabled",t)}get innerHTML(){return this.select.innerHTML}set innerHTML(t){this.select.innerHTML=t,this.syncValidationState()}get value(){return this.select.value}set value(t){this.select.value=t,this.syncValidationState()}appendChild(t){return t instanceof HTMLOptionElement||t instanceof HTMLOptGroupElement?(this.select.appendChild(t),t):super.appendChild(t)}focus(t){this.select.focus(t)}get validationMessage(){return this.select.validationMessage}get validity(){return this.select.validity}get willValidate(){return this.select.willValidate}checkValidity(){const t=this.select.checkValidity();return this.syncValidationState(),t}reportValidity(){const t=this.select.reportValidity();return this.syncValidationState(),t}setCustomValidity(t){this.customValidationMessage=t,this.select.setCustomValidity(t),this.syncValidationState()}moveLightDomOptions(){Array.from(this.children).forEach(t=>{(t instanceof HTMLOptionElement||t instanceof HTMLOptGroupElement)&&this.select.appendChild(t)})}syncAttributes(){const t=this.getAttribute("helper-text")||"",n=this.id?`${this.id}Select`:"select",r=this.getAttribute("label")||"";if(this.select.id=n,this.select.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.select.required=this.hasAttribute("required"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("name"),this.hasAttribute("value")&&(this.select.value=this.getAttribute("value")||""),this.select.setCustomValidity(this.customValidationMessage),this.labelElement.htmlFor=n,this.labelElement.textContent=r,this.labelElement.hidden=r.length===0,this.helperText.textContent=t,this.helperText.hidden=t.length===0,t.length>0){const i=`${n}HelperText`;this.helperText.id=i,this.select.setAttribute("aria-describedby",i)}else this.helperText.removeAttribute("id"),this.select.removeAttribute("aria-describedby");this.syncValidationState()}syncStringAttribute(t){const n=this.getAttribute(t);if(n===null){this.select.removeAttribute(t);return}this.select.setAttribute(t,n)}syncValidationState(){const t=this.hasAttribute("invalid")||this.getAttribute("aria-invalid")==="true"||!this.select.validity.valid;this.classList.toggle("error",t),this.select.classList.toggle("error",t),this.hasAttribute("invalid")!==t&&this.toggleAttribute("invalid",t),this.getAttribute("aria-invalid")!==String(t)&&this.setAttribute("aria-invalid",String(t)),this.select.getAttribute("aria-invalid")!==String(t)&&this.select.setAttribute("aria-invalid",String(t))}}function Me(){customElements.get(tt)||customElements.define(tt,Be)}function ze(e,t){return e.includes("class=")?e.replace("<svg",`<svg class="${t}"`):e.replace("<svg",`<svg class="${t}"`)}const qe=`:host {\r
  display: block;\r
  width: 100%;\r
}\r
\r
*,\r
*::before,\r
*::after {\r
  box-sizing: border-box;\r
}\r
\r
.form-control {\r
  position: relative;\r
  display: flex;\r
  flex-direction: column;\r
  width: 100%;\r
}\r
\r
.switch-container {\r
  display: flex;\r
  align-items: center;\r
  gap: var(--spacing-sm);\r
}\r
\r
.switch-label {\r
  font-size: var(--font-size-label);\r
  font-weight: var(--font-weight-medium);\r
  flex-shrink: 0;\r
}\r
\r
button {\r
  all: unset;\r
  box-sizing: border-box;\r
  position: relative;\r
  display: inline-flex;\r
  align-items: center;\r
  flex-shrink: 0;\r
  width: 62px;\r
  height: 34px;\r
  padding: 0;\r
  border: none;\r
  border-radius: var(--radius-full);\r
  background-color: var(--color-bg-input);\r
  color: inherit;\r
  cursor: pointer;\r
  transition: background-color 0.2s ease;\r
}\r
\r
button:disabled {\r
  cursor: not-allowed;\r
  opacity: 0.6;\r
}\r
\r
.switch-label[hidden] {\r
  display: none;\r
}\r
\r
button[data-checked] {\r
  background-color: var(--color-bg-brand);\r
}\r
\r
button::before {\r
  content: "";\r
  position: absolute;\r
  inset: 0;\r
  border-radius: inherit;\r
  opacity: 0;\r
  box-shadow: 0 0 0 var(--focus-ring-width) currentColor;\r
  transition: opacity 0.2s ease;\r
}\r
\r
button:focus-visible::before {\r
  opacity: 0.35;\r
}\r
\r
.knob {\r
  position: absolute;\r
  left: 2px;\r
  width: 30px;\r
  height: 30px;\r
  border-radius: var(--radius-full);\r
  background-color: var(--color-fg-knob-off);\r
  box-shadow: 0 2px 6px -2px rgba(32, 32, 32, 0.4);\r
  transition:\r
    transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275),\r
    background-color 0.2s ease;\r
}\r
\r
button[data-checked] .knob {\r
  background-color: var(--color-fg-knob-on);\r
}\r
`,Pe=document.createElement("template");Pe.innerHTML=`
  <style>${qe}</style>
  <div class="form-control">
    <div class="switch-container">
      <button type="button" part="button">
        <span class="knob"></span>
      </button>
      <span class="switch-label"></span>
    </div>
  </div>
`;const Oe=`:host {\r
  display: contents;\r
}\r
\r
*,\r
*::before,\r
*::after {\r
  box-sizing: border-box;\r
}\r
\r
.toast-dialog {\r
  position: fixed;\r
  left: 50%;\r
  bottom: var(--spacing-4xl);\r
  margin: 0;\r
  padding: 0;\r
  border: none;\r
  background: transparent;\r
  color: inherit;\r
  width: min(50vw, calc(100vw - 2rem));\r
  max-width: calc(100vw - 2rem);\r
  pointer-events: none;\r
  z-index: 30;\r
}\r
\r
.toast-dialog[open] {\r
  display: block;\r
  animation: toast-dialog-fade 2.6s ease forwards;\r
}\r
\r
.toast-dialog::backdrop {\r
  display: none;\r
}\r
\r
.toast-dialog__message {\r
  margin: 0;\r
  box-sizing: border-box;\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  width: 100%;\r
  padding: var(--spacing-sm) var(--spacing-lg);\r
  min-height: 44px;\r
  overflow: hidden;\r
  border: var(--border-01) solid var(--color-meter-green);\r
  border-radius: var(--radius-lg);\r
  background: var(--color-bg-active);\r
  color: var(--color-text);\r
  box-shadow: 0 0.5rem 1.25rem var(--color-overlay);\r
  font-size: var(--font-size-label);\r
  line-height: 1.25;\r
  text-align: center;\r
  text-overflow: ellipsis;\r
}\r
\r
.toast-dialog[data-status='error'] .toast-dialog__message,\r
.toast-dialog[data-status='danger'] .toast-dialog__message {\r
  border-color: var(--color-text-danger);\r
  background: var(--color-bg-danger);\r
  color: var(--color-text-danger);\r
}\r
\r
.toast-dialog[data-status='warning'] .toast-dialog__message {\r
  border-color: var(--color-meter-yellow);\r
  background: var(--color-bg-selected);\r
  color: var(--color-text-warning);\r
}\r
\r
@keyframes toast-dialog-fade {\r
  0% {\r
    opacity: 0;\r
    transform: translate(-50%, 0.75rem);\r
  }\r
\r
  12%,\r
  78% {\r
    opacity: 1;\r
    transform: translate(-50%, 0);\r
  }\r
\r
  100% {\r
    opacity: 0;\r
    transform: translate(-50%, -0.25rem);\r
  }\r
}\r
`,et="ui-toast",Bt=document.createElement("template");Bt.innerHTML=`
  <style>${Oe}</style>
  <dialog class="toast-dialog" aria-live="polite">
    <p class="toast-dialog__message"></p>
  </dialog>
`;function dt(e){return e==="success"||e==="info"||e==="warning"||e==="error"||e==="danger"?e:null}class Ne extends HTMLElement{static get observedAttributes(){return["aria-label","message","status"]}constructor(){super();const t=this.attachShadow({mode:"open"});t.append(Bt.content.cloneNode(!0)),this.dialog=t.querySelector("dialog"),this.messageElement=t.querySelector(".toast-dialog__message")}connectedCallback(){this.dataset.component=et,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get message(){return this.messageElement.textContent||""}set message(t){this.setAttribute("message",t)}get status(){return dt(this.getAttribute("status"))}set status(t){if(t){this.setAttribute("status",t);return}this.removeAttribute("status")}show(t,n){typeof t=="string"&&(this.message=t),n&&(this.status=n),this.dialog.open||this.dialog.show()}close(t){this.dialog.close(t)}syncAttributes(){const t=this.getAttribute("aria-label"),n=this.getAttribute("message")||"",r=dt(this.getAttribute("status"));t?this.dialog.setAttribute("aria-label",t):this.dialog.removeAttribute("aria-label"),this.messageElement.textContent=n,this.messageElement.id=this.id?`${this.id}Message`:"statusToastMessage",this.dialog.id=this.id||"statusToast",r?this.dialog.setAttribute("data-status",r):this.dialog.removeAttribute("data-status")}}function De(){customElements.get(et)||customElements.define(et,Ne)}const Ve='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m109-531-85-85q92-89 210-136.5T480-800q128 0 246 47.5T936-616l-85 85q-75-72-171-110.5T480-680q-104 0-200 38.5T109-531Zm169 169-84-84q59-55 132.5-84.5T480-560q80 0 153.5 29.5T766-446l-84 84q-42-38-93.5-58T480-440q-57 0-108.5 20T278-362Zm202 202q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Z"/></svg>',$e='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg>',He='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM361-353q25-18 55.5-28t63.5-10q33 0 63.5 10t55.5 28l245-245q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l245 245Z"/></svg>',Fe='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM299-415q38-28 84-43.5t97-15.5q51 0 97 15.5t84 43.5l183-183q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l183 183Z"/></svg>',Ke='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM232-482q53-38 116-59.5T480-563q69 0 132 21.5T728-482l116-116q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l116 116Z"/></svg>',Re='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q95-97 219.5-148.5T480-800q136 0 260.5 51.5T960-600L480-120Z"/></svg>',Ue='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-601q93-93 215.5-146T480-800q142 0 264.5 53T960-601l-56 57q-81-81-190-128.5T480-720q-103 0-195 32.5T117-597l419 420-56 57Zm384-40L761-262q-18 11-38 16.5t-43 5.5q-68 0-114-46t-46-114q0-68 46-114t114-46q68 0 114 46t46 114q0 23-5.5 43T818-319l102 103-56 56ZM680-320q34 0 57-23t23-57q0-34-23-57t-57-23q-34 0-57 23t-23 57q0 34 23 57t57 23ZM480-177Z"/></svg>',Ge='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70q66 0 121 33t87 87h432v240h-80v120H600v-120H488q-32 54-87 87t-121 33Zm0-80q66 0 106-40.5t48-79.5h246v120h80v-120h80v-80H434q-8-39-48-79.5T280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-80q33 0 56.5-23.5T360-480q0-33-23.5-56.5T280-560q-33 0-56.5 23.5T200-480q0 33 23.5 56.5T280-400Zm0-80Z"/></svg>',Ze='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>',We='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>',Je='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m720-80 120-120-28-28-72 72v-164h-40v164l-72-72-28 28L720-80ZM480-800 243-663l237 137 237-137-237-137ZM120-321v-318q0-22 10.5-40t29.5-29l280-161q10-5 19.5-8t20.5-3q11 0 21 3t19 8l280 161q19 11 29.5 29t10.5 40v159h-80v-116L479-434 200-596v274l240 139v92L160-252q-19-11-29.5-29T120-321ZM720 0q-83 0-141.5-58.5T520-200q0-83 58.5-141.5T720-400q83 0 141.5 58.5T920-200q0 83-58.5 141.5T720 0ZM480-491Z"/></svg>',je={"Content-Type":"application/json",Accept:"application/json"},ut=64,Ye=2e3,Xe=8,Qe=2e3,tn=8,en=3e3,nn=750,rn=20,on="/api/settings",sn=`${on}/time`,an="/api/runtime/time",ln="/api/runtime/update",cn="/api/update",dn=1e4;async function B(e,t){const n=new AbortController,r=setTimeout(()=>n.abort(),dn);let i;try{i=await fetch(e,{cache:"no-store",...t,signal:t?.signal??n.signal,headers:{...je,...t?.headers||{}}})}catch(c){throw n.signal.aborted?new Error(`Request to ${e} timed out. Check the device is still reachable.`):c}finally{clearTimeout(r)}const a=i.headers.get("content-type")||"",l=await i.text();if(!a.includes("application/json"))throw new Error(`Unexpected response for ${e}. Make sure you are connected to the device AP and loading the portal from the ESP32.`);const d=JSON.parse(l);if(!i.ok||d.success!==!0)throw new Error(d.message||"Request failed.");return d}const un=(e,t)=>B(e,t),hn=(e,t)=>B(e,t),gn=(e,t)=>B(e,t),pn=(e,t)=>B(e,t),Mt=(e,t)=>B(e,t),fn=(e,t)=>B(e,t);function x(e){const t=document.getElementById(e);if(!t)throw new Error(`Required portal element "#${e}" was not found.`);return t}function mn(){return{wifiStatusCard:x("wifiStatusCard"),wifiSettingsSheet:x("wifiSettingsSheet"),wifiSettingsCloseBtn:x("wifiSettingsCloseBtn"),wifiSettingsNotification:x("wifiSettingsNotification"),networkList:x("networkList"),passwordInput:x("password"),scanBtn:x("scanBtn"),connectBtn:x("connectBtn"),geminiCard:x("geminiCard"),geminiApiKeyInput:x("geminiApiKeyInput"),geminiClearBtn:x("geminiClearBtn"),geminiSaveBtn:x("geminiSaveBtn"),timezoneLocationCard:x("timezoneLocationCard"),timezoneSelect:x("timezoneSelect"),manualTimeInput:x("manualTimeInput"),manualDateInput:x("manualDateInput"),timezoneLocationClearBtn:x("timezoneLocationClearBtn"),timezoneLocationSaveBtn:x("timezoneLocationSaveBtn")}}function zt(e){return(t,n="info")=>{e.setNotification(t,n)}}function bn(e){return(t,n="info")=>{if(!t){e.hidden=!0,e.textContent="",e.removeAttribute("data-status"),e.setAttribute("role","status"),e.setAttribute("aria-live","polite");return}e.hidden=!1,e.textContent=t,e.setAttribute("data-status",n),n==="error"||n==="danger"?(e.setAttribute("role","alert"),e.setAttribute("aria-live","assertive")):n==="warning"?(e.setAttribute("role","alert"),e.setAttribute("aria-live","polite")):(e.setAttribute("role","status"),e.setAttribute("aria-live","polite"))}}function rt(e){e.classList.remove("error"),e.removeAttribute("invalid"),e.setAttribute("aria-invalid","false"),e.setCustomValidity?.("")}function it(e,t){e.classList.add("error"),e.setAttribute("invalid",""),e.setAttribute("aria-invalid","true"),e.setCustomValidity?.(t)}function vn(e,t){e.setAttribute("aria-checked",t?"true":"false")}function yn(e){return e.getAttribute("aria-checked")==="true"}function wn(e,t){return e.includes("class=")?e.replace("<svg",`<svg class="${t}"`):e.replace("<svg",`<svg class="${t}"`)}function xn(e){return new Promise(t=>{setTimeout(t,e)})}function Sn(){const e=document.documentElement.lang?.trim();return e||"en-US"}function Tn(e){try{return new Intl.DateTimeFormat(Sn(),{hour:"numeric",timeZone:e,timeZoneName:"longGeneric"}).formatToParts(new Date).find(r=>r.type==="timeZoneName")?.value?.trim()||""}catch(t){return console.warn(`Failed to format timezone label for "${e}".`,t),""}}function ht(e){return/^(GMT|UTC)(?:[+-]\d{1,2}(?::\d{2})?)?$/.test(e)}function An(e){return(e.split("/").pop()||e).replace(/_/g," ")}function qt(e){return e.split("/").map(t=>t.replace(/_/g," ")).join(" / ")}function kn(e){const t=e.map(i=>{const a=Tn(i.name);return{cityLabel:An(i.name),genericLabel:a,name:i.name}}),n=new Map(t.map(i=>[i.name,i])),r=new Map;return t.forEach(i=>{!i.genericLabel||ht(i.genericLabel)||r.set(i.genericLabel,(r.get(i.genericLabel)||0)+1)}),new Map(e.map(i=>{const a=n.get(i.name),l=i.description?.trim()||"";if(a?.genericLabel&&!ht(a.genericLabel)){const c=(r.get(a.genericLabel)||0)>1?`${a.genericLabel} (${a.cityLabel})`:a.genericLabel;return[i.name,c]}return l?[i.name,l]:[i.name,qt(i.name)]}))}function En(e,t){return t.get(e.name)||e.description?.trim()||qt(e.name)}function Cn(e){const t=e.value.trim();if(!t)return null;const n=/^(\d{2}):(\d{2})$/.exec(t);if(!n)return null;const r=Number.parseInt(n[1],10),i=Number.parseInt(n[2],10);return!Number.isFinite(r)||!Number.isFinite(i)||r<0||r>23||i<0||i>59?null:r*60+i}const _n=2e3,Ln=45;function In(e){let t=!1,n="";const r=(b,f="info")=>e.card.setNotification(b,f),i=()=>e.fileInput.files?.[0]??null;function a(){e.fileInput.disabled=t,e.uploadBtn.disabled=t||!i()}function l(b){n=b,e.versionText.textContent=b?`Installed version: ${b}`:"Installed version: unknown"}async function d(){const f=(await pn(ln)).runtime?.version??"";return l(f),f}function c(b){return new Promise((f,p)=>{const w=new XMLHttpRequest;w.open("POST",cn),w.setRequestHeader("Content-Type","application/octet-stream"),w.upload.onprogress=A=>{if(!A.lengthComputable)return;e.fileInput.progressMax=A.total,e.fileInput.progressValue=A.loaded;const E=Math.round(A.loaded/A.total*100);e.fileInput.progressMessageText=E<100?`Uploading… ${E}%`:"Checking and installing…"},w.onload=()=>{try{f(JSON.parse(w.responseText))}catch{p(new Error("The device sent an unexpected reply."))}},w.onerror=()=>p(new Error("The connection to the device was lost.")),w.send(b)})}async function v(b){for(let f=0;f<Ln;f+=1){await new Promise(p=>window.setTimeout(p,_n));try{const p=await d();p===b?r(`The device restarted and is still on version ${p}.`,"info"):r(`Updated to version ${p}.`,"success");return}catch{}}r("The update was installed and the device restarted. Reconnect to the device and reload this page to confirm the new version.","info")}async function y(){const b=i();if(!b||t)return;if(!b.name.toLowerCase().endsWith(".bin")){r("Choose a firmware update file ending in .bin.","error");return}t=!0,a();const f=n;e.fileInput.progressHidden=!1,e.fileInput.progressValue=0,e.fileInput.progressMessageText="Starting…",r("Uploading. Keep this page open and the device powered.","info");try{const p=await c(b);if(p.success!==!0)throw new Error(p.message||"The device rejected the update.");e.fileInput.progressMessageText="Installed. Restarting…",r("Update installed. The device is restarting…","info"),await v(f)}catch(p){e.fileInput.progressHidden=!0,r(p instanceof Error?p.message:"The update failed.","error")}finally{t=!1,a()}}function T(){e.fileInput.progressHidden=!0,e.fileInput.addEventListener("change",a),e.uploadBtn.addEventListener("click",()=>{y()}),a()}return{bind:T,refreshVersion:async()=>{try{await d()}catch(b){console.error("Firmware version check failed:",b),l("")}}}}function N(e,t,n){e.hasKey=n?.has_key===!0,e.last4=typeof n?.last4=="string"?n.last4:"",t.value=e.hasKey?e.last4?`******${e.last4}`:"******":""}function gt(e,t,n){e.hasKey=!1,e.last4="",t.value="",n("")}async function pt(e,t,n,r,i,a,l){const d=t.value.trim();if(!d){n(`${l} is required.`,"warning");return}e.isBusy=!0,n(a,"info"),r();try{const c=await i(e.settingsApi,{method:"PATCH",body:JSON.stringify({api_key:d})});N(e,t,c.settings),n(c.message||`${l} stored.`,"success")}catch(c){console.error(`${l} save failed:`,c),n(c instanceof Error?c.message:`Failed to store ${l}.`,"error")}finally{e.isBusy=!1,r()}}async function ft(e,t,n,r,i,a,l){e.isBusy=!0,n(a,"info"),r();try{const d=await i(e.resetApi,{method:"POST"});N(e,t,d.settings),n(d.message||l,"success")}catch(d){console.error(`${l} failed:`,d),n(d instanceof Error?d.message:`Failed to clear ${l}.`,"error")}finally{e.isBusy=!1,r()}}function Bn(e){const t={hasKey:!1,isBusy:!1,last4:"",resetApi:"/api/settings/gemini/reset",settingsApi:"/api/settings/gemini"},n={hasKey:!1,isBusy:!1,last4:"",resetApi:"/api/settings/openai/reset",settingsApi:"/api/settings/openai"};function r(f){const p=f?.routes;t.settingsApi=p?.settings||"/api/settings/gemini",t.resetApi=p?.reset||"/api/settings/gemini/reset"}function i(f){const p=f?.routes;n.settingsApi=p?.settings||"/api/settings/openai",n.resetApi=p?.reset||"/api/settings/openai/reset"}function a(f){N(t,e.geminiApiKeyInput,f)}function l(){gt(t,e.geminiApiKeyInput,e.notifyGemini)}function d(f){N(n,e.openAiApiKeyInput,f)}function c(){gt(n,e.openAiApiKeyInput,e.notifyOpenAi)}async function v(){if(!e.isGeminiModuleActive()||t.isBusy||t.hasKey)return;if(!e.geminiApiKeyInput.value.trim()){e.notifyGemini("Gemini API key is required.","warning");return}await pt(t,e.geminiApiKeyInput,e.notifyGemini,e.updateButtons,e.fetchGeminiModuleJson,"Saving Gemini API key...","Gemini API key")}async function y(){!e.isGeminiModuleActive()||t.isBusy||await ft(t,e.geminiApiKeyInput,e.notifyGemini,e.updateButtons,e.fetchGeminiModuleJson,"Clearing Gemini API key...","Gemini API key cleared.")}async function T(){if(!e.isOpenAiModuleActive()||n.isBusy||n.hasKey)return;if(!e.openAiApiKeyInput.value.trim()){e.notifyOpenAi("OpenAI API key is required.","warning");return}await pt(n,e.openAiApiKeyInput,e.notifyOpenAi,e.updateButtons,e.fetchOpenAiModuleJson,"Saving OpenAI API key...","OpenAI API key")}async function b(){!e.isOpenAiModuleActive()||n.isBusy||await ft(n,e.openAiApiKeyInput,e.notifyOpenAi,e.updateButtons,e.fetchOpenAiModuleJson,"Clearing OpenAI API key...","OpenAI API key cleared.")}return{applyGeminiSettings:a,applyOpenAiSettings:d,clearGeminiKey:y,clearGeminiSettings:l,clearOpenAiKey:b,clearOpenAiSettings:c,getGeminiHasKey:()=>t.hasKey,getOpenAiHasKey:()=>n.hasKey,isGeminiBusy:()=>t.isBusy,isOpenAiBusy:()=>n.isBusy,saveGeminiKey:v,saveOpenAiKey:T,updateGeminiRoutes:r,updateOpenAiRoutes:i}}function Mn(e){let t=!1,n=!1,r=!1,i=!1;async function a(){return e.fetchTimezoneListJson("/api/timezone/list")}function l(s){const h=s.settings,m=s.runtime;e.setSwitchChecked(e.clockModeToggle,!!h?.enabled),e.timezoneSelect.value=h?.timezone_name||"",e.clearFieldError(e.timezoneSelect),T(),e.manualDateInput.value=typeof m?.current_date=="string"?m.current_date:"",e.manualTimeInput.value=typeof m?.current_time=="string"?m.current_time:""}function d(s){s&&(typeof s.clock_enabled=="boolean"&&e.setSwitchChecked(e.clockModeToggle,s.clock_enabled),e.manualDateInput.value=typeof s.current_date=="string"?s.current_date:"",e.manualTimeInput.value=typeof s.current_time=="string"?s.current_time:"")}let c=[];function v(s){try{return new Intl.DateTimeFormat("en-US",{timeZone:s}).resolvedOptions().timeZone}catch{return s}}function y(){let s="";try{s=Intl.DateTimeFormat().resolvedOptions().timeZone||""}catch{return""}if(!s)return"";if(c.includes(s))return s;const h=v(s);return c.find(m=>v(m)===h)||""}function T(){const s=document.getElementById("timezoneDetectRow"),h=document.getElementById("timezoneDetectName");if(!s||!h)return;const m=y(),o=m!==""&&e.timezoneSelect.value!==m;s.style.display=o?"":"none",o&&(h.textContent=m.replace(/_/g," "))}function b(){const s=y();s&&(e.timezoneSelect.value=s,e.clearFieldError(e.timezoneSelect),T(),e.onStateChange(),e.notify("Timezone selected. Press Save to apply it.","info"))}document.getElementById("timezoneDetectBtn")?.addEventListener("click",b),e.timezoneSelect.addEventListener("change",T);async function f(){const s=e.timezoneSelect.value;e.timezoneSelect.innerHTML="";const h=document.createElement("option");h.value="",h.textContent="Select timezone",e.timezoneSelect.appendChild(h);try{const m=await a(),o=Array.isArray(m.timezones)?m.timezones:[];c=o.map(g=>g.name);const u=new Map;o.forEach(g=>{const C=g.region||"Other";let k=u.get(C);k||(k=document.createElement("optgroup"),k.label=C,u.set(C,k),e.timezoneSelect.appendChild(k));const _=document.createElement("option");_.value=g.name,_.textContent=g.description?.trim()||e.formatTimezoneLabel(g,new Map),k.appendChild(_)}),s&&(e.timezoneSelect.value=s),T()}catch(m){console.error("Timezone list fetch failed:",m),e.notify(m instanceof Error?m.message:"Failed to load timezones.","error")}}async function p(){if(!(t||n||r)){t=!0,n=!0,r=!0,e.onStateChange();try{const s=await e.fetchTimeSettingsJson(e.timeSettingsApi);l(s)}catch(s){console.error("Time settings status failed:",s),e.notify(s instanceof Error?s.message:"Time settings status failed.","error")}finally{t=!1,n=!1,r=!1,e.onStateChange()}}}async function w(){if(!(r||i)){i=!0;try{for(let s=0;s<e.clockSyncPollAttempts;s++){const h=await e.fetchTimeRuntimeJson(e.timeRuntimeApi);if(d(h.runtime),h.runtime?.time_valid===!0&&typeof h.runtime.current_time=="string"&&h.runtime.current_time.length>0)return;s<e.clockSyncPollAttempts-1&&await new Promise(m=>{setTimeout(m,e.clockSyncPollIntervalMs)})}}catch(s){console.error("Clock refresh after WiFi connect failed:",s)}finally{i=!1}}}async function A(){if(!(document.hidden||t||n||r)&&e.isSwitchChecked(e.clockModeToggle))try{const s=await e.fetchTimeRuntimeJson(e.timeRuntimeApi);d(s.runtime)}catch(s){console.error("Time runtime status failed:",s)}}function E(){const s=e.timezoneSelect.value.trim(),h=e.manualDateInput.value.trim(),m=e.manualTimeInput.value.trim(),o=e.parseClockTimeInputValue(e.wakeupTimeInput),u=e.parseClockTimeInputValue(e.bedtimeTimeInput);return!!h!=!!m?(e.notify("Provide both current date and time for a manual clock set.","error"),null):{timezoneName:s,manualDate:h,manualTime:m,wakeupMinutes:o??void 0,bedtimeMinutes:u??void 0}}async function D(s,h){return e.fetchTimeSettingsJson(e.timeSettingsApi,{method:"PATCH",body:JSON.stringify({timezone_name:s.timezoneName,enabled:h,manual_date:s.manualDate,manual_time:s.manualTime})})}async function z(){if(r||t||n){e.notifyClockMode("Clock mode update already in progress.","warning");return}const s=e.isSwitchChecked(e.clockModeToggle),h=!s,m=e.timezoneSelect.value.trim();e.setSwitchChecked(e.clockModeToggle,h),r=!0,e.notifyClockMode(h?"Enabling clock mode...":"Disabling clock mode...","info"),e.onStateChange();try{const o=await e.fetchTimeSettingsJson(e.timeSettingsApi,{method:"PATCH",body:JSON.stringify({enabled:h,timezone_name:h&&m?m:void 0})});l(o),e.notifyClockMode(o.message||(h?"Clock mode enabled.":"Clock mode disabled."),"success")}catch(o){e.setSwitchChecked(e.clockModeToggle,s),console.error("Clock mode toggle failed:",o);const u=o instanceof Error?o.message:"Failed to update clock mode.",g=u==="timezone_name required to enable clock"?"Please set timezone first.":u;u==="timezone_name required to enable clock"&&(e.setFieldError(e.timezoneSelect,"Select a timezone."),e.timezoneSelect.focus({preventScroll:!0})),e.notifyClockMode(g,"error")}finally{r=!1,e.onStateChange()}}async function q(){if(t||n||r||e.isTalkingClockModuleBusy()){e.notify("Time configuration update already in progress.","warning");return}const s=E();if(s){if(!s.timezoneName){e.setFieldError(e.timezoneSelect,"Select a timezone."),e.notify("Select a timezone.","error"),e.timezoneSelect.focus({preventScroll:!0});return}if(e.clearFieldError(e.timezoneSelect),e.isTalkingClockModuleActive()&&(s.wakeupMinutes===void 0||s.bedtimeMinutes===void 0)){e.notify("Wakeup and bedtime times are required for the talking clock module.","error"),e.focusTalkingClockTimeInput();return}t=!0,n=!0,r=!0,e.onTalkingClockBusyChange(e.isTalkingClockModuleActive()),e.notify("Saving time configuration...","info"),e.onStateChange();try{const h=await D(s,e.isSwitchChecked(e.clockModeToggle));if(l(h),e.isTalkingClockModuleActive()){const m=await e.patchTalkingClockSettings({wakeup_minutes:s.wakeupMinutes,bedtime_minutes:s.bedtimeMinutes});e.applyTalkingClockModuleSettings(m.settings)}e.notify("Time configuration saved successfully.","success")}catch(h){console.error("Timezone/location save failed:",h),e.notify(h instanceof Error?h.message:"Failed to save time configuration.","error")}finally{t=!1,n=!1,r=!1,e.onTalkingClockBusyChange(!1),e.onStateChange()}}}async function V(){if(t||n||r){e.notify("Time configuration update already in progress.","warning");return}t=!0,n=!0,r=!0,e.notify("Clearing timezone/location...","info"),e.onStateChange();try{const s=await e.fetchTimeSettingsJson(e.timeSettingsApi,{method:"PATCH",body:JSON.stringify({enabled:!1,timezone_name:""})});l(s),e.notify("Timezone/location cleared successfully.","success")}catch(s){console.error("Timezone/location clear failed:",s),e.notify(s instanceof Error?s.message:"Failed to clear timezone/location.","error")}finally{t=!1,n=!1,r=!1,e.onStateChange()}}return{applyTimeRuntimeStatus:d,applyTimeSettingsStatus:l,clearTimezoneLocation:V,fetchTimeRuntimeStatus:A,fetchTimeSettingsStatus:p,isClockBusy:()=>r,isLocationBusy:()=>n,isTimezoneBusy:()=>t,populateTimezoneOptions:f,refreshClockStatusAfterWifiConnect:w,saveTimezoneLocation:q,toggleClockModeSetting:z}}function zn(e,t){return e>=-50?t.fourBar:e>=-60?t.threeBar:e>=-70?t.twoBar:t.oneBar}function qn(e){let t=[],n="",r=!1,i="",a=!1,l=!1,d=!1,c=-1;function v(){e.wifiStatusCard.hidden=!1,e.wifiStatusCard.statusLabel=r?"Connected":"Disconnected",e.wifiStatusCard.network=r?i:""}function y(){const o=document.createElement("li");o.className="networks__list-empty-state",o.innerHTML=`${e.svgWithClass(e.wifiFindIcon,"wifi-find-icon")}<p>Scan for available networks</p>`,e.networkList.setEmptyState(o)}function T(){if(t.length===0){n="",c=-1;return}const o=t.findIndex(u=>u.ssid===n);if(o>=0){c=o;return}n="",c=-1}function b(){const o=e.networkList.getOptions();o.forEach((u,g)=>{u.setAttribute("aria-selected",String(n===t[g]?.ssid))}),c>=0&&c<o.length?e.networkList.setActiveDescendant(o[c].id):e.networkList.setActiveDescendant(null)}function f(){const o=t.find(u=>u.ssid===n);return o?!o.is_open:!0}function p(o){n=o,c=t.findIndex(u=>u.ssid===o),f()||e.clearFieldError(e.passwordInput),b(),e.onStateChange()}function w(){if(T(),e.networkList.clearItems(),t.length===0){y();return}t.forEach((o,u)=>{const g=document.createElement("li");g.className="networks__item",g.id=`network-option-${u}`,g.setAttribute("role","option"),g.setAttribute("tabindex","-1"),g.setAttribute("aria-selected",String(n===o.ssid));const C=document.createElement("span");C.className="networks__item-ssid",C.textContent=o.ssid;const k=document.createElement("div");if(k.className="networks__item-details",i===o.ssid&&r){const H=document.createElement("span");H.title="Currently connected",H.innerHTML=e.svgWithClass(e.checkIcon,"wifi-connected-icon"),k.appendChild(H)}const _=document.createElement("span");_.title=o.is_open?"Open":"Secured",o.is_open||(_.innerHTML=e.svgWithClass(e.securityIcon,"wifi-security-icon")),k.appendChild(_);const $=document.createElement("span");$.title=`Signal strength: ${o.signal_strength} (${o.rssi} dBm)`,$.innerHTML=e.svgWithClass(zn(o.rssi,e.signalIcons),"wifi-signal-icon"),k.appendChild($),g.append(C,k),g.addEventListener("click",()=>{c=u,p(o.ssid),e.networkList.focus({preventScroll:!0})}),e.networkList.appendItem(g)}),b()}function A(o){const u=r,g=i;r=o.connected===!0,i=typeof o.ssid=="string"?o.ssid:"",v(),(u!==r||g!==i)&&w(),e.onConnectionStateChange?.({wasConnected:u,previousNetwork:g,isCurrentlyConnected:r,connectedNetwork:i})}async function E(){if(!a){a=!0,e.notify("Scanning for networks...","info"),e.onStateChange();try{let o="Scanning for networks...";for(let u=0;u<e.scanPollAttempts;u++){const g=await e.fetchPortalJson("/api/scan");if(o=g.message||o,g.scan_in_progress===!0){if(e.notify(o,"info"),u<e.scanPollAttempts-1){await e.delayMs(e.scanPollIntervalMs);continue}}else{t=Array.isArray(g.networks)?g.networks:[],e.notify(o||"Scan complete.","success"),w();return}}throw new Error("Network scan timed out. Please try again.")}catch(o){console.error("Scan failed:",o),e.notify(o instanceof Error?o.message:"Scan failed. Please try again.","error"),t=[],w()}finally{a=!1,e.onStateChange()}}}async function D(){if(!l){l=!0,e.onStateChange();try{const o=await e.fetchPortalJson("/api/status");A(o),a||e.notify(o.message||"Status updated.",o.connected?"success":"info")}catch(o){console.error("Status check failed:",o),e.notify(o instanceof Error?o.message:"Status check failed.","error")}finally{l=!1,e.onStateChange()}}}async function z(){if(!(d||!n)){if(f()&&e.passwordInput.value.trim().length===0){e.setFieldError(e.passwordInput,"Please enter a WiFi password."),e.passwordInput.focus({preventScroll:!0});return}if(e.passwordInput.value.length>ut){e.setFieldError(e.passwordInput,`WiFi password must be ${ut} characters or fewer.`),e.passwordInput.focus({preventScroll:!0});return}e.clearFieldError(e.passwordInput),d=!0,e.notify(`Connecting to ${n}...`,"info"),e.onStateChange();try{const o=await e.fetchPortalJson("/api/configure",{method:"POST",body:JSON.stringify({ssid:n,password:e.passwordInput.value})});e.notify(o.message||"Connection request sent.","info");for(let u=0;u<e.statusPollAttempts;u++){await e.delayMs(e.statusPollIntervalMs);const g=await e.fetchPortalJson("/api/status");if(A(g),g.connected){e.notify(g.message||"Connected.","success");break}}r||e.notify("Connection in progress...","info")}catch(o){console.error("Connection failed:",o),e.notify(o instanceof Error?o.message:"Connection failed.","error")}finally{d=!1,e.onStateChange()}}}async function q(){if(!(d||l||!r)){l=!0,e.notify("Disconnecting...","info"),e.onStateChange();try{const o=await e.fetchPortalJson("/api/disconnect",{method:"POST"}),u=r,g=i;r=!1,i="",v(),w(),e.notify(o.message||"Disconnected.","success"),e.onConnectionStateChange?.({wasConnected:u,previousNetwork:g,isCurrentlyConnected:r,connectedNetwork:i})}catch(o){console.error("Disconnect failed:",o),e.notify(o instanceof Error?o.message:"Disconnect failed.","error")}finally{l=!1,e.onStateChange()}}}function V(){if(m()){q();return}if(d||l){e.notify("WiFi status is busy. Please wait.","warning");return}if(!n){e.notify("Select a WiFi network first.","error"),e.networkList.focus({preventScroll:!0});return}if(f()&&e.passwordInput.value.trim().length===0){e.setFieldError(e.passwordInput,"Please enter a WiFi password."),e.notify("Please check if your password is correct.","error"),e.passwordInput.focus({preventScroll:!0});return}e.clearFieldError(e.passwordInput),z()}function s(){e.passwordInput.value?.trim().length&&e.clearFieldError(e.passwordInput),e.onStateChange()}function h(o){if(t.length!==0)switch(T(),o.key){case"Tab":break;case"ArrowDown":{o.preventDefault();const u=c<t.length-1?c+1:0;c=u,p(t[u].ssid),e.networkList.scrollOptionIntoView(u);break}case"ArrowUp":{o.preventDefault();const u=c>0?c-1:t.length-1;c=u,p(t[u].ssid),e.networkList.scrollOptionIntoView(u);break}case"Home":{o.preventDefault(),c=0,p(t[0].ssid),e.networkList.scrollOptionIntoView(0);break}case"End":{o.preventDefault();const u=t.length-1;c=u,p(t[u].ssid),e.networkList.scrollOptionIntoView(u);break}case"Enter":case" ":{o.preventDefault(),c>=0&&c<t.length&&p(t[c].ssid);break}}}function m(){return r&&i.length>0&&n===i}return{applyPortalStatus:A,checkStatus:D,connect:z,disconnect:q,getConnectedNetwork:()=>i,getSelectedNetwork:()=>n,handleConnectAction:V,handleListboxKeyDown:h,handlePasswordInput:s,isCheckingStatus:()=>l,isConnecting:()=>d,isCurrentlyConnected:()=>r,isScanning:()=>a,isSelectedConnected:m,renderNetworkList:w,requiresPassword:f,scanNetworks:E,updateWifiStatusCard:v}}function P(e,t){t().finally(()=>{!e.disabled&&e.offsetParent!==null&&setTimeout(()=>{!e.disabled&&e.offsetParent!==null&&e.focus()},0)})}function Pn(e){const{controllers:t,dom:n,helpers:r}=e;function i(){n.wifiSettingsSheet.openBottomSheet(),t.wifiController.scanNetworks()}n.scanBtn.addEventListener("click",()=>{t.wifiController.scanNetworks()}),n.connectBtn.addEventListener("click",()=>{t.wifiController.handleConnectAction()}),n.wifiStatusCard.addEventListener("action",()=>{if(t.wifiController.isCurrentlyConnected()){t.wifiController.disconnect();return}i()}),n.wifiStatusCard.addEventListener("settings",()=>{i()}),n.wifiSettingsCloseBtn.addEventListener("click",()=>{n.wifiSettingsSheet.closeBottomSheet()}),n.passwordInput.addEventListener("input",()=>{t.wifiController.handlePasswordInput()}),n.networkList.addEventListener("keydown",a=>{t.wifiController.handleListboxKeyDown(a)}),n.geminiSaveBtn.addEventListener("click",()=>{P(n.geminiSaveBtn,()=>t.geminiController.saveGeminiKey())}),n.geminiClearBtn.addEventListener("click",()=>{P(n.geminiClearBtn,()=>t.geminiController.clearGeminiKey())}),n.geminiApiKeyInput.addEventListener("input",r.updateUi),n.timezoneLocationSaveBtn.addEventListener("click",()=>{if(!n.timezoneSelect.value.trim()){r.setFieldError(n.timezoneSelect,"Select a timezone."),r.setTimezoneLocationNotification("Select a timezone.","error"),n.timezoneSelect.focus({preventScroll:!0});return}r.clearFieldError(n.timezoneSelect),P(n.timezoneLocationSaveBtn,()=>t.timeController.saveTimezoneLocation())}),n.timezoneLocationClearBtn.addEventListener("click",()=>{P(n.timezoneLocationClearBtn,()=>t.timeController.clearTimezoneLocation())}),n.timezoneSelect.addEventListener("change",()=>{n.timezoneSelect.value?.trim().length&&r.clearFieldError(n.timezoneSelect),r.updateUi()}),n.manualDateInput.addEventListener("input",r.updateUi),n.manualTimeInput.addEventListener("input",r.updateUi)}function On(e){const{controllers:t,dom:n}=e,r=t.wifiController.isScanning()||t.wifiController.isConnecting()||t.wifiController.isCheckingStatus(),i=t.wifiController.isSelectedConnected(),a=t.wifiController.getSelectedNetwork().trim(),l=a.length>0&&!i&&t.wifiController.requiresPassword(),d=i||a.length>0&&(!l||n.passwordInput.value.trim().length>0);n.scanBtn.disabled=r,n.connectBtn.disabled=r||!d,n.wifiStatusCard.actionDisabled=r,n.passwordInput.disabled=t.wifiController.isConnecting(),t.wifiController.isConnecting()?(n.connectBtn.textContent="Connecting...",n.wifiStatusCard.actionLabel="Connecting..."):i?(n.connectBtn.textContent="Disconnect",n.wifiStatusCard.actionLabel="Disconnect"):(n.connectBtn.textContent="Connect",n.wifiStatusCard.actionLabel=t.wifiController.isCurrentlyConnected()?"Disconnect":"Connect");const c=t.timeController.isTimezoneBusy()||t.timeController.isLocationBusy()||t.timeController.isClockBusy();n.timezoneSelect.disabled=c,n.manualDateInput.disabled=c,n.manualTimeInput.disabled=c,n.timezoneLocationSaveBtn.disabled=c||n.timezoneSelect.value.trim().length===0,n.timezoneLocationClearBtn.disabled=c||n.timezoneSelect.value.trim().length===0;const v=t.geminiController.isGeminiBusy(),y=t.geminiController.getGeminiHasKey();n.geminiApiKeyInput.readOnly=y||v,n.geminiApiKeyInput.disabled=v,n.geminiSaveBtn.disabled=v||y||n.geminiApiKeyInput.value.trim().length===0,n.geminiSaveBtn.hidden=y,n.geminiClearBtn.disabled=v||!y,n.geminiClearBtn.hidden=!y}Qt();Wt();re();le();ue();ye();Se();Ee();Me();De();let nt=null;const S=mn(),Pt=bn(S.wifiSettingsNotification),Nn=zt(S.geminiCard),Ot=zt(S.timezoneLocationCard),Nt=()=>document.createElement("input"),Dn=document.createElement("button"),Vn=Nt(),$n=Nt(),Hn=document.createElement("input");function L(){On({controllers:{geminiController:ot,timeController:I,wifiController:M},dom:S})}const ot=Bn({fetchGeminiModuleJson:Mt,fetchOpenAiModuleJson:()=>Promise.resolve({}),geminiApiKeyInput:S.geminiApiKeyInput,isGeminiModuleActive:()=>!0,isOpenAiModuleActive:()=>!1,notifyGemini:Nn,notifyOpenAi:()=>{},openAiApiKeyInput:Hn,updateButtons:L}),I=Mn({applyTalkingClockModuleSettings:()=>{},bedtimeTimeInput:$n,clearFieldError:rt,clockModeToggle:Dn,clockSyncPollAttempts:tn,clockSyncPollIntervalMs:Qe,fetchTimeRuntimeJson:gn,fetchTimeSettingsJson:hn,fetchTimezoneListJson:fn,focusTalkingClockTimeInput:()=>{},buildTimezoneLabelMap:kn,formatTimezoneLabel:En,isSwitchChecked:yn,isTalkingClockModuleActive:()=>!1,isTalkingClockModuleBusy:()=>!1,manualDateInput:S.manualDateInput,manualTimeInput:S.manualTimeInput,notifyClockMode:()=>{},notify:Ot,onStateChange:L,onTalkingClockBusyChange:()=>{},parseClockTimeInputValue:Cn,patchTalkingClockSettings:()=>Promise.resolve({success:!0}),setFieldError:it,setSwitchChecked:vn,timeRuntimeApi:an,timeSettingsApi:sn,timezoneSelect:S.timezoneSelect,wakeupTimeInput:Vn}),M=qn({checkIcon:Ze,clearFieldError:rt,delayMs:xn,fetchPortalJson:un,networkList:S.networkList,notify:Pt,onConnectionStateChange:({wasConnected:e,isCurrentlyConnected:t})=>{!e&&t&&I.refreshClockStatusAfterWifiConnect()},onStateChange:L,passwordInput:S.passwordInput,scanPollAttempts:rn,scanPollIntervalMs:nn,securityIcon:$e,setFieldError:it,signalIcons:{oneBar:He,twoBar:Fe,threeBar:Ke,fourBar:Re},statusPollAttempts:Xe,statusPollIntervalMs:Ye,svgWithClass:wn,wifiFindIcon:Ue,wifiStatusCard:S.wifiStatusCard}),Dt=document.getElementById("firmwareUpdateCard"),Vt=In({card:Dt,fileInput:document.getElementById("firmwareFileInput"),uploadBtn:document.getElementById("firmwareUploadBtn"),versionText:document.getElementById("firmwareVersionText")});function O(){if(!nt)return;const e=document.documentElement,t=e.scrollHeight>window.innerHeight+1,n=window.scrollY+window.innerHeight>=e.scrollHeight-1;nt.setVisible(t&&!n)}function Fn(){S.wifiStatusCard.iconSvg=Ve,S.geminiCard.iconSvg=Ge,S.timezoneLocationCard.iconSvg=We,Dt.iconSvg=Je,Vt.bind(),M.renderNetworkList(),document.body&&(nt=Kt({mount:document.body,mode:"fixed",position:"bottom",height:"6rem",width:"100vw",strength:1.8,divCount:5,curve:"bezier",exponential:!0,opacity:1,zIndex:20,className:"page-gradual-blur",fallbackColor:"var(--color-bg-selected)"}),O(),window.addEventListener("scroll",O,{passive:!0}),window.addEventListener("resize",O),typeof ResizeObserver<"u"&&new ResizeObserver(()=>{O()}).observe(document.body)),L(),M.updateWifiStatusCard(),Pt(""),Pn({controllers:{geminiController:ot,timeController:I,wifiController:M},dom:S,helpers:{clearFieldError:rt,setFieldError:it,setTimezoneLocationNotification:Ot,updateUi:L}}),Kn(),window.setInterval(()=>{I.fetchTimeRuntimeStatus()},en)}async function Kn(){await Promise.allSettled([I.populateTimezoneOptions(),I.fetchTimeSettingsStatus(),M.checkStatus(),Rn(),Vt.refreshVersion()])}async function Rn(){try{const e=await Mt("/api/settings/gemini");ot.applyGeminiSettings(e.settings)}catch(e){console.error("Gemini settings status failed:",e)}finally{L()}}Fn();
