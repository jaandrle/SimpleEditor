_this.setValidationFunction= function(action, fun){ validators[action]= fun; };
_this.getValidationFunction= function(action){ return validators[action]; };