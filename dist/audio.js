import {midiFor} from './music.js';
const freq=n=>440*2**((n-69)/12);
function osc(ctx,out,type,f,t,d,volume,endFrequency){const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(endFrequency)o.frequency.exponentialRampToValueAtTime(endFrequency,t+d*.7);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(out);o.start(t);o.stop(t+d+.02);}
function noise(ctx,out,t,d,volume,cutoff,seed){const b=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*d),ctx.sampleRate),a=b.getChannelData(0);let n=seed||1;for(let i=0;i<a.length;i++){n=(Math.imul(1664525,n)+1013904223)>>>0;a[i]=(n/2147483648-1);}const s=ctx.createBufferSource(),g=ctx.createGain(),f=ctx.createBiquadFilter();s.buffer=b;f.type='highpass';f.frequency.value=cutoff;g.gain.setValueAtTime(volume,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f).connect(g).connect(out);s.start(t);s.stop(t+d+.02);}
export function voice(ctx,out,track,note,t,volume,ambient,step){
 const gain=volume*(ambient?.65:1);
 if(track===0){osc(ctx,out,'sine',135,t,.26,gain*.65,42);return;}
 if(track===1){noise(ctx,out,t,.16,gain*.3,1400,step+109);osc(ctx,out,'triangle',190,t,.1,gain*.12);return;}
 if(track===2){noise(ctx,out,t,.055,gain*.16,6500,step+837);return;}
 const f=freq(note);
 if(track===3){osc(ctx,out,'triangle',f,t,.32,gain*.3);osc(ctx,out,'sine',f/2,t,.4,gain*.2);return;}
 if(track===4){osc(ctx,out,'sine',f,t,ambient?1.1:.7,gain*.22);osc(ctx,out,'triangle',f*2,t,.24,gain*.065);osc(ctx,out,'sine',f*1.003,t,.8,gain*.09);return;}
 osc(ctx,out,'sine',f*2,t,1.1,gain*.19);osc(ctx,out,'sine',f*4.003,t,.4,gain*.06);
}
function output(ctx,volume,analyser){const master=ctx.createGain(),compressor=ctx.createDynamicsCompressor();master.gain.value=volume;compressor.threshold.value=-14;compressor.knee.value=18;compressor.ratio.value=4;master.connect(compressor);if(analyser){compressor.connect(analyser);analyser.connect(ctx.destination);}else compressor.connect(ctx.destination);return master;}
export function playStep(ctx,out,song,step,time){song.pattern.forEach((row,track)=>{if(row[step]>=0&&!song.muted[track])voice(ctx,out,track,midiFor(track,step,row[step],song.toneSeed),time,song.volumes[track],song.ambience,step);});}
export class Engine{
 constructor(getSong,onStep,onBar){this.getSong=getSong;this.onStep=onStep;this.onBar=onBar;this.running=false;this.volume=.7;this.queue=[];}
 async start(){if(this.running)return;this.ctx??=new AudioContext();await this.ctx.resume();if(this.ctx.state!=='running')throw Error('Audio is paused by your browser. Press Play again.');this.analyser=this.ctx.createAnalyser();this.analyser.fftSize=128;this.out=output(this.ctx,this.volume,this.analyser);this.running=true;this.step=0;this.next=this.ctx.currentTime+.08;this.queue=[];this.tick();this.timer=setInterval(()=>this.tick(),25);this.paint();}
 tick(){if(this.next<this.ctx.currentTime-.2){this.next=this.ctx.currentTime+.05;this.step=0;this.queue=[];}while(this.running&&this.next<this.ctx.currentTime+.12){if(this.step===0)this.onBar();const song=this.getSong();playStep(this.ctx,this.out,song,this.step,this.next);this.queue.push({step:this.step,time:this.next});this.next+=60/song.bpm/4;this.step=(this.step+1)%16;}}
 paint(){if(!this.running)return;while(this.queue.length&&this.queue[0].time<=this.ctx.currentTime)this.onStep(this.queue.shift().step);this.frame=requestAnimationFrame(()=>this.paint());}
 stop(){this.running=false;clearInterval(this.timer);cancelAnimationFrame(this.frame);if(this.out){this.out.gain.cancelScheduledValues(this.ctx.currentTime);this.out.gain.setTargetAtTime(.0001,this.ctx.currentTime,.015);const old=this.out;setTimeout(()=>old.disconnect(),120);}this.queue=[];this.onStep(-1);}
 setVolume(v){this.volume=v;if(this.out&&this.running)this.out.gain.setTargetAtTime(v,this.ctx.currentTime,.03);}
 preview(track,value,song){if(this.ctx?.state==='running'&&this.running)voice(this.ctx,this.out,track,midiFor(track,0,value,song.toneSeed),this.ctx.currentTime,.2,false,0);}
}
export async function renderWav(song,volume=.7){
 const rate=44100,duration=4*16*60/song.bpm/4+1.5,ctx=new OfflineAudioContext(2,Math.ceil(duration*rate),rate),out=output(ctx,volume);
 for(let bar=0;bar<4;bar++)for(let step=0;step<16;step++)playStep(ctx,out,song,step,(bar*16+step)*60/song.bpm/4);
 const audio=await ctx.startRendering();return wavFromChannels([audio.getChannelData(0),audio.getChannelData(1)],rate);
}
export function wavFromChannels(channels,rate){const frames=channels[0].length,num=channels.length,buffer=new ArrayBuffer(44+frames*num*2),v=new DataView(buffer);const str=(o,s)=>[...s].forEach((c,i)=>v.setUint8(o+i,c.charCodeAt(0)));str(0,'RIFF');v.setUint32(4,buffer.byteLength-8,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,num,true);v.setUint32(24,rate,true);v.setUint32(28,rate*num*2,true);v.setUint16(32,num*2,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,frames*num*2,true);let offset=44;for(let i=0;i<frames;i++)for(const channel of channels){const x=Math.min(1,Math.max(-1,channel[i]));v.setInt16(offset,x<0?x*32768:x*32767,true);offset+=2;}return new Blob([buffer],{type:'audio/wav'});}
