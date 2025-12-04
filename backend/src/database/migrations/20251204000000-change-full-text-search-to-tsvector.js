'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 1. Change column type to TSVECTOR
        // We use USING to convert existing data if any, though we'll likely overwrite it.
        await queryInterface.sequelize.query(`
      ALTER TABLE "Products"
      ALTER COLUMN "full_text_search" TYPE TSVECTOR
      USING to_tsvector('english', "full_text_search");
    `);

        // 2. Add a GIN index for performance
        await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS "products_full_text_search_idx"
      ON "Products"
      USING GIN ("full_text_search");
    `);
    },

    down: async (queryInterface, Sequelize) => {
        // Revert to TEXT
        await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS "products_full_text_search_idx";
    `);

        await queryInterface.sequelize.query(`
      ALTER TABLE "Products"
      ALTER COLUMN "full_text_search" TYPE TEXT
      USING "full_text_search"::text;
    `);
    }
};
