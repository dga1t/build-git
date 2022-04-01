const fs = require('fs');
const nodePath = require('path');
const { config } = require('process');

const gitlet = module.exports = {

    init: function (opts) {

        if (FileSystem.inRepo()) { return; }

        opts = opts || {};

        const gitletStructure = {
            HEAD: "ref: refs/heads/master\n",

            config: config.objToStr({ core: { "": { bare: opts.bare === true } } }),

            objects: {},
            refs: {
                heads: {},
            }
        };

        files.writeFilesFromTree(opts.bare ? gitletStructure : { ".gitlet": gitletStructure }, process.cwd());
    },

    add: function (path, _) {
        files.assertInRepo();
        config.assertNotBare();

        const addedFiles = files.IsRecursive(path);

        if (addedFiles.length === 0) {
            throw new Error(files.pathFromRepoRoot(path) + " did not match any files");
        } else {
            addedFiles.forEach(function (p) { gitlet.update_index(p, { add: true }); });
        }
    },

    rm: function (path, opts) {
        files.assertInRepo();
        config.assertNotBare();
        opts = opts || {};

        const filesToRm = index.matchingFiles(path);

        if (opts.f) {
            throw new Error('unsupported');
        }
        else if (filesToRm.length === 0) {
            throw new Error(files.pathFromRepoRoot(path) + " did not match any files");
        }
        else if (fs.existsSync(path) && fs.statSync(path).isDirectory() && !opts.r) {
            throw new Error("not removing " + path + " recursively without -r");
        }
        else {
            const changesToRm = util.intersection(diff.addedOrModifiedFiles(), filesToRm);
            if (changesToRm.length > 0) {
                throw new Error("these files have changes:\n" + changesToRm.join("\n") + "\n");
            }
            else {
                filesToRm.map(files.workingCopyPath).filter(fs.existsSync).forEach(fs.unlinkSync);
                filesToRm.forEach(function (p) { gitlet.update_index(p, { remove: true }); });
            }
        }
    },
}