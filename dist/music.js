export const TRACKS = [
 {id:'kick',name:'Kick',subtitle:'The heartbeat',color:'#c7fa78',symbol:'◉'},
 {id:'snare',name:'Snare',subtitle:'A little snap',color:'#e7ba92',symbol:'≋'},
 {id:'hat',name:'Hi-hat',subtitle:'Tiny footsteps',color:'#d9d6fc',symbol:'✳'},
 {id:'bass',name:'Bass',subtitle:'Underground',color:'#8bd9cf',symbol:'⌁'},
 {id:'keys',name:'Keys',subtitle:'Warm daylight',color:'#f2ca6d',symbol:'▥'},
 {id:'bell',name:'Bells',subtitle:'Seed of a melody',color:'#b0c6f5',symbol:'◇'}
];
const row = (on) => Array.from({length:16},(_,i)=>on.includes(i)?0:-1);
export const PRESETS = {
 burrow:{name:'Burrow FM',bpm:88,pattern:[row([0,6,8,14]),row([4,12]),row([0,2,4,6,8,10,12,14]),row([0,3,8,11]),[0,-1,-1,2,-1,-1,1,-1,3,-1,-1,2,-1,4,-1,-1],[-1,-1,-1,-1,-1,3,-1,-1,-1,-1,4,-1,-1,-1,-1,2]]},
 moon:{name:'Moonlit Nest',bpm:68,pattern:[row([0,10]),row([12]),row([2,6,10,14]),row([0,8]),[0,-1,-1,-1,-1,2,-1,-1,1,-1,-1,-1,-1,3,-1,-1],[-1,-1,4,-1,-1,-1,-1,2,-1,-1,3,-1,-1,-1,-1,1]]},
 sprint:{name:'Tiny Rave',bpm:128,pattern:[row([0,4,8,12]),row([4,12]),row([0,2,3,4,6,8,10,11,12,14]),[0,-1,0,-1,2,-1,2,-1,3,-1,3,-1,2,-1,1,-1],[0,-1,2,-1,4,-1,2,-1,3,-1,1,-1,4,-1,2,-1],row([3,7,11,15])]}
};
export const clone = value => JSON.parse(JSON.stringify(value));
export function newSong(key='burrow') { const p=PRESETS[key]; return {version:1,name:p.name,bpm:p.bpm,pattern:clone(p.pattern),volumes:[.8,.55,.35,.65,.55,.42],muted:[false,false,false,false,false,false],toneSeed:'studio',ambience:false}; }
export function hashSeed(text) {let h=2166136261;for(const c of text){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
export function rootFor(seed){return [48,50,53,55,57][hashSeed(seed)%5];}
export function midiFor(track,step,value,seed){const root=rootFor(seed);const scale=[0,3,5,7,10];return root+(track===3?-12:track===5?12:0)+scale[value%5];}
export function noteName(midi){return ['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'][midi%12]+(Math.floor(midi/12)-1);}
export function validateSong(raw){
 if(!raw||raw.version!==1||typeof raw.name!=='string'||raw.name.length>48||!Number.isInteger(raw.bpm)||raw.bpm<50||raw.bpm>160)throw Error('This composition has an unsupported format.');
 if(!Array.isArray(raw.pattern)||raw.pattern.length!==6||raw.pattern.some(r=>!Array.isArray(r)||r.length!==16||r.some(n=>!Number.isInteger(n)||n< -1||n>4)))throw Error('Invalid note pattern.');
 if(!Array.isArray(raw.volumes)||raw.volumes.length!==6||raw.volumes.some(n=>typeof n!=='number'||!Number.isFinite(n)||n<0||n>1))throw Error('Invalid mixer levels.');
 if(!Array.isArray(raw.muted)||raw.muted.length!==6||raw.muted.some(n=>typeof n!=='boolean'))throw Error('Invalid track settings.');
 if(typeof raw.toneSeed!=='string'||raw.toneSeed.length>300||typeof raw.ambience!=='boolean')throw Error('Invalid sound settings.');
 return {version:1,name:raw.name,bpm:raw.bpm,pattern:clone(raw.pattern),volumes:[...raw.volumes],muted:[...raw.muted],toneSeed:raw.toneSeed,ambience:raw.ambience};
}
export function encodeSong(song){const bytes=new TextEncoder().encode(JSON.stringify(validateSong(song)));let s='';for(const b of bytes)s+=String.fromCharCode(b);return btoa(s).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');}
export function decodeSong(text){if(text.length>5000||!/^[A-Za-z0-9_-]+$/.test(text))throw Error('Invalid composition link.');const s=atob(text.replaceAll('-','+').replaceAll('_','/'));return validateSong(JSON.parse(new TextDecoder().decode(Uint8Array.from(s,c=>c.charCodeAt(0)))));}
export function wheelState(data,now=Date.now()){
 if(data?.schemaVersion!==1)throw Error('Unsupported telemetry version.');
 const m=data.measurement;
 if(!m||m.freshness!=='online'||!Number.isFinite(Date.parse(m.receivedAt))||!Number.isFinite(m.staleAfterSeconds)||m.staleAfterSeconds<=0||now-Date.parse(m.receivedAt)>Math.min(m.staleAfterSeconds,120)*1000||Date.parse(m.receivedAt)>now+30000)return {state:'unknown',label:'Telemetry unavailable'};
 if(!['hardware','derived','simulated','replay'].includes(m.provenance))return {state:'unknown',label:'Unknown measurement source'};
 if(!Number.isInteger(m.rpmMilli)||m.rpmMilli<0||!['ACTIVE','IDLE'].includes(m.coreStatus))return {state:'unknown',label:'Sensor unavailable'};
 const rpm=m.rpmMilli/1000;
 return {state:m.coreStatus==='IDLE'?'resting':'running',rpm,bpm:m.coreStatus==='IDLE'?66:Math.round(Math.min(150,Math.max(72,72+rpm*.55))),provenance:m.provenance,receivedAt:m.receivedAt};
}
const uint=v=>typeof v==='string'&&/^\d+$/.test(v);
export function validateCore(data,deployment){
 if(data?.schemaVersion!==1)throw Error('Unsupported chain response.');
 if(data.status!=='available')throw Error('Settled rounds are unavailable.');
 const d=deployment.contracts.SqueekCore, ids=data.identities, impl=data.implementation;
 const match=(a,b)=>typeof a==='string'&&typeof b==='string'&&a.toLowerCase()===b.toLowerCase();
 if(!match(ids?.core,d.address)||!match(ids?.proxyImplementation,d.implementation)||!match(ids?.proxyAdmin,d.proxyAdmin)||!match(ids?.proxyAdminOwner,deployment.operational.governanceTimelock.address)||!match(impl?.codeAddress,d.implementation)||!match(impl?.runtimeHash,d.implementationRuntimeHash)||!match(impl?.storageLayoutDigest,d.storageLayoutDigest))throw Error('Deployment changed. Live harmony is paused.');
 if(String(data.chain?.chainId)!==String(deployment.chainId)||!uint(data.chain?.safeThroughBlock)||!uint(data.chain?.confirmations)||BigInt(data.chain.confirmations)<12n)throw Error('Chain confirmation check failed.');
 for(const k of ['settledThroughRound','cumulativeWork','cumulativeBlockUnits','blockHeight'])if(!uint(data.core?.[k]))throw Error('Invalid settled state.');
 if(!uint(data.source?.blockNumber)||BigInt(data.source.blockNumber)>BigInt(data.chain.safeThroughBlock)||!/^0x[a-fA-F0-9]{64}$/.test(data.source?.transactionHash??''))throw Error('Invalid settlement reference.');
 if(data.configuration?.streamId!==deployment.launchConfiguration.core.streamId)throw Error('Unexpected wheel stream.');
 const c=data.core;
 return {round:c.settledThroughRound,work:c.cumulativeWork,block:c.blockHeight,safeBlock:data.chain.safeThroughBlock,tx:data.source.transactionHash,seed:`${deployment.release}:${c.settledThroughRound}:${c.cumulativeWork}:${c.cumulativeBlockUnits}`,paused:c.paused===true};
}
