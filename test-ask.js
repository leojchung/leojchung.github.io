/* test-ask.js — smallest possible self-check for api/ask.js.
   No framework, no network call. Run: node test-ask.js
   Checks the two pieces of actual logic in that file: the fact sheet
   builder (does it pull real content.js data, does it stay off the
   deliberately-vague entries) and the per-IP rate limiter. */
const assert = require('assert');

// api/ask.js only exports the request handler, so pull the two private
// helpers back out of its source rather than duplicating them here.
const path = require('path');
const askPath = path.join(__dirname, 'api/ask.js');
const src = require('fs').readFileSync(askPath, 'utf8');
const mod = { exports: {} };
new Function('module', 'exports', 'require', src + '\nmodule.exports.buildFactSheet = buildFactSheet; module.exports.rateLimited = rateLimited;')
  (mod, mod.exports, require('module').createRequire(askPath));
const { buildFactSheet, rateLimited } = mod.exports;

const sheet = buildFactSheet();
assert(sheet.includes('Leo J. Chung'), 'fact sheet should include the name from content.js');
assert(sheet.includes('Research:'), 'fact sheet should include a Research section');
assert(!/<[a-z]/i.test(sheet), 'fact sheet should have no leftover HTML tags');

let blocked = false;
for (let i = 0; i < 12; i++) blocked = rateLimited('1.2.3.4') || blocked;
assert(blocked, 'an IP making 12 rapid requests should eventually be rate-limited');
assert(!rateLimited('9.9.9.9'), 'a fresh IP should not be rate-limited');

console.log('test-ask.js: all checks passed');
