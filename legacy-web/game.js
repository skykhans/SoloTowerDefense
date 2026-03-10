const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const STORAGE_KEYS = {
  bestWave: "solo-td-best-wave",
};

const TOWERS = {
  rapid: {
    name: "速射塔",
    cost: 70,
    color: "#7dd3fc",
    core: "#e0f2fe",
    base: { range: 118, fireRate: 0.35, damage: 12 },
  },
  cannon: {
    name: "重炮塔",
    cost: 110,
    color: "#38bdf8",
    core: "#dbeafe",
    base: { range: 155, fireRate: 1.05, damage: 42 },
  },
  frost: {
    name: "减速塔",
    cost: 95,
    color: "#8b5cf6",
    core: "#ede9fe",
    base: { range: 132, fireRate: 0.9, damage: 8, slowFactor: 0.55, slowDuration: 1.8 },
  },
};

const ui = {
  lives: document.getElementById("lives"),
  gold: document.getElementById("gold"),
  wave: document.getElementById("wave"),
  kills: document.getElementById("kills"),
  enemies: document.getElementById("enemies"),
  speedText: document.getElementById("speedText"),
  bestWave: document.getElementById("bestWave"),
  waveInfo: document.getElementById("waveInfo"),
  waveProgressBar: document.getElementById("waveProgressBar"),
  message: document.getElementById("message"),
  buildModeText: document.getElementById("buildModeText"),
  skillInfo: document.getElementById("skillInfo"),
  towerInfo: document.getElementById("towerInfo"),
  buildRapidBtn: document.getElementById("buildRapidBtn"),
  buildCannonBtn: document.getElementById("buildCannonBtn"),
  buildFrostBtn: document.getElementById("buildFrostBtn"),
  cancelBuildBtn: document.getElementById("cancelBuildBtn"),
  airstrikeBtn: document.getElementById("airstrikeBtn"),
  startBtn: document.getElementById("startBtn"),
  speedBtn: document.getElementById("speedBtn"),
  pauseBtn: document.getElementById("pauseBtn"),
  restartBtn: document.getElementById("restartBtn"),
  upgradeBtn: document.getElementById("upgradeBtn"),
  sellBtn: document.getElementById("sellBtn"),
  resultPanel: document.getElementById("resultPanel"),
  resultTitle: document.getElementById("resultTitle"),
  resultSummary: document.getElementById("resultSummary"),
  resultRestartBtn: document.getElementById("resultRestartBtn"),
};

const path = [
  { x: -20, y: 120 },
  { x: 160, y: 120 },
  { x: 160, y: 300 },
  { x: 390, y: 300 },
  { x: 390, y: 180 },
  { x: 620, y: 180 },
  { x: 620, y: 360 },
  { x: 860, y: 360 },
  { x: 940, y: 360 },
];

const buildSpots = [
  { x: 100, y: 220, occupied: false },
  { x: 260, y: 200, occupied: false },
  { x: 310, y: 380, occupied: false },
  { x: 450, y: 90, occupied: false },
  { x: 540, y: 270, occupied: false },
  { x: 700, y: 120, occupied: false },
  { x: 760, y: 300, occupied: false },
  { x: 810, y: 460, occupied: false },
];

const state = {
  lives: 20,
  gold: 120,
  wave: 1,
  kills: 0,
  enemies: [],
  towers: [],
  bullets: [],
  placingType: null,
  selectedTower: null,
  spawnQueue: 0,
  spawnTimer: 0,
  waveActive: false,
  gameOver: false,
  speedMultiplier: 1,
  paused: false,
  waveTotal: 0,
  bossSpawnedThisWave: false,
  bestWave: 1,
  airstrikeCooldown: 0,
  airstrikeMaxCooldown: 18,
};

function setMessage(text, kind = "") {
  ui.message.textContent = text;
  ui.message.className = `message ${kind}`;
}

function loadBestWave() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.bestWave);
    const value = Number(raw);
    return Number.isFinite(value) && value >= 1 ? value : 1;
  } catch {
    return 1;
  }
}

