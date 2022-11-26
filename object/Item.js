// 페이지 
var Item = Item || {};


Item = function(){
    return {
        //Item URL을 저장하는 배열
        Item_repo : [],

        Item_count : 0,
        setItemCount : function(count) {
            this.page_count = count;
        },
        getItemCount : function() {
            return page_count;
        }
    }
}


export {Item};