#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const T = {
  player_speed: 5, carry_capacity: 5, lantern_cost: 5, pickup_radius: 1.5,
  interact_radius: 3, pulse_cost: 1, pulse_radius: 7, night1_duration_s: 300,
  flames: 5, invuln_s: 1, hit_drop_ratio: 0.5, pulse_stun_s: 2,
  pulse_push_m: 4, pulse_cooldown_s: 1, safe_radius: 4, shade_speed: 2.2,
  shade_hit_radius: 1.2, score_per_mote: 10, score_per_lantern: 100,
  score_per_stun: 5, score_per_second_left: 1, score_per_flame_left: 20,
  island_radius: 30
};

function fail(message, code = 2) { console.error(message); process.exitCode = code; throw new Error(message); }
function clone(v) { return JSON.parse(JSON.stringify(v)); }
function num(v, fallback) { return Number.isFinite(Number(v)) ? Number(v) : fallback; }
function round3(v) { return Math.round(v * 1000) / 1000; }
function pos3(p) { return [round3(p[0]), round3(p[1]), round3(p[2])]; }
function dist(a, b) { const x = a[0] - b[0], z = a[2] - b[2]; return Math.hypot(x, z); }
function normalize(x, z) { const n = Math.hypot(x, z); return n > 1 ? [x / n, z / n] : [x, z]; }

class RNG {
  constructor(seed) { this.s = (Number(seed) >>> 0) || 1; }
  next() { this.s = (1664525 * this.s + 1013904223) >>> 0; return this.s / 4294967296; }
}

function defaults() {
  const lanterns = [];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + i * Math.PI * 2 / 5;
    lanterns.push({ id: `L${i + 1}`, pos: [round3(Math.cos(a) * 20), 0, round3(Math.sin(a) * 20)], lit: false, deposited: 0 });
  }
  return {
    player: { pos: [0, 0, 0], carried: 0, flames: T.flames },
    motes: [[6, 0, 4], [-7, 0, 8], [10, 0, -8], [-12, 0, -6], [3, 0, -14], [14, 0, 4], [-16, 0, 10], [0, 0, 16], [8, 0, 13], [-8, 0, -15]],
    shades: [{ id: 'S1', pos: [12, 0, 12], state: 'chase' }], lanterns,
    time_left_s: T.night1_duration_s
  };
}

function parseJsonFile(file, label) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { fail(`${label} is not valid JSON: ${e.message}`); }
}

function validateScenario(s) {
  if (!s || typeof s !== 'object' || Array.isArray(s)) fail('scenario must be an object');
  if (s.player && (!Array.isArray(s.player.pos) || s.player.pos.length !== 3)) fail('scenario.player.pos must have 3 numbers');
  for (const key of ['motes', 'shades', 'lanterns']) if (s[key] !== undefined && !Array.isArray(s[key])) fail(`scenario.${key} must be an array`);
  return s;
}
function validateInputs(i) {
  if (!i || !Array.isArray(i.frames)) fail('inputs must contain a frames array');
  let last = -1;
  for (const f of i.frames) {
    if (!Number.isInteger(f.tick) || f.tick <= last) fail('input frame ticks must increase strictly');
    if (f.move && (!Array.isArray(f.move) || f.move.length !== 2 || f.move.some(v => Number(v) < -1 || Number(v) > 1))) fail('input move values must be in [-1,1]');
    last = f.tick;
  }
  return i;
}

