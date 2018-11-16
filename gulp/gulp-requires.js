/* jshint esversion: 6,-W097, -W040, browser: true, expr: true */
module.exports= function(){
    let gulp_out_list= {};
    let other_out_list= {
        spawn: require('child_process').spawn,
        fs: require('fs')
    };
    let gulps= ["util","javascript-obfuscator","replace","stylus","concat","sequence","rename","imagemin","sourcemaps"];
    for(let i= 0, i_length= gulps.length; i < i_length; i++){
        gulp_out_list[gulps[i]]= require("gulp-"+gulps[i]);
    }
    gulp_out_list.js_obfuscator= require("gulp-javascript-obfuscator");
    gulp_out_list.minify_js= require('gulp-minify');
    gulp_out_list.css_clean= require('gulp-clean-css');
    
    function cssCompress(full){
        if(full) return {level: 1};
        else return {level: 1, format:{breaks:{afterBlockEnds:true, afterRuleEnds: true}}};
    }
    return {$g: gulp_out_list, $o: other_out_list, cssCompress};
};
