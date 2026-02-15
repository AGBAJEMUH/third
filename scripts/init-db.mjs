import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load .env.local
dotenv.config({ path: '.env.local' });

const url = process.env.LIBSQL_DB_URL;
const authToken = process.env.LIBSQL_DB_AUTH_TOKEN;

if (!url) {
    console.error('Error: LIBSQL_DB_URL is not defined in .env.local');
    process.exit(1);
}

const client = createClient({
    url,
    authToken,
});

async function init() {
    console.log(`🚀 Initializing database at ${url}...`);

    try {
        const schemaPath = path.join(process.cwd(), 'src/lib/db/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');

        // Split schema into individual statements (basic splitter for SQL logic)
        // Turso executeMultiple is better for this
        await client.executeMultiple(schema);

        console.log('✅ Database initialized successfully with schema and templates!');
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
    } finally {
        process.exit(0);
    }
}

init();