function saveBestWave() {
  try {
    window.localStorage.setItem(STORAGE_KEYS.bestWave, String(state.bestWave));
  } catch {
    // Ignore storage failures in local preview mode.
  }
}

function updateBestWave(candidate) {
  if (candidate <= state.bestWave) return;
  state.bestWave = candidate;
  saveBestWave();
}

function getUpgradeCost(tower) {
  return Math.round(tower.type.cost * 0.55 + tower.level * 24);
}

function getWaveProfile(wave) {
  const total = 7 + wave * 2;
  const fast = wave >= 2 ? Math.max(1, Math.floor(total * 0.28)) : 0;
  const heavy = wave >= 4 ? Math.max(1, Math.floor(total * 0.18)) : 0;
  const boss = wave > 0 && wave % 5 === 0 ? 1 : 0;
  const normal = Math.max(0, total - fast - heavy - boss);
  return { total, normal, fast, heavy, boss };
}

function updateWaveInfo() {
  const profile = getWaveProfile(state.wave);
  const segments = [`普通 ${profile.normal}`];
  if (profile.fast) segments.push(`快速 ${profile.fast}`);
  if (profile.heavy) segments.push(`重甲 ${profile.heavy}`);
  if (profile.boss) segments.push("Boss 1");

  if (state.waveActive) {
    const spawned = state.waveTotal - state.spawnQueue;
    ui.waveInfo.textContent = `第 ${state.wave} 波进行中：已出兵 ${spawned}/${state.waveTotal}，场上剩余 ${state.enemies.length}。`;
    const progress = state.waveTotal === 0 ? 0 : Math.min(100, (spawned / state.waveTotal) * 100);
    ui.waveProgressBar.style.width = `${progress}%`;
    return;
  }

  ui.waveInfo.textContent = `下一波预计 ${profile.total} 个敌人：${segments.join(" / ")}。`;
  ui.waveProgressBar.style.width = "0%";
}

function updateBuildModeText() {
  if (!state.placingType) {
    ui.buildModeText.textContent = "当前未选择建造模式。";
    return;
  }
  ui.buildModeText.textContent = `当前建造：${state.placingType.name}，点击绿色建造位放置。`;
}

function updateSkillInfo() {
  if (state.airstrikeCooldown > 0) {
    const remaining = state.airstrikeCooldown.toFixed(1);
    ui.skillInfo.textContent = `空袭：对全场敌人造成高额打击，冷却剩余 ${remaining} 秒。`;
    ui.airstrikeBtn.textContent = `空袭（${remaining}s）`;
    ui.airstrikeBtn.disabled = true;
    return;
  }

  ui.skillInfo.textContent = "空袭：对全场敌人造成高额打击并压低 Boss 血量。";
  ui.airstrikeBtn.textContent = "释放空袭";
  ui.airstrikeBtn.disabled = state.gameOver || state.paused;
}

function showResultPanel(title, summary) {
  ui.resultTitle.textContent = title;
  ui.resultSummary.textContent = summary;
  ui.resultPanel.classList.remove("hidden");
}

function hideResultPanel() {
  ui.resultPanel.classList.add("hidden");
}

function updateTowerPanel() {
  if (!state.selectedTower) {
    ui.towerInfo.textContent = "点击已建造炮塔查看详情。";
    ui.upgradeBtn.disabled = true;
    ui.sellBtn.disabled = true;
    ui.upgradeBtn.textContent = "升级";
    return;
  }

  const tower = state.selectedTower;
  const cost = getUpgradeCost(tower);
  const extras = tower.slowFactor ? ` | 减速 ${Math.round((1 - tower.slowFactor) * 100)}%` : "";
  ui.towerInfo.textContent = `${tower.type.name} Lv.${tower.level} | 伤害 ${tower.damage} | 射程 ${Math.round(tower.range)}${extras} | 升级花费 ${cost}`;
  ui.upgradeBtn.textContent = `升级（${cost}）`;
  ui.upgradeBtn.disabled = state.gold < cost || state.gameOver;
  ui.sellBtn.disabled = state.gameOver;
}

