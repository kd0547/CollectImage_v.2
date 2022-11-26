
/*
    이미지를 저장하기 위해 저장경로 설정, 파일 이름을 위한 JS파일 
*/
const fs = require('fs').promises;
/*
    fileIo 설정을 json 타입으로 관리 하기 위해 별
*/
const env = require('./fileEnv.json');;

/*
    fileUtil.json 검사 
*/

var File = {
    Handler: null,
    size: 0,
    buffer_size: 1024,
    StringBuffer: "",
    position: 0,
    start: 0,
    end: 0
};
async function setEnv() {
    console.log("파일 경로 설정 시작... ");

    if (File.fileHandle == null) {
        await openFileModeAplus(File, env);
    }

};

async function getJSONArrayToSaveFile() {
    var JSONArray = "";
    var StringTemp = "";
    // 
    while (File.position < File.size) {
        var temp = await readFile(File.position);
        File.StringBuffer += temp.buffer.toString();
        //console.log(File.position)

        File.position = File.position + File.buffer_size;
        if (File.StringBuffer.indexOf("}]") != -1) {
            break;
        }

    }
    //console.log(File.StringBuffer)



    File.end = File.StringBuffer.indexOf("}]") + 1;
    // 문자열 중에서 "}]"를 찾아서 index 까지 반복 후 JSON을 만들기 위한 배열을 생성
    for (var t = 0; t <= File.end; t++) {
        JSONArray += File.StringBuffer[t];
    }

    // 남은 문자열을 str 맨 앞에 위치 
    var ClearCount = File.end + 1;
    for (ClearCount; ClearCount < File.StringBuffer.length; ClearCount++) {
        StringTemp += File.StringBuffer[ClearCount];
    }
    File.StringBuffer = StringTemp;

    return JSONArray;
}


async function isFile() {
    console.log("경로에서 파일을 확인 중입니다.... ");
    return fs.stat(env.url.save_file);
}

async function openFileModeAplus(savefile, env) {

    var hasFile = await isFile();
    if (hasFile != null) {
        console.log("파일 크기 저장.... ");
        savefile.size = hasFile.size;
    }

    savefile.Handler = await fs.open(env.url.save_file, 'a+')


}



async function saveRequestImage(folder, fileName, getMetaImage) {
    var saveImageURL = "G:\\modelDB/" + folder + "/" + fileName.replaceAll(/[\/\\^$*"":+?{}@]+/g, "") + ".jpg";
    //console.log(saveImageURL)

    await fs.writeFile(saveImageURL, getMetaImage, 'binary');
}

async function readFile(position) {
    var buffer = new Buffer.alloc(File.buffer_size);

    if (File.Handler == null) {
        return null;
    }

    return File.Handler.read(buffer, 0, File.buffer_size, position);
}

async function createFolder(createDirPath) {

    try {
        console.log("폴더 확인 중입니다.")
        await fs.readdir(createDirPath)

    } catch (error) {
        //console.log(error.code);
        if (error.code === 'ENOENT') {
            //await fs.mkdir(env.url.location + createDirPath);

            new Promise(function (resolve, reject) {
                if (resolve) {
                    //console.log("폴더 생성");

                    fs.mkdir(env.url.location + createDirPath)
                        .catch((error)=> {
                            if(error.code === 'EEXIST') {
                                //console.log("파일이 존재합니다.");
                            }
                        });

                } else if (reject) {
                    //console.log("error : "+reject);
                }
            })

        } 

    } 

}


module.exports = {
    File,
    setEnv: setEnv,
    getJSONArrayToSaveFile: getJSONArrayToSaveFile,
    createFolder: createFolder,

    saveRequestImage: saveRequestImage
}