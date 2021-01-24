#!/usr/bin/env node

// 检测node版本相关依赖
const chalk = require('chalk')
const semver = require('semver')
const requiredVersion = require('../package.json').engines.node

// 检测node版本函数
/**
 * 
 * @param {*} wanted 
 * @param {*} id 
 */
function checkNodeVersion (wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red(
      '你是用的Node版本号为： ' + process.version + ', 但 ' + id +
      ' 需运行在 ' + wanted + '.\n请升级你的Node版本'
    ))
    process.exit(1)
  }
}

checkNodeVersion(requiredVersion, 'awesome-test-cli')

if (semver.satisfies(process.version, '9.x')) {
  console.log(chalk.red(
    `你是用的Node版本是 ${process.version}.\n` +
    `强烈建议你使用最新 LTS 版本`
  ))
}

// 开始处理命令
const program = require('commander')
const minimist = require('minimist')

program
  .version(require('../package').version,'-v,--version')
  .usage('<command> [options]')

// 创建命令
program
  .command('create <app-name>')
  .description('create a new project')
  .option('-p, --preset <presetName>', 'Skip prompts and use saved or remote preset')
  .option('-d, --default', 'Skip prompts and use default preset')
  .action((name, cmd) => {
    const options = cleanArgs(cmd)
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow('\n ⚠️  检测到您输入了多个名称，将以第一个参数为项目名，舍弃后续参数哦'))
    }
    require('../lib/create')(name, options)
  })

program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp()
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
    console.log()
    // suggestCommands(cmd)
  })

// 调用
program.parse(process.argv)