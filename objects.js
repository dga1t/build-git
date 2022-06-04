const util = require('util');

const objects = {
    writeTree: function (tree) {
        const treeObject = Object.keys(tree).map(function (key) {
            if (util.isString(tree[key])) {
                return "blob " + tree[key] + " " + key;
            } else {
                return "tree " + objects.writeTree(tree[key]) + " " + key;
            }
        }).join("\n") + "\n";

        return objects.write(treeObject);
    },

    fileTree: function (treeHash, tree) {
        if (tree === undefined) { return objects.fileTree(treeHash, {}); }

        util.lines(objects.read(treeHash)).forEach(function (line) {
            const lineTokens = line.split(/ /);

            tree[lineTokens[2]] = lineTokens[0] === "tree" ?
                objects.fileTree(lineTokens[1], {}) :
                lineTokens[1];
        });

        return tree;
    },

    writeCommit: function (treeHash, message, parentHashes) {
        return objects.write("commit " + treeHash + "\n" +
            parentHashes.map(function (h) { return "parent " + h + "\n"; }).join("") +
            "Date:  " + new Date().toString() + "\n" + "\n" + "    " + message + "\n");
    },

    write: function (str) {
        files.write(nodePath.join(files.gitletPath(), "objects", util.hash(str)), str);
        return util.hash(str);
    },

    isUpToDate: function (receiverHash, giverHash) {
        return receiverHash !== undefined && (receiverHash === giverHash || objects.isAncestor(receiverHash, giverHash));
    },

    exists: function (objectHash) {
        return objectHash !== undefined &&
            fs.existsSync(nodePath.join(files.gitletPath(), "objects", objectHash));
    },

    read: function (objectHash) {
        if (objectHash !== undefined) {
            const objectPath = nodePath.join(files.gitletPath(), "objects", objectHash);

            if (fs.existsSync(objectPath)) return files.read(objectPath);
        }
    },
}