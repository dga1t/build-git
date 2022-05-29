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
}