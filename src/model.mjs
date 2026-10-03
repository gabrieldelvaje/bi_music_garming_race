export const sum=rows=>rows.reduce((s,r)=>s+r.minutes,0);
export function addDays(s,n){const d=new Date(s+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
export function monday(s){const d=new Date(s+'T12:00:00Z');return addDays(s,-((d.getUTCDay()+6)%7));}
export function period(asOf,offset=0){const start=addDays(monday(addDays(asOf,-1)),offset*7);return [start,addDays(start,6)];}
export const between=(rows,start,end)=>rows.filter(r=>r.date>=start&&r.date<=end);
export function ranking(rows,dimension,items){const totals=new Map(items.map(i=>[i.id,0]));for(const r of rows)totals.set(r[dimension],(totals.get(r[dimension])??0)+r.minutes);let rank=0,previous=-1;return items.map(i=>({...i,minutes:totals.get(i.id)??0})).sort((a,b)=>b.minutes-a.minutes||a.name.localeCompare(b.name,'pt-BR')).map(i=>{if(i.minutes!==previous)rank++;previous=i.minutes;return {...i,rank};});}
export function genres(rows,artists){const map=new Map(artists.map(a=>[a.id,a.genre])),totals=new Map();for(const r of rows){const g=map.get(r.artist);totals.set(g,(totals.get(g)??0)+r.minutes);}return [...totals].map(([name,minutes])=>({name,minutes})).sort((a,b)=>b.minutes-a.minutes||a.name.localeCompare(b.name));}
export function wins(rows,dimension,items){const weeks=new Map(),result=new Map(items.map(i=>[i.id,0]));for(const r of rows){const w=monday(r.date);if(!weeks.has(w))weeks.set(w,[]);weeks.get(w).push(r);}for(const rs of weeks.values())for(const i of ranking(rs,dimension,items))if(i.rank===1&&i.minutes>0)result.set(i.id,result.get(i.id)+1);return result;}
export function trend(item,oldRanking){const old=oldRanking.find(x=>x.id===item.id);return !old?'':item.rank<old.rank?'▴':item.rank>old.rank?'▾':'';}
export function champion(rows,items){const ranks=ranking(rows,'listener',items),top=ranks.filter(x=>x.rank===1&&x.minutes>0);return top.map(x=>x.name).join(' / ')||'—';}
export const fmt=n=>new Intl.NumberFormat('pt-BR',{maximumFractionDigits:0}).format(n);
export const shortDate=s=>s.slice(8,10)+'/'+s.slice(5,7);
export const fullDate=s=>shortDate(s)+'/'+s.slice(2,4);
