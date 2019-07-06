!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="dist/",n(n.s=1)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(3);t.Faculty=class{};t.Group=class{};t.Course=class{};t.AcademicEvent=class{};t.Schedule=class{};t.FilterSettings=class{};function o(e){e.sort((e,t)=>e.day!==t.day?e.day-t.day:e.startMinute-t.startMinute)}function s(e){e.forEach(e=>{e.courses.forEach(t=>{t.faculty=e,t.groups&&t.groups.forEach(e=>{e.course=t,e.events&&e.events.forEach(t=>{t.group=e})})})})}t.DateObj=class{},t.toDate=function(e){return new Date(e.year,e.month-1,e.day)},t.sortEvents=o,t.eventsCollide=function(e){const t=e.slice();o(t);for(let e=0;e<t.length-1;e++)if(t[e].day===t[e+1].day&&t[e+1].startMinute<t[e].endMinute)return!0;return!1},t.loadCatalog=function(e){return new Promise((t,n)=>{const o=new XMLHttpRequest;o.open("GET",e,!0),o.onload=(()=>{if(200===o.status){let u=null;try{if("["===o.responseText[0])u=JSON.parse(o.responseText);else{u=r.parse(o.responseText);for(const t of u)t.semester=r.catalogNameFromUrl(e)}s(u),t(u)}catch(e){n(e)}}else n(Error(o.statusText))}),o.onerror=(()=>{n(Error("Network Error"))}),o.send()})},t.fixRawCatalog=s,t.groupsByType=function(e){const t=new Map;return e.groups?(e.groups.forEach(e=>{t.has(e.type)||t.set(e.type,[]),t.get(e.type).push(e)}),Array.from(t.values())):[]}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=self,o=n(2);r.onmessage=(e=>{if(void 0===e.data.debug)try{const t=o.generateSchedules(e.data.courses,e.data.filterSettings);r.postMessage(t)}catch(e){console.error("Caught exception in worker:",e),r.postMessage(null)}else o.setDebug(e.data.debug)})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});let r=!1;t.setDebug=function(e){e&&console.info("Called scheduler.setDebug with",e),r=e};const o=n(0),s=n(4),u=n(5);function a(e){return!o.eventsCollide(e.events)}function c(e,t,n){const o=e.filter(t);return r&&console.info(`Filter ${n} removed ${e.length-o.length} schedules`),o}function i(e){return{events:e.reduce((e,t)=>e.concat(t.events),[]),rating:null}}t.generateSchedules=function(e,t){r&&console.time("generateSchedules");const n=Array.from(e).map(e=>(function(e,t){return null==e.groups?(console.warn("Scheduling with groupless course",e),e):(e.groups=e.groups.filter(n=>!t.forbiddenGroups.includes(`${e.id}.${n.id}`)),e)})(e,t)).map(o.groupsByType).reduce((e,t)=>e.concat(t),[]);let l=s.default(...n).map(i);return t.noCollisions&&(l=c(l,a,"noCollisions")),r&&console.info(`${l.length} total schedules`),function(e){for(const t of e)t.rating=u.default(t.events)}(l),l=function(e,t){let n=e.slice();return t.noCollisions&&(n=c(n,a,"noCollisions")),n=function(e,t){return Object.keys(t.ratingMin).forEach(n=>{null==t.ratingMin[n]&&null==t.ratingMax[n]||(e=c(e,e=>!(null!=t.ratingMin[n]&&e.rating[n]<t.ratingMin[n]||null!=t.ratingMax[n]&&e.rating[n]>t.ratingMax[n]),`Rating '${n}'`))}),e}(n,t)}(l,t),r&&console.timeEnd("generateSchedules"),l}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=/([0-9]{1,2})\.([0-9]{1,2})\.([0-9]{4})/;function o(e){if(!e)return null;const t=r.exec(e);return null==t?(console.warn("Failed to match date regex with: ",e),null):{day:Number(t[1]),month:Number(t[2]),year:Number(t[3])}}function s(e){const t=e.substr(e.lastIndexOf("_")+1,6),n=Number(t.slice(0,4)),r=Number(t.slice(4));let o;return o=1===r?`${n}/${String(n+1).slice(2)}`:`${n+1}`,`${{1:"Winter",2:"Spring",3:"Summer"}[r]} ${o} (CheeseFork)`}t.parse=function(e){const t={academicPoints:"נקודות",building:"בניין",courseId:"מספר מקצוע",courseName:"שם מקצוע",day:"יום",dayLetters:"אבגדהוש",faculty:"פקולטה",group:"קבוצה",hour:"שעה",lecturer_tutor:"מרצה/מתרגל",moed_a:"מועד א",moed_b:"מועד ב",num:"מס.",room:"חדר",sport:"ספורט",thoseInCharge:"אחראים",type:"סוג"},n=new Map([["הרצאה","lecture"],["תרגול","tutorial"]]),r=new Map;if(!e.startsWith("var courses_from_rishum = "))throw new Error("Not valid cheesefork jsData - lacks expected prefix");return JSON.parse(e.substring("var courses_from_rishum = ".length)).forEach(e=>{const s=e.general[t.faculty];r.has(s)||r.set(s,{courses:[],name:s,semester:"cheesefork-unknown-semester"});const u=r.get(s),a={academicPoints:Number(e.general[t.academicPoints]),faculty:u,groups:[],id:Number(e.general[t.courseId]),lecturerInCharge:e.general[t.thoseInCharge],name:e.general[t.courseName],testDates:[e.general[t.moed_a],e.general[t.moed_b]].map(o).filter(e=>null!=e)},c=new Map,i=new Map;e.schedule.forEach(e=>{const r=e[t.group],o=e[t.num];if(c.has(o)||c.set(o,r),c.get(o)!==r)return;if(!i.has(o)){let r="",u="";s===t.sport?(r="sport",u=e[t.type]):r=n.get(e[t.type])||e[t.type],i.set(o,{course:a,description:u,events:[],id:o,teachers:[],type:r})}const u=i.get(o),l=function(e){return e.split(" - ").map(e=>{const t=e.split(":");let n=60*Number(t[0]);return t.length>1&&(n+=10*Number(t[1])),n})}(e[t.hour]),f={day:t.dayLetters.indexOf(e[t.day]),endMinute:l[1],group:u,location:e[t.building]+" "+e[t.room],startMinute:l[0]};{const n=e[t.lecturer_tutor];n&&!u.teachers.includes(n)&&u.teachers.push(n)}u.events.push(f)}),i.forEach((e,t)=>{a.groups.push(e)}),u.courses.push(a)}),Array.from(r.values())},t.catalogNameFromUrl=s,t.getCatalogs=function(e){return new Promise((t,n)=>{const r=new XMLHttpRequest;r.open("GET","https://api.github.com/repos/michael-maltsev/cheese-fork/contents/courses?ref=gh-pages",!0),e&&(console.info("Using API token"),r.setRequestHeader("Authorization","Basic "+btoa("lutzky:"+e))),r.onload=(()=>{if(200===r.status){if(e)for(const e of["X-RateLimit-Limit","X-RateLimit-Remaining"])console.info(`${e}: ${r.getResponseHeader(e)}`);try{const e=JSON.parse(r.responseText).map(e=>e.download_url).filter(e=>e.endsWith(".min.js")).map(e=>[s(e),e]).sort((e,t)=>e[1]<t[1]?-1:1);t(e)}catch(e){n(e)}}else n(Error(`HTTP ${r.status}: ${r.statusText}`))}),r.onerror=(()=>{n(Error("Network Error"))}),r.send()})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function e(...t){if(0===t.length)return[[]];const n=e(...t.slice(1));return t[0].map(e=>n.map(t=>[e].concat(t))).reduce((e,t)=>e.concat(t))}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(0);function o(e){return e.location?e.location.split(" ")[0]:e.location}function s(e){const t=e.slice();let n=0;r.sortEvents(t);for(let e=0;e<t.length-1;e++)if(t[e].day===t[e+1].day&&t[e+1].startMinute===t[e].endMinute){const r=o(t[e]),s=o(t[e+1]);r&&s&&r!==s&&n++}return n}function u(e){const t=[!1,!1,!1,!1,!1];return e.forEach(e=>{t[e.day]=!0}),t.filter(e=>!1===e).length}t.ScheduleRating=class{},t.default=function(e){return{earliestStart:Math.min(...e.map(e=>e.startMinute/60)),freeDays:u(e),latestFinish:Math.max(...e.map(e=>e.endMinute/60)),numRuns:s(e)}}}]);