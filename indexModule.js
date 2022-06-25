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
}