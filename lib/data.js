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
lib.baseDir = path.join(__dirname, "../data/");

//creating a file and inserting data
lib.create = (dir, file, data, callback) => {
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);
            //write data to file and close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, err => {
                        if (!err) {
                            callback(false);
                        } else {
                            callback("error closing the new file");
                        }
                    });
                } else callback("Error Writing new file");
            })
        } else {
            callback("Could not create new file. it may already exist");
        }

    })
}

//read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf-8', (err, data) => {
        callback(err, data);
    })
}

//update data of a file

lib.update = (dir, file, data, callback) => {
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', (err, fileDescriptor) => {
        if (!err) {
            const stringData = JSON.stringify(data);
            fs.ftruncate(fileDescriptor, err => {
                if (!err) {
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if (!err) {
                            fs.close(fileDescriptor, err => {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback("error closing the new file");
                                }
                            })
                        } else {
                            callback("error writing Data");
                        }
                    })
                } else {
                    callback("Error truncating file");
                }
            })
        } else {
            callback("error opening the new file");
        }
    })
}


//delete existing file
lib.delete = (dir, file, callback) => {
    fs.unlink(lib.baseDir + dir + '/' + file + '.json', (err) => {
        if (!err) {
            callback(false);
        } else callback("Error closing the new file");
    })
}


//exporting the module
module.exports = lib;
