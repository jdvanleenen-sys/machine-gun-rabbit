/* Moves the camera with scroll and makes the room respond to the visitor. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var PEOPLE = Array.prototype.map.call(document.querySelectorAll('.lineup li'), function (li) { return [li.dataset.name, li.dataset.role, li.dataset.line]; });

  function fillNextShow() {
    var first = document.querySelector('.gig-row'), slot = $('nextShow');
    if (!first || !slot) return;
    slot.innerHTML = first.innerHTML;
    var label = document.createElement('p'); label.className = 't-label'; label.textContent = 'Next show';
    slot.firstElementChild.insertBefore(label, slot.firstElementChild.firstChild);
    slot.querySelectorAll('.gig-date,.gig-venue,.gig-time').forEach(function (el) { el.classList.remove('gig-date', 'gig-venue', 'gig-time'); });
  }
  fillNextShow();
  if (!window.THREE) { document.body.classList.add('no3d'); return; }

  var world, fx, anchors = [], keys = [], smoothY = 0, pointer = { x: 0, y: 0, sx: 0, sy: 0 }, motionOn = true, memberIndex = -1;
  var position = new THREE.Vector3(), look = new THREE.Vector3(), ray = new THREE.Raycaster(), matrix = new THREE.Matrix4();
  var ease = function (t) { return t * t * (3 - 2 * t); };

  function hasWebGL() {
    try { var c = document.createElement('canvas'); return !!(window.THREE && (c.getContext('webgl2') || c.getContext('webgl'))); }
    catch (e) { return false; }
  }

  function layout() {
    var w = window.innerWidth, h = window.innerHeight, cam = world.camera;
    world.renderer.setSize(w, h, false); if (fx) fx.resize(w, h);
    cam.aspect = w / h; cam.fov = cam.aspect < .8 ? 64 : 52; cam.updateProjectionMatrix();
    var fit = Math.max(23, 17 / (2 * Math.tan(cam.fov * Math.PI / 360) * cam.aspect)), pull = cam.aspect < .8 ? 8 : 0;
    keys = [
      { p: [0, 4.4, 20 + fit], l: [0, 7.2, 20] },
      { p: [0, 4.7, 8 + pull], l: [0, 4.3, -9] },
      { p: [-14, 4.1, 6], l: [-28, 4.3, 1] },
      { p: [14, 3.9, 7], l: [28, 4.2, 2] },
      { p: [-6.6, 3.8, -.2], l: [-6.6, 3.7, -7] },
      { p: [8.2, 3.8, -.2], l: [8.2, 3.7, -7] },
      pull ? { p: [0, 7.5, 17], l: [0, 4.4, -9] } : { p: [4.5, 7.5, 14], l: [5.5, 3.8, -9] }
    ];
    var max = Math.max(1, document.documentElement.scrollHeight - h), g = $('band');
    anchors = [0, $('stage').offsetTop, $('shows').offsetTop, $('set').offsetTop, g.offsetTop, g.offsetTop + g.offsetHeight - h, Math.min($('back').offsetTop, max)];
  }

  function sampleCamera(y) {
    var i = 0;
    while (i < anchors.length - 2 && y >= anchors[i + 1]) i++;
    var t = ease(Math.max(0, Math.min(1, (y - anchors[i]) / Math.max(1, anchors[i + 1] - anchors[i]))));
    position.fromArray(keys[i].p).lerp(new THREE.Vector3().fromArray(keys[i + 1].p), t);
    look.fromArray(keys[i].l).lerp(new THREE.Vector3().fromArray(keys[i + 1].l), t);
  }

  function setMember(i) {
    if (i === memberIndex) return;
    memberIndex = i; world.focus = i;
    $('memberName').textContent = PEOPLE[i][0]; $('memberRole').textContent = PEOPLE[i][1]; $('memberLine').textContent = PEOPLE[i][2];
    document.querySelectorAll('.pick').forEach(function (b, n) { b.setAttribute('aria-current', n === i ? 'true' : 'false'); });
  }

  function updateMemberFromScroll(y) {
    var a = anchors[4], b = anchors[5];
    if (y >= a - 80 && y <= b + 80) setMember(Math.round(Math.max(0, Math.min(1, (y - a) / (b - a))) * 4));
    else world.focus = -1;
  }

  function burst(point, amount, sweep) {
    var b = world.bubbles, toCamera = new THREE.Vector3();
    for (var n = 0; n < amount; n++) {
      var bit = b.bits[b.next]; b.next = (b.next + 1) % b.bits.length;
      bit.max = bit.life = 3.4 + Math.random() * 3.2;
      bit.size = .14 + Math.pow(Math.random(), 2.2) * .56;
      bit.p.copy(point).add(new THREE.Vector3((Math.random() - .5) * .5, (Math.random() - .5) * .5, (Math.random() - .5) * .5));
      toCamera.copy(world.camera.position).sub(point).normalize().multiplyScalar(1.2 + Math.random() * 3.2);
      bit.v.set((Math.random() - .5) * 8.5, 1.4 + Math.random() * 3.6, (Math.random() - .5) * 6).add(toCamera);
      if (sweep) bit.v.x -= point.x * (.25 + Math.random() * .62);
    }
  }

  function animateBubbles(dt, t) {
    var b = world.bubbles, live = false, drag = Math.pow(.28, dt);
    b.mesh.material.uniforms.uTime.value = t;
    b.bits.forEach(function (bit, i) {
      if (bit.life <= 0) return;
      live = true; bit.life -= dt;
      if (bit.life <= 0) { b.mesh.setMatrixAt(i, b.hidden); b.fades[i] = 0; return; }
      var seed = b.seeds[i] * 6.28, age = bit.max - bit.life, popping = bit.life < .14 ? (.14 - bit.life) / .14 : 0;
      bit.v.multiplyScalar(drag); bit.v.y += (.2 + b.seeds[i] * .24) * dt;
      bit.p.addScaledVector(bit.v, dt);
      bit.p.x += Math.sin(t * 1.3 + seed) * .24 * dt; bit.p.z += Math.cos(t * 1.1 + seed) * .2 * dt;
      var s = bit.size * Math.min(1, .35 + age * 3.2) * (1 + popping * .5);
      matrix.makeScale(s, s, s).setPosition(bit.p); b.mesh.setMatrixAt(i, matrix);
      b.fades[i] = Math.min(1, age / .16) * (1 - popping);
    });
    if (live || b.wasLive) { b.mesh.instanceMatrix.needsUpdate = true; b.mesh.geometry.attributes.aFade.needsUpdate = true; }
    b.wasLive = live;
  }

  function animateRoom(t) {
    world.beams.forEach(function (b, i) {
      var p = b.userData.phase, follow = world.hit > 0 ? .35 : .12;
      b.rotation.z = Math.sin(t * .62 + p) * .46 + pointer.sx * follow * (i % 2 ? 1 : -1);
      b.rotation.x = Math.cos(t * .47 + p) * .3 + pointer.sy * follow;
      b.material.uniforms.power.value = .3 + Math.sin(t * 1.4 + p) * .07 + world.hit * .18;
    });
    world.haze.forEach(function (s) {
      var d = s.userData; s.position.x = d.x + Math.sin(t * .12 + d.phase) * 2.6; s.position.y = d.y + Math.cos(t * .16 + d.phase) * .8;
    });
    world.crowd.forEach(function (r, i) { r.position.y = 1.5 + Math.abs(Math.sin(t * 2.3 + i * 1.2)) * .16; r.position.x = Math.sin(t * .7 + i) * .22; });
    world.members.forEach(function (m) {
      if (!m) return;
      var u = m.userData, active = u.index === world.focus || u.index === world.hover;
      u.jump = Math.max(0, u.jump - .022);
      m.position.y = u.baseY + Math.abs(Math.sin(t * 2.3 + u.phase)) * .07 + Math.sin(u.jump * Math.PI) * .7;
      m.rotation.y = THREE.MathUtils.clamp((world.camera.position.x - m.position.x) * .035, -.3, .3);
      m.material.color.setScalar(THREE.MathUtils.lerp(m.material.color.r, active || world.focus < 0 ? 1 : .46, .08));
    });
    var color = new THREE.Color();
    for (var i = 0; i < world.bulbs.count; i++) world.bulbs.setColorAt(i, color.set((i + Math.floor(t * 7)) % 4 === 0 ? 0xffffff : 0xc9a227));
    world.bulbs.instanceColor.needsUpdate = true;
    world.hit = Math.max(0, world.hit - .018);
    world.juke.halo.material.opacity = .24 + Math.sin(t * 3) * .05 + world.hit * .4;
  }

  function placeCamera() {
    sampleCamera(smoothY);
    pointer.sx += (pointer.x - pointer.sx) * .05; pointer.sy += (pointer.y - pointer.sy) * .05;
    world.camera.position.copy(position);
    world.camera.position.x += pointer.sx * .75; world.camera.position.y += pointer.sy * .36;
    world.camera.lookAt(look.x + pointer.sx * .45, look.y + pointer.sy * .25, look.z);
  }

  function loop(ms) {
    requestAnimationFrame(loop);
    var t = ms / 1000, dt = Math.min(.05, t - (loop.last || t)); loop.last = t;
    var y = window.scrollY;
    smoothY = motionOn ? smoothY + (y - smoothY) * .085 : y;
    updateMemberFromScroll(smoothY); placeCamera();
    if (motionOn) { animateRoom(t); fx.update(t, dt); animateBubbles(dt, t); }
    fx.render();
    if (!document.body.classList.contains('live') && world.ready) document.body.classList.add('live');
  }

  function pickMember(event) {
    ray.setFromCamera({ x: (event.clientX / window.innerWidth) * 2 - 1, y: -(event.clientY / window.innerHeight) * 2 + 1 }, world.camera);
    var hit = ray.intersectObjects(world.members.filter(Boolean))[0];
    return { member: hit ? hit.object : null, point: ray.ray.at(hit ? hit.distance : 9, new THREE.Vector3()) };
  }

  function bindPointer() {
    window.addEventListener('pointermove', function (e) {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1; pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      if (e.pointerType !== 'mouse' || e.target.closest('a,button,.panel')) return;
      var found = pickMember(e); world.hover = found.member ? found.member.userData.index : -1;
      document.body.style.cursor = found.member ? 'pointer' : '';
    }, { passive: true });
    window.addEventListener('click', function (e) {
      if (!motionOn || e.target.closest('a,button,.panel')) return;
      var found = pickMember(e);
      if (found.member) { found.member.userData.jump = 1; setMember(found.member.userData.index); world.hit = 1; }
      burst(found.point, found.member ? 54 : 30); fx.addHype(found.member ? .22 : .13);
    });
  }

  function bindJukebox() {
    document.querySelectorAll('.song').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.song').forEach(function (s) { s.setAttribute('aria-pressed', s === b ? 'true' : 'false'); });
        $('nowCode').textContent = b.dataset.code; $('nowSong').textContent = b.dataset.song; $('nowLine').textContent = b.dataset.line;
        world.hit = 1; world.juke.show(b.dataset.code, b.dataset.song, b.dataset.code.charAt(0) === 'A' ? '#ff1493' : '#c9a227');
        if (motionOn) { burst(new THREE.Vector3(26.6, 6, 2), 44); fx.addHype(.18); }
      });
    });
  }

  function bindControls() {
    document.querySelectorAll('.pick').forEach(function (b, i) {
      b.addEventListener('click', function () {
        window.scrollTo({ top: anchors[4] + (anchors[5] - anchors[4]) * i / 4, behavior: 'auto' });
        if (world.members[i]) world.members[i].userData.jump = 1;
      });
    });
    $('motion').addEventListener('click', function () { setMotion(!motionOn); });
  }

  function leds() { return Array.prototype.filter.call(document.querySelectorAll('video.led'), function (v) { return !world.low || v.id === 'ledLoop'; }); }
  function playLeds() { leds().forEach(function (v) { v.play().catch(function () {}); }); }
  function pauseLeds() { leds().forEach(function (v) { v.pause(); }); }

  function setMotion(on) {
    motionOn = on; $('motion').textContent = on ? 'Motion off' : 'Motion on'; $('motion').setAttribute('aria-pressed', String(!on));
    if (on) playLeds(); else pauseLeds();
  }

  function boot() {
    if (!hasWebGL()) { document.body.classList.add('no3d'); return; }
    var low = window.innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4;
    world = window.MGRWorld($('world'), low);
    fx = window.MGRFx(world, low, burst);
    layout(); smoothY = window.scrollY; setMember(0);
    bindPointer(); bindJukebox(); bindControls();
    window.addEventListener('resize', layout); window.addEventListener('load', layout);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setMotion(false); else playLeds();
    requestAnimationFrame(loop);
    if (location.search.indexOf('mgrtest') > -1) window.MGRTest = { fx: fx, bubbles: function () { return world.bubbles.bits.filter(function (b) { return b.life > 0; }).length; }, burst: function () { burst(new THREE.Vector3(0, 6, 1), 80); }, state: function () { return { ready: world.ready, members: world.members.filter(Boolean).length, y: Math.round(smoothY) }; } };
  }

  var fonts = document.fonts && document.fonts.load ? Promise.all([document.fonts.load('236px Anton'), document.fonts.ready]) : Promise.resolve();
  fonts.then(boot, boot);
})();
