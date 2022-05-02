"use strict";(self.webpackChunkblog_admin=self.webpackChunkblog_admin||[]).push([[407,845],{6895:function(e,n,t){t.r(n),t.d(n,{default:function(){return E}});var r=t(1413),o=t(5861),a=t(5671),i=t(3144),c=t(136),s=t(8557),l=t(7757),u=t.n(l),d=t(7363),f=t.n(d),h=(t(6434),{icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 00-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"}}]},name:"upload",theme:"outlined"}),p=t(7469),m=function(e,n){return d.createElement(p.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:n,icon:h}))};m.displayName="UploadOutlined";var g=d.forwardRef(m),v=t(4740),b=t(1843),x=t(6063),Z=t(685),y=t(6168),w=t(9491),C=t(2508),k=t(489),S=t(6417),j=v.Z.Item,M={labelCol:{span:4},wrapperCol:{span:20}},D=null,E=function(e){(0,c.Z)(t,e);var n=(0,s.Z)(t);function t(e){var r;return(0,a.Z)(this,t),(r=n.call(this,e)).handleFormSubmit=function(){var e=(0,o.Z)(u().mark((function e(n){var t,o,a,i,c,s;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(o in r.setState({isSubmitting:!0}),t=new FormData,n)n[o]&&t.append(o,n[o]);return D&&t.append("resumeFile",D),e.next=6,(0,k.UV)(t);case 6:if(a=e.sent,r.setState({isSubmitting:!1}),c=(i=a||{}).code,s=i.msg,200===c){e.next=11;break}return e.abrupt("return");case 11:r.fetchBlogConfig(),x.ZP.success(s);case 13:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),r.handleDeleteResume=(0,o.Z)(u().mark((function e(){var n,t,r,o;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,k.hr)();case 2:if(n=e.sent,r=(t=n||{}).code,o=t.msg,200===r){e.next=6;break}return e.abrupt("return",x.ZP.error("\u5220\u9664\u7b80\u5386\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5"));case 6:T(""),x.ZP.success(o);case 8:case"end":return e.stop()}}),e)}))),r.fetchBlogConfig=(0,o.Z)(u().mark((function e(){var n,t,o,a,i;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,k.or)();case 2:if(n=e.sent,console.log({res:n}),o=(t=n||{}).code,a=t.data,200===o&&a){e.next=7;break}return e.abrupt("return");case 7:(i=(a||{}).resumeUrl)&&T(i),setTimeout((function(){r.formRef.current&&r.formRef.current.setFieldsValue(a)}),0);case 10:case"end":return e.stop()}}),e)}))),r.formRef=f().createRef(),r.state={isSubmitting:!1},r}return(0,i.Z)(t,[{key:"componentDidMount",value:function(){this.fetchBlogConfig()}},{key:"render",value:function(){var e=this.state.isSubmitting;return(0,S.jsxs)("div",{className:"blog-config",children:[(0,S.jsxs)(v.Z,(0,r.Z)((0,r.Z)({},M),{},{ref:this.formRef,onFinish:this.handleFormSubmit,children:[(0,S.jsx)(j,{name:"firstText",label:"\u535a\u5ba2\u9996\u9875\u7b2c\u4e00\u884c",rules:[{required:!0}],children:(0,S.jsx)(Z.Z,{allowClear:!0})}),(0,S.jsx)(j,{name:"secondText",label:"\u535a\u5ba2\u9996\u9875\u7b2c\u4e8c\u884c",rules:[{required:!1}],children:(0,S.jsx)(Z.Z,{allowClear:!0})}),(0,S.jsx)(j,{name:"thirdText",label:"\u535a\u5ba2\u9996\u9875\u7b2c\u4e09\u884c",rules:[{required:!1}],children:(0,S.jsx)(Z.Z.TextArea,{allowClear:!0})}),(0,S.jsx)(j,{name:"iconLink",label:"\u963f\u91ccIconFont\u94fe\u63a5",rules:[{required:!1}],children:(0,S.jsx)(Z.Z,{allowClear:!0})}),(0,S.jsxs)(j,{label:"\u4e2a\u4eba\u7b80\u5386",rules:[{required:!1}],children:[(0,S.jsx)(y.Z,{showUploadList:!1,customRequest:function(){},onChange:P,className:"",children:(0,S.jsx)(w.Z,{icon:(0,S.jsx)(g,{}),children:"\u4e0a\u4f20\u7b80\u5386"})}),(0,S.jsx)(w.Z,{type:"danger",style:{margin:"0 15px"},onClick:this.handleDeleteResume,children:"\u5220\u9664\u7b80\u5386"}),(0,S.jsx)(w.Z,{type:"primary",htmlType:"submit",icon:e?(0,S.jsx)(C.Z,{}):null,children:e?"\u4fdd\u5b58\u4e2d":"\u4fdd\u5b58\u8868\u5355"})]})]})),(0,S.jsx)("embed",{id:"pdf-container",type:"application/pdf"})]})}}]),t}(d.Component);function P(e){var n=e.file.originFileObj;if("object"!==typeof n)return x.ZP.error("\u4e0a\u4f20\u6587\u4ef6\u683c\u5f0f\u6709\u8bef\uff0c\u8bf7\u68c0\u67e5");var t=n||{},r=t.type,o=t.size;if(!r.includes("pdf"))return x.ZP.error("\u4ec5\u53ef\u4e0a\u4f20Pdf\u683c\u5f0f\u6587\u4ef6");if(!(o/1024/1024<10))return x.ZP.error("\u6587\u4ef6\u4e0d\u80fd\u5927\u4e8e 10MB");D=n;var a=window.URL.createObjectURL(n);b.Z.success({message:"\u7b80\u5386\u9884\u89c8\u6210\u529f",description:"\u7b80\u5386\u672c\u5730\u4e0a\u4f20\u9884\u89c8\u6210\u529f\uff0c\u82e5\u786e\u8ba4\u65e0\u8bef\u8bf7\u70b9\u51fb\u4fdd\u5b58\u6309\u94ae\u4e0a\u4f20\u5230\u6570\u636e\u5e93\u3002",duration:0,top:200,key:"resumeSuccessNotification"}),T(a)}function T(e){if("string"!==typeof e)return x.ZP.error("\u7b80\u5386\u6587\u4ef6\u8def\u5f84\u6709\u8bef\uff0c\u8bf7\u68c0\u67e5");var n=document.getElementById("pdf-container");"object"===typeof n&&n.setAttribute("src",e)}},3681:function(e,n,t){t.d(n,{Z:function(){return s}});var r=t(1413),o=t(7363),a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"}}]},name:"check",theme:"outlined"},i=t(7469),c=function(e,n){return o.createElement(i.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:n,icon:a}))};c.displayName="CheckOutlined";var s=o.forwardRef(c)},7515:function(e,n,t){t.d(n,{Z:function(){return s}});var r=t(1413),o=t(7363),a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"}}]},name:"delete",theme:"outlined"},i=t(7469),c=function(e,n){return o.createElement(i.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:n,icon:a}))};c.displayName="DeleteOutlined";var s=o.forwardRef(c)},1318:function(e,n,t){t.d(n,{Z:function(){return a}});var r=t(9439),o=t(7363);function a(){var e=o.useReducer((function(e){return e+1}),0);return(0,r.Z)(e,2)[1]}},9990:function(e,n,t){t.d(n,{Z:function(){return s}});var r=t(1413),o="".concat("accept acceptCharset accessKey action allowFullScreen allowTransparency\n    alt async autoComplete autoFocus autoPlay capture cellPadding cellSpacing challenge\n    charSet checked classID className colSpan cols content contentEditable contextMenu\n    controls coords crossOrigin data dateTime default defer dir disabled download draggable\n    encType form formAction formEncType formMethod formNoValidate formTarget frameBorder\n    headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode integrity\n    is keyParams keyType kind label lang list loop low manifest marginHeight marginWidth max maxLength media\n    mediaGroup method min minLength multiple muted name noValidate nonce open\n    optimum pattern placeholder poster preload radioGroup readOnly rel required\n    reversed role rowSpan rows sandbox scope scoped scrolling seamless selected\n    shape size sizes span spellCheck src srcDoc srcLang srcSet start step style\n    summary tabIndex target title type useMap value width wmode wrap"," ").concat("onCopy onCut onPaste onCompositionEnd onCompositionStart onCompositionUpdate onKeyDown\n    onKeyPress onKeyUp onFocus onBlur onChange onInput onSubmit onClick onContextMenu onDoubleClick\n    onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop onMouseDown\n    onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp onSelect onTouchCancel\n    onTouchEnd onTouchMove onTouchStart onScroll onWheel onAbort onCanPlay onCanPlayThrough\n    onDurationChange onEmptied onEncrypted onEnded onError onLoadedData onLoadedMetadata\n    onLoadStart onPause onPlay onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend onTimeUpdate onVolumeChange onWaiting onLoad onError").split(/[\s\n]+/),a="aria-",i="data-";function c(e,n){return 0===e.indexOf(n)}function s(e){var n,t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];n=!1===t?{aria:!0,data:!0,attr:!0}:!0===t?{aria:!0}:(0,r.Z)({},t);var s={};return Object.keys(e).forEach((function(t){(n.aria&&("role"===t||c(t,a))||n.data&&c(t,i)||n.attr&&o.includes(t))&&(s[t]=e[t])})),s}},6434:function(e,n,t){t.r(n)}}]);