/* The venue: facade, room, stage, light rig, band, box office, jukebox, crowd and bubbles. */
(function () {
  'use strict';
  var PINK = 0xff1493, GOLD = 0xc9a227, WHITE = 0xffffff;
  var BAND = [
    { name: 'phil', x: -6.6, z: -6.2, h: 4.7, floor: 1.2 },
    { name: 'libby', x: -1.9, z: -4.1, h: 5.3, floor: 1.2 },
    { name: 'tyler', x: 0.9, z: -11, h: 6, floor: 2.3 },
    { name: 'mike', x: 3.5, z: -5.5, h: 6.1, floor: 1.2 },
    { name: 'jeff', x: 8.2, z: -6.5, h: 5.7, floor: 1.2 }
  ];

  function canvasTexture(w, h, draw) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    return new THREE.CanvasTexture(c);
  }
  function softTexture() {
    return canvasTexture(128, 128, function (g, w) {
      var r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.4, 'rgba(255,255,255,.35)'); r.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = r; g.fillRect(0, 0, w, w);
    });
  }
  function brickTexture() {
    var t = canvasTexture(256, 256, function (g, w) {
      g.fillStyle = '#1a1018'; g.fillRect(0, 0, w, w); g.fillStyle = '#2c1a26';
      for (var row = 0; row < 8; row++) for (var col = -1; col < 5; col++) g.fillRect(col * 64 + (row % 2) * 32 + 2, row * 32 + 2, 60, 28);
    });
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(.16, .16);
    return t;
  }
  function solid(color) { return new THREE.MeshBasicMaterial({ color: color }); }
  function box(parent, w, h, d, color, x, y, z) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), solid(color));
    m.position.set(x, y, z); parent.add(m);
    return m;
  }
  function glow(parent, soft, color, size, x, y, z, opacity) {
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: color, transparent: true, opacity: opacity, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    s.scale.set(size, size, 1); s.position.set(x, y, z); parent.add(s);
    return s;
  }
  function label(parent, text, color, w, h, x, y, z) {
    var map = canvasTexture(1024, Math.round(1024 * h / w), function (g, cw, ch) {
      g.fillStyle = '#0a0a0a'; g.fillRect(0, 0, cw, ch);
      g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.font = Math.round(ch * .68) + 'px Anton, Impact, sans-serif'; g.fillText(text, cw / 2, ch * .54);
    });
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: map }));
    m.position.set(x, y, z); parent.add(m);
    return m;
  }

  function buildRoom(scene) {
    box(scene, 60, .2, 110, 0x09060c, 0, -.1, 16);
    box(scene, 60, .2, 42, 0x050306, 0, 19, 0);
    box(scene, .4, 20, 42, 0x0e0910, -29, 9.5, 0);
    box(scene, .4, 20, 42, 0x0e0910, 29, 9.5, 0);
    box(scene, 60, 20, .4, 0x08050a, 0, 9.5, -19);
  }

  function buildFacade(scene, soft) {
    var wall = new THREE.Shape();
    wall.moveTo(-42, 0); wall.lineTo(42, 0); wall.lineTo(42, 36); wall.lineTo(-42, 36); wall.closePath();
    var door = new THREE.Path();
    door.moveTo(-4.8, 0); door.lineTo(-4.8, 7.8); door.lineTo(4.8, 7.8); door.lineTo(4.8, 0); door.closePath();
    wall.holes.push(door);
    var mesh = new THREE.Mesh(new THREE.ShapeGeometry(wall), new THREE.MeshBasicMaterial({ map: brickTexture(), color: 0xb9a8b4, side: THREE.DoubleSide }));
    mesh.position.z = 20; scene.add(mesh);
    box(scene, .3, 8, .5, PINK, -4.95, 3.95, 20.1); box(scene, .3, 8, .5, PINK, 4.95, 3.95, 20.1); box(scene, 10.2, .3, .5, PINK, 0, 7.95, 20.1);
    glow(scene, soft, PINK, 26, 0, 4, 20.6, .16);
    glow(scene, soft, GOLD, 24, 0, 12, 20.7, .1);
    box(scene, 16.4, 6.4, 1, 0x161616, 0, 11.6, 20.4);
    var map = canvasTexture(1536, 600, function (g, w, h) {
      g.fillStyle = '#0a0a0a'; g.fillRect(0, 0, w, h); g.textAlign = 'left'; g.textBaseline = 'middle';
      var size = 236, gap = 56;
      g.font = size + 'px Anton, Impact, sans-serif';
      var widest = g.measureText('NOBODY').width + gap + g.measureText('CAME HERE').width;
      if (widest > w - 90) { size = Math.floor(size * (w - 90) / widest); g.font = size + 'px Anton, Impact, sans-serif'; }
      function line(a, colorA, b, colorB, y) {
        var wa = g.measureText(a).width, wb = g.measureText(b).width, x = (w - wa - gap - wb) / 2;
        g.fillStyle = colorA; g.fillText(a, x, y); g.fillStyle = colorB; g.fillText(b, x + wa + gap, y);
      }
      line('NOBODY', '#fff', 'CAME HERE', '#ff1493', h * .28);
      line('TO SIT', '#fff', 'DOWN.', '#c9a227', h * .74);
    });
    var sign = new THREE.Mesh(new THREE.PlaneGeometry(15, 5.6), new THREE.MeshBasicMaterial({ map: map }));
    sign.position.set(0, 11.6, 20.92); scene.add(sign);
    var count = 68, bulbs = new THREE.InstancedMesh(new THREE.SphereGeometry(.15, 10, 8), new THREE.MeshBasicMaterial({ color: WHITE }), count);
    var mat = new THREE.Matrix4(), per = 2 * (15.9 + 6);
    for (var i = 0; i < count; i++) {
      var d = (i / count) * per, x, y;
      if (d < 15.9) { x = -7.95 + d; y = 14.6; } else if (d < 21.9) { x = 7.95; y = 14.6 - (d - 15.9); }
      else if (d < 37.8) { x = 7.95 - (d - 21.9); y = 8.6; } else { x = -7.95; y = 8.6 + (d - 37.8); }
      mat.makeTranslation(x, y, 20.98); bulbs.setMatrixAt(i, mat); bulbs.setColorAt(i, new THREE.Color(GOLD));
    }
    scene.add(bulbs);
    return bulbs;
  }

  function buildStage(scene, soft, video, low) {
    box(scene, 30, 1.2, 15, 0x120d15, 0, .6, -8.5);
    box(scene, 30, .08, .08, PINK, 0, 1.22, -1);
    box(scene, 8, 1.1, 4, 0x1a141d, .9, 1.75, -11.5);
    box(scene, 3, 5, 2.4, 0x0c090e, -13, 3.7, -7); box(scene, 3, 5, 2.4, 0x0c090e, 13, 3.7, -7);
    box(scene, 34, .3, .3, 0x2a2a2a, 0, 15, -2); box(scene, 34, .3, .3, 0x2a2a2a, 0, 15, -13);
    var shared = new THREE.VideoTexture(video); shared.minFilter = THREE.LinearFilter;
    var walls = ['ledLeft', null, 'ledRight'].map(function (id) {
      if (!id || low) return shared;
      var t = new THREE.VideoTexture(document.getElementById(id)); t.minFilter = THREE.LinearFilter;
      return t;
    });
    [-9.6, 0, 9.6].forEach(function (x, n) {
      var led = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 11.7), new THREE.MeshBasicMaterial({ map: walls[n], color: 0x6a6a6a, fog: false }));
      led.position.set(x, 7.2, -15.4); scene.add(led);
      box(scene, 6.9, 12, .2, 0x050505, x, 7.2, -16.1);
    });
    scene.userData.walls = walls;
    glow(scene, soft, PINK, 15, 0, 13.6, -15, .3);
    new THREE.TextureLoader().load('assets/logo-lips.png', function (t) {
      var lips = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 3.42), new THREE.MeshBasicMaterial({ map: t, transparent: true, fog: false }));
      lips.position.set(0, 14.8, -14.9); scene.add(lips);
    });
  }

  function buildBeams(scene, count) {
    var geo = new THREE.ConeGeometry(2.7, 21, 28, 1, true); geo.translate(0, -10.5, 0);
    var beams = [];
    for (var i = 0; i < count; i++) {
      var mat = new THREE.ShaderMaterial({
        uniforms: { color: { value: new THREE.Color(i % 3 === 2 ? GOLD : i % 2 ? 0x7a2cff : PINK) }, power: { value: .34 } },
        vertexShader: 'varying vec2 vUv;varying vec3 vN;varying vec3 vV;void main(){vUv=uv;vN=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.);vV=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',
        fragmentShader: 'uniform vec3 color;uniform float power;varying vec2 vUv;varying vec3 vN;varying vec3 vV;void main(){float rim=pow(abs(dot(vN,vV)),2.2);float fall=pow(vUv.y,1.7);gl_FragColor=vec4(color*rim*fall*power,1.);}',
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
      });
      var beam = new THREE.Mesh(geo, mat);
      beam.position.set(-15 + i * (30 / (count - 1)), 14.8, i % 2 ? -2 : -13);
      beam.userData.phase = i * 1.37;
      scene.add(beam); beams.push(beam);
      box(scene, .7, .7, .7, 0x1d1d1d, beam.position.x, 14.9, beam.position.z);
    }
    return beams;
  }

  function buildBand(scene, ready) {
    var members = [], loader = new THREE.TextureLoader(), left = BAND.length;
    BAND.forEach(function (cfg, i) {
      loader.load('assets/venue/cut/' + cfg.name + '.webp', function (t) {
        var ratio = t.image.width / t.image.height;
        var m = new THREE.Mesh(new THREE.PlaneGeometry(cfg.h * ratio, cfg.h), new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: .03, depthWrite: false, color: 0xd8d8d8, fog: false }));
        m.position.set(cfg.x, cfg.floor + cfg.h / 2 - cfg.h * .1, cfg.z);
        m.renderOrder = 10 + Math.round(cfg.z + 20);
        m.userData = { index: i, baseY: m.position.y, phase: i * 1.9, jump: 0 };
        scene.add(m); members[i] = m;
        if (--left === 0) ready();
      });
    });
    return members;
  }

  function buildBooth(scene, soft) {
    var g = new THREE.Group(); g.position.set(-28.6, 0, 1); g.rotation.y = Math.PI / 2; scene.add(g);
    box(g, 13, 9, .6, 0x161616, 0, 4.5, 0);
    var amber = canvasTexture(256, 128, function (c, w, h) {
      var r = c.createRadialGradient(w / 2, h * .45, 8, w / 2, h / 2, w * .62);
      r.addColorStop(0, '#ffd978'); r.addColorStop(.55, '#b9811d'); r.addColorStop(1, '#3a2408');
      c.fillStyle = r; c.fillRect(0, 0, w, h);
    });
    var pane = new THREE.Mesh(new THREE.PlaneGeometry(9.4, 4), new THREE.MeshBasicMaterial({ map: amber, fog: false }));
    pane.position.set(0, 4, .32); g.add(pane);
    box(g, 10.2, .4, 1.5, 0x2a2a2a, 0, 1.85, .8); box(g, 10.2, .4, .9, 0x2a2a2a, 0, 6.2, .6);
    box(g, .4, 4.6, .9, 0x2a2a2a, -4.9, 4, .6); box(g, .4, 4.6, .9, 0x2a2a2a, 4.9, 4, .6);
    for (var i = -2; i <= 2; i++) box(g, .1, 4, .3, 0x0a0a0a, i * 1.9, 4, .55);
    label(g, 'BOX OFFICE', '#c9a227', 9, 1.7, 0, 7.6, .34);
    glow(g, soft, GOLD, 15, 0, 4, 1.5, .28);
  }

  function buildJukebox(scene, soft) {
    var g = new THREE.Group(); g.position.set(28.4, 0, 2); g.rotation.y = -Math.PI / 2; scene.add(g);
    function arch(w, h) {
      var s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(-w / 2, h - w / 2); s.absarc(0, h - w / 2, w / 2, Math.PI, 0, true); s.lineTo(w / 2, 0); s.closePath();
      return s;
    }
    var body = new THREE.Mesh(new THREE.ExtrudeGeometry(arch(6.6, 9.6), { depth: 1.6, bevelEnabled: false, curveSegments: 32 }), solid(0x1b0e18)); g.add(body);
    var neon = new THREE.Mesh(new THREE.ShapeGeometry(arch(6, 9.1), 32), solid(PINK)); neon.position.z = 1.62; g.add(neon);
    var inner = new THREE.Mesh(new THREE.ShapeGeometry(arch(5.4, 8.6), 32), solid(0x120a10)); inner.position.z = 1.64; g.add(inner);
    var paper = document.createElement('canvas'); paper.width = 640; paper.height = 388;
    var screenMap = new THREE.CanvasTexture(paper);
    var screen = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.3), new THREE.MeshBasicMaterial({ map: screenMap, fog: false }));
    screen.position.set(0, 5.9, 1.68); g.add(screen);
    function show(code, song, color) {
      var c = paper.getContext('2d'), size = 92;
      c.fillStyle = '#080406'; c.fillRect(0, 0, 640, 388); c.strokeStyle = color; c.lineWidth = 10; c.strokeRect(10, 10, 620, 368);
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = color; c.font = '128px Anton, Impact, sans-serif'; c.fillText(code, 320, 124);
      c.font = size + 'px Anton, Impact, sans-serif';
      while (c.measureText(song.toUpperCase()).width > 570 && size > 30) { size -= 4; c.font = size + 'px Anton, Impact, sans-serif'; }
      c.fillStyle = '#fff'; c.fillText(song.toUpperCase(), 320, 282);
      screenMap.needsUpdate = true;
    }
    show('A1', 'Mamma Mia', '#ff1493');
    for (var i = 0; i < 5; i++) box(g, 4.2, .08, .08, 0xff4dab, 0, 1.2 + i * .55, 1.7);
    for (var k = 0; k < 6; k++) box(g, .42, .3, .22, k % 2 ? GOLD : 0xffffff, -1.55 + k * .62, 4.05, 1.74);
    var halo = glow(g, soft, PINK, 15, 0, 5, 2.6, .3);
    return { neon: neon, screen: screen, halo: halo, show: show };
  }

  function buildCrowd(scene) {
    var rows = [];
    [{ z: 2.6, seed: 3 }, { z: 5.2, seed: 11 }].forEach(function (cfg) {
      var seed = cfg.seed;
      function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
      var map = canvasTexture(2048, 256, function (g, w, h) {
        g.fillStyle = '#040305';
        for (var x = 10; x < w; x += 44 + rnd() * 34) {
          var top = 92 + rnd() * 46;
          g.beginPath(); g.arc(x, top, 24, 0, Math.PI * 2); g.fill();
          g.beginPath(); g.moveTo(x - 46, h); g.quadraticCurveTo(x - 42, top + 30, x, top + 26); g.quadraticCurveTo(x + 42, top + 30, x + 46, h); g.fill();
          if (rnd() > .55) {
            var side = rnd() > .5 ? 1 : -1; g.lineWidth = 15; g.strokeStyle = '#040305'; g.lineCap = 'round';
            g.beginPath(); g.moveTo(x + side * 34, top + 56); g.lineTo(x + side * 50, top - 58); g.stroke();
            g.beginPath(); g.arc(x + side * 51, top - 66, 12, 0, Math.PI * 2); g.fill();
          }
        }
      });
      var row = new THREE.Mesh(new THREE.PlaneGeometry(56, 3.4), new THREE.MeshBasicMaterial({ map: map, transparent: true, depthWrite: false }));
      row.position.set(0, 1.5, cfg.z); row.renderOrder = 40; row.userData.phase = cfg.seed; scene.add(row); rows.push(row);
    });
    return rows;
  }

  function buildHaze(scene, soft, count) {
    var haze = [];
    for (var i = 0; i < count; i++) {
      var s = glow(scene, soft, i % 3 ? 0x8a3dff : PINK, 7 + Math.random() * 9, (Math.random() - .5) * 42, 1.4 + Math.random() * 8, -13 + Math.random() * 28, .035);
      s.userData = { x: s.position.x, y: s.position.y, phase: Math.random() * 6.28 };
      s.renderOrder = 30; haze.push(s);
    }
    return haze;
  }

  function buildBubbles(scene, count) {
    var geo = new THREE.PlaneGeometry(1, 1), seeds = new Float32Array(count), fades = new Float32Array(count), bits = [];
    for (var n = 0; n < count; n++) { seeds[n] = Math.random(); bits.push({ life: 0, max: 1, size: .2, p: new THREE.Vector3(), v: new THREE.Vector3() }); }
    geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));
    geo.setAttribute('aFade', new THREE.InstancedBufferAttribute(fades, 1));
    var mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: 'attribute float aSeed;attribute float aFade;varying vec2 vUv;varying float vSeed;varying float vFade;void main(){vUv=uv;vSeed=aSeed;vFade=aFade;float s=length(instanceMatrix[0].xyz);vec4 c=modelViewMatrix*instanceMatrix*vec4(0.,0.,0.,1.);c.xy+=position.xy*s;gl_Position=projectionMatrix*c;}',
      fragmentShader: 'uniform float uTime;varying vec2 vUv;varying float vSeed;varying float vFade;vec3 film(float t){return .58+.42*cos(6.283*(t+vec3(0.,.33,.67)));}void main(){vec2 p=vUv*2.-1.;float r=length(p);if(r>1.)discard;float rim=smoothstep(.6,.96,r)*smoothstep(1.,.95,r);float body=.05+.13*r*r;float a=atan(p.y,p.x);vec3 col=film(r*1.4+a*.08+vSeed+uTime*.12);float hi=smoothstep(.22,.02,length((p-vec2(-.36,.4))*vec2(1.,1.5)));float hi2=smoothstep(.1,0.,length(p-vec2(.38,-.42)))*.6;gl_FragColor=vec4((col*(rim*.82+body*.8)+vec3(hi*.55+hi2*.7))*vFade,1.);}'
    });
    var mesh = new THREE.InstancedMesh(geo, mat, count), hidden = new THREE.Matrix4().makeScale(0, 0, 0);
    for (var i = 0; i < count; i++) mesh.setMatrixAt(i, hidden);
    mesh.frustumCulled = false; mesh.renderOrder = 60; scene.add(mesh);
    return { mesh: mesh, bits: bits, next: 0, hidden: hidden, fades: fades, seeds: seeds };
  }

  window.MGRWorld = function (canvas, low) {
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: !low, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, low ? 1.25 : 1.75));
    var scene = new THREE.Scene(); scene.background = new THREE.Color(0x060409); scene.fog = new THREE.FogExp2(0x07040a, .012);
    var camera = new THREE.PerspectiveCamera(52, 1, .4, 170), soft = softTexture();
    var video = document.getElementById('ledLoop');
    buildRoom(scene); var bulbs = buildFacade(scene, soft); buildStage(scene, soft, video, low);
    var beams = buildBeams(scene, low ? 6 : 10), booth = buildBooth(scene, soft), juke = buildJukebox(scene, soft);
    var crowd = buildCrowd(scene), haze = buildHaze(scene, soft, low ? 22 : 56), bubbles = buildBubbles(scene, low ? 180 : 420);
    var world = { low: low, soft: soft, wallTextures: scene.userData.walls, renderer: renderer, scene: scene, camera: camera, members: [], ready: false, juke: juke, booth: booth, bulbs: bulbs, beams: beams, crowd: crowd, haze: haze, bubbles: bubbles, focus: -1, hover: -1, aim: new THREE.Vector3(0, 2, -6), hit: 0 };
    world.members = buildBand(scene, function () { world.ready = true; });
    return world;
  };
})();
