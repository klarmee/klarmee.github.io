document.addEventListener("DOMContentLoaded", function() {
    if (window.location.hash) {
        var targetId = window.location.hash.substring(1); // Remove the leading '#'
        var targetElement = document.getElementById(targetId);
        if (targetElement) {
            var style = document.createElement('style');
            style.textContent = '#' + targetId + '{background: rgba(255,255,255,.2);}';
            document.head.appendChild(style);
        }
    }
    });    