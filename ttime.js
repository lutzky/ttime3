!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.ttime=t():e.ttime=t()}(self,(function(){return(()=>{"use strict";var e={903:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.getCatalogs=t.catalogNameFromUrl=t.parse=t.parseCheeseForkTestDate=void 0;const n=/([0-9]{1,2})\.([0-9]{1,2})\.([0-9]{4})/;function s(e){if(!e)return null;const t=n.exec(e);if(null==t)return console.warn("Failed to match date regex with: ",e),null;const s=Number(t[3]),a=Number(t[2]),o=Number(t[1]);return new Date(s,a-1,o)}function a(e){const t=e.substr(e.lastIndexOf("_")+1,6),n=Number(t.slice(0,4)),s=Number(t.slice(4));let a;return a=1===s?`${n}/${String(n+1).slice(2)}`:`${n+1}`,`${{1:"Winter",2:"Spring",3:"Summer"}[s]} ${a} (CheeseFork)`}t.parseCheeseForkTestDate=s,t.parse=function(e){const t="var courses_from_rishum = ",n={academicPoints:"נקודות",building:"בניין",courseId:"מספר מקצוע",courseName:"שם מקצוע",day:"יום",dayLetters:"אבגדהוש",faculty:"פקולטה",group:"קבוצה",hour:"שעה",lecturer_tutor:"מרצה/מתרגל",moed_a:"מועד א",moed_b:"מועד ב",notes:"הערות",num:"מס.",room:"חדר",sport:"ספורט",thoseInCharge:"אחראים",type:"סוג"},a=new Map([["הרצאה","lecture"],["תרגול","tutorial"]]),o=new Map;if(!e.startsWith(t))throw new Error("Not valid cheesefork jsData - lacks expected prefix");return JSON.parse(e.substring(t.length)).forEach((e=>{const t=e.general[n.faculty];o.has(t)||o.set(t,{courses:[],name:t,semester:"cheesefork-unknown-semester"});const r=o.get(t),i={academicPoints:Number(e.general[n.academicPoints]),faculty:r,groups:[],id:Number(e.general[n.courseId]),lecturerInCharge:e.general[n.thoseInCharge],name:e.general[n.courseName],notes:e.general[n.notes],testDates:[e.general[n.moed_a],e.general[n.moed_b]].map(s).filter((e=>null!=e))},l=new Map,c=new Map;e.schedule.forEach((e=>{const s=e[n.group],o=e[n.num];if(l.has(o)||l.set(o,s),l.get(o)!==s)return;if(!c.has(o)){let s="",r="";t===n.sport?(s="sport",r=e[n.type]):s=a.get(e[n.type])||e[n.type],c.set(o,{course:i,description:r,events:[],id:o,teachers:[],type:s})}const r=c.get(o),d=e[n.hour].split(" - ").map((e=>{const t=e.split(":");let n=60*Number(t[0]);return t.length>1&&(n+=10*Number(t[1])),n})),u={day:n.dayLetters.indexOf(e[n.day]),endMinute:d[1],group:r,location:e[n.building]+" "+e[n.room],startMinute:d[0]};{const t=e[n.lecturer_tutor];t&&!r.teachers.includes(t)&&r.teachers.push(t)}r.events.push(u)})),c.forEach(((e,t)=>{i.groups.push(e)})),r.courses.push(i)})),Array.from(o.values())},t.catalogNameFromUrl=a,t.getCatalogs=function(e){return new Promise(((t,n)=>{const s=new XMLHttpRequest;s.open("GET","https://api.github.com/repos/michael-maltsev/cheese-fork/contents/courses?ref=gh-pages",!0),e&&(console.info("Using API token"),s.setRequestHeader("Authorization","Basic "+btoa("lutzky:"+e))),s.onload=()=>{if(200===s.status){if(e)for(const e of["X-RateLimit-Limit","X-RateLimit-Remaining"])console.info(`${e}: ${s.getResponseHeader(e)}`);try{const e=JSON.parse(s.responseText).map((e=>e.download_url)).filter((e=>e.endsWith(".min.js"))).map((e=>[a(e),e])).sort(((e,t)=>e[1]<t[1]?-1:1));t(e)}catch(e){n(e)}}else n(Error(`HTTP ${s.status}: ${s.statusText}`))},s.onerror=()=>{n(Error("Network Error"))},s.send()}))}},200:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.groupsByType=t.fixRawCatalog=t.loadCatalog=t.eventsCollide=t.sortEvents=t.FilterSettings=t.Schedule=t.AcademicEvent=t.Course=t.Group=t.Faculty=void 0;const s=n(903);function a(e){e.sort(((e,t)=>e.day!==t.day?e.day-t.day:e.startMinute-t.startMinute))}function o(e){return e instanceof Date?e:new Date(e.year,e.month-1,e.day)}function r(e){e.forEach((e=>{e.courses.forEach((t=>{t.faculty=e,t.testDates&&(t.testDates=t.testDates.map(o)),t.groups&&t.groups.forEach((e=>{e.course=t,e.events&&e.events.forEach((t=>{t.group=e}))}))}))}))}t.Faculty=class{},t.Group=class{},t.Course=class{},t.AcademicEvent=class{},t.Schedule=class{},t.FilterSettings=class{},t.sortEvents=a,t.eventsCollide=function(e){const t=e.slice();a(t);for(let e=0;e<t.length-1;e++)if(t[e].day===t[e+1].day&&t[e+1].startMinute<t[e].endMinute)return!0;return!1},t.loadCatalog=function(e){return new Promise(((t,n)=>{const a=new XMLHttpRequest;a.open("GET",e,!0),a.onload=()=>{if(200===a.status){let o=null;try{if("["===a.responseText[0])o=JSON.parse(a.responseText);else{o=s.parse(a.responseText);for(const t of o)t.semester=s.catalogNameFromUrl(e)}r(o),t(o)}catch(e){n(e)}}else n(Error(a.statusText))},a.onerror=()=>{n(Error("Network Error"))},a.send()}))},t.fixRawCatalog=r,t.groupsByType=function(e){const t=new Map;return e.groups?(e.groups.forEach((e=>{t.has(e.type)||t.set(e.type,[]),t.get(e.type).push(e)})),Array.from(t.values())):[]}},228:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=class{constructor(e){this.dates=[];for(const t of e)if(t.testDates)for(const e of t.testDates)this.dates.push([e,t]);this.dates.sort(((e,t)=>e[0].getTime()-t[0].getTime()))}hasMinDistance(e){if(this.dates.length<2)return!0;const t=24*e*3600*1e3;for(let e=0;e<this.dates.length-1;e++)if(this.dates[e+1][0].getTime()-this.dates[e][0].getTime()<t)return!1;return!0}fitsWithDistance(e,t){const n=24*t*3600*1e3;for(const t of this.dates)if(Math.abs(e.getTime()-t[0].getTime())<n)return!1;return!0}getDatesAndDistances(){if(0===this.dates.length)return[];const e=[[0,this.dates[0][0],this.dates[0][1]]];for(let t=1;t<this.dates.length;t++){const n=this.dates[t][0].getTime()-this.dates[t-1][0].getTime(),s=Math.ceil(n/864e5);e.push([s,this.dates[t][0],this.dates[t][1]])}return e}}},471:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.displayName=t.minutesToTime=void 0,t.minutesToTime=function(e){return Math.floor(e/60).toString().padStart(2,"0")+":"+(e%60).toString().padStart(2,"0")},t.displayName=function(e){return e.description||e.course.name}},482:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){const n=[];let s=e.slice();for(;s.length>0;){let e=new Set([s[0]]),a=!0;for(;a;){a=!1;const n=e;e=new Set,n.forEach((n=>{e.add(n),s.forEach((s=>{t([s,n])&&(e.add(s),a=!0)}))})),s=s.filter((t=>!e.has(t)))}const o=[];e.forEach((e=>{let n=!1;o.some(((s,a)=>!t(s.concat([e]))&&(n=!0,s.push(e),!0))),n||o.push([e])})),o.forEach(((e,t)=>{e.forEach((e=>{n.push({obj:e,layer:t,numLayers:o.length})}))}))}return n}},522:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){const t=[];if(e.name.includes("חשבון דיפרנציאלי ואינטגרלי")&&t.push("חדוא",'חדו"א'),e.name.includes("מדעי המחשב")&&t.push("מדמח",'מדמ"ח'),e.name.includes("פיסיקה")&&t.push("פיזיקה"),e.name.includes("אנליזה נומרית")&&t.push("נומריזה"),t.push(e.faculty.name),""!==e.lecturerInCharge&&t.push(e.lecturerInCharge),e.groups)for(const n of e.groups)t.push(...n.teachers);return t.join(" ")}},393:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.setAddForbiddenGroupCallback=t.renderSchedule=void 0;const s=n(200),a=n(471),o=n(482);function r(e){return Math.min(...e.events.map((e=>e.startMinute)))}function i(e){return Math.max(...e.events.map((e=>e.endMinute)))}t.renderSchedule=function(e,t,n){e.innerHTML="";const u=r(t),p=100/(i(t)-u);o.default(t.events,s.eventsCollide).forEach((t=>{const s=document.createElement("div"),o=t.obj;s.className="event";const r=n.get(o.group.course.id);s.style.backgroundColor=r[0],s.style.color=r[1],d(s,"%",100/6*(1+o.day+t.layer/t.numLayers),p*(o.startMinute-u),100/6/t.numLayers,p*(o.endMinute-o.startMinute)),function(e,t){e.innerHTML="";const n=document.createElement("span");n.className="course-name",n.innerText=a.displayName(t.group),e.appendChild(n);const s=document.createElement("span");s.className="event-type",s.innerText=t.group.type,e.appendChild(s);const o=document.createElement("div");if(o.className="location",o.innerText=t.location,e.appendChild(o),l){const n=document.createElement("div");n.className="forbid";const s=document.createElement("a");s.innerHTML='<i class="fas fa-ban"></i>',s.href="#/",s.title="Forbid this group",s.onclick=()=>{$(s).fadeOut(100).fadeIn(100),l(t.group)},n.appendChild(s),e.appendChild(n)}}(s,o),e.appendChild(s)})),function(e,t){const n=r(t),s=i(t),o=100/(s-n),l=Math.ceil(n/c)*c,u=Math.floor(s/c)*c;for(let t=l;t<=u;t+=c){const s=document.createElement("div");s.className="grid-line",s.innerText=a.minutesToTime(t),d(s,"%",0,o*(t-n),100,o*c),e.appendChild(s)}}(e,t)};let l=null;t.setAddForbiddenGroupCallback=function(e){l=e};const c=30;function d(e,t,n,s,a,o){e.style.left=`${n}${t}`,e.style.top=`${s}${t}`,e.style.width=`${a}${t}`,e.style.height=`${o}${t}`}},581:(e,t,n)=>{function s(){return new Worker(n.p+"ttime.worker.js")}n.r(t),n.d(t,{default:()=>s})}},t={};function n(s){var a=t[s];if(void 0!==a)return a.exports;var o=t[s]={exports:{}};return e[s](o,o.exports,n),o.exports}n.d=(e,t)=>{for(var s in t)n.o(t,s)&&!n.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;n.g.importScripts&&(e=n.g.location+"");var t=n.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var s=t.getElementsByTagName("script");s.length&&(e=s[s.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),n.p=e})();var s={};return(()=>{var e=s;Object.defineProperty(e,"__esModule",{value:!0});let t=!1;new URL(window.location.href).searchParams.get("ttime_debug")&&(t=!0);const a=n(200),o=n(471),r=n(903),i=n(228),l=n(522),c=n(393);function d(e){$("#catalog-url").val(e),u()}function u(){I()}window.setCatalogUrl=d,window.catalogUrlChanged=u;const p=r.getCatalogs("");p.then((e=>{for(const[t,n]of e.slice().reverse())$("#cheesefork-catalog-selectors").append($("<a>",{class:"dropdown-item",click:()=>d(n),href:"#/",text:t}))}));const f=new Set;let h=new i.default([]),m=null,g=null;function b(e){e.data("groupID")||console.info("Error: No groupID for",e),e.text(e.data("forbidden")?"[unforbid]":"[forbid]")}let y=new Set;function v(e){return`${e.course.id}.${e.id}`}function w(e){y.add(v(e)),I(),E()}function x(e){y.delete(v(e)),I(),E()}function T(e){return y.has(v(e))}function E(){const e=$("#forbidden-groups");B(),e.empty(),0===y.size&&e.html('<small class="text-muted">[empty]</small>'),y.forEach((t=>{const n=$("<li>");n.text(t+" "),n.addClass("list-group-item");const s=$("<a>",{href:"#/",text:"[unforbid]",click(){y.delete(t),I(),E()}});n.append(s),e.append(n)})),$("a.forbid-all-lecture").each(((e,t)=>{N(t,"lecture")})),$("a.forbid-all-tutorial").each(((e,t)=>{N(t,"tutorial")})),$("a.forbid-link").each(((e,t)=>{const n=$(t),s=n.data("groupID"),a=y.has(s);n.data("forbidden",a),b(n)}))}function C(e){return String(e).padStart(6,"0")}c.setAddForbiddenGroupCallback(w);const S='<i class="fas fa-info-circle"></i>';function M(e){return`<span dir="rtl">${e}</span>`}function k(e){const n=document.createElement("span"),s=document.createElement("a");return s.innerHTML=S,s.className="expando",s.href="#/",n.innerHTML=` ${C(e.id)} ${M(e.name)} `,s.onclick=()=>{if($(n).data("ttime3_expanded"))s.innerHTML=S,$(n).data("ttime3_expanded",!1),n.removeChild($(n).data("infoDiv"));else{const a=document.createElement("div");$(n).data("infoDiv",a),a.appendChild(function(e){const t=$("<span>"),n=$("<ul>");n.append($("<li>",{html:`<b>Full name</b> ${C(e.id)} ${e.name}`})),n.append($("<li>",{html:`<b>Academic points:</b> ${e.academicPoints}`})),n.append($("<li>",{html:`<b>Lecturer in charge:</b> ${M(e.lecturerInCharge||"[unknown]")}`})),n.append($("<li>",{html:"<b>Test dates:</b>"}));const s=$("<ul>");if(e.testDates?e.testDates.forEach((e=>{s.append($("<li>",{text:e.toDateString()}))})):s.append($("<li>",{text:"[unknown]"})),n.append(s),e.notes){const t=$("<li>");t.append("<b>Notes:</b> "),t.append($("<div>",{class:"rtlnotes",html:e.notes.replace(/\n/g,"<br>")})),n.append(t)}n.append($("<li>",{html:"<b>Groups:</b>"}));const a=$("<ul>");return e.groups?e.groups.forEach((e=>{a.append(function(e){const t=$("<li>");let n=`Group ${e.id} (${e.type}) `;e.teachers.length>0&&(n+=`(${e.teachers.join(", ")}) `);const s=$("<b>",{text:n});t.append(s);const a=$("<a>",{class:"forbid-link",data:{forbidden:T(e),groupID:v(e)},href:"#/"});return b(a),a.on("click",(()=>{a.data("forbidden")?x(e):w(e)})),t.append(a),t}(e)[0]);const t=$("<ul>");e.events?e.events.forEach((e=>{t.append($("<li>",{text:`${q[e.day]}, `+o.minutesToTime(e.startMinute)+"-"+o.minutesToTime(e.endMinute)+` at ${e.location||"[unknown]"}`}))})):t.append($("<li>",{text:"[unknown]"})),a.append(t)})):a.append($("<li>",{text:"[unknown]"})),n.append(a),t.append(n),t[0]}(e)),t&&console.info(e),n.appendChild(a),s.innerHTML='<i class="fas fa-minus-circle"></i>',$(n).data("ttime3_expanded",!0)}},n.appendChild(s),n}function D(e,t){const n=e.groups.filter((e=>e.type===t));if(0===n.length)return void console.info(`No ${t} groups for course ${e.id}`);const s=n.filter(T);if(n.length===s.length)for(const e of s)x(e);else{const e=n.filter((e=>!T(e)));for(const t of e)w(t)}}function N(e,t){const n=ne(parseInt(e.dataset.courseId,10)).groups.filter((e=>e.type===t)),s=n.filter(T),a=`forbid-all-${t}`;switch(s.length){case n.length:e.className=`${a} badge badge-danger`,e.title=`All ${t} groups forbidden`;break;case 0:e.className=`${a} badge badge-success`,e.title=`All ${t} groups allowed`;break;default:e.className=`${a} badge badge-warning`,e.title=`Some ${t} groups forbidden`}}const _=new Map,F=new Map;function j(){B(),I()}function I(){se.selectedCourses=Array.from(f).map((e=>e.id)),se.customEvents=$("#custom-events-textarea").val(),se.catalogUrl=$("#catalog-url").val(),se.hideCoursesWithCloseTests=$("#hide-courses-with-close-tests").prop("checked"),se.minTestDateDistance=L($("#close-test-distance")[0],5),$("#min-test-date-distance-display").text(se.minTestDateDistance),A(),se.filterSettings={forbiddenGroups:Array.from(y),noCollisions:("filter.noCollisions",document.getElementById("filter.noCollisions").checked),ratingMax:{earliestStart:null,freeDays:null,latestFinish:null,numRuns:null},ratingMin:{earliestStart:null,freeDays:null,latestFinish:null,numRuns:null}},ee.forEach((e=>{se.filterSettings.ratingMin[e]=L($(`#rating-${e}-min`)[0],null),se.filterSettings.ratingMax[e]=L($(`#rating-${e}-max`)[0],null)})),window.localStorage.setItem("ttime3_settings",JSON.stringify(se)),window.gtag("event",se.catalogUrl,{event_category:"saveSettings",event_label:"catalog-url"}),window.gtag("event",se.filterSettings.noCollisions,{event_category:"saveSettings",event_label:"no-collisions"}),t&&console.info("Saved settings:",se)}function L(e,t){return""===e.value?t:Number(e.value)}function O(e){t&&console.info("Selected",e),window.gtag("event",`${e.id}`,{event_category:"SelectCourses",event_label:"addCourse"}),f.add(e),_.get(e.id).disabled=!0,F.get(e.id).classList.add("disabled-course-label"),I(),H(),A()}function P(...e){e.forEach((e=>{const t=ne(e);if(!t)throw new Error("No course with ID "+e);O(t)}))}function A(){h=new i.default(Array.from(f));const e=$("#courses-selectize")[0].selectize;e&&e.clearCache(),$("#how-to-show-close-test-courses").html(se.hideCoursesWithCloseTests?"hidden":'shown in <span style="color: red">red</span>');const t=$("<ul>",{class:"list-group"});$("#test-schedule").empty(),$("#test-schedule").append(t);const n=h.getDatesAndDistances();for(let e=0;e<n.length;e++){const[s,a,o]=n[e];let r="";e>0&&(r=`${s}d`,s<se.minTestDateDistance&&(r=`<span style="color: red; font-weight: bold">${s}d</span>`),r+=" &rarr;"),t.append($("<li>",{class:"list-group-item",html:`${r} ${a.toDateString()} - ${o.name}`}))}}function H(){const e=Number((n=f,Array.from(n.values()).map((e=>a.groupsByType(e).map((e=>e.length)).reduce(((e,t)=>e*t),1))).reduce(((e,t)=>e*t),1)));var n;$("#possible-schedules").text(`${e.toLocaleString()} (${e.toExponential(2)})`),$("#generate-schedules").prop("disabled",0===f.size);const s=$("#selected-courses");s.empty();const o=$("<ul>",{class:"list-group"});s.append(o),f.forEach((e=>{const n=$("<li>",{class:"list-group-item"}),s=k(e),a=$("<button>",{class:"btn btn-sm btn-danger float-right",html:'<i class="fas fa-trash-alt"></i>',click(){!function(e){t&&console.info("Unselected",e),window.gtag("event",`${e.id}`,{event_category:"SelectCourses",event_label:"delCourse"}),f.delete(e),_.get(e.id).disabled=!1,F.get(e.id).classList.remove("disabled-course-label"),I(),H(),A()}(e)}});n.append(s),null!==e.groups&&0!==e.groups.length||n.append($("<i>",{class:"text-warning fas fa-exclamation-triangle",title:"Course has no groups"}));const r=document.createElement("a");r.innerHTML="L",r.href="#/",r.dataset.courseId=`${e.id}`,r.onclick=()=>D(e,"lecture"),N(r,"lecture"),n.append(r);const i=document.createElement("a");i.innerHTML="T",i.href="#/",i.dataset.courseId=`${e.id}`,i.onclick=()=>D(e,"tutorial"),N(i,"tutorial"),n.append(i),n.append(a),o.append(n)}))}window.saveSettings=I,window.addSelectedCourseByID=P;const R=new(n(581).default);R.postMessage({debug:t}),R.onmessage=e=>{t&&console.info("Received message from worker:",e),$("#generate-schedules").prop("disabled",!1),$("#spinner").hide(),null==e.data?$("#exception-occurred-scheduling").show():function(e){J=e,X=0;const t=$("#schedule-browser, #rendered-schedule-container");$("#num-schedules").text(e.length),0===e.length||1===e.length&&0===e[0].events.length?(t.hide(),$("#no-schedules").show()):(t.show(),Q(0))}(e.data)},window.checkCustomEvents=function(){const e=$("#custom-events-textarea");e.removeClass("is-invalid"),e.removeClass("is-valid");try{G(e.val()).length>0&&e.addClass("is-valid")}catch(t){e.addClass("is-invalid")}};const U=new RegExp([/(Sun|Mon|Tue|Wed|Thu|Fri|Sat) /,/([0-9]{2}):([0-9]{2})-([0-9]{2}):([0-9]{2}) /,/(.*)/].map((e=>e.source)).join("")),W={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};function G(e){const t=[];return""===e||e.split("\n").forEach((e=>{const n=U.exec(e);if(null==n)throw Error("Invalid custom event line: "+e);const s=W[n[1]],a=Number(60*Number(n[2])+Number(n[3])),o=Number(60*Number(n[4])+Number(n[5])),r=n[6];t.push(function(e,t,n,s){const a={academicPoints:0,groups:[],id:0,lecturerInCharge:"",name:e,notes:"",testDates:[]},o={course:a,description:"",events:[],id:0,teachers:[],type:"lecture"};a.groups.push(o);const r={day:t,endMinute:s,group:o,location:"",startMinute:n};return o.events.push(r),a}(r,s,a,o))})),t}let z=!1;function B(){z&&($(".toast").toast("show"),$("#generate-schedules").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100),z=!1)}window.getSchedules=function(){$(".toast").toast("hide"),z=!1,$("#generate-schedules").prop("disabled",!0),z=!0,$("#spinner").show(),$("#exception-occurred").hide(),$("#no-schedules").hide(),$("#initial-instructions").hide(),window.gtag("event","generateSchedules"),window.gtag("event","generateSchedules-num-courses",{value:f.size});const e=new Set(f);try{G(se.customEvents).forEach((t=>e.add(t)))}catch(e){console.error("Failed to build custom events course:",e)}R.postMessage({courses:e,filterSettings:se.filterSettings})};let J=[],X=0;window.nextSchedule=function(){Q(X+1)},window.prevSchedule=function(){Q(X-1)};const q=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],K=[["#007bff","#fff"],["#e83e8c","#fff"],["#ffc107","#000"],["#6610f2","#fff"],["#dc3545","#fff"],["#28a745","#fff"],["#6f42c1","#fff"],["#fd7e14","#000"],["#20c997","#fff"],["#17a2b8","#fff"],["#6c757d","#fff"],["#343a40","#fff"]];function Q(e){const t=J.length;X=e=(e+t)%t,$("#current-schedule-id").text(e+1);const n=J[e];!function(e,t){e.empty(),ee.map((e=>te(e,t))).forEach((t=>{e.append(t).append(" ")}));const n=$("<ul>",{class:"list-group"});e.append(n),function(e){const t=e.events.slice(),n=[[]];a.sortEvents(t);let s=t[0].day;return t.forEach((e=>{e.day!==s&&(n.push([]),s=e.day),n[n.length-1].push(e)})),n}(t).forEach((e=>{const t=$("<li>",{class:"list-group-item",css:{"padding-top":"2px","padding-bottom":"2px"},html:$("<small>",{class:"font-weight-bold",text:q[e[0].day]})});n.append(t),e.forEach((e=>{const t=$("<li>",{class:"list-group-item"}),s=o.minutesToTime(e.startMinute),a=e.location||"[unknown]",r=o.minutesToTime(e.endMinute),i=e.group.teachers.join(",")||"[unknown]";t.html(`\n        <div class="d-flex w-100 justify-content-between">\n           <small class="text-muted">\n             <i class="far fa-clock"></i>\n             ${s}-${r}\n           </small>\n           <small>\n             <i class="fas fa-map-marker"></i>\n             <span dir="rtl">${a}</span>\n           </small>\n        </div>\n        <div dir="rtl">${o.displayName(e.group)}</div>\n        <div class="d-flex w-100 justify-content-between">\n          <small>\n            <i class="fas fa-chalkboard-teacher"></i>\n            <span dir="rtl">${i}</span>\n          </small>\n          <small class="text-muted">\n            ${C(e.group.course.id)}, group ${e.group.id}\n          </small>\n        </div>\n        `),n.append(t)}))}))}($("#schedule-contents"),n),c.renderSchedule($("#rendered-schedule")[0],n,function(e){const t=Array.from(e.values()).map((e=>e.id)).sort();t.push(0);const n=t.map(((e,t)=>[e,K[t]]));return new Map(n)}(f))}let V="",Y=!0;const Z={earliestStart:{badgeTextFunc:e=>`Earliest start: ${e}`,explanation:"Hour at which the earliest class of the week start",name:"Earliest start"},freeDays:{badgeTextFunc:e=>`${e} free days`,explanation:"Number of days with no classes",name:"Free days"},latestFinish:{badgeTextFunc:e=>`Latest finish: ${e}`,explanation:"Hour at which the latest class of the week finishes",name:"Latest finish"},numRuns:{badgeTextFunc:e=>`${e} runs`,explanation:"Number of adjacent classes in different buildings",name:"Number of runs"}},ee=Object.keys(Z);function te(e,t){const n=$("<a>",{class:"badge badge-info",href:"#/",id:`rating-badge-${e}`,text:Z[e].badgeTextFunc(t.rating[e]),title:Z[e].explanation,click(){!function(e){V===e&&(Y=!Y),V=e,J.sort(((t,n)=>(Y?1:-1)*(t.rating[e]-n.rating[e]))),Q(0),ee.forEach((e=>{$(`#rating-badge-${e}`).replaceWith(te(e,J[0]))}))}(e)}});if(V===e){const e=Y?"fa-sort-up":"fa-sort-down";n.append(` <i class="fas ${e}"></i>`)}return n}function ne(e){return g.get(e)}!function(){const e=$("#rating-limits-form");ee.forEach((t=>{const n=$("<div>",{class:"row"});e.append(n),n.append($("<div>",{class:"col col-form-label",text:Z[t].name,title:Z[t].explanation})),n.append($("<div>",{class:"col",html:$("<input>",{change:j,class:"form-control",id:`rating-${t}-min`,placeholder:"-∞",type:"number"})})),n.append($("<div>",{class:"col",html:$("<input>",{change:j,class:"form-control",id:`rating-${t}-max`,placeholder:"∞",type:"number"})}))}))}();const se=function(e){let n={catalogUrl:"",customEvents:"",filterSettings:{forbiddenGroups:[],noCollisions:!0,ratingMax:{earliestStart:null,freeDays:null,latestFinish:null,numRuns:null},ratingMin:{earliestStart:null,freeDays:null,latestFinish:null,numRuns:null}},forbiddenGroups:[],hideCoursesWithCloseTests:!1,minTestDateDistance:5,selectedCourses:[]};""!==e&&(n=$.extend(!0,n,JSON.parse(e))),t&&console.info("Loaded settings:",n),$("#catalog-url").val(n.catalogUrl),$("#custom-events-textarea").val(n.customEvents),$("#hide-courses-with-close-tests").prop("checked",n.hideCoursesWithCloseTests),$("#min-test-date-distance-display").text(n.minTestDateDistance),$("#close-test-distance").val(n.minTestDateDistance);{const e=n.filterSettings;"filter.noCollisions",s=e.noCollisions,document.getElementById("filter.noCollisions").checked=s,ee.forEach((t=>{$(`#rating-${t}-min`).val(e.ratingMin[t]),$(`#rating-${t}-max`).val(e.ratingMax[t])}))}var s;return n}(window.localStorage.getItem("ttime3_settings"));se.catalogUrl&&($("#old-catalog-alert-url").text(se.catalogUrl),$("#old-catalog-alert").collapse("show")),y=new Set(se.filterSettings.forbiddenGroups),E(),async function(){try{const e=p.then((e=>e[e.length-1][1])),n=await a.loadCatalog(se.catalogUrl||await e);t&&console.log("Loaded catalog:",n),m=n,g=new Map,m.forEach((e=>{e.courses.forEach((e=>{g.set(e.id,e)}))})),function(){const e=$("#catalog");e.empty(),m.forEach((t=>{const n=$("<details>"),s=$("<summary>");s.html(`<strong>${t.name}</strong> `);const a=$("<span>",{class:"badge badge-secondary",text:t.semester});s.append(a),n.append(s),e.append(n);const o=$("<ul>",{class:"course-list"});n.append(o),t.courses.forEach((e=>{const t=$("<button>",{text:"+",click(){O(e)}});_.set(e.id,t);const n=k(e);F.set(e.id,n);const s=$("<li>");s.append(t).append(n),o.append(s)}))}))}(),se.selectedCourses.forEach((e=>{try{P(e)}catch(t){console.error(`Failed to add course ${e}:`,t)}})),$("#selected-courses-semester-indicator").text(m[0].semester),function(){const e=$("#courses-selectize"),t=[],n=[];m.forEach((e=>{n.push({label:e.name,value:e.name}),e.courses.forEach((n=>{t.push({nicknames:l.default(n),optgroup:e.name,text:`${C(n.id)} - ${n.name}`,value:n.id})}))})),e.selectize({optgroups:n,options:t,render:{option(e,t){let n=!1;const s=se.hideCoursesWithCloseTests?"display: none":"color: red",a=ne(e.value);return a.testDates&&a.testDates.forEach((e=>{h.fitsWithDistance(e,se.minTestDateDistance)||(n=!0)})),$("<div>",{class:"option",style:n?s:null,text:t(e.text)})[0].outerHTML}},searchField:["text","nicknames"],onItemAdd(t){""!==t&&(O(ne(Number(t))),e[0].selectize.clear())}})}()}catch(e){$("#exception-occurred-catalog").show(),console.error("Failed to load catalog:",e)}}(),z=!0})(),s})()}));