const parseOptions = function (argv) {
  let name;

  return argv.reduce(
    function (opts, arg) {
      if (arg.match(/^-/)) {
        name = arg.replace(/^-+/, '');
        opts[name] = true;
      } else if (name !== undefined) {
        opts[name] = arg;
        name = undefined;
      } else {
        opts._.push(arg);
      }

      return opts;
    },
    { _: [] }
  );
};

const runCli = (module.exports.runCli = function (argv) {
  const opts = parseOptions(argv);
  const commandName = opts._[2];

  if (commandName === undefined) {
    throw new Error('you must specify a Gitlet command to run');
  } else {
    const commandFnName = commandName.replace(/-/g, '_');
    const fn = gitlet[commandFnName];

    if (fn === undefined) {
      throw new Error("'" + commandFnName + "' is not a Gitlet command");
    } else {
      const commandArgs = opts._.slice(3);
      while (commandArgs.length < fn.length - 1) {
        commandArgs.push(undefined);
      }

      return fn.apply(gitlet, commandArgs.concat(opts));
    }
  }
});

if (require.main === module) {
  try {
    const result = runCli(process.argv);
    if (result !== undefined) {
      console.log(result);
    }
  } catch (e) {
    console.error(e.toString());
  }
}
