{
const tiles=[["I","y"],["you","y"],["want","g"],["need","g"],["go","g"],["help","g"],["more","bl"],["all done","bl"],["water","o"],["outside","o"],["please","pk"],["thank you","pk"]];
const roadmap=[["Scaffolding","Done"],["Speak loop","Done"],["Saving data","Done"],["Word and phrase bank","Next"],["History","Planned"],["Audit log","Planned"],["Caregiver mode, more users","Planned"],["Switch Control, Guided Access","Planned"],["Mac app","Planned"],["Typing help, predictions","Planned"]];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const wave='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4"/></svg>';
let recent=["Can I have a snack?","I'm tired","Thank you"];
const road=document.getElementById("roadmap");
if(road)road.innerHTML=roadmap.map((r,i)=>`<li class="${r[1]==="Done"?"done":""}"><span class="n">${i}</span><span>${esc(r[0])}</span><small>${esc(r[1])}</small></li>`).join("");
const demos=[...document.querySelectorAll("[data-demo]")];
demos.forEach((d,k)=>{
  d.innerHTML=`<div class="screen">
    <div class="sbar"><span>9:41</span><b>VoiceMe</b><span>100%</span></div>
    <div class="msg"><label class="sr" for="m${k}">Message</label><input id="m${k}" value="I want go outside" autocomplete="off"><button class="speak" type="button">${wave}<span>Speak</span></button></div>
    <div class="ctl"><button type="button" data-a="undo">Undo word</button><button type="button" data-a="clear">Clear</button><span aria-live="polite"></span></div>
    <div class="board">${tiles.map(t=>`<button type="button" class="tile ${t[1]}">${esc(t[0])}</button>`).join("")}</div>
    <div class="recent"></div></div>`;
  const inp=d.querySelector("input"),sp=d.querySelector(".speak"),st=d.querySelector(".ctl span"),rc=d.querySelector(".recent");
  const say=()=>{
    const text=inp.value.trim();if(!text){st.textContent="Type or tap something first";return}
    recent=[text,...recent.filter(r=>r!==text)].slice(0,4);demos.forEach(x=>x.redraw&&x.redraw());
    try{
      const s=window.speechSynthesis;if(!s)throw 0;
      s.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.95;
      u.onstart=()=>sp.classList.add("on");u.onend=u.onerror=()=>sp.classList.remove("on");
      s.speak(u);st.textContent="Speaking…";setTimeout(()=>{if(st.textContent==="Speaking…")st.textContent=""},2500);
    }catch(e){st.textContent="Your browser can't speak here. The app speaks on iPad."}
  };
  const drawRecent=()=>{rc.innerHTML='<b>Recent</b>'+recent.map(r=>`<button type="button">${esc(r)}</button>`).join("");rc.querySelectorAll("button").forEach(b=>b.onclick=()=>{inp.value=b.textContent;say()})};
  d.redraw=drawRecent;
  d.querySelectorAll(".tile").forEach(t=>t.onclick=()=>{inp.value=(inp.value.trim()+" "+t.textContent).trim();inp.focus()});
  sp.onclick=say;
  inp.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();say()}});
  d.querySelector('[data-a="clear"]').onclick=()=>{inp.value="";st.textContent="";inp.focus()};
  d.querySelector('[data-a="undo"]').onclick=()=>{inp.value=inp.value.trim().split(/\s+/).slice(0,-1).join(" ");inp.focus()};
  drawRecent();
});
}
