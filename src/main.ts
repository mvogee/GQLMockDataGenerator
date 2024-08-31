import path from "path";
import tsMockTypeGenerator from "./ts/main";
//TODO:
// -- instead of taking a generated ts types file take a .graphql file and mock from that.
// -- how do we deal with union types ? <moneyValue | percentageValue>
// -- instead of a hard list of types and skipping "Scalar" we can allow user defined scalar object to define what scalars exist and what value to return for each

type AcceptedFileTypes = "ts" | "graphql";

export const gqlMockTypeGenerator = (
  sourcFilePath?: string,
  fileType?: AcceptedFileTypes,
  writeFilePath?: string,
) => {
  if (fileType === "ts") {
    tsMockTypeGenerator(
      sourcFilePath ?? path.join(__dirname, "../generated.ts"),
      writeFilePath ?? path.join(__dirname, "../../mockData.json"),
    );
  } else {
    // gql path.
  }
};
export default gqlMockTypeGenerator;

gqlMockTypeGenerator(); // for actual usage we don't run it manually here.'
