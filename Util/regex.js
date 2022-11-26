
/*

korea = function korReg(str) {
    const korReg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

    return str.search(korReg);
}
*/

module.exports = {
    korea : function korReg(str) {
        const korReg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    
        return str.search(korReg);
    }
};