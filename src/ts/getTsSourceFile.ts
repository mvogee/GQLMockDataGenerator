import fs from "fs";
import ts from "typescript";

export const getTsSourceFile = (filePath: string): ts.SourceFile => {
  // const GENERATED_FILE_PATH = path.join(__dirname, "../../generated.ts");
  // Read the content of the generated TypeScript file
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const sourceFile = ts.createSourceFile(
    "generated.ts",
    fileContent,
    ts.ScriptTarget.Latest,
    true,
  );

  return sourceFile;
};

export default getTsSourceFile;
