import path from "path";
import { createObjNodes } from "./createObjNode";
import getMockDataObject from "./generateMocks";
import getTsSourceFile from "./getSourceFile";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import fs from 'fs/promises';
import ts from 'typescript';
//TODO:
// -- how do we deal with union types ? <moneyValue | percentageValue>
// -- instead of a hard list of types and skipping "Scalar" we can allow user defined scalar object to define what scalars exist and what value to return for each.

const dereferenceJson = async (jsonSchema: string) => {
  try {
    const parser = new $RefParser();
    const schema = await parser.dereference(jsonSchema,
      {
        mutateInputSchema: false,
        continueOnError: true,
        dereference: {
          circular: 'ignore',
        }
      }
    );
    return schema;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

const writeJsonFile = async (stringifiedJson: string, filePath: string) => {
  return fs.writeFile(
    filePath,
    stringifiedJson,
  );
}

const main = async (sourcFile?: ts.SourceFile, writePath?: string) => {
  const REF_FILE_PATH = path.join(__dirname, "./init.json");
  sourcFile = getTsSourceFile();

  const objNodes = createObjNodes(sourcFile);
  const mockData = getMockDataObject(objNodes);
  try {

    await writeJsonFile(JSON.stringify(mockData), REF_FILE_PATH);
    const newMockData = await dereferenceJson(REF_FILE_PATH);
    await writeJsonFile(JSON.stringify(newMockData), path.join(__dirname, '../../mockData.json'));
  } catch (e) {
    console.log("error: ", e);
  }
};

export const gqlMockTypeGenerator = (sourcFile?: ts.SourceFile , writeFilePath?: string) => {
  main(sourcFile, writeFilePath);
}
export default gqlMockTypeGenerator;

gqlMockTypeGenerator(); // for actual usage we don't run it manually here.'
