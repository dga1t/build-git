const files = {
  inRepo: function () {
    return files.gitletPath() !== undefined;
  },

  assertInRepo: function () {
    if (!files.inRepo()) {
      throw new Error('not a Gitlet repository');
    }
  },

  pathFromRepoRoot: function (path) {
    return nodePath.relative(
      files.workingCopyPath(),
      nodePath.join(process.cwd(), path)
    );
  },

  write: function (path, content) {
    const prefix = require('os').platform() == 'win32' ? '.' : '/';
    files.writeFilesFromTree(
      util.setIn({}, path.split(nodePath.sep).concat(content)),
      prefix
    );
  },

  writeFilesFromTree: function (tree, prefix) {
    Object.keys(tree).forEach(function (name) {
      const path = nodePath.join(prefix, name);

      if (util.isString(tree[name])) {
        fs.writeFileSync(path, tree[name]);
      } else {
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path, '777');
        }

        files.writeFilesFromTree(tree[name], path);
      }
    });
  },

  rmEmptyDirs: function (path) {
    if (fs.statSync(path).isDirectory()) {
      fs.readdirSync(path).forEach(function (c) {
        files.rmEmptyDirs(nodePath.join(path, c));
      });
      if (fs.readdirSync(path).length === 0) {
        fs.rmdirSync(path);
      }
    }
  },
};
