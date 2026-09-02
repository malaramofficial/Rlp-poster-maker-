'use client';
import {useRef,useState}from'react';
import {ArrowLeft,Download,Upload,Users,Sparkles,Layers,ImagePlus}from'lucide-react';
type T={id:string;title:string};
const templates:T[]=[{id:'exact',title:'Welcome Poster – Editable'},{id:'meeting',title:'Meeting Poster – Editable'}];

export default function Home(){
 const [sel,setSel]=useState<T|null>(null),[name,setName]=useState('आपका नाम'),[role,setRole]=useState('RLP युवा साथी'),[phone,setPhone]=useState('7742494320'),[photo,setPhoto]=useState(''),[leader,setLeader]=useState('');
 const [headline,setHeadline]=useState('आपका हार्दिक अभिनंदन'),[sub,setSub]=useState('जय जवान जय किसान'),[party,setParty]=useState('राष्ट्रीय लोकतांत्रिक पार्टी'),[out,setOut]=useState('');const cv=useRef<HTMLCanvasElement>(null);
 const pick=(s:(x:string)=>void,f?:File)=>{if(!f)return;const r=new FileReader();r.onload=()=>s(String(r.result));r.readAsDataURL(f)};
 const fit=(x:CanvasRenderingContext2D,i:HTMLImageElement,a:number,b:number,w:number,h:number)=>{const z=Math.max(w/i.width,h/i.height),iw=i.width*z,ih=i.height*z;x.drawImage(i,a+(w-iw)/2,b+(h-ih)/2,iw,ih)};
 const tx=(x:CanvasRenderingContext2D,s:string,a:number,b:number,n:number,col:string,align:CanvasTextAlign='left')=>{x.fillStyle=col;x.textAlign=align;x.font='900 '+n+'px Arial';x.fillText(s,a,b)};
 const gen=()=>{
  const c=cv.current!,x=c.getContext('2d')!;c.width=1080;c.height=1350;x.fillStyle='#041c09';x.fillRect(0,0,1080,1350);
  // editable poster structure
  x.fillStyle='#fff';x.beginPath();x.arc(118,110,84,0,7);x.fill();x.lineWidth=10;x.strokeStyle='#e9ca20';x.beginPath();x.arc(118,110,84,.6,4.1);x.stroke();x.strokeStyle='#428536';x.beginPath();x.arc(118,110,84,4.1,6.9);x.stroke();
  x.strokeStyle='#152b18';x.lineWidth=8;x.strokeRect(96,55,44,110);
  tx(x,party,210,72,30,'#f4f4ed');tx(x,'RLP',210,128,52,'#ffd326');tx(x,'हनुमान बेनीवाल के निर्देश में',210,170,27,'#f4f4ed');
  // brush layer
  x.strokeStyle='#79ae10';x.globalAlpha=.9;x.lineCap='square';for(let i=0;i<14;i++){x.lineWidth=14+i*3;x.beginPath();x.moveTo(700+i*15,280+i*5);x.lineTo(1090,65+i*25);x.stroke()}x.globalAlpha=1;
  // headline editable
  const words=headline.split(' ');tx(x,words.slice(0,1).join(' '),45,335,76,'#fff');tx(x,words.slice(1,2).join(' '),45,445,100,'#ffd326');tx(x,words.slice(2).join(' '),45,540,66,'#fff');x.strokeStyle='#d9b526';x.lineWidth=4;x.beginPath();x.moveTo(45,575);x.lineTo(365,575);x.stroke();tx(x,sub,45,635,30,'#f4f4ed');
  const finish=()=>{x.fillStyle='#ffd22a';x.fillRect(0,920,1080,225);tx(x,name,520,1040,90,'#612200','center');tx(x,role,520,1100,34,'#173916','center');
   x.fillStyle='#09290f';x.roundRect(748,955,275,150,15);x.fill();tx(x,'RLP',885,1008,42,'#ffd22a','center');tx(x,'युवा साथी',885,1060,34,'#fff','center');
   x.fillStyle='#f5f4ee';x.fillRect(0,1145,1080,105);tx(x,'☎',125,1215,48,'#21833b','center');tx(x,phone,560,1218,56,'#17351c','center');
   x.fillStyle='#08230d';x.fillRect(0,1250,1080,100);tx(x,party+' (RLP)',55,1312,27,'#ffd32a');tx(x,'चुनाव चिन्ह - बोतल',1010,1312,25,'#fff','right');setOut(c.toDataURL('image/png'));};
  const user=()=>{if(!photo)return finish();const i=new Image();i.onload=()=>{x.save();x.shadowColor='#000';x.shadowBlur=28;x.shadowOffsetY=15;x.beginPath();x.roundRect(170,355,600,565,35);x.clip();fit(x,i,170,355,600,565);x.restore();finish()};i.src=photo};
  if(!leader)return user();const i=new Image();i.onload=()=>{x.save();x.globalAlpha=.98;x.beginPath();x.roundRect(610,205,450,715,40);x.clip();fit(x,i,610,205,450,715);x.restore();user()};i.src=leader;
 };
 const F=({label,value,set}:{label:string,value:string,set:(x:string)=>void})=><label className="field"><span>{label}</span><input value={value} onChange={e=>set(e.target.value)}/></label>;
 return <main className="app"><canvas ref={cv} hidden/><header><b><i>RLP</i> Poster Maker</b><Sparkles/></header>{!sel?<section className="home"><h1>Editable Poster Templates</h1><p>इस template के हर मुख्य हिस्से को बदलकर अपना poster बनाएं।</p><div className="grid">{templates.map(t=><button onClick={()=>setSel(t)} key={t.id}><div className="cardPoster"><strong>RLP</strong><div className="brush"/><div className="person a"/><div className="person b"/><em>आपका<br/>हार्दिक अभिनंदन</em><footer>आपका नाम</footer></div><b>{t.title}</b><small>Fully editable fields</small></button>)}</div></section>:<section className="studio"><button className="back" onClick={()=>setSel(null)}><ArrowLeft/> Templates</button><div className="columns"><div className="panel"><div className="pill"><Layers size={14}/> EDITABLE TEMPLATE</div><h2>{sel.title}</h2><F label="पार्टी का नाम" value={party} set={setParty}/><F label="मुख्य संदेश" value={headline} set={setHeadline}/><F label="छोटा संदेश" value={sub} set={setSub}/>
 <label className="upload"><input type="file" accept="image/*" onChange={e=>pick(setPhoto,e.target.files?.[0])}/>{photo?<img src={photo}/>:<><Upload/><b>अपनी फोटो बदलें</b></>}</label>
 <label className="upload small"><input type="file" accept="image/*" onChange={e=>pick(setLeader,e.target.files?.[0])}/>{leader?<img src={leader}/>:<><Users/><b>Leader फोटो बदलें</b></>}</label>
 <F label="आपका नाम" value={name} set={setName}/><F label="पद / पहचान" value={role} set={setRole}/><F label="मोबाइल नंबर" value={phone} set={setPhone}/><button className="generate" onClick={gen}>Generate Editable Poster</button></div>
 <div className="preview">{out?<><img src={out}/><a href={out} download="rlp-poster.png"><Download/> Download PNG</a></>:<div className="empty"><ImagePlus size={52}/><b>Editable Preview</b><span>जानकारी बदलें और Generate करें</span></div>}</div></div></section>}</main>
}