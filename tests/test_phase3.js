const fs=require('fs'),cp=require('child_process'),path=require('path');const root=path.resolve(__dirname,'..');
function run(s,i,t,out){cp.execFileSync(process.execPath,['game.js','--seed','33','--night','1','--scenario',s,'--inputs',i,'--ticks',String(t),'--snapshot-every','1','--out',out],{cwd:root});return fs.readFileSync(out,'utf8').trim().split('\n').map(JSON.parse)}
const ref=run('tests/phase3_refuel.json','tests/phase3_refuel_inputs.json',2,'docs/proof/phase3-refuel.jsonl');if(!ref.some(x=>x.type==='event'&&x.name==='refuel'))throw Error('refuel event missing');
const rel=run('tests/phase3_relight.json','tests/phase3_inputs.json',2,'docs/proof/phase3-relight.jsonl');if(!rel.some(x=>x.type==='event'&&x.name==='lantern_lit'&&x.data.relight===true))throw Error('relight event missing');
const dr=run('tests/phase3_drain.json','tests/phase3_inputs.json',61,'docs/proof/phase3-drain.jsonl');if(!dr.some(x=>x.type==='event'&&x.name==='fuel_drain'))throw Error('fuel drain event missing');
const win=run('tests/phase3_win.json','tests/phase3_inputs.json',60,'docs/proof/phase3-win.jsonl');const end=win.at(-1);if(end.state!=='won')throw Error('dawn survival win missing');if(!win.some(x=>x.type==='event'&&x.name==='game_over'&&x.data.reason==='dawn_survived'))throw Error('dawn_survived missing');
console.log('Phase 3 feature tests: PASS');
