const parser = require('cheerio');

function getCount(data) {
    var $ = parser.load(data);
    var count = $('div.pagination-list > span').length/2;
    return count
}

function getImgURL(data) {
    var $ = parser.load(data);
    var imgURL = [];

    $('div.article-fulltext > p > img').get().forEach((e)=> {
        imgURL.push(e.attribs.src.replace("?q=90",""));
    })

    return imgURL;
}

function getImgName(data) {
    var $ = parser.load(data);
    var imgName = [];

    $('div.article-fulltext > p > img').get().forEach((e)=> { 
        imgName.push(e.attribs.alt); 
    })

    return imgName;
}
/**
 * 
 * @param {*} url url : 이미지 리스트 
 * @param {*} name 
 * @returns 
 */
function JSONparser(url,name) {

    var list = new Array();
    for(var i=0;i<url.length;i++) {
        var temp = new Object;
        temp.count = i;
        temp.url = url[i];
        temp.imgName = name[i];

        list.push(temp);
    }

    return JSON.stringify(list);
}

module.exports = {
    getImgURL : getImgURL,
    getImgName : getImgName,
    getCount : getCount, 
    JSONparser : JSONparser
}




/*
// 페이지 
var image = image || {};


image = function(){
    return {
        
            이미지를 배열의 형태로 저장
        
        image_repo : [],

        image_count : 0,
        setImageCount : function(count) {
            this.page_count = count;
        },
        getImageCount : function() {
            return page_count;
        }
    }
}
*/