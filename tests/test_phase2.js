const fs=require('fs'),cp=require('child_process'),path=require('path');
const root=path.resolve(__dirname,'..');
function run(args,out){cp.execFileSync(process.execPath,['game.js',...args,'--out',out],{cwd:root});return fs.readFileSync(out,'utf8').trim().split('\n').map(JSON.parse);}
const a=path.join(root,'docs/proof/phase2-features.jsonl');
const lines=run(['--seed','22','--night','1','--scenario','tests/phase2_scenario.json','--inputs','tests/phase2_inputs.json','--ticks','8','--snapshot-every','1'],a);
if(!lines.some(x=>x.type==='event'&&x.name==='dash'))throw Error('dash event missing');
if(!lines.some(x=>x.type==='event'&&x.name==='pulse'))throw Error('pulse event missing');
if(!lines.some(x=>x.type==='event'&&x.name==='paused'))throw Error('pause event missing');
if(!lines.some(x=>x.type==='snapshot'&&x.state==='paused'))throw Error('paused snapshot missing');
const d=run(['--seed','23','--night','2','--scenario','tests/drifter_scenario.json','--inputs','tests/drifter_inputs.json','--ticks','1','--snapshot-every','1'],path.join(root,'docs/proof/drifter.jsonl'));
if(!d.some(x=>x.type==='event'&&x.name==='drifter_steal'&&x.data.amount===3))throw Error('drifter steal missing');
for(const f of ['docs/proof/test-a.jsonl','docs/proof/test-b.jsonl','docs/proof/drifter.jsonl'])try{fs.unlinkSync(path.join(root,f));}catch{}
console.log('Phase 2 feature tests: PASS');
