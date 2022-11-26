const request = require('./src/object/request')
const qs = require('querystring');
const util = require('./src/Util/util');
const page = require('./src/object/page');
const image = require('./src/object/Image')

const blacklistModel = require('./src/validation/model_blackList');

const fileIo = require('.//src/file/fileIo');

/**
 * String 형태의 JSON을 JSON으로 변환하는 함수 
 * @param {*} array 
 * @returns 
 */
function ArraytoJSON(array) {
    return JSON.parse(array);
}


function extractImage(pageJSON) {
    var countPageJSON = pageJSON.length;

    for (var i = 0; i < countPageJSON; i++) {

    }

    // console.log(pageJSON);

}


function repeatBlacklist(model) {
    var count = blacklistModel.model.length;

    for (var i = 0; i < count; i++) {

        if (model === blacklistModel.model[i]) {

            return blacklistModel.model[i];
        }
    }
    return null;
}

function removeBlacklistModel(pageJSON) {
    var countPageJSON = pageJSON.length;


    //console.log(blacklistModel.model);

    for (var i = 0; i < countPageJSON; i++) {
        var eq = pageJSON[i].attr.model;

        if (repeatBlacklist(eq) != null) {
            pageJSON[i] = null;
        }
    }
    return pageJSON;
}
function isBlacklistModel(src, des) {
    return src === des;
}
function writeFileJSON(data) {
    fileIo.writeSaveFile(data);
}
/**
 * 저장된 이미지인지 확인
 */
let saveImgJSONArray = [];


async function isSaveFile(searchURL, searchName) {


    await setSaveImgJSONArray();
    //console.log(saveImgJSONArray);

    var saveImgCount = saveImgJSONArray.length;
    var i = 0;
    while (i < saveImgCount) {
        var saveFileJson = saveImgJSONArray[i];
        var count = saveFileJson.length;
        for (var index = 0; index < count; index++) {

            if (isNotNull(saveFileJson, index)) {

                if (isEqNameANDURL(saveFileJson, index, searchURL, searchName)) {

                    return true;
                }
            }

        }

        i++;
    }
}


(async function () {
    //save 파일 환경 설정
    await fileIo.setEnv();


    /**
     * 데이터 1차 수집 - 메인 페이지에서 이미지 제목,태그, URL을 수집과 모델,회사를 비교해 블랙리스트를 조회 후 제거 > JSON 변환 
     */

    console.time('collection_endTime');
    for (var k = 0; k <= 20; k = k + 20) {
        var url = await request.URLRequest(util.mainURL + k);

        var collectMainPage = page.JSONparser(page.getURL(url), page.getTag(url), page.getSubject(url));
        var mainPageJSON = ArraytoJSON(collectMainPage);

        var removeBlacklistJSON = removeBlacklistModel(mainPageJSON);
        //console.log(removeBlacklistJSON);
        /**
         * 
         */
        //console.log(removeBlacklistJSON);
        var saves = [];
        removeBlacklist(removeBlacklistJSON, saves);
        /**
         * 저장된 이미지 필터링
         */
        await RemoveAlreadyInIamgeFile(saves);
        //console.log(saves);

        /**
         * 이미지 페이지 요청 
         * 
         */

        var imgPagecount = mainPageJSON.length;
        console.time('requestImagePage_endTime');
        var imagePageJSON = await requestImagePage(imgPagecount, mainPageJSON);
        console.timeEnd('requestImagePage_endTime');
        //console.log(imagePageJSON);
        //console.log(imagePageJSON);
        /**
         * 이미지 저장 
         * 
         */
        saveImageStart(saves,imagePageJSON);

    }
    console.timeEnd('collection_endTime');



})();




/**
 * 
 * @param {String} folderName 
 * @param {Array} imagePageJSON 
 */
async function saveImageStart(folderName, imagePageJSON) {
    
    console.time('SaveImage : ');
    for (let index; index < imagePageJSON.length; index++) {
        saveImage(folderName[index], imagePageJSON[index]);
    }
    console.timeEnd('SaveImage : ');
}

/**
 * 
 * @param {*} fileJSON 
 * @param {*} imgJSON 
 */
