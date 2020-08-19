/* jshint esversion: 6,-W097, -W040, node: true, expr: true, undef: true */
/* node has 5min cahce for requests!!! */
const /* configs files paths */
    version= "2.0.1",
    config_key_name= "jaaJBT",
    config_remote_name= "jaaJBT.json";
const /* dependences */
    fs= require("fs"),
    https= require("https"),
    colors= { e: "\x1b[31m", s: "\x1b[32m", w: "\x1b[33m", R: "\x1b[0m" };
let spaces= "   ";
toConsole(`${colors.w}${config_key_name}@v${version}`, "normal", "_info");

const {
    operation, filter,
    package_json,
    config: config_local,
    local_jaaJBT
}= getProgramParams({
    script_arguments: process.argv.slice(1),
    default_config: "./package.json"
});
(function(){
    switch (operation){
        case "check":       return check();
        case "update":      return check().then(update);
        case "packages":    return overview(filter).then(overview_printPackagesNames);
        case "overview":    return overview(filter).then(overview_printPackagesWithDetails);
        case "create":      package_json.jaaJBT= local_jaaJBT; try{ return Promise.resolve(saveConfig()); } catch (e){ return Promise.reject(e); } break;
        case "error":       return Promise.reject(toConsole("Local versions", "warn", "_no_local"));
        default :           return Promise.resolve(toConsole("Help", "normal","_help"));
    }
})()
//.catch(console.log)
.then(()=> process.exit())
.catch(()=> process.exit(1));

function getResourses(){
    if(!local_jaaJBT.resourses.length) return Promise.reject("Local file config. No `resourses` defined.");
    return Promise.all(local_jaaJBT.resourses.map(res=> `${res}${config_remote_name}?v=${Math.random()}`).map(getJSON));
}
function check(){
    return getResourses()
    .then(function(data){
        const remote_jaaJBT= consolidateJSONObjects(data);
        let results= [];
        if(isNewer(remote_jaaJBT.config.version)) return toConsole(`Update is not possible (new version ${remote_jaaJBT.config.version})`, "error", spaces.repeat(2)+"Your `jaaJBT.js` script must be up-to-date to proper comparing/updating!");
        Object.keys(local_jaaJBT.scripts||{}).forEach(function(key){
            const remote_k= remote_jaaJBT.scripts[key];
            let local_k= local_jaaJBT.scripts[key];

            if(!remote_k) return results.push([ key, "is not registered in remote resourse!", colors.e, "" ]);
            const remote_k_version= remote_k.version;
            if(local_k[0]==="=") return results.push([ key, "skipped update check because of `=`!", colors.w, local_k ]);
            if(!/^\d/.test(local_k[0])) local_k= local_k.substring(1);

            const result= local_k!==remote_k_version ? [ "outdated", colors.e ] : [ "up-to-date", colors.s ];
            const version= remote_k_version.split("").map((v,i)=> v===local_k.charAt(i) ? v : colors.e+v).join("")+colors.R;
            results.push([ key, ...result, version ]);
        });
        toConsole("Versions comparisons", "normal", results.map(([ key, result, color, version ])=> `${spaces.repeat(2)}${key}: ${color}${result}${colors.R}` + (version ? ` (${version})` : "")).join("\n"));
        return { remote: remote_jaaJBT, results_all: results };
    })
    .catch(handleErrorJSON);
}
function overview(filter= ""){
    const getKeys= filter==="all" ?
        scripts=> Object.keys(scripts) :
        scripts=> Object.keys(scripts).filter((( local_keys, compare )=> function(key){ return compare(local_keys.indexOf(key)); })(Object.keys(local_jaaJBT.scripts), filter==="diff" ? v=> v===-1 : v=> v!==-1));
    const no_scripts_text= spaces.repeat(2)+"No scripts for your filter.";

    return getResourses()
    .then(function(data){
        const remote_jaaJBT= consolidateJSONObjects(data);
        const { scripts }= remote_jaaJBT;
        return { scripts, getKeys, no_scripts_text };
    })
    .catch(handleErrorJSON);
}
function overview_printPackagesWithDetails({ scripts, getKeys, no_scripts_text }){
    return toConsole("Available scripts", "normal",
        getKeys(scripts)
            .map(key=> [
                `${colors.w}${key}${colors.s}@v${scripts[key].version}${colors.R}`,
                ...[
                    `target_path: "${scripts[key].target_path}"`,
                    `description: "${scripts[key].description || "-"}"`
                ].map(t=> spaces.repeat(2)+t)
            ].map(t=> spaces+t).join("\n"))
            .map(t=> spaces+t).join("\n") || no_scripts_text
    );
}
function overview_printPackagesNames({ scripts, getKeys, no_scripts_text }){
    return toConsole("Lines to `jaaJBT` section (without `,` on EOL)", "normal",
        getKeys(scripts).map(key=> spaces.repeat(2)+`"${key}": "",`).join("\n") || no_scripts_text
    );
}
function update({ remote, results_all }){
    const results= results_all.filter(([ _, result ])=> result==="outdated").map(([ key, _1, _2, version ])=> `${key}@v${version.replace(colors.e, "")}`);
    if(!results.length) return toConsole("Scripts to download", "normal", spaces.repeat(2)+"Nothing to download");
    arrayToConsole("Scripts to download", "normal", colors.w)(results);

    return Promise.all(results.map(toObject).map(downloadNth))
    .then(UpdateConfig)
    .then(results=> results.map(({ target_full })=> target_full))
    .then(arrayToConsole("Download — successfull", "normal", colors.s))
    .catch(toConsole.bind(null, "Download — error", "error"));

    function toObject(res){ const key= res.split("@v")[0]; return Object.assign({ key }, remote.scripts[key]); }
}


