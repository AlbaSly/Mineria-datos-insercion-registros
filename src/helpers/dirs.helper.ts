import * as fs from "fs";
import * as path from "path";

export class DIRSHelper {
  /**
   * Método que permite obtener la ubicación de un archivo .csv en la carpeta data del proyecto
   * @param csvFileName nombre del archivo csv a buscar (no incluir extensión .csv)
   * @returns directorio
   */
    static async getProjectCSVDIR(csvFileName: string): Promise<string> {
      
      const EXTENSION: string = ".csv";

      let projectPath: string | Array<string>  = path.join(__dirname).split("/");
      projectPath.pop();
      projectPath.pop();
      projectPath.push("data");
      projectPath.push(csvFileName + EXTENSION);
      projectPath = projectPath.join("/");
  
      //SOLAMENTE SI SE ESTÁ LEYENDO UN DIRECTORIO
      // fs.readdir(projectPath, (e, files) => {
      //   if (e) console.log(e);
      //   if (files.length) files.forEach(f => console.log(f));
      // });

      return projectPath;
    }
}