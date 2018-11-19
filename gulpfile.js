/* jshint esversion: 6,-W097, -W040, browser: true, expr: true, undef: true *//* global require */
/* \CONFIG\ */
const config= {
    /* \APP depend consts\ */
    app: {
        name: "SimpleEditor",
        version: "0.7",
        build: "0002",
        src_folder: "src/",
        bin_folder: "bin/",
        sequence: ['javascript'] //!... pro preskoceni sequence
    },
    /* /APP depend consts/ */
    /* \Gulp - requires\ */
    $gulp_folder: "./gulp/",
    gulp: require('gulp'),
    error: error()
};
(function(c){
    const $run= require(c.$gulp_folder+'gulp-crossplatform')();
    const {$g,$o}= require(c.$gulp_folder+'gulp-requires')(config.gulp);
    c.$g= $g; c.$o= $o; c.$run= $run;
})(config);
    /* /Gulp - requires/ */
/* /CONFIG/ */
/* \Tasks\ */
var c_output= "", if_error= 0;
const tasks= ['default', 'javascript'], tasks_length= tasks.length;
for(let i=0, task; i<tasks_length; i++){ task= tasks[i]; config.gulp.task(task, require(config.$gulp_folder+'task-'+task)(config)); }
/* /Tasks/ */
/* \Global functions\ */
function error(){
    function getText(){     return c_output; }
    function addText(err){  c_output+= err; }
    function getNum(){      return if_error; }
    function addNum(num=1){ if_error+= num; }
    function handler(err){  addNum(); config.$g.util.log(config.$g.util.colors.red('[Error]'), err.toString()); }
    return { getText, addText, getNum, addNum, handler };
}
/* /Global functions/ */
