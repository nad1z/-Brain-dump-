(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function n(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(o){if(o.ep)return;o.ep=!0;const a=n(o);fetch(o.href,a)}})();const $t={mode:"absolute",position:"bottom",height:"6rem",strength:2,divCount:5,exponential:!1,opacity:1,curve:"linear",zIndex:2},rt={linear:e=>e,bezier:e=>e*e*(3-2*e),"ease-in":e=>e*e,"ease-out":e=>1-Math.pow(1-e,2),"ease-in-out":e=>e<.5?2*e*e:1-Math.pow(-2*e+2,2)/2};function Ht(e){switch(e){case"top":return"to top";case"left":return"to left";case"right":return"to right";default:return"to bottom"}}function Ft(){if(typeof CSS>"u"||typeof CSS.supports!="function")return!1;const e=CSS.supports("backdrop-filter","blur(1px)")||CSS.supports("-webkit-backdrop-filter","blur(1px)"),t=CSS.supports("mask-image","linear-gradient(to bottom, transparent, black)")||CSS.supports("-webkit-mask-image","linear-gradient(to bottom, transparent, black)");return e&&t}function Kt(e){const t={...$t,...e},n=document.createElement("div"),i=document.createElement("div"),o=Ht(t.position),a=Ft(),l=t.position==="top"||t.position==="bottom";if(n.className="gradual-blur",t.className&&n.classList.add(t.className),a||(n.classList.add("gradual-blur--fallback"),n.style.background=`linear-gradient(${o}, transparent 0%, ${t.fallbackColor||"rgba(255, 255, 255, 0.95)"} 100%)`),n.style.position=t.mode,n.style.pointerEvents="none",n.style.zIndex=String(t.zIndex),n.style.opacity="0",n.style.borderRadius="inherit",l?(n.style.height=t.height,n.style.width=t.width||"100%",n.style[t.position]="0",t.mode==="fixed"?(n.style.left="50%",n.style.right="auto",n.style.transform="translateX(-50%)"):(n.style.left="0",n.style.right="0")):(n.style.width=t.width||t.height,n.style.height="100%",n.style.top="0",n.style.bottom="0",n.style[t.position]="0"),i.className="gradual-blur__inner",n.appendChild(i),a){const c=100/t.divCount,d=rt[t.curve]||rt.linear;for(let m=1;m<=t.divCount;m+=1){const v=document.createElement("div"),C=d(m/t.divCount);let f=0;t.exponential?f=Math.pow(2,C*4)*.0625*t.strength:f=.0625*(C*t.divCount+1)*t.strength;const p=Math.round((c*m-c)*10)/10,g=Math.round(c*m*10)/10,w=Math.round((c*m+c)*10)/10,A=Math.round((c*m+c*2)*10)/10;let s=`transparent ${p}%, black ${g}%`;w<=100&&(s+=`, black ${w}%`),A<=100&&(s+=`, transparent ${A}%`),v.className="gradual-blur__layer",v.style.maskImage=`linear-gradient(${o}, ${s})`,v.style.webkitMaskImage=`linear-gradient(${o}, ${s})`,v.style.backdropFilter=`blur(${f.toFixed(3)}rem)`,v.style.setProperty("-webkit-backdrop-filter",`blur(${f.toFixed(3)}rem)`),v.style.opacity=String(t.opacity),i.appendChild(v)}}return window.getComputedStyle(t.mount).position==="static"&&(t.mount.style.position="relative"),t.mount.appendChild(n),{element:n,setVisible(c){n.style.opacity=c?"1":"0"},destroy(){n.remove()}}}const Rt=`:host {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 1.75rem;
  padding: 0 var(--spacing-sm);
  border: var(--border-01) solid var(--color-border);
  border-radius: var(--radius-full);
  background-color: var(--color-bg-selected);
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  white-space: nowrap;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: inherit;
}
`,Ut=document.createElement("template");Ut.innerHTML=`
  <style>${Rt}</style>
  <span class="badge">
    <slot></slot>
  </span>
`;const Gt=`:host {
  display: inline-flex;
  height: 44px;
  width: auto;
  min-width: 96px;
  vertical-align: middle;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

button {
  all: unset;
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  width: auto;
  min-height: 44px;
  min-width: 96px;
  padding: var(--spacing-3xs) var(--spacing-sm);
  border: var(--border-01) solid transparent;
  border-radius: var(--button-radius);
  background-color: var(--color-text-secondary);
  color: var(--color-text-inverse);
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  line-height: 1.25;
  text-align: center;
}

button:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

button:disabled {
  background-color: var(--color-bg-mute);
  color: var(--color-text-mute);
  cursor: default;
}

:host([variant="primary"]) button {
  background-color: var(--color-bg-brand);
  color: var(--color-text-inverse);
}

:host([variant="primary"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-bg-brand-hover);
}

:host([variant="secondary"]) button {
  background-color: var(--color-bg-active);
  color: var(--color-fg-active);
}

:host([variant="secondary"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-bg-active);
  color: var(--color-fg-active);
}

:host([variant="outline"]) button {
  background-color: transparent;
  border-color: var(--color-border);
  color: var(--color-text-secondary);
}

:host([variant="outline"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-border);
  border-color: var(--color-border);
}

:host([variant="ghost"]) button {
  background-color: transparent;
  border-color: transparent;
  color: var(--color-text-secondary);
}

:host([variant="ghost"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-overlay);
}

:host([inverse]) button {
  color: var(--color-text-inverse);
}

:host([variant="outline"][inverse]) button {
  border-color: var(--color-text-inverse);
}

:host([variant="outline"][inverse]) button:not(:disabled):is(:hover, :active),
:host([variant="ghost"][inverse]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-overlay);
  border-color: var(--color-text-inverse);
}

:host([rounded]) button {
  border-radius: var(--radius-full);
  padding: var(--spacing-xs) var(--spacing-lg);
}

::slotted(svg) {
  flex-shrink: 0;
}
`,K="ui-button",ft=document.createElement("template");ft.innerHTML=`
  <style>${Gt}</style>
  <button type="button" part="button">
    <slot></slot>
  </button>
`;function st(e){return e==="submit"||e==="reset"?e:"button"}class Zt extends HTMLElement{static get observedAttributes(){return["disabled","aria-label","type"]}constructor(){super();const t=this.attachShadow({mode:"open",delegatesFocus:!0});t.append(ft.content.cloneNode(!0)),this.button=t.querySelector("button")}connectedCallback(){this.dataset.component=K,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(t){this.toggleAttribute("disabled",t)}get type(){return st(this.getAttribute("type"))}set type(t){this.setAttribute("type",st(t))}focus(t){this.button.focus(t)}click(){this.button.click()}syncAttributes(){this.button.disabled=this.disabled,this.button.type=this.type,this.tabIndex=this.disabled?-1:0;const t=this.getAttribute("aria-label");t?this.button.setAttribute("aria-label",t):this.button.removeAttribute("aria-label")}}function Wt(){customElements.get(K)||customElements.define(K,Zt)}const Jt=`:host {
  display: contents;
}

:host([hidden]) {
  display: none;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.bottom-sheet-dialog {
  position: fixed;
  inset: auto 0 0 0;
  display: flex;
  width: 100%;
  max-height: 96vh;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-text);
  overflow: visible;
  transform: translateY(100%);
  max-width: 768px;
  margin: auto;
}

.bottom-sheet-dialog:not([open]) {
  pointer-events: none;
  visibility: hidden;
}

.bottom-sheet-dialog[open] {
  animation: bottom-sheet-open 320ms ease forwards;
}

.bottom-sheet-dialog.closing {
  animation: bottom-sheet-close 320ms ease forwards;
}

.bottom-sheet-dialog::backdrop {
  background: var(--color-overlay);
  backdrop-filter: blur(4px) saturate(180%);
  -webkit-backdrop-filter: blur(4px) saturate(180%);
}

.bottom-sheet-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  border-top: var(--border-01) solid var(--color-border);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  background: var(--color-bg);
  box-shadow: 0 -8px 24px rgb(0 0 0 / 0.16);
  overflow: hidden;
}

.bottom-sheet-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  padding-right: var(--spacing-sm);
  border-bottom: var(--border-01) solid var(--color-border);
}

.bottom-sheet-header-copy {
  display: grid;
  gap: var(--spacing-3xs);
  min-width: 0;
}

.bottom-sheet-title,
.bottom-sheet-description {
  margin: 0;
}

.bottom-sheet-title {
  font-size: var(--font-size-heading);
  font-weight: var(--font-weight-semibold);
  line-height: 1.2;
}

.bottom-sheet-description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-label);
  line-height: 1.5;
}

.bottom-sheet-header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.bottom-sheet-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-height: 0;
  padding: var(--spacing-md);
  overflow: auto;
}

.bottom-sheet-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  /* Extra bottom padding so the footer buttons clear the iOS home indicator / safe area and
     aren't clipped at the bottom of the sheet. */
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-6xl);
  border-top: var(--border-01) solid var(--color-border);
  background: var(--color-bg);
}

.bottom-sheet-title[hidden],
.bottom-sheet-description[hidden],
.bottom-sheet-header-actions[hidden],
.bottom-sheet-footer[hidden] {
  display: none;
}

::slotted([slot="footer"]) {
  flex-shrink: 0;
}

@keyframes bottom-sheet-open {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes bottom-sheet-close {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(100%);
  }
}
`,R="ui-bottom-sheet",mt=document.createElement("template"),jt=["a[href]","button:not([disabled])","details summary","input:not([disabled])","select:not([disabled])","textarea:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(", ");let $=0;mt.innerHTML=`
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
`;function at(e){const t=getComputedStyle(e);return e.hasAttribute("hidden")||e.getAttribute("aria-hidden")==="true"||t.display==="none"||t.visibility==="hidden"?!1:e.tagName.includes("-")?t.display==="contents"||!!e.getClientRects().length:e.offsetParent!==null||t.position==="fixed"||!!e.getClientRects().length}function H(e){if(!e.shadowRoot)return[];const t=[],n=new Set;function i(o){if(o instanceof HTMLSlotElement){const a=o.assignedElements({flatten:!0});a.length>0?a.forEach(i):Array.from(o.children).forEach(i);return}if(o instanceof HTMLElement&&at(o)){if(o.shadowRoot){Array.from(o.shadowRoot.childNodes).forEach(i);return}!n.has(o)&&o.matches(jt)&&at(o)&&(n.add(o),t.push(o)),Array.from(o.children).forEach(i)}}return Array.from(e.shadowRoot.childNodes).forEach(i),t}function Yt(e,t){if(t===e||t.contains(e))return!0;let n=e;for(;n;){if(n===t)return!0;const i=n.getRootNode();if(!(i instanceof ShadowRoot))break;n=i.host}return!1}function F(e){return e.assignedNodes({flatten:!0}).some(t=>t.nodeType===Node.TEXT_NODE?t.textContent?.trim().length:t.nodeType===Node.ELEMENT_NODE)}class Xt extends HTMLElement{constructor(){super(),this.isAnimatingClose=!1,this.isSyncingOpenAttribute=!1,this.previousDocumentOverflow="",this.previousBodyOverflow="",this.triggerElement=null;const t=this.attachShadow({mode:"open"});t.append(mt.content.cloneNode(!0)),this.dialog=t.querySelector(".bottom-sheet-dialog"),this.titleElement=t.querySelector(".bottom-sheet-title"),this.descriptionElement=t.querySelector(".bottom-sheet-description"),this.headerActionsContainer=t.querySelector(".bottom-sheet-header-actions"),this.footerContainer=t.querySelector(".bottom-sheet-footer"),this.floatingContainer=t.querySelector(".bottom-sheet-floating"),this.headerActionsSlot=t.querySelector('slot[name="header-actions"]'),this.footerSlot=t.querySelector('slot[name="footer"]'),this.floatingSlot=t.querySelector('slot[name="floating-content"]'),$+=1,this.titleId=`bottomSheetTitle${$}`,this.descriptionId=`bottomSheetDescription${$}`,this.handleAnimationEndBound=this.handleAnimationEnd.bind(this),this.handleCancelBound=this.handleCancel.bind(this),this.handleClickBound=this.handleClick.bind(this),this.handleKeyDownBound=this.handleKeyDown.bind(this),this.handleSlotChangeBound=this.syncSlotVisibility.bind(this)}static get observedAttributes(){return["description","open","title"]}connectedCallback(){this.dataset.component=R,this.dialog.addEventListener("animationend",this.handleAnimationEndBound),this.dialog.addEventListener("cancel",this.handleCancelBound),this.dialog.addEventListener("click",this.handleClickBound),this.dialog.addEventListener("keydown",this.handleKeyDownBound),this.addEventListener("keydown",this.handleKeyDownBound),this.headerActionsSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.footerSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.floatingSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.syncAttributes(),this.syncSlotVisibility(),this.hasAttribute("open")&&this.openInternal()}disconnectedCallback(){this.dialog.removeEventListener("animationend",this.handleAnimationEndBound),this.dialog.removeEventListener("cancel",this.handleCancelBound),this.dialog.removeEventListener("click",this.handleClickBound),this.dialog.removeEventListener("keydown",this.handleKeyDownBound),this.removeEventListener("keydown",this.handleKeyDownBound),this.headerActionsSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.footerSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.floatingSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.dialog.open&&this.dialog.close(),this.unlockDocumentScroll()}attributeChangedCallback(t){if(t==="open"){if(!this.isConnected||this.isSyncingOpenAttribute)return;this.hasAttribute("open")?this.openInternal():this.startClosing();return}this.syncAttributes()}get open(){return this.hasAttribute("open")}set open(t){this.toggleAttribute("open",t)}openBottomSheet(){this.open&&!this.isAnimatingClose||(this.triggerElement=document.activeElement instanceof HTMLElement?document.activeElement:null,this.open=!0)}closeBottomSheet(){!this.open&&!this.dialog.open||(this.open=!1)}focus(t){(H(this)[0]??this.dialog).focus(t)}syncAttributes(){const t=this.getAttribute("title")||"",n=this.getAttribute("description")||"";this.titleElement.id=this.titleId,this.titleElement.textContent=t,this.titleElement.hidden=t.length===0,this.descriptionElement.id=this.descriptionId,this.descriptionElement.textContent=n,this.descriptionElement.hidden=n.length===0,t.length>0?this.dialog.setAttribute("aria-labelledby",this.titleId):this.dialog.removeAttribute("aria-labelledby"),n.length>0?this.dialog.setAttribute("aria-describedby",this.descriptionId):this.dialog.removeAttribute("aria-describedby")}syncSlotVisibility(){this.headerActionsContainer.hidden=!F(this.headerActionsSlot),this.footerContainer.hidden=!F(this.footerSlot),this.floatingContainer.hidden=!F(this.floatingSlot)}handleAnimationEnd(t){!this.isAnimatingClose||t.target!==this.dialog||(this.dialog.classList.remove("closing"),this.dialog.close(),this.isAnimatingClose=!1,this.unlockDocumentScroll(),this.restoreTriggerFocus(),this.dispatchEvent(new Event("close",{bubbles:!0,composed:!0})))}handleCancel(t){t.preventDefault(),this.closeBottomSheet()}handleClick(t){this.isAnimatingClose||t.target===this.dialog&&this.closeBottomSheet()}handleKeyDown(t){if(t.currentTarget===this&&t.composedPath().includes(this.dialog))return;if(t.key==="Escape"){t.preventDefault(),this.closeBottomSheet();return}if(t.key!=="Tab")return;const n=H(this);if(n.length===0){t.preventDefault(),this.dialog.focus();return}const i=t.composedPath()[0],o=i instanceof HTMLElement?i:document.activeElement instanceof HTMLElement?document.activeElement:null,a=o===null?-1:n.findIndex(m=>Yt(o,m)),l=t.shiftKey?-1:1,c=t.shiftKey?n.length-1:0,d=a===-1?c:(a+l+n.length)%n.length;t.preventDefault(),n[d].focus()}openInternal(){this.syncAttributes(),this.syncSlotVisibility(),this.isAnimatingClose&&(this.dialog.classList.remove("closing"),this.isAnimatingClose=!1),this.dialog.open?this.lockDocumentScroll():(this.lockDocumentScroll(),this.dialog.showModal()),requestAnimationFrame(()=>{if(!this.dialog.open)return;(H(this)[0]??this.dialog).focus()})}startClosing(){!this.dialog.open||this.isAnimatingClose||(this.dialog.classList.add("closing"),this.isAnimatingClose=!0)}lockDocumentScroll(){this.previousDocumentOverflow.length===0&&this.previousBodyOverflow.length===0&&(this.previousDocumentOverflow=document.documentElement.style.overflow,this.previousBodyOverflow=document.body.style.overflow),document.documentElement.style.overflow="hidden",document.body.style.overflow="hidden"}unlockDocumentScroll(){document.documentElement.style.overflow=this.previousDocumentOverflow,document.body.style.overflow=this.previousBodyOverflow,this.previousDocumentOverflow="",this.previousBodyOverflow=""}restoreTriggerFocus(){this.triggerElement&&document.contains(this.triggerElement)&&this.triggerElement.focus(),this.triggerElement=null}}function Qt(){customElements.get(R)||customElements.define(R,Xt)}const te=`:host {
  display: block;
  width: 100%;
}

:host([hidden]) {
  display: none;
  visibility: hidden;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

h2 {
  margin: 0;
}

.card-component {
  background-color: var(--color-bg-input);
  border-radius: var(--radius-lg);
  border: var(--border-01) solid var(--color-border);
  box-shadow: none;
}

.card-component__container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--color-bg);
  border-radius: inherit;
  padding: var(--spacing-lg);
  box-shadow: none;
}

.card-component__header {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: var(--spacing-sm);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-component__icon {
  width: 24px;
  height: 24px;
  fill: var(--color-text-secondary);
  margin-right: var(--spacing-xs);
}

.card-component__title {
  font-size: var(--font-size-heading);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.card-component__content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: var(--spacing-xs);
  gap: var(--spacing-md);
}

.connection-notification {
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-secondary);
  font-size: var(--font-size-label);
}

.connection-notification[hidden] {
  display: none;
}

.connection-notification[data-status="warning"] {
  color: var(--color-text-warning);
}

.connection-notification[data-status="success"] {
  color: var(--color-meter-green);
}

.connection-notification[data-status="error"],
.connection-notification[data-status="danger"] {
  color: var(--color-text-danger);
}

.card-actions {
  margin-top: var(--spacing-xl);
}

.wifi-connection-form__actions {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--spacing-sm);
}

