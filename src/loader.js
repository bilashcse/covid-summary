const Spinner = require("cli-spinner").Spinner;

const spinnerObj = new Spinner({
  text: "processing.. %s",
  stream: process.stderr,
  onTick: function (msg) {
    this.clearLine(this.stream);
    this.stream.write(msg);
  },
});
module.exports = {
    spinnerObj
};
