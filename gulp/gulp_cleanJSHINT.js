/* jshint esversion: 6,-W097, -W040, node: true, expr: true, undef: true, maxparams: 5 */
/*jsondoc={
    "version": "0.1.3",
    "script_name": "gulp_cleanJSHINT",
    "description": "Utility for using in combination with `gulp_place` (see `filesCleaner` key in argument object).",
    "root_path": "gulp_path"
}*/
function parseJSHINT(full_match, left, center, right, eol){
    if(/\/\/gulp\.keep\.line/.test(right)) return left+center+right+eol;
    const out= [left, center, right].map(item=> /\/\*[^\*]*\*\//g.test(item) ? "" : item).join("");//?? || /gulp_place/g.test(item)
    return out ? out+eol : out;
}
module.exports= function cleanJSHINT(content){
    const jshint_regex= /([^\n]*)(\/\*\s(?=jshint|global)[^\*]*\*\/)([^\n\r]*)(\r?\n)/g;
    return content.replace(jshint_regex, parseJSHINT);
};