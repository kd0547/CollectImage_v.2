const request = require('request');


/*
    @param 
    @return promise 
*/

module.exports = {
    URLRequest: function (URL) {
        return new Promise((resolve, reject) => {
            request(URL, (error, res, body) => {
                if (!error && res.statusCode == 200) {
                    resolve(body);
                } else {
                    reject(error);
                }
            })
        })

    },
    //location,directoryName,imageName,
    RequestImage: function (imgURL) {
        return new Promise(function (resolve, reject) {
            //https://stackoverflow.com/questions/43487543/writing-binary-data-using-node-js-fs-writefile-to-create-an-image-file
            let header = {
                headers: {
                    'Content-Type': 'image/jpeg',
                },
                encoding: 'binary'
            }

            request(imgURL, header, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve(body);
                } else {
                    reject(error);
                }
               

            });
        })
    }
}