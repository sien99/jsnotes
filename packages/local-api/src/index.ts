import { createCellsRouter } from "./routes/cells";
import path from "path";
//* Provide services as below to browser:
//* GET /  - app assets
//* GET /cells - list of cells
//* POST / cells - store list of cells into a file
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  //console.log("serving traffic on port", port);console.log("saving/fetching cells from", filename);console.log("that file is in dir", dir);
  const app = express();

  // Attempt to use route handler inside routers if file exist
  // Route have to match url & method of incoming req else next
  app.use(createCellsRouter(filename, dir));

  // useProxy when running on development mode
  if (useProxy) {
    // link cli to local dev server
    app.use(
      createProxyMiddleware({
        target: "http://localhost:3000",
        ws: true,
        logLevel: "silent",
      })
    );
  } else {
    //! 1. express.static cannot directly import symbolic links from node_modules
    //* Solution: NodePathResolve return ABSOLUTE PATH of the client build folder
    //~ Ref: https://www.geeksforgeeks.org/node-js-path-resolve-method/
    // packagePath: return C:\Users\""\local-client\build\index.html
    const packagePath = require.resolve(
      "@jsnotescli/local-client/build/index.html"
    );
    // path.dirname: return C:\Users\""\local-client\build\
    app.use(express.static(path.dirname(packagePath)));
  }

  // return promise to be resolve/reject in serve.ts
  // enable asynchronous behavior to catch any error using try catch
  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on("error", reject);
  });
};
