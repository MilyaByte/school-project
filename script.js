// Класс для оценки безопасности пароля
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
            "password1", "12345", "123456789", "letmein", "welcome"
        ];
        
        this.forbiddenWords = ["admin", "user", "login", "password"];
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
        if (len >= 16) {
            this.score += 4;
        } else if (len >= 12) {
            this.score += 3;
        } else if (len >= 8) {
            this.score += 2;
            this.weaknesses.push("Пароль должен быть длиннее (рекомендуется 12+ символов)");
        } else {
            this.weaknesses.push("Пароль слишком короткий (минимум 8 символов)");
        }
    }
    
    checkCharacterVariety() {
        let hasUpper = false, hasLower = false, hasDigit = false;
        let hasSpecial = false, hasUnicode = false;
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
        
        if (this.charTypes >= 4) {
            this.score += 3;
        } else if (this.charTypes >= 3) {
            this.score += 2;
            this.weaknesses.push("Добавьте больше типов символов");
        } else {
            this.score += 1;
            this.weaknesses.push("Используйте разные типы символов (верхний/нижний регистр, цифры, спецсимволы)");
        }
    }
    
    checkCommonPatterns() {
        const seqRegex = /(.)\1{2,}/;
        if (seqRegex.test(this.password)) {
            this.weaknesses.push("Обнаружены повторяющиеся символы");
        }
        
        const commonPatterns = ["123", "abc", "qwe", "asd", "zxc", "111", "000"];
        for (const pattern of commonPatterns) {
            if (this.password.includes(pattern)) {
                this.weaknesses.push("Обнаружены простые последовательности");
                break;
            }
        }
    }
    
    checkEntropy() {
        let charSetSize = 0;
        if (/[a-z]/.test(this.password)) charSetSize += 26;
        if (/[A-Z]/.test(this.password)) charSetSize += 26;
        if (/[0-9]/.test(this.password)) charSetSize += 10;
        if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(this.password)) charSetSize += 20;
        
        this.entropy = this.password.length * Math.log2(charSetSize);
        
        if (this.entropy > 80) {
            this.score += 3;
        } else if (this.entropy > 60) {
            this.score += 2;
        } else if (this.entropy > 40) {
            this.score += 1;
            this.weaknesses.push("Низкая энтропия пароля");
        } else {
            this.weaknesses.push("Очень низкая энтропия пароля");
        }
    }
    
    checkSequences() {
        const keyboardSequences = [
            "qwerty", "asdfgh", "zxcvbn", "123456", "654321",
            "qazwsx", "edcrfv", "tgbnhy", "yhnujm", "ikmplo"
        ];
        
        const lowerPwd = this.password.toLowerCase();
        
        for (const seq of keyboardSequences) {
            if (lowerPwd.includes(seq)) {
                this.weaknesses.push("Обнаружена клавиатурная последовательность: " + seq);
                break;
            }
        }
    }
    
    checkDictionaryWords() {
        const lowerPwd = this.password.toLowerCase();
        
        for (const commonPwd of this.commonPasswords) {
            if (lowerPwd.includes(commonPwd)) {
                this.weaknesses.push("Пароль содержит распространенную комбинацию");
                break;
            }
        }
        
        for (const word of this.forbiddenWords) {
            if (lowerPwd.includes(word)) {
                this.weaknesses.push("Пароль содержит запрещенное слово: " + word);
                break;
            }
        }
    }
    
    calculateFinalScore() {
        this.score = Math.max(0, Math.min(10, this.score - this.weaknesses.length));
    }
    
    generateSuggestions() {
        if (this.password.length < 12) {
            this.suggestions["length"] = "Увеличьте длину пароля до 12+ символов";
        }
        
        if (!/\d/.test(this.password)) {
            this.suggestions["digits"] = "Добавьте цифры";
        }
        
        if (!/[A-Z]/.test(this.password)) {
            this.suggestions["uppercase"] = "Добавьте заглавные буквы";
        }
        
        if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(this.password)) {
            this.suggestions["special"] = "Добавьте специальные символы";
        }
        
        if (this.weaknesses.length === 0) {
            this.suggestions["general"] = "Отличный пароль! Рекомендуется менять его каждые 3-6 месяцев";
        }
    }
    
    estimateCrackingTime() {
        const attemptsPerSecond = 1000000000; // 1 миллиард попыток в секунду
        
        let charsetSize = 0;
        if (/[a-z]/.test(this.password)) charsetSize += 26;
        if (/[A-Z]/.test(this.password)) charsetSize += 26;
        if (/[0-9]/.test(this.password)) charsetSize += 10;
        if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(this.password)) charsetSize += 20;
        
        if (charsetSize === 0) charsetSize = 26;
        
        const possibleCombinations = Math.pow(charsetSize, this.password.length);
        let seconds = possibleCombinations / attemptsPerSecond;
        
        let timeText = "";
        let years = 0;
        
        if (seconds < 1) {
            timeText = "Менее секунды";
        } else if (seconds < 60) {
            timeText = `Около ${Math.floor(seconds)} секунд`;
        } else if (seconds < 3600) {
            timeText = `Около ${Math.floor(seconds / 60)} минут`;
        } else if (seconds < 86400) {
            timeText = `Около ${Math.floor(seconds / 3600)} часов`;
        } else if (seconds < 2592000) {
            timeText = `Около ${Math.floor(seconds / 86400)} дней`;
        } else if (seconds < 31536000) {
            const months = Math.floor(seconds / 2592000);
            timeText = `Около ${months} месяцев`;
        } else {
            years = seconds / 31536000;
            if (years < 1000) {
                timeText = `Около ${Math.floor(years)} лет`;
            } else if (years < 1000000) {
                timeText = `Около ${Math.floor(years / 1000)} тысяч лет`;
            } else {
                timeText = "Миллионы лет";
            }
        }
        
        return {
            time: timeText,
            charsetSize: charsetSize,
            years: years
        };
    }
    
    getScore() {
        return this.score;
    }
}

