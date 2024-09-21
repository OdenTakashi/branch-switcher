#! /usr/bin/env node

import { exec, execSync } from "child_process";
import enquirer from "enquirer";
const { Select } = enquirer;

function parseBranchChoices(branches) {
  const choices = branches.split('\n').filter(branch => branch.trim() !== '');
  const indexOfCurrentBranch = choices.findIndex(choice => choice.includes('*'));
  choices.splice(indexOfCurrentBranch, 1);

  return choices
}

exec("git branch", (err, stdout) => {
  if (err) {
    console.log(err);
    return;
  }

  const choices = parseBranchChoices(stdout)

  const prompt = new Select({
    message: "You wanna switch to ..🏃‍♀️",
    choices,
  });

  prompt
    .run()
    .then((answer) => {
      try {
        execSync(`git switch ${answer}`);
      } catch {
        console.log("Oops! Please check the Error ..🤔");
      }
    })
    .catch((promptError) => {
      console.error("Error with prompt...Please Select branch 🪵", promptError);
    });
});
