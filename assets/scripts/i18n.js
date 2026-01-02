// Internationalization script with automatic language detection
(function() {
    let translations = {};
    const availableLanguages = ['en', 'ru', 'es', 'de', 'fr', 'it', 'pt', 'bn', 'uk', 'uz', 'kk', 'id', 'hi', 'ur', 'ms', 'th', 'ar', 'km', 'my', 'fa', 'fil', 'zh', 'ja', 'tr', 'vi', 'ko', 'pl', 'nl', 'ro', 'el', 'cs', 'hu', 'sv', 'no', 'da', 'fi', 'he'];
    const defaultLanguage = 'en';

    // Detect user's preferred language (now based on country)
    async function detectUserLanguage() {
        // 1. Check URL parameter for country (highest priority)
        const urlParams = new URLSearchParams(window.location.search);
        const countryFromUrl = urlParams.get('country');
        if (countryFromUrl && window.getLanguageFromCountry) {
            const lang = window.getLanguageFromCountry(countryFromUrl.toUpperCase());
            if (lang && availableLanguages.includes(lang)) {
                return lang;
            }
        }
        
        // 2. Check URL parameter for language (backward compatibility)
        const langFromUrl = urlParams.get('lang');
        if (langFromUrl && availableLanguages.includes(langFromUrl)) {
            return langFromUrl;
        }

        // 3. Check localStorage for country
        const countryFromStorage = localStorage.getItem('preferredCountry');
        if (countryFromStorage && window.getLanguageFromCountry) {
            const lang = window.getLanguageFromCountry(countryFromStorage);
            if (lang && availableLanguages.includes(lang)) {
                return lang;
            }
        }

        // 4. Check localStorage for language (backward compatibility)
        const langFromStorage = localStorage.getItem('preferredLanguage');
        if (langFromStorage && availableLanguages.includes(langFromStorage)) {
            return langFromStorage;
        }

        // 5. Detect country and get language from it
        if (window.detectCountry) {
            try {
                const country = await window.detectCountry();
                if (country && window.getLanguageFromCountry) {
                    const lang = window.getLanguageFromCountry(country);
                    if (lang && availableLanguages.includes(lang)) {
                        return lang;
                    }
                }
            } catch (error) {
                console.warn('Failed to detect country, falling back to language detection', error);
            }
        }

        // 6. Fallback: Detect from browser language
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            const langCode = browserLang.split('-')[0].toLowerCase();
            if (availableLanguages.includes(langCode)) {
                return langCode;
            }
        }

        // 7. Try navigator.languages array (more accurate)
        if (navigator.languages && navigator.languages.length > 0) {
            for (let i = 0; i < navigator.languages.length; i++) {
                const lang = navigator.languages[i].split('-')[0].toLowerCase();
                if (availableLanguages.includes(lang)) {
                    return lang;
                }
            }
        }

        // 8. Default to English
        return defaultLanguage;
    }

    // Load translation file
    async function loadTranslations(lang) {
        if (!availableLanguages.includes(lang)) {
            lang = defaultLanguage;
        }

        // Return cached translation if already loaded
        if (translations[lang]) {
            return translations[lang];
        }

        try {
            const response = await fetch(`./assets/translations/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${lang}.json`);
            }
            const data = await response.json();
            translations[lang] = data;
            return data;
        } catch (error) {
            console.warn(`Failed to load translations for ${lang}, falling back to English`, error);
            // Fallback to English if translation file not found
            if (lang !== defaultLanguage) {
                return await loadTranslations(defaultLanguage);
            }
            return {};
        }
    }

    // Set language
    async function setLanguage(lang) {
        if (!availableLanguages.includes(lang)) {
            console.warn(`Language ${lang} not available, using ${defaultLanguage}`);
            lang = defaultLanguage;
        }

        localStorage.setItem('preferredLanguage', lang);
        document.documentElement.lang = lang;
        
        // Set text direction for RTL languages
        const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
        if (rtlLanguages.includes(lang)) {
            document.documentElement.dir = 'rtl';
        } else {
            document.documentElement.dir = 'ltr';
        }

        const t = await loadTranslations(lang);
        if (!t || Object.keys(t).length === 0) {
            console.error('Failed to load translations');
            return;
        }

        applyTranslations(t);
    }

    // Apply translations to the page
    function applyTranslations(t) {
        // Get device name (from detectDevice.js)
        let deviceName = 'your device';
        if (typeof getDeviceName === 'function') {
            deviceName = getDeviceName();
        } else {
            // Try to get from already set device-name elements
            const deviceEl = document.querySelector('.device-name');
            if (deviceEl) {
                deviceName = deviceEl.textContent;
            }
        }

        // Translate elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (t[key]) {
                let text = t[key];
                // Replace {device} placeholder with actual device name
                text = text.replace(/{device}/g, deviceName);
                element.textContent = text;
            }
        });

        // Translate elements with data-i18n-html (for HTML content)
        document.querySelectorAll('[data-i18n-html]').forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            if (t[key]) {
                let text = t[key];
                // Replace {device} placeholder with span containing device name
                const html = text.replace(/{device}/g, '<span class="device-name">' + deviceName + '</span>');
                element.innerHTML = html;
            }
        });

        // Translate placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (t[key]) {
                element.placeholder = t[key];
            }
        });

        // Translate title attribute
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            if (t[key]) {
                element.title = t[key];
            }
        });

        // Update page title if exists
        const titleElement = document.querySelector('title');
        if (titleElement && t.pageTitle) {
            titleElement.textContent = t.pageTitle;
        }

        // Update device names in all device-name spans
        document.querySelectorAll('.device-name').forEach(el => {
            el.textContent = deviceName;
        });
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', async function() {
        const detectedLang = await detectUserLanguage();
        await setLanguage(detectedLang);
        
        // Save detected country to localStorage
        if (window.detectCountry) {
            try {
                const country = await window.detectCountry();
                if (country) {
                    localStorage.setItem('preferredCountry', country);
                }
            } catch (error) {
                console.warn('Failed to save country to localStorage', error);
            }
        }
    });

    // Expose functions globally
    window.setLanguage = setLanguage;
    window.getCurrentLanguage = async function() {
        const country = localStorage.getItem('preferredCountry');
        if (country && window.getLanguageFromCountry) {
            return window.getLanguageFromCountry(country);
        }
        return localStorage.getItem('preferredLanguage') || await detectUserLanguage();
    };
    window.detectUserLanguage = detectUserLanguage;
})();
