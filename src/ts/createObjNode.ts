import ts from 'typescript';

export enum Node_Type {
  INTERFACE,
  ENUM,
  TYPE,
}

interface Node_Obj {
  type: Node_Type,
  name: string,
  properties?: Property[],
}

interface Property {
  name: string,
  value: any,
}

export type Obj_T = Node_Obj[];

const getCurrentType = (propType: string): [curType: string, remainingType: string] => {
  let currentType = '';

  for (let i = 0; i < propType.length; i++) {
    const curChar = propType.charAt(i);
    switch (curChar) {
      case '<':
      case '>':
      case '[':
      case ']':
      case "'":
        if (currentType) {
          return [currentType, propType.slice(i + 1)]
        }
        break;
      default:
        currentType += curChar;
    }
  }
  return [currentType, ""];
}

const createProperty = (member: ts.TypeElement): Property => {
  const propType = ts.isPropertySignature(member) ? member.type?.getText() : "any";
  const propName = member.name?.getText() || "";
  const value = propName === '__typename' ? propType?.replace(RegExp("'", "g"), "") : createMockData(propType);
  const property: Property = {
    name: propName,
    value: value,
  }
  return property;
}

const createMockData = (propType: string | undefined): any => {
  // how do we deal with multiple types such as <team | teamBasic>??
  if (!propType) {
    return;
  }
  const [curType, remainingTypes] = getCurrentType(propType);

  if (!curType || curType === 'InputMaybe') {
    return;
  }

  switch(curType) {
    //skip cases
    case 'Maybe':
    case 'Scalars':
      return createMockData(remainingTypes);

    case 'Array':
      return [createMockData(remainingTypes), createMockData(remainingTypes), createMockData(remainingTypes)];

    // Scalar types
    case 'ID':
      return 'ID-123'
    case 'String':
      return 'mock-string-data'
    case 'Boolean':
      return true;
    case 'Int':
      return 123;
    case 'Float':
      return 123.45;
    case 'Base64ID':
      return 'xxyMockBase64IDld'
    case 'CalendarDateRange':
      return { start: "2023-01-01", end: "2023-12-31" };
    case 'CopyString':
      return 'mock-copy-string';
    case 'Date':
      return '2023-01-01';
    case 'HexColor':
      return '#FFFFFF';
    case 'PagingToken':
      return 'mock-paging-token';
    case 'Svg':
      return '<svg></svg>';
    case 'TimestampSeconds':
      return 1724960087;
    case 'Url':
      return 'https://example.com';

    //primitives
    case 'string':
      return "mock-data-string";
    case 'number':
      return 1234;
    case 'boolean':
      return true;
    case 'any':
      return "any value??"
    case '{ start: string, end: string }': // singular case in scalars object where type is literal
      return { start: "2024-01-01", end: "2024-12-31" }

    // references another interface
    default:
      // handling union types is weird.. type1 | type2
      // for now just breaking string on | and using index 0
      const unions = curType.split('|');
      return { $ref: "#/" + unions[0].trim()};
  }
}

const handleNode = (node: ts.Node) => {

}

export const createObjNodes = (sourceFile: ts.SourceFile) => {
  const mocks: Obj_T = [];
  sourceFile.forEachChild((node) => {
    if (ts.isInterfaceDeclaration(node)) {
      const nodeObj: Node_Obj = {
        type: Node_Type.INTERFACE,
        name: node.name.getText(),
        properties: node.members.map(createProperty),
      };
      mocks.push(nodeObj);
    } else if (ts.isEnumDeclaration(node)) {
      const enumNodeObj: Node_Obj = {
        type: Node_Type.ENUM,
        name: node.name.getText(),
        properties: node.members.map((member) => (
            {name: member.name.getText(), value: member.name.getText()}
          )
        ),
      }
      mocks.push(enumNodeObj);
    } else if (ts.isTypeAliasDeclaration(node)) {
      const typeNodeObj: Node_Obj = {
        type: Node_Type.TYPE,
        name: node.name.getText(),
        properties: [{name: "", value: node.type.getFullText()}]
      }
      mocks.push(typeNodeObj);
    }
  });
  return mocks;
}

export default createObjNodes;
