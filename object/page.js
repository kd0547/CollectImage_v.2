const parser = require('cheerio');
const  reg  = require('../Util/regex');
const val = require('../validation/validation');
let body;

/*
    메인 페이지에서 URL을 가져오는 함수 
*/
function getURL(body) {
    var pageURL = [];
    var $ = parser.load(body);
    $('div.item-thumb > a.item-link').each((index, data) => {
        pageURL.push(data.attribs.href);
    })
    //console.log(pageURL);
    return pageURL;
}

/*
    메인 페이지에서 태그를 가져오는 함수 
*/
function getTag(body) {
    var tag = [];
    var $ = parser.load(body);
    $('div.item-tags').each((index, data) => {
        tag.push($(data).find('span').text().split('#'));
    })
    return tag;
}

/*
    메인 페이지에서 제목을 가져오는 함수 
*/
function getSubject (body) {
    var itemName = [];
    var $ = parser.load(body);
    $('div.page-header > h2').each((index, data) => {
        itemName.push($(data).text().replace(/\n|\r|\s*/g, ""));
    })

    return itemName;
}


function JSONparser(URL, tag, name) {
    var count = URL.length;

    var tempList = new Array();
    for (var i = 0; i < count; i++) {
        var temp = new Object;

        var NTagDel = tag[i].filter(function (item) { return item !== null && item !== undefined && item !== '' });
        temp.count = i;
        temp.url = URL[i];
        temp.tag = NTagDel;

        temp.attr = val.findModelAndCompany(NTagDel,name[i]);

        temp.name = name[i];
        temp.IsKorea = (() => {
            return reg.korea(name[i]) != -1 ? 'korea' : 'null';

        })();

        tempList.push(temp);
    }
    return JSON.stringify(tempList);
}

module.exports = {
    getURL : getURL,
    JSONparser : JSONparser,
    getSubject : getSubject,
    getTag : getTag
};




/*
page = function () {
    return {
        // 페이지 
        page_repo: [],
        page_count: 0,
        page_length: page_repo.page_length,
        setPageCount: function (count) {
            this.page_count = count;
        },
        getPageCount: function () {
            return page_count;
        }
    }
}

*/
