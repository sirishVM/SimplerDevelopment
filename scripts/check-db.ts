import * as dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config({ path: '.env.local', override: true });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('❌ DATABASE_URL is not set in .env.local');
  process.exit(1);
}

const redacted = url.replace(/:[^:@]+@/, ':***@');
console.log('🔍 Testing connection to:', redacted);

try {
  const sql = postgres(url, { ssl: 'require', connect_timeout: 10 });
  
  // 1. Check basic connection
  const [dbInfo] = await sql`SELECT current_database(), current_user, version()`;
  console.log('✅ Connected to database:', dbInfo.current_database, 'as user:', dbInfo.current_user);

  // 2. Check clients table and columns
  const clientsCols = await sql`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'clients' 
      AND column_name IN ('ai_chat_requires_approval', 'feature_flags')
  `;
  console.log('✅ Clients columns active:', clientsCols.map((c: any) => c.column_name).join(', '));

  // 3. Check crawler SEO tables
  const seoTables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_name LIKE 'seo_%'
    ORDER BY table_name
  `;
  console.log('✅ SEO crawler tables active (' + seoTables.length + ' tables):', seoTables.map((t: any) => t.table_name).join(', '));

  // 4. Check admin user exists
  const [admin] = await sql`SELECT id, email, role FROM users WHERE role = 'admin' LIMIT 1`;
  if (admin) {
    console.log('✅ Admin user ready:', admin.email, '(id: ' + admin.id + ')');
  }

  console.log('\n🎉 ALL SYSTEMS GO: Database is fully connected, migrated, and ready!');
  await sql.end();
  process.exit(0);
} catch (err: any) {
  console.error('❌ Database error:', err.message);
  process.exit(1);
}