class Game {
  constructor(seed, scenario) {
    const base = defaults();
    const s = validateScenario(scenario || {});
    this.rng = new RNG(seed);
    this.tick = 0; this.state = 'playing'; this.score = 0; this.invuln = 0; this.pulseCooldown = 0;
    this.player = { ...base.player, ...(s.player || {}), pos: clone((s.player && s.player.pos) || base.player.pos) };
    this.player.carried = num(this.player.carried, 0); this.player.flames = num(this.player.flames, T.flames);
    this.motes = clone(s.motes || base.motes).map((p, n) => ({ id: `M${n + 1}`, pos: clone(p), active: true }));
    this.shades = clone(s.shades || base.shades).map((x, n) => ({ id: x.id || `S${n + 1}`, pos: clone(x.pos), state: x.state || 'chase', stun: 0 }));
    this.lanterns = clone(base.lanterns);
    for (const update of (s.lanterns || [])) { const l = this.lanterns.find(x => x.id === update.id); if (l) Object.assign(l, update); }
    if (s.time_left_s !== undefined) this.timeLeft = num(s.time_left_s, T.night1_duration_s); else this.timeLeft = T.night1_duration_s;
    this.events = [];
    this.input = { move: [0, 0], cam_yaw_deg: 0, jump: false, interact: false, pulse: false };
  }
  emit(name, data) { this.events.push({ type: 'event', tick: this.tick, name, data }); }
  litCount() { return this.lanterns.filter(l => l.lit).length; }
  snapshot() {
    return { type: 'snapshot', tick: this.tick, sim_tick: this.tick, state: this.state,
      time_left_s: round3(this.timeLeft), score: this.score,
      player: { pos: pos3(this.player.pos), flames: this.player.flames, carried: this.player.carried },
      lanterns: this.lanterns.map(l => ({ id: l.id, pos: pos3(l.pos), lit: !!l.lit, deposited: l.deposited })),
      shades: this.shades.map(s => ({ id: s.id, pos: pos3(s.pos), state: s.state })),
      motes_active: this.motes.filter(m => m.active).length,
      motes: this.motes.filter(m => m.active).map(m => ({ id: m.id, pos: pos3(m.pos) })) };
  }
  update(input) {
    if (this.state !== 'playing') return;
    const wasInteract = this.input.interact, wasPulse = this.input.pulse;
    this.input = { ...this.input, ...input };
    const [mx, mz] = normalize(num(this.input.move[0], 0), num(this.input.move[1], 0));
    const yaw = num(this.input.cam_yaw_deg, 0) * Math.PI / 180;
    const wx = mx * Math.cos(yaw) + mz * Math.sin(yaw), wz = -mx * Math.sin(yaw) + mz * Math.cos(yaw);
    this.player.pos[0] += wx * T.player_speed / 60; this.player.pos[2] += wz * T.player_speed / 60;
    if (T.fall_enabled && Math.hypot(this.player.pos[0], this.player.pos[2]) > T.island_radius) {
      this.player.pos[0] *= T.island_radius / Math.hypot(this.player.pos[0], this.player.pos[2]);
      this.player.pos[2] *= T.island_radius / Math.hypot(this.player.pos[0], this.player.pos[2]);
      if (this.invuln <= 0) this.hit('fall');
    }
    for (const m of this.motes) if (m.active && this.player.carried < T.carry_capacity && dist(this.player.pos, m.pos) <= T.pickup_radius) {
      m.active = false; this.player.carried++; this.score += T.score_per_mote; this.emit('mote_picked', { carried: this.player.carried });
    }
    if (this.input.interact && !wasInteract) {
      const l = this.lanterns.find(x => !x.lit && dist(this.player.pos, x.pos) <= T.interact_radius);
      if (l && this.player.carried > 0) {
        const amount = Math.min(this.player.carried, T.lantern_cost - l.deposited); l.deposited += amount; this.player.carried -= amount;
        this.score += amount * T.score_per_mote; this.emit('deposit', { lantern_id: l.id, amount, deposited: l.deposited });
        if (l.deposited >= T.lantern_cost) { l.lit = true; this.score += T.score_per_lantern; this.emit('lantern_lit', { lantern_id: l.id }); }
      }
    }
    if (this.input.pulse && !wasPulse && this.player.flames >= T.pulse_cost && this.pulseCooldown <= 0) {
      this.player.flames -= T.pulse_cost; this.pulseCooldown = T.pulse_cooldown_s;
      const stunned_ids = [];
      for (const s of this.shades) if (dist(this.player.pos, s.pos) <= T.pulse_radius) {
        s.state = 'stunned'; s.stun = T.pulse_stun_s; const dx = s.pos[0] - this.player.pos[0], dz = s.pos[2] - this.player.pos[2], n = Math.hypot(dx, dz) || 1;
        s.pos[0] += dx / n * T.pulse_push_m; s.pos[2] += dz / n * T.pulse_push_m; stunned_ids.push(s.id); this.score += T.score_per_stun;
      }
      this.emit('pulse', { stunned_ids });
    }
    this.pulseCooldown = Math.max(0, this.pulseCooldown - 1 / 60); this.invuln = Math.max(0, this.invuln - 1 / 60);
    for (const s of this.shades) {
      if (s.stun > 0) { s.stun -= 1 / 60; if (s.stun <= 0) s.state = 'chase'; continue; }
      const dx = this.player.pos[0] - s.pos[0], dz = this.player.pos[2] - s.pos[2], n = Math.hypot(dx, dz) || 1;
      const nearLit = this.lanterns.some(l => l.lit && dist(s.pos, l.pos) <= T.safe_radius);
      if (!nearLit) { s.pos[0] += dx / n * T.shade_speed / 60; s.pos[2] += dz / n * T.shade_speed / 60; }
      if (!nearLit && dist(this.player.pos, s.pos) <= T.shade_hit_radius && this.invuln <= 0) this.hit('shade');
    }
    this.timeLeft = Math.max(0, this.timeLeft - 1 / 60);
    if (this.litCount() === 5) { this.state = 'won'; this.score += Math.floor(this.timeLeft) * T.score_per_second_left + this.player.flames * T.score_per_flame_left; this.emit('game_over', { result: 'won', reason: 'all_lit' }); }
    else if (this.player.flames <= 0) { this.state = 'lost'; this.emit('game_over', { result: 'lost', reason: 'no_flames' }); }
    else if (this.timeLeft <= 0) { this.state = 'lost'; this.emit('game_over', { result: 'lost', reason: 'dawn' }); }
  }
  hit(by) {
    this.invuln = T.invuln_s; const dropped = Math.floor(this.player.carried * T.hit_drop_ratio); this.player.carried -= dropped; this.player.flames--;
    this.emit('player_hit', { by, flames: this.player.flames, dropped });
  }
}

