!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="dist/",r(r.s=1)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=r(3);t.Faculty=class{};t.Group=class{};t.Course=class{};t.AcademicEvent=class{};t.Schedule=class{};t.FilterSettings=class{};function o(e){e.sort((e,t)=>e.day!==t.day?e.day-t.day:e.startMinute-t.startMinute)}function s(e){e.forEach(e=>{e.courses.forEach(t=>{t.faculty=e,t.groups&&t.groups.forEach(e=>{e.course=t,e.events&&e.events.forEach(t=>{t.group=e})})})})}t.DateObj=class{},t.sortEvents=o,t.eventsCollide=function(e){const t=e.slice();o(t);for(let e=0;e<t.length-1;e++)if(t[e].day===t[e+1].day&&t[e+1].startMinute<t[e].endMinute)return!0;return!1},t.loadCatalog=function(e){return new Promise((t,r)=>{const o=new XMLHttpRequest;o.open("GET",e,!0),o.onload=(()=>{if(200===o.status){let u=null;try{if("["===o.responseText[0])u=JSON.parse(o.responseText);else{u=n.parse(o.responseText);for(const t of u)t.semester=n.catalogNameFromUrl(e)}s(u),t(u)}catch(e){r(e)}}else r(Error(o.statusText))}),o.onerror=(()=>{r(Error("Network Error"))}),o.send()})},t.fixRawCatalog=s,t.groupsByType=function(e){const t=new Map;return e.groups?(e.groups.forEach(e=>{t.has(e.type)||t.set(e.type,[]),t.get(e.type).push(e)}),Array.from(t.values())):[]}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=self,o=r(2);n.onmessage=(e=>{if(void 0===e.data.debug)try{const t=o.generateSchedules(e.data.courses,e.data.filterSettings);n.postMessage(t)}catch(e){console.error("Caught exception in worker:",e),n.postMessage(null)}else o.setDebug(e.data.debug)})},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});let n=!1;t.setDebug=function(e){e&&console.info("Called scheduler.setDebug with",e),n=e};const o=r(0),s=r(4),u=r(5);function a(e){return!o.eventsCollide(e.events)}function c(e,t,r){const o=e.filter(t);return n&&console.info(`Filter ${r} removed ${e.length-o.length} schedules`),o}function l(e){return{events:e.reduce((e,t)=>e.concat(t.events),[]),rating:null}}t.generateSchedules=function(e,t){n&&console.time("generateSchedules");const r=Array.from(e).map(e=>(function(e,t){return null==e.groups?(console.warn("Scheduling with groupless course",e),e):(e.groups=e.groups.filter(r=>!t.forbiddenGroups.includes(`${e.id}.${r.id}`)),e)})(e,t)).map(o.groupsByType).reduce((e,t)=>e.concat(t),[]);let i=s.default(...r).map(l);return t.noCollisions&&(i=c(i,a,"noCollisions")),n&&console.info(`${i.length} total schedules`),function(e){for(const t of e)t.rating=u.default(t.events)}(i),i=function(e,t){let r=e.slice();return t.noCollisions&&(r=c(r,a,"noCollisions")),r=function(e,t){return Object.keys(t.ratingMin).forEach(r=>{null==t.ratingMin[r]&&null==t.ratingMax[r]||(e=c(e,e=>!(null!=t.ratingMin[r]&&e.rating[r]<t.ratingMin[r]||null!=t.ratingMax[r]&&e.rating[r]>t.ratingMax[r]),`Rating '${r}'`))}),e}(r,t)}(i,t),n&&console.timeEnd("generateSchedules"),i}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=/([0-9]{1,2})\.([0-9]{1,2})\.([0-9]{4})/;function o(e){if(!e)return null;const t=n.exec(e);return null==t?(console.warn("Failed to match date regex with: ",e),null):{day:Number(t[1]),month:Number(t[2]),year:Number(t[3])}}function s(e){return"Cheesefork "+e.substr(e.lastIndexOf("_")+1,6)}t.parse=function(e){const t={academicPoints:"נקודות",building:"בניין",courseId:"מספר מקצוע",courseName:"שם מקצוע",day:"יום",dayLetters:"אבגדהוש",faculty:"פקולטה",group:"קבוצה",hour:"שעה",lecturer_tutor:"מרצה/מתרגל",moed_a:"מועד א",moed_b:"מועד ב",num:"מס.",room:"חדר",sport:"ספורט",thoseInCharge:"אחראים",type:"סוג"},r=new Map([["הרצאה","lecture"],["תרגול","tutorial"]]),n=new Map;if(!e.startsWith("var courses_from_rishum = "))throw new Error("Not valid cheesefork jsData - lacks expected prefix");return JSON.parse(e.substring("var courses_from_rishum = ".length)).forEach(e=>{const s=e.general[t.faculty];n.has(s)||n.set(s,{courses:[],name:s,semester:"cheesefork-unknown-semester"});const u=n.get(s),a={academicPoints:Number(e.general[t.academicPoints]),faculty:u,groups:[],id:Number(e.general[t.courseId]),lecturerInCharge:e.general[t.thoseInCharge],name:e.general[t.courseName],testDates:[e.general[t.moed_a],e.general[t.moed_b]].map(o).filter(e=>null!=e)},c=new Map,l=new Map;e.schedule.forEach(e=>{const n=e[t.group],o=e[t.num];if(c.has(o)||c.set(o,n),c.get(o)!==n)return;if(!l.has(o)){let n="",u="";s===t.sport?(n="sport",u=e[t.type]):n=r.get(e[t.type])||e[t.type],l.set(o,{course:a,description:u,events:[],id:o,teachers:[],type:n})}const u=l.get(o),i=function(e){return e.split(" - ").map(e=>{const t=e.split(":");let r=60*Number(t[0]);return t.length>1&&(r+=10*Number(t[1])),r})}(e[t.hour]),f={day:t.dayLetters.indexOf(e[t.day]),endMinute:i[1],group:u,location:e[t.building]+" "+e[t.room],startMinute:i[0]};{const r=e[t.lecturer_tutor];r&&!u.teachers.includes(r)&&u.teachers.push(r)}u.events.push(f)}),l.forEach((e,t)=>{a.groups.push(e)}),u.courses.push(a)}),Array.from(n.values())},t.catalogNameFromUrl=s,t.getCatalogs=function(){return new Promise((e,t)=>{const r=new XMLHttpRequest;r.open("GET","https://api.github.com/repos/michael-maltsev/cheese-fork/contents/courses?ref=gh-pages",!0),r.onload=(()=>{if(200===r.status)try{const n=JSON.parse(r.responseText).map(e=>e.download_url).filter(e=>e.endsWith(".min.js")).map(e=>[s(e),e]);e(n)}catch(e){t(e)}else t(Error(`HTTP ${r.status}: ${r.statusText}`))}),r.onerror=(()=>{t(Error("Network Error"))}),r.send()})}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function e(...t){if(0===t.length)return[[]];const r=e(...t.slice(1));return t[0].map(e=>r.map(t=>[e].concat(t))).reduce((e,t)=>e.concat(t))}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=r(0);function o(e){return e.location?e.location.split(" ")[0]:e.location}function s(e){const t=e.slice();let r=0;n.sortEvents(t);for(let e=0;e<t.length-1;e++)if(t[e].day===t[e+1].day&&t[e+1].startMinute===t[e].endMinute){const n=o(t[e]),s=o(t[e+1]);n&&s&&n!==s&&r++}return r}function u(e){const t=[!1,!1,!1,!1,!1];return e.forEach(e=>{t[e.day]=!0}),t.filter(e=>!1===e).length}t.ScheduleRating=class{},t.default=function(e){return{earliestStart:Math.min(...e.map(e=>e.startMinute/60)),freeDays:u(e),latestFinish:Math.max(...e.map(e=>e.endMinute/60)),numRuns:s(e)}}}]);