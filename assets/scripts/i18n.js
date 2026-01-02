// Internationalization script with automatic language detection
(function() {
    let translations = {};
    const availableLanguages = ['en', 'ru', 'es', 'de', 'fr', 'it', 'pt', 'bn', 'uk', 'uz', 'kk', 'id', 'hi', 'ur', 'ms', 'th', 'ar', 'km', 'my', 'fa', 'fil', 'zh', 'ja', 'tr', 'vi', 'ko', 'pl', 'nl', 'ro', 'el', 'cs', 'hu', 'sv', 'no', 'da', 'fi', 'he', 'za', 'ng', 'pk'];
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
            console.warn(`Language ${lang} not available, using ${defaultLanguage}`);
            lang = defaultLanguage;
        }

        // Return cached translation if already loaded
        if (translations[lang]) {
            return translations[lang];
        }

        try {
            const response = await fetch(`./assets/translations/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${lang}.json: ${response.status}`);
            }
            const data = await response.json();
            translations[lang] = data;
            console.log(`Loaded translations for ${lang}:`, data);
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
        if (!t || Object.keys(t).length === 0) {
            console.warn('No translations to apply');
            return;
        }
        
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
        const elementsToTranslate = document.querySelectorAll('[data-i18n]');
        console.log(`Found ${elementsToTranslate.length} elements with data-i18n`);
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (t[key]) {
                let text = t[key];
                // Replace {device} placeholder with actual device name
                text = text.replace(/{device}/g, deviceName);
                element.textContent = text;
                console.log(`Translated ${key}:`, text);
            } else {
                console.warn(`Translation key "${key}" not found in translations`);
            }
        });

        // Translate elements with data-i18n-html (for HTML content)
        const elementsToTranslateHtml = document.querySelectorAll('[data-i18n-html]');
        console.log(`Found ${elementsToTranslateHtml.length} elements with data-i18n-html`);
        elementsToTranslateHtml.forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            if (t[key]) {
                let text = t[key];
                // Replace {device} placeholder with span containing device name
                const html = text.replace(/{device}/g, '<span class="device-name">' + deviceName + '</span>');
                element.innerHTML = html;
                console.log(`Translated HTML ${key}:`, text);
            } else {
                console.warn(`Translation key "${key}" not found in translations for HTML`);
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

    // Wait for countryDetect.js to be ready
    function waitForCountryDetect(maxAttempts = 10) {
        return new Promise((resolve) => {
            let attempts = 0;
            const checkInterval = setInterval(() => {
                attempts++;
                if (window.detectCountry && window.getLanguageFromCountry || attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 50);
        });
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', async function() {
        // Wait for countryDetect.js to be ready
        await waitForCountryDetect();
        
        let detectedLang = null;
        
        try {
            // First, try fast detection (URL, localStorage, browser)
            const urlParams = new URLSearchParams(window.location.search);
            const countryFromUrl = urlParams.get('country');
            const langFromUrl = urlParams.get('lang');
            const countryFromStorage = localStorage.getItem('preferredCountry');
            const langFromStorage = localStorage.getItem('preferredLanguage');
            
            // Fast path: if we have URL or localStorage, use it immediately
            if (countryFromUrl && window.getLanguageFromCountry) {
                detectedLang = window.getLanguageFromCountry(countryFromUrl.toUpperCase());
            } else if (langFromUrl && availableLanguages.includes(langFromUrl)) {
                detectedLang = langFromUrl;
            } else if (countryFromStorage && window.getLanguageFromCountry) {
                detectedLang = window.getLanguageFromCountry(countryFromStorage);
            } else if (langFromStorage && availableLanguages.includes(langFromStorage)) {
                detectedLang = langFromStorage;
            } else {
                // Try browser language (fast, no async)
                const browserLang = navigator.language || navigator.userLanguage;
                if (browserLang) {
                    const langCode = browserLang.split('-')[0].toLowerCase();
                    if (availableLanguages.includes(langCode)) {
                        detectedLang = langCode;
                    }
                }
            }
            
            // If no fast detection, wait for country detection
            if (!detectedLang || !availableLanguages.includes(detectedLang)) {
                detectedLang = await detectUserLanguage();
            }
            
            console.log('Detected language:', detectedLang);
            
            // Save detected country to localStorage
            if (window.detectCountry && !countryFromStorage) {
                try {
                    const country = await window.detectCountry();
                    if (country) {
                        localStorage.setItem('preferredCountry', country);
                        console.log('Detected country:', country);
                        // Re-check language from country if we didn't have it before
                        if (!detectedLang || detectedLang === defaultLanguage) {
                            const langFromCountry = window.getLanguageFromCountry(country);
                            if (langFromCountry && availableLanguages.includes(langFromCountry)) {
                                detectedLang = langFromCountry;
                            }
                        }
                    }
                } catch (error) {
                    console.warn('Failed to save country to localStorage', error);
                }
            }
            
            // Apply translations once with final language
            if (detectedLang && availableLanguages.includes(detectedLang)) {
                await setLanguage(detectedLang);
            } else {
                await setLanguage(defaultLanguage);
            }
        } catch (error) {
            console.error('Error initializing translations:', error);
            // Fallback to English
            await setLanguage(defaultLanguage);
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