async function saveImage(fileJSON, imgJSON) {
    var removeSpecialStringFolder = fileJSON.name.replace(/[\/\\^$*."":+?{}@]+/g, " ")
    await fileIo.createFolder(removeSpecialStringFolder);
    
    RequestImgAndSaveFile(imgJSON, removeSpecialStringFolder);

}

/**
 * 
 * @param {Array} imgJSON 
 * @param {String} removeSpecialStringFolder 
 */
async function RequestImgAndSaveFile(imgJSON, removeSpecialStringFolder) {
    //console.time('SaveImage : ');
    //console.log(imgJSON.length);
    for (let a = 0; a < imgJSON.length; a++) {
        var img = imgJSON[a];
        for (let s = 0; s < img.length; s++) {
            //console.log(img[s].url);
            var getMetaImage = await request.RequestImage(img[s].url);

            await fileIo.saveRequestImage(removeSpecialStringFolder, img[s].imgName, getMetaImage);

        }

    }
    //console.timeEnd('SaveImage : ');
}
/**
 * 
 * @param {Integer} pageItemCount 
 * @param {Array} mainPageJSON 
 * @returns 
 */
async function requestImagePage(pageItemCount, mainPageJSON) {
    var pagePerImageJSON = []; //
    for (var i = 0; i < pageItemCount; i++) {
       
        //url 인코딩

        if(mainPageJSON[i] == null) {
            break;
        }

        var imgurl = util.encoding(mainPageJSON[i].url.replace("/", ""));

        /**
         * 페이지의 수를 찾기 위한 사전 요청 
         */
        var RequestfirstPage = await request.URLRequest(tempMainURL + imgurl);
        var pagingCount = image.getCount(RequestfirstPage);

        /**
         * 
        */
        var imageJSON = await getJSONImageItem(pagingCount, tempMainURL, imgurl);
        
        pagePerImageJSON.push(imageJSON);
        //console.log(imageJSON);
        //pagePerImageJSON.push(await getJSONImageItem(pagingCount, tempMainURL, imgurl));
        //console.log(pagePerImageJSON);
    }
    return pagePerImageJSON;
}
/**
 * 페이지를 요청하고 Name과 URL을 찾아서 JSON 형태로 변환 후 배열에 저장한다
 * 
 * @param {Integer} pagingCount 
 * @param {String} tempURL 
 * @param {String} imgurl 
 * @returns {Array} JSON 형태를 저장한 배열이 반환된다.
 */
async function getJSONImageItem(pagingCount, tempMainURL, imgurl) {
    var imagePageItem = [];

    for (var j = 0; j < pagingCount + 1; j++) {
        var imgpage = await request.URLRequest(tempMainURL + imgurl + "?page=" + j);

        var imgNameList = image.getImgName(imgpage);
        var imgUrlList = image.getImgURL(imgpage);

        var collectImgPage = image.JSONparser(imgUrlList, imgNameList);
        var imgJSON = ArraytoJSON(collectImgPage);
        //console.log(imgJSON);
        imagePageItem.push(imgJSON);
    }

    return imagePageItem;
}

function removeBlacklist(removeBlacklistJSON, saves) {
    for (var i = 0; i < removeBlacklistJSON.length; i++) {
        //console.log(removeBlacklistJSON[i]);
        if (removeBlacklistJSON[i] != null) {
            saves.push(removeBlacklistJSON[i]);
        }
    }
}

async function RemoveAlreadyInIamgeFile(saves) {
    for (let j = 0; j < saves.length; j++) {
        var SURL = saves[j].url;
        var SName = saves[j].name;
        var isFile = await isSaveFile(SURL, SName);


        if (isFile) {
            saves[j] = null;
        }
    }
}

function isNotNull(saveFileJson, index) {
    return saveFileJson[index] != null;
}

function isEqNameANDURL(saveFileJson, index, searchURL, searchName) {
    return saveFileJson[index].url === searchURL || saveFileJson[index].name === searchName;
}

/**
 * file.js 안으로 넘겨서 사용
 */
async function setSaveImgJSONArray() {
    if (saveImgJSONArray.length == []) {
        while (fileIo.File.position < fileIo.File.size) {
            var saveFiles = await fileIo.getJSONArrayToSaveFile();
            saveImgJSONArray.push(JSON.parse(saveFiles));
        }
        fileIo.File.Handler.close();

    }
}