function args(argv) { const out = {}; for (let i = 0; i < argv.length; i++) { if (!argv[i].startsWith('--')) continue; const k = argv[i].slice(2); out[k] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; } return out; }
function main() {
  const a = args(process.argv.slice(2));
  if (a.night !== '1' || !a.ticks || !a.out || !a.seed) fail('usage: node game.js --seed <int> --night 1 --ticks <int> --out <file.jsonl> [--scenario file] [--inputs file] [--snapshot-every N]');
  const ticks = Number(a.ticks), interval = Number(a['snapshot-every'] || 10); if (!Number.isInteger(ticks) || ticks < 0 || !Number.isInteger(interval) || interval < 1) fail('ticks and snapshot-every must be positive integers');
  const scenario = a.scenario ? parseJsonFile(a.scenario, 'scenario') : {}; const inputs = a.inputs ? validateInputs(parseJsonFile(a.inputs, 'inputs')) : { frames: [] };
  const game = new Game(a.seed, scenario); const frames = new Map(inputs.frames.map(f => [f.tick, f])); const output = [JSON.stringify(game.snapshot())];
  for (let k = 0; k < ticks && game.state === 'playing'; k++) { const f = frames.get(k); game.tick++; if (f) { const { tick, ...rest } = f; game.update(rest); } else game.update({}); for (const e of game.events.splice(0)) output.push(JSON.stringify(e)); if (game.tick % interval === 0) output.push(JSON.stringify(game.snapshot())); }
  if (game.state === 'playing' && game.timeLeft <= 0) { game.state = 'lost'; game.emit('game_over', { result: 'lost', reason: 'dawn' }); for (const e of game.events.splice(0)) output.push(JSON.stringify(e)); }
  output.push(JSON.stringify({ type: 'end', ticks: game.tick, state: game.state, score: game.score }));
  fs.mkdirSync(path.dirname(path.resolve(a.out)), { recursive: true }); fs.writeFileSync(a.out, output.join('\n') + '\n');
}
if (require.main === module) { try { main(); } catch (e) { if (!process.exitCode) process.exitCode = 2; } }
module.exports = { Game, defaults, T };
