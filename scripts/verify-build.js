#!/usr/bin/env node

/**
 * 构建验证脚本
 * 用于验证构建产物是否完整
 */

const fs = require('fs');
const path = require('path');

const requiredFiles = [
    'index.js',
    'config.json',
    'install.js',
    'install.bat',
    'installService.bat',
    'uninstall.bat',
    '手动安装说明.txt'
];

const requiredDirs = [
    'public',
    'node-v14.9.0-win-x86'
];

function checkFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ 缺少文件: ${filePath}`);
        return false;
    }

    const stats = fs.statSync(filePath);
    if (stats.isFile() && stats.size === 0) {
        console.error(`❌ 文件为空: ${filePath}`);
        return false;
    }

    console.log(`✅ 文件存在: ${filePath} (${stats.size} bytes)`);
    return true;
}

function checkDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        console.error(`❌ 缺少目录: ${dirPath}`);
        return false;
    }

    const stats = fs.statSync(dirPath);
    if (!stats.isDirectory()) {
        console.error(`❌ 不是目录: ${dirPath}`);
        return false;
    }

    console.log(`✅ 目录存在: ${dirPath}`);
    return true;
}

function verifyBuild() {
    console.log('🔍 开始验证构建产物...\n');

    let allValid = true;

    // 检查必需文件
    console.log('📄 检查必需文件:');
    for (const file of requiredFiles) {
        if (!checkFile(file)) {
            allValid = false;
        }
    }

    console.log('\n📁 检查必需目录:');
    for (const dir of requiredDirs) {
        if (!checkDirectory(dir)) {
            allValid = false;
        }
    }

    // 检查 Node.js 运行时
    console.log('\n🔧 检查 Node.js 运行时:');
    const nodeExe = path.join('node-v14.9.0-win-x86', 'node.exe');
    if (!checkFile(nodeExe)) {
        allValid = false;
    }

    // 检查前端构建产物
    console.log('\n🌐 检查前端构建产物:');
    const publicIndex = path.join('public', 'index.html');
    if (!checkFile(publicIndex)) {
        console.error('❌ 前端构建产物不完整');
        allValid = false;
    } else {
        console.log('✅ 前端构建产物完整');
    }

    console.log('\n' + '='.repeat(50));

    if (allValid) {
        console.log('🎉 构建验证通过！所有必需文件都存在。');
        process.exit(0);
    } else {
        console.log('❌ 构建验证失败！请检查缺失的文件。');
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    verifyBuild();
}

module.exports = { verifyBuild, checkFile, checkDirectory };
