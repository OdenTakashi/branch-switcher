import { exec } from "child_process";

exec("git branch", (err, stdout) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(stdout);
});
