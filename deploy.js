console.log(process.env.NODE_ENV, process.env.RELEASE)
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'dist/index.js');
const Models = require('conpass-models')
const RELEASE_STABLE = 'stable'
// const util = require('util');
// const exec = util.promisify(require('child_process').exec);
// async function lsExample(r) {
//   const { stdout, stderr } = await exec(r);
//   console.log('stdout:', stdout);
//   console.log('stderr:', stderr);
// }
// lsExample(`cat ${filePath}`);

console.log(filePath);

const callback = function(err) {
    console.error(err)
    process.exit(1)
}

const findAndUpdatePixel = (version, contents) => {
    Models.Pixel.findOne({version: version}).then(pixel => {
        pixel.file = contents
        pixel.save().then(saved => {
            console.log('SAVED')
            process.exit(0)
        }).catch(err => {
            console.error(err)
            process.exit(1)
        })
        
    }).catch(err => {
        console.error(err)
        process.exit(1)
    })
}

fs.readFile(filePath, 'utf8', function(err, contents) {
//     if(err) callback(err)
//     // console.log(contents);
//     // console.log('read file')
//     // fs.writeFile(deployPath + '/public/ext/conpass.js', contents, 'utf-8', function(err) {
//     //     if(err) callback(err)
//     //     console.log('write ext file')
//     //     contents = "window.cpt='<%= master.userAppToken %>';\n" + contents
//     //     fs.writeFile(deployPath + '/views/pages/v3.ejs', contents, 'utf-8', function(err) {
//     //         if(err) callback(err)
//     //         console.log('write v3 file')
//     //         process.exit(-1)
//     //     });
//     // });
    if(err) return callback(err)
    findAndUpdatePixel(process.env.RELEASE, contents)
    // if(process.env.RELEASE === RELEASE_STABLE) {
    //     let version = require('./package.json').version
    //     Models.Pixel.create({
    //         file: contents,
    //         version
    //     }).then(new_version_pixel => {
    //         findAndUpdatePixel(process.env.RELEASE, contents)
    //     }).catch(err => {
    //         console.error(err)
    //         process.exit(1)
    //     })
    // } else {
    //     findAndUpdatePixel(process.env.RELEASE, contents)
    // }
});
