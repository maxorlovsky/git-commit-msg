'use strict';

const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const commitMsgFile = path.resolve(root, '.git/hooks/commit-msg');

// Check if commit-msg file exists, if not, it means that it's not a git repo, just stoping the execution
// If backup already exist, that means that git-commit-msg is already installed, aborting until backup is removed
if (!fs.existsSync(commitMsgFile) || fs.existsSync(`${commitMsgFile}.backup`)) {
    return;
}

// Creating a backup of commit-msg file
if (fs.existsSync(commitMsgFile) && !fs.lstatSync(commitMsgFile).isSymbolicLink()) {
    console.log('git-commit-msg: git commit-msg hook detected, creating backup');
    fs.writeFileSync(commitMsgFile + '.backup', fs.readFileSync(commitMsgFile));
}

// Trying to remove
try {
    fs.unlinkSync(commitMsgFile);
} catch (e) {}

const commitMsgContent =
`#!/bin/bash
./node_modules/git-commit-msg/commit-msg
RESULT=$?
[ $RESULT -ne 0 ] && exit 1
exit 0`;

//
// It could be that we do not have rights to this folder which could cause the
// installation of this module to completely fail. We should just output the
// error instead destroying the whole npm install process.
//
try {
    fs.writeFileSync(commitMsgFile, commitMsgContent);
} catch (e) {
    console.error('git-commit-msg: Failed to create the hook file in your .git/hooks folder because:');
    console.error(`git-commit-msg: ${e.message}`);
    console.error('git-commit-msg: The hook was not installed.');
    console.error('git-commit-msg:');
}

try {
    fs.chmodSync(commitMsgFile, '777');
} catch (e) {
    console.error('git-commit-msg:');
    console.error('git-commit-msg: chmod 0777 the commit-msg file in your .git/hooks folder because:');
    console.error(`git-commit-msg: ${e.message}`);
    console.error('git-commit-msg:');
}
