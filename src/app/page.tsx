'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, Download, ImagePlus, Sparkles, Upload, Users, Layers } from 'lucide-react';

type Template={id:string;title:string;kicker:string};
const templates:Template[]=[
 {id:'welcome',title:'RLP युवा साथी स्वागत',kicker:'आपका हार्दिक अभिनंदन'},
 {id:'meeting',title:'जनसभा / कार्यक्रम',kicker:'जनहित की आवाज • आपका स्वागत'}
];

export default function Home(){
 const [selected,setSelected]=useState<Template|null>(null);
 const [name,setName]=useState(''); const [role,setRole]=useState('RLP युवा साथी');
 const [place,setPlace]=useState('ग्राम पंचायत'); const [phone,setPhone]=useState('');
 const [photo,setPhoto]=useState(''); const [leader,setLeader]=useState('');
 const [out,setOut]=useState(''); const [loading,setLoading]=useState(false);
 const canvas=useRef<HTMLCanvasElement>(null);

 const pick=(setter:(v:string)=>void,file?:File)=>{if(!file)return;const r=new FileReader();r.onload=()=>setter(String(r.result));r.readAsDataURL(file)};
 const fit=(ctx:CanvasRenderingContext2D,img:HTMLImageElement,x:number,y:number,w:number,h:number,align='center')=>{
  const s=Math.max(w/img.width,h/img.height),iw=img.width*s,ih=img.height*s;
  const dx=align==='right'?x+w-iw:align==='left'?x:x+(w-iw)/2;
  ctx.drawImage(img,dx,y+(h-ih)/2,iw,ih);
 };
 const text=(ctx:CanvasRenderingContext2D,t:string,x:number,y:number,size:number,color='#fff',align:CanvasTextAlign='left')=>{
  ctx.fillStyle=color;ctx.textAlign=align;ctx.font='900 '+size+'px Arial';ctx.fillText(t,x,y);
 };
 const line=(ctx:CanvasRenderingContext2D,x1:number,y1:number,x2:number,y2:number,color:string,w:number)=>{
  ctx.strokeStyle=color;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
 };
 const drawBrush=(ctx:CanvasRenderingContext2D)=>{
  ctx.save();ctx.globalAlpha=.95;ctx.strokeStyle='#7eb800';ctx.lineCap='square';
  for(let i=0;i<12;i++){ctx.lineWidth=18+i*3;ctx.beginPath();ctx.moveTo(690+i*16,250+i*10);ctx.lineTo(1080,80+i*28);ctx.stroke()}
  ctx.globalAlpha=.22;ctx.strokeStyle='#d9ff37';
  for(let i=0;i<6;i++){ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(630+i*38,175);ctx.lineTo(1080,410+i*30);ctx.stroke()}ctx.restore();
 };
 const generate=()=>{
  if(!selected||!name.trim())return alert('अपना नाम भरें');
  setLoading(true);
  const c=canvas.current!,ctx=c.getContext('2d')!;c.width=1080;c.height=1350;
  // LAYER 1: dark green base
  ctx.fillStyle='#031a0a';ctx.fillRect(0,0,1080,1350);
  ctx.fillStyle='#06240d';ctx.fillRect(0,0,1080,900);
  // LAYER 2: top identity block
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(116,110,82,0,Math.PI*2);ctx.fill();
  ctx.lineWidth=11;ctx.strokeStyle='#e7c51d';ctx.beginPath();ctx.arc(116,110,82,Math.PI*.55,Math.PI*1.55);ctx.stroke();
  ctx.strokeStyle='#3b7c2c';ctx.beginPath();ctx.arc(116,110,82,Math.PI*1.55,Math.PI*2.45);ctx.stroke();
  ctx.fillStyle='#102b15';ctx.fillRect(91,57,50,105);ctx.fillStyle='#fff';ctx.fillRect(101,69,30,78);
  text(ctx,'राष्ट्रीय लोकतांत्रिक पार्टी',210,72,31,'#f2f2e9');text(ctx,'RLP',210,124,52,'#ffd226');
  text(ctx,selected.kicker,210,170,27,'#f2f2e9');
  // LAYER 3: brush background
  drawBrush(ctx);
  // LAYER 4: bold welcome typography on left
  text(ctx,'आपका',42,340,78,'#f5f5ef');
  text(ctx,'हार्दिक',42,450,104,'#ffd326');
  text(ctx,'अभिनंदन',42,540,68,'#f5f5ef');
  line(ctx,42,575,340,575,'#e3bd25',4);ctx.fillStyle='#e3bd25';ctx.beginPath();ctx.arc(350,575,8,0,7);ctx.fill();ctx.beginPath();ctx.arc(375,575,8,0,7);ctx.fill();
  text(ctx,'जय जवान  जय किसान',42,635,30,'#f4f4ed');
  // LAYER 5: leader cutout zone (behind user)
  const drawUser=()=>{
   // LAYER 6: user foreground cutout zone
   const finish=()=>{
    // LAYER 7: name yellow information band
    ctx.fillStyle='#ffd229';ctx.fillRect(0,920,1080,225);
    ctx.fillStyle='#5c2100';ctx.textAlign='center';ctx.font='900 92px Arial';ctx.fillText(name.slice(0,22),540,1040);
    ctx.fillStyle='#173916';ctx.font='900 34px Arial';ctx.fillText(role||'RLP युवा साथी',540,1100);
    line(ctx,52,1118,255,1118,'#20441a',3);line(ctx,825,1118,1028,1118,'#20441a',3);
    // right badge
    ctx.fillStyle='#09290f';ctx.roundRect(730,955,295,145,15);ctx.fill();
    text(ctx,'RLP',878,1004,42,'#ffd229','center');text(ctx,'युवा साथी',878,1055,35,'#eaf1e8','center');
    // LAYER 8: contact strip
    ctx.fillStyle='#f3f2ec';ctx.fillRect(0,1145,1080,105);
    ctx.fillStyle='#21833b';ctx.beginPath();ctx.arc(122,1197,31,0,7);ctx.fill();
    text(ctx,'☎',122,1211,30,'#fff','center');
    text(ctx,phone||'आपका मोबाइल नंबर',540,1218,56,'#17351c','center');
    // LAYER 9: footer party strip
    ctx.fillStyle='#08230d';ctx.fillRect(0,1250,1080,100);
    text(ctx,'राष्ट्रीय लोकतांत्रिक पार्टी (RLP)',55,1312,28,'#ffd32a');
    ctx.fillStyle='#5c765f';ctx.fillRect(590,1272,3,55);
    text(ctx,'चुनाव चिन्ह - बोतल',630,1312,25,'#f4f4ed');
    setOut(c.toDataURL('image/png'));setLoading(false);
   };
   if(photo){const im=new Image();im.onload=()=>{
    ctx.save();
    // soft shadow + full-height foreground crop, intentionally not a circular avatar
    ctx.shadowColor='rgba(0,0,0,.65)';ctx.shadowBlur=35;ctx.shadowOffsetY=18;
    ctx.beginPath();ctx.roundRect(150,355,610,570,45);ctx.clip();fit(ctx,im,150,355,610,570,'center');ctx.restore();
    ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=3;ctx.strokeRect(150,355,610,570);
    finish();
   };im.src=photo}else finish();
  };
  if(leader){const im=new Image();im.onload=()=>{
   ctx.save();ctx.shadowColor='rgba(0,0,0,.7)';ctx.shadowBlur=30;ctx.shadowOffsetY=15;
   ctx.beginPath();ctx.roundRect(590,205,470,720,45);ctx.clip();fit(ctx,im,590,205,470,720,'right');ctx.restore();
   drawUser();
  };im.src=leader}else drawUser();
 };
 return <main className="app"><canvas ref={canvas} hidden/>
 <header><div className="brand"><span>RLP</span> Poster Maker <small>REAL POSTER LAYOUT</small></div><Sparkles/></header>
 {!selected?<section className="home"><div className="hero"><span>2 PREMIUM LAYERED TEMPLATES</span><h1>अब सिर्फ फोटो नहीं, <em>असल poster जैसी layering</em></h1><p>Header → brush background → leader → user foreground → yellow name band → contact strip → footer.</p></div>
 <div className="grid">{templates.map(t=><button key={t.id} onClick={()=>setSelected(t)}><div className="mock"><div className="miniHead">RLP</div><div className="miniBrush"/><div className="miniLeader"/><div className="miniUser"/><div className="miniBand">{t.title}</div></div><b>{t.title}</b><small>{t.kicker}</small></button>)}</div></section>:
 <section className="studio"><button className="back" onClick={()=>{setSelected(null);setOut('')}}><ArrowLeft size={18}/> Templates</button>
 <div className="columns"><div className="panel"><div className="pill"><Layers size={14}/> 9-LAYER TEMPLATE</div><h2>{selected.title}</h2><p>सबसे अच्छे परिणाम के लिए transparent PNG या पहले से background हटाई हुई फोटो लगाएं।</p>
 <label className="upload"><input type="file" accept="image/*" onChange={e=>pick(setPhoto,e.target.files?.[0])}/>{photo?<img src={photo}/>:<><Upload/><b>अपनी मुख्य फोटो</b><small>Foreground में आएगी</small></>}</label>
 <label className="upload smallUpload"><input type="file" accept="image/*" onChange={e=>pick(setLeader,e.target.files?.[0])}/>{leader?<img src={leader}/>:<><Users/><b>Leader की फोटो</b><small>Background layer</small></>}</label>
 <input value={name} onChange={e=>setName(e.target.value)} placeholder="आपका नाम *"/>
 <input value={role} onChange={e=>setRole(e.target.value)} placeholder="पद / पहचान"/>
 <input value={place} onChange={e=>setPlace(e.target.value)} placeholder="गांव / विधानसभा / स्थान"/>
 <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="मोबाइल नंबर"/>
 <button className="generate" onClick={generate} disabled={loading}>{loading?'Layers तैयार हो रही हैं...':'✨ Generate Real-Style Poster'}</button></div>
 <div className="preview">{out?<><img src={out}/><a href={out} download={'rlp-poster-'+Date.now()+'.png'}><Download size={18}/> Download PNG</a></>:<div className="empty"><ImagePlus size={54}/><b>Layered Poster Preview</b><span>9-layer layout में poster यहां बनेगा</span></div>}</div></div></section>}
 </main>
}