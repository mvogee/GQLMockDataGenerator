import ts from "typescript";
import fs from "fs";
import path from "path";

export const getTsSourceFile = (): ts.SourceFile => {

  const GENERATED_FILE_PATH = path.join(__dirname, "../../generated.ts");
  // Read the content of the generated TypeScript file
  const fileContent = fs.readFileSync(GENERATED_FILE_PATH, "utf-8");

  const sourceFile = ts.createSourceFile(
    "generated.ts",
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );

  return sourceFile;
}


export default getTsSourceFile;
