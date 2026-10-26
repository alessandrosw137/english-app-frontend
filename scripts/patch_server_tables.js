const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'server', 'db.js');
let db = fs.readFileSync(dbPath, 'utf8');

const anchor = 'CREATE TABLE IF NOT EXISTS feedbacks (';
if (!db.includes(anchor)) {
  console.error('Anchor not found in server/db.js');
  process.exit(1);
}

const tableDDL = `
      -- 6. Tabla de Mascotas (MasterPet Sanctuary)
      CREATE TABLE IF NOT EXISTS user_pets (
          id VARCHAR(64) PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          username VARCHAR(100),
          species VARCHAR(50) NOT NULL,
          name VARCHAR(100) NOT NULL,
          data JSONB NOT NULL DEFAULT '{}'::jsonb,
          co_parent_user_id INT REFERENCES users(id) ON DELETE SET NULL,
          co_parent_username VARCHAR(100),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_user_pets_username ON user_pets(username);
      CREATE INDEX IF NOT EXISTS idx_user_pets_coparent ON user_pets(co_parent_username);

      -- 7. Tabla de Perfiles Sociales
      CREATE TABLE IF NOT EXISTS user_social_profiles (
          id SERIAL PRIMARY KEY,
          user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
          username VARCHAR(100) UNIQUE,
          bio TEXT DEFAULT '',
          location VARCHAR(150) DEFAULT '',
          relationship VARCHAR(150) DEFAULT '',
          cover_photo TEXT DEFAULT '',
          avatar_type VARCHAR(50) DEFAULT 'emoji',
          avatar_emoji VARCHAR(30) DEFAULT '🦊',
          avatar_custom_url TEXT DEFAULT '',
          hobbies JSONB DEFAULT '[]'::jsonb,
          social_links JSONB DEFAULT '{}'::jsonb,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_user_social_profiles_username ON user_social_profiles(username);
`;

if (!db.includes('CREATE TABLE IF NOT EXISTS user_pets')) {
  db = db.replace(anchor, tableDDL + '\n      ' + anchor);
  fs.writeFileSync(dbPath, db, 'utf8');
  console.log('Successfully added user_pets and user_social_profiles to server/db.js');
} else {
  console.log('Tables already exist in server/db.js');
}
