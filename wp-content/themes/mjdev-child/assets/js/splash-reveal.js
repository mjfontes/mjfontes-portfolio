/**
 * MJDev - Splash Blur Reveal v1.0
 */
(function() {
	'use strict';

	var CFG = {
		mouseRadius: 190,
		blurMax: 13,
		opacityMin: 0.2,
		revealThreshold: 0.83,
		blurFinal: 1,
		logoTop: 30,
		logoLeft: 40,
		logoFontSize: 14
	};

	var mouseX = -9999,
		mouseY = -9999;
	var letterEls = [],
		revealedCount = 0,
		totalLetters = 0;
	var allRevealed = false,
		scrollInited = false;
	var heroFontSize = 0,
		heroTitleW = 0,
		heroTitleH = 0;
	var centeredLeft = 0,
		centeredTop = 0,
		scaleTarget = 0;
	var isMobile = window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(pointer: coarse)').matches;

	document.addEventListener('DOMContentLoaded', function() {
		var titleEl = document.querySelector('.reveal');
		if (!titleEl) return;
		buildLetters(titleEl);
		injectUI();
		if (!isMobile) {
			setTimeout(showHint, 500);
			document.addEventListener('mousemove', onMouseMove);
		} else {
			setTimeout(revealAll, 700);
		}
	});

	function buildLetters(titleEl) {
		var text = titleEl.textContent.trim();
		titleEl.textContent = '';
		titleEl.style.fontSize = 'clamp(28px, 6.5vw, 120px)';
		titleEl.style.fontWeight = '900';
		titleEl.style.letterSpacing = '-0.02em';
		titleEl.style.lineHeight = '1';
		titleEl.style.display = 'flex';
		titleEl.style.flexWrap = 'nowrap';
		titleEl.style.whiteSpace = 'nowrap';
		titleEl.style.width = 'max-content';
		titleEl.style.maxWidth = '96vw';
		titleEl.style.position = 'fixed';
		titleEl.style.top = '50%';
		titleEl.style.left = '50%';
		titleEl.style.transform = 'translate(-50%, -50%)';
		titleEl.style.zIndex = '600';
		titleEl.style.userSelect = 'none';
		titleEl.style.pointerEvents = 'auto';
		titleEl.style.margin = '0';
		titleEl.style.gap = '0';

		text.split('').forEach(function(char) {
			var span = document.createElement('span');
			if (char === ' ') {
				span.style.display = 'inline-block';
				span.style.width = '0.28em';
				span.textContent = '\u00A0';
			} else {
				span.style.display = 'inline-block';
				span.style.color = '#fff';
				span.style.opacity = CFG.opacityMin;
				span.style.filter = 'blur(' + CFG.blurMax + 'px)';
				span.style.willChange = 'filter, opacity';
				span.style.transition =
					'filter 0.45s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.45s cubic-bezier(0.25,0.46,0.45,0.94)';
				span.textContent = char;
				letterEls.push(span);
				totalLetters++;
			}
			titleEl.appendChild(span);
		});
	}

	function injectUI() {
		if (!document.querySelector('.mouse-hint')) {
			var hint = document.createElement('div');
			hint.className = 'mouse-hint';
			hint.textContent = 'Mova o rato para revelar';
			hint.style.cssText =
				'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);z-index:601;opacity:0;pointer-events:none;white-space:nowrap;transition:opacity 0.5s ease;';
			document.body.appendChild(hint);
		}
		if (!document.querySelector('.splash-progress')) {
			var bar = document.createElement('div');
			bar.className = 'splash-progress';
			bar.style.cssText =
				'position:fixed;bottom:0;left:0;height:1px;width:0%;background:rgba(255,255,255,0.5);z-index:700;pointer-events:none;transition:width 0.2s ease,opacity 0.5s ease;';
			document.body.appendChild(bar);
		}
	}

	function showHint() {
		var hint = document.querySelector('.mouse-hint');
		if (hint) hint.style.opacity = '1';
	}

	function onMouseMove(e) {
		mouseX = e.clientX;
		mouseY = e.clientY;
		var hint = document.querySelector('.mouse-hint');
		if (hint) hint.style.opacity = '0';
		if (!allRevealed) updateLetters();
	}

	function updateLetters() {
		letterEls.forEach(function(el) {
			if (el.dataset.revealed) return;
			var rect = el.getBoundingClientRect();
			var cx = rect.left + rect.width / 2;
			var cy = rect.top + rect.height / 2;
			var dist = Math.sqrt(Math.pow(mouseX - cx, 2) + Math.pow(mouseY - cy, 2));
			var prox = Math.max(0, 1 - dist / CFG.mouseRadius);
			if (prox > 0) {
				el.style.filter = 'blur(' + (CFG.blurMax * (1 - prox)).toFixed(1) + 'px)';
				el.style.opacity = (CFG.opacityMin + (1 - CFG.opacityMin) * prox).toFixed(3);
				if (prox >= CFG.revealThreshold) {
					el.dataset.revealed = '1';
					el.style.transition = 'filter 0.3s ease, opacity 0.3s ease';
					el.style.filter = 'blur(' + CFG.blurFinal + 'px)'; // ← blur 1px em vez de 0
					el.style.opacity = '1';
					revealedCount++;
					onLetterRevealed();
				}
			}
		});
	}

	function onLetterRevealed() {
		var pct = revealedCount / totalLetters * 100;
		var bar = document.querySelector('.splash-progress');
		if (bar) bar.style.width = pct + '%';
		if (revealedCount >= totalLetters) {
			allRevealed = true;
			setTimeout(function() {
				if (bar) bar.style.opacity = '0';
			}, 400);
			setTimeout(function() {
				var btns = document.querySelector('.splash-btns');
				if (btns) {
					btns.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
					btns.style.opacity = '1';
					btns.style.transform = 'translateY(0)';
				}
			}, 300);
			setTimeout(initScrollTransition, 500);
		}
	}

	function revealAll() {
		letterEls.forEach(function(el) {
			el.style.transition = 'filter 0.5s ease, opacity 0.5s ease';
			el.style.filter = 'blur(' + CFG.blurFinal + 'px)';
			el.style.opacity = '1';
			el.dataset.revealed = '1';
		});
		revealedCount = totalLetters;
		allRevealed = true;
		var btns = document.querySelector('.splash-btns');
		if (btns) {
			btns.style.opacity = '1';
			btns.style.transform = 'translateY(0)';
		}
		setTimeout(initScrollTransition, 300);
	}

	function initScrollTransition() {
		if (scrollInited) return;
		scrollInited = true;
		var titleEl = document.querySelector('.splash-letters');
		if (!titleEl) return;
		heroFontSize = parseFloat(window.getComputedStyle(titleEl).fontSize);
		heroTitleW = titleEl.offsetWidth;
		heroTitleH = titleEl.offsetHeight;
		centeredLeft = window.innerWidth / 2 - heroTitleW / 2;
		centeredTop = window.innerHeight / 2 - heroTitleH / 2;
		scaleTarget = CFG.logoFontSize / heroFontSize;

		// Spacer: dá altura de scroll ao body (o splash é position:fixed)
		if (!document.getElementById('splash-spacer')) {
			var spacer = document.createElement('div');
			spacer.id = 'splash-spacer';
			spacer.style.cssText = 'height:100vh;pointer-events:none;position:relative;z-index:0;';
			var main = document.getElementById('main');
			if (main && main.parentNode) {
				main.parentNode.insertBefore(spacer, main);
			} else {
				document.body.appendChild(spacer);
			}
		}

		window.addEventListener('scroll', onHeroScroll, { passive: true });

		var btn = document.querySelector('.scroll-indicator');
		if (btn) {
			btn.addEventListener('click', function(e) {
				e.preventDefault();
				if (!allRevealed) return;
				var main = document.getElementById('main');
				window.scrollTo({ top: main ? main.offsetTop : window.innerHeight, behavior: 'smooth' });
			});
		}
	}

	function onHeroScroll() {
		if (!allRevealed) {
			window.scrollTo(0, 0);
			return;
		}
		var titleEl = document.querySelector('.splash-letters');
		if (!titleEl) return;
		var scrollY = window.scrollY || window.pageYOffset;
		var main = document.getElementById('main');
		var maxScroll = main ? main.offsetTop : window.innerHeight;
		var progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
		var eased = easeInOut(progress);

		var moveX = (CFG.logoLeft - centeredLeft) * eased;
		var moveY = (CFG.logoTop - centeredTop) * eased;
		var scale = 1 + (scaleTarget - 1) * eased;
		var tx = centeredLeft + moveX - (window.innerWidth / 2 - heroTitleW / 2);
		var ty = centeredTop + moveY - (window.innerHeight / 2 - heroTitleH / 2);
		titleEl.style.transformOrigin = 'top left';
		titleEl.style.transform =
			'translate(calc(-50% + ' + tx + 'px), calc(-50% + ' + ty + 'px)) scale(' + scale.toFixed(4) + ')';

		var splash = document.getElementById('splash');
		if (splash) {
			var op = Math.max(0, 1 - eased * 1.3);
			splash.style.opacity = op;
			splash.style.pointerEvents = op < 0.05 ? 'none' : 'auto';
		}

		var col = Math.round(255 * (1 - eased));
		titleEl.querySelectorAll('span').forEach(function(el) {
			el.style.color = 'rgb(' + col + ',' + col + ',' + col + ')';
		});

		if (progress <= 0 && splash) {
			splash.style.opacity = '1';
			splash.style.pointerEvents = 'auto';
			titleEl.style.transform = 'translate(-50%, -50%)';
			titleEl.querySelectorAll('span').forEach(function(el) {
				el.style.color = '#fff';
			});
		}
	}

	function easeInOut(t) {
		return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	}
})();
