const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Patching index.html...');

// 1. Patch saveModuleProgress
const saveModuleTarget = `        if (window.AndroidBridge && typeof window.AndroidBridge.saveData === 'function') {
          window.AndroidBridge.saveData("alessandro_missions_progress_v2", str);
        }
      } catch (e) {}
    }`;

const saveModuleReplacement = `        if (window.AndroidBridge && typeof window.AndroidBridge.saveData === 'function') {
          window.AndroidBridge.saveData("alessandro_missions_progress_v2", str);
        }
      } catch (e) {}
      if (window.BackendSync && typeof window.BackendSync.notifyModuleProgress === 'function') {
        window.BackendSync.notifyModuleProgress(modKey, progress);
      }
    }`;

if (content.includes(saveModuleTarget)) {
  content = content.replace(saveModuleTarget, saveModuleReplacement);
  console.log('✅ saveModuleProgress patched.');
} else {
  // Try CRLF / LF flexible regex
  const regex = /if \(window\.AndroidBridge && typeof window\.AndroidBridge\.saveData === 'function'\) \{\s*window\.AndroidBridge\.saveData\("alessandro_missions_progress_v2", str\);\s*\}\s*\} catch \(e\) \{\}\s*\}/;
  if (regex.test(content)) {
    content = content.replace(regex, `if (window.AndroidBridge && typeof window.AndroidBridge.saveData === 'function') {
          window.AndroidBridge.saveData("alessandro_missions_progress_v2", str);
        }
      } catch (e) {}
      if (window.BackendSync && typeof window.BackendSync.notifyModuleProgress === 'function') {
        window.BackendSync.notifyModuleProgress(modKey, progress);
      }
    }`);
    console.log('✅ saveModuleProgress patched with regex.');
  } else {
    console.warn('⚠️ Could not match saveModuleProgress.');
  }
}

// 2. Patch addUserExp
const addUserExpRegex = /function addUserExp\(points\)\s*\{\s*const current = getUserExp\(\);\s*const updated = current \+ points;\s*try\s*\{\s*localStorage\.setItem\("alessandro_user_exp_v2", updated\.toString\(\)\);\s*if \(window\.AndroidBridge && typeof window\.AndroidBridge\.saveData === 'function'\)\s*\{\s*window\.AndroidBridge\.saveData\("alessandro_user_exp_v2", updated\.toString\(\)\);\s*\}\s*\}\s*catch\s*\(e\)\s*\{\}\s*updateUserExpDisplay\(\);\s*return updated;\s*\}/;

const addUserExpReplacement = `function addUserExp(points, reason) {
      const current = getUserExp();
      const updated = current + points;
      try {
        localStorage.setItem("alessandro_user_exp_v2", updated.toString());
        if (window.AndroidBridge && typeof window.AndroidBridge.saveData === 'function') {
          window.AndroidBridge.saveData("alessandro_user_exp_v2", updated.toString());
        }
      } catch (e) {}
      updateUserExpDisplay();
      if (window.BackendSync && typeof window.BackendSync.notifyExpGained === 'function') {
        window.BackendSync.notifyExpGained(points, updated, reason);
      }
      return updated;
    }`;

if (addUserExpRegex.test(content)) {
  content = content.replace(addUserExpRegex, addUserExpReplacement);
  console.log('✅ addUserExp patched.');
} else {
  console.warn('⚠️ Could not match addUserExp.');
}

// 3. Patch handleRouletteAnswer
const rouletteRegex = /addUserExp\(expGained\);\s*expDetails = `\+\$\{expGained\} EXP agregados a tu perfil/;
if (rouletteRegex.test(content)) {
  content = content.replace(rouletteRegex, `addUserExp(expGained, 'roulette');
        if (window.BackendSync && typeof window.BackendSync.notifyRouletteRecord === 'function') {
          window.BackendSync.notifyRouletteRecord(isCorrect, expGained);
        }
        expDetails = \`+\${expGained} EXP agregados a tu perfil`);
  console.log('✅ handleRouletteAnswer patched.');
} else {
  console.warn('⚠️ Could not match handleRouletteAnswer.');
}

// 4. Patch mission level completion
const missionPassRegex = /progress\.unlockedLevel = Math\.max\(progress\.unlockedLevel \|\| 1, currentMissionLevel \+ 1\);\s*saveModuleProgress\(activeModuleKey, progress\);/;
if (missionPassRegex.test(content)) {
  content = content.replace(missionPassRegex, `progress.unlockedLevel = Math.max(progress.unlockedLevel || 1, currentMissionLevel + 1);
        saveModuleProgress(activeModuleKey, progress);
        addUserExp(100, 'mission_passed');
        if (activeModuleKey === 'toefl_simulator' && window.BackendSync && typeof window.BackendSync.notifyToeflRecord === 'function') {
          window.BackendSync.notifyToeflRecord(currentScore, total, 'TOEFL Simulator Level ' + currentMissionLevel);
        }`);
  console.log('✅ mission level completion patched.');
} else {
  console.warn('⚠️ Could not match mission pass.');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('🎉 index.html successfully updated with all real-time and offline hooks!');
