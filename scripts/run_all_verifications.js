const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const scripts = [
  'verify_core_fixes_requirements.js',
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
  'verify_ui_robot_pdf_landscape.js',
  'verify_world3d_engine.js',
  'verify_v8_player_dict_pdf_google.js',
  'verify_v9_requirements.js',
  'verify_v10_requirements.js',
  'verify_v11_requirements.js',
  'verify_v12_lyrics_cinema_carousel.js',
  'verify_v13_karaoke_delay_sync.js',
  'verify_v14_lrclib_sync.js',
  'verify_v15_youtube_resilience.js',
  'verify_dictionary_pdf_requirements.js',
  'verify_spatial_immersion_portal.js',
  'verify_v16_word_by_word_karaoke.js',
  'verify_v17_flicker_free_karaoke.js',
  'verify_v18_audio_unmute_recovery.js',
  'verify_v19_karaoke_playback_fixes.js',
  'verify_v20_universal_seek_pause_sync.js',
  'verify_v21_no_startup_autoplay.js',
  'verify_v22_interactive_stanza_seek_sync.js',
  'verify_v23_lrc_universal_engine_mobile.js'
];

let allPassed = true;

scripts.forEach(script => {
  const scriptPath = path.join(__dirname, script);
  if (!fs.existsSync(scriptPath)) {
    console.log(`⚠️ Skipping missing script: ${script}`);
    return;
  }
  try {
    console.log(`\n========================================`);
    console.log(`RUNNING: ${script}`);
    console.log(`========================================`);
    const output = execSync(`node scripts/${script}`, { cwd: path.resolve(__dirname, '..'), encoding: 'utf8' });
    console.log(output);
  } catch (err) {
    console.error(`❌ FAILED: ${script}`);
    console.error(err.stdout || err.message);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\n🏆 ALL 25 TEST SUITES PASSED FLAWLESSLY!');
} else {
  console.error('\n❌ SOME TEST SUITES FAILED!');
  process.exit(1);
}
