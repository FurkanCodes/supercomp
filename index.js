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
import {
  listDirectories,
  listSubdirectories,
  listUserTemplates,
} from "./listdir.js";

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
  const content = await fs.readFile(templatePath, "utf8");
  return content;
}

async function main() {
  let componentName, fileType, dartType, selectedDirectory, customTemplatePath;
  // Prompt user to create user_templates folder if it doesn't exist
  const userTemplatesDir = join(process.cwd(), "user_templates");
  try {
    // Attempt to access the directory to check if it exists
    await fs.access(userTemplatesDir);
  } catch (error) {
    // If accessing the directory fails (e.g., because it doesn't exist), prompt the user to create it
    const shouldCreate = await inquirer
      .prompt({
        type: "confirm",
        name: "createUserTemplates",
        message: `It looks like you haven't created a 'user_templates' folder yet. Would you like to create one now?`,
      })
      .then((answer) => answer.createUserTemplates);

    if (shouldCreate) {
      await fs.mkdir(userTemplatesDir, { recursive: true });
      logInfo(`Created '${userTemplatesDir}' for storing custom templates.`);
    } else {
      logInfo(
        `Skipping creation of '${userTemplatesDir}'. Please create it manually.`
      );
    }
  }
  // Check if command-line arguments are provided correctly
  if (process.argv.length === 3) {
    logError("Error Occured Use 'npx supercomp' to initialize CLI interface");
    logInfo("Or run command: npx supercomp <ComponentName> <jsx,tsx,vue>");
    process.exit(1);
  } else if (process.argv.length > 3) {
    componentName = process.argv[2];
    fileType = process.argv[3].toLowerCase();
    selectedDirectory = "src"; // Default directory if using CLI arguments
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
            return "Component names cannot contain special characters.";
          }
          if (/[0-9]/.test(value)) {
            return "Component names cannot contain numbers.";
          }

          if (value.trim() === "") {
            return "Please enter a component name.";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "fileType",
        message: "Choose the component type:",
        choices: ["JSX", "TSX", "VUE", "RUST", "DART", "Custom"],
        validate: (value) =>
          value !== null || "Please select a component type.",
      },
      {
        type: "list",
        name: "dartType",
        message: "Choose widget type:",
        choices: ["Stateful", "Stateless"],
        validate: (value) => value !== null || "Please select a widget type.",
        when: (answers) => answers.fileType === "DART", // Condition to show only when fileType is "DART"
      },
      {
        type: "list",
        name: "customTemplatePath",
        message: "Select a custom template:",
        choices: async () => {
          const templates = await listUserTemplates();
          return templates.map((template) => ({
            name: template,
            value: join(process.cwd(), "user_templates", template),
          }));
        },
        when: (answers) => answers.fileType === "Custom",
      },
    ]);

    componentName = answers.componentName;
    fileType = answers.fileType.toLowerCase();
    dartType = answers?.dartType?.toLowerCase();
    selectedDirectory = "src"; // Default directory if using CLI arguments
    customTemplatePath = answers.customTemplatePath;
  }

  let templatePath;
  if (fileType === "custom") {
    templatePath = customTemplatePath;
  } else {
    templatePath = join(
      __dirname,
      `./templates/${fileType}/template.${fileType}`
    );
  }

  if (fileType === "dart") {
    templatePath = join(
      __dirname,
      `./templates/${fileType}/template_${dartType}.${fileType}`
    );
  }

  let directories = await listDirectories(process.cwd());
  let directoryAnswer = await inquirer.prompt([
    {
      type: "list",
      name: "directory",
      message: "Choose the directory to create the component in:",
      choices: directories,
    },
  ]);

  selectedDirectory = directoryAnswer.directory;

  let subdirectories = await listSubdirectories(selectedDirectory);
  while (subdirectories) {
    directoryAnswer = await inquirer.prompt([
      {
        type: "list",
        name: "directory",
        message: `The directory you selected has subdirectories. Choose one to continue or select "${selectedDirectory}" to stay:`,
        choices: ["..", ...subdirectories],
      },
    ]);

    if (directoryAnswer.directory === "..") {
      break;
    }
    selectedDirectory = directoryAnswer.directory;
    subdirectories = await listSubdirectories(selectedDirectory);
  }

  logIntro({
    name: componentName,
    dir: join(selectedDirectory, componentName),
    lang: fileType,
  });
  await createComponent(
    componentName,
    fileType,
    selectedDirectory,
    templatePath
  );
}

main().catch(console.error); // Handle any errors during execution
async function createComponent(
  componentName,
  fileType,
  selectedDirectory,
  templatePath
) {
  if (
    !componentName ||
    !fileType ||
    !["jsx", "tsx", "vue", "rust", "dart", "custom"].includes(fileType)
  ) {
    logError("WRONG PARAMETERS USED PLEASE REFER TO THE USAGE BELOW");
    logInfo(
      "Usage: npx supercomp <ComponentName> <jsx|tsx|vue|rust|dart|custom>"
    );

    process.exit(1);
  }

  componentName = toPascalCase(componentName);

  const componentDir = join(selectedDirectory, componentName);

  // Extract the file extension from the template path
  const extIndex = templatePath.lastIndexOf(".");
  const ext = templatePath.substring(extIndex + 1);

  const componentFilePath = join(componentDir, `${componentName}.${ext}`);

  try {
    if (await checkComponentExists(componentDir, componentName)) {
      process.exit(1);
    }
    await fs.mkdir(componentDir, { recursive: true });

    const componentFileContent = await getTemplateContent(templatePath);
    const finalComponentFileContent = componentFileContent.replace(
      /COMPONENT_NAME/g,
      componentName
    );

    await fs.writeFile(componentFilePath, finalComponentFileContent);

    await createIndexFile(componentDir, componentName, ext);
  } catch (error) {
    console.error(chalk.bgRed.bold("Error creating component:"), error);
    process.exit(1);
  }
}
