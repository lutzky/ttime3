!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.ttime=t():e.ttime=t()}(window,function(){return function(e){var t={};function n(s){if(t[s])return t[s].exports;var a=t[s]={i:s,l:!1,exports:{}};return e[s].call(a.exports,a,a.exports,n),a.l=!0,a.exports}return n.m=e,n.c=t,n.d=function(e,t,s){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(s,a,function(t){return e[t]}.bind(null,a));return s},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="dist/",n(n.s=2)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=n(3);t.Faculty=class{};t.Group=class{};t.Course=class{};t.AcademicEvent=class{};t.Schedule=class{};t.FilterSettings=class{};function a(e){e.sort((e,t)=>e.day!==t.day?e.day-t.day:e.startMinute-t.startMinute)}function o(e){e.forEach(e=>{e.courses.forEach(t=>{t.faculty=e,t.groups&&t.groups.forEach(e=>{e.course=t,e.events&&e.events.forEach(t=>{t.group=e})})})})}t.DateObj=class{},t.sortEvents=a,t.eventsCollide=function(e){const t=e.slice();a(t);for(let e=0;e<t.length-1;e++)if(t[e].day===t[e+1].day&&t[e+1].startMinute<t[e].endMinute)return!0;return!1},t.loadCatalog=function(e){return new Promise((t,n)=>{const a=new XMLHttpRequest;a.open("GET",e),a.onload=(()=>{if(200===a.status){let e=null;try{o(e="["===a.response[0]?JSON.parse(a.response):s.parseCheeseFork(a.response)),t(e)}catch(e){n(e)}}else n(Error(a.statusText))}),a.onerror=(()=>{n(Error("Network Error"))}),a.send()})},t.fixRawCatalog=o,t.groupsByType=function(e){const t=new Map;return e.groups?(e.groups.forEach(e=>{t.has(e.type)||t.set(e.type,[]),t.get(e.type).push(e)}),Array.from(t.values())):[]}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.minutesToTime=function(e){return Math.floor(e/60).toString().padStart(2,"0")+":"+(e%60).toString().padStart(2,"0")},t.formatDate=function(e){return new Date(e.year,e.month,e.day).toDateString()},t.displayName=function(e){return e.description||e.course.name}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});let s=!1;new URL(window.location.href).searchParams.get("ttime_debug")&&(s=!0);const a=n(0),o=n(1),r=n(4),i=n(5),c=n(6);const l="https://storage.googleapis.com/repy-176217.appspot.com/latest.json";function u(e){$("#catalog-url").val(e),d()}function d(){j()}function p(){return new Promise((e,t)=>{const n=new XMLHttpRequest;n.open("GET","https://api.github.com/repos/michael-maltsev/cheese-fork/contents/courses?ref=gh-pages"),n.onload=(()=>{if(200===n.status)try{const s=JSON.parse(n.response).map(e=>e.download_url).filter(e=>e.endsWith(".min.js")).map(e=>["Cheesefork "+e.substr(e.lastIndexOf("_")+1,6),e]);e(s)}catch(e){t(e)}else t(Error(n.statusText))}),n.onerror=(()=>{t(Error("Network Error"))}),n.send()})}window.defaultCatalogUrl=l,window.setCatalogUrl=u,window.catalogUrlChanged=d,window.getCheeseForkCatalogs=p,p().then(e=>{for(const[t,n]of e.sort().reverse())$("#cheesefork-catalog-selectors").append($("<a>",{class:"dropdown-item",click:()=>u(n),href:"#/",text:t}))});const f=new Set;let h=new r.default([]);let m=null,g=null;function y(e){e.text(e.data("forbidden")?"[unforbid]":"[forbid]")}function b(e){const t=$("<li>");let n=`Group ${e.id} (${e.type}) `;e.teachers.length>0&&(n+=`(${e.teachers.join(", ")}) `);const s=$("<b>",{text:n});t.append(s);const a=$("<a>",{class:"forbid-link",data:{forbidden:E(e),groupID:w(e)},href:"#/"});return y(a),a.on("click",()=>{a.data("forbidden")?function(e){v.delete(w(e)),j(),M()}(e):x(e)}),t.append(a),t}let v=new Set;function w(e){return`${e.course.id}.${e.id}`}function x(e){v.add(w(e)),j(),M()}function E(e){return v.has(w(e))}function M(){const e=$("#forbidden-groups");e.empty(),v.forEach(t=>{const n=$("<li>");n.text(t+" ");const s=$("<a>",{href:"#/",text:"[unforbid]",click(){v.delete(t),j(),M()}});n.append(s),e.append(n)}),$("a.forbid-link").each(()=>{const e=$(this).data("groupID"),t=v.has(e);$(this).data("forbidden",t),y($(this))})}function C(e){return String(e).padStart(6,"0")}c.setAddForbiddenGroupCallback(x);const S='<i class="fas fa-info-circle"></i>',T='<i class="fas fa-minus-circle"></i>';function _(e){return`<span dir="rtl">${e}</span>`}function k(e){const t=document.createElement("span"),n=document.createElement("a");return n.innerHTML=S,n.className="expando",n.href="#/",t.innerHTML=` ${C(e.id)} ${_(e.name)} `,n.onclick=(()=>{if($(t).data("ttime3_expanded"))n.innerHTML=S,$(t).data("ttime3_expanded",!1),t.removeChild($(t).data("infoDiv"));else{const a=document.createElement("div");$(t).data("infoDiv",a),a.appendChild(function(e){const t=$("<span>"),n=$("<ul>");n.append($("<li>",{html:`<b>Full name</b> ${C(e.id)} ${e.name}`})),n.append($("<li>",{html:`<b>Academic points:</b> ${e.academicPoints}`})),n.append($("<li>",{html:`<b>Lecturer in charge:</b> ${_(e.lecturerInCharge||"[unknown]")}`})),n.append($("<li>",{html:"<b>Test dates:</b>"}));const s=$("<ul>");e.testDates?e.testDates.forEach(e=>{s.append($("<li>",{text:o.formatDate(e)}))}):s.append($("<li>",{text:"[unknown]"})),n.append(s),n.append($("<li>",{html:"<b>Groups:</b>"}));const a=$("<ul>");return e.groups?e.groups.forEach(e=>{a.append(b(e)[0]);const t=$("<ul>");e.events?e.events.forEach(e=>{t.append($("<li>",{text:`${z[e.day]}, `+o.minutesToTime(e.startMinute)+"-"+o.minutesToTime(e.endMinute)+` at ${e.location||"[unknown]"}`}))}):t.append($("<li>",{text:"[unknown]"})),a.append(t)}):a.append($("<li>",{text:"[unknown]"})),n.append(a),t.append(n),t[0]}(e)),s&&console.info(e),t.appendChild(a),n.innerHTML=T,$(t).data("ttime3_expanded",!0)}}),t.appendChild(n),t}const D=new Map,N=new Map;function j(){var e;ee.selectedCourses=Array.from(f).map(e=>e.id),ee.customEvents=$("#custom-events-textarea").val(),ee.catalogUrl=$("#catalog-url").val(),ee.hideCoursesWithCloseTests=$("#hide-courses-with-close-tests").prop("checked"),ee.minTestDateDistance=F($("#close-test-distance")[0],5),$("#min-test-date-distance-display").text(ee.minTestDateDistance),I(),ee.filterSettings={forbiddenGroups:Array.from(v),noCollisions:(e="filter.noCollisions",document.getElementById(e).checked),ratingMax:{earliestStart:null,freeDays:null,latestFinish:null,numRuns:null},ratingMin:{earliestStart:null,freeDays:null,latestFinish:null,numRuns:null}},Q.forEach(e=>{ee.filterSettings.ratingMin[e]=F($(`#rating-${e}-min`)[0],null),ee.filterSettings.ratingMax[e]=F($(`#rating-${e}-max`)[0],null)}),window.localStorage.setItem("ttime3_settings",JSON.stringify(ee)),window.gtag("event",ee.catalogUrl,{event_category:"saveSettings",event_label:"catalog-url"}),window.gtag("event",ee.filterSettings.noCollisions,{event_category:"saveSettings",event_label:"no-collisions"}),s&&console.info("Saved settings:",ee)}function F(e,t){return""===e.value?t:Number(e.value)}function O(e){s&&console.info("Selected",e),window.gtag("event",`${e.id}`,{event_category:"SelectCourses",event_label:"addCourse"}),f.add(e),D.get(e.id).disabled=!0,N.get(e.id).classList.add("disabled-course-label"),j(),P(),I()}function L(...e){e.forEach(e=>{const t=Y(e);if(!t)throw new Error("No course with ID "+e);O(t)})}function I(){h=new r.default(Array.from(f));const e=$("#courses-selectize")[0].selectize;e&&e.clearCache(),$("#how-to-show-close-test-courses").html(ee.hideCoursesWithCloseTests?"hidden":'shown in <span style="color: red">red</span>');const t=$("<ul>",{class:"list-group"});$("#test-schedule").empty(),$("#test-schedule").append(t);const n=h.getDatesAndDistances();for(let e=0;e<n.length;e++){const[s,a,o]=n[e],r=a.toISOString().slice(0,10);let i="";e>0&&(i=`${s}d`,s<ee.minTestDateDistance&&(i=`<span style="color: red; font-weight: bold">${s}d</span>`),i+=" &rarr;"),t.append($("<li>",{class:"list-group-item",html:`${i} ${r} - ${o.name}`}))}}function P(){const e=Number((t=f,Array.from(t.values()).map(e=>a.groupsByType(e).map(e=>e.length).reduce((e,t)=>e*t,1)).reduce((e,t)=>e*t,1)));var t;$("#possible-schedules").text(`${e.toLocaleString()} (${e.toExponential(2)})`),$("#generate-schedules").prop("disabled",0===f.size);const n=$("#selected-courses");n.empty();const o=$("<ul>",{class:"list-group"});n.append(o),f.forEach(e=>{const t=$("<li>",{class:"list-group-item"}),n=k(e),a=$("<button>",{class:"btn btn-sm btn-danger float-right",html:'<i class="fas fa-trash-alt"></i>',click(){!function(e){s&&console.info("Unselected",e),window.gtag("event",`${e.id}`,{event_category:"SelectCourses",event_label:"delCourse"}),f.delete(e),D.get(e.id).disabled=!1,N.get(e.id).classList.remove("disabled-course-label"),j(),P(),I()}(e)}});t.append(n),null!==e.groups&&0!==e.groups.length||t.append($("<i>",{class:"text-warning fas fa-exclamation-triangle",title:"Course has no groups"})),t.append(a),o.append(t)})}window.saveSettings=j,window.addSelectedCourseByID=L;const A=new(n(8));A.postMessage({debug:s}),A.onmessage=(e=>{s&&console.info("Received message from worker:",e),$("#generate-schedules").prop("disabled",!1),$("#spinner").hide(),null==e.data?$("#exception-occurred-scheduling").show():function(e){R=e,U=0;const t=$("#schedule-browser, #rendered-schedule-container");$("#num-schedules").text(e.length),0===e.length||1===e.length&&0===e[0].events.length?(t.hide(),$("#no-schedules").show()):(t.show(),J(0))}(e.data)}),window.checkCustomEvents=function(){const e=$("#custom-events-textarea");e.removeClass("is-invalid"),e.removeClass("is-valid");try{G(e.val()).length>0&&e.addClass("is-valid")}catch(t){e.addClass("is-invalid")}};const W=new RegExp([/(Sun|Mon|Tue|Wed|Thu|Fri|Sat) /,/([0-9]{2}):([0-9]{2})-([0-9]{2}):([0-9]{2}) /,/(.*)/].map(e=>e.source).join("")),H={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};function G(e){const t=[];return""===e?t:(e.split("\n").forEach(e=>{const n=W.exec(e);if(null==n)throw Error("Invalid custom event line: "+e);const s=H[n[1]],a=Number(60*Number(n[2])+Number(n[3])),o=Number(60*Number(n[4])+Number(n[5])),r=n[6];t.push(function(e,t,n,s){const a={academicPoints:0,groups:[],id:0,lecturerInCharge:"",name:e,testDates:[]},o={course:a,description:"",events:[],id:0,teachers:[],type:"lecture"};a.groups.push(o);const r={day:t,endMinute:s,group:o,location:"",startMinute:n};return o.events.push(r),a}(r,s,a,o))}),t)}window.getSchedules=function(){$("#generate-schedules").prop("disabled",!0),$("#spinner").show(),$("#exception-occurred").hide(),$("#no-schedules").hide(),$("#initial-instructions").hide(),window.gtag("event","generateSchedules"),window.gtag("event","generateSchedules-num-courses",{value:f.size});const e=new Set(f);try{G(ee.customEvents).forEach(t=>e.add(t))}catch(e){console.error("Failed to build custom events course:",e)}A.postMessage({courses:e,filterSettings:ee.filterSettings})};let R=[],U=0;window.nextSchedule=function(){J(U+1)},window.prevSchedule=function(){J(U-1)};const z=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],B=[["#007bff","#fff"],["#e83e8c","#fff"],["#ffc107","#000"],["#6610f2","#fff"],["#dc3545","#fff"],["#28a745","#fff"],["#6f42c1","#fff"],["#fd7e14","#000"],["#20c997","#fff"],["#17a2b8","#fff"],["#6c757d","#fff"],["#343a40","#fff"]];function J(e){const t=R.length;U=e=(e+t)%t,$("#current-schedule-id").text(e+1);const n=R[e];!function(e,t){e.empty(),Q.map(e=>V(e,t)).forEach(t=>{e.append(t).append(" ")});const n=$("<ul>",{class:"list-group"});e.append(n),function(e){const t=e.events.slice(),n=[[]];a.sortEvents(t);let s=t[0].day;return t.forEach(e=>{e.day!==s&&(n.push([]),s=e.day),n[n.length-1].push(e)}),n}(t).forEach(e=>{const t=$("<li>",{class:"list-group-item",css:{"padding-top":"2px","padding-bottom":"2px"},html:$("<small>",{class:"font-weight-bold",text:z[e[0].day]})});n.append(t),e.forEach(e=>{const t=$("<li>",{class:"list-group-item"}),s=o.minutesToTime(e.startMinute),a=e.location||"[unknown]",r=o.minutesToTime(e.endMinute),i=e.group.teachers.join(",")||"[unknown]";t.html(`\n        <div class="d-flex w-100 justify-content-between">\n           <small class="text-muted">\n             <i class="far fa-clock"></i>\n             ${s}-${r}\n           </small>\n           <small>\n             <i class="fas fa-map-marker"></i>\n             <span dir="rtl">${a}</span>\n           </small>\n        </div>\n        <div dir="rtl">${o.displayName(e.group)}</div>\n        <div class="d-flex w-100 justify-content-between">\n          <small>\n            <i class="fas fa-chalkboard-teacher"></i>\n            <span dir="rtl">${i}</span>\n          </small>\n          <small class="text-muted">\n            ${C(e.group.course.id)}, group ${e.group.id}\n          </small>\n        </div>\n        `),n.append(t)})})}($("#schedule-contents"),n),c.renderSchedule($("#rendered-schedule")[0],n,function(e){const t=Array.from(e.values()).map(e=>e.id).sort();t.push(0);const n=t.map((e,t)=>[e,B[t]]);return new Map(n)}(f))}let q="",X=!0;const K={earliestStart:{badgeTextFunc:e=>`Earliest start: ${e}`,explanation:"Hour at which the earliest class of the week start",name:"Earliest start"},freeDays:{badgeTextFunc:e=>`${e} free days`,explanation:"Number of days with no classes",name:"Free days"},latestFinish:{badgeTextFunc:e=>`Latest finish: ${e}`,explanation:"Hour at which the latest class of the week finishes",name:"Latest finish"},numRuns:{badgeTextFunc:e=>`${e} runs`,explanation:"Number of adjacent classes in different buildings",name:"Number of runs"}},Q=Object.keys(K);function V(e,t){const n=$("<a>",{class:"badge badge-info",href:"#/",id:`rating-badge-${e}`,text:K[e].badgeTextFunc(t.rating[e]),title:K[e].explanation,click(){!function(e){q===e&&(X=!X),q=e,R.sort((t,n)=>(X?1:-1)*(t.rating[e]-n.rating[e])),J(0),Q.forEach(e=>{$(`#rating-badge-${e}`).replaceWith(V(e,R[0]))})}(e)}});if(q===e){const e=X?"fa-sort-up":"fa-sort-down";n.append(` <i class="fas ${e}"></i>`)}return n}function Y(e){return g.get(e)}function Z(){const e=$("#courses-selectize"),t=[],n=[];m.forEach(e=>{n.push({label:e.name,value:e.name}),e.courses.forEach(n=>{t.push({nicknames:i.default(n),optgroup:e.name,text:`${C(n.id)} - ${n.name}`,value:n.id})})}),e.selectize({optgroups:n,options:t,render:{option(e,t){let n=!1;const s=ee.hideCoursesWithCloseTests?"display: none":"color: red",a=Y(e.value);return a.testDates&&a.testDates.forEach(e=>{h.fitsWithDistance(e,ee.minTestDateDistance)||(n=!0)}),$("<div>",{class:"option",style:n?s:null,text:t(e.text)})[0].outerHTML}},searchField:["text","nicknames"],onItemAdd(t){if(""===t)return;O(Y(Number(t))),e[0].selectize.clear()}})}!function(){const e=$("#rating-limits-form");Q.forEach(t=>{const n=$("<div>",{class:"row"});e.append(n),n.append($("<div>",{class:"col col-form-label",text:K[t].name,title:K[t].explanation})),n.append($("<div>",{class:"col",html:$("<input>",{change:j,class:"form-control",id:`rating-${t}-min`,placeholder:"-∞",type:"number"})})),n.append($("<div>",{class:"col",html:$("<input>",{change:j,class:"form-control",id:`rating-${t}-max`,placeholder:"∞",type:"number"})}))})}();const ee=function(e){let t={catalogUrl:l,customEvents:"",filterSettings:{forbiddenGroups:[],noCollisions:!0,ratingMax:{earliestStart:null,freeDays:null,latestFinish:null,numRuns:null},ratingMin:{earliestStart:null,freeDays:null,latestFinish:null,numRuns:null}},forbiddenGroups:[],hideCoursesWithCloseTests:!1,minTestDateDistance:5,selectedCourses:[]};""!==e&&(t=$.extend(!0,t,JSON.parse(e))),s&&console.info("Loaded settings:",t),$("#catalog-url").val(t.catalogUrl),$("#custom-events-textarea").val(t.customEvents),$("#hide-courses-with-close-tests").prop("checked",t.hideCoursesWithCloseTests),$("#min-test-date-distance-display").text(t.minTestDateDistance),$("#close-test-distance").val(t.minTestDateDistance);{const e=t.filterSettings;n="filter.noCollisions",a=e.noCollisions,document.getElementById(n).checked=a,Q.forEach(t=>{$(`#rating-${t}-min`).val(e.ratingMin[t]),$(`#rating-${t}-max`).val(e.ratingMax[t])})}var n,a;return t}(window.localStorage.getItem("ttime3_settings"));v=new Set(ee.filterSettings.forbiddenGroups),M(),a.loadCatalog(ee.catalogUrl).then(e=>{s&&console.log("Loaded catalog:",e),m=e,g=new Map,m.forEach(e=>{e.courses.forEach(e=>{g.set(e.id,e)})}),function(){const e=$("#catalog");e.empty(),m.forEach(t=>{const n=$("<details>"),s=$("<summary>");s.html(`<strong>${t.name}</strong> `);const a=$("<span>",{class:"badge badge-secondary",text:t.semester});s.append(a),n.append(s),e.append(n);const o=$("<ul>",{class:"course-list"});n.append(o),t.courses.forEach(e=>{const t=$("<button>",{text:"+",click(){O(e)}});D.set(e.id,t);const n=k(e);N.set(e.id,n);const s=$("<li>");s.append(t).append(n),o.append(s)})})}(),ee.selectedCourses.forEach(e=>{try{L(e)}catch(t){console.error(`Failed to add course ${e}:`,t)}}),Z()},e=>{$("#exception-occurred-catalog").show(),console.error("Failed to load catalog:",e)})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=/([0-9]{1,2})\.([0-9]{1,2})\.([0-9]{4})/;function a(e){if(!e)return null;const t=s.exec(e);return null==t?(console.warn("Failed to match date regex with: ",e),null):{day:Number(t[1]),month:Number(t[2]),year:Number(t[3])}}t.parseCheeseFork=function(e){const t={academicPoints:"נקודות",building:"בניין",courseId:"מספר מקצוע",courseName:"שם מקצוע",day:"יום",dayLetters:"אבגדהוש",faculty:"פקולטה",group:"קבוצה",hour:"שעה",lecturer_tutor:"מרצה/מתרגל",moed_a:"מועד א",moed_b:"מועד ב",num:"מס.",room:"חדר",sport:"ספורט",thoseInCharge:"אחראים",type:"סוג"},n=new Map([["הרצאה","lecture"],["תרגול","tutorial"]]),s=new Map;if(!e.startsWith("var courses_from_rishum = "))throw new Error("Not valid cheesefork jsData - lacks expected prefix");return JSON.parse(e.substring("var courses_from_rishum = ".length)).forEach(e=>{const o=e.general[t.faculty];s.has(o)||s.set(o,{courses:[],name:o,semester:"cheesefork-unknown-semester"});const r=s.get(o),i={academicPoints:Number(e.general[t.academicPoints]),faculty:r,groups:[],id:Number(e.general[t.courseId]),lecturerInCharge:e.general[t.thoseInCharge],name:e.general[t.courseName],testDates:[e.general[t.moed_a],e.general[t.moed_b]].map(a).filter(e=>null!=e)},c=new Map,l=new Map;e.schedule.forEach(e=>{const s=e[t.group],a=e[t.num];if(c.has(a)||c.set(a,s),c.get(a)!==s)return;if(!l.has(a)){let s="",r="";o===t.sport?(s="sport",r=e[t.type]):s=n.get(e[t.type])||e[t.type],l.set(a,{course:i,description:r,events:[],id:a,teachers:[],type:s})}const r=l.get(a),u=function(e){return e.split(" - ").map(e=>{const t=e.split(":");let n=60*Number(t[0]);return t.length>1&&(n+=10*Number(t[1])),n})}(e[t.hour]),d={day:t.dayLetters.indexOf(e[t.day]),endMinute:u[1],group:r,location:e[t.building]+" "+e[t.room],startMinute:u[0]};{const n=e[t.lecturer_tutor];n&&!r.teachers.includes(n)&&r.teachers.push(n)}r.events.push(d)}),l.forEach((e,t)=>{i.groups.push(e)}),r.courses.push(i)}),Array.from(s.values())}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=class{constructor(e){this.dates=[];for(const t of e)if(t.testDates)for(const e of t.testDates){const n=new Date(e.year,e.month,e.day);this.dates.push([n,t])}this.dates.sort((e,t)=>e[0].getTime()-t[0].getTime())}hasMinDistance(e){if(this.dates.length<2)return!0;const t=24*e*3600*1e3;for(let e=0;e<this.dates.length-1;e++)if(this.dates[e+1][0].getTime()-this.dates[e][0].getTime()<t)return!1;return!0}fitsWithDistance(e,t){const n=24*t*3600*1e3,s=new Date(e.year,e.month,e.day);for(const e of this.dates)if(Math.abs(s.getTime()-e[0].getTime())<n)return!1;return!0}getDatesAndDistances(){if(0===this.dates.length)return[];const e=[[0,this.dates[0][0],this.dates[0][1]]];for(let t=1;t<this.dates.length;t++){const n=this.dates[t][0].getTime()-this.dates[t-1][0].getTime(),s=Math.ceil(n/864e5);e.push([s,this.dates[t][0],this.dates[t][1]])}return e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){const t=[];if(e.name.includes("חשבון דיפרנציאלי ואינטגרלי")&&t.push("חדוא",'חדו"א'),e.name.includes("מדעי המחשב")&&t.push("מדמח",'מדמ"ח'),e.name.includes("פיסיקה")&&t.push("פיזיקה"),e.name.includes("אנליזה נומרית")&&t.push("נומריזה"),t.push(e.faculty.name),""!==e.lecturerInCharge&&t.push(e.lecturerInCharge),e.groups)for(const n of e.groups)t.push(...n.teachers);return t.join(" ")}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=n(0),a=n(1),o=n(7);function r(e){return Math.min(...e.events.map(e=>e.startMinute))}function i(e){return Math.max(...e.events.map(e=>e.endMinute))}t.renderSchedule=function(e,t,n){e.innerHTML="";const d=r(t),p=100/(i(t)-d);o.default(t.events,s.eventsCollide).forEach(t=>{const s=document.createElement("div"),o=t.obj;s.className="event";const r=n.get(o.group.course.id);s.style.backgroundColor=r[0],s.style.color=r[1],u(s,"%",100/6*(1+o.day+t.layer/t.numLayers),p*(o.startMinute-d),100/6/t.numLayers,p*(o.endMinute-o.startMinute)),function(e,t){e.innerHTML="";const n=document.createElement("span");n.className="course-name",n.innerText=a.displayName(t.group),e.appendChild(n);const s=document.createElement("span");s.className="event-type",s.innerText=t.group.type,e.appendChild(s);const o=document.createElement("div");if(o.className="location",o.innerText=t.location,e.appendChild(o),c){const n=document.createElement("div");n.className="forbid";const s=document.createElement("a");s.innerHTML='<i class="fas fa-ban"></i>',s.href="#/",s.title="Forbid this group",s.onclick=(()=>{$(s).fadeOut(100).fadeIn(100),c(t.group)}),n.appendChild(s),e.appendChild(n)}}(s,o),e.appendChild(s)}),function(e,t){const n=r(t),s=i(t),o=100/(s-n),c=Math.ceil(n/l)*l,d=Math.floor(s/l)*l;for(let t=c;t<=d;t+=l){const s=document.createElement("div");s.className="grid-line",s.innerText=a.minutesToTime(t),u(s,"%",0,o*(t-n),100,o*l),e.appendChild(s)}}(e,t)};let c=null;t.setAddForbiddenGroupCallback=function(e){c=e};const l=30;function u(e,t,n,s,a,o){e.style.left=`${n}${t}`,e.style.top=`${s}${t}`,e.style.width=`${a}${t}`,e.style.height=`${o}${t}`}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=function(e,t){const n=[];let s=e.slice();for(;s.length>0;){let e=new Set([s[0]]),a=!0;for(;a;){a=!1;const n=e;e=new Set,n.forEach(n=>{e.add(n),s.forEach(s=>{t([s,n])&&(e.add(s),a=!0)})}),s=s.filter(t=>!e.has(t))}const o=[];e.forEach(e=>{let n=!1;o.some((s,a)=>!t(s.concat([e]))&&(n=!0,s.push(e),!0)),n||o.push([e])}),o.forEach((e,t)=>{e.forEach(e=>{n.push({obj:e,layer:t,numLayers:o.length})})})}return n}},function(e,t,n){e.exports=function(){return new Worker(n.p+"scheduler_worker.js")}}])});