.card-component__footer[hidden] {
  display: none;
}

::slotted(.card-component__description) {
  font-size: var(--font-size-label);
  line-height: 1.5;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-secondary);
}

::slotted([slot="footer"]) {
  width: auto;
}
`,U="ui-card",bt=document.createElement("template");bt.innerHTML=`
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
`;function ee(e,t){return e.includes("class=")?e.replace("<svg",`<svg class="${t}"`):e.replace("<svg",`<svg class="${t}"`)}class ne extends HTMLElement{static get observedAttributes(){return["title"]}constructor(){super();const t=this.attachShadow({mode:"open"});t.append(bt.content.cloneNode(!0)),this.footerContainer=t.querySelector(".card-component__footer"),this.footerSlot=t.querySelector('slot[name="footer"]'),this.footerSlot.addEventListener("slotchange",()=>{this.syncFooterVisibility()}),this.iconElement=t.querySelector(".card-component__icon"),this.notificationElement=t.querySelector(".connection-notification"),this.titleElement=t.querySelector(".card-component__title")}connectedCallback(){this.dataset.component=U,this.syncAttributes(),this.syncFooterVisibility()}attributeChangedCallback(){this.syncAttributes()}get iconSvg(){return this.iconElement.innerHTML}set iconSvg(t){this.iconElement.innerHTML=t?ee(t,"card-component__icon"):""}setNotification(t,n="info"){if(!t){this.notificationElement.hidden=!0,this.notificationElement.textContent="",this.notificationElement.removeAttribute("data-status"),this.notificationElement.setAttribute("role","status"),this.notificationElement.setAttribute("aria-live","polite");return}this.notificationElement.hidden=!1,this.notificationElement.textContent=t,this.notificationElement.setAttribute("data-status",n),n==="error"||n==="danger"?(this.notificationElement.setAttribute("role","alert"),this.notificationElement.setAttribute("aria-live","assertive")):n==="warning"?(this.notificationElement.setAttribute("role","alert"),this.notificationElement.setAttribute("aria-live","polite")):(this.notificationElement.setAttribute("role","status"),this.notificationElement.setAttribute("aria-live","polite"))}syncAttributes(){this.titleElement.textContent=this.getAttribute("title")||""}syncFooterVisibility(){const t=this.footerSlot.assignedElements({flatten:!0}).length>0;this.footerContainer.hidden=!t}}function ie(){customElements.get(U)||customElements.define(U,ne)}const oe=`:host {
  display: block;
  width: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.form-control {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-control label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  margin-bottom: var(--spacing-xs);
}

.form-control__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--spacing-sm);
}

.duration-fields {
  align-items: center;
}

.duration-fields ui-input {
  min-width: 0;
  flex: 1 1 0;
}
`,re=document.createElement("template");re.innerHTML=`
  <style>${oe}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper duration-fields">
      <ui-input variant="number" inputmode="numeric"></ui-input>
      <ui-input variant="number" inputmode="numeric"></ui-input>
    </div>
  </div>
`;const se=`:host {
  display: block;
  width: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

input,
textarea {
  margin: 0;
  font: inherit;
  color: inherit;
  -webkit-user-select: auto;
}

p {
  margin: 0;
}

.form-control {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-control label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  margin-bottom: var(--spacing-xs);
}

.form-control__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--spacing-sm);
}

.form-control__input-wrapper input {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border: var(--border-01) solid var(--color-border);
  min-height: 44px;
  padding: var(--spacing-sm);
  border-radius: var(--input-radius);
  background-color: var(--color-bg-input);
  color: var(--color-text);
  font-size: var(--font-size-label);
}

.form-control__input-wrapper input:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.form-control__input-wrapper input::file-selector-button {
  background-color: transparent;
  border: var(--border-01) solid var(--color-border);
  background-color: var(--color-bg);
  color: var(--color-text);
  border-radius: var(--radius-sm);
  min-height: 24px;
  font-size: var(--font-size-label);
  padding: var(--spacing-xs) var(--spacing-md);
  margin-right: var(--spacing-md);
}

.progress-bar {
  position: relative;
  width: 100%;
}

.progress-bar[hidden] {
  display: none;
}

.progress-bar progress[value] {
  -webkit-appearance: none;
  appearance: none;
  border: none;
  width: 100%;
  height: 12px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-top: var(--spacing-sm);
}

.progress-bar progress[value]::-webkit-progress-bar {
  background-color: var(--color-bg-active);
  border-radius: var(--radius-lg);
}

.progress-bar progress[value]::-webkit-progress-value {
  background-color: var(--color-meter-green);
  border-radius: var(--radius-lg);
}

.progress-bar__message {
  font-size: var(--font-size-label);
  line-height: 1.25;
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
}

