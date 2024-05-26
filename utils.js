export function toPascalCase(str) {
  return str
    .split(/[\s-_]/) // Split by spaces, hyphens, or underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(""); // Join all words into a single string
}
