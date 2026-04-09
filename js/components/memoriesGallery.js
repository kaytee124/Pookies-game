/**
 * Memories — full-screen grid of game art (backgrounds, avatars, effects, UI).
 */

const MemoriesGallery = (function() {
    let overlayEl = null;

    const IMAGE_PATHS = [
        'assets/images/backgrounds/discord-server.png',
        'assets/images/backgrounds/dreamy-hearts.png',
        'assets/images/backgrounds/fantasy-night.png',
        'assets/images/backgrounds/food-district.png',
        'assets/images/backgrounds/genshin-landscape.png',
        'assets/images/backgrounds/horizon-ending.png',
        'assets/images/backgrounds/house-building.png',
        'assets/images/backgrounds/night-call.png',
        'assets/images/backgrounds/pastel-rainbow.png',
        'assets/images/backgrounds/soft-evening.png',
        'assets/images/backgrounds/sunset-chat.png',
        'assets/images/avatars/girl/blush.png',
        'assets/images/avatars/girl/bunny.png',
        'assets/images/avatars/girl/excited.png',
        'assets/images/avatars/girl/happy.png',
        'assets/images/avatars/girl/idle.png',
        'assets/images/avatars/girl/nervous.png',
        'assets/images/avatars/girl/princess.png',
        'assets/images/avatars/girl/sad.png',
        'assets/images/avatars/girl/sleepy.png',
        'assets/images/avatars/guy/blush.png',
        'assets/images/avatars/guy/chef.png',
        'assets/images/avatars/guy/excited.png',
        'assets/images/avatars/guy/happy.png',
        'assets/images/avatars/guy/hero.png',
        'assets/images/avatars/guy/idle.png',
        'assets/images/avatars/guy/nervous.png',
        'assets/images/avatars/guy/sad.png',
        'assets/images/avatars/guy/sleepy.png',
        'assets/images/effects/bunny-ears.png',
        'assets/images/effects/confetti.png',
        'assets/images/effects/crown.png',
        'assets/images/effects/heart.png',
        'assets/images/effects/shield.png',
        'assets/images/effects/sparkle.png',
        'assets/images/effects/sword.png',
        'assets/images/effects/tear.png',
        'assets/images/ui/choice-button.png',
        'assets/images/ui/speech-bubble.png',
        'assets/images/ui/text-box.png'
    ];

    function resolveSrc(path) {
        if (typeof window.resolveGameAsset === 'function') {
            return window.resolveGameAsset(path);
        }
        return path;
    }

    function onKey(e) {
        if (e.key === 'Escape') close();
    }

    function close() {
        if (!overlayEl) return;
        document.removeEventListener('keydown', onKey);
        overlayEl.remove();
        overlayEl = null;
    }

    function open() {
        if (overlayEl) return;

        overlayEl = document.createElement('div');
        overlayEl.id = 'memories-gallery-overlay';
        overlayEl.className = 'memories-gallery-overlay';
        overlayEl.setAttribute('role', 'dialog');
        overlayEl.setAttribute('aria-modal', 'true');
        overlayEl.setAttribute('aria-label', 'Memories gallery');

        const panel = document.createElement('div');
        panel.className = 'memories-gallery-panel';

        const header = document.createElement('div');
        header.className = 'memories-gallery-header';

        const title = document.createElement('h2');
        title.className = 'memories-gallery-title';
        title.textContent = 'Memories';

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'memories-gallery-close';
        closeBtn.textContent = 'Close';
        closeBtn.addEventListener('click', close);

        header.appendChild(title);
        header.appendChild(closeBtn);

        const grid = document.createElement('div');
        grid.className = 'memories-gallery-grid';

        IMAGE_PATHS.forEach((rel) => {
            const wrap = document.createElement('figure');
            wrap.className = 'memories-gallery-item';

            const img = document.createElement('img');
            img.src = resolveSrc(rel);
            img.alt = rel.replace(/^assets\/images\//, '').replace(/\//g, ' ');
            img.loading = 'lazy';

            const cap = document.createElement('figcaption');
            cap.textContent = rel.replace('assets/images/', '');

            wrap.appendChild(img);
            wrap.appendChild(cap);
            grid.appendChild(wrap);
        });

        panel.appendChild(header);
        panel.appendChild(grid);
        overlayEl.appendChild(panel);

        overlayEl.addEventListener('click', (e) => {
            if (e.target === overlayEl) close();
        });

        document.body.appendChild(overlayEl);
        document.addEventListener('keydown', onKey);
        closeBtn.focus();
    }

    return {
        open,
        close
    };
})();
