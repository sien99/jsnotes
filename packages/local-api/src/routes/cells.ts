import path from "path";
import express from "express";
import fs from "fs/promises"; // prefer using promises over handling async logic using cb function

interface Cell {
  id: string;
  content: string;
  type: "text" | "code";
}

// export out as a function to call it with dir and filename
export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json()); // body parser middleware
  const fullPath = path.join(dir, filename);

  router.get("/cells", async (req, res) => {
    try {
      // Read the file
      const result = await fs.readFile(fullPath, { encoding: "utf-8" });
      if (result) res.send(JSON.parse(result));
    } catch (error: any) {
      // If read throws error, inspect error and check if file exist
      if (error.code === "ENOENT") {
        // Add code to create a file and add default cells
        await fs.writeFile(fullPath, "[]", "utf-8");

        res.send([]);
      } else {
        throw error;
      }
    }
    // Parse a list of cells out of it
    // Send list of cells back to browser
  });

  router.post("/cells", async (req, res) => {
    // Take the list of cells from the req object
    // serialize them
    const { cells }: { cells: Cell[] } = req.body;
    console.log(req.body);

    // Write cells into the file, utf-8 plain text encoding

    await fs.writeFile(fullPath, JSON.stringify(cells), "utf-8");

    res.send({ status: "ok" }); // feedback indicate successful write op.
  });

  // to wired up with the express app
  return router;
};
