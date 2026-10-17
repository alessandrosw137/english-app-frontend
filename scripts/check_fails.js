const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const scripts = [
  'verify_hub_interaction_requirements.js',
  'verify_user_profile_requirements.js',
  'verify_modal_close_requirements.js',
  'verify_interaction_and_layers.js',
  'verify_login_and_settings.js',
  'verify_admin_device_security.js',
  'verify_admin_dashboard.js',
  'verify_v7_modular_karaoke_rebrand.js',
  'verify_v6_music_forceupdate_pdf.js',
  'verify_v5_architecture_requirements.js',
  'verify_v4_requirements.js',
  'verify_v3_requirements.js',
  'verify_v2_requirements.js',
  'verify_all_requirements.js',
  'verify_master_data_requirements.js',
  'verify_render_resilience.js',
  'verify_stories_requirements.js',
  'verify_music_requirements.js',
  'verify_ui_robot_pdf_landscape.js'
];

scripts.forEach(s => {
  try {
    execSync(`node scripts/${s}`, { cwd: path.resolve(__dirname, '..'), stdio: 'pipe' });
    console.log(`PASS: ${s}`);
  } catch (e) {
    console.log(`FAIL: ${s}`);
  }
});
