// Tab Manager Class
class TabManager {
    constructor() {
        this.tabs = document.querySelectorAll('.tab-btn');
        this.contents = document.querySelectorAll('.tab-content');
        this.init();
    }

    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });
    }

    switchTab(selectedTab) {
        const targetId = selectedTab.dataset.tab;

        // Remove active from all
        this.tabs.forEach(tab => tab.classList.remove('active'));
        this.contents.forEach(content => content.classList.remove('active'));

        // Add active to selected
        selectedTab.classList.add('active');
        document.getElementById(targetId).classList.add('active');
    }
}

// Language Manager Class
class LanguageManager {
    constructor() {
        this.currentLang = 'en';
        this.toggleBtn = document.getElementById('langToggle');
        this.init();
    }

    init() {
        this.toggleBtn.addEventListener('click', () => this.toggleLanguage());
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'es' : 'en';
        this.updateContent();
        this.toggleBtn.textContent = this.currentLang === 'en' ? 'Español' : 'English';
    }

    updateContent() {
        const elements = document.querySelectorAll('[data-lang-en]');
        elements.forEach(el => {
            const text = el.dataset[`lang${this.currentLang.charAt(0).toUpperCase() + this.currentLang.slice(1)}`];
            if (text) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else {
                    el.textContent = text;
                }
            }
        });
    }

    getCurrentLang() {
        return this.currentLang;
    }
}

// Data Manager Class
class DataManager {
    constructor(languageManager) {
        this.langManager = languageManager;
    }

    renderTeams() {
        const container = document.getElementById('teamsContainer');
        const lang = this.langManager.getCurrentLang();
        const trans = clubData.translations.teams;

        container.innerHTML = clubData.teams.map(team => `
            <div class="team-card">
                <h3>${team.age}</h3>
                <p><strong>${trans.coach[lang]}:</strong> ${team.coach}</p>
                <p><strong>${trans.practice[lang]}:</strong> ${team.practice}</p>
                <p><strong>${trans.location[lang]}:</strong> ${team.location}</p>
            </div>
        `).join('');
    }

    renderSchedule() {
        const container = document.getElementById('scheduleContainer');
        const lang = this.langManager.getCurrentLang();
        const trans = clubData.translations.schedule;

        container.innerHTML = clubData.schedule.map(item => `
            <div class="schedule-item">
                <div class="date">${item.date}</div>
                <h3>${item.team} - ${item.opponent || item.event}</h3>
                <p><strong>${trans.time[lang]}:</strong> ${item.time}</p>
                <p><strong>${trans.location[lang]}:</strong> ${item.location}</p>
                <p><strong>${trans[item.type][lang]}</strong></p>
            </div>
        `).join('');
    }

    renderGallery() {
        const container = document.getElementById('galleryContainer');

        container.innerHTML = clubData.gallery.map(item => `
            <div class="gallery-item">
                <img src="${item.src}" alt="${item.alt}">
            </div>
        `).join('');
    }
}

// Form Handler Class
class FormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        alert('Thank you for your message! We will contact you soon.\n¡Gracias por tu mensaje! Te contactaremos pronto.');
        this.form.reset();
    }
}

// Initialize Application
class App {
    constructor() {
        this.tabManager = new TabManager();
        this.languageManager = new LanguageManager();
        this.dataManager = new DataManager(this.languageManager);
        this.formHandler = new FormHandler();
        this.init();
    }

    init() {
        // Render initial data
        this.dataManager.renderTeams();
        this.dataManager.renderSchedule();
        this.dataManager.renderGallery();

        // Update data when language changes
        document.getElementById('langToggle').addEventListener('click', () => {
            setTimeout(() => {
                this.dataManager.renderTeams();
                this.dataManager.renderSchedule();
            }, 100);
        });
    }
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});