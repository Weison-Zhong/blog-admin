"use strict";(self.webpackChunkblog_admin=self.webpackChunkblog_admin||[]).push([[353],{9353:function(e,t,n){n.r(t),n.d(t,{default:function(){return C}});var a=n(5861),r=n(5671),c=n(3144),s=n(136),i=n(8557),u=n(7757),o=n.n(u),d=n(7313),l=n(2209),h=n(4709),f=n(5395),g=n(6417),p=1,k=10,x=0,C=function(e){(0,s.Z)(n,e);var t=(0,i.Z)(n);function n(e){var c;return(0,r.Z)(this,n),(c=t.call(this,e)).handlePageSizeChange=function(e,t){p=e,k=t,c.fetchGuests()},c.handlePageNumerChange=function(e,t){p=e,k=t,c.fetchGuests()},c.fetchGuests=(0,a.Z)(o().mark((function e(){var t,n,a,r,s,i,u;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c.setState({guests:[]}),t={pageNumber:p,pageSize:k},e.next=4,(0,l.Rb)(t);case 4:if(n=e.sent,r=(a=n||{}).code,s=a.data,200===r){e.next=8;break}return e.abrupt("return");case 8:i=s.guests,u=s.totalCount,x=u,(0,f.kJ)(i)&&(i.forEach((function(e,t){return e.index=t+1})),c.setState({guests:i}));case 11:case"end":return e.stop()}}),e)}))),c.state={guests:[]},c}return(0,c.Z)(n,[{key:"componentDidMount",value:function(){this.fetchGuests()}},{key:"componentWillUnmount",value:function(){this.setState=function(e,t){}}},{key:"render",value:function(){var e=[{title:"\u5e8f\u53f7",width:80,dataIndex:"index",align:"center"},{title:"\u8bbf\u95ee\u6b21\u6570",dataIndex:"accessCount",key:"accessCount",width:105,align:"center",sorter:function(e,t){return e.accessCount-t.accessCount}},{title:"\u521b\u5efa\u65f6\u95f4",dataIndex:"createdDate",key:"createdDate",width:180,align:"center",sorter:function(e,t){return Date.parse(e.createdDate)-Date.parse(t.createdDate)}},{title:"\u6700\u65b0\u8bbf\u95ee",width:180,key:"updatedDate",dataIndex:"updatedDate",align:"center",sorter:function(e,t){return Date.parse(e.updatedDate)-Date.parse(t.updatedDate)}},{title:"\u5730\u5740",key:"address",ellipsis:!0,textWrap:"word-break",align:"center",render:function(e,t){var n=t||{},a=n.country,r=n.province,c=n.city;return"".concat(a).concat(r).concat(c)}}];return(0,g.jsx)("div",{className:"article-list",children:(0,g.jsx)("div",{className:"content-container",children:(0,g.jsx)(h.Z,{columns:e,dataSource:this.state.guests,rowKey:"index",scroll:{y:"calc(100vh - 185px)"},pagination:{showSizeChanger:!0,onShowSizeChange:this.handlePageSizeChange,onChange:this.handlePageNumerChange,total:x}})})})}}]),n}(d.Component)}}]);