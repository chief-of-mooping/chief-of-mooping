/**
 * Main Application Controller for Chiang Rai Coffee Blockchain
 * ===========================================================
 */

// Import all modules
import { Blockchain, Block, SampleDataGenerator } from './blockchain.js';
import { StrategicAnalyzer, ImpactCalculator } from './analyzer.js';
import { UIManager, AIUpdateManager } from './ui.js';

// Make Block class globally available for other modules
window.Block = Block;

/**
 * Main Application Class
 */
class ChiangRaiCoffeeApp {
    constructor() {
        // Core blockchain components
        this.blockchain = null;
        this.analyzer = null;
        this.impactCalculator = null;
        this.sampleDataGenerator = null;
        
        // UI components
        this.uiManager = null;
        this.aiUpdateManager = null;
        
        // App state
        this.isInitialized = false;
        this.autoUpdateEnabled = true;
        
        // Bind methods for global access
        this.bindGlobalMethods();
    }
    
    /**
     * Initialize the entire application
     */
    async initialize() {
        try {
            console.log('🚀 Initializing Chiang Rai Coffee Blockchain App...');
            
            // Initialize core components
            this.initializeCore();
            
            // Initialize UI
            this.initializeUI();
            
            // Load sample data
            await this.loadSampleData();
            
            // Start AI auto-update system
            this.startAISystem();
            
            this.isInitialized = true;
            console.log('✅ Application initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing application:', error);
            this.handleInitializationError(error);
        }
    }
    
    /**
     * Initialize core blockchain components
     */
    initializeCore() {
        // Create blockchain instance
        this.blockchain = new Blockchain();
        
        // Create analyzer and calculator
        this.analyzer = new StrategicAnalyzer(this.blockchain);
        this.impactCalculator = new ImpactCalculator(this.blockchain);
        
        // Create sample data generator
        this.sampleDataGenerator = new SampleDataGenerator();
        
        console.log('Core components initialized');
    }
    
    /**
     * Initialize UI components
     */
    initializeUI() {
        // Create UI manager
        this.uiManager = new UIManager(
            this.blockchain, 
            this.analyzer, 
            this.impactCalculator
        );
        
        // Create AI update manager
        this.aiUpdateManager = new AIUpdateManager(
            this.blockchain,
            this.uiManager,
            this.sampleDataGenerator
        );
        
        console.log('UI components initialized');
    }
    
    /**
     * Load sample data with progressive animation
     */
    async loadSampleData() {
        try {
            const sampleData = this.sampleDataGenerator.generateSampleData(20);
            
            // Use UI manager to handle progressive loading
            this.uiManager.initializeSampleData(sampleData);
            
            console.log(`Generated ${sampleData.length} sample records`);
            
        } catch (error) {
            console.error('Error loading sample data:', error);
            this.uiManager.showAlert('⚠️ เริ่มต้นระบบด้วยข้อมูลพื้นฐาน', 'error');
        }
    }
    
    /**
     * Start AI auto-update system
     */
    startAISystem() {
        if (!this.autoUpdateEnabled) return;
        
        setTimeout(() => {
            this.aiUpdateManager.start(25000); // 25 seconds interval
            this.uiManager.showAlert('🤖 ระบบอัปเดตอัตโนมัติ AI เริ่มทำงานแล้ว', 'success');
        }, 5000); // Start after 5 seconds
    }
    
    /**
     * Handle initialization errors
     */
    handleInitializationError(error) {
        const fallbackMessage = '❌ เกิดข้อผิดพลาดในการเริ่มต้นระบบ: ' + error.message;
        
        // Try to show error in UI if possible
        if (this.uiManager) {
            this.uiManager.showAlert(fallbackMessage, 'error');
        } else {
            // Fallback to console and basic DOM manipulation
            console.error(fallbackMessage);
            this.showBasicAlert(fallbackMessage);
        }
    }
    
