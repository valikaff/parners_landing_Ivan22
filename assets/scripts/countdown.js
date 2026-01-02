// Countdown timer script with translation support
document.addEventListener('DOMContentLoaded', function() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;

    // Start with 4 minutes 59 seconds
    let totalSeconds = 4 * 60 + 59;

    // Get translations for time units
    function getTimeTranslations() {
        const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'en';
        const translations = {
            en: { minute: 'minute', minutes: 'minutes', second: 'second', seconds: 'seconds' },
            ru: { minute: 'минута', minutes: 'минуты', second: 'секунда', seconds: 'секунды' },
            es: { minute: 'minuto', minutes: 'minutos', second: 'segundo', seconds: 'segundos' },
            de: { minute: 'Minute', minutes: 'Minuten', second: 'Sekunde', seconds: 'Sekunden' },
            fr: { minute: 'minute', minutes: 'minutes', second: 'seconde', seconds: 'secondes' },
            it: { minute: 'minuto', minutes: 'minuti', second: 'secondo', seconds: 'secondi' },
            pt: { minute: 'minuto', minutes: 'minutos', second: 'segundo', seconds: 'segundos' },
            bn: { minute: 'মিনিট', minutes: 'মিনিট', second: 'সেকেন্ড', seconds: 'সেকেন্ড' },
            uk: { minute: 'хвилина', minutes: 'хвилини', second: 'секунда', seconds: 'секунди' },
            uz: { minute: 'daqiqa', minutes: 'daqiqa', second: 'soniya', seconds: 'soniya' },
            kk: { minute: 'минут', minutes: 'минут', second: 'секунд', seconds: 'секунд' },
            id: { minute: 'menit', minutes: 'menit', second: 'detik', seconds: 'detik' },
            hi: { minute: 'मिनट', minutes: 'मिनट', second: 'सेकंड', seconds: 'सेकंड' },
            ur: { minute: 'منٹ', minutes: 'منٹ', second: 'سیکنڈ', seconds: 'سیکنڈ' },
            ms: { minute: 'minit', minutes: 'minit', second: 'saat', seconds: 'saat' },
            th: { minute: 'นาที', minutes: 'นาที', second: 'วินาที', seconds: 'วินาที' },
            ar: { minute: 'دقيقة', minutes: 'دقائق', second: 'ثانية', seconds: 'ثواني' },
            km: { minute: 'នាទី', minutes: 'នាទី', second: 'វិនាទី', seconds: 'វិនាទី' },
            fa: { minute: 'دقیقه', minutes: 'دقیقه', second: 'ثانیه', seconds: 'ثانیه' },
            fil: { minute: 'minuto', minutes: 'minuto', second: 'segundo', seconds: 'segundo' },
            zh: { minute: '分钟', minutes: '分钟', second: '秒', seconds: '秒' },
            ja: { minute: '分', minutes: '分', second: '秒', seconds: '秒' },
            tr: { minute: 'dakika', minutes: 'dakika', second: 'saniye', seconds: 'saniye' },
            vi: { minute: 'phút', minutes: 'phút', second: 'giây', seconds: 'giây' },
            ko: { minute: '분', minutes: '분', second: '초', seconds: '초' },
            pl: { minute: 'minuta', minutes: 'minuty', second: 'sekunda', seconds: 'sekundy' },
            nl: { minute: 'minuut', minutes: 'minuten', second: 'seconde', seconds: 'seconden' },
            ro: { minute: 'minut', minutes: 'minute', second: 'secundă', seconds: 'secunde' },
            el: { minute: 'λεπτό', minutes: 'λεπτά', second: 'δευτερόλεπτο', seconds: 'δευτερόλεπτα' },
            cs: { minute: 'minuta', minutes: 'minuty', second: 'sekunda', seconds: 'sekundy' },
            hu: { minute: 'perc', minutes: 'perc', second: 'másodperc', seconds: 'másodperc' },
            sv: { minute: 'minut', minutes: 'minuter', second: 'sekund', seconds: 'sekunder' },
            no: { minute: 'minutt', minutes: 'minutter', second: 'sekund', seconds: 'sekunder' },
            da: { minute: 'minut', minutes: 'minutter', second: 'sekund', seconds: 'sekunder' },
            fi: { minute: 'minuutti', minutes: 'minuuttia', second: 'sekunti', seconds: 'sekuntia' },
            he: { minute: 'דקה', minutes: 'דקות', second: 'שנייה', seconds: 'שניות' }
        };
        return translations[lang] || translations.en;
    }

    function updateCountdown() {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const t = getTimeTranslations();
        
        // Format: "X minutes Y seconds" or "X minute Y second" (singular)
        let text = '';
        if (minutes > 0) {
            text += minutes + ' ' + (minutes === 1 ? t.minute : t.minutes) + ' ';
        }
        if (seconds > 0 || minutes === 0) {
            text += seconds + ' ' + (seconds === 1 ? t.second : t.seconds);
        }
        
        countdownElement.textContent = text.trim();
        
        if (totalSeconds > 0) {
            totalSeconds--;
            setTimeout(updateCountdown, 1000);
        } else {
            const t = getTimeTranslations();
            countdownElement.textContent = '0 ' + t.seconds;
        }
    }

    // Start countdown after a short delay to ensure translations are loaded
    setTimeout(updateCountdown, 200);
});

