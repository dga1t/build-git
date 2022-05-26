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


}