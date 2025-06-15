/**
 * UI Functions and Event Handlers for Blockchain Coffee App
 * ========================================================
 */

import { BlockchainUtils } from './blockchain.js';
import { RadarChartGenerator } from './analyzer.js';

/**
 * UI Manager for handling all interface updates
 */
export class UIManager {
    constructor(blockchain, analyzer, impactCalculator) {
        this.blockchain = blockchain;
        this.analyzer = analyzer;
        this.impactCalculator = impactCalculator;
        this.currentDisplayedBlocks = [];
        
        this.initializeEventListeners();
    }
    
    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        // Search on Enter key for block search
        const blockSearchElement = document.getElementById('blockSearch');
        if (blockSearchElement) {
            blockSearchElement.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.filterBlocks();
                }
            });
        }
        
        // Search on Enter key for coffee search
        const searchIdElement = document.getElementById('searchId');
        if (searchIdElement) {
            searchIdElement.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchCoffee();
                }
            });
        }
        
        // Auto-filter on stage change
        const stageFilterElement = document.getElementById('stageFilter');
        if (stageFilterElement) {
            stageFilterElement.addEventListener('change', () => {
                this.filterBlocks();
            });
        }
        
        // Auto-populate details based on stage
        const addStageElement = document.getElementById('stage');
        if (addStageElement) {
            addStageElement.addEventListener('change', (e) => {
                this.updateDetailPlaceholder(e.target.value);
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+F to focus search
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                const searchElement = document.getElementById('blockSearch');
                if (searchElement) {
                    searchElement.focus();
                }
            }
        });
    }
    
    /**
     * Update placeholder text based on selected stage
     */
    updateDetailPlaceholder(stage) {
        const detailsElement = document.getElementById('details');
        if (!detailsElement || detailsElement.value) return;
        
        const placeholders = {
            'farm': 'เช่น: อาราบิก้า พันธุ์คาตูรา ปลูกในระดับความสูง 1200 เมตร',
            'harvest': 'เช่น: เก็บเกี่ยวด้วยมือ ผลสุก 90% ปริมาณ 150 กิโลกรัม',
            'processing': 'เช่น: Washed Process อุณหภูมิ 25°C เวลาหมัก 24 ชั่วโมง',
            'roasting': 'เช่น: Medium Roast อุณหภูมิ 200°C เวลา 12 นาที',
            'packaging': 'เช่น: ถุงวาล์ว ขนาด 500g วันผลิต วันนี้',
            'distribution': 'เช่น: จัดส่งไปยัง 15 จุดจำหน่าย อุณหภูมิขนส่ง 18°C',
            'retail': 'เช่น: วางจำหน่ายในร้าน ราคา 280 บาท/แพ็ค'
        };
        
        detailsElement.placeholder = placeholders[stage] || 'รายละเอียดเพิ่มเติม';
    }
    
    /**
     * Show alert messages
     */
    showAlert(message, type = 'success') {
        const alertElement = document.getElementById(type + 'Alert');
        if (alertElement) {
            alertElement.textContent = message;
            alertElement.classList.add('show');
            
            setTimeout(() => {
                alertElement.classList.remove('show');
            }, 5000);
        }
    }
    
    /**
     * Update statistics display
     */
    updateStats() {
        const stats = this.blockchain.getStats();
        
        const elements = {
            totalBlocks: document.getElementById('totalBlocks'),
            totalCoffee: document.getElementById('totalCoffee'), 
            totalFarms: document.getElementById('totalFarms')
        };
        
        if (elements.totalBlocks) elements.totalBlocks.textContent = stats.totalBlocks;
        if (elements.totalCoffee) elements.totalCoffee.textContent = stats.totalCoffee;
        if (elements.totalFarms) elements.totalFarms.textContent = stats.totalOperators;
        
        // Update strategic metrics and radar chart
        this.updateRadarChart();
        this.updateImpactOutcomes();
    }
    
    /**
     * Update radar chart with current metrics
     */
    updateRadarChart() {
        try {
            const metrics = this.analyzer.updateAllMetrics();
            const chartData = RadarChartGenerator.calculateRadarCoordinates(metrics);
            const styling = RadarChartGenerator.getRadarStyling(metrics);
            
            // Update polygon
            const polygon = document.getElementById('radarPolygon');
            if (polygon) {
                polygon.setAttribute('points', chartData.polygonPoints);
                polygon.setAttribute('fill', styling.fillColor);
                polygon.setAttribute('stroke', styling.strokeColor);
            }
            
            // Update points
            chartData.coordinates.forEach((coord, index) => {
                const point = document.getElementById(`point${index + 1}`);
                if (point) {
                    point.setAttribute('cx', coord.x);
                    point.setAttribute('cy', coord.y);
                    point.setAttribute('fill', styling.strokeColor);
                }
            });
            
            // Update metric values and styling
            const metricElements = [
                'economicValue', 'trustValue', 'sustainabilityValue', 
                'competitivenessValue', 'futurenessValue', 'ecosystemValue'
            ];
            
            metricElements.forEach((elementId, index) => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.textContent = chartData.values[index] + '%';
                }
            });
            
            // Update metric card styling
            const metricIds = ['metric1', 'metric2', 'metric3', 'metric4', 'metric5', 'metric6'];
            metricIds.forEach((metricId, index) => {
                this.updateMetricStyling(metricId, chartData.values[index]);
            });
            
        } catch (error) {
            console.error('Error updating radar chart:', error);
        }
    }
    
    /**
     * Update metric card styling based on performance
     */
    updateMetricStyling(metricId, value) {
        const element = document.getElementById(metricId);
        if (!element) return;
        
        element.classList.remove('excellent', 'good', 'average');
        
        if (value >= 85) {
            element.classList.add('excellent');
        } else if (value >= 70) {
            element.classList.add('good');
        } else {
            element.classList.add('average');
        }
    }
    
    /**
     * Update impact outcomes dynamically
     */
    updateImpactOutcomes() {
        try {
            const outcomes = this.impactCalculator.getFormattedOutcomes();
            
            const updateElements = {
                'avgPrice': outcomes.avgPrice,
                'farmerIncome': outcomes.farmerIncome,
                'farmersInSystem': outcomes.farmersInSystem,
                'satisfactionScore': outcomes.satisfactionScore,
                'traceabilityTime': outcomes.traceabilityTime,
                'carbonReduction': outcomes.carbonReduction,
                'chemicalReduction': outcomes.chemicalReduction,
                'organicArea': outcomes.organicArea
            };
            
            Object.entries(updateElements).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                }
            });
        } catch (error) {
            console.error('Error updating impact outcomes:', error);
        }
    }
    
    /**
     * Add new record to blockchain
     */
    addToBlockchain() {
        try {
            const formData = this.collectFormData();
            
            if (!this.validateFormData(formData)) {
                this.showAlert('❌ กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
                return;
            }
            
            const coffeeId = BlockchainUtils.generateCoffeeId();
            
            const blockData = {
                coffeeId: coffeeId,
                stage: formData.stage,
                location: formData.location,
                operator: formData.operator,
                details: formData.details,
                quality: formData.quality,
                batchSize: (50 + Math.floor(Math.random() * 200)) + ' kg',
                temperature: (20 + Math.floor(Math.random() * 15)) + '°C',
                humidity: (40 + Math.floor(Math.random() * 30)) + '%',
                isAIGenerated: false
            };
            
            const newBlock = new (await import('./blockchain.js')).Block(
                this.blockchain.chain.length, 
                blockData, 
                ""
            );
            
            this.blockchain.addBlock(newBlock);
            
            // Clear form
            this.clearForm();
            
            this.showAlert('✅ บันทึกข้อมูลเรียบร้อย | รหัส: ' + coffeeId, 'success');
            
            // Update displays
            this.updateBlockchainDisplay();
            this.updateStats();
            
        } catch (error) {
            console.error('Error adding to blockchain:', error);
            this.showAlert('❌ เกิดข้อผิดพลาด: ' + error.message, 'error');
        }
    }
    
    /**
     * Collect form data
     */
    collectFormData() {
        return {
            stage: document.getElementById('stage')?.value,
            location: document.getElementById('location')?.value?.trim(),
            operator: document.getElementById('operator')?.value?.trim(),
            details: document.getElementById('details')?.value?.trim(),
            quality: document.getElementById('quality')?.value
        };
    }
    
    /**
     * Validate form data
     */
    validateFormData(data) {
        return data.location && data.operator && data.stage && data.quality;
    }
    
    /**
     * Clear form inputs
     */
    clearForm() {
        const formElements = ['location', 'operator', 'details'];
        formElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
        });
    }
    
    /**
     * Search coffee history
     */
    searchCoffee() {
        const searchId = document.getElementById('searchId')?.value?.trim();
        if (!searchId) {
            this.showAlert('❌ กรุณาใส่รหัสกาแฟ', 'error');
            return;
        }
        
        const history = this.blockchain.getCoffeeHistory(searchId);
        const coffeeInfo = document.getElementById('coffeeInfo');
        const coffeeDetails = document.getElementById('coffeeDetails');
        
        if (history.length === 0) {
            this.showAlert('❌ ไม่พบข้อมูลกาแฟรหัสนี้', 'error');
            coffeeInfo?.classList.remove('show');
            return;
        }
        
        // Display coffee history
        if (coffeeDetails) {
            coffeeDetails.innerHTML = '';
            history.forEach((block) => {
                const stageDiv = this.createCoffeeStageElement(block);
                coffeeDetails.appendChild(stageDiv);
            });
        }
        
        coffeeInfo?.classList.add('show');
        this.showAlert('✅ พบประวัติกาแฟ ' + history.length + ' รายการ', 'success');
    }
    
    /**
     * Create coffee stage element for display
     */
    createCoffeeStageElement(block) {
        const stageNames = {
            'farm': '🌱 การปลูก',
            'harvest': '🌾 การเก็บเกี่ยว',
            'processing': '⚙️ การแปรรูป',
            'roasting': '🔥 การคั่ว',
            'packaging': '📦 การบรรจุ',
            'distribution': '🚛 การจัดจำหน่าย',
            'retail': '🏪 การขายปลีก'
        };
        
        const stageDiv = document.createElement('div');
        stageDiv.className = 'info-item';
        
        // Add special styling for AI-generated records
        if (block.data.isAIGenerated) {
            stageDiv.style.borderLeftColor = 'var(--success)';
            stageDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span>🤖</span>
                    <strong>${stageNames[block.data.stage] || block.data.stage}</strong>
                    <span class="ai-badge">สร้างโดย AI</span>
                </div>
                📍 สถานที่: ${block.data.location}<br>
                👤 ผู้ดำเนินการ: ${block.data.operator}<br>
                📋 รายละเอียด: ${block.data.details}<br>
                ⭐ คุณภาพ: ${block.data.quality}<br>
                📦 ขนาดแบทช์: ${block.data.batchSize || 'N/A'}<br>
                🌡️ อุณหภูมิ: ${block.data.temperature || 'N/A'}<br>
                💧 ความชื้น: ${block.data.humidity || 'N/A'}<br>
                ⏰ เวลา: ${block.timestamp}
            `;
        } else {
            stageDiv.innerHTML = `
                <strong>${stageNames[block.data.stage] || block.data.stage}</strong><br>
                📍 สถานที่: ${block.data.location}<br>
                👤 ผู้ดำเนินการ: ${block.data.operator}<br>
                📋 รายละเอียด: ${block.data.details}<br>
                ⭐ คุณภาพ: ${block.data.quality}<br>
                📦 ขนาดแบทช์: ${block.data.batchSize || 'N/A'}<br>
                🌡️ อุณหภูมิ: ${block.data.temperature || 'N/A'}<br>
                💧 ความชื้น: ${block.data.humidity || 'N/A'}<br>
                ⏰ เวลา: ${block.timestamp}
            `;
        }
        
        return stageDiv;
    }
    
    /**
     * Search coffee with sample ID
     */
    searchSample(coffeeId) {
        const searchIdElement = document.getElementById('searchId');
        if (searchIdElement) {
            searchIdElement.value = coffeeId;
            this.searchCoffee();
        }
    }
    
    /**
     * Filter blocks based on search criteria
     */
    filterBlocks() {
        const searchQuery = document.getElementById('blockSearch')?.value || '';
        const stageFilter = document.getElementById('stageFilter')?.value || '';
        
        let filteredBlocks = this.blockchain.searchBlocks(searchQuery);
        
        if (stageFilter) {
            filteredBlocks = filteredBlocks.filter(block => block.data.stage === stageFilter);
        }
        
        this.currentDisplayedBlocks = filteredBlocks;
        this.displayBlocks(filteredBlocks);
    }
    
    /**
     * Display blocks in the blockchain explorer
     */
    displayBlocks(blocks) {
        const blocksContainer = document.getElementById('blocks');
        if (!blocksContainer) return;
        
        blocksContainer.innerHTML = '';
        
        if (blocks.length === 0) {
            blocksContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">ไม่พบข้อมูลที่ตรงกับการค้นหา</p>';
            return;
        }
        
        // Show latest blocks first
        const reversedBlocks = [...blocks].reverse();
        
        reversedBlocks.forEach((block) => {
            const blockElement = this.createBlockElement(block);
            blocksContainer.appendChild(blockElement);
        });
    }
    
    /**
     * Create block element for display
     */
    createBlockElement(block) {
        const blockDiv = document.createElement('div');
        blockDiv.className = 'block';
        
        // Add special styling for AI-generated blocks
        if (block.data.isAIGenerated) {
            blockDiv.classList.add('ai-generated');
        }
        
        const stageNames = {
            'farm': '🌱 การปลูก',
            'harvest': '🌾 การเก็บเกี่ยว',
            'processing': '⚙️ การแปรรูป',
            'roasting': '🔥 การคั่ว',
            'packaging': '📦 การบรรจุ',
            'distribution': '🚛 การจัดจำหน่าย',
            'retail': '🏪 การขายปลีก',
            'system': '🏛️ ระบบ'
        };
        
        let blockHeader = `
            <div class="block-header">
                <div class="block-id">BLOCK #${block.index}</div>
                <div class="block-time">${block.timestamp || 'N/A'}</div>
            </div>
        `;
        
        if (block.data.isAIGenerated) {
            blockHeader = `
                <div class="block-header">
                    <div class="block-id">
                        🤖 BLOCK #${block.index} 
                        <span class="ai-badge">AI Generated</span>
                    </div>
                    <div class="block-time">${block.timestamp || 'N/A'}</div>
                </div>
            `;
        }
        
        const blockContent = `
            ${blockHeader}
            <div class="block-data">
                <strong>🏷️ รหัสกาแฟ:</strong> ${block.data.coffeeId || 'N/A'}<br>
                <strong>📋 ขั้นตอน:</strong> ${stageNames[block.data.stage] || block.data.stage}<br>
                <strong>📍 สถานที่:</strong> ${block.data.location || 'N/A'}<br>
                <strong>👤 ผู้ดำเนินการ:</strong> ${block.data.operator || 'N/A'}<br>
                <strong>📝 รายละเอียด:</strong> ${block.data.details || 'N/A'}<br>
                <strong>⭐ คุณภาพ:</strong> ${block.data.quality || 'N/A'}<br>
                ${block.data.batchSize ? '<strong>📦 ขนาดแบทช์:</strong> ' + block.data.batchSize + '<br>' : ''}
                ${block.data.temperature ? '<strong>🌡️ อุณหภูมิ:</strong> ' + block.data.temperature + '<br>' : ''}
                ${block.data.humidity ? '<strong>💧 ความชื้น:</strong> ' + block.data.humidity + '<br>' : ''}
            </div>
            <div class="block-hash">HASH: ${block.hash || 'N/A'}</div>
        `;
        
        blockDiv.innerHTML = blockContent;
        return blockDiv;
    }
    
    /**
     * Update blockchain display
     */
    updateBlockchainDisplay() {
        this.currentDisplayedBlocks = this.blockchain.chain;
        this.displayBlocks(this.currentDisplayedBlocks);
    }
    
    /**
     * Quick filter functions
     */
    quickFilter(term) {
        const blockSearchElement = document.getElementById('blockSearch');
        if (blockSearchElement) {
            blockSearchElement.value = term;
            this.filterBlocks();
        }
    }
    
    /**
     * Clear all filters
     */
    clearFilter() {
        const blockSearchElement = document.getElementById('blockSearch');
        const stageFilterElement = document.getElementById('stageFilter');
        
        if (blockSearchElement) blockSearchElement.value = '';
        if (stageFilterElement) stageFilterElement.value = '';
        
        this.filterBlocks();
    }
    
    /**
     * Add visual effect to new block
     */
    animateNewBlock() {
        setTimeout(() => {
            const blocks = document.querySelectorAll('.block');
            if (blocks.length > 0) {
                const newBlock = blocks[0]; // Latest block is first
                newBlock.style.animation = 'slideIn 0.5s ease, glow 2s ease';
                newBlock.style.transform = 'scale(1.02)';
                
                setTimeout(() => {
                    newBlock.style.transform = 'scale(1)';
                }, 1000);
            }
        }, 100);
    }
    
    /**
     * Initialize sample data with progressive loading
     */
    initializeSampleData(sampleData) {
        this.showAlert('🚀 เริ่มต้นระบบ Blockchain...', 'success');
        
        sampleData.forEach((data, index) => {
            setTimeout(async () => {
                const Block = (await import('./blockchain.js')).Block;
                const block = new Block(this.blockchain.chain.length, data, "");
                this.blockchain.addBlock(block);
                
                // Update display progressively
                this.updateBlockchainDisplay();
                this.updateStats();
                
                if (index === sampleData.length - 1) {
                    this.showAlert('✅ ระบบเริ่มต้นพร้อม ' + (sampleData.length + 1) + ' บล็อก', 'success');
                }
            }, index * 200); // Animation delay
        });
    }
}

/**
 * AI Auto-Update Manager
 */
export class AIUpdateManager {
    constructor(blockchain, uiManager, sampleDataGenerator) {
        this.blockchain = blockchain;
        this.uiManager = uiManager;
        this.sampleDataGenerator = sampleDataGenerator;
        this.updateInterval = null;
        this.isRunning = false;
    }
    
    /**
     * Start AI auto-update system
     */
    start(intervalMs = 30000) { // Default 30 seconds
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.updateInterval = setInterval(() => {
            this.generateAIUpdate();
        }, intervalMs);
        
        console.log('AI auto-update started');
    }
    
    /**
     * Stop AI auto-update system
     */
    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        this.isRunning = false;
        console.log('AI auto-update stopped');
    }
    
    /**
     * Generate AI update
     */
    async generateAIUpdate() {
        try {
            const aiRecord = this.sampleDataGenerator.generateAIRecord();
            const Block = (await import('./blockchain.js')).Block;
            const newBlock = new Block(this.blockchain.chain.length, aiRecord, "");
            this.blockchain.addBlock(newBlock);
            
            // Update UI
            this.uiManager.updateBlockchainDisplay();
            this.uiManager.updateStats();
            this.uiManager.animateNewBlock();
            
            // Show notification
            this.uiManager.showAlert(
                `🤖 AI อัปเดต: เพิ่มข้อมูล ${aiRecord.coffeeId} (${aiRecord.stage})`, 
                'success'
            );
            
        } catch (error) {
            console.error('Error in AI auto-update:', error);
        }
    }
    
    /**
     * Get update status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            interval: this.updateInterval ? 30000 : null // Default interval
        };
    }
}

/**
 * Form Validation Utilities
 */
export class FormValidator {
    /**
     * Validate coffee ID format
     */
    static validateCoffeeId(coffeeId) {
        const pattern = /^CR\d{3,6}$/;
        return pattern.test(coffeeId);
    }
    
    /**
     * Validate location input
     */
    static validateLocation(location) {
        return location && location.trim().length >= 3;
    }
    
    /**
     * Validate operator name
     */
    static validateOperator(operator) {
        return operator && operator.trim().length >= 2;
    }
    
    /**
     * Validate batch size format
     */
    static validateBatchSize(batchSize) {
        const pattern = /^\d+(\.\d+)?\s*(kg|กก\.?)$/i;
        return pattern.test(batchSize);
    }
    
    /**
     * Validate temperature format
     */
    static validateTemperature(temperature) {
        const pattern = /^\d+(\.\d+)?°?C$/i;
        return pattern.test(temperature);
    }
    
    /**
     * Get validation error messages in Thai
     */
    static getErrorMessage(field, value) {
        const messages = {
            coffeeId: 'รหัสกาแฟต้องเป็นรูปแบบ CR001-CR999999',
            location: 'สถานที่ต้องมีอย่างน้อย 3 ตัวอักษร',
            operator: 'ชื่อผู้ดำเนินการต้องมีอย่างน้อย 2 ตัวอักษร',
            batchSize: 'ขนาดแบทช์ต้องเป็นตัวเลขตามด้วย kg',
            temperature: 'อุณหภูมิต้องเป็นตัวเลขตามด้วย °C'
        };
        
        return messages[field] || 'ข้อมูลไม่ถูกต้อง';
    }
}

/**
 * Animation Controller
 */
export class AnimationController {
    /**
     * Animate element entrance
     */
    static slideIn(element, duration = 500) {
        element.style.animation = `slideIn ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }
    
    /**
     * Animate element highlight
     */
    static highlight(element, duration = 2000) {
        element.style.animation = `glow ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }
    
    /**
     * Animate stats counter
     */
    static animateCounter(element, targetValue, duration = 1000) {
        const startValue = parseInt(element.textContent) || 0;
        const increment = (targetValue - startValue) / (duration / 16);
        
        let currentValue = startValue;
        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            
            element.textContent = Math.round(currentValue);
        }, 16);
    }
    
    /**
     * Pulse animation for important updates
     */
    static pulse(element, count = 3) {
        element.style.animation = `pulse 0.5s ease ${count}`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, count * 500);
    }
}

/**
 * Export functions for global access
 */
export const UIFunctions = {
    showAlert: (message, type) => {
        const alertElement = document.getElementById(type + 'Alert');
        if (alertElement) {
            alertElement.textContent = message;
            alertElement.classList.add('show');
            setTimeout(() => alertElement.classList.remove('show'), 5000);
        }
    },
    
    updateProgressBar: (percentage) => {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
    },
    
    scrollToElement: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
};
