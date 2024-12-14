#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";

import { fileURLToPath } from "url";

async function main() {
  console.log("Hello! これから新しいイベントアプリを作成します。");
  console.log("質問に答えてください。\n");

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "lang",
      message: "使用する言語を選択してください:",
      choices: [
        {
          name: chalk.cyan("TypeScript"),
          value: "ts",
        },
        {
          name: chalk.yellow("JavaScript"),
          value: "js",
        },
      ],
    },
    {
      type: "input",
      name: "folderName",
      message:
        "新規作成するフォルダ名を入力してください (apps/events下に作成されます):",
      validate: (input: string) =>
        input.trim() !== "" ? true : "フォルダ名を入力してください",
    },
    {
      type: "input",
      name: "port",
      message: "使用したいポート番号を入力してください:",
      validate: (input: string) =>
        /^\d+$/.test(input) ? true : "数字を入力してください",
    },
  ]);

  const { folderName, port } = answers;

  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const rootDir = path.join(__dirname, "../../");
    const lang = answers.lang;
    const templateDir = path.join(rootDir, `template/${lang}`);
    const targetDir = path.join(rootDir, "apps/events", folderName);

    await fs.copy(templateDir, targetDir);

    const packageJsonPath = path.join(targetDir, "package.json");
    const packageData = await fs.readJSON(packageJsonPath);

    packageData.name = folderName;
    packageData.scripts = packageData.scripts || {};
    packageData.scripts.dev = `vite --port ${port} --host`;

    await fs.writeJSON(packageJsonPath, packageData, { spaces: 2 });

    const rootPackagePath = path.join(rootDir, "package.json");
    const rootPackageData = await fs.readJSON(rootPackagePath);

    rootPackageData.scripts = rootPackageData.scripts || {};
    rootPackageData.scripts[`dev:${folderName}`] =
      `pnpm run with-env turbo dev --filter='./apps/admin'... --filter='./apps/api'... --filter='./apps/events/${folderName}'...`;

    await fs.writeJSON(rootPackagePath, rootPackageData, { spaces: 2 });

    const line = chalk.yellow(
      "================================================================"
    );
    console.log(line);
    console.log("");
    console.log(chalk.bold("Next steps:"));
    console.log("");
    console.log(`  ${chalk.bold("1.")} ${chalk.cyan("pnpm install")}`);
    console.log(
      `  ${chalk.bold("2.")} ${chalk.cyan(`pnpm run dev:${folderName}`)}`
    );
    console.log(line);
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  }
}

main();
