import payload from 'payload';
import config from '../src/payload.config.ts';

async function migrateToCloud() {
  try {
    console.log('🚀 Starting migration to cloud database...');

    // Initialize Payload with local database
    console.log('📡 Connecting to local database...');
    await payload.init({
      config: {
        ...config,
        db: {
          ...config.db,
          pool: {
            connectionString: process.env.LOCAL_DATABASE_URI || 'postgres://postgres:postgres@127.0.0.1:5432/ncg'
          }
        }
      },
      local: true,
    });

    // Export data from local database
    console.log('📤 Exporting data from local database...');
    
    const homepageData = await payload.find({
      collection: 'homepage',
      limit: 1000,
    });

    const usersData = await payload.find({
      collection: 'users',
      limit: 1000,
    });

    const mediaData = await payload.find({
      collection: 'media',
      limit: 1000,
    });

    console.log(`📊 Found ${homepageData.docs.length} homepage entries`);
    console.log(`👥 Found ${usersData.docs.length} users`);
    console.log(`🖼️ Found ${mediaData.docs.length} media files`);

    // Close local connection
    await payload.db.destroy();

    // Initialize Payload with cloud database
    console.log('☁️ Connecting to cloud database...');
    await payload.init({
      config: {
        ...config,
        db: {
          ...config.db,
          pool: {
            connectionString: process.env.CLOUD_DATABASE_URI
          }
        }
      },
      local: true,
    });

    // Import data to cloud database
    console.log('📥 Importing data to cloud database...');

    // Import users first (they might be referenced by other collections)
    for (const user of usersData.docs) {
      const { id, createdAt, updatedAt, ...userData } = user;
      try {
        await payload.create({
          collection: 'users',
          data: userData,
        });
        console.log(`✅ Migrated user: ${userData.email}`);
      } catch (error) {
        console.log(`⚠️ User ${userData.email} might already exist, skipping...`);
      }
    }

    // Import media files
    for (const media of mediaData.docs) {
      const { id, createdAt, updatedAt, ...mediaData } = media;
      try {
        await payload.create({
          collection: 'media',
          data: mediaData,
        });
        console.log(`✅ Migrated media: ${mediaData.filename}`);
      } catch (error) {
        console.log(`⚠️ Media ${mediaData.filename} might already exist, skipping...`);
      }
    }

    // Import homepage data
    for (const homepage of homepageData.docs) {
      const { id, createdAt, updatedAt, ...homepageData } = homepage;
      try {
        await payload.create({
          collection: 'homepage',
          data: homepageData,
        });
        console.log(`✅ Migrated homepage: ${homepageData.title}`);
      } catch (error) {
        console.log(`⚠️ Homepage ${homepageData.title} might already exist, skipping...`);
      }
    }

    console.log('🎉 Migration completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateToCloud();