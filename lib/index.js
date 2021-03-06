#!/usr/bin/env node

process.on("unhandledRejection", (err) => { throw err; });

const postToSlack = require("./slack");
const generate    = require("./generate");

const program = require("commander")
  .version(require("../package.json").version)
  .usage("[options] <input file path>")
  .option("-d, --delimiter [char]", "Delimiter character for input file [default: `\\n`]")
  .option("-s, --seed [seed]", "Random seed for pRNG used to order pairings [default: `serendipity`]")
  .option("-m, --message [msg]", "Override the default message. Make sure to include the strings `{{1}}` and `{{2}}`, which will be replaced with names.")
  .option("-t, --token [token]", "Slack token - if this and `channel` are provided, will post message to Slack")
  .option("-c, --channel [channel]", "Slack channel - if this and `token` are provided, will post message to Slack")
  .parse(process.argv);

if (program.args.length === 0) program.help();

const messageText = generate(program.args[0], program);
console.log(messageText);

if (program.token && program.channel) {
  postToSlack(program.token, program.channel, messageText);
}

