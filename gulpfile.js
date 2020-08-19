/* jshint esversion: 6, node: true */
/*jsondoc={
    "version": "1.1.4",
    "script_name": "gulpfile",
    "description": "Common gulpfile for my projects. It dynamically loads configuration from `package.json` and tasks from `./gulp/tasks/`. More description __TBD__.",
    "root_path": "root_path"
}*/
/* \CONFIG\ */
const shared_file_path= 
    /* 
        OS X        - '/Users/user/Library/Preferences/package_global.json'
        Windows 8   - 'C:\Users\user\AppData\Roaming\package_global.json'
        Windows XP  - 'C:\Documents and Settings\user\Application Data\package_global.json'
        Linux       - '/home/user/.local/share/package_global.json'
     */
    (process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share"))+'/package_global.json';
const shared_default= { github: "", cordova_wrapper: "" };
const config= (function(){
    let $o_default= {spawn: require('child_process').spawn, fs: require("fs")};
    const gulp= require('gulp'),
          $gulp_task_folder= "./gulp/tasks/",
          package_json= JSON.parse($o_default.fs.readFileSync('./package.json')),
          shared= $o_default.fs.existsSync(shared_file_path) ? JSON.parse($o_default.fs.readFileSync(shared_file_path)) : shared_default,
          { $g, $o }= mapDependencies(Object.assign({}, package_json.dependencies, package_json.devDependencies), $o_default);
    const app= (package_json.app_keys_map||[ ["name"], ["version"], ["directories"], ["sequence"] ]).reduce((acc, curr)=> (acc[curr[0]]= package_json[curr[1]||curr[0]], acc), { shared });
    if(!app.folderName) app.folderName= package_json.homepage.substring(package_json.homepage.lastIndexOf("/")+1);
    return { gulp, $gulp_task_folder, $g, $o, app, scripts: package_json.scripts, cordova_target_device: package_json.cordova_target_device, error: error() };
})();
/* /CONFIG/ */
/* \Tasks\ */
var c_output= "", if_error= 0;
const tasks= config.$o.fs.readdirSync(config.$gulp_task_folder).filter(item=> config.$o.fs.statSync(config.$gulp_task_folder+item).isFile()&&item.indexOf("task-")!==-1).map(file=> file.replace("task-","").replace(".js", "")), tasks_length= tasks.length;
for(let i=0, task; i<tasks_length; i++){ task= tasks[i]; config.gulp.task(task, require(config.$gulp_task_folder+'task-'+task)(config)); }
/* /Tasks/ */
/* \Global functions\ */
function error(){
    function getText(){             return c_output; }
    function addText(err){          c_output+= err; }
    function getNum(){              return if_error; }
    function addNum(num=1){         if_error+= num; }
    function handler(err){          addNum(); config.$g.util.log(config.$g.util.colors.red('[Error]'), err.toString()); }
    function logBuffer(err){        c_output+= err.toString()+"\n"; }
    function logSave(name, cb){
        config.$g.util.log(config.$g.util.colors.red('[Error]'), `Error(s) in ${name}! See 'gulp/logs/build.log'.`);
        config.$o.fs.writeFile('./gulp/logs/build.log', c_output, cb);
        if_error++;
    }
    return { getText, addText, getNum, addNum, logBuffer, logSave, handler };
}
function mapDependencies(dependencies, $o_default){//nahradit (?): https://github.com/jackfranklin/gulp-load-plugins
    const dependencies_keys= Object.keys(dependencies);
    const pre= "gulp-";
    const rename= {"gulp-minify": "gulp-minify_js", "gulp-clean-css": "gulp-css_clean"}, rename_keys= Object.keys(rename);
    let out= {$g: {} /* for "gulp-" */ , $o: $o_default /* for others */};

    dependencies_keys.forEach(cmd=>{
        if(cmd==="gulp") return false;
        let out_key= "$o";
        const name= rename_keys.indexOf(cmd)!==-1 ? rename[cmd].replace(pre, setTo$g) : cmd.replace(pre, setTo$g);
        out[out_key][name]= require(cmd);

        function setTo$g(...arg){ if(arg.length){ out_key= "$g"; } return ""; }
    });
    return out;
}
/* /Global functions/ */

//https://www.npmjs.com/package/gulp-image-optimization
//https://www.npmjs.com/package/gulp-foreach