    /**
     * Basic alert for critical errors
     */
    showBasicAlert(message) {
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(229, 62, 62, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 9999;
            font-family: 'Kanit', sans-serif;
        `;
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 5000);
    }
    
    /**
     * Bind methods for global access (for onclick handlers)
     */
    bindGlobalMethods() {
        // Make functions globally available for HTML onclick handlers
        window.addToBlockchain = () => this.uiManager?.addToBlockchain();
        window.searchCoffee = () => this.uiManager?.searchCoffee();
        window.searchSample = (id) => this.uiManager?.searchSample(id);
        window.filterBlocks = () => this.uiManager?.filterBlocks();
        window.quickFilter = (term) => this.uiManager?.quickFilter(term);
        window.clearFilter = () => this.uiManager?.clearFilter();
        
        // Debug functions
        window.getBlockchainStats = () => this.blockchain?.getStats();
        window.getAnalyzerMetrics = () => this.analyzer?.updateAllMetrics();
        window.exportBlockchainData = () => this.blockchain?.exportData();
        
        console.log('Global methods bound successfully');
    }
    
    /**
     * Get application status
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            blockchainStats: this.blockchain?.getStats(),
            aiSystemStatus: this.aiUpdateManager?.getStatus(),
            autoUpdateEnabled: this.autoUpdateEnabled
        };
    }
    
    /**
     * Toggle AI auto-update system
     */
    toggleAISystem() {
        if (this.aiUpdateManager?.getStatus().isRunning) {
            this.aiUpdateManager.stop();
            this.autoUpdateEnabled = false;
            this.uiManager?.showAlert('⏸️ ระบบ AI หยุดทำงานชั่วคราว', 'info');
        } else {
            this.aiUpdateManager?.start();
            this.autoUpdateEnabled = true;
            this.uiManager?.showAlert('▶️ ระบบ AI เริ่มทำงานอีกครั้ง', 'success');
        }
    }
    
    /**
     * Reset blockchain data
     */
    resetBlockchain() {
        if (confirm('คุณต้องการรีเซ็ตข้อมูล Blockchain ทั้งหมดหรือไม่?')) {
            try {
                // Stop AI system
                this.aiUpdateManager?.stop();
                
                // Reinitialize blockchain
                this.blockchain = new Blockchain();
                this.analyzer = new StrategicAnalyzer(this.blockchain);
                this.impactCalculator = new ImpactCalculator(this.blockchain);
                
                // Update UI manager references
                this.uiManager.blockchain = this.blockchain;
                this.uiManager.analyzer = this.analyzer;
                this.uiManager.impactCalculator = this.impactCalculator;
                
                // Reload sample data
                this.loadSampleData();
                
                // Restart AI system
                setTimeout(() => {
                    this.startAISystem();
                }, 3000);
                
                this.uiManager.showAlert('🔄 รีเซ็ตข้อมูลเรียบร้อย', 'success');
                
            } catch (error) {
                console.error('Error resetting blockchain:', error);
                this.uiManager?.showAlert('❌ เกิดข้อผิดพลาดในการรีเซ็ต', 'error');
            }
        }
    }
    
    /**
     * Export application data
     */
    exportData() {
        try {
            const exportData = {
                blockchain: this.blockchain.exportData(),
                analysis: this.analyzer.exportReport(),
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `chiang-rai-coffee-blockchain-${Date.now()}.json`;
            link.click();
            
            this.uiManager?.showAlert('📥 ส่งออกข้อมูลเรียบร้อย', 'success');
            
        } catch (error) {
            console.error('Error exporting data:', error);
            this.uiManager?.showAlert('❌ เกิดข้อผิดพลาดในการส่งออกข้อมูล', 'error');
        }
    }
    
    /**
     * Check blockchain integrity
     */
    validateBlockchain() {
        try {
            const isValid = this.blockchain.isChainValid();
            const stats = this.blockchain.getStats();
            
            if (isValid) {
                this.uiManager?.showAlert(`✅ Blockchain ถูกต้อง (${stats.totalBlocks} บล็อก)`, 'success');
            } else {
                this.uiManager?.showAlert('❌ พบความผิดพลาดใน Blockchain', 'error');
            }
            
            return isValid;
            
        } catch (error) {
            console.error('Error validating blockchain:', error);
            this.uiManager?.showAlert('❌ เกิดข้อผิดพลาดในการตรวจสอบ', 'error');
            return false;
        }
    }
    
    /**
     * Performance monitoring
     */
    getPerformanceMetrics() {
        return {
            blockchainSize: this.blockchain?.chain.length || 0,
            coffeeRecords: this.blockchain?.coffeeRecords.size || 0,
            uniqueOperators: this.blockchain?.operators.size || 0,
            uniqueLocations: this.blockchain?.locations.size || 0,
            memoryUsage: this.getMemoryUsage(),
            lastUpdate: new Date().toISOString()
        };
    }
    
    /**
     * Get memory usage estimate
     */
    getMemoryUsage() {
        try {
            if (performance && performance.memory) {
                return {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + ' MB',
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + ' MB'
                };
            }
            return 'ไม่สามารถตรวจสอบได้';
        } catch (error) {
            return 'ไม่รองรับ';
        }
    }
}

/**
 * Application lifecycle management
 */
class AppLifecycle {
    static app = null;
    
    /**
     * Start the application
     */
    static async start() {
        console.log('🌟 Starting Chiang Rai Coffee Blockchain Application...');
        
        try {
            // Create app instance
            this.app = new ChiangRaiCoffeeApp();
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.app.initialize();
                });
            } else {
                // DOM is already ready
                setTimeout(() => {
                    this.app.initialize();
                }, 100);
            }
            
            // Bind app to window for debugging
            window.chiangRaiApp = this.app;
            
            // Add global utility functions
            this.bindUtilityFunctions();
            
            console.log('Application startup completed');
            
        } catch (error) {
            console.error('Failed to start application:', error);
            this.handleStartupError(error);
        }
    }
    
    /**
     * Handle startup errors
     */
    static handleStartupError(error) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            font-family: 'Kanit', sans-serif;
            text-align: center;
            padding: 2rem;
        `;
        
        errorDiv.innerHTML = `
            <div>
                <h2>⚠️ เกิดข้อผิดพลาดในการเริ่มต้นระบบ</h2>
                <p>กรุณารีโหลดหน้าเว็บใหม่</p>
                <p style="font-size: 0.8rem; margin-top: 1rem;">
                    Error: ${error.message}
                </p>
                <button onclick="location.reload()" style="
                    background: #3182ce;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    margin-top: 1rem;
                    cursor: pointer;
                ">รีโหลดหน้าเว็บ</button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
    }
    
    /**
     * Bind additional utility functions
     */
    static bindUtilityFunctions() {
        // Development and debugging functions
        window.appStatus = () => this.app?.getStatus();
        window.toggleAI = () => this.app?.toggleAISystem();
        window.resetApp = () => this.app?.resetBlockchain();
        window.exportData = () => this.app?.exportData();
        window.validateChain = () => this.app?.validateBlockchain();
        window.getPerformance = () => this.app?.getPerformanceMetrics();
        
        // Utility functions for external access
        window.addCoffeeRecord = (data) => {
            if (this.app && this.app.isInitialized) {
                try {
                    // Use the globally available Block class
                    const block = new window.Block(
                        this.app.blockchain.chain.length,
                        data,
                        ""
                    );
                    this.app.blockchain.addBlock(block);
                    this.app.uiManager.updateBlockchainDisplay();
                    this.app.uiManager.updateStats();
                    return true;
                } catch (error) {
                    console.error('Error adding coffee record:', error);
                    return false;
                }
            }
            return false;
        };
        
        // Search functions
        window.findCoffee = (coffeeId) => {
            return this.app?.blockchain?.getCoffeeHistory(coffeeId) || [];
        };
        
        window.searchByOperator = (operator) => {
            return this.app?.blockchain?.chain.filter(block => 
                block.data.operator && 
                block.data.operator.toLowerCase().includes(operator.toLowerCase())
            ) || [];
        };
        
        window.searchByLocation = (location) => {
            return this.app?.blockchain?.chain.filter(block => 
                block.data.location && 
                block.data.location.toLowerCase().includes(location.toLowerCase())
            ) || [];
        };
        
        console.log('Utility functions bound successfully');
    }
    
    /**
     * Stop the application
     */
    static stop() {
        if (this.app) {
            this.app.aiUpdateManager?.stop();
            console.log('Application stopped');
        }
    }
    
    /**
     * Get application instance
     */
    static getInstance() {
        return this.app;
    }
}

/**
 * Error Handling and Logging
 */
class ErrorHandler {
    static logs = [];
    
    /**
     * Initialize error handling
     */
    static initialize() {
        // Catch unhandled errors
        window.addEventListener('error', (event) => {
            this.logError('JavaScript Error', event.error);
        });
        
        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', event.reason);
        });
        
        console.log('Error handling initialized');
    }
    
    /**
     * Log error with context
     */
    static logError(type, error) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            type: type,
            message: error?.message || String(error),
            stack: error?.stack,
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        this.logs.push(logEntry);
        console.error(`[${type}]`, error);
        
        // Keep only last 50 errors
        if (this.logs.length > 50) {
            this.logs = this.logs.slice(-50);
        }
        
        // Try to show user-friendly error if app is available
        const app = AppLifecycle.getInstance();
        if (app && app.uiManager) {
            app.uiManager.showAlert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 'error');
        }
    }
    
    /**
     * Get error logs
     */
    static getLogs() {
        return this.logs;
    }
    
    /**
     * Clear error logs
     */
    static clearLogs() {
        this.logs = [];
    }
    
    /**
     * Export error logs
     */
    static exportLogs() {
        const logData = {
            timestamp: new Date().toISOString(),
            logs: this.logs,
            appStatus: AppLifecycle.getInstance()?.getStatus()
        };
        
        const dataStr = JSON.stringify(logData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `error-logs-${Date.now()}.json`;
        link.click();
    }
}

/**
 * Performance Monitor
 */
class PerformanceMonitor {
    static metrics = {
        loadTime: null,
        initTime: null,
        renderTime: null
    };
    
    /**
     * Start monitoring
     */
    static start() {
        // Record page load time
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now();
            console.log(`Page loaded in ${this.metrics.loadTime.toFixed(2)}ms`);
        });
        
        // Monitor DOM content loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.metrics.renderTime = performance.now();
            console.log(`DOM rendered in ${this.metrics.renderTime.toFixed(2)}ms`);
        });
    }
    
    /**
     * Record initialization time
     */
    static recordInitTime() {
        this.metrics.initTime = performance.now();
        console.log(`App initialized in ${this.metrics.initTime.toFixed(2)}ms`);
    }
    
    /**
     * Get performance summary
     */
    static getSummary() {
        return {
            ...this.metrics,
            memoryUsage: this.getMemoryInfo(),
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Get memory information
     */
    static getMemoryInfo() {
        if (performance && performance.memory) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            };
        }
        return null;
    }
}

/**
 * Configuration and Constants
 */
const AppConfig = {
    // Application settings
    APP_NAME: 'Chiang Rai Coffee Blockchain',
    VERSION: '1.0.0',
    
    // Blockchain settings
    DIFFICULTY: 1,
    AUTO_UPDATE_INTERVAL: 25000, // 25 seconds
    
    // UI settings
    ANIMATION_DURATION: 500,
    ALERT_DURATION: 5000,
    BLOCK_LOAD_DELAY: 200,
    
    // Data limits
    MAX_BLOCKS_DISPLAY: 100,
    MAX_SEARCH_RESULTS: 50,
    MAX_ERROR_LOGS: 50,
    
    // Features
    FEATURES: {
        AI_UPDATES: true,
        REAL_TIME_ANALYSIS: true,
        DATA_EXPORT: true,
        PERFORMANCE_MONITORING: true
    }
};

/**
 * Application Entry Point
 */
(function initializeApp() {
    console.log(`🌟 ${AppConfig.APP_NAME} v${AppConfig.VERSION}`);
    console.log('Starting initialization sequence...');
    
    // Initialize error handling
    ErrorHandler.initialize();
    
    // Start performance monitoring
    PerformanceMonitor.start();
    
    // Start the application
    AppLifecycle.start();
    
    // Log successful initialization
    console.log('✅ Application entry point completed');
})();

// Export for module systems
export default ChiangRaiCoffeeApp;
export { AppLifecycle, ErrorHandler, PerformanceMonitor, AppConfig };