// Класс для управления уведомлениями
class NotificationManager {
    static show(message, type = 'info', duration = 3000) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.remove('hidden');
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, duration);
    }
}

// Класс для работы с локальным хранилищем
class StorageManager {
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Ошибка сохранения:', e);
            return false;
        }
    }
    
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Ошибка чтения:', e);
            return defaultValue;
        }
    }
    
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Ошибка удаления:', e);
            return false;
        }
    }
}

// Класс для генерации отчетов
class ReportGenerator {
    static generateJSON(data) {
        return JSON.stringify(data, null, 2);
    }
    
    static generateCSV(history) {
        const headers = ['Password', 'Score', 'Length', 'Entropy', 'Timestamp'];
        const rows = history.map(item => [
            item.password,
            item.score,
            item.length,
            item.entropy.toFixed(2),
            new Date(item.timestamp).toLocaleString()
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    static generatePDF(analyzer, password) {
        const result = analyzer.analyzePassword();
        const crackingTime = analyzer.estimateCrackingTime();
        
        return `
Отчет анализа пароля
====================

Пароль: ${'*'.repeat(password.length)}
Длина: ${password.length} символов
Оценка безопасности: ${result.score}/10
Энтропия: ${result.entropy.toFixed(2)}

Время подбора: ${crackingTime.time}
Типов символов: ${result.charTypes}

Сгенерировано: ${new Date().toLocaleString()}
        `.trim();
    }
}

// Класс для управления темами
class ThemeManager {
    static currentTheme = 'light';
    static autoMode = true;
    
    static init() {
        this.loadThemeSettings();
        this.applyTheme();
        
        if (this.autoMode) {
            this.startAutoTheme();
        }
        
        this.addTimeIndicator();
    }
    
    static loadThemeSettings() {
        const savedTheme = StorageManager.get('theme', 'auto');
        const savedAutoMode = StorageManager.get('autoTheme', true);
        
        if (savedTheme !== 'auto') {
            this.currentTheme = savedTheme;
            this.autoMode = false;
        } else {
            this.autoMode = savedAutoMode;
            this.determineAutoTheme();
        }
    }
    
    static determineAutoTheme() {
        const now = new Date();
        const hours = now.getHours();
        this.currentTheme = (hours >= 6 && hours < 18) ? 'light' : 'dark';
    }
    
    static applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateToggleIcon();
        this.updateTimeIndicator();
        this.saveThemeSettings();
    }
    
    static toggleTheme() {
        if (this.autoMode) {
            this.autoMode = false;
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        } else {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        }
        
        this.applyTheme();
        NotificationManager.show(`Тема: ${this.getThemeName()}`, 'info');
    }
    
    static setAutoMode() {
        this.autoMode = true;
        this.determineAutoTheme();
        this.applyTheme();
        NotificationManager.show('Авто-режим темы включен', 'success');
    }
    
    static updateToggleIcon() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            if (this.autoMode) {
                toggleBtn.innerHTML = '🌗';
                toggleBtn.title = 'Авто-режим (текущая: ' + this.getThemeName() + ')';
            } else {
                toggleBtn.innerHTML = this.currentTheme === 'light' ? '🌙' : '☀️';
                toggleBtn.title = this.currentTheme === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему';
            }
        }
    }
    
