(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();const Xt={mode:"absolute",position:"bottom",height:"6rem",strength:2,divCount:5,exponential:!1,opacity:1,curve:"linear",zIndex:2},at={linear:t=>t,bezier:t=>t*t*(3-2*t),"ease-in":t=>t*t,"ease-out":t=>1-Math.pow(1-t,2),"ease-in-out":t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2};function Qt(t){switch(t){case"top":return"to top";case"left":return"to left";case"right":return"to right";default:return"to bottom"}}function te(){if(typeof CSS>"u"||typeof CSS.supports!="function")return!1;const t=CSS.supports("backdrop-filter","blur(1px)")||CSS.supports("-webkit-backdrop-filter","blur(1px)"),e=CSS.supports("mask-image","linear-gradient(to bottom, transparent, black)")||CSS.supports("-webkit-mask-image","linear-gradient(to bottom, transparent, black)");return t&&e}function ee(t){const e={...Xt,...t},n=document.createElement("div"),i=document.createElement("div"),r=Qt(e.position),s=te(),l=e.position==="top"||e.position==="bottom";if(n.className="gradual-blur",e.className&&n.classList.add(e.className),s||(n.classList.add("gradual-blur--fallback"),n.style.background=`linear-gradient(${r}, transparent 0%, ${e.fallbackColor||"rgba(255, 255, 255, 0.95)"} 100%)`),n.style.position=e.mode,n.style.pointerEvents="none",n.style.zIndex=String(e.zIndex),n.style.opacity="0",n.style.borderRadius="inherit",l?(n.style.height=e.height,n.style.width=e.width||"100%",n.style[e.position]="0",e.mode==="fixed"?(n.style.left="50%",n.style.right="auto",n.style.transform="translateX(-50%)"):(n.style.left="0",n.style.right="0")):(n.style.width=e.width||e.height,n.style.height="100%",n.style.top="0",n.style.bottom="0",n.style[e.position]="0"),i.className="gradual-blur__inner",n.appendChild(i),s){const o=100/e.divCount,h=at[e.curve]||at.linear;for(let b=1;b<=e.divCount;b+=1){const v=document.createElement("div"),m=h(b/e.divCount);let g=0;e.exponential?g=Math.pow(2,m*4)*.0625*e.strength:g=.0625*(m*e.divCount+1)*e.strength;const u=Math.round((o*b-o)*10)/10,c=Math.round(o*b*10)/10,p=Math.round((o*b+o)*10)/10,w=Math.round((o*b+o*2)*10)/10;let T=`transparent ${u}%, black ${c}%`;p<=100&&(T+=`, black ${p}%`),w<=100&&(T+=`, transparent ${w}%`),v.className="gradual-blur__layer",v.style.maskImage=`linear-gradient(${r}, ${T})`,v.style.webkitMaskImage=`linear-gradient(${r}, ${T})`,v.style.backdropFilter=`blur(${g.toFixed(3)}rem)`,v.style.setProperty("-webkit-backdrop-filter",`blur(${g.toFixed(3)}rem)`),v.style.opacity=String(e.opacity),i.appendChild(v)}}return window.getComputedStyle(e.mount).position==="static"&&(e.mount.style.position="relative"),e.mount.appendChild(n),{element:n,setVisible(o){n.style.opacity=o?"1":"0"},destroy(){n.remove()}}}const ne=`:host {\r
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
`,re=document.createElement("template");re.innerHTML=`
  <style>${ne}</style>
  <span class="badge">
    <slot></slot>
  </span>
`;const ie=`:host {\r
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
`,Z="ui-button",xt=document.createElement("template");xt.innerHTML=`
  <style>${ie}</style>
  <button type="button" part="button">
    <slot></slot>
  </button>
`;function lt(t){return t==="submit"||t==="reset"?t:"button"}class oe extends HTMLElement{static get observedAttributes(){return["disabled","aria-label","type"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(xt.content.cloneNode(!0)),this.button=e.querySelector("button")}connectedCallback(){this.dataset.component=Z,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return lt(this.getAttribute("type"))}set type(e){this.setAttribute("type",lt(e))}focus(e){this.button.focus(e)}click(){this.button.click()}syncAttributes(){this.button.disabled=this.disabled,this.button.type=this.type,this.tabIndex=this.disabled?-1:0;const e=this.getAttribute("aria-label");e?this.button.setAttribute("aria-label",e):this.button.removeAttribute("aria-label")}}function se(){customElements.get(Z)||customElements.define(Z,oe)}const ae=`:host {\r
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
`,G="ui-bottom-sheet",Tt=document.createElement("template"),le=["a[href]","button:not([disabled])","details summary","input:not([disabled])","select:not([disabled])","textarea:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(", ");let U=0;Tt.innerHTML=`
  <style>${ae}</style>
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
`;function ct(t){const e=getComputedStyle(t);return t.hasAttribute("hidden")||t.getAttribute("aria-hidden")==="true"||e.display==="none"||e.visibility==="hidden"?!1:t.tagName.includes("-")?e.display==="contents"||!!t.getClientRects().length:t.offsetParent!==null||e.position==="fixed"||!!t.getClientRects().length}function R(t){if(!t.shadowRoot)return[];const e=[],n=new Set;function i(r){if(r instanceof HTMLSlotElement){const s=r.assignedElements({flatten:!0});s.length>0?s.forEach(i):Array.from(r.children).forEach(i);return}if(r instanceof HTMLElement&&ct(r)){if(r.shadowRoot){Array.from(r.shadowRoot.childNodes).forEach(i);return}!n.has(r)&&r.matches(le)&&ct(r)&&(n.add(r),e.push(r)),Array.from(r.children).forEach(i)}}return Array.from(t.shadowRoot.childNodes).forEach(i),e}function ce(t,e){if(e===t||e.contains(t))return!0;let n=t;for(;n;){if(n===e)return!0;const i=n.getRootNode();if(!(i instanceof ShadowRoot))break;n=i.host}return!1}function K(t){return t.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?e.textContent?.trim().length:e.nodeType===Node.ELEMENT_NODE)}class de extends HTMLElement{constructor(){super(),this.isAnimatingClose=!1,this.isSyncingOpenAttribute=!1,this.previousDocumentOverflow="",this.previousBodyOverflow="",this.triggerElement=null;const e=this.attachShadow({mode:"open"});e.append(Tt.content.cloneNode(!0)),this.dialog=e.querySelector(".bottom-sheet-dialog"),this.titleElement=e.querySelector(".bottom-sheet-title"),this.descriptionElement=e.querySelector(".bottom-sheet-description"),this.headerActionsContainer=e.querySelector(".bottom-sheet-header-actions"),this.footerContainer=e.querySelector(".bottom-sheet-footer"),this.floatingContainer=e.querySelector(".bottom-sheet-floating"),this.headerActionsSlot=e.querySelector('slot[name="header-actions"]'),this.footerSlot=e.querySelector('slot[name="footer"]'),this.floatingSlot=e.querySelector('slot[name="floating-content"]'),U+=1,this.titleId=`bottomSheetTitle${U}`,this.descriptionId=`bottomSheetDescription${U}`,this.handleAnimationEndBound=this.handleAnimationEnd.bind(this),this.handleCancelBound=this.handleCancel.bind(this),this.handleClickBound=this.handleClick.bind(this),this.handleKeyDownBound=this.handleKeyDown.bind(this),this.handleSlotChangeBound=this.syncSlotVisibility.bind(this)}static get observedAttributes(){return["description","open","title"]}connectedCallback(){this.dataset.component=G,this.dialog.addEventListener("animationend",this.handleAnimationEndBound),this.dialog.addEventListener("cancel",this.handleCancelBound),this.dialog.addEventListener("click",this.handleClickBound),this.dialog.addEventListener("keydown",this.handleKeyDownBound),this.addEventListener("keydown",this.handleKeyDownBound),this.headerActionsSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.footerSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.floatingSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.syncAttributes(),this.syncSlotVisibility(),this.hasAttribute("open")&&this.openInternal()}disconnectedCallback(){this.dialog.removeEventListener("animationend",this.handleAnimationEndBound),this.dialog.removeEventListener("cancel",this.handleCancelBound),this.dialog.removeEventListener("click",this.handleClickBound),this.dialog.removeEventListener("keydown",this.handleKeyDownBound),this.removeEventListener("keydown",this.handleKeyDownBound),this.headerActionsSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.footerSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.floatingSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.dialog.open&&this.dialog.close(),this.unlockDocumentScroll()}attributeChangedCallback(e){if(e==="open"){if(!this.isConnected||this.isSyncingOpenAttribute)return;this.hasAttribute("open")?this.openInternal():this.startClosing();return}this.syncAttributes()}get open(){return this.hasAttribute("open")}set open(e){this.toggleAttribute("open",e)}openBottomSheet(){this.open&&!this.isAnimatingClose||(this.triggerElement=document.activeElement instanceof HTMLElement?document.activeElement:null,this.open=!0)}closeBottomSheet(){!this.open&&!this.dialog.open||(this.open=!1)}focus(e){(R(this)[0]??this.dialog).focus(e)}syncAttributes(){const e=this.getAttribute("title")||"",n=this.getAttribute("description")||"";this.titleElement.id=this.titleId,this.titleElement.textContent=e,this.titleElement.hidden=e.length===0,this.descriptionElement.id=this.descriptionId,this.descriptionElement.textContent=n,this.descriptionElement.hidden=n.length===0,e.length>0?this.dialog.setAttribute("aria-labelledby",this.titleId):this.dialog.removeAttribute("aria-labelledby"),n.length>0?this.dialog.setAttribute("aria-describedby",this.descriptionId):this.dialog.removeAttribute("aria-describedby")}syncSlotVisibility(){this.headerActionsContainer.hidden=!K(this.headerActionsSlot),this.footerContainer.hidden=!K(this.footerSlot),this.floatingContainer.hidden=!K(this.floatingSlot)}handleAnimationEnd(e){!this.isAnimatingClose||e.target!==this.dialog||(this.dialog.classList.remove("closing"),this.dialog.close(),this.isAnimatingClose=!1,this.unlockDocumentScroll(),this.restoreTriggerFocus(),this.dispatchEvent(new Event("close",{bubbles:!0,composed:!0})))}handleCancel(e){e.preventDefault(),this.closeBottomSheet()}handleClick(e){this.isAnimatingClose||e.target===this.dialog&&this.closeBottomSheet()}handleKeyDown(e){if(e.currentTarget===this&&e.composedPath().includes(this.dialog))return;if(e.key==="Escape"){e.preventDefault(),this.closeBottomSheet();return}if(e.key!=="Tab")return;const n=R(this);if(n.length===0){e.preventDefault(),this.dialog.focus();return}const i=e.composedPath()[0],r=i instanceof HTMLElement?i:document.activeElement instanceof HTMLElement?document.activeElement:null,s=r===null?-1:n.findIndex(b=>ce(r,b)),l=e.shiftKey?-1:1,o=e.shiftKey?n.length-1:0,h=s===-1?o:(s+l+n.length)%n.length;e.preventDefault(),n[h].focus()}openInternal(){this.syncAttributes(),this.syncSlotVisibility(),this.isAnimatingClose&&(this.dialog.classList.remove("closing"),this.isAnimatingClose=!1),this.dialog.open?this.lockDocumentScroll():(this.lockDocumentScroll(),this.dialog.showModal()),requestAnimationFrame(()=>{if(!this.dialog.open)return;(R(this)[0]??this.dialog).focus()})}startClosing(){!this.dialog.open||this.isAnimatingClose||(this.dialog.classList.add("closing"),this.isAnimatingClose=!0)}lockDocumentScroll(){this.previousDocumentOverflow.length===0&&this.previousBodyOverflow.length===0&&(this.previousDocumentOverflow=document.documentElement.style.overflow,this.previousBodyOverflow=document.body.style.overflow),document.documentElement.style.overflow="hidden",document.body.style.overflow="hidden"}unlockDocumentScroll(){document.documentElement.style.overflow=this.previousDocumentOverflow,document.body.style.overflow=this.previousBodyOverflow,this.previousDocumentOverflow="",this.previousBodyOverflow=""}restoreTriggerFocus(){this.triggerElement&&document.contains(this.triggerElement)&&this.triggerElement.focus(),this.triggerElement=null}}function ue(){customElements.get(G)||customElements.define(G,de)}const he=`:host {\r
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
`,W="ui-card",St=document.createElement("template");St.innerHTML=`
  <style>${he}</style>
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
`;function ge(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}class fe extends HTMLElement{static get observedAttributes(){return["title"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append(St.content.cloneNode(!0)),this.footerContainer=e.querySelector(".card-component__footer"),this.footerSlot=e.querySelector('slot[name="footer"]'),this.footerSlot.addEventListener("slotchange",()=>{this.syncFooterVisibility()}),this.iconElement=e.querySelector(".card-component__icon"),this.notificationElement=e.querySelector(".connection-notification"),this.titleElement=e.querySelector(".card-component__title")}connectedCallback(){this.dataset.component=W,this.syncAttributes(),this.syncFooterVisibility()}attributeChangedCallback(){this.syncAttributes()}get iconSvg(){return this.iconElement.innerHTML}set iconSvg(e){this.iconElement.innerHTML=e?ge(e,"card-component__icon"):""}setNotification(e,n="info"){if(!e){this.notificationElement.hidden=!0,this.notificationElement.textContent="",this.notificationElement.removeAttribute("data-status"),this.notificationElement.setAttribute("role","status"),this.notificationElement.setAttribute("aria-live","polite");return}this.notificationElement.hidden=!1,this.notificationElement.textContent=e,this.notificationElement.setAttribute("data-status",n),n==="error"||n==="danger"?(this.notificationElement.setAttribute("role","alert"),this.notificationElement.setAttribute("aria-live","assertive")):n==="warning"?(this.notificationElement.setAttribute("role","alert"),this.notificationElement.setAttribute("aria-live","polite")):(this.notificationElement.setAttribute("role","status"),this.notificationElement.setAttribute("aria-live","polite"))}syncAttributes(){this.titleElement.textContent=this.getAttribute("title")||""}syncFooterVisibility(){const e=this.footerSlot.assignedElements({flatten:!0}).length>0;this.footerContainer.hidden=!e}}function pe(){customElements.get(W)||customElements.define(W,fe)}const me=`:host {\r
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
`,be=document.createElement("template");be.innerHTML=`
  <style>${me}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper duration-fields">
      <ui-input variant="number" inputmode="numeric"></ui-input>
      <ui-input variant="number" inputmode="numeric"></ui-input>
    </div>
  </div>
`;const ve=`:host {\r
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
`,J="ui-file-upload",Et=document.createElement("template");Et.innerHTML=`
  <style>${ve}</style>
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
`;class ye extends HTMLElement{static get observedAttributes(){return["accept","aria-label","disabled","label","multiple","name","progress-max","progress-message","progress-value","warning-text"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Et.content.cloneNode(!0)),this.helperText=e.querySelector(".form-helper-text"),this.input=e.querySelector("input"),this.labelElement=e.querySelector("label"),this.progressBar=e.querySelector("progress"),this.progressContainer=e.querySelector(".progress-bar"),this.progressMessage=e.querySelector(".progress-bar__message"),this.input.addEventListener("change",n=>{n.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.input.addEventListener("input",n=>{n.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))})}connectedCallback(){this.dataset.component=J,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get accept(){return this.input.accept}set accept(e){this.setAttribute("accept",e)}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get files(){return this.input.files}get progressHidden(){return this.progressContainer.hidden}set progressHidden(e){this.progressContainer.hidden=e}get progressMax(){return this.progressBar.max}set progressMax(e){this.progressBar.max=e}get progressMessageText(){return this.progressMessage.textContent||""}set progressMessageText(e){this.progressMessage.textContent=e}get progressValue(){return this.progressBar.value}set progressValue(e){this.progressBar.value=e}get value(){return this.input.value}get warningText(){return this.helperText.textContent||""}set warningText(e){this.helperText.textContent=e}focus(e){this.input.focus(e)}syncAttributes(){const e=this.id||"file-upload",n=this.getAttribute("label")||"",i=this.getAttribute("warning-text")||"";this.input.id=e,this.input.accept=this.getAttribute("accept")||"",this.input.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.input.multiple=this.hasAttribute("multiple"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("name"),this.hasAttribute("progress-max")&&(this.progressBar.max=Number(this.getAttribute("progress-max"))||100),this.hasAttribute("progress-value")&&(this.progressBar.value=Number(this.getAttribute("progress-value"))||0),this.hasAttribute("progress-message")&&(this.progressMessage.textContent=this.getAttribute("progress-message")||""),this.labelElement.htmlFor=e,this.labelElement.textContent=n,this.labelElement.hidden=n.length===0,this.helperText.textContent=i,this.helperText.hidden=i.length===0}syncStringAttribute(e){const n=this.getAttribute(e);if(n===null){this.input.removeAttribute(e);return}this.input.setAttribute(e,n)}}function we(){customElements.get(J)||customElements.define(J,ye)}const xe=`:host {\r
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
`,j="ui-icon-button",At=document.createElement("template");At.innerHTML=`
  <style>${xe}</style>
  <button type="button" part="button">
    <slot></slot>
  </button>
`;function dt(t){return t==="submit"||t==="reset"?t:"button"}class Te extends HTMLElement{static get observedAttributes(){return["disabled","aria-label","type"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(At.content.cloneNode(!0)),this.button=e.querySelector("button")}connectedCallback(){this.dataset.component=j,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return dt(this.getAttribute("type"))}set type(e){this.setAttribute("type",dt(e))}focus(e){this.button.focus(e)}click(){this.button.click()}syncAttributes(){this.button.disabled=this.disabled,this.button.type=this.type,this.tabIndex=this.disabled?-1:0;const e=this.getAttribute("aria-label");e?this.button.setAttribute("aria-label",e):this.button.removeAttribute("aria-label")}}function Se(){customElements.get(j)||customElements.define(j,Te)}const Ee='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>',Ae='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>',ke=`:host {\r
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
`,Y="ui-input",kt=document.createElement("template");kt.innerHTML=`
  <style>${ke}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <input />
      <span class="duration-fields__unit"></span>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;function Ce(t){return t==="number"||t==="password"||t==="time"||t==="date"?t:"text"}function _e(t){return t==="password"||t==="number"||t==="time"||t==="date"?t:"text"}class Le extends HTMLElement{constructor(){super(),this.isPasswordVisible=!1,this.customValidationMessage="";const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(kt.content.cloneNode(!0)),this.input=e.querySelector("input"),this.helperText=e.querySelector(".form-helper-text"),this.label=e.querySelector("label"),this.suffix=e.querySelector(".duration-fields__unit"),this.toggleButton=document.createElement("button"),this.wrapper=e.querySelector(".form-control__input-wrapper"),this.toggleButton.className="password-toggle-btn",this.toggleButton.type="button",this.input.addEventListener("input",n=>{this.syncValidationState(),n.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}),this.input.addEventListener("change",n=>{this.syncValidationState(),n.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.input.addEventListener("invalid",()=>{this.syncValidationState()}),this.toggleButton.addEventListener("click",()=>{this.togglePasswordVisibility()})}static get observedAttributes(){return["aria-label","aria-invalid","autocomplete","disabled","helper-text","invalid","inputmode","label","max","maxlength","min","name","placeholder","readonly","required","step","suffix","type","value","variant"]}connectedCallback(){this.hasAttribute("variant")||this.setAttribute("variant","text"),this.dataset.component=Y,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return this.input.type}set type(e){this.setAttribute("type",e)}get value(){return this.input.value}set value(e){this.input.value=e,this.syncValidationState()}focus(e){this.input.focus(e)}select(){this.input.select()}get validationMessage(){return this.input.validationMessage}get validity(){return this.input.validity}get willValidate(){return this.input.willValidate}checkValidity(){const e=this.input.checkValidity();return this.syncValidationState(),e}reportValidity(){const e=this.input.reportValidity();return this.syncValidationState(),e}setCustomValidity(e){this.customValidationMessage=e,this.input.setCustomValidity(e),this.syncValidationState()}syncAttributes(){const e=Ce(this.getAttribute("variant")),n=this.getAttribute("helper-text")||"",i=this.id?`${this.id}Input`:"input",r=this.getAttribute("label")||"",s=this.getAttribute("suffix")||"",l=e==="password"?this.isPasswordVisible?"text":"password":this.getAttribute("type")||_e(e);if(this.input.id=i,this.input.type=l,this.input.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.input.readOnly=this.hasAttribute("readonly"),this.input.required=this.hasAttribute("required"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("autocomplete"),this.syncStringAttribute("inputmode"),this.syncStringAttribute("max"),this.syncStringAttribute("maxlength"),this.syncStringAttribute("min"),this.syncStringAttribute("name"),this.syncStringAttribute("placeholder"),this.syncStringAttribute("step"),this.hasAttribute("value")&&this.input.value!==this.getAttribute("value")&&(this.input.value=this.getAttribute("value")||""),this.input.setCustomValidity(this.customValidationMessage),this.label.htmlFor=i,this.label.textContent=r,this.label.hidden=r.length===0,this.helperText.textContent=n,this.helperText.hidden=n.length===0,this.wrapper.classList.toggle("duration-fields",e==="number"),this.suffix.textContent=s,this.suffix.hidden=e!=="number"||s.length===0,n.length>0){const o=`${i}HelperText`;this.helperText.id=o,this.input.setAttribute("aria-describedby",o)}else this.helperText.removeAttribute("id"),this.input.removeAttribute("aria-describedby");e==="password"?(this.toggleButton.isConnected||this.wrapper.append(this.toggleButton),this.toggleButton.disabled=this.disabled,this.toggleButton.setAttribute("aria-label",this.isPasswordVisible?"Hide password":"Show password"),this.toggleButton.innerHTML=Ie(this.isPasswordVisible?Ee:Ae,"password-icon")):(this.isPasswordVisible=!1,this.toggleButton.remove()),this.syncValidationState()}syncStringAttribute(e){const n=this.getAttribute(e);if(n===null){this.input.removeAttribute(e);return}this.input.setAttribute(e,n)}togglePasswordVisibility(){this.isPasswordVisible=!this.isPasswordVisible,this.syncAttributes()}syncValidationState(){const e=this.hasAttribute("invalid")||this.getAttribute("aria-invalid")==="true"||!this.input.validity.valid;this.classList.toggle("error",e),this.input.classList.toggle("error",e),this.hasAttribute("invalid")!==e&&this.toggleAttribute("invalid",e),this.getAttribute("aria-invalid")!==String(e)&&this.setAttribute("aria-invalid",String(e)),this.input.getAttribute("aria-invalid")!==String(e)&&this.input.setAttribute("aria-invalid",String(e))}}function Ie(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}function Be(){customElements.get(Y)||customElements.define(Y,Le)}const Me=`:host {\r
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
`,X="ui-network-list",Ct="networkList",Q="network-list-label",_t=document.createElement("template");_t.innerHTML=`
  <style>${Me}</style>
  <div class="networks">
    <span id="${Q}" hidden>Available networks</span>
    <ul
      id="${Ct}"
      class="networks__list"
      role="listbox"
      aria-labelledby="${Q}"
      tabindex="0"
    ></ul>
  </div>
`;class qe extends HTMLElement{static get observedAttributes(){return["aria-label","label"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(_t.content.cloneNode(!0)),this.labelElement=e.querySelector(`#${Q}`),this.listElement=e.querySelector(`#${Ct}`),this.listElement.addEventListener("keydown",n=>{(n.key==="ArrowDown"||n.key==="ArrowUp"||n.key==="Home"||n.key==="End"||n.key===" ")&&n.preventDefault()})}connectedCallback(){this.tabIndex=0,this.dataset.component=X,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}appendItem(e){this.listElement.appendChild(e)}clearItems(){this.listElement.innerHTML=""}focus(e){this.listElement.focus(e)}getOptions(){return Array.from(this.listElement.querySelectorAll('[role="option"]'))}scrollOptionIntoView(e){const n=this.getOptions()[e];if(!n)return;const i=this.listElement.scrollTop,r=i+this.listElement.clientHeight,s=n.offsetTop,l=s+n.offsetHeight;if(s<i){this.listElement.scrollTop=s;return}l>r&&(this.listElement.scrollTop=l-this.listElement.clientHeight)}setActiveDescendant(e){if(e){this.listElement.setAttribute("aria-activedescendant",e);return}this.listElement.removeAttribute("aria-activedescendant")}setEmptyState(e){this.clearItems(),this.appendItem(e)}syncAttributes(){const e=this.getAttribute("label")||"Available networks",n=this.getAttribute("aria-label");this.labelElement.textContent=e,n?this.listElement.setAttribute("aria-label",n):this.listElement.removeAttribute("aria-label")}}function ze(){customElements.get(X)||customElements.define(X,qe)}const Ne=`:host {\r
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
`,tt="ui-network-status",Lt="actionBtn",It="settingsBtn",Bt="wifiStatusLabel",Mt="wifiStatusIcon",qt="wifiStatusNetwork",zt=document.createElement("template");zt.innerHTML=`
  <style>${Ne}</style>
  <div class="wifi-status-card">
    <div class="wifi-status-card__content">
      <div class="wifi-status-card__status">
        <span class="card-icon" id="${Mt}"></span>
        <span id="${Bt}" class="wifi-status-card__label">
          Disconnected
        </span>
        <span
          id="${qt}"
          class="wifi-status-card__network"
        ></span>
      </div>
      <div class="wifi-status-card__actions">
        <ui-button
          id="${Lt}"
          variant="outline"
          inverse
          aria-label="Connect"
        >
          Connect
        </ui-button>
        <ui-button
          id="${It}"
          variant="outline"
          inverse
          aria-label="Settings"
        >
          Settings
        </ui-button>
      </div>
    </div>
  </div>
`;function Pe(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}class Oe extends HTMLElement{static get observedAttributes(){return["action-label","network","status-label"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append(zt.content.cloneNode(!0)),this.actionButton=e.querySelector(`#${Lt}`),this.actionButton.addEventListener("click",n=>{n.stopPropagation(),this.dispatchEvent(new Event("action",{bubbles:!0,composed:!0}))}),this.iconElement=e.querySelector(`#${Mt}`),this.labelElement=e.querySelector(`#${Bt}`),this.networkElement=e.querySelector(`#${qt}`),this.settingsButton=e.querySelector(`#${It}`),this.settingsButton.addEventListener("click",n=>{n.stopPropagation(),this.dispatchEvent(new Event("settings",{bubbles:!0,composed:!0}))})}connectedCallback(){this.dataset.component=tt,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get actionDisabled(){return!!this.actionButton.disabled}set actionDisabled(e){this.actionButton.disabled=e}get iconSvg(){return this.iconElement.innerHTML}set iconSvg(e){this.iconElement.innerHTML=e?Pe(e,"wifi-icon"):""}get network(){return this.getAttribute("network")||""}set network(e){this.setAttribute("network",e)}get actionLabel(){return this.getAttribute("action-label")||"Connect"}set actionLabel(e){this.setAttribute("action-label",e)}get statusLabel(){return this.getAttribute("status-label")||"Disconnected"}set statusLabel(e){this.setAttribute("status-label",e)}syncAttributes(){this.actionButton.textContent=this.actionLabel,this.actionButton.setAttribute("aria-label",this.actionLabel),this.labelElement.textContent=this.statusLabel,this.networkElement.textContent=this.network,this.networkElement.hidden=this.network.length===0}}function $e(){customElements.get(tt)||customElements.define(tt,Oe)}const De=`:host {\r
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
`,Ve=document.createElement("template");Ve.innerHTML=`
  <style>${De}</style>
  <div class="form-control">
    <label></label>
    <div class="range-slider">
      <input class="range-slider__range" type="range" />
      <span class="range-slider__value"></span>
    </div>
  </div>
`;const He='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80 240-320l57-57 183 183 183-183 57 57L480-80ZM298-584l-58-56 240-240 240 240-58 56-182-182-182 182Z"/></svg>',Fe=`:host {\r
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
`,et="ui-select",Nt=document.createElement("template");Nt.innerHTML=`
  <style>${Fe}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <select></select>
      <span class="select-icon"></span>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;class Ue extends HTMLElement{constructor(){super(),this.customValidationMessage="";const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Nt.content.cloneNode(!0)),this.helperText=e.querySelector(".form-helper-text"),this.labelElement=e.querySelector("label"),this.select=e.querySelector("select");const n=e.querySelector(".select-icon");n.innerHTML=Ke(He,"select-icon"),this.select.addEventListener("change",i=>{this.syncValidationState(),i.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.select.addEventListener("input",i=>{this.syncValidationState(),i.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}),this.select.addEventListener("invalid",()=>{this.syncValidationState()})}static get observedAttributes(){return["aria-invalid","aria-label","disabled","helper-text","invalid","label","name","required","value"]}connectedCallback(){this.moveLightDomOptions(),this.dataset.component=et,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get innerHTML(){return this.select.innerHTML}set innerHTML(e){this.select.innerHTML=e,this.syncValidationState()}get value(){return this.select.value}set value(e){this.select.value=e,this.syncValidationState()}appendChild(e){return e instanceof HTMLOptionElement||e instanceof HTMLOptGroupElement?(this.select.appendChild(e),e):super.appendChild(e)}focus(e){this.select.focus(e)}get validationMessage(){return this.select.validationMessage}get validity(){return this.select.validity}get willValidate(){return this.select.willValidate}checkValidity(){const e=this.select.checkValidity();return this.syncValidationState(),e}reportValidity(){const e=this.select.reportValidity();return this.syncValidationState(),e}setCustomValidity(e){this.customValidationMessage=e,this.select.setCustomValidity(e),this.syncValidationState()}moveLightDomOptions(){Array.from(this.children).forEach(e=>{(e instanceof HTMLOptionElement||e instanceof HTMLOptGroupElement)&&this.select.appendChild(e)})}syncAttributes(){const e=this.getAttribute("helper-text")||"",n=this.id?`${this.id}Select`:"select",i=this.getAttribute("label")||"";if(this.select.id=n,this.select.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.select.required=this.hasAttribute("required"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("name"),this.hasAttribute("value")&&(this.select.value=this.getAttribute("value")||""),this.select.setCustomValidity(this.customValidationMessage),this.labelElement.htmlFor=n,this.labelElement.textContent=i,this.labelElement.hidden=i.length===0,this.helperText.textContent=e,this.helperText.hidden=e.length===0,e.length>0){const r=`${n}HelperText`;this.helperText.id=r,this.select.setAttribute("aria-describedby",r)}else this.helperText.removeAttribute("id"),this.select.removeAttribute("aria-describedby");this.syncValidationState()}syncStringAttribute(e){const n=this.getAttribute(e);if(n===null){this.select.removeAttribute(e);return}this.select.setAttribute(e,n)}syncValidationState(){const e=this.hasAttribute("invalid")||this.getAttribute("aria-invalid")==="true"||!this.select.validity.valid;this.classList.toggle("error",e),this.select.classList.toggle("error",e),this.hasAttribute("invalid")!==e&&this.toggleAttribute("invalid",e),this.getAttribute("aria-invalid")!==String(e)&&this.setAttribute("aria-invalid",String(e)),this.select.getAttribute("aria-invalid")!==String(e)&&this.select.setAttribute("aria-invalid",String(e))}}function Re(){customElements.get(et)||customElements.define(et,Ue)}function Ke(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}const Ze=`:host {\r
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
`,Ge=document.createElement("template");Ge.innerHTML=`
  <style>${Ze}</style>
  <div class="form-control">
    <div class="switch-container">
      <button type="button" part="button">
        <span class="knob"></span>
      </button>
      <span class="switch-label"></span>
    </div>
  </div>
`;const We=`:host {\r
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
`,nt="ui-toast",Pt=document.createElement("template");Pt.innerHTML=`
  <style>${We}</style>
  <dialog class="toast-dialog" aria-live="polite">
    <p class="toast-dialog__message"></p>
  </dialog>
`;function ut(t){return t==="success"||t==="info"||t==="warning"||t==="error"||t==="danger"?t:null}class Je extends HTMLElement{static get observedAttributes(){return["aria-label","message","status"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append(Pt.content.cloneNode(!0)),this.dialog=e.querySelector("dialog"),this.messageElement=e.querySelector(".toast-dialog__message")}connectedCallback(){this.dataset.component=nt,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get message(){return this.messageElement.textContent||""}set message(e){this.setAttribute("message",e)}get status(){return ut(this.getAttribute("status"))}set status(e){if(e){this.setAttribute("status",e);return}this.removeAttribute("status")}show(e,n){typeof e=="string"&&(this.message=e),n&&(this.status=n),this.dialog.open||this.dialog.show()}close(e){this.dialog.close(e)}syncAttributes(){const e=this.getAttribute("aria-label"),n=this.getAttribute("message")||"",i=ut(this.getAttribute("status"));e?this.dialog.setAttribute("aria-label",e):this.dialog.removeAttribute("aria-label"),this.messageElement.textContent=n,this.messageElement.id=this.id?`${this.id}Message`:"statusToastMessage",this.dialog.id=this.id||"statusToast",i?this.dialog.setAttribute("data-status",i):this.dialog.removeAttribute("data-status")}}function je(){customElements.get(nt)||customElements.define(nt,Je)}const Ye='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m109-531-85-85q92-89 210-136.5T480-800q128 0 246 47.5T936-616l-85 85q-75-72-171-110.5T480-680q-104 0-200 38.5T109-531Zm169 169-84-84q59-55 132.5-84.5T480-560q80 0 153.5 29.5T766-446l-84 84q-42-38-93.5-58T480-440q-57 0-108.5 20T278-362Zm202 202q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Z"/></svg>',Xe='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg>',Qe='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM361-353q25-18 55.5-28t63.5-10q33 0 63.5 10t55.5 28l245-245q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l245 245Z"/></svg>',tn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM299-415q38-28 84-43.5t97-15.5q51 0 97 15.5t84 43.5l183-183q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l183 183Z"/></svg>',en='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM232-482q53-38 116-59.5T480-563q69 0 132 21.5T728-482l116-116q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l116 116Z"/></svg>',nn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q95-97 219.5-148.5T480-800q136 0 260.5 51.5T960-600L480-120Z"/></svg>',rn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-601q93-93 215.5-146T480-800q142 0 264.5 53T960-601l-56 57q-81-81-190-128.5T480-720q-103 0-195 32.5T117-597l419 420-56 57Zm384-40L761-262q-18 11-38 16.5t-43 5.5q-68 0-114-46t-46-114q0-68 46-114t114-46q68 0 114 46t46 114q0 23-5.5 43T818-319l102 103-56 56ZM680-320q34 0 57-23t23-57q0-34-23-57t-57-23q-34 0-57 23t-23 57q0 34 23 57t57 23ZM480-177Z"/></svg>',on='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70q66 0 121 33t87 87h432v240h-80v120H600v-120H488q-32 54-87 87t-121 33Zm0-80q66 0 106-40.5t48-79.5h246v120h80v-120h80v-80H434q-8-39-48-79.5T280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-80q33 0 56.5-23.5T360-480q0-33-23.5-56.5T280-560q-33 0-56.5 23.5T200-480q0 33 23.5 56.5T280-400Zm0-80Z"/></svg>',sn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>',an='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>',ln='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m720-80 120-120-28-28-72 72v-164h-40v164l-72-72-28 28L720-80ZM480-800 243-663l237 137 237-137-237-137ZM120-321v-318q0-22 10.5-40t29.5-29l280-161q10-5 19.5-8t20.5-3q11 0 21 3t19 8l280 161q19 11 29.5 29t10.5 40v159h-80v-116L479-434 200-596v274l240 139v92L160-252q-19-11-29.5-29T120-321ZM720 0q-83 0-141.5-58.5T520-200q0-83 58.5-141.5T720-400q83 0 141.5 58.5T920-200q0 83-58.5 141.5T720 0ZM480-491Z"/></svg>',cn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>',dn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h200v80H160v480h640v-480H600v-80h200q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-184L280-544l56-56 104 104v-304h80v304l104-104 56 56-200 200Z"/></svg>',un={"Content-Type":"application/json",Accept:"application/json"},ht=64,hn=2e3,gn=8,fn=2e3,pn=8,mn=3e3,bn=750,vn=20,yn="/api/settings",wn=`${yn}/time`,xn="/api/runtime/time",Tn="/api/runtime/update",Sn="/api/update",En="/api/books",An="/api/books/upload",kn="/api/books/delete",Cn="/api/recordings",_n="/api/recordings/audio",Ln=1e4;async function M(t,e){const n=new AbortController,i=setTimeout(()=>n.abort(),Ln);let r;try{r=await fetch(t,{cache:"no-store",...e,signal:e?.signal??n.signal,headers:{...un,...e?.headers||{}}})}catch(h){throw n.signal.aborted?new Error(`Request to ${t} timed out. Check the device is still reachable.`):h}finally{clearTimeout(i)}const s=r.headers.get("content-type")||"",l=await r.text();if(!s.includes("application/json"))throw new Error(`Unexpected response for ${t}. Make sure you are connected to the device AP and loading the portal from the ESP32.`);const o=JSON.parse(l);if(!r.ok||o.success!==!0)throw new Error(o.message||"Request failed.");return o}const In=(t,e)=>M(t,e),Bn=(t,e)=>M(t,e),Mn=(t,e)=>M(t,e),qn=(t,e)=>M(t,e),Ot=(t,e)=>M(t,e),zn=(t,e)=>M(t,e);function E(t){const e=document.getElementById(t);if(!e)throw new Error(`Required portal element "#${t}" was not found.`);return e}function Nn(){return{wifiStatusCard:E("wifiStatusCard"),wifiSettingsSheet:E("wifiSettingsSheet"),wifiSettingsCloseBtn:E("wifiSettingsCloseBtn"),wifiSettingsNotification:E("wifiSettingsNotification"),networkList:E("networkList"),passwordInput:E("password"),scanBtn:E("scanBtn"),connectBtn:E("connectBtn"),geminiCard:E("geminiCard"),geminiApiKeyInput:E("geminiApiKeyInput"),geminiClearBtn:E("geminiClearBtn"),geminiSaveBtn:E("geminiSaveBtn"),timezoneLocationCard:E("timezoneLocationCard"),timezoneSelect:E("timezoneSelect"),manualTimeInput:E("manualTimeInput"),manualDateInput:E("manualDateInput"),timezoneLocationClearBtn:E("timezoneLocationClearBtn"),timezoneLocationSaveBtn:E("timezoneLocationSaveBtn")}}function $t(t){return(e,n="info")=>{t.setNotification(e,n)}}function Pn(t){return(e,n="info")=>{if(!e){t.hidden=!0,t.textContent="",t.removeAttribute("data-status"),t.setAttribute("role","status"),t.setAttribute("aria-live","polite");return}t.hidden=!1,t.textContent=e,t.setAttribute("data-status",n),n==="error"||n==="danger"?(t.setAttribute("role","alert"),t.setAttribute("aria-live","assertive")):n==="warning"?(t.setAttribute("role","alert"),t.setAttribute("aria-live","polite")):(t.setAttribute("role","status"),t.setAttribute("aria-live","polite"))}}function it(t){t.classList.remove("error"),t.removeAttribute("invalid"),t.setAttribute("aria-invalid","false"),t.setCustomValidity?.("")}function ot(t,e){t.classList.add("error"),t.setAttribute("invalid",""),t.setAttribute("aria-invalid","true"),t.setCustomValidity?.(e)}function On(t,e){t.setAttribute("aria-checked",e?"true":"false")}function $n(t){return t.getAttribute("aria-checked")==="true"}function Dn(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}function Vn(t){return new Promise(e=>{setTimeout(e,t)})}function Hn(){const t=document.documentElement.lang?.trim();return t||"en-US"}function Fn(t){try{return new Intl.DateTimeFormat(Hn(),{hour:"numeric",timeZone:t,timeZoneName:"longGeneric"}).formatToParts(new Date).find(i=>i.type==="timeZoneName")?.value?.trim()||""}catch(e){return console.warn(`Failed to format timezone label for "${t}".`,e),""}}function gt(t){return/^(GMT|UTC)(?:[+-]\d{1,2}(?::\d{2})?)?$/.test(t)}function Un(t){return(t.split("/").pop()||t).replace(/_/g," ")}function Dt(t){return t.split("/").map(e=>e.replace(/_/g," ")).join(" / ")}function Rn(t){const e=t.map(r=>{const s=Fn(r.name);return{cityLabel:Un(r.name),genericLabel:s,name:r.name}}),n=new Map(e.map(r=>[r.name,r])),i=new Map;return e.forEach(r=>{!r.genericLabel||gt(r.genericLabel)||i.set(r.genericLabel,(i.get(r.genericLabel)||0)+1)}),new Map(t.map(r=>{const s=n.get(r.name),l=r.description?.trim()||"";if(s?.genericLabel&&!gt(s.genericLabel)){const h=(i.get(s.genericLabel)||0)>1?`${s.genericLabel} (${s.cityLabel})`:s.genericLabel;return[r.name,h]}return l?[r.name,l]:[r.name,Dt(r.name)]}))}function Kn(t,e){return e.get(t.name)||t.description?.trim()||Dt(t.name)}function Zn(t){const e=t.value.trim();if(!e)return null;const n=/^(\d{2}):(\d{2})$/.exec(e);if(!n)return null;const i=Number.parseInt(n[1],10),r=Number.parseInt(n[2],10);return!Number.isFinite(i)||!Number.isFinite(r)||i<0||i>23||r<0||r>59?null:i*60+r}const Gn=2e3,Wn=45;function Jn(t){let e=!1,n="";const i=(g,u="info")=>t.card.setNotification(g,u),r=()=>t.fileInput.files?.[0]??null;function s(){t.fileInput.disabled=e,t.uploadBtn.disabled=e||!r()}function l(g){n=g,t.versionText.textContent=g?`Installed version: ${g}`:"Installed version: unknown"}async function o(){const u=(await qn(Tn)).runtime?.version??"";return l(u),u}function h(g){return new Promise((u,c)=>{const p=new XMLHttpRequest;p.open("POST",Sn),p.setRequestHeader("Content-Type","application/octet-stream"),p.upload.onprogress=w=>{if(!w.lengthComputable)return;t.fileInput.progressMax=w.total,t.fileInput.progressValue=w.loaded;const T=Math.round(w.loaded/w.total*100);t.fileInput.progressMessageText=T<100?`Uploading… ${T}%`:"Checking and installing…"},p.onload=()=>{try{u(JSON.parse(p.responseText))}catch{c(new Error("The device sent an unexpected reply."))}},p.onerror=()=>c(new Error("The connection to the device was lost.")),p.send(g)})}async function b(g){for(let u=0;u<Wn;u+=1){await new Promise(c=>window.setTimeout(c,Gn));try{const c=await o();c===g?i(`The device restarted and is still on version ${c}.`,"info"):i(`Updated to version ${c}.`,"success");return}catch{}}i("The update was installed and the device restarted. Reconnect to the device and reload this page to confirm the new version.","info")}async function v(){const g=r();if(!g||e)return;if(!g.name.toLowerCase().endsWith(".bin")){i("Choose a firmware update file ending in .bin.","error");return}e=!0,s();const u=n;t.fileInput.progressHidden=!1,t.fileInput.progressValue=0,t.fileInput.progressMessageText="Starting…",i("Uploading. Keep this page open and the device powered.","info");try{const c=await h(g);if(c.success!==!0)throw new Error(c.message||"The device rejected the update.");t.fileInput.progressMessageText="Installed. Restarting…",i("Update installed. The device is restarting…","info"),await b(u)}catch(c){t.fileInput.progressHidden=!0,i(c instanceof Error?c.message:"The update failed.","error")}finally{e=!1,s()}}function m(){t.fileInput.progressHidden=!0,t.fileInput.addEventListener("change",s),t.uploadBtn.addEventListener("click",()=>{v()}),s()}return{bind:m,refreshVersion:async()=>{try{await o()}catch(g){console.error("Firmware version check failed:",g),l("")}}}}const jn=new Set(["address","article","aside","blockquote","br","dd","div","dl","dt","figcaption","figure","footer","h1","h2","h3","h4","h5","h6","header","hr","li","main","nav","ol","p","pre","section","table","td","th","tr","ul"]),Yn=new Set(["head","script","style","svg","math","noscript","title"]);function Vt(t){return t.replace(/\.(txt|epub)$/i,"")}function Xn(t){const e=new DataView(t.buffer,t.byteOffset,t.byteLength);let n=-1;for(let o=t.length-22;o>=Math.max(0,t.length-65557);o-=1)if(e.getUint32(o,!0)===101010256){n=o;break}if(n<0)throw new Error("That EPUB file is damaged (not a valid ZIP archive).");const i=e.getUint16(n+10,!0);let r=e.getUint32(n+16,!0);const s=new TextDecoder("utf-8"),l=new Map;for(let o=0;o<i;o+=1){if(e.getUint32(r,!0)!==33639248)throw new Error("That EPUB file is damaged (bad ZIP directory).");const h=e.getUint16(r+10,!0),b=e.getUint32(r+20,!0),v=e.getUint16(r+28,!0),m=e.getUint16(r+30,!0),g=e.getUint16(r+32,!0),u=e.getUint32(r+42,!0),c=s.decode(t.subarray(r+46,r+46+v)),p=e.getUint16(u+26,!0),w=e.getUint16(u+28,!0);l.set(c,{name:c,method:h,compressedSize:b,dataOffset:u+30+p+w}),r+=46+v+m+g}return l}async function Qn(t,e){const n=t.subarray(e.dataOffset,e.dataOffset+e.compressedSize);if(e.method===0)return n;if(e.method!==8)throw new Error(`That EPUB uses an unsupported compression (${e.method}).`);if(typeof DecompressionStream>"u")throw new Error("This browser cannot open EPUB files. Try a newer browser, or send .txt.");const i=new Blob([n]).stream().pipeThrough(new DecompressionStream("deflate-raw"));return new Uint8Array(await new Response(i).arrayBuffer())}function tr(t,e){const n=decodeURIComponent(e.split("#")[0]),i=(t?`${t}/${n}`:n).split("/"),r=[];for(const s of i)s===".."?r.pop():s!=="."&&s!==""&&r.push(s);return r.join("/")}function Ht(t){return t.replace(/[\s\u00a0]+/g," ").trim()}function er(t){const e=[];let n="";const i=()=>{const s=Ht(n);s&&e.push(s),n=""},r=s=>{if(s.nodeType===Node.TEXT_NODE){n+=s.textContent??"";return}if(s.nodeType!==Node.ELEMENT_NODE)return;const l=s.localName.toLowerCase();if(Yn.has(l))return;const o=jn.has(l);o&&i(),s.childNodes.forEach(r),o&&i()};return r(t),i(),e}function P(t,e){return new DOMParser().parseFromString(t,e)}async function nr(t){const e=new Uint8Array(await t.arrayBuffer()),n=Xn(e),i=new TextDecoder("utf-8"),r=async u=>{const c=n.get(u);if(!c)throw new Error(`That EPUB is missing ${u}.`);return i.decode(await Qn(e,c))};if(n.has("META-INF/encryption.xml")){const u=await r("META-INF/encryption.xml");if(/EncryptedData/.test(u)&&!/obfuscation|font/i.test(u))throw new Error("That EPUB is copy-protected (DRM), so its text cannot be read.")}const l=P(await r("META-INF/container.xml"),"application/xml").querySelector("rootfile")?.getAttribute("full-path");if(!l)throw new Error("That EPUB has no table of contents (container.xml).");const o=l.includes("/")?l.slice(0,l.lastIndexOf("/")):"",h=P(await r(l),"application/xml"),b=new Map;h.querySelectorAll("manifest > item").forEach(u=>{const c=u.getAttribute("id"),p=u.getAttribute("href");c&&p&&b.set(c,{href:p,type:u.getAttribute("media-type")??""})});const v=Ht(h.getElementsByTagNameNS("http://purl.org/dc/elements/1.1/","title")[0]?.textContent??""),m=[];for(const u of Array.from(h.querySelectorAll("spine > itemref"))){const c=b.get(u.getAttribute("idref")??"");if(!c||!/html/.test(c.type))continue;const p=tr(o,c.href);if(!n.has(p))continue;const w=await r(p);let T=P(w,"application/xhtml+xml");T.getElementsByTagName("parsererror").length>0&&(T=P(w,"text/html"));const C=er(T.body??T.documentElement);C.length>0&&m.push(C.join(`

`))}if(m.length===0)throw new Error("No readable text was found in that EPUB.");const g=(v?`${v}

`:"")+m.join(`


`);return{name:v||Vt(t.name),text:g}}function rr(t){try{return new TextDecoder("utf-8",{fatal:!0}).decode(t)}catch{let e=0,n=0;for(const r of t)r>=128&&(n+=1,r>=224&&r<=250&&(e+=1));const i=n>0&&e/n>.6?"windows-1255":"windows-1252";return new TextDecoder(i).decode(t)}}async function ir(t){const e=new Uint8Array(await t.arrayBuffer());if(e.includes(0))throw new Error(`${t.name} is not a plain text file.`);const n=rr(e).replace(/^\ufeff/,"").replace(/\r\n?/g,`
`);return{name:Vt(t.name),text:n}}async function or(t){const e=t.name.toLowerCase();if(e.endsWith(".epub"))return nr(t);if(e.endsWith(".txt"))return ir(t);throw new Error(`${t.name}: only .txt and .epub books are supported.`)}function sr(t){let e=t.replace(/^.*[\\/]/,"").replace(/\.(txt|epub)$/i,"");return e=e.replace(/[^A-Za-z0-9\-_.(),'&!]+/g," ").trim(),e=e.replace(/^[. ]+/,"").slice(0,80).replace(/[. ]+$/,""),`${e||"book"}.txt`}function ft(t){return t>=1024*1024*1024?`${(t/(1024*1024*1024)).toFixed(1)} GB`:t>=1024*1024?`${(t/(1024*1024)).toFixed(1)} MB`:`${Math.max(1,Math.round(t/1024))} KB`}function ar(t){let e=!1,n=[];const i=(m,g="info")=>t.card.setNotification(m,g);function r(){t.fileInput.disabled=e,t.uploadBtn.disabled=e||!t.fileInput.files?.length}function s(m){n=m.books??[],t.list.replaceChildren();for(const u of n){const c=document.createElement("li");c.className="file-list__row";const p=document.createElement("span");p.className="file-list__label",p.textContent=u.name.replace(/\.txt$/i,"");const w=document.createElement("span");w.className="file-list__meta",w.textContent=ft(u.size);const T=document.createElement("button");T.type="button",T.className="file-list__action file-list__action--danger",T.textContent="Delete",T.addEventListener("click",()=>{b(u.name)}),c.append(p,w,T),t.list.append(c)}const g=typeof m.free_bytes=="number"?` · ${ft(m.free_bytes)} free on the card`:"";t.summary.textContent=n.length===0?`No books yet${g}.`:`${n.length} book${n.length===1?"":"s"}${g}.`}async function l(){try{const g=await(await fetch(En,{cache:"no-store"})).json();if(!g.success){t.summary.textContent=g.message??"The SD card is not available.",t.list.replaceChildren();return}s(g)}catch{t.summary.textContent="Could not load the book list."}}function o(m,g,u){return new Promise((c,p)=>{const w=new XMLHttpRequest;w.open("POST",`${An}?name=${encodeURIComponent(m)}`),w.setRequestHeader("Content-Type","text/plain; charset=utf-8"),w.upload.onprogress=T=>{if(!T.lengthComputable)return;t.fileInput.progressMax=T.total,t.fileInput.progressValue=T.loaded;const C=Math.round(T.loaded/T.total*100);t.fileInput.progressMessageText=C<100?`Sending ${u}… ${C}%`:`Saving ${u}…`},w.onload=()=>{try{c(JSON.parse(w.responseText))}catch{p(new Error("The device sent an unexpected reply."))}},w.onerror=()=>p(new Error("The connection to the device was lost.")),w.send(new Blob([g],{type:"text/plain;charset=utf-8"}))})}async function h(){const m=Array.from(t.fileInput.files??[]);if(m.length===0||e)return;e=!0,r(),t.fileInput.progressHidden=!1;let g=0;const u=[];try{for(const c of m){t.fileInput.progressValue=0,t.fileInput.progressMessageText=c.name.toLowerCase().endsWith(".epub")?`Converting ${c.name} to text…`:`Reading ${c.name}…`;try{const p=await or(c),w=sr(p.name);if(n.some(C=>C.name===w)&&!window.confirm(`"${w}" is already on the device. Replace it?`))continue;const T=await o(p.name,p.text,c.name);T.success?g+=1:u.push(`${c.name}: ${T.message??"not saved"}`)}catch(p){u.push(p instanceof Error?p.message:`${c.name}: failed`)}}}finally{e=!1,t.fileInput.progressHidden=!0,r()}u.length>0?i(u.join(" "),"error"):g>0&&i(g===1?"Book saved. Open Books on the device to read it.":`${g} books saved. Open Books on the device to read them.`,"success"),await l()}async function b(m){if(!(e||!window.confirm(`Delete "${m}" from the device?`))){e=!0,r();try{const u=await(await fetch(`${kn}?name=${encodeURIComponent(m)}`,{method:"POST"})).json();i(u.message??(u.success?"Deleted.":"Could not delete."),u.success?"success":"error")}catch{i("Could not reach the device.","error")}finally{e=!1,r()}await l()}}function v(){t.fileInput.addEventListener("change",r),t.uploadBtn.addEventListener("click",()=>{h()}),t.fileInput.progressHidden=!0,r(),l()}return{bind:v,refresh:l}}const Ft={note:"Note",task:"Task",idea:"Idea"};function Ut(t){return t.time_valid&&t.created>0?new Date(t.created*1e3).toLocaleString(void 0,{dateStyle:"medium",timeStyle:"short"}):t.date||"Unknown date"}function Rt(t){const e=Math.max(1,Math.round(t/1e3));return e<60?`${e}s`:`${Math.floor(e/60)}m ${e%60}s`}function lr(t){if(t.title)return t.title;const e=t.transcript.trim();return e?e.length>90?`${e.slice(0,90)}…`:e:"Not transcribed yet"}function pt(t){return`${t.date||"recording"}-${t.tag}-${t.id}`}function mt(t,e){const n=URL.createObjectURL(new Blob([e],{type:"text/plain;charset=utf-8"})),i=document.createElement("a");i.href=n,i.download=t,document.body.append(i),i.click(),i.remove(),window.setTimeout(()=>URL.revokeObjectURL(n),1e4)}function bt(t){const e=[`${Ft[t.tag]??t.tag} · ${Ut(t)} · ${Rt(t.duration_ms)}`];return t.title&&e.push(t.title),e.push("",t.transcript.trim()||"(no transcript)"),e.join(`
`)}function cr(t){let e=[];function n(){t.list.replaceChildren();for(const o of e){const h=document.createElement("li");h.className="file-list__row file-list__row--stacked";const b=document.createElement("div");b.className="file-list__line";const v=document.createElement("span");v.className="file-list__label",v.textContent=lr(o),v.dir="auto",b.append(v);const m=document.createElement("div");m.className="file-list__meta";const g=[Ft[o.tag]??o.tag,Ut(o),Rt(o.duration_ms),o.completed?"done":"",o.follow_up?"follow-up":"",o.archived?"archived":""].filter(Boolean);m.textContent=g.join(" · ");const u=document.createElement("div");if(u.className="file-list__actions",o.has_audio){const c=document.createElement("a");c.className="file-list__action",c.href=`${_n}?id=${encodeURIComponent(o.id)}`,c.download=`${pt(o)}.wav`,c.textContent="Audio",u.append(c)}if(o.transcript.trim()){const c=document.createElement("button");c.type="button",c.className="file-list__action",c.textContent="Transcript",c.addEventListener("click",()=>mt(`${pt(o)}.txt`,bt(o))),u.append(c)}h.append(b,m,u),t.list.append(h)}const l=e.filter(o=>o.transcript.trim()).length;t.summary.textContent=e.length===0?"No recordings yet.":`${e.length} recording${e.length===1?"":"s"}, newest first.`,t.allTranscriptsBtn.disabled=l===0}async function i(){t.refreshBtn.disabled=!0;try{const o=await(await fetch(Cn,{cache:"no-store"})).json();if(!o.success){e=[],t.list.replaceChildren(),t.summary.textContent=o.message??"The SD card is not available.",t.allTranscriptsBtn.disabled=!0;return}e=o.recordings??[],n()}catch{t.summary.textContent="Could not load the recordings."}finally{t.refreshBtn.disabled=!1}}function r(){const l=e.filter(h=>h.transcript.trim()).map(h=>bt(h));if(l.length===0)return;const o=new Date().toISOString().slice(0,10);mt(`brain-dump-transcripts-${o}.txt`,l.join(`

----------

`)),t.card.setNotification(`Saved ${l.length} transcripts in one file.`,"success")}function s(){t.refreshBtn.addEventListener("click",()=>{i()}),t.allTranscriptsBtn.addEventListener("click",r),t.allTranscriptsBtn.disabled=!0,i()}return{bind:s,refresh:i}}function D(t,e,n){t.hasKey=n?.has_key===!0,t.last4=typeof n?.last4=="string"?n.last4:"",e.value=t.hasKey?t.last4?`******${t.last4}`:"******":""}function vt(t,e,n){t.hasKey=!1,t.last4="",e.value="",n("")}async function yt(t,e,n,i,r,s,l){const o=e.value.trim();if(!o){n(`${l} is required.`,"warning");return}t.isBusy=!0,n(s,"info"),i();try{const h=await r(t.settingsApi,{method:"PATCH",body:JSON.stringify({api_key:o})});D(t,e,h.settings),n(h.message||`${l} stored.`,"success")}catch(h){console.error(`${l} save failed:`,h),n(h instanceof Error?h.message:`Failed to store ${l}.`,"error")}finally{t.isBusy=!1,i()}}async function wt(t,e,n,i,r,s,l){t.isBusy=!0,n(s,"info"),i();try{const o=await r(t.resetApi,{method:"POST"});D(t,e,o.settings),n(o.message||l,"success")}catch(o){console.error(`${l} failed:`,o),n(o instanceof Error?o.message:`Failed to clear ${l}.`,"error")}finally{t.isBusy=!1,i()}}function dr(t){const e={hasKey:!1,isBusy:!1,last4:"",resetApi:"/api/settings/gemini/reset",settingsApi:"/api/settings/gemini"},n={hasKey:!1,isBusy:!1,last4:"",resetApi:"/api/settings/openai/reset",settingsApi:"/api/settings/openai"};function i(u){const c=u?.routes;e.settingsApi=c?.settings||"/api/settings/gemini",e.resetApi=c?.reset||"/api/settings/gemini/reset"}function r(u){const c=u?.routes;n.settingsApi=c?.settings||"/api/settings/openai",n.resetApi=c?.reset||"/api/settings/openai/reset"}function s(u){D(e,t.geminiApiKeyInput,u)}function l(){vt(e,t.geminiApiKeyInput,t.notifyGemini)}function o(u){D(n,t.openAiApiKeyInput,u)}function h(){vt(n,t.openAiApiKeyInput,t.notifyOpenAi)}async function b(){if(!t.isGeminiModuleActive()||e.isBusy||e.hasKey)return;if(!t.geminiApiKeyInput.value.trim()){t.notifyGemini("Gemini API key is required.","warning");return}await yt(e,t.geminiApiKeyInput,t.notifyGemini,t.updateButtons,t.fetchGeminiModuleJson,"Saving Gemini API key...","Gemini API key")}async function v(){!t.isGeminiModuleActive()||e.isBusy||await wt(e,t.geminiApiKeyInput,t.notifyGemini,t.updateButtons,t.fetchGeminiModuleJson,"Clearing Gemini API key...","Gemini API key cleared.")}async function m(){if(!t.isOpenAiModuleActive()||n.isBusy||n.hasKey)return;if(!t.openAiApiKeyInput.value.trim()){t.notifyOpenAi("OpenAI API key is required.","warning");return}await yt(n,t.openAiApiKeyInput,t.notifyOpenAi,t.updateButtons,t.fetchOpenAiModuleJson,"Saving OpenAI API key...","OpenAI API key")}async function g(){!t.isOpenAiModuleActive()||n.isBusy||await wt(n,t.openAiApiKeyInput,t.notifyOpenAi,t.updateButtons,t.fetchOpenAiModuleJson,"Clearing OpenAI API key...","OpenAI API key cleared.")}return{applyGeminiSettings:s,applyOpenAiSettings:o,clearGeminiKey:v,clearGeminiSettings:l,clearOpenAiKey:g,clearOpenAiSettings:h,getGeminiHasKey:()=>e.hasKey,getOpenAiHasKey:()=>n.hasKey,isGeminiBusy:()=>e.isBusy,isOpenAiBusy:()=>n.isBusy,saveGeminiKey:b,saveOpenAiKey:m,updateGeminiRoutes:i,updateOpenAiRoutes:r}}function ur(t){let e=!1,n=!1,i=!1,r=!1;async function s(){return t.fetchTimezoneListJson("/api/timezone/list")}function l(d){const y=d.settings,S=d.runtime;t.setSwitchChecked(t.clockModeToggle,!!y?.enabled),t.timezoneSelect.value=y?.timezone_name||"",t.clearFieldError(t.timezoneSelect),m(),t.manualDateInput.value=typeof S?.current_date=="string"?S.current_date:"",t.manualTimeInput.value=typeof S?.current_time=="string"?S.current_time:""}function o(d){d&&(typeof d.clock_enabled=="boolean"&&t.setSwitchChecked(t.clockModeToggle,d.clock_enabled),t.manualDateInput.value=typeof d.current_date=="string"?d.current_date:"",t.manualTimeInput.value=typeof d.current_time=="string"?d.current_time:"")}let h=[];function b(d){try{return new Intl.DateTimeFormat("en-US",{timeZone:d}).resolvedOptions().timeZone}catch{return d}}function v(){let d="";try{d=Intl.DateTimeFormat().resolvedOptions().timeZone||""}catch{return""}if(!d)return"";if(h.includes(d))return d;const y=b(d);return h.find(S=>b(S)===y)||""}function m(){const d=document.getElementById("timezoneDetectRow"),y=document.getElementById("timezoneDetectName");if(!d||!y)return;const S=v(),a=S!==""&&t.timezoneSelect.value!==S;d.style.display=a?"":"none",a&&(y.textContent=S.replace(/_/g," "))}function g(){const d=v();d&&(t.timezoneSelect.value=d,t.clearFieldError(t.timezoneSelect),m(),t.onStateChange(),t.notify("Timezone selected. Press Save to apply it.","info"))}document.getElementById("timezoneDetectBtn")?.addEventListener("click",g),t.timezoneSelect.addEventListener("change",m);async function u(){const d=t.timezoneSelect.value;t.timezoneSelect.innerHTML="";const y=document.createElement("option");y.value="",y.textContent="Select timezone",t.timezoneSelect.appendChild(y);try{const S=await s(),a=Array.isArray(S.timezones)?S.timezones:[];h=a.map(x=>x.name);const f=new Map;a.forEach(x=>{const _=x.region||"Other";let k=f.get(_);k||(k=document.createElement("optgroup"),k.label=_,f.set(_,k),t.timezoneSelect.appendChild(k));const L=document.createElement("option");L.value=x.name,L.textContent=x.description?.trim()||t.formatTimezoneLabel(x,new Map),k.appendChild(L)}),d&&(t.timezoneSelect.value=d),m()}catch(S){console.error("Timezone list fetch failed:",S),t.notify(S instanceof Error?S.message:"Failed to load timezones.","error")}}async function c(){if(!(e||n||i)){e=!0,n=!0,i=!0,t.onStateChange();try{const d=await t.fetchTimeSettingsJson(t.timeSettingsApi);l(d)}catch(d){console.error("Time settings status failed:",d),t.notify(d instanceof Error?d.message:"Time settings status failed.","error")}finally{e=!1,n=!1,i=!1,t.onStateChange()}}}async function p(){if(!(i||r)){r=!0;try{for(let d=0;d<t.clockSyncPollAttempts;d++){const y=await t.fetchTimeRuntimeJson(t.timeRuntimeApi);if(o(y.runtime),y.runtime?.time_valid===!0&&typeof y.runtime.current_time=="string"&&y.runtime.current_time.length>0)return;d<t.clockSyncPollAttempts-1&&await new Promise(S=>{setTimeout(S,t.clockSyncPollIntervalMs)})}}catch(d){console.error("Clock refresh after WiFi connect failed:",d)}finally{r=!1}}}async function w(){if(!(document.hidden||e||n||i)&&t.isSwitchChecked(t.clockModeToggle))try{const d=await t.fetchTimeRuntimeJson(t.timeRuntimeApi);o(d.runtime)}catch(d){console.error("Time runtime status failed:",d)}}function T(){const d=t.timezoneSelect.value.trim(),y=t.manualDateInput.value.trim(),S=t.manualTimeInput.value.trim(),a=t.parseClockTimeInputValue(t.wakeupTimeInput),f=t.parseClockTimeInputValue(t.bedtimeTimeInput);return!!y!=!!S?(t.notify("Provide both current date and time for a manual clock set.","error"),null):{timezoneName:d,manualDate:y,manualTime:S,wakeupMinutes:a??void 0,bedtimeMinutes:f??void 0}}async function C(d,y){return t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({timezone_name:d.timezoneName,enabled:y,manual_date:d.manualDate,manual_time:d.manualTime})})}async function z(){if(i||e||n){t.notifyClockMode("Clock mode update already in progress.","warning");return}const d=t.isSwitchChecked(t.clockModeToggle),y=!d,S=t.timezoneSelect.value.trim();t.setSwitchChecked(t.clockModeToggle,y),i=!0,t.notifyClockMode(y?"Enabling clock mode...":"Disabling clock mode...","info"),t.onStateChange();try{const a=await t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({enabled:y,timezone_name:y&&S?S:void 0})});l(a),t.notifyClockMode(a.message||(y?"Clock mode enabled.":"Clock mode disabled."),"success")}catch(a){t.setSwitchChecked(t.clockModeToggle,d),console.error("Clock mode toggle failed:",a);const f=a instanceof Error?a.message:"Failed to update clock mode.",x=f==="timezone_name required to enable clock"?"Please set timezone first.":f;f==="timezone_name required to enable clock"&&(t.setFieldError(t.timezoneSelect,"Select a timezone."),t.timezoneSelect.focus({preventScroll:!0})),t.notifyClockMode(x,"error")}finally{i=!1,t.onStateChange()}}async function N(){if(e||n||i||t.isTalkingClockModuleBusy()){t.notify("Time configuration update already in progress.","warning");return}const d=T();if(d){if(!d.timezoneName){t.setFieldError(t.timezoneSelect,"Select a timezone."),t.notify("Select a timezone.","error"),t.timezoneSelect.focus({preventScroll:!0});return}if(t.clearFieldError(t.timezoneSelect),t.isTalkingClockModuleActive()&&(d.wakeupMinutes===void 0||d.bedtimeMinutes===void 0)){t.notify("Wakeup and bedtime times are required for the talking clock module.","error"),t.focusTalkingClockTimeInput();return}e=!0,n=!0,i=!0,t.onTalkingClockBusyChange(t.isTalkingClockModuleActive()),t.notify("Saving time configuration...","info"),t.onStateChange();try{const y=await C(d,t.isSwitchChecked(t.clockModeToggle));if(l(y),t.isTalkingClockModuleActive()){const S=await t.patchTalkingClockSettings({wakeup_minutes:d.wakeupMinutes,bedtime_minutes:d.bedtimeMinutes});t.applyTalkingClockModuleSettings(S.settings)}t.notify("Time configuration saved successfully.","success")}catch(y){console.error("Timezone/location save failed:",y),t.notify(y instanceof Error?y.message:"Failed to save time configuration.","error")}finally{e=!1,n=!1,i=!1,t.onTalkingClockBusyChange(!1),t.onStateChange()}}}async function V(){if(e||n||i){t.notify("Time configuration update already in progress.","warning");return}e=!0,n=!0,i=!0,t.notify("Clearing timezone/location...","info"),t.onStateChange();try{const d=await t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({enabled:!1,timezone_name:""})});l(d),t.notify("Timezone/location cleared successfully.","success")}catch(d){console.error("Timezone/location clear failed:",d),t.notify(d instanceof Error?d.message:"Failed to clear timezone/location.","error")}finally{e=!1,n=!1,i=!1,t.onStateChange()}}return{applyTimeRuntimeStatus:o,applyTimeSettingsStatus:l,clearTimezoneLocation:V,fetchTimeRuntimeStatus:w,fetchTimeSettingsStatus:c,isClockBusy:()=>i,isLocationBusy:()=>n,isTimezoneBusy:()=>e,populateTimezoneOptions:u,refreshClockStatusAfterWifiConnect:p,saveTimezoneLocation:N,toggleClockModeSetting:z}}function hr(t,e){return t>=-50?e.fourBar:t>=-60?e.threeBar:t>=-70?e.twoBar:e.oneBar}function gr(t){let e=[],n="",i=!1,r="",s=!1,l=!1,o=!1,h=-1;function b(){t.wifiStatusCard.hidden=!1,t.wifiStatusCard.statusLabel=i?"Connected":"Disconnected",t.wifiStatusCard.network=i?r:""}function v(){const a=document.createElement("li");a.className="networks__list-empty-state",a.innerHTML=`${t.svgWithClass(t.wifiFindIcon,"wifi-find-icon")}<p>Scan for available networks</p>`,t.networkList.setEmptyState(a)}function m(){if(e.length===0){n="",h=-1;return}const a=e.findIndex(f=>f.ssid===n);if(a>=0){h=a;return}n="",h=-1}function g(){const a=t.networkList.getOptions();a.forEach((f,x)=>{f.setAttribute("aria-selected",String(n===e[x]?.ssid))}),h>=0&&h<a.length?t.networkList.setActiveDescendant(a[h].id):t.networkList.setActiveDescendant(null)}function u(){const a=e.find(f=>f.ssid===n);return a?!a.is_open:!0}function c(a){n=a,h=e.findIndex(f=>f.ssid===a),u()||t.clearFieldError(t.passwordInput),g(),t.onStateChange()}function p(){if(m(),t.networkList.clearItems(),e.length===0){v();return}e.forEach((a,f)=>{const x=document.createElement("li");x.className="networks__item",x.id=`network-option-${f}`,x.setAttribute("role","option"),x.setAttribute("tabindex","-1"),x.setAttribute("aria-selected",String(n===a.ssid));const _=document.createElement("span");_.className="networks__item-ssid",_.textContent=a.ssid;const k=document.createElement("div");if(k.className="networks__item-details",r===a.ssid&&i){const F=document.createElement("span");F.title="Currently connected",F.innerHTML=t.svgWithClass(t.checkIcon,"wifi-connected-icon"),k.appendChild(F)}const L=document.createElement("span");L.title=a.is_open?"Open":"Secured",a.is_open||(L.innerHTML=t.svgWithClass(t.securityIcon,"wifi-security-icon")),k.appendChild(L);const H=document.createElement("span");H.title=`Signal strength: ${a.signal_strength} (${a.rssi} dBm)`,H.innerHTML=t.svgWithClass(hr(a.rssi,t.signalIcons),"wifi-signal-icon"),k.appendChild(H),x.append(_,k),x.addEventListener("click",()=>{h=f,c(a.ssid),t.networkList.focus({preventScroll:!0})}),t.networkList.appendItem(x)}),g()}function w(a){const f=i,x=r;i=a.connected===!0,r=typeof a.ssid=="string"?a.ssid:"",b(),(f!==i||x!==r)&&p(),t.onConnectionStateChange?.({wasConnected:f,previousNetwork:x,isCurrentlyConnected:i,connectedNetwork:r})}async function T(){if(!s){s=!0,t.notify("Scanning for networks...","info"),t.onStateChange();try{let a="Scanning for networks...";for(let f=0;f<t.scanPollAttempts;f++){const x=await t.fetchPortalJson("/api/scan");if(a=x.message||a,x.scan_in_progress===!0){if(t.notify(a,"info"),f<t.scanPollAttempts-1){await t.delayMs(t.scanPollIntervalMs);continue}}else{e=Array.isArray(x.networks)?x.networks:[],t.notify(a||"Scan complete.","success"),p();return}}throw new Error("Network scan timed out. Please try again.")}catch(a){console.error("Scan failed:",a),t.notify(a instanceof Error?a.message:"Scan failed. Please try again.","error"),e=[],p()}finally{s=!1,t.onStateChange()}}}async function C(){if(!l){l=!0,t.onStateChange();try{const a=await t.fetchPortalJson("/api/status");w(a),s||t.notify(a.message||"Status updated.",a.connected?"success":"info")}catch(a){console.error("Status check failed:",a),t.notify(a instanceof Error?a.message:"Status check failed.","error")}finally{l=!1,t.onStateChange()}}}async function z(){if(!(o||!n)){if(u()&&t.passwordInput.value.trim().length===0){t.setFieldError(t.passwordInput,"Please enter a WiFi password."),t.passwordInput.focus({preventScroll:!0});return}if(t.passwordInput.value.length>ht){t.setFieldError(t.passwordInput,`WiFi password must be ${ht} characters or fewer.`),t.passwordInput.focus({preventScroll:!0});return}t.clearFieldError(t.passwordInput),o=!0,t.notify(`Connecting to ${n}...`,"info"),t.onStateChange();try{const a=await t.fetchPortalJson("/api/configure",{method:"POST",body:JSON.stringify({ssid:n,password:t.passwordInput.value})});t.notify(a.message||"Connection request sent.","info");for(let f=0;f<t.statusPollAttempts;f++){await t.delayMs(t.statusPollIntervalMs);const x=await t.fetchPortalJson("/api/status");if(w(x),x.connected){t.notify(x.message||"Connected.","success");break}}i||t.notify("Connection in progress...","info")}catch(a){console.error("Connection failed:",a),t.notify(a instanceof Error?a.message:"Connection failed.","error")}finally{o=!1,t.onStateChange()}}}async function N(){if(!(o||l||!i)){l=!0,t.notify("Disconnecting...","info"),t.onStateChange();try{const a=await t.fetchPortalJson("/api/disconnect",{method:"POST"}),f=i,x=r;i=!1,r="",b(),p(),t.notify(a.message||"Disconnected.","success"),t.onConnectionStateChange?.({wasConnected:f,previousNetwork:x,isCurrentlyConnected:i,connectedNetwork:r})}catch(a){console.error("Disconnect failed:",a),t.notify(a instanceof Error?a.message:"Disconnect failed.","error")}finally{l=!1,t.onStateChange()}}}function V(){if(S()){N();return}if(o||l){t.notify("WiFi status is busy. Please wait.","warning");return}if(!n){t.notify("Select a WiFi network first.","error"),t.networkList.focus({preventScroll:!0});return}if(u()&&t.passwordInput.value.trim().length===0){t.setFieldError(t.passwordInput,"Please enter a WiFi password."),t.notify("Please check if your password is correct.","error"),t.passwordInput.focus({preventScroll:!0});return}t.clearFieldError(t.passwordInput),z()}function d(){t.passwordInput.value?.trim().length&&t.clearFieldError(t.passwordInput),t.onStateChange()}function y(a){if(e.length!==0)switch(m(),a.key){case"Tab":break;case"ArrowDown":{a.preventDefault();const f=h<e.length-1?h+1:0;h=f,c(e[f].ssid),t.networkList.scrollOptionIntoView(f);break}case"ArrowUp":{a.preventDefault();const f=h>0?h-1:e.length-1;h=f,c(e[f].ssid),t.networkList.scrollOptionIntoView(f);break}case"Home":{a.preventDefault(),h=0,c(e[0].ssid),t.networkList.scrollOptionIntoView(0);break}case"End":{a.preventDefault();const f=e.length-1;h=f,c(e[f].ssid),t.networkList.scrollOptionIntoView(f);break}case"Enter":case" ":{a.preventDefault(),h>=0&&h<e.length&&c(e[h].ssid);break}}}function S(){return i&&r.length>0&&n===r}return{applyPortalStatus:w,checkStatus:C,connect:z,disconnect:N,getConnectedNetwork:()=>r,getSelectedNetwork:()=>n,handleConnectAction:V,handleListboxKeyDown:y,handlePasswordInput:d,isCheckingStatus:()=>l,isConnecting:()=>o,isCurrentlyConnected:()=>i,isScanning:()=>s,isSelectedConnected:S,renderNetworkList:p,requiresPassword:u,scanNetworks:T,updateWifiStatusCard:b}}function O(t,e){e().finally(()=>{!t.disabled&&t.offsetParent!==null&&setTimeout(()=>{!t.disabled&&t.offsetParent!==null&&t.focus()},0)})}function fr(t){const{controllers:e,dom:n,helpers:i}=t;function r(){n.wifiSettingsSheet.openBottomSheet(),e.wifiController.scanNetworks()}n.scanBtn.addEventListener("click",()=>{e.wifiController.scanNetworks()}),n.connectBtn.addEventListener("click",()=>{e.wifiController.handleConnectAction()}),n.wifiStatusCard.addEventListener("action",()=>{if(e.wifiController.isCurrentlyConnected()){e.wifiController.disconnect();return}r()}),n.wifiStatusCard.addEventListener("settings",()=>{r()}),n.wifiSettingsCloseBtn.addEventListener("click",()=>{n.wifiSettingsSheet.closeBottomSheet()}),n.passwordInput.addEventListener("input",()=>{e.wifiController.handlePasswordInput()}),n.networkList.addEventListener("keydown",s=>{e.wifiController.handleListboxKeyDown(s)}),n.geminiSaveBtn.addEventListener("click",()=>{O(n.geminiSaveBtn,()=>e.geminiController.saveGeminiKey())}),n.geminiClearBtn.addEventListener("click",()=>{O(n.geminiClearBtn,()=>e.geminiController.clearGeminiKey())}),n.geminiApiKeyInput.addEventListener("input",i.updateUi),n.timezoneLocationSaveBtn.addEventListener("click",()=>{if(!n.timezoneSelect.value.trim()){i.setFieldError(n.timezoneSelect,"Select a timezone."),i.setTimezoneLocationNotification("Select a timezone.","error"),n.timezoneSelect.focus({preventScroll:!0});return}i.clearFieldError(n.timezoneSelect),O(n.timezoneLocationSaveBtn,()=>e.timeController.saveTimezoneLocation())}),n.timezoneLocationClearBtn.addEventListener("click",()=>{O(n.timezoneLocationClearBtn,()=>e.timeController.clearTimezoneLocation())}),n.timezoneSelect.addEventListener("change",()=>{n.timezoneSelect.value?.trim().length&&i.clearFieldError(n.timezoneSelect),i.updateUi()}),n.manualDateInput.addEventListener("input",i.updateUi),n.manualTimeInput.addEventListener("input",i.updateUi)}function pr(t){const{controllers:e,dom:n}=t,i=e.wifiController.isScanning()||e.wifiController.isConnecting()||e.wifiController.isCheckingStatus(),r=e.wifiController.isSelectedConnected(),s=e.wifiController.getSelectedNetwork().trim(),l=s.length>0&&!r&&e.wifiController.requiresPassword(),o=r||s.length>0&&(!l||n.passwordInput.value.trim().length>0);n.scanBtn.disabled=i,n.connectBtn.disabled=i||!o,n.wifiStatusCard.actionDisabled=i,n.passwordInput.disabled=e.wifiController.isConnecting(),e.wifiController.isConnecting()?(n.connectBtn.textContent="Connecting...",n.wifiStatusCard.actionLabel="Connecting..."):r?(n.connectBtn.textContent="Disconnect",n.wifiStatusCard.actionLabel="Disconnect"):(n.connectBtn.textContent="Connect",n.wifiStatusCard.actionLabel=e.wifiController.isCurrentlyConnected()?"Disconnect":"Connect");const h=e.timeController.isTimezoneBusy()||e.timeController.isLocationBusy()||e.timeController.isClockBusy();n.timezoneSelect.disabled=h,n.manualDateInput.disabled=h,n.manualTimeInput.disabled=h,n.timezoneLocationSaveBtn.disabled=h||n.timezoneSelect.value.trim().length===0,n.timezoneLocationClearBtn.disabled=h||n.timezoneSelect.value.trim().length===0;const b=e.geminiController.isGeminiBusy(),v=e.geminiController.getGeminiHasKey();n.geminiApiKeyInput.readOnly=v||b,n.geminiApiKeyInput.disabled=b,n.geminiSaveBtn.disabled=b||v||n.geminiApiKeyInput.value.trim().length===0,n.geminiSaveBtn.hidden=v,n.geminiClearBtn.disabled=b||!v,n.geminiClearBtn.hidden=!v}ue();se();pe();we();Se();Be();ze();$e();Re();je();let rt=null;const A=Nn(),Kt=Pn(A.wifiSettingsNotification),mr=$t(A.geminiCard),Zt=$t(A.timezoneLocationCard),Gt=()=>document.createElement("input"),br=document.createElement("button"),vr=Gt(),yr=Gt(),wr=document.createElement("input");function I(){pr({controllers:{geminiController:st,timeController:B,wifiController:q},dom:A})}const st=dr({fetchGeminiModuleJson:Ot,fetchOpenAiModuleJson:()=>Promise.resolve({}),geminiApiKeyInput:A.geminiApiKeyInput,isGeminiModuleActive:()=>!0,isOpenAiModuleActive:()=>!1,notifyGemini:mr,notifyOpenAi:()=>{},openAiApiKeyInput:wr,updateButtons:I}),B=ur({applyTalkingClockModuleSettings:()=>{},bedtimeTimeInput:yr,clearFieldError:it,clockModeToggle:br,clockSyncPollAttempts:pn,clockSyncPollIntervalMs:fn,fetchTimeRuntimeJson:Mn,fetchTimeSettingsJson:Bn,fetchTimezoneListJson:zn,focusTalkingClockTimeInput:()=>{},buildTimezoneLabelMap:Rn,formatTimezoneLabel:Kn,isSwitchChecked:$n,isTalkingClockModuleActive:()=>!1,isTalkingClockModuleBusy:()=>!1,manualDateInput:A.manualDateInput,manualTimeInput:A.manualTimeInput,notifyClockMode:()=>{},notify:Zt,onStateChange:I,onTalkingClockBusyChange:()=>{},parseClockTimeInputValue:Zn,patchTalkingClockSettings:()=>Promise.resolve({success:!0}),setFieldError:ot,setSwitchChecked:On,timeRuntimeApi:xn,timeSettingsApi:wn,timezoneSelect:A.timezoneSelect,wakeupTimeInput:vr}),q=gr({checkIcon:sn,clearFieldError:it,delayMs:Vn,fetchPortalJson:In,networkList:A.networkList,notify:Kt,onConnectionStateChange:({wasConnected:t,isCurrentlyConnected:e})=>{!t&&e&&B.refreshClockStatusAfterWifiConnect()},onStateChange:I,passwordInput:A.passwordInput,scanPollAttempts:vn,scanPollIntervalMs:bn,securityIcon:Xe,setFieldError:ot,signalIcons:{oneBar:Qe,twoBar:tn,threeBar:en,fourBar:nn},statusPollAttempts:gn,statusPollIntervalMs:hn,svgWithClass:Dn,wifiFindIcon:rn,wifiStatusCard:A.wifiStatusCard}),Wt=document.getElementById("firmwareUpdateCard"),Jt=Jn({card:Wt,fileInput:document.getElementById("firmwareFileInput"),uploadBtn:document.getElementById("firmwareUploadBtn"),versionText:document.getElementById("firmwareVersionText")}),jt=document.getElementById("booksCard"),xr=ar({card:jt,fileInput:document.getElementById("bookFileInput"),uploadBtn:document.getElementById("bookUploadBtn"),list:document.getElementById("booksList"),summary:document.getElementById("booksSummary")}),Yt=document.getElementById("recordingsCard"),Tr=cr({card:Yt,list:document.getElementById("recordingsList"),summary:document.getElementById("recordingsSummary"),refreshBtn:document.getElementById("recordingsRefreshBtn"),allTranscriptsBtn:document.getElementById("recordingsAllTranscriptsBtn")});function $(){if(!rt)return;const t=document.documentElement,e=t.scrollHeight>window.innerHeight+1,n=window.scrollY+window.innerHeight>=t.scrollHeight-1;rt.setVisible(e&&!n)}function Sr(){A.wifiStatusCard.iconSvg=Ye,A.geminiCard.iconSvg=on,A.timezoneLocationCard.iconSvg=an,Wt.iconSvg=ln,Jt.bind(),jt.iconSvg=cn,xr.bind(),Yt.iconSvg=dn,Tr.bind(),q.renderNetworkList(),document.body&&(rt=ee({mount:document.body,mode:"fixed",position:"bottom",height:"6rem",width:"100vw",strength:1.8,divCount:5,curve:"bezier",exponential:!0,opacity:1,zIndex:20,className:"page-gradual-blur",fallbackColor:"var(--color-bg-selected)"}),$(),window.addEventListener("scroll",$,{passive:!0}),window.addEventListener("resize",$),typeof ResizeObserver<"u"&&new ResizeObserver(()=>{$()}).observe(document.body)),I(),q.updateWifiStatusCard(),Kt(""),fr({controllers:{geminiController:st,timeController:B,wifiController:q},dom:A,helpers:{clearFieldError:it,setFieldError:ot,setTimezoneLocationNotification:Zt,updateUi:I}}),Er(),window.setInterval(()=>{B.fetchTimeRuntimeStatus()},mn)}async function Er(){await Promise.allSettled([B.populateTimezoneOptions(),B.fetchTimeSettingsStatus(),q.checkStatus(),Ar(),Jt.refreshVersion()])}async function Ar(){try{const t=await Ot("/api/settings/gemini");st.applyGeminiSettings(t.settings)}catch(t){console.error("Gemini settings status failed:",t)}finally{I()}}Sr();
