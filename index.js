#!/usr/bin/env node

import { promises as fs } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import inquirer from "inquirer";
import { toPascalCase } from "./utils.js";
import {
  logIntro,
  logError,
  checkComponentExists,
  createIndexFile,
  logInfo,
} from "./helpers.js";
import figlet from "figlet";

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(
  chalk.yellow(
    figlet.textSync("SUPER COMPONENTS!", {
      horizontalLayout: "full",
    })
  )
);

async function getTemplateContent(templatePath) {
  const filePath = join(__dirname, templatePath);
  const content = await fs.readFile(filePath, "utf8");
  return content;
}

async function main() {
  let componentName, fileType;

  // Check if command-line arguments are provided correctly
  if (process.argv.length === 3) {
    logError("Error Occured! Use 'ncomp' to initilize CLI interface");
    logInfo("Or run command: ncomp <ComponentName> <jsx,tsx,vue>");
    process.exit(1);
  } else if (process.argv.length > 3) {
    componentName = process.argv[2];
    fileType = process.argv[3].toLowerCase();
  } else {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "componentName",
        message: "Enter the component name:",
        validate: (value) => {
          const hasSpecialChars = /[~@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
            value
          );
          if (hasSpecialChars) {
            return logError(
              "Component names cannot contain special characters."
            );
          }
          return (
            value.trim() !== "" || logError("Please enter a component name.")
          );
        },
      },
      {
        type: "list",
        name: "fileType",
        message: "Choose the component type:",
        choices: ["JSX", "TSX", "VUE"],
        validate: (value) =>
          value !== null || "Please select a component type.",
      },
    ]);

    componentName = answers.componentName;
    fileType = answers.fileType.toLowerCase();
  }

  logIntro({
    name: componentName,
    dir: join(process.cwd(), "src", componentName),
    lang: fileType,
  });
  await createComponent(componentName, fileType);
}

main().catch(console.error); // Handle any errors during execution

async function createComponent(componentName, fileType) {
  if (
    !componentName ||
    !fileType ||
    !["jsx", "tsx", "vue"].includes(fileType)
  ) {
    logError("WRONG PARAMETERS USED PLEASE REFER TO THE USAGE ABOVE");
    logInfo("Usage: ncomp <ComponentName> <jsx|tsx|vue>");

    process.exit(1);
  }

  componentName = toPascalCase(componentName);

  const projectDir = process.cwd();
  const srcDir = join(projectDir, "src");
  const componentDir = join(srcDir, componentName);
  const componentFilePath = join(componentDir, `${componentName}.${fileType}`);

  try {
    if (await checkComponentExists(componentDir, componentName)) {
      process.exit(1);
    }
    await fs.mkdir(componentDir, { recursive: true });

    const templatePath = `./templates/${fileType}.js`;
    const componentFileContent = await getTemplateContent(templatePath);
    const finalComponentFileContent = componentFileContent.replace(
      /COMPONENT_NAME/g,
      componentName
    );

    await fs.writeFile(componentFilePath, finalComponentFileContent);

    await createIndexFile(componentDir, componentName, fileType);
  } catch (error) {
    console.error(chalk.bgRed.bold("Error creating component:"), error);
    process.exit(1);
  }
}
