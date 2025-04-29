#! /usr/bin/env node

import { exec, execSync } from "child_process";
import enquirer from "enquirer";
import minimist from "minimist";
const argv = minimist(process.argv.slice(2));
const { Select } = enquirer;

function parseBranchChoices(branches) {
  const choices = branches.split("\n").filter((branch) => branch.trim() !== "");
  const indexOfCurrentBranch = choices.findIndex((choice) =>
    choice.includes("*"),
  );
  choices.splice(indexOfCurrentBranch, 1);

  return choices;
}

function handleBranchSwitch(choices) {
  const prompt = new Select({
    message: "Switch to ..🏃‍♀️",
    choices,
  });

  prompt
    .run()
    .then((answer) => {
      try {
        execSync(`git switch ${answer}`);
      } catch {
        console.error("Oops! Please check the Error ..🤔");
      }
    })
    .catch((promptError) => {
      console.error("Error with prompt...Please Select branch 🪵", promptError);
    });
}

function execSwitchBranch() {
  exec("git branch --sort=-committerdate", (err, stdout) => {
    if (err) {
      console.error(err);
      return;
    }

    const choices = parseBranchChoices(stdout);
    if (choices.length === 0) {
      console.warn("No available branches to switch.");
      return;
    }

    handleBranchSwitch(choices);
  });
}

function switchCBranch() {
  const prompt = new enquirer.Input({
    message: "Enter the name of the new branch",
  });

  prompt
    .run()
    .then((branchName) => {
      try {
        execSync(`git switch -c ${branchName}`);
      } catch (error) {
        console.error("Error creating branch:", error);
      }
    })
    .catch((promptError) => {
      console.error(
        "Error with prompt...Please enter a branch name 🪵",
        promptError,
      );
    });
}

function main() {
  if (argv.c || argv.create) {
    switchCBranch();
  } else if (Object.keys(argv).length === 1 && argv._ && argv._.length === 0) {
    execSwitchBranch();
  } else {
    console.warn(`Please provide a valid option. Available options are:
      '-c --create' create new branch`);
  }
}

main();
