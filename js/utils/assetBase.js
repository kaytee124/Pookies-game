/**
 * Resolves asset URLs for index.html (project root) vs pages/*.html.
 * Must load before avatar.js, preloader.js, audioManager.js, etc.
 */
(function () {
    'use strict';

    function pathname() {
        return (window.location.pathname || '').replace(/\\/g, '/');
    }

    window.getAssetRoot = function getAssetRoot() {
        return pathname().includes('/pages/') ? '../' : '';
    };

    window.resolveGameAsset = function resolveGameAsset(relativePath) {
        var rel = String(relativePath || '').replace(/^\//, '');
        return window.getAssetRoot() + rel;
    };
})();
