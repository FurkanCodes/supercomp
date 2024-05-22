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
  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "componentName",
        message: "Enter the component name:",
        validate: (value) => {
          // Check for special characters using a regular expression
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
    logIntro({
      name: answers.componentName,
      dir: join(process.cwd(), "src", answers.componentName),
      lang: answers.fileType.toLowerCase(),
    });
    await createComponent(
      answers.componentName,
      answers.fileType.toLowerCase()
    );
  } catch (error) {
    console.error(chalk.red("Error creating component:", error));
    process.exit(1);
  }
}

main().catch(console.error); // Handle any errors during execution

async function createComponent(componentName, fileType) {
  // Validate arguments
  if (
    !componentName ||
    !fileType ||
    !["jsx", "tsx", "vue"].includes(fileType)
  ) {
    console.error(chalk.bgRed.bold("HEY WRONG PARAMETERS"));
    console.error(
      chalk.bgGreenBright.bold("Usage: ncomp <ComponentName> <jsx|tsx|vue>")
    );
    process.exit(1);
  }

  // Transform the component name to Pascal Case
  componentName = toPascalCase(componentName);

  const projectDir = process.cwd(); // Current working directory of the project
  const srcDir = join(projectDir, "src");
  const componentDir = join(srcDir, componentName);
  const componentFilePath = join(componentDir, `${componentName}.${fileType}`);

  try {
    if (await checkComponentExists(componentDir, componentName)) {
      process.exit(1);
    }
    // Create the component directory
    await fs.mkdir(componentDir, { recursive: true });

    // Load the template content based on fileType
    const templatePath = `./templates/${fileType}.js`;
    const componentFileContent = await getTemplateContent(templatePath);

    // Replace placeholders in the template with actual values
    const finalComponentFileContent = componentFileContent.replace(
      /COMPONENT_NAME/g,
      componentName
    );

    await fs.writeFile(componentFilePath, finalComponentFileContent);

    // Create the index file only for JSX and TSX components
    await createIndexFile(componentDir, componentName, fileType);
  } catch (error) {
    console.error(chalk.bgRed.bold("Error creating component:"), error);
    process.exit(1);
  }
}
