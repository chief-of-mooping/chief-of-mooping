/**
 * Blockchain Core Classes for Chiang Rai Coffee Supply Chain
 * ========================================================
 */

/**
 * Individual Block in the blockchain
 */
export class Block {
    constructor(index, data, previousHash, customTimestamp = null) {
        this.index = index;
        this.timestamp = customTimestamp || this.generateTimestamp();
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    
    /**
     * Generate realistic timestamp for demo purposes
     */
    generateTimestamp() {
        const now = new Date();
        // For sample data, generate timestamps in the past (last 30 days)
        const randomDaysAgo = Math.floor(Math.random() * 30);
        const randomHours = Math.floor(Math.random() * 24);
        const randomMinutes = Math.floor(Math.random() * 60);
        
        const sampleDate = new Date(now);
        sampleDate.setDate(now.getDate() - randomDaysAgo);
        sampleDate.setHours(randomHours, randomMinutes, 0, 0);
        
        return sampleDate.toLocaleString('th-TH', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    
    /**
     * Calculate hash for the block
     */
    calculateHash() {
        try {
            const data = this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce;
            
            // Simple but effective hash function for demo
            let hash = 0;
            for (let i = 0; i < data.length; i++) {
                const char = data.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32-bit integer
            }
            
            // Convert to hex and pad to 8 characters
            return Math.abs(hash).toString(16).padStart(8, '0');
        } catch (error) {
            console.error('Hash calculation error:', error);
            return '00000000';
        }
    }
    
    /**
     * Mine block with proof of work (simplified for demo)
     */
    mineBlock(difficulty = 1) {
        const target = Array(Math.min(difficulty, 2) + 1).join("0");
        let attempts = 0;
        
        while (this.hash.substring(0, Math.min(difficulty, 2)) !== target && attempts < 1000) {
            this.nonce++;
            this.hash = this.calculateHash();
            attempts++;
        }
        
        console.log(`Block mined: ${this.hash} (${attempts} attempts)`);
    }
}

/**
 * Main Blockchain class for managing the supply chain
 */
export class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 1;
        this.coffeeRecords = new Map(); // Coffee ID -> [blocks]
        this.operators = new Set();     // Unique operators
        this.locations = new Set();     // Unique locations
        this.pendingTransactions = [];
    }
    
    /**
     * Create the genesis (first) block
     */
    createGenesisBlock() {
        const genesisData = {
            coffeeId: "GENESIS",
            stage: "system",
            location: "เครือข่าย Blockchain เชียงราย",
            operator: "ผู้ดูแลระบบ",
            details: "บล็อกต้นกำเนิด - การเริ่มต้นเครือข่าย Blockchain สำหรับห่วงโซ่อุปทานกาแฟเชียงราย",
            quality: "ระบบ",
            batchSize: "N/A",
            temperature: "N/A",
            humidity: "N/A"
        };
        
        // Genesis block gets current timestamp
        const now = new Date();
        const genesisTimestamp = now.toLocaleString('th-TH', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        return new Block(0, genesisData, "0", genesisTimestamp);
    }
    
    /**
     * Get the latest block in the chain
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    
    /**
     * Add a new block to the blockchain
     */
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        
        // Update tracking data structures
        const coffeeId = newBlock.data.coffeeId;
        if (!this.coffeeRecords.has(coffeeId)) {
            this.coffeeRecords.set(coffeeId, []);
        }
        this.coffeeRecords.get(coffeeId).push(newBlock);
        
        // Track unique operators and locations
        this.operators.add(newBlock.data.operator);
        this.locations.add(newBlock.data.location);
        
        console.log(`Block #${newBlock.index} added successfully`);
    }
    
    /**
     * Get complete history for a specific coffee ID
     */
    getCoffeeHistory(coffeeId) {
        const history = this.coffeeRecords.get(coffeeId) || [];
        
        // Sort by timestamp for chronological order
        return history.sort((a, b) => {
            const dateA = new Date(a.timestamp.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'));
            const dateB = new Date(b.timestamp.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'));
            return dateA - dateB;
        });
    }
    
    /**
     * Get all blocks for a specific stage
     */
    getBlocksByStage(stage) {
        return this.chain.filter(block => block.data.stage === stage);
    }
    
    /**
     * Search blocks by any text content
     */
    searchBlocks(query) {
        if (!query || query.trim() === '') {
            return this.chain;
        }
        
        const searchTerm = query.toLowerCase().trim();
        return this.chain.filter(block => {
            const data = block.data;
            return (
                data.coffeeId.toLowerCase().includes(searchTerm) ||
                data.location.toLowerCase().includes(searchTerm) ||
                data.operator.toLowerCase().includes(searchTerm) ||
                data.details.toLowerCase().includes(searchTerm) ||
                data.quality.toLowerCase().includes(searchTerm) ||
                data.stage.toLowerCase().includes(searchTerm)
            );
        });
    }
    
    /**
     * Validate the entire blockchain
     */
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            
            // Check if current block's hash is valid
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.error(`Invalid hash at block ${i}`);
                return false;
            }
            
            // Check if current block points to previous block
            if (currentBlock.previousHash !== previousBlock.hash) {
                console.error(`Invalid previous hash at block ${i}`);
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Get blockchain statistics
     */
    getStats() {
        return {
            totalBlocks: this.chain.length,
            totalCoffee: this.coffeeRecords.size - 1, // Exclude genesis
            totalOperators: this.operators.size - 1,  // Exclude system operator
            totalLocations: this.locations.size - 1,  // Exclude system location
            isValid: this.isChainValid()
        };
    }
    
    /**
     * Get unique coffee IDs
     */
    getCoffeeIds() {
        return Array.from(this.coffeeRecords.keys()).filter(id => id !== 'GENESIS');
    }
    
    /**
     * Get blocks by quality grade
     */
    getBlocksByQuality(quality) {
        return this.chain.filter(block => 
            block.data.quality && block.data.quality === quality
        );
    }
    
    /**
     * Get recent activity (last N blocks)
     */
    getRecentActivity(count = 10) {
        return this.chain
            .slice(-count)
            .reverse(); // Most recent first
    }
    
    /**
     * Export blockchain data as JSON
     */
    exportData() {
        return {
            chain: this.chain,
            stats: this.getStats(),
            timestamp: new Date().toISOString(),
            version: "1.0.0"
        };
    }
}

/**
 * Sample Data Generator for Demo Purposes
 */
export class SampleDataGenerator {
    constructor() {
        this.coffeeIds = ['CR001', 'CR002', 'CR003', 'CR004', 'CR005'];
        this.stages = ['farm', 'harvest', 'processing', 'roasting', 'packaging', 'distribution', 'retail'];
        this.locations = [
            'ดอยช้าง, เชียงราย', 
            'แม่สาย, เชียงราย', 
            'เชียงแสน, เชียงราย', 
            'แม่จัน, เชียงราย', 
            'เวียงแก่น, เชียงราย',
            'พาน, เชียงราย',
            'เทิง, เชียงราย'
        ];
        this.operators = [
            'นายสมชาย ใจดี', 
            'นางสาวมาลี สุขใส', 
            'นายบุญมี รักษ์ดี',
            'มูลนิธิแม่ฟ้าหลวง', 
            'สหกรณ์กาแฟดอยช้าง', 
            'บริษัท เชียงราย คอฟฟี่',
            'ร้านกาแฟภูเขา',
            'โรงคั่วดอยตุง'
        ];
        this.varieties = [
            'อาราบิก้า พันธุ์คาตูรา', 
            'อาราบิก้า พันธุ์ทิปิก้า', 
            'อาราบิก้า พันธุ์บูร์บง',
            'อาราบิก้า พันธุ์เคนท์'
        ];
        this.qualities = ['Premium', 'Grade A', 'Grade B', 'Standard'];
    }
    
    /**
     * Generate realistic sample data with sequential timestamps
     */
    generateSampleData(count = 20) {
        const sampleData = [];
        const now = new Date();
        
        for (let i = 0; i < count; i++) {
            const coffeeId = this.coffeeIds[Math.floor(Math.random() * this.coffeeIds.length)];
            const stage = this.stages[Math.floor(Math.random() * this.stages.length)];
            const location = this.locations[Math.floor(Math.random() * this.locations.length)];
            const operator = this.operators[Math.floor(Math.random() * this.operators.length)];
            const quality = this.qualities[Math.floor(Math.random() * this.qualities.length)];
            
            // Generate timestamp (spreading across last 30 days)
            const daysAgo = Math.floor(Math.random() * 30);
            const hoursAgo = Math.floor(Math.random() * 24);
            const minutesAgo = Math.floor(Math.random() * 60);
            
            const timestamp = new Date(now);
            timestamp.setDate(now.getDate() - daysAgo);
            timestamp.setHours(now.getHours() - hoursAgo, now.getMinutes() - minutesAgo, 0, 0);
            
            const timestampString = timestamp.toLocaleString('th-TH', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            const details = this.generateStageDetails(stage);
            
            sampleData.push({
                coffeeId,
                stage,
                location,
                operator,
                details,
                quality,
                batchSize: `${50 + Math.floor(Math.random() * 200)} kg`,
                temperature: `${20 + Math.floor(Math.random() * 15)}°C`,
                humidity: `${40 + Math.floor(Math.random() * 30)}%`,
                timestamp: timestampString,
                isAIGenerated: false
            });
        }
        
        // Sort by timestamp for realistic chronological order
        return sampleData.sort((a, b) => {
            const dateA = new Date(a.timestamp.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'));
            const dateB = new Date(b.timestamp.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'));
            return dateA - dateB;
        });
    }
    
    /**
     * Generate realistic details for each stage
     */
    generateStageDetails(stage) {
        switch(stage) {
            case 'farm':
                return `${this.varieties[Math.floor(Math.random() * this.varieties.length)]} ปลูกในระดับความสูง ${1000 + Math.floor(Math.random() * 500)} เมตร พื้นที่ ${5 + Math.floor(Math.random() * 20)} ไร่`;
            
            case 'harvest':
                return `เก็บเกี่ยวด้วยมือ ผลสุก ${85 + Math.floor(Math.random() * 15)}% ปริมาณ ${50 + Math.floor(Math.random() * 200)} กิโลกรัม ความชื้น ${10 + Math.floor(Math.random() * 5)}%`;
            
            case 'processing':
                const processes = ['Washed Process', 'Natural Process', 'Honey Process', 'Semi-Washed Process'];
                return `${processes[Math.floor(Math.random() * processes.length)]} อุณหภูมิ ${20 + Math.floor(Math.random() * 10)}°C เวลาหมัก ${12 + Math.floor(Math.random() * 24)} ชั่วโมง`;
            
            case 'roasting':
                const roastLevels = ['Light Roast', 'Medium Roast', 'Medium-Dark Roast', 'Dark Roast'];
                return `${roastLevels[Math.floor(Math.random() * roastLevels.length)]} อุณหภูมิ ${180 + Math.floor(Math.random() * 40)}°C เวลา ${8 + Math.floor(Math.random() * 8)} นาที`;
            
            case 'packaging':
                const packagingTypes = ['ถุงวาล์ว', 'ถุงซิป', 'กระป๋อง', 'ถุงกระดาษ'];
                return `${packagingTypes[Math.floor(Math.random() * packagingTypes.length)]} ขนาด ${250 + Math.floor(Math.random() * 750)}g วันผลิต ${new Date().toLocaleDateString('th-TH')}`;
            
            case 'distribution':
                return `จัดส่งไปยัง ${Math.floor(Math.random() * 20) + 1} จุดจำหน่าย อุณหภูมิขนส่ง ${15 + Math.floor(Math.random() * 10)}°C ระยะทาง ${50 + Math.floor(Math.random() * 500)} กิโลเมตร`;
            
            case 'retail':
                return `วางจำหน่ายในร้าน ราคา ${150 + Math.floor(Math.random() * 350)} บาท/แพ็ค สต็อก ${10 + Math.floor(Math.random() * 50)} แพ็ค`;
            
            default:
                return `ข้อมูลเพิ่มเติมสำหรับขั้นตอน ${stage}`;
        }
    }
    
    /**
     * Generate AI-like record for auto-updates
     */
    generateAIRecord() {
        const coffeeId = this.coffeeIds[Math.floor(Math.random() * this.coffeeIds.length)];
        const stage = this.stages.slice(0, 5)[Math.floor(Math.random() * 5)]; // Only early stages for AI
        const aiOperators = ['ฟาร์ม AI อัจฉริยะ', 'ศูนย์แปรรูป IoT', 'โรงคั่วอัตโนมัติ', 'ระบบตรวจสอบ AI'];
        
        const now = new Date();
        const timestamp = now.toLocaleString('th-TH', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        return {
            coffeeId,
            stage,
            location: this.locations[Math.floor(Math.random() * this.locations.length)],
            operator: aiOperators[Math.floor(Math.random() * aiOperators.length)],
            details: `สร้างโดย AI: การตรวจสอบ ${stage} อัจฉริยะด้วยเซ็นเซอร์ IoT และการเรียนรู้ของเครื่อง`,
            quality: 'Premium',
            batchSize: (80 + Math.floor(Math.random() * 120)) + ' kg',
            temperature: (22 + Math.floor(Math.random() * 8)) + '°C',
            humidity: (45 + Math.floor(Math.random() * 20)) + '%',
            timestamp,
            isAIGenerated: true
        };
    }
}

/**
 * Utility functions for blockchain operations
 */
export const BlockchainUtils = {
    /**
     * Format timestamp for display
     */
    formatTimestamp(timestamp) {
        try {
            const date = new Date(timestamp.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'));
            return date.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return timestamp;
        }
    },
    
    /**
     * Validate coffee ID format
     */
    isValidCoffeeId(coffeeId) {
        return /^CR\d{3,6}$/.test(coffeeId);
    },
    
    /**
     * Generate new coffee ID
     */
    generateCoffeeId() {
        return 'CR' + String(Date.now()).slice(-6);
    },
    
    /**
     * Get stage emoji
     */
    getStageEmoji(stage) {
        const stageEmojis = {
            'farm': '🌱',
            'harvest': '🌾',
            'processing': '⚙️',
            'roasting': '🔥',
            'packaging': '📦',
            'distribution': '🚛',
            'retail': '🏪',
            'system': '🏛️'
        };
        return stageEmojis[stage] || '📋';
    },
    
    /**
     * Get Thai stage name
     */
    getStageName(stage) {
        const stageNames = {
            'farm': 'การปลูก',
            'harvest': 'การเก็บเกี่ยว',
            'processing': 'การแปรรูป',
            'roasting': 'การคั่ว',
            'packaging': 'การบรรจุ',
            'distribution': 'การจัดจำหน่าย',
            'retail': 'การขายปลีก',
            'system': 'ระบบ'
        };
        return stageNames[stage] || stage;
    }
};
