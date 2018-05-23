'use strict';

const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const commitMsgFile = path.resolve(root, '.git/hooks/commit-msg');

// Stop if file does not exist
if (!fs.existsSync(commitMsgFile)) {
    return;
}

// Rereting backup file for commit-msg
if (!fs.existsSync(commitMsgFile + '.backup')) {
    fs.unlinkSync(commitMsgFile);
} else {
    fs.writeFileSync(commitMsgFile, fs.readFileSync(commitMsgFile + '.backup'));
    fs.chmodSync(commitMsgFile, '755');
    fs.unlinkSync(commitMsgFile + '.backup');
}
