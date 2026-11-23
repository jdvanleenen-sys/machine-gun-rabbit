/* The louder room: glow, floor light, smoke, stage gear, live tickets, a working jukebox and crowd hype. */
(function () {
  'use strict';
  var PINK = 0xff1493, GOLD = 0xc9a227;

  function canvasTexture(w, h, draw) {
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    return new THREE.CanvasTexture(c);
  }
  function mesh(parent, geo, color, x, y, z) {
    var m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: color }));
    m.position.set(x, y, z); parent.add(m);
    return m;
  }
  function additive(map, color, opacity) {
    return new THREE.MeshBasicMaterial({ map: map, color: color, transparent: true, opacity: opacity, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
  }

  function addPools(world) {
    var geo = new THREE.CircleGeometry(2.5, 28);
    return world.beams.map(function (beam) {
      var pool = new THREE.Mesh(geo, additive(world.soft, beam.material.uniforms.color.value.getHex(), .34));
      pool.rotation.x = -Math.PI / 2; pool.renderOrder = 6; world.scene.add(pool);
      return { beam: beam, pool: pool };
    });
  }

  function addReflections(world) {
    var fade = canvasTexture(16, 128, function (g, w, h) {
      var r = g.createLinearGradient(0, h, 0, 0); r.addColorStop(0, '#fff'); r.addColorStop(1, '#000');
      g.fillStyle = r; g.fillRect(0, 0, w, h);
    });
    world.wallTextures.forEach(function (tex, i) {
      var geo = new THREE.PlaneGeometry(6.6, 9), uv = geo.attributes.uv;
      for (var n = 0; n < uv.count; n++) uv.setY(n, 1 - uv.getY(n));
      var mat = new THREE.MeshBasicMaterial({ map: tex, alphaMap: fade, transparent: true, opacity: .3, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
      var floor = new THREE.Mesh(geo, mat);
      floor.rotation.x = -Math.PI / 2; floor.position.set(-9.6 + i * 9.6, 1.23, -10.9); floor.renderOrder = 5; world.scene.add(floor);
    });
  }

  function addSmoke(world, count) {
    var puffs = [];
    for (var i = 0; i < count; i++) {
      var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: world.soft, color: i % 2 ? 0xb58cff : 0xffb3dd, transparent: true, opacity: .1, depthWrite: false, fog: false }));
      var size = 4 + Math.random() * 4; s.scale.set(size * 1.7, size * .62, 1);
      s.position.set(-15 + Math.random() * 30, 1.5 + Math.random() * .6, -2.2 - Math.random() * 7);
      s.renderOrder = 36; s.userData = { x: s.position.x, phase: Math.random() * 6.28 };
      world.scene.add(s); puffs.push(s);
    }
    return puffs;
  }

  function addGear(world) {
    var scene = world.scene, wedge = new THREE.BoxGeometry(1.7, .62, 1.05), amp = new THREE.BoxGeometry(2.3, 1.5, 1);
    [-7.4, -2.6, 2.6, 7.4].forEach(function (x) { mesh(scene, wedge, 0x09080b, x, 1.5, -2).rotation.x = -.5; });
    [[-10.7, 1.95], [-10.7, 3.45], [11.1, 1.95], [11.1, 3.45]].forEach(function (a) {
      mesh(scene, amp, 0x0d0c0f, a[0], a[1], -10);
      mesh(scene, new THREE.PlaneGeometry(1.9, 1.15), 0x1c171d, a[0], a[1], -9.49);
    });
    mesh(scene, new THREE.BoxGeometry(8.1, .07, .07), PINK, .9, 2.32, -9.46);
    [-17, 17].forEach(function (x) { mesh(scene, new THREE.BoxGeometry(.5, 15, .5), 0x242424, x, 7.5, -2); mesh(scene, new THREE.BoxGeometry(.5, 15, .5), 0x242424, x, 7.5, -13); });
    [['NOT FAMOUS...', -28.7, Math.PI / 2, '#ff1493'], ['BUT KNOWN.', 28.7, -Math.PI / 2, '#ffd34d']].forEach(function (s) {
      var map = canvasTexture(1024, 220, function (g, w, h) {
        g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '150px Anton, Impact, sans-serif';
        g.shadowColor = s[3]; g.shadowBlur = 34; g.fillStyle = s[3]; g.fillText(s[0], w / 2, h / 2); g.shadowBlur = 8; g.fillStyle = '#fff5fb'; g.fillText(s[0], w / 2, h / 2);
      });
      var sign = new THREE.Mesh(new THREE.PlaneGeometry(13, 2.8), new THREE.MeshBasicMaterial({ map: map, transparent: true, depthWrite: false, fog: false }));
      sign.position.set(s[1], 9.3, -12); sign.rotation.y = s[2]; scene.add(sign);
    });
  }

  function addTickets(world) {
    var rows = document.querySelectorAll('#shows .tickets .ticket'), spots = [[-23.2, 4.1, 6.3], [-22.9, 2.42, 4.9]], tickets = [];
    Array.prototype.forEach.call(rows, function (row, i) {
      if (!spots[i]) return;
      var date = row.querySelector('.t-date').textContent, venue = row.querySelector('.t-venue').textContent, time = row.querySelector('.t-time').textContent;
      var map = canvasTexture(768, 320, function (g, w, h) {
        g.fillStyle = i ? '#f4e2ac' : '#ffd34d'; g.fillRect(0, 0, w, h); g.strokeStyle = '#0a0a0a'; g.lineWidth = 8; g.strokeRect(14, 14, w - 28, h - 28);
        g.setLineDash([12, 10]); g.beginPath(); g.moveTo(590, 14); g.lineTo(590, h - 14); g.stroke(); g.setLineDash([]);
        g.fillStyle = '#c4006f'; g.font = '38px Anton, Impact, sans-serif'; g.fillText(date.toUpperCase(), 40, 78);
        g.fillStyle = '#0a0a0a'; var size = 76; g.font = size + 'px Anton, Impact, sans-serif';
        while (g.measureText(venue.toUpperCase()).width > 530) { size -= 3; g.font = size + 'px Anton, Impact, sans-serif'; }
        g.fillText(venue.toUpperCase(), 40, 178); g.font = '34px Anton, Impact, sans-serif'; g.fillText(time, 40, 254);
        g.save(); g.translate(680, h / 2); g.rotate(-Math.PI / 2); g.textAlign = 'center'; g.font = '42px Anton, Impact, sans-serif'; g.fillText('ADMIT YOU', 0, 14); g.restore();
      });
      var face = new THREE.MeshBasicMaterial({ map: map, fog: false }), edge = new THREE.MeshBasicMaterial({ color: 0x8a6d17, fog: false });
      var t = new THREE.Mesh(new THREE.BoxGeometry(3.9, 1.63, .07), [edge, edge, edge, edge, face, face]);
      t.visible = window.innerWidth >= 760; t.position.fromArray(spots[i]); t.userData = { y: spots[i][1], phase: i * 2.2 }; world.scene.add(t); tickets.push(t);
    });
    return tickets;
  }

  function addJukeboxParts(world) {
    var g = world.juke.neon.parent, disc = new THREE.Group();
    var groove = canvasTexture(256, 256, function (c, w) {
      c.fillStyle = '#060606'; c.fillRect(0, 0, w, w); c.strokeStyle = '#2b2b2b';
      for (var r = 40; r < 126; r += 5) { c.beginPath(); c.arc(w / 2, w / 2, r, 0, Math.PI * 2); c.stroke(); }
      c.fillStyle = '#ff1493'; c.beginPath(); c.arc(w / 2, w / 2, 40, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#ffd34d'; c.fillRect(w / 2 - 34, w / 2 - 5, 68, 10); c.fillStyle = '#000'; c.beginPath(); c.arc(w / 2, w / 2, 5, 0, Math.PI * 2); c.fill();
    });
    disc.add(new THREE.Mesh(new THREE.CircleGeometry(1.38, 40), new THREE.MeshBasicMaterial({ map: groove, fog: false })));
    disc.position.set(0, 2.25, 1.8); g.add(disc);
    var count = 26, bubbles = new THREE.InstancedMesh(new THREE.SphereGeometry(.075, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffd34d, fog: false }), count), seeds = [];
    bubbles.frustumCulled = false; g.add(bubbles);
    [-2.42, 2.42].forEach(function (x) { mesh(g, new THREE.CylinderGeometry(.17, .17, 6.6, 12), 0x3b0d29, x, 3.8, 1.72); });
    for (var i = 0; i < count; i++) seeds.push({ x: i % 2 ? -2.42 : 2.42, off: Math.random() * 6.6, speed: .8 + Math.random() * .9 });
    return { disc: disc, bubbles: bubbles, seeds: seeds };
  }

  function addBloom(world) {
    var ok = THREE.EffectComposer && THREE.RenderPass && THREE.UnrealBloomPass;
    if (world.low || !ok) return null;
    var size = world.renderer.getDrawingBufferSize(new THREE.Vector2()), composer = new THREE.EffectComposer(world.renderer);
    composer.addPass(new THREE.RenderPass(world.scene, world.camera));
    composer.addPass(new THREE.UnrealBloomPass(size, .42, .62, .72));
    return composer;
  }

  window.MGRFx = function (world, low, burst) {
    var pools = addPools(world), smoke = addSmoke(world, low ? 9 : 22), tickets = addTickets(world), juke = addJukeboxParts(world), composer = addBloom(world);
    addReflections(world); addGear(world);
    var hype = 0, shots = [], hit = new THREE.Vector3(), dir = new THREE.Vector3(), m = new THREE.Matrix4(), meter = document.getElementById('hypeFill'), tag = document.getElementById('hypeLabel');
    var neon = new THREE.Color(), cannons = [[-15, 2.4, -3], [-11.5, 2, -1.5], [11.5, 2, -1.5], [15, 2.4, -3]];

    function drop() {
      hype = 0; world.hit = 1; tag.textContent = "Now that's a crowd.";
      setTimeout(function () { tag.textContent = 'Crowd noise'; }, 2600);
      world.members.forEach(function (b) { if (b) b.userData.jump = 1; });
      for (var i = 0; i < 6; i++) shots.push(i * .2);
    }
    function updateLights(t) {
      pools.forEach(function (p) {
        dir.set(0, -1, 0).applyEuler(p.beam.rotation);
        var floor = Math.abs(p.beam.position.x + dir.x * 12) < 15 ? 1.26 : .03;
        hit.copy(p.beam.position).addScaledVector(dir, (floor - p.beam.position.y) / dir.y);
        p.pool.position.copy(hit);
        p.pool.material.opacity = .26 + Math.max(0, Math.sin(t * 13.4)) * .05 + hype * .12;
      });
      smoke.forEach(function (s) { s.position.x = s.userData.x + Math.sin(t * .2 + s.userData.phase) * 2.2; s.material.opacity = .08 + Math.sin(t * .4 + s.userData.phase) * .03; });
    }
    function updateProps(t) {
      tickets.forEach(function (k) { k.position.y = k.userData.y + Math.sin(t * .9 + k.userData.phase) * .2; k.rotation.y = 1.22 + Math.sin(t * .55 + k.userData.phase) * .3; k.rotation.z = Math.sin(t * .7 + k.userData.phase) * .08; });
      juke.disc.rotation.z = -t * 2.2;
      juke.seeds.forEach(function (b, i) { m.makeTranslation(b.x, .55 + (t * b.speed + b.off) % 6.6, 1.72 + .14); juke.bubbles.setMatrixAt(i, m); });
      juke.bubbles.instanceMatrix.needsUpdate = true;
      world.juke.neon.material.color.copy(neon.setHex(PINK).lerp(new THREE.Color(GOLD), (Math.sin(t * 1.1) + 1) * .32));
    }
    function updateHype(dt) {
      hype = Math.max(0, hype - dt * .035);
      meter.style.transform = 'scaleX(' + hype.toFixed(3) + ')';
      world.crowd.forEach(function (r, i) { r.position.y += Math.abs(Math.sin(performance.now() / 150 + i)) * hype * .55; });
      for (var i = shots.length - 1; i >= 0; i--) {
        shots[i] -= dt;
        if (shots[i] <= 0) { shots.splice(i, 1); cannons.forEach(function (c) { burst(new THREE.Vector3(c[0], c[1], c[2]), low ? 7 : 16, true); }); }
      }
    }
    return {
      update: function (t, dt) { updateLights(t); updateProps(t); updateHype(dt); },
      addHype: function (n) { hype = Math.min(1, hype + n); if (hype >= 1) drop(); },
      resize: function (w, h) { if (composer) { composer.setPixelRatio(world.renderer.getPixelRatio()); composer.setSize(w, h); } },
      render: function () { if (composer) composer.render(); else world.renderer.render(world.scene, world.camera); },
      state: function () { return { hype: hype, bloom: !!composer, tickets: tickets.length }; }
    };
  };
})();
