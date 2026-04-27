// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
let appState = null;
let currentPassword = '';
let trendChart = null;
let distributionChart = null;

// ==================== СПИСОК ДОСТИЖЕНИЙ ====================
const achievementsList = [
    { id: 'first_check', name: '🌟 Первый шаг', description: 'Проверить первый пароль', icon: '🔍', requirement: { type: 'checks', value: 1 } },
    { id: 'strong_master', name: '💪 Повелитель безопасности', description: 'Создать 10 сильных паролей (оценка ≥8)', icon: '🏆', requirement: { type: 'strong', value: 10 } },
    { id: 'entropy_god', name: '🧠 Бог энтропии', description: 'Пароль с энтропией > 100 бит', icon: '📈', requirement: { type: 'entropy', value: 100 } },
    { id: 'breach_hunter', name: '🔍 Охотник на утечки', description: 'Найти пароль в утечках', icon: '⚠️', requirement: { type: 'breach', value: 1 } },
    { id: 'generator_master', name: '⚡ Мастер генерации', description: 'Сгенерировать 50 паролей', icon: '🎲', requirement: { type: 'generations', value: 50 } },
    { id: 'perfect_score', name: '🎯 Идеальный удар', description: 'Получить оценку 10/10', icon: '💯', requirement: { type: 'perfect', value: 1 } },
    { id: 'century_check', name: '📊 Страж безопасности', description: 'Провести 100 проверок', icon: '🛡️', requirement: { type: 'checks', value: 100 } },
    { id: 'variety_expert', name: '🎨 Мастер разнообразия', description: 'Использовать все 5 типов символов', icon: '🌈', requirement: { type: 'charTypes', value: 5 } }
];

// ==================== КЛАСС БЕЗОПАСНОСТИ ====================
class PasswordSecurity {
    constructor(password) {
        this.password = password;
        this.score = 0;
        this.weaknesses = [];
        this.suggestions = {};
        this.entropy = 0;
        this.charTypes = 0;
        
        this.commonPasswords = [
            "password", "123456", "12345678", "qwerty", "abc123",
            "password1", "12345", "123456789", "letmein", "welcome",
            "admin", "user", "login", "iloveyou", "monkey", "dragon"
        ];
    }
    
    analyzePassword() {
        this.score = 0;
        this.weaknesses = [];
        this.suggestions = {};
        this.entropy = 0;
        this.charTypes = 0;
        
        this.checkLength();
        this.checkCharacterVariety();
        this.checkCommonPatterns();
        this.checkEntropy();
        this.checkSequences();
        this.checkDictionaryWords();
        this.calculateFinalScore();
        this.generateSuggestions();
        
        return {
            score: this.score,
            weaknesses: this.weaknesses,
            suggestions: this.suggestions,
            entropy: this.entropy,
            charTypes: this.charTypes,
            length: this.password.length
        };
    }
    
    checkLength() {
        const len = this.password.length;
        if (len >= 20) { this.score += 5; }
        else if (len >= 16) { this.score += 4; }
        else if (len >= 12) { this.score += 3; }
        else if (len >= 8) { this.score += 2; this.weaknesses.push("📏 Рекомендуемая длина — 12+ символов"); }
        else { this.weaknesses.push("⚠️ Слишком короткий пароль (минимум 8 символов)"); }
    }
    
    checkCharacterVariety() {
        let hasUpper = false, hasLower = false, hasDigit = false, hasSpecial = false, hasUnicode = false;
        this.charTypes = 0;
        
        for (let c of this.password) {
            if (c >= 'A' && c <= 'Z') hasUpper = true;
            if (c >= 'a' && c <= 'z') hasLower = true;
            if (c >= '0' && c <= '9') hasDigit = true;
            if ("!@#$%^&*()_+-=[]{}|;:,.<>?".includes(c)) hasSpecial = true;
            if (c.charCodeAt(0) > 127) hasUnicode = true;
        }
        
        if (hasUpper) this.charTypes++;
        if (hasLower) this.charTypes++;
        if (hasDigit) this.charTypes++;
        if (hasSpecial) this.charTypes++;
        if (hasUnicode) this.charTypes++;
        
        if (this.charTypes >= 4) { this.score += 3; }
        else if (this.charTypes >= 3) { this.score += 2; this.weaknesses.push("🎨 Используйте 4+ типа символов"); }
        else { this.score += 1; this.weaknesses.push("🔠 Добавьте заглавные буквы, цифры или спецсимволы"); }
    }
    
    checkCommonPatterns() {
        if (/(.)\1{3,}/.test(this.password)) {
            this.weaknesses.push("🔄 Обнаружены повторяющиеся символы");
        }
        
        const patterns = ["123", "abc", "qwe", "asd", "111", "000", "qwerty"];
        for (const pattern of patterns) {
            if (this.password.toLowerCase().includes(pattern)) {
                this.weaknesses.push("📊 Обнаружена простая последовательность");
                break;
            }
        }
    }
    
    checkEntropy() {
        let charsetSize = 0;
        if (/[a-z]/.test(this.password)) charsetSize += 26;
        if (/[A-Z]/.test(this.password)) charsetSize += 26;
        if (/[0-9]/.test(this.password)) charsetSize += 10;
        if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(this.password)) charsetSize += 32;
        
        this.entropy = this.password.length * Math.log2(Math.max(charsetSize, 1));
        
        if (this.entropy > 100) { this.score += 4; }
        else if (this.entropy > 70) { this.score += 3; }
        else if (this.entropy > 50) { this.score += 2; }
        else if (this.entropy > 35) { this.score += 1; this.weaknesses.push("📉 Низкая энтропия пароля"); }
        else { this.weaknesses.push("⚠️ Очень низкая энтропия"); }
    }
    
    checkSequences() {
        const keyboard = ["qwerty", "asdfgh", "zxcvbn", "123456", "1q2w3e", "q1w2e3"];
        const lowerPwd = this.password.toLowerCase();
        
        for (const seq of keyboard) {
            if (lowerPwd.includes(seq)) {
                this.weaknesses.push(`⌨️ Клавиатурная последовательность: ${seq}`);
                break;
            }
        }
        
        if (/^\d+$/.test(this.password) && this.password.length > 6) {
            this.weaknesses.push("🔢 Только цифры — легко подобрать");
        }
    }
    
    checkDictionaryWords() {
        const lowerPwd = this.password.toLowerCase();
        const found = this.commonPasswords.some(pwd => lowerPwd === pwd || lowerPwd.includes(pwd));
        if (found) this.weaknesses.push("📚 Содержит распространённый пароль");
    }
    
    calculateFinalScore() {
        this.score = Math.max(0, Math.min(10, this.score - this.weaknesses.length));
    }
    
    generateSuggestions() {
        if (this.password.length < 12) this.suggestions.length = "📏 Увеличьте длину до 12+ символов";
        if (!/\d/.test(this.password)) this.suggestions.digits = "➕ Добавьте цифры (0-9)";
        if (!/[A-Z]/.test(this.password)) this.suggestions.uppercase = "🔠 Добавьте заглавные буквы";
        if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(this.password)) this.suggestions.special = "✨ Добавьте спецсимволы";
        if (this.weaknesses.length === 0 && this.score < 10) {
            this.suggestions.general = "💪 Отличный пароль! Меняйте его каждые 3-6 месяцев";
        }
    }
    
    estimateCrackingTime() {
        let charsetSize = 0;
        if (/[a-z]/.test(this.password)) charsetSize += 26;
        if (/[A-Z]/.test(this.password)) charsetSize += 26;
        if (/[0-9]/.test(this.password)) charsetSize += 10;
        if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(this.password)) charsetSize += 32;
        charsetSize = Math.max(charsetSize, 26);
        
        const combinations = Math.pow(charsetSize, this.password.length);
        let seconds = combinations / 1000000000;
        let years = seconds / 31536000;
        
        let timeText = "";
        if (seconds < 1) timeText = "Мгновенно ⚠️";
        else if (seconds < 60) timeText = `${Math.floor(seconds)} секунд`;
        else if (seconds < 3600) timeText = `${Math.floor(seconds / 60)} минут`;
        else if (seconds < 86400) timeText = `${Math.floor(seconds / 3600)} часов`;
        else if (seconds < 31536000) timeText = `${Math.floor(seconds / 86400)} дней`;
        else if (years < 1000) timeText = `${Math.floor(years)} лет`;
        else if (years < 1000000) timeText = `${Math.floor(years / 1000)} тысяч лет`;
        else timeText = "💪 Более миллиарда лет!";
        
        return { time: timeText, years: years };
    }
    
    getAIAnalysis() {
        const result = this.analyzePassword();
        let message = "", confidence = 85;
        
        if (result.score >= 8) {
            message = `✅ Отлично! Ваш пароль очень надёжный. Время взлома: ${this.estimateCrackingTime().time}. Продолжайте в том же духе!`;
            confidence = 96;
        } else if (result.score >= 6) {
            message = `👍 Хороший пароль! ${Object.values(result.suggestions).slice(0, 2).join(" ")} Небольшие улучшения сделают его идеальным.`;
            confidence = 82;
        } else if (result.score >= 4) {
            message = `⚠️ Средняя надёжность. Проблемы: ${result.weaknesses.slice(0, 2).join(", ")}. Увеличьте длину и разнообразие.`;
            confidence = 70;
        } else {
            message = `🔴 ВНИМАНИЕ! Пароль слишком слабый! ${result.weaknesses.slice(0, 3).join(", ")}. Используйте генератор SheRoMi!`;
            confidence = 95;
        }
        
        return { message, confidence };
    }
    
    getScore() { return this.score; }
    
    static async checkBreach(password) {
        try {
            const encoder = new TextEncoder();
            const hashBuffer = await crypto.subtle.digest('SHA-1', encoder.encode(password));
            const hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
            const prefix = hash.slice(0, 5);
            const suffix = hash.slice(5);
            
            const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
            const data = await response.text();
            const lines = data.split('\n');
            let count = 0;
            const found = lines.some(line => {
                const [hashSuffix, occurrenceCount] = line.split(':');
                if (hashSuffix === suffix) { count = parseInt(occurrenceCount) || 0; return true; }
                return false;
            });
            
            return { found, count };
        } catch (error) {
            return { found: false, error: true };
        }
    }
}

// ==================== УПРАВЛЕНИЕ ХРАНИЛИЩЕМ ====================
class StorageManager {
    static set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch(e) { return false; } }
    static get(key, defaultValue = null) { try { const item = localStorage.getItem(key); return item ? JSON.parse(item) : defaultValue; } catch(e) { return defaultValue; } }
}

// ==================== УПРАВЛЕНИЕ УВЕДОМЛЕНИЯМИ ====================
class NotificationManager {
    static show(message, type = 'info', duration = 3000) {
        const notification = document.getElementById('notification');
        if (!notification) return;
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.remove('hidden');
        setTimeout(() => notification.classList.add('hidden'), duration);
    }
}

// ==================== УПРАВЛЕНИЕ ТЕМАМИ ====================
class ThemeManager {
    static currentTheme = 'dark';
    static themes = ['dark', 'light', 'matrix', 'ocean', 'sunset', 'forest', 'midnight', 'cyberpunk'];
    
    static init() {
        this.currentTheme = StorageManager.get('theme', 'dark');
        this.applyTheme();
    }
    
    static applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const themeIcon = document.querySelector('.theme-icon');
        const icons = { dark: '🌙', light: '☀️', matrix: '💚', ocean: '🌊', sunset: '🌅', forest: '🌲', midnight: '🌌', cyberpunk: '⚡' };
        if (themeIcon) themeIcon.textContent = icons[this.currentTheme] || '🎨';
        StorageManager.set('theme', this.currentTheme);
    }
    
    static setTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme();
        NotificationManager.show(`Тема: ${theme}`, 'success');
    }
}

// ==================== УПРАВЛЕНИЕ СОСТОЯНИЕМ ====================
class AppState {
    constructor() {
        this.history = StorageManager.get('sheromi_history', []);
        this.totalChecks = StorageManager.get('sheromi_totalChecks', 0);
        this.strongPasswords = StorageManager.get('sheromi_strongPasswords', 0);
        this.totalYears = StorageManager.get('sheromi_totalYears', 0);
        this.generationsCount = StorageManager.get('sheromi_generations', 0);
        this.unlockedAchievements = StorageManager.get('sheromi_achievements', []);
        this.userXP = StorageManager.get('sheromi_xp', 0);
        this.updateStats();
        this.checkAllAchievements();
    }
    
    addCheck(password, result, timeYears = 0, isPerfect = false, charTypes = 0) {
        const entry = {
            id: Date.now(),
            mask: '*'.repeat(Math.min(password.length, 20)),
            length: password.length,
            score: result.score,
            entropy: result.entropy,
            timestamp: new Date().toISOString(),
            charTypes: charTypes,
            weaknesses: result.weaknesses
        };
        
        this.history.unshift(entry);
        this.totalChecks++;
        if (result.score >= 8) this.strongPasswords++;
        this.totalYears += Math.floor(timeYears);
        this.userXP += 10 + Math.floor(result.score);
        
        if (result.score === 10) this.checkAchievement('perfect_score');
        if (charTypes === 5) this.checkAchievement('variety_expert');
        if (result.entropy > 100) this.checkAchievement('entropy_god');
        if (this.totalChecks >= 100) this.checkAchievement('century_check');
        if (this.strongPasswords >= 10) this.checkAchievement('strong_master');
        if (this.totalChecks >= 1) this.checkAchievement('first_check');
        
        this.save();
        this.updateStats();
        this.renderHistory();
        this.updateLevel();
        this.updateDashboard();
    }
    
    addGeneration() {
        this.generationsCount++;
        if (this.generationsCount >= 50) this.checkAchievement('generator_master');
        this.save();
    }
    
    addBreachFound() {
        this.checkAchievement('breach_hunter');
        this.save();
    }
    
    checkAchievement(achievementId) {
        const achievement = achievementsList.find(a => a.id === achievementId);
        if (achievement && !this.unlockedAchievements.includes(achievementId)) {
            this.unlockedAchievements.push(achievementId);
            this.userXP += 50;
            this.save();
            this.renderAchievements();
            this.updateLevel();
            NotificationManager.show(`🏆 Достижение: ${achievement.name}! +50 XP`, 'success', 5000);
            return true;
        }
        return false;
    }
    
    checkAllAchievements() {
        if (this.totalChecks >= 1) this.checkAchievement('first_check');
        if (this.strongPasswords >= 10) this.checkAchievement('strong_master');
        if (this.totalChecks >= 100) this.checkAchievement('century_check');
        this.renderAchievements();
    }
    
    updateLevel() {
        const level = Math.floor(this.userXP / 100) + 1;
        const levelEl = document.getElementById('user-level');
        const levelFill = document.getElementById('level-fill');
        if (levelEl) levelEl.textContent = this.getLevelName(level);
        if (levelFill) {
            const progress = (this.userXP % 100);
            levelFill.style.width = `${progress}%`;
        }
    }
    
    getLevelName(level) {
        const names = ['', 'Новичок', 'Ученик', 'Защитник', 'Мастер', 'Эксперт', 'Гуру', 'Легенда', 'Божество'];
        return names[Math.min(level, names.length - 1)] || 'Мастер';
    }
    
    save() {
        StorageManager.set('sheromi_history', this.history);
        StorageManager.set('sheromi_totalChecks', this.totalChecks);
        StorageManager.set('sheromi_strongPasswords', this.strongPasswords);
        StorageManager.set('sheromi_totalYears', this.totalYears);
        StorageManager.set('sheromi_generations', this.generationsCount);
        StorageManager.set('sheromi_achievements', this.unlockedAchievements);
        StorageManager.set('sheromi_xp', this.userXP);
    }
    
    updateStats() {
        const totalEl = document.getElementById('total-checks');
        const strongEl = document.getElementById('strong-passwords');
        const yearsEl = document.getElementById('time-saved');
        const avgScoreEl = document.getElementById('avg-score');
        
        if (totalEl) totalEl.textContent = this.totalChecks;
        if (strongEl) strongEl.textContent = this.strongPasswords;
        if (yearsEl) yearsEl.textContent = Math.floor(this.totalYears);
        
        if (avgScoreEl && this.history.length > 0) {
            const avg = this.history.reduce((sum, h) => sum + h.score, 0) / this.history.length;
            avgScoreEl.textContent = avg.toFixed(1);
        }
    }
    
