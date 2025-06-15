/**
 * Strategic Analysis Engine for Blockchain Impact Assessment
 * =========================================================
 */

/**
 * Strategic Analyzer for calculating blockchain impact metrics
 */
export class StrategicAnalyzer {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.metrics = {
            economic: 75,
            trust: 85,
            sustainability: 70,
            competitiveness: 88,
            futureReadiness: 92,
            ecosystem: 78
        };
        
        // Weights for different factors
        this.weights = {
            recordCount: 0.3,
            diversity: 0.25,
            quality: 0.25,
            completeness: 0.2
        };
    }
    
    /**
     * Calculate Economic Impact Score (0-100)
     * Based on: supply chain efficiency, cost reduction, price transparency
     */
    calculateEconomicImpact() {
        try {
            const totalRecords = this.blockchain.chain.length - 1; // Exclude genesis
            if (totalRecords === 0) return 75;
            
            const coffeeIds = this.blockchain.getCoffeeIds();
            let directTradeScore = 0;
            let priceTransparencyScore = 0;
            
            // Calculate supply chain efficiency
            coffeeIds.forEach(coffeeId => {
                const history = this.blockchain.getCoffeeHistory(coffeeId);
                const stages = history.length;
                
                // More stages = more transparency = higher score
                directTradeScore += Math.min(stages / 7, 1) * 100;
                
                // Check for price transparency (retail stage)
                const hasRetail = history.some(block => block.data.stage === 'retail');
                if (hasRetail) priceTransparencyScore += 100;
            });
            
            const avgDirectTrade = coffeeIds.length > 0 ? directTradeScore / coffeeIds.length : 70;
            const avgPriceTransparency = coffeeIds.length > 0 ? priceTransparencyScore / coffeeIds.length : 50;
            
            // Market penetration factor
            const marketPenetration = Math.min(totalRecords / 50, 1) * 100;
            
            // Weight the factors
            const result = (
                avgDirectTrade * 0.4 +
                avgPriceTransparency * 0.3 +
                marketPenetration * 0.3
            );
            
            return Math.round(Math.min(Math.max(result, 60), 95));
        } catch (error) {
            console.error('Error calculating economic impact:', error);
            return 75;
        }
    }
    
    /**
     * Calculate Trust & Credibility Score (0-100)
     * Based on: traceability completeness, data integrity, verification
     */
    calculateTrustCredibility() {
        try {
            const totalCoffeeIds = this.blockchain.coffeeRecords.size - 1; // Exclude genesis
            if (totalCoffeeIds === 0) return 85;
            
            let completeJourneys = 0;
            let totalCompleteness = 0;
            let verificationScore = 0;
            
            this.blockchain.coffeeRecords.forEach((history, coffeeId) => {
                if (coffeeId === 'GENESIS') return;
                
                const stages = history.length;
                const completeness = Math.min(stages / 7, 1);
                totalCompleteness += completeness;
                
                // Complete journey bonus (farm to retail)
                if (stages >= 4) {
                    completeJourneys++;
                }
                
                // Check for AI verification
                const hasAIVerification = history.some(block => block.data.isAIGenerated);
                if (hasAIVerification) {
                    verificationScore += 1;
                }
            });
            
            const avgCompleteness = totalCompleteness / totalCoffeeIds;
            const completeJourneyRatio = completeJourneys / totalCoffeeIds;
            const aiVerificationRatio = verificationScore / totalCoffeeIds;
            
            // Blockchain integrity check
            const integrityBonus = this.blockchain.isChainValid() ? 10 : 0;
            
            const result = (
                avgCompleteness * 40 +
                completeJourneyRatio * 30 +
                aiVerificationRatio * 15 +
                integrityBonus +
                5 // Base trust level
            );
            
            return Math.round(Math.min(Math.max(result, 70), 98));
        } catch (error) {
            console.error('Error calculating trust credibility:', error);
            return 85;
        }
    }
    
    /**
     * Calculate Sustainability Impact Score (0-100)
     * Based on: environmental practices, organic farming, carbon footprint
     */
    calculateSustainabilityImpact() {
        try {
            const totalRecords = this.blockchain.chain.length - 1;
            if (totalRecords === 0) return 70;
            
            let sustainabilityScore = 0;
            let organicCount = 0;
            let environmentalDataCount = 0;
            
            const sustainabilityKeywords = [
                'อินทรีย์', 'organic', 'sustainable', 'eco', 'green',
                'ไม่ใช้สารเคมี', 'ธรรมชาติ', 'สิ่งแวดล้อม'
            ];
            
            this.blockchain.chain.forEach(block => {
                if (block.data.coffeeId === 'GENESIS') return;
                
                const details = (block.data.details || '').toLowerCase();
                
                // Check for sustainability keywords
                const hasSustainabilityKeyword = sustainabilityKeywords.some(keyword => 
                    details.includes(keyword.toLowerCase())
                );
                
                if (hasSustainabilityKeyword) {
                    sustainabilityScore += 2;
                    organicCount++;
                }
                
                // Environmental data tracking (temperature, humidity)
                if (block.data.temperature && block.data.humidity) {
                    environmentalDataCount++;
                    sustainabilityScore += 1;
                }
                
                // Premium quality often correlates with sustainable practices
                if (block.data.quality === 'Premium') {
                    sustainabilityScore += 0.5;
                }
            });
            
            const organicRatio = organicCount / totalRecords;
            const environmentalDataRatio = environmentalDataCount / totalRecords;
            const avgSustainabilityScore = sustainabilityScore / totalRecords;
            
            const result = (
                organicRatio * 35 +
                environmentalDataRatio * 25 +
                avgSustainabilityScore * 25 +
                15 // Base sustainability level
            ) * 100;
            
            return Math.round(Math.min(Math.max(result, 60), 92));
        } catch (error) {
            console.error('Error calculating sustainability impact:', error);
            return 70;
        }
    }
    
    /**
     * Calculate Market Competitiveness Score (0-100)
     * Based on: quality assurance, brand value, market differentiation
     */
    calculateMarketCompetitiveness() {
        try {
            const totalRecords = this.blockchain.chain.length - 1;
            if (totalRecords === 0) return 88;
            
            let premiumCount = 0;
            let totalQualityRecords = 0;
            let brandDifferentiationScore = 0;
            let traceabilityAdvantage = 0;
            
            this.blockchain.chain.forEach(block => {
                if (block.data.coffeeId === 'GENESIS') return;
                
                if (block.data.quality) {
                    totalQualityRecords++;
                    
                    // Premium and Grade A add to competitiveness
                    if (block.data.quality === 'Premium') {
                        premiumCount += 2;
                    } else if (block.data.quality === 'Grade A') {
                        premiumCount += 1;
                    }
                }
                
                // Unique features add brand value
                const details = (block.data.details || '').toLowerCase();
                if (details.includes('ระดับความสูง') || details.includes('altitude')) {
                    brandDifferentiationScore += 1;
                }
                
                // Complete traceability = competitive advantage
                const coffeeHistory = this.blockchain.getCoffeeHistory(block.data.coffeeId);
                if (coffeeHistory.length >= 5) {
                    traceabilityAdvantage += 0.5;
                }
            });
            
            const qualityRatio = totalQualityRecords > 0 ? premiumCount / totalQualityRecords : 0.6;
            const brandDiffRatio = brandDifferentiationScore / totalRecords;
            const traceabilityRatio = traceabilityAdvantage / totalRecords;
            
            const result = (
                qualityRatio * 40 +
                brandDiffRatio * 30 +
                traceabilityRatio * 20 +
                10 // Base competitiveness
            ) * 100;
            
            return Math.round(Math.min(Math.max(result, 75), 98));
        } catch (error) {
            console.error('Error calculating market competitiveness:', error);
            return 88;
        }
    }
    
    /**
     * Calculate Future Readiness Score (0-100)
     * Based on: AI integration, technology adoption, innovation readiness
     */
    calculateFutureReadiness() {
        try {
            const totalRecords = this.blockchain.chain.length - 1;
            if (totalRecords === 0) return 92;
            
            let aiRecords = 0;
            let techAdoptionScore = 0;
            let innovationScore = 0;
            let digitalReadinessScore = 0;
            
            this.blockchain.chain.forEach(block => {
                if (block.data.coffeeId === 'GENESIS') return;
                
                // AI-generated records show high tech adoption
                if (block.data.isAIGenerated) {
                    aiRecords++;
                    innovationScore += 2;
                }
                
                const details = (block.data.details || '').toLowerCase();
                const operator = (block.data.operator || '').toLowerCase();
                
                // Technology keywords
                const techKeywords = [
                    'ai', 'iot', 'sensor', 'smart', 'automated', 'digital',
                    'blockchain', 'อัจฉริยะ', 'เซ็นเซอร์', 'อัตโนมัติ'
                ];
                
                if (techKeywords.some(keyword => 
                    details.includes(keyword) || operator.includes(keyword)
                )) {
                    techAdoptionScore += 1;
                }
                
                // Data richness indicates digital readiness
                if (block.data.temperature && block.data.humidity && block.data.batchSize) {
                    digitalReadinessScore += 1;
                }
                
                // Modern processing methods
                if (details.includes('washed process') || details.includes('honey process')) {
                    innovationScore += 0.5;
                }
            });
            
            const aiRatio = aiRecords / totalRecords;
            const techRatio = Math.min(techAdoptionScore / totalRecords, 1);
            const digitalRatio = digitalReadinessScore / totalRecords;
            const innovationRatio = Math.min(innovationScore / totalRecords, 1);
            
            const result = (
                aiRatio * 30 +
                techRatio * 25 +
                digitalRatio * 25 +
                innovationRatio * 15 +
                5 // Base future readiness
            ) * 100;
            
            return Math.round(Math.min(Math.max(result, 80), 98));
        } catch (error) {
            console.error('Error calculating future readiness:', error);
            return 92;
        }
    }
    
    /**
     * Calculate Ecosystem Strength Score (0-100)
     * Based on: network diversity, collaboration, stakeholder engagement
     */
    calculateEcosystemStrength() {
        try {
            const totalOperators = this.blockchain.operators.size - 1; // Exclude system
            const totalLocations = this.blockchain.locations.size - 1;
            const totalCoffeeIds = this.blockchain.coffeeRecords.size - 1;
            
            if (totalOperators === 0) return 78;
            
            // Network diversity metrics
            const operatorDiversity = Math.min(totalOperators / 12, 1);
            const locationDiversity = Math.min(totalLocations / 10, 1);
            const coffeeVariety = Math.min(totalCoffeeIds / 8, 1);
            
            // Collaboration indicators
            let collaborationScore = 0;
            let stakeholderEngagement = 0;
            
            // Check for multi-stage coffee journeys (indicates collaboration)
            this.blockchain.coffeeRecords.forEach((history, coffeeId) => {
                if (coffeeId === 'GENESIS') return;
                
                if (history.length >= 4) {
                    collaborationScore += 1;
                }
                
                // Different operators for same coffee = good collaboration
                const uniqueOperators = new Set(history.map(block => block.data.operator));
                if (uniqueOperators.size >= 3) {
                    stakeholderEngagement += 1;
                }
            });
            
            const collaborationRatio = collaborationScore / totalCoffeeIds;
            const engagementRatio = stakeholderEngagement / totalCoffeeIds;
            
            // Network effect bonus (more connections = stronger ecosystem)
            const networkEffect = Math.min((totalOperators * totalLocations) / 50, 1);
            
            const result = (
                operatorDiversity * 25 +
                locationDiversity * 20 +
                coffeeVariety * 20 +
                collaborationRatio * 15 +
                engagementRatio * 10 +
                networkEffect * 10
            ) * 100;
            
            return Math.round(Math.min(Math.max(result, 65), 95));
        } catch (error) {
            console.error('Error calculating ecosystem strength:', error);
            return 78;
        }
    }
    
    /**
     * Update all metrics and return the complete analysis
     */
    updateAllMetrics() {
        this.metrics.economic = this.calculateEconomicImpact();
        this.metrics.trust = this.calculateTrustCredibility();
        this.metrics.sustainability = this.calculateSustainabilityImpact();
        this.metrics.competitiveness = this.calculateMarketCompetitiveness();
        this.metrics.futureReadiness = this.calculateFutureReadiness();
        this.metrics.ecosystem = this.calculateEcosystemStrength();
        
        return this.metrics;
    }
    
    /**
     * Get overall blockchain health score
     */
    getOverallHealthScore() {
        const metrics = this.updateAllMetrics();
        const weights = {
            economic: 0.2,
            trust: 0.25,
            sustainability: 0.15,
            competitiveness: 0.15,
            futureReadiness: 0.15,
            ecosystem: 0.1
        };
        
        const weighted = Object.keys(metrics).reduce((sum, key) => {
            return sum + (metrics[key] * (weights[key] || 0));
        }, 0);
        
        return Math.round(weighted);
    }
    
    /**
     * Generate strategic insights based on metrics
     */
    generateInsights() {
        const metrics = this.updateAllMetrics();
        const insights = [];
        
        if (metrics.economic < 70) {
            insights.push({
                type: 'warning',
                category: 'Economic',
                message: 'ควรเพิ่มการติดตามราคาและลดขั้นตอนตัวกลางเพื่อเพิ่มประสิทธิภาพทางเศรษฐกิจ'
            });
        }
        
        if (metrics.trust > 90) {
            insights.push({
                type: 'success',
                category: 'Trust',
                message: 'ระบบมีความน่าเชื่อถือสูง ควรใช้เป็นจุดขายหลักในการตลาด'
            });
        }
        
        if (metrics.sustainability < 75) {
            insights.push({
                type: 'info',
                category: 'Sustainability',
                message: 'ควรเพิ่มการบันทึกข้อมูลด้านสิ่งแวดล้อมและการปฏิบัติที่ยั่งยืน'
            });
        }
        
        if (metrics.futureReadiness > 85) {
            insights.push({
                type: 'success',
                category: 'Innovation',
                message: 'ระบบพร้อมสำหรับเทคโนโลยีใหม่ ควรขยายการใช้ AI และ IoT'
            });
        }
        
        if (metrics.ecosystem < 80) {
            insights.push({
                type: 'info',
                category: 'Network',
                message: 'ควรเพิ่มจำนวนพาร์ทเนอร์และความหลากหลายของเครือข่าย'
            });
        }
        
        return insights;
    }
    
    /**
     * Get performance trends (mock data for demo)
     */
    getPerformanceTrends() {
        const metrics = this.updateAllMetrics();
        const totalRecords = this.blockchain.chain.length - 1;
        
        // Generate trend data based on current metrics
        return {
            economic: {
                current: metrics.economic,
                trend: totalRecords > 10 ? 'increasing' : 'stable',
                change: Math.round((metrics.economic - 70) / 5)
            },
            trust: {
                current: metrics.trust,
                trend: 'increasing',
                change: Math.round((metrics.trust - 80) / 3)
            },
            sustainability: {
                current: metrics.sustainability,
                trend: totalRecords > 15 ? 'increasing' : 'stable',
                change: Math.round((metrics.sustainability - 65) / 4)
            },
            competitiveness: {
                current: metrics.competitiveness,
                trend: 'increasing',
                change: Math.round((metrics.competitiveness - 85) / 2)
            },
            futureReadiness: {
                current: metrics.futureReadiness,
                trend: 'stable',
                change: Math.round((metrics.futureReadiness - 90) / 1)
            },
            ecosystem: {
                current: metrics.ecosystem,
                trend: totalRecords > 20 ? 'increasing' : 'stable',
                change: Math.round((metrics.ecosystem - 75) / 3)
            }
        };
    }
    
    /**
     * Export analysis report
     */
    exportReport() {
        const metrics = this.updateAllMetrics();
        const insights = this.generateInsights();
        const trends = this.getPerformanceTrends();
        const stats = this.blockchain.getStats();
        
        return {
            timestamp: new Date().toISOString(),
            blockchainStats: stats,
            strategicMetrics: metrics,
            overallScore: this.getOverallHealthScore(),
            insights: insights,
            trends: trends,
            recommendations: this.generateRecommendations()
        };
    }
    
    /**
     * Generate actionable recommendations
     */
    generateRecommendations() {
        const metrics = this.updateAllMetrics();
        const recommendations = [];
        
        // Economic recommendations
        if (metrics.economic < 80) {
            recommendations.push({
                priority: 'high',
                category: 'Economic',
                action: 'เพิ่มการติดตามราคาในทุกขั้นตอน',
                impact: 'เพิ่มความโปร่งใสด้านราคาและลดต้นทุน'
            });
        }
        
        // Trust recommendations  
        if (metrics.trust < 85) {
            recommendations.push({
                priority: 'medium',
                category: 'Trust',
                action: 'เพิ่มจำนวนขั้นตอนการตรวจสอบ',
                impact: 'เพิ่มความเชื่อมั่นของผู้บริโภค'
            });
        }
        
        // Sustainability recommendations
        if (metrics.sustainability < 80) {
            recommendations.push({
                priority: 'medium',
                category: 'Sustainability',
                action: 'บันทึกข้อมูลสิ่งแวดล้อมและการปฏิบัติที่ยั่งยืน',
                impact: 'เสริมสร้างภาพลักษณ์สีเขียว'
            });
        }
        
        // Innovation recommendations
        if (metrics.futureReadiness < 90) {
            recommendations.push({
                priority: 'low',
                category: 'Innovation',
                action: 'เพิ่มการใช้เทคโนโลยี AI และ IoT',
                impact: 'เตรียมพร้อมสำหรับอนาคต'
            });
        }
        
        return recommendations;
    }
}