function updateUI() {
  ui.lives.textContent = state.lives;
  ui.gold.textContent = state.gold;
  ui.wave.textContent = state.wave;
  ui.kills.textContent = state.kills;
  ui.enemies.textContent = state.enemies.length;
  ui.speedText.textContent = `${state.speedMultiplier}x${state.paused ? "（暂停）" : ""}`;
  ui.bestWave.textContent = state.bestWave;
  ui.cancelBuildBtn.disabled = !state.placingType || state.gameOver;

  const buildDisabled = state.gameOver;
  ui.buildRapidBtn.disabled = buildDisabled;
  ui.buildCannonBtn.disabled = buildDisabled;
  ui.buildFrostBtn.disabled = buildDisabled;
  ui.startBtn.disabled = state.waveActive || state.gameOver;
  ui.speedBtn.disabled = state.gameOver;
  ui.pauseBtn.disabled = state.gameOver;
  ui.pauseBtn.textContent = state.paused ? "继续" : "暂停";

  updateBuildModeText();
  updateWaveInfo();
  updateSkillInfo();
  updateTowerPanel();
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getEnemySpec(wave, forceBoss = false) {
  if (forceBoss) {
    return {
      hpFactor: 4.8,
      speedFactor: 0.74,
      rewardBonus: 32,
      color: "#ffd166",
      radius: 21,
      lifeDamage: 4,
      isBoss: true,
    };
  }
  const roll = Math.random();
  if (wave >= 4 && roll < 0.16) {
    return {
      hpFactor: 2.25,
      speedFactor: 0.78,
      rewardBonus: 12,
      color: "#b794f4",
      radius: 17,
      lifeDamage: 2,
      isBoss: false,
    };
  }
  if (wave >= 2 && roll < 0.42) {
    return {
      hpFactor: 0.85,
      speedFactor: 1.52,
      rewardBonus: 6,
      color: "#ff4d6d",
      radius: 12,
      lifeDamage: 1,
      isBoss: false,
    };
  }
  return {
    hpFactor: 1,
    speedFactor: 1,
    rewardBonus: 0,
    color: "#ff9f1c",
    radius: 14,
    lifeDamage: 1,
    isBoss: false,
  };
}

function spawnEnemy() {
  const hpBase = 34 + state.wave * 9;
  const speedBase = 45 + state.wave * 5;
  const forceBoss = state.wave % 5 === 0 && !state.bossSpawnedThisWave && state.spawnQueue === 0;
  const spec = getEnemySpec(state.wave, forceBoss);
  const hp = Math.round(hpBase * spec.hpFactor);
  if (spec.isBoss) {
    state.bossSpawnedThisWave = true;
  }
  state.enemies.push({
    x: path[0].x,
    y: path[0].y,
    speed: speedBase * spec.speedFactor,
    baseSpeed: speedBase * spec.speedFactor,
    hp,
    maxHp: hp,
    waypoint: 1,
    reward: 12 + Math.floor(state.wave * 1.8) + spec.rewardBonus,
    color: spec.color,
    radius: spec.radius,
    lifeDamage: spec.lifeDamage,
    isBoss: spec.isBoss,
    slowTimer: 0,
    slowFactor: 1,
  });
}

function startWave() {
  if (state.waveActive || state.gameOver) return;
  state.waveActive = true;
  state.spawnQueue = 7 + state.wave * 2;
  state.waveTotal = state.spawnQueue;
  state.spawnTimer = 0;
  state.bossSpawnedThisWave = false;
  setMessage(`第 ${state.wave} 波来袭！`, "ok");
}

function restart() {
  state.lives = 20;
  state.gold = 120;
  state.wave = 1;
  state.kills = 0;
  state.enemies = [];
  state.towers = [];
  state.bullets = [];
  state.placingType = null;
  state.selectedTower = null;
  state.spawnQueue = 0;
  state.spawnTimer = 0;
  state.waveActive = false;
  state.gameOver = false;
  state.speedMultiplier = 1;
  state.paused = false;
  state.waveTotal = 0;
  state.bossSpawnedThisWave = false;
  state.airstrikeCooldown = 3;
  for (const spot of buildSpots) spot.occupied = false;
  hideResultPanel();
  setMessage("准备就绪，点击开始波次。", "ok");
}

function enterBuildMode(typeKey) {
  if (state.gameOver) return;
  const type = TOWERS[typeKey];
  state.placingType = type;
  state.selectedTower = null;
  setMessage(`已选择 ${type.name}，请点击绿色建造位。`, "ok");
}

function buildTower(spot) {
  const type = state.placingType;
  if (!type) return;
  if (state.gold < type.cost) {
    setMessage("金币不足。", "danger");
    return;
  }
  if (spot.occupied) {
    setMessage("该位置已建造炮塔。", "danger");
    return;
  }

  const tower = {
    x: spot.x,
    y: spot.y,
    spot,
    type,
    level: 1,
    range: type.base.range,
    fireRate: type.base.fireRate,
    cooldown: 0,
    damage: type.base.damage,
    spentGold: type.cost,
    slowFactor: type.base.slowFactor ?? 1,
    slowDuration: type.base.slowDuration ?? 0,
  };

  state.gold -= type.cost;
  spot.occupied = true;
  state.towers.push(tower);
  state.selectedTower = tower;
  state.placingType = null;
  setMessage(`${type.name} 建造完成。`, "ok");
}

function cancelBuildMode(showMessage = true) {
  if (!state.placingType) return;
  state.placingType = null;
  if (showMessage) {
    setMessage("已取消建造模式。", "");
  }
}

function castAirstrike() {
  if (state.gameOver || state.paused || state.airstrikeCooldown > 0) return;
  if (state.enemies.length === 0) {
    setMessage("当前没有可空袭的敌人。", "danger");
    return;
  }

  for (const enemy of state.enemies) {
    const ratio = enemy.isBoss ? 0.28 : 0.6;
    enemy.hp -= Math.max(20, Math.round(enemy.maxHp * ratio));
  }
  state.airstrikeCooldown = state.airstrikeMaxCooldown;
  setMessage("空袭已命中，全场敌人受到重创。", "ok");
}

function upgradeTower() {
  const tower = state.selectedTower;
  if (!tower || state.gameOver) return;
  const cost = getUpgradeCost(tower);
  if (state.gold < cost) {
    setMessage("金币不足，无法升级。", "danger");
    return;
  }

  state.gold -= cost;
  tower.spentGold += cost;
  tower.level += 1;
  tower.damage = Math.round(tower.damage * 1.24);
  tower.range += 8;
  tower.fireRate = Math.max(0.22, tower.fireRate * 0.93);
  if (tower.slowFactor < 1) {
    tower.slowFactor = Math.max(0.3, tower.slowFactor - 0.04);
    tower.slowDuration += 0.12;
  }
  setMessage(`${tower.type.name} 升级到 Lv.${tower.level}。`, "ok");
}

function sellTower() {
  const tower = state.selectedTower;
  if (!tower || state.gameOver) return;
  const refund = Math.round(tower.spentGold * 0.7);
  state.gold += refund;
  tower.spot.occupied = false;
  state.towers = state.towers.filter((t) => t !== tower);
  state.selectedTower = null;
  setMessage(`出售炮塔，返还 ${refund} 金币。`, "ok");
}

function pickTower(x, y) {
  return state.towers.find((tower) => distance({ x, y }, tower) < 24);
}

function updateGame(dt) {
  if (state.gameOver || state.paused) return;

  state.airstrikeCooldown = Math.max(0, state.airstrikeCooldown - dt);

  if (state.waveActive && state.spawnQueue > 0) {
    state.spawnTimer -= dt;
    if (state.spawnTimer <= 0) {
      state.spawnTimer = 0.58;
      state.spawnQueue -= 1;
      spawnEnemy();
    }
  }

  for (const enemy of state.enemies) {
    enemy.slowTimer = Math.max(0, enemy.slowTimer - dt);
    enemy.slowFactor = enemy.slowTimer > 0 ? enemy.slowFactor : 1;
    const target = path[enemy.waypoint];
    if (!target) continue;
    const dx = target.x - enemy.x;
    const dy = target.y - enemy.y;
    const len = Math.hypot(dx, dy);
    if (len < 2) {
      enemy.waypoint += 1;
      continue;
    }
    const currentSpeed = enemy.baseSpeed * enemy.slowFactor;
    enemy.x += (dx / len) * currentSpeed * dt;
    enemy.y += (dy / len) * currentSpeed * dt;
  }

  for (let i = state.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = state.enemies[i];
    if (enemy.waypoint >= path.length) {
      state.enemies.splice(i, 1);
      state.lives -= enemy.lifeDamage;
      if (state.lives <= 0) {
        state.gameOver = true;
        state.paused = false;
        updateBestWave(state.wave);
        showResultPanel(
          "防线失守",
          `你坚持到了第 ${state.wave} 波，累计击杀 ${state.kills}，最终最佳记录为第 ${state.bestWave} 波。`
        );
        setMessage("游戏结束，点击重新开始。", "danger");
        return;
      }
    }
  }

  for (const tower of state.towers) {
    tower.cooldown -= dt;
    if (tower.cooldown > 0) continue;

    let target = null;
    let furthest = -1;
    for (const enemy of state.enemies) {
      if (distance(tower, enemy) > tower.range) continue;
      if (enemy.waypoint > furthest) {
        furthest = enemy.waypoint;
        target = enemy;
      }
    }

    if (target) {
      tower.cooldown = tower.fireRate;
      state.bullets.push({
        x: tower.x,
        y: tower.y,
        target,
        speed: tower.type === TOWERS.cannon ? 300 : 410,
        damage: tower.damage,
        splash: tower.type === TOWERS.cannon ? 42 : 0,
        isCannon: tower.type === TOWERS.cannon,
        slowFactor: tower.slowFactor,
        slowDuration: tower.slowDuration,
        color: tower.type === TOWERS.frost ? "#c4b5fd" : null,
      });
    }
  }

  for (let i = state.bullets.length - 1; i >= 0; i -= 1) {
    const bullet = state.bullets[i];
    if (!state.enemies.includes(bullet.target)) {
      state.bullets.splice(i, 1);
      continue;
    }
    const dx = bullet.target.x - bullet.x;
    const dy = bullet.target.y - bullet.y;
    const len = Math.hypot(dx, dy);
    const step = bullet.speed * dt;
    if (len <= step) {
      bullet.target.hp -= bullet.damage;
      if (bullet.slowFactor < 1) {
        bullet.target.slowFactor = Math.min(bullet.target.slowFactor, bullet.slowFactor);
        bullet.target.slowTimer = Math.max(bullet.target.slowTimer, bullet.slowDuration);
      }
      if (bullet.splash > 0) {
        for (const enemy of state.enemies) {
          if (enemy === bullet.target) continue;
          if (distance(enemy, bullet.target) <= bullet.splash) {
            enemy.hp -= Math.round(bullet.damage * 0.45);
          }
        }
      }
      state.bullets.splice(i, 1);
    } else {
      bullet.x += (dx / len) * step;
      bullet.y += (dy / len) * step;
    }
  }

  for (let i = state.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = state.enemies[i];
    if (enemy.hp <= 0) {
      state.enemies.splice(i, 1);
      state.gold += enemy.reward;
      state.kills += 1;
    }
  }

  if (state.waveActive && state.spawnQueue === 0 && state.enemies.length === 0) {
    updateBestWave(state.wave);
    state.wave += 1;
    state.waveActive = false;
    state.waveTotal = 0;
    setMessage(`成功守住！准备第 ${state.wave} 波。`, "ok");
  }
}

function drawPath() {
  ctx.strokeStyle = "#867b6f";
  ctx.lineWidth = 42;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i += 1) ctx.lineTo(path[i].x, path[i].y);
  ctx.stroke();

  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i += 1) ctx.lineTo(path[i].x, path[i].y);
  ctx.stroke();
}

