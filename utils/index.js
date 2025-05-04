module.exports.generateId = (() => {
    let count = 0;
    return () => {
        return count++;
    };
})();