function downloadNth(def){
    const { src, target_path, version, key }= def;
    const local_target_path= local_jaaJBT.config[target_path] || "";
    const file_name= local_jaaJBT.rename[key] || src.substring(src.lastIndexOf("/")+1);
    return download(`${src}?v=${version}`, local_target_path+file_name, def);
}
function UpdateConfig(results){
    results.forEach(({ key, version })=> local_jaaJBT.scripts[key]= `~${version}`);
    saveConfig();
    return results;
}

function getJSON(url){ return new Promise(function(resolve, reject){ 
    https.get(url, function(response){
        let data= "";
        response.on("data", chunk=> data+= chunk);
        response.on("end", function(){ toConsole(url, "", "Connection estabisled"); try{ resolve(JSON.parse(data)); } catch(e){ reject(e); } });
    }).on("error", reject);
});}
function handleErrorJSON(error){
    toConsole("Remote versions", "error", "_no_connection");
    toConsole(spaces+"Error message", "error", spaces.repeat(3)+error);
}
function download(from, to, share){ return new Promise(function(resolve, reject){
    const file= fs.createWriteStream(to);
    https.get(from, function(response) {
        response.pipe(file);
        file.on('finish', ()=> file.close(()=> resolve(Object.assign( { src_full: from, target_full: to }, share ))) /* close() is async, call cb after close completes. */);
    }).on('error', function(err) { // Handle errors
        fs.unlink(to); // Delete the file async. (But we don't check the result)
        reject(err.message);
    });
});}

function consolidateJSONObjects(data){
    return data.reduce(function(acc, curr){
        const { config: { version, root_url }= {}, scripts }= curr;
        Object.keys(scripts).forEach(key=> scripts[key].src= root_url+scripts[key].src);
        if(version&&isNewer(version, acc.config.version)) Object.assign(acc.config, { version });
        Object.assign(acc.scripts, scripts);
        return acc;
    }, { config: { version: "0.0.0" }, scripts: {} });
}
function isNewer(to_check, to_compare_with= version){
    const to_compare_with_arr= to_compare_with.split(".").map(Number);
    return to_check.split(".").map(Number).map((d,i)=> d-to_compare_with_arr[i]).map(d=> d===0 ? 0 : (d<0 ? -1 : 1)).map((d,i)=> Math.pow(10, 2-i)*d).reduce((acc, curr)=> acc+curr, 0)>0;
}


function getProgramParams({ script_arguments, default_config }){
    let out= {};
    let curr_key;
    const types= [ "check", "update", "overview", "packages", "create" ];
    script_arguments.forEach(function(arg){
        switch(true){
            case Boolean(curr_key) :         out[curr_key]= arg; curr_key= undefined; break;
            case types.indexOf(arg)!==-1 :   out.type= arg; break;
            case "--"===arg.slice(0, 2) :    curr_key= arg.slice(2); break;
            default :                        return false;
        }
        return true;
    });
    if(!out.config) out.config= default_config;
    try{
        out.package_json= JSON.parse(fs.readFileSync(out.config));
        out.local_jaaJBT= out.package_json[config_key_name];
    } catch(e){
        if(out.type!=="create"){
            toConsole("Load config — error", "error", spaces.repeat(3)+"You can use `create` argument for creating empty config file.");
            out.local_jaaJBT= undefined;
        } else {
            out.package_json= {};
        }
    }
    if(out.type==="create"&&!out.local_jaaJBT) out.local_jaaJBT= { resourses: [], scripts: {} };
    if(!out.local_jaaJBT) out.operation= "error";
    else{
        out.operation= out.type;
        if(!out.local_jaaJBT.rename) out.local_jaaJBT.rename= {};
        if(!out.local_jaaJBT.config) out.local_jaaJBT.config= {};
    }
    return out;
}

function saveConfig(){ fs.writeFileSync(config_local, JSON.stringify(package_json, null, "    ")); }
function arrayToConsole(cmd, type, color){ return arr=> toConsole(cmd, type, arr.map(v=> spaces.repeat(2)+color+v).join("\n")); }
function toConsole(cmd, type, out_mixed){ const color= colors[type.charAt(0)]||""; return console.log(`${spaces}${cmd}: ${toConsolePreDefined(color, out_mixed)||"\n"+color+out_mixed}${colors.R}`); }
function toConsolePreDefined(color, out_mixed){ return ({
    _info: `${color}<${"zc.murtnec@naj.elrdna".split("").reverse().join("")}>
    `,
    _help: `
        Usage: node jaaJBT.js [::params::] [::action::] [::params::]
        - ${colors.s}::action::${colors.R}
            - ${colors.s}check${colors.R}: Connect to remote repository to check new versions of scripts.
            - ${colors.s}overview ${colors.w}[--filter]${colors.R}: Lists all available scripts for given resources
            - ${colors.s}packages ${colors.w}[--filter]${colors.R}: As 'overview', but in form for easy copy-paste
                    to your config).
            - ${colors.s}update${colors.R}: Connect to remote repository to download all new versions of scripts.
        - ${colors.s}::params::${colors.R}
            - ${colors.s}--filter${colors.R}: [all|union|diff] List all available scripts in remote repository (default)
                    or only (not) included locally.
            - ${colors.s}--config${colors.R}: Where is the config file stored (default './package.json').`,
    _no_local: `${color}
        There is not registered any local version of any ${config_key_name} script!`,
    _no_connection: `${color}
        Cannot connect to remote ${config_key_name} repository!`
})[out_mixed]; }