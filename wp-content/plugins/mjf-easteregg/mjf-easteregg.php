<?php
/**
 * Plugin Name: MJF Easter Egg
 * Description: Bubble Bobble via Konami Code
 * Author: Maria João Fontes
 */
if ( ! defined( 'ABSPATH' ) ) exit;
/**
 * Retorna o URL da imagem do monitor.
 * Ajusta o caminho conforme a estrutura do teu tema.
 */
function mjf_konami_get_monitor_url() {
    // Se estiveres num child theme:
    return get_stylesheet_directory_uri() . '/assets/images/monitor.png';
    
    // Se estiveres no tema principal:
    // return get_template_directory_uri() . '/assets/images/monitor.png';
    
    // Ou se quiseres usar a Media Library do WordPress,
    // faz upload da imagem e coloca o URL aqui:
    // return 'https://teu-site.com/wp-content/uploads/2026/monitor.png';
}

/**
 * Injeta o CSS e HTML do overlay Konami no footer de todas as páginas.
 */
add_action( 'wp_footer', 'mjf_konami_inject_overlay' );
function mjf_konami_inject_overlay() {
    $monitor_url = mjf_konami_get_monitor_url();
    ?>
    <!-- ═══ BUBBLE BOBBLE EASTER EGG — MJ Fontes ═══ -->
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    #mjf-konami-overlay {
      display:none; position:fixed; inset:0; z-index:999999;
      background:#000; flex-direction:column; align-items:center; justify-content:center;
      animation:mjfKonamiFadeIn .6s ease;
    }
    #mjf-konami-overlay.active { display:flex; }
    @keyframes mjfKonamiFadeIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
    #mjf-konami-inner { position:relative; width:min(90vw,160.7vh); height:min(50.4vw,90vh); }
    #mjf-konami-monitor-img { position:absolute; inset:0; width:100%; height:100%; object-fit:fill; z-index:10; pointer-events:none; }
    #mjf-konami-game-screen { position:absolute; left:36.5%; top:11%; width:21.5%; height:36%; z-index:5; overflow:hidden; border-radius:8%/6%; box-shadow:0 0 18px 4px rgba(100,255,180,.25),inset 0 0 30px rgba(0,0,0,.4); background:#000; }
    #mjf-konami-game-screen::after { content:""; position:absolute; inset:0; background:repeating-linear-gradient(to bottom,transparent 0,transparent 2px,rgba(0,0,0,.08) 2px,rgba(0,0,0,.08) 4px); pointer-events:none; z-index:100; border-radius:inherit; }
    #mjf-konami-game-screen::before { content:""; position:absolute; inset:0; background:radial-gradient(ellipse 60% 50% at 35% 25%,rgba(255,255,255,.07) 0%,transparent 70%); pointer-events:none; z-index:101; border-radius:inherit; }
    #mjf-konami-canvas { width:100%; height:100%; display:block; image-rendering:pixelated; }
    #mjf-konami-ambient { position:absolute; left:26%;top:11%;width:38%;height:78%; background:radial-gradient(ellipse,rgba(80,255,160,.12) 0%,transparent 70%); z-index:1; pointer-events:none; animation:mjfAmbientPulse 3s ease-in-out infinite alternate; }
    @keyframes mjfAmbientPulse { from{opacity:.6} to{opacity:1.2} }
    #mjf-konami-hud { position:absolute; bottom:1%; left:49%; transform:translateX(-50%); z-index:20; display:flex; gap:clamp(8px,2vw,24px); background:rgba(0,0,0,.75); border:1px solid #440066; padding:clamp(3px,.5vw,8px) clamp(8px,1.5vw,20px); font-size:clamp(5px,.7vw,9px); color:#fff; white-space:nowrap; font-family:"Press Start 2P",monospace; }
    .mjf-hud-lbl{color:#888;} .mjf-hud-val{color:#ffdd00;} .mjf-hud-p2val{color:#44ffff;}
    #mjf-konami-blrow { position:absolute; bottom:5%; left:49%; transform:translateX(-50%); z-index:20; display:flex; gap:clamp(4px,.8vw,12px); font-size:clamp(6px,.8vw,11px); font-family:"Press Start 2P",monospace; }
    .mjf-bl { color:#333; border:1px solid #330055; padding:2px 5px; transition:all .3s; }
    .mjf-bl.lit { color:#ffdd00; border-color:#ffaa00; text-shadow:0 0 8px #ffaa00; background:rgba(255,170,0,.15); }
    #mjf-konami-controls { position:absolute; top:3%; left:50%; transform:translateX(-50%); z-index:20; font-size:clamp(6px,.7vw,9px); color:#888; white-space:nowrap; letter-spacing:1px; text-shadow:0 0 6px rgba(180,100,255,.5); font-family:"Press Start 2P",monospace; }
    #mjf-konami-controls span{color:#cc88ff;}
    .mjf-konami-btn { position:absolute; top:3%; z-index:20; background:none; border:1px solid #440066; color:#666; font-family:"Press Start 2P",monospace; font-size:clamp(5px,.6vw,8px); padding:3px 6px; cursor:pointer; }
    .mjf-konami-btn:hover{color:#ff88ff;border-color:#ff44aa;}
    #mjf-konami-hint { position:fixed; bottom:20px; right:20px; z-index:9000; font-family:"Press Start 2P",monospace; font-size:clamp(5px,.55vw,7px); color:rgba(100,60,160,.4); letter-spacing:1px; pointer-events:none; transition:color .3s; }
    #mjf-konami-hint.flash{color:#cc88ff;text-shadow:0 0 10px #aa44ff;}
    </style>

    <div id="mjf-konami-overlay">
      <div id="mjf-konami-inner">
        <div id="mjf-konami-ambient"></div>
        <div id="mjf-konami-game-screen">
          <canvas id="mjf-konami-canvas" width="448" height="416"></canvas>
        </div>
        <img id="mjf-konami-monitor-img" src="<?php echo esc_url( $monitor_url ); ?>" alt="">
        <div id="mjf-konami-hud">
          <div><span class="mjf-hud-lbl">SCORE </span><span class="mjf-hud-val" id="mjf-ks1">0</span></div>
          <div><span class="mjf-hud-lbl">❤ </span><span class="mjf-hud-val" id="mjf-kl1">3</span></div>
          <div><span class="mjf-hud-lbl">LVL </span><span class="mjf-hud-val" id="mjf-klvl">1</span></div>
        </div>
        <div id="mjf-konami-blrow">
          <div class="mjf-bl" id="mjf-kbl0">B</div><div class="mjf-bl" id="mjf-kbl1">U</div>
          <div class="mjf-bl" id="mjf-kbl2">B</div><div class="mjf-bl" id="mjf-kbl3">B</div>
          <div class="mjf-bl" id="mjf-kbl4">L</div><div class="mjf-bl" id="mjf-kbl5">E</div>
        </div>
        <div id="mjf-konami-controls">
          ←→ Mover | <span>SPACE</span> Saltar | <span>X</span> Bolha &nbsp;&nbsp;
          <span>ENTER</span> Iniciar | <span>ESC</span> Sair
        </div>
        <button class="mjf-konami-btn" style="right:9%" onclick="mjfKToggleSound()">♪ ON</button>
        <button class="mjf-konami-btn" style="right:2%" onclick="mjfCloseKonami()">✕ ESC</button>
      </div>
    </div>
    <div id="mjf-konami-hint">↑↑↓↓←→←→BA</div>

    <script>
    (function(){
      /* ── Konami Code Listener ── */
      const K=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","KeyB","KeyA"];
      let seq=[],booted=false;
      const hint=document.getElementById("mjf-konami-hint");
      document.addEventListener("keydown",function(e){
        if(e.code.startsWith("Arrow")){hint.classList.add("flash");setTimeout(()=>hint.classList.remove("flash"),500);}
        seq.push(e.code);if(seq.length>K.length)seq.shift();
        if(seq.join(",")===K.join(",")){seq=[];mjfOpenKonami();}
      });
      window.mjfOpenKonami=function(){
        document.getElementById("mjf-konami-overlay").classList.add("active");
        document.body.style.overflow="hidden";
        if(!booted){mjfBootGame();booted=true;}
        else if(window._mjfKGS==="playing")window.mjfKStartMusic&&window.mjfKStartMusic();
      };
      window.mjfCloseKonami=function(){
        document.getElementById("mjf-konami-overlay").classList.remove("active");
        document.body.style.overflow="";
        window.mjfKStopMusic&&window.mjfKStopMusic();
      };
      document.addEventListener("keydown",function(e){
        if(e.code==="Escape"&&document.getElementById("mjf-konami-overlay").classList.contains("active"))mjfCloseKonami();
      });
    })();

    function mjfBootGame(){
      const KC=document.getElementById("mjf-konami-canvas"),KX=KC.getContext("2d");
      const W=448,H=416,TS=32;
      let AC=null,MP=false,SE=true,MT=null,MPos=0;
      const BPM=180,BT=60/BPM;
      function gA(){if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();return AC;}
      function pT(f,d,t="square",v=.07,dl=0){if(!SE)return;try{const ac=gA(),o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);o.type=t;o.frequency.value=f;g.gain.setValueAtTime(0,ac.currentTime+dl);g.gain.linearRampToValueAtTime(v,ac.currentTime+dl+.01);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+dl+d);o.start(ac.currentTime+dl);o.stop(ac.currentTime+dl+d+.05);}catch(e){}}
      const TH=[[659,.5],[659,.5],[784,.5],[659,.5],[523,.5],[587,1],[659,.5],[659,.5],[784,.5],[880,.5],[831,.5],[784,1],[698,.5],[784,.5],[698,.5],[659,.5],[587,.5],[523,1],[523,.5],[587,.5],[659,.5],[698,.5],[784,.5],[880,1],[659,.5],[523,.5],[587,.5],[659,.5],[698,.5],[784,1],[523,.5],[587,.5],[659,.5],[523,.5],[440,.5],[494,1],[523,.5],[659,.5],[784,.5],[988,.5],[880,.5],[784,1],[659,.5],[523,.5],[440,.5],[494,.5],[523,1],[523,1]];
      window.mjfKStartMusic=function(){if(!SE||MP)return;MP=true;nxt();}
      function nxt(){if(!MP)return;const[f,b]=TH[MPos%TH.length];pT(f,b*BT*.85,"square",.055);MPos++;MT=setTimeout(nxt,b*BT*1000);}
      window.mjfKStopMusic=function(){MP=false;if(MT)clearTimeout(MT);}
      window.mjfKToggleSound=function(){SE=!SE;document.querySelector(".mjf-konami-btn").textContent=SE?"♪ ON":"♪ OFF";if(!SE)mjfKStopMusic();else if(window._mjfKGS==="playing")mjfKStartMusic();}
      function sS(){pT(880,.07,"square",.06);pT(1200,.05,"square",.04,.06)}
      function sP(){pT(600,.05,"sine",.09);pT(900,.08,"sine",.07,.04);pT(1400,.1,"sine",.05,.1)}
      function sJ(){pT(440,.05,"square",.06);pT(660,.07,"square",.05,.04)}
      function sD(){[220,180,150,120].forEach((f,i)=>pT(f,.14,"sawtooth",.09,i*.12))}
      function sLU(){[523,659,784,1047].forEach((f,i)=>pT(f,.12,"square",.09,i*.1))}
      function sL(){[784,988,1175,1319,1568,1976].forEach((f,i)=>pT(f,.14,"square",.1,i*.08))}
      const KK={},KJ={};
      document.addEventListener("keydown",function(e){if(!document.getElementById("mjf-konami-overlay").classList.contains("active"))return;if(!KK[e.code])KJ[e.code]=true;KK[e.code]=true;if(["Space","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.code))e.preventDefault();});
      document.addEventListener("keyup",function(e){KK[e.code]=false;});
      const LVS=[["WWWWWWWWWWWWWWW","W             W","W   PPP  PPP  W","W             W","W PPP    PPP  W","W             W","W  PPPP PPPP  W","W             W","W PPP    PPP  W","W             W","W  PPPP PPPP  W","W             W","WWWWWWWWWWWWWWW"],["WWWWWWWWWWWWWWW","W             W","W PPPPPPPPPPP W","W             W","W PP       PP W","W             W","W   PPPPPPP   W","W             W","W PP       PP W","W             W","W PPPPPPPPPPP W","W             W","WWWWWWWWWWWWWWW"],["WWWWWWWWWWWWWWW","W             W","W  P  P  P  P W","W             W","W P  P  P  P  W","W             W","W  PPPPPPPPP  W","W             W","W P  P  P  P  W","W             W","W  P  P  P  P W","W             W","WWWWWWWWWWWWWWW"],["WWWWWWWWWWWWWWW","W             W","W PPPPP       W","W             W","W       PPPPP W","W             W","W  PPP PPP    W","W             W","W    PPP PPP  W","W             W","W PPPPPPPPPPP W","W             W","WWWWWWWWWWWWWWW"],["WWWWWWWWWWWWWWW","W             W","W PP  PPP  PP W","W    P   P    W","W             W","W  P       P  W","W    PPPPP    W","W  P       P  W","W             W","W    P   P    W","W PP  PPP  PP W","W             W","WWWWWWWWWWWWWWW"]];
      let PL=[],WL=[];
      function bL(lvl){PL=[];WL=[];const l=LVS[(lvl-1)%LVS.length];for(let r=0;r<l.length;r++)for(let c=0;c<l[r].length;c++){if(l[r][c]==="W")WL.push({x:c*TS,y:r*TS,w:TS,h:TS});else if(l[r][c]==="P")PL.push({x:c*TS,y:r*TS,w:TS,h:TS});}}
      function ab(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
      function rv(e){e.onGround=false;for(const w of WL){if(!ab(e,w))continue;const ox=(e.x+e.w/2)-(w.x+w.w/2),oy=(e.y+e.h/2)-(w.y+w.h/2),hw=e.w/2+w.w/2,hh=e.h/2+w.h/2,dx=hw-Math.abs(ox),dy=hh-Math.abs(oy);if(dx<dy){e.x+=dx*Math.sign(ox);e.vx=0;}else{e.y+=dy*Math.sign(oy);if(oy<0){e.vy=0;e.onGround=true;}else e.vy=0;}}for(const p of PL){if(!ab(e,p))continue;const pb=e.y+e.h-e.vy;if(e.vy>=0&&pb<=p.y+5){e.y=p.y-e.h;e.vy=0;e.onGround=true;}}}
      const PD=[{color:"#33ee33",dark:"#22aa22",snout:"#88ff88",bubC:"#44ffaa",shootKey:"KeyX",jumpKey:"Space",leftKey:"ArrowLeft",rightKey:"ArrowRight"}];
      let PS=[];
      function mP(i){return{idx:i,def:PD[i],x:i===0?55:W-75,y:H-TS*2-26,w:22,h:24,vx:0,vy:0,onGround:false,facing:i===0?1:-1,frame:0,ft:0,shootCD:0,invincible:0,alive:true,lives:3,score:0};}
      const ET=[{color:"#ff4444",hl:"#ff8888",speed:.9,pts:100,jumpH:7,jumpT:150},{color:"#ff8800",hl:"#ffcc44",speed:1.2,pts:200,jumpH:8,jumpT:110},{color:"#cc44ff",hl:"#ff88ff",speed:.8,pts:150,jumpH:6,jumpT:180},{color:"#44cc44",hl:"#88ff88",speed:1.4,pts:300,jumpH:9,jumpT:90}];
      let EN=[];
      function spE(lvl){EN=[];const n=Math.min(2+Math.floor(lvl*1.2),8);for(let i=0;i<n;i++){const t=ET[i%ET.length];EN.push({x:(2+(i%4)*3)*TS,y:(1+Math.floor(i/4)*3)*TS,w:22,h:22,vx:(i%2?1:-1)*t.speed,vy:0,onGround:false,type:t,frame:0,ft:0,trapped:false,trapBubble:null,angry:false,angerTimer:0,angryTimer:0,dead:false,jumpTimer:t.jumpT+Math.random()*60});}}
      let BB=[];
      function shB(p){if(p.shootCD>0||!p.alive)return;sS();BB.push({owner:p.idx,x:p.x+p.w/2-9,y:p.y+2,w:18,h:18,vx:p.facing*6,vy:-.5,age:0,phase:"travel",dieTimer:0,enemy:null,def:p.def});p.shootCD=18;}
      const FR=["🍎","🍊","🍋","🍇","🍓","🍑","🍒","🫐","🍍","🥝"];
      let FT=[],PA=[],FL=[],BL=[];
      const LT="BUBBLE";let LL=[false,false,false,false,false,false];
      let PO=null,PT=0,CC=0;
      function uLU(){LT.split("").forEach((_,i)=>{document.getElementById("mjf-kbl"+i).className="mjf-bl"+(LL[i]?" lit":"");});}
      function bst(x,y,c,n=10){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=1+Math.random()*4;PA.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1,life:1,d:.025+Math.random()*.02,sz:3+Math.random()*4,color:c});}}
      function flt(x,y,t,c="#ffdd00"){FL.push({x,y,txt:t,color:c,life:50,vy:-.8});}
      function dFr(x,y){FT.push({x,y,vy:-3,vx:(Math.random()-.5)*2,type:FR[Math.floor(Math.random()*FR.length)],pts:(1+Math.floor(Math.random()*5))*100,life:240});}
      function spL(i,x,y){BL.push({idx:i,x,y,letter:LT[i],life:300,vy:-.5,collected:false});}
      function uHUD(){document.getElementById("mjf-ks1").textContent=PS[0].score||0;document.getElementById("mjf-kl1").textContent=PS[0].lives||0;}
      let GS="title",LV=1,FR2=0,LCT=0,CT=3,CTm=0,CS=9;
      window._mjfKGS=GS;
      function sGS(s){GS=s;window._mjfKGS=s;}
      function stG(){LV=1;CT=3;LL=[false,false,false,false,false,false];uLU();PS=[mP(0)];stL();sGS("playing");mjfKStartMusic();}
      function stL(){bL(LV);spE(LV);BB=[];FT=[];PA=[];FL=[];BL=[];PO=null;PT=0;CC=0;document.getElementById("mjf-klvl").textContent=LV;PS.forEach(p=>{p.x=p.idx===0?55:W-75;p.y=H-TS*2-26;p.vx=0;p.vy=0;p.alive=true;if(p.invincible>0)p.invincible=120;});}
      function uP(p){if(!p.alive)return;const d=p.def,sp=2.6;if(KK[d.leftKey]){p.vx=-sp;p.facing=-1;}else if(KK[d.rightKey]){p.vx=sp;p.facing=1;}else p.vx*=.6;if(KJ[d.jumpKey]&&p.onGround){p.vy=-9;sJ();}if(KJ[d.shootKey])shB(p);p.vy+=.42;if(p.vy>12)p.vy=12;p.x+=p.vx;p.y+=p.vy;if(p.x+p.w<0)p.x=W;if(p.x>W)p.x=-p.w;rv(p);if(p.shootCD>0)p.shootCD--;if(p.invincible>0)p.invincible--;p.ft++;if(p.ft>7){p.frame=(p.frame+1)%2;p.ft=0;}}
      function uE(e){if(e.dead)return;if(e.trapped){e.y-=.55;e.x+=Math.sin(FR2*.04+e.pts)*.6;e.angerTimer++;if(e.angerTimer>220&&!e.angry){e.angry=true;if(e.trapBubble)e.trapBubble.dieTimer=1;}if(e.y<-20){e.y=H-TS;e.trapped=false;e.angry=true;e.trapBubble=null;e.angryTimer=0;}return;}if(e.angry){e.angryTimer=(e.angryTimer||0)+1;if(e.angryTimer>600){e.dead=true;bst(e.x+e.w/2,e.y+e.h/2,e.type.color,10);return;}}e.vy+=.38;if(e.vy>10)e.vy=10;e.x+=e.vx*(e.angry?1.6:1);e.y+=e.vy;if(e.x+e.w<0)e.x=W;if(e.x>W)e.x=-e.w;const pV=e.vx;rv(e);if(e.vx===0)e.vx=-pV;if(e.onGround){e.jumpTimer--;if(e.jumpTimer<=0){e.vy=-(e.type.jumpH+Math.random()*2);e.jumpTimer=e.type.jumpT*(e.angry?.6:1)+Math.random()*40;}}if(e.angry){const t=PS.find(p=>p.alive);if(t)e.vx=(t.x>e.x?1:-1)*e.type.speed*1.8;}PS.forEach(p=>{if(!p.alive||p.invincible>0)return;if(ab(p,e))hP(p);});e.ft++;if(e.ft>6){e.frame=(e.frame+1)%2;e.ft=0;}}
      function uBB(){for(let i=BB.length-1;i>=0;i--){const b=BB[i];b.age++;if(b.phase==="travel"){b.x+=b.vx;b.y+=b.vy;b.vx*=.92;b.vy+=.05;let hw=false;for(const w of WL){if(ab(b,w)){hw=true;break;}}if(hw||b.age>35||b.x<TS||b.x>W-TS||b.y<TS){b.phase="floating";b.vx=0;b.vy=0;}if(!b.enemy){for(const e of EN){if(!e.trapped&&!e.dead&&ab(b,e)){e.trapped=true;e.trapBubble=b;e.angerTimer=0;b.enemy=e;b.phase="floating";b.w=24;b.h=24;break;}}}}if(b.phase==="floating"){b.y-=.45;b.x+=Math.sin(b.age*.05+i)*.35;PS.forEach(p=>{if(!p.alive)return;if(ab(p,b))ppB(b,p);});if(b.age>320)b.dieTimer=1;}if(b.dieTimer>0){b.dieTimer++;if(b.dieTimer>8){if(b.enemy&&!b.enemy.dead){b.enemy.trapped=false;b.enemy.angry=true;b.enemy.trapBubble=null;}BB.splice(i,1);}continue;}if(b.y<-20){if(b.enemy&&!b.enemy.dead){b.enemy.trapped=false;b.enemy.angry=true;b.enemy.trapBubble=null;}BB.splice(i,1);}}}
      function ppB(b,bp){if(b.dieTimer>0)return;b.dieTimer=1;sP();const cx=b.x+b.w/2,cy=b.y+b.h/2;bst(cx,cy,"#88eeff",12);if(b.enemy){const e=b.enemy;e.dead=true;CC++;const pts=e.pts*(e.angry?2:1)*CC;bp.score+=pts;uHUD();dFr(cx,cy-10);flt(cx-14,cy-8,"+"+pts,CC>1?"#ff88ff":"#ffdd00");bst(cx,cy,e.type.color,14);const nl=LL.findIndex(v=>!v);if(nl>=0&&Math.random()<.35)spL(nl,cx,cy-20);}}
      function hP(p){p.invincible=120;sD();bst(p.x+p.w/2,p.y+p.h/2,p.def.color,16);p.lives--;uHUD();if(p.lives<=0){p.alive=false;mjfKStopMusic();if(CT>0){sGS("continue");CTm=0;}else sGS("gameover");}}
      function uFT(){for(let i=FT.length-1;i>=0;i--){const f=FT[i];f.y+=f.vy;f.vy+=.25;f.life--;if(f.vy>6)f.vy=6;for(const p of PL){if(ab({x:f.x,y:f.y,w:14,h:14},p)&&f.vy>0)f.vy*=-.35;}PS.forEach(p=>{if(!p.alive)return;if(ab(p,{x:f.x-6,y:f.y-14,w:14,h:14})){p.score+=f.pts;flt(f.x,f.y-10,"+"+f.pts,"#ff88ff");uHUD();FT.splice(i,1);bst(f.x,f.y,"#ffcc00",6);}});if(f.life<=0&&FT[i])FT.splice(i,1);}}
      function uBL(){for(let i=BL.length-1;i>=0;i--){const bl=BL[i];bl.y+=bl.vy;bl.vy+=.03;bl.life--;if(bl.vy>.5)bl.vy=.5;PS.forEach(p=>{if(!p.alive||bl.collected)return;if(ab(p,{x:bl.x-10,y:bl.y-10,w:20,h:20})){bl.collected=true;LL[bl.idx]=true;uLU();sL();flt(bl.x-4,bl.y-16,bl.letter,"#ffdd00");BL.splice(i,1);if(LL.every(v=>v)){PS.forEach(p=>p.score+=10000);uHUD();flt(W/2-40,H/2,"BUBBLE! +10000","#ffdd00");LL=[false,false,false,false,false,false];uLU();sLU();}}});if(bl.life<=0&&BL[i])BL.splice(i,1);}}
      function uPO(){if(!PO)return;PT++;PO.pulse=Math.sin(PT*.1)*4;PS.forEach(p=>{if(!p.alive)return;const dx=p.x+p.w/2-PO.x,dy=p.y+p.h/2-PO.y;if(Math.sqrt(dx*dx+dy*dy)<22){sLU();mjfKStopMusic();sGS("levelclear");LCT=0;}});}
      function chC(){if(GS!=="playing")return;if(EN.every(e=>e.dead)&&FT.length===0){if(!PO){PO={x:W/2,y:H-TS*2-10,pulse:0};flt(W/2-28,H/2,"SAÍDA!","#00ffcc");}CC=0;}}
      function dBg(){KX.fillStyle="#0a0018";KX.fillRect(0,0,W,H);for(let y=0;y<H;y+=2){KX.fillStyle="rgba(0,0,0,0.1)";KX.fillRect(0,y,W,1);}}
      function dTile(x,y,iw){if(iw){KX.fillStyle="#1e0040";KX.fillRect(x,y,TS,TS);KX.fillStyle="#3a0070";KX.fillRect(x+1,y+1,TS-2,TS-2);KX.fillStyle="#1e0040";for(let by=4;by<TS;by+=8)KX.fillRect(x+2,y+by,TS-4,2);KX.fillStyle="#8833cc";KX.fillRect(x,y,TS,2);KX.fillRect(x,y,2,TS);}else{KX.fillStyle="#2a0055";KX.fillRect(x,y,TS,TS);KX.fillStyle="#cc44ff";KX.fillRect(x,y,TS,3);KX.fillStyle="#6611aa";KX.fillRect(x,y+3,TS,TS-3);KX.fillStyle="rgba(220,120,255,0.4)";for(let dx=5;dx<TS;dx+=9)KX.fillRect(x+dx,y+7,3,3);}}
      function dLv(){WL.forEach(w=>dTile(w.x,w.y,true));PL.forEach(p=>dTile(p.x,p.y,false));}
      function dDr(p){if(!p.alive)return;if(p.invincible>0&&Math.floor(FR2/3)%2===0)return;KX.save();KX.translate(p.x+p.w/2,p.y+p.h/2);if(p.facing<0)KX.scale(-1,1);const c=p.def.color,dk=p.def.dark,tw=Math.floor(FR2/8)%2;KX.fillStyle=dk;KX.fillRect(-14+tw,-4,8,6);KX.fillStyle=c;KX.fillRect(-10,-8,20,18);KX.fillStyle=dk;KX.fillRect(-14,-6,6,10);KX.fillRect(8,-6,6,10);KX.fillStyle=c;KX.fillRect(-8,-20,16,14);KX.fillStyle=p.def.snout;KX.fillRect(4,-16,6,8);KX.fillStyle="#000";KX.fillRect(7,-14,2,2);KX.fillStyle="#000";KX.fillRect(1,-18,5,5);KX.fillStyle="#fff";KX.fillRect(2,-17,2,2);const fa=Math.floor(FR2/8)%2;KX.fillStyle=dk;KX.fillRect(-8,10,7,4+(fa?2:0));KX.fillRect(2,10,7,4+(fa?0:2));KX.restore();}
      function dEn(e){if(e.dead)return;KX.save();KX.translate(e.x+e.w/2,e.y+e.h/2);if(e.vx>0)KX.scale(-1,1);const c=e.angry?"#ff2222":e.type.color,hl=e.angry?"#ff6666":e.type.hl;KX.fillStyle=c;KX.fillRect(-9,-9,18,16);KX.fillStyle=hl;KX.fillRect(-7,-13,14,10);KX.fillStyle="#fff";KX.fillRect(-6,-12,4,5);KX.fillRect(2,-12,4,5);KX.fillStyle="#000";const es=e.frame%2;KX.fillRect(-5+es,-11,2,3);KX.fillRect(3+es,-11,2,3);KX.fillStyle=c;const ff=e.frame%2;KX.fillRect(-8,7,5,3+(ff?2:0));KX.fillRect(3,7,5,3+(ff?0:2));if(e.angry){KX.fillStyle="#000";KX.fillRect(-7,-14,4,2);KX.fillRect(3,-14,4,2);}KX.restore();}
      function dBu(b){KX.save();KX.translate(b.x+b.w/2,b.y+b.h/2);const r=b.enemy?13:9,dy=b.dieTimer>0;if(dy){KX.scale(1+b.dieTimer*.15,1+b.dieTimer*.15);KX.globalAlpha=1-b.dieTimer/8;}KX.globalAlpha*=.25;KX.fillStyle=b.def.bubC;KX.beginPath();KX.arc(0,0,r,0,Math.PI*2);KX.fill();KX.globalAlpha=dy?(1-b.dieTimer/8):1;KX.strokeStyle=b.def.bubC;KX.lineWidth=2;KX.beginPath();KX.arc(0,0,r,0,Math.PI*2);KX.stroke();KX.fillStyle="rgba(255,255,255,0.7)";KX.beginPath();KX.arc(-r*.35,-r*.35,r*.25,0,Math.PI*2);KX.fill();KX.restore();}
      function dPo(){if(!PO)return;KX.save();KX.translate(PO.x,PO.y);for(let r=0;r<3;r++){const rad=10+r*6+PO.pulse;KX.strokeStyle=`hsla(${(PT*3+r*40)%360},100%,70%,${.8-r*.2})`;KX.lineWidth=3-r;KX.beginPath();KX.arc(0,0,rad,0,Math.PI*2);KX.stroke();}KX.fillStyle="rgba(0,255,200,0.9)";KX.font="14px serif";KX.textAlign="center";KX.fillText("✦",0,5);KX.restore();}
      function dPA(){PA.forEach(p=>{KX.globalAlpha=p.life;KX.fillStyle=p.color;KX.fillRect(p.x-p.sz/2,p.y-p.sz/2,p.sz,p.sz);});KX.globalAlpha=1;}
      function dFR(){KX.font="14px serif";FT.forEach(f=>{KX.globalAlpha=Math.min(1,f.life/30);KX.fillText(f.type,f.x,f.y);});KX.globalAlpha=1;}
      function dBL(){BL.forEach(bl=>{if(bl.collected)return;KX.save();KX.translate(bl.x,bl.y);KX.fillStyle="#ffdd00";KX.shadowColor="#ffaa00";KX.shadowBlur=8;KX.font="8px 'Press Start 2P'";KX.textAlign="center";KX.fillText(bl.letter,0,0);KX.restore();});}
      function dFL(){FL.forEach(t=>{KX.globalAlpha=t.life/50;KX.fillStyle=t.color;KX.font="7px 'Press Start 2P'";KX.fillText(t.txt,t.x,t.y);});KX.globalAlpha=1;}
      function dTitle(){dBg();const by=Math.sin(FR2*.04)*12;KX.save();KX.translate(130,H/2+40+by);KX.fillStyle="#33ee33";KX.fillRect(-10,-12,20,18);KX.fillRect(-8,-22,16,14);KX.fillStyle="#000";KX.fillRect(2,-20,5,5);KX.fillStyle="#fff";KX.fillRect(3,-19,2,2);KX.restore();KX.save();KX.translate(W-130,H/2+40-by);KX.scale(-1,1);KX.fillStyle="#33bbff";KX.fillRect(-10,-12,20,18);KX.fillRect(-8,-22,16,14);KX.fillStyle="#000";KX.fillRect(2,-20,5,5);KX.fillStyle="#fff";KX.fillRect(3,-19,2,2);KX.restore();KX.textAlign="center";KX.fillStyle="#ffdd00";KX.font="14px 'Press Start 2P'";KX.shadowColor="#ff6600";KX.shadowBlur=8;KX.fillText("BUBBLE BOBBLE",W/2,H/2-20);KX.shadowBlur=0;KX.fillStyle="#fff";KX.font="7px 'Press Start 2P'";KX.fillStyle=Math.floor(FR2/15)%2?"#00ffcc":"#007766";KX.fillText("PRESSIONA ENTER",W/2,H/2+90);KX.textAlign="left";}
      function dCont(){dBg();dLv();KX.fillStyle="rgba(0,0,0,0.82)";KX.fillRect(0,0,W,H);KX.textAlign="center";KX.fillStyle="#ff4444";KX.font="13px 'Press Start 2P'";KX.shadowColor="#ff0000";KX.shadowBlur=10;KX.fillText("GAME OVER",W/2,H/2-70);KX.shadowBlur=0;const pu=Math.floor(FR2/8)%2;KX.fillStyle=pu?"#ffdd00":"#ff8800";KX.font="11px 'Press Start 2P'";KX.fillText("CONTINUE?",W/2,H/2-30);const sl=CS-Math.floor(CTm/60);KX.fillStyle=sl<=3?"#ff4444":"#fff";KX.font="32px 'Press Start 2P'";KX.shadowColor=sl<=3?"#ff0000":"#4488ff";KX.shadowBlur=16;KX.fillText(sl,W/2,H/2+30);KX.shadowBlur=0;KX.font="8px 'Press Start 2P'";KX.fillStyle="#aaa";KX.fillText("CONTINUES",W/2,H/2+60);const st=CT>0?"★".repeat(CT)+"☆".repeat(3-CT):"☆☆☆";KX.fillStyle="#ffdd00";KX.font="12px 'Press Start 2P'";KX.fillText(st,W/2,H/2+80);KX.fillStyle=Math.floor(FR2/15)%2?"#00ffcc":"#006655";KX.font="6px 'Press Start 2P'";KX.fillText("ENTER para continuar",W/2,H/2+108);KX.textAlign="left";}
      function dGO(){dBg();dLv();KX.fillStyle="rgba(0,0,0,0.75)";KX.fillRect(0,0,W,H);KX.textAlign="center";KX.fillStyle="#ff4444";KX.font="14px 'Press Start 2P'";KX.fillText("GAME OVER",W/2,H/2-30);KX.fillStyle="#ffdd00";KX.font="7px 'Press Start 2P'";KX.fillText("SCORE: "+PS[0].score,W/2,H/2+10);KX.fillStyle=Math.floor(FR2/15)%2?"#fff":"#888";KX.fillText("ENTER para reiniciar",W/2,H/2+55);KX.textAlign="left";}
      function dLC(){dBg();dLv();KX.fillStyle="rgba(0,0,0,0.55)";KX.fillRect(0,0,W,H);KX.textAlign="center";KX.fillStyle=`hsl(${FR2*4},100%,60%)`;KX.font="11px 'Press Start 2P'";KX.fillText("NÍVEL "+LV+" COMPLETO!",W/2,H/2);KX.fillStyle="#aaa";KX.font="6px 'Press Start 2P'";KX.fillText("A preparar nível "+(LV+1)+"...",W/2,H/2+24);KX.textAlign="left";}
      function loop(){
        if(!document.getElementById("mjf-konami-overlay").classList.contains("active")){requestAnimationFrame(loop);return;}
        requestAnimationFrame(loop);FR2++;
        if(GS==="title"){dTitle();if(KJ["Enter"])stG();}
        else if(GS==="continue"){dCont();CTm++;if(CTm%60===0&&CTm>0){const s=CS-Math.floor(CTm/60);if(s<=3&&s>0)pT(440+s*80,.08,"square",.08);}if(KJ["Enter"]){CT--;const ss=PS.map(p=>p.score||0);PS.forEach((p,i)=>{p.lives=3;p.alive=true;p.invincible=120;p.x=p.idx===0?55:W-75;p.y=H-TS*2-26;p.vx=0;p.vy=0;p.score=ss[i];});uHUD();stL();sGS("playing");mjfKStartMusic();}if(CTm>=CS*60)sGS("gameover");}
        else if(GS==="gameover"){dGO();if(KJ["Enter"])stG();}
        else if(GS==="levelclear"){dLC();LCT++;if(LCT>100){LV++;stL();sGS("playing");mjfKStartMusic();}}
        else if(GS==="playing"){PS.forEach(uP);EN.forEach(uE);uBB();uFT();uBL();uPO();chC();for(let i=PA.length-1;i>=0;i--){const p=PA[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.1;p.life-=p.d;if(p.life<=0)PA.splice(i,1);}for(let i=FL.length-1;i>=0;i--){const t=FL[i];t.y+=t.vy;t.life--;if(t.life<=0)FL.splice(i,1);}dBg();dLv();dPo();dPA();dFR();dBL();BB.forEach(dBu);PS.forEach(dDr);EN.forEach(dEn);dFL();}
        for(const k in KJ)delete KJ[k];
      }
      loop();
    }
    </script>
    <!-- ═══ FIM BUBBLE BOBBLE EASTER EGG ═══ -->
    <?php
}