    static updateTimeIndicator() {
        const indicator = document.getElementById('time-indicator');
        if (indicator) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('ru-RU', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            indicator.textContent = `${this.getThemeName()} • ${timeString}`;
            indicator.style.background = this.currentTheme === 'light' 
                ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                : 'linear-gradient(135deg, #1a2980, #26d0ce)';
        }
    }
    
    static getThemeName() {
        if (this.autoMode) {
            return 'Авто (' + (this.currentTheme === 'light' ? 'День' : 'Ночь') + ')';
        }
        return this.currentTheme === 'light' ? 'День' : 'Ночь';
    }
    
    static startAutoTheme() {
        setInterval(() => {
            if (this.autoMode) {
                const previousTheme = this.currentTheme;
                this.determineAutoTheme();
                
                if (previousTheme !== this.currentTheme) {
                    this.applyTheme();
                    NotificationManager.show(
                        `Автоматическое переключение: ${this.getThemeName()}`,
                        'info',
                        2000
                    );
                }
            }
        }, 60000);
    }
    
    static addTimeIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'time-indicator';
        indicator.className = 'time-indicator';
        document.body.appendChild(indicator);
        this.updateTimeIndicator();
    }
    
    static saveThemeSettings() {
        StorageManager.set('theme', this.autoMode ? 'auto' : this.currentTheme);
        StorageManager.set('autoTheme', this.autoMode);
    }
}

// Класс для управления состоянием приложения
class AppState {
    constructor() {
        this.checkHistory = JSON.parse(localStorage.getItem('passwordCheckHistory')) || [];
        this.totalChecks = parseInt(localStorage.getItem('totalChecks')) || 0;
        this.strongPasswords = parseInt(localStorage.getItem('strongPasswords')) || 0;
        this.totalTimeSaved = parseInt(localStorage.getItem('totalTimeSaved')) || 0;
    }
    
    addCheck(password, result) {
        const check = {
            password: '*'.repeat(password.length),
            score: result.score,
            timestamp: new Date().toISOString(),
            length: password.length,
            entropy: result.entropy
        };
        
        this.checkHistory.unshift(check);
        this.totalChecks++;
        
        if (result.score >= 8) {
            this.strongPasswords++;
        }
        
        const crackingTime = new PasswordSecurity(password).estimateCrackingTime();
        if (crackingTime.years > 1) {
            this.totalTimeSaved += Math.floor(crackingTime.years);
        }
        
        this.save();
        this.updateStats();
        this.renderHistory();
    }
    
    clearHistory() {
        this.checkHistory = [];
        this.save();
        this.renderHistory();
        NotificationManager.show('История очищена', 'success');
    }
    
    save() {
        StorageManager.set('passwordCheckHistory', JSON.stringify(this.checkHistory));
        StorageManager.set('totalChecks', this.totalChecks.toString());
        StorageManager.set('strongPasswords', this.strongPasswords.toString());
        StorageManager.set('totalTimeSaved', this.totalTimeSaved.toString());
    }
    
    updateStats() {
        document.getElementById('total-checks').textContent = this.totalChecks;
        document.getElementById('strong-passwords').textContent = this.strongPasswords;
        document.getElementById('time-saved').textContent = this.totalTimeSaved;
    }
    
