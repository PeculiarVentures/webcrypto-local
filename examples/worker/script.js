// @ts-check

var worker = new Worker("worker.js");

worker.addEventListener("message", function(e) {
    console.log("Script::Message:", e);
});