    renderHistory() {
        const container = document.getElementById('history-list');
        if (!container) return;
        
        const searchTerm = document.getElementById('history-search')?.value.toLowerCase() || '';
        const filter = document.getElementById('history-filter')?.value || 'all';
        
        let filtered = this.history.filter(item => {
            const matchesSearch = !searchTerm || item.mask.toLowerCase().includes(searchTerm);
            const matchesFilter = filter === 'all' || (filter === 'strong' && item.score >= 8) || (filter === 'weak' && item.score < 4);
            return matchesSearch && matchesFilter;
        });
        
        if (filtered.length === 0) {
            container.innerHTML = '<p class="empty-history">📭 История проверок пуста</p>';
            return;
        }
        
        container.innerHTML = filtered.slice(0, 50).map(item => `
            <div class="history-item">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                    <div><strong style="font-family: monospace;">${item.mask}</strong>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">📏 ${item.length} сим. | 🔢 ${item.entropy.toFixed(1)} бит</div></div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.3rem; font-weight: bold; color: ${item.score >= 8 ? '#00e676' : item.score >= 6 ? '#ffc107' : '#ff3b30'}">${item.score}/10</div>
                        <div style="font-size: 0.7rem;">${new Date(item.timestamp).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    renderAchievements() {
        const container = document.getElementById('achievements-grid');
        if (!container) return;
        
        container.innerHTML = achievementsList.map(ach => {
            const unlocked = this.unlockedAchievements.includes(ach.id);
            return `
                <div class="achievement-card ${unlocked ? 'unlocked' : ''}">
                    <div class="achievement-icon">${ach.icon}</div>
                    <div class="achievement-name">${ach.name}</div>
                    <div class="achievement-desc">${ach.description}</div>
                    ${unlocked ? '<span style="color: #00e676;">✓ Разблокировано</span>' : '<span style="color: #666;">🔒 Заблокировано</span>'}
                </div>
            `;
        }).join('');
    }
    
    updateDashboard() {
        this.updateTrendChart();
        this.updateDistributionChart();
        this.updateSecurityPercent();
        this.updateTopWeaknesses();
    }
    
    updateTrendChart() {
        const ctx = document.getElementById('trendChart')?.getContext('2d');
        if (!ctx || this.history.length === 0) return;
        
        const scores = this.history.slice().reverse().map(h => h.score);
        const labels = this.history.slice().reverse().map((_, i) => `#${i + 1}`);
        
        if (trendChart) trendChart.destroy();
        
        trendChart = new Chart(ctx, {
            type: 'line',
            data: { labels: labels.slice(-20), datasets: [{ label: 'Оценка безопасности', data: scores.slice(-20), borderColor: '#ff0066', backgroundColor: 'rgba(255,0,102,0.1)', tension: 0.4, fill: true }] },
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top' } } }
        });
    }
    
    updateDistributionChart() {
        const ctx = document.getElementById('distributionChart')?.getContext('2d');
        if (!ctx) return;
        
        const weak = this.history.filter(h => h.score < 4).length;
        const medium = this.history.filter(h => h.score >= 4 && h.score < 7).length;
        const strong = this.history.filter(h => h.score >= 7 && h.score < 9).length;
        const excellent = this.history.filter(h => h.score >= 9).length;
        
        if (distributionChart) distributionChart.destroy();
        
        distributionChart = new Chart(ctx, {
            type: 'doughnut',
            data: { labels: ['Слабые (<4)', 'Средние (4-6)', 'Сильные (7-8)', 'Отличные (9-10)'], datasets: [{ data: [weak, medium, strong, excellent], backgroundColor: ['#ff3b30', '#ffc107', '#2196f3', '#00e676'] }] },
            options: { responsive: true, maintainAspectRatio: true }
        });
    }
    
    updateSecurityPercent() {
        const percentEl = document.getElementById('security-percent');
        if (!percentEl || this.history.length === 0) return;
        
        const avgScore = this.history.reduce((sum, h) => sum + h.score, 0) / this.history.length;
        const percent = Math.min(100, Math.floor((avgScore / 10) * 100));
        percentEl.textContent = percent;
        
        const circle = document.querySelector('.progress-circle-fill');
        if (circle) {
            const circumference = 339.292;
            const offset = circumference - (percent / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }
    }
    
    updateTopWeaknesses() {
        const container = document.getElementById('top-weaknesses');
        if (!container) return;
        
        const weaknessCount = {};
        this.history.forEach(item => {
            if (item.weaknesses) {
                item.weaknesses.forEach(w => { weaknessCount[w] = (weaknessCount[w] || 0) + 1; });
            }
        });
        
        const top = Object.entries(weaknessCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
        container.innerHTML = top.map(([w, c]) => `<li>${w} <span style="float: right;">${c} раз</span></li>`).join('');
        if (top.length === 0) container.innerHTML = '<li>Нет данных</li>';
    }
    
    clearHistory() {
        this.history = [];
        this.totalChecks = 0;
        this.strongPasswords = 0;
        this.totalYears = 0;
        this.save();
        this.renderHistory();
        this.updateDashboard();
        NotificationManager.show('История очищена', 'success');
    }
    
    exportHistoryCSV() {
        if (this.history.length === 0) {
            NotificationManager.show('Нет данных для экспорта', 'error');
            return;
        }
        const headers = ['Date', 'Mask', 'Length', 'Score', 'Entropy'];
        const rows = this.history.map(h => [new Date(h.timestamp).toLocaleString(), h.mask, h.length, h.score, h.entropy.toFixed(2)]);
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sheromi-history-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        NotificationManager.show('CSV экспортирован', 'success');
    }
}

// ==================== ФУНКЦИИ ГЕНЕРАЦИИ ====================
const wordList = ['tiger', 'eagle', 'phoenix', 'dragon', 'storm', 'thunder', 'shadow', 'light', 'wolf', 'hawk', 'fire', 'ice', 'cloud', 'star', 'moon', 'sun'];

function generatePassphrase(wordCount, capitalize, useNumbers, useSpecial, separator) {
    const selected = [];
    for (let i = 0; i < wordCount; i++) {
        let word = wordList[Math.floor(Math.random() * wordList.length)];
        if (capitalize && Math.random() > 0.3) word = word.charAt(0).toUpperCase() + word.slice(1);
        selected.push(word);
    }
    let result = selected.join(separator);
    if (useNumbers && Math.random() > 0.5) result += Math.floor(Math.random() * 100);
    if (useSpecial && Math.random() > 0.5) result += '!@#$%^&*'[Math.floor(Math.random() * 8)];
    return result;
}

function generateCustomPattern(pattern) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specials = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let result = '';
    for (let char of pattern) {
        if (char === 'L') result += letters[Math.floor(Math.random() * letters.length)];
        else if (char === 'N') result += numbers[Math.floor(Math.random() * numbers.length)];
        else if (char === 'S') result += specials[Math.floor(Math.random() * specials.length)];
        else result += char;
    }
    return result;
}

function generateStrongPassword(length, useUpper, useLower, useDigits, useSpecial, pattern) {
    if (pattern === 'pronounceable') {
        const vowels = 'aeiou', consonants = 'bcdfghjklmnpqrstvwxyz';
        let pwd = '';
        for (let i = 0; i < length; i++) pwd += (i % 2 === 0) ? consonants[Math.floor(Math.random() * consonants.length)] : vowels[Math.floor(Math.random() * vowels.length)];
        return pwd;
    }
    if (pattern === 'pin') return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
    if (pattern === 'hex') return Array.from({ length }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
    
    let chars = '';
    if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useDigits) chars += '0123456789';
    if (useSpecial) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';
    
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// ==================== UI ФУНКЦИИ ====================
function drawViz(score) {
    const canvas = document.getElementById('strengthViz');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth - 40;
    canvas.width = width;
    canvas.height = 80;
    ctx.clearRect(0, 0, width, 80);
    
    const percent = score / 10;
    const fillWidth = percent * width;
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#ff3b30');
    gradient.addColorStop(0.33, '#ffc107');
    gradient.addColorStop(0.66, '#2196f3');
    gradient.addColorStop(1, '#00e676');
    
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(0, 30, width, 20);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 30, fillWidth, 20);
    
    for (let i = 0; i <= 10; i++) {
        const x = (i / 10) * width;
        ctx.beginPath();
        ctx.moveTo(x, 30);
        ctx.lineTo(x, 50);
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.stroke();
    }
}

function updatePasswordStrength(password) {
    const fill = document.getElementById('strength-fill');
    const text = document.getElementById('strength-text');
    if (!fill || !text) return;
    
    if (!password) {
        fill.style.width = '0%';
        text.textContent = 'Введите пароль для анализа';
        drawViz(0);
        return;
    }
    
    const analyzer = new PasswordSecurity(password);
    analyzer.analyzePassword();
    const score = analyzer.getScore();
    
    let width, color, txt;
    if (score >= 8) { width = '100%'; color = '#00e676'; txt = 'Отличный пароль! 🔒'; }
    else if (score >= 6) { width = '70%'; color = '#2196f3'; txt = 'Хороший пароль 👍'; }
    else if (score >= 4) { width = '40%'; color = '#ffc107'; txt = 'Средний пароль ⚠️'; }
    else { width = '20%'; color = '#ff3b30'; txt = 'Слабый пароль ❌'; }
    
    fill.style.width = width;
    fill.style.background = color;
    text.textContent = txt;
    drawViz(score);
}

function displayResults(analyzer, password) {
    const result = analyzer.analyzePassword();
    const cracking = analyzer.estimateCrackingTime();
    const ai = analyzer.getAIAnalysis();
    
    appState.addCheck(password, result, cracking.years, result.score === 10, result.charTypes);
    
    const scoreDiv = document.getElementById('score-display');
    scoreDiv.className = 'score-display';
    if (result.score >= 8) { scoreDiv.classList.add('score-excellent'); scoreDiv.textContent = `${result.score}/10 — ОТЛИЧНО 🔒`; }
    else if (result.score >= 6) { scoreDiv.classList.add('score-good'); scoreDiv.textContent = `${result.score}/10 — ХОРОШО 👍`; }
    else if (result.score >= 4) { scoreDiv.classList.add('score-medium'); scoreDiv.textContent = `${result.score}/10 — СРЕДНЕ ⚠️`; }
    else { scoreDiv.classList.add('score-weak'); scoreDiv.textContent = `${result.score}/10 — СЛАБО ❌`; }
    
    document.getElementById('length-display').textContent = result.length;
    document.getElementById('entropy-display').textContent = result.entropy.toFixed(1);
    document.getElementById('char-types').textContent = result.charTypes;
    document.getElementById('time-display').textContent = cracking.time;
    document.getElementById('ai-confidence').textContent = `Достоверность: ${ai.confidence}%`;
    document.getElementById('ai-message').textContent = ai.message;
    
    const weaknessList = document.getElementById('weakness-list');
    weaknessList.innerHTML = '';
    if (analyzer.weaknesses.length > 0) {
        document.getElementById('weaknesses').classList.remove('hidden');
        analyzer.weaknesses.forEach(w => { const li = document.createElement('li'); li.innerHTML = w; weaknessList.appendChild(li); });
    } else { document.getElementById('weaknesses').classList.add('hidden'); }
    
    const suggestionList = document.getElementById('suggestion-list');
    suggestionList.innerHTML = '';
    if (Object.keys(analyzer.suggestions).length > 0) {
        document.getElementById('suggestions').classList.remove('hidden');
        for (let key in analyzer.suggestions) { const li = document.createElement('li'); li.innerHTML = analyzer.suggestions[key]; suggestionList.appendChild(li); }
    } else { document.getElementById('suggestions').classList.add('hidden'); }
    
    document.getElementById('check-results').classList.remove('hidden');
}

async function checkBreaches(password) {
    const resultDiv = document.getElementById('breach-result-card');
    if (!resultDiv) return;
    NotificationManager.show('🔍 Проверка утечек...', 'info', 2000);
    
    try {
        const result = await PasswordSecurity.checkBreach(password);
        if (result.error) {
            resultDiv.innerHTML = '<div style="padding: 20px; background: rgba(255,59,48,0.2); border-radius: 16px;">❌ Ошибка проверки</div>';
        } else if (result.found) {
            resultDiv.innerHTML = `<div style="padding: 20px; background: rgba(255,59,48,0.2); border-radius: 16px; border-left: 4px solid #ff3b30;">
                <strong>⚠️ ВНИМАНИЕ!</strong><br>Пароль найден в ${result.count} утечках! <strong>НЕ ИСПОЛЬЗУЙТЕ ЕГО!</strong></div>`;
            NotificationManager.show('⚠️ Пароль в утечках!', 'error', 5000);
            if (appState) appState.addBreachFound();
        } else {
            resultDiv.innerHTML = '<div style="padding: 20px; background: rgba(0,230,118,0.2); border-radius: 16px; border-left: 4px solid #00e676;"><strong>✅ Безопасно!</strong><br>Пароль не найден в утечках.</div>';
            NotificationManager.show('✅ Пароль безопасен', 'success');
        }
        document.getElementById('breach-results')?.classList.remove('hidden');
    } catch(e) { resultDiv.innerHTML = '<div style="padding: 20px;">❌ Ошибка API</div>'; }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector(`.tab[data-tab="${tabName}"]`)?.classList.add('active');
    document.getElementById(`${tabName}-tab`)?.classList.add('active');
    if (tabName === 'history' && appState) appState.renderHistory();
    if (tabName === 'achievements' && appState) appState.renderAchievements();
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация приложения
    appState = new AppState();
    ThemeManager.init();
    appState.renderAchievements();
    appState.updateDashboard();
    appState.renderHistory();
    
    // === СЛАЙДЕРЫ ===
    const lengthSlider = document.getElementById('password-length');
    const lengthValue = document.getElementById('length-value');
    if (lengthSlider && lengthValue) {
        lengthSlider.addEventListener('input', () => { lengthValue.textContent = lengthSlider.value; });
    }
    
    const wordCountSlider = document.getElementById('word-count');
    const wordCountValue = document.getElementById('word-count-value');
    if (wordCountSlider && wordCountValue) {
        wordCountSlider.addEventListener('input', () => { wordCountValue.textContent = wordCountSlider.value; });
    }
    
    // === ПОЛЕ ВВОДА ===
    const passwordInput = document.getElementById('password-input');
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => updatePasswordStrength(e.target.value));
    }
    
    // === КНОПКА ПРОВЕРКИ ===
    const checkBtn = document.getElementById('check-btn');
    if (checkBtn) {
        checkBtn.addEventListener('click', () => {
            const pwd = document.getElementById('password-input').value;
            if (!pwd) { NotificationManager.show('Введите пароль', 'error'); return; }
            displayResults(new PasswordSecurity(pwd), pwd);
        });
    }
    
    // === КНОПКА ГЕНЕРАЦИИ ===
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const activeGenTab = document.querySelector('.gen-tab.active');
            const type = activeGenTab?.dataset.genType || 'standard';
            
            if (type === 'passphrase') {
                const wordCount = parseInt(document.getElementById('word-count')?.value || 4);
                const capitalize = document.getElementById('phrase-capitalize')?.checked || false;
                const useNumbers = document.getElementById('phrase-numbers')?.checked || false;
                const useSpecial = document.getElementById('phrase-special')?.checked || false;
                const separator = document.getElementById('phrase-separator')?.value || '-';
                currentPassword = generatePassphrase(wordCount, capitalize, useNumbers, useSpecial, separator);
            } else if (type === 'custom') {
                const pattern = document.getElementById('custom-pattern')?.value || 'LLLL-NNNN-SS';
                currentPassword = generateCustomPattern(pattern);
            } else {
                const length = parseInt(document.getElementById('password-length')?.value || 16);
                const useUpper = document.getElementById('use-upper')?.checked || true;
                const useLower = document.getElementById('use-lower')?.checked || true;
                const useDigits = document.getElementById('use-digits')?.checked || true;
                const useSpecial = document.getElementById('use-special')?.checked || true;
                const pattern = document.getElementById('password-pattern')?.value || 'random';
                currentPassword = generateStrongPassword(length, useUpper, useLower, useDigits, useSpecial, pattern);
            }
            
            const passwordDisplay = document.getElementById('password-display');
            if (passwordDisplay) passwordDisplay.textContent = currentPassword;
            
            document.getElementById('generated-password')?.classList.remove('hidden');
            document.getElementById('multiple-passwords')?.classList.add('hidden');
            
            const analyzer = new PasswordSecurity(currentPassword);
            analyzer.analyzePassword();
            const entropySpan = document.getElementById('generated-entropy');
            if (entropySpan) {
                entropySpan.textContent = `🔐 Энтропия: ${analyzer.entropy.toFixed(1)} бит | Оценка: ${analyzer.getScore()}/10`;
            }
            if (appState) appState.addGeneration();
        });
    }
    
    // === КОПИРОВАНИЕ СГЕНЕРИРОВАННОГО ===
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            if (currentPassword) {
                await navigator.clipboard.writeText(currentPassword);
                NotificationManager.show('Пароль скопирован!', 'success');
            }
        });
    }
    
    // === АНАЛИЗ СГЕНЕРИРОВАННОГО ===
    const analyzeGeneratedBtn = document.getElementById('analyze-generated-btn');
    if (analyzeGeneratedBtn) {
        analyzeGeneratedBtn.addEventListener('click', () => {
            if (currentPassword) {
                const input = document.getElementById('password-input');
                if (input) input.value = currentPassword;
                switchTab('check');
                displayResults(new PasswordSecurity(currentPassword), currentPassword);
                updatePasswordStrength(currentPassword);
            }
        });
    }
    
    // === 5 ВАРИАНТОВ ===
    const generateMultipleBtn = document.getElementById('generate-multiple');
    if (generateMultipleBtn) {
        generateMultipleBtn.addEventListener('click', () => {
            const listContainer = document.getElementById('password-list');
            if (!listContainer) return;
            listContainer.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                const pwd = generateStrongPassword(16, true, true, true, true, 'random');
                const div = document.createElement('div');
                div.className = 'password-display';
                div.style.margin = '10px 0';
                div.style.padding = '12px';
                div.style.cursor = 'pointer';
                div.textContent = pwd;
                div.addEventListener('click', () => { 
                    navigator.clipboard.writeText(pwd); 
                    NotificationManager.show('Скопировано', 'success'); 
                });
                listContainer.appendChild(div);
            }
            document.getElementById('multiple-passwords')?.classList.remove('hidden');
            document.getElementById('generated-password')?.classList.add('hidden');
        });
    }
    
    // === ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК ===
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    // === ПЕРЕКЛЮЧЕНИЕ ТИПОВ ГЕНЕРАЦИИ ===
    document.querySelectorAll('.gen-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.gen-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const type = tab.dataset.genType;
            const standardGen = document.getElementById('standard-gen');
            const passphraseGen = document.getElementById('passphrase-gen');
            const customGen = document.getElementById('custom-gen');
            if (standardGen) standardGen.classList.toggle('hidden', type !== 'standard');
            if (passphraseGen) passphraseGen.classList.toggle('hidden', type !== 'passphrase');
            if (customGen) customGen.classList.toggle('hidden', type !== 'custom');
        });
    });
    
    // === ИСТОРИЯ ===
    const historySearch = document.getElementById('history-search');
    const historyFilter = document.getElementById('history-filter');
    const clearHistoryBtn = document.getElementById('clear-history');
    const exportCsvBtn = document.getElementById('export-history-csv');
    const refreshDashboardBtn = document.getElementById('refresh-dashboard');
    
    if (historySearch) historySearch.addEventListener('input', () => appState.renderHistory());
    if (historyFilter) historyFilter.addEventListener('change', () => appState.renderHistory());
    if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', () => { if (confirm('Очистить историю?')) appState.clearHistory(); });
    if (exportCsvBtn) exportCsvBtn.addEventListener('click', () => appState.exportHistoryCSV());
    if (refreshDashboardBtn) refreshDashboardBtn.addEventListener('click', () => appState.updateDashboard());
    
    // === ПРОВЕРКА УТЕЧЕК ===
    const checkBreachesBtn = document.getElementById('check-breaches-btn');
    const checkBreachesBtn2 = document.getElementById('check-breaches-btn2');
    
    if (checkBreachesBtn) {
        checkBreachesBtn.addEventListener('click', () => {
            const pwd = document.getElementById('password-input')?.value;
            if (!pwd) { NotificationManager.show('Введите пароль', 'error'); return; }
            checkBreaches(pwd);
        });
    }
    
    if (checkBreachesBtn2) {
        checkBreachesBtn2.addEventListener('click', () => {
            const pwd = document.getElementById('breach-password')?.value;
            if (!pwd) { NotificationManager.show('Введите пароль', 'error'); return; }
            checkBreaches(pwd);
        });
    }
    
    // === ПЕРЕКЛЮЧАТЕЛИ ВИДИМОСТИ ПАРОЛЯ ===
    const togglePassword = document.getElementById('toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const input = document.getElementById('password-input');
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    togglePassword.innerHTML = '🔒';
                } else {
                    input.type = 'password';
                    togglePassword.innerHTML = '👁️';
                }
            }
        });
    }
    
    // === ВСТАВКА ИЗ БУФЕРА ===
    const pastePasswordBtn = document.getElementById('paste-password');
    if (pastePasswordBtn) {
        pastePasswordBtn.addEventListener('click', async () => {
            const text = await navigator.clipboard.readText();
            const input = document.getElementById('password-input');
            if (input) {
                input.value = text;
                updatePasswordStrength(text);
                NotificationManager.show('Вставлено', 'success');
            }
        });
    }
    
    // === ИИ-ЧАТ ===
    const askAiBtn = document.getElementById('ask-ai');
    const aiQuestion = document.getElementById('ai-question');
    const aiChatMessages = document.getElementById('ai-chat-messages');
    
    function addAIMessage(text, isUser = false) {
        if (!aiChatMessages) return;
        const bubble = document.createElement('div');
        bubble.className = `ai-message-bubble ${isUser ? 'user-message-bubble' : ''}`;
        bubble.innerHTML = `<span class="ai-avatar">${isUser ? '👤' : '🧠'}</span><p>${text}</p>`;
        aiChatMessages.appendChild(bubble);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }
    
    function getAIResponse(q) {
        const question = q.toLowerCase();
        if (question.includes('идеальный пароль')) return "Идеальный пароль: минимум 16 символов, заглавные и строчные буквы, цифры, спецсимволы. Используйте генератор SheRoMi! 🔐";
        if (question.includes('энтропия')) return "Энтропия — мера случайности. Чем выше, тем сложнее подобрать пароль. Рекомендуем > 60 бит. 📊";
        if (question.includes('менять пароль')) return "Меняйте важные пароли каждые 3-6 месяцев. Используйте планировщик в меню! 📅";
        if (question.includes('менеджер')) return "Менеджеры паролей (Bitwarden, 1Password, KeePass) помогают хранить и генерировать надёжные пароли. SheRoMi дополнит их! 🔐";
        return "Отличный вопрос! Для максимальной безопасности: используйте уникальные пароли, включите 2FA, проверяйте утечки. SheRoMi поможет вам! 🔐";
    }
    
    if (askAiBtn && aiQuestion) {
        askAiBtn.addEventListener('click', () => {
            const q = aiQuestion.value.trim();
            if (!q) return;
            addAIMessage(q, true);
            setTimeout(() => addAIMessage(getAIResponse(q)), 300);
            aiQuestion.value = '';
        });
        aiQuestion.addEventListener('keypress', (e) => { if (e.key === 'Enter') askAiBtn.click(); });
    }
    
    document.querySelectorAll('.quick-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const q = btn.textContent;
            addAIMessage(q, true);
            setTimeout(() => addAIMessage(getAIResponse(q)), 300);
        });
    });
    
    // === БОКОВОЕ МЕНЮ ===
    const menuBtn = document.getElementById('menu-btn');
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('overlay');
    const closeMenuBtn = document.getElementById('close-menu');
    
    if (menuBtn && sideMenu && overlay) {
        menuBtn.addEventListener('click', () => {
            sideMenu.classList.add('open');
            overlay.classList.remove('hidden');
        });
        
        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => {
                sideMenu.classList.remove('open');
                overlay.classList.add('hidden');
            });
        }
        
        overlay.addEventListener('click', () => {
            sideMenu.classList.remove('open');
            overlay.classList.add('hidden');
        });
    }
    
    // === ФУНКЦИЯ ПОКАЗА МОДАЛКИ ТЕМ ===
    function showThemeModal() {
        const themesModal = document.getElementById('themes-modal');
        const themeGrid = document.getElementById('theme-grid');
        
        if (themesModal && themeGrid) {
            const themeNames = { dark: 'Тёмная', light: 'Светлая', matrix: 'Матрица', ocean: 'Океан', sunset: 'Закат', forest: 'Лес', midnight: 'Полночь', cyberpunk: 'Киберпанк' };
            
            themeGrid.innerHTML = ThemeManager.themes.map(theme => `
                <div class="theme-option" data-theme="${theme}">
                    <div class="theme-preview ${theme}-preview"></div>
                    <span>${themeNames[theme]}</span>
                </div>
            `).join('');
            
            document.querySelectorAll('.theme-option').forEach(opt => {
                opt.addEventListener('click', () => {
                    ThemeManager.setTheme(opt.dataset.theme);
                    themesModal.classList.add('hidden');
                });
            });
            
            themesModal.classList.remove('hidden');
        }
    }
    
    // === ЗАКРЫТИЕ МОДАЛОК ===
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal')?.classList.add('hidden');
        });
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    });
    
    // === КНОПКА ТЕМЫ В ХЕДЕРЕ ===
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const themes = ThemeManager.themes;
            const currentIndex = themes.indexOf(ThemeManager.currentTheme);
            const nextTheme = themes[(currentIndex + 1) % themes.length];
            ThemeManager.setTheme(nextTheme);
        });
    }
    
    // === КАРТОЧКИ ФУНКЦИЙ ===
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', () => {
            const feature = card.dataset.feature;
            if (feature === 'ai') switchTab('ai');
            if (feature === 'generate') switchTab('generate');
            if (feature === 'dashboard') {
                document.getElementById('dashboard-section')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // === ДОПОЛНИТЕЛЬНЫЕ КНОПКИ ===
    const saveCheckedHistory = document.getElementById('save-checked-history');
    if (saveCheckedHistory) {
        saveCheckedHistory.addEventListener('click', () => {
            const pwd = document.getElementById('password-input')?.value;
            if (!pwd) {
                NotificationManager.show('Нет пароля для сохранения', 'error');
                return;
            }
            const analyzer = new PasswordSecurity(pwd);
            const result = analyzer.analyzePassword();
            const cracking = analyzer.estimateCrackingTime();
            appState.addCheck(pwd, result, cracking.years, result.score === 10, result.charTypes);
            NotificationManager.show('💾 Пароль сохранён в историю!', 'success');
        });
    }
    
    const copyCheckedPassword = document.getElementById('copy-checked-password');
    if (copyCheckedPassword) {
        copyCheckedPassword.addEventListener('click', async () => {
            const pwd = document.getElementById('password-input')?.value;
            if (pwd) {
                await navigator.clipboard.writeText(pwd);
                NotificationManager.show('📋 Пароль скопирован!', 'success');
            }
        });
    }
    
    const savePassword = document.getElementById('save-password');
    if (savePassword) {
        savePassword.addEventListener('click', () => {
            if (currentPassword) {
                const analyzer = new PasswordSecurity(currentPassword);
                const result = analyzer.analyzePassword();
                const cracking = analyzer.estimateCrackingTime();
                appState.addCheck(currentPassword, result, cracking.years, result.score === 10, result.charTypes);
                NotificationManager.show('💾 Пароль сохранён в историю!', 'success');
            }
        });
    }
    
    const regenerateBtn = document.getElementById('regenerate-btn');
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', () => {
            generateBtn?.click();
        });
    }
    
    const batchCheckBtn = document.getElementById('batch-check-btn');
    if (batchCheckBtn) {
        batchCheckBtn.addEventListener('click', () => {
            const pwd = document.getElementById('password-input')?.value;
            if (!pwd) {
                NotificationManager.show('Введите пароль для проверки', 'error');
                return;
            }
            checkBreaches(pwd);
            displayResults(new PasswordSecurity(pwd), pwd);
            NotificationManager.show('🔍 Выполнена полная проверка пароля', 'success');
        });
    }
    
    // === QR-КОД ===
    const showQrBtn = document.getElementById('show-qr-btn');
    const qrContainer = document.getElementById('qr-container');
    const closeQrBtn = document.getElementById('close-qr');
    
    if (showQrBtn && qrContainer) {
        showQrBtn.addEventListener('click', () => {
            if (currentPassword && typeof QRCode !== 'undefined') {
                qrContainer.classList.remove('hidden');
                const qrcodeDiv = document.getElementById('qrcode');
                if (qrcodeDiv) {
                    qrcodeDiv.innerHTML = '';
                    new QRCode(qrcodeDiv, {
                        text: currentPassword,
                        width: 128,
                        height: 128
                    });
                }
            } else if (!currentPassword) {
                NotificationManager.show('Сначала сгенерируйте пароль', 'error');
            }
        });
    }
    
    if (closeQrBtn && qrContainer) {
        closeQrBtn.addEventListener('click', () => {
            qrContainer.classList.add('hidden');
        });
    }
    
    // === ГОРЯЧИЕ КЛАВИШИ ===
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') { e.preventDefault(); document.getElementById('password-input')?.focus(); }
        if (e.ctrlKey && e.key === 'g') { e.preventDefault(); switchTab('generate'); }
        if (e.ctrlKey && e.key === 'h') { e.preventDefault(); switchTab('history'); }
        if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); document.getElementById('check-btn')?.click(); }
        if (e.key === 'F1') { e.preventDefault(); NotificationManager.show('Нажмите на кнопку меню ☰ для доп. функций!', 'info', 4000); }
        if (e.key === 'Escape') {
            document.getElementById('side-menu')?.classList.remove('open');
            document.getElementById('overlay')?.classList.add('hidden');
            document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        }
    });
    
    // === ПРИВЕТСТВИЕ ===
    setTimeout(() => {
        if (appState.totalChecks === 0) {
            NotificationManager.show('🔐 Добро пожаловать в SheRoMi ULTIMATE! Нажмите F1 для помощи', 'info', 6000);
        }
    }, 500);
    
    // Добавляем стили для theme-option если их нет
    const style = document.createElement('style');
    style.textContent = `
        .theme-option {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 12px;
            background: var(--bg-input);
            border-radius: 16px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .theme-option:hover {
            transform: scale(1.05);
            border: 1px solid var(--primary);
        }
        .theme-preview {
            width: 60px;
            height: 60px;
            border-radius: 12px;
        }
        .dark-preview { background: #1a1a2e; }
        .light-preview { background: #f0f2f5; }
        .matrix-preview { background: #0a0a0f; border: 1px solid #00ff41; }
        .ocean-preview { background: #001133; }
        .sunset-preview { background: #2d1b2e; }
        .forest-preview { background: #0a2a1a; }
        .midnight-preview { background: #0a0a2a; }
        .cyberpunk-preview { background: #0a0a0f; border: 1px solid #00ffcc; }
        .theme-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 15px;
        }
        .time-display {
            font-size: 1.2rem;
            font-weight: bold;
            padding: 10px;
            background: var(--bg-input);
            border-radius: 12px;
            text-align: center;
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ SheRoMi ULTIMATE полностью загружен!');
});

// ==================== ТЕМА ДЛЯ ИИ-ЧАТА ====================
(function addChatThemeToggle() {
    // Находим контейнер чата
    const aiChatContainer = document.querySelector('.ai-chat-container');
    const aiChatMessages = document.getElementById('ai-chat-messages');
    
    if (!aiChatContainer || !aiChatMessages) return;
    
    // Создаём кнопку переключения темы чата
    const chatThemeBtn = document.createElement('button');
    chatThemeBtn.className = 'chat-theme-toggle';
    chatThemeBtn.innerHTML = '🎨 Тема чата';
    chatThemeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: var(--bg-input);
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 4px 12px;
        font-size: 0.7rem;
        cursor: pointer;
        color: var(--text-primary);
        z-index: 10;
        transition: all 0.2s;
    `;
    
    // Добавляем относительное позиционирование для контейнера
    aiChatContainer.style.position = 'relative';
    aiChatContainer.appendChild(chatThemeBtn);
    
    let chatTheme = localStorage.getItem('chat_theme') || 'default';
    
    function applyChatTheme() {
        const messages = aiChatMessages;
        if (!messages) return;
        
        if (chatTheme === 'dark') {
            messages.style.background = 'rgba(0, 0, 0, 0.5)';
            messages.style.backdropFilter = 'blur(10px)';
            chatThemeBtn.innerHTML = '☀️ Светлая тема';
        } else if (chatTheme === 'light') {
            messages.style.background = 'rgba(255, 255, 255, 0.9)';
            messages.style.backdropFilter = 'blur(10px)';
            // Меняем цвета сообщений для светлой темы
            const bubbles = messages.querySelectorAll('.ai-message-bubble p');
            bubbles.forEach(bubble => {
                if (bubble.parentElement.classList.contains('user-message-bubble')) {
                    bubble.style.background = 'linear-gradient(135deg, #ff0066, #6c63ff)';
                    bubble.style.color = 'white';
                } else {
                    bubble.style.background = 'rgba(0, 0, 0, 0.08)';
                    bubble.style.color = '#1a1a2e';
                }
            });
            chatThemeBtn.innerHTML = '🌙 Тёмная тема';
        } else {
            messages.style.background = '';
            messages.style.backdropFilter = '';
            chatThemeBtn.innerHTML = '🎨 Тема чата';
        }
    }
    
    chatThemeBtn.addEventListener('click', () => {
        if (chatTheme === 'default') {
            chatTheme = 'dark';
        } else if (chatTheme === 'dark') {
            chatTheme = 'light';
        } else {
            chatTheme = 'default';
        }
        localStorage.setItem('chat_theme', chatTheme);
        applyChatTheme();
    });
    
    applyChatTheme();
    
    // Наблюдаем за добавлением новых сообщений, чтобы применять стили
    const observer = new MutationObserver(() => {
        if (chatTheme !== 'default') applyChatTheme();
    });
    observer.observe(aiChatMessages, { childList: true, subtree: true });
})();

