const status = {
  toString: function () {
    function untracked() {
      return fs.readdirSync(files.workingCopyPath()).filter(function (p) {
        return index.toc()[p] === undefined && p !== '.gitlet';
      });
    }

    function toBeCommitted() {
      const headHash = refs.hash('HEAD');
      const headToc = headHash === undefined ? {} : objects.commitToc(headHash);
      const ns = diff.nameStatus(diff.tocDiff(headToc, index.toc()));
      return Object.keys(ns).map(function (p) {
        return ns[p] + ' ' + p;
      });
    }

    function notStagedForCommit() {
      const ns = diff.nameStatus(diff.diff());
      return Object.keys(ns).map(function (p) {
        return ns[p] + ' ' + p;
      });
    }

    function listing(heading, lines) {
      return lines.length > 0 ? [heading, lines] : [];
    }

    return util
      .flatten([
        'On branch ' + refs.headBranchName(),
        listing('Untracked files:', untracked()),
        listing('Unmerged paths:', index.conflictedPaths()),
        listing('Changes to be committed:', toBeCommitted()),
        listing('Changes not staged for commit:', notStagedForCommit()),
      ])
      .join('\n');
  },
};
