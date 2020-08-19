/* jshint esversion: 6,-W097, -W040, node: true, expr: true */
/*jsondoc={
    "version": "1.0.1",
    "script_name": "gulp_task_default",
    "description": "Main/default gulp task for serializing others tasks scripts. More description __TBD__.",
    "root_path": "gulp_tasks"
}*/
module.exports= function({gulp, scripts, $g, $o, app, cordova_target_device, error}){
    return function(cb){
        const logs= app.directories.gulp+"logs/gulpfile.log";
        $o.fs.readFile(logs, function(err,data){
            const show_github= err||JSON.parse(data.toString()).build!==app.build;
            const full_sequence= show_github||app.external_publication;
            let sequence= [];
            for(let i= 0, i_sequence; (i_sequence= app.sequence[i]); i++){
                if(i_sequence.charAt(0)!=="!") sequence[sequence.length]= i_sequence;
                else if(full_sequence&&i_sequence!=="!run c !") sequence[sequence.length]= i_sequence.substr(1);
            }
            gulp.series(...sequence)(gotoEnd.bind(null, show_github ? app.shared.github : ""));
        });
        function gotoEnd(github){
            if(error.getNum()) return $g.util.log($g.util.colors.red('[Error]'), `Jeden z procesů vyhodil chybu — některé navazující procesy nemuseli být provedeny!'.`);
            if(github){ $o.spawn(github, [], {}); return $o.fs.writeFile(logs, JSON.stringify(app), cb); }
            cb();
        }
    };
};
