import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
export function csv(text){const rows=[];let row=[],v='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){v+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(v);v='';}else if(c==='\n'&&!quoted){row.push(v.replace(/\r$/,''));rows.push(row);row=[];v='';}else v+=c;}if(v||row.length){row.push(v.replace(/\r$/,''));rows.push(row);}const header=rows.shift().map(x=>x.replace(/^\uFEFF/,''));return rows.filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(header.map((h,i)=>[h,r[i]??''])));}
const artists=csv(await fs.readFile(path.join(root,'data/dm_artists.csv'),'utf8')).map(a=>({id:+a.id_artist,name:a.name_artist,genre:a.genre,photo:a.foto_square,round:a.foto_round}));
const listeners=csv(await fs.readFile(path.join(root,'data/dm_listeners.csv'),'utf8')).map(l=>({id:+l.id_listeners,name:l.nome,photo:`assets/listeners/${l.nome.toLowerCase()}.png`,round:`assets/listeners/${l.nome.toLowerCase()} redondo.png`}));
const facts=csv(await fs.readFile(path.join(root,'data/ft_musics.csv'),'utf8')).map(r=>{const [d,m,y]=r.date.split('/');if(!y)throw Error('Historical date missing year');return {date:`${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`,listener:+r.id_listeners,artist:+r.id_artist,minutes:+r.minutes};});
await fs.writeFile(path.join(root,'data/history.json'),JSON.stringify({artists,listeners,facts,generatedDates:[],importedAt:new Date().toISOString()}));
const report=path.resolve(root,'../pibit/Music Farming Race.Report/definition/pages');const pages={};for(const id of await fs.readdir(report)){if(id.endsWith('.json'))continue;const p=JSON.parse(await fs.readFile(path.join(report,id,'page.json')));pages[p.displayName]={id,interactions:p.visualInteractions??[]};}
await fs.writeFile(path.join(root,'src/report.json'),JSON.stringify(pages));
console.log(`Imported ${facts.length} records, ${artists.length} artists, ${listeners.length} listeners. ${facts[0].date} to ${facts.at(-1).date}`);