.form-helper-text {
  margin-top: var(--spacing-lg);
  font-size: var(--font-size-caption);
  line-height: 1.5;
  color: var(--color-text-secondary);
}
`,G="ui-file-upload",vt=document.createElement("template");vt.innerHTML=`
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
`;class ae extends HTMLElement{static get observedAttributes(){return["accept","aria-label","disabled","label","multiple","name","progress-max","progress-message","progress-value","warning-text"]}constructor(){super();const t=this.attachShadow({mode:"open",delegatesFocus:!0});t.append(vt.content.cloneNode(!0)),this.helperText=t.querySelector(".form-helper-text"),this.input=t.querySelector("input"),this.labelElement=t.querySelector("label"),this.progressBar=t.querySelector("progress"),this.progressContainer=t.querySelector(".progress-bar"),this.progressMessage=t.querySelector(".progress-bar__message"),this.input.addEventListener("change",n=>{n.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.input.addEventListener("input",n=>{n.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))})}connectedCallback(){this.dataset.component=G,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get accept(){return this.input.accept}set accept(t){this.setAttribute("accept",t)}get disabled(){return this.hasAttribute("disabled")}set disabled(t){this.toggleAttribute("disabled",t)}get files(){return this.input.files}get progressHidden(){return this.progressContainer.hidden}set progressHidden(t){this.progressContainer.hidden=t}get progressMax(){return this.progressBar.max}set progressMax(t){this.progressBar.max=t}get progressMessageText(){return this.progressMessage.textContent||""}set progressMessageText(t){this.progressMessage.textContent=t}get progressValue(){return this.progressBar.value}set progressValue(t){this.progressBar.value=t}get value(){return this.input.value}get warningText(){return this.helperText.textContent||""}set warningText(t){this.helperText.textContent=t}focus(t){this.input.focus(t)}syncAttributes(){const t=this.id||"file-upload",n=this.getAttribute("label")||"",i=this.getAttribute("warning-text")||"";this.input.id=t,this.input.accept=this.getAttribute("accept")||"",this.input.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.input.multiple=this.hasAttribute("multiple"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("name"),this.hasAttribute("progress-max")&&(this.progressBar.max=Number(this.getAttribute("progress-max"))||100),this.hasAttribute("progress-value")&&(this.progressBar.value=Number(this.getAttribute("progress-value"))||0),this.hasAttribute("progress-message")&&(this.progressMessage.textContent=this.getAttribute("progress-message")||""),this.labelElement.htmlFor=t,this.labelElement.textContent=n,this.labelElement.hidden=n.length===0,this.helperText.textContent=i,this.helperText.hidden=i.length===0}syncStringAttribute(t){const n=this.getAttribute(t);if(n===null){this.input.removeAttribute(t);return}this.input.setAttribute(t,n)}}function le(){customElements.get(G)||customElements.define(G,ae)}const ce=`:host {
  display: inline-flex;
  width: 44px;
  height: 44px;
  min-width: 44px;
  vertical-align: middle;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

button {
  all: unset;
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  border: var(--border-01) solid transparent;
  border-radius: var(--button-radius);
  background-color: var(--color-text-secondary);
  color: var(--color-text-inverse);
  cursor: pointer;
}

button:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

button:disabled {
  background-color: var(--color-bg-mute);
  color: var(--color-text-mute);
  cursor: default;
}

:host([variant="primary"]) button {
  background-color: var(--color-bg-brand);
  color: var(--color-text-inverse);
}

:host([variant="primary"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-bg-brand-hover);
}

:host([variant="secondary"]) button {
  background-color: var(--color-bg-active);
  color: var(--color-fg-active);
}

:host([variant="secondary"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-bg-active);
  color: var(--color-fg-active);
}

:host([variant="outline"]) button {
  background-color: transparent;
  border-color: var(--color-border);
  color: var(--color-text-secondary);
}

:host([variant="outline"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-border);
  border-color: var(--color-border);
}

:host([variant="ghost"]) button {
  background-color: transparent;
  border-color: transparent;
  color: var(--color-text-secondary);
}

:host([variant="ghost"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-overlay);
}

:host([inverse]) button {
  color: var(--color-text-inverse);
}

:host([variant="outline"][inverse]) button {
  border-color: var(--color-text-inverse);
}

:host([variant="outline"][inverse]) button:not(:disabled):is(:hover, :active),
:host([variant="ghost"][inverse]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-overlay);
  border-color: var(--color-text-inverse);
}

:host([rounded]) button {
  border-radius: var(--radius-full);
}

::slotted(svg) {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  fill: currentColor;
}
`,Z="ui-icon-button",yt=document.createElement("template");yt.innerHTML=`
  <style>${ce}</style>
  <button type="button" part="button">
    <slot></slot>
  </button>
`;function lt(e){return e==="submit"||e==="reset"?e:"button"}class de extends HTMLElement{static get observedAttributes(){return["disabled","aria-label","type"]}constructor(){super();const t=this.attachShadow({mode:"open",delegatesFocus:!0});t.append(yt.content.cloneNode(!0)),this.button=t.querySelector("button")}connectedCallback(){this.dataset.component=Z,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(t){this.toggleAttribute("disabled",t)}get type(){return lt(this.getAttribute("type"))}set type(t){this.setAttribute("type",lt(t))}focus(t){this.button.focus(t)}click(){this.button.click()}syncAttributes(){this.button.disabled=this.disabled,this.button.type=this.type,this.tabIndex=this.disabled?-1:0;const t=this.getAttribute("aria-label");t?this.button.setAttribute("aria-label",t):this.button.removeAttribute("aria-label")}}function ue(){customElements.get(Z)||customElements.define(Z,de)}const he='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>',ge='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>',pe=`:host {
  display: block;
  width: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

input,
button,
select,
textarea {
  margin: 0;
  font: inherit;
  color: inherit;
}

input,
textarea {
  -webkit-user-select: auto;
}

p {
  margin: 0;
}

.form-control__input-wrapper input,
.password-toggle-btn {
  font: inherit;
}

.form-control {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-control label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  margin-bottom: var(--spacing-xs);
}

.form-helper-text {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-caption);
  line-height: 1.25;
  color: var(--color-text-secondary);
}

.form-control__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--spacing-sm);
}

.form-control__input-wrapper input {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border: var(--border-01) solid var(--color-border);
  min-height: 44px;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--input-radius);
  background-color: var(--color-bg-input);
  color: var(--color-text);
  font-size: var(--font-size-label);
  line-height: normal;
  appearance: none;
  -webkit-appearance: none;
}

.form-control__input-wrapper input::placeholder {
  color: var(--color-text-mute);
}

.form-control__input-wrapper input[type="time"]::-webkit-calendar-picker-indicator,
.form-control__input-wrapper input[type="date"]::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}

.form-control__input-wrapper input:focus-visible,
.password-toggle-btn:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

:host(.error) input,
:host([invalid]) input,
:host([aria-invalid="true"]) input,
.form-control__input-wrapper input.error {
  outline: var(--focus-ring-width) solid var(--color-meter-red);
  outline-offset: var(--focus-ring-offset);
}

.duration-fields {
  align-items: center;
}

.duration-fields input {
  min-width: 0;
  flex: 1 1 0;
}

