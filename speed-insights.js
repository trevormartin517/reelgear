// Vercel Speed Insights initialization
// This script initializes Speed Insights for the ReelFishigan project

// Initialize the queue for Speed Insights
(function() {
    // Initialize the global Speed Insights queue
    window.si = window.si || function() {
        (window.siq = window.siq || []).push(arguments);
    };

    // Load the Speed Insights script
    // Note: This will only track metrics in production when deployed on Vercel
    var script = document.createElement('script');
    script.src = 'https://va.vercel-scripts.com/v1/speed-insights/script.js';
    script.defer = true;
    
    script.onerror = function() {
        console.log('[Vercel Speed Insights] Failed to load script. Please check if any content blockers are enabled.');
    };
    
    // Append the script to the document head
    if (document.head) {
        document.head.appendChild(script);
    } else {
        // If head is not ready, wait for DOMContentLoaded
        document.addEventListener('DOMContentLoaded', function() {
            document.head.appendChild(script);
        });
    }
})();
