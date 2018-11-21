"use stric";
/* jshint esversion: 6,-W097, -W040, browser: true, expr: true, undef: true *//* global module */
/*  @module
        gulp_place
    @depends_on
        'gulp-replace'
        'fs'
    @version
        0.3.0
    @examples
        gulp_place("file_path") === gulp_place("file_path", "file"): replaced by "file_path" contend
        gulp_place("some_var_inside_gulp", "variable"): replaced by value of 'some_var_inside_gulp'
    @info
        Returned function 'gulp_place' must be used in gulp.pipe and replacing 'gulp_place' in source files by another files content or eval inputed data (i.e. variables inside gulpfile).
        In case of file replacing and situation "^    gulp_place("file");" also spaces and new line (and ";" if writted) is replaced (see "gulp_place_regex").
        The varibale (in case gulp_place("***", "variable")) is replaced by '"'+***+'"' (means as string)
    
    @param <object>init= {gulp_replace= 'gulp-replace' package , fs= 'fs' package}
        @key
    
    @return <function>gulp_place
        @param <object>init= {folder, string_wrapper}
            @key <string>folder= relative path for contend folder against actual path (like gulpgile.js)
            @key <string>string_wrapper= when evals 
*/
module.exports= function({gulp_replace= false, fs= false, variable_eval= false}= {}){
    if(!gulp_replace) throw Error("Missing 'gulp-replace' function!");
    if(!fs) throw Error("Missing 'fs' object!");
    if(!variable_eval) throw Error("Missing 'variable_eval' function!");

    return function gulp_place({folder= "js/", string_wrapper= '"'}= {}){
        const gulp_place_regex= /( *)gulp_place\(\s*(?:\"|\')([^\"]+)(?:\"|\')(?:\s*,\s*(?:\"|\')([^\"]+)(?:\"|\'))?\s*\)(;?)/g;
        const gulp_remove_line= /[^\n]*\/\/gulp\.remove\.line\r?\n/g;
        const gulp_remove_jshint= /[^\n]*(\/\*[^\*]*\*\/)?\/\*\s(jshint|global)[^\*]*\*\/(?!\/\/gulp\.keep\.line)\r?\n/g;
        return gulp_replace(gulp_place_regex,function(full_match, spaces= "", name= false, type="file", semicol= ""){
            if(!name) return full_match;
            else if(type==="file") return parseFile(fs.readFileSync(folder+name, 'utf8').replace(gulp_remove_line, "").replace(gulp_remove_jshint, ""));
            else if(type==="variable") return spaces+string_wrapper+variable_eval(name)+string_wrapper+semicol;

            function parseFile(file_data){
                return file_data.replace(gulp_place_regex, function(full_match, spaces= "", name= false, type="file", semicol= ""){
                    if(!name) return full_match;
                    else if(type==="file") return parseFile(fs.readFileSync(folder+name, 'utf8').replace(gulp_remove_line, "").replace(gulp_remove_jshint, ""));
                    else if(type==="variable") return spaces+string_wrapper+variable_eval(name)+string_wrapper+semicol;
                });
            }
        });
    };
};