// ==================== АНИМАЦИЯ ЗАГРУЗКИ ДЛЯ ПРОВЕРКИ УТЕЧЕК ====================
(function addLoadingAnimation() {
    // Сохраняем оригинальную функцию checkBreaches
    const originalCheckBreaches = window.checkBreaches;
    
    // Переопределяем функцию с анимацией
    window.checkBreaches = async function(password) {
        const resultDiv = document.getElementById('breach-result-card');
        const breachResults = document.getElementById('breach-results');
        
        if (!resultDiv) {
            if (originalCheckBreaches) return originalCheckBreaches(password);
            return;
        }
        
        // Показываем анимацию загрузки
        resultDiv.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <div class="loading-spinner"></div>
                <p style="margin-top: 15px; color: var(--text-secondary);">🔍 Проверка утечек...</p>
                <p style="font-size: 0.75rem; margin-top: 8px;">Запрос к HIBP API</p>
            </div>
        `;
        if (breachResults) breachResults.classList.remove('hidden');
        
        try {
            const result = await PasswordSecurity.checkBreach(password);
            
            if (result.error) {
                resultDiv.innerHTML = '<div style="padding: 20px; background: rgba(255,59,48,0.2); border-radius: 16px;">❌ Ошибка проверки</div>';
                NotificationManager.show('❌ Ошибка проверки утечек', 'error');
            } else if (result.found) {
                resultDiv.innerHTML = `<div style="padding: 20px; background: rgba(255,59,48,0.2); border-radius: 16px; border-left: 4px solid #ff3b30; animation: shake 0.5s ease;">
                    <strong>⚠️ ВНИМАНИЕ!</strong><br>
                    Пароль найден в <strong style="font-size: 1.3rem;">${result.count}</strong> утечках!<br>
                    <span style="font-size: 0.85rem;">НЕМЕДЛЕННО СМЕНИТЕ ПАРОЛЬ!</span>
                </div>`;
                NotificationManager.show('⚠️ ПАРОЛЬ В УТЕЧКАХ! НЕМЕДЛЕННО СМЕНИТЕ!', 'error', 6000);
                if (appState) appState.addBreachFound();
            } else {
                resultDiv.innerHTML = `<div style="padding: 20px; background: rgba(0,230,118,0.2); border-radius: 16px; border-left: 4px solid #00e676; animation: glow 0.5s ease;">
                    <strong>✅ Безопасно!</strong><br>
                    Пароль не найден в утечках.<br>
                    <span style="font-size: 0.85rem;">👍 Отличная работа!</span>
                </div>`;
                NotificationManager.show('✅ Пароль безопасен!', 'success');
            }
        } catch(e) {
            resultDiv.innerHTML = '<div style="padding: 20px; background: rgba(255,59,48,0.2); border-radius: 16px;">❌ Ошибка подключения к API</div>';
        }
    };
})();

// ==================== ПРОВЕРКА НАДЁЖНОСТИ В РЕАЛЬНОМ ВРЕМЕНИ ====================
(function addRealTimeCheck() {
    const passwordInput = document.getElementById('password-input');
    const realTimeResults = document.createElement('div');
    realTimeResults.id = 'realtime-results';
    realTimeResults.style.cssText = `
        margin-top: 15px;
        padding: 12px;
        border-radius: 12px;
        font-size: 0.85rem;
        transition: all 0.3s ease;
        display: none;
    `;
    
    const parent = document.querySelector('#check-tab .form-group');
    if (parent && passwordInput) {
        parent.insertAdjacentElement('afterend', realTimeResults);
        
        let realTimeTimeout;
        
        passwordInput.addEventListener('input', (e) => {
            clearTimeout(realTimeTimeout);
            realTimeTimeout = setTimeout(() => {
                const password = e.target.value;
                
                if (password.length === 0) {
                    realTimeResults.style.display = 'none';
                    return;
                }
                
                const analyzer = new PasswordSecurity(password);
                const result = analyzer.analyzePassword();
                const score = result.score;
                
                let bgColor, borderColor, icon, message;
                if (score >= 8) {
                    bgColor = 'rgba(0, 230, 118, 0.15)';
                    borderColor = '#00e676';
                    icon = '🟢';
                    message = 'Отличный пароль! Очень надёжный.';
                } else if (score >= 6) {
                    bgColor = 'rgba(33, 150, 243, 0.15)';
                    borderColor = '#2196f3';
                    icon = '🔵';
                    message = 'Хороший пароль, но можно улучшить.';
                } else if (score >= 4) {
                    bgColor = 'rgba(255, 193, 7, 0.15)';
                    borderColor = '#ffc107';
                    icon = '🟡';
                    message = 'Средний пароль. Рекомендуем усилить.';
                } else {
                    bgColor = 'rgba(255, 59, 48, 0.15)';
                    borderColor = '#ff3b30';
                    icon = '🔴';
                    message = 'Слабый пароль! Немедленно смените!';
                }
                
                realTimeResults.style.display = 'block';
                realTimeResults.style.background = bgColor;
                realTimeResults.style.borderLeft = `3px solid ${borderColor}`;
                realTimeResults.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                        <div>
                            <span style="font-size: 1.1rem;">${icon}</span>
                            <strong>Оценка: ${score}/10</strong>
                            <span style="margin-left: 10px; color: var(--text-secondary);">${message}</span>
                        </div>
                        <div style="font-size: 0.75rem;">
                            🔐 Энтропия: ${result.entropy.toFixed(0)} бит
                        </div>
                    </div>
                    <div class="realtime-progress" style="margin-top: 10px;">
                        <div style="height: 4px; background: var(--border); border-radius: 2px; overflow: hidden;">
                            <div style="width: ${score * 10}%; height: 100%; background: ${borderColor}; transition: width 0.3s;"></div>
                        </div>
                    </div>
                `;
            }, 300);
        });
    }
})();

// ==================== НОВЫЙ РЕЖИМ ГЕНЕРАЦИИ "READABLE" ====================
(function addReadableGenerator() {
    // Добавляем опцию в select
    const patternSelect = document.getElementById('password-pattern');
    if (patternSelect) {
        const readableOption = document.createElement('option');
        readableOption.value = 'readable';
        readableOption.textContent = '📖 Readable (легко запоминаемый)';
        patternSelect.appendChild(readableOption);
    }
    
    // Обновляем функцию generateStrongPassword для поддержки 'readable'
    const originalGenerateStrongPassword = window.generateStrongPassword;
    
    window.generateStrongPassword = function(length, useUpper, useLower, useDigits, useSpecial, pattern) {
        if (pattern === 'readable') {
            // Слова для читаемых паролей
            const adjectives = ['Happy', 'Strong', 'Big', 'Fast', 'Smart', 'Brave', 'Cool', 'Wild', 'Red', 'Blue'];
            const nouns = ['Tiger', 'Eagle', 'Phoenix', 'Dragon', 'Wolf', 'Hawk', 'Star', 'Moon', 'Cloud', 'Fire'];
            const numbers = Math.floor(Math.random() * 100);
            const specials = ['!', '@', '#', '$', '%', '?', '&'];
            
            const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
            const noun = nouns[Math.floor(Math.random() * nouns.length)];
            const special = specials[Math.floor(Math.random() * specials.length)];
            
            let password = adj + noun + numbers;
            if (useSpecial && Math.random() > 0.5) password += special;
            if (useDigits && Math.random() > 0.5) password += Math.floor(Math.random() * 10);
            
            // Обрезаем до нужной длины если нужно
            if (password.length > length) password = password.slice(0, length);
            
            return password;
        }
        
        // Вызываем оригинальную функцию для других паттернов
        if (originalGenerateStrongPassword) {
            return originalGenerateStrongPassword(length, useUpper, useLower, useDigits, useSpecial, pattern);
        }
        
        // Fallback
        let chars = '';
        if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (useDigits) chars += '0123456789';
        if (useSpecial) chars += '!@#$%^&*';
        return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    };
})();

// ==================== ЗВУКОВЫЕ УВЕДОМЛЕНИЯ ====================
(function addSoundNotifications() {
    // Создаём аудио контекст (без загрузки файлов, используем Web Audio API)
    let audioEnabled = localStorage.getItem('sound_enabled') !== 'false';
    
    function playBeep(frequency = 880, duration = 200, type = 'sine') {
        if (!audioEnabled) return;
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            gainNode.gain.value = 0.3;
            
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + duration / 1000);
            oscillator.stop(audioContext.currentTime + duration / 1000);
            
            // Возобновляем аудио контекст если он приостановлен
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
        } catch(e) { console.log('Web Audio API not supported'); }
    }
    
    // Звук при слабом пароле
    function playWeakPasswordSound() {
        playBeep(440, 300, 'sawtooth');
        setTimeout(() => playBeep(440, 300, 'sawtooth'), 200);
    }
    
    // Звук при сильном пароле
    function playStrongPasswordSound() {
        playBeep(880, 150, 'sine');
        setTimeout(() => playBeep(1175, 150, 'sine'), 150);
        setTimeout(() => playBeep(1397, 300, 'sine'), 300);
    }
    
    // Звук при достижении
    function playAchievementSound() {
        playBeep(1047, 100, 'triangle');
        setTimeout(() => playBeep(1319, 100, 'triangle'), 120);
        setTimeout(() => playBeep(1568, 100, 'triangle'), 240);
        setTimeout(() => playBeep(2093, 400, 'triangle'), 360);
    }
    
    // Перехватываем проверку пароля для звука
    const originalDisplayResults = window.displayResults;
    if (originalDisplayResults) {
        window.displayResults = function(analyzer, password) {
            const result = analyzer.analyzePassword();
            if (result.score >= 8) {
                playStrongPasswordSound();
            } else if (result.score < 4) {
                playWeakPasswordSound();
            }
            return originalDisplayResults(analyzer, password);
        };
    }
    
    // Перехватываем достижения для звука
    const originalNotificationShow = NotificationManager.show;
    if (originalNotificationShow) {
        NotificationManager.show = function(message, type, duration) {
            if (type === 'success' && message.includes('Достижение')) {
                playAchievementSound();
            }
            return originalNotificationShow(message, type, duration);
        };
    }
    
    // Добавляем кнопку включения/выключения звука
    const headerActions = document.querySelector('.header-actions');
    if (headerActions) {
        const soundBtn = document.createElement('button');
        soundBtn.className = 'icon-btn';
        soundBtn.id = 'sound-toggle';
        soundBtn.innerHTML = audioEnabled ? '🔊' : '🔇';
        soundBtn.title = audioEnabled ? 'Выключить звук' : 'Включить звук';
        
        soundBtn.addEventListener('click', () => {
            audioEnabled = !audioEnabled;
            localStorage.setItem('sound_enabled', audioEnabled);
            soundBtn.innerHTML = audioEnabled ? '🔊' : '🔇';
            NotificationManager.show(audioEnabled ? '🔊 Звук включён' : '🔇 Звук выключен', 'info', 2000);
        });
        
        headerActions.appendChild(soundBtn);
    }
})();

// ==================== ГОЛОСОВОЙ ВВОД ПАРОЛЯ ====================
(function addVoiceInput() {
    const voiceBtn = document.getElementById('voice-input-btn');
    const passwordInput = document.getElementById('password-input');
    
    if (!voiceBtn || !passwordInput) return;
    
    let isListening = false;
    let recognition = null;
    
    // Проверяем поддержку Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        voiceBtn.title = 'Голосовой ввод не поддерживается';
        voiceBtn.style.opacity = '0.5';
        voiceBtn.disabled = true;
        return;
    }
    
    function initRecognition() {
        recognition = new SpeechRecognition();
        recognition.lang = 'ru-RU';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        recognition.onstart = () => {
            isListening = true;
            voiceBtn.classList.add('voice-active');
            voiceBtn.innerHTML = '🎤🔴';
            NotificationManager.show('🎤 Слушаю... скажите пароль', 'info', 3000);
        };
        
        recognition.onend = () => {
            isListening = false;
            voiceBtn.classList.remove('voice-active');
            voiceBtn.innerHTML = '🎤';
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const cleanedTranscript = transcript.toLowerCase().replace(/\s/g, '');
            
            if (passwordInput) {
                passwordInput.value = cleanedTranscript;
                updatePasswordStrength(cleanedTranscript);
                NotificationManager.show(`🎤 Распознано: ${cleanedTranscript}`, 'success', 3000);
            }
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            let errorMessage = 'Ошибка распознавания';
            
            switch(event.error) {
                case 'no-speech':
                    errorMessage = 'Речь не обнаружена';
                    break;
                case 'audio-capture':
                    errorMessage = 'Микрофон не найден';
                    break;
                case 'not-allowed':
                    errorMessage = 'Нет доступа к микрофону';
                    break;
            }
            
            NotificationManager.show(`🎤 ${errorMessage}`, 'error', 3000);
            voiceBtn.classList.remove('voice-active');
            voiceBtn.innerHTML = '🎤';
            isListening = false;
        };
    }
    
    voiceBtn.addEventListener('click', () => {
        if (!recognition) initRecognition();
        
        if (isListening) {
            recognition.stop();
        } else {
            try {
                recognition.start();
            } catch(e) {
                initRecognition();
                recognition.start();
            }
        }
    });
    
    // Добавляем подсказку при наведении
    voiceBtn.title = 'Голосовой ввод (скажите пароль вслух)';
})();

