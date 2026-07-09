/* Upstream — AI Integration "clear the desk" hero.
   Vanilla, no deps. Honours prefers-reduced-motion; touch + auto-wipe fallbacks. */
(function(){
  const desk=document.getElementById('ai-desk');
  if(!desk) return;
  const clutterEl=document.getElementById('aiClutter'),
        reveal=document.getElementById('aiReveal'),
        hint=document.getElementById('aiHint');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ST='#d8cfbf', LN='#3a3a3e', TX='#aa9f90', FT='#cabfae', GRID='#ddd4c4',
        CLAY='#A57663', CLAYS='rgba(165,118,99,.16)', SAGE='#8ea27f';
  const TONES=['#fcfbf7','#f7f3eb','#f2ecde','#faf6ee','#efe8d9'];
  function paper(w,h){ return `
    <rect x="1" y="2" width="${w-2}" height="${h-2}" rx="3" fill="#e9e0d0"/>
    <rect x="1" y="0" width="${w-2}" height="${h-3}" rx="3" fill="__P__" stroke="${ST}" stroke-width="1"/>`; }

  const PAPERS=[
    {w:152, vb:[152,190], svg:`${paper(152,190)}
      <rect x="16" y="16" width="30" height="9" rx="1.5" fill="${CLAY}"/>
      <path d="M104 17h32M104 23h32M104 29h20" stroke="${FT}" stroke-width="2" stroke-linecap="round"/>
      <path d="M16 44h46" stroke="${LN}" stroke-width="3.5" stroke-linecap="round"/>
      <rect x="16" y="56" width="120" height="13" fill="${CLAYS}"/>
      <g stroke="${TX}" stroke-width="2" stroke-linecap="round"><path d="M20 78h58"/><path d="M20 93h48"/><path d="M20 108h62"/><path d="M20 123h40"/></g>
      <g stroke="${LN}" stroke-width="2" stroke-linecap="round" opacity=".5"><path d="M110 78h22"/><path d="M114 93h18"/><path d="M108 108h24"/><path d="M116 123h16"/></g>
      <path d="M16 138h120" stroke="${LN}" stroke-width="1"/>
      <path d="M86 150h20" stroke="${TX}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M114 150h22" stroke="${CLAY}" stroke-width="4" stroke-linecap="round"/>
      <g stroke="${FT}" stroke-width="1.5" stroke-linecap="round"><path d="M16 170h78"/><path d="M16 178h56"/></g>`},
    {w:172, vb:[172,150], svg:`${paper(172,150)}
      <rect x="10" y="12" width="152" height="13" fill="rgba(58,58,62,.08)"/>
      <g stroke="${GRID}" stroke-width="1"><path d="M10 25h152M10 38h152M10 51h152M10 64h152M10 77h152M10 90h96M10 103h96M10 116h96"/><path d="M42 12v104M74 12v104M106 12v78M138 12v25"/></g>
      <g stroke="${TX}" stroke-width="2" stroke-linecap="round" opacity=".7"><path d="M16 19h18"/><path d="M50 19h14"/><path d="M82 19h16"/><path d="M114 32h16"/><path d="M18 45h14"/><path d="M50 58h16"/><path d="M18 71h18"/><path d="M50 84h12"/></g>
      <g stroke="${LN}" stroke-width="1"><path d="M112 132V96h48"/></g>
      <rect x="116" y="118" width="7" height="14" fill="${SAGE}"/><rect x="126" y="110" width="7" height="22" fill="${CLAY}"/><rect x="136" y="122" width="7" height="10" fill="${TX}"/><rect x="146" y="104" width="7" height="28" fill="${CLAY}"/>`},
    {w:158, vb:[158,196], svg:`${paper(158,196)}
      <path d="M16 20h64" stroke="${LN}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M16 30h40" stroke="${FT}" stroke-width="2" stroke-linecap="round"/>
      <g stroke="${TX}" stroke-width="2" stroke-linecap="round"><path d="M16 52h58"/><path d="M16 61h58"/><path d="M16 70h52"/><path d="M16 79h58"/><path d="M16 88h44"/><path d="M16 97h58"/><path d="M16 106h50"/></g>
      <g stroke="${TX}" stroke-width="2" stroke-linecap="round"><path d="M84 52h58"/><path d="M84 61h58"/><path d="M84 70h48"/></g>
      <circle cx="112" cy="120" r="26" fill="#efe7d7" stroke="${LN}" stroke-width="1.2"/>
      <path d="M112 120V94a26 26 0 0 1 22 38z" fill="${CLAY}"/>
      <path d="M112 120l22 12a26 26 0 0 1-40-6z" fill="${SAGE}"/>
      <g stroke="${FT}" stroke-width="1.5" stroke-linecap="round"><path d="M16 162h126M16 172h96M16 182h110"/></g>`},
    {w:150, vb:[150,192], svg:`${paper(150,192)}
      <path d="M16 20h52" stroke="${LN}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M16 40h26" stroke="${TX}" stroke-width="2" stroke-linecap="round"/>
      <rect x="16" y="46" width="118" height="15" rx="2" fill="none" stroke="${ST}" stroke-width="1.3"/>
      <path d="M16 72h30" stroke="${TX}" stroke-width="2" stroke-linecap="round"/>
      <rect x="16" y="78" width="118" height="15" rx="2" fill="none" stroke="${ST}" stroke-width="1.3"/>
      <rect x="16" y="104" width="12" height="12" rx="2" fill="none" stroke="${LN}" stroke-width="1.4"/>
      <path d="M18 110l3 3 5-6" stroke="${CLAY}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M34 110h60" stroke="${TX}" stroke-width="2" stroke-linecap="round"/>
      <rect x="16" y="124" width="12" height="12" rx="2" fill="none" stroke="${LN}" stroke-width="1.4"/>
      <path d="M34 130h48" stroke="${TX}" stroke-width="2" stroke-linecap="round"/>
      <path d="M16 168h70" stroke="${LN}" stroke-width="1"/>
      <path d="M20 164c8-8 14 2 22-4" stroke="${CLAY}" stroke-width="1.6" fill="none"/>`},
    {w:148, vb:[148,186], svg:`${paper(148,186)}
      <path d="M16 20h40" stroke="${LN}" stroke-width="3" stroke-linecap="round"/>
      <path d="M14 30h120" stroke="${LN}" stroke-width="1"/>
      <g stroke="${TX}" stroke-width="2" stroke-linecap="round"><path d="M18 44h54"/><path d="M18 58h60"/><path d="M18 72h48"/><path d="M18 86h58"/><path d="M18 100h50"/><path d="M18 114h60"/><path d="M18 128h44"/></g>
      <g stroke="${LN}" stroke-width="2" stroke-linecap="round" opacity=".55"><path d="M104 44h26"/><path d="M108 58h22"/><path d="M100 72h30"/><path d="M110 86h20"/><path d="M104 100h26"/><path d="M112 114h18"/><path d="M100 128h30"/></g>
      <path d="M14 142h120" stroke="${LN}" stroke-width="1"/>
      <path d="M100 154h30" stroke="${CLAY}" stroke-width="3.5" stroke-linecap="round"/>
      <g stroke="${GRID}" stroke-width="1"><path d="M94 34v120"/></g>`},
    {w:150, vb:[150,188], svg:`${paper(150,188)}
      <rect x="16" y="16" width="118" height="4" fill="${CLAY}"/>
      <path d="M16 30h40" stroke="${LN}" stroke-width="3" stroke-linecap="round"/>
      <path d="M100 30h34" stroke="${FT}" stroke-width="2" stroke-linecap="round"/>
      <g stroke="${TX}" stroke-width="2" stroke-linecap="round"><path d="M16 54h118"/><path d="M16 63h118"/><path d="M16 72h96"/><path d="M16 81h118"/><path d="M16 90h108"/><path d="M16 108h118"/><path d="M16 117h118"/><path d="M16 126h84"/><path d="M16 135h118"/><path d="M16 144h100"/><path d="M16 153h70"/></g>`},
    {w:146, vb:[146,182], svg:`${paper(146,182)}
      <path d="M30 8V174" stroke="${CLAY}" stroke-width="1.2" opacity=".7"/>
      <g stroke="${GRID}" stroke-width="1"><path d="M10 40h126M10 62h126M10 84h126M10 106h126M10 128h126M10 150h126"/></g>
      <g stroke="#4a4a52" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"><path d="M38 36c10-6 16 4 26-1s16 3 28-2 20 2 30-2"/><path d="M38 58c14-5 20 3 34-2s22 4 40-2"/><path d="M38 80c10-4 18 3 30-1s18 2 26-1"/><path d="M38 102c16-5 26 3 42-2s20 3 34-1"/><path d="M38 124c12-4 18 3 30-2"/></g>`},
    {w:180, vb:[180,150], svg:`
      <path d="M28 40l14-10h30l6 8" fill="#f3ede0" stroke="${ST}" stroke-width="1"/>
      <rect x="52" y="24" width="96" height="70" rx="2" fill="#fbfaf6" stroke="${ST}" stroke-width="1" transform="rotate(6 100 60)"/>
      <g stroke="${TX}" stroke-width="2" stroke-linecap="round" transform="rotate(6 100 60)"><path d="M64 40h60"/><path d="M64 50h48"/><path d="M64 60h56"/></g>
      <path d="M14 44h44l10-12h44a4 4 0 0 1 4 4v78a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V48a4 4 0 0 1 4-4z" fill="__P__" stroke="${LN}" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M14 58h98" stroke="${CLAY}" stroke-width="1.6" opacity=".8"/>`},
    {w:150, vb:[150,190], svg:`${paper(150,190)}
      <rect x="10" y="0" width="8" height="190" fill="${CLAY}" opacity=".85"/>
      <rect x="30" y="30" width="100" height="46" fill="none" stroke="${LN}" stroke-width="1.4"/>
      <path d="M40 48h80M40 58h60" stroke="${LN}" stroke-width="3" stroke-linecap="round"/>
      <path d="M30 108h100M30 120h100M30 132h74M30 144h100M30 156h88" stroke="${FT}" stroke-width="2" stroke-linecap="round"/>`},
    {w:112, vb:[112,110], svg:`
      <path d="M6 4h100v76l-24 26H6z" fill="__P__" stroke="${ST}" stroke-width="1" stroke-linejoin="round"/>
      <path d="M82 106V80h24" fill="#e7ddca" stroke="${ST}" stroke-width="1" stroke-linejoin="round"/>
      <g stroke="#4a4a52" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".75"><path d="M20 30c12-5 20 3 34-2s18 3 30-1"/><path d="M20 50c14-4 22 3 40-2"/><path d="M20 68c10-3 16 3 26-1"/></g>`},
    {w:78, vb:[78,180], svg:`
      <path d="M8 4h62v168l-8-5-8 5-8-5-8 5-8-5-8 5-6-4z" fill="__P__" stroke="${ST}" stroke-width="1" stroke-linejoin="round"/>
      <path d="M18 20h42" stroke="${LN}" stroke-width="2.5" stroke-linecap="round"/>
      <g stroke="${TX}" stroke-width="1.8" stroke-linecap="round"><path d="M18 38h30"/><path d="M52 38h8"/><path d="M18 50h34"/><path d="M52 50h8"/><path d="M18 62h26"/><path d="M52 62h8"/><path d="M18 74h32"/><path d="M52 74h8"/></g>
      <path d="M16 92h46" stroke="${LN}" stroke-width="1"/>
      <path d="M18 104h20" stroke="${CLAY}" stroke-width="3" stroke-linecap="round"/><path d="M50 104h10" stroke="${CLAY}" stroke-width="3" stroke-linecap="round"/>`},
  ];
  const PHONE={w:82, vb:[82,150], svg:`
    <rect x="6" y="4" width="70" height="142" rx="12" fill="#26262b" stroke="#000" stroke-width="1.2"/>
    <rect x="12" y="18" width="58" height="112" rx="3" fill="#efe7d7"/>
    <rect x="18" y="26" width="46" height="16" rx="3" fill="#fff" stroke="${ST}" stroke-width="1"/>
    <rect x="18" y="48" width="46" height="16" rx="3" fill="#fff" stroke="${ST}" stroke-width="1"/>
    <rect x="18" y="70" width="46" height="16" rx="3" fill="#fff" stroke="${ST}" stroke-width="1"/>
    <g stroke="${TX}" stroke-width="1.6" stroke-linecap="round"><path d="M23 34h30"/><path d="M23 56h30"/><path d="M23 78h22"/></g>
    <circle cx="41" cy="139" r="3" fill="none" stroke="#555" stroke-width="1.2"/>`};

  let items=[], cleared=0, total=0, wiping=false, autoTimer=null;
  const R=195, REVEAL_AT=0.52, AUTO_WIPE_MS=3200;
  const rand=(a,b)=>a+Math.random()*(b-a), pick=a=>a[(Math.random()*a.length)|0];

  function makeEl(def,scale){
    const el=document.createElement('div'); el.className='ai-item';
    el.style.width=(def.w*scale)+'px';
    const tone=pick(TONES);
    el.innerHTML=`<svg viewBox="0 0 ${def.vb[0]} ${def.vb[1]}" fill="none">${def.svg.replace(/__P__/g,tone)}</svg>`;
    return el;
  }
  function build(){
    clearTimeout(autoTimer); wiping=false;
    clutterEl.innerHTML=''; items=[]; cleared=0;
    reveal.classList.remove('cleared'); hint.classList.remove('hide');
    const w=desk.clientWidth, h=desk.clientHeight, mobile=w<640;
    const cell=mobile?104:132;
    const cols=Math.ceil(w/cell)+1, rows=Math.ceil(h/cell)+1;
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
      const def=pick(PAPERS), scale=rand(0.8,1.2)*(mobile?0.74:1), iw=def.w*scale;
      const el=makeEl(def,scale);
      const x=c*cell+rand(-cell*0.42,cell*0.42)-iw*0.25, y=r*cell+rand(-cell*0.42,cell*0.42)-iw*0.25;
      el.style.left=x+'px'; el.style.top=y+'px';
      const rot=rand(-24,24); el.style.transform=`rotate(${rot}deg)`; el.dataset.rot=rot;
      clutterEl.appendChild(el); items.push({el,x,y});
    }
    const phoneCount=Math.random()<0.5?1:2, chosen=new Set();
    while(chosen.size<phoneCount && chosen.size<items.length) chosen.add((Math.random()*items.length)|0);
    chosen.forEach(i=>{ const o=items[i], scale=rand(0.85,1.15)*(mobile?0.74:1);
      o.el.style.width=(PHONE.w*scale)+'px';
      o.el.innerHTML=`<svg viewBox="0 0 ${PHONE.vb[0]} ${PHONE.vb[1]}" fill="none">${PHONE.svg}</svg>`; });
    total=items.length;
    items.forEach(o=>{ o.cx=o.x+o.el.offsetWidth/2; o.cy=o.y+o.el.offsetHeight/2; });
    if(reduce){ items.forEach(o=>{o.gone=true;o.el.classList.add('gone');}); reveal.classList.add('cleared'); }
    else { autoTimer=setTimeout(waveClear,AUTO_WIPE_MS); }
  }
  function flee(o,fx,fy){
    if(o.gone) return; o.gone=true; o.el.classList.add('gone');
    const dx=o.cx-fx, dy=o.cy-fy, d=Math.hypot(dx,dy)||1, dist=rand(850,1550);
    o.el.style.transform=`translate(${(dx/d)*dist}px,${(dy/d)*dist-150}px) rotate(${rand(-340,340)+(+o.el.dataset.rot)}deg)`;
    cleared++;
    if(cleared===1) hint.classList.add('hide');
    if(!wiping && cleared>=total*REVEAL_AT) waveClear();
  }
  function waveClear(){
    if(wiping) return; wiping=true; clearTimeout(autoTimer);
    hint.classList.add('hide'); reveal.classList.add('cleared');
    items.filter(o=>!o.gone).sort((a,b)=>a.cx-b.cx).forEach((o,i)=>setTimeout(()=>flee(o,o.cx-30,o.cy+60),i*15));
  }
  function sweep(px,py){ for(const o of items){ if(!o.gone && Math.hypot(o.cx-px,o.cy-py)<R) flee(o,px,py); } }
  desk.addEventListener('pointermove',e=>{ const r=desk.getBoundingClientRect(); sweep(e.clientX-r.left,e.clientY-r.top); });
  desk.addEventListener('pointerdown',e=>{ const r=desk.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
    for(const o of items){ if(!o.gone && Math.hypot(o.cx-px,o.cy-py)<R*1.6) flee(o,px,py); } });
  window.addEventListener('DOMContentLoaded',build);
  if(document.readyState!=='loading') build();
})();
