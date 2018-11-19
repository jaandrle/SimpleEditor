            /* jshint esversion: 6,-W097, -W040, browser: true, expr: true, undef: true *///gulp.remove.line
            /* global validators, _this *///gulp.remove.line
            _this.setValidationFunction= function(action, fun){ validators[action]= fun; };
            _this.getValidationFunction= function(action){ return validators[action]; };