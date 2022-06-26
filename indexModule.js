const index = {

    hasFile: function(path, stage) {
        return index.read()[index.key(path, stage)] !== undefined;
    },

    read: function() {
        const indexFilePath = files.gitletPath("index");

        return util.lines(fs.existsSync(indexFilePath) ? files.read(indexFilePath) : "\n")
            .reduce(function(idx, blobStr) {
                const blobData = blobStr.split(/ /);
                idx[index.key(blobData[0], blobData[1])] = blobData[2];
                return idx;
            }, {});
    },

    key: function(path, stage) {
        return path + "," + stage;
    },

    keyPieces: function(key) {
        const pieces = key.split(/,/);
        return { path: pieces[0], stage: parseInt(pieces[1]) };
    },

    toc: function() {
        const idx = index.read();
        return Object.keys(idx).reduce(function(obj, k) { return util.setIn(obj, [k.split(",")[0], idx[k]]); }, {});
    },

    isFileInConflict: function(path) {
        return index.hasFile(path, 2);
    },
}