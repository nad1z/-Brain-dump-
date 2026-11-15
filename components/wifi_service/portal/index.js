(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();const Qt={mode:"absolute",position:"bottom",height:"6rem",strength:2,divCount:5,exponential:!1,opacity:1,curve:"linear",zIndex:2},ut={linear:t=>t,bezier:t=>t*t*(3-2*t),"ease-in":t=>t*t,"ease-out":t=>1-Math.pow(1-t,2),"ease-in-out":t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2};function te(t){switch(t){case"top":return"to top";case"left":return"to left";case"right":return"to right";default:return"to bottom"}}function ee(){if(typeof CSS>"u"||typeof CSS.supports!="function")return!1;const t=CSS.supports("backdrop-filter","blur(1px)")||CSS.supports("-webkit-backdrop-filter","blur(1px)"),e=CSS.supports("mask-image","linear-gradient(to bottom, transparent, black)")||CSS.supports("-webkit-mask-image","linear-gradient(to bottom, transparent, black)");return t&&e}function ne(t){const e={...Qt,...t},n=document.createElement("div"),o=document.createElement("div"),i=te(e.position),r=ee(),l=e.position==="top"||e.position==="bottom";if(n.className="gradual-blur",e.className&&n.classList.add(e.className),r||(n.classList.add("gradual-blur--fallback"),n.style.background=`linear-gradient(${i}, transparent 0%, ${e.fallbackColor||"rgba(255, 255, 255, 0.95)"} 100%)`),n.style.position=e.mode,n.style.pointerEvents="none",n.style.zIndex=String(e.zIndex),n.style.opacity="0",n.style.borderRadius="inherit",l?(n.style.height=e.height,n.style.width=e.width||"100%",n.style[e.position]="0",e.mode==="fixed"?(n.style.left="50%",n.style.right="auto",n.style.transform="translateX(-50%)"):(n.style.left="0",n.style.right="0")):(n.style.width=e.width||e.height,n.style.height="100%",n.style.top="0",n.style.bottom="0",n.style[e.position]="0"),o.className="gradual-blur__inner",n.appendChild(o),r){const a=100/e.divCount,h=ut[e.curve]||ut.linear;for(let w=1;w<=e.divCount;w+=1){const x=document.createElement("div"),T=h(w/e.divCount);let f=0;e.exponential?f=Math.pow(2,T*4)*.0625*e.strength:f=.0625*(T*e.divCount+1)*e.strength;const g=Math.round((a*w-a)*10)/10,p=Math.round(a*w*10)/10,S=Math.round((a*w+a)*10)/10,C=Math.round((a*w+a*2)*10)/10;let c=`transparent ${g}%, black ${p}%`;S<=100&&(c+=`, black ${S}%`),C<=100&&(c+=`, transparent ${C}%`),x.className="gradual-blur__layer",x.style.maskImage=`linear-gradient(${i}, ${c})`,x.style.webkitMaskImage=`linear-gradient(${i}, ${c})`,x.style.backdropFilter=`blur(${f.toFixed(3)}rem)`,x.style.setProperty("-webkit-backdrop-filter",`blur(${f.toFixed(3)}rem)`),x.style.opacity=String(e.opacity),o.appendChild(x)}}return window.getComputedStyle(e.mount).position==="static"&&(e.mount.style.position="relative"),e.mount.appendChild(n),{element:n,setVisible(a){n.style.opacity=a?"1":"0"},destroy(){n.remove()}}}const ie=`:host {
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
`,oe=document.createElement("template");oe.innerHTML=`
  <style>${ie}</style>
  <span class="badge">
    <slot></slot>
  </span>
`;const re=`:host {
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
`,J="ui-button",Ct=document.createElement("template");Ct.innerHTML=`
  <style>${re}</style>
  <button type="button" part="button">
    <slot></slot>
  </button>
`;function ht(t){return t==="submit"||t==="reset"?t:"button"}class se extends HTMLElement{static get observedAttributes(){return["disabled","aria-label","type"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Ct.content.cloneNode(!0)),this.button=e.querySelector("button")}connectedCallback(){this.dataset.component=J,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return ht(this.getAttribute("type"))}set type(e){this.setAttribute("type",ht(e))}focus(e){this.button.focus(e)}click(){this.button.click()}syncAttributes(){this.button.disabled=this.disabled,this.button.type=this.type,this.tabIndex=this.disabled?-1:0;const e=this.getAttribute("aria-label");e?this.button.setAttribute("aria-label",e):this.button.removeAttribute("aria-label")}}function ae(){customElements.get(J)||customElements.define(J,se)}const le=`:host {
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
`,j="ui-bottom-sheet",At=document.createElement("template"),ce=["a[href]","button:not([disabled])","details summary","input:not([disabled])","select:not([disabled])","textarea:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(", ");let K=0;At.innerHTML=`
  <style>${le}</style>
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
`;function gt(t){const e=getComputedStyle(t);return t.hasAttribute("hidden")||t.getAttribute("aria-hidden")==="true"||e.display==="none"||e.visibility==="hidden"?!1:t.tagName.includes("-")?e.display==="contents"||!!t.getClientRects().length:t.offsetParent!==null||e.position==="fixed"||!!t.getClientRects().length}function G(t){if(!t.shadowRoot)return[];const e=[],n=new Set;function o(i){if(i instanceof HTMLSlotElement){const r=i.assignedElements({flatten:!0});r.length>0?r.forEach(o):Array.from(i.children).forEach(o);return}if(i instanceof HTMLElement&&gt(i)){if(i.shadowRoot){Array.from(i.shadowRoot.childNodes).forEach(o);return}!n.has(i)&&i.matches(ce)&&gt(i)&&(n.add(i),e.push(i)),Array.from(i.children).forEach(o)}}return Array.from(t.shadowRoot.childNodes).forEach(o),e}function de(t,e){if(e===t||e.contains(t))return!0;let n=t;for(;n;){if(n===e)return!0;const o=n.getRootNode();if(!(o instanceof ShadowRoot))break;n=o.host}return!1}function Z(t){return t.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?e.textContent?.trim().length:e.nodeType===Node.ELEMENT_NODE)}class ue extends HTMLElement{constructor(){super(),this.isAnimatingClose=!1,this.isSyncingOpenAttribute=!1,this.previousDocumentOverflow="",this.previousBodyOverflow="",this.triggerElement=null;const e=this.attachShadow({mode:"open"});e.append(At.content.cloneNode(!0)),this.dialog=e.querySelector(".bottom-sheet-dialog"),this.titleElement=e.querySelector(".bottom-sheet-title"),this.descriptionElement=e.querySelector(".bottom-sheet-description"),this.headerActionsContainer=e.querySelector(".bottom-sheet-header-actions"),this.footerContainer=e.querySelector(".bottom-sheet-footer"),this.floatingContainer=e.querySelector(".bottom-sheet-floating"),this.headerActionsSlot=e.querySelector('slot[name="header-actions"]'),this.footerSlot=e.querySelector('slot[name="footer"]'),this.floatingSlot=e.querySelector('slot[name="floating-content"]'),K+=1,this.titleId=`bottomSheetTitle${K}`,this.descriptionId=`bottomSheetDescription${K}`,this.handleAnimationEndBound=this.handleAnimationEnd.bind(this),this.handleCancelBound=this.handleCancel.bind(this),this.handleClickBound=this.handleClick.bind(this),this.handleKeyDownBound=this.handleKeyDown.bind(this),this.handleSlotChangeBound=this.syncSlotVisibility.bind(this)}static get observedAttributes(){return["description","open","title"]}connectedCallback(){this.dataset.component=j,this.dialog.addEventListener("animationend",this.handleAnimationEndBound),this.dialog.addEventListener("cancel",this.handleCancelBound),this.dialog.addEventListener("click",this.handleClickBound),this.dialog.addEventListener("keydown",this.handleKeyDownBound),this.addEventListener("keydown",this.handleKeyDownBound),this.headerActionsSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.footerSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.floatingSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.syncAttributes(),this.syncSlotVisibility(),this.hasAttribute("open")&&this.openInternal()}disconnectedCallback(){this.dialog.removeEventListener("animationend",this.handleAnimationEndBound),this.dialog.removeEventListener("cancel",this.handleCancelBound),this.dialog.removeEventListener("click",this.handleClickBound),this.dialog.removeEventListener("keydown",this.handleKeyDownBound),this.removeEventListener("keydown",this.handleKeyDownBound),this.headerActionsSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.footerSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.floatingSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.dialog.open&&this.dialog.close(),this.unlockDocumentScroll()}attributeChangedCallback(e){if(e==="open"){if(!this.isConnected||this.isSyncingOpenAttribute)return;this.hasAttribute("open")?this.openInternal():this.startClosing();return}this.syncAttributes()}get open(){return this.hasAttribute("open")}set open(e){this.toggleAttribute("open",e)}openBottomSheet(){this.open&&!this.isAnimatingClose||(this.triggerElement=document.activeElement instanceof HTMLElement?document.activeElement:null,this.open=!0)}closeBottomSheet(){!this.open&&!this.dialog.open||(this.open=!1)}focus(e){(G(this)[0]??this.dialog).focus(e)}syncAttributes(){const e=this.getAttribute("title")||"",n=this.getAttribute("description")||"";this.titleElement.id=this.titleId,this.titleElement.textContent=e,this.titleElement.hidden=e.length===0,this.descriptionElement.id=this.descriptionId,this.descriptionElement.textContent=n,this.descriptionElement.hidden=n.length===0,e.length>0?this.dialog.setAttribute("aria-labelledby",this.titleId):this.dialog.removeAttribute("aria-labelledby"),n.length>0?this.dialog.setAttribute("aria-describedby",this.descriptionId):this.dialog.removeAttribute("aria-describedby")}syncSlotVisibility(){this.headerActionsContainer.hidden=!Z(this.headerActionsSlot),this.footerContainer.hidden=!Z(this.footerSlot),this.floatingContainer.hidden=!Z(this.floatingSlot)}handleAnimationEnd(e){!this.isAnimatingClose||e.target!==this.dialog||(this.dialog.classList.remove("closing"),this.dialog.close(),this.isAnimatingClose=!1,this.unlockDocumentScroll(),this.restoreTriggerFocus(),this.dispatchEvent(new Event("close",{bubbles:!0,composed:!0})))}handleCancel(e){e.preventDefault(),this.closeBottomSheet()}handleClick(e){this.isAnimatingClose||e.target===this.dialog&&this.closeBottomSheet()}handleKeyDown(e){if(e.currentTarget===this&&e.composedPath().includes(this.dialog))return;if(e.key==="Escape"){e.preventDefault(),this.closeBottomSheet();return}if(e.key!=="Tab")return;const n=G(this);if(n.length===0){e.preventDefault(),this.dialog.focus();return}const o=e.composedPath()[0],i=o instanceof HTMLElement?o:document.activeElement instanceof HTMLElement?document.activeElement:null,r=i===null?-1:n.findIndex(w=>de(i,w)),l=e.shiftKey?-1:1,a=e.shiftKey?n.length-1:0,h=r===-1?a:(r+l+n.length)%n.length;e.preventDefault(),n[h].focus()}openInternal(){this.syncAttributes(),this.syncSlotVisibility(),this.isAnimatingClose&&(this.dialog.classList.remove("closing"),this.isAnimatingClose=!1),this.dialog.open?this.lockDocumentScroll():(this.lockDocumentScroll(),this.dialog.showModal()),requestAnimationFrame(()=>{if(!this.dialog.open)return;(G(this)[0]??this.dialog).focus()})}startClosing(){!this.dialog.open||this.isAnimatingClose||(this.dialog.classList.add("closing"),this.isAnimatingClose=!0)}lockDocumentScroll(){this.previousDocumentOverflow.length===0&&this.previousBodyOverflow.length===0&&(this.previousDocumentOverflow=document.documentElement.style.overflow,this.previousBodyOverflow=document.body.style.overflow),document.documentElement.style.overflow="hidden",document.body.style.overflow="hidden"}unlockDocumentScroll(){document.documentElement.style.overflow=this.previousDocumentOverflow,document.body.style.overflow=this.previousBodyOverflow,this.previousDocumentOverflow="",this.previousBodyOverflow=""}restoreTriggerFocus(){this.triggerElement&&document.contains(this.triggerElement)&&this.triggerElement.focus(),this.triggerElement=null}}function he(){customElements.get(j)||customElements.define(j,ue)}const ge=`:host {
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
`,Y="ui-card",_t=document.createElement("template");_t.innerHTML=`
  <style>${ge}</style>
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
`;function pe(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}class fe extends HTMLElement{static get observedAttributes(){return["title"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append(_t.content.cloneNode(!0)),this.footerContainer=e.querySelector(".card-component__footer"),this.footerSlot=e.querySelector('slot[name="footer"]'),this.footerSlot.addEventListener("slotchange",()=>{this.syncFooterVisibility()}),this.iconElement=e.querySelector(".card-component__icon"),this.notificationElement=e.querySelector(".connection-notification"),this.titleElement=e.querySelector(".card-component__title")}connectedCallback(){this.dataset.component=Y,this.syncAttributes(),this.syncFooterVisibility()}attributeChangedCallback(){this.syncAttributes()}get iconSvg(){return this.iconElement.innerHTML}set iconSvg(e){this.iconElement.innerHTML=e?pe(e,"card-component__icon"):""}setNotification(e,n="info"){if(!e){this.notificationElement.hidden=!0,this.notificationElement.textContent="",this.notificationElement.removeAttribute("data-status"),this.notificationElement.setAttribute("role","status"),this.notificationElement.setAttribute("aria-live","polite");return}this.notificationElement.hidden=!1,this.notificationElement.textContent=e,this.notificationElement.setAttribute("data-status",n),n==="error"||n==="danger"?(this.notificationElement.setAttribute("role","alert"),this.notificationElement.setAttribute("aria-live","assertive")):n==="warning"?(this.notificationElement.setAttribute("role","alert"),this.notificationElement.setAttribute("aria-live","polite")):(this.notificationElement.setAttribute("role","status"),this.notificationElement.setAttribute("aria-live","polite"))}syncAttributes(){this.titleElement.textContent=this.getAttribute("title")||""}syncFooterVisibility(){const e=this.footerSlot.assignedElements({flatten:!0}).length>0;this.footerContainer.hidden=!e}}function me(){customElements.get(Y)||customElements.define(Y,fe)}const be=`:host {
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
`,ve=document.createElement("template");ve.innerHTML=`
  <style>${be}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper duration-fields">
      <ui-input variant="number" inputmode="numeric"></ui-input>
      <ui-input variant="number" inputmode="numeric"></ui-input>
    </div>
  </div>
`;const we=`:host {
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
`,X="ui-file-upload",Lt=document.createElement("template");Lt.innerHTML=`
  <style>${we}</style>
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
`;class ye extends HTMLElement{static get observedAttributes(){return["accept","aria-label","disabled","label","multiple","name","progress-max","progress-message","progress-value","warning-text"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Lt.content.cloneNode(!0)),this.helperText=e.querySelector(".form-helper-text"),this.input=e.querySelector("input"),this.labelElement=e.querySelector("label"),this.progressBar=e.querySelector("progress"),this.progressContainer=e.querySelector(".progress-bar"),this.progressMessage=e.querySelector(".progress-bar__message"),this.input.addEventListener("change",n=>{n.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.input.addEventListener("input",n=>{n.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))})}connectedCallback(){this.dataset.component=X,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get accept(){return this.input.accept}set accept(e){this.setAttribute("accept",e)}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get files(){return this.input.files}get progressHidden(){return this.progressContainer.hidden}set progressHidden(e){this.progressContainer.hidden=e}get progressMax(){return this.progressBar.max}set progressMax(e){this.progressBar.max=e}get progressMessageText(){return this.progressMessage.textContent||""}set progressMessageText(e){this.progressMessage.textContent=e}get progressValue(){return this.progressBar.value}set progressValue(e){this.progressBar.value=e}get value(){return this.input.value}get warningText(){return this.helperText.textContent||""}set warningText(e){this.helperText.textContent=e}focus(e){this.input.focus(e)}syncAttributes(){const e=this.id||"file-upload",n=this.getAttribute("label")||"",o=this.getAttribute("warning-text")||"";this.input.id=e,this.input.accept=this.getAttribute("accept")||"",this.input.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.input.multiple=this.hasAttribute("multiple"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("name"),this.hasAttribute("progress-max")&&(this.progressBar.max=Number(this.getAttribute("progress-max"))||100),this.hasAttribute("progress-value")&&(this.progressBar.value=Number(this.getAttribute("progress-value"))||0),this.hasAttribute("progress-message")&&(this.progressMessage.textContent=this.getAttribute("progress-message")||""),this.labelElement.htmlFor=e,this.labelElement.textContent=n,this.labelElement.hidden=n.length===0,this.helperText.textContent=o,this.helperText.hidden=o.length===0}syncStringAttribute(e){const n=this.getAttribute(e);if(n===null){this.input.removeAttribute(e);return}this.input.setAttribute(e,n)}}function xe(){customElements.get(X)||customElements.define(X,ye)}const Te=`:host {
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
`,Q="ui-icon-button",It=document.createElement("template");It.innerHTML=`
  <style>${Te}</style>
  <button type="button" part="button">
    <slot></slot>
  </button>
`;function pt(t){return t==="submit"||t==="reset"?t:"button"}class Se extends HTMLElement{static get observedAttributes(){return["disabled","aria-label","type"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(It.content.cloneNode(!0)),this.button=e.querySelector("button")}connectedCallback(){this.dataset.component=Q,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return pt(this.getAttribute("type"))}set type(e){this.setAttribute("type",pt(e))}focus(e){this.button.focus(e)}click(){this.button.click()}syncAttributes(){this.button.disabled=this.disabled,this.button.type=this.type,this.tabIndex=this.disabled?-1:0;const e=this.getAttribute("aria-label");e?this.button.setAttribute("aria-label",e):this.button.removeAttribute("aria-label")}}function Ee(){customElements.get(Q)||customElements.define(Q,Se)}const ke='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>',Ce='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>',Ae=`:host {
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
`,tt="ui-input",Bt=document.createElement("template");Bt.innerHTML=`
  <style>${Ae}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <input />
      <span class="duration-fields__unit"></span>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;function _e(t){return t==="number"||t==="password"||t==="time"||t==="date"?t:"text"}function Le(t){return t==="password"||t==="number"||t==="time"||t==="date"?t:"text"}class Ie extends HTMLElement{constructor(){super(),this.isPasswordVisible=!1,this.customValidationMessage="";const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Bt.content.cloneNode(!0)),this.input=e.querySelector("input"),this.helperText=e.querySelector(".form-helper-text"),this.label=e.querySelector("label"),this.suffix=e.querySelector(".duration-fields__unit"),this.toggleButton=document.createElement("button"),this.wrapper=e.querySelector(".form-control__input-wrapper"),this.toggleButton.className="password-toggle-btn",this.toggleButton.type="button",this.input.addEventListener("input",n=>{this.syncValidationState(),n.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}),this.input.addEventListener("change",n=>{this.syncValidationState(),n.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.input.addEventListener("invalid",()=>{this.syncValidationState()}),this.toggleButton.addEventListener("click",()=>{this.togglePasswordVisibility()})}static get observedAttributes(){return["aria-label","aria-invalid","autocomplete","disabled","helper-text","invalid","inputmode","label","max","maxlength","min","name","placeholder","readonly","required","step","suffix","type","value","variant"]}connectedCallback(){this.hasAttribute("variant")||this.setAttribute("variant","text"),this.dataset.component=tt,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return this.input.type}set type(e){this.setAttribute("type",e)}get value(){return this.input.value}set value(e){this.input.value=e,this.syncValidationState()}focus(e){this.input.focus(e)}select(){this.input.select()}get validationMessage(){return this.input.validationMessage}get validity(){return this.input.validity}get willValidate(){return this.input.willValidate}checkValidity(){const e=this.input.checkValidity();return this.syncValidationState(),e}reportValidity(){const e=this.input.reportValidity();return this.syncValidationState(),e}setCustomValidity(e){this.customValidationMessage=e,this.input.setCustomValidity(e),this.syncValidationState()}syncAttributes(){const e=_e(this.getAttribute("variant")),n=this.getAttribute("helper-text")||"",o=this.id?`${this.id}Input`:"input",i=this.getAttribute("label")||"",r=this.getAttribute("suffix")||"",l=e==="password"?this.isPasswordVisible?"text":"password":this.getAttribute("type")||Le(e);if(this.input.id=o,this.input.type=l,this.input.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.input.readOnly=this.hasAttribute("readonly"),this.input.required=this.hasAttribute("required"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("autocomplete"),this.syncStringAttribute("inputmode"),this.syncStringAttribute("max"),this.syncStringAttribute("maxlength"),this.syncStringAttribute("min"),this.syncStringAttribute("name"),this.syncStringAttribute("placeholder"),this.syncStringAttribute("step"),this.hasAttribute("value")&&this.input.value!==this.getAttribute("value")&&(this.input.value=this.getAttribute("value")||""),this.input.setCustomValidity(this.customValidationMessage),this.label.htmlFor=o,this.label.textContent=i,this.label.hidden=i.length===0,this.helperText.textContent=n,this.helperText.hidden=n.length===0,this.wrapper.classList.toggle("duration-fields",e==="number"),this.suffix.textContent=r,this.suffix.hidden=e!=="number"||r.length===0,n.length>0){const a=`${o}HelperText`;this.helperText.id=a,this.input.setAttribute("aria-describedby",a)}else this.helperText.removeAttribute("id"),this.input.removeAttribute("aria-describedby");e==="password"?(this.toggleButton.isConnected||this.wrapper.append(this.toggleButton),this.toggleButton.disabled=this.disabled,this.toggleButton.setAttribute("aria-label",this.isPasswordVisible?"Hide password":"Show password"),this.toggleButton.innerHTML=Be(this.isPasswordVisible?ke:Ce,"password-icon")):(this.isPasswordVisible=!1,this.toggleButton.remove()),this.syncValidationState()}syncStringAttribute(e){const n=this.getAttribute(e);if(n===null){this.input.removeAttribute(e);return}this.input.setAttribute(e,n)}togglePasswordVisibility(){this.isPasswordVisible=!this.isPasswordVisible,this.syncAttributes()}syncValidationState(){const e=this.hasAttribute("invalid")||this.getAttribute("aria-invalid")==="true"||!this.input.validity.valid;this.classList.toggle("error",e),this.input.classList.toggle("error",e),this.hasAttribute("invalid")!==e&&this.toggleAttribute("invalid",e),this.getAttribute("aria-invalid")!==String(e)&&this.setAttribute("aria-invalid",String(e)),this.input.getAttribute("aria-invalid")!==String(e)&&this.input.setAttribute("aria-invalid",String(e))}}function Be(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}function Me(){customElements.get(tt)||customElements.define(tt,Ie)}const qe=`:host {
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
`,et="ui-network-list",Mt="networkList",nt="network-list-label",qt=document.createElement("template");qt.innerHTML=`
  <style>${qe}</style>
  <div class="networks">
    <span id="${nt}" hidden>Available networks</span>
    <ul
      id="${Mt}"
      class="networks__list"
      role="listbox"
      aria-labelledby="${nt}"
      tabindex="0"
    ></ul>
  </div>
`;class ze extends HTMLElement{static get observedAttributes(){return["aria-label","label"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(qt.content.cloneNode(!0)),this.labelElement=e.querySelector(`#${nt}`),this.listElement=e.querySelector(`#${Mt}`),this.listElement.addEventListener("keydown",n=>{(n.key==="ArrowDown"||n.key==="ArrowUp"||n.key==="Home"||n.key==="End"||n.key===" ")&&n.preventDefault()})}connectedCallback(){this.tabIndex=0,this.dataset.component=et,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}appendItem(e){this.listElement.appendChild(e)}clearItems(){this.listElement.innerHTML=""}focus(e){this.listElement.focus(e)}getOptions(){return Array.from(this.listElement.querySelectorAll('[role="option"]'))}scrollOptionIntoView(e){const n=this.getOptions()[e];if(!n)return;const o=this.listElement.scrollTop,i=o+this.listElement.clientHeight,r=n.offsetTop,l=r+n.offsetHeight;if(r<o){this.listElement.scrollTop=r;return}l>i&&(this.listElement.scrollTop=l-this.listElement.clientHeight)}setActiveDescendant(e){if(e){this.listElement.setAttribute("aria-activedescendant",e);return}this.listElement.removeAttribute("aria-activedescendant")}setEmptyState(e){this.clearItems(),this.appendItem(e)}syncAttributes(){const e=this.getAttribute("label")||"Available networks",n=this.getAttribute("aria-label");this.labelElement.textContent=e,n?this.listElement.setAttribute("aria-label",n):this.listElement.removeAttribute("aria-label")}}function Ne(){customElements.get(et)||customElements.define(et,ze)}const Pe=`:host {
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
`,it="ui-network-status",zt="actionBtn",Nt="settingsBtn",Pt="wifiStatusLabel",Ot="wifiStatusIcon",$t="wifiStatusNetwork",Dt=document.createElement("template");Dt.innerHTML=`
  <style>${Pe}</style>
  <div class="wifi-status-card">
    <div class="wifi-status-card__content">
      <div class="wifi-status-card__status">
        <span class="card-icon" id="${Ot}"></span>
        <span id="${Pt}" class="wifi-status-card__label">
          Disconnected
        </span>
        <span
          id="${$t}"
          class="wifi-status-card__network"
        ></span>
      </div>
      <div class="wifi-status-card__actions">
        <ui-button
          id="${zt}"
          variant="outline"
          inverse
          aria-label="Connect"
        >
          Connect
        </ui-button>
        <ui-button
          id="${Nt}"
          variant="outline"
          inverse
          aria-label="Settings"
        >
          Settings
        </ui-button>
      </div>
    </div>
  </div>
`;function Oe(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}class $e extends HTMLElement{static get observedAttributes(){return["action-label","network","status-label"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append(Dt.content.cloneNode(!0)),this.actionButton=e.querySelector(`#${zt}`),this.actionButton.addEventListener("click",n=>{n.stopPropagation(),this.dispatchEvent(new Event("action",{bubbles:!0,composed:!0}))}),this.iconElement=e.querySelector(`#${Ot}`),this.labelElement=e.querySelector(`#${Pt}`),this.networkElement=e.querySelector(`#${$t}`),this.settingsButton=e.querySelector(`#${Nt}`),this.settingsButton.addEventListener("click",n=>{n.stopPropagation(),this.dispatchEvent(new Event("settings",{bubbles:!0,composed:!0}))})}connectedCallback(){this.dataset.component=it,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get actionDisabled(){return!!this.actionButton.disabled}set actionDisabled(e){this.actionButton.disabled=e}get iconSvg(){return this.iconElement.innerHTML}set iconSvg(e){this.iconElement.innerHTML=e?Oe(e,"wifi-icon"):""}get network(){return this.getAttribute("network")||""}set network(e){this.setAttribute("network",e)}get actionLabel(){return this.getAttribute("action-label")||"Connect"}set actionLabel(e){this.setAttribute("action-label",e)}get statusLabel(){return this.getAttribute("status-label")||"Disconnected"}set statusLabel(e){this.setAttribute("status-label",e)}syncAttributes(){this.actionButton.textContent=this.actionLabel,this.actionButton.setAttribute("aria-label",this.actionLabel),this.labelElement.textContent=this.statusLabel,this.networkElement.textContent=this.network,this.networkElement.hidden=this.network.length===0}}function De(){customElements.get(it)||customElements.define(it,$e)}const Fe=`:host {
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
`,Ue=document.createElement("template");Ue.innerHTML=`
  <style>${Fe}</style>
  <div class="form-control">
    <label></label>
    <div class="range-slider">
      <input class="range-slider__range" type="range" />
      <span class="range-slider__value"></span>
    </div>
  </div>
`;const Ve='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80 240-320l57-57 183 183 183-183 57 57L480-80ZM298-584l-58-56 240-240 240 240-58 56-182-182-182 182Z"/></svg>',He=`:host {
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
`,ot="ui-select",Ft=document.createElement("template");Ft.innerHTML=`
  <style>${He}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <select></select>
      <span class="select-icon"></span>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;class Re extends HTMLElement{constructor(){super(),this.customValidationMessage="";const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Ft.content.cloneNode(!0)),this.helperText=e.querySelector(".form-helper-text"),this.labelElement=e.querySelector("label"),this.select=e.querySelector("select");const n=e.querySelector(".select-icon");n.innerHTML=Ge(Ve,"select-icon"),this.select.addEventListener("change",o=>{this.syncValidationState(),o.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.select.addEventListener("input",o=>{this.syncValidationState(),o.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}),this.select.addEventListener("invalid",()=>{this.syncValidationState()})}static get observedAttributes(){return["aria-invalid","aria-label","disabled","helper-text","invalid","label","name","required","value"]}connectedCallback(){this.moveLightDomOptions(),this.dataset.component=ot,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get innerHTML(){return this.select.innerHTML}set innerHTML(e){this.select.innerHTML=e,this.syncValidationState()}get value(){return this.select.value}set value(e){this.select.value=e,this.syncValidationState()}appendChild(e){return e instanceof HTMLOptionElement||e instanceof HTMLOptGroupElement?(this.select.appendChild(e),e):super.appendChild(e)}focus(e){this.select.focus(e)}get validationMessage(){return this.select.validationMessage}get validity(){return this.select.validity}get willValidate(){return this.select.willValidate}checkValidity(){const e=this.select.checkValidity();return this.syncValidationState(),e}reportValidity(){const e=this.select.reportValidity();return this.syncValidationState(),e}setCustomValidity(e){this.customValidationMessage=e,this.select.setCustomValidity(e),this.syncValidationState()}moveLightDomOptions(){Array.from(this.children).forEach(e=>{(e instanceof HTMLOptionElement||e instanceof HTMLOptGroupElement)&&this.select.appendChild(e)})}syncAttributes(){const e=this.getAttribute("helper-text")||"",n=this.id?`${this.id}Select`:"select",o=this.getAttribute("label")||"";if(this.select.id=n,this.select.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.select.required=this.hasAttribute("required"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("name"),this.hasAttribute("value")&&(this.select.value=this.getAttribute("value")||""),this.select.setCustomValidity(this.customValidationMessage),this.labelElement.htmlFor=n,this.labelElement.textContent=o,this.labelElement.hidden=o.length===0,this.helperText.textContent=e,this.helperText.hidden=e.length===0,e.length>0){const i=`${n}HelperText`;this.helperText.id=i,this.select.setAttribute("aria-describedby",i)}else this.helperText.removeAttribute("id"),this.select.removeAttribute("aria-describedby");this.syncValidationState()}syncStringAttribute(e){const n=this.getAttribute(e);if(n===null){this.select.removeAttribute(e);return}this.select.setAttribute(e,n)}syncValidationState(){const e=this.hasAttribute("invalid")||this.getAttribute("aria-invalid")==="true"||!this.select.validity.valid;this.classList.toggle("error",e),this.select.classList.toggle("error",e),this.hasAttribute("invalid")!==e&&this.toggleAttribute("invalid",e),this.getAttribute("aria-invalid")!==String(e)&&this.setAttribute("aria-invalid",String(e)),this.select.getAttribute("aria-invalid")!==String(e)&&this.select.setAttribute("aria-invalid",String(e))}}function Ke(){customElements.get(ot)||customElements.define(ot,Re)}function Ge(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}const Ze=`:host {
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
`,We=document.createElement("template");We.innerHTML=`
  <style>${Ze}</style>
  <div class="form-control">
    <div class="switch-container">
      <button type="button" part="button">
        <span class="knob"></span>
      </button>
      <span class="switch-label"></span>
    </div>
  </div>
`;const Je=`:host {
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
`,rt="ui-toast",Ut=document.createElement("template");Ut.innerHTML=`
  <style>${Je}</style>
  <dialog class="toast-dialog" aria-live="polite">
    <p class="toast-dialog__message"></p>
  </dialog>
`;function ft(t){return t==="success"||t==="info"||t==="warning"||t==="error"||t==="danger"?t:null}class je extends HTMLElement{static get observedAttributes(){return["aria-label","message","status"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append(Ut.content.cloneNode(!0)),this.dialog=e.querySelector("dialog"),this.messageElement=e.querySelector(".toast-dialog__message")}connectedCallback(){this.dataset.component=rt,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get message(){return this.messageElement.textContent||""}set message(e){this.setAttribute("message",e)}get status(){return ft(this.getAttribute("status"))}set status(e){if(e){this.setAttribute("status",e);return}this.removeAttribute("status")}show(e,n){typeof e=="string"&&(this.message=e),n&&(this.status=n),this.dialog.open||this.dialog.show()}close(e){this.dialog.close(e)}syncAttributes(){const e=this.getAttribute("aria-label"),n=this.getAttribute("message")||"",o=ft(this.getAttribute("status"));e?this.dialog.setAttribute("aria-label",e):this.dialog.removeAttribute("aria-label"),this.messageElement.textContent=n,this.messageElement.id=this.id?`${this.id}Message`:"statusToastMessage",this.dialog.id=this.id||"statusToast",o?this.dialog.setAttribute("data-status",o):this.dialog.removeAttribute("data-status")}}function Ye(){customElements.get(rt)||customElements.define(rt,je)}const Xe='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m109-531-85-85q92-89 210-136.5T480-800q128 0 246 47.5T936-616l-85 85q-75-72-171-110.5T480-680q-104 0-200 38.5T109-531Zm169 169-84-84q59-55 132.5-84.5T480-560q80 0 153.5 29.5T766-446l-84 84q-42-38-93.5-58T480-440q-57 0-108.5 20T278-362Zm202 202q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Z"/></svg>',Qe='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg>',tn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM361-353q25-18 55.5-28t63.5-10q33 0 63.5 10t55.5 28l245-245q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l245 245Z"/></svg>',en='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM299-415q38-28 84-43.5t97-15.5q51 0 97 15.5t84 43.5l183-183q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l183 183Z"/></svg>',nn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM232-482q53-38 116-59.5T480-563q69 0 132 21.5T728-482l116-116q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l116 116Z"/></svg>',on='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q95-97 219.5-148.5T480-800q136 0 260.5 51.5T960-600L480-120Z"/></svg>',rn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-601q93-93 215.5-146T480-800q142 0 264.5 53T960-601l-56 57q-81-81-190-128.5T480-720q-103 0-195 32.5T117-597l419 420-56 57Zm384-40L761-262q-18 11-38 16.5t-43 5.5q-68 0-114-46t-46-114q0-68 46-114t114-46q68 0 114 46t46 114q0 23-5.5 43T818-319l102 103-56 56ZM680-320q34 0 57-23t23-57q0-34-23-57t-57-23q-34 0-57 23t-23 57q0 34 23 57t57 23ZM480-177Z"/></svg>',Vt='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70q66 0 121 33t87 87h432v240h-80v120H600v-120H488q-32 54-87 87t-121 33Zm0-80q66 0 106-40.5t48-79.5h246v120h80v-120h80v-80H434q-8-39-48-79.5T280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-80q33 0 56.5-23.5T360-480q0-33-23.5-56.5T280-560q-33 0-56.5 23.5T200-480q0 33 23.5 56.5T280-400Zm0-80Z"/></svg>',sn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>',an='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>',ln='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m720-80 120-120-28-28-72 72v-164h-40v164l-72-72-28 28L720-80ZM480-800 243-663l237 137 237-137-237-137ZM120-321v-318q0-22 10.5-40t29.5-29l280-161q10-5 19.5-8t20.5-3q11 0 21 3t19 8l280 161q19 11 29.5 29t10.5 40v159h-80v-116L479-434 200-596v274l240 139v92L160-252q-19-11-29.5-29T120-321ZM720 0q-83 0-141.5-58.5T520-200q0-83 58.5-141.5T720-400q83 0 141.5 58.5T920-200q0 83-58.5 141.5T720 0ZM480-491Z"/></svg>',cn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Zm0-420ZM160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v13q-11 22-16 45t-4 47q-10-2-19.5-3.5T480-720q-66 0-113 47t-47 113v280h320v-257q18 8 38.5 12.5T720-520v240h80v80H160Zm475-435q-35-35-35-85t35-85q35-35 85-35t85 35q35 35 35 85t-35 85q-35 35-85 35t-85-35Z"/></svg>',dn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>',un={"Content-Type":"application/json",Accept:"application/json"},mt=64,hn=2e3,gn=8,pn=2e3,fn=8,mn=3e3,bn=750,vn=20,wn="/api/settings",yn=`${wn}/time`,xn="/api/runtime/time",Tn="/api/runtime/update",Sn="/api/update",En=1e4;async function B(t,e){const n=new AbortController,o=setTimeout(()=>n.abort(),En);let i;try{i=await fetch(t,{cache:"no-store",...e,signal:e?.signal??n.signal,headers:{...un,...e?.headers||{}}})}catch(h){throw n.signal.aborted?new Error(`Request to ${t} timed out. Check the device is still reachable.`):h}finally{clearTimeout(o)}const r=i.headers.get("content-type")||"",l=await i.text();if(!r.includes("application/json"))throw new Error(`Unexpected response for ${t}. Make sure you are connected to the device AP and loading the portal from the ESP32.`);const a=JSON.parse(l);if(!i.ok||a.success!==!0)throw new Error(a.message||"Request failed.");return a}const kn=(t,e)=>B(t,e),Cn=(t,e)=>B(t,e),An=(t,e)=>B(t,e),_n=(t,e)=>B(t,e),Ht=(t,e)=>B(t,e),Ln=(t,e)=>B(t,e);function _(t){const e=document.getElementById(t);if(!e)throw new Error(`Required portal element "#${t}" was not found.`);return e}function In(){return{wifiStatusCard:_("wifiStatusCard"),wifiSettingsSheet:_("wifiSettingsSheet"),wifiSettingsCloseBtn:_("wifiSettingsCloseBtn"),wifiSettingsNotification:_("wifiSettingsNotification"),networkList:_("networkList"),passwordInput:_("password"),scanBtn:_("scanBtn"),connectBtn:_("connectBtn"),geminiCard:_("geminiCard"),geminiApiKeyInput:_("geminiApiKeyInput"),geminiClearBtn:_("geminiClearBtn"),geminiSaveBtn:_("geminiSaveBtn"),timezoneLocationCard:_("timezoneLocationCard"),timezoneSelect:_("timezoneSelect"),manualTimeInput:_("manualTimeInput"),manualDateInput:_("manualDateInput"),timezoneLocationClearBtn:_("timezoneLocationClearBtn"),timezoneLocationSaveBtn:_("timezoneLocationSaveBtn")}}function Rt(t){return(e,n="info")=>{t.setNotification(e,n)}}function Bn(t){return(e,n="info")=>{if(!e){t.hidden=!0,t.textContent="",t.removeAttribute("data-status"),t.setAttribute("role","status"),t.setAttribute("aria-live","polite");return}t.hidden=!1,t.textContent=e,t.setAttribute("data-status",n),n==="error"||n==="danger"?(t.setAttribute("role","alert"),t.setAttribute("aria-live","assertive")):n==="warning"?(t.setAttribute("role","alert"),t.setAttribute("aria-live","polite")):(t.setAttribute("role","status"),t.setAttribute("aria-live","polite"))}}function lt(t){t.classList.remove("error"),t.removeAttribute("invalid"),t.setAttribute("aria-invalid","false"),t.setCustomValidity?.("")}function ct(t,e){t.classList.add("error"),t.setAttribute("invalid",""),t.setAttribute("aria-invalid","true"),t.setCustomValidity?.(e)}function Mn(t,e){t.setAttribute("aria-checked",e?"true":"false")}function qn(t){return t.getAttribute("aria-checked")==="true"}function zn(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}function Nn(t){return new Promise(e=>{setTimeout(e,t)})}function Pn(){const t=document.documentElement.lang?.trim();return t||"en-US"}function On(t){try{return new Intl.DateTimeFormat(Pn(),{hour:"numeric",timeZone:t,timeZoneName:"longGeneric"}).formatToParts(new Date).find(o=>o.type==="timeZoneName")?.value?.trim()||""}catch(e){return console.warn(`Failed to format timezone label for "${t}".`,e),""}}function bt(t){return/^(GMT|UTC)(?:[+-]\d{1,2}(?::\d{2})?)?$/.test(t)}function $n(t){return(t.split("/").pop()||t).replace(/_/g," ")}function Kt(t){return t.split("/").map(e=>e.replace(/_/g," ")).join(" / ")}function Dn(t){const e=t.map(i=>{const r=On(i.name);return{cityLabel:$n(i.name),genericLabel:r,name:i.name}}),n=new Map(e.map(i=>[i.name,i])),o=new Map;return e.forEach(i=>{!i.genericLabel||bt(i.genericLabel)||o.set(i.genericLabel,(o.get(i.genericLabel)||0)+1)}),new Map(t.map(i=>{const r=n.get(i.name),l=i.description?.trim()||"";if(r?.genericLabel&&!bt(r.genericLabel)){const h=(o.get(r.genericLabel)||0)>1?`${r.genericLabel} (${r.cityLabel})`:r.genericLabel;return[i.name,h]}return l?[i.name,l]:[i.name,Kt(i.name)]}))}function Fn(t,e){return e.get(t.name)||t.description?.trim()||Kt(t.name)}function Un(t){const e=t.value.trim();if(!e)return null;const n=/^(\d{2}):(\d{2})$/.exec(e);if(!n)return null;const o=Number.parseInt(n[1],10),i=Number.parseInt(n[2],10);return!Number.isFinite(o)||!Number.isFinite(i)||o<0||o>23||i<0||i>59?null:o*60+i}const Vn=2e3,Hn=45;function Rn(t){let e=!1,n="";const o=(f,g="info")=>t.card.setNotification(f,g),i=()=>t.fileInput.files?.[0]??null;function r(){t.fileInput.disabled=e,t.uploadBtn.disabled=e||!i()}function l(f){n=f,t.versionText.textContent=f?`Installed version: ${f}`:"Installed version: unknown"}async function a(){const g=(await _n(Tn)).runtime?.version??"";return l(g),g}function h(f){return new Promise((g,p)=>{const S=new XMLHttpRequest;S.open("POST",Sn),S.setRequestHeader("Content-Type","application/octet-stream"),S.upload.onprogress=C=>{if(!C.lengthComputable)return;t.fileInput.progressMax=C.total,t.fileInput.progressValue=C.loaded;const c=Math.round(C.loaded/C.total*100);t.fileInput.progressMessageText=c<100?`Uploading… ${c}%`:"Checking and installing…"},S.onload=()=>{try{g(JSON.parse(S.responseText))}catch{p(new Error("The device sent an unexpected reply."))}},S.onerror=()=>p(new Error("The connection to the device was lost.")),S.send(f)})}async function w(f){for(let g=0;g<Hn;g+=1){await new Promise(p=>window.setTimeout(p,Vn));try{const p=await a();p===f?o(`The device restarted and is still on version ${p}.`,"info"):o(`Updated to version ${p}.`,"success");return}catch{}}o("The update was installed and the device restarted. Reconnect to the device and reload this page to confirm the new version.","info")}async function x(){const f=i();if(!f||e)return;if(!f.name.toLowerCase().endsWith(".bin")){o("Choose a firmware update file ending in .bin.","error");return}e=!0,r();const g=n;t.fileInput.progressHidden=!1,t.fileInput.progressValue=0,t.fileInput.progressMessageText="Starting…",o("Uploading. Keep this page open and the device powered.","info");try{const p=await h(f);if(p.success!==!0)throw new Error(p.message||"The device rejected the update.");t.fileInput.progressMessageText="Installed. Restarting…",o("Update installed. The device is restarting…","info"),await w(g)}catch(p){t.fileInput.progressHidden=!0,o(p instanceof Error?p.message:"The update failed.","error")}finally{e=!1,r()}}function T(){t.fileInput.progressHidden=!0,t.fileInput.addEventListener("change",r),t.uploadBtn.addEventListener("click",()=>{x()}),r()}return{bind:T,refreshVersion:async()=>{try{await a()}catch(f){console.error("Firmware version check failed:",f),l("")}}}}function F(t,e,n){t.hasKey=n?.has_key===!0,t.last4=typeof n?.last4=="string"?n.last4:"",e.value=t.hasKey?t.last4?`******${t.last4}`:"******":""}function vt(t,e,n){t.hasKey=!1,t.last4="",e.value="",n("")}async function wt(t,e,n,o,i,r,l){const a=e.value.trim();if(!a){n(`${l} is required.`,"warning");return}t.isBusy=!0,n(r,"info"),o();try{const h=await i(t.settingsApi,{method:"PATCH",body:JSON.stringify({api_key:a})});F(t,e,h.settings),n(h.message||`${l} stored.`,"success")}catch(h){console.error(`${l} save failed:`,h),n(h instanceof Error?h.message:`Failed to store ${l}.`,"error")}finally{t.isBusy=!1,o()}}async function yt(t,e,n,o,i,r,l){t.isBusy=!0,n(r,"info"),o();try{const a=await i(t.resetApi,{method:"POST"});F(t,e,a.settings),n(a.message||l,"success")}catch(a){console.error(`${l} failed:`,a),n(a instanceof Error?a.message:`Failed to clear ${l}.`,"error")}finally{t.isBusy=!1,o()}}function Kn(t){const e={hasKey:!1,isBusy:!1,last4:"",resetApi:"/api/settings/gemini/reset",settingsApi:"/api/settings/gemini"},n={hasKey:!1,isBusy:!1,last4:"",resetApi:"/api/settings/openai/reset",settingsApi:"/api/settings/openai"};function o(g){const p=g?.routes;e.settingsApi=p?.settings||"/api/settings/gemini",e.resetApi=p?.reset||"/api/settings/gemini/reset"}function i(g){const p=g?.routes;n.settingsApi=p?.settings||"/api/settings/openai",n.resetApi=p?.reset||"/api/settings/openai/reset"}function r(g){F(e,t.geminiApiKeyInput,g)}function l(){vt(e,t.geminiApiKeyInput,t.notifyGemini)}function a(g){F(n,t.openAiApiKeyInput,g)}function h(){vt(n,t.openAiApiKeyInput,t.notifyOpenAi)}async function w(){if(!t.isGeminiModuleActive()||e.isBusy||e.hasKey)return;if(!t.geminiApiKeyInput.value.trim()){t.notifyGemini("Gemini API key is required.","warning");return}await wt(e,t.geminiApiKeyInput,t.notifyGemini,t.updateButtons,t.fetchGeminiModuleJson,"Saving Gemini API key...","Gemini API key")}async function x(){!t.isGeminiModuleActive()||e.isBusy||await yt(e,t.geminiApiKeyInput,t.notifyGemini,t.updateButtons,t.fetchGeminiModuleJson,"Clearing Gemini API key...","Gemini API key cleared.")}async function T(){if(!t.isOpenAiModuleActive()||n.isBusy||n.hasKey)return;if(!t.openAiApiKeyInput.value.trim()){t.notifyOpenAi("OpenAI API key is required.","warning");return}await wt(n,t.openAiApiKeyInput,t.notifyOpenAi,t.updateButtons,t.fetchOpenAiModuleJson,"Saving OpenAI API key...","OpenAI API key")}async function f(){!t.isOpenAiModuleActive()||n.isBusy||await yt(n,t.openAiApiKeyInput,t.notifyOpenAi,t.updateButtons,t.fetchOpenAiModuleJson,"Clearing OpenAI API key...","OpenAI API key cleared.")}return{applyGeminiSettings:r,applyOpenAiSettings:a,clearGeminiKey:x,clearGeminiSettings:l,clearOpenAiKey:f,clearOpenAiSettings:h,getGeminiHasKey:()=>e.hasKey,getOpenAiHasKey:()=>n.hasKey,isGeminiBusy:()=>e.isBusy,isOpenAiBusy:()=>n.isBusy,saveGeminiKey:w,saveOpenAiKey:T,updateGeminiRoutes:o,updateOpenAiRoutes:i}}const Gn=101010256,Zn=33639248,Wn=67324752;function Jn(t){const e=new DataView(t.buffer,t.byteOffset,t.byteLength);let n=-1;for(let a=t.length-22;a>=Math.max(0,t.length-22-65535);a-=1)if(e.getUint32(a,!0)===Gn){n=a;break}if(n<0)throw new Error("This file is not a valid EPUB (no ZIP directory found).");const o=e.getUint16(n+10,!0);let i=e.getUint32(n+16,!0);const r=new TextDecoder,l=new Map;for(let a=0;a<o;a+=1){if(i+46>t.length||e.getUint32(i,!0)!==Zn)throw new Error("This EPUB is damaged (bad ZIP directory).");const h=e.getUint16(i+10,!0),w=e.getUint32(i+20,!0),x=e.getUint16(i+28,!0),T=e.getUint16(i+30,!0),f=e.getUint16(i+32,!0),g=e.getUint32(i+42,!0),p=r.decode(t.subarray(i+46,i+46+x));l.set(p,{name:p,method:h,compressedSize:w,localHeaderOffset:g}),i+=46+x+T+f}return l}async function jn(t){const e=new Blob([t]).stream().pipeThrough(new DecompressionStream("deflate-raw"));return new Uint8Array(await new Response(e).arrayBuffer())}async function Yn(t,e){const n=new DataView(t.buffer,t.byteOffset,t.byteLength),o=e.localHeaderOffset;if(n.getUint32(o,!0)!==Wn)throw new Error(`This EPUB is damaged (${e.name}).`);const i=n.getUint16(o+26,!0),r=n.getUint16(o+28,!0),l=o+30+i+r,a=t.subarray(l,l+e.compressedSize);if(e.method===0)return a;if(e.method===8)return jn(a);throw new Error(`This EPUB uses an unsupported compression method (${e.method}).`)}async function W(t,e,n){const o=e.get(n);if(!o)throw new Error(`This EPUB is missing ${n}.`);return new TextDecoder().decode(await Yn(t,o))}const Xn=new Set(["p","div","section","article","header","footer","blockquote","li","ul","ol","h1","h2","h3","h4","h5","h6","pre","table","tr","figure","figcaption","hr"]),Qn=new Set(["script","style","head","title","nav"]);function ti(t,e){const n=(t?`${t}/${e}`:e).split("/"),o=[];for(const i of n)i===".."?o.pop():i!=="."&&i!==""&&o.push(i);return o.join("/")}function xt(t){return new DOMParser().parseFromString(t,"application/xml")}function N(t,e){return Array.from(t.getElementsByTagName("*")).filter(n=>n.localName===e)}function ei(t){const e=[];let n="";const o=()=>{const r=n.replace(/[\s\u00a0]+/g," ").trim();r&&e.push(r),n=""},i=r=>{if(r.nodeType===Node.TEXT_NODE){n+=r.textContent??"";return}if(r.nodeType!==Node.ELEMENT_NODE)return;const l=r,a=l.localName.toLowerCase();if(Qn.has(a))return;if(a==="br"){n+=" ";return}const h=Xn.has(a);h&&o(),l.childNodes.forEach(i),h&&o()};return i(t),o(),e.join(`

`)}async function ni(t){const e=new Uint8Array(t),n=Jn(e),o=xt(await W(e,n,"META-INF/container.xml")),i=N(o,"rootfile")[0]?.getAttribute("full-path");if(!i)throw new Error("This EPUB does not say where its contents are.");const r=i.includes("/")?i.slice(0,i.lastIndexOf("/")):"",l=xt(await W(e,n,i)),a=N(l,"title")[0]?.textContent?.trim()??"",h=new Map;for(const T of N(l,"item")){const f=T.getAttribute("id"),g=T.getAttribute("href");f&&g&&h.set(f,ti(r,decodeURIComponent(g)))}const w=[];for(const T of N(l,"itemref")){const f=h.get(T.getAttribute("idref")??"");if(!f||!n.has(f))continue;const g=await W(e,n,f);let p=new DOMParser().parseFromString(g,"application/xhtml+xml");p.getElementsByTagName("parsererror").length>0&&(p=new DOMParser().parseFromString(g,"text/html"));const S=N(p,"body")[0]??p.documentElement,C=ei(S);C&&w.push(C)}if(w.length===0)throw new Error("No readable text was found in this EPUB.");const x=(a?`${a}

`:"")+w.join(`

`);return{title:a,text:x}}const ii={note:"Note",task:"Task",idea:"Idea"};function U(t){return ii[t]??"Note"}function O(t){return String(t).padStart(2,"0")}function Gt(t){if(t.time_valid&&t.created>0){const e=new Date(t.created*1e3);return`${e.getFullYear()}-${O(e.getMonth()+1)}-${O(e.getDate())} ${O(e.getHours())}:${O(e.getMinutes())}`}return t.date||"Unknown date"}function Tt(t){return t.replace(/\s+/g," ").trim()}function oi(t,e){const n=[...t].sort((i,r)=>r.created-i.created),o=["---","source: Brain Dump",`exported: ${e.toISOString()}`,`recordings: ${n.length}`,"---","","# Brain Dump",""];for(const i of n){const r=Tt(i.title)||U(i.tag);o.push(`## ${Gt(i)} · ${U(i.tag)} · ${r}`,"");const l=i.transcript.trim(),a=l||(i.pending_transcription?"_Waiting for a transcript._":"_No transcript (audio only)._");if(i.tag==="task"){const h=i.due?` 📅 ${i.due.slice(0,10)}`:"",w=i.due.length>10?` ${i.due.slice(11)}`:"";o.push(`- [${i.completed?"x":" "}] ${Tt(a)}${h}${w}`)}else o.push(a);i.follow_up&&o.push("","#follow-up"),o.push("")}return o.join(`
`)}const St="X-Share-Pin",Zt="braindump.sharePin";function ri(){try{return sessionStorage.getItem(Zt)??""}catch{return""}}function si(t){try{sessionStorage.setItem(Zt,t)}catch{}}function Et(t,e){const n=URL.createObjectURL(t),o=document.createElement("a");o.href=n,o.download=e,document.body.append(o),o.click(),o.remove(),window.setTimeout(()=>URL.revokeObjectURL(n),1e4)}function ai(t){return t>=1024*1024?`${(t/(1024*1024)).toFixed(1)} MB`:`${Math.max(1,Math.round(t/1024))} KB`}async function li(){try{const t=await fetch("/api/share/status",{cache:"no-store"});return t.ok?(await t.json()).mode==="share"?"share":"setup":"unavailable"}catch{return"unavailable"}}function kt(t,e){let n=e==="share"?ri():"",o=[],i=!1;const r=()=>n?{[St]:n}:{};async function l(u,d={}){const m=await fetch(u,{cache:"no-store",...d,headers:{Accept:"application/json",...r(),...d.headers??{}}}),k=await m.json().catch(()=>({}));if(m.status===401)throw a("Enter the PIN shown on the device."),new Error(k.message||"PIN needed.");if(!m.ok||k.success!==!0)throw new Error(k.message||"The device could not do that.");return k}function a(u=""){t.signInCard.hidden=!1,t.recordingsCard.hidden=!0,t.booksCard.hidden=!0,t.signInCard.setNotification(u,u?"error":"info"),t.pinInput.focus()}function h(){t.signInCard.hidden=!0,t.recordingsCard.hidden=!1,t.booksCard.hidden=!1}function w(){t.recordingsList.replaceChildren();const u=o.length;t.recordingsSummary.textContent=u===0?"No recordings yet.":`${u} recording${u===1?"":"s"}, newest first.`,t.recordingsExportButton.disabled=u===0;for(const d of[...o].sort((m,k)=>k.created-m.created)){const m=document.createElement("li");m.className="share-item";const k=document.createElement("div");k.className="share-item__heading";const A=document.createElement("strong");A.textContent=d.title||U(d.tag);const s=document.createElement("span");s.className="share-item__meta";const v=d.due?` · due ${d.due.replace("T"," ")}`:"";s.textContent=`${Gt(d)} · ${U(d.tag)}${v}`,k.append(A,s);const y=document.createElement("p");if(y.className="share-item__body",y.dir="auto",y.textContent=d.transcript.trim()||(d.pending_transcription?"Waiting for a transcript.":"No transcript."),m.append(k,y),d.has_audio){const I=document.createElement("button");I.type="button",I.className="share-item__action",I.textContent="Download audio",I.addEventListener("click",()=>{x(d,I)}),m.append(I)}t.recordingsList.append(m)}}async function x(u,d){d.disabled=!0,d.textContent="Downloading…";try{const m=await fetch(`/api/recordings/audio?id=${encodeURIComponent(u.id)}`,{headers:r()});if(!m.ok)throw new Error("The device could not send this recording.");Et(await m.blob(),`${u.id}.wav`)}catch(m){t.recordingsCard.setNotification(m instanceof Error?m.message:"Download failed.","error")}finally{d.disabled=!1,d.textContent="Download audio"}}async function T(){t.recordingsRefreshButton.disabled=!0;try{o=(await l("/api/recordings")).recordings??[],t.recordingsCard.setNotification(""),w()}catch(u){t.recordingsCard.setNotification(u instanceof Error?u.message:"Could not load recordings.","error")}finally{t.recordingsRefreshButton.disabled=!1}}function f(){const u=new Date,d=u.toISOString().slice(0,10),m=oi(o,u);Et(new Blob([m],{type:"text/markdown;charset=utf-8"}),`brain-dump-${d}.md`)}async function g(){try{const u=await l("/api/books");if(t.booksList.replaceChildren(),(u.books??[]).length===0){const d=document.createElement("li");d.className="share-item__meta",d.textContent="No books on the device yet.",t.booksList.append(d)}for(const d of u.books??[]){const m=document.createElement("li");m.className="share-item share-item--row";const k=document.createElement("span");k.dir="auto",k.textContent=`${d.name} (${ai(d.size)})`;const A=document.createElement("button");A.type="button",A.className="share-item__action",A.textContent="Delete",A.addEventListener("click",()=>{p(d.name)}),m.append(k,A),t.booksList.append(m)}}catch(u){t.booksCard.setNotification(u instanceof Error?u.message:"Could not load books.","error")}}async function p(u){if(window.confirm(`Delete "${u}" from the device?`))try{await l(`/api/books?name=${encodeURIComponent(u)}`,{method:"DELETE"}),t.booksCard.setNotification(`Deleted ${u}.`,"success"),await g()}catch(d){t.booksCard.setNotification(d instanceof Error?d.message:"Delete failed.","error")}}function S(u,d){return new Promise((m,k)=>{const A=new XMLHttpRequest;A.open("POST",`/api/books?name=${encodeURIComponent(u)}`),A.setRequestHeader("Content-Type","text/plain; charset=utf-8"),n&&A.setRequestHeader(St,n),A.upload.onprogress=s=>{s.lengthComputable&&(t.bookFileInput.progressMax=s.total,t.bookFileInput.progressValue=s.loaded,t.bookFileInput.progressMessageText=`Sending… ${Math.round(s.loaded/s.total*100)}%`)},A.onload=()=>{try{m(JSON.parse(A.responseText))}catch{k(new Error("The device sent an unexpected reply."))}},A.onerror=()=>k(new Error("The connection to the device was lost.")),A.send(d)})}function C(u,d="info"){t.booksCard.setNotification(u,d)}async function c(){const u=t.bookFileInput.files?.[0];if(!(!u||i)){i=!0,t.bookUploadButton.disabled=!0,t.bookFileInput.progressHidden=!1,t.bookFileInput.progressValue=0;try{let d;if(u.name.toLowerCase().endsWith(".epub")){t.bookFileInput.progressMessageText="Converting EPUB to text…";const k=await ni(await u.arrayBuffer());d=new Blob([k.text],{type:"text/plain;charset=utf-8"})}else if(u.name.toLowerCase().endsWith(".txt"))d=u;else throw new Error("Choose a .txt or .epub file.");const m=await S(u.name,d);if(m.success!==!0)throw new Error(m.message||"The device did not accept the book.");C(`Added ${m.name??u.name}. Find it under Books on the device.`,"success"),await g()}catch(d){C(d instanceof Error?d.message:"Adding the book failed.","error")}finally{i=!1,t.bookUploadButton.disabled=!t.bookFileInput.files?.length,t.bookFileInput.progressHidden=!0}}}async function b(){const u=t.pinInput.value.trim();if(!/^\d{4}$/.test(u)){t.signInCard.setNotification("The PIN is the four digits on the device screen.","error");return}n=u;try{if(!(await(await fetch("/api/share/status",{cache:"no-store",headers:r()})).json()).authorized)throw new Error("That PIN is not right. Check the device screen.");si(n),h(),await Promise.allSettled([T(),g()])}catch(d){n="",t.signInCard.setNotification(d instanceof Error?d.message:"Could not sign in.","error")}}async function E(){if(t.bookFileInput.progressHidden=!0,t.bookUploadButton.disabled=!0,t.bookFileInput.addEventListener("change",()=>{t.bookUploadButton.disabled=i||!t.bookFileInput.files?.length}),t.bookUploadButton.addEventListener("click",()=>{c()}),t.recordingsRefreshButton.addEventListener("click",()=>{T()}),t.recordingsExportButton.addEventListener("click",f),t.pinButton.addEventListener("click",()=>{b()}),t.pinInput.addEventListener("keydown",u=>{u.key==="Enter"&&b()}),e==="share"&&!n){a();return}h(),await Promise.allSettled([T(),g()])}return{start:E}}function ci(t){let e=!1,n=!1,o=!1,i=!1;async function r(){return t.fetchTimezoneListJson("/api/timezone/list")}function l(c){const b=c.settings,E=c.runtime;t.setSwitchChecked(t.clockModeToggle,!!b?.enabled),t.timezoneSelect.value=b?.timezone_name||"",t.clearFieldError(t.timezoneSelect),t.manualDateInput.value=typeof E?.current_date=="string"?E.current_date:"",t.manualTimeInput.value=typeof E?.current_time=="string"?E.current_time:""}function a(c){c&&(typeof c.clock_enabled=="boolean"&&t.setSwitchChecked(t.clockModeToggle,c.clock_enabled),t.manualDateInput.value=typeof c.current_date=="string"?c.current_date:"",t.manualTimeInput.value=typeof c.current_time=="string"?c.current_time:"")}async function h(){t.timezoneSelect.innerHTML="";const c=document.createElement("option");c.value="",c.textContent="Select timezone",t.timezoneSelect.appendChild(c);try{const b=await r(),E=Array.isArray(b.timezones)?b.timezones:[],u=t.buildTimezoneLabelMap(E);E.map(d=>({value:d.name,label:t.formatTimezoneLabel(d,u)})).sort((d,m)=>d.label.localeCompare(m.label)).forEach(d=>{const m=document.createElement("option");m.value=d.value,m.textContent=d.label,t.timezoneSelect.appendChild(m)})}catch(b){console.error("Timezone list fetch failed:",b),t.notify(b instanceof Error?b.message:"Failed to load timezones.","error")}}async function w(){if(!(e||n||o)){e=!0,n=!0,o=!0,t.onStateChange();try{const c=await t.fetchTimeSettingsJson(t.timeSettingsApi);l(c)}catch(c){console.error("Time settings status failed:",c),t.notify(c instanceof Error?c.message:"Time settings status failed.","error")}finally{e=!1,n=!1,o=!1,t.onStateChange()}}}async function x(){if(!(o||i)){i=!0;try{for(let c=0;c<t.clockSyncPollAttempts;c++){const b=await t.fetchTimeRuntimeJson(t.timeRuntimeApi);if(a(b.runtime),b.runtime?.time_valid===!0&&typeof b.runtime.current_time=="string"&&b.runtime.current_time.length>0)return;c<t.clockSyncPollAttempts-1&&await new Promise(E=>{setTimeout(E,t.clockSyncPollIntervalMs)})}}catch(c){console.error("Clock refresh after WiFi connect failed:",c)}finally{i=!1}}}async function T(){if(!(document.hidden||e||n||o)&&t.isSwitchChecked(t.clockModeToggle))try{const c=await t.fetchTimeRuntimeJson(t.timeRuntimeApi);a(c.runtime)}catch(c){console.error("Time runtime status failed:",c)}}function f(){const c=t.timezoneSelect.value.trim(),b=t.manualDateInput.value.trim(),E=t.manualTimeInput.value.trim(),u=t.parseClockTimeInputValue(t.wakeupTimeInput),d=t.parseClockTimeInputValue(t.bedtimeTimeInput);return!!b!=!!E?(t.notify("Provide both current date and time for a manual clock set.","error"),null):{timezoneName:c,manualDate:b,manualTime:E,wakeupMinutes:u??void 0,bedtimeMinutes:d??void 0}}async function g(c,b){return t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({timezone_name:c.timezoneName,enabled:b,manual_date:c.manualDate,manual_time:c.manualTime})})}async function p(){if(o||e||n){t.notifyClockMode("Clock mode update already in progress.","warning");return}const c=t.isSwitchChecked(t.clockModeToggle),b=!c,E=t.timezoneSelect.value.trim();t.setSwitchChecked(t.clockModeToggle,b),o=!0,t.notifyClockMode(b?"Enabling clock mode...":"Disabling clock mode...","info"),t.onStateChange();try{const u=await t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({enabled:b,timezone_name:b&&E?E:void 0})});l(u),t.notifyClockMode(u.message||(b?"Clock mode enabled.":"Clock mode disabled."),"success")}catch(u){t.setSwitchChecked(t.clockModeToggle,c),console.error("Clock mode toggle failed:",u);const d=u instanceof Error?u.message:"Failed to update clock mode.",m=d==="timezone_name required to enable clock"?"Please set timezone first.":d;d==="timezone_name required to enable clock"&&(t.setFieldError(t.timezoneSelect,"Select a timezone."),t.timezoneSelect.focus({preventScroll:!0})),t.notifyClockMode(m,"error")}finally{o=!1,t.onStateChange()}}async function S(){if(e||n||o||t.isTalkingClockModuleBusy()){t.notify("Time configuration update already in progress.","warning");return}const c=f();if(c){if(!c.timezoneName){t.setFieldError(t.timezoneSelect,"Select a timezone."),t.notify("Select a timezone.","error"),t.timezoneSelect.focus({preventScroll:!0});return}if(t.clearFieldError(t.timezoneSelect),t.isTalkingClockModuleActive()&&(c.wakeupMinutes===void 0||c.bedtimeMinutes===void 0)){t.notify("Wakeup and bedtime times are required for the talking clock module.","error"),t.focusTalkingClockTimeInput();return}e=!0,n=!0,o=!0,t.onTalkingClockBusyChange(t.isTalkingClockModuleActive()),t.notify("Saving time configuration...","info"),t.onStateChange();try{const b=await g(c,t.isSwitchChecked(t.clockModeToggle));if(l(b),t.isTalkingClockModuleActive()){const E=await t.patchTalkingClockSettings({wakeup_minutes:c.wakeupMinutes,bedtime_minutes:c.bedtimeMinutes});t.applyTalkingClockModuleSettings(E.settings)}t.notify("Time configuration saved successfully.","success")}catch(b){console.error("Timezone/location save failed:",b),t.notify(b instanceof Error?b.message:"Failed to save time configuration.","error")}finally{e=!1,n=!1,o=!1,t.onTalkingClockBusyChange(!1),t.onStateChange()}}}async function C(){if(e||n||o){t.notify("Time configuration update already in progress.","warning");return}e=!0,n=!0,o=!0,t.notify("Clearing timezone/location...","info"),t.onStateChange();try{const c=await t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({enabled:!1,timezone_name:""})});l(c),t.notify("Timezone/location cleared successfully.","success")}catch(c){console.error("Timezone/location clear failed:",c),t.notify(c instanceof Error?c.message:"Failed to clear timezone/location.","error")}finally{e=!1,n=!1,o=!1,t.onStateChange()}}return{applyTimeRuntimeStatus:a,applyTimeSettingsStatus:l,clearTimezoneLocation:C,fetchTimeRuntimeStatus:T,fetchTimeSettingsStatus:w,isClockBusy:()=>o,isLocationBusy:()=>n,isTimezoneBusy:()=>e,populateTimezoneOptions:h,refreshClockStatusAfterWifiConnect:x,saveTimezoneLocation:S,toggleClockModeSetting:p}}function di(t,e){return t>=-50?e.fourBar:t>=-60?e.threeBar:t>=-70?e.twoBar:e.oneBar}function ui(t){let e=[],n="",o=!1,i="",r=!1,l=!1,a=!1,h=-1;function w(){t.wifiStatusCard.hidden=!1,t.wifiStatusCard.statusLabel=o?"Connected":"Disconnected",t.wifiStatusCard.network=o?i:""}function x(){const s=document.createElement("li");s.className="networks__list-empty-state",s.innerHTML=`${t.svgWithClass(t.wifiFindIcon,"wifi-find-icon")}<p>Scan for available networks</p>`,t.networkList.setEmptyState(s)}function T(){if(e.length===0){n="",h=-1;return}const s=e.findIndex(v=>v.ssid===n);if(s>=0){h=s;return}n="",h=-1}function f(){const s=t.networkList.getOptions();s.forEach((v,y)=>{v.setAttribute("aria-selected",String(n===e[y]?.ssid))}),h>=0&&h<s.length?t.networkList.setActiveDescendant(s[h].id):t.networkList.setActiveDescendant(null)}function g(){const s=e.find(v=>v.ssid===n);return s?!s.is_open:!0}function p(s){n=s,h=e.findIndex(v=>v.ssid===s),g()||t.clearFieldError(t.passwordInput),f(),t.onStateChange()}function S(){if(T(),t.networkList.clearItems(),e.length===0){x();return}e.forEach((s,v)=>{const y=document.createElement("li");y.className="networks__item",y.id=`network-option-${v}`,y.setAttribute("role","option"),y.setAttribute("tabindex","-1"),y.setAttribute("aria-selected",String(n===s.ssid));const I=document.createElement("span");I.className="networks__item-ssid",I.textContent=s.ssid;const z=document.createElement("div");if(z.className="networks__item-details",i===s.ssid&&o){const R=document.createElement("span");R.title="Currently connected",R.innerHTML=t.svgWithClass(t.checkIcon,"wifi-connected-icon"),z.appendChild(R)}const V=document.createElement("span");V.title=s.is_open?"Open":"Secured",s.is_open||(V.innerHTML=t.svgWithClass(t.securityIcon,"wifi-security-icon")),z.appendChild(V);const H=document.createElement("span");H.title=`Signal strength: ${s.signal_strength} (${s.rssi} dBm)`,H.innerHTML=t.svgWithClass(di(s.rssi,t.signalIcons),"wifi-signal-icon"),z.appendChild(H),y.append(I,z),y.addEventListener("click",()=>{h=v,p(s.ssid),t.networkList.focus({preventScroll:!0})}),t.networkList.appendItem(y)}),f()}function C(s){const v=o,y=i;o=s.connected===!0,i=typeof s.ssid=="string"?s.ssid:"",w(),(v!==o||y!==i)&&S(),t.onConnectionStateChange?.({wasConnected:v,previousNetwork:y,isCurrentlyConnected:o,connectedNetwork:i})}async function c(){if(!r){r=!0,t.notify("Scanning for networks...","info"),t.onStateChange();try{let s="Scanning for networks...";for(let v=0;v<t.scanPollAttempts;v++){const y=await t.fetchPortalJson("/api/scan");if(s=y.message||s,y.scan_in_progress===!0){if(t.notify(s,"info"),v<t.scanPollAttempts-1){await t.delayMs(t.scanPollIntervalMs);continue}}else{e=Array.isArray(y.networks)?y.networks:[],t.notify(s||"Scan complete.","success"),S();return}}throw new Error("Network scan timed out. Please try again.")}catch(s){console.error("Scan failed:",s),t.notify(s instanceof Error?s.message:"Scan failed. Please try again.","error"),e=[],S()}finally{r=!1,t.onStateChange()}}}async function b(){if(!l){l=!0,t.onStateChange();try{const s=await t.fetchPortalJson("/api/status");C(s),r||t.notify(s.message||"Status updated.",s.connected?"success":"info")}catch(s){console.error("Status check failed:",s),t.notify(s instanceof Error?s.message:"Status check failed.","error")}finally{l=!1,t.onStateChange()}}}async function E(){if(!(a||!n)){if(g()&&t.passwordInput.value.trim().length===0){t.setFieldError(t.passwordInput,"Please enter a WiFi password."),t.passwordInput.focus({preventScroll:!0});return}if(t.passwordInput.value.length>mt){t.setFieldError(t.passwordInput,`WiFi password must be ${mt} characters or fewer.`),t.passwordInput.focus({preventScroll:!0});return}t.clearFieldError(t.passwordInput),a=!0,t.notify(`Connecting to ${n}...`,"info"),t.onStateChange();try{const s=await t.fetchPortalJson("/api/configure",{method:"POST",body:JSON.stringify({ssid:n,password:t.passwordInput.value})});t.notify(s.message||"Connection request sent.","info");for(let v=0;v<t.statusPollAttempts;v++){await t.delayMs(t.statusPollIntervalMs);const y=await t.fetchPortalJson("/api/status");if(C(y),y.connected){t.notify(y.message||"Connected.","success");break}}o||t.notify("Connection in progress...","info")}catch(s){console.error("Connection failed:",s),t.notify(s instanceof Error?s.message:"Connection failed.","error")}finally{a=!1,t.onStateChange()}}}async function u(){if(!(a||l||!o)){l=!0,t.notify("Disconnecting...","info"),t.onStateChange();try{const s=await t.fetchPortalJson("/api/disconnect",{method:"POST"}),v=o,y=i;o=!1,i="",w(),S(),t.notify(s.message||"Disconnected.","success"),t.onConnectionStateChange?.({wasConnected:v,previousNetwork:y,isCurrentlyConnected:o,connectedNetwork:i})}catch(s){console.error("Disconnect failed:",s),t.notify(s instanceof Error?s.message:"Disconnect failed.","error")}finally{l=!1,t.onStateChange()}}}function d(){if(A()){u();return}if(a||l){t.notify("WiFi status is busy. Please wait.","warning");return}if(!n){t.notify("Select a WiFi network first.","error"),t.networkList.focus({preventScroll:!0});return}if(g()&&t.passwordInput.value.trim().length===0){t.setFieldError(t.passwordInput,"Please enter a WiFi password."),t.notify("Please check if your password is correct.","error"),t.passwordInput.focus({preventScroll:!0});return}t.clearFieldError(t.passwordInput),E()}function m(){t.passwordInput.value?.trim().length&&t.clearFieldError(t.passwordInput),t.onStateChange()}function k(s){if(e.length!==0)switch(T(),s.key){case"Tab":break;case"ArrowDown":{s.preventDefault();const v=h<e.length-1?h+1:0;h=v,p(e[v].ssid),t.networkList.scrollOptionIntoView(v);break}case"ArrowUp":{s.preventDefault();const v=h>0?h-1:e.length-1;h=v,p(e[v].ssid),t.networkList.scrollOptionIntoView(v);break}case"Home":{s.preventDefault(),h=0,p(e[0].ssid),t.networkList.scrollOptionIntoView(0);break}case"End":{s.preventDefault();const v=e.length-1;h=v,p(e[v].ssid),t.networkList.scrollOptionIntoView(v);break}case"Enter":case" ":{s.preventDefault(),h>=0&&h<e.length&&p(e[h].ssid);break}}}function A(){return o&&i.length>0&&n===i}return{applyPortalStatus:C,checkStatus:b,connect:E,disconnect:u,getConnectedNetwork:()=>i,getSelectedNetwork:()=>n,handleConnectAction:d,handleListboxKeyDown:k,handlePasswordInput:m,isCheckingStatus:()=>l,isConnecting:()=>a,isCurrentlyConnected:()=>o,isScanning:()=>r,isSelectedConnected:A,renderNetworkList:S,requiresPassword:g,scanNetworks:c,updateWifiStatusCard:w}}function $(t,e){e().finally(()=>{!t.disabled&&t.offsetParent!==null&&setTimeout(()=>{!t.disabled&&t.offsetParent!==null&&t.focus()},0)})}function hi(t){const{controllers:e,dom:n,helpers:o}=t;function i(){n.wifiSettingsSheet.openBottomSheet(),e.wifiController.scanNetworks()}n.scanBtn.addEventListener("click",()=>{e.wifiController.scanNetworks()}),n.connectBtn.addEventListener("click",()=>{e.wifiController.handleConnectAction()}),n.wifiStatusCard.addEventListener("action",()=>{if(e.wifiController.isCurrentlyConnected()){e.wifiController.disconnect();return}i()}),n.wifiStatusCard.addEventListener("settings",()=>{i()}),n.wifiSettingsCloseBtn.addEventListener("click",()=>{n.wifiSettingsSheet.closeBottomSheet()}),n.passwordInput.addEventListener("input",()=>{e.wifiController.handlePasswordInput()}),n.networkList.addEventListener("keydown",r=>{e.wifiController.handleListboxKeyDown(r)}),n.geminiSaveBtn.addEventListener("click",()=>{$(n.geminiSaveBtn,()=>e.geminiController.saveGeminiKey())}),n.geminiClearBtn.addEventListener("click",()=>{$(n.geminiClearBtn,()=>e.geminiController.clearGeminiKey())}),n.geminiApiKeyInput.addEventListener("input",o.updateUi),n.timezoneLocationSaveBtn.addEventListener("click",()=>{if(!n.timezoneSelect.value.trim()){o.setFieldError(n.timezoneSelect,"Select a timezone."),o.setTimezoneLocationNotification("Select a timezone.","error"),n.timezoneSelect.focus({preventScroll:!0});return}o.clearFieldError(n.timezoneSelect),$(n.timezoneLocationSaveBtn,()=>e.timeController.saveTimezoneLocation())}),n.timezoneLocationClearBtn.addEventListener("click",()=>{$(n.timezoneLocationClearBtn,()=>e.timeController.clearTimezoneLocation())}),n.timezoneSelect.addEventListener("change",()=>{n.timezoneSelect.value?.trim().length&&o.clearFieldError(n.timezoneSelect),o.updateUi()}),n.manualDateInput.addEventListener("input",o.updateUi),n.manualTimeInput.addEventListener("input",o.updateUi)}function gi(t){const{controllers:e,dom:n}=t,o=e.wifiController.isScanning()||e.wifiController.isConnecting()||e.wifiController.isCheckingStatus(),i=e.wifiController.isSelectedConnected(),r=e.wifiController.getSelectedNetwork().trim(),l=r.length>0&&!i&&e.wifiController.requiresPassword(),a=i||r.length>0&&(!l||n.passwordInput.value.trim().length>0);n.scanBtn.disabled=o,n.connectBtn.disabled=o||!a,n.wifiStatusCard.actionDisabled=o,n.passwordInput.disabled=e.wifiController.isConnecting(),e.wifiController.isConnecting()?(n.connectBtn.textContent="Connecting...",n.wifiStatusCard.actionLabel="Connecting..."):i?(n.connectBtn.textContent="Disconnect",n.wifiStatusCard.actionLabel="Disconnect"):(n.connectBtn.textContent="Connect",n.wifiStatusCard.actionLabel=e.wifiController.isCurrentlyConnected()?"Disconnect":"Connect");const h=e.timeController.isTimezoneBusy()||e.timeController.isLocationBusy()||e.timeController.isClockBusy();n.timezoneSelect.disabled=h,n.manualDateInput.disabled=h,n.manualTimeInput.disabled=h,n.timezoneLocationSaveBtn.disabled=h||n.timezoneSelect.value.trim().length===0,n.timezoneLocationClearBtn.disabled=h||n.timezoneSelect.value.trim().length===0;const w=e.geminiController.isGeminiBusy(),x=e.geminiController.getGeminiHasKey();n.geminiApiKeyInput.readOnly=x||w,n.geminiApiKeyInput.disabled=w,n.geminiSaveBtn.disabled=w||x||n.geminiApiKeyInput.value.trim().length===0,n.geminiSaveBtn.hidden=x,n.geminiClearBtn.disabled=w||!x,n.geminiClearBtn.hidden=!x}he();ae();me();xe();Ee();Me();Ne();De();Ke();Ye();let st=null;const L=In(),Wt=Bn(L.wifiSettingsNotification),at=Rt(L.geminiCard),Jt=Rt(L.timezoneLocationCard),jt=()=>document.createElement("input"),pi=document.createElement("button"),fi=jt(),mi=jt(),bi=document.createElement("input");function M(){gi({controllers:{geminiController:dt,timeController:q,wifiController:P},dom:L})}const dt=Kn({fetchGeminiModuleJson:Ht,fetchOpenAiModuleJson:()=>Promise.resolve({}),geminiApiKeyInput:L.geminiApiKeyInput,isGeminiModuleActive:()=>!0,isOpenAiModuleActive:()=>!1,notifyGemini:at,notifyOpenAi:()=>{},openAiApiKeyInput:bi,updateButtons:M}),q=ci({applyTalkingClockModuleSettings:()=>{},bedtimeTimeInput:mi,clearFieldError:lt,clockModeToggle:pi,clockSyncPollAttempts:fn,clockSyncPollIntervalMs:pn,fetchTimeRuntimeJson:An,fetchTimeSettingsJson:Cn,fetchTimezoneListJson:Ln,focusTalkingClockTimeInput:()=>{},buildTimezoneLabelMap:Dn,formatTimezoneLabel:Fn,isSwitchChecked:qn,isTalkingClockModuleActive:()=>!1,isTalkingClockModuleBusy:()=>!1,manualDateInput:L.manualDateInput,manualTimeInput:L.manualTimeInput,notifyClockMode:()=>{},notify:Jt,onStateChange:M,onTalkingClockBusyChange:()=>{},parseClockTimeInputValue:Un,patchTalkingClockSettings:()=>Promise.resolve({success:!0}),setFieldError:ct,setSwitchChecked:Mn,timeRuntimeApi:xn,timeSettingsApi:yn,timezoneSelect:L.timezoneSelect,wakeupTimeInput:fi}),P=ui({checkIcon:sn,clearFieldError:lt,delayMs:Nn,fetchPortalJson:kn,networkList:L.networkList,notify:Wt,onConnectionStateChange:({wasConnected:t,isCurrentlyConnected:e})=>{!t&&e&&q.refreshClockStatusAfterWifiConnect()},onStateChange:M,passwordInput:L.passwordInput,scanPollAttempts:vn,scanPollIntervalMs:bn,securityIcon:Qe,setFieldError:ct,signalIcons:{oneBar:tn,twoBar:en,threeBar:nn,fourBar:on},statusPollAttempts:gn,statusPollIntervalMs:hn,svgWithClass:zn,wifiFindIcon:rn,wifiStatusCard:L.wifiStatusCard}),Yt=document.getElementById("firmwareUpdateCard"),Xt=Rn({card:Yt,fileInput:document.getElementById("firmwareFileInput"),uploadBtn:document.getElementById("firmwareUploadBtn"),versionText:document.getElementById("firmwareVersionText")});function D(){if(!st)return;const t=document.documentElement,e=t.scrollHeight>window.innerHeight+1,n=window.scrollY+window.innerHeight>=t.scrollHeight-1;st.setVisible(e&&!n)}function vi(){L.wifiStatusCard.iconSvg=Xe,L.geminiCard.iconSvg=Vt,L.timezoneLocationCard.iconSvg=an,Yt.iconSvg=ln,Xt.bind(),P.renderNetworkList(),document.body&&(st=ne({mount:document.body,mode:"fixed",position:"bottom",height:"6rem",width:"100vw",strength:1.8,divCount:5,curve:"bezier",exponential:!0,opacity:1,zIndex:20,className:"page-gradual-blur",fallbackColor:"var(--color-bg-selected)"}),D(),window.addEventListener("scroll",D,{passive:!0}),window.addEventListener("resize",D),typeof ResizeObserver<"u"&&new ResizeObserver(()=>{D()}).observe(document.body)),M(),P.updateWifiStatusCard(),Wt(""),hi({controllers:{geminiController:dt,timeController:q,wifiController:P},dom:L,helpers:{clearFieldError:lt,setFieldError:ct,setTimezoneLocationNotification:Jt,updateUi:M}}),wi(),window.setInterval(()=>{q.fetchTimeRuntimeStatus()},mn)}async function wi(){await Promise.allSettled([q.populateTimezoneOptions(),q.fetchTimeSettingsStatus(),P.checkStatus(),xi(),yi(),Xt.refreshVersion()])}async function yi(){const t=document.getElementById("transcriptionLanguageSelect");if(t){try{const e=await B("/api/settings/transcription");e.language&&(t.value=e.language)}catch(e){console.error("Transcription language load failed:",e)}t.addEventListener("change",async()=>{try{await B("/api/settings/transcription",{method:"PATCH",body:JSON.stringify({language:t.value})}),at("Transcription language saved.","success")}catch(e){at(e instanceof Error?e.message:"Could not save the language.","error")}})}}async function xi(){try{const t=await Ht("/api/settings/gemini");dt.applyGeminiSettings(t.settings)}catch(t){console.error("Gemini settings status failed:",t)}finally{M()}}Ti();async function Ti(){const t=await li(),e={signInCard:document.getElementById("shareSignInCard"),pinInput:document.getElementById("sharePinInput"),pinButton:document.getElementById("sharePinBtn"),recordingsCard:document.getElementById("recordingsCard"),recordingsSummary:document.getElementById("recordingsSummary"),recordingsList:document.getElementById("recordingsList"),recordingsRefreshButton:document.getElementById("recordingsRefreshBtn"),recordingsExportButton:document.getElementById("recordingsExportBtn"),booksCard:document.getElementById("booksCard"),booksList:document.getElementById("booksList"),bookFileInput:document.getElementById("bookFileInput"),bookUploadButton:document.getElementById("bookUploadBtn")};if(e.recordingsCard.iconSvg=cn,e.booksCard.iconSvg=dn,e.signInCard.iconSvg=Vt,t==="share"){for(const n of["wifiStatusCard","wifiSettingsSheet","geminiCard","timezoneLocationCard","firmwareUpdateCard"])document.getElementById(n)?.setAttribute("hidden","");await kt(e,"share").start();return}vi(),t==="setup"&&await kt(e,"setup").start()}
