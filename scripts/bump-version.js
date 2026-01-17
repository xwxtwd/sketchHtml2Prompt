#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取 package.json
const packagePath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// 解析版本号
const [major, minor, patch] = packageJson.version.split('.').map(Number);

// 增加 patch 版本号
const newVersion = `${major}.${minor}.${patch + 1}`;

// 更新 package.json
packageJson.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`Version bumped: ${packageJson.version} -> ${newVersion}`);
console.log(newVersion);