function draw() {
  ctx.fillStyle = "#1a2540";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawPath();

  for (const spot of buildSpots) {
    ctx.fillStyle = spot.occupied ? "#2b355a" : "rgba(76, 217, 100, 0.25)";
    ctx.fillRect(spot.x - 28, spot.y - 28, 56, 56);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.strokeRect(spot.x - 28, spot.y - 28, 56, 56);
  }

  for (const tower of state.towers) {
    const selected = tower === state.selectedTower;
    if (selected) {
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = tower.type.color;
    ctx.beginPath();
    ctx.arc(tower.x, tower.y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = tower.type.core;
    ctx.beginPath();
    ctx.arc(tower.x, tower.y, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#dff3ff";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`L${tower.level}`, tower.x, tower.y + 35);
  }

  for (const enemy of state.enemies) {
    ctx.fillStyle = enemy.color;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
    ctx.fill();

    if (enemy.slowTimer > 0) {
      ctx.strokeStyle = "rgba(196, 181, 253, 0.95)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.radius + 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (enemy.isBoss) {
      ctx.strokeStyle = "rgba(255, 243, 176, 0.95)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.radius + 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    const barW = 28;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(enemy.x - barW / 2, enemy.y - enemy.radius - 13, barW, 5);
    ctx.fillStyle = "#ff3b30";
    ctx.fillRect(enemy.x - barW / 2, enemy.y - enemy.radius - 13, barW * Math.max(0, enemy.hp / enemy.maxHp), 5);
  }

  for (const bullet of state.bullets) {
    ctx.fillStyle = bullet.color ?? (bullet.isCannon ? "#ffd166" : "#ffe066");
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.isCannon ? 5 : 4, 0, Math.PI * 2);
    ctx.fill();
  }

  if (state.placingType) {
    ctx.fillStyle = "rgba(90, 200, 250, 0.14)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (state.paused && !state.gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("已暂停", canvas.width / 2, canvas.height / 2);
  }
}

ui.buildRapidBtn.addEventListener("click", () => enterBuildMode("rapid"));
ui.buildCannonBtn.addEventListener("click", () => enterBuildMode("cannon"));
ui.buildFrostBtn.addEventListener("click", () => enterBuildMode("frost"));
ui.cancelBuildBtn.addEventListener("click", () => cancelBuildMode());
ui.airstrikeBtn.addEventListener("click", castAirstrike);
ui.startBtn.addEventListener("click", startWave);
ui.restartBtn.addEventListener("click", restart);
ui.resultRestartBtn.addEventListener("click", restart);
ui.upgradeBtn.addEventListener("click", upgradeTower);
ui.sellBtn.addEventListener("click", sellTower);
ui.speedBtn.addEventListener("click", () => {
  state.speedMultiplier = state.speedMultiplier === 1 ? 2 : 1;
});
ui.pauseBtn.addEventListener("click", () => {
  state.paused = !state.paused;
});

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    state.paused = !state.paused;
    return;
  }
  if (event.key === "Escape") {
    cancelBuildMode();
    return;
  }
  if (event.key.toLowerCase() === "b") enterBuildMode("rapid");
  if (event.key.toLowerCase() === "n") enterBuildMode("cannon");
  if (event.key.toLowerCase() === "m") enterBuildMode("frost");
});

canvas.addEventListener("click", (event) => {
  if (state.gameOver) return;
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  const y = ((event.clientY - rect.top) / rect.height) * canvas.height;

  if (state.placingType) {
    const spot = buildSpots.find((s) => Math.abs(s.x - x) < 30 && Math.abs(s.y - y) < 30);
    if (!spot) {
      setMessage("请点击绿色建造位。", "danger");
      return;
    }
    buildTower(spot);
    return;
  }

  const picked = pickTower(x, y);
  if (picked) {
    state.selectedTower = picked;
    setMessage(`已选中 ${picked.type.name} Lv.${picked.level}。`, "ok");
  } else {
    state.selectedTower = null;
    setMessage("已取消选中炮塔。", "");
  }
});

let lastTime = performance.now();
function tick(now) {
  const baseDt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;
  updateGame(baseDt * state.speedMultiplier);
  updateUI();
  draw();
  requestAnimationFrame(tick);
}

restart();
state.bestWave = loadBestWave();
requestAnimationFrame(tick);
