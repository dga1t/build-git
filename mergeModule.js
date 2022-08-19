const merge = {
  commonAncestor: function (aHash, bHash) {
    const sorted = [aHash, bHash].sort();
    aHash = sorted[0];
    bHash = sorted[1];
    const aAncestors = [aHash].concat(objects.ancestors(aHash));
    const bAncestors = [bHash].concat(objects.ancestors(bHash));
    return util.intersection(aAncestors, bAncestors)[0];
  },

  isMergeInProgress: function () {
    return refs.hash("MERGE_HEAD");
  },

  canFastForward: function (receiverHash, giverHash) {
    return (
      receiverHash === undefined || objects.isAncestor(giverHash, receiverHash)
    );
  },

  isAForceFetch: function (receiverHash, giverHash) {
    return (
      receiverHash !== undefined && !objects.isAncestor(giverHash, receiverHash)
    );
  },

  hasConflicts: function (receiverHash, giverHash) {
    const mergeDiff = merge.mergeDiff(receiverHash, giverHash);
    return (
      Object.keys(mergeDiff).filter(function (p) {
        return mergeDiff[p].status === diff.FILE_STATUS.CONFLICT;
      }).length > 0
    );
  },

  mergeDiff: function (receiverHash, giverHash) {
    return diff.tocDiff(
      objects.commitToc(receiverHash),
      objects.commitToc(giverHash),
      objects.commitToc(merge.commonAncestor(receiverHash, giverHash))
    );
  },

  writeMergeMsg: function (receiverHash, giverHash, ref) {
    const msg = "Merge " + ref + " into " + refs.headBranchName();

    const mergeDiff = merge.mergeDiff(receiverHash, giverHash);
    const conflicts = Object.keys(mergeDiff).filter(function (p) {
      return mergeDiff[p].status === diff.FILE_STATUS.CONFLICT;
    });
    if (conflicts.length > 0) {
      msg += "\nConflicts:\n" + conflicts.join("\n");
    }

    files.write(files.gitletPath("MERGE_MSG"), msg);
  },

  writeIndex: function (receiverHash, giverHash) {
    const mergeDiff = merge.mergeDiff(receiverHash, giverHash);
    index.write({});
    Object.keys(mergeDiff).forEach(function (p) {
      if (mergeDiff[p].status === diff.FILE_STATUS.CONFLICT) {
        index.writeConflict(
          p,
          objects.read(mergeDiff[p].receiver),
          objects.read(mergeDiff[p].giver),
          objects.read(mergeDiff[p].base)
        );
      } else if (mergeDiff[p].status === diff.FILE_STATUS.MODIFY) {
        index.writeNonConflict(p, objects.read(mergeDiff[p].giver));
      } else if (
        mergeDiff[p].status === diff.FILE_STATUS.ADD ||
        mergeDiff[p].status === diff.FILE_STATUS.SAME
      ) {
        const content = objects.read(
          mergeDiff[p].receiver || mergeDiff[p].giver
        );
        index.writeNonConflict(p, content);
      }
    });
  },

  
};
