
function getDeviceName() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
        return "Android device";
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS device";
    }

    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/windows/i.test(userAgent)) {
        return "Windows PC";
    }

    if (/macintosh|mac os x/i.test(userAgent)) {
        return "Mac";
    }

    return "your device"; 
}

document.addEventListener("DOMContentLoaded", async function () {
    const deviceName = getDeviceName();
    const elements = document.querySelectorAll('.device-name');

    elements.forEach(el => {
        el.textContent = deviceName;
    });

    // Trigger translation update if i18n is loaded (wait a bit for i18n to initialize)
    setTimeout(async function() {
        if (window.setLanguage && window.getCurrentLanguage) {
            const currentLang = window.getCurrentLanguage();
            await window.setLanguage(currentLang);
        }
    }, 200);
});