// ==================== ТУР ПО ПРИЛОЖЕНИЮ (ONBOARDING) ====================
(function addOnboardingTour() {
    // Проверяем, был ли уже показан тур
    const tourShown = localStorage.getItem('sheromi_tour_shown');
    
    // Шаги тура
    const tourSteps = [
        {
            title: '🔐 Добро пожаловать в SheRoMi ULTIMATE!',
            content: 'Это продвинутый анализатор безопасности паролей с ИИ-функциями. Давайте познакомимся с основными возможностями.',
            target: null
        },
        {
            title: '🔍 Проверка пароля',
            content: 'Введите пароль в это поле. SheRoMi мгновенно оценит его надёжность, покажет энтропию и время взлома.',
            target: '#password-input'
        },
        {
            title: '📊 Дашборд безопасности',
            content: 'Здесь вы видите графики тренда безопасности, распределение оценок и общий прогресс.',
            target: '#dashboard-section'
        },
        {
            title: '⚡ Генератор паролей',
            content: 'Создавайте надёжные пароли: стандартные, из фраз или по шаблону. Есть режим "Readable" для легкозапоминаемых паролей.',
            target: '[data-tab="generate"]'
        },
        {
            title: '🧠 ИИ-советник',
            content: 'Задавайте любые вопросы о безопасности. ИИ подскажет, как создать идеальный пароль и защитить свои данные.',
            target: '[data-tab="ai"]'
        },
        {
            title: '⚠️ Проверка утечек',
            content: 'Проверьте, не был ли ваш пароль скомпрометирован. Используется технология k-анонимности — ваш пароль не передаётся в сеть.',
            target: '[data-tab="breaches"]'
        },
        {
            title: '🏆 Достижения и уровни',
            content: 'Получайте достижения за активность, повышайте уровень и открывайте новые возможности!',
            target: '[data-tab="achievements"]'
        },
        {
            title: '🎨 Смена темы',
            content: 'В меню или по кнопке вверху можно сменить тему оформления. Доступно 8+ уникальных тем!',
            target: '#theme-toggle'
        },
        {
            title: 'Готово!',
            content: 'Вы освоили основные функции. Нажмите F1 в любой момент, чтобы увидеть подсказку. Удачной работы! 🔐',
            target: null
        }
    ];
    
    let currentStep = 0;
    let tourOverlay = null;
    let isTourActive = false;
    
    function createTourOverlay() {
        tourOverlay = document.createElement('div');
        tourOverlay.className = 'tour-overlay';
        tourOverlay.id = 'tour-overlay';
        document.body.appendChild(tourOverlay);
    }
    
    function highlightElement(selector) {
        // Убираем предыдущие подсветки
        document.querySelectorAll('.tour-highlight').forEach(el => {
            el.classList.remove('tour-highlight');
            el.style.position = '';
            el.style.zIndex = '';
        });
        
        if (!selector) return null;
        
        const element = document.querySelector(selector);
        if (!element) return null;
        
        // Сохраняем оригинальные стили
        const originalPosition = window.getComputedStyle(element).position;
        const originalZIndex = window.getComputedStyle(element).zIndex;
        
        element.classList.add('tour-highlight');
        element.style.position = 'relative';
        element.style.zIndex = '20001';
        
        // Прокручиваем к элементу
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        return element;
    }
    
    function renderTourStep() {
        if (!tourOverlay) return;
        
        const step = tourSteps[currentStep];
        
        tourOverlay.innerHTML = `
            <div class="tour-card">
                <div class="tour-header">
                    <span class="tour-icon">🔐</span>
                    <h3>${step.title}</h3>
                    <button class="tour-close" id="tour-close">✕</button>
                </div>
                <div class="tour-body">
                    <p>${step.content}</p>
                    <div class="tour-progress">
                        <span>Шаг ${currentStep + 1} из ${tourSteps.length}</span>
                        <div class="tour-progress-bar">
                            <div class="tour-progress-fill" style="width: ${((currentStep + 1) / tourSteps.length) * 100}%"></div>
                        </div>
                    </div>
                </div>
                <div class="tour-footer">
                    <button class="tour-prev" id="tour-prev" ${currentStep === 0 ? 'disabled' : ''}>← Назад</button>
                    <button class="tour-skip" id="tour-skip">Пропустить</button>
                    <button class="tour-next" id="tour-next">${currentStep === tourSteps.length - 1 ? 'Завершить' : 'Далее →'}</button>
                </div>
            </div>
        `;
        
        // Подсвечиваем целевой элемент
        if (step.target) {
            setTimeout(() => highlightElement(step.target), 200);
        }
        
        // Добавляем обработчики
        const nextBtn = document.getElementById('tour-next');
        const prevBtn = document.getElementById('tour-prev');
        const skipBtn = document.getElementById('tour-skip');
        const closeBtn = document.getElementById('tour-close');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentStep === tourSteps.length - 1) {
                    endTour();
                } else {
                    currentStep++;
                    renderTourStep();
                }
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentStep > 0) {
                    currentStep--;
                    renderTourStep();
                }
            });
        }
        
        if (skipBtn || closeBtn) {
            const endHandler = () => endTour();
            if (skipBtn) skipBtn.addEventListener('click', endHandler);
            if (closeBtn) closeBtn.addEventListener('click', endHandler);
        }
    }
    
    function endTour() {
        if (tourOverlay) {
            tourOverlay.remove();
            tourOverlay = null;
        }
        document.querySelectorAll('.tour-highlight').forEach(el => {
            el.classList.remove('tour-highlight');
            el.style.position = '';
            el.style.zIndex = '';
        });
        isTourActive = false;
        localStorage.setItem('sheromi_tour_shown', 'true');
        NotificationManager.show('🎉 Тур завершён! Нажмите F1 для справки', 'success', 4000);
    }
    
    function startTour() {
        if (isTourActive) return;
        isTourActive = true;
        currentStep = 0;
        createTourOverlay();
        renderTourStep();
    }
    
    // Кнопка запуска тура в меню
    const sideMenu = document.getElementById('side-menu');
    if (sideMenu) {
        // Добавляем пункт "Тур" в меню, если его нет
        const menuItems = document.querySelector('.side-menu-items');
        if (menuItems && !document.querySelector('.side-item[data-action="tour"]')) {
            const tourMenuItem = document.createElement('div');
            tourMenuItem.className = 'side-item';
            tourMenuItem.setAttribute('data-action', 'tour');
            tourMenuItem.innerHTML = '<span>🎓</span> Обучение (тур)';
            tourMenuItem.addEventListener('click', () => {
                const sideMenuEl = document.getElementById('side-menu');
                const overlayEl = document.getElementById('overlay');
                if (sideMenuEl) sideMenuEl.classList.remove('open');
                if (overlayEl) overlayEl.classList.add('hidden');
                startTour();
            });
            menuItems.appendChild(tourMenuItem);
        }
    }
    
    // Запускаем тур при первом посещении
    if (!tourShown) {
        setTimeout(() => {
            NotificationManager.show('🎓 Нажмите на меню ☰ и выберите "Обучение (тур)" для знакомства с приложением!', 'info', 8000);
        }, 1500);
    }
    
    // Добавляем подсказку по F1
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F1') {
            e.preventDefault();
            if (!isTourActive) {
                startTour();
            }
        }
    });
})();

// ==================== ЭКСПОРТ ИСТОРИИ В PDF ====================
(function addPDFExport() {
    // Добавляем кнопку экспорта PDF в раздел истории
    const historyControls = document.querySelector('.history-controls');
    
    if (historyControls && !document.getElementById('export-history-pdf')) {
        const pdfBtn = document.createElement('button');
        pdfBtn.className = 'btn-outline-small';
        pdfBtn.id = 'export-history-pdf';
        pdfBtn.innerHTML = '📄 Экспорт PDF';
        pdfBtn.style.marginLeft = 'auto';
        historyControls.appendChild(pdfBtn);
        
        pdfBtn.addEventListener('click', async () => {
            if (!appState || appState.history.length === 0) {
                NotificationManager.show('Нет данных для экспорта', 'error');
                return;
            }
            
            NotificationManager.show('📄 Подготовка PDF...', 'info', 2000);
            
            // Создаём контейнер для PDF
            const pdfContainer = document.createElement('div');
            pdfContainer.style.padding = '30px';
            pdfContainer.style.fontFamily = 'Arial, sans-serif';
            pdfContainer.style.backgroundColor = '#ffffff';
            pdfContainer.style.color = '#1a1a2e';
            
            // Заголовок
            pdfContainer.innerHTML = `
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 48px; margin-bottom: 10px;">🔐</div>
                    <h1 style="color: #ff0066; margin: 0;">SheRoMi ULTIMATE</h1>
                    <p style="color: #666; margin-top: 5px;">Отчёт по безопасности паролей</p>
                    <p style="color: #999; font-size: 12px;">Сгенерировано: ${new Date().toLocaleString()}</p>
                </div>
            `;
            
            // Статистика
            const totalChecks = appState.history.length;
            const strongCount = appState.history.filter(h => h.score >= 8).length;
            const weakCount = appState.history.filter(h => h.score < 4).length;
            const avgScore = (appState.history.reduce((sum, h) => sum + h.score, 0) / totalChecks).toFixed(1);
            const totalYears = appState.totalYears;
            
            pdfContainer.innerHTML += `
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px;">
                    <div style="background: linear-gradient(135deg, #ff0066, #6c63ff); color: white; padding: 15px; border-radius: 12px; text-align: center;">
                        <div style="font-size: 28px; font-weight: bold;">${totalChecks}</div>
                        <div style="font-size: 12px;">всего проверок</div>
                    </div>
                    <div style="background: #00e676; color: white; padding: 15px; border-radius: 12px; text-align: center;">
                        <div style="font-size: 28px; font-weight: bold;">${strongCount}</div>
                        <div style="font-size: 12px;">надёжных паролей</div>
                    </div>
                    <div style="background: #ff3b30; color: white; padding: 15px; border-radius: 12px; text-align: center;">
                        <div style="font-size: 28px; font-weight: bold;">${weakCount}</div>
                        <div style="font-size: 12px;">слабых паролей</div>
                    </div>
                    <div style="background: #2196f3; color: white; padding: 15px; border-radius: 12px; text-align: center;">
                        <div style="font-size: 28px; font-weight: bold;">${avgScore}</div>
                        <div style="font-size: 12px;">средний балл</div>
                    </div>
                </div>
                <div style="text-align: center; margin-bottom: 30px; padding: 15px; background: #f0f2f5; border-radius: 12px;">
                    <span style="font-size: 24px;">🛡️</span>
                    <span style="font-size: 20px; font-weight: bold; margin-left: 10px;">${Math.floor(totalYears)} лет защиты</span>
                </div>
            `;
            
            // Таблица с историей
            pdfContainer.innerHTML += `
                <h3 style="margin-bottom: 15px; color: #ff0066;">📋 История проверок (${Math.min(totalChecks, 50)} записей)</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <thead>
                        <tr style="background: #f0f2f5; border-bottom: 2px solid #ddd;">
                            <th style="padding: 10px; text-align: left;">Дата</th>
                            <th style="padding: 10px; text-align: left;">Пароль (маска)</th>
                            <th style="padding: 10px; text-align: center;">Длина</th>
                            <th style="padding: 10px; text-align: center;">Оценка</th>
                            <th style="padding: 10px; text-align: center;">Энтропия</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${appState.history.slice(0, 50).map(item => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 8px;">${new Date(item.timestamp).toLocaleDateString()}</td>
                                <td style="padding: 8px; font-family: monospace;">${item.mask}</td>
                                <td style="padding: 8px; text-align: center;">${item.length}</td>
                                <td style="padding: 8px; text-align: center;">
                                    <span style="background: ${item.score >= 8 ? '#00e676' : item.score >= 6 ? '#2196f3' : item.score >= 4 ? '#ffc107' : '#ff3b30'}; 
                                                 color: white; padding: 2px 8px; border-radius: 20px; font-weight: bold;">
                                        ${item.score}/10
                                    </span>
                                </td>
                                <td style="padding: 8px; text-align: center;">${item.entropy.toFixed(0)} бит</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            
            // Советы по безопасности
            pdfContainer.innerHTML += `
                <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #f8f9fa, #e9ecef); border-radius: 12px;">
                    <h3 style="color: #ff0066; margin-bottom: 15px;">💡 Советы по безопасности</h3>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 8px;">🔐 Используйте уникальные пароли для каждого сервиса</li>
                        <li style="margin-bottom: 8px;">📏 Минимальная длина пароля — 12 символов</li>
                        <li style="margin-bottom: 8px;">🎨 Комбинируйте заглавные и строчные буквы, цифры и спецсимволы</li>
                        <li style="margin-bottom: 8px;">🔄 Меняйте важные пароли каждые 3-6 месяцев</li>
                        <li style="margin-bottom: 8px;">🔑 Включите двухфакторную аутентификацию (2FA)</li>
                        <li style="margin-bottom: 8px;">⚠️ Регулярно проверяйте пароли на утечки через HIBP</li>
                    </ul>
                </div>
            `;
            
            // Футер
            pdfContainer.innerHTML += `
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 10px; color: #999;">
                    SheRoMi ULTIMATE — Security & Reliability Master<br>
                    © 2026 | Все права защищены
                </div>
            `;
            
            // Генерация PDF
            try {
                const opt = {
                    margin: [0.5, 0.5, 0.5, 0.5],
                    filename: `sheromi-report-${new Date().toISOString().slice(0, 19)}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, letterRendering: true, useCORS: true },
                    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                };
                
                await html2pdf().set(opt).from(pdfContainer).save();
                NotificationManager.show('📄 PDF отчёт сохранён!', 'success', 4000);
            } catch(e) {
                console.error('PDF generation error:', e);
                NotificationManager.show('❌ Ошибка создания PDF', 'error');
            }
        });
    }
    
    // Добавляем кнопку экспорта в боковое меню (обновляем существующую)
    const menuItems = document.querySelector('.side-menu-items');
    const existingExport = document.querySelector('.side-item[data-action="export-all"]');
    
    if (menuItems && existingExport) {
        // Обновляем обработчик экспорта
        const exportItem = existingExport;
        exportItem.removeEventListener('click', exportItem.clickHandler);
        
        exportItem.clickHandler = () => {
            if (appState && appState.history.length > 0) {
                document.getElementById('export-history-pdf')?.click();
            } else {
                NotificationManager.show('Нет данных для экспорта', 'error');
            }
        };
        exportItem.addEventListener('click', exportItem.clickHandler);
    }
})();

// ==================== CONFETTI ПРИ КОПИРОВАНИИ ====================
(function addConfettiOnCopy() {
    function confetti() {
        const colors = ['#ff0066', '#6c63ff', '#00e676', '#ffc107', '#ff3b30', '#00d4ff'];
        const confettiCount = 100;
        const container = document.body;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetto = document.createElement('div');
            confetto.className = 'confetto';
            confetto.style.cssText = `
                position: fixed;
                width: ${Math.random() * 8 + 4}px;
                height: ${Math.random() * 8 + 4}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * window.innerWidth}px;
                top: -20px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                opacity: ${Math.random() * 0.7 + 0.3};
                z-index: 99999;
                pointer-events: none;
                animation: confettiFall ${Math.random() * 2 + 2}s linear forwards;
            `;
            container.appendChild(confetto);
            
            setTimeout(() => confetto.remove(), 3000);
        }
    }
    
    // Добавляем анимацию в CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(${window.innerHeight + 50}px) rotate(${Math.random() * 360}deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Перехватываем копирование пароля
    const originalCopyHandler = async function() {
        if (currentPassword) {
            await navigator.clipboard.writeText(currentPassword);
            confetti();
            NotificationManager.show('🎉 Пароль скопирован!', 'success');
        }
    };
    
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.removeEventListener('click', copyBtn.clickHandler);
        copyBtn.addEventListener('click', originalCopyHandler);
    }
    
    const copyCheckedBtn = document.getElementById('copy-checked-password');
    if (copyCheckedBtn) {
        copyCheckedBtn.addEventListener('click', async () => {
            const pwd = document.getElementById('password-input')?.value;
            if (pwd) {
                await navigator.clipboard.writeText(pwd);
                confetti();
                NotificationManager.show('🎉 Пароль скопирован!', 'success');
            }
        });
    }
})();

