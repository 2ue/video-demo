(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[3],{"15c4":function(e,t,i){"use strict";i.r(t);var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"invite-container"},[i("comp-nav"),e.loadProfile?i("div",{staticClass:"content",class:e.$isMobile&&"content-mobile"},[i("div",[i("DeviceSelect",{attrs:{deviceType:"camera"},on:{change:e.changeCamera}}),i("DeviceSelect",{attrs:{deviceType:"microphone"},on:{change:e.changeMicrophone}}),i("DeviceSelect",{attrs:{deviceType:"speaker"},on:{change:e.changeSpeaker}})],1),e.cameraId?i("comp-room",{ref:"room",attrs:{type:"invite",sdkAppId:Number(e.sdkAppId),inviteUserSig:e.userSig,userId:e.userId,roomId:Number(e.roomId),secretKey:e.secretKey,"manual-enter":!0,cameraId:e.cameraId,microphoneId:e.microphoneId},on:{mounted:function(t){e.roomIsReady=!0}}}):e._e()],1):e._e()],1)},c=[],a=(i("bf8f"),i("c936"),i("6ed5")),r=i.n(a),o=i("5530"),s=(i("a9e3"),i("9183")),d=i("96e5"),u=i("fa7d"),l=i("2f62"),v=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"select-container"},[i("span",{staticClass:"label"},[e._v(e._s(e.deviceType))]),i("el-select",{staticClass:"select",attrs:{placeholder:e.deviceType},on:{change:e.handleChange},model:{value:e.activeDeviceId,callback:function(t){e.activeDeviceId=t},expression:"activeDeviceId"}},e._l(e.deviceList,(function(e){return i("el-option",{key:e.deviceId,attrs:{label:e.label,value:e.deviceId}})})),1)],1)},h=[],m=i("c7eb");function p(e){if(Array.isArray(e))return e}i("a4d3"),i("e01a"),i("d3b7"),i("d28b"),i("3ca3"),i("ddb0");function f(e,t){var i=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=i){var n,c,a=[],r=!0,o=!1;try{for(i=i.call(e);!(r=(n=i.next()).done);r=!0)if(a.push(n.value),t&&a.length===t)break}catch(s){o=!0,c=s}finally{try{r||null==i["return"]||i["return"]()}finally{if(o)throw c}}return a}}var b=i("06c5");i("d9e2");function I(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function g(e,t){return p(e)||f(e,t)||Object(b["a"])(e,t)||I()}var y=i("1da1"),k=i("5781"),D=i.n(k),S={name:"compDeviceSelect",props:{deviceType:{type:String}},data:function(){return{deviceList:[],activeDevice:{},activeDeviceId:""}},methods:{getDeviceList:function(){var e=this;return Object(y["a"])(Object(m["a"])().mark((function t(){var i;return Object(m["a"])().wrap((function(t){while(1)switch(t.prev=t.next){case 0:t.t0=e.deviceType,t.next="camera"===t.t0?3:"microphone"===t.t0?8:"speaker"===t.t0?13:17;break;case 3:return t.next=5,D.a.getCameras();case 5:return e.deviceList=t.sent,console.log("JSON==== camera testtt",e.deviceList),t.abrupt("break",18);case 8:return t.next=10,D.a.getMicrophones();case 10:return e.deviceList=t.sent,console.log("JSON==== microphone testtt",e.deviceList),t.abrupt("break",18);case 13:return t.next=15,D.a.getSpeakers();case 15:return e.deviceList=t.sent,t.abrupt("break",18);case 17:return t.abrupt("break",18);case 18:i=g(e.deviceList,1),e.activeDevice=i[0],e.activeDeviceId=e.deviceList[0].deviceId,e.$emit("change",e.activeDeviceId);case 22:case"end":return t.stop()}}),t)})))()},handleChange:function(){this.$emit("change",this.activeDeviceId)}},mounted:function(){var e=this;navigator.mediaDevices.getUserMedia({audio:!0,video:!0}).then((function(){e.getDeviceList()})),navigator.mediaDevices.addEventListener("devicechange",this.getDeviceList)},beforeDestroy:function(){navigator.mediaDevices.removeEventListener("devicechange",this.getDeviceList)}},w=S,j=(i("9f83"),i("3b6b"),i("2877")),x=Object(j["a"])(w,v,h,!1,null,"0a2fdd83",null),L=x.exports,$={data:function(){return{sdkAppId:0,userSig:"",userId:"",roomId:0,roomIsReady:!1,joined:!1,loadProfile:!1,cameraId:"",microphoneId:""}},computed:Object(o["a"])({},Object(l["b"])({secretKey:function(e){return e.secretKey}})),components:{compNav:s["a"],CompRoom:d["a"],DeviceSelect:L},created:function(){var e=this;this.sdkAppId=Number(Object(u["e"])("sdkAppId")),this.userSig=Object(u["e"])("userSig"),this.userId=this.$store.state.userId,this.roomId=Number(Object(u["e"])("roomId")),console.log("xxxx===>",this.sdkAppId,this.userSig,this.userId,this.roomId),this.$store.state.remoteStore.persistence.get("yf_".concat(this.roomId)).then((function(t){var i,n;if(e.$store.commit("tim/updateGroupId",null===(i=t.data)||void 0===i?void 0:i.groupId),e.$store.commit("tim/updateProfile",(null===t||void 0===t?void 0:t.data)||{}),"off"===(null===t||void 0===t||null===(n=t.data)||void 0===n?void 0:n.status))return e.$alert("会议已结束"),void r()("会议已结束","提示",{confirmButtonText:"确定",showCancelButtonText:!1,showClose:!1,type:"warning",beforeClose:function(){e.$router.push("/")}}).then((function(){e.$router.push("/")})).catch((function(){e.$router.push("/")}));e.loadProfile=!0}))},watch:{roomIsReady:{immediate:!0,handler:function(e){e&&!this.joined&&(this.$refs.room&&this.$refs.room.handleJoinRoom("auto"),this.joined=!0)}}},methods:{changeCamera:function(e){console.log("11111 switch camera success testtt",e),this.cameraId=e},changeMicrophone:function(e){console.log("22222 switch audio success testtt",e),this.microphoneId=e},changeSpeaker:function(){}}},C=$,O=(i("ad98"),Object(j["a"])(C,n,c,!1,null,"6726fa18",null));t["default"]=O.exports},"3b6b":function(e,t,i){"use strict";i("5844")},5844:function(e,t,i){},8168:function(e,t,i){},"883d":function(e,t,i){},"9f83":function(e,t,i){"use strict";i("8168")},ad98:function(e,t,i){"use strict";i("883d")}}]);
//# sourceMappingURL=3.343dea7c.js.map