/**
 * Impact Calculator for dynamic outcomes
 */
export class ImpactCalculator {
    constructor(blockchain) {
        this.blockchain = blockchain;
    }
    
    /**
     * Calculate dynamic impact outcomes based on blockchain data
     */
    calculateDynamicOutcomes() {
        const stats = this.blockchain.getStats();
        const totalRecords = stats.totalBlocks - 1; // Exclude genesis
        
        // Base values that increase with blockchain activity
        const outcomes = {
            // Economic impacts
            avgPriceIncrease: Math.min(totalRecords * 2 + 15, 35), // 15-35%
            farmerIncomeIncrease: Math.min(totalRecords * 2.5 + 20, 45), // 20-45%
            intermediaryReduction: Math.min(totalRecords * 1.5 + 30, 60), // 30-60%
            
            // Social impacts  
            farmersInSystem: Math.min(stats.totalOperators * 35 + 100, 500), // Up to 500
            householdsBenefited: Math.min(stats.totalOperators * 180 + 500, 2000), // Up to 2000
            satisfactionScore: Math.min(7.5 + (totalRecords / 25), 9.5), // 7.5-9.5
            
            // Trust & transparency
            traceabilityTime: Math.max(10 - totalRecords / 8, 2), // 2-10 seconds
            fakeCoffeeReduction: Math.min(totalRecords * 3 + 60, 90), // 60-90%
            brandPremium: Math.min(totalRecords * 2 + 20, 50), // 20-50%
            
            // Environmental impacts
            carbonReduction: Math.min(totalRecords * 1.2 + 15, 35), // 15-35%
            chemicalReduction: Math.min(totalRecords * 2 + 25, 50), // 25-50%
            organicArea: Math.min(totalRecords * 4 + 80, 150) // 80-150%
        };
        
        return outcomes;
    }
    
