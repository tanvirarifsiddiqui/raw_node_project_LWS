/*
 * Title: Data Manipulating Script
 * Description: Here All Scripts are about data related
 * Author: Md. Tanvir Arif Siddiqui
 * Date: 7/1/2025
 * Time: 4:00 PM
 */

//dependencies
const fs = require('fs');
const path = require('path');

//module scaffolding
const lib = {};

//base directory of data folder
lib.baseDir = path.join(__dirname, '/../.data/');

//creating a file and inserting data
lib.create = (dir, file, data, callback) => {
    //open file for writing
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            //convert data to string
            console.log(data);
            const stringData = JSON.stringify(data);
            console.log(stringData);
            //write data to file and close it
            fs.writeFile(fileDescriptor, stringData, err2 => {
                if(!err2){
                    fs.close(fileDescriptor, err3 => {
                        if(!err3){
                            callback(false);
                        }else {
                            callback('error closing new file');
                        }
                    });
                }else{
                    callback('error writing new file');
                }
            });
        }else{
            callback('could not create new file, it may already exist!');
        }
    });
};

//read data
lib.read = (dir, file, callback) => {
    fs.readFile(lib.baseDir + dir + '/' + file + '.json','utf-8', (err, data) => {
        callback(err, data);
    });
};

// updating data
lib.update = (dir, file, data, callback) => {
    //file open for writing
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            //convert the data to string
            const stringData = JSON.stringify(data);

            //truncate the file
            fs.ftruncate(fileDescriptor, (err2)=>{
                if(!err2){
                    //write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, err3 => {
                        if (!err3){
                            //close the file
                            fs.close(fileDescriptor, err4 => {
                                if(!err4){
                                    callback(false);
                                }else{
                                    callback('Error closing file');
                                }
                            })
                        }else{
                            callback('error writing to file');
                        }
                    });
                }else{
                    callback('Error Truncating file!');
                }
            });
        }else{
            callback('Error Updating. File may not exist!');
        }
    });
};

//delete existing file
lib.delete = (dir, file, callback) => {
    //unlink file
    fs.unlink(lib.baseDir + dir + '/' + file + '.json', (err) => {
        if(!err){
            callback(false);
        }else{
            callback('error deleting file');
        }
    });
};
//exporting the module
module.exports = lib;