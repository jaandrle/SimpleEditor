/* jshint esversion: 6,-W097, -W040, browser: true, expr: true, undef: true */
/* global define, module*/
(function(module_name, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([], function(){
            return factory(window, document);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(window, document);
    } else {
        window[module_name] = factory(window, document);
    }
})("class_"+gulp_place("app.name", "variable"), function(window, document){
    'use strict';/* gulp *//* global gulp_place */
    return (function class_SimpleEditor(){
        var _static= {};
        gulp_place("class_static.sub.js");
        
        _static.init= function(def){
            var _this= {};
            gulp_place("class_factory.sub.js");
            return Object.freeze ? Object.freeze(_this) : _this;
        };
        return Object.freeze ? Object.freeze(_static) : _static;
    })();
});