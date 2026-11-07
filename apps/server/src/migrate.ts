import { DB_PATH, openDatabase, runMigrations } from '@/configs/database.config.ts';

const db = openDatabase();
const applied = runMigrations(db);
db.close();
console.log(`database ready at ${DB_PATH}`);
console.log(applied.length > 0 ? `applied: ${applied.join(', ')}` : 'no new migrations');
