import db from '../models/index.js';

const SystemSettings = db.SystemSettings;

export default {
    getSettings: async (req, res) => {
        try {
            const settings = await SystemSettings.findAll();
            const settingsMap = {};
            settings.forEach(s => {
                settingsMap[s.key] = s.value;
            });
            res.json(settingsMap);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching system settings' });
        }
    },

    updateSettings: async (req, res) => {
        const t = await db.sequelize.transaction();
        try {
            const { auction_extension_minutes, auction_threshold_minutes } = req.body;

            // Validate inputs
            if (auction_extension_minutes) {
                if (isNaN(auction_extension_minutes) || parseInt(auction_extension_minutes) < 0) {
                    await t.rollback();
                    return res.status(400).json({ message: 'Invalid extension minutes' });
                }
                const setting = await SystemSettings.findOne({ where: { key: 'auction_extension_minutes' }, transaction: t });
                if (setting) {
                    await setting.update({ value: auction_extension_minutes.toString() }, { transaction: t });
                } else {
                    await SystemSettings.create({
                        key: 'auction_extension_minutes',
                        value: auction_extension_minutes.toString(),
                        description: 'Duration to extend the auction by (in minutes).'
                    }, { transaction: t });
                }
            }

            if (auction_threshold_minutes) {
                if (isNaN(auction_threshold_minutes) || parseInt(auction_threshold_minutes) < 0) {
                    await t.rollback();
                    return res.status(400).json({ message: 'Invalid threshold minutes' });
                }
                const setting = await SystemSettings.findOne({ where: { key: 'auction_threshold_minutes' }, transaction: t });
                if (setting) {
                    await setting.update({ value: auction_threshold_minutes.toString() }, { transaction: t });
                } else {
                    await SystemSettings.create({
                        key: 'auction_threshold_minutes',
                        value: auction_threshold_minutes.toString(),
                        description: 'Time threshold to trigger auto-extension (in minutes).'
                    }, { transaction: t });
                }
            }

            await t.commit();
            res.json({ message: 'Settings updated successfully' });
        } catch (error) {
            await t.rollback();
            console.error(error);
            res.status(500).json({ message: 'Error updating system settings' });
        }
    }
};
