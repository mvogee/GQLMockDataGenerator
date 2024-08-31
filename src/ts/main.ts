import $RefParser from "@apidevtools/json-schema-ref-parser";
import fs from "fs/promises";
import path from "path";
import { createObjNodes } from "./createObjNode";
import getMockDataObject from "./generateMocks";
import getTsSourceFile from "./getTsSourceFile";
//TODO:
// -- instead of taking a generated ts types file take a .graphql file and mock from that.
// -- how do we deal with union types ? <moneyValue | percentageValue>
// -- instead of a hard list of types and skipping "Scalar" we can allow user defined scalar object to define what scalars exist and what value to return for each

const dereferenceJson = async (jsonSchema: string) => {
  try {
    const parser = new $RefParser();
    const schema = await parser.dereference(jsonSchema, {
      mutateInputSchema: false,
      continueOnError: true,
      dereference: {
        circular: "ignore",
      },
    });
    return schema;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const writeJsonFile = async (stringifiedJson: string, filePath: string) => {
  return fs.writeFile(filePath, stringifiedJson);
};

const main = async (sourcPath: string, writePath: string) => {
  const sourcFile = getTsSourceFile(sourcPath);

  const objNodes = createObjNodes(sourcFile);
  const mockData = getMockDataObject(objNodes);
  try {
    const REF_FILE_PATH = path.join(__dirname, "./init.json");
    await writeJsonFile(JSON.stringify(mockData), REF_FILE_PATH);
    const newMockData = await dereferenceJson(REF_FILE_PATH);
    await writeJsonFile(
      JSON.stringify(newMockData),
      // path.join(__dirname, "../../mockData.json"),
      writePath,
    );
  } catch (e) {
    console.log("error: ", e);
  }
};

export const tsMockTypeGenerator = (
  sourcPath: string,
  writeFilePath: string,
) => {
  main(sourcPath, writeFilePath);
};

export default tsMockTypeGenerator;
