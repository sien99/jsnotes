import { serve } from "@jsnotescli/local-api";
import { Command } from "commander";
import path from "path"; // node standard library

//* Better approach is to inject a script to find this variable
//* and replace it with production during build stage
//* else in dev mode, process.env.NODE_ENV is undefined
const isProduction = process.env.NODE_ENV === "production";

export const serveCommand = new Command()
  .command("serve [filename]")
  .description("Open a file for editing")
  .option("-p, --port <number>", "port to run server on", "4005")
  .action(async (filename = "notebook.js", options: { port: string }) => {
    try {
      // cwd: domain that user run command from, dirname: parent dir for the file || ''
      const dir = path.join(process.cwd(), path.dirname(filename));
      // basename: just the file name || ''
      await serve(
        parseInt(options.port),
        path.basename(filename),
        dir,
        !isProduction // useProxy: false when !production
      );
      console.log(
        `Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file.`
      );
    } catch (err: any) {
      // if (err.code === "ENOENT") {}
      if (err.code === "EADDRINUSE") {
        console.error("Port is in use. Try running on a different port.");
      } else {
        console.log("Heres the problem", err.message);
      }
      process.exit(1); // exits programn due to unsuccessful run
    }
  });
