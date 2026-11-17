(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();const ne={mode:"absolute",position:"bottom",height:"6rem",strength:2,divCount:5,exponential:!1,opacity:1,curve:"linear",zIndex:2},gt={linear:t=>t,bezier:t=>t*t*(3-2*t),"ease-in":t=>t*t,"ease-out":t=>1-Math.pow(1-t,2),"ease-in-out":t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2};function ie(t){switch(t){case"top":return"to top";case"left":return"to left";case"right":return"to right";default:return"to bottom"}}function oe(){if(typeof CSS>"u"||typeof CSS.supports!="function")return!1;const t=CSS.supports("backdrop-filter","blur(1px)")||CSS.supports("-webkit-backdrop-filter","blur(1px)"),e=CSS.supports("mask-image","linear-gradient(to bottom, transparent, black)")||CSS.supports("-webkit-mask-image","linear-gradient(to bottom, transparent, black)");return t&&e}function re(t){const e={...ne,...t},n=document.createElement("div"),o=document.createElement("div"),i=ie(e.position),r=oe(),l=e.position==="top"||e.position==="bottom";if(n.className="gradual-blur",e.className&&n.classList.add(e.className),r||(n.classList.add("gradual-blur--fallback"),n.style.background=`linear-gradient(${i}, transparent 0%, ${e.fallbackColor||"rgba(255, 255, 255, 0.95)"} 100%)`),n.style.position=e.mode,n.style.pointerEvents="none",n.style.zIndex=String(e.zIndex),n.style.opacity="0",n.style.borderRadius="inherit",l?(n.style.height=e.height,n.style.width=e.width||"100%",n.style[e.position]="0",e.mode==="fixed"?(n.style.left="50%",n.style.right="auto",n.style.transform="translateX(-50%)"):(n.style.left="0",n.style.right="0")):(n.style.width=e.width||e.height,n.style.height="100%",n.style.top="0",n.style.bottom="0",n.style[e.position]="0"),o.className="gradual-blur__inner",n.appendChild(o),r){const c=100/e.divCount,g=gt[e.curve]||gt.linear;for(let b=1;b<=e.divCount;b+=1){const x=document.createElement("div"),S=g(b/e.divCount);let E=0;e.exponential?E=Math.pow(2,S*4)*.0625*e.strength:E=.0625*(S*e.divCount+1)*e.strength;const v=Math.round((c*b-c)*10)/10,T=Math.round(c*b*10)/10,_=Math.round((c*b+c)*10)/10,f=Math.round((c*b+c*2)*10)/10;let s=`transparent ${v}%, black ${T}%`;_<=100&&(s+=`, black ${_}%`),f<=100&&(s+=`, transparent ${f}%`),x.className="gradual-blur__layer",x.style.maskImage=`linear-gradient(${i}, ${s})`,x.style.webkitMaskImage=`linear-gradient(${i}, ${s})`,x.style.backdropFilter=`blur(${E.toFixed(3)}rem)`,x.style.setProperty("-webkit-backdrop-filter",`blur(${E.toFixed(3)}rem)`),x.style.opacity=String(e.opacity),o.appendChild(x)}}return window.getComputedStyle(e.mount).position==="static"&&(e.mount.style.position="relative"),e.mount.appendChild(n),{element:n,setVisible(c){n.style.opacity=c?"1":"0"},destroy(){n.remove()}}}const se=`:host {
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
`,ae=document.createElement("template");ae.innerHTML=`
  <style>${se}</style>
  <span class="badge">
    <slot></slot>
  </span>
`;const le=`:host {
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
`,Y="ui-button",Lt=document.createElement("template");Lt.innerHTML=`
  <style>${le}</style>
  <button type="button" part="button">
    <slot></slot>
  </button>
`;function ft(t){return t==="submit"||t==="reset"?t:"button"}class ce extends HTMLElement{static get observedAttributes(){return["disabled","aria-label","type"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Lt.content.cloneNode(!0)),this.button=e.querySelector("button")}connectedCallback(){this.dataset.component=Y,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return ft(this.getAttribute("type"))}set type(e){this.setAttribute("type",ft(e))}focus(e){this.button.focus(e)}click(){this.button.click()}syncAttributes(){this.button.disabled=this.disabled,this.button.type=this.type,this.tabIndex=this.disabled?-1:0;const e=this.getAttribute("aria-label");e?this.button.setAttribute("aria-label",e):this.button.removeAttribute("aria-label")}}function de(){customElements.get(Y)||customElements.define(Y,ce)}const ue=`:host {
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
`,X="ui-bottom-sheet",It=document.createElement("template"),he=["a[href]","button:not([disabled])","details summary","input:not([disabled])","select:not([disabled])","textarea:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(", ");let K=0;It.innerHTML=`
  <style>${ue}</style>
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
`;function pt(t){const e=getComputedStyle(t);return t.hasAttribute("hidden")||t.getAttribute("aria-hidden")==="true"||e.display==="none"||e.visibility==="hidden"?!1:t.tagName.includes("-")?e.display==="contents"||!!t.getClientRects().length:t.offsetParent!==null||e.position==="fixed"||!!t.getClientRects().length}function G(t){if(!t.shadowRoot)return[];const e=[],n=new Set;function o(i){if(i instanceof HTMLSlotElement){const r=i.assignedElements({flatten:!0});r.length>0?r.forEach(o):Array.from(i.children).forEach(o);return}if(i instanceof HTMLElement&&pt(i)){if(i.shadowRoot){Array.from(i.shadowRoot.childNodes).forEach(o);return}!n.has(i)&&i.matches(he)&&pt(i)&&(n.add(i),e.push(i)),Array.from(i.children).forEach(o)}}return Array.from(t.shadowRoot.childNodes).forEach(o),e}function ge(t,e){if(e===t||e.contains(t))return!0;let n=t;for(;n;){if(n===e)return!0;const o=n.getRootNode();if(!(o instanceof ShadowRoot))break;n=o.host}return!1}function Z(t){return t.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?e.textContent?.trim().length:e.nodeType===Node.ELEMENT_NODE)}class fe extends HTMLElement{constructor(){super(),this.isAnimatingClose=!1,this.isSyncingOpenAttribute=!1,this.previousDocumentOverflow="",this.previousBodyOverflow="",this.triggerElement=null;const e=this.attachShadow({mode:"open"});e.append(It.content.cloneNode(!0)),this.dialog=e.querySelector(".bottom-sheet-dialog"),this.titleElement=e.querySelector(".bottom-sheet-title"),this.descriptionElement=e.querySelector(".bottom-sheet-description"),this.headerActionsContainer=e.querySelector(".bottom-sheet-header-actions"),this.footerContainer=e.querySelector(".bottom-sheet-footer"),this.floatingContainer=e.querySelector(".bottom-sheet-floating"),this.headerActionsSlot=e.querySelector('slot[name="header-actions"]'),this.footerSlot=e.querySelector('slot[name="footer"]'),this.floatingSlot=e.querySelector('slot[name="floating-content"]'),K+=1,this.titleId=`bottomSheetTitle${K}`,this.descriptionId=`bottomSheetDescription${K}`,this.handleAnimationEndBound=this.handleAnimationEnd.bind(this),this.handleCancelBound=this.handleCancel.bind(this),this.handleClickBound=this.handleClick.bind(this),this.handleKeyDownBound=this.handleKeyDown.bind(this),this.handleSlotChangeBound=this.syncSlotVisibility.bind(this)}static get observedAttributes(){return["description","open","title"]}connectedCallback(){this.dataset.component=X,this.dialog.addEventListener("animationend",this.handleAnimationEndBound),this.dialog.addEventListener("cancel",this.handleCancelBound),this.dialog.addEventListener("click",this.handleClickBound),this.dialog.addEventListener("keydown",this.handleKeyDownBound),this.addEventListener("keydown",this.handleKeyDownBound),this.headerActionsSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.footerSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.floatingSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.syncAttributes(),this.syncSlotVisibility(),this.hasAttribute("open")&&this.openInternal()}disconnectedCallback(){this.dialog.removeEventListener("animationend",this.handleAnimationEndBound),this.dialog.removeEventListener("cancel",this.handleCancelBound),this.dialog.removeEventListener("click",this.handleClickBound),this.dialog.removeEventListener("keydown",this.handleKeyDownBound),this.removeEventListener("keydown",this.handleKeyDownBound),this.headerActionsSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.footerSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.floatingSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.dialog.open&&this.dialog.close(),this.unlockDocumentScroll()}attributeChangedCallback(e){if(e==="open"){if(!this.isConnected||this.isSyncingOpenAttribute)return;this.hasAttribute("open")?this.openInternal():this.startClosing();return}this.syncAttributes()}get open(){return this.hasAttribute("open")}set open(e){this.toggleAttribute("open",e)}openBottomSheet(){this.open&&!this.isAnimatingClose||(this.triggerElement=document.activeElement instanceof HTMLElement?document.activeElement:null,this.open=!0)}closeBottomSheet(){!this.open&&!this.dialog.open||(this.open=!1)}focus(e){(G(this)[0]??this.dialog).focus(e)}syncAttributes(){const e=this.getAttribute("title")||"",n=this.getAttribute("description")||"";this.titleElement.id=this.titleId,this.titleElement.textContent=e,this.titleElement.hidden=e.length===0,this.descriptionElement.id=this.descriptionId,this.descriptionElement.textContent=n,this.descriptionElement.hidden=n.length===0,e.length>0?this.dialog.setAttribute("aria-labelledby",this.titleId):this.dialog.removeAttribute("aria-labelledby"),n.length>0?this.dialog.setAttribute("aria-describedby",this.descriptionId):this.dialog.removeAttribute("aria-describedby")}syncSlotVisibility(){this.headerActionsContainer.hidden=!Z(this.headerActionsSlot),this.footerContainer.hidden=!Z(this.footerSlot),this.floatingContainer.hidden=!Z(this.floatingSlot)}handleAnimationEnd(e){!this.isAnimatingClose||e.target!==this.dialog||(this.dialog.classList.remove("closing"),this.dialog.close(),this.isAnimatingClose=!1,this.unlockDocumentScroll(),this.restoreTriggerFocus(),this.dispatchEvent(new Event("close",{bubbles:!0,composed:!0})))}handleCancel(e){e.preventDefault(),this.closeBottomSheet()}handleClick(e){this.isAnimatingClose||e.target===this.dialog&&this.closeBottomSheet()}handleKeyDown(e){if(e.currentTarget===this&&e.composedPath().includes(this.dialog))return;if(e.key==="Escape"){e.preventDefault(),this.closeBottomSheet();return}if(e.key!=="Tab")return;const n=G(this);if(n.length===0){e.preventDefault(),this.dialog.focus();return}const o=e.composedPath()[0],i=o instanceof HTMLElement?o:document.activeElement instanceof HTMLElement?document.activeElement:null,r=i===null?-1:n.findIndex(b=>ge(i,b)),l=e.shiftKey?-1:1,c=e.shiftKey?n.length-1:0,g=r===-1?c:(r+l+n.length)%n.length;e.preventDefault(),n[g].focus()}openInternal(){this.syncAttributes(),this.syncSlotVisibility(),this.isAnimatingClose&&(this.dialog.classList.remove("closing"),this.isAnimatingClose=!1),this.dialog.open?this.lockDocumentScroll():(this.lockDocumentScroll(),this.dialog.showModal()),requestAnimationFrame(()=>{if(!this.dialog.open)return;(G(this)[0]??this.dialog).focus()})}startClosing(){!this.dialog.open||this.isAnimatingClose||(this.dialog.classList.add("closing"),this.isAnimatingClose=!0)}lockDocumentScroll(){this.previousDocumentOverflow.length===0&&this.previousBodyOverflow.length===0&&(this.previousDocumentOverflow=document.documentElement.style.overflow,this.previousBodyOverflow=document.body.style.overflow),document.documentElement.style.overflow="hidden",document.body.style.overflow="hidden"}unlockDocumentScroll(){document.documentElement.style.overflow=this.previousDocumentOverflow,document.body.style.overflow=this.previousBodyOverflow,this.previousDocumentOverflow="",this.previousBodyOverflow=""}restoreTriggerFocus(){this.triggerElement&&document.contains(this.triggerElement)&&this.triggerElement.focus(),this.triggerElement=null}}function pe(){customElements.get(X)||customElements.define(X,fe)}const me=`:host {
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
`,Q="ui-card",Bt=document.createElement("template");Bt.innerHTML=`
  <style>${me}</style>
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
`;function be(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}class ve extends HTMLElement{static get observedAttributes(){return["title"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append(Bt.content.cloneNode(!0)),this.footerContainer=e.querySelector(".card-component__footer"),this.footerSlot=e.querySelector('slot[name="footer"]'),this.footerSlot.addEventListener("slotchange",()=>{this.syncFooterVisibility()}),this.iconElement=e.querySelector(".card-component__icon"),this.notificationElement=e.querySelector(".connection-notification"),this.titleElement=e.querySelector(".card-component__title")}connectedCallback(){this.dataset.component=Q,this.syncAttributes(),this.syncFooterVisibility()}attributeChangedCallback(){this.syncAttributes()}get iconSvg(){return this.iconElement.innerHTML}set iconSvg(e){this.iconElement.innerHTML=e?be(e,"card-component__icon"):""}setNotification(e,n="info"){if(!e){this.notificationElement.hidden=!0,this.notificationElement.textContent="",this.notificationElement.removeAttribute("data-status"),this.notificationElement.setAttribute("role","status"),this.notificationElement.setAttribute("aria-live","polite");return}this.notificationElement.hidden=!1,this.notificationElement.textContent=e,this.notificationElement.setAttribute("data-status",n),n==="error"||n==="danger"?(this.notificationElement.setAttribute("role","alert"),this.notificationElement.setAttribute("aria-live","assertive")):n==="warning"?(this.notificationElement.setAttribute("role","alert"),this.notificationElement.setAttribute("aria-live","polite")):(this.notificationElement.setAttribute("role","status"),this.notificationElement.setAttribute("aria-live","polite"))}syncAttributes(){this.titleElement.textContent=this.getAttribute("title")||""}syncFooterVisibility(){const e=this.footerSlot.assignedElements({flatten:!0}).length>0;this.footerContainer.hidden=!e}}function we(){customElements.get(Q)||customElements.define(Q,ve)}const ye=`:host {
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
`,xe=document.createElement("template");xe.innerHTML=`
  <style>${ye}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper duration-fields">
      <ui-input variant="number" inputmode="numeric"></ui-input>
      <ui-input variant="number" inputmode="numeric"></ui-input>
    </div>
  </div>
`;const Te=`:host {
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
`,tt="ui-file-upload",Mt=document.createElement("template");Mt.innerHTML=`
  <style>${Te}</style>
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
`;class Se extends HTMLElement{static get observedAttributes(){return["accept","aria-label","disabled","label","multiple","name","progress-max","progress-message","progress-value","warning-text"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Mt.content.cloneNode(!0)),this.helperText=e.querySelector(".form-helper-text"),this.input=e.querySelector("input"),this.labelElement=e.querySelector("label"),this.progressBar=e.querySelector("progress"),this.progressContainer=e.querySelector(".progress-bar"),this.progressMessage=e.querySelector(".progress-bar__message"),this.input.addEventListener("change",n=>{n.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.input.addEventListener("input",n=>{n.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))})}connectedCallback(){this.dataset.component=tt,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get accept(){return this.input.accept}set accept(e){this.setAttribute("accept",e)}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get files(){return this.input.files}get progressHidden(){return this.progressContainer.hidden}set progressHidden(e){this.progressContainer.hidden=e}get progressMax(){return this.progressBar.max}set progressMax(e){this.progressBar.max=e}get progressMessageText(){return this.progressMessage.textContent||""}set progressMessageText(e){this.progressMessage.textContent=e}get progressValue(){return this.progressBar.value}set progressValue(e){this.progressBar.value=e}get value(){return this.input.value}get warningText(){return this.helperText.textContent||""}set warningText(e){this.helperText.textContent=e}focus(e){this.input.focus(e)}syncAttributes(){const e=this.id||"file-upload",n=this.getAttribute("label")||"",o=this.getAttribute("warning-text")||"";this.input.id=e,this.input.accept=this.getAttribute("accept")||"",this.input.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.input.multiple=this.hasAttribute("multiple"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("name"),this.hasAttribute("progress-max")&&(this.progressBar.max=Number(this.getAttribute("progress-max"))||100),this.hasAttribute("progress-value")&&(this.progressBar.value=Number(this.getAttribute("progress-value"))||0),this.hasAttribute("progress-message")&&(this.progressMessage.textContent=this.getAttribute("progress-message")||""),this.labelElement.htmlFor=e,this.labelElement.textContent=n,this.labelElement.hidden=n.length===0,this.helperText.textContent=o,this.helperText.hidden=o.length===0}syncStringAttribute(e){const n=this.getAttribute(e);if(n===null){this.input.removeAttribute(e);return}this.input.setAttribute(e,n)}}function Ee(){customElements.get(tt)||customElements.define(tt,Se)}const ke=`:host {
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
`,et="ui-icon-button",qt=document.createElement("template");qt.innerHTML=`
  <style>${ke}</style>
  <button type="button" part="button">
    <slot></slot>
  </button>
`;function mt(t){return t==="submit"||t==="reset"?t:"button"}class Ce extends HTMLElement{static get observedAttributes(){return["disabled","aria-label","type"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(qt.content.cloneNode(!0)),this.button=e.querySelector("button")}connectedCallback(){this.dataset.component=et,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return mt(this.getAttribute("type"))}set type(e){this.setAttribute("type",mt(e))}focus(e){this.button.focus(e)}click(){this.button.click()}syncAttributes(){this.button.disabled=this.disabled,this.button.type=this.type,this.tabIndex=this.disabled?-1:0;const e=this.getAttribute("aria-label");e?this.button.setAttribute("aria-label",e):this.button.removeAttribute("aria-label")}}function Ae(){customElements.get(et)||customElements.define(et,Ce)}const _e='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>',Le='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>',Ie=`:host {
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
`,nt="ui-input",zt=document.createElement("template");zt.innerHTML=`
  <style>${Ie}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <input />
      <span class="duration-fields__unit"></span>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;function Be(t){return t==="number"||t==="password"||t==="time"||t==="date"?t:"text"}function Me(t){return t==="password"||t==="number"||t==="time"||t==="date"?t:"text"}class qe extends HTMLElement{constructor(){super(),this.isPasswordVisible=!1,this.customValidationMessage="";const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(zt.content.cloneNode(!0)),this.input=e.querySelector("input"),this.helperText=e.querySelector(".form-helper-text"),this.label=e.querySelector("label"),this.suffix=e.querySelector(".duration-fields__unit"),this.toggleButton=document.createElement("button"),this.wrapper=e.querySelector(".form-control__input-wrapper"),this.toggleButton.className="password-toggle-btn",this.toggleButton.type="button",this.input.addEventListener("input",n=>{this.syncValidationState(),n.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}),this.input.addEventListener("change",n=>{this.syncValidationState(),n.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.input.addEventListener("invalid",()=>{this.syncValidationState()}),this.toggleButton.addEventListener("click",()=>{this.togglePasswordVisibility()})}static get observedAttributes(){return["aria-label","aria-invalid","autocomplete","disabled","helper-text","invalid","inputmode","label","max","maxlength","min","name","placeholder","readonly","required","step","suffix","type","value","variant"]}connectedCallback(){this.hasAttribute("variant")||this.setAttribute("variant","text"),this.dataset.component=nt,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return this.input.type}set type(e){this.setAttribute("type",e)}get value(){return this.input.value}set value(e){this.input.value=e,this.syncValidationState()}focus(e){this.input.focus(e)}select(){this.input.select()}get validationMessage(){return this.input.validationMessage}get validity(){return this.input.validity}get willValidate(){return this.input.willValidate}checkValidity(){const e=this.input.checkValidity();return this.syncValidationState(),e}reportValidity(){const e=this.input.reportValidity();return this.syncValidationState(),e}setCustomValidity(e){this.customValidationMessage=e,this.input.setCustomValidity(e),this.syncValidationState()}syncAttributes(){const e=Be(this.getAttribute("variant")),n=this.getAttribute("helper-text")||"",o=this.id?`${this.id}Input`:"input",i=this.getAttribute("label")||"",r=this.getAttribute("suffix")||"",l=e==="password"?this.isPasswordVisible?"text":"password":this.getAttribute("type")||Me(e);if(this.input.id=o,this.input.type=l,this.input.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.input.readOnly=this.hasAttribute("readonly"),this.input.required=this.hasAttribute("required"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("autocomplete"),this.syncStringAttribute("inputmode"),this.syncStringAttribute("max"),this.syncStringAttribute("maxlength"),this.syncStringAttribute("min"),this.syncStringAttribute("name"),this.syncStringAttribute("placeholder"),this.syncStringAttribute("step"),this.hasAttribute("value")&&this.input.value!==this.getAttribute("value")&&(this.input.value=this.getAttribute("value")||""),this.input.setCustomValidity(this.customValidationMessage),this.label.htmlFor=o,this.label.textContent=i,this.label.hidden=i.length===0,this.helperText.textContent=n,this.helperText.hidden=n.length===0,this.wrapper.classList.toggle("duration-fields",e==="number"),this.suffix.textContent=r,this.suffix.hidden=e!=="number"||r.length===0,n.length>0){const c=`${o}HelperText`;this.helperText.id=c,this.input.setAttribute("aria-describedby",c)}else this.helperText.removeAttribute("id"),this.input.removeAttribute("aria-describedby");e==="password"?(this.toggleButton.isConnected||this.wrapper.append(this.toggleButton),this.toggleButton.disabled=this.disabled,this.toggleButton.setAttribute("aria-label",this.isPasswordVisible?"Hide password":"Show password"),this.toggleButton.innerHTML=ze(this.isPasswordVisible?_e:Le,"password-icon")):(this.isPasswordVisible=!1,this.toggleButton.remove()),this.syncValidationState()}syncStringAttribute(e){const n=this.getAttribute(e);if(n===null){this.input.removeAttribute(e);return}this.input.setAttribute(e,n)}togglePasswordVisibility(){this.isPasswordVisible=!this.isPasswordVisible,this.syncAttributes()}syncValidationState(){const e=this.hasAttribute("invalid")||this.getAttribute("aria-invalid")==="true"||!this.input.validity.valid;this.classList.toggle("error",e),this.input.classList.toggle("error",e),this.hasAttribute("invalid")!==e&&this.toggleAttribute("invalid",e),this.getAttribute("aria-invalid")!==String(e)&&this.setAttribute("aria-invalid",String(e)),this.input.getAttribute("aria-invalid")!==String(e)&&this.input.setAttribute("aria-invalid",String(e))}}function ze(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}function Ne(){customElements.get(nt)||customElements.define(nt,qe)}const Pe=`:host {
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
`,it="ui-network-list",Nt="networkList",ot="network-list-label",Pt=document.createElement("template");Pt.innerHTML=`
  <style>${Pe}</style>
  <div class="networks">
    <span id="${ot}" hidden>Available networks</span>
    <ul
      id="${Nt}"
      class="networks__list"
      role="listbox"
      aria-labelledby="${ot}"
      tabindex="0"
    ></ul>
  </div>
`;class Oe extends HTMLElement{static get observedAttributes(){return["aria-label","label"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Pt.content.cloneNode(!0)),this.labelElement=e.querySelector(`#${ot}`),this.listElement=e.querySelector(`#${Nt}`),this.listElement.addEventListener("keydown",n=>{(n.key==="ArrowDown"||n.key==="ArrowUp"||n.key==="Home"||n.key==="End"||n.key===" ")&&n.preventDefault()})}connectedCallback(){this.tabIndex=0,this.dataset.component=it,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}appendItem(e){this.listElement.appendChild(e)}clearItems(){this.listElement.innerHTML=""}focus(e){this.listElement.focus(e)}getOptions(){return Array.from(this.listElement.querySelectorAll('[role="option"]'))}scrollOptionIntoView(e){const n=this.getOptions()[e];if(!n)return;const o=this.listElement.scrollTop,i=o+this.listElement.clientHeight,r=n.offsetTop,l=r+n.offsetHeight;if(r<o){this.listElement.scrollTop=r;return}l>i&&(this.listElement.scrollTop=l-this.listElement.clientHeight)}setActiveDescendant(e){if(e){this.listElement.setAttribute("aria-activedescendant",e);return}this.listElement.removeAttribute("aria-activedescendant")}setEmptyState(e){this.clearItems(),this.appendItem(e)}syncAttributes(){const e=this.getAttribute("label")||"Available networks",n=this.getAttribute("aria-label");this.labelElement.textContent=e,n?this.listElement.setAttribute("aria-label",n):this.listElement.removeAttribute("aria-label")}}function De(){customElements.get(it)||customElements.define(it,Oe)}const $e=`:host {
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
`,rt="ui-network-status",Ot="actionBtn",Dt="settingsBtn",$t="wifiStatusLabel",Ut="wifiStatusIcon",Rt="wifiStatusNetwork",Ft=document.createElement("template");Ft.innerHTML=`
  <style>${$e}</style>
  <div class="wifi-status-card">
    <div class="wifi-status-card__content">
      <div class="wifi-status-card__status">
        <span class="card-icon" id="${Ut}"></span>
        <span id="${$t}" class="wifi-status-card__label">
          Disconnected
        </span>
        <span
          id="${Rt}"
          class="wifi-status-card__network"
        ></span>
      </div>
      <div class="wifi-status-card__actions">
        <ui-button
          id="${Ot}"
          variant="outline"
          inverse
          aria-label="Connect"
        >
          Connect
        </ui-button>
        <ui-button
          id="${Dt}"
          variant="outline"
          inverse
          aria-label="Settings"
        >
          Settings
        </ui-button>
      </div>
    </div>
  </div>
`;function Ue(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}class Re extends HTMLElement{static get observedAttributes(){return["action-label","network","status-label"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append(Ft.content.cloneNode(!0)),this.actionButton=e.querySelector(`#${Ot}`),this.actionButton.addEventListener("click",n=>{n.stopPropagation(),this.dispatchEvent(new Event("action",{bubbles:!0,composed:!0}))}),this.iconElement=e.querySelector(`#${Ut}`),this.labelElement=e.querySelector(`#${$t}`),this.networkElement=e.querySelector(`#${Rt}`),this.settingsButton=e.querySelector(`#${Dt}`),this.settingsButton.addEventListener("click",n=>{n.stopPropagation(),this.dispatchEvent(new Event("settings",{bubbles:!0,composed:!0}))})}connectedCallback(){this.dataset.component=rt,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get actionDisabled(){return!!this.actionButton.disabled}set actionDisabled(e){this.actionButton.disabled=e}get iconSvg(){return this.iconElement.innerHTML}set iconSvg(e){this.iconElement.innerHTML=e?Ue(e,"wifi-icon"):""}get network(){return this.getAttribute("network")||""}set network(e){this.setAttribute("network",e)}get actionLabel(){return this.getAttribute("action-label")||"Connect"}set actionLabel(e){this.setAttribute("action-label",e)}get statusLabel(){return this.getAttribute("status-label")||"Disconnected"}set statusLabel(e){this.setAttribute("status-label",e)}syncAttributes(){this.actionButton.textContent=this.actionLabel,this.actionButton.setAttribute("aria-label",this.actionLabel),this.labelElement.textContent=this.statusLabel,this.networkElement.textContent=this.network,this.networkElement.hidden=this.network.length===0}}function Fe(){customElements.get(rt)||customElements.define(rt,Re)}const Ve=`:host {
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
`,He=document.createElement("template");He.innerHTML=`
  <style>${Ve}</style>
  <div class="form-control">
    <label></label>
    <div class="range-slider">
      <input class="range-slider__range" type="range" />
      <span class="range-slider__value"></span>
    </div>
  </div>
`;const Ke='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80 240-320l57-57 183 183 183-183 57 57L480-80ZM298-584l-58-56 240-240 240 240-58 56-182-182-182 182Z"/></svg>',Ge=`:host {
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
`,st="ui-select",Vt=document.createElement("template");Vt.innerHTML=`
  <style>${Ge}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <select></select>
      <span class="select-icon"></span>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;class Ze extends HTMLElement{constructor(){super(),this.customValidationMessage="";const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Vt.content.cloneNode(!0)),this.helperText=e.querySelector(".form-helper-text"),this.labelElement=e.querySelector("label"),this.select=e.querySelector("select");const n=e.querySelector(".select-icon");n.innerHTML=Je(Ke,"select-icon"),this.select.addEventListener("change",o=>{this.syncValidationState(),o.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.select.addEventListener("input",o=>{this.syncValidationState(),o.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}),this.select.addEventListener("invalid",()=>{this.syncValidationState()})}static get observedAttributes(){return["aria-invalid","aria-label","disabled","helper-text","invalid","label","name","required","value"]}connectedCallback(){this.moveLightDomOptions(),this.dataset.component=st,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get innerHTML(){return this.select.innerHTML}set innerHTML(e){this.select.innerHTML=e,this.syncValidationState()}get value(){return this.select.value}set value(e){this.select.value=e,this.syncValidationState()}appendChild(e){return e instanceof HTMLOptionElement||e instanceof HTMLOptGroupElement?(this.select.appendChild(e),e):super.appendChild(e)}focus(e){this.select.focus(e)}get validationMessage(){return this.select.validationMessage}get validity(){return this.select.validity}get willValidate(){return this.select.willValidate}checkValidity(){const e=this.select.checkValidity();return this.syncValidationState(),e}reportValidity(){const e=this.select.reportValidity();return this.syncValidationState(),e}setCustomValidity(e){this.customValidationMessage=e,this.select.setCustomValidity(e),this.syncValidationState()}moveLightDomOptions(){Array.from(this.children).forEach(e=>{(e instanceof HTMLOptionElement||e instanceof HTMLOptGroupElement)&&this.select.appendChild(e)})}syncAttributes(){const e=this.getAttribute("helper-text")||"",n=this.id?`${this.id}Select`:"select",o=this.getAttribute("label")||"";if(this.select.id=n,this.select.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.select.required=this.hasAttribute("required"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("name"),this.hasAttribute("value")&&(this.select.value=this.getAttribute("value")||""),this.select.setCustomValidity(this.customValidationMessage),this.labelElement.htmlFor=n,this.labelElement.textContent=o,this.labelElement.hidden=o.length===0,this.helperText.textContent=e,this.helperText.hidden=e.length===0,e.length>0){const i=`${n}HelperText`;this.helperText.id=i,this.select.setAttribute("aria-describedby",i)}else this.helperText.removeAttribute("id"),this.select.removeAttribute("aria-describedby");this.syncValidationState()}syncStringAttribute(e){const n=this.getAttribute(e);if(n===null){this.select.removeAttribute(e);return}this.select.setAttribute(e,n)}syncValidationState(){const e=this.hasAttribute("invalid")||this.getAttribute("aria-invalid")==="true"||!this.select.validity.valid;this.classList.toggle("error",e),this.select.classList.toggle("error",e),this.hasAttribute("invalid")!==e&&this.toggleAttribute("invalid",e),this.getAttribute("aria-invalid")!==String(e)&&this.setAttribute("aria-invalid",String(e)),this.select.getAttribute("aria-invalid")!==String(e)&&this.select.setAttribute("aria-invalid",String(e))}}function We(){customElements.get(st)||customElements.define(st,Ze)}function Je(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}const je=`:host {
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
`,Ye=document.createElement("template");Ye.innerHTML=`
  <style>${je}</style>
  <div class="form-control">
    <div class="switch-container">
      <button type="button" part="button">
        <span class="knob"></span>
      </button>
      <span class="switch-label"></span>
    </div>
  </div>
`;const Xe=`:host {
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
`,at="ui-toast",Ht=document.createElement("template");Ht.innerHTML=`
  <style>${Xe}</style>
  <dialog class="toast-dialog" aria-live="polite">
    <p class="toast-dialog__message"></p>
  </dialog>
`;function bt(t){return t==="success"||t==="info"||t==="warning"||t==="error"||t==="danger"?t:null}class Qe extends HTMLElement{static get observedAttributes(){return["aria-label","message","status"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append(Ht.content.cloneNode(!0)),this.dialog=e.querySelector("dialog"),this.messageElement=e.querySelector(".toast-dialog__message")}connectedCallback(){this.dataset.component=at,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get message(){return this.messageElement.textContent||""}set message(e){this.setAttribute("message",e)}get status(){return bt(this.getAttribute("status"))}set status(e){if(e){this.setAttribute("status",e);return}this.removeAttribute("status")}show(e,n){typeof e=="string"&&(this.message=e),n&&(this.status=n),this.dialog.open||this.dialog.show()}close(e){this.dialog.close(e)}syncAttributes(){const e=this.getAttribute("aria-label"),n=this.getAttribute("message")||"",o=bt(this.getAttribute("status"));e?this.dialog.setAttribute("aria-label",e):this.dialog.removeAttribute("aria-label"),this.messageElement.textContent=n,this.messageElement.id=this.id?`${this.id}Message`:"statusToastMessage",this.dialog.id=this.id||"statusToast",o?this.dialog.setAttribute("data-status",o):this.dialog.removeAttribute("data-status")}}function tn(){customElements.get(at)||customElements.define(at,Qe)}const en='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m109-531-85-85q92-89 210-136.5T480-800q128 0 246 47.5T936-616l-85 85q-75-72-171-110.5T480-680q-104 0-200 38.5T109-531Zm169 169-84-84q59-55 132.5-84.5T480-560q80 0 153.5 29.5T766-446l-84 84q-42-38-93.5-58T480-440q-57 0-108.5 20T278-362Zm202 202q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Z"/></svg>',nn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg>',on='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM361-353q25-18 55.5-28t63.5-10q33 0 63.5 10t55.5 28l245-245q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l245 245Z"/></svg>',rn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM299-415q38-28 84-43.5t97-15.5q51 0 97 15.5t84 43.5l183-183q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l183 183Z"/></svg>',sn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM232-482q53-38 116-59.5T480-563q69 0 132 21.5T728-482l116-116q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l116 116Z"/></svg>',an='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q95-97 219.5-148.5T480-800q136 0 260.5 51.5T960-600L480-120Z"/></svg>',ln='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-601q93-93 215.5-146T480-800q142 0 264.5 53T960-601l-56 57q-81-81-190-128.5T480-720q-103 0-195 32.5T117-597l419 420-56 57Zm384-40L761-262q-18 11-38 16.5t-43 5.5q-68 0-114-46t-46-114q0-68 46-114t114-46q68 0 114 46t46 114q0 23-5.5 43T818-319l102 103-56 56ZM680-320q34 0 57-23t23-57q0-34-23-57t-57-23q-34 0-57 23t-23 57q0 34 23 57t57 23ZM480-177Z"/></svg>',Kt='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70q66 0 121 33t87 87h432v240h-80v120H600v-120H488q-32 54-87 87t-121 33Zm0-80q66 0 106-40.5t48-79.5h246v120h80v-120h80v-80H434q-8-39-48-79.5T280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-80q33 0 56.5-23.5T360-480q0-33-23.5-56.5T280-560q-33 0-56.5 23.5T200-480q0 33 23.5 56.5T280-400Zm0-80Z"/></svg>',cn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>',dn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>',un='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m720-80 120-120-28-28-72 72v-164h-40v164l-72-72-28 28L720-80ZM480-800 243-663l237 137 237-137-237-137ZM120-321v-318q0-22 10.5-40t29.5-29l280-161q10-5 19.5-8t20.5-3q11 0 21 3t19 8l280 161q19 11 29.5 29t10.5 40v159h-80v-116L479-434 200-596v274l240 139v92L160-252q-19-11-29.5-29T120-321ZM720 0q-83 0-141.5-58.5T520-200q0-83 58.5-141.5T720-400q83 0 141.5 58.5T920-200q0 83-58.5 141.5T720 0ZM480-491Z"/></svg>',hn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Zm0-420ZM160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v13q-11 22-16 45t-4 47q-10-2-19.5-3.5T480-720q-66 0-113 47t-47 113v280h320v-257q18 8 38.5 12.5T720-520v240h80v80H160Zm475-435q-35-35-35-85t35-85q35-35 85-35t85 35q35 35 35 85t-35 85q-35 35-85 35t-85-35Z"/></svg>',gn='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>',fn={"Content-Type":"application/json",Accept:"application/json"},vt=64,pn=2e3,mn=8,bn=2e3,vn=8,wn=3e3,yn=1e3,xn=750,Tn=20,Sn="/api/settings",En=`${Sn}/time`,kn="/api/runtime/time",wt="/api/runtime/update",Cn="/api/update",An="/api/update/cloud/check",_n="/api/update/cloud/install",Ln=1e4;async function B(t,e){const n=new AbortController,o=setTimeout(()=>n.abort(),Ln);let i;try{i=await fetch(t,{cache:"no-store",...e,signal:e?.signal??n.signal,headers:{...fn,...e?.headers||{}}})}catch(g){throw n.signal.aborted?new Error(`Request to ${t} timed out. Check the device is still reachable.`):g}finally{clearTimeout(o)}const r=i.headers.get("content-type")||"",l=await i.text();if(!r.includes("application/json"))throw new Error(`Unexpected response for ${t}. Make sure you are connected to the device AP and loading the portal from the ESP32.`);const c=JSON.parse(l);if(!i.ok||c.success!==!0)throw new Error(c.message||"Request failed.");return c}const In=(t,e)=>B(t,e),Bn=(t,e)=>B(t,e),Mn=(t,e)=>B(t,e),W=(t,e)=>B(t,e),Gt=(t,e)=>B(t,e),qn=(t,e)=>B(t,e);function A(t){const e=document.getElementById(t);if(!e)throw new Error(`Required portal element "#${t}" was not found.`);return e}function zn(){return{wifiStatusCard:A("wifiStatusCard"),wifiSettingsSheet:A("wifiSettingsSheet"),wifiSettingsCloseBtn:A("wifiSettingsCloseBtn"),wifiSettingsNotification:A("wifiSettingsNotification"),networkList:A("networkList"),passwordInput:A("password"),scanBtn:A("scanBtn"),connectBtn:A("connectBtn"),geminiCard:A("geminiCard"),geminiApiKeyInput:A("geminiApiKeyInput"),geminiClearBtn:A("geminiClearBtn"),geminiSaveBtn:A("geminiSaveBtn"),timezoneLocationCard:A("timezoneLocationCard"),timezoneSelect:A("timezoneSelect"),manualTimeInput:A("manualTimeInput"),manualDateInput:A("manualDateInput"),timezoneLocationClearBtn:A("timezoneLocationClearBtn"),timezoneLocationSaveBtn:A("timezoneLocationSaveBtn")}}function Zt(t){return(e,n="info")=>{t.setNotification(e,n)}}function Nn(t){return(e,n="info")=>{if(!e){t.hidden=!0,t.textContent="",t.removeAttribute("data-status"),t.setAttribute("role","status"),t.setAttribute("aria-live","polite");return}t.hidden=!1,t.textContent=e,t.setAttribute("data-status",n),n==="error"||n==="danger"?(t.setAttribute("role","alert"),t.setAttribute("aria-live","assertive")):n==="warning"?(t.setAttribute("role","alert"),t.setAttribute("aria-live","polite")):(t.setAttribute("role","status"),t.setAttribute("aria-live","polite"))}}function dt(t){t.classList.remove("error"),t.removeAttribute("invalid"),t.setAttribute("aria-invalid","false"),t.setCustomValidity?.("")}function ut(t,e){t.classList.add("error"),t.setAttribute("invalid",""),t.setAttribute("aria-invalid","true"),t.setCustomValidity?.(e)}function Pn(t,e){t.setAttribute("aria-checked",e?"true":"false")}function On(t){return t.getAttribute("aria-checked")==="true"}function Dn(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}function $n(t){return new Promise(e=>{setTimeout(e,t)})}function Un(){const t=document.documentElement.lang?.trim();return t||"en-US"}function Rn(t){try{return new Intl.DateTimeFormat(Un(),{hour:"numeric",timeZone:t,timeZoneName:"longGeneric"}).formatToParts(new Date).find(o=>o.type==="timeZoneName")?.value?.trim()||""}catch(e){return console.warn(`Failed to format timezone label for "${t}".`,e),""}}function yt(t){return/^(GMT|UTC)(?:[+-]\d{1,2}(?::\d{2})?)?$/.test(t)}function Fn(t){return(t.split("/").pop()||t).replace(/_/g," ")}function Wt(t){return t.split("/").map(e=>e.replace(/_/g," ")).join(" / ")}function Vn(t){const e=t.map(i=>{const r=Rn(i.name);return{cityLabel:Fn(i.name),genericLabel:r,name:i.name}}),n=new Map(e.map(i=>[i.name,i])),o=new Map;return e.forEach(i=>{!i.genericLabel||yt(i.genericLabel)||o.set(i.genericLabel,(o.get(i.genericLabel)||0)+1)}),new Map(t.map(i=>{const r=n.get(i.name),l=i.description?.trim()||"";if(r?.genericLabel&&!yt(r.genericLabel)){const g=(o.get(r.genericLabel)||0)>1?`${r.genericLabel} (${r.cityLabel})`:r.genericLabel;return[i.name,g]}return l?[i.name,l]:[i.name,Wt(i.name)]}))}function Hn(t,e){return e.get(t.name)||t.description?.trim()||Wt(t.name)}function Kn(t){const e=t.value.trim();if(!e)return null;const n=/^(\d{2}):(\d{2})$/.exec(e);if(!n)return null;const o=Number.parseInt(n[1],10),i=Number.parseInt(n[2],10);return!Number.isFinite(o)||!Number.isFinite(i)||o<0||o>23||i<0||i>59?null:o*60+i}const Gn="The device can download the latest release itself over its own Wi-Fi connection.";function J(t){if(!t||t.enabled===!1)return{text:"Updates from the internet are turned off in this build.",button:"Check for updates",action:"none"};const e=t.latest_version??"";switch(t.state){case"CHECKING":return{text:"Looking for a newer version…",button:"Checking…",action:"none"};case"UP_TO_DATE":return{text:`You have the latest version${e?` (${e})`:""}.`,button:"Check for updates",action:"check"};case"AVAILABLE":return{text:`Version ${e} is available. The device downloads it over its own Wi-Fi connection and restarts by itself.`,button:`Install version ${e}`,action:"install"};case"DOWNLOADING":return{text:"Downloading. Keep the device powered; it restarts by itself when done.",button:`Downloading… ${t.progress??0}%`,action:"none"};case"RESTARTING":return{text:"Update installed. The device is restarting…",button:"Restarting…",action:"none"};case"ERROR":return{text:t.message||"The last update check failed.",button:"Check for updates",action:"check"};default:return{text:Gn,button:"Check for updates",action:"check"}}}const Zn=2e3,Wn=45,Jn=600*1e3;function jn(t){let e=!1,n="",o;const i=(f,s="info")=>t.card.setNotification(f,s),r=()=>t.fileInput.files?.[0]??null;function l(){t.fileInput.disabled=e,t.uploadBtn.disabled=e||!r();const f=J(o);t.cloudBtn.textContent=f.button,t.cloudBtn.disabled=e||f.action==="none"||o?.busy===!0}function c(f){o=f,t.cloudText.textContent=J(o).text,l()}function g(f){n=f,t.versionText.textContent=f?`Installed version: ${f}`:"Installed version: unknown"}async function b(){const f=await W(wt),s=f.runtime?.version??"";return g(s),c(f.cloud),s}function x(f){return new Promise((s,h)=>{const w=new XMLHttpRequest;w.open("POST",Cn),w.setRequestHeader("Content-Type","application/octet-stream"),w.upload.onprogress=d=>{if(!d.lengthComputable)return;t.fileInput.progressMax=d.total,t.fileInput.progressValue=d.loaded;const u=Math.round(d.loaded/d.total*100);t.fileInput.progressMessageText=u<100?`Uploading… ${u}%`:"Checking and installing…"},w.onload=()=>{try{s(JSON.parse(w.responseText))}catch{h(new Error("The device sent an unexpected reply."))}},w.onerror=()=>h(new Error("The connection to the device was lost.")),w.send(f)})}async function S(f){for(let s=0;s<Wn;s+=1){await new Promise(h=>window.setTimeout(h,Zn));try{const h=await b();h===f?i(`The device restarted and is still on version ${h}.`,"info"):i(`Updated to version ${h}.`,"success");return}catch{}}i("The update was installed and the device restarted. Reconnect to the device and reload this page to confirm the new version.","info")}async function E(){const f=r();if(!f||e)return;if(!f.name.toLowerCase().endsWith(".bin")){i("Choose a firmware update file ending in .bin.","error");return}e=!0,l();const s=n;t.fileInput.progressHidden=!1,t.fileInput.progressValue=0,t.fileInput.progressMessageText="Starting…",i("Uploading. Keep this page open and the device powered.","info");try{const h=await x(f);if(h.success!==!0)throw new Error(h.message||"The device rejected the update.");t.fileInput.progressMessageText="Installed. Restarting…",i("Update installed. The device is restarting…","info"),await S(s)}catch(h){t.fileInput.progressHidden=!0,i(h instanceof Error?h.message:"The update failed.","error")}finally{e=!1,l()}}async function v(f){const s=Date.now()+Jn;for(;Date.now()<s;){await new Promise(w=>window.setTimeout(w,yn));let h;try{h=await W(wt)}catch{if(o?.state==="DOWNLOADING"||o?.state==="RESTARTING"){i("Update installed. The device is restarting…","info"),await S(f);return}continue}if(c(h.cloud),h.cloud?.state==="RESTARTING"){i("Update installed. The device is restarting…","info"),await S(f);return}if(!h.cloud?.busy){h.cloud?.state==="ERROR"&&h.cloud.message&&i(h.cloud.message,"error");return}}i("The device is taking too long. Reload this page to see where it got to.","error")}async function T(){const f=J(o).action;if(e||f==="none")return;e=!0,l();const s=n;try{const h=await W(f==="install"?_n:An,{method:"POST"});c(h.cloud),f==="install"&&i("Downloading. Keep this page open and the device powered.","info"),await v(s)}catch(h){i(h instanceof Error?h.message:"The device could not start.","error")}finally{e=!1,l()}}function _(){t.fileInput.progressHidden=!0,t.fileInput.addEventListener("change",l),t.uploadBtn.addEventListener("click",()=>{E()}),t.cloudBtn.addEventListener("click",()=>{T()}),l()}return{bind:_,refreshVersion:async()=>{try{await b()}catch(f){console.error("Firmware version check failed:",f),g("")}}}}function U(t,e,n){t.hasKey=n?.has_key===!0,t.last4=typeof n?.last4=="string"?n.last4:"",e.value=t.hasKey?t.last4?`******${t.last4}`:"******":""}function xt(t,e,n){t.hasKey=!1,t.last4="",e.value="",n("")}async function Tt(t,e,n,o,i,r,l){const c=e.value.trim();if(!c){n(`${l} is required.`,"warning");return}t.isBusy=!0,n(r,"info"),o();try{const g=await i(t.settingsApi,{method:"PATCH",body:JSON.stringify({api_key:c})});U(t,e,g.settings),n(g.message||`${l} stored.`,"success")}catch(g){console.error(`${l} save failed:`,g),n(g instanceof Error?g.message:`Failed to store ${l}.`,"error")}finally{t.isBusy=!1,o()}}async function St(t,e,n,o,i,r,l){t.isBusy=!0,n(r,"info"),o();try{const c=await i(t.resetApi,{method:"POST"});U(t,e,c.settings),n(c.message||l,"success")}catch(c){console.error(`${l} failed:`,c),n(c instanceof Error?c.message:`Failed to clear ${l}.`,"error")}finally{t.isBusy=!1,o()}}function Yn(t){const e={hasKey:!1,isBusy:!1,last4:"",resetApi:"/api/settings/gemini/reset",settingsApi:"/api/settings/gemini"},n={hasKey:!1,isBusy:!1,last4:"",resetApi:"/api/settings/openai/reset",settingsApi:"/api/settings/openai"};function o(v){const T=v?.routes;e.settingsApi=T?.settings||"/api/settings/gemini",e.resetApi=T?.reset||"/api/settings/gemini/reset"}function i(v){const T=v?.routes;n.settingsApi=T?.settings||"/api/settings/openai",n.resetApi=T?.reset||"/api/settings/openai/reset"}function r(v){U(e,t.geminiApiKeyInput,v)}function l(){xt(e,t.geminiApiKeyInput,t.notifyGemini)}function c(v){U(n,t.openAiApiKeyInput,v)}function g(){xt(n,t.openAiApiKeyInput,t.notifyOpenAi)}async function b(){if(!t.isGeminiModuleActive()||e.isBusy||e.hasKey)return;if(!t.geminiApiKeyInput.value.trim()){t.notifyGemini("Gemini API key is required.","warning");return}await Tt(e,t.geminiApiKeyInput,t.notifyGemini,t.updateButtons,t.fetchGeminiModuleJson,"Saving Gemini API key...","Gemini API key")}async function x(){!t.isGeminiModuleActive()||e.isBusy||await St(e,t.geminiApiKeyInput,t.notifyGemini,t.updateButtons,t.fetchGeminiModuleJson,"Clearing Gemini API key...","Gemini API key cleared.")}async function S(){if(!t.isOpenAiModuleActive()||n.isBusy||n.hasKey)return;if(!t.openAiApiKeyInput.value.trim()){t.notifyOpenAi("OpenAI API key is required.","warning");return}await Tt(n,t.openAiApiKeyInput,t.notifyOpenAi,t.updateButtons,t.fetchOpenAiModuleJson,"Saving OpenAI API key...","OpenAI API key")}async function E(){!t.isOpenAiModuleActive()||n.isBusy||await St(n,t.openAiApiKeyInput,t.notifyOpenAi,t.updateButtons,t.fetchOpenAiModuleJson,"Clearing OpenAI API key...","OpenAI API key cleared.")}return{applyGeminiSettings:r,applyOpenAiSettings:c,clearGeminiKey:x,clearGeminiSettings:l,clearOpenAiKey:E,clearOpenAiSettings:g,getGeminiHasKey:()=>e.hasKey,getOpenAiHasKey:()=>n.hasKey,isGeminiBusy:()=>e.isBusy,isOpenAiBusy:()=>n.isBusy,saveGeminiKey:b,saveOpenAiKey:S,updateGeminiRoutes:o,updateOpenAiRoutes:i}}const Xn=101010256,Qn=33639248,ti=67324752;function ei(t){const e=new DataView(t.buffer,t.byteOffset,t.byteLength);let n=-1;for(let c=t.length-22;c>=Math.max(0,t.length-22-65535);c-=1)if(e.getUint32(c,!0)===Xn){n=c;break}if(n<0)throw new Error("This file is not a valid EPUB (no ZIP directory found).");const o=e.getUint16(n+10,!0);let i=e.getUint32(n+16,!0);const r=new TextDecoder,l=new Map;for(let c=0;c<o;c+=1){if(i+46>t.length||e.getUint32(i,!0)!==Qn)throw new Error("This EPUB is damaged (bad ZIP directory).");const g=e.getUint16(i+10,!0),b=e.getUint32(i+20,!0),x=e.getUint16(i+28,!0),S=e.getUint16(i+30,!0),E=e.getUint16(i+32,!0),v=e.getUint32(i+42,!0),T=r.decode(t.subarray(i+46,i+46+x));l.set(T,{name:T,method:g,compressedSize:b,localHeaderOffset:v}),i+=46+x+S+E}return l}async function ni(t){const e=new Blob([t]).stream().pipeThrough(new DecompressionStream("deflate-raw"));return new Uint8Array(await new Response(e).arrayBuffer())}async function ii(t,e){const n=new DataView(t.buffer,t.byteOffset,t.byteLength),o=e.localHeaderOffset;if(n.getUint32(o,!0)!==ti)throw new Error(`This EPUB is damaged (${e.name}).`);const i=n.getUint16(o+26,!0),r=n.getUint16(o+28,!0),l=o+30+i+r,c=t.subarray(l,l+e.compressedSize);if(e.method===0)return c;if(e.method===8)return ni(c);throw new Error(`This EPUB uses an unsupported compression method (${e.method}).`)}async function j(t,e,n){const o=e.get(n);if(!o)throw new Error(`This EPUB is missing ${n}.`);return new TextDecoder().decode(await ii(t,o))}const oi=new Set(["p","div","section","article","header","footer","blockquote","li","ul","ol","h1","h2","h3","h4","h5","h6","pre","table","tr","figure","figcaption","hr"]),ri=new Set(["script","style","head","title","nav"]);function si(t,e){const n=(t?`${t}/${e}`:e).split("/"),o=[];for(const i of n)i===".."?o.pop():i!=="."&&i!==""&&o.push(i);return o.join("/")}function Et(t){return new DOMParser().parseFromString(t,"application/xml")}function N(t,e){return Array.from(t.getElementsByTagName("*")).filter(n=>n.localName===e)}function ai(t){const e=[];let n="";const o=()=>{const r=n.replace(/[\s\u00a0]+/g," ").trim();r&&e.push(r),n=""},i=r=>{if(r.nodeType===Node.TEXT_NODE){n+=r.textContent??"";return}if(r.nodeType!==Node.ELEMENT_NODE)return;const l=r,c=l.localName.toLowerCase();if(ri.has(c))return;if(c==="br"){n+=" ";return}const g=oi.has(c);g&&o(),l.childNodes.forEach(i),g&&o()};return i(t),o(),e.join(`

`)}async function li(t){const e=new Uint8Array(t),n=ei(e),o=Et(await j(e,n,"META-INF/container.xml")),i=N(o,"rootfile")[0]?.getAttribute("full-path");if(!i)throw new Error("This EPUB does not say where its contents are.");const r=i.includes("/")?i.slice(0,i.lastIndexOf("/")):"",l=Et(await j(e,n,i)),c=N(l,"title")[0]?.textContent?.trim()??"",g=new Map;for(const S of N(l,"item")){const E=S.getAttribute("id"),v=S.getAttribute("href");E&&v&&g.set(E,si(r,decodeURIComponent(v)))}const b=[];for(const S of N(l,"itemref")){const E=g.get(S.getAttribute("idref")??"");if(!E||!n.has(E))continue;const v=await j(e,n,E);let T=new DOMParser().parseFromString(v,"application/xhtml+xml");T.getElementsByTagName("parsererror").length>0&&(T=new DOMParser().parseFromString(v,"text/html"));const _=N(T,"body")[0]??T.documentElement,f=ai(_);f&&b.push(f)}if(b.length===0)throw new Error("No readable text was found in this EPUB.");const x=(c?`${c}

`:"")+b.join(`

`);return{title:c,text:x}}const ci={note:"Note",task:"Task",idea:"Idea"};function R(t){return ci[t]??"Note"}function O(t){return String(t).padStart(2,"0")}function Jt(t){if(t.time_valid&&t.created>0){const e=new Date(t.created*1e3);return`${e.getFullYear()}-${O(e.getMonth()+1)}-${O(e.getDate())} ${O(e.getHours())}:${O(e.getMinutes())}`}return t.date||"Unknown date"}function kt(t){return t.replace(/\s+/g," ").trim()}function di(t,e){const n=[...t].sort((i,r)=>r.created-i.created),o=["---","source: Brain Dump",`exported: ${e.toISOString()}`,`recordings: ${n.length}`,"---","","# Brain Dump",""];for(const i of n){const r=kt(i.title)||R(i.tag);o.push(`## ${Jt(i)} · ${R(i.tag)} · ${r}`,"");const l=i.transcript.trim(),c=l||(i.pending_transcription?"_Waiting for a transcript._":"_No transcript (audio only)._");if(i.tag==="task"){const g=i.due?` 📅 ${i.due.slice(0,10)}`:"",b=i.due.length>10?` ${i.due.slice(11)}`:"";o.push(`- [${i.completed?"x":" "}] ${kt(c)}${g}${b}`)}else o.push(c);i.follow_up&&o.push("","#follow-up"),o.push("")}return o.join(`
`)}const Ct="X-Share-Pin",jt="braindump.sharePin";function ui(){try{return sessionStorage.getItem(jt)??""}catch{return""}}function hi(t){try{sessionStorage.setItem(jt,t)}catch{}}function At(t,e){const n=URL.createObjectURL(t),o=document.createElement("a");o.href=n,o.download=e,document.body.append(o),o.click(),o.remove(),window.setTimeout(()=>URL.revokeObjectURL(n),1e4)}function gi(t){return t>=1024*1024?`${(t/(1024*1024)).toFixed(1)} MB`:`${Math.max(1,Math.round(t/1024))} KB`}async function fi(){try{const t=await fetch("/api/share/status",{cache:"no-store"});return t.ok?(await t.json()).mode==="share"?"share":"setup":"unavailable"}catch{return"unavailable"}}function _t(t,e){let n=e==="share"?ui():"",o=[],i=!1;const r=()=>n?{[Ct]:n}:{};async function l(d,u={}){const p=await fetch(d,{cache:"no-store",...u,headers:{Accept:"application/json",...r(),...u.headers??{}}}),k=await p.json().catch(()=>({}));if(p.status===401)throw c("Enter the PIN shown on the device."),new Error(k.message||"PIN needed.");if(!p.ok||k.success!==!0)throw new Error(k.message||"The device could not do that.");return k}function c(d=""){t.signInCard.hidden=!1,t.recordingsCard.hidden=!0,t.booksCard.hidden=!0,t.signInCard.setNotification(d,d?"error":"info"),t.pinInput.focus()}function g(){t.signInCard.hidden=!0,t.recordingsCard.hidden=!1,t.booksCard.hidden=!1}function b(){t.recordingsList.replaceChildren();const d=o.length;t.recordingsSummary.textContent=d===0?"No recordings yet.":`${d} recording${d===1?"":"s"}, newest first.`,t.recordingsExportButton.disabled=d===0;for(const u of[...o].sort((p,k)=>k.created-p.created)){const p=document.createElement("li");p.className="share-item";const k=document.createElement("div");k.className="share-item__heading";const C=document.createElement("strong");C.textContent=u.title||R(u.tag);const a=document.createElement("span");a.className="share-item__meta";const m=u.due?` · due ${u.due.replace("T"," ")}`:"";a.textContent=`${Jt(u)} · ${R(u.tag)}${m}`,k.append(C,a);const y=document.createElement("p");if(y.className="share-item__body",y.dir="auto",y.textContent=u.transcript.trim()||(u.pending_transcription?"Waiting for a transcript.":"No transcript."),p.append(k,y),u.has_audio){const I=document.createElement("button");I.type="button",I.className="share-item__action",I.textContent="Download audio",I.addEventListener("click",()=>{x(u,I)}),p.append(I)}t.recordingsList.append(p)}}async function x(d,u){u.disabled=!0,u.textContent="Downloading…";try{const p=await fetch(`/api/recordings/audio?id=${encodeURIComponent(d.id)}`,{headers:r()});if(!p.ok)throw new Error("The device could not send this recording.");At(await p.blob(),`${d.id}.wav`)}catch(p){t.recordingsCard.setNotification(p instanceof Error?p.message:"Download failed.","error")}finally{u.disabled=!1,u.textContent="Download audio"}}async function S(){t.recordingsRefreshButton.disabled=!0;try{o=(await l("/api/recordings")).recordings??[],t.recordingsCard.setNotification(""),b()}catch(d){t.recordingsCard.setNotification(d instanceof Error?d.message:"Could not load recordings.","error")}finally{t.recordingsRefreshButton.disabled=!1}}function E(){const d=new Date,u=d.toISOString().slice(0,10),p=di(o,d);At(new Blob([p],{type:"text/markdown;charset=utf-8"}),`brain-dump-${u}.md`)}async function v(){try{const d=await l("/api/books");if(t.booksList.replaceChildren(),(d.books??[]).length===0){const u=document.createElement("li");u.className="share-item__meta",u.textContent="No books on the device yet.",t.booksList.append(u)}for(const u of d.books??[]){const p=document.createElement("li");p.className="share-item share-item--row";const k=document.createElement("span");k.dir="auto",k.textContent=`${u.name} (${gi(u.size)})`;const C=document.createElement("button");C.type="button",C.className="share-item__action",C.textContent="Delete",C.addEventListener("click",()=>{T(u.name)}),p.append(k,C),t.booksList.append(p)}}catch(d){t.booksCard.setNotification(d instanceof Error?d.message:"Could not load books.","error")}}async function T(d){if(window.confirm(`Delete "${d}" from the device?`))try{await l(`/api/books?name=${encodeURIComponent(d)}`,{method:"DELETE"}),t.booksCard.setNotification(`Deleted ${d}.`,"success"),await v()}catch(u){t.booksCard.setNotification(u instanceof Error?u.message:"Delete failed.","error")}}function _(d,u){return new Promise((p,k)=>{const C=new XMLHttpRequest;C.open("POST",`/api/books?name=${encodeURIComponent(d)}`),C.setRequestHeader("Content-Type","text/plain; charset=utf-8"),n&&C.setRequestHeader(Ct,n),C.upload.onprogress=a=>{a.lengthComputable&&(t.bookFileInput.progressMax=a.total,t.bookFileInput.progressValue=a.loaded,t.bookFileInput.progressMessageText=`Sending… ${Math.round(a.loaded/a.total*100)}%`)},C.onload=()=>{try{p(JSON.parse(C.responseText))}catch{k(new Error("The device sent an unexpected reply."))}},C.onerror=()=>k(new Error("The connection to the device was lost.")),C.send(u)})}function f(d,u="info"){t.booksCard.setNotification(d,u)}async function s(){const d=t.bookFileInput.files?.[0];if(!(!d||i)){i=!0,t.bookUploadButton.disabled=!0,t.bookFileInput.progressHidden=!1,t.bookFileInput.progressValue=0;try{let u;if(d.name.toLowerCase().endsWith(".epub")){t.bookFileInput.progressMessageText="Converting EPUB to text…";const k=await li(await d.arrayBuffer());u=new Blob([k.text],{type:"text/plain;charset=utf-8"})}else if(d.name.toLowerCase().endsWith(".txt"))u=d;else throw new Error("Choose a .txt or .epub file.");const p=await _(d.name,u);if(p.success!==!0)throw new Error(p.message||"The device did not accept the book.");f(`Added ${p.name??d.name}. Find it under Books on the device.`,"success"),await v()}catch(u){f(u instanceof Error?u.message:"Adding the book failed.","error")}finally{i=!1,t.bookUploadButton.disabled=!t.bookFileInput.files?.length,t.bookFileInput.progressHidden=!0}}}async function h(){const d=t.pinInput.value.trim();if(!/^\d{4}$/.test(d)){t.signInCard.setNotification("The PIN is the four digits on the device screen.","error");return}n=d;try{if(!(await(await fetch("/api/share/status",{cache:"no-store",headers:r()})).json()).authorized)throw new Error("That PIN is not right. Check the device screen.");hi(n),g(),await Promise.allSettled([S(),v()])}catch(u){n="",t.signInCard.setNotification(u instanceof Error?u.message:"Could not sign in.","error")}}async function w(){if(t.bookFileInput.progressHidden=!0,t.bookUploadButton.disabled=!0,t.bookFileInput.addEventListener("change",()=>{t.bookUploadButton.disabled=i||!t.bookFileInput.files?.length}),t.bookUploadButton.addEventListener("click",()=>{s()}),t.recordingsRefreshButton.addEventListener("click",()=>{S()}),t.recordingsExportButton.addEventListener("click",E),t.pinButton.addEventListener("click",()=>{h()}),t.pinInput.addEventListener("keydown",d=>{d.key==="Enter"&&h()}),e==="share"&&!n){c();return}g(),await Promise.allSettled([S(),v()])}return{start:w}}function pi(t){let e=!1,n=!1,o=!1,i=!1;async function r(){return t.fetchTimezoneListJson("/api/timezone/list")}function l(s){const h=s.settings,w=s.runtime;t.setSwitchChecked(t.clockModeToggle,!!h?.enabled),t.timezoneSelect.value=h?.timezone_name||"",t.clearFieldError(t.timezoneSelect),t.manualDateInput.value=typeof w?.current_date=="string"?w.current_date:"",t.manualTimeInput.value=typeof w?.current_time=="string"?w.current_time:""}function c(s){s&&(typeof s.clock_enabled=="boolean"&&t.setSwitchChecked(t.clockModeToggle,s.clock_enabled),t.manualDateInput.value=typeof s.current_date=="string"?s.current_date:"",t.manualTimeInput.value=typeof s.current_time=="string"?s.current_time:"")}async function g(){t.timezoneSelect.innerHTML="";const s=document.createElement("option");s.value="",s.textContent="Select timezone",t.timezoneSelect.appendChild(s);try{const h=await r(),w=Array.isArray(h.timezones)?h.timezones:[],d=t.buildTimezoneLabelMap(w);w.map(u=>({value:u.name,label:t.formatTimezoneLabel(u,d)})).sort((u,p)=>u.label.localeCompare(p.label)).forEach(u=>{const p=document.createElement("option");p.value=u.value,p.textContent=u.label,t.timezoneSelect.appendChild(p)})}catch(h){console.error("Timezone list fetch failed:",h),t.notify(h instanceof Error?h.message:"Failed to load timezones.","error")}}async function b(){if(!(e||n||o)){e=!0,n=!0,o=!0,t.onStateChange();try{const s=await t.fetchTimeSettingsJson(t.timeSettingsApi);l(s)}catch(s){console.error("Time settings status failed:",s),t.notify(s instanceof Error?s.message:"Time settings status failed.","error")}finally{e=!1,n=!1,o=!1,t.onStateChange()}}}async function x(){if(!(o||i)){i=!0;try{for(let s=0;s<t.clockSyncPollAttempts;s++){const h=await t.fetchTimeRuntimeJson(t.timeRuntimeApi);if(c(h.runtime),h.runtime?.time_valid===!0&&typeof h.runtime.current_time=="string"&&h.runtime.current_time.length>0)return;s<t.clockSyncPollAttempts-1&&await new Promise(w=>{setTimeout(w,t.clockSyncPollIntervalMs)})}}catch(s){console.error("Clock refresh after WiFi connect failed:",s)}finally{i=!1}}}async function S(){if(!(document.hidden||e||n||o)&&t.isSwitchChecked(t.clockModeToggle))try{const s=await t.fetchTimeRuntimeJson(t.timeRuntimeApi);c(s.runtime)}catch(s){console.error("Time runtime status failed:",s)}}function E(){const s=t.timezoneSelect.value.trim(),h=t.manualDateInput.value.trim(),w=t.manualTimeInput.value.trim(),d=t.parseClockTimeInputValue(t.wakeupTimeInput),u=t.parseClockTimeInputValue(t.bedtimeTimeInput);return!!h!=!!w?(t.notify("Provide both current date and time for a manual clock set.","error"),null):{timezoneName:s,manualDate:h,manualTime:w,wakeupMinutes:d??void 0,bedtimeMinutes:u??void 0}}async function v(s,h){return t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({timezone_name:s.timezoneName,enabled:h,manual_date:s.manualDate,manual_time:s.manualTime})})}async function T(){if(o||e||n){t.notifyClockMode("Clock mode update already in progress.","warning");return}const s=t.isSwitchChecked(t.clockModeToggle),h=!s,w=t.timezoneSelect.value.trim();t.setSwitchChecked(t.clockModeToggle,h),o=!0,t.notifyClockMode(h?"Enabling clock mode...":"Disabling clock mode...","info"),t.onStateChange();try{const d=await t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({enabled:h,timezone_name:h&&w?w:void 0})});l(d),t.notifyClockMode(d.message||(h?"Clock mode enabled.":"Clock mode disabled."),"success")}catch(d){t.setSwitchChecked(t.clockModeToggle,s),console.error("Clock mode toggle failed:",d);const u=d instanceof Error?d.message:"Failed to update clock mode.",p=u==="timezone_name required to enable clock"?"Please set timezone first.":u;u==="timezone_name required to enable clock"&&(t.setFieldError(t.timezoneSelect,"Select a timezone."),t.timezoneSelect.focus({preventScroll:!0})),t.notifyClockMode(p,"error")}finally{o=!1,t.onStateChange()}}async function _(){if(e||n||o||t.isTalkingClockModuleBusy()){t.notify("Time configuration update already in progress.","warning");return}const s=E();if(s){if(!s.timezoneName){t.setFieldError(t.timezoneSelect,"Select a timezone."),t.notify("Select a timezone.","error"),t.timezoneSelect.focus({preventScroll:!0});return}if(t.clearFieldError(t.timezoneSelect),t.isTalkingClockModuleActive()&&(s.wakeupMinutes===void 0||s.bedtimeMinutes===void 0)){t.notify("Wakeup and bedtime times are required for the talking clock module.","error"),t.focusTalkingClockTimeInput();return}e=!0,n=!0,o=!0,t.onTalkingClockBusyChange(t.isTalkingClockModuleActive()),t.notify("Saving time configuration...","info"),t.onStateChange();try{const h=await v(s,t.isSwitchChecked(t.clockModeToggle));if(l(h),t.isTalkingClockModuleActive()){const w=await t.patchTalkingClockSettings({wakeup_minutes:s.wakeupMinutes,bedtime_minutes:s.bedtimeMinutes});t.applyTalkingClockModuleSettings(w.settings)}t.notify("Time configuration saved successfully.","success")}catch(h){console.error("Timezone/location save failed:",h),t.notify(h instanceof Error?h.message:"Failed to save time configuration.","error")}finally{e=!1,n=!1,o=!1,t.onTalkingClockBusyChange(!1),t.onStateChange()}}}async function f(){if(e||n||o){t.notify("Time configuration update already in progress.","warning");return}e=!0,n=!0,o=!0,t.notify("Clearing timezone/location...","info"),t.onStateChange();try{const s=await t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({enabled:!1,timezone_name:""})});l(s),t.notify("Timezone/location cleared successfully.","success")}catch(s){console.error("Timezone/location clear failed:",s),t.notify(s instanceof Error?s.message:"Failed to clear timezone/location.","error")}finally{e=!1,n=!1,o=!1,t.onStateChange()}}return{applyTimeRuntimeStatus:c,applyTimeSettingsStatus:l,clearTimezoneLocation:f,fetchTimeRuntimeStatus:S,fetchTimeSettingsStatus:b,isClockBusy:()=>o,isLocationBusy:()=>n,isTimezoneBusy:()=>e,populateTimezoneOptions:g,refreshClockStatusAfterWifiConnect:x,saveTimezoneLocation:_,toggleClockModeSetting:T}}function mi(t,e){return t>=-50?e.fourBar:t>=-60?e.threeBar:t>=-70?e.twoBar:e.oneBar}function bi(t){let e=[],n="",o=!1,i="",r=!1,l=!1,c=!1,g=-1;function b(){t.wifiStatusCard.hidden=!1,t.wifiStatusCard.statusLabel=o?"Connected":"Disconnected",t.wifiStatusCard.network=o?i:""}function x(){const a=document.createElement("li");a.className="networks__list-empty-state",a.innerHTML=`${t.svgWithClass(t.wifiFindIcon,"wifi-find-icon")}<p>Scan for available networks</p>`,t.networkList.setEmptyState(a)}function S(){if(e.length===0){n="",g=-1;return}const a=e.findIndex(m=>m.ssid===n);if(a>=0){g=a;return}n="",g=-1}function E(){const a=t.networkList.getOptions();a.forEach((m,y)=>{m.setAttribute("aria-selected",String(n===e[y]?.ssid))}),g>=0&&g<a.length?t.networkList.setActiveDescendant(a[g].id):t.networkList.setActiveDescendant(null)}function v(){const a=e.find(m=>m.ssid===n);return a?!a.is_open:!0}function T(a){n=a,g=e.findIndex(m=>m.ssid===a),v()||t.clearFieldError(t.passwordInput),E(),t.onStateChange()}function _(){if(S(),t.networkList.clearItems(),e.length===0){x();return}e.forEach((a,m)=>{const y=document.createElement("li");y.className="networks__item",y.id=`network-option-${m}`,y.setAttribute("role","option"),y.setAttribute("tabindex","-1"),y.setAttribute("aria-selected",String(n===a.ssid));const I=document.createElement("span");I.className="networks__item-ssid",I.textContent=a.ssid;const z=document.createElement("div");if(z.className="networks__item-details",i===a.ssid&&o){const H=document.createElement("span");H.title="Currently connected",H.innerHTML=t.svgWithClass(t.checkIcon,"wifi-connected-icon"),z.appendChild(H)}const F=document.createElement("span");F.title=a.is_open?"Open":"Secured",a.is_open||(F.innerHTML=t.svgWithClass(t.securityIcon,"wifi-security-icon")),z.appendChild(F);const V=document.createElement("span");V.title=`Signal strength: ${a.signal_strength} (${a.rssi} dBm)`,V.innerHTML=t.svgWithClass(mi(a.rssi,t.signalIcons),"wifi-signal-icon"),z.appendChild(V),y.append(I,z),y.addEventListener("click",()=>{g=m,T(a.ssid),t.networkList.focus({preventScroll:!0})}),t.networkList.appendItem(y)}),E()}function f(a){const m=o,y=i;o=a.connected===!0,i=typeof a.ssid=="string"?a.ssid:"",b(),(m!==o||y!==i)&&_(),t.onConnectionStateChange?.({wasConnected:m,previousNetwork:y,isCurrentlyConnected:o,connectedNetwork:i})}async function s(){if(!r){r=!0,t.notify("Scanning for networks...","info"),t.onStateChange();try{let a="Scanning for networks...";for(let m=0;m<t.scanPollAttempts;m++){const y=await t.fetchPortalJson("/api/scan");if(a=y.message||a,y.scan_in_progress===!0){if(t.notify(a,"info"),m<t.scanPollAttempts-1){await t.delayMs(t.scanPollIntervalMs);continue}}else{e=Array.isArray(y.networks)?y.networks:[],t.notify(a||"Scan complete.","success"),_();return}}throw new Error("Network scan timed out. Please try again.")}catch(a){console.error("Scan failed:",a),t.notify(a instanceof Error?a.message:"Scan failed. Please try again.","error"),e=[],_()}finally{r=!1,t.onStateChange()}}}async function h(){if(!l){l=!0,t.onStateChange();try{const a=await t.fetchPortalJson("/api/status");f(a),r||t.notify(a.message||"Status updated.",a.connected?"success":"info")}catch(a){console.error("Status check failed:",a),t.notify(a instanceof Error?a.message:"Status check failed.","error")}finally{l=!1,t.onStateChange()}}}async function w(){if(!(c||!n)){if(v()&&t.passwordInput.value.trim().length===0){t.setFieldError(t.passwordInput,"Please enter a WiFi password."),t.passwordInput.focus({preventScroll:!0});return}if(t.passwordInput.value.length>vt){t.setFieldError(t.passwordInput,`WiFi password must be ${vt} characters or fewer.`),t.passwordInput.focus({preventScroll:!0});return}t.clearFieldError(t.passwordInput),c=!0,t.notify(`Connecting to ${n}...`,"info"),t.onStateChange();try{const a=await t.fetchPortalJson("/api/configure",{method:"POST",body:JSON.stringify({ssid:n,password:t.passwordInput.value})});t.notify(a.message||"Connection request sent.","info");for(let m=0;m<t.statusPollAttempts;m++){await t.delayMs(t.statusPollIntervalMs);const y=await t.fetchPortalJson("/api/status");if(f(y),y.connected){t.notify(y.message||"Connected.","success");break}}o||t.notify("Connection in progress...","info")}catch(a){console.error("Connection failed:",a),t.notify(a instanceof Error?a.message:"Connection failed.","error")}finally{c=!1,t.onStateChange()}}}async function d(){if(!(c||l||!o)){l=!0,t.notify("Disconnecting...","info"),t.onStateChange();try{const a=await t.fetchPortalJson("/api/disconnect",{method:"POST"}),m=o,y=i;o=!1,i="",b(),_(),t.notify(a.message||"Disconnected.","success"),t.onConnectionStateChange?.({wasConnected:m,previousNetwork:y,isCurrentlyConnected:o,connectedNetwork:i})}catch(a){console.error("Disconnect failed:",a),t.notify(a instanceof Error?a.message:"Disconnect failed.","error")}finally{l=!1,t.onStateChange()}}}function u(){if(C()){d();return}if(c||l){t.notify("WiFi status is busy. Please wait.","warning");return}if(!n){t.notify("Select a WiFi network first.","error"),t.networkList.focus({preventScroll:!0});return}if(v()&&t.passwordInput.value.trim().length===0){t.setFieldError(t.passwordInput,"Please enter a WiFi password."),t.notify("Please check if your password is correct.","error"),t.passwordInput.focus({preventScroll:!0});return}t.clearFieldError(t.passwordInput),w()}function p(){t.passwordInput.value?.trim().length&&t.clearFieldError(t.passwordInput),t.onStateChange()}function k(a){if(e.length!==0)switch(S(),a.key){case"Tab":break;case"ArrowDown":{a.preventDefault();const m=g<e.length-1?g+1:0;g=m,T(e[m].ssid),t.networkList.scrollOptionIntoView(m);break}case"ArrowUp":{a.preventDefault();const m=g>0?g-1:e.length-1;g=m,T(e[m].ssid),t.networkList.scrollOptionIntoView(m);break}case"Home":{a.preventDefault(),g=0,T(e[0].ssid),t.networkList.scrollOptionIntoView(0);break}case"End":{a.preventDefault();const m=e.length-1;g=m,T(e[m].ssid),t.networkList.scrollOptionIntoView(m);break}case"Enter":case" ":{a.preventDefault(),g>=0&&g<e.length&&T(e[g].ssid);break}}}function C(){return o&&i.length>0&&n===i}return{applyPortalStatus:f,checkStatus:h,connect:w,disconnect:d,getConnectedNetwork:()=>i,getSelectedNetwork:()=>n,handleConnectAction:u,handleListboxKeyDown:k,handlePasswordInput:p,isCheckingStatus:()=>l,isConnecting:()=>c,isCurrentlyConnected:()=>o,isScanning:()=>r,isSelectedConnected:C,renderNetworkList:_,requiresPassword:v,scanNetworks:s,updateWifiStatusCard:b}}function D(t,e){e().finally(()=>{!t.disabled&&t.offsetParent!==null&&setTimeout(()=>{!t.disabled&&t.offsetParent!==null&&t.focus()},0)})}function vi(t){const{controllers:e,dom:n,helpers:o}=t;function i(){n.wifiSettingsSheet.openBottomSheet(),e.wifiController.scanNetworks()}n.scanBtn.addEventListener("click",()=>{e.wifiController.scanNetworks()}),n.connectBtn.addEventListener("click",()=>{e.wifiController.handleConnectAction()}),n.wifiStatusCard.addEventListener("action",()=>{if(e.wifiController.isCurrentlyConnected()){e.wifiController.disconnect();return}i()}),n.wifiStatusCard.addEventListener("settings",()=>{i()}),n.wifiSettingsCloseBtn.addEventListener("click",()=>{n.wifiSettingsSheet.closeBottomSheet()}),n.passwordInput.addEventListener("input",()=>{e.wifiController.handlePasswordInput()}),n.networkList.addEventListener("keydown",r=>{e.wifiController.handleListboxKeyDown(r)}),n.geminiSaveBtn.addEventListener("click",()=>{D(n.geminiSaveBtn,()=>e.geminiController.saveGeminiKey())}),n.geminiClearBtn.addEventListener("click",()=>{D(n.geminiClearBtn,()=>e.geminiController.clearGeminiKey())}),n.geminiApiKeyInput.addEventListener("input",o.updateUi),n.timezoneLocationSaveBtn.addEventListener("click",()=>{if(!n.timezoneSelect.value.trim()){o.setFieldError(n.timezoneSelect,"Select a timezone."),o.setTimezoneLocationNotification("Select a timezone.","error"),n.timezoneSelect.focus({preventScroll:!0});return}o.clearFieldError(n.timezoneSelect),D(n.timezoneLocationSaveBtn,()=>e.timeController.saveTimezoneLocation())}),n.timezoneLocationClearBtn.addEventListener("click",()=>{D(n.timezoneLocationClearBtn,()=>e.timeController.clearTimezoneLocation())}),n.timezoneSelect.addEventListener("change",()=>{n.timezoneSelect.value?.trim().length&&o.clearFieldError(n.timezoneSelect),o.updateUi()}),n.manualDateInput.addEventListener("input",o.updateUi),n.manualTimeInput.addEventListener("input",o.updateUi)}function wi(t){const{controllers:e,dom:n}=t,o=e.wifiController.isScanning()||e.wifiController.isConnecting()||e.wifiController.isCheckingStatus(),i=e.wifiController.isSelectedConnected(),r=e.wifiController.getSelectedNetwork().trim(),l=r.length>0&&!i&&e.wifiController.requiresPassword(),c=i||r.length>0&&(!l||n.passwordInput.value.trim().length>0);n.scanBtn.disabled=o,n.connectBtn.disabled=o||!c,n.wifiStatusCard.actionDisabled=o,n.passwordInput.disabled=e.wifiController.isConnecting(),e.wifiController.isConnecting()?(n.connectBtn.textContent="Connecting...",n.wifiStatusCard.actionLabel="Connecting..."):i?(n.connectBtn.textContent="Disconnect",n.wifiStatusCard.actionLabel="Disconnect"):(n.connectBtn.textContent="Connect",n.wifiStatusCard.actionLabel=e.wifiController.isCurrentlyConnected()?"Disconnect":"Connect");const g=e.timeController.isTimezoneBusy()||e.timeController.isLocationBusy()||e.timeController.isClockBusy();n.timezoneSelect.disabled=g,n.manualDateInput.disabled=g,n.manualTimeInput.disabled=g,n.timezoneLocationSaveBtn.disabled=g||n.timezoneSelect.value.trim().length===0,n.timezoneLocationClearBtn.disabled=g||n.timezoneSelect.value.trim().length===0;const b=e.geminiController.isGeminiBusy(),x=e.geminiController.getGeminiHasKey();n.geminiApiKeyInput.readOnly=x||b,n.geminiApiKeyInput.disabled=b,n.geminiSaveBtn.disabled=b||x||n.geminiApiKeyInput.value.trim().length===0,n.geminiSaveBtn.hidden=x,n.geminiClearBtn.disabled=b||!x,n.geminiClearBtn.hidden=!x}pe();de();we();Ee();Ae();Ne();De();Fe();We();tn();let lt=null;const L=zn(),Yt=Nn(L.wifiSettingsNotification),ct=Zt(L.geminiCard),Xt=Zt(L.timezoneLocationCard),Qt=()=>document.createElement("input"),yi=document.createElement("button"),xi=Qt(),Ti=Qt(),Si=document.createElement("input");function M(){wi({controllers:{geminiController:ht,timeController:q,wifiController:P},dom:L})}const ht=Yn({fetchGeminiModuleJson:Gt,fetchOpenAiModuleJson:()=>Promise.resolve({}),geminiApiKeyInput:L.geminiApiKeyInput,isGeminiModuleActive:()=>!0,isOpenAiModuleActive:()=>!1,notifyGemini:ct,notifyOpenAi:()=>{},openAiApiKeyInput:Si,updateButtons:M}),q=pi({applyTalkingClockModuleSettings:()=>{},bedtimeTimeInput:Ti,clearFieldError:dt,clockModeToggle:yi,clockSyncPollAttempts:vn,clockSyncPollIntervalMs:bn,fetchTimeRuntimeJson:Mn,fetchTimeSettingsJson:Bn,fetchTimezoneListJson:qn,focusTalkingClockTimeInput:()=>{},buildTimezoneLabelMap:Vn,formatTimezoneLabel:Hn,isSwitchChecked:On,isTalkingClockModuleActive:()=>!1,isTalkingClockModuleBusy:()=>!1,manualDateInput:L.manualDateInput,manualTimeInput:L.manualTimeInput,notifyClockMode:()=>{},notify:Xt,onStateChange:M,onTalkingClockBusyChange:()=>{},parseClockTimeInputValue:Kn,patchTalkingClockSettings:()=>Promise.resolve({success:!0}),setFieldError:ut,setSwitchChecked:Pn,timeRuntimeApi:kn,timeSettingsApi:En,timezoneSelect:L.timezoneSelect,wakeupTimeInput:xi}),P=bi({checkIcon:cn,clearFieldError:dt,delayMs:$n,fetchPortalJson:In,networkList:L.networkList,notify:Yt,onConnectionStateChange:({wasConnected:t,isCurrentlyConnected:e})=>{!t&&e&&q.refreshClockStatusAfterWifiConnect()},onStateChange:M,passwordInput:L.passwordInput,scanPollAttempts:Tn,scanPollIntervalMs:xn,securityIcon:nn,setFieldError:ut,signalIcons:{oneBar:on,twoBar:rn,threeBar:sn,fourBar:an},statusPollAttempts:mn,statusPollIntervalMs:pn,svgWithClass:Dn,wifiFindIcon:ln,wifiStatusCard:L.wifiStatusCard}),te=document.getElementById("firmwareUpdateCard"),ee=jn({card:te,fileInput:document.getElementById("firmwareFileInput"),uploadBtn:document.getElementById("firmwareUploadBtn"),versionText:document.getElementById("firmwareVersionText"),cloudBtn:document.getElementById("firmwareCloudBtn"),cloudText:document.getElementById("firmwareCloudText")});function $(){if(!lt)return;const t=document.documentElement,e=t.scrollHeight>window.innerHeight+1,n=window.scrollY+window.innerHeight>=t.scrollHeight-1;lt.setVisible(e&&!n)}function Ei(){L.wifiStatusCard.iconSvg=en,L.geminiCard.iconSvg=Kt,L.timezoneLocationCard.iconSvg=dn,te.iconSvg=un,ee.bind(),P.renderNetworkList(),document.body&&(lt=re({mount:document.body,mode:"fixed",position:"bottom",height:"6rem",width:"100vw",strength:1.8,divCount:5,curve:"bezier",exponential:!0,opacity:1,zIndex:20,className:"page-gradual-blur",fallbackColor:"var(--color-bg-selected)"}),$(),window.addEventListener("scroll",$,{passive:!0}),window.addEventListener("resize",$),typeof ResizeObserver<"u"&&new ResizeObserver(()=>{$()}).observe(document.body)),M(),P.updateWifiStatusCard(),Yt(""),vi({controllers:{geminiController:ht,timeController:q,wifiController:P},dom:L,helpers:{clearFieldError:dt,setFieldError:ut,setTimezoneLocationNotification:Xt,updateUi:M}}),ki(),window.setInterval(()=>{q.fetchTimeRuntimeStatus()},wn)}async function ki(){await Promise.allSettled([q.populateTimezoneOptions(),q.fetchTimeSettingsStatus(),P.checkStatus(),Ai(),Ci(),ee.refreshVersion()])}async function Ci(){const t=document.getElementById("transcriptionLanguageSelect");if(t){try{const e=await B("/api/settings/transcription");e.language&&(t.value=e.language)}catch(e){console.error("Transcription language load failed:",e)}t.addEventListener("change",async()=>{try{await B("/api/settings/transcription",{method:"PATCH",body:JSON.stringify({language:t.value})}),ct("Transcription language saved.","success")}catch(e){ct(e instanceof Error?e.message:"Could not save the language.","error")}})}}async function Ai(){try{const t=await Gt("/api/settings/gemini");ht.applyGeminiSettings(t.settings)}catch(t){console.error("Gemini settings status failed:",t)}finally{M()}}_i();async function _i(){const t=await fi(),e={signInCard:document.getElementById("shareSignInCard"),pinInput:document.getElementById("sharePinInput"),pinButton:document.getElementById("sharePinBtn"),recordingsCard:document.getElementById("recordingsCard"),recordingsSummary:document.getElementById("recordingsSummary"),recordingsList:document.getElementById("recordingsList"),recordingsRefreshButton:document.getElementById("recordingsRefreshBtn"),recordingsExportButton:document.getElementById("recordingsExportBtn"),booksCard:document.getElementById("booksCard"),booksList:document.getElementById("booksList"),bookFileInput:document.getElementById("bookFileInput"),bookUploadButton:document.getElementById("bookUploadBtn")};if(e.recordingsCard.iconSvg=hn,e.booksCard.iconSvg=gn,e.signInCard.iconSvg=Kt,t==="share"){for(const n of["wifiStatusCard","wifiSettingsSheet","geminiCard","timezoneLocationCard","firmwareUpdateCard"])document.getElementById(n)?.setAttribute("hidden","");await _t(e,"share").start();return}Ei(),t==="setup"&&await _t(e,"setup").start()}