// ==================== COUNTUP АНИМАЦИЯ ДЛЯ СЧЁТЧИКОВ ====================
(function addCountUpAnimation() {
    const counters = [
        { id: 'total-checks', current: 0, target: 0, animated: false },
        { id: 'strong-passwords', current: 0, target: 0, animated: false },
        { id: 'time-saved', current: 0, target: 0, animated: false },
        { id: 'avg-score', current: 0, target: 0, animated: false }
    ];
    
    function animateCounter(counter, duration = 1000) {
        if (counter.animated) return;
        counter.animated = true;
        
        const element = document.getElementById(counter.id);
        if (!element) return;
        
        const start = counter.current;
        const end = counter.target;
        const difference = end - start;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / duration);
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const value = start + (difference * easeOutCubic);
            
            if (counter.id === 'avg-score') {
                element.textContent = value.toFixed(1);
            } else {
                element.textContent = Math.floor(value);
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = counter.id === 'avg-score' ? end.toFixed(1) : Math.floor(end);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    function updateAllCounters() {
        if (!appState) return;
        
        const totalElement = document.getElementById('total-checks');
        const strongElement = document.getElementById('strong-passwords');
        const yearsElement = document.getElementById('time-saved');
        const avgElement = document.getElementById('avg-score');
        
        if (totalElement) {
            const newTotal = appState.totalChecks;
            const totalCounter = counters.find(c => c.id === 'total-checks');
            if (totalCounter) {
                totalCounter.target = newTotal;
                animateCounter(totalCounter);
            }
        }
        
        if (strongElement) {
            const newStrong = appState.strongPasswords;
            const strongCounter = counters.find(c => c.id === 'strong-passwords');
            if (strongCounter) {
                strongCounter.target = newStrong;
                animateCounter(strongCounter);
            }
        }
        
        if (yearsElement) {
            const newYears = Math.floor(appState.totalYears);
            const yearsCounter = counters.find(c => c.id === 'time-saved');
            if (yearsCounter) {
                yearsCounter.target = newYears;
                animateCounter(yearsCounter);
            }
        }
        
        if (avgElement && appState.history.length > 0) {
            const newAvg = appState.history.reduce((sum, h) => sum + h.score, 0) / appState.history.length;
            const avgCounter = counters.find(c => c.id === 'avg-score');
            if (avgCounter) {
                avgCounter.target = newAvg;
                animateCounter(avgCounter);
            }
        }
    }
    
    // Инициализируем счётчики
    setTimeout(() => {
        if (appState) {
            counters.forEach(c => {
                const element = document.getElementById(c.id);
                if (element) {
                    c.current = parseFloat(element.textContent) || 0;
                }
            });
            updateAllCounters();
        }
    }, 100);
    
    // Сохраняем оригинальный метод updateStats
    const originalUpdateStats = appState?.updateStats;
    if (appState) {
        appState.updateStats = function() {
            if (originalUpdateStats) originalUpdateStats.call(this);
            updateAllCounters();
        };
    }
})();

// ==================== СРАВНЕНИЕ ПАРОЛЕЙ "БИТВА ТИТАНОВ" ====================
(function addPasswordBattle() {
    // Добавляем новый пункт в боковое меню
    const menuItems = document.querySelector('.side-menu-items');
    if (menuItems && !document.querySelector('.side-item[data-action="battle"]')) {
        const battleMenuItem = document.createElement('div');
        battleMenuItem.className = 'side-item';
        battleMenuItem.setAttribute('data-action', 'battle');
        battleMenuItem.innerHTML = '<span>⚔️</span> Битва паролей';
        battleMenuItem.addEventListener('click', () => {
            const sideMenu = document.getElementById('side-menu');
            const overlay = document.getElementById('overlay');
            if (sideMenu) sideMenu.classList.remove('open');
            if (overlay) overlay.classList.add('hidden');
            showBattleModal();
        });
        
        // Вставляем перед "Сбросить всё"
        const clearItem = document.querySelector('.side-item[data-action="clear-all"]');
        if (clearItem) {
            menuItems.insertBefore(battleMenuItem, clearItem);
        } else {
            menuItems.appendChild(battleMenuItem);
        }
    }
    
    function showBattleModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'battle-modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>⚔️ Битва паролей</h2>
                    <button class="close-modal">✕</button>
                </div>
                <div class="modal-body">
                    <div class="battle-arena" id="battle-arena">
                        <div class="fighter fighter-left" id="fighter-left">
                            <div class="fighter-icon">🔐</div>
                            <div class="fighter-name">Пароль 1</div>
                            <div class="fighter-score" id="fighter1-score">0</div>
                            <div class="fighter-bar"><div class="fighter-bar-fill" id="fighter1-fill" style="width: 0%"></div></div>
                        </div>
                        <div class="vs">VS</div>
                        <div class="fighter fighter-right" id="fighter-right">
                            <div class="fighter-icon">🔒</div>
                            <div class="fighter-name">Пароль 2</div>
                            <div class="fighter-score" id="fighter2-score">0</div>
                            <div class="fighter-bar"><div class="fighter-bar-fill" id="fighter2-fill" style="width: 0%"></div></div>
                        </div>
                    </div>
                    <div class="battle-inputs">
                        <div class="battle-input-group">
                            <label>Пароль 1:</label>
                            <input type="password" id="battle-password1" placeholder="Введите пароль...">
                        </div>
                        <div class="battle-input-group">
                            <label>Пароль 2:</label>
                            <input type="password" id="battle-password2" placeholder="Введите пароль...">
                        </div>
                    </div>
                    <button class="btn btn-primary" id="start-battle" style="width: 100%; margin-top: 20px;">⚔️ НАЧАТЬ БИТВУ ⚔️</button>
                    <div id="battle-result" class="battle-result hidden"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.classList.remove('hidden');
        
        // Закрытие модалки
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Кнопка битвы
        const startBtn = document.getElementById('start-battle');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                const pwd1 = document.getElementById('battle-password1').value;
                const pwd2 = document.getElementById('battle-password2').value;
                
                if (!pwd1 || !pwd2) {
                    NotificationManager.show('Введите оба пароля для битвы!', 'error');
                    return;
                }
                
                startBattle(pwd1, pwd2);
            });
        }
    }
    
    function startBattle(pwd1, pwd2) {
        const analyzer1 = new PasswordSecurity(pwd1);
        const analyzer2 = new PasswordSecurity(pwd2);
        const result1 = analyzer1.analyzePassword();
        const result2 = analyzer2.analyzePassword();
        
        const score1 = result1.score;
        const score2 = result2.score;
        
        // Анимация заполнения баров
        const fighter1Fill = document.getElementById('fighter1-fill');
        const fighter2Fill = document.getElementById('fighter2-fill');
        const fighter1Score = document.getElementById('fighter1-score');
        const fighter2Score = document.getElementById('fighter2-score');
        const battleResult = document.getElementById('battle-result');
        
        if (fighter1Fill) fighter1Fill.style.width = `${score1 * 10}%`;
        if (fighter2Fill) fighter2Fill.style.width = `${score2 * 10}%`;
        if (fighter1Score) fighter1Score.textContent = `${score1}/10`;
        if (fighter2Score) fighter2Score.textContent = `${score2}/10`;
        
        // Определяем победителя
        let winnerMessage = '';
        let winnerClass = '';
        
        if (score1 > score2) {
            winnerMessage = `
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 48px;">🏆 ПАРОЛЬ 1 ПОБЕДИЛ! 🏆</div>
                    <div style="font-size: 20px; margin-top: 10px;">${score1}/10 против ${score2}/10</div>
                    <div style="margin-top: 15px; color: #00e676;">💪 Поздравляем победителя!</div>
                </div>
            `;
            winnerClass = 'fighter-left-win';
        } else if (score2 > score1) {
            winnerMessage = `
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 48px;">🏆 ПАРОЛЬ 2 ПОБЕДИЛ! 🏆</div>
                    <div style="font-size: 20px; margin-top: 10px;">${score2}/10 против ${score1}/10</div>
                    <div style="margin-top: 15px; color: #00e676;">💪 Поздравляем победителя!</div>
                </div>
            `;
            winnerClass = 'fighter-right-win';
        } else {
            winnerMessage = `
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 48px;">🤝 НИЧЬЯ! 🤝</div>
                    <div style="font-size: 20px; margin-top: 10px;">Оба пароля набрали ${score1}/10</div>
                    <div style="margin-top: 15px; color: #ffc107;">Улучшите оба пароля!</div>
                </div>
            `;
        }
        
        if (battleResult) {
            battleResult.innerHTML = winnerMessage;
            battleResult.classList.remove('hidden');
            battleResult.style.animation = 'battleResultPop 0.5s ease';
        }
        
        // Добавляем эффект победителю
        const fighterLeft = document.getElementById('fighter-left');
        const fighterRight = document.getElementById('fighter-right');
        
        if (fighterLeft && fighterRight) {
            fighterLeft.classList.remove('fighter-left-win', 'fighter-right-win');
            fighterRight.classList.remove('fighter-left-win', 'fighter-right-win');
            
            if (score1 > score2) {
                fighterLeft.classList.add('fighter-left-win');
            } else if (score2 > score1) {
                fighterRight.classList.add('fighter-right-win');
            }
        }
        
        // Звук битвы
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = score1 > score2 ? 880 : 440;
            oscillator.type = 'square';
            gainNode.gain.value = 0.2;
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
            oscillator.stop(audioContext.currentTime + 0.5);
            if (audioContext.state === 'suspended') audioContext.resume();
        } catch(e) {}
    }
})();

// ==================== ТЁМНАЯ ТЕМА ДЛЯ ГРАФИКОВ ====================
(function addChartsTheme() {
    // Сохраняем оригинальные методы обновления графиков
    const originalUpdateTrendChart = appState?.updateTrendChart;
    const originalUpdateDistributionChart = appState?.updateDistributionChart;
    
    function getChartTheme() {
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        const isDark = theme === 'dark' || theme === 'matrix' || theme === 'midnight' || theme === 'cyberpunk';
        
        return {
            gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            textColor: isDark ? '#ffffff' : '#1a1a2e',
            borderColor: isDark ? '#ff0066' : '#ff0066',
            backgroundColor: isDark ? 'rgba(255, 0, 102, 0.1)' : 'rgba(255, 0, 102, 0.2)'
        };
    }
    
    // Обновляем стили графиков при смене темы
    window.updateChartsTheme = function() {
        const theme = getChartTheme();
        
        if (trendChart) {
            trendChart.options.scales.x.grid.color = theme.gridColor;
            trendChart.options.scales.y.grid.color = theme.gridColor;
            trendChart.options.scales.x.ticks.color = theme.textColor;
            trendChart.options.scales.y.ticks.color = theme.textColor;
            trendChart.options.plugins.legend.labels.color = theme.textColor;
            trendChart.update();
        }
        
        if (distributionChart) {
            distributionChart.options.plugins.legend.labels.color = theme.textColor;
            distributionChart.update();
        }
    };
    
    // Следим за изменением темы
    const themeObserver = new MutationObserver(() => {
        window.updateChartsTheme();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    
    // Вызываем после загрузки
    setTimeout(() => window.updateChartsTheme(), 500);
})();

// ==================== СОВЕТ ДНЯ ПО БЕЗОПАСНОСТИ ====================
(function addSecurityTip() {
    const tips = [
        { text: "🔐 Используйте уникальные пароли для каждого сервиса", category: "основное" },
        { text: "📏 Минимальная длина надёжного пароля — 12 символов", category: "длина" },
        { text: "🔄 Меняйте важные пароли каждые 3-6 месяцев", category: "обновление" },
        { text: "🔑 Включите двухфакторную аутентификацию (2FA) везде, где возможно", category: "защита" },
        { text: "⚠️ НИКОГДА не используйте один пароль для почты и соцсетей", category: "опасность" },
        { text: "📱 Используйте менеджер паролей (Bitwarden, 1Password, KeePass)", category: "инструменты" },
        { text: "🔍 Регулярно проверяйте пароли на утечки через HIBP", category: "проверка" },
        { text: "🎨 Комбинируйте: A-Z, a-z, 0-9, спецсимволы (!@#$%^&*)", category: "разнообразие" },
        { text: "🚫 Избегайте личной информации: даты рождения, имена, клички питомцев", category: "опасность" },
        { text: "💡 Длинная фраза из 4-5 слов надёжнее короткого пароля", category: "метод" },
        { text: "🔒 Не храните пароли в заметках телефона или браузере", category: "безопасность" },
        { text: "🎭 Используйте разные пароли для работы и личных аккаунтов", category: "разделение" },
        { text: "⚡ SheRoMi сгенерирует идеальный пароль за 1 секунду!", category: "sheromi" },
        { text: "📊 Чем выше энтропия, тем сложнее взломать пароль", category: "энтропия" },
        { text: "🛡️ Проверьте свой пароль на утечки прямо сейчас!", category: "sheromi" }
    ];
    
    // Получаем совет дня на основе даты
    function getTipOfDay() {
        const today = new Date().toDateString();
        const storedDate = localStorage.getItem('tip_date');
        let tipIndex = localStorage.getItem('tip_index');
        
        if (storedDate !== today) {
            tipIndex = Math.floor(Math.random() * tips.length);
            localStorage.setItem('tip_date', today);
            localStorage.setItem('tip_index', tipIndex);
        }
        
        return tips[tipIndex || 0];
    }
    
    // Создаём виджет
    const dashboardSection = document.getElementById('dashboard-section');
    if (dashboardSection && !document.getElementById('tip-widget')) {
        const tipWidget = document.createElement('div');
        tipWidget.id = 'tip-widget';
        tipWidget.className = 'tip-widget';
        tipWidget.innerHTML = `
            <div class="tip-icon">💡</div>
            <div class="tip-content">
                <div class="tip-label">Совет дня по безопасности</div>
                <div class="tip-text" id="tip-text">${getTipOfDay().text}</div>
            </div>
            <button class="tip-next" id="next-tip" title="Следующий совет">→</button>
        `;
        
        // Вставляем перед дашбордом
        dashboardSection.parentNode.insertBefore(tipWidget, dashboardSection);
        
        // Обновляем совет
        const tipText = document.getElementById('tip-text');
        const nextBtn = document.getElementById('next-tip');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const newIndex = Math.floor(Math.random() * tips.length);
                localStorage.setItem('tip_index', newIndex);
                if (tipText) tipText.textContent = tips[newIndex].text;
                tipText.style.animation = 'none';
                setTimeout(() => { tipText.style.animation = 'fadeIn 0.3s ease'; }, 10);
            });
        }
    }
})();

// ==================== ИСТОРИЯ ГЕНЕРАЦИИ ПАРОЛЕЙ ====================
(function addGenerationHistory() {
    // Загружаем историю генераций
    let generationHistory = StorageManager.get('sheromi_generation_history', []);
    
    // Сохраняем текущий пароль при генерации
    const originalGenerateHandler = document.getElementById('generate-btn')?.cloneNode(true);
    
    function saveToGenerationHistory(password) {
        const analyzer = new PasswordSecurity(password);
        const result = analyzer.analyzePassword();
        
        generationHistory.unshift({
            id: Date.now(),
            password: password,
            mask: '*'.repeat(Math.min(password.length, 20)),
            score: result.score,
            entropy: result.entropy,
            timestamp: new Date().toISOString()
        });
        
        // Ограничиваем историю 50 записями
        if (generationHistory.length > 50) generationHistory = generationHistory.slice(0, 50);
        StorageManager.set('sheromi_generation_history', generationHistory);
        renderGenerationHistory();
    }
    
    function renderGenerationHistory() {
        let container = document.getElementById('generation-history-list');
        
        // Создаём контейнер, если его нет
        if (!container) {
            const generateTab = document.getElementById('generate-tab');
            if (!generateTab) return;
            
            const historySection = document.createElement('div');
            historySection.className = 'glass-card';
            historySection.style.marginTop = '20px';
            historySection.innerHTML = `
                <h3>📜 История генераций</h3>
                <div id="generation-history-list" class="generation-history-list"></div>
                <button id="clear-generation-history" class="btn-outline-small" style="margin-top: 15px;">🗑️ Очистить историю</button>
            `;
            generateTab.appendChild(historySection);
            container = document.getElementById('generation-history-list');
        }
        
        if (!container) return;
        
        if (generationHistory.length === 0) {
            container.innerHTML = '<p class="empty-history">📭 История генераций пуста</p>';
            return;
        }
        
        container.innerHTML = generationHistory.slice(0, 20).map(item => `
            <div class="generation-history-item" data-password="${item.password.replace(/"/g, '&quot;')}">
                <div class="gen-history-mask">${item.mask}</div>
                <div class="gen-history-stats">
                    <span class="gen-score ${item.score >= 8 ? 'score-strong' : item.score >= 6 ? 'score-good' : 'score-weak'}">${item.score}/10</span>
                    <span class="gen-entropy">🔢 ${item.entropy.toFixed(0)} бит</span>
                    <span class="gen-date">${new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>
                <div class="gen-history-actions">
                    <button class="gen-copy-btn" data-password="${item.password.replace(/"/g, '&quot;')}">📋 Копировать</button>
                    <button class="gen-use-btn" data-password="${item.password.replace(/"/g, '&quot;')}">🔍 Использовать</button>
                </div>
            </div>
        `).join('');
        
        // Добавляем обработчики копирования
        document.querySelectorAll('.gen-copy-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const pwd = btn.dataset.password;
                if (pwd) {
                    await navigator.clipboard.writeText(pwd);
                    NotificationManager.show('📋 Пароль скопирован!', 'success');
                    // Confetti эффект
                    if (typeof confetti === 'function') confetti();
                }
            });
        });
        
        // Добавляем обработчики использования
        document.querySelectorAll('.gen-use-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const pwd = btn.dataset.password;
                if (pwd) {
                    const input = document.getElementById('password-input');
                    if (input) {
                        input.value = pwd;
                        updatePasswordStrength(pwd);
                        switchTab('check');
                        NotificationManager.show('🔍 Пароль вставлен для анализа', 'success');
                    }
                }
            });
        });
        
        // Очистка истории
        const clearBtn = document.getElementById('clear-generation-history');
        if (clearBtn) {
            clearBtn.onclick = () => {
                if (confirm('Очистить историю генераций?')) {
                    generationHistory = [];
                    StorageManager.set('sheromi_generation_history', []);
                    renderGenerationHistory();
                    NotificationManager.show('История генераций очищена', 'success');
                }
            };
        }
    }
    
    // Подменяем генерацию для сохранения в историю
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        const originalClick = generateBtn.onclick;
        generateBtn.addEventListener('click', () => {
            setTimeout(() => {
                if (currentPassword) {
                    saveToGenerationHistory(currentPassword);
                }
            }, 100);
        });
    }
    
    // Рендерим при загрузке
    setTimeout(() => renderGenerationHistory(), 500);
})();

// ==================== ПРОФИЛИ НАСТРОЕК ====================
(function addProfiles() {
    // Загружаем профили
    let profiles = StorageManager.get('sheromi_profiles', []);
    let activeProfileId = StorageManager.get('sheromi_active_profile', null);
    
    // Стандартные профили
    const defaultProfiles = [
        { id: 'default', name: 'Стандартный', icon: '⭐', settings: { minLength: 12, requireUpper: true, requireLower: true, requireDigits: true, requireSpecial: true, checkBreaches: true } },
        { id: 'social', name: 'Соцсети', icon: '📱', settings: { minLength: 10, requireUpper: true, requireLower: true, requireDigits: true, requireSpecial: false, checkBreaches: true } },
        { id: 'banking', name: 'Банкинг', icon: '🏦', settings: { minLength: 16, requireUpper: true, requireLower: true, requireDigits: true, requireSpecial: true, checkBreaches: true } },
        { id: 'work', name: 'Рабочий', icon: '💼', settings: { minLength: 14, requireUpper: true, requireLower: true, requireDigits: true, requireSpecial: true, checkBreaches: true } }
    ];
    
    // Инициализация профилей
    if (profiles.length === 0) {
        profiles = [...defaultProfiles];
        StorageManager.set('sheromi_profiles', profiles);
    }
    
    function renderProfilesModal() {
        let modal = document.getElementById('profiles-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'profiles-modal';
            modal.className = 'modal hidden';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>👤 Профили настроек</h2>
                        <button class="close-modal">✕</button>
                    </div>
                    <div class="modal-body">
                        <div id="profiles-list" class="profiles-list"></div>
                        <button id="create-profile-btn" class="btn btn-outline" style="width: 100%; margin-top: 15px;">➕ Создать профиль</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            modal.querySelector('.close-modal').addEventListener('click', () => modal.classList.add('hidden'));
            modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
        }
        
        const container = document.getElementById('profiles-list');
        if (!container) return;
        
        container.innerHTML = profiles.map(profile => `
            <div class="profile-card ${activeProfileId === profile.id ? 'active-profile' : ''}" data-profile-id="${profile.id}">
                <div class="profile-icon">${profile.icon}</div>
                <div class="profile-info">
                    <div class="profile-name">${profile.name}</div>
                    <div class="profile-settings">
                        📏 ${profile.settings.minLength}+ | 
                        ${profile.settings.requireUpper ? 'A-Z' : '❌'} | 
                        ${profile.settings.requireSpecial ? '!@#' : '❌'}
                    </div>
                </div>
                <div class="profile-actions">
                    ${activeProfileId !== profile.id ? `<button class="profile-activate" data-id="${profile.id}">✅ Активировать</button>` : '<span class="active-badge">Активен</span>'}
                    ${profile.id !== 'default' ? `<button class="profile-delete" data-id="${profile.id}">🗑️</button>` : ''}
                </div>
            </div>
        `).join('');
        
        // Обработчики
        document.querySelectorAll('.profile-activate').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                activateProfile(id);
                renderProfilesModal();
                NotificationManager.show(`📁 Профиль "${profiles.find(p => p.id === id)?.name}" активирован`, 'success');
            });
        });
        
        document.querySelectorAll('.profile-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                if (confirm('Удалить профиль?')) {
                    profiles = profiles.filter(p => p.id !== id);
                    if (activeProfileId === id) activeProfileId = 'default';
                    StorageManager.set('sheromi_profiles', profiles);
                    StorageManager.set('sheromi_active_profile', activeProfileId);
                    renderProfilesModal();
                    applyActiveProfile();
                    NotificationManager.show('Профиль удалён', 'success');
                }
            });
        });
        
        // Создание профиля
        const createBtn = document.getElementById('create-profile-btn');
        if (createBtn) {
            createBtn.onclick = () => showCreateProfileModal();
        }
    }
    
    function showCreateProfileModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h2>➕ Новый профиль</h2>
                    <button class="close-modal">✕</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Название профиля:</label>
                        <input type="text" id="new-profile-name" placeholder="Мой профиль" class="full-width">
                    </div>
                    <div class="form-group">
                        <label>Иконка:</label>
                        <select id="new-profile-icon" class="full-width">
                            <option value="⭐">⭐ Звезда</option>
                            <option value="🔐">🔐 Замок</option>
                            <option value="💻">💻 Компьютер</option>
                            <option value="📧">📧 Почта</option>
                            <option value="🎮">🎮 Игры</option>
                            <option value="🛒">🛒 Покупки</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Мин. длина: <span id="min-length-val">12</span></label>
                        <input type="range" id="profile-min-length" min="6" max="32" value="12">
                    </div>
                    <div class="checkbox-group">
                        <div class="checkbox-item"><input type="checkbox" id="profile-require-upper" checked><label>🔠 Заглавные буквы (A-Z)</label></div>
                        <div class="checkbox-item"><input type="checkbox" id="profile-require-lower" checked><label>🔡 Строчные буквы (a-z)</label></div>
                        <div class="checkbox-item"><input type="checkbox" id="profile-require-digits" checked><label>🔢 Цифры (0-9)</label></div>
                        <div class="checkbox-item"><input type="checkbox" id="profile-require-special" checked><label>✨ Спецсимволы (!@#)</label></div>
                    </div>
                    <button id="save-new-profile" class="btn btn-primary" style="width: 100%;">💾 Сохранить профиль</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.classList.remove('hidden');
        
        // Слайдер
        const lengthSlider = document.getElementById('profile-min-length');
        const lengthVal = document.getElementById('min-length-val');
        if (lengthSlider) lengthSlider.oninput = () => { if (lengthVal) lengthVal.textContent = lengthSlider.value; };
        
        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        document.getElementById('save-new-profile').onclick = () => {
            const name = document.getElementById('new-profile-name').value.trim();
            if (!name) {
                NotificationManager.show('Введите название профиля', 'error');
                return;
            }
            
            const newProfile = {
                id: 'profile_' + Date.now(),
                name: name,
                icon: document.getElementById('new-profile-icon').value,
                settings: {
                    minLength: parseInt(document.getElementById('profile-min-length').value),
                    requireUpper: document.getElementById('profile-require-upper').checked,
                    requireLower: document.getElementById('profile-require-lower').checked,
                    requireDigits: document.getElementById('profile-require-digits').checked,
                    requireSpecial: document.getElementById('profile-require-special').checked,
                    checkBreaches: true
                }
            };
            
            profiles.push(newProfile);
            StorageManager.set('sheromi_profiles', profiles);
            renderProfilesModal();
            modal.remove();
            NotificationManager.show(`Профиль "${name}" создан!`, 'success');
        };
    }
    
    function activateProfile(profileId) {
        activeProfileId = profileId;
        StorageManager.set('sheromi_active_profile', activeProfileId);
        applyActiveProfile();
    }
    
    function applyActiveProfile() {
        const profile = profiles.find(p => p.id === activeProfileId) || profiles[0];
        if (!profile) return;
        
        // Применяем настройки к генератору
        const lengthSlider = document.getElementById('password-length');
        const lengthVal = document.getElementById('length-value');
        if (lengthSlider && profile.settings.minLength) {
            lengthSlider.value = profile.settings.minLength;
            if (lengthVal) lengthVal.textContent = profile.settings.minLength;
        }
        
        const useUpper = document.getElementById('use-upper');
        const useLower = document.getElementById('use-lower');
        const useDigits = document.getElementById('use-digits');
        const useSpecial = document.getElementById('use-special');
        
        if (useUpper) useUpper.checked = profile.settings.requireUpper;
        if (useLower) useLower.checked = profile.settings.requireLower;
        if (useDigits) useDigits.checked = profile.settings.requireDigits;
        if (useSpecial) useSpecial.checked = profile.settings.requireSpecial;
        
        // Обновляем отображение активного профиля в меню
        const profileIndicator = document.getElementById('active-profile-indicator');
        if (profileIndicator) {
            profileIndicator.innerHTML = `${profile.icon} ${profile.name}`;
        }
    }
    
    // Добавляем индикатор в боковое меню
    const sideMenuFooter = document.querySelector('.side-menu-footer');
    if (sideMenuFooter && !document.getElementById('active-profile-indicator')) {
        const profileDiv = document.createElement('div');
        profileDiv.className = 'active-profile-indicator';
        profileDiv.id = 'active-profile-indicator';
        profileDiv.style.cssText = 'margin-top: 10px; padding: 8px; background: var(--bg-input); border-radius: 12px; font-size: 0.8rem; cursor: pointer;';
        profileDiv.innerHTML = '👤 Загрузка...';
        profileDiv.onclick = () => {
            renderProfilesModal();
            document.getElementById('profiles-modal')?.classList.remove('hidden');
        };
        sideMenuFooter.insertBefore(profileDiv, sideMenuFooter.querySelector('small'));
    }
    
    // Обработчик пункта меню "Профили"
    const profileMenuItem = document.querySelector('.side-item[data-action="profile"]');
    if (profileMenuItem) {
        profileMenuItem.addEventListener('click', () => {
            renderProfilesModal();
            document.getElementById('profiles-modal')?.classList.remove('hidden');
        });
    }
    
    // Применяем активный профиль при загрузке
    setTimeout(() => applyActiveProfile(), 100);
})();

