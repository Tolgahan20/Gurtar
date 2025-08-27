#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔐 Generating secure JWT secrets for Gurtar backend...\n');

// Generate secrets
const jwtSecret = crypto.randomBytes(64).toString('hex');
const jwtRefreshSecret = crypto.randomBytes(64).toString('hex');

console.log('Generated secrets:');
console.log('==================');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`JWT_REFRESH_SECRET=${jwtRefreshSecret}\n`);

// Check if .env exists
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
    console.log('📝 Creating .env file from template...');

    if (fs.existsSync(envExamplePath)) {
        let envContent = fs.readFileSync(envExamplePath, 'utf8');

            // Replace placeholder values with generated secrets
    const dbUser = 'postgres';
    const dbPass = 'postgres';
    
    envContent = envContent
      .replace('your_jwt_secret_here_generate_with_crypto_randomBytes_64', jwtSecret)
      .replace('your_jwt_refresh_secret_here_generate_with_crypto_randomBytes_64', jwtRefreshSecret)
      .replace('your_db_username', dbUser)
      .replace('your_db_password', dbPass);

        fs.writeFileSync(envPath, envContent);
        console.log('✅ .env file created successfully!');
    } else {
        console.log('❌ env.example file not found');
    }
} else {
    console.log('⚠️  .env file already exists. Please manually update it with the secrets above.');
}

console.log('\n🛡️  Security Notes:');
console.log('- Keep these secrets safe and never commit them to version control');
console.log('- Use different secrets for development, staging, and production');
console.log('- Consider rotating these secrets periodically');
console.log('\n🚀 Your secrets are ready for use!');