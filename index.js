const fs = require('fs');
const nodePath = require('path');
const { config } = require('process');

const gitlet = module.exports = {
    
    init: function(opts) {

        if (FileSystem.inRepo()) { return; }

        opts = opts || {};

        const gitletStructure = {
            HEAD: "ref: refs/heads/master\n",

            config: config.objToStr({ core: { "": { bare: opts.bare === true }}}),

            objects: {},
            refs: {
                heads: {},
            }
        };

        files.writeFilesFromTree(opts.bare ? gitletStructure : { ".gitlet": gitletStructure }, process.cwd());
    },

    add: function(path, _) {
        files.assertInRepo();
        config.assertNotBare();

        const addedFiles = files.IsRecursive(path);

        if (addedFiles.length === 0) {
            throw new Error(files.pathFromRepoRoot(path) + " did not match any files");
        } else {
            addedFiles.forEach(function(p) { gitlet.update_index(p, { add: true }); });
        }
    },
}