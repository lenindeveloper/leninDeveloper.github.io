(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const greeting = Object.freeze({
    name: 'Helly Sh',
    message: 'You make my ordinary days feel like something extraordinary.\nI hope today brings you the same warmth, joy, and love you bring into my life.\nHere’s to your beautiful smile, your dreams, and all our moments still to come.',
    from: 'With all my love, Lenin Irungbam ♡'
  });
  let opened = false, openingTimer;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function render() {
    $('#birthday-name').textContent = $('#invite-name').textContent = greeting.name;
    $('#birthday-message').textContent = greeting.message;
    $('#birthday-from').textContent = greeting.from;
    document.title = `A Little Birthday Magic · For ${greeting.name}`;
  }
  function toast(message) {
    $('#toast').textContent = message; $('#toast').classList.add('visible');
    clearTimeout(toast.timer); toast.timer = setTimeout(() => $('#toast').classList.remove('visible'), 3500);
  }
  render();
  for(let i=0;i<38;i++){
    const star = document.createElement('span');star.className='star';star.textContent=i%5===0?'✧':'·';
    star.style.cssText=`left:${4+Math.random()*92}%;top:${9+Math.random()*82}%;font-size:${i%5===0?12+Math.random()*10:15}px;animation-delay:${Math.random()*4}s`;
    $('#stars').append(star);
  }
  let audio, soundOn = false, voices = [];
  function stopMusic() { voices.forEach(voice=>{try{voice.stop();}catch{}}); voices=[]; }
  async function playMusic() {
    if (!soundOn) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) {soundOn=false;updateSound();toast('Music is not supported in this browser.');return;}
      audio ||= new Audio(); await audio.resume(); stopMusic();
      if (!soundOn) return;
      const notes=[[67,.5],[67,.5],[69,1],[67,1],[72,1],[71,2],[67,.5],[67,.5],[69,1],[67,1],[74,1],[72,2],[67,.5],[67,.5],[79,1],[76,1],[72,1],[71,1],[69,2],[77,.5],[77,.5],[76,1],[72,1],[74,1],[72,2.5]];
      let time=audio.currentTime+.12;
      notes.forEach(([pitch,beats])=>{
        const oscillator=audio.createOscillator(), gain=audio.createGain(), duration=beats*.34;
        oscillator.type='sine';oscillator.frequency.value=440*Math.pow(2,(pitch-69)/12);
        gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(.10,time+.015);gain.gain.exponentialRampToValueAtTime(.001,time+duration+.12);
        oscillator.connect(gain);gain.connect(audio.destination);oscillator.start(time);oscillator.stop(time+duration+.15);voices.push(oscillator);time+=duration;
      });
    } catch {soundOn=false;updateSound();toast('Tap Sound to try the music again.');}
  }
  function updateSound() {$('#sound').setAttribute('aria-pressed', String(soundOn));$('#sound').setAttribute('aria-label', `Turn birthday music ${soundOn?'off':'on'}`);$('#sound-label').textContent = soundOn?'Sound on':'Sound off';}
  $('#sound').addEventListener('click',()=>{soundOn=!soundOn;updateSound();if(soundOn&&opened)playMusic();else if(!soundOn)stopMusic();});
  $('#open').addEventListener('click',()=>{
    if(opened)return;opened=true;$('.theatre').classList.add('opened');$('#invitation').inert=true;
    $('#reveal').inert=false;$('#reveal').setAttribute('aria-hidden','false');$('#celebrate').removeAttribute('tabindex');$('#replay').hidden=false;
    $('#celebrate').focus({preventScroll:true});playMusic();openingTimer=setTimeout(burst,reduced?0:1300);
  });
  function reset() {
    opened=false;clearTimeout(openingTimer);stopMusic();particles=[];ctx.clearRect(0,0,canvas.width,canvas.height);
    $('.theatre').classList.remove('opened');$('#invitation').inert=false;$('#reveal').inert=true;$('#reveal').setAttribute('aria-hidden','true');$('#celebrate').tabIndex=-1;$('#replay').hidden=true;
  }
  $('#replay').addEventListener('click',()=>{reset();$('#open').focus({preventScroll:true});});
  $('#celebrate').addEventListener('click',()=>{burst();if(soundOn)playMusic();});
  const canvas=$('#confetti'),ctx=canvas.getContext('2d');let particles=[],frame=0,last=0;
  function size(){canvas.width=Math.round(canvas.clientWidth*devicePixelRatio);canvas.height=Math.round(canvas.clientHeight*devicePixelRatio);}
  new ResizeObserver(size).observe(canvas);
  function burst(){
    if(reduced){toast('A thousand little wishes, all for you ♡');return;}
    const colors=['#ecc582','#f3dacf','#d7728f','#f8f0d9','#b26077'];
    for(let i=0;i<150;i++) particles.push({x:canvas.clientWidth/2,y:canvas.clientHeight*.42,vx:(Math.random()-.5)*14,vy:-Math.random()*12-3,r:Math.random()*Math.PI*2,spin:(Math.random()-.5)*.15,w:4+Math.random()*5,h:3+Math.random()*4,color:colors[i%colors.length],life:0});
    particles=particles.slice(-350);if(!frame){last=performance.now();frame=requestAnimationFrame(tick);}
  }
  function tick(now){
    const dt=Math.min((now-last)/16.67,3);last=now;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
    particles=particles.filter(p=>p.life<260&&p.y<canvas.clientHeight+30);
    for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=.075*dt;p.vx*=Math.pow(.992,dt);p.r+=p.spin*dt;p.life+=dt;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.globalAlpha=Math.min(1,(260-p.life)/45);ctx.fillStyle=p.color;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h*Math.cos(p.r));ctx.restore();}
    frame=particles.length?requestAnimationFrame(tick):0;
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMusic();});
})();