// ==================== ПЛАНИРОВЩИК СМЕНЫ ПАРОЛЕЙ ====================
(function addScheduler() {
    let reminders = StorageManager.get('sheromi_reminders', []);
    
    function showSchedulerModal() {
        let modal = document.getElementById('scheduler-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'scheduler-modal';
            modal.className = 'modal hidden';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 500px;">
                    <div class="modal-header">
                        <h2>📅 Планировщик смены паролей</h2>
                        <button class="close-modal">✕</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Название сервиса:</label>
                            <input type="text" id="reminder-service" placeholder="Google, Email, Банк..." class="full-width">
                        </div>
                        <div class="form-group">
                            <label>Дата следующей смены:</label>
                            <input type="date" id="reminder-date" class="full-width">
                        </div>
                        <div class="form-group">
                            <label>Повторять каждые:</label>
                            <select id="reminder-repeat" class="full-width">
                                <option value="30">30 дней</option>
                                <option value="60">60 дней</option>
                                <option value="90">90 дней (3 месяца)</option>
                                <option value="180">180 дней (6 месяцев)</option>
                                <option value="365">365 дней (год)</option>
                            </select>
                        </div>
                        <button id="add-reminder" class="btn btn-primary" style="width: 100%;">➕ Добавить напоминание</button>
                        
                        <h3 style="margin: 20px 0 10px;">📋 Активные напоминания</h3>
                        <div id="reminders-list" class="reminders-list"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            modal.querySelector('.close-modal').addEventListener('click', () => modal.classList.add('hidden'));
            modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
        }
        
        renderReminders();
        modal.classList.remove('hidden');
        
        document.getElementById('add-reminder').onclick = () => {
            const service = document.getElementById('reminder-service').value.trim();
            const date = document.getElementById('reminder-date').value;
            const repeat = parseInt(document.getElementById('reminder-repeat').value);
            
            if (!service || !date) {
                NotificationManager.show('Заполните название сервиса и дату', 'error');
                return;
            }
            
            reminders.push({
                id: Date.now(),
                service: service,
                dueDate: date,
                repeat: repeat,
                createdAt: new Date().toISOString()
            });
            
            StorageManager.set('sheromi_reminders', reminders);
            renderReminders();
            document.getElementById('reminder-service').value = '';
            document.getElementById('reminder-date').value = '';
            NotificationManager.show(`Напоминание для "${service}" добавлено!`, 'success');
            checkDueReminders();
        };
    }
    
    function renderReminders() {
        const container = document.getElementById('reminders-list');
        if (!container) return;
        
        if (reminders.length === 0) {
            container.innerHTML = '<p class="empty-history">📭 Нет активных напоминаний</p>';
            return;
        }
        
        container.innerHTML = reminders.map(reminder => {
            const today = new Date();
            const due = new Date(reminder.dueDate);
            const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
            let statusClass = '', statusText = '';
            
            if (daysLeft < 0) {
                statusClass = 'overdue';
                statusText = '🔴 ПРОСРОЧЕНО';
            } else if (daysLeft <= 7) {
                statusClass = 'warning';
                statusText = `⚠️ Осталось ${daysLeft} дн.`;
            } else {
                statusClass = 'ok';
                statusText = `✅ Через ${daysLeft} дн.`;
            }
            
            return `
                <div class="reminder-item ${statusClass}">
                    <div class="reminder-info">
                        <strong>${reminder.service}</strong>
                        <div class="reminder-dates">
                            📅 Сменить до: ${new Date(reminder.dueDate).toLocaleDateString()}
                            🔄 Каждые ${reminder.repeat} дней
                        </div>
                        <div class="reminder-status">${statusText}</div>
                    </div>
                    <button class="reminder-delete" data-id="${reminder.id}">🗑️</button>
                </div>
            `;
        }).join('');
        
        document.querySelectorAll('.reminder-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                reminders = reminders.filter(r => r.id !== id);
                StorageManager.set('sheromi_reminders', reminders);
                renderReminders();
                NotificationManager.show('Напоминание удалено', 'success');
            });
        });
    }
    
    function checkDueReminders() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        reminders.forEach(reminder => {
            const due = new Date(reminder.dueDate);
            if (due <= today) {
                NotificationManager.show(`⚠️ НАПОМИНАНИЕ: Пора сменить пароль для "${reminder.service}"!`, 'error', 10000);
                
                // Обновляем дату если есть повтор
                if (reminder.repeat) {
                    const newDue = new Date(due);
                    newDue.setDate(newDue.getDate() + reminder.repeat);
                    reminder.dueDate = newDue.toISOString().split('T')[0];
                }
            }
        });
        StorageManager.set('sheromi_reminders', reminders);
        renderReminders();
    }
    
    // Обработчик пункта меню
    const schedulerMenuItem = document.querySelector('.side-item[data-action="scheduler"]');
    if (schedulerMenuItem) {
        schedulerMenuItem.addEventListener('click', () => showSchedulerModal());
    }
    
    // Проверяем напоминания каждый час
    setInterval(checkDueReminders, 3600000);
    setTimeout(checkDueReminders, 1000);
})();

