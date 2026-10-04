import {randomInt} from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
// Preserve duplicate entries: the original Apps Script uses concat, not a set.
export const choices={1:range(1,19).concat([21,38,57,59,63,64,67,71,73,74,81,82,83,84,91,92,93,95]),2:[20,57,68,69,70,78,79,80,87,88,89,90,93,96].concat(range(22,39)),3:[20,22,23,25,27,30,60,61,62,65,66,67,72,75,76,77,80,85,86,88,90,94,97,98,99,100].concat(range(39,58))};
export const saoPauloToday=(now=new Date())=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo'}).format(now);
export function generateDay(history,date,rand=randomInt){if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||new Date(date+'T12:00:00Z').toISOString().slice(0,10)!==date)throw Error('Invalid date');if(history.generatedDates?.includes(date)||history.facts.some(r=>r.date===date))return [];if(history.facts.some(r=>r.date>date))throw Error('Cannot generate a date before the existing history');const rows=[];for(let round=0;round<6;round++)for(const listener of [1,2,3]){const count=rand(1,7);for(let i=0;i<count;i++)rows.push({date,listener,artist:choices[listener][rand(0,choices[listener].length)],minutes:rand(1,16)});}return rows;}
export async function update(file,date=saoPauloToday()){
 const history=JSON.parse(await fs.readFile(file,'utf8'));
 const lastDate=history.facts.reduce((last,r)=>r.date>last?r.date:last,'');
 if(!lastDate)throw Error('Import the historical data before generating new days');
 const nextDay=d=>{const value=new Date(d+'T12:00:00Z');value.setUTCDate(value.getUTCDate()+1);return value.toISOString().slice(0,10);};
 let added=0;
 for(let day=nextDay(lastDate);day<=date;day=nextDay(day)){
  const rows=generateDay(history,day);if(!rows.length)continue;
  history.facts.push(...rows);history.generatedDates??=[];history.generatedDates.push(day);added+=rows.length;
  console.log(day+': '+rows.length+' records added.');
 }
 if(!added){console.log(date+': already exists; no records added.');return 0;}
 history.lastGeneratedAt=new Date().toISOString();
 const temporary=file+'.tmp';await fs.writeFile(temporary,JSON.stringify(history));await fs.rename(temporary,file);return added;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){const added=await update(path.resolve(import.meta.dirname,'../data/history.json'));if(process.env.GITHUB_OUTPUT)await fs.appendFile(process.env.GITHUB_OUTPUT,'changed='+(added>0)+'\n');}
