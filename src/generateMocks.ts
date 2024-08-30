import { Node_Type, Obj_T } from "./createObjNode";

export const getMockDataObject = (objectNodes: Obj_T): { [key: string]: any } => {
  const mockData: { [key: string]: any } = {};

  objectNodes.forEach((obj) => {
    switch(obj.type) {
      case Node_Type.ENUM:
        mockData[obj.name] = obj.properties?.at(0)?.value;
        break;
      case Node_Type.TYPE:
        mockData[obj.name] = "{}";
        break;
      case Node_Type.INTERFACE:
        mockData[obj.name] = obj.properties?.reduce((prev, cur) => {
          return ({
            ...prev,
            [cur.name]: cur.value
          });
        }, {} as { [key: string]: any });
        break;
    }
  }, {});
  return mockData;
};

export default getMockDataObject;
