const action = require('./action');
const model = require('./model');
const company = require('./company');
/*
    데이터 파싱을 위한 RegExp 
*/
const FileNameReg = /alt="[/一-龥/가-힇ㄱ-ㅎㅏ-ㅣ/a-zA-Z/0-9/]*[/@/\s/\S]*[)]+/g;
const FileNameReplace3 = /[^一-龥ぁ-ゔァ-ヴー々〆〤가-힇ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\t()\s]+/g;


 



function searchAction(str) {
    var count = action.action.length;
    var i = 0;

    while(i < count) {
        if(hasAction(str,action.action[i])) {
            return action.action[i];
        }
        i++;
    }
    return null;
}





function findModelAndCompany(tag,name) {
    var temp = new Object();
    var count = tag.length;


    for (var i = 0; i < count; i++) {

        if(searchAction(tag[i])) {
            temp.action = tag[i];
        } 

        if(company.searchCompany(tag[i])) {
            temp.company = tag[i];
        } 

        if(model.searchModel(tag[i])) {
            temp.model = tag[i];
        } 
    }

    if(temp.company == undefined) {
        temp.company = company.containCompany(name);
    }
    if(temp.model == undefined) {
        
        temp.model = model.containModel(name);
    }

    
    if(temp.company == undefined) {
        temp.company = tag[0];
    }
    if(temp.model == undefined) {
        temp.model = tag[1];
    }
   

    //console.log(temp);

    return temp;
}




function getInstanceof(attr) {
    var count = foreachTest.length;
    var i = 0;
    while(i < count) {
        var test = foreachTest[i];
        console.log(typeof foreachTest[i])
        console.log(test instanceof attr);
        i++
    }
}

function hasAction(src,des){
    return src === des
}

(function() {
   
    
})();

module.exports =  {
    searchAction : searchAction,
    findModelAndCompany : findModelAndCompany,

}

