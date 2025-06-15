/**
 * Main Application Controller for Chiang Rai Coffee Blockchain
 * ===========================================================
 */

import { Blockchain, Block, SampleDataGenerator } from './blockchain.js';
import { StrategicAnalyzer, ImpactCalculator } from './analyzer.js';
import { UIManager, AIUpdateManager } from './ui.js';

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
            
            // Bind global methods first
            this.bindGlobalMethods();
            
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
        
        console.log('✅ Core components initialized');
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
        
        console.log('✅ UI components initialized');
    }
    
    /**
     * Bind methods for global access (CRITICAL: ทำก่อน loadSampleData)
     */
    bindGlobalMethods() {
        // Make app instance globally available
        window.app = this;
        
        // Make functions globally available for HTML onclick handlers
        window.addToBlockchain = () => {
            if (this.uiManager) {
                this.uiManager.addToBlockchain();
            } else {
                console.error('UIManager not initialized');
            }
        };
        
        window.searchCoffee = () => {
            if (this.uiManager) {
                this.uiManager.searchCoffee();
            } else {
                console.error('UIManager not initialized');
            }
        };
        
        window.searchSample = (id) => {
            if (this.uiManager) {
                this.uiManager.searchSample(id);
            } else {
                console.error('UIManager not initialized');
            }
        };
        
        window.filterBlocks = () => {
            if (this.uiManager) {
                this.uiManager.filterBlocks();
            } else {
                console.error('UIManager not initialized');
            }
        };
        
        window.quickFilter = (term) => {
            if (this.uiManager) {
                this.uiManager.quickFilter(term);
            } else {
                console.error('UIManager not initialized');
            }
        };
        
        window.clearFilter = () => {
            if (this.uiManager) {
                this.uiManager.clearFilter();
            } else {
                console.error('UIManager not initialized');
            }
        };
        
        // Debug functions
        window.getBlockchainStats = () => this.blockchain?.getStats();
        window.getAnalyzerMetrics = () => this.analyzer?.updateAllMetrics();
        window.exportBlockchainData = () => this.blockchain?.exportData();
        
        console.log('✅ Global methods bound successfully');
    }
    
    /**
     * Load sample data with progressive animation
     */
    async loadSampleData() {
        try {
            console.log('📊 Starting sample data generation...');
            const sampleData = this.sampleDataGenerator.generateSampleData(20);
            console.log('📊 Generated sample data:', sampleData.length, 'records');
            
            // Show loading message
            if (this.uiManager) {
                this.uiManager.showAlert('🚀 เริ่มต้นระบบ Blockchain...', 'success');
            }
            
            // Load sample data progressively
            for (let i = 0; i < sampleData.length; i++) {
                const data = sampleData[i];
                
                // Add delay for animation
                await new Promise(resolve => setTimeout(resolve, 100));
                
                try {
                    const block = new Block(this.blockchain.chain.length, data, "");
                    this.blockchain.addBlock(block);
                    
                    // Update UI progressively
                    if (this.uiManager) {
                        this.uiManager.updateBlockchainDisplay();
                        this.uiManager.updateStats();
                    }
                    
                    console.log(`✅ Added block ${i + 1}/${sampleData.length}: ${data.coffeeId} (${data.stage})`);
                    
                } catch (blockError) {
                    console.error(`❌ Error adding block ${i + 1}:`, blockError);
                }
            }
            
            // Show completion message
            if (this.uiManager) {
                this.uiManager.showAlert(`✅ ระบบเริ่มต้นพร้อม ${sampleData.length + 1} บล็อก`, 'success');
            }
            
            console.log('✅ Sample data loaded successfully');
            
        } catch (error) {
            console.error('❌ Error loading sample data:', error);
            if (this.uiManager) {
                this.uiManager.showAlert('⚠️ เริ่มต้นระบบด้วยข้อมูลพื้นฐาน', 'error');
            }
        }
    }
    
    /**
     * Start AI auto-update system
     */
    startAISystem() {
        if (!this.autoUpdateEnabled) return;
        
        setTimeout(() => {
            if (this.aiUpdateManager) {
                this.aiUpdateManager.start(25000); // 25 seconds interval
                if (this.uiManager) {
                    this.uiManager.showAlert('🤖 ระบบอัปเดตอัตโนมัติ AI เริ่มทำงานแล้ว', 'success');
                }
            }
        }, 3000); // Start after 3 seconds
    }
    
    /**
     * Handle initialization errors
     */
    handleInitializationError(error) {
        const fallbackMessage = '❌ เกิดข้อผิดพลาดในการเริ่มต้นระบบ: ' + error.message;
        
        console.error(fallbackMessage);
        
        // Try to show error in UI if possible
        if (this.uiManager) {
            this.uiManager.showAlert(fallbackMessage, 'error');
        } else {
            // Fallback to basic DOM manipulation
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
            if (document.body.contains(alertDiv)) {
                document.body.removeChild(alertDiv);
            }
        }, 5000);
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
                document.addEventListener('DOMContentLoaded', async () => {
                    await this.app.initialize();
                });
            } else {
                // DOM is already ready
                setTimeout(async () => {
                    await this.app.initialize();
                }, 100);
            }
            
            console.log('✅ Application startup completed');
            
        } catch (error) {
            console.error('❌ Failed to start application:', error);
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
     * Stop the application
     */
    static stop() {
        if (this.app && this.app.aiUpdateManager) {
            this.app.aiUpdateManager.stop();
            console.log('✅ Application stopped');
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
 * Application Entry Point - เริ่มต้นทันทีเมื่อโหลด module
 */
(function initializeApp() {
    console.log('🌟 Chiang Rai Coffee Blockchain v1.0.0');
    console.log('📱 Starting initialization sequence...');
    
    // Start the application
    AppLifecycle.start();
    
    // Log successful initialization
    console.log('✅ Application entry point completed');
})();

// Export for module systems
export default ChiangRaiCoffeeApp;
export { AppLifecycle };this.logs.push(logEntry);
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
