/* ==========================================================================
   PORTFOLIO INTERACTIVE CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Core Elements
    const viewport = document.getElementById('viewport');
    const world = document.getElementById('world');
    const overlays = document.getElementById('overlays');
    const panels = document.querySelectorAll('.overlay-panel');
    const navLinks = document.querySelectorAll('.nav-link');
    const closeButtons = document.querySelectorAll('.close-panel-btn');
    const boxes = document.querySelectorAll('.box-3d');
    const wrappers = document.querySelectorAll('.box-3d-wrapper');

    // 3D Parallax State
    let isZoomed = false;
    let currentZoomTarget = null;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    // Define 3D Zoom Coordinates for each section (corresponds to inverting box coordinates)
    const zoomTransforms = {
        'about': {
            translateX: 501,
            translateY: -500,
            translateZ: 520,
            rotateY: -20
        },
        'response1': {
            translateX: 167,
            translateY: -500,
            translateZ: 570,
            rotateY: -7
        },
        'response2': {
            translateX: -167,
            translateY: -500,
            translateZ: 570,
            rotateY: 7
        },
        'cited': {
            translateX: -501,
            translateY: -500,
            translateZ: 520,
            rotateY: 20
        }
    };

    // Make the logo bring the user back to the home gallery view
    const logoButton = document.querySelector('.logo');
    if (logoButton) {
        logoButton.addEventListener('click', () => {
            // Only trigger if the user is currently zoomed into a panel
            if (isZoomed) {
                zoomOutToGallery();
            }
        });
    }

    /* ==========================================================================
       AMBIENT DUST PARTICLES GENERATOR
       ========================================================================== */
    const initParticles = () => {
        const container = document.getElementById('particles');
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Random styling
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 8}s`;
            particle.style.animationDuration = `${8 + Math.random() * 6}s`;
            particle.style.opacity = Math.random() * 0.4 + 0.1;

            container.appendChild(particle);
        }
    };
    initParticles();

    /* ==========================================================================
       MOUSE MOVE PARALLAX LOOP
       ========================================================================== */
    window.addEventListener('mousemove', (e) => {
        if (isZoomed) return; // Disable parallax during camera zoom

        // Calculate cursor position offset from center (-0.5 to 0.5)
        targetMouseX = (e.clientX / window.innerWidth) - 0.5;
        targetMouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    const updateParallax = () => {
        if (!isZoomed) {
            // Smooth interpolation (Inertia effect)
            currentMouseX += (targetMouseX - currentMouseX) * 0.08;
            currentMouseY += (targetMouseY - currentMouseY) * 0.08;

            // Calculate rotation values
            const baseRotateX = 10; // Default floor look-down angle
            const rx = baseRotateX - (currentMouseY * 15); // Tilt up/down
            const ry = currentMouseX * 24;                 // Pan left/right

            // Apply to 3D world
            world.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
        }
        requestAnimationFrame(updateParallax);
    };
    updateParallax();

    /* ==========================================================================
       ZOOM NAVIGATION LOGIC (CAMERA TO BOX)
       ========================================================================== */
    const zoomToBox = (destination) => {
        if (!zoomTransforms[destination]) return;

        isZoomed = true;
        currentZoomTarget = destination;

        // 1. Remove active-zoom class from all wrappers first
        wrappers.forEach(w => w.classList.remove('active-zoom'));

        // 2. Identify active wrapper and add classes
        const targetWrapper = document.getElementById(`wrapper-${destination}`);
        if (targetWrapper) {
            targetWrapper.classList.add('active-zoom');
        }
        viewport.classList.add('zoomed');

        // 3. Zoom camera into the box using inverse matrix coordinate transforms
        const coords = zoomTransforms[destination];

        // On mobile, the CSS ignores translate3d/rotateY on world, but let's apply it cleanly
        world.style.transform = `translate3d(${coords.translateX}px, ${coords.translateY}px, ${coords.translateZ}px) rotateY(${coords.rotateY}deg)`;

        // 4. Delay the overlay reader fade-in slightly to let the 3D zoom complete
        setTimeout(() => {
            // Hide other panels
            panels.forEach(p => p.classList.remove('active'));

            // Show target panel
            const targetPanel = document.getElementById(`panel-${destination}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
                targetPanel.scrollTop = 0;
            }

            // Sync Header Nav State
            updateHeaderNav(destination);
        }, 600);
    };

    const zoomOutToGallery = () => {
        // 1. Fade out reader panels
        panels.forEach(p => p.classList.remove('active'));

        // 2. Clear header links active state, highlight "Home Scene"
        updateHeaderNav('home');

        // 3. Smooth zoom coordinates reset
        setTimeout(() => {
            viewport.classList.remove('zoomed');
            wrappers.forEach(w => w.classList.remove('active-zoom'));

            // Return camera to default coordinates
            isZoomed = false;
            currentZoomTarget = null;

            // Set mouse target back to current positions so it doesn't snap
            targetMouseX = currentMouseX;
            targetMouseY = currentMouseY;
        }, 150);
    };

    const updateHeaderNav = (activeTarget) => {
        navLinks.forEach(link => {
            if (link.getAttribute('data-target') === activeTarget) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    /* ==========================================================================
       EVENT LISTENERS
       ========================================================================== */

    // Click on 3D Box wrapper to zoom in (larger, easier click target)
    wrappers.forEach(wrapper => {
        wrapper.addEventListener('click', (e) => {
            const box = wrapper.querySelector('.box-3d');
            const dest = box.getAttribute('data-destination');
            zoomToBox(dest);
        });
    });

    // Close buttons ("Back to Gallery")
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            zoomOutToGallery();
        });
    });

    // Global Header Nav Bar Click Events
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const target = link.getAttribute('data-target');

            if (target === 'home') {
                zoomOutToGallery();
            } else {
                // If already zoomed to another page, transition directly in background!
                if (isZoomed && currentZoomTarget !== target) {
                    // Quick fade out of old panel, zoom to new coordinates, fade in new panel
                    panels.forEach(p => p.classList.remove('active'));
                    zoomToBox(target);
                } else {
                    zoomToBox(target);
                }
            }
        });
    });

    // Handle Escape key to return to home
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isZoomed) {
            zoomOutToGallery();
        }
    });

    /* ==========================================================================
       MEDIA PLAYER CONTROLS (MOCKUPS)
       ========================================================================== */

    // Podcast Player Play/Pause Simulation
    const podcastToggle = document.getElementById('podcast-play-toggle');
    if (podcastToggle) {
        let isPlaying = false;
        const iconSpan = podcastToggle.querySelector('.play-icon');
        const progressBar = podcastToggle.nextElementSibling.querySelector('.progress-bar');
        const timeDisplay = podcastToggle.nextElementSibling.querySelector('.time-display');
        let playInterval;
        let seconds = 225; // 03:45 starting point

        const formatTime = (sec) => {
            const m = Math.floor(sec / 60);
            const s = sec % 60;
            return `0${m}:${s < 10 ? '0' : ''}${s}`;
        };

        podcastToggle.addEventListener('click', () => {
            isPlaying = !isPlaying;
            if (isPlaying) {
                iconSpan.textContent = '❚❚';
                podcastToggle.style.backgroundColor = 'var(--accent)';
                podcastToggle.style.color = '#ffffff';

                // Animate progress simulation
                playInterval = setInterval(() => {
                    seconds++;
                    if (seconds >= 680) { // Max time 11:20
                        clearInterval(playInterval);
                        isPlaying = false;
                        iconSpan.textContent = '▶';
                        return;
                    }
                    timeDisplay.textContent = `${formatTime(seconds)} / 11:20`;
                    progressBar.style.width = `${(seconds / 680) * 100}%`;
                }, 1000);
            } else {
                iconSpan.textContent = '▶';
                podcastToggle.style.backgroundColor = '#ffffff';
                podcastToggle.style.color = '#000000';
                clearInterval(playInterval);
            }
        });
    }

    // Video Player Click Simulation
    const videoOverlay = document.getElementById('video-mock-overlay');
    if (videoOverlay) {
        videoOverlay.addEventListener('click', () => {
            videoOverlay.style.opacity = '0';
            videoOverlay.style.pointerEvents = 'none';
            alert("This simulates triggering video playback. To add your own video:\n1. Open index.html\n2. Locate the '.placeholder-media-video' block in Section III\n3. Replace it with your video embed iframe (YouTube/Vimeo) or HTML5 video tag!");
        });
    }
});