.duration-fields__unit {
  flex: 0 0 auto;
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

.duration-fields__unit[hidden] {
  display: none;
}

.password-toggle-btn {
  position: absolute;
  right: 6px;
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: var(--radius-xs);
  background-color: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}

.password-toggle-btn:disabled {
  color: var(--color-text-mute);
  cursor: default;
}

.password-toggle-btn:not(:disabled):is(:hover, :active) {
  background-color: var(--color-overlay);
}

.password-icon {
  width: 24px;
  height: 24px;
  fill: var(--color-text-secondary);
}
`,W="ui-input",wt=document.createElement("template");wt.innerHTML=`
  <style>${pe}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <input />
      <span class="duration-fields__unit"></span>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;function fe(e){return e==="number"||e==="password"||e==="time"||e==="date"?e:"text"}function me(e){return e==="password"||e==="number"||e==="time"||e==="date"?e:"text"}class be extends HTMLElement{constructor(){super(),this.isPasswordVisible=!1,this.customValidationMessage="";const t=this.attachShadow({mode:"open",delegatesFocus:!0});t.append(wt.content.cloneNode(!0)),this.input=t.querySelector("input"),this.helperText=t.querySelector(".form-helper-text"),this.label=t.querySelector("label"),this.suffix=t.querySelector(".duration-fields__unit"),this.toggleButton=document.createElement("button"),this.wrapper=t.querySelector(".form-control__input-wrapper"),this.toggleButton.className="password-toggle-btn",this.toggleButton.type="button",this.input.addEventListener("input",n=>{this.syncValidationState(),n.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}),this.input.addEventListener("change",n=>{this.syncValidationState(),n.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.input.addEventListener("invalid",()=>{this.syncValidationState()}),this.toggleButton.addEventListener("click",()=>{this.togglePasswordVisibility()})}static get observedAttributes(){return["aria-label","aria-invalid","autocomplete","disabled","helper-text","invalid","inputmode","label","max","maxlength","min","name","placeholder","readonly","required","step","suffix","type","value","variant"]}connectedCallback(){this.hasAttribute("variant")||this.setAttribute("variant","text"),this.dataset.component=W,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(t){this.toggleAttribute("disabled",t)}get type(){return this.input.type}set type(t){this.setAttribute("type",t)}get value(){return this.input.value}set value(t){this.input.value=t,this.syncValidationState()}focus(t){this.input.focus(t)}select(){this.input.select()}get validationMessage(){return this.input.validationMessage}get validity(){return this.input.validity}get willValidate(){return this.input.willValidate}checkValidity(){const t=this.input.checkValidity();return this.syncValidationState(),t}reportValidity(){const t=this.input.reportValidity();return this.syncValidationState(),t}setCustomValidity(t){this.customValidationMessage=t,this.input.setCustomValidity(t),this.syncValidationState()}syncAttributes(){const t=fe(this.getAttribute("variant")),n=this.getAttribute("helper-text")||"",i=this.id?`${this.id}Input`:"input",o=this.getAttribute("label")||"",a=this.getAttribute("suffix")||"",l=t==="password"?this.isPasswordVisible?"text":"password":this.getAttribute("type")||me(t);if(this.input.id=i,this.input.type=l,this.input.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.input.readOnly=this.hasAttribute("readonly"),this.input.required=this.hasAttribute("required"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("autocomplete"),this.syncStringAttribute("inputmode"),this.syncStringAttribute("max"),this.syncStringAttribute("maxlength"),this.syncStringAttribute("min"),this.syncStringAttribute("name"),this.syncStringAttribute("placeholder"),this.syncStringAttribute("step"),this.hasAttribute("value")&&this.input.value!==this.getAttribute("value")&&(this.input.value=this.getAttribute("value")||""),this.input.setCustomValidity(this.customValidationMessage),this.label.htmlFor=i,this.label.textContent=o,this.label.hidden=o.length===0,this.helperText.textContent=n,this.helperText.hidden=n.length===0,this.wrapper.classList.toggle("duration-fields",t==="number"),this.suffix.textContent=a,this.suffix.hidden=t!=="number"||a.length===0,n.length>0){const c=`${i}HelperText`;this.helperText.id=c,this.input.setAttribute("aria-describedby",c)}else this.helperText.removeAttribute("id"),this.input.removeAttribute("aria-describedby");t==="password"?(this.toggleButton.isConnected||this.wrapper.append(this.toggleButton),this.toggleButton.disabled=this.disabled,this.toggleButton.setAttribute("aria-label",this.isPasswordVisible?"Hide password":"Show password"),this.toggleButton.innerHTML=ve(this.isPasswordVisible?he:ge,"password-icon")):(this.isPasswordVisible=!1,this.toggleButton.remove()),this.syncValidationState()}syncStringAttribute(t){const n=this.getAttribute(t);if(n===null){this.input.removeAttribute(t);return}this.input.setAttribute(t,n)}togglePasswordVisibility(){this.isPasswordVisible=!this.isPasswordVisible,this.syncAttributes()}syncValidationState(){const t=this.hasAttribute("invalid")||this.getAttribute("aria-invalid")==="true"||!this.input.validity.valid;this.classList.toggle("error",t),this.input.classList.toggle("error",t),this.hasAttribute("invalid")!==t&&this.toggleAttribute("invalid",t),this.getAttribute("aria-invalid")!==String(t)&&this.setAttribute("aria-invalid",String(t)),this.input.getAttribute("aria-invalid")!==String(t)&&this.input.setAttribute("aria-invalid",String(t))}}function ve(e,t){return e.includes("class=")?e.replace("<svg",`<svg class="${t}"`):e.replace("<svg",`<svg class="${t}"`)}function ye(){customElements.get(W)||customElements.define(W,be)}const we=`:host {
  display: block;
  width: 100%;
}

:host([hidden]) {
  display: none;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

ol,
ul,
menu,
summary {
  margin: 0;
  padding: 0;
  list-style: none;
}

p {
  margin: 0;
}

.networks {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-lg);
}

.networks__list {
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 320px;
  overflow-y: auto;
  border: var(--border-01) solid var(--color-border);
  padding: var(--spacing-xs);
  border-radius: var(--radius-lg);
}

.networks__list:focus {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.networks__list-empty-state {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--color-text-secondary);
  font-size: var(--font-size-heading);
}

.wifi-find-icon {
  width: 64px;
  height: 64px;
  fill: var(--color-text-mute);
}

.networks__item {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: var(--spacing-sm) var(--spacing-xs);
  border: var(--border-01) solid transparent;
  min-height: 32px;
  font-size: var(--font-size-label);
  justify-content: space-between;
  border-radius: var(--radius-xs);
}

.networks__item-ssid {
  font-weight: var(--font-weight-semibold);
}

.networks__item-details {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.networks__item ~ .networks__item {
  border-top: var(--border-01) solid var(--color-bg-selected);
}

.networks__item[aria-selected="true"] {
  background-color: var(--color-bg-active);
  outline: var(--focus-ring-width) solid var(--color-fg-active);
  outline-offset: var(--focus-ring-offset);
}

.wifi-security-icon,
.wifi-signal-icon,
.wifi-connected-icon {
  width: 16px;
  height: 16px;
  fill: var(--color-text-secondary);
}
`,J="ui-network-list",xt="networkList",j="network-list-label",St=document.createElement("template");St.innerHTML=`
  <style>${we}</style>
  <div class="networks">
    <span id="${j}" hidden>Available networks</span>
    <ul
      id="${xt}"
      class="networks__list"
      role="listbox"
      aria-labelledby="${j}"
      tabindex="0"
    ></ul>
  </div>
`;class xe extends HTMLElement{static get observedAttributes(){return["aria-label","label"]}constructor(){super();const t=this.attachShadow({mode:"open",delegatesFocus:!0});t.append(St.content.cloneNode(!0)),this.labelElement=t.querySelector(`#${j}`),this.listElement=t.querySelector(`#${xt}`),this.listElement.addEventListener("keydown",n=>{(n.key==="ArrowDown"||n.key==="ArrowUp"||n.key==="Home"||n.key==="End"||n.key===" ")&&n.preventDefault()})}connectedCallback(){this.tabIndex=0,this.dataset.component=J,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}appendItem(t){this.listElement.appendChild(t)}clearItems(){this.listElement.innerHTML=""}focus(t){this.listElement.focus(t)}getOptions(){return Array.from(this.listElement.querySelectorAll('[role="option"]'))}scrollOptionIntoView(t){const n=this.getOptions()[t];if(!n)return;const i=this.listElement.scrollTop,o=i+this.listElement.clientHeight,a=n.offsetTop,l=a+n.offsetHeight;if(a<i){this.listElement.scrollTop=a;return}l>o&&(this.listElement.scrollTop=l-this.listElement.clientHeight)}setActiveDescendant(t){if(t){this.listElement.setAttribute("aria-activedescendant",t);return}this.listElement.removeAttribute("aria-activedescendant")}setEmptyState(t){this.clearItems(),this.appendItem(t)}syncAttributes(){const t=this.getAttribute("label")||"Available networks",n=this.getAttribute("aria-label");this.labelElement.textContent=t,n?this.listElement.setAttribute("aria-label",n):this.listElement.removeAttribute("aria-label")}}function Se(){customElements.get(J)||customElements.define(J,xe)}const Te=`:host {
  display: block;
  width: 100%;
}

:host([hidden]) {
  display: none;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.wifi-status-card {
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  background-color: var(--color-bg-brand);
  padding: var(--spacing-md) var(--spacing-md);
  border-radius: var(--radius-lg);
}

.wifi-status-card__content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  width: 100%;
}

.wifi-status-card__content .wifi-icon {
  width: 32px;
  height: 32px;
  fill: var(--color-text-inverse);
}

.wifi-status-card__actions {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-left: auto;
}

.wifi-status-card__status {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 0;
}

.wifi-status-card__label {
  font-size: var(--font-size-label);
  color: var(--color-text-inverse);
  font-weight: var(--font-weight-medium);
}

.wifi-status-card__network {
  font-size: var(--font-size-label);
  color: var(--color-text-inverse);
  font-weight: var(--font-weight-semibold);
  min-width: 0;
  overflow-wrap: anywhere;
}
`,Y="ui-network-status",Tt="actionBtn",At="settingsBtn",kt="wifiStatusLabel",Ct="wifiStatusIcon",Et="wifiStatusNetwork",_t=document.createElement("template");_t.innerHTML=`
  <style>${Te}</style>
  <div class="wifi-status-card">
    <div class="wifi-status-card__content">
      <div class="wifi-status-card__status">
        <span class="card-icon" id="${Ct}"></span>
        <span id="${kt}" class="wifi-status-card__label">
          Disconnected
        </span>
        <span
          id="${Et}"
          class="wifi-status-card__network"
        ></span>
      </div>
      <div class="wifi-status-card__actions">
        <ui-button
          id="${Tt}"
          variant="outline"
          inverse
          aria-label="Connect"
        >
          Connect
        </ui-button>
        <ui-button
          id="${At}"
          variant="outline"
          inverse
          aria-label="Settings"
        >
          Settings
        </ui-button>
      </div>
    </div>
  </div>
`;function Ae(e,t){return e.includes("class=")?e.replace("<svg",`<svg class="${t}"`):e.replace("<svg",`<svg class="${t}"`)}class ke extends HTMLElement{static get observedAttributes(){return["action-label","network","status-label"]}constructor(){super();const t=this.attachShadow({mode:"open"});t.append(_t.content.cloneNode(!0)),this.actionButton=t.querySelector(`#${Tt}`),this.actionButton.addEventListener("click",n=>{n.stopPropagation(),this.dispatchEvent(new Event("action",{bubbles:!0,composed:!0}))}),this.iconElement=t.querySelector(`#${Ct}`),this.labelElement=t.querySelector(`#${kt}`),this.networkElement=t.querySelector(`#${Et}`),this.settingsButton=t.querySelector(`#${At}`),this.settingsButton.addEventListener("click",n=>{n.stopPropagation(),this.dispatchEvent(new Event("settings",{bubbles:!0,composed:!0}))})}connectedCallback(){this.dataset.component=Y,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get actionDisabled(){return!!this.actionButton.disabled}set actionDisabled(t){this.actionButton.disabled=t}get iconSvg(){return this.iconElement.innerHTML}set iconSvg(t){this.iconElement.innerHTML=t?Ae(t,"wifi-icon"):""}get network(){return this.getAttribute("network")||""}set network(t){this.setAttribute("network",t)}get actionLabel(){return this.getAttribute("action-label")||"Connect"}set actionLabel(t){this.setAttribute("action-label",t)}get statusLabel(){return this.getAttribute("status-label")||"Disconnected"}set statusLabel(t){this.setAttribute("status-label",t)}syncAttributes(){this.actionButton.textContent=this.actionLabel,this.actionButton.setAttribute("aria-label",this.actionLabel),this.labelElement.textContent=this.statusLabel,this.networkElement.textContent=this.network,this.networkElement.hidden=this.network.length===0}}function Ce(){customElements.get(Y)||customElements.define(Y,ke)}const Ee=`:host {
  display: block;
  width: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

input,
textarea {
  margin: 0;
  font: inherit;
  color: inherit;
  -webkit-user-select: auto;
}

.form-control {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-control label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  margin-bottom: var(--spacing-xs);
}

.range-slider {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.range-slider__range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 34px;
  border-radius: var(--radius-full);
  background: var(--color-bg-input);
  outline: none;
}

.range-slider__range:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.range-slider__range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--color-bg);
  border: var(--border-03) solid var(--color-bg-brand);
  box-shadow: 0px 2px 6px -2px rgba(32, 32, 32, 0.4);
  cursor: pointer;
  transition: background 0.15s ease-in-out;
}

.range-slider__range::-webkit-slider-thumb:hover {
  background: var(--color-bg);
}

.range-slider__range:active::-webkit-slider-thumb {
  background: var(--color-bg);
}

.range-slider__range::-moz-range-thumb {
  width: 30px;
  height: 30px;
  border: var(--border-03) solid var(--color-bg-brand);
  border-radius: 50%;
  background: var(--color-bg);
  box-shadow: 0px 2px 6px -2px rgba(32, 32, 32, 0.4);
  cursor: pointer;
  transition: background 0.15s ease-in-out;
}

.range-slider__range::-moz-range-thumb:hover {
  background: var(--color-bg);
}

.range-slider__range:active::-moz-range-thumb {
  background: var(--color-bg);
}

.range-slider__value {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 28px;
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-inverse);
  background: var(--color-bg-brand);
  border-radius: var(--radius-md);
}
`,_e=document.createElement("template");_e.innerHTML=`
  <style>${Ee}</style>
  <div class="form-control">
    <label></label>
    <div class="range-slider">
      <input class="range-slider__range" type="range" />
      <span class="range-slider__value"></span>
    </div>
  </div>
`;const Le='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80 240-320l57-57 183 183 183-183 57 57L480-80ZM298-584l-58-56 240-240 240 240-58 56-182-182-182 182Z"/></svg>',Ie=`:host {
  display: block;
  width: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

input,
button,
select,
textarea {
  margin: 0;
  font: inherit;
  color: inherit;
}

input,
textarea {
  -webkit-user-select: auto;
}

p {
  margin: 0;
}

.form-control {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-control label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  margin-bottom: var(--spacing-xs);
}

.form-helper-text {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-caption);
  line-height: 1.25;
  color: var(--color-text-secondary);
}

.form-control__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--spacing-sm);
}

.form-control__input-wrapper select {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border: var(--border-01) solid var(--color-border);
  min-height: 44px;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--input-radius);
  background-color: var(--color-bg-input);
  color: var(--color-text);
  font-size: var(--font-size-label);
  line-height: normal;
  appearance: none;
  -webkit-appearance: none;
}

.select-icon {
  position: absolute;
  width: 32px;
  height: 18px;
  background-color: transparent;
  border-radius: var(--radius-xs);
  right: 2px;
  fill: var(--color-text-secondary);
  pointer-events: none;
}

.form-control__input-wrapper select:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

:host(.error) select,
:host([invalid]) select,
:host([aria-invalid="true"]) select,
.form-control__input-wrapper select.error {
  outline: var(--focus-ring-width) solid var(--color-meter-red);
  outline-offset: var(--focus-ring-offset);
}
`,X="ui-select",Lt=document.createElement("template");Lt.innerHTML=`
  <style>${Ie}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <select></select>
      <span class="select-icon"></span>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;class Me extends HTMLElement{constructor(){super(),this.customValidationMessage="";const t=this.attachShadow({mode:"open",delegatesFocus:!0});t.append(Lt.content.cloneNode(!0)),this.helperText=t.querySelector(".form-helper-text"),this.labelElement=t.querySelector("label"),this.select=t.querySelector("select");const n=t.querySelector(".select-icon");n.innerHTML=qe(Le,"select-icon"),this.select.addEventListener("change",i=>{this.syncValidationState(),i.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.select.addEventListener("input",i=>{this.syncValidationState(),i.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}),this.select.addEventListener("invalid",()=>{this.syncValidationState()})}static get observedAttributes(){return["aria-invalid","aria-label","disabled","helper-text","invalid","label","name","required","value"]}connectedCallback(){this.moveLightDomOptions(),this.dataset.component=X,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(t){this.toggleAttribute("disabled",t)}get innerHTML(){return this.select.innerHTML}set innerHTML(t){this.select.innerHTML=t,this.syncValidationState()}get value(){return this.select.value}set value(t){this.select.value=t,this.syncValidationState()}appendChild(t){return t instanceof HTMLOptionElement||t instanceof HTMLOptGroupElement?(this.select.appendChild(t),t):super.appendChild(t)}focus(t){this.select.focus(t)}get validationMessage(){return this.select.validationMessage}get validity(){return this.select.validity}get willValidate(){return this.select.willValidate}checkValidity(){const t=this.select.checkValidity();return this.syncValidationState(),t}reportValidity(){const t=this.select.reportValidity();return this.syncValidationState(),t}setCustomValidity(t){this.customValidationMessage=t,this.select.setCustomValidity(t),this.syncValidationState()}moveLightDomOptions(){Array.from(this.children).forEach(t=>{(t instanceof HTMLOptionElement||t instanceof HTMLOptGroupElement)&&this.select.appendChild(t)})}syncAttributes(){const t=this.getAttribute("helper-text")||"",n=this.id?`${this.id}Select`:"select",i=this.getAttribute("label")||"";if(this.select.id=n,this.select.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.select.required=this.hasAttribute("required"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("name"),this.hasAttribute("value")&&(this.select.value=this.getAttribute("value")||""),this.select.setCustomValidity(this.customValidationMessage),this.labelElement.htmlFor=n,this.labelElement.textContent=i,this.labelElement.hidden=i.length===0,this.helperText.textContent=t,this.helperText.hidden=t.length===0,t.length>0){const o=`${n}HelperText`;this.helperText.id=o,this.select.setAttribute("aria-describedby",o)}else this.helperText.removeAttribute("id"),this.select.removeAttribute("aria-describedby");this.syncValidationState()}syncStringAttribute(t){const n=this.getAttribute(t);if(n===null){this.select.removeAttribute(t);return}this.select.setAttribute(t,n)}syncValidationState(){const t=this.hasAttribute("invalid")||this.getAttribute("aria-invalid")==="true"||!this.select.validity.valid;this.classList.toggle("error",t),this.select.classList.toggle("error",t),this.hasAttribute("invalid")!==t&&this.toggleAttribute("invalid",t),this.getAttribute("aria-invalid")!==String(t)&&this.setAttribute("aria-invalid",String(t)),this.select.getAttribute("aria-invalid")!==String(t)&&this.select.setAttribute("aria-invalid",String(t))}}function Be(){customElements.get(X)||customElements.define(X,Me)}function qe(e,t){return e.includes("class=")?e.replace("<svg",`<svg class="${t}"`):e.replace("<svg",`<svg class="${t}"`)}const ze=`:host {
  display: block;
  width: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.form-control {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.switch-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.switch-label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-medium);
  flex-shrink: 0;
}

button {
  all: unset;
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  width: 62px;
  height: 34px;
  padding: 0;
  border: none;
  border-radius: var(--radius-full);
  background-color: var(--color-bg-input);
  color: inherit;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.switch-label[hidden] {
  display: none;
}

button[data-checked] {
  background-color: var(--color-bg-brand);
}

button::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  box-shadow: 0 0 0 var(--focus-ring-width) currentColor;
  transition: opacity 0.2s ease;
}

button:focus-visible::before {
  opacity: 0.35;
}

.knob {
  position: absolute;
  left: 2px;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-full);
  background-color: var(--color-fg-knob-off);
  box-shadow: 0 2px 6px -2px rgba(32, 32, 32, 0.4);
  transition:
    transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    background-color 0.2s ease;
}

button[data-checked] .knob {
  background-color: var(--color-fg-knob-on);
}
`,Pe=document.createElement("template");Pe.innerHTML=`
  <style>${ze}</style>
  <div class="form-control">
    <div class="switch-container">
      <button type="button" part="button">
        <span class="knob"></span>
      </button>
      <span class="switch-label"></span>
    </div>
  </div>
`;const Ne=`:host {
  display: contents;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.toast-dialog {
  position: fixed;
  left: 50%;
  bottom: var(--spacing-4xl);
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  width: min(50vw, calc(100vw - 2rem));
  max-width: calc(100vw - 2rem);
  pointer-events: none;
  z-index: 30;
}

.toast-dialog[open] {
  display: block;
  animation: toast-dialog-fade 2.6s ease forwards;
}

.toast-dialog::backdrop {
  display: none;
}

.toast-dialog__message {
  margin: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-lg);
  min-height: 44px;
  overflow: hidden;
  border: var(--border-01) solid var(--color-meter-green);
  border-radius: var(--radius-lg);
  background: var(--color-bg-active);
  color: var(--color-text);
  box-shadow: 0 0.5rem 1.25rem var(--color-overlay);
  font-size: var(--font-size-label);
  line-height: 1.25;
  text-align: center;
  text-overflow: ellipsis;
}

.toast-dialog[data-status='error'] .toast-dialog__message,
.toast-dialog[data-status='danger'] .toast-dialog__message {
  border-color: var(--color-text-danger);
  background: var(--color-bg-danger);
  color: var(--color-text-danger);
}

.toast-dialog[data-status='warning'] .toast-dialog__message {
  border-color: var(--color-meter-yellow);
  background: var(--color-bg-selected);
  color: var(--color-text-warning);
}

@keyframes toast-dialog-fade {
  0% {
    opacity: 0;
    transform: translate(-50%, 0.75rem);
  }

  12%,
  78% {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -0.25rem);
  }
}
`,Q="ui-toast",It=document.createElement("template");It.innerHTML=`
  <style>${Ne}</style>
  <dialog class="toast-dialog" aria-live="polite">
    <p class="toast-dialog__message"></p>
  </dialog>
`;function ct(e){return e==="success"||e==="info"||e==="warning"||e==="error"||e==="danger"?e:null}class Oe extends HTMLElement{static get observedAttributes(){return["aria-label","message","status"]}constructor(){super();const t=this.attachShadow({mode:"open"});t.append(It.content.cloneNode(!0)),this.dialog=t.querySelector("dialog"),this.messageElement=t.querySelector(".toast-dialog__message")}connectedCallback(){this.dataset.component=Q,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get message(){return this.messageElement.textContent||""}set message(t){this.setAttribute("message",t)}get status(){return ct(this.getAttribute("status"))}set status(t){if(t){this.setAttribute("status",t);return}this.removeAttribute("status")}show(t,n){typeof t=="string"&&(this.message=t),n&&(this.status=n),this.dialog.open||this.dialog.show()}close(t){this.dialog.close(t)}syncAttributes(){const t=this.getAttribute("aria-label"),n=this.getAttribute("message")||"",i=ct(this.getAttribute("status"));t?this.dialog.setAttribute("aria-label",t):this.dialog.removeAttribute("aria-label"),this.messageElement.textContent=n,this.messageElement.id=this.id?`${this.id}Message`:"statusToastMessage",this.dialog.id=this.id||"statusToast",i?this.dialog.setAttribute("data-status",i):this.dialog.removeAttribute("data-status")}}function Ve(){customElements.get(Q)||customElements.define(Q,Oe)}const De='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m109-531-85-85q92-89 210-136.5T480-800q128 0 246 47.5T936-616l-85 85q-75-72-171-110.5T480-680q-104 0-200 38.5T109-531Zm169 169-84-84q59-55 132.5-84.5T480-560q80 0 153.5 29.5T766-446l-84 84q-42-38-93.5-58T480-440q-57 0-108.5 20T278-362Zm202 202q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Z"/></svg>',$e='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg>',He='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM361-353q25-18 55.5-28t63.5-10q33 0 63.5 10t55.5 28l245-245q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l245 245Z"/></svg>',Fe='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM299-415q38-28 84-43.5t97-15.5q51 0 97 15.5t84 43.5l183-183q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l183 183Z"/></svg>',Ke='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM232-482q53-38 116-59.5T480-563q69 0 132 21.5T728-482l116-116q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l116 116Z"/></svg>',Re='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q95-97 219.5-148.5T480-800q136 0 260.5 51.5T960-600L480-120Z"/></svg>',Ue='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-601q93-93 215.5-146T480-800q142 0 264.5 53T960-601l-56 57q-81-81-190-128.5T480-720q-103 0-195 32.5T117-597l419 420-56 57Zm384-40L761-262q-18 11-38 16.5t-43 5.5q-68 0-114-46t-46-114q0-68 46-114t114-46q68 0 114 46t46 114q0 23-5.5 43T818-319l102 103-56 56ZM680-320q34 0 57-23t23-57q0-34-23-57t-57-23q-34 0-57 23t-23 57q0 34 23 57t57 23ZM480-177Z"/></svg>',Ge='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70q66 0 121 33t87 87h432v240h-80v120H600v-120H488q-32 54-87 87t-121 33Zm0-80q66 0 106-40.5t48-79.5h246v120h80v-120h80v-80H434q-8-39-48-79.5T280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-80q33 0 56.5-23.5T360-480q0-33-23.5-56.5T280-560q-33 0-56.5 23.5T200-480q0 33 23.5 56.5T280-400Zm0-80Z"/></svg>',Ze='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>',We='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>',Je='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m720-80 120-120-28-28-72 72v-164h-40v164l-72-72-28 28L720-80ZM480-800 243-663l237 137 237-137-237-137ZM120-321v-318q0-22 10.5-40t29.5-29l280-161q10-5 19.5-8t20.5-3q11 0 21 3t19 8l280 161q19 11 29.5 29t10.5 40v159h-80v-116L479-434 200-596v274l240 139v92L160-252q-19-11-29.5-29T120-321ZM720 0q-83 0-141.5-58.5T520-200q0-83 58.5-141.5T720-400q83 0 141.5 58.5T920-200q0 83-58.5 141.5T720 0ZM480-491Z"/></svg>',je={"Content-Type":"application/json",Accept:"application/json"},dt=64,Ye=2e3,Xe=8,Qe=2e3,tn=8,en=3e3,nn=750,on=20,rn="/api/settings",sn=`${rn}/time`,an="/api/runtime/time",ln="/api/runtime/update",cn="/api/update",dn=1e4;async function I(e,t){const n=new AbortController,i=setTimeout(()=>n.abort(),dn);let o;try{o=await fetch(e,{cache:"no-store",...t,signal:t?.signal??n.signal,headers:{...je,...t?.headers||{}}})}catch(d){throw n.signal.aborted?new Error(`Request to ${e} timed out. Check the device is still reachable.`):d}finally{clearTimeout(i)}const a=o.headers.get("content-type")||"",l=await o.text();if(!a.includes("application/json"))throw new Error(`Unexpected response for ${e}. Make sure you are connected to the device AP and loading the portal from the ESP32.`);const c=JSON.parse(l);if(!o.ok||c.success!==!0)throw new Error(c.message||"Request failed.");return c}const un=(e,t)=>I(e,t),hn=(e,t)=>I(e,t),gn=(e,t)=>I(e,t),pn=(e,t)=>I(e,t),Mt=(e,t)=>I(e,t),fn=(e,t)=>I(e,t);function x(e){const t=document.getElementById(e);if(!t)throw new Error(`Required portal element "#${e}" was not found.`);return t}function mn(){return{wifiStatusCard:x("wifiStatusCard"),wifiSettingsSheet:x("wifiSettingsSheet"),wifiSettingsCloseBtn:x("wifiSettingsCloseBtn"),wifiSettingsNotification:x("wifiSettingsNotification"),networkList:x("networkList"),passwordInput:x("password"),scanBtn:x("scanBtn"),connectBtn:x("connectBtn"),geminiCard:x("geminiCard"),geminiApiKeyInput:x("geminiApiKeyInput"),geminiClearBtn:x("geminiClearBtn"),geminiSaveBtn:x("geminiSaveBtn"),timezoneLocationCard:x("timezoneLocationCard"),timezoneSelect:x("timezoneSelect"),manualTimeInput:x("manualTimeInput"),manualDateInput:x("manualDateInput"),timezoneLocationClearBtn:x("timezoneLocationClearBtn"),timezoneLocationSaveBtn:x("timezoneLocationSaveBtn")}}function Bt(e){return(t,n="info")=>{e.setNotification(t,n)}}function bn(e){return(t,n="info")=>{if(!t){e.hidden=!0,e.textContent="",e.removeAttribute("data-status"),e.setAttribute("role","status"),e.setAttribute("aria-live","polite");return}e.hidden=!1,e.textContent=t,e.setAttribute("data-status",n),n==="error"||n==="danger"?(e.setAttribute("role","alert"),e.setAttribute("aria-live","assertive")):n==="warning"?(e.setAttribute("role","alert"),e.setAttribute("aria-live","polite")):(e.setAttribute("role","status"),e.setAttribute("aria-live","polite"))}}function et(e){e.classList.remove("error"),e.removeAttribute("invalid"),e.setAttribute("aria-invalid","false"),e.setCustomValidity?.("")}function nt(e,t){e.classList.add("error"),e.setAttribute("invalid",""),e.setAttribute("aria-invalid","true"),e.setCustomValidity?.(t)}function vn(e,t){e.setAttribute("aria-checked",t?"true":"false")}function yn(e){return e.getAttribute("aria-checked")==="true"}function wn(e,t){return e.includes("class=")?e.replace("<svg",`<svg class="${t}"`):e.replace("<svg",`<svg class="${t}"`)}function xn(e){return new Promise(t=>{setTimeout(t,e)})}function Sn(){const e=document.documentElement.lang?.trim();return e||"en-US"}function Tn(e){try{return new Intl.DateTimeFormat(Sn(),{hour:"numeric",timeZone:e,timeZoneName:"longGeneric"}).formatToParts(new Date).find(i=>i.type==="timeZoneName")?.value?.trim()||""}catch(t){return console.warn(`Failed to format timezone label for "${e}".`,t),""}}function ut(e){return/^(GMT|UTC)(?:[+-]\d{1,2}(?::\d{2})?)?$/.test(e)}function An(e){return(e.split("/").pop()||e).replace(/_/g," ")}function qt(e){return e.split("/").map(t=>t.replace(/_/g," ")).join(" / ")}function kn(e){const t=e.map(o=>{const a=Tn(o.name);return{cityLabel:An(o.name),genericLabel:a,name:o.name}}),n=new Map(t.map(o=>[o.name,o])),i=new Map;return t.forEach(o=>{!o.genericLabel||ut(o.genericLabel)||i.set(o.genericLabel,(i.get(o.genericLabel)||0)+1)}),new Map(e.map(o=>{const a=n.get(o.name),l=o.description?.trim()||"";if(a?.genericLabel&&!ut(a.genericLabel)){const d=(i.get(a.genericLabel)||0)>1?`${a.genericLabel} (${a.cityLabel})`:a.genericLabel;return[o.name,d]}return l?[o.name,l]:[o.name,qt(o.name)]}))}function Cn(e,t){return t.get(e.name)||e.description?.trim()||qt(e.name)}function En(e){const t=e.value.trim();if(!t)return null;const n=/^(\d{2}):(\d{2})$/.exec(t);if(!n)return null;const i=Number.parseInt(n[1],10),o=Number.parseInt(n[2],10);return!Number.isFinite(i)||!Number.isFinite(o)||i<0||i>23||o<0||o>59?null:i*60+o}const _n=2e3,Ln=45;function In(e){let t=!1,n="";const i=(f,p="info")=>e.card.setNotification(f,p),o=()=>e.fileInput.files?.[0]??null;function a(){e.fileInput.disabled=t,e.uploadBtn.disabled=t||!o()}function l(f){n=f,e.versionText.textContent=f?`Installed version: ${f}`:"Installed version: unknown"}async function c(){const p=(await pn(ln)).runtime?.version??"";return l(p),p}function d(f){return new Promise((p,g)=>{const w=new XMLHttpRequest;w.open("POST",cn),w.setRequestHeader("Content-Type","application/octet-stream"),w.upload.onprogress=A=>{if(!A.lengthComputable)return;e.fileInput.progressMax=A.total,e.fileInput.progressValue=A.loaded;const s=Math.round(A.loaded/A.total*100);e.fileInput.progressMessageText=s<100?`Uploading… ${s}%`:"Checking and installing…"},w.onload=()=>{try{p(JSON.parse(w.responseText))}catch{g(new Error("The device sent an unexpected reply."))}},w.onerror=()=>g(new Error("The connection to the device was lost.")),w.send(f)})}async function m(f){for(let p=0;p<Ln;p+=1){await new Promise(g=>window.setTimeout(g,_n));try{const g=await c();g===f?i(`The device restarted and is still on version ${g}.`,"info"):i(`Updated to version ${g}.`,"success");return}catch{}}i("The update was installed and the device restarted. Reconnect to the device and reload this page to confirm the new version.","info")}async function v(){const f=o();if(!f||t)return;if(!f.name.toLowerCase().endsWith(".bin")){i("Choose a firmware update file ending in .bin.","error");return}t=!0,a();const p=n;e.fileInput.progressHidden=!1,e.fileInput.progressValue=0,e.fileInput.progressMessageText="Starting…",i("Uploading. Keep this page open and the device powered.","info");try{const g=await d(f);if(g.success!==!0)throw new Error(g.message||"The device rejected the update.");e.fileInput.progressMessageText="Installed. Restarting…",i("Update installed. The device is restarting…","info"),await m(p)}catch(g){e.fileInput.progressHidden=!0,i(g instanceof Error?g.message:"The update failed.","error")}finally{t=!1,a()}}function C(){e.fileInput.progressHidden=!0,e.fileInput.addEventListener("change",a),e.uploadBtn.addEventListener("click",()=>{v()}),a()}return{bind:C,refreshVersion:async()=>{try{await c()}catch(f){console.error("Firmware version check failed:",f),l("")}}}}function P(e,t,n){e.hasKey=n?.has_key===!0,e.last4=typeof n?.last4=="string"?n.last4:"",t.value=e.hasKey?e.last4?`******${e.last4}`:"******":""}function ht(e,t,n){e.hasKey=!1,e.last4="",t.value="",n("")}async function gt(e,t,n,i,o,a,l){const c=t.value.trim();if(!c){n(`${l} is required.`,"warning");return}e.isBusy=!0,n(a,"info"),i();try{const d=await o(e.settingsApi,{method:"PATCH",body:JSON.stringify({api_key:c})});P(e,t,d.settings),n(d.message||`${l} stored.`,"success")}catch(d){console.error(`${l} save failed:`,d),n(d instanceof Error?d.message:`Failed to store ${l}.`,"error")}finally{e.isBusy=!1,i()}}async function pt(e,t,n,i,o,a,l){e.isBusy=!0,n(a,"info"),i();try{const c=await o(e.resetApi,{method:"POST"});P(e,t,c.settings),n(c.message||l,"success")}catch(c){console.error(`${l} failed:`,c),n(c instanceof Error?c.message:`Failed to clear ${l}.`,"error")}finally{e.isBusy=!1,i()}}function Mn(e){const t={hasKey:!1,isBusy:!1,last4:"",resetApi:"/api/settings/gemini/reset",settingsApi:"/api/settings/gemini"},n={hasKey:!1,isBusy:!1,last4:"",resetApi:"/api/settings/openai/reset",settingsApi:"/api/settings/openai"};function i(p){const g=p?.routes;t.settingsApi=g?.settings||"/api/settings/gemini",t.resetApi=g?.reset||"/api/settings/gemini/reset"}function o(p){const g=p?.routes;n.settingsApi=g?.settings||"/api/settings/openai",n.resetApi=g?.reset||"/api/settings/openai/reset"}function a(p){P(t,e.geminiApiKeyInput,p)}function l(){ht(t,e.geminiApiKeyInput,e.notifyGemini)}function c(p){P(n,e.openAiApiKeyInput,p)}function d(){ht(n,e.openAiApiKeyInput,e.notifyOpenAi)}async function m(){if(!e.isGeminiModuleActive()||t.isBusy||t.hasKey)return;if(!e.geminiApiKeyInput.value.trim()){e.notifyGemini("Gemini API key is required.","warning");return}await gt(t,e.geminiApiKeyInput,e.notifyGemini,e.updateButtons,e.fetchGeminiModuleJson,"Saving Gemini API key...","Gemini API key")}async function v(){!e.isGeminiModuleActive()||t.isBusy||await pt(t,e.geminiApiKeyInput,e.notifyGemini,e.updateButtons,e.fetchGeminiModuleJson,"Clearing Gemini API key...","Gemini API key cleared.")}async function C(){if(!e.isOpenAiModuleActive()||n.isBusy||n.hasKey)return;if(!e.openAiApiKeyInput.value.trim()){e.notifyOpenAi("OpenAI API key is required.","warning");return}await gt(n,e.openAiApiKeyInput,e.notifyOpenAi,e.updateButtons,e.fetchOpenAiModuleJson,"Saving OpenAI API key...","OpenAI API key")}async function f(){!e.isOpenAiModuleActive()||n.isBusy||await pt(n,e.openAiApiKeyInput,e.notifyOpenAi,e.updateButtons,e.fetchOpenAiModuleJson,"Clearing OpenAI API key...","OpenAI API key cleared.")}return{applyGeminiSettings:a,applyOpenAiSettings:c,clearGeminiKey:v,clearGeminiSettings:l,clearOpenAiKey:f,clearOpenAiSettings:d,getGeminiHasKey:()=>t.hasKey,getOpenAiHasKey:()=>n.hasKey,isGeminiBusy:()=>t.isBusy,isOpenAiBusy:()=>n.isBusy,saveGeminiKey:m,saveOpenAiKey:C,updateGeminiRoutes:i,updateOpenAiRoutes:o}}function Bn(e){let t=!1,n=!1,i=!1,o=!1;async function a(){return e.fetchTimezoneListJson("/api/timezone/list")}function l(s){const h=s.settings,y=s.runtime;e.setSwitchChecked(e.clockModeToggle,!!h?.enabled),e.timezoneSelect.value=h?.timezone_name||"",e.clearFieldError(e.timezoneSelect),e.manualDateInput.value=typeof y?.current_date=="string"?y.current_date:"",e.manualTimeInput.value=typeof y?.current_time=="string"?y.current_time:""}function c(s){s&&(typeof s.clock_enabled=="boolean"&&e.setSwitchChecked(e.clockModeToggle,s.clock_enabled),e.manualDateInput.value=typeof s.current_date=="string"?s.current_date:"",e.manualTimeInput.value=typeof s.current_time=="string"?s.current_time:"")}async function d(){e.timezoneSelect.innerHTML="";const s=document.createElement("option");s.value="",s.textContent="Select timezone",e.timezoneSelect.appendChild(s);try{const h=await a(),y=Array.isArray(h.timezones)?h.timezones:[],k=e.buildTimezoneLabelMap(y);y.map(S=>({value:S.name,label:e.formatTimezoneLabel(S,k)})).sort((S,E)=>S.label.localeCompare(E.label)).forEach(S=>{const E=document.createElement("option");E.value=S.value,E.textContent=S.label,e.timezoneSelect.appendChild(E)})}catch(h){console.error("Timezone list fetch failed:",h),e.notify(h instanceof Error?h.message:"Failed to load timezones.","error")}}async function m(){if(!(t||n||i)){t=!0,n=!0,i=!0,e.onStateChange();try{const s=await e.fetchTimeSettingsJson(e.timeSettingsApi);l(s)}catch(s){console.error("Time settings status failed:",s),e.notify(s instanceof Error?s.message:"Time settings status failed.","error")}finally{t=!1,n=!1,i=!1,e.onStateChange()}}}async function v(){if(!(i||o)){o=!0;try{for(let s=0;s<e.clockSyncPollAttempts;s++){const h=await e.fetchTimeRuntimeJson(e.timeRuntimeApi);if(c(h.runtime),h.runtime?.time_valid===!0&&typeof h.runtime.current_time=="string"&&h.runtime.current_time.length>0)return;s<e.clockSyncPollAttempts-1&&await new Promise(y=>{setTimeout(y,e.clockSyncPollIntervalMs)})}}catch(s){console.error("Clock refresh after WiFi connect failed:",s)}finally{o=!1}}}async function C(){if(!(document.hidden||t||n||i)&&e.isSwitchChecked(e.clockModeToggle))try{const s=await e.fetchTimeRuntimeJson(e.timeRuntimeApi);c(s.runtime)}catch(s){console.error("Time runtime status failed:",s)}}function f(){const s=e.timezoneSelect.value.trim(),h=e.manualDateInput.value.trim(),y=e.manualTimeInput.value.trim(),k=e.parseClockTimeInputValue(e.wakeupTimeInput),S=e.parseClockTimeInputValue(e.bedtimeTimeInput);return!!h!=!!y?(e.notify("Provide both current date and time for a manual clock set.","error"),null):{timezoneName:s,manualDate:h,manualTime:y,wakeupMinutes:k??void 0,bedtimeMinutes:S??void 0}}async function p(s,h){return e.fetchTimeSettingsJson(e.timeSettingsApi,{method:"PATCH",body:JSON.stringify({timezone_name:s.timezoneName,enabled:h,manual_date:s.manualDate,manual_time:s.manualTime})})}async function g(){if(i||t||n){e.notifyClockMode("Clock mode update already in progress.","warning");return}const s=e.isSwitchChecked(e.clockModeToggle),h=!s,y=e.timezoneSelect.value.trim();e.setSwitchChecked(e.clockModeToggle,h),i=!0,e.notifyClockMode(h?"Enabling clock mode...":"Disabling clock mode...","info"),e.onStateChange();try{const k=await e.fetchTimeSettingsJson(e.timeSettingsApi,{method:"PATCH",body:JSON.stringify({enabled:h,timezone_name:h&&y?y:void 0})});l(k),e.notifyClockMode(k.message||(h?"Clock mode enabled.":"Clock mode disabled."),"success")}catch(k){e.setSwitchChecked(e.clockModeToggle,s),console.error("Clock mode toggle failed:",k);const S=k instanceof Error?k.message:"Failed to update clock mode.",E=S==="timezone_name required to enable clock"?"Please set timezone first.":S;S==="timezone_name required to enable clock"&&(e.setFieldError(e.timezoneSelect,"Select a timezone."),e.timezoneSelect.focus({preventScroll:!0})),e.notifyClockMode(E,"error")}finally{i=!1,e.onStateChange()}}async function w(){if(t||n||i||e.isTalkingClockModuleBusy()){e.notify("Time configuration update already in progress.","warning");return}const s=f();if(s){if(!s.timezoneName){e.setFieldError(e.timezoneSelect,"Select a timezone."),e.notify("Select a timezone.","error"),e.timezoneSelect.focus({preventScroll:!0});return}if(e.clearFieldError(e.timezoneSelect),e.isTalkingClockModuleActive()&&(s.wakeupMinutes===void 0||s.bedtimeMinutes===void 0)){e.notify("Wakeup and bedtime times are required for the talking clock module.","error"),e.focusTalkingClockTimeInput();return}t=!0,n=!0,i=!0,e.onTalkingClockBusyChange(e.isTalkingClockModuleActive()),e.notify("Saving time configuration...","info"),e.onStateChange();try{const h=await p(s,e.isSwitchChecked(e.clockModeToggle));if(l(h),e.isTalkingClockModuleActive()){const y=await e.patchTalkingClockSettings({wakeup_minutes:s.wakeupMinutes,bedtime_minutes:s.bedtimeMinutes});e.applyTalkingClockModuleSettings(y.settings)}e.notify("Time configuration saved successfully.","success")}catch(h){console.error("Timezone/location save failed:",h),e.notify(h instanceof Error?h.message:"Failed to save time configuration.","error")}finally{t=!1,n=!1,i=!1,e.onTalkingClockBusyChange(!1),e.onStateChange()}}}async function A(){if(t||n||i){e.notify("Time configuration update already in progress.","warning");return}t=!0,n=!0,i=!0,e.notify("Clearing timezone/location...","info"),e.onStateChange();try{const s=await e.fetchTimeSettingsJson(e.timeSettingsApi,{method:"PATCH",body:JSON.stringify({enabled:!1,timezone_name:""})});l(s),e.notify("Timezone/location cleared successfully.","success")}catch(s){console.error("Timezone/location clear failed:",s),e.notify(s instanceof Error?s.message:"Failed to clear timezone/location.","error")}finally{t=!1,n=!1,i=!1,e.onStateChange()}}return{applyTimeRuntimeStatus:c,applyTimeSettingsStatus:l,clearTimezoneLocation:A,fetchTimeRuntimeStatus:C,fetchTimeSettingsStatus:m,isClockBusy:()=>i,isLocationBusy:()=>n,isTimezoneBusy:()=>t,populateTimezoneOptions:d,refreshClockStatusAfterWifiConnect:v,saveTimezoneLocation:w,toggleClockModeSetting:g}}function qn(e,t){return e>=-50?t.fourBar:e>=-60?t.threeBar:e>=-70?t.twoBar:t.oneBar}function zn(e){let t=[],n="",i=!1,o="",a=!1,l=!1,c=!1,d=-1;function m(){e.wifiStatusCard.hidden=!1,e.wifiStatusCard.statusLabel=i?"Connected":"Disconnected",e.wifiStatusCard.network=i?o:""}function v(){const r=document.createElement("li");r.className="networks__list-empty-state",r.innerHTML=`${e.svgWithClass(e.wifiFindIcon,"wifi-find-icon")}<p>Scan for available networks</p>`,e.networkList.setEmptyState(r)}function C(){if(t.length===0){n="",d=-1;return}const r=t.findIndex(u=>u.ssid===n);if(r>=0){d=r;return}n="",d=-1}function f(){const r=e.networkList.getOptions();r.forEach((u,b)=>{u.setAttribute("aria-selected",String(n===t[b]?.ssid))}),d>=0&&d<r.length?e.networkList.setActiveDescendant(r[d].id):e.networkList.setActiveDescendant(null)}function p(){const r=t.find(u=>u.ssid===n);return r?!r.is_open:!0}function g(r){n=r,d=t.findIndex(u=>u.ssid===r),p()||e.clearFieldError(e.passwordInput),f(),e.onStateChange()}function w(){if(C(),e.networkList.clearItems(),t.length===0){v();return}t.forEach((r,u)=>{const b=document.createElement("li");b.className="networks__item",b.id=`network-option-${u}`,b.setAttribute("role","option"),b.setAttribute("tabindex","-1"),b.setAttribute("aria-selected",String(n===r.ssid));const N=document.createElement("span");N.className="networks__item-ssid",N.textContent=r.ssid;const M=document.createElement("div");if(M.className="networks__item-details",o===r.ssid&&i){const D=document.createElement("span");D.title="Currently connected",D.innerHTML=e.svgWithClass(e.checkIcon,"wifi-connected-icon"),M.appendChild(D)}const O=document.createElement("span");O.title=r.is_open?"Open":"Secured",r.is_open||(O.innerHTML=e.svgWithClass(e.securityIcon,"wifi-security-icon")),M.appendChild(O);const V=document.createElement("span");V.title=`Signal strength: ${r.signal_strength} (${r.rssi} dBm)`,V.innerHTML=e.svgWithClass(qn(r.rssi,e.signalIcons),"wifi-signal-icon"),M.appendChild(V),b.append(N,M),b.addEventListener("click",()=>{d=u,g(r.ssid),e.networkList.focus({preventScroll:!0})}),e.networkList.appendItem(b)}),f()}function A(r){const u=i,b=o;i=r.connected===!0,o=typeof r.ssid=="string"?r.ssid:"",m(),(u!==i||b!==o)&&w(),e.onConnectionStateChange?.({wasConnected:u,previousNetwork:b,isCurrentlyConnected:i,connectedNetwork:o})}async function s(){if(!a){a=!0,e.notify("Scanning for networks...","info"),e.onStateChange();try{let r="Scanning for networks...";for(let u=0;u<e.scanPollAttempts;u++){const b=await e.fetchPortalJson("/api/scan");if(r=b.message||r,b.scan_in_progress===!0){if(e.notify(r,"info"),u<e.scanPollAttempts-1){await e.delayMs(e.scanPollIntervalMs);continue}}else{t=Array.isArray(b.networks)?b.networks:[],e.notify(r||"Scan complete.","success"),w();return}}throw new Error("Network scan timed out. Please try again.")}catch(r){console.error("Scan failed:",r),e.notify(r instanceof Error?r.message:"Scan failed. Please try again.","error"),t=[],w()}finally{a=!1,e.onStateChange()}}}async function h(){if(!l){l=!0,e.onStateChange();try{const r=await e.fetchPortalJson("/api/status");A(r),a||e.notify(r.message||"Status updated.",r.connected?"success":"info")}catch(r){console.error("Status check failed:",r),e.notify(r instanceof Error?r.message:"Status check failed.","error")}finally{l=!1,e.onStateChange()}}}async function y(){if(!(c||!n)){if(p()&&e.passwordInput.value.trim().length===0){e.setFieldError(e.passwordInput,"Please enter a WiFi password."),e.passwordInput.focus({preventScroll:!0});return}if(e.passwordInput.value.length>dt){e.setFieldError(e.passwordInput,`WiFi password must be ${dt} characters or fewer.`),e.passwordInput.focus({preventScroll:!0});return}e.clearFieldError(e.passwordInput),c=!0,e.notify(`Connecting to ${n}...`,"info"),e.onStateChange();try{const r=await e.fetchPortalJson("/api/configure",{method:"POST",body:JSON.stringify({ssid:n,password:e.passwordInput.value})});e.notify(r.message||"Connection request sent.","info");for(let u=0;u<e.statusPollAttempts;u++){await e.delayMs(e.statusPollIntervalMs);const b=await e.fetchPortalJson("/api/status");if(A(b),b.connected){e.notify(b.message||"Connected.","success");break}}i||e.notify("Connection in progress...","info")}catch(r){console.error("Connection failed:",r),e.notify(r instanceof Error?r.message:"Connection failed.","error")}finally{c=!1,e.onStateChange()}}}async function k(){if(!(c||l||!i)){l=!0,e.notify("Disconnecting...","info"),e.onStateChange();try{const r=await e.fetchPortalJson("/api/disconnect",{method:"POST"}),u=i,b=o;i=!1,o="",m(),w(),e.notify(r.message||"Disconnected.","success"),e.onConnectionStateChange?.({wasConnected:u,previousNetwork:b,isCurrentlyConnected:i,connectedNetwork:o})}catch(r){console.error("Disconnect failed:",r),e.notify(r instanceof Error?r.message:"Disconnect failed.","error")}finally{l=!1,e.onStateChange()}}}function S(){if(ot()){k();return}if(c||l){e.notify("WiFi status is busy. Please wait.","warning");return}if(!n){e.notify("Select a WiFi network first.","error"),e.networkList.focus({preventScroll:!0});return}if(p()&&e.passwordInput.value.trim().length===0){e.setFieldError(e.passwordInput,"Please enter a WiFi password."),e.notify("Please check if your password is correct.","error"),e.passwordInput.focus({preventScroll:!0});return}e.clearFieldError(e.passwordInput),y()}function E(){e.passwordInput.value?.trim().length&&e.clearFieldError(e.passwordInput),e.onStateChange()}function Dt(r){if(t.length!==0)switch(C(),r.key){case"Tab":break;case"ArrowDown":{r.preventDefault();const u=d<t.length-1?d+1:0;d=u,g(t[u].ssid),e.networkList.scrollOptionIntoView(u);break}case"ArrowUp":{r.preventDefault();const u=d>0?d-1:t.length-1;d=u,g(t[u].ssid),e.networkList.scrollOptionIntoView(u);break}case"Home":{r.preventDefault(),d=0,g(t[0].ssid),e.networkList.scrollOptionIntoView(0);break}case"End":{r.preventDefault();const u=t.length-1;d=u,g(t[u].ssid),e.networkList.scrollOptionIntoView(u);break}case"Enter":case" ":{r.preventDefault(),d>=0&&d<t.length&&g(t[d].ssid);break}}}function ot(){return i&&o.length>0&&n===o}return{applyPortalStatus:A,checkStatus:h,connect:y,disconnect:k,getConnectedNetwork:()=>o,getSelectedNetwork:()=>n,handleConnectAction:S,handleListboxKeyDown:Dt,handlePasswordInput:E,isCheckingStatus:()=>l,isConnecting:()=>c,isCurrentlyConnected:()=>i,isScanning:()=>a,isSelectedConnected:ot,renderNetworkList:w,requiresPassword:p,scanNetworks:s,updateWifiStatusCard:m}}function q(e,t){t().finally(()=>{!e.disabled&&e.offsetParent!==null&&setTimeout(()=>{!e.disabled&&e.offsetParent!==null&&e.focus()},0)})}function Pn(e){const{controllers:t,dom:n,helpers:i}=e;function o(){n.wifiSettingsSheet.openBottomSheet(),t.wifiController.scanNetworks()}n.scanBtn.addEventListener("click",()=>{t.wifiController.scanNetworks()}),n.connectBtn.addEventListener("click",()=>{t.wifiController.handleConnectAction()}),n.wifiStatusCard.addEventListener("action",()=>{if(t.wifiController.isCurrentlyConnected()){t.wifiController.disconnect();return}o()}),n.wifiStatusCard.addEventListener("settings",()=>{o()}),n.wifiSettingsCloseBtn.addEventListener("click",()=>{n.wifiSettingsSheet.closeBottomSheet()}),n.passwordInput.addEventListener("input",()=>{t.wifiController.handlePasswordInput()}),n.networkList.addEventListener("keydown",a=>{t.wifiController.handleListboxKeyDown(a)}),n.geminiSaveBtn.addEventListener("click",()=>{q(n.geminiSaveBtn,()=>t.geminiController.saveGeminiKey())}),n.geminiClearBtn.addEventListener("click",()=>{q(n.geminiClearBtn,()=>t.geminiController.clearGeminiKey())}),n.geminiApiKeyInput.addEventListener("input",i.updateUi),n.timezoneLocationSaveBtn.addEventListener("click",()=>{if(!n.timezoneSelect.value.trim()){i.setFieldError(n.timezoneSelect,"Select a timezone."),i.setTimezoneLocationNotification("Select a timezone.","error"),n.timezoneSelect.focus({preventScroll:!0});return}i.clearFieldError(n.timezoneSelect),q(n.timezoneLocationSaveBtn,()=>t.timeController.saveTimezoneLocation())}),n.timezoneLocationClearBtn.addEventListener("click",()=>{q(n.timezoneLocationClearBtn,()=>t.timeController.clearTimezoneLocation())}),n.timezoneSelect.addEventListener("change",()=>{n.timezoneSelect.value?.trim().length&&i.clearFieldError(n.timezoneSelect),i.updateUi()}),n.manualDateInput.addEventListener("input",i.updateUi),n.manualTimeInput.addEventListener("input",i.updateUi)}function Nn(e){const{controllers:t,dom:n}=e,i=t.wifiController.isScanning()||t.wifiController.isConnecting()||t.wifiController.isCheckingStatus(),o=t.wifiController.isSelectedConnected(),a=t.wifiController.getSelectedNetwork().trim(),l=a.length>0&&!o&&t.wifiController.requiresPassword(),c=o||a.length>0&&(!l||n.passwordInput.value.trim().length>0);n.scanBtn.disabled=i,n.connectBtn.disabled=i||!c,n.wifiStatusCard.actionDisabled=i,n.passwordInput.disabled=t.wifiController.isConnecting(),t.wifiController.isConnecting()?(n.connectBtn.textContent="Connecting...",n.wifiStatusCard.actionLabel="Connecting..."):o?(n.connectBtn.textContent="Disconnect",n.wifiStatusCard.actionLabel="Disconnect"):(n.connectBtn.textContent="Connect",n.wifiStatusCard.actionLabel=t.wifiController.isCurrentlyConnected()?"Disconnect":"Connect");const d=t.timeController.isTimezoneBusy()||t.timeController.isLocationBusy()||t.timeController.isClockBusy();n.timezoneSelect.disabled=d,n.manualDateInput.disabled=d,n.manualTimeInput.disabled=d,n.timezoneLocationSaveBtn.disabled=d||n.timezoneSelect.value.trim().length===0,n.timezoneLocationClearBtn.disabled=d||n.timezoneSelect.value.trim().length===0;const m=t.geminiController.isGeminiBusy(),v=t.geminiController.getGeminiHasKey();n.geminiApiKeyInput.readOnly=v||m,n.geminiApiKeyInput.disabled=m,n.geminiSaveBtn.disabled=m||v||n.geminiApiKeyInput.value.trim().length===0,n.geminiSaveBtn.hidden=v,n.geminiClearBtn.disabled=m||!v,n.geminiClearBtn.hidden=!v}Qt();Wt();ie();le();ue();ye();Se();Ce();Be();Ve();let tt=null;const T=mn(),zt=bn(T.wifiSettingsNotification),On=Bt(T.geminiCard),Pt=Bt(T.timezoneLocationCard),Nt=()=>document.createElement("input"),Vn=document.createElement("button"),Dn=Nt(),$n=Nt(),Hn=document.createElement("input");function _(){Nn({controllers:{geminiController:it,timeController:L,wifiController:B},dom:T})}const it=Mn({fetchGeminiModuleJson:Mt,fetchOpenAiModuleJson:()=>Promise.resolve({}),geminiApiKeyInput:T.geminiApiKeyInput,isGeminiModuleActive:()=>!0,isOpenAiModuleActive:()=>!1,notifyGemini:On,notifyOpenAi:()=>{},openAiApiKeyInput:Hn,updateButtons:_}),L=Bn({applyTalkingClockModuleSettings:()=>{},bedtimeTimeInput:$n,clearFieldError:et,clockModeToggle:Vn,clockSyncPollAttempts:tn,clockSyncPollIntervalMs:Qe,fetchTimeRuntimeJson:gn,fetchTimeSettingsJson:hn,fetchTimezoneListJson:fn,focusTalkingClockTimeInput:()=>{},buildTimezoneLabelMap:kn,formatTimezoneLabel:Cn,isSwitchChecked:yn,isTalkingClockModuleActive:()=>!1,isTalkingClockModuleBusy:()=>!1,manualDateInput:T.manualDateInput,manualTimeInput:T.manualTimeInput,notifyClockMode:()=>{},notify:Pt,onStateChange:_,onTalkingClockBusyChange:()=>{},parseClockTimeInputValue:En,patchTalkingClockSettings:()=>Promise.resolve({success:!0}),setFieldError:nt,setSwitchChecked:vn,timeRuntimeApi:an,timeSettingsApi:sn,timezoneSelect:T.timezoneSelect,wakeupTimeInput:Dn}),B=zn({checkIcon:Ze,clearFieldError:et,delayMs:xn,fetchPortalJson:un,networkList:T.networkList,notify:zt,onConnectionStateChange:({wasConnected:e,isCurrentlyConnected:t})=>{!e&&t&&L.refreshClockStatusAfterWifiConnect()},onStateChange:_,passwordInput:T.passwordInput,scanPollAttempts:on,scanPollIntervalMs:nn,securityIcon:$e,setFieldError:nt,signalIcons:{oneBar:He,twoBar:Fe,threeBar:Ke,fourBar:Re},statusPollAttempts:Xe,statusPollIntervalMs:Ye,svgWithClass:wn,wifiFindIcon:Ue,wifiStatusCard:T.wifiStatusCard}),Ot=document.getElementById("firmwareUpdateCard"),Vt=In({card:Ot,fileInput:document.getElementById("firmwareFileInput"),uploadBtn:document.getElementById("firmwareUploadBtn"),versionText:document.getElementById("firmwareVersionText")});function z(){if(!tt)return;const e=document.documentElement,t=e.scrollHeight>window.innerHeight+1,n=window.scrollY+window.innerHeight>=e.scrollHeight-1;tt.setVisible(t&&!n)}function Fn(){T.wifiStatusCard.iconSvg=De,T.geminiCard.iconSvg=Ge,T.timezoneLocationCard.iconSvg=We,Ot.iconSvg=Je,Vt.bind(),B.renderNetworkList(),document.body&&(tt=Kt({mount:document.body,mode:"fixed",position:"bottom",height:"6rem",width:"100vw",strength:1.8,divCount:5,curve:"bezier",exponential:!0,opacity:1,zIndex:20,className:"page-gradual-blur",fallbackColor:"var(--color-bg-selected)"}),z(),window.addEventListener("scroll",z,{passive:!0}),window.addEventListener("resize",z),typeof ResizeObserver<"u"&&new ResizeObserver(()=>{z()}).observe(document.body)),_(),B.updateWifiStatusCard(),zt(""),Pn({controllers:{geminiController:it,timeController:L,wifiController:B},dom:T,helpers:{clearFieldError:et,setFieldError:nt,setTimezoneLocationNotification:Pt,updateUi:_}}),Kn(),window.setInterval(()=>{L.fetchTimeRuntimeStatus()},en)}async function Kn(){await Promise.allSettled([L.populateTimezoneOptions(),L.fetchTimeSettingsStatus(),B.checkStatus(),Rn(),Vt.refreshVersion()])}async function Rn(){try{const e=await Mt("/api/settings/gemini");it.applyGeminiSettings(e.settings)}catch(e){console.error("Gemini settings status failed:",e)}finally{_()}}Fn();
