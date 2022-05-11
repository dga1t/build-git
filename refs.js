const refs = {

    isRef: function (ref) {
        return ref !== undefined && (ref.match("^refs/heads/[A-Za-z-]+$") ||
            ref.match("^refs/remotes/[A-Za-z-]+/[A-Za-z-]+$") ||
            ["HEAD", "FETCH_HEAD", "MERGE_HEAD"].indexOf(ref) !== -1)
    },

    terminalRef: function(ref) {

        if (ref === "HEAD" && !refs.isHeadDetached()) {
            return files.read(files.gitletPath("HEAD")).match("ref: (refs/heads/.+)")[1];

        } else if (refs.isRef(ref)) {
            return ref;

        } else {
            return refs.toLocalRef(ref);
            
        }
    },

    
}