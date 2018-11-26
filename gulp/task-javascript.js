/* jshint esversion: 6,-W097, -W040, browser: true, expr: true, undef: true *//* global module, require */
module.exports= function({app, $gulp_folder, gulp, error, $g, $o, $run}){
    /* jshint -W061 */const gulp_place= require("./gulp_place.js")({gulp_replace: $g.replace, fs: $o.fs, variable_eval: (str)=> eval(str)});/* jshint +W061 */
    return function(cb){
        let cmd;
        cmd= $o.spawn("node", ['node_modules/jshint/bin/jshint', 'js/'], {});
        cmd.stdout.on('data', function(data){ error.addText(data.toString()+"\n"); });
        cmd.on('close', run);
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
};
