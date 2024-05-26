import { promises as fs } from "fs";
import { join } from "path";

// Function to recursively list directories and their subdirectories
async function listDirectories(startPath) {
  const items = await fs.readdir(startPath, { withFileTypes: true });
  const directories = items
    .filter((item) => item.isDirectory())
    .map((item) => join(startPath, item.name));

  return directories;
}

async function listSubdirectories(directory) {
  const subdirs = await listDirectories(directory);
  return subdirs.length > 0 ? subdirs : null;
}

async function listUserTemplates() {
  const userTemplatesDir = join(process.cwd(), "user_templates");
  const files = await fs.readdir(userTemplatesDir);
  return files;
}

export { listDirectories, listSubdirectories, listUserTemplates };
