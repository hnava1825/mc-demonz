// Tab Manager Class
class TabManager {
    constructor() {
        this.tabButtons = document.querySelectorAll('.tab-button');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.init();
    }

    init() {
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => this.switchTab(button.dataset.tab));
        });
    }

    switchTab(tabName) {
        // Remove active class from all buttons and contents
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        this.tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to selected button and content
        const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
        const activeContent = document.getElementById(tabName);

        if (activeButton && activeContent) {
            activeButton.classList.add('active');
            activeContent.classList.add('active');
        }
    }
}

// Language Manager Class
class LanguageManager {
    constructor() {
        this.currentLang = 'en';
        this.langToggle = document.getElementById('langToggle');
        this.init();
    }

    init() {
        this.langToggle.addEventListener('click', () => this.toggleLanguage());
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'es' : 'en';
        this.updateContent();
        this.langToggle.textContent = this.currentLang === 'en' ? 'Español' : 'English';
    }

    updateContent() {
        // Update all elements with language data attributes
        const elements = document.querySelectorAll('[data-lang-en], [data-lang-es]');
        
        elements.forEach(element => {
            const enText = element.getAttribute('data-lang-en');
            const esText = element.getAttribute('data-lang-es');
            
            if (enText && esText) {
                element.textContent = this.currentLang === 'en' ? enText : esText;
            }
        });

        // Show/hide content blocks based on language
        document.querySelectorAll('[data-lang-en]').forEach(el => {
            if (el.classList.contains('content-text')) {
                el.style.display = this.currentLang === 'en' ? 'block' : 'none';
            }
        });

        document.querySelectorAll('[data-lang-es]').forEach(el => {
            if (el.classList.contains('content-text')) {
                el.style.display = this.currentLang === 'es' ? 'block' : 'none';
            }
        });
    }
}

// Data Manager Class
class DataManager {
    constructor(data) {
        this.data = data;
    }

    renderPracticeSchedule() {
        const container = document.getElementById('practiceSchedule');
        if (!container || !this.data.practiceSchedule) return;

        container.innerHTML = this.data.practiceSchedule.map(practice => `
            <div class="schedule-item">
                <h4>${practice.team}</h4>
                <p><strong>${practice.day}</strong> | ${practice.time}</p>
                <p>📍 ${practice.location}</p>
            </div>
        `).join('');
    }

    renderGameSchedule() {
        const container = document.getElementById('gameSchedule');
        if (!container || !this.data.gameSchedule) return;

        container.innerHTML = this.data.gameSchedule.map(game => `
            <div class="schedule-item">
                <h4>${game.team} vs ${game.opponent}</h4>
                <p><strong>${game.date}</strong> | ${game.time}</p>
                <p>📍 ${game.location}</p>
            </div>
        `).join('');
    }

    renderGallery() {
        const container = document.getElementById('galleryGrid');
        if (!container || !this.data.gallery || this.data.gallery.length === 0) return;

        container.innerHTML = this.data.gallery.map(image => `
            <div class="gallery-item">
                <img src="${image.url}" alt="${image.alt}">
            </div>
        `).join('');
    }

    renderAll() {
        this.renderPracticeSchedule();
        this.renderGameSchedule();
        this.renderGallery();
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize managers
    const tabManager = new TabManager();
    const languageManager = new LanguageManager();
    
    // Check if clubData exists from data.js
    if (typeof clubData !== 'undefined') {
        const dataManager = new DataManager(clubData);
        dataManager.renderAll();
    }
});
