"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageManager = void 0;
class StorageManager {
    constructor(context) {
        this.context = context;
    }
    async saveDream(dream) {
        try {
            const dreams = await this.getDreams();
            const existingIndex = dreams.findIndex(d => d.id === dream.id);
            if (existingIndex >= 0) {
                dreams[existingIndex] = dream;
            }
            else {
                dreams.push(dream);
            }
            await this.context.globalState.update('dreamcatcher.dreams', dreams);
        }
        catch (error) {
            console.error('Error saving dream:', error);
            throw error;
        }
    }
    async getDreams() {
        try {
            const dreams = await this.context.globalState.get('dreamcatcher.dreams', []);
            return dreams;
        }
        catch (error) {
            console.error('Error loading dreams:', error);
            return [];
        }
    }
    async getDream(id) {
        try {
            const dreams = await this.getDreams();
            return dreams.find(d => d.id === id);
        }
        catch (error) {
            console.error('Error getting dream:', error);
            return undefined;
        }
    }
    async deleteDream(id) {
        try {
            const dreams = await this.getDreams();
            const filteredDreams = dreams.filter(d => d.id !== id);
            await this.context.globalState.update('dreamcatcher.dreams', filteredDreams);
        }
        catch (error) {
            console.error('Error deleting dream:', error);
            throw error;
        }
    }
    async updateDream(id, updates) {
        try {
            const dreams = await this.getDreams();
            const dreamIndex = dreams.findIndex(d => d.id === id);
            if (dreamIndex >= 0) {
                dreams[dreamIndex] = { ...dreams[dreamIndex], ...updates, updated: new Date().toISOString() };
                await this.context.globalState.update('dreamcatcher.dreams', dreams);
            }
        }
        catch (error) {
            console.error('Error updating dream:', error);
            throw error;
        }
    }
    async addFragment(dreamId, fragment) {
        try {
            const dreams = await this.getDreams();
            const dreamIndex = dreams.findIndex(d => d.id === dreamId);
            if (dreamIndex >= 0) {
                dreams[dreamIndex].fragments.push(fragment);
                dreams[dreamIndex].updated = new Date().toISOString();
                await this.context.globalState.update('dreamcatcher.dreams', dreams);
            }
        }
        catch (error) {
            console.error('Error adding fragment:', error);
            throw error;
        }
    }
    async deleteFragment(dreamId, fragmentId) {
        try {
            const dreams = await this.getDreams();
            const dreamIndex = dreams.findIndex(d => d.id === dreamId);
            if (dreamIndex >= 0) {
                dreams[dreamIndex].fragments = dreams[dreamIndex].fragments.filter(f => f.id !== fragmentId);
                dreams[dreamIndex].updated = new Date().toISOString();
                await this.context.globalState.update('dreamcatcher.dreams', dreams);
            }
        }
        catch (error) {
            console.error('Error deleting fragment:', error);
            throw error;
        }
    }
    async searchDreams(query) {
        try {
            const dreams = await this.getDreams();
            const lowercaseQuery = query.toLowerCase();
            return dreams.filter(dream => dream.title.toLowerCase().includes(lowercaseQuery) ||
                dream.description?.toLowerCase().includes(lowercaseQuery) ||
                dream.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
                dream.fragments.some(fragment => fragment.title.toLowerCase().includes(lowercaseQuery) ||
                    fragment.content.toLowerCase().includes(lowercaseQuery)));
        }
        catch (error) {
            console.error('Error searching dreams:', error);
            return [];
        }
    }
    async getDreamsByTag(tag) {
        try {
            const dreams = await this.getDreams();
            return dreams.filter(dream => dream.tags.includes(tag));
        }
        catch (error) {
            console.error('Error getting dreams by tag:', error);
            return [];
        }
    }
    async getDreamsByStatus(status) {
        try {
            const dreams = await this.getDreams();
            return dreams.filter(dream => dream.status === status);
        }
        catch (error) {
            console.error('Error getting dreams by status:', error);
            return [];
        }
    }
    async getDreamsByBrand(brand) {
        try {
            const dreams = await this.getDreams();
            return dreams.filter(dream => dream.brand === brand);
        }
        catch (error) {
            console.error('Error getting dreams by brand:', error);
            return [];
        }
    }
    async getRecentDreams(limit = 10) {
        try {
            const dreams = await this.getDreams();
            return dreams
                .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
                .slice(0, limit);
        }
        catch (error) {
            console.error('Error getting recent dreams:', error);
            return [];
        }
    }
    async getDreamStatistics() {
        try {
            const dreams = await this.getDreams();
            const totalFragments = dreams.reduce((sum, dream) => sum + dream.fragments.length, 0);
            const dreamsByStatus = dreams.reduce((acc, dream) => {
                acc[dream.status] = (acc[dream.status] || 0) + 1;
                return acc;
            }, {});
            const dreamsByBrand = dreams.reduce((acc, dream) => {
                const brand = dream.brand || 'personal';
                acc[brand] = (acc[brand] || 0) + 1;
                return acc;
            }, {});
            // Calculate recent activity (dreams updated in last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const recentActivity = dreams.filter(dream => new Date(dream.updated) > sevenDaysAgo).length;
            return {
                totalDreams: dreams.length,
                totalFragments,
                dreamsByStatus,
                dreamsByBrand,
                recentActivity
            };
        }
        catch (error) {
            console.error('Error getting dream statistics:', error);
            return {
                totalDreams: 0,
                totalFragments: 0,
                dreamsByStatus: {},
                dreamsByBrand: {},
                recentActivity: 0
            };
        }
    }
    async exportDreams() {
        try {
            const dreams = await this.getDreams();
            return JSON.stringify(dreams, null, 2);
        }
        catch (error) {
            console.error('Error exporting dreams:', error);
            throw error;
        }
    }
    async importDreams(jsonData) {
        try {
            const dreams = JSON.parse(jsonData);
            await this.context.globalState.update('dreamcatcher.dreams', dreams);
        }
        catch (error) {
            console.error('Error importing dreams:', error);
            throw error;
        }
    }
    async clearAllDreams() {
        try {
            await this.context.globalState.update('dreamcatcher.dreams', []);
        }
        catch (error) {
            console.error('Error clearing dreams:', error);
            throw error;
        }
    }
}
exports.StorageManager = StorageManager;
//# sourceMappingURL=storage-manager.js.map