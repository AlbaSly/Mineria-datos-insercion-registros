import * as fs from "fs";
import * as path from "path";

export class DIRSHelper {
  /**
   * Método que permite obtener la ubicación de un archivo .json en la carpeta data del proyecto
   * @param jsonFileName nombre del archivo JSON a buscar (no incluir extensión .json)
   * @returns directorio
   */
    static async getJSONFile(jsonFileName: string): Promise<string> {
      
      const EXTENSION: string = ".json";

      let projectPath: string | Array<string>  = path.join(__dirname).split("/");
      projectPath.pop();
      projectPath.pop();
      projectPath.push("data");
      projectPath.push(jsonFileName + EXTENSION);
      projectPath = projectPath.join("/");
  
      //SOLAMENTE SI SE ESTÁ LEYENDO UN DIRECTORIO
      // fs.readdir(projectPath, (e, files) => {
      //   if (e) console.log(e);
      //   if (files.length) files.forEach(f => console.log(f));
      // });

      return projectPath;
    }
}