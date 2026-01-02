// Country detection and mapping to languages
const countryToLanguage = {
    // English speaking countries
    'US': 'en', 'GB': 'en', 'AU': 'en', 'CA': 'en', 'NZ': 'en', 'IE': 'en',
    // Nigeria (uses English but NGN currency)
    'NG': 'ng',
    // South Africa (uses English but ZAR currency)
    'ZA': 'za',
    // Russian
    'RU': 'ru',
    // Spanish speaking countries
    'ES': 'es', 'MX': 'es', 'AR': 'es', 'EC': 'es', 'CO': 'es', 'CL': 'es', 'PE': 'es', 'VE': 'es',
    // German
    'DE': 'de', 'AT': 'de', 'CH': 'de',
    // French
    'FR': 'fr', 'BE': 'fr', 'CM': 'fr', 'SN': 'fr', 'CI': 'fr',
    // Italian
    'IT': 'it',
    // Portuguese
    'PT': 'pt', 'BR': 'pt',
    // Bengali
    'BD': 'bn',
    // Ukrainian
    'UA': 'uk',
    // Uzbek
    'UZ': 'uz',
    // Kazakh
    'KZ': 'kk',
    // Indonesian
    'ID': 'id',
    // Hindi
    'IN': 'hi',
    // Pakistan (uses English with PKR currency)
    'PK': 'pk',
    // Malay
    'MY': 'ms', 'SG': 'ms',
    // Thai
    'TH': 'th',
    // Arabic
    'SA': 'ar', 'EG': 'ar', 'DZ': 'ar', 'AE': 'ar', 'IQ': 'ar', 'MA': 'ar', 'JO': 'ar',
    // Khmer
    'KH': 'km',
    // Burmese (Myanmar/Burma)
    'MM': 'my',
    // Persian
    'IR': 'fa',
    // Filipino
    'PH': 'fil',
    // Chinese
    'CN': 'zh', 'TW': 'zh', 'HK': 'zh',
    // Japanese
    'JP': 'ja',
    // Turkish
    'TR': 'tr',
    // Vietnamese
    'VN': 'vi',
    // Korean
    'KR': 'ko',
    // Polish
    'PL': 'pl',
    // Dutch
    'NL': 'nl',
    // Romanian
    'RO': 'ro',
    // Greek
    'GR': 'el',
    // Czech
    'CZ': 'cs',
    // Hungarian
    'HU': 'hu',
    // Swedish
    'SE': 'sv',
    // Norwegian
    'NO': 'no',
    // Danish
    'DK': 'da',
    // Finnish
    'FI': 'fi',
    // Hebrew
    'IL': 'he'
};

// Detect country code from browser locale
function getCountryFromLocale() {
    const locale = navigator.language || navigator.userLanguage;
    if (locale && locale.includes('-')) {
        const countryCode = locale.split('-')[1].toUpperCase();
        return countryCode;
    }
    
    // Try navigator.languages array
    if (navigator.languages && navigator.languages.length > 0) {
        for (let i = 0; i < navigator.languages.length; i++) {
            const lang = navigator.languages[i];
            if (lang && lang.includes('-')) {
                const countryCode = lang.split('-')[1].toUpperCase();
                if (countryToLanguage[countryCode]) {
                    return countryCode;
                }
            }
        }
    }
    
    return null;
}

// Detect country by IP using free API
async function detectCountryByIP() {
    try {
        // Using ipapi.co free API (no key required for basic usage)
        const response = await fetch('https://ipapi.co/json/', {
            timeout: 3000
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.country_code) {
                return data.country_code;
            }
        }
    } catch (error) {
        console.warn('Failed to detect country by IP, using fallback methods', error);
    }
    
    // Fallback to alternative API
    try {
        const response = await fetch('https://ip-api.com/json/?fields=countryCode', {
            timeout: 3000
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.countryCode) {
                return data.countryCode;
            }
        }
    } catch (error) {
        console.warn('Failed to detect country by IP (fallback), using locale', error);
    }
    
    return null;
}

// Main function to detect country
async function detectCountry() {
    // 1. Check URL parameter (highest priority)
    const urlParams = new URLSearchParams(window.location.search);
    const countryFromUrl = urlParams.get('country');
    if (countryFromUrl) {
        const countryCode = countryFromUrl.toUpperCase();
        if (countryToLanguage[countryCode]) {
            return countryCode;
        }
    }
    
    // 2. Check localStorage
    const countryFromStorage = localStorage.getItem('preferredCountry');
    if (countryFromStorage && countryToLanguage[countryFromStorage]) {
        return countryFromStorage;
    }
    
    // 3. Try to detect from IP (async)
    const countryFromIP = await detectCountryByIP();
    if (countryFromIP && countryToLanguage[countryFromIP]) {
        return countryFromIP;
    }
    
    // 4. Try to detect from browser locale
    const countryFromLocale = getCountryFromLocale();
    if (countryFromLocale && countryToLanguage[countryFromLocale]) {
        return countryFromLocale;
    }
    
    // 5. Default to US
    return 'US';
}

// Get language code from country code
function getLanguageFromCountry(countryCode) {
    return countryToLanguage[countryCode] || 'en';
}

// Expose functions globally
window.detectCountry = detectCountry;
window.getLanguageFromCountry = getLanguageFromCountry;
window.countryToLanguage = countryToLanguage;

