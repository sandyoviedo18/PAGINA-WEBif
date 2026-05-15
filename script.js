document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.reveal');
    const header = document.querySelector('#main-header');
    let revealTimeout = null;
    let lastScrollY = window.scrollY;
    const scrollThreshold = 60;

    const revealOnScroll = () => {
        if (revealTimeout) cancelAnimationFrame(revealTimeout);
        revealTimeout = requestAnimationFrame(() => {
            const windowHeight = window.innerHeight;
            const currentScrollY = window.scrollY;

            for (let i = 0; i < reveals.length; i++) {
                const elementTop = reveals[i].getBoundingClientRect().top;
                if (elementTop < windowHeight - 150) {
                    reveals[i].classList.add('active');
                }
            }

            // Scrolled state
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show header on scroll direction
            const isMenuOpen = navLinks && navLinks.classList.contains('active');
            if (currentScrollY > scrollThreshold && !isMenuOpen) {
                if (currentScrollY > lastScrollY) {
                    header.classList.add('header-hidden');
                } else {
                    header.classList.remove('header-hidden');
                }
            } else {
                header.classList.remove('header-hidden');
            }

            lastScrollY = currentScrollY;
        });
    };

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll();

    // ===== MENÚ HAMBURGUESA =====
    const menuToggle = document.querySelector('#mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    // Crear overlay para menú móvil
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }

    const closeMenu = () => {
        menuToggle.classList.remove('is-active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    const openMenu = () => {
        menuToggle.classList.add('is-active');
        navLinks.classList.add('active');
        overlay.classList.add('active');
        header.classList.remove('header-hidden');
        document.body.style.overflow = 'hidden';
    };

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navLinks.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        overlay.addEventListener('click', closeMenu);

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu tapping anywhere outside nav panel
        document.addEventListener('click', (e) => {
            if (!navLinks.classList.contains('active')) return;
            if (navLinks.contains(e.target) || menuToggle.contains(e.target)) return;
            closeMenu();
        });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.includes('#') && href.length > href.indexOf('#') + 1) {
                const parts = href.split('#');
                const targetPage = parts[0];
                const targetId = parts[1];
                const currentPath = window.location.pathname;
                const currentFileName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
                const isTargetOnCurrentPage = (targetPage === '' && targetId !== '') ||
                    (targetPage === currentFileName && targetId !== '') ||
                    (targetPage === 'index.html' && currentFileName === '' && targetId !== '');

                if (isTargetOnCurrentPage) {
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        });
    });

    // ===== RIPPLE EFFECT =====
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            this.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });

    // ===== DARK MODE =====
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    const themeToggle = document.querySelector('#themeToggle');
    if (themeToggle) {
        const updateIcon = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        };
        updateIcon();

        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
            updateIcon();
        });
    }

    // ===== ANIMATED COUNTERS =====
    const counters = document.querySelectorAll('.stat-item h3');
    if (counters.length > 0) {
        let countersAnimated = false;

        const animateCounters = () => {
            if (countersAnimated) return;
            const section = counters[0].closest('.stats-section');
            if (!section) return;
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                countersAnimated = true;
                counters.forEach(counter => {
                    const text = counter.textContent;
                    const num = parseInt(text.replace(/[^0-9]/g, ''));
                    const prefix = text.replace(/[0-9]/g, '');
                    if (isNaN(num)) return;
                    counter.textContent = prefix + '0';
                    const target = num;
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;

                    const update = () => {
                        current += step;
                        if (current < target) {
                            counter.textContent = prefix + Math.floor(current);
                            requestAnimationFrame(update);
                        } else {
                            counter.textContent = prefix + target;
                        }
                    };
                    requestAnimationFrame(update);
                });
                window.removeEventListener('scroll', checkCounters);
            }
        };

        const checkCounters = () => animateCounters();
        window.addEventListener('scroll', checkCounters, { passive: true });
        animateCounters();
    }

    // ===== PROGRESS BAR & CIRCLE =====
    const progressFill = document.querySelector('.progress-bar-fill');
    const progressCircle = document.querySelector('#progressCircle');
    const progressPercent = document.querySelector('#progressPercent');
    const servedCount = document.querySelector('#servedCount');

    if (progressFill || progressCircle) {
        let progressAnimated = false;
        const animateProgress = () => {
            if (progressAnimated) return;
            const card = progressFill?.closest('.progress-card');
            if (!card) return;
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                progressAnimated = true;
                const target = parseInt(progressFill?.dataset?.target || 71);
                const circumference = 2 * Math.PI * 60; // r=60
                const offset = circumference - (target / 100) * circumference;

                // Linear bar
                if (progressFill) progressFill.style.width = target + '%';

                // Circle
                if (progressCircle) progressCircle.style.strokeDashoffset = offset;
                if (progressPercent) progressPercent.textContent = target + '%';

                // Counter
                if (servedCount) {
                    const total = 200;
                    const finalCount = Math.round(total * target / 100);
                    let current = 0;
                    const step = Math.ceil(finalCount / 40);
                    const counter = setInterval(() => {
                        current += step;
                        if (current >= finalCount) {
                            current = finalCount;
                            clearInterval(counter);
                        }
                        servedCount.textContent = current.toLocaleString();
                    }, 30);
                }

                window.removeEventListener('scroll', checkProgress);
            }
        };
        const checkProgress = () => animateProgress();
        window.addEventListener('scroll', checkProgress, { passive: true });
        animateProgress();
    }

    // ===== WHATSAPP FLOATING WIDGET =====
    const waBtn = document.querySelector('#whatsappBtn');
    const waPopup = document.querySelector('#whatsappPopup');
    if (waBtn && waPopup) {
        waBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            waPopup.classList.toggle('show');
        });
        document.addEventListener('click', (e) => {
            if (!waPopup.contains(e.target) && e.target !== waBtn) {
                waPopup.classList.remove('show');
            }
        });
    }

    // ===== LIGHTBOX MODERNO =====
    const lightbox = document.querySelector('#lightbox');
    const lightboxImg = document.querySelector('#lightboxImg');
    let lightboxImages = [];
    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    const openLightbox = (index) => {
        if (!lightboxImages.length) return;
        currentIndex = index;
        const item = lightboxImages[currentIndex];
        lightboxImg.src = item.src;
        lightboxImg.alt = item.caption;
        lightboxImg.classList.remove('zoomed');
        updateLightboxUI();
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    const updateLightboxUI = () => {
        const caption = lightbox.querySelector('.lightbox-caption');
        const counter = lightbox.querySelector('.lightbox-counter');
        const prev = lightbox.querySelector('.lightbox-prev');
        const next = lightbox.querySelector('.lightbox-next');
        if (caption) caption.textContent = lightboxImages[currentIndex]?.caption || '';
        if (counter) counter.textContent = `${currentIndex + 1} / ${lightboxImages.length}`;
        if (prev) prev.style.display = lightboxImages.length > 1 ? 'flex' : 'none';
        if (next) next.style.display = lightboxImages.length > 1 ? 'flex' : 'none';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
    };

    const navigateLightbox = (dir) => {
        if (!lightboxImages.length) return;
        currentIndex = (currentIndex + dir + lightboxImages.length) % lightboxImages.length;
        const item = lightboxImages[currentIndex];
        lightboxImg.src = item.src;
        lightboxImg.alt = item.caption;
        lightboxImg.classList.remove('zoomed');
        updateLightboxUI();
    };

    const collectGalleryImages = () => {
        lightboxImages = [];
        document.querySelectorAll('.gallery-item img').forEach(img => {
            const figure = img.closest('figure') || img.parentElement;
            const figcaption = figure?.querySelector('figcaption, .gallery-overlay span');
            lightboxImages.push({
                src: img.src,
                caption: figcaption?.textContent?.trim() || img.alt || ''
            });
        });
    };

    if (lightbox && lightboxImg) {
        collectGalleryImages();

        document.querySelectorAll('.gallery-item img').forEach((img, idx) => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                collectGalleryImages();
                const newIdx = lightboxImages.findIndex(i => i.src === img.src);
                openLightbox(newIdx >= 0 ? newIdx : idx);
            });
        });

        // Close on backdrop click (imagen, botones quedan excluidos)
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.closest('.lightbox-inner') === e.target) {
                closeLightbox();
            }
        });

        // Close button
        const closeBtn = lightbox.querySelector('.lightbox-close');
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

        // Navigation
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(-1); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(1); });

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('show')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        });

        // Touch swipe
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                navigateLightbox(diff > 0 ? 1 : -1);
            }
        }, { passive: true });

        // Zoom on click
        lightboxImg.addEventListener('click', (e) => {
            e.stopPropagation();
            lightboxImg.classList.toggle('zoomed');
        });
    }

    // ===== RADIO LOGIC =====
    const muteBtn = document.querySelector('#mute-btn');
    const playBtn = document.querySelector('#play-btn-manual');
    const volumeSlider = document.querySelector('#volume-slider');
    const audioPlayer = document.querySelector('#dinamica-player');

    if (audioPlayer) {
        const updatePlayUI = () => {
            if (!playBtn) return;
            playBtn.innerHTML = audioPlayer.paused ?
                '<i class="fas fa-play"></i> Reproducir' :
                '<i class="fas fa-pause"></i> Pausar';
        };

        const updateMuteUI = () => {
            if (!muteBtn) return;
            muteBtn.innerHTML = audioPlayer.muted ?
                '<i class="fas fa-volume-mute"></i> Activar Sonido' :
                '<i class="fas fa-volume-up"></i> Silenciar';
            muteBtn.style.background = audioPlayer.muted ? '#64748b' : 'var(--accent-color)';
            if (volumeSlider) volumeSlider.style.opacity = audioPlayer.muted ? '0.5' : '1';
        };

        if (playBtn) {
            let playHandler = null;
            const setupPlayHandler = () => {
                if (playHandler) {
                    audioPlayer.removeEventListener('canplay', playHandler);
                }
                playHandler = function playHandler() {
                    audioPlayer.play().catch(error => {
                        console.warn("Error al intentar reproducir el stream:", error);
                        alert("El navegador bloqueó la reproducción automática. Por favor, intente de nuevo.");
                    });
                    audioPlayer.removeEventListener('canplay', playHandler);
                    playHandler = null;
                };
                audioPlayer.addEventListener('canplay', playHandler);
            };

            playBtn.addEventListener('click', () => {
                if (audioPlayer.paused) {
                    audioPlayer.load();
                    setupPlayHandler();
                } else {
                    audioPlayer.pause();
                }
                updatePlayUI();
            });

            audioPlayer.addEventListener('play', updatePlayUI);
            audioPlayer.addEventListener('pause', updatePlayUI);
        }

        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                audioPlayer.muted = !audioPlayer.muted;
                updateMuteUI();
            });
        }

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                audioPlayer.volume = e.target.value;
                if (audioPlayer.volume > 0) audioPlayer.muted = false;
                updateMuteUI();
            });
        }
    }
});
