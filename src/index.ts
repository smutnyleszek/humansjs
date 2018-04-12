import { Log } from "./log";

const myLog = new Log();

((): void => {
  myLog.log("I'm alive!");
  myLog.log("Haha");

  window.setTimeout(() => {
    myLog.log("After a while…");
  }, 1000);
})();
