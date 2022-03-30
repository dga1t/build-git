const fs = require('fs');
const nodePath = require('path');

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
    }
}