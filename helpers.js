import chalk from "chalk";
import ora from "ora";
import { join, dirname } from "path";
import { promises as fs } from "fs";
const langNames = {
  jsx: "JavaScript",
  tsx: "TypeScript",
};

const colors = {
  blue: [0, 108, 255],
  darkGray: [64, 64, 64],
  gold: [255, 215, 0],
  green: [34, 139, 34],
  mediumGray: [128, 128, 128],
};

export const logComponentLang = (selected) =>
  ["jsx", "tsx"]
    .map((option) =>
      option === selected
        ? `${chalk.bold.rgb(...colors.blue)(langNames[option])}`
        : `${chalk.rgb(...colors.darkGray)(langNames[option])}`
    )
    .join("  ");

export const logIntro = ({ name, dir, lang }) => {
  console.info("\n");
  const pathString = chalk.bold.rgb(...colors.blue)(dir);
  const langString = logComponentLang(lang);
  console.info(
    chalk.rgb(...colors.green)("=========================================")
  );
  console.info(`Directory:  ${pathString}`);
  console.info(`Language:   ${langString}`);
  console.info(
    chalk.rgb(...colors.green)("=========================================")
  );

  console.info("\n");
  const spinner = ora(
    `✨  Creating the ${chalk.bold.rgb(...colors.gold)(name)} component ✨`
  ).start();

  setTimeout(() => {
    spinner.succeed(
      chalk.green(
        `Your component named ${chalk.bold.red(
          name
        )} has been succesfully created...`
      )
    );
  }, 1000);
};

export const logError = (error) => {
  console.info("\n");
  console.info(chalk.bold.red(error));
};

export const logInfo = (info) => {
  console.info("\n");
  console.info(chalk.bold.bgBlue(info));
};

export async function checkComponentExists(componentDir, componentName) {
  for (const ext of ["jsx", "tsx", "vue"]) {
    const filePath = join(componentDir, `${componentName}.${ext}`);
    try {
      await fs.access(filePath);
      logError(
        `-Error: A component with name '${componentName}.${ext}' already exists. Please choose a different name and file type.`
      );

      return true;
    } catch (error) {
      // If the file doesn't exist, continue checking the next file type
    }
  }
  return false;
}

export async function createIndexFile(componentDir, componentName, fileType) {
  if (fileType === "jsx" || fileType === "tsx") {
    const indexFilePath = join(componentDir, `index.${fileType}`);
    const indexFileContent = `export { default } from './${componentName}';\n`;
    await fs.writeFile(indexFilePath, indexFileContent);
  }
}
