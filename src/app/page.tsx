'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, Download, ImagePlus, Sparkles, Upload, Users } from 'lucide-react';

type Template={id:string;title:string;subtitle:string;tag:string};
const templates:Template[]=[
 {id:'youth',title:'युवा साथियों का स्वागत',subtitle:'RLP युवा साथी • स्वागत एवं अभिनंदन',tag:'YOUTH'},
 {id:'meeting',title:'जनसभा एवं कार्यक्रम',subtitle:'कार्यक्रम की सूचना • आपका स्वागत है',tag:'EVENT'},
 {id:'birthday',title:'जन्मदिन की शुभकामनाएं',subtitle:'हार्दिक बधाई एवं शुभकामनाएं',tag:'WISH'},
 {id:'leader',title:'नेतृत्व संदेश',subtitle:'जनहित • युवा शक्ति • जनआवाज़',tag:'LEADER'}
];

export default function Home(){
 const [selected,setSelected]=useState<Template|null>(null);
 const [name,setName]=useState(''); const [role,setRole]=useState('RLP युवा साथी');
 const [place,setPlace]=useState(''); const [phone,setPhone]=useState('');
 const [photo,setPhoto]=useState(''); const [leader,setLeader]=useState('');
 const [out,setOut]=useState(''); const [loading,setLoading]=useState(false);
 const canvas=useRef<HTMLCanvasElement>(null);

 const pick=(setter:(v:string)=>void,file?:File)=>{if(!file)return;const r=new FileReader();r.onload=()=>setter(String(r.result));r.readAsDataURL(file)};
 const cover=(ctx:CanvasRenderingContext2D,img:HTMLImageElement,x:number,y:number,w:number,h:number)=>{const s=Math.max(w/img.width,h/img.height);const iw=img.width*s,ih=img.height*s;ctx.drawImage(img,x+(w-iw)/2,y+(h-ih)/2,iw,ih)};
 const generate=()=>{
  if(!selected||!name.trim()) return alert('कृपया अपना नाम भरें');
  setLoading(true);
  const c=canvas.current!; c.width=1080;c.height=1350;const ctx=c.getContext('2d')!;
  const g=ctx.createLinearGradient(0,0,1080,1350);g.addColorStop(0,'#061c0b');g.addColorStop(.55,'#092b10');g.addColorStop(1,'#f7c928');ctx.fillStyle=g;ctx.fillRect(0,0,1080,1350);
  ctx.fillStyle='#76b900';ctx.globalAlpha=.75;ctx.beginPath();ctx.moveTo(650,0);ctx.lineTo(1080,0);ctx.lineTo(1080,760);ctx.lineTo(760,560);ctx.closePath();ctx.fill();ctx.globalAlpha=1;
  ctx.fillStyle='#fff';ctx.fillRect(34,34,170,170);ctx.strokeStyle='#f4c400';ctx.lineWidth=10;ctx.strokeRect(34,34,170,170);
  ctx.fillStyle='#0b3113';ctx.textAlign='center';ctx.font='bold 26px Arial';ctx.fillText('RLP',119,135);ctx.font='18px Arial';ctx.fillText('युवा साथी',119,165);
  ctx.textAlign='left';ctx.fillStyle='#fff';ctx.font='bold 36px Arial';ctx.fillText('राष्ट्रीय लोकतांत्रिक पार्टी',230,72);ctx.font='bold 48px Arial';ctx.fillStyle='#f7d21f';ctx.fillText('RLP',230,132);ctx.fillStyle='#fff';ctx.font='bold 28px Arial';ctx.fillText(selected.subtitle,230,178);
  ctx.fillStyle='#fff';ctx.font='bold 78px Arial';ctx.fillText('आपका',45,355);ctx.fillStyle='#ffd42a';ctx.font='bold 104px Arial';ctx.fillText(selected.title.split(' ').slice(0,2).join(' '),45,475);
  ctx.fillStyle='#fff';ctx.font='bold 70px Arial';ctx.fillText('सादर स्वागत',45,555);
  const drawAll=()=>{
    ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(0,900,1080,450);ctx.fillStyle='#ffd42a';ctx.fillRect(0,900,1080,210);
    ctx.fillStyle='#6b2400';ctx.textAlign='center';ctx.font='bold 78px Arial';ctx.fillText(name,540,1015);
    ctx.fillStyle='#0b3113';ctx.font='bold 34px Arial';ctx.fillText(role||'RLP युवा साथी',540,1070);
    ctx.fillStyle='#fff';ctx.font='bold 30px Arial';ctx.fillText(place,540,1170);ctx.font='bold 42px Arial';ctx.fillText(phone,540,1245);
    ctx.fillStyle='#06200b';ctx.fillRect(0,1285,1080,65);ctx.fillStyle='#ffd42a';ctx.font='bold 24px Arial';ctx.fillText('राष्ट्रीय लोकतांत्रिक पार्टी (RLP)  •  चुनाव चिन्ह - बोतल',540,1328);
    setOut(c.toDataURL('image/png'));setLoading(false);
  };
  const drawUser=()=>{
   if(photo){const im=new Image();im.onload=()=>{ctx.save();ctx.beginPath();ctx.arc(380,735,255,0,Math.PI*2);ctx.clip();cover(ctx,im,125,480,510,510);ctx.restore();ctx.strokeStyle='#fff';ctx.lineWidth=10;ctx.beginPath();ctx.arc(380,735,260,0,Math.PI*2);ctx.stroke();drawAll()};im.src=photo}
   else drawAll();
  };
  if(leader){const im=new Image();im.onload=()=>{ctx.save();ctx.beginPath();ctx.arc(790,470,230,0,Math.PI*2);ctx.clip();cover(ctx,im,560,240,460,460);ctx.restore();ctx.strokeStyle='#f7d21f';ctx.lineWidth=10;ctx.beginPath();ctx.arc(790,470,235,0,Math.PI*2);ctx.stroke();drawUser()};im.src=leader}else drawUser();
 };
 return <main className="app"><canvas ref={canvas} hidden/>
 <header><div className="brand"><span>RLP</span> Poster Maker <small>युवा साथी</small></div><Sparkles/></header>
 {!selected?<section className="home"><div className="hero"><span>NEW • PREMIUM POSTER STUDIO</span><h1>RLP के लिए <em>Professional</em> Poster बनाइए</h1><p>इस तरह के layered, leader + user photo, bold Hindi typography वाले posters तैयार करें।</p></div><div className="grid">{templates.map(t=><button key={t.id} onClick={()=>setSelected(t)}><div className="mock"><div className="miniLogo">RLP</div><div className="miniText">{t.title}</div><div className="miniCircle"/></div><b>{t.title}</b><small>{t.subtitle}</small></button>)}</div></section>:
 <section className="studio"><button className="back" onClick={()=>{setSelected(null);setOut('')}}><ArrowLeft size={18}/> Templates</button><div className="columns"><div className="panel"><div className="pill">{selected.tag} TEMPLATE</div><h2>{selected.title}</h2><p>नीचे की जानकारी poster में अपने-आप लग जाएगी।</p>
 <label className="upload"><input type="file" accept="image/*" onChange={e=>pick(setPhoto,e.target.files?.[0])}/>{photo?<img src={photo}/>:<><Upload/><b>अपनी फोटो</b><small>मुख्य फोटो अपलोड करें</small></>}</label>
 <label className="upload smallUpload"><input type="file" accept="image/*" onChange={e=>pick(setLeader,e.target.files?.[0])}/>{leader?<img src={leader}/>:<><Users/><b>नेता की फोटो (वैकल्पिक)</b></>}</label>
 <input value={name} onChange={e=>setName(e.target.value)} placeholder="आपका नाम *"/>
 <input value={role} onChange={e=>setRole(e.target.value)} placeholder="पद / पहचान"/>
 <input value={place} onChange={e=>setPlace(e.target.value)} placeholder="गांव / विधानसभा / स्थान"/>
 <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="मोबाइल नंबर"/>
 <button className="generate" onClick={generate} disabled={loading}>{loading?'Poster बन रहा है...':'✨ Generate Premium Poster'}</button></div>
 <div className="preview">{out?<><img src={out}/><a href={out} download={'rlp-'+Date.now()+'.png'}><Download size={18}/> Download PNG</a></>:<div className="empty"><ImagePlus size={54}/><b>Poster Preview</b><span>Generate करने के बाद आपका डिजाइन यहां आएगा</span></div>}</div></div></section>}</main>
}