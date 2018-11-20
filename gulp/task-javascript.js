/* jshint esversion: 6,-W097, -W040, browser: true, expr: true, undef: true *//* global module */
module.exports= function({app, $gulp_folder, gulp, error, $g, $o, $run}){
    return function(cb){
        let cmd;
        if($run.jshint_advanced){
            cmd= $o.spawn($run.jshint_advanced, [app.src_folder], {});
            cmd.stdout.on('data', function(data){ error.addText(data.toString()+"\n"); });
            cmd.on('close', run);
        } else {
            run(0);
        }
        function run(code){
            let main_stream;
            if(!code){
                main_stream= gulp.src([app.src_folder+"*.js", '!'+app.src_folder+'*.sub.js'])
                    .pipe(gulp_place({folder: "src/", string_wrapper: '"'}))
                    .pipe($g.replace("/* gulp *//* global gulp_place */",""));
    
                main_stream
                    .on('error', error.handler)
                    .pipe(gulp.dest(app.bin_folder))
                    .on('end', function minify(){
                        gulp.src([app.bin_folder+"*js", "!"+app.bin_folder+"*-min.js"])
                            //.pipe($g.js_obfuscator())
                            .pipe($g.minify_js({noSource : true}))
                            .on('error', error.handler)
                            //.pipe($g.rename({suffix: ".min"}))
                            .pipe(gulp.dest(app.bin_folder))
                            .on('end', cb);
                    });
            } else {
                $g.util.log($g.util.colors.red('[Error]'), "Error(s) in javascripts!");
                $o.fs.writeFile($gulp_folder+'build.log', error.getText(), cb);
                error.addNum();
            }
        }
    };

    function gulp_place({folder= "js/", string_wrapper= '"'}= {}){
        const gulp_place_regex= /( *)gulp_place\(\s*(?:\"|\')([^\"]*)(?:\"|\')(\s*,\s*(?:\"|\')([^\"]*)(?:\"|\'))?\s*\)(;?)/g;
        const gulp_remove_line= /[^\n]*\/\/gulp\.remove\.line\r?\n/g;
        const gulp_remove_jshint= /[^\n]*(\/\*[^\*]*\*\/)?\/\*\s(jshint|global)[^\*]*\*\/(?!\/\/gulp\.keep\.line)\r?\n/g;
        return $g.replace(gulp_place_regex,function(s0, spaces= "", name, s1, type="file", semicol= ""){
            if(type==="file") return parseFile($o.fs.readFileSync(folder+name, 'utf8').replace(gulp_remove_line, "").replace(gulp_remove_jshint, ""));
            /* jshint -W061 */else if(type==="variable") return spaces+string_wrapper+eval(name)+string_wrapper+semicol;/* jshint +W061 */

            function parseFile(file_data){
                return file_data.replace(gulp_place_regex, function(s0, spaces= "", name, s1, type="file", semicol= ""){
                    if(type==="file") return parseFile($o.fs.readFileSync(folder+name, 'utf8').replace(gulp_remove_line, "").replace(gulp_remove_jshint, ""));
                    /* jshint -W061 */else if(type==="variable") return spaces+string_wrapper+eval(name)+string_wrapper+semicol;/* jshint +W061 */
                });
            }
        });
    }
};