    /**
     * Format outcomes for display
     */
    getFormattedOutcomes() {
        const outcomes = this.calculateDynamicOutcomes();
        
        return {
            // Economic
            avgPrice: `${Math.round(150 + outcomes.avgPriceIncrease * 2)} บาท/กก.`,
            farmerIncome: `${Math.round(35000 + outcomes.farmerIncomeIncrease * 500)} บาท`,
            intermediaryReduction: `${Math.round(outcomes.intermediaryReduction)}%`,
            
            // Social
            farmersInSystem: `${Math.round(outcomes.farmersInSystem)} ราย`,
            householdsBenefited: `${Math.round(outcomes.householdsBenefited).toLocaleString()}`,
            satisfactionScore: `${outcomes.satisfactionScore.toFixed(1)}/10`,
            
            // Trust & transparency
            traceabilityTime: `${Math.round(outcomes.traceabilityTime)} วินาที`,
            fakeCoffeeReduction: `${Math.round(outcomes.fakeCoffeeReduction)}%`,
            brandPremium: `${Math.round(outcomes.brandPremium)}%`,
            
            // Environmental
            carbonReduction: `${Math.round(outcomes.carbonReduction)}%`,
            chemicalReduction: `${Math.round(outcomes.chemicalReduction)}%`,
            organicArea: `${Math.round(outcomes.organicArea)}%`
        };
    }
}

/**
 * Radar Chart Data Generator
 */
export class RadarChartGenerator {
    /**
     * Calculate radar chart coordinates
     */
    static calculateRadarCoordinates(metrics) {
        const centerX = 250;
        const centerY = 250;
        const maxRadius = 200;
        
        const angles = [
            -Math.PI / 2,      // Top (Economic)
            -Math.PI / 6,      // Top Right (Trust)
            Math.PI / 6,       // Bottom Right (Sustainability)
            Math.PI / 2,       // Bottom (Competitiveness)
            5 * Math.PI / 6,   // Bottom Left (Future Readiness)
            7 * Math.PI / 6    // Top Left (Ecosystem)
        ];
        
        const values = [
            metrics.economic,
            metrics.trust,
            metrics.sustainability,
            metrics.competitiveness,
            metrics.futureReadiness,
            metrics.ecosystem
        ];
        
        const coordinates = angles.map((angle, index) => ({
            x: centerX + Math.cos(angle) * (values[index] / 100) * maxRadius,
            y: centerY + Math.sin(angle) * (values[index] / 100) * maxRadius
        }));
        
        return {
            coordinates,
            values,
            polygonPoints: coordinates.map(coord => `${coord.x},${coord.y}`).join(' ')
        };
    }
    
    /**
     * Generate radar chart styling based on performance
     */
    static getRadarStyling(metrics) {
        const avgScore = Object.values(metrics).reduce((sum, val) => sum + val, 0) / 6;
        
        if (avgScore >= 85) {
            return {
                fillColor: 'rgba(56, 161, 105, 0.3)', // Green
                strokeColor: '#38a169',
                performance: 'excellent'
            };
        } else if (avgScore >= 75) {
            return {
                fillColor: 'rgba(49, 130, 206, 0.3)', // Blue
                strokeColor: '#3182ce',
                performance: 'good'
            };
        } else {
            return {
                fillColor: 'rgba(214, 158, 46, 0.3)', // Yellow
                strokeColor: '#d69e2e',
                performance: 'needs-improvement'
            };
        }
    }
}
