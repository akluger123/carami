<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Drift Game</title>

  <style>
    /* ============================
       BASIC PAGE + CANVAS STYLE
       ============================ */
    body {
      margin: 0;
      overflow: hidden;
      background: #111;
      font-family: Arial, sans-serif;
      color: white;
    }

    #ui {
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(0,0,0,0.5);
      padding: 10px 15px;
      border-radius: 8px;
      font-size: 18px;
    }

    #upgradeMenu {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.6);
      padding: 15px;
      border-radius: 10px;
      width: 220px;
      display: none;
    }

    .upgradeBtn {
      width: 100%;
      margin-top: 8px;
      padding: 8px;
      background: #333;
      border: 1px solid #555;
      color: white;
      cursor: pointer;
      border-radius: 6px;
    }

    .upgradeBtn:hover {
      background: #444;
    }

    #toggleUpgrades {
      position: absolute;
      bottom: 10px;
      left: 10px;
      padding: 10px 15px;
      background: #222;
      border: 1px solid #444;
      border-radius: 8px;
      cursor: pointer;
    }
  </style>
</head>

<body>

  <canvas id="gameCanvas"></canvas>

  <div id="ui">
    Money: <span id="moneyText">0</span><br>
    Speed: <span id="speedText">0</span>
  </div>

  <div id="upgradeMenu">
    <h3>Upgrades</h3>
    <button class="upgradeBtn" onclick="buyUpgrade('engine')">Engine (+speed)</button>
    <button class="upgradeBtn" onclick="buyUpgrade('tires')">Tires (+handling)</button>
    <button class="upgradeBtn" onclick="buyUpgrade('drift')">Drift (+drift control)</button>

    <p id="nextUpgradeText" style="margin-top:10px; color:#0f0;"></p>
  </div>

  <button id="toggleUpgrades" onclick="toggleUpgrades()">Upgrades</button>

  <script>
    /* ============================
       CANVAS SETUP
       ============================ */
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    /* ============================
       GAME VARIABLES
       ============================ */
    let money = 0;
    let speed = 0;
    let angle = 0;
    let x = canvas.width / 2;
    let y = canvas.height / 2;

    const upgrades = {
      engine: 1,
      tires: 1,
      drift: 1
    };

    const upgradeCosts = {
      engine: 50,
      tires: 40,
      drift: 30
    };

    /* ============================
       INPUT HANDLING
       ============================ */
    const keys = {};
    document.addEventListener("keydown", e => keys[e.key] = true);
    document.addEventListener("keyup", e => keys[e.key] = false);

    /* ============================
       GAME LOOP
       ============================ */
    function update() {
      // Movement
      if (keys["ArrowUp"]) speed += 0.2 * upgrades.engine;
      if (keys["ArrowDown"]) speed -= 0.1;

      speed *= 0.98; // friction

      if (keys["ArrowLeft"]) angle -= 0.05 * upgrades.tires;
      if (keys["ArrowRight"]) angle += 0.05 * upgrades.tires;

      x += Math.cos(angle) * speed;
      y += Math.sin(angle) * speed;

      // Money gain (simple placeholder)
      money += Math.abs(speed) * 0.05;

      draw();
      updateUI();
      requestAnimationFrame(update);
    }

    /* ============================
       DRAWING
       ============================ */
    function draw() {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.fillStyle = "red";
      ctx.fillRect(-20, -10, 40, 20);

      ctx.restore();
    }

    /* ============================
       UPGRADE SYSTEM
       ============================ */
    function buyUpgrade(type) {
      if (money >= upgradeCosts[type]) {
        money -= upgradeCosts[type];
        upgrades[type]++;
        upgradeCosts[type] = Math.floor(upgradeCosts[type] * 1.5);
        updateNextUpgrade();
      }
    }

    /* ============================
       NEXT UPGRADE RECOMMENDER
       ============================ */
    function updateNextUpgrade() {
      let cheapest = null;
      let cheapestCost = Infinity;

      for (let u in upgradeCosts) {
        if (upgradeCosts[u] < cheapestCost) {
          cheapest = u;
          cheapestCost = upgradeCosts[u];
        }
      }

      document.getElementById("nextUpgradeText").innerText =
        "Next recommended: " + cheapest + " (" + cheapestCost + ")";
    }

    updateNextUpgrade();

    /* ============================
       UI
       ============================ */
    function updateUI() {
      document.getElementById("moneyText").innerText = Math.floor(money);
      document.getElementById("speedText").innerText = speed.toFixed(1);
    }

    function toggleUpgrades() {
      const menu = document.getElementById("upgradeMenu");
      menu.style.display = menu.style.display === "none" ? "block" : "none";
    }

    update();
  </script>

</body>
</html>