// ==================== СРАВНЕНИЕ ПАРОЛЕЙ ====================
(function addPasswordCompare() {
    function showCompareModal() {
        let modal = document.getElementById('compare-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'compare-modal';
            modal.className = 'modal hidden';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 500px;">
                    <div class="modal-header">
                        <h2>🔄 Сравнение паролей</h2>
                        <button class="close-modal">✕</button>
                    </div>
                    <div class="modal-body">
                        <div class="compare-inputs">
                            <div class="form-group">
                                <label>Пароль 1:</label>
                                <div class="input-group">
                                    <input type="password" id="compare-pwd1" placeholder="Введите пароль...">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Пароль 2:</label>
                                <div class="input-group">
                                    <input type="password" id="compare-pwd2" placeholder="Введите пароль...">
                                </div>
                            </div>
                            <button id="start-compare" class="btn btn-primary" style="width: 100%;">🔄 Сравнить</button>
                        </div>
                        <div id="compare-results" class="compare-results hidden"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            modal.querySelector('.close-modal').addEventListener('click', () => modal.classList.add('hidden'));
            modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
        }
        
        modal.classList.remove('hidden');
        
        // Добавляем глазики для полей сравнения
        setTimeout(() => {
            const pwd1 = document.getElementById('compare-pwd1');
            const pwd2 = document.getElementById('compare-pwd2');
            
            [pwd1, pwd2].forEach((input, idx) => {
                if (input && !input.parentElement.querySelector('.compare-toggle')) {
                    const toggle = document.createElement('button');
                    toggle.className = 'btn-icon compare-toggle';
                    toggle.innerHTML = '👁️';
                    toggle.style.position = 'absolute';
                    toggle.style.right = '8px';
                    toggle.style.top = '50%';
                    toggle.style.transform = 'translateY(-50%)';
                    toggle.onclick = () => {
                        if (input.type === 'password') {
                            input.type = 'text';
                            toggle.innerHTML = '🔒';
                        } else {
                            input.type = 'password';
                            toggle.innerHTML = '👁️';
                        }
                    };
                    input.parentElement.appendChild(toggle);
                }
            });
        }, 100);
        
        document.getElementById('start-compare').onclick = () => {
            const pwd1 = document.getElementById('compare-pwd1').value;
            const pwd2 = document.getElementById('compare-pwd2').value;
            
            if (!pwd1 || !pwd2) {
                NotificationManager.show('Введите оба пароля для сравнения', 'error');
                return;
            }
            
            comparePasswords(pwd1, pwd2);
        };
    }
    
    function comparePasswords(pwd1, pwd2) {
        const analyzer1 = new PasswordSecurity(pwd1);
        const analyzer2 = new PasswordSecurity(pwd2);
        const result1 = analyzer1.analyzePassword();
        const result2 = analyzer2.analyzePassword();
        
        const score1 = result1.score;
        const score2 = result2.score;
        
        // Дополнительные метрики
        const entropy1 = result1.entropy;
        const entropy2 = result2.entropy;
        const length1 = pwd1.length;
        const length2 = pwd2.length;
        
        // Определяем победителя
        let winner = '';
        let winnerText = '';
        
        if (score1 > score2) {
            winner = 'pwd1';
            winnerText = '🏆 Пароль 1 сильнее!';
        } else if (score2 > score1) {
            winner = 'pwd2';
            winnerText = '🏆 Пароль 2 сильнее!';
        } else {
            winnerText = '🤝 Ничья! Пароли равны по силе.';
        }
        
        // Процент совпадения
        let similarity = 0;
        let sameChars = 0;
        const maxLen = Math.max(pwd1.length, pwd2.length);
        for (let i = 0; i < Math.min(pwd1.length, pwd2.length); i++) {
            if (pwd1[i] === pwd2[i]) sameChars++;
        }
        similarity = Math.round((sameChars / maxLen) * 100);
        
        const resultsDiv = document.getElementById('compare-results');
        if (resultsDiv) {
            resultsDiv.classList.remove('hidden');
            resultsDiv.innerHTML = `
                <div class="compare-result-card">
                    <div class="compare-header ${winner === 'pwd1' ? 'winner' : winner === 'pwd2' ? 'loser' : ''}">
                        <div class="compare-item">
                            <div class="compare-score">${score1}/10</div>
                            <div class="compare-label">Пароль 1</div>
                            <div class="compare-details">
                                📏 ${length1} симв.<br>
                                🔢 ${entropy1.toFixed(0)} бит
                            </div>
                        </div>
                        <div class="compare-vs">VS</div>
                        <div class="compare-item ${winner === 'pwd2' ? 'winner' : winner === 'pwd1' ? 'loser' : ''}">
                            <div class="compare-score">${score2}/10</div>
                            <div class="compare-label">Пароль 2</div>
                            <div class="compare-details">
                                📏 ${length2} симв.<br>
                                🔢 ${entropy2.toFixed(0)} бит
                            </div>
                        </div>
                    </div>
                    <div class="compare-footer">
                        <div class="winner-announce">${winnerText}</div>
                        <div class="similarity-bar">
                            <span>Совпадение символов: ${similarity}%</span>
                            <div class="similarity-progress">
                                <div class="similarity-fill" style="width: ${similarity}%"></div>
                            </div>
                        </div>
                        <div class="compare-tips">
                            <strong>💡 Рекомендации:</strong>
                            ${score1 < 8 ? '🔴 Первый пароль требует усиления! ' : '🟢 Первый пароль отличный! '}
                            ${score2 < 8 ? '🔴 Второй пароль требует усиления!' : '🟢 Второй пароль отличный!'}
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Звук при сравнении
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = score1 > score2 ? 880 : 440;
            oscillator.type = 'sine';
            gainNode.gain.value = 0.15;
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.3);
            oscillator.stop(audioContext.currentTime + 0.3);
            if (audioContext.state === 'suspended') audioContext.resume();
        } catch(e) {}
    }
    
    // Обработчик пункта меню
    const compareMenuItem = document.querySelector('.side-item[data-action="compare"]');
    if (compareMenuItem) {
        compareMenuItem.addEventListener('click', () => showCompareModal());
    }
})();

// ==================== АНИМАЦИЯ ЗАГРУЗКИ СТРАНИЦЫ ====================
(function addPageLoader() {
    // Создаём оверлей загрузки
    const loader = document.createElement('div');
    loader.className = 'loader-overlay';
    loader.id = 'page-loader';
    loader.innerHTML = `
        <div class="loader-spinner"></div>
        <div class="loader-text">SheRoMi ULTIMATE</div>
        <div class="loader-progress">
            <div class="loader-progress-fill"></div>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">Загрузка модулей безопасности...</div>
    `;
    document.body.appendChild(loader);
    
    // Скрываем загрузчик после полной загрузки
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 800);
    });
    
    // Добавляем скелетоны для основного контента
    const container = document.querySelector('.container');
    if (container) {
        container.style.opacity = '0';
        setTimeout(() => {
            container.style.transition = 'opacity 0.5s ease';
            container.style.opacity = '1';
        }, 1000);
    }
})();

// ==================== АВТОСОХРАНЕНИЕ ЧЕРНОВИКОВ ====================
(function addAutoSave() {
    const passwordInput = document.getElementById('password-input');
    const DRAFT_KEY = 'sheromi_draft_password';
    
    // Восстанавливаем сохранённый пароль
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft && passwordInput && !passwordInput.value) {
        passwordInput.value = savedDraft;
        updatePasswordStrength(savedDraft);
        NotificationManager.show('📝 Восстановлен несохранённый пароль из черновика', 'info', 3000);
    }
    
    // Автосохранение при вводе (каждые 2 секунды)
    let saveTimeout;
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                if (passwordInput.value) {
                    localStorage.setItem(DRAFT_KEY, passwordInput.value);
                    // Показываем индикатор сохранения
                    const indicator = document.getElementById('auto-save-indicator');
                    if (indicator) {
                        indicator.style.opacity = '1';
                        setTimeout(() => {
                            indicator.style.opacity = '0';
                        }, 1500);
                    }
                }
            }, 2000);
        });
    }
    
    // Добавляем индикатор автосохранения
    const formGroup = document.querySelector('#check-tab .form-group');
    if (formGroup && !document.getElementById('auto-save-indicator')) {
        const indicator = document.createElement('div');
        indicator.id = 'auto-save-indicator';
        indicator.style.cssText = `
            font-size: 0.7rem;
            color: var(--success);
            margin-top: 5px;
            opacity: 0;
            transition: opacity 0.3s ease;
            display: flex;
            align-items: center;
            gap: 5px;
        `;
        indicator.innerHTML = '💾 Черновик сохранён';
        formGroup.appendChild(indicator);
    }
    
    // Очищаем черновик после успешной проверки
    const originalDisplayResults = window.displayResults;
    if (originalDisplayResults) {
        window.displayResults = function(analyzer, password) {
            localStorage.removeItem(DRAFT_KEY);
            return originalDisplayResults(analyzer, password);
        };
    }
})();

// ==================== ГЕНЕРАТОР ПАРОЛЕЙ С ЭМОДЗИ ====================
(function addEmojiGenerator() {
    // Добавляем опцию в генератор
    const patternSelect = document.getElementById('password-pattern');
    if (patternSelect && !document.querySelector('option[value="emoji"]')) {
        const emojiOption = document.createElement('option');
        emojiOption.value = 'emoji';
        emojiOption.textContent = '😎 С эмодзи (уникально)';
        patternSelect.appendChild(emojiOption);
    }
    
    // Расширяем функцию генерации
    const originalGenerateStrongPassword = window.generateStrongPassword;
    
    window.generateStrongPassword = function(length, useUpper, useLower, useDigits, useSpecial, pattern) {
        if (pattern === 'emoji') {
            const emojis = ['😀', '😂', '😎', '🔥', '⭐', '💎', '🚀', '🎉', '🔐', '🛡️', '💪', '🎯', '🌟', '💯', '⚡', '🔒'];
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            const numbers = '0123456789';
            const specials = '!@#$%^&*';
            
            let password = '';
            for (let i = 0; i < length - 2; i++) {
                const type = Math.floor(Math.random() * 3);
                if (type === 0 && useUpper) password += letters[Math.floor(Math.random() * 26)];
                else if (type === 1 && useLower) password += letters[Math.floor(Math.random() * 26) + 26];
                else if (type === 2 && useDigits) password += numbers[Math.floor(Math.random() * 10)];
                else password += letters[Math.floor(Math.random() * 52)];
            }
            
            // Добавляем спецсимвол если нужно
            if (useSpecial && Math.random() > 0.5) {
                password += specials[Math.floor(Math.random() * specials.length)];
            }
            
            // Добавляем 1-2 эмодзи
            const emojiCount = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < emojiCount; i++) {
                const pos = Math.floor(Math.random() * (password.length + 1));
                const emoji = emojis[Math.floor(Math.random() * emojis.length)];
                password = password.slice(0, pos) + emoji + password.slice(pos);
            }
            
            return password;
        }
        
        return originalGenerateStrongPassword(length, useUpper, useLower, useDigits, useSpecial, pattern);
    };
})();

// ==================== УМНЫЙ ПОИСК ПО ИСТОРИИ ====================
(function addAdvancedHistorySearch() {
    // Добавляем дополнительные фильтры в историю
    const historyControls = document.querySelector('.history-controls');
    if (historyControls && !document.getElementById('history-date-filter')) {
        const dateFilter = document.createElement('select');
        dateFilter.id = 'history-date-filter';
        dateFilter.className = 'search-input';
        dateFilter.style.width = 'auto';
        dateFilter.innerHTML = `
            <option value="all">📅 Все даты</option>
            <option value="today">Сегодня</option>
            <option value="week">Эта неделя</option>
            <option value="month">Этот месяц</option>
            <option value="year">Этот год</option>
        `;
        historyControls.appendChild(dateFilter);
        
        const lengthFilter = document.createElement('select');
        lengthFilter.id = 'history-length-filter';
        lengthFilter.className = 'search-input';
        lengthFilter.style.width = 'auto';
        lengthFilter.innerHTML = `
            <option value="all">📏 Любая длина</option>
            <option value="short">Короткие (<8)</option>
            <option value="medium">Средние (8-12)</option>
            <option value="long">Длинные (12+)</option>
        `;
        historyControls.appendChild(lengthFilter);
        
        // Обновляем функцию рендеринга истории
        const originalRenderHistory = appState?.renderHistory;
        if (appState) {
            appState.renderHistory = function() {
                const container = document.getElementById('history-list');
                if (!container) return;
                
                const searchTerm = document.getElementById('history-search')?.value.toLowerCase() || '';
                const filter = document.getElementById('history-filter')?.value || 'all';
                const dateFilter = document.getElementById('history-date-filter')?.value || 'all';
                const lengthFilter = document.getElementById('history-length-filter')?.value || 'all';
                
                let filtered = this.history.filter(item => {
                    // Поиск по маске
                    const matchesSearch = !searchTerm || item.mask.toLowerCase().includes(searchTerm);
                    
                    // Фильтр по оценке
                    const matchesFilter = filter === 'all' || 
                        (filter === 'strong' && item.score >= 8) || 
                        (filter === 'weak' && item.score < 4);
                    
                    // Фильтр по дате
                    const itemDate = new Date(item.timestamp);
                    const today = new Date();
                    let matchesDate = true;
                    if (dateFilter === 'today') {
                        matchesDate = itemDate.toDateString() === today.toDateString();
                    } else if (dateFilter === 'week') {
                        const weekAgo = new Date(today.setDate(today.getDate() - 7));
                        matchesDate = itemDate >= weekAgo;
                    } else if (dateFilter === 'month') {
                        const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
                        matchesDate = itemDate >= monthAgo;
                    } else if (dateFilter === 'year') {
                        const yearAgo = new Date(today.setFullYear(today.getFullYear() - 1));
                        matchesDate = itemDate >= yearAgo;
                    }
                    
                    // Фильтр по длине
                    let matchesLength = true;
                    if (lengthFilter === 'short') matchesLength = item.length < 8;
                    else if (lengthFilter === 'medium') matchesLength = item.length >= 8 && item.length <= 12;
                    else if (lengthFilter === 'long') matchesLength = item.length > 12;
                    
                    return matchesSearch && matchesFilter && matchesDate && matchesLength;
                });
                
                if (filtered.length === 0) {
                    container.innerHTML = '<p class="empty-history">📭 История проверок пуста</p>';
                    return;
                }
                
                container.innerHTML = filtered.slice(0, 50).map(item => `
                    <div class="history-item">
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                            <div><strong style="font-family: monospace;">${item.mask}</strong>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">📏 ${item.length} сим. | 🔢 ${item.entropy.toFixed(1)} бит</div></div>
                            <div style="text-align: right;">
                                <div style="font-size: 1.3rem; font-weight: bold; color: ${item.score >= 8 ? '#00e676' : item.score >= 6 ? '#ffc107' : '#ff3b30'}">${item.score}/10</div>
                                <div style="font-size: 0.7rem;">${new Date(item.timestamp).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                `).join('');
            };
        }
        
        // Добавляем обработчики
        dateFilter.addEventListener('change', () => appState?.renderHistory());
        lengthFilter.addEventListener('change', () => appState?.renderHistory());
    }
})();

// ==================== КОПИРОВАНИЕ ПАРОЛЯ С ТАЙМЕРОМ ====================
(function addCopyWithTimer() {
    let copyTimer = null;
    let originalButtonText = '';
    
    function copyWithTimer(button, password, message = 'Пароль скопирован!') {
        if (!password) {
            NotificationManager.show('Нет пароля для копирования', 'error');
            return;
        }
        
        navigator.clipboard.writeText(password).then(() => {
            // Сохраняем оригинальный текст
            if (!originalButtonText) {
                originalButtonText = button.innerHTML;
            }
            
            // Меняем текст кнопки
            button.innerHTML = '✅ Скопировано!';
            button.style.background = '#00e676';
            button.style.color = 'white';
            
            // Confetti эффект
            if (typeof confetti === 'function') confetti();
            
            // Таймер на возврат
            if (copyTimer) clearTimeout(copyTimer);
            copyTimer = setTimeout(() => {
                button.innerHTML = originalButtonText;
                button.style.background = '';
                button.style.color = '';
                originalButtonText = '';
            }, 3000);
            
            NotificationManager.show(message, 'success');
        }).catch(() => {
            NotificationManager.show('Ошибка копирования', 'error');
        });
    }
    
    // Перехватываем все кнопки копирования
    const copyButtons = ['copy-btn', 'copy-checked-password', 'gen-copy-btn'];
    copyButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            const originalClick = btn.onclick;
            btn.addEventListener('click', function(e) {
                let password = '';
                if (btnId === 'copy-btn' && currentPassword) {
                    password = currentPassword;
                } else if (btnId === 'copy-checked-password') {
                    password = document.getElementById('password-input')?.value;
                } else if (btnId === 'gen-copy-btn') {
                    password = this.dataset.password;
                }
                if (password) {
                    e.preventDefault();
                    e.stopPropagation();
                    copyWithTimer(this, password);
                }
            });
        }
    });
    
    // Также обрабатываем динамические кнопки
    document.addEventListener('click', (e) => {
        if (e.target.classList && e.target.classList.contains('gen-copy-btn')) {
            const password = e.target.dataset.password;
            if (password) {
                e.preventDefault();
                copyWithTimer(e.target, password);
            }
        }
    });
})();

// ==================== УЛУЧШЕННЫЙ ВИДЖЕТ СЛОЖНОСТИ ПАРОЛЯ ====================
(function addEnhancedStrengthWidget() {
    const passwordInput = document.getElementById('password-input');
    if (!passwordInput) return;
    
    // Создаём виджет
    const parent = passwordInput.closest('.glass-card');
    if (parent && !document.getElementById('strength-widget')) {
        const widget = document.createElement('div');
        widget.id = 'strength-widget';
        widget.className = 'strength-widget hidden';
        widget.innerHTML = `
            <div class="strength-metrics">
                <div class="strength-metric">
                    <div class="strength-metric-label">Сложность</div>
                    <div class="strength-metric-value" id="complexity-value">0%</div>
                </div>
                <div class="strength-metric">
                    <div class="strength-metric-label">Энтропия</div>
                    <div class="strength-metric-value" id="entropy-value">0 бит</div>
                </div>
                <div class="strength-metric">
                    <div class="strength-metric-label">Время взлома</div>
                    <div class="strength-metric-value" id="crack-time-value">мгновенно</div>
                </div>
                <div class="strength-metric">
                    <div class="strength-metric-label">Рейтинг</div>
                    <div class="strength-metric-value" id="rating-value">F</div>
                </div>
            </div>
            <div class="password-checklist" id="password-checklist"></div>
        `;
        
        const vizContainer = document.querySelector('.viz-container');
        if (vizContainer) {
            vizContainer.insertAdjacentElement('afterend', widget);
        }
    }
    
    function updateEnhancedWidget(password) {
        const widget = document.getElementById('strength-widget');
        if (!widget) return;
        
        if (!password) {
            widget.classList.add('hidden');
            return;
        }
        
        widget.classList.remove('hidden');
        
        const analyzer = new PasswordSecurity(password);
        const result = analyzer.analyzePassword();
        const cracking = analyzer.estimateCrackingTime();
        const score = result.score;
        
        // Сложность в процентах
        const complexity = Math.round((score / 10) * 100);
        document.getElementById('complexity-value').textContent = `${complexity}%`;
        document.getElementById('complexity-value').className = `strength-metric-value ${complexity >= 70 ? 'strong' : complexity >= 40 ? 'medium' : 'weak'}`;
        
        // Энтропия
        const entropy = result.entropy.toFixed(0);
        document.getElementById('entropy-value').textContent = `${entropy} бит`;
        document.getElementById('entropy-value').className = `strength-metric-value ${entropy >= 60 ? 'strong' : entropy >= 35 ? 'medium' : 'weak'}`;
        
        // Время взлома
        document.getElementById('crack-time-value').textContent = cracking.time;
        
        // Рейтинг (A-F)
        let rating = 'F';
        if (score >= 9) rating = 'A+';
        else if (score >= 8) rating = 'A';
        else if (score >= 7) rating = 'B';
        else if (score >= 6) rating = 'C';
        else if (score >= 4) rating = 'D';
        else rating = 'F';
        document.getElementById('rating-value').textContent = rating;
        document.getElementById('rating-value').className = `strength-metric-value ${score >= 7 ? 'strong' : score >= 4 ? 'medium' : 'weak'}`;
        
        // Чеклист
        const checklist = document.getElementById('password-checklist');
        const checks = [
            { condition: password.length >= 12, text: '📏 Длина не менее 12 символов' },
            { condition: /[A-Z]/.test(password), text: '🔠 Содержит заглавные буквы (A-Z)' },
            { condition: /[a-z]/.test(password), text: '🔡 Содержит строчные буквы (a-z)' },
            { condition: /[0-9]/.test(password), text: '🔢 Содержит цифры (0-9)' },
            { condition: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password), text: '✨ Содержит спецсимволы (!@#$)' },
            { condition: !/(.)\1{2,}/.test(password), text: '🔄 Нет повторяющихся символов' },
            { condition: !/^[A-Za-z]+$/.test(password) && !/^\d+$/.test(password), text: '🎨 Смешанные типы символов' }
        ];
        
        const passedCount = checks.filter(c => c.condition).length;
        checklist.innerHTML = checks.map(check => `
            <div class="checklist-item ${check.condition ? 'checked' : 'unchecked'}">
                ${check.condition ? '✅' : '❌'} ${check.text}
            </div>
        `).join('');
        
        // Анимация
        widget.classList.add('strength-animation', 'pulse');
        setTimeout(() => {
            widget.classList.remove('pulse');
        }, 500);
    }
    
    // Подключаем к событию ввода
    passwordInput.addEventListener('input', (e) => {
        updateEnhancedWidget(e.target.value);
    });
    
    // Также обновляем при анализе
    const originalDisplayResults = window.displayResults;
    if (originalDisplayResults) {
        window.displayResults = function(analyzer, password) {
            updateEnhancedWidget(password);
            return originalDisplayResults(analyzer, password);
        };
    }
})();

// ==================== УЛУЧШЕННАЯ ИНТЕГРАЦИЯ С HIBP ====================
(function enhancedHIBP() {
    // Кэширование результатов проверки
    const breachCache = new Map();
    
    window.checkBreaches = async function(password) {
        const resultDiv = document.getElementById('breach-result-card');
        const breachResults = document.getElementById('breach-results');
        
        if (!resultDiv) return;
        if (!password || password.length === 0) {
            NotificationManager.show('❌ Введите пароль для проверки', 'error');
            return;
        }
        
        // Проверяем кэш
        if (breachCache.has(password)) {
            const cached = breachCache.get(password);
            displayBreachResult(resultDiv, cached.found, cached.count);
            if (breachResults) breachResults.classList.remove('hidden');
            return;
        }
        
        // Показываем загрузку
        resultDiv.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <div class="loading-spinner"></div>
                <p style="margin-top: 15px;">🔍 Проверка утечек...</p>
                <p style="font-size: 0.75rem;">🔒 Ваш пароль не передаётся — используется k-анонимность</p>
            </div>
        `;
        if (breachResults) breachResults.classList.remove('hidden');
        
        try {
            const encoder = new TextEncoder();
            const hashBuffer = await crypto.subtle.digest('SHA-1', encoder.encode(password));
            const hash = Array.from(new Uint8Array(hashBuffer))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('')
                .toUpperCase();
            
            const prefix = hash.slice(0, 5);
            const suffix = hash.slice(5);
            
            // Используем множественные прокси для надёжности
            const proxyUrls = [
                `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.pwnedpasswords.com/range/${prefix}`)}`,
                `https://corsproxy.io/?${encodeURIComponent(`https://api.pwnedpasswords.com/range/${prefix}`)}`
            ];
            
            let data = null;
            for (const proxyUrl of proxyUrls) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 8000);
                    const response = await fetch(proxyUrl, { signal: controller.signal });
                    clearTimeout(timeoutId);
                    if (response.ok) {
                        data = await response.text();
                        break;
                    }
                } catch (e) { continue; }
            }
            
            if (!data) throw new Error('No proxy available');
            
            const lines = data.split('\n');
            let found = false;
            let count = 0;
            
            for (const line of lines) {
                const [hashSuffix, occurrenceCount] = line.split(':');
                if (hashSuffix && hashSuffix.trim() === suffix) {
                    found = true;
                    count = parseInt(occurrenceCount) || 0;
                    break;
                }
            }
            
            // Сохраняем в кэш на 1 час
            breachCache.set(password, { found, count });
            setTimeout(() => breachCache.delete(password), 3600000);
            
            displayBreachResult(resultDiv, found, count);
            
            if (found && appState) appState.addBreachFound();
            
        } catch (error) {
            console.error('HIBP error:', error);
            resultDiv.innerHTML = `
                <div style="padding: 20px; background: rgba(255,59,48,0.1); border-radius: 16px; text-align: center;">
                    <div style="font-size: 36px;">🔌</div>
                    <strong>❌ Не удалось проверить утечки</strong><br>
                    <span style="font-size: 0.85rem;">Проверьте подключение к интернету</span>
                    <button id="retry-hibp" class="btn-outline-small" style="margin-top: 10px;">🔄 Повторить</button>
                </div>
            `;
            document.getElementById('retry-hibp')?.addEventListener('click', () => window.checkBreaches(password));
        }
    };
    
    function displayBreachResult(container, found, count) {
        if (found) {
            container.innerHTML = `
                <div style="padding: 20px; background: rgba(255,59,48,0.2); border-radius: 16px; border-left: 4px solid #ff3b30;">
                    <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                        <div style="font-size: 48px;">⚠️</div>
                        <div>
                            <strong style="font-size: 1.1rem;">Пароль скомпрометирован!</strong><br>
                            Найден в <strong style="color: #ff3b30; font-size: 1.3rem;">${count.toLocaleString()}</strong> утечках<br>
                            <span style="font-size: 0.85rem;">НЕМЕДЛЕННО СМЕНИТЕ ПАРОЛЬ!</span>
                        </div>
                    </div>
                    <div style="margin-top: 10px; font-size: 0.8rem;">
                        💡 Рекомендация: Используйте генератор SheRoMi
                    </div>
                </div>
            `;
            NotificationManager.show('⚠️ ПАРОЛЬ В УТЕЧКАХ! НЕМЕДЛЕННО СМЕНИТЕ!', 'error', 8000);
        } else {
            container.innerHTML = `
                <div style="padding: 20px; background: rgba(0,230,118,0.15); border-radius: 16px; border-left: 4px solid #00e676;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="font-size: 48px;">✅</div>
                        <div>
                            <strong style="font-size: 1.1rem;">Пароль безопасен!</strong><br>
                            Не найден в известных утечках данных<br>
                            <span style="font-size: 0.85rem;">👍 Продолжайте в том же духе!</span>
                        </div>
                    </div>
                </div>
            `;
            NotificationManager.show('✅ Пароль не найден в утечках!', 'success');
        }
        
        // Обновляем статус в результатах
        const breachStatus = document.getElementById('breach-status');
        if (breachStatus) {
            breachStatus.innerHTML = found ? '<span style="color: #ff3b30;">⚠️ Найден!</span>' : '<span style="color: #00e676;">✅ Безопасен</span>';
        }
    }
})();

// ==================== ТЁМНЫЙ РЕЖИМ ДЛЯ CHART.JS ====================
(function chartsTheme() {
    function updateChartsTheme() {
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        const isDark = theme === 'dark' || theme === 'matrix' || theme === 'midnight' || theme === 'cyberpunk';
        
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = isDark ? '#ffffff' : '#1a1a2e';
        const borderColor = isDark ? '#ff0066' : '#ff0066';
        const bgGradient = isDark ? 'rgba(255, 0, 102, 0.1)' : 'rgba(255, 0, 102, 0.2)';
        
        if (trendChart) {
            trendChart.options.scales.x.grid.color = gridColor;
            trendChart.options.scales.y.grid.color = gridColor;
            trendChart.options.scales.x.ticks.color = textColor;
            trendChart.options.scales.y.ticks.color = textColor;
            trendChart.options.plugins.legend.labels.color = textColor;
            trendChart.data.datasets[0].borderColor = borderColor;
            trendChart.data.datasets[0].backgroundColor = bgGradient;
            trendChart.update();
        }
        
        if (distributionChart) {
            distributionChart.options.plugins.legend.labels.color = textColor;
            distributionChart.update();
        }
    }
    
    // Следим за изменением темы
    const observer = new MutationObserver(updateChartsTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    
    setTimeout(updateChartsTheme, 500);
})();

// ==================== СТАТИСТИКА АКТИВНОСТИ ЗА НЕДЕЛЮ ====================
(function addWeeklyStats() {
    const dashboardGrid = document.querySelector('.dashboard-grid');
    if (dashboardGrid && !document.getElementById('weekly-stats-card')) {
        const statsCard = document.createElement('div');
        statsCard.className = 'dashboard-card';
        statsCard.id = 'weekly-stats-card';
        statsCard.innerHTML = `
            <h3>📊 Активность за неделю</h3>
            <div id="weekly-stats" class="weekly-stats">
                <div class="week-days" id="week-days"></div>
            </div>
        `;
        dashboardGrid.appendChild(statsCard);
    }
    
    function updateWeeklyStats() {
        const container = document.getElementById('week-days');
        if (!container || !appState) return;
        
        const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1);
        
        const weekStats = Array(7).fill(0);
        
        appState.history.forEach(item => {
            const itemDate = new Date(item.timestamp);
            if (itemDate >= startOfWeek) {
                const dayDiff = Math.floor((itemDate - startOfWeek) / (1000 * 60 * 60 * 24));
                if (dayDiff >= 0 && dayDiff < 7) {
                    weekStats[dayDiff]++;
                }
            }
        });
        
        const maxCount = Math.max(...weekStats, 1);
        
        container.innerHTML = days.map((day, i) => `
            <div class="week-day">
                <div class="day-bar-container">
                    <div class="day-bar" style="height: ${(weekStats[i] / maxCount) * 100}%"></div>
                </div>
                <div class="day-label">${day}</div>
                <div class="day-count">${weekStats[i]}</div>
            </div>
        `).join('');
    }
    
    // Обновляем статистику при изменении истории
    const originalAddCheck = appState?.addCheck;
    if (appState) {
        appState.addCheck = function(...args) {
            originalAddCheck.apply(this, args);
            updateWeeklyStats();
        };
    }
    
    setTimeout(updateWeeklyStats, 500);
})();