    renderHistory() {
        const historyList = document.getElementById('history-list');
        
        if (this.checkHistory.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-muted);">История проверок пуста. Проанализируйте свой первый пароль!</p>';
            return;
        }
        
        historyList.innerHTML = this.checkHistory.map(check => `
            <div class="history-item">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${check.password}</strong>
                        <div style="font-size: 0.9rem; color: var(--text-muted);">
                            Длина: ${check.length} | Энтропия: ${check.entropy.toFixed(1)}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div class="score-display" style="font-size: 1.2rem; padding: 5px 15px; 
                            ${check.score >= 8 ? 'background: var(--gradient-success); color: white;' : 
                              check.score >= 6 ? 'background: linear-gradient(135deg, var(--warning-color), #e67e22); color: white;' : 
                              'background: linear-gradient(135deg, var(--danger-color), #c0392b); color: white;'}">
                            ${check.score}/10
                        </div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">
                            ${new Date(check.timestamp).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    exportData(format) {
        const data = {
            history: this.checkHistory,
            stats: {
                totalChecks: this.totalChecks,
                strongPasswords: this.strongPasswords,
                totalTimeSaved: this.totalTimeSaved
            },
            exportDate: new Date().toISOString()
        };
        
        let content, filename, mimeType;
        
        switch (format) {
            case 'json':
                content = ReportGenerator.generateJSON(data);
                filename = `password-analysis-${Date.now()}.json`;
                mimeType = 'application/json';
                break;
            case 'csv':
                content = ReportGenerator.generateCSV(this.checkHistory);
                filename = `password-analysis-${Date.now()}.csv`;
                mimeType = 'text/csv';
                break;
            case 'pdf':
                content = ReportGenerator.generatePDF(
                    new PasswordSecurity('demo'),
                    'demo'
                );
                filename = `password-analysis-${Date.now()}.txt`;
                mimeType = 'text/plain';
                break;
        }
        
        this.downloadFile(content, filename, mimeType);
        NotificationManager.show(`Данные экспортированы в ${format.toUpperCase()}`, 'success');
    }
    
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Функции генерации паролей
function generateMemorablePassword(wordCount, useUpper, useDigits, useSpecial) {
    const words = [
        "turan", "kazah", "artik", "legend", "super", "pro", "afonya", "cloud",
        "zen", "dog", "bird", "fisher", "fundament", "chap", "bear", "wolf",
        "apple", "banana", "grape", "berry", "fruit", "tree", "mountain",
        "whynike", "minimum", "aldy", "luz", "turanNet", "russia", "water",
        "fire", "earth", "wind", "stone", "bazoviy", "sorry", "Tula",
        "muhalov", "sin", "image", "execution", "policy", "mysa"
    ];
    
    const separators = ["-", "_", ".", "", "~", "=", "+", "&", "^"];
    const digitCombinations = ["123", "234", "345", "456", "567", "678", "789", "2023", "2024", "2025"];
    const specialChars = ["!", "@", "#", "$", "%", "&", "*", "?", "~"];
    
    let password = "";
    const selectedWords = [];
    
    for (let i = 0; i < wordCount; ++i) {
        let word = words[Math.floor(Math.random() * words.length)];
        if (useUpper && (i === 0 || Math.random() < 0.5)) {
            word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        selectedWords.push(word);
    }
    
    for (let i = 0; i < selectedWords.length; ++i) {
        password += selectedWords[i];
        
        if (i < selectedWords.length - 1) {
            const action = Math.floor(Math.random() * 4);
            
            if (action === 0 && useDigits) {
                password += digitCombinations[Math.floor(Math.random() * digitCombinations.length)];
                password += separators[Math.floor(Math.random() * separators.length)];
            } else if (action === 1 && useSpecial) {
                password += specialChars[Math.floor(Math.random() * specialChars.length)];
                password += separators[Math.floor(Math.random() * separators.length)];
            } else {
                password += separators[Math.floor(Math.random() * separators.length)];
            }
        }
    }
    
    const finalAction = Math.floor(Math.random() * 4);
    if (finalAction >= 2) {
        if (useDigits && (finalAction === 2 || Math.random() < 0.5)) {
            password += digitCombinations[Math.floor(Math.random() * digitCombinations.length)];
        }
        if (useSpecial && (finalAction === 3 || Math.random() < 0.5)) {
            password += specialChars[Math.floor(Math.random() * specialChars.length)];
        }
    }
    
    return password;
}

function generatePronounceablePassword(length) {
    const vowels = 'aeiou';
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    let password = '';
    
    for (let i = 0; i < length; i++) {
        if (i % 2 === 0) {
            password += consonants[Math.floor(Math.random() * consonants.length)];
        } else {
            password += vowels[Math.floor(Math.random() * vowels.length)];
        }
    }
    
    if (Math.random() < 0.5) {
        password = password.charAt(0).toUpperCase() + password.slice(1);
    }
    
    if (Math.random() < 0.7) {
        const digit = Math.floor(Math.random() * 10);
        const position = Math.floor(Math.random() * (password.length + 1));
        password = password.slice(0, position) + digit + password.slice(position);
    }
    
    return password;
}

function generateStrongPassword(length = 16, useUpper = true, useLower = true,
    useDigits = true, useSpecial = true, pattern = 'random') {
    
    if (pattern === 'memorable') {
        let wordCount;
        if (length <= 12) wordCount = 2;
        else if (length <= 18) wordCount = 3;
        else wordCount = 4;
        
        return generateMemorablePassword(wordCount, useUpper, useDigits, useSpecial);
    } else if (pattern === 'pronounceable') {
        return generatePronounceablePassword(length);
    } else if (pattern === 'pin') {
        let pin = '';
        for (let i = 0; i < length; i++) {
            pin += Math.floor(Math.random() * 10);
        }
        return pin;
    } else {
        let charSet = "";
        if (useLower) charSet += "abcdefghijklmnopqrstuvwxyz";
        if (useUpper) charSet += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (useDigits) charSet += "0123456789";
        if (useSpecial) charSet += "!@#$%^&*()_+-=[]{}|;:,.<>?";
        
        if (charSet === "") charSet = "abcdefghijklmnopqrstuvwxyz";
        
        let password = "";
        for (let i = 0; i < length; ++i) {
            password += charSet.charAt(Math.floor(Math.random() * charSet.length));
        }
        
        return password;
    }
}

// Функции для работы с интерфейсом
function updatePasswordStrength(password) {
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');
    
    if (!password) {
        strengthFill.style.width = '0%';
        strengthFill.style.background = 'var(--border-color)';
        strengthText.textContent = 'Введите пароль для анализа';
        strengthText.style.color = 'var(--text-secondary)';
        return;
    }
    
    const analyzer = new PasswordSecurity(password);
    analyzer.analyzePassword();
    const score = analyzer.getScore();
    
    let width, color, text;
    
    if (score >= 8) {
        width = '100%';
        color = 'var(--success-color)';
        text = 'Отличный пароль!';
    } else if (score >= 6) {
        width = '70%';
        color = 'var(--info-color)';
        text = 'Хороший пароль';
    } else if (score >= 4) {
        width = '40%';
        color = 'var(--warning-color)';
        text = 'Средний пароль';
    } else {
        width = '20%';
        color = 'var(--danger-color)';
        text = 'Слабый пароль';
    }
    
    strengthFill.style.width = width;
    strengthFill.style.background = color;
    strengthText.textContent = text;
    strengthText.style.color = color;
}

function displayResults(analyzer, password) {
    const result = analyzer.analyzePassword();
    
    appState.addCheck(password, result);
    
    const score = result.score;
    const scoreDisplay = document.getElementById('score-display');
    
    document.getElementById('length-display').textContent = result.length;
    document.getElementById('entropy-display').textContent = result.entropy.toFixed(1);
    document.getElementById('char-types').textContent = result.charTypes;
    
    scoreDisplay.className = 'score-display';
    if (score >= 8) {
        scoreDisplay.classList.add('score-excellent');
        scoreDisplay.textContent = `${score}/10 - ОТЛИЧНО`;
    } else if (score >= 6) {
        scoreDisplay.classList.add('score-good');
        scoreDisplay.textContent = `${score}/10 - ХОРОШО`;
    } else if (score >= 4) {
        scoreDisplay.classList.add('score-medium');
        scoreDisplay.textContent = `${score}/10 - СРЕДНЕ`;
    } else {
        scoreDisplay.classList.add('score-weak');
        scoreDisplay.textContent = `${score}/10 - СЛАБО`;
    }
    
    const weaknessList = document.getElementById('weakness-list');
    weaknessList.innerHTML = '';
    
    if (analyzer.weaknesses.length > 0) {
        document.getElementById('weaknesses').classList.remove('hidden');
        analyzer.weaknesses.forEach(weakness => {
            const li = document.createElement('li');
            li.innerHTML = `<i>⚠️</i> ${weakness}`;
            weaknessList.appendChild(li);
        });
    } else {
        document.getElementById('weaknesses').classList.add('hidden');
    }
    
    const suggestionList = document.getElementById('suggestion-list');
    suggestionList.innerHTML = '';
    
    if (Object.keys(analyzer.suggestions).length > 0) {
        document.getElementById('suggestions').classList.remove('hidden');
        for (const key in analyzer.suggestions) {
            const li = document.createElement('li');
            li.innerHTML = `<i>💡</i> ${analyzer.suggestions[key]}`;
            suggestionList.appendChild(li);
        }
    } else {
        document.getElementById('suggestions').classList.add('hidden');
    }
    
    const crackingTime = analyzer.estimateCrackingTime();
    document.getElementById('time-display').textContent = crackingTime.time;
    
    document.getElementById('check-results').classList.remove('hidden');
}

// Инициализация приложения
const appState = new AppState();

// Обработчики событий
document.addEventListener('DOMContentLoaded', function() {
    ThemeManager.init();
    appState.updateStats();
    appState.renderHistory();
    
    document.getElementById('length-value').textContent = 
        document.getElementById('password-length').value + ' символов';
});

// Основные обработчики
document.getElementById('check-btn').addEventListener('click', function() {
    const password = document.getElementById('password-input').value;
    
    if (!password) {
        NotificationManager.show('Пожалуйста, введите пароль для проверки', 'error');
        return;
    }
    
    const analyzer = new PasswordSecurity(password);
    displayResults(analyzer, password);
});

document.getElementById('generate-btn').addEventListener('click', function() {
    const length = parseInt(document.getElementById('password-length').value) || 16;
    const useUpper = document.getElementById('use-upper').checked;
    const useLower = document.getElementById('use-lower').checked;
    const useDigits = document.getElementById('use-digits').checked;
    const useSpecial = document.getElementById('use-special').checked;
    const pattern = document.getElementById('password-pattern').value;
    
    const password = generateStrongPassword(
        length, useUpper, useLower, useDigits, useSpecial, pattern
    );
    
    document.getElementById('password-display').textContent = password;
    document.getElementById('generated-password').classList.remove('hidden');
    document.getElementById('multiple-passwords').classList.add('hidden');
});

document.getElementById('generate-multiple').addEventListener('click', function() {
    const length = parseInt(document.getElementById('password-length').value) || 16;
    const useUpper = document.getElementById('use-upper').checked;
    const useLower = document.getElementById('use-lower').checked;
    const useDigits = document.getElementById('use-digits').checked;
    const useSpecial = document.getElementById('use-special').checked;
    const pattern = document.getElementById('password-pattern').value;
    
    const passwordList = document.getElementById('password-list');
    passwordList.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        const password = generateStrongPassword(
            length, useUpper, useLower, useDigits, useSpecial, pattern
        );
        
        const passwordDiv = document.createElement('div');
        passwordDiv.className = 'password-display';
        passwordDiv.style.margin = '10px 0';
        passwordDiv.style.fontSize = '1.1rem';
        passwordDiv.textContent = password;
        
        passwordList.appendChild(passwordDiv);
    }
    
    document.getElementById('multiple-passwords').classList.remove('hidden');
    document.getElementById('generated-password').classList.add('hidden');
});

document.getElementById('copy-btn').addEventListener('click', function() {
    const password = document.getElementById('password-display').textContent;
    navigator.clipboard.writeText(password).then(function() {
        const btn = document.getElementById('copy-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i>✅</i> Скопировано!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
        NotificationManager.show('Пароль скопирован в буфер обмена', 'success');
    }).catch(function() {
        const textArea = document.createElement('textarea');
        textArea.value = password;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        const btn = document.getElementById('copy-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i>✅</i> Скопировано!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
        NotificationManager.show('Пароль скопирован в буфер обмена', 'success');
    });
});

document.getElementById('analyze-generated-btn').addEventListener('click', function() {
    const password = document.getElementById('password-display').textContent;
    document.getElementById('password-input').value = password;
    switchTab('check');
    const analyzer = new PasswordSecurity(password);
    displayResults(analyzer, password);
    updatePasswordStrength(password);
});

document.getElementById('clear-history').addEventListener('click', function() {
    if (confirm('Вы уверены, что хотите очистить историю проверок?')) {
        appState.clearHistory();
    }
});

document.getElementById('export-data').addEventListener('click', function() {
    document.getElementById('export-modal').classList.remove('hidden');
});

document.getElementById('toggle-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('password-input');
    const toggleBtn = document.getElementById('toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.innerHTML = '🔒';
    } else {
        passwordInput.type = 'password';
        toggleBtn.innerHTML = '👁️';
    }
});

document.getElementById('password-length').addEventListener('input', function() {
    document.getElementById('length-value').textContent = this.value + ' символов';
});

document.getElementById('password-input').addEventListener('input', function() {
    updatePasswordStrength(this.value);
    document.getElementById('check-results').classList.add('hidden');
});

// Обработчики экспорта
document.getElementById('export-json').addEventListener('click', function() {
    appState.exportData('json');
    document.getElementById('export-modal').classList.add('hidden');
});

document.getElementById('export-csv').addEventListener('click', function() {
    appState.exportData('csv');
    document.getElementById('export-modal').classList.add('hidden');
});

document.getElementById('export-pdf').addEventListener('click', function() {
    appState.exportData('pdf');
    document.getElementById('export-modal').classList.add('hidden');
});

// Обработчики модальных окон
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.modal').classList.add('hidden');
    });
});

// Обработчики быстрых действий
document.getElementById('quick-check').addEventListener('click', function() {
    switchTab('check');
    document.getElementById('password-input').focus();
});

document.getElementById('quick-generate').addEventListener('click', function() {
    switchTab('generate');
    document.getElementById('generate-btn').click();
});

document.getElementById('settings-btn').addEventListener('click', function() {
    showThemeSettingsModal();
});

// Переключение вкладок
function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName + '-tab').classList.add('active');
    
    if (tabName === 'history') {
        appState.renderHistory();
    }
}

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        switchTab(tabId);
    });
});

// Обработчики темы
document.getElementById('theme-toggle').addEventListener('click', function() {
    ThemeManager.toggleTheme();
});

document.getElementById('theme-toggle').addEventListener('dblclick', function(e) {
    e.preventDefault();
    ThemeManager.setAutoMode();
});

document.getElementById('theme-toggle').addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showThemeContextMenu(e);
});

// Контекстное меню темы
function showThemeContextMenu(event) {
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.style.cssText = `
        position: fixed;
        top: ${event.clientY}px;
        left: ${event.clientX}px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 10px;
        padding: 10px;
        box-shadow: 0 8px 25px var(--shadow-color);
        z-index: 10000;
        backdrop-filter: var(--backdrop-blur);
    `;
    
    contextMenu.innerHTML = `
        <div class="context-item" data-action="light">☀️ Светлая тема</div>
        <div class="context-item" data-action="dark">🌙 Темная тема</div>
        <div class="context-item" data-action="auto">🌗 Авто-режим</div>
        <hr style="margin: 5px 0; border-color: var(--border-color);">
        <div class="context-item" data-action="settings">⚙️ Настройки тем</div>
    `;
    
    document.body.appendChild(contextMenu);
    
    contextMenu.querySelectorAll('.context-item').forEach(item => {
        item.style.cssText = `
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 5px;
            transition: background 0.2s ease;
        `;
        
        item.addEventListener('mouseenter', function() {
            this.style.background = 'var(--bg-hover)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
        });
        
        item.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleThemeAction(action);
            document.body.removeChild(contextMenu);
        });
    });
    
    setTimeout(() => {
        const closeMenu = (e) => {
            if (!contextMenu.contains(e.target)) {
                document.body.removeChild(contextMenu);
                document.removeEventListener('click', closeMenu);
            }
        };
        document.addEventListener('click', closeMenu);
    }, 100);
}

function handleThemeAction(action) {
    switch (action) {
        case 'light':
            ThemeManager.autoMode = false;
            ThemeManager.currentTheme = 'light';
            ThemeManager.applyTheme();
            NotificationManager.show('Установлена светлая тема', 'success');
            break;
        case 'dark':
            ThemeManager.autoMode = false;
            ThemeManager.currentTheme = 'dark';
            ThemeManager.applyTheme();
            NotificationManager.show('Установлена темная тема', 'success');
            break;
        case 'auto':
            ThemeManager.setAutoMode();
            break;
        case 'settings':
            showThemeSettingsModal();
            break;
    }
}

function showThemeSettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: var(--bg-card);
            border-radius: 20px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px var(--shadow-color);
            border: 1px solid var(--border-color);
        ">
            <h2 style="margin-bottom: 20px; color: var(--text-primary);">🎨 Настройки тем</h2>
            
            <div class="form-group">
                <label style="display: flex; justify-content: between; align-items: center;">
                    <span>Автоматическое переключение</span>
                    <input type="checkbox" id="auto-theme-setting" ${ThemeManager.autoMode ? 'checked' : ''}>
                </label>
                <small style="color: var(--text-muted);">Автоматически переключать темы в зависимости от времени суток</small>
            </div>
            
            <div class="theme-previews" style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin: 20px 0;
            ">
                <div class="theme-preview light ${!ThemeManager.autoMode && ThemeManager.currentTheme === 'light' ? 'active' : ''}" 
                     data-theme="light" style="
                    padding: 20px;
                    border-radius: 10px;
                    background: #ffffff;
                    border: 2px solid ${!ThemeManager.autoMode && ThemeManager.currentTheme === 'light' ? '#3498db' : '#e1e8ed'};
                    cursor: pointer;
                    text-align: center;
                ">
                    <div style="font-size: 2rem;">☀️</div>
                    <div style="font-weight: 600; margin-top: 10px;">Светлая</div>
                </div>
                
                <div class="theme-preview dark ${!ThemeManager.autoMode && ThemeManager.currentTheme === 'dark' ? 'active' : ''}" 
                     data-theme="dark" style="
                    padding: 20px;
                    border-radius: 10px;
                    background: #2d2d3a;
                    border: 2px solid ${!ThemeManager.autoMode && ThemeManager.currentTheme === 'dark' ? '#3498db' : '#34495e'};
                    cursor: pointer;
                    text-align: center;
                    color: white;
                ">
                    <div style="font-size: 2rem;">🌙</div>
                    <div style="font-weight: 600; margin-top: 10px;">Темная</div>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                <button class="btn btn-secondary" id="close-theme-settings">Закрыть</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#auto-theme-setting').addEventListener('change', function(e) {
        if (e.target.checked) {
            ThemeManager.setAutoMode();
        } else {
            ThemeManager.autoMode = false;
            ThemeManager.saveThemeSettings();
        }
        updateThemePreviews();
    });
    
    modal.querySelectorAll('.theme-preview').forEach(preview => {
        preview.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            ThemeManager.autoMode = false;
            ThemeManager.currentTheme = theme;
            ThemeManager.applyTheme();
            updateThemePreviews();
            NotificationManager.show(`Установлена ${theme === 'light' ? 'светлая' : 'темная'} тема`, 'success');
        });
    });
    
    modal.querySelector('#close-theme-settings').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    function updateThemePreviews() {
        modal.querySelectorAll('.theme-preview').forEach(preview => {
            const theme = preview.getAttribute('data-theme');
            const isActive = !ThemeManager.autoMode && ThemeManager.currentTheme === theme;
            preview.style.borderColor = isActive ? '#3498db' : 
                                      theme === 'light' ? '#e1e8ed' : '#34495e';
        });
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Сохранение пароля
document.getElementById('save-password').addEventListener('click', function() {
    const password = document.getElementById('password-display').textContent;
    alert('В реальном приложении здесь будет интеграция с менеджером паролей.\n\nСгенерированный пароль:\n' + password);
});