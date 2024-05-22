export function toPascalCase(str) {
  return (
    str.charAt(0).toUpperCase() + // Capitalize the first character
    str.slice(1).toLowerCase()
  ); // Make the rest of the string lowercase
}