// ==================== ЭКСПОРТ В JSON С ШИФРОВАНИЕМ ====================
(function addSecureExport() {
    // Добавляем кнопку в меню
    const sideMenuItems = document.querySelector('.side-menu-items');
    if (sideMenuItems && !document.querySelector('.side-item[data-action="secure-export"]')) {
        const secureExportItem = document.createElement('div');
        secureExportItem.className = 'side-item';
        secureExportItem.setAttribute('data-action', 'secure-export');
        secureExportItem.innerHTML = '<span>🔐</span> Экспорт (зашифрованный)';
        secureExportItem.addEventListener('click', showSecureExportModal);
        sideMenuItems.appendChild(secureExportItem);
    }
    
    function showSecureExportModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h2>🔐 Зашифрованный экспорт</h2>
                    <button class="close-modal">✕</button>
                </div>
                <div class="modal-body">
                    <p>Экспорт всех данных в защищённом JSON файле.</p>
                    <div class="form-group">
                        <label>Пароль для шифрования:</label>
                        <input type="password" id="export-password" placeholder="Введите пароль..." class="full-width">
                    </div>
                    <div class="form-group">
                        <label>Подтверждение пароля:</label>
                        <input type="password" id="export-password-confirm" placeholder="Повторите пароль..." class="full-width">
                    </div>
                    <button id="do-secure-export" class="btn btn-primary" style="width: 100%;">📦 Экспортировать</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.classList.remove('hidden');
        
        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        document.getElementById('do-secure-export').onclick = () => {
            const password = document.getElementById('export-password').value;
            const confirm = document.getElementById('export-password-confirm').value;
            
            if (!password) {
                NotificationManager.show('Введите пароль для шифрования', 'error');
                return;
            }
            if (password !== confirm) {
                NotificationManager.show('Пароли не совпадают', 'error');
                return;
            }
            
            exportSecurely(password);
            modal.remove();
        };
    }
    
    async function exportSecurely(password) {
        if (!appState) return;
        
        // Собираем все данные
        const exportData = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            stats: {
                totalChecks: appState.totalChecks,
                strongPasswords: appState.strongPasswords,
                totalYears: appState.totalYears,
                generationsCount: appState.generationsCount,
                userXP: appState.userXP
            },
            history: appState.history,
            achievements: appState.unlockedAchievements,
            profiles: StorageManager.get('sheromi_profiles', []),
            reminders: StorageManager.get('sheromi_reminders', [])
        };
        
        const jsonString = JSON.stringify(exportData, null, 2);
        
        // Простое XOR шифрование для демонстрации
        function simpleEncrypt(text, key) {
            let result = '';
            for (let i = 0; i < text.length; i++) {
                const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
                result += String.fromCharCode(charCode);
            }
            return btoa(result);
        }
        
        const encrypted = simpleEncrypt(jsonString, password);
        
        // Скачиваем файл
        const blob = new Blob([encrypted], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sheromi_backup_${new Date().toISOString().slice(0, 19)}.sheromi`;
        a.click();
        URL.revokeObjectURL(url);
        
        NotificationManager.show('✅ Данные экспортированы с шифрованием!', 'success');
    }
})();

// ==================== НЕОНОВАЯ АНИМАЦИЯ ====================
(function addNeonEffect() {
    function createNeonFlash() {
        const flash = document.createElement('div');
        flash.className = 'neon-flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 500);
    }
    
    // Отслеживаем сильные пароли
    const originalDisplayResults = window.displayResults;
    if (originalDisplayResults) {
        window.displayResults = function(analyzer, password) {
            const result = analyzer.analyzePassword();
            if (result.score >= 9) {
                createNeonFlash();
                // Добавляем радужный эффект на пароль
                const scoreDiv = document.getElementById('score-display');
                if (scoreDiv) {
                    scoreDiv.classList.add('rainbow-text');
                    setTimeout(() => scoreDiv.classList.remove('rainbow-text'), 1000);
                }
            }
            return originalDisplayResults(analyzer, password);
        };
    }
    
    // Для генератора
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            setTimeout(() => {
                const analyzer = new PasswordSecurity(currentPassword);
                if (analyzer.getScore() >= 9) {
                    createNeonFlash();
                    const display = document.getElementById('password-display');
                    if (display) {
                        display.classList.add('rainbow-text');
                        setTimeout(() => display.classList.remove('rainbow-text'), 1000);
                    }
                }
            }, 100);
        });
    }
})();

// ==================== KONAMI КОД (ПАСХАЛКА) ====================
(function addKonamiCode() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateKonami();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    function activateKonami() {
        // Секретный режим
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 3000);
        
        // Секретное сообщение
        NotificationManager.show('🎮 СЕКРЕТНЫЙ РЕЖИМ АКТИВИРОВАН! 🎮', 'success', 5000);
        
        // Конфетти
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                if (typeof confetti === 'function') confetti();
            }, i * 200);
        }
        
        // Секретный звук
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.frequency.value = 880;
            oscillator.type = 'sine';
            gainNode.gain.value = 0.3;
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 1);
            oscillator.stop(audioCtx.currentTime + 1);
            if (audioCtx.state === 'suspended') audioCtx.resume();
        } catch(e) {}
    }
    
    console.log('🎮 Konami-код активирован: ↑ ↑ ↓ ↓ ← → ← → B A');
})();

// ==================== ШЕЙК-ТЕЛЕФОНА ДЛЯ ГЕНЕРАЦИИ ====================
(function addShakeToGenerate() {
    let lastShake = 0;
    let shakeThreshold = 800; // порог чувствительности
    
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', (e) => {
            const acceleration = e.acceleration;
            if (acceleration) {
                const magnitude = Math.sqrt(
                    (acceleration.x || 0) ** 2 + 
                    (acceleration.y || 0) ** 2 + 
                    (acceleration.z || 0) ** 2
                );
                
                if (magnitude > 15) {
                    const now = Date.now();
                    if (now - lastShake > 2000) {
                        lastShake = now;
                        generateRandomPassword();
                    }
                }
            }
        });
        
        function generateRandomPassword() {
            const generateBtn = document.getElementById('generate-btn');
            if (generateBtn) {
                generateBtn.click();
                NotificationManager.show('📱 Тряска! Сгенерирован новый пароль!', 'info', 2000);
                
                // Визуальный эффект
                const container = document.querySelector('.container');
                if (container) {
                    container.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        container.style.transform = '';
                    }, 200);
                }
            }
        }
        
        // Добавляем индикатор в настройках
        const sideMenuFooter = document.querySelector('.side-menu-footer');
        if (sideMenuFooter && !document.querySelector('.shake-indicator')) {
            const shakeInfo = document.createElement('div');
            shakeInfo.className = 'shake-indicator';
            shakeInfo.style.cssText = 'font-size: 0.6rem; color: var(--text-muted); margin-top: 5px; text-align: center;';
            shakeInfo.innerHTML = '📱 Трясите телефон → новый пароль!';
            sideMenuFooter.appendChild(shakeInfo);
        }
    } else {
        console.log('DeviceMotion не поддерживается');
    }
})();

// ==================== РЕЖИМ "КИОСК" (F11) ====================
(function addKioskMode() {
    let isKiosk = false;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F11') {
            e.preventDefault();
            toggleKioskMode();
        }
    });
    
    function toggleKioskMode() {
        isKiosk = !isKiosk;
        
        if (isKiosk) {
            document.documentElement.requestFullscreen();
            document.body.style.cursor = 'none';
            document.querySelector('.app-header').style.opacity = '0.3';
            document.querySelector('.hero').style.opacity = '0.7';
            NotificationManager.show('🎬 Киоск-режим активирован (нажмите F11 для выхода)', 'info', 3000);
        } else {
            document.exitFullscreen();
            document.body.style.cursor = '';
            document.querySelector('.app-header').style.opacity = '';
            document.querySelector('.hero').style.opacity = '';
        }
    }
    
    // Добавляем кнопку в меню
    const sideMenuItems = document.querySelector('.side-menu-items');
    if (sideMenuItems && !document.querySelector('.side-item[data-action="kiosk"]')) {
        const kioskItem = document.createElement('div');
        kioskItem.className = 'side-item';
        kioskItem.setAttribute('data-action', 'kiosk');
        kioskItem.innerHTML = '<span>🎬</span> Киоск-режим (F11)';
        kioskItem.addEventListener('click', toggleKioskMode);
        sideMenuItems.appendChild(kioskItem);
    }
})();

// ==================== ПРОГРЕСС-БАР В FAVICON ====================
(function addFaviconProgress() {
    function updateFavicon(percent) {
        let canvas = document.getElementById('favicon-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'favicon-canvas';
            canvas.width = 64;
            canvas.height = 64;
            document.body.appendChild(canvas);
        }
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 64, 64);
        
        // Рисуем фон
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, 64, 64);
        
        // Рисуем замок
        ctx.fillStyle = percent >= 70 ? '#00e676' : percent >= 40 ? '#ffc107' : '#ff3b30';
        ctx.font = '40px sans-serif';
        ctx.fillText('🔐', 12, 52);
        
        // Рисуем прогресс-бар снизу
        const barWidth = (percent / 100) * 64;
        ctx.fillStyle = percent >= 70 ? '#00e676' : percent >= 40 ? '#ffc107' : '#ff3b30';
        ctx.fillRect(0, 60, barWidth, 4);
        
        // Обновляем favicon
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = canvas.toDataURL();
        document.head.appendChild(link);
    }
    
    // Обновляем при проверке пароля
    const passwordInput = document.getElementById('password-input');
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            if (e.target.value) {
                const analyzer = new PasswordSecurity(e.target.value);
                const score = analyzer.getScore();
                updateFavicon(score * 10);
            } else {
                updateFavicon(0);
            }
        });
    }
    
    updateFavicon(0);
})();

// ==================== СОХРАНЕНИЕ ТЕМЫ В URL ====================
(function saveThemeToURL() {
    // Применяем тему из URL при загрузке
    const urlParams = new URLSearchParams(window.location.search);
    const themeFromURL = urlParams.get('theme');
    if (themeFromURL && ThemeManager.themes.includes(themeFromURL)) {
        ThemeManager.setTheme(themeFromURL);
    }
    
    // Обновляем URL при смене темы
    const originalSetTheme = ThemeManager.setTheme;
    ThemeManager.setTheme = function(theme) {
        originalSetTheme(theme);
        const url = new URL(window.location);
        url.searchParams.set('theme', theme);
        window.history.pushState({}, '', url);
    };
    
    // Добавляем кнопку "Поделиться" в меню
    const sideMenuItems = document.querySelector('.side-menu-items');
    if (sideMenuItems && !document.querySelector('.side-item[data-action="share-theme"]')) {
        const shareItem = document.createElement('div');
        shareItem.className = 'side-item';
        shareItem.setAttribute('data-action', 'share-theme');
        shareItem.innerHTML = '<span>🔗</span> Поделиться темой';
        shareItem.addEventListener('click', () => {
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            NotificationManager.show('🔗 Ссылка с темой скопирована!', 'success');
        });
        sideMenuItems.appendChild(shareItem);
    }
})();

// ==================== УДАЛЕНИЕ ПУНКТА "ЗАШИФРОВАННЫЙ ЭКСПОРТ" ====================
(function removeSecureExport() {
    // Находим и удаляем пункт меню
    const secureExportItem = document.querySelector('.side-item[data-action="secure-export"]');
    if (secureExportItem) {
        secureExportItem.remove();
        console.log('✅ Secure export menu item removed');
    }
    
    // Также удаляем любые другие элементы, связанные с шифрованным экспортом
    const anySecureExport = document.querySelector('[data-action="secure-export"]');
    if (anySecureExport) {
        anySecureExport.remove();
    }
    
    // Удаляем модальное окно если оно существует
    const existingModal = document.getElementById('secure-export-modal');
    if (existingModal) {
        existingModal.remove();
    }
})();

// ==================== ОЧИСТКА ОБРАБОТЧИКОВ ====================
(function cleanupHandlers() {
    // Пересоздаём все обработчики пунктов меню без secure-export
    const allSideItems = document.querySelectorAll('.side-item');
    
    const actionHandlers = {
        'dashboard': () => {
            const dashboardSection = document.getElementById('dashboard-section');
            if (dashboardSection) {
                dashboardSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                dashboardSection.style.boxShadow = '0 0 0 3px var(--primary)';
                setTimeout(() => { dashboardSection.style.boxShadow = ''; }, 1500);
            }
        },
        'profile': () => {
            if (typeof renderProfilesModal === 'function') {
                renderProfilesModal();
                const modal = document.getElementById('profiles-modal');
                if (modal) modal.classList.remove('hidden');
            } else {
                NotificationManager.show('👤 Профили настроек', 'info', 1500);
            }
        },
        'scheduler': () => {
            if (typeof showSchedulerModal === 'function') {
                showSchedulerModal();
            } else {
                NotificationManager.show('📅 Планировщик смены паролей', 'info', 1500);
            }
        },
        'compare': () => {
            if (typeof showCompareModal === 'function') {
                showCompareModal();
            } else {
                NotificationManager.show('🔄 Сравнение паролей', 'info', 1500);
            }
        },
        'themes': () => {
            const themesModal = document.getElementById('themes-modal');
            if (themesModal) themesModal.classList.remove('hidden');
        },
        'export-all': () => {
            const pdfBtn = document.getElementById('export-history-pdf');
            if (pdfBtn) {
                pdfBtn.click();
            } else {
                NotificationManager.show('📦 Экспорт данных', 'info', 1500);
            }
        },
        'achievements': () => {
            const achievementsTab = document.querySelector('.tab[data-tab="achievements"]');
            if (achievementsTab) {
                achievementsTab.click();
            }
        },
        'clear-all': () => {
            if (confirm('⚠️ СБРОСИТЬ ВСЕ ДАННЫЕ? Это необратимо!\n\nБудут удалены:\n• История проверок\n• Достижения\n• Профили\n• Напоминания')) {
                localStorage.clear();
                location.reload();
            }
        }
    };
    
    // Обновляем все обработчики
    allSideItems.forEach(item => {
        const action = item.dataset.action;
        if (action && actionHandlers[action]) {
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            newItem.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const sideMenu = document.getElementById('side-menu');
                const overlay = document.getElementById('overlay');
                if (sideMenu) sideMenu.classList.remove('open');
                if (overlay) overlay.classList.add('hidden');
                
                actionHandlers[action]();
            });
        }
    });
    
    console.log('✅ Cleaned up handlers without secure export');
})();

// ==================== ГЛОБАЛЬНЫЙ ДОСТУП К ФУНКЦИЯМ МОДАЛОК ====================
// Делаем функции доступными глобально
window.renderProfilesModal = function() {
    // Находим или создаём модалку
    let modal = document.getElementById('profiles-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'profiles-modal';
        modal.className = 'modal hidden';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>👤 Профили настроек</h2>
                    <button class="close-modal">✕</button>
                </div>
                <div class="modal-body">
                    <div id="profiles-list-container" class="profiles-list"></div>
                    <button id="create-profile-btn" class="btn btn-outline" style="width: 100%; margin-top: 15px;">➕ Создать профиль</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('.close-modal').addEventListener('click', () => modal.classList.add('hidden'));
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
    }
    
    // Получаем данные
    let profiles = StorageManager.get('sheromi_profiles', []);
    let activeProfileId = StorageManager.get('sheromi_active_profile', null);
    
    const defaultProfiles = [
        { id: 'default', name: 'Стандартный', icon: '⭐', settings: { minLength: 12, requireUpper: true, requireLower: true, requireDigits: true, requireSpecial: true } },
        { id: 'social', name: 'Соцсети', icon: '📱', settings: { minLength: 10, requireUpper: true, requireLower: true, requireDigits: true, requireSpecial: false } },
        { id: 'banking', name: 'Банкинг', icon: '🏦', settings: { minLength: 16, requireUpper: true, requireLower: true, requireDigits: true, requireSpecial: true } },
        { id: 'work', name: 'Рабочий', icon: '💼', settings: { minLength: 14, requireUpper: true, requireLower: true, requireDigits: true, requireSpecial: true } }
    ];
    
    if (profiles.length === 0) {
        profiles = [...defaultProfiles];
        StorageManager.set('sheromi_profiles', profiles);
    }
    
    const container = document.getElementById('profiles-list-container');
    if (container) {
        container.innerHTML = profiles.map(profile => `
            <div class="profile-card ${activeProfileId === profile.id ? 'active-profile' : ''}" style="display: flex; align-items: center; gap: 15px; padding: 15px; background: var(--bg-input); border-radius: 16px; margin-bottom: 10px;">
                <div style="font-size: 2rem;">${profile.icon}</div>
                <div style="flex: 1;">
                    <div style="font-weight: bold;">${profile.name}</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">📏 ${profile.settings.minLength}+ | ${profile.settings.requireUpper ? 'A-Z' : '❌'} | ${profile.settings.requireSpecial ? '!@#' : '❌'}</div>
                </div>
                <div>
                    ${activeProfileId !== profile.id ? `<button class="profile-activate-btn" data-id="${profile.id}" style="background: var(--success); border: none; padding: 6px 12px; border-radius: 20px; cursor: pointer;">✅ Активировать</button>` : '<span style="background: var(--success); padding: 4px 10px; border-radius: 20px;">Активен</span>'}
                    ${profile.id !== 'default' ? `<button class="profile-delete-btn" data-id="${profile.id}" style="background: var(--danger); border: none; padding: 6px 10px; border-radius: 20px; cursor: pointer; margin-left: 8px;">🗑️</button>` : ''}
                </div>
            </div>
        `).join('');
        
        document.querySelectorAll('.profile-activate-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                StorageManager.set('sheromi_active_profile', id);
                // Применяем настройки
                const profile = profiles.find(p => p.id === id);
                if (profile) {
                    const lengthSlider = document.getElementById('password-length');
                    if (lengthSlider) lengthSlider.value = profile.settings.minLength;
                    document.getElementById('use-upper').checked = profile.settings.requireUpper;
                    document.getElementById('use-lower').checked = profile.settings.requireLower;
                    document.getElementById('use-digits').checked = profile.settings.requireDigits;
                    document.getElementById('use-special').checked = profile.settings.requireSpecial;
                    NotificationManager.show(`Профиль "${profile.name}" активирован`, 'success');
                }
                window.renderProfilesModal();
            });
        });
        
        document.querySelectorAll('.profile-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                if (confirm('Удалить профиль?')) {
                    profiles = profiles.filter(p => p.id !== id);
                    StorageManager.set('sheromi_profiles', profiles);
                    window.renderProfilesModal();
                }
            });
        });
    }
    
    modal.classList.remove('hidden');
};

window.showSchedulerModal = function() {
    let modal = document.getElementById('scheduler-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'scheduler-modal';
        modal.className = 'modal hidden';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2>📅 Планировщик смены паролей</h2>
                    <button class="close-modal">✕</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Название сервиса:</label>
                        <input type="text" id="reminder-service" placeholder="Google, Email, Банк..." class="full-width">
                    </div>
                    <div class="form-group">
                        <label>Дата следующей смены:</label>
                        <input type="date" id="reminder-date" class="full-width">
                    </div>
                    <button id="add-reminder-btn" class="btn btn-primary" style="width: 100%;">➕ Добавить напоминание</button>
                    <h3 style="margin: 20px 0 10px;">📋 Активные напоминания</h3>
                    <div id="reminders-list-container" class="reminders-list"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('.close-modal').addEventListener('click', () => modal.classList.add('hidden'));
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
    }
    
    function renderRemindersList() {
        const reminders = StorageManager.get('sheromi_reminders', []);
        const container = document.getElementById('reminders-list-container');
        if (!container) return;
        
        if (reminders.length === 0) {
            container.innerHTML = '<p class="empty-history">📭 Нет активных напоминаний</p>';
            return;
        }
        
        container.innerHTML = reminders.map(r => `
            <div style="background: var(--bg-input); padding: 15px; border-radius: 16px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${r.service}</strong>
                    <div style="font-size: 0.75rem;">📅 Сменить до: ${new Date(r.dueDate).toLocaleDateString()}</div>
                </div>
                <button class="reminder-delete-btn" data-id="${r.id}" style="background: var(--danger); border: none; padding: 6px 12px; border-radius: 20px; cursor: pointer;">🗑️</button>
            </div>
        `).join('');
        
        document.querySelectorAll('.reminder-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                let reminders = StorageManager.get('sheromi_reminders', []);
                reminders = reminders.filter(r => r.id !== id);
                StorageManager.set('sheromi_reminders', reminders);
                renderRemindersList();
                NotificationManager.show('Напоминание удалено', 'success');
            });
        });
    }
    
    document.getElementById('add-reminder-btn').onclick = () => {
        const service = document.getElementById('reminder-service').value.trim();
        const date = document.getElementById('reminder-date').value;
        if (!service || !date) {
            NotificationManager.show('Заполните все поля', 'error');
            return;
        }
        let reminders = StorageManager.get('sheromi_reminders', []);
        reminders.push({ id: Date.now(), service: service, dueDate: date });
        StorageManager.set('sheromi_reminders', reminders);
        document.getElementById('reminder-service').value = '';
        document.getElementById('reminder-date').value = '';
        renderRemindersList();
        NotificationManager.show(`Напоминание для "${service}" добавлено!`, 'success');
    };
    
    renderRemindersList();
    modal.classList.remove('hidden');
};

window.showCompareModal = function() {
    let modal = document.getElementById('compare-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'compare-modal';
        modal.className = 'modal hidden';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2>🔄 Сравнение паролей</h2>
                    <button class="close-modal">✕</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Пароль 1:</label>
                        <input type="password" id="compare-pwd1" class="full-width">
                    </div>
                    <div class="form-group">
                        <label>Пароль 2:</label>
                        <input type="password" id="compare-pwd2" class="full-width">
                    </div>
                    <button id="compare-btn" class="btn btn-primary" style="width: 100%;">🔄 Сравнить</button>
                    <div id="compare-result" style="margin-top: 20px;"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('.close-modal').addEventListener('click', () => modal.classList.add('hidden'));
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
    }
    
    document.getElementById('compare-btn').onclick = () => {
        const pwd1 = document.getElementById('compare-pwd1').value;
        const pwd2 = document.getElementById('compare-pwd2').value;
        if (!pwd1 || !pwd2) {
            NotificationManager.show('Введите оба пароля', 'error');
            return;
        }
        const a1 = new PasswordSecurity(pwd1);
        const a2 = new PasswordSecurity(pwd2);
        const s1 = a1.analyzePassword().score;
        const s2 = a2.analyzePassword().score;
        const resultDiv = document.getElementById('compare-result');
        if (s1 > s2) {
            resultDiv.innerHTML = `<div style="background: rgba(0,230,118,0.2); padding: 20px; border-radius: 16px; text-align: center;"><strong>🏆 Пароль 1 сильнее!</strong><br>${s1}/10 против ${s2}/10</div>`;
        } else if (s2 > s1) {
            resultDiv.innerHTML = `<div style="background: rgba(0,230,118,0.2); padding: 20px; border-radius: 16px; text-align: center;"><strong>🏆 Пароль 2 сильнее!</strong><br>${s2}/10 против ${s1}/10</div>`;
        } else {
            resultDiv.innerHTML = `<div style="background: rgba(255,193,7,0.2); padding: 20px; border-radius: 16px; text-align: center;"><strong>🤝 Ничья!</strong><br>Оба пароля набрали ${s1}/10</div>`;
        }
    };
    
    modal.classList.remove('hidden');
};

// Обновляем обработчики в меню
setTimeout(() => {
    const profileItem = document.querySelector('.side-item[data-action="profile"]');
    if (profileItem) {
        const newItem = profileItem.cloneNode(true);
        profileItem.parentNode.replaceChild(newItem, profileItem);
        newItem.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('side-menu')?.classList.remove('open');
            document.getElementById('overlay')?.classList.add('hidden');
            window.renderProfilesModal();
        });
    }
    
    const schedulerItem = document.querySelector('.side-item[data-action="scheduler"]');
    if (schedulerItem) {
        const newItem = schedulerItem.cloneNode(true);
        schedulerItem.parentNode.replaceChild(newItem, schedulerItem);
        newItem.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('side-menu')?.classList.remove('open');
            document.getElementById('overlay')?.classList.add('hidden');
            window.showSchedulerModal();
        });
    }
    
    const compareItem = document.querySelector('.side-item[data-action="compare"]');
    if (compareItem) {
        const newItem = compareItem.cloneNode(true);
        compareItem.parentNode.replaceChild(newItem, compareItem);
        newItem.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('side-menu')?.classList.remove('open');
            document.getElementById('overlay')?.classList.add('hidden');
            window.showCompareModal();
        });
    }
    
    console.log('✅ Все модалки зарегистрированы!');
}, 500);