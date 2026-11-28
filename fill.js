// 수어센터 업무일지 채우기 — 기존 협회 신규 작성 화면의 입력칸만 채웁니다. 등록 버튼은 누르지 않습니다.
(function(){
var F=document.transForm;
var APP=(document.currentScript&&document.currentScript.src)?new URL(document.currentScript.src).origin:"*";
var path=location.pathname,pageKind=/week_form\.php/.test(path)?"week":/edu2_form\.php/.test(path)?"program":/edu_form\.php/.test(path)?"edu":/trans_form\.php/.test(path)?((F&&F.doc_type&&F.doc_type.value==="C")?"counsel":"trans"):"";
var KN={trans:"통역",counsel:"상담",edu:"수어교육",program:"기타프로그램",week:"주간업무일지"},KS={trans:"통역관리",counsel:"상담관리",edu:"수어교육관리",program:"기타프로그램관리",week:"주간업무관리"};
if(!F||!pageKind){alert("기존 통역·상담·수어교육·기타프로그램·주간업무일지의 작성 화면에서 눌러 주세요.");return;}
if((F.trans_seq&&F.trans_seq.value)||(F.edu_seq&&F.edu_seq.value)){alert("이미 등록된 기록 화면입니다. ‘신규등록’ 화면에서 사용하세요.");return;}
var old=document.getElementById("ksl-fill");if(old)old.remove();
var box=document.createElement("div");box.id="ksl-fill";
box.style.cssText="position:fixed;right:14px;bottom:14px;z-index:2147483647;width:360px;max-height:60vh;overflow:auto;background:#fff;color:#172847;border:3px solid #184bad;border-radius:12px;padding:14px;font:14px/1.55 'Malgun Gothic',sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.3);text-align:left";
box.innerHTML="<b style='font-size:16px'>업무일지 채우기</b><p style='margin:6px 0'>앱에서 복사했다면 지금 <b>Ctrl+V</b>를 누르세요.</p><textarea aria-label='붙여넣기' style='width:100%;height:46px;font-size:12px'></textarea><div class='ksl-out'></div><p style='margin:8px 0 0;text-align:right'><button type='button' class='ksl-close'>닫기</button></p>";
document.body.appendChild(box);
var ta=box.querySelector("textarea"),out=box.querySelector(".ksl-out");ta.focus();
box.querySelector(".ksl-close").onclick=function(){box.remove();};
ta.addEventListener("paste",function(e){var t=(e.clipboardData||window.clipboardData).getData("text");e.preventDefault();run(t);});
ta.addEventListener("input",function(){if(ta.value.trim().charAt(0)==="{")run(ta.value);});
function h(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function run(t){
var d;try{d=JSON.parse(t);}catch(x){out.innerHTML="<p style='color:#a02424'>업무일지 앱의 ‘입력값 복사’로 복사한 내용이 아닙니다.</p>";return;}
if(!d||d.k!=="ksl-fill"){out.innerHTML="<p style='color:#a02424'>업무일지 앱에서 복사한 내용이 아닙니다.</p>";return;}
var dk=KN[d.kind]?d.kind:"trans",isEduK=dk==="edu"||dk==="program";
if(dk!==pageKind){out.innerHTML="<p style='color:#a02424'><b>"+KN[dk]+" 기록입니다.</b> "+KS[dk]+"의 "+(dk==="week"?"작성":"신규 작성")+" 화면을 열고 다시 눌러 주세요.</p>";return;}
if(dk==="week"){var rd=F.report_dt?F.report_dt.value:"";if(rd!==d.date){out.innerHTML="<p style='color:#a02424'><b>다른 주의 화면입니다.</b> 이 화면은 "+h(rd||"날짜 없음")+", 복사한 일지는 "+h(d.date)+"(월) 주입니다.</p><p><button type='button' class='ksl-goweek'>"+h(d.date)+" 주 화면으로 이동</button></p><p style='font-size:12px;margin:4px 0 0'>이동한 뒤 ‘업무일지 채우기’를 다시 누르고 Ctrl+V 하세요.</p>";box.querySelector(".ksl-goweek").onclick=function(){location.href="week_form.php?doc_type=C&report_dt="+encodeURIComponent(d.date);};return;}}
var P=dk==="counsel"?"상담":"수어통역",N=dk==="counsel"?"상담":"통역",PS=dk==="counsel"?"상담사":"수어통역사";
var done=[],warn=[],todo=[];
function mark(el){el.style.background="#fff3b0";el.style.outline="2px solid #e0a73a";}
function text(name,val,label,max){var el=F.elements[name];if(!el){warn.push(label+": 입력칸을 찾지 못함");return;}if(val==null||val===""){return;}
 if(el.value&&el.value!==val&&(name==="translater_nm"||name==="teacher_nm"))warn.push((name==="teacher_nm"?"강사명":PS)+": 화면의 ‘"+el.value+"’을 ‘"+val+"’로 바꿈");
 if(max&&val.length>max)warn.push(label+": "+max+"자 제한보다 깁니다 ("+val.length+"자). 줄여 주세요.");
 el.value=val;mark(el);done.push(label);}
function pick(name,label,val,map){var els=F.querySelectorAll("[name='"+name+"']"),hit=null;for(var i=0;i<els.length;i++){var lt=lab(els[i]);if(lt===val)hit=els[i];}
 if(!val){return;}if(!hit){warn.push(label+": ‘"+val+"’ 선택지를 찾지 못함");return;}hit.checked=true;mark(hit.parentNode||hit);try{hit.dispatchEvent(new Event("change",{bubbles:true}));}catch(x){}done.push(label);}
function lab(el){var n=el.nextSibling,s="";while(n&&!(n.nodeType===1&&n.tagName==="INPUT")){s+=n.textContent||"";n=n.nextSibling;if(s.trim().length>10)break;}return s.replace(/\s+/g," ").trim();}
if(dk==="week"){
var DN="월화수목금토일",changed=[];
for(var wi=0;wi<7;wi++){var wel=F.elements["etc_content_"+(wi+1)],wv=(d.days&&d.days[wi])||"";if(!wel){warn.push(DN.charAt(wi)+"요일 기타: 입력칸을 찾지 못함");continue;}if(!wv)continue;
 var wcur=wel.value.replace(/\s+$/,"");if(wcur&&wcur!==wv)changed.push(DN.charAt(wi));wel.value=wv;mark(wel);done.push(DN.charAt(wi)+"요일 기타");}
if(changed.length)warn.push("이미 적혀 있던 "+changed.join("·")+"요일 기타 내용을 앱 내용으로 바꿨습니다. 확인하세요.");
var tcn=0;for(var tj=1;tj<=7;tj++){var tel=F.elements["trans_content_"+tj];if(tel&&tel.value.trim())tcn++;}
todo.push(tcn?"통역및상담 칸은 협회 시스템이 채운 그대로 두었습니다. 빠진 건이 없는지 확인하세요.":"통역및상담 칸이 비어 있습니다. 이 주의 통역·상담을 먼저 등록했는지 확인하세요.");
d.client="";d.deafNames="";d.hearingNames="";
}else if(isEduK){
text("teacher_nm",d.interpreter,"강사명",20);text("aid_teacher_nm",d.aidTeacher,"보조강사명",40);text("lecture_nm",d.program,dk==="edu"?"강좌명":"프로그램명",40);text("location_grp_nm",d.group,"단체명",40);
var me=/^(\d{4})-(\d{2})-(\d{2})$/.exec(d.date||"");
if(me&&F.edu_dt){var de=new Date(+me[1],+me[2]-1,+me[3]),ve=null;try{ve=window.jQuery&&jQuery.datepicker?jQuery.datepicker.formatDate(jQuery.datepicker._defaults.dateFormat||"yy-mm-dd",de):null;}catch(x){ve=null;}if(!ve)ve=d.date;F.edu_dt.value=ve;mark(F.edu_dt);done.push("날짜");}
var se=(d.start||"").split(":"),ee=(d.end||"").split(":");
if(se.length===2&&ee.length===2){F.start_time_1.value=se[0];F.start_time_2.value=se[1];F.end_time_1.value=ee[0];F.end_time_2.value=ee[1];[F.start_time_1,F.start_time_2,F.end_time_1,F.end_time_2].forEach(mark);done.push("시작·종료 시각");
 if(typeof window.chk_time==="function"){window.chk_time();var gm=+((F.elements.edu_duration||{}).value)||0;if(d.total!=null&&gm!==d.total)warn.push("총 시간이 앱 계산("+d.total+"분)과 화면("+gm+"분)이 다릅니다.");else done.push("총 시간(자동 계산)");}
 else todo.push("총 시간이 계산되지 않았습니다. 시각 칸을 한 번 눌렀다가 나오세요.");}
text("edu_place",d.place,dk==="edu"?"교육장소":"장소",70);
if(dk==="program")pick("etc_type","구분",d.etcType);
text("edu_content",d.content,KN[dk]+"내용");
text("evaluation",d.result,"평가");
d.client="";d.deafNames="";d.hearingNames=d.students||"";
}else{
text("translater_nm",d.interpreter,PS,20);
var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(d.date||"");
if(m&&F.trans_dt){var dt=new Date(+m[1],+m[2]-1,+m[3]),v;
 try{v=window.jQuery&&jQuery.datepicker?jQuery.datepicker.formatDate("yy-mm-dd-DD ",dt,jQuery.datepicker._defaults):null;}catch(x){v=null;}
 if(!v)v=d.date+"-"+"일월화수목금토".charAt(dt.getDay())+" ";
 F.trans_dt.value=v;mark(F.trans_dt);done.push(P+"일");}
var st=(d.start||"").split(":"),en=(d.end||"").split(":");
if(st.length===2&&en.length===2){F.start_time_1.value=st[0];F.start_time_2.value=st[1];F.end_time_1.value=en[0];F.end_time_2.value=en[1];
 [F.start_time_1,F.start_time_2,F.end_time_1,F.end_time_2].forEach(mark);done.push("시작·종료 시각");
 if(typeof window.chk_time==="function"){window.chk_time();
  var got=[1,2,3,4].map(function(i){return +(F.elements["trans_duration_"+i]||{}).value||0;});
  if(d.bands&&got.join()!==d.bands.join())warn.push("시간대별 분이 앱 계산("+d.bands.join("·")+")과 화면("+got.join("·")+")이 다릅니다.");
  else done.push("시간대별 분(자동 계산)");}
 else todo.push("시간대별 분이 계산되지 않았습니다. 시각 칸을 한 번 눌렀다가 나오세요.");}
text("trans_place",d.place,P+"장소",40);
text("program_nm",d.program,"프로그램명");
pick("trans_support_type","분류",d.division);
pick("req_type","의뢰방법",d.request);
if(d.kind==="counsel"&&d.consultType)pick("job_yn","상담구분",d.consultType);
var boxes=F.querySelectorAll("[name='person_type[]']");if(boxes.length&&d.targets){var hits=0;for(var i=0;i<boxes.length;i++){var on=d.targets.indexOf(lab(boxes[i]))>=0;boxes[i].checked=on;if(on){mark(boxes[i].parentNode||boxes[i]);hits++;}}
 if(hits!==d.targets.length)warn.push(N+"대상 일부를 찾지 못함");else done.push(N+"대상");}
pick("trans_type",N+"방법",d.method);
pick("content_type",N+"영역",d.area);
text("trans_content",d.content,P+"내용");
text("trans_result",d.result,"결과",200);
}
var html="<p style='margin:8px 0;color:#11634d'><b>"+done.length+"개 항목을 채웠습니다.</b> 노란 칸을 확인하세요.</p>";
if(warn.length)html+="<div style='background:#fff3d9;color:#674207;padding:8px;border-radius:8px;margin:6px 0'>"+warn.map(h).join("<br>")+"</div>";
html+="<p style='margin:8px 0 4px'><b>직접 할 일</b></p><ol style='margin:0;padding-left:20px'>";
if(F.req_name&&!F.req_name.value){html+="<li>의뢰인 선택: <button type='button' class='ksl-client'>‘"+h(d.client)+"’ 검색 창 열기</button></li>";}
var dn=(d.deafNames||"").split(/[,，]/).map(function(s){return s.trim();}).filter(Boolean),hn=(d.hearingNames||"").split(/[,，]/).map(function(s){return s.trim();}).filter(Boolean);
if(dn.length)html+="<li>참석인원(농인) 선택: "+dn.map(function(n,i){return "<button type='button' class='ksl-person' data-kind='deaf' data-name='"+h(n)+"'>"+h(n)+"</button>";}).join(" ")+"</li>";
if(hn.length)html+="<li>"+(dk==="edu"?"수강인원":dk==="program"?"프로그램실인원":"참석인원(청인)")+" 선택: "+hn.map(function(n){return "<button type='button' class='ksl-person' data-kind='hearing' data-name='"+h(n)+"'>"+h(n)+"</button>";}).join(" ")+"</li>";
todo.forEach(function(x){html+="<li>"+h(x)+"</li>";});
var linked=false;try{linked=!!(window.opener&&!window.opener.closed);}catch(x){linked=false;}
html+="<li>내용을 확인한 뒤 화면 아래 <b>등록</b>을 직접 누르세요.</li>"+(linked?"<li>등록되면 앱에 <b>입력 완료</b>가 자동으로 표시됩니다.</li>":"<li>앱으로 돌아가 <b>등록 완료로 표시</b>를 누르세요. (앱의 ‘등록 화면 열기’로 연 화면이면 자동으로 표시됩니다.)</li>")+"</ol>";
window.__kslFillId=d.id;window.__kslFillKind=dk;
if(!F.__kslHooked){F.__kslHooked=true;
 var notify=function(){var id=window.__kslFillId;if(!id||window.__kslNotified===id)return;window.__kslNotified=id;try{if(window.opener&&!window.opener.closed)window.opener.postMessage({k:"ksl-registered",id:id,kind:window.__kslFillKind},APP);}catch(x){}};
 var nativeSubmit=F.submit;F.submit=function(){notify();return nativeSubmit.call(F);};
 F.addEventListener("submit",function(e){setTimeout(function(){if(!e.defaultPrevented)notify();},0);});}
out.innerHTML=html;ta.value="";ta.style.display="none";box.querySelector("p").style.display="none";
if(dk==="week"&&!(F.modify&&F.modify.value)&&window.fetch){var wend=new Date(d.date+"T00:00:00Z");wend.setUTCDate(wend.getUTCDate()+6);wend=wend.toISOString().slice(0,10);
 fetch("week_list.php?doc_type=C",{credentials:"same-origin"}).then(function(r){return r.text();}).then(function(t){
  var re=/week_detail\('(\d+)'\)[^>]*>\s*([\d-]{10})/g,mm,hits=[];while((mm=re.exec(t))){if(mm[2]>=d.date&&mm[2]<=wend)hits.push(mm);}
  if(!hits.length)return;var dv=document.createElement("div");dv.style.cssText="background:#fde8e8;color:#8a1f1f;padding:8px;border-radius:8px;margin:8px 0";
  dv.innerHTML="<b>이 주의 주간업무일지가 이미 등록되어 있습니다.</b> 새로 등록하면 두 건이 됩니다. 기존 일지를 열어 고치려면: "+hits.map(function(x){return "<a href='week_form.php?modify="+x[1]+"&doc_type=C&page=1'>"+h(x[2])+" 일지 열기</a>";}).join(" ")+"<br><span style='font-size:12px'>연 뒤 ‘업무일지 채우기’를 다시 누르고 Ctrl+V 하세요.</span>";
  out.insertBefore(dv,out.firstChild);}).catch(function(){});}
var cb=box.querySelector(".ksl-client");if(cb)cb.onclick=function(){openPop("pop_deaf_list.php?person_type=&search_type=name&search="+encodeURIComponent(d.client||""),"target_member_detail");};
Array.prototype.forEach.call(box.querySelectorAll(".ksl-person"),function(b){b.onclick=function(){
 var deaf=b.getAttribute("data-kind")==="deaf",nm=deaf?"reqPersonNm[]":"visitPersonNm[]",rows=document.getElementsByName(nm),idx=-1;
 for(var i=0;i<rows.length;i++)if(!rows[i].value){idx=i;break;}
 if(idx<0){if(deaf&&typeof window.addReqPerson==="function")window.addReqPerson();else if(!deaf&&typeof window.addVisitPerson==="function")window.addVisitPerson();idx=document.getElementsByName(nm).length-1;}
 openPop((deaf?"pop_deaf_list.php":"pop_target_list.php")+"?mode=sel_name&idx="+idx+"&search_type=name&search="+encodeURIComponent(b.getAttribute("data-name")),"target_member_detail");};});
function openPop(u,n){if(typeof window.openWindow==="function")window.openWindow(u,n,"1","620","600");else window.open(u,n,"width=620,height=600,scrollbars=yes");}
}
})();
