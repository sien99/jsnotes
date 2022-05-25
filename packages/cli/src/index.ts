#!/usr/bin/env node
import { serveCommand } from "./commands/serve";
import { program } from "commander";

program.addCommand(serveCommand);

// program to parse the argv, figure out what user try to run
program.parse(process.argv);
