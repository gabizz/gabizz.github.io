(function() {
  'use strict';

  angular
    .module('app', [
      'ngCordova',
      'ngAnimate', 
      'ngCookies',  
      'ngSanitize', 
      'ngMessages', 
      'ngAria', 
      'ui.router', 
      'ngMaterial', 
      'toastr', 
      'LocalStorageModule', 
      'ngFileUpload',
      'textAngular',
      'ui.tinymce'
  ]);

})();

(function() {
  'use strict';

  angular
    .module('app')
    .config(config);

  /** @ngInject */
  function config($mdDateLocaleProvider, moment) {
// Example of a French localization.

    $mdDateLocaleProvider.shortDays = ['Du', 'Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sa'];
    $mdDateLocaleProvider.firstDayOfWeek = 1;

    $mdDateLocaleProvider.parseDate = function(dateString) {
      var m = moment(dateString, 'L', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };

    $mdDateLocaleProvider.formatDate = function(date) {
       return moment(date).format('DD.MM.YYYY');
    }; 
      
    $mdDateLocaleProvider.weekNumberFormatter = function(weekNumber) {
      return 'Săptămâna ' + weekNumber;
    };      
      
    $mdDateLocaleProvider.msgCalendar = 'Calendar';
    $mdDateLocaleProvider.msgOpenCalendar = 'Deschide calendarul';      
      
}  

  

})();

(function () {
    'use strict';

    angular
        .module('app')
        .config(config);

    /** @ngInject */
    function config($httpProvider, $logProvider, toastrConfig, $mdThemingProvider, $mdIconProvider, $rootScopeProvider, localStorageServiceProvider) {
        // Enable log
        $logProvider.debugEnabled(true);

        toastrConfig.allowHtml = true;
        toastrConfig.timeOut = 0;
        toastrConfig.positionClass = 'toast-top-right';
        toastrConfig.preventDuplicates = true;
        toastrConfig.progressBar = true;

        // overpass the digest limit for json rendering
        $rootScopeProvider.digestTtl(10);

        localStorageServiceProvider.setPrefix('ctr');
        /*
            $mdThemingProvider
                .theme('default')
                .primaryPalette('indigo')
                .accentPalette('pink')
                .warnPalette('red')
                .backgroundPalette('blue');*/





        var customGreyMap = $mdThemingProvider.extendPalette('deep-purple', {
            'contrastDefaultColor': 'dark',
            'contrastDarkColors': ['50'],
            '50': 'ffffff'
        });

        $mdThemingProvider.definePalette('customBlue', customGreyMap);
        $mdThemingProvider.theme('default')
            .primaryPalette('customBlue', {
                'default': '500',
                'hue-1': '50'
            })
            .accentPalette('indigo');
        $mdThemingProvider.theme('input', 'default')
            .primaryPalette('grey')




        $mdIconProvider
            // linking to https://github.com/google/material-design-icons/tree/master/sprites/svg-sprite
            // 
            .iconSet('action', 'assets/svg/svg-sprite-action.svg', 24)
            .iconSet('alert', 'assets/svg/svg-sprite-alert.svg', 24)
            .iconSet('av', 'assets/svg/svg-sprite-av.svg', 24)
            .iconSet('communication', 'assets/svg/svg-sprite-communication.svg', 24)
            .iconSet('content', 'assets/svg/svg-sprite-content.svg', 24)
            .iconSet('device', 'assets/svg/svg-sprite-device.svg', 24)
            .iconSet('editor', 'assets/svg/svg-sprite-editor.svg', 24)
            .iconSet('file', 'assets/svg/svg-sprite-file.svg', 24)
            .iconSet('hardware', 'assets/svg/svg-sprite-hardware.svg', 24)
            .iconSet('image', 'assets/svg/svg-sprite-image.svg', 24)
            .iconSet('maps', 'assets/svg/svg-sprite-maps.svg', 24)
            .iconSet('navigation', 'assets/svg/svg-sprite-navigation.svg', 24)
            .iconSet('notification', 'assets/svg/svg-sprite-notification.svg', 24)
            .iconSet('social', 'assets/svg/svg-sprite-social.svg', 24)
            .iconSet('toggle', 'assets/svg/svg-sprite-toggle.svg', 24)
            .iconSet('my', 'assets/svg/_my_collection.svg', 24)

            // Illustrated user icons used in the docs https://material.angularjs.org/latest/#/demo/material.components.gridList
            .iconSet('avatars', 'assets/svg/avatar-icons.svg', 24)
            .defaultIconSet('assets/svg/svg-sprite-action.svg', 24);


        $httpProvider
            .interceptors.push(
                function (localStorageService, $q, $window) {
                    return {
                        request: function (config) {
                            config.headers = config.headers || {};
                            config.headers.Authorization = localStorageService.get('apikey');
                            return config || $q.when(config);
                        },
                        responseError: function (response) {

                            if (response) {
                                if (response.status == 401) {
                                    localStorageService.remove('apikey');
                                    localStorageService.remove('user');
                                    localStorageService.remove('uid');
                                    $window.location = '#!/login';
                                    return response;
                                    //make the user login again
                                } else if (response.status == 404) {
                                    /*                            localStorageService.remove('apikey');
                                                                localStorageService.remove('user');
                                                                localStorageService.remove('company');   */
                                    $window.location = '#/exception/404';
                                }
                                if (response.status == 403) {
                                    localStorageService.remove('apikey');
                                    localStorageService.remove('user');
                                    localStorageService.remove('uid');
                                    $window.location = '#/exception/403';
                                }

                            }
                            return $q.reject(response);
                        }
                    }
                })


    }



})();
/* global moment:false */

(function() {
  'use strict';

var appData = {
    name: "CONTRACTE DE ARENDARE",
    version: " CTR ver. 2.0",
    app: "CTR",

    api: "https://api-arenda.de4.undevreau.eu/"
//    api: "http://localhost:3300/"
};

  angular
    .module('app')
    .constant('APP',  appData)
    .constant('moment', moment);


})();

(function () {
    'use strict';

    angular
        .module('app')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig( $urlRouterProvider) {

  



        $urlRouterProvider.otherwise('/');
    }

})();
(function () {
    'use strict';

    angular
        .module('app')
        .run(cordovaInit)
        .run(runBlock);

    /** @ngInject */
    function runBlock($log, $rootScope, $q) {

        $log.debug('runBlock end');
            $rootScope
        .$on('$stateChangeStart', 
            // function(event, toState, toParams, fromState, fromParams){ 
            function() {
                angular.element("#ui-view").html("");
                angular.element(".page-loading").removeClass("hidden");
        });

        $rootScope
            .$on('$stateChangeSuccess',
             //   function(event, toState, toParams, fromState, fromParams){ 
                  function() {  angular.element(".page-loading").addClass("hidden");
            });
        
//        window["Promise"] = $q;

    }



    function cordovaInit($window, $document, $log) {
        
        return function (done) {
            if ($window.cordova) {
                $log.info('cordova loaded');
                $document.addEventListener('deviceready', function () {
                    done();
                }, false);
            } else {
                $log.info('no cordova env. detected!');
                done();
            }
        }

    }


})();
(function () {
    'use strict';

    angular
        .module('app')
        .filter('cauta', cauta);



    /** @ngInject */

    function cauta() {
        return function (elem, array, searchAttr, targetAttr, targetValue) {
        var result;
          angular.forEach( array, (e) => {
              if ( angular.isObject(elem)) {
                  
                  if ( elem[searchAttr] == e[targetAttr] ) {
                      targetValue == "data" ?  result =  e[targetValue]*1000 : result = e[targetValue];
                    
                  }
              }
          })
            return result;
        }
    }
    
})();
(function () {
    'use strict';

angular
	.module('app')
	.factory('ngCopy', ngCopy)
    .directive('ngClickCopy', ngClickCopy);
    
    function ngCopy($window) {
        var body = angular.element($window.document.body);
            var textarea = angular.element('<input>');
            textarea.css({
                position: 'fixed',
                opacity: '0'
            });

            return function (toCopy) {
                textarea.val(toCopy);
                body.append(textarea);
                textarea[0].select();

                try {
                    var successful = document.execCommand('copy');
                    if (!successful) throw successful;
                } catch (err) {
                    window.prompt("Copy to clipboard: Ctrl+C, Enter", toCopy);
                }

                textarea.remove();
            }
    }
	 
        
        function ngClickCopy() {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.bind('click', function () {
                        ngCopy(attrs.ngClickCopy);
                    });
                }
            }
        }
    
	
})();
(function () {
    'use strict';

    angular.module('app')
        .directive("formOnChange", function ($parse) {
            return {
                require: "form",
                link: function (scope, element, attrs) {
                    var cb = $parse(attrs.formOnChange);
                    element.on("change", function () {
                        cb(scope);
                    });
                }
            }
        });

})();
(function () {
    'use strict';
    
    angular.module('app')
        .directive('ngPrint', printDirective );
    
    
    function printDirective() {
        var printSection = document.getElementById('printSection');
/*        if (printSection != null) {
            printSection.remove();
        }*/

        // if there is no printing section, create one

        printSection = document.createElement( 'div' );
        printSection.id = 'printSection';
        document.body.appendChild( printSection );
        
        

        function link(scope, element, attrs) {
            element.on('click', function () {
               
                var elemToPrint = document.getElementById(attrs.printElementId);
                 
                if (elemToPrint) {
                  
                    printElement(elemToPrint);
                }
            });

        }
        function printElement(elem) {
            // clones the element you want to print
            var domClone = elem.cloneNode(true);
            printSection.appendChild(domClone);
//        
            window.print();
            printSection.innerHTML = '';
            
        }
        return {
            link: link,
            restrict: 'A'
        };
    }
    
}());
(function () {
    'use strict';

    angular
        .module('app')
        .filter('inLitere', inLitere);



    /** @ngInject */

    function inLitere() {
        return function (item) {
            return smarty_modifier_transf(item);
        }


    }





    function smarty_modifier_transf(item) {
        var bnr = item.split(",");
        var cstr = "";
        for (var i = 0; i < bnr.length; i++) {
            item = bnr[i].replace([",", "."], "");
            var sute = "",
                zeci = "",
                uni = "";
            var un = ["miliard ", "miliarde ", "milion ", "milioane ", "mie ", "mii ", "", ""];
            var sir = "";
            var s = "1";
            var num = 4;

            while (s != "") {
                s = item.slice(-3);

                if (s == "") break;
                item = (item.length - 3 > 0) ? item.slice(0, item.length - 3) : "";
                var ss = "";
                if (s != "") {
                    switch (s, s.length) {
                        case 3:
                           
                            sute = s.slice(1, 1);
                            
                            zeci = s.slice(1, 1);
                            
                            uni = s.slice(2, 1);
                            
                            ss = numar(sute, 1) + ((sute == 1) ? "suta " : ((sute > 1) ? " sute " : ""));
                            if (zeci == 1 && uni != 0)
                                ss = ss.numar(uni, 4) + "sprezece " + un[num * 2];
                            else if (zeci == 1 && uni == 0)
                                ss = "zece " + un[num * 2];
                            else {
                                ss = ss + numar(zeci, 2) + ((zeci != 0) ? "zeci " : "") + ((uni != "0") ? "si " + numar(uni, 3) : "") + ((s != "000") ? un[num * 2 - 1] : "");
                            }
                            sir = ss + sir;
                            break;
                        case 2:
                            sute = 0;
                            zeci = s.slice(0, 1);
                            uni = s.slice(1, 1);
                            if (zeci == 1 && uni != 0)
                                ss = ss + numar(uni, 4) + "sprezece " + un[num * 2 - 1];
                            else if (zeci == 1 && uni == 0)
                                ss = "zece " + un[num * 2];
                            else
                                ss = ss + numar(zeci, 2) + ((zeci != 0) ? "zeci " : "") + ((uni != "0") ? "si ".numar(uni, 3) : "") + un[num * 2 - 1];
                            sir = ss + sir;
                            break;
                        case 1:
                            sute = 0;
                            zeci = 0;
                            uni = s.slice(0, 1);
                            sir = numar(uni, (num == 3) ? 1 : 3) + ((uni == 1) ? un[(num - 1) * 2] : un[(num - 1) * 2 + 1]) + sir;
                            break;
                    }
                    num--;
                }
            }
            if (i == 0)
                cstr += sir + " lei si ";
            else if (i == 1)
                cstr += sir + " bani";
        }
  
        return cstr;
    }

    function numar(s, z) {
        var numar;
        switch (z) {
            case 1:
                switch (s) {
                    case 1:
                        numar = "o ";
                        break;
                    case 2:
                        numar = "doua ";
                        break;
                    case 3:
                        numar = "trei ";
                        break;
                    case 4:
                        numar = "patru ";
                        break;
                    case 5:
                        numar = "cinci ";
                        break;
                    case 6:
                        numar = "sase ";
                        break;
                    case 7:
                        numar = "sapte ";
                        break;
                    case 8:
                        numar = "opt ";
                        break;
                    case 9:
                        numar = "noua ";
                }
                break;
            case 2:
                switch (s) {
                    case 1:
                        numar = "zece";
                        break;
                    case 2:
                        numar = "doua";
                        break;
                    case 3:
                        numar = "trei";
                        break;
                    case 4:
                        numar = "patru";
                        break;
                    case 5:
                        numar = "cinci";
                        break;
                    case 6:
                        numar = "sai";
                        break;
                    case 7:
                        numar = "sapte";
                        break;
                    case 8:
                        numar = "opt";
                        break;
                    case 9:
                        numar = "noua";
                }
                break;
            case 3:
                switch (s) {
                    case 1:
                        numar = "unu ";
                        break;
                    case 2:
                        numar = "doi ";
                        break;
                    case 3:
                        numar = "trei ";
                        break;
                    case 4:
                        numar = "patru ";
                        break;
                    case 5:
                        numar = "cinci ";
                        break;
                    case 6:
                        numar = "sase ";
                        break;
                    case 7:
                        numar = "sapte ";
                        break;
                    case 8:
                        numar = "opt ";
                        break;
                    case 9:
                        numar = "noua ";
                }
                break;
            case 4:
                switch (s) {
                    case 1:
                        numar = "un";
                        break;
                    case 2:
                        numar = "doi";
                        break;
                    case 3:
                        numar = "trei";
                        break;
                    case 4:
                        numar = "pai";
                        break;
                    case 5:
                        numar = "cinci";
                        break;
                    case 6:
                        numar = "sai";
                        break;
                    case 7:
                        numar = "sapte";
                        break;
                    case 8:
                        numar = "opt";
                        break;
                    case 9:
                        numar = "noua";
                }
                break;
        }
        return numar;
    }


})();
(function () {
    'use strict';

    angular
        .module('app')
        .directive('dz', dzDirective)
        .filter('comma2decimal', comma2decimal)
        .filter('decimal2comma', decimal2comma)
        .filter('dz', dz);



    /** @ngInject */
    function dzDirective($filter) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelController) {

                ngModelController.$parsers.push(function (data) {
                    //convert data from view format to model format
                    data = $filter('comma2decimal')(data);
                    return data;
                });

                ngModelController.$formatters.push(function (data) {
                    //convert data from model format to view format
                    data = $filter('decimal2comma')(data);
                    return data;
                });
            }
        };
    }
    // parser
    function comma2decimal() {

        return function (input) {

            var ret = input ? input.toString().trim().replace(",", ".") : input.toString();
            if (ret.length < 1 || isNaN(ret)) {
                alert('NUMAI NUMERE!');
                return '';
            }
            return parseFloat(ret);
        };
    }

    // formatter
    function decimal2comma() {

        return function (input) {
            if (isNaN(input) || input == null) {
                return null;
            }
            // transform point to comma
            var ret = input ? input.toString().replace(".", ",") : input.toString();
            // deal with non-numbers


            // always show 2 decimals (formatter)
            if (ret) {
                var decArr = ret.split(",");
                if (decArr.length > 1) {
                    var decimals = decArr[1].length;

                    if (decimals === 1) {
                        ret += "0";
                    } // input value or model has 1 decimals
                    if (decimals === 2) {
                        ret += "";
                    } // input value or model has 2 decimals
                } else {
                    ret += ",00"; // input value or model has no decimal
                }
            }

            return ret;
        };
    }

    function dz() {

        return function (input) {

            if (isNaN(input) || input == null || typeof input === 'undefined') {
                return '';
            }
            // transform point to dot
            var r = input ? Math.round(input, 2).toString().replace(".", ",") : input.toString();
            // deal with non-numbers


            // always show 2 decimals (formatter)
            if (r) {
                var decArr = r.split(",");
                if (decArr.length > 1) {
                    var decimals = decArr[1].length;
                    if (decimals === 0) {
                        r += "00"
                    }
                    if (decimals === 1) {
                        r += "0";
                    } // input value or model has 1 decimals
                    if (decimals === 2) {
                        r += "";
                    } // input value or model has 2 decimals
                } else {
                    r += ",00"; // input value or model has no decimal
                }
            }

            return r;
        };
    }



})();

(function () {
    'use strict';

    angular
        .module('app')
        .directive('pjson', pjson);



    /** @ngInject */
    function pjson($sce) {

        function link(scope, elem, attrs) {
            scope.stuff =  $sce.trustAsHtml(syntaxHighlight(attrs.data))
        }

        return {
            restrict: "AE",
            link: link,
            template: "<pre><span ng-bind-html = 'stuff'></pre>"
        }
    }



    function syntaxHighlight(json) {
        json = angular.fromJson(json);
        json = angular.toJson(json,1);
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

})();
(function () {
    'use strict';

    angular
        .module('app')
        .directive('ngRightClick', ngRightClick);



    /** @ngInject */

    function ngRightClick($parse) {
        return function (scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function (event) {
                scope.$apply(function () {
                    event.preventDefault();
                    fn(scope, {
                        $event: event
                    });
                });
            });
        };
    }



})();
(function () {
    'use strict';

    angular
        .module('app')
        .filter('title', title);



    /** @ngInject */

    function title()  {
        return  function(input) {
            var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|de|srl)$/i;
            if ( typeof input !== 'undefined' || input != null ) {
                input = input.toLowerCase();
            } else {
                input = "";
            }
            
            return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title) {
                if (index > 0 && index + match.length !== title.length &&
                    match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
                    (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
                    title.charAt(index - 1).search(/[^\s-]/) < 0) {
                    return match.toLowerCase();
                }

                if (match.substr(1).search(/[A-Z]|\../) > -1) {
                    return match;
                }

                return match.charAt(0).toUpperCase() + match.substr(1);
            });
        }
    }



})();
(function () {
    'use strict';

    angular
        .module('app')
        .service('arrays', arrays);

    /** @ngInject */
    function arrays() {

        this.max = max;
        this.min = min;
        this.sum = sum;
        this.closest = closest;
        this.toTree = toTree;
        this.jsonify = jsonify;
        this.isJSON = isJSON;
        this.findObjects = findObjects;

        function max(arr, elem) {
            var item = {};
            item[elem] = 0;
            for (var i = 0; i < arr.length; i++) {
                var e = arr[i];
                if (parseFloat(e[elem]) > item[elem]) {
                    item = e;
                }
            }
            return item;
        }

        function min(arr, elem) {
            var item = arr[0];
            for (var i = 0; i < arr.length; i++) {
                var e = arr[i];
                if (e[elem] < item[elem]) {
                    item = e;
                }
            }
            return item;
        }

        function sum(arr, elem) {
            var sum = 0;
            angular.forEach(arr, function (e) {
                angular.isUndefined(elem) ? sum += parseFloat(e[elem]) : null
            })
            return sum;
        }

        function closest(arr, attr, value, direction) {
            //our target item
            value = parseInt(value);
            var selectItem = arr.filter(function (e) {
                return e[attr] == value;
            })[0];
            var selectItemValue = parseInt(selectItem[attr]);
            var ecart = 0;
            if (direction == 'before') {
                arr = arr.filter(function (e) {
                    return parseInt(e[attr]) < value;
                });
            } else if (direction == 'after') {
                arr = arr.filter(function (e) {
                    return parseInt(e[attr]) > value;
                });
            }
            for (var i = 0; i < arr.length; i++) {
                var test = arr[i];
                var testValue = parseInt(test[attr]);
                var newEcart = Math.abs(selectItemValue - testValue);
                if (ecart == 0 || newEcart < ecart) {
                    selectItem = test;
                    ecart = newEcart;
                }
            }
            return selectItem;
        }




        function toTree(data, options) {

            if (typeof data === "undefined") {
                data = [];
            }
            options = options || {};
            var ID_KEY = options.idKey || 'id';
            var PARENT_KEY = options.parentKey || 'parent';
            var CHILDREN_KEY = options.childrenKey || 'children';

            //  var item, id, parentId;
            var map = {},
                i = 0;
            for (i = 0; i < data.length; i++) { // make cache
                if (data[i][ID_KEY]) {
                    map[data[i][ID_KEY]] = data[i];
                    data[i][CHILDREN_KEY] = [];
                }
            }
            for (i = 0; i < data.length; i++) {
                if (data[i][PARENT_KEY]) { // is a child
                    if (map[data[i][PARENT_KEY]]) // for dirty data
                    {
                        map[data[i][PARENT_KEY]][CHILDREN_KEY].push(data[i]); // add child to parent
                        data.splice(i, 1); // remove from root
                        i--; // iterator correction
                    } else {
                        data[i][PARENT_KEY] = 0; // clean dirty data
                    }
                }
            }
            return data;
        }

        // jsonify stufff
        function jsonify(arr) {
            if (angular.isObject(arr)) {
                angular.forEach(arr, function (e, i) {
                    if (isJSON(e)) {
                        arr[i] = angular.fromJson(e);
                        jsonify(arr[i]);
                    } else {
                        jsonify(arr[i]);
                    }

                })

            }
            return arr;
        }

        function isJSON(data) {
            var isJson = false
            try {
                // this works with JSON string and JSON object, not sure about others
                var json = angular.fromJson(data);
                isJson = angular.isObject(json);
            } catch (ex) {
                isJson = false
            }
            return isJson;
        }

        // end jsonify stufff


        //deep search value in multidimensional array // return indices of rows
        function findObjects(obj, targetProp, targetValue, finalResults) {
            typeof finalResults == "undefined" ? finalResults = [] : null;

          function getObject(theObject) {
            let results = [];

            if (theObject instanceof Array) {
              for (let i = 0; i < theObject.length; i++) {
                getObject(theObject[i]);
              }
            } else {
              for (let prop in theObject) {
                if (theObject.hasOwnProperty(prop)) {
                  console.log(prop + ': ' + theObject[prop]);
                  if (prop === targetProp) {
                    console.log('--found id');
                      results.push[theObject]
                    if (theObject[prop] === targetValue) {
                      console.log('----found porop', prop, ', ', theObject[prop]);
                      finalResults.push(theObject);
                    }
                  }
                  if (theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                    getObject(theObject[prop]);
                  }
                }
              }
            }
          }

          getObject(obj);
            return finalResults;
        }
        


    }


})();
(function() {
  'use strict';

  angular
      .module('app')
      .service('authService', authService);

  /** @ngInject */
  function authService(APP, $http) {

    this.login = login;
    this.logout = logout;


    function login(data) {
        data.app = APP.app;
        return $http.post(APP.api+'login', data ) 
        .then(function(response) {
          return response.data;
        });
    }




   function logout() {
       var data = {};
       data.app = APP.app;
       return $http.post( APP.api + 'logout', data).then( function(r) { return r;});
   } 
  }

})();

(function() {
  'use strict';

  angular
      .module('app')
      .service('convert', convert);
    
    function convert() {
  
        this.arr2tree     = arr2tree;
       

        function arr2tree(data, options) {
          options = options || {};
          var ID_KEY = options.idKey || 'id';
          var PARENT_KEY = options.parentKey || 'parent';
          var CHILDREN_KEY = options.childrenKey || 'children';

        //  var item, id, parentId;
          var map = {}, i = 0;
            for( i = 0; i < data.length; i++ ) { // make cache
            if(data[i][ID_KEY]){
              map[data[i][ID_KEY]] = data[i];
              data[i][CHILDREN_KEY] = [];
            }
          }
          for ( i = 0; i < data.length; i++) {
            if(data[i][PARENT_KEY]) { // is a child
              if(map[data[i][PARENT_KEY]]) // for dirty data
              {
                map[data[i][PARENT_KEY]][CHILDREN_KEY].push(data[i]); // add child to parent
                data.splice( i, 1 ); // remove from root
                i--; // iterator correction
              } else {
                data[i][PARENT_KEY] = 0; // clean dirty data
              }
            }
          }
          return data;
        }           
            
    }



})();
(function() {
  'use strict';

  angular
      .module('app')
      .service('countryService', countryService);

  /** @ngInject */
  function countryService(API, $http, $q) {

    
      
    this.counties = counties;
    this.countyById = countyById;
    this.countyByName = countyByName;
    this.city = city;
      
    this.cityById = cityById;
    this.citiesByCountyId = citiesByCountyId;

    function counties() {
        var postdata = {};
        postdata.scope = 'judete';
        postdata.where = [];
        
      return  $http.post(API+'/api/get', postdata ) 
      .then(function(response) {
          return response.data.result;
      });

    }
    
    function countyById(id) {
        var postdata = {};
        postdata.scope = 'judete';
        postdata.where = [];
        postdata.where.push({'key':'id', 'value':id});
        var resp = $http.post(API+'/api/get', postdata ) 
        .then(function(response) {
            return response;
        });
            return resp;
    }
      
    function countyByName(name) {
        var postdata = {};
        postdata.scope = 'judete';
        postdata.where = [];
        postdata.where.push({'key':'name', 'value':name});
        var resp = $http.post(API+'/api/get', postdata ) 
        .then(function(response) {
            return response;
        });
            return resp;
    } 
      
      
    function cityById(id) {
        var postdata = {};
        postdata.scope = 'localitati';
        postdata.where = [];
        postdata.where.push({'key':'id', 'value':id});
        var resp = $http.post(API+'/api/get', postdata ) 
        .then(function(response) {
            return response;
        });
            return resp;
    } 
      
    function citiesByCountyId(countyId) {
        var postdata = {};
        postdata.scope = 'localitati';
        postdata.where= [];
        postdata.where.push({'key':'county_id','value':countyId});
        return  $http.post(API+'/api/get', postdata ) 
        .then(function(r) {
            return r;
        });

    } 
      
    function city(cityId) {
        var localitate,localitati, judete, promise;
        
        localitate = cityById(cityId).then(function(r) { return r.data.result[0]; });
         
        localitati = $q.when(localitate).then(function(r) {
            return citiesByCountyId(r.county_id).then(function(rs) {return rs.data.result;});
        })
  
        judete = counties().then(function(r) {   return r.data.result; });
        
        promise = [localitate, localitati, judete];
        return $q.all(promise);
    }
  }

})();

(function() {
  'use strict';

  angular
      .module('app')
      .service('dateService', dateService);

  /** @ngInject */
  function dateService() {
	  
		this.convertEN  = convertEN;

		function pad(s) { return (s < 10) ? '0' + s : s; }
		
		function convertEN(item) {
			var d = new Date(item);
			return [d.getFullYear(),  pad(d.getMonth()+1), pad(d.getDate())].join('-');
		}		

	}

})();
(function() {
  'use strict';

  angular
      .module('app')
      .service('exportService', exportService);
    
    function exportService($timeout) {
  
        this.print     = print;
       

        function print(data) {
            var popupWindow = window.open('', '_blank', 'width=1000,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWindow.document.open();
            popupWindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="assets/css/print.style.css" /></head><body onload="window.print()">' + data + '</html>');
            $timeout(function() {
                popupWindow.document.close();  
                popupWindow.window.close();
            }, 500);
                      
          return null;
        }           
            
    }


})();
 (function() {
  'use strict';

  angular
      .module('app')
      .service('fileService', fileService);

  /** @ngInject */
  function fileService() {

    this.getFile            =  getFile;
    this.upload             =  upload;
    this.remove             =  remove;



    function getFile(fileName) {
        
        return fileName;
    }  
      
    function upload(file) {
        return file; 
    }
      
    function remove(file) {
        return file;
    }
  }

})();


 
 (function() {
  'use strict';

  angular
      .module('app')
      .service('gmDialog', gmDialog);

  /** @ngInject */
  function gmDialog($mdDialog, $mdToast) {

    this.alert            =  alert;
    this.confirm          =  confirm;
    this.prompt          =   prompt;
    this.toast            = toast;



    function alert(titleText, messageText, closeButtonText) {
        
        var title = titleText || null, 
            contents = messageText || null,
            close = closeButtonText || null;
        
        var alert = $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title(title)
                .textContent(contents)
                .ariaLabel('Confirm')
                .ok(close)
             

        );
        return alert;
    }  
      
    function confirm(ev, titleText, messageText, optin, optout) {
        var title = titleText || null,
            contents = messageText || null,
            yesButton = optin || "OK",
            noButton = optout || "CANCEL";
        
        var confirm = $mdDialog.confirm()
              .title(title)
              .textContent(contents)
              .ariaLabel('confirm')
              .targetEvent(ev)
              .ok(yesButton)
              .cancel(noButton);

        var show = $mdDialog.show(confirm);
        return show;
    }

      function prompt(ev, title, textContext, yesButton, noButton) {
          title = title || null;
          textContext = textContext || null;
          yesButton = yesButton || "OK";
          noButton = noButton || "CANCEL";

          // Appending dialog to document.body to cover sidenav in docs app
          var confirm = $mdDialog.prompt()
              .title(title)
              .textContent(textContext)
              .ariaLabel('prompt')
              .targetEvent(ev)
              .ok(yesButton)
              .cancel(noButton);

          var modal = $mdDialog.show(confirm);
          return modal;

      }
      
      function toast(elem) {
          $mdToast.show(
              $mdToast.simple()
              .textContent(elem)
              .position('top right')
              .hideDelay(1000)
              .toastClass("toast")
          );
      }
      
    
  }

})();


 
(function () {
	'use strict';

	angular
		.module('app')
		.service('homePage', homePage);

	/** @ngInject */
	function homePage() {



		this.items = items;

		function items() {
			return [
				{
					title: "REGISTRU",
					titleIcon: "maps:ic_local_library_24px",
					titleIconColor: "navy",
					text: "Accesați registrul de evidență a dosarelor cu ofertele de vânzare teren, gestionați și tipăriți toate documentele aferente procedurii de vânzare teren",
					buttons: [{
						label: "ACCESEAZĂ",
						action: "index.registru",
						icon: ""
					}],
					bgColor: "#C6ACC7"
				},
				{
					title: "AGENDĂ",
					titleIcon: "av:ic_library_books_24px",
					titleIconColor: "#FDF3B8",
					text: "Gestionați persoanele fizice sau juridice regăsite în aplicație, atât vânzatori cât și mandatari sau preemptori",
					buttons: [{
						label: "GESTIONEAZĂ",
						action: "index.addressBook({action:'', id:''})",
						icon: ""
					}],
					bgColor: "#ECB4BF"
				},
				{
					title: "SETARI",
					titleIcon: "action:ic_settings_24px",
					titleIconColor: "brown",
					text: "Configurați semăturile și persoanele aferente, pe fiecare document în parte și accesul public online la documentele prevăzute de lege",
					buttons: [{
						label: "GESTIONEAZĂ",
						action: "index.settings",
						icon: ""
					}],
					bgColor: "#FBD7B7"
				},
				{
					title: "STATISTICI",
					titleIcon: "editor:ic_pie_chart_24px",
					titleIconColor: "#ECB4BF",
					text: "Dintr-o scurtă privire, analizați stadiul de rezolvare al dosarelor în termen, vedeți ce dosare au expirat sau consultați dosarele anterioare",
					buttons: [{
						label: "CONSULTĂ",
						action: "index.stats",
						icon: ""
					}],
					bgColor: "#FDF3B8"
				},
				{
					title: "ÎMPREUNĂ",
					titleIcon: "action:ic_favorite_24px",
					titleIconColor: "red",
					text: "Ajutați-ne să devenim cei mai buni! Comunicați-ne prin acest modul orice sugestii sau probleme referitoare la aplicație. Vă mulțumim!",
					buttons: [{
						label: "CONSULTĂ",
						action: "index.together({action:'list', id:''})",
						icon: ""
					}],
					bgColor: "#C2E3EC"
				}				
				]
		}

	}

})();
(function () {
    'use strict';

    angular
        .module('app')
        .service('httpMessage', httpMessage);

    /** @ngInject */
    function httpMessage() {

        this.get = getMessage;

        var messages = [
            {
                "id": 1,
                "code": 200,
                "short": "OK",
                "long": "The request is OK (this is the standard response for successful HTTP requests)"},
            {
                "id": 2,
                "code": 201,
                "short": "Created",
                "long": "The request has been fulfilled, and a new resource is created"},
            {
                "id": 3,
                "code": 202,
                "short": "Accepted",
                "long": "The request has been accepted for processing, but the processing has not been completed"},
            {
                "id": 4,
                "code": 203,
                "short": "Non-Authoritative Information",
                "long": "The request has been successfully processed, but is returning information that may be from another source" },
            {
                "id": 5,
                "code": 204,
                "short": "No Content",
                "long": "The request has been successfully processed, but is not returning any content"},
            {
                "id": 6,
                "code": 205,
                "short": "Reset Content",
                "long": "The request has been successfully processed, but is not returning any content, and requires that the requester reset the document view" },
            {
                "id": 7,
                "code": 206,
                "short": "Partial Content",
                "long": "The server is delivering only part of the resource due to a range header sent by the client" },
            {
                "id": 8,
                "code": 300,
                "short": "Multiple Choices",
                "long": "A link list. The user can select a link and go to that location. Maximum five addresses �" },
            {
                "id": 9,
                "code": 301,
                "short": "Moved Permanently",
                "long": "The requested page has moved to a new URL�" },
            {
                "id": 10,
                "code": 302,
                "short": "Found",
                "long": "The requested page has moved temporarily to a new URL�" },
            {
                "id": 11,
                "code": 303,
                "short": "See Other",
                "long": "The requested page can be found under a different URL" },
            {
                "id": 12,
                "code": 304,
                "short": "Not Modified",
                "long": "Indicates the requested page has not been modified since last requested" },
            {
                "id": 13,
                "code": 306,
                "short": "Switch Proxy",
                "long": "No longer used" },
            {
                "id": 14,
                "code": 307,
                "short": "Temporary Redirect",
                "long": "The requested page has moved temporarily to a new URL" },
            {
                "id": 15,
                "code": 308,
                "short": "Resume Incomplete",
                "long": "Used in the resumable requests proposal to resume aborted PUT or POST requests" },
            {
                "id": 16,
                "code": 400,
                "short": "Bad Request",
                "long": "The request cannot be fulfilled due to bad syntax" },
            {
                "id": 17,
                "code": 401,
                "short": "Unauthorized",
                "long": "The request was a legal request, but the server is refusing to respond to it. For use when authentication is possible but has failed or not yet been provided" },
            {
                "id": 18,
                "code": 402,
                "short": "Payment Required",
                "long": "Reserved for future use" },
            {
                "id": 19,
                "code": 403,
                "short": "Forbidden",
                "long": "The request was a legal request, but the server is refusing to respond to it" },
            {
                "id": 20,
                "code": 404,
                "short": "Not Found",
                "long": "The requested page could not be found but may be available again in the future" },
            {
                "id": 21,
                "code": 405,
                "short": "Method Not Allowed",
                "long": "A request was made of a page using a request method not supported by that page" },
            {
                "id": 22,
                "code": 406,
                "short": "Not Acceptable",
                "long": "The server can only generate a response that is not accepted by the client" },
            {
                "id": 23,
                "code": 407,
                "short": "Proxy Authentication Required",
                "long": "The client must first authenticate itself with the proxy" },
            {
                "id": 24,
                "code": 408,
                "short": "Request Timeout",
                "long": "The server timed out waiting for the request" },
            {
                "id": 25,
                "code": 409,
                "short": "Conflict",
                "long": "The request could not be completed because of a conflict in the request" },
            {
                "id": 26,
                "code": 410,
                "short": "Gone",
                "long": "The requested page is no longer available" },
            {
                "id": 27,
                "code": 411,
                "short": "Length Required",
                "long": "The \"Content-Length\" is not defined. The server will not accept the request without it�" },
            {
                "id": 28,
                "code": 412,
                "short": "Precondition Failed",
                "long": "The precondition given in the request evaluated to false by the server" },
            {
                "id": 29,
                "code": 413,
                "short": "Request Entity Too Large",
                "long": "The server will not accept the request, because the request entity is too large" },
            {
                "id": 30,
                "code": 414,
                "short": "Request-URI Too Long",
                "long": "The server will not accept the request, because the URL is too long. Occurs when you convert a POST request to a GET request with a long query information�" },
            {
                "id": 31,
                "code": 415,
                "short": "Unsupported Media Type",
                "long": "The server will not accept the request, because the media type is not supported�" },
            {
                "id": 32,
                "code": 416,
                "short": "Requested Range Not Satisfiable",
                "long": "The client has asked for a portion of the file, but the server cannot supply that portion" },
            {
                "id": 33,
                "code": 417,
                "short": "Expectation Failed",
                "long": "The server cannot meet the requirements of the Expect request-header field" },
            {
                "id": 34,
                "code": 500,
                "short": "Internal Server Error",
                "long": "A generic error message, given when no more specific message is suitable" },
            {
                "id": 35,
                "code": 501,
                "short": "Not Implemented",
                "long": "The server either does not recognize the request method, or it lacks the ability to fulfill the request" },
            {
                "id": 36,
                "code": 502,
                "short": "Bad Gateway",
                "long": "The server was acting as a gateway or proxy and received an invalid response from the upstream server" },
            {
                "id": 37,
                "code": 503,
                "short": "Service Unavailable",
                "long": "The server is currently unavailable (overloaded or down)" },
            {
                "id": 38,
                "code": 504,
                "short": "Gateway Timeout",
                "long": "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server" },
            {
                "id": 39,
                "code": 505,
                "short": "HTTP Version Not Supported",
                "long": "The server does not support the HTTP protocol version used in the request" },
            {
                "id": 40,
                "code": 511,
                "short": "Network Authentication Required",
                "long": "The client needs to authenticate to gain network access" }];

        function getMessage(id) {
            if (typeof id == 'undefined') { return messages; } 
            return messages.filter(function(item) { return item.code == id; })
        }        



    }

})();
(function() {
  'use strict';

  angular
      .module('app')
      .service('isValid', isValid);

  /** @ngInject */
  function isValid() {

    
      
    this.cnp = cnp;


	// cnp validation
    function cnp(p_cnp) {
        var result = {};
        var i = 0,
            year = 0,
            hashResult = 0,
            cnp = [],
            hashTable = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
        if (p_cnp.length !== 13) {
            result.ok = false;
            result.err = "Lungime incorectă";
            return result;
        }
        for (i = 0; i < 13; i++) {
            cnp[i] = parseInt(p_cnp.charAt(i), 10);
            if (isNaN(cnp[i])) {
                
                result.ok = false;
                result.err = "CNP trebuie să fie numeric!";
                return result;
            }
            if (i < 12) {
                hashResult = hashResult + (cnp[i] * hashTable[i]);
            }
        }
        hashResult = hashResult % 11;
        if (hashResult === 10) {
            hashResult = 1;
        }
        year = (cnp[1] * 10) + cnp[2];
        switch (cnp[0]) {
        case 1:
        case 2:
            {
                year += 1900;
            }
            break;
        case 3:
        case 4:
            {
                year += 1800;
            }
            break;
        case 5:
        case 6:
            {
                year += 2000;
            }
            break;
        case 7:
        case 8:
        case 9:
            {
                year += 2000;
                if (year > (parseInt(new Date().getYear(), 10) - 14)) {
                    year -= 100;
                }
            }
            break;
        default:
            {
                return false;
            }
        }
        if (year < 1800 || year > 2099) {
            return false;
        }
        return (cnp[12] === hashResult);

    }
    
          
  }

})();

(function () {
    'use strict';

    angular
        .module('app')
        .service('menuService', menuService);

    /** @ngInject */
    function menuService() {

        this.main = main;
        this.left = left;
        this.settings = settings;

        function left() {
            return [
                {
                    id: 1,
                    name: 'Registru general',
                    icon: 'maps:ic_local_library_24px',
                    state: 'index.registru'

              },
                {
                    id: 2,
                    name: 'Agendă',
                    icon: 'av:ic_library_books_24px',
                    state: "index.addressBook({action:'', id:''})"

              },
                {
                    id: 3,
                    name: 'Configurări',
                    icon: 'action:ic_settings_24px',
                    state: 'index.settings'
              }

            ];
        }

        function main() {
            return [
                {
                    id: 1,
                    name: 'Registru general contracte',
                    details: "acesați registrul general pentru a vedea toate contravtele",
                    icon: 'maps:ic_local_library_24px',
                    bgColor: '#BBDEFB',
                    textColor: '#00000',
                    state: 'index.registru'

              },
                {
                    id: 3,
                    name: 'Alerte și avertizări',
                    icon: 'alert:ic_warning_24px',
                    bgColor: '#BBDEFB',
                    state: 'index.alerts'
              },
                {
                    id: 4,
                    name: 'Configurări',
                    icon: 'action:ic_settings_24px',
                    bgColor: '#BBDEFB',
                    state: 'index.main',
                    children: [
                        {
                            id: 1,
                            name: 'Antete',
                            icon: 'action:ic_verified_user_24px',
                            state: 'index.settings-antet'

              },
                        {
                            id: 2,
                            name: 'Tipuri documente',
                            state: "index.settings-tipdoc",
                            icon: 'action:ic_assignment_turned_in_24px'

              },
                        {
                            id: 3,
                            name: 'Alte configurări',
                            state: 'index.settings-other',
                            icon: 'action:ic_settings_applications_24px'
              }

            ]
              },
              {
                     id: 5,
                    name: 'Liste și rapoarte',
                    icon: 'action:ic_list_24px',
                    bgColor: '#BBDEFB',
                    state: 'index.main'             

                }

            ];
        }

        function settings() {
            return [
                {
                    id: 1,
                    name: 'Antete',
                    icon: 'editor:ic_insert_photo_24px',
                    state: 'index.settings-antet'

              },
                {
                    id: 2,
                    name: 'Tipuri documente',
                    icon: 'av:ic_library_books_24px',
                    state: "index.settings-tipdoc"

              },
                {
                    id: 3,
                    name: 'Alte configurări',
                    icon: 'action:ic_settings_24px',
                    state: 'index.settings-other'
              }

            ];
        }


    }

})();
(function () {
    'use strict';

    angular
        .module('app')
        .service('qs', qs);

    /** @ngInject */
    function qs($http, APP, gmDialog) {


        this.get = get;
        this.getData = getData;
        this.getDosare = getDosare;
        this.getWhereId = getWhereId;
        this.create = create;
        this.update = update;
        this.remove = remove;
        this.smartRemove = smartRemove;
        this.max = maximum
        this.lookup = lookup


        function get(table, data) {
            let postdata = {}
            if(data) { postdata = angular.extend({table:table}, data )} else { postdata = {table:table}}
            return $http.post(APP.api + "getData", postdata)
            .then( r => r, err => err)
        }
        
        function getWhereId(id) {
            return $http.post(APP.api + 'dosare', {where: {id: id}}).then( r => r.data, err => console.log(err) )
        }
        
        function getData(data={}) {
           

            return $http.post(APP.api +"getData", data)
                .then(function (response) {
                    return response.data;
                }, ()=> { console.log("handled rejection") });
            
        }
        
        function getDosare(data) {
            angular.element(".page-loading").removeClass("hidden")
            var resp = $http.post(APP.api + "dosare", data)
               
                .then(function (response) {
                    angular.element(".page-loading").addClass("hidden")
                    return response.data;
                }, ()=> { console.log("handled rejection") });
            return resp;
        }        


        
        function create(table, data) {
            angular.element(".page-loading").removeClass("hidden")
            data.accessType = data.accessType || "private"
            var resp = $http.put(APP.api + "create", {table: table, data: data})
                .then(function (response) {
                    angular.element(".page-loading").addClass("hidden")
                    return response;
                });
            return resp;
        }

        function update(table, data) {
            angular.element(".page-loading").removeClass("hidden")
            var resp = $http.patch(APP.api + "update", {table: table, data: data})
                .then(function (response) {
                    angular.element(".page-loading").addClass("hidden")
                    return response;
                });
            return resp;
        }

        function remove(table, id) {
            let resp = $http.post(APP.api + "remove", angular.extend({table:table}, {where:{id:id}} ))
            return resp.then( response =>  response ,   err => err)
        }

        function smartRemove(table, key, value) {
            var postdata = {};
            postdata.scope = table;
            postdata.where = {
                key: key,
                value: value
            };
            return $http.post(APP.api + 'api/smartdelete', postdata)
                .then(function (response) {
                    return response;
                });

        }

        function maximum(table, field = 'id') {
            return $http.post( APP.api + 'max', {table: table, field: field})
        }
        
        function lookup(table, data) {
            return $http.post( APP.api + 'lookup', angular.extend({table:table}, data))
        }

    }

})();
(function () {
    'use strict';

    angular
        .module('app')
        .service('tipDoc', tipDoc);

    /** @ngInject */
    function tipDoc() {



        this.get = get;

        function get() {
            return [{
                    id: 1,
                    name: "Cerere afişarea ofertă de vânzare",
                    include: "app/states/dosar/includes/cerere.tpl",
                    object: "cerere"
          },
                {
                    id: 2,
                    name: "1B - Ofertă de vânzare teren",
                    include: "app/states/dosar/includes/oferta.tpl",
                    object: "oferta"
          },
                {
                    id: 3,
                    name: "PV1- afişare a ofertei de vânzare",
                    include: "app/states/dosar/includes/pv1.tpl",
                    object: "pvAfisareCerere"
          },
                {
                    id: 4,
                    name: "1C - Lista preemptorilor",
                    include: "app/states/dosar/includes/listaPre.tpl",
                    object: "listaPreemptori"
          },
                {
                    id: 5,
                    name: "PV2 - afişare a listei preemptorilor",
                    include: "app/states/dosar/includes/pv2.tpl",
                    object: "pvAfisareListaPreemptori"
          },
                {
                    id: 6,
                    name: "Solicitare vânzător - necesitate 3A",
                    include: "app/states/dosar/includes/necesar3A.tpl"
          },
                {
                    id: 7,
                    name: "3A - Adresă Direcţia de Cultură",
                    include: "app/states/dosar/includes/3A.tpl"
          },
                {
                    id: 8,
                    name: "3B - Cerere eliberare aviz specific",
                    include: "app/states/dosar/includes/3B.tpl"
          },
                {
                    id: 9,
                    name: "2D - Cerere aviz M.Ap.N.",
                    include: "app/states/dosar/includes/2D.tpl"
          },
                {
                    id: 10,
                    name: "1D - Comunicări de acceptare",
                    include: "app/states/dosar/includes/1D.tpl"
          },

                {
                    id: 12,
                    name: "Alegere prmpt. potenţial cumpărător",
                    include: "app/states/dosar/includes/ppc.tpl"
          },
                {
                    id: 13,
                    name: "Adresă înaintare / Direcţia Agricolă",
                    include: "app/states/dosar/includes/adresaDirAgr.tpl"
          },
                {
                    id: 14,
                    name: "PV4 - final (cu preemptori) ",
                    include: "app/states/dosar/includes/pv4cu.tpl"
          },
                {
                    id: 15,
                    name: "PV4 - final (fără preemptori) ",
                    include: "app/states/dosar/includes/pv4fara.tpl"
          },
                {
                    id: 17,
                    name: "Dir.Agricolă - adresă înaintare PV final",
                    include: "app/states/dosar/includes/adresaPvFinal.tpl"
          },
                {
                    id: 18,
                    name: "1E - Adeverință pentru vânzare liberă ",
                    include: "app/states/dosar/includes/1E.tpl"
          },
                {
                    id: 19,
                    name: "Dir.Agricolă - adresă înaintare 1E",
                    include: "app/states/dosar/includes/adresa1E.tpl"
          },
                {
                    id: 99,
                    name: "Dir.Agricolă - adresă înaintare comunicare acceptare",
                    include: "app/states/dosar/includes/adresaInaintareAcceptare.tpl",
                    notAMenuItem: true
          }	                    
       ];
        }

    }

})();
(function() {
  'use strict';

  angular
      .module('app')
      .service('userService', userService);

  /** @ngInject */
  function userService( API, $http) {

    this.getCurrentUser = getCurrentUser;
    this.getUser        = getUser;
    this.getUsers       = getUsers;
    this.create         = create;
    this.update         = update;
    this.remove         = remove;

    function getUsers() {
        
      var resp = $http.post(API +'users/', '' ) 
      .then(function(response) {
          return response;
      });
        return resp;
    }

    function getCurrentUser() {
        var resp = $http.post( API+'users/getUser', '').then( function(r) { return r; } );
        return resp;        
    }

    function getUser(data) {
        var resp = $http.post( API+'users/getUser', {id:data}).then( function(r) { return r; } );
        return resp;        
    }
      
    function create(data) {
        var resp = $http.post( API+'users/create', data).then( function(r) { return r; } );
        return resp;
    }

   function update(data) {
       var resp = $http.post( API + 'users/update', data).then( function(r) { return r;} );
       return resp;
   }
      
   function remove(data) {
       var resp = $http.post( API + 'users/delete', {'id':data}).then( function(r) { return r;} );
       return resp;
   }      
      
  }

})();

(function () {
    'use strict';

    angular
        .module('app')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('index', {
                abstract: true,
                views: {
                    '@': {
                        templateUrl: 'app/states/_main/main.html',
                        controller: 'MainController',
                        controllerAs: 'vm'
                    },
                    'navleft@index': {
                        templateUrl: 'app/states/_main/partials/navleft.html'
                    },
                    'toolbars@index': {
                        templateUrl: 'app/states/_main/partials/toolbars.html'
                    },
                    'content@index': {
                        templateUrl: 'app/states/_main/partials/content.html'
                    }
                    

                },
				controller: function(localStorageService, $state) {
					  if (  localStorageService.get('apikey') ==  null ) {
						  $state.go('login');
	  					}	
				},
                controllerAs:"vm"

            })
        .state('index.main', {
                url: '/'
            });

        $urlRouterProvider.otherwise('/');
    }

})();
(function() {
  'use strict';

  angular
    .module('app')
    .controller('ListBottomSheetController', ListBottomSheetController);

  /** @ngInject */
  function ListBottomSheetController($mdBottomSheet, $state) {
      var vm = this;
      

      vm.items = [

        { name: 'Registru general', icon: 'maps:ic_local_library_24px', state: 'index.registru' },
        { name: 'Management contacte', icon: 'action:ic_power_settings_new_24px', state:  "index.addressBook" },
        { name: 'Setări aplicație', icon: 'action:ic_settings_24px', state: 'index.settings' },
        { name: 'IEȘIRE', icon: 'action:ic_power_settings_new_24px', state: 'logout' }

      ];

      vm.itemClick = function($index) {
        var clickedItem = vm.items[$index];
        $mdBottomSheet.hide(clickedItem);
        $state.go(clickedItem.state);
      };
  }
  
    

    

})();

(function () {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController( $rootScope, APP, homePage, localStorageService, $state, $mdBottomSheet, $mdSidenav, gmDialog, $log, menuService ) {
        var vm = this;
        vm.app = APP;
      
        vm.local = localStorageService.get('user');

        vm.title = APP.name;
        vm.version = APP.version;
        vm.appName = APP.name;

        vm.appVersion = APP.version;
        vm.leftMenu = menuService.left();
        vm.mainMenu = menuService.main();

        if (localStorageService.get('apikey') == null) {
            $state.go('login');
        }


        //toggle chidren (item)

        vm.toggleChildren = function (index) {
            angular.forEach(vm.mainMenu[index].children, function (e, i) {
                vm.mainMenu[index].children[i].visibility = !vm.mainMenu[index].children[i].visibility;
            })
        }


        // Toolbar search toggle
        vm.toggleSearch = function () {
            vm.showSearch = !vm.showSearch;
            if ( vm.showSearch == false ) { vm.searchCriteria = '';}
        };

        // Sidenav toggle
        vm.toggleSidenav = function (menuId) {
            // fix for overlapping on larger page (gabizz)
           // var pageWidth = angular.element($window).width();

            //          if (pageWidth < 1200 ) {
            $mdSidenav(menuId).toggle();
            //          }

        };


        // Bottomsheet & Modal Dialogs
        vm.alert = '';
        vm.showListBottomSheet = function ($event) {
            vm.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'app/states/_main/listBottomSheet.template.html',
                controller: 'ListBottomSheetController',
                controllerAs: 'libo',
                targetEvent: $event
            });
        };

        vm.previousState = "index.main";
      
        //states tracking
        $rootScope.currentState;
        $rootScope.previousState;
        // $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
        $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {

            $rootScope.previousState = from.name;
            $rootScope.currentState = to.name;
            vm.currentState = to.name;
            vm.previousState =  from.name;
            vm.fromParams = fromParams;
         //   console.log("States: previous:", vm.previousState, " current:", vm.currentState);
        //   console.log("States,", vm.previousState, vm.currentState);
            if ( vm.currentState == "index.main" )  { vm.title = APP.name; }

        });
        
       







    }


})();
(function () {
    'use strict';

    angular
        .module('app')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider) {

        $stateProvider
        .state('index.addressBook', {
            url: '/contacts',
            views: {
                'content@index': {
                    templateUrl: "app/states/addressBook/main.html",
                    controller: 'ContactsController',
                    controllerAs: 'vm',
					resolve: {
						data: function(qs, $stateParams, arrays) {
							var id = $stateParams.id;
                            return qs.getData({table:'persoane', attributes: ['id', 'name', 'cnp', 'cui'] })
						}
						
					}
               
                }
            }
            
        })
        
    }

})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('ContactsController', ContactsController)


    /** @ngInject */
    function ContactsController(data, $stateParams, $state, qs, $log, $mdBottomSheet, gmDialog, httpMessage) {
        var vm = this, item, query, modal, tpl
        
        

        console.log(data)
        vm.contacts = data


        // UPDATE CONTACT
        vm.update = (p) => {
console.log("pe:",p)
            //pf
             tpl = (angular.isUndefined(p.cui) || p.cui.length == 0) ? "main-pf.html" : "main-pj.html"
                
                modal = $mdBottomSheet.show({
                    templateUrl: "app/states/addressBook/"+tpl,
                    controller: function(item, $mdBottomSheet, qs) {
                        var vm = this
                        qs.getData({table:'persoane', where:[{id: p.id }]}).then(  r => {
                            console.log("persoana", r)
                            vm.item = r[0]
                            
                            vm.item.content = angular.fromJson(vm.item.content)
                        })
                        
                       
                        vm.close = () => $mdBottomSheet.hide()
                        vm.submit = function(item) { $mdBottomSheet.hide(item) }
                    }, 
                    controllerAs: 'vm',
                    clickOutsideToClose: true,
                    locals: { item: vm.item }
                })  
            
             modal.then(r => {
                 if (angular.isDefined(r)) {
                        
                         console.log("modal then:", r)
                         angular.isDefined(r.content) ? r.content = angular.toJson(r.content) : null
                         query = qs.update('persoane', r)
                         query.then((resp) => {
                             console.log(resp, r)

                             item = data.filter(elem => elem.id == r.id)[0]
                             data[data.indexOf(item)] = r

                         }, (r) => {
                             // rejection
                             var msg = httpMessage.get(r.status)
                             gmDialog.alert(msg[0].short, msg[0].long, "ÎNCHIDE")

                         })
                     }


             }, () => console.log("you clicked ouside to close ;)"))
             }
        
        // CREATE CONTACT
        vm.create = (personType) => {
            tpl = personType == 'pf' ? "main-pf.html" : "main-pj.html"
            modal = $mdBottomSheet.show({
                templateUrl: "app/states/addressBook/"+tpl,
                controller: function($mdBottomSheet) {
                    var vm = this
                    vm.item = {}
                    vm.item.content = {}
                    vm.close = () => $mdBottomSheet.hide()
                    vm.submit = function(item) { $mdBottomSheet.hide(item) }
                }, 
                controllerAs: 'vm',
                clickOutsideToClose: true
            })   
            
            modal.then( (r) => {
                angular.isDefined(r.content) ? r.content = angular.toJson(r.content) : null
                query = qs.create('persoane', r)
                query.then( (resp) => {
                    r.id = resp.data.msg;
                    
                    gmDialog.alert("SUCCES!", "Persoana " + r.name + " a fost adăugată în agendă!", "ÎNCHIDE")
                    .then( () => { data.push(r)} ) 
                    
                }, (r) => {
                    // rejection
                    var msg = httpMessage.get(r.status)
                    gmDialog.alert(msg[0].short, msg[0].long, "ÎNCHIDE")

                })
            })
        }
        


        vm.submit = (item) => {
            if (angular.isUndefined(item.id)) {
                //create
                $log.info("create:", item)
            }

            if (angular.isDefined(item.id)) {
                //update
                $log.info("update:", item)
            }
        }

        vm.remove = item => {
            var dialog = gmDialog.confirm(item, "ATENȚIE", "Veți șterge definitiv persoana!", "DA", "NU")
            dialog.then( ()=> {
                qs.remove('persoane', item.id)
                    .then( 
                    r =>  {
                        if ( r.ok == true ) {
                            gmDialog.alert("SUCCES!", "Ștergea contactului "+ item.name +" a fost realizată!", "ÎNCHIDE")
                            .then( () => {
                                var item = data.filter( elem => elem.id == r.data.msg)[0];
                                data.splice(data.indexOf(item),1);                        
                            })                        
                    } else {
                        gmDialog.alert(r.data.msg.name|| "EROARE", r.data.sqlMessage || "persoana are dosare" , "ÎNCHIDE")
                    }


                    }, err => {
                    // rejection
                    console.log("rejection!!!")
                    gmDialog.alert(err.msg.name, err.sqlMessage, "ÎNCHIDE")

                })                
            })

        }


    }




})();
(function() {
  'use strict';

  angular
    .module('app')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('index.alerts', {
        url: '/alerts',
        views: {
             'content@index': {
                templateUrl: 'app/states/alerts/main.html',
                controller: 'AlertsController',
                controllerAs: 'vm'               
             }
        }

        })
        

      
  }

    
})();
 
(function() {
  'use strict';

  angular
    .module('app')
    .controller( "AlertsController", AlertsController);
    
      /** @ngInject */
    
    function AlertsController($scope) {
        
        var vm = this;
        $scope.$parent.vm.title = "Alerte și notificări";
   
        vm.item = null; 
    }
    
})();
(function() {
  'use strict';

  angular
    .module('app')
    .controller( "PeopleController", PeopleCtrl);
    
      /** @ngInject */
    
    function PeopleCtrl(action, qs, $mdBottomSheet) {
        
        var vm = this;
        vm.item = {};
        var query;

        vm.action = action;
        
      
        vm.close = function() { $mdBottomSheet.hide() };
        
        vm.submit = function(item) {

            item.content = angular.toJson(item.content);
            
            query = qs.create('persoane', item);
            
            query.then( (r) => {

                item.id = r.data.msg;
                item.content = angular.fromJson(item);
                $mdBottomSheet.hide(item);
            })
        
        };
    }
    
})();
(function () {
    'use strict';

    angular
        .module('app')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider) {
        

        $stateProvider
            .state('index.document', {
                url: '/document/:id',
                views: {
                    'content@index': {
                        templateUrl: 'app/states/document/main.html',
                        controller: 'DocumentController',
                        controllerAs: 'vm',
                        resolve: {
                            id: $stateParams  =>  $stateParams.id,
                            tipdoc: qs => qs.getData({table:'set_tipdoc', attributes: ['id', 'name'] }),
                            registru:   function(qs, id) { 
                                return  qs.getDosare( {where:[{id:id }]})
                                    .then( (resp) => {
                                        return resp.rows[0] || {}
                                    })
                            }
                        }
                    }
                }
            })
    }


})();
(function() {
  'use strict';

  angular
    .module('app')
    .controller( "DocumentController", DocumentController);
    
      /** @ngInject */
    
    function DocumentController( $scope , registru, tipdoc,  arrays, $mdDialog, gmDialog, $mdBottomSheet, $log, qs, $q, $mdToast, $timeout, moment) {
         
        console.log(tipdoc)
        var vm = this
        vm.rmQue={parti:[], mandatari:[]}
        
        $scope.$parent.vm.title = "DOCUMENT"
       
    

      //  registru = registru.length > 0 ? registru[0] : [];
        vm.registru = registru
        vm.parti = registru.partis


        vm.registru.data = moment(vm.registru.data*1000).toDate()
        
        if ( registru.parent == 0 && vm.registru.detalii) {
            vm.registru.detalii.data.dataStart = moment(vm.registru.detalii.data.dataStart*1000).toDate() 
            vm.registru.detalii.data.dataEnd = moment(vm.registru.detalii.data.dataEnd*1000).toDate() 
            vm.durata = moment(vm.registru.detalii.data.dataEnd).diff(moment(vm.registru.detalii.data.dataStart), "years");            
            
         
        } else if ( registru.parent == 0 && !vm.registru.detalii ) {
            vm.registru.detalii = {data:{dataStart: moment().toDate(), dataEnd: moment().toDate(), durata:0}}
            
        }
        
        // calcul durata on change
        vm.calculDurata = (changedElem) => {
            let start = moment(vm.registru.detalii.data.dataStart)
            let end = moment(vm.registru.detalii.data.dataEnd)
            switch ( changedElem ) {
                case 'start' :  vm.durata = end.diff(start, 'years')
                break
                case 'end'   : vm.durata =  end.diff(start, 'years')
                break
                case 'interval': 


                    vm.registru.detalii.data.dataEnd = start.add(vm.durata, 'years').toDate();
                break
            }

        }           
    
        
        // calcul total anexe initial
        if ( vm.registru.parent == 0 && vm.registru.anexes.length > 0 ){
            vm.sumAnexe = 0 
            
            vm.registru.anexes.map( e => {
                e.ha = e.ha ? e.ha : 0
                vm.sumAnexe += +e.ha
            })
            vm.sumAnexe = Math.round(vm.sumAnexe * 100) / 100
        }

        
        // get element which is "CONTRACT"
        vm.documentType = angular.copy(tipdoc).filter( (item) => item.id == registru.docType && item.name == "CONTRACT");
        vm.documentType.length > 0 ? vm.documentType = vm.documentType[0].id : null
        
        //edit PARTE
        vm.edit = item => {
            // add through edit controller tweak (creating an valid editable object for edit modal)
            if (!angular.isObject(item) ) {
                item =  {
                    id: null,
                    parent: registru.id,
                    persoana: '',
                    calitate: item,
                    cId: registru.cId,
                    uId: registru.uId,
                    accessType: registru.accessType,
                    persoane: {name: ''},
                    mandataris: []
                }
            }
            $mdDialog
                .show({
                    templateUrl: "./app/states/document/editParteModal.html",
                    controller: 'EditParteController',
                    controllerAs: 'vm',
                    locals: {item : item},
                    clickOutsideToClose: true
                })
                .then( r => {
                console.log( r )
                if (r.success) {
                    qs.getDosare( {where:[{id:vm.registru.id }]})
                        .then( resp =>  {
                            vm.registru = resp.rows[0] 
                            vm.registru.data = moment(vm.registru.data*1000).toDate()
                            if ( vm.registru.detalii ) {
                                vm.registru.detalii.data.dataStart = moment(vm.registru.detalii.data.dataStart*1000).toDate()
                                vm.registru.detalii.data.dataEnd = moment(vm.registru.detalii.data.dataEnd*1000).toDate()  
                                

                            }
                                           
                        })                    
                }
            }, err => err)
        }
        
        // REMOVE PARTE
        vm.removeParte = item => {
            let confirmation =  gmDialog.confirm('', "Veți elimina titularul " + item.persoane.name + " (și eventualii mandatari)!", " DORIȚI ÎNTR-ADEVĂR SĂ CONTINUAȚI?", "DA", "NU")
            
            let promises = []
            confirmation.then( resp => {
                if ( resp ) {
                    
                    // remove mandatar if exists
                    if ( item.mandataris.length == 0 ) {
                        promises.push($q.resolve())
                    } else { 
                        promises.push( qs.remove( 'mandatari', item.mandataris[0].id ))
                    }
                    // remove persoana
                    promises.push( qs.remove( 'parti', item.id ))
                }
                
                $q.all(promises).then( () => {
                    qs.getDosare( {where:[{id:vm.registru.id }]})
                        .then( resp =>  {
                            vm.registru = resp.rows[0] 
                            vm.registru.data = moment(vm.registru.data*1000).toDate()
                            if ( vm.registru.detalii ) {
                                vm.registru.detalii.data.dataStart = moment(vm.registru.detalii.data.dataStart*1000).toDate()
                                vm.registru.detalii.data.dataEnd = moment(vm.registru.detalii.data.dataEnd*1000).toDate()                                
                            }
                                          
                        })
                })
                    
            }, err => console.log("no"))
            
        }
        
        // DETALII FORM WATCHER // add or update 'detalii'
        vm.submitDetalii = formData => {
            console.log(formData)
            $timeout( ()=> {
                let postdata = {}
                formData.id = typeof formData.id !== 'undefined' ? formData.id : null
                //prepare diferent object for contract and conex
                if ( vm.registru.parent == 0 ) {
                    postdata = {
                        id: formData.id,
                        parent: vm.registru.id,
                        cId: formData.cId, uId: formData.uId, accessType: formData.accessType,
                        data: angular.toJson({
                            dataStart: moment(formData.data.dataStart).unix(),
                            dataEnd: moment(formData.data.dataEnd).unix(),
                            catTeren: formData.data.catTeren,
                            ha: formData.data.ha,
                            pret: formData.data.pret,
                            explicatii: formData.data.explicatii
                        })
                    }                    
                } else {
                    postdata = {
                        id: formData.id,
                        parent: vm.registru.id,
                        cId: formData.cId, uId: formData.uId, accessType: formData.accessType,
                        data: angular.toJson({content: formData.data.content})
                    }
                }
                
                // create or update based on item id existance
                if ( postdata.id == null) {
                    //create
                    delete(postdata.id)
                    qs.create('detalii', postdata).then( r => {
                        vm.registru.detalii.id = r.data.msg.id
                        gmDialog.toast('created!')
                    } , err => console.log(err))
                } else {
                    //update
                    qs.update('detalii', postdata).then( ()=> gmDialog.toast("updated!"))
                }
               

               
            }, 500)

        } 
        
        
        // ANEXE FORM WATCHER
        vm.submitAnexe = anexe => {
            vm.sumAnexe = 0
            anexe.map( e => {
                vm.sumAnexe += +e.ha
                if ( !e.id ) {
                    qs.create('anexe', e).then( r => {
                    let anexa = vm.registru.anexes[vm.registru.anexes.indexOf(e)]
                    anexa.id = r.data.msg.id
                    })
                    
                } else {
                    qs.update('anexe', e )
                }
            })
            console.log("suma", vm.sumAnexe)
        }
        
        // ANEXA REMOVER
        
        vm.removeAnexa = item => {
            gmDialog.confirm('','ATENȚIE!', 'se va șterge definitiv această anexă!', 'DA', 'NU')
            .then( ()=> {
                qs.remove('anexe', item)
                    .then( ()=>{
                        vm.registru.anexes.splice(vm.registru.anexes.indexOf(item), 1)
                    }, (err)=> console.log("could not delete anexa.. reason:", err))
            }, ()=>{})
        }

    } 
    
})();
(function() {
  'use strict';

  angular
    .module('app')
    .controller( "EditParteController", EditParteController);
    
      /** @ngInject */
    
    function EditParteController( item, $mdDialog, arrays, qs, $q) {
        
        let vm = this;
        vm.item = {}
        vm.item.titular =  {
            "id": item.id,
            "parent": item.parent,
            "persoana": item.persoana,
            "calitate": item.calitate,
            "cId": item.cId,
            "uId": item.uId,
            "accessType": item.accessType,
            "name": item.persoane.name,
        }
        
        if ( item.mandataris.length>0) {
            vm.item.mandatar =  
                {
                    "id": item.mandataris[0].id || null,
                    "parte": item.mandataris[0].parte || null,
                    "persoana": item.mandataris[0].persoana || null,
                    "calitate": item.mandataris[0].calitate || 'mandatar',
                    "cId": item.mandataris[0].cId || item.cId,
                    "uId": item.mandataris[0].uId || item.uId,
                    "accessType": item.mandataris[0].accessType || item.accessType,
                    "name": item.mandataris[0].persoane.name || null
                }
            
        }
        vm.close = () => $mdDialog.hide()

//        AUTCOMPLETE SHIT (persoana)
        vm.foundPers = []
        vm.searchText = vm.item.titular.name     
        vm.searchTextChange = pers => { 
            if ( pers.length == 0 ) {
                vm.item.titular.persoana = null
                vm.item.titular.name = null
            }
            qs.lookup('persoane', {
                lookInto: ['name'],
                attributes: ['id', 'name'],
                keyword: pers ? pers.toUpperCase() : null
            }).then( r => {vm.foundPers = r.data;}, err => vm.foundPers = [])
        }
        vm.selectedItemChange = item => {
            if (item) {
                vm.item.titular.persoana = item.id
                vm.item.titular.name = item.name
            }    
        }
//        END AUTOCOMPLETE SHIT  (persoana)       

//        AUTCOMPLETE SHIT (mandatar)
        vm.foundPersM = []
        vm.searchTextM = typeof vm.item.mandatar !== 'undefined' && typeof vm.item.mandatar.name !== 'undefined' ? vm.item.mandatar.name : null
        vm.searchTextChangeM = pers => { 
            if ( pers.length == 0 ) {
                vm.item.mandatar.persoana = null
                vm.item.mandatar.name = null
            }            
            qs.lookup('persoane', {
                lookInto: ['name'],
                attributes: ['id', 'name'],
                keyword: pers ? pers.toUpperCase() : null
            }).then( r => {vm.foundPersM = r.data;}, err => vm.foundPersM = [])
        }
        vm.selectedItemChangeM = item => {
            if (item) {
               vm.item.mandatar.persoana = item.id
               vm.item.mandatar.name = item.name
            }    
        }
//        END AUTOCOMPLETE SHIT  (mandatar)  
        

//        add blank mandatar if not exists
    
        vm.addMandatarBlank = item => {
            item.mandatar = {
                parte: item.id, 
                persoana: null, 
                calitate: 'mandatar', 
                cId: vm.item.titular.cId, uId: vm.item.titular.uId, accessType: vm.item.titular.accessType,
                name : null
            }
        }

        //submit data, add-modify to db, fetch the modified document object and send it back to DocumentController
        
        vm.submit = item => {
            //persona 
            let promises = []
            //add if id is null
            if ( item.titular.id == null ) {
                console.log('add')
                delete(item.titular.id)
                promises.push(qs.create('parti', item.titular))
                
            } 
            //mod if id exists
            if ( item.titular.id != null ) {
               promises.push(qs.update('parti', item.titular))
            }
            //mandatar add if exists
            if ( ! item.mandatar ) {
                promises.push($q.resolve())
            } else {
                promises[0].then( resp => {
                    // treat create/update responses differently
                    console.log(resp)
                    //when updating titular
                    if ( angular.isArray(resp.data.msg) ) {
                        item.mandatar.parte = item.titular.id
                    } else {
                        item.mandatar.parte = resp.data.msg.id
                    }
                    
                    // if no id, create mandatar
                    if ( item.mandatar.id == null ) {
                        delete(item.mandatar.id)
                        promises.push(qs.create('mandatari', item.mandatar))
                    } else {
                        promises.push(qs.update('mandatari', item.mandatar))
                    }
                })
            }
            
            $q.all(promises).then( () => {
               $mdDialog.hide({success: true})
                
            }, err => console.log({err:err}))
        }

        
        
    }
})();
(function() {
  'use strict';

  angular
    .module('app')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('exception', {
        url: '/exception/:id',
        templateUrl: 'app/states/exception/template.html',
        controller: 'ExceptionController',
        controllerAs: 'vm',
        resolve: {
            errId: function($stateParams) {
                return $stateParams.id;
            }
        }
        

      })
  }

    
})();
 
(function() {
  'use strict';
  angular
    .module('app')
    .controller('ExceptionController', ExceptionController);
  /** @ngInject */
  function ExceptionController( errId, httpMessage) {
      
      var vm = this;
      
      
      
      vm.error = httpMessage.get(errId)[0];
   
      
  }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider) {

        $stateProvider


        .state('login', {
            url: '/login',
            templateUrl: 'app/states/login/login.main.html',
            controller: 'LoginController',
            controllerAs: 'vm'
			
        })
        .state('logout', {
            url: '/logout',
            template: '<div></div>',
            controller: 'LogoutController',
            controllerAs: 'vm'
        })

    }

})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController)
        .controller('LogoutController', LogoutController);

    /** @ngInject */
    function LoginController($log, authService, localStorageService, $state, APP, $mdDialog, gmDialog) {
        var vm = this;
        vm.app = APP;

        vm.submit = function (data) {
            authService.login(data).then(function (r) {

                if (typeof r.uid != 'undefined') {
                    localStorageService.set('uid', parseInt(r.uid));
                    localStorageService.set('apikey', r.hash);
                    localStorageService.set('user', r);
                    $state.go('index.main');
                }
                if (r.ok == false) {
                    gmDialog.alert("EROARE", "Eroare autentificare", "INCHIDE");
                }
            });
        }
        if (localStorageService.get('apikey') != null) {
            $state.go('index.main');
        }

        vm.articleContent = function (art) {
            var modal = $mdDialog.show({
                templateUrl: 'app/states/_main/partials/artContentModal.tpl',
                controller: function (item, $mdDialog) {
                    var vm = this;
                    vm.item = item;
                    vm.close = function () {
                        $mdDialog.hide();
                    }
                },
                controllerAs: 'vm',
                locals: {
                    item: art
                },
                clickOutsideToClose: true
            });
            modal.then(function(r) { return r;})
        }
    }

    function LogoutController($log, authService, localStorageService, $state) {
        authService.logout()
            .then(function () {
                localStorageService.remove('uid');
                localStorageService.remove('user');
                localStorageService.remove('apikey');
                $state.go('login');
            })
    }




})();
(function () {
    'use strict';
    angular
        .module('app')
        .config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider) {
        $stateProvider
            .state('index.registru', {
                url: '/registru',
                views: {
                    'content@index': {
                        templateUrl: 'app/states/registru/main.html',
                        controller: 'RegistruController',
                        controllerAs: 'vm',
                        resolve: {
                            tipdoc: qs => qs.getData({table:'set_tipdoc', attributes: ['id', 'name'] })
                        }
                    }
                }
        })
        
    }
})();
(function() {
  'use strict';

  angular
    .module('app')
    .controller( "addDocumentController", addDocumentController);
    
      /** @ngInject */
    
    function addDocumentController ( contracte, maxNumber, $state, $mdBottomSheet, qs, tipdoc,  arrays, $log, moment) {
        var vm=this;
console.log("max", maxNumber)
       
       vm.tipdoc = tipdoc
        
       vm.contracte = contracte

       vm.item = {}
       
        // show/hide "pentru contractul"
        vm.docTypeChanged = (elem) => { 
            var docType = tipdoc.filter( (e) => { return e.id == elem })[0];
            if ( docType.name == "CONTRACT" ) {
                vm.showParentSelector = false
                vm.item.parent = 0 
            } else {
                vm.showParentSelector = true 
            }
        }
        //show posible parents for "pentru contractul"       
        
        vm.item = {}
        vm.item.nr = parseInt(maxNumber)+1
        vm.item.data = new Date()

       
        
        vm.close = function() { $mdBottomSheet.hide(); }
        
        vm.submit = function() { 
            $mdBottomSheet.hide(vm.item).then(function(r) {
              r.data = moment(r.data).unix();
              r.accessType = "shared";
              qs.create('registru', r)
                .then(
                  function(resp) {
                     
                      if ( resp.data.ok == true ) {
                          $state.go("index.document", {id:resp.data.msg.id});
                      }
                  },
                  function() { $log.info("err"); })
            })
        }
                                              
    }
    
})();
(function() {
  'use strict';

  angular
    .module('app')
    .controller( "IstoricController", IstoricController);
    
      /** @ngInject */
    
    function IstoricController(item, reg, $mdDialog, arrays) {
        var vm = this;
        console.log(item)
        vm.item = item;
        vm.reg = reg;
        vm.close = function() { $mdDialog.hide(); }

         if ( vm.item.docType != 0) {
             vm.parent  =  angular.copy(reg).filter( (elem) =>  elem.parent == item.id );
             //vm.item.detalii = {};
             console.log(vm.parent);
             
             vm.item = arrays.jsonify(vm.item);
           //  vm.item.detalii.data = angular.fromJson(vm.item.detalii.data);
         }
        
        
    }
})();    
(function() {
  'use strict';

  angular
    .module('app')
    .controller( "RegistruController", RegistruController);
    
      /** @ngInject */
    
    function RegistruController($scope,  tipdoc, $stateParams, $mdBottomSheet, $mdDialog, gmDialog, localStorageService, qs) {

        let vm = this
        let defaultItemsPerPage = vm.pagination ? vm.pagination.length : 50

        if ( !localStorageService.get('pagination') ) {
            qs.getDosare({offset:0, limit: defaultItemsPerPage}).then( result => {
                vm.reg = result
                vm.pages = getPagination(result.count, defaultItemsPerPage)
                vm.selectedPage = vm.pages[0]
            })
            
        } else {
            vm.pages = localStorageService.get('pagination')
            let selectedPage = vm.pages.filter( item => item.default == true )
            qs.getDosare({ offset:selectedPage[0].offset, limit: selectedPage[0].limit}).then( result => vm.reg = result)
            vm.selectedPage = selectedPage[0]
        }
        
        vm.setSelectedPage = page => {
            page = page || vm.selectedPage
            qs.getDosare({offset:page.offset, limit: page.limit}).then( result => {  vm.reg = result })
            vm.pages.map (e => {   page == e ? e.default = true : delete(e.default) })
            localStorageService.set('pagination', vm.pages)
            vm.selectedPage = vm.pages[vm.pages.indexOf(page)]

        }
        
        vm.changePagination = itemsPerPage => {
            
            if ( itemsPerPage == "toate") {
                let confirm = gmDialog.confirm("","Dacă aveți un număr mare de dosare, această operațiune poate dura destul de mult!", "Sunteți sigur?",  "DA, le vreau pe toate",  "NU, arată-mi câte 100/pagină")
                confirm.then(  resp => { 
                    resp == true ? itemsPerPage = 99999 : itemsPerPage = 100
                    vm.pages = getPagination(vm.reg.count, itemsPerPage) 
                    vm.pages[0].default = true
                    vm.selectedPage = vm.pages[0]
                    localStorageService.set('pagination', vm.pages)   
                }, (err) => {
                    itemsPerPage = 100
                    vm.pages = getPagination(vm.reg.count, itemsPerPage) 
                    vm.pages[0].default = true
                    vm.selectedPage = vm.pages[0]
                    localStorageService.set('pagination', vm.pages)                       
                })
            } else {
                vm.pages = getPagination(vm.reg.count, itemsPerPage) 
                vm.pages[0].default = true
                vm.selectedPage = vm.pages[0]
                localStorageService.set('pagination', vm.pages)                 
            }

        }
        
        vm.pageTick = action => {
            
            let pageNumber = vm.selectedPage.pageNumber
            vm.pages.map( e => e.default ? delete(e.default) : null )
            if ( pageNumber != 1 && action == "prev" ) {
                let prevPage = vm.pages.filter( elem => elem.pageNumber == pageNumber-1 )[0]
                prevPage.default = true
                vm.selectedPage = prevPage
            }
            if ( pageNumber != vm.pages.length && action == "next" ) {
                let nextPage = vm.pages.filter( elem => elem.pageNumber == pageNumber+1 )[0]
                nextPage.default = true
                vm.selectedPage = nextPage
            } 
            if ( action == "start" ) {
                vm.pages[0].default = true
                vm.selectedPage = vm.pages[0]
            }
            if ( action == "end" ) {
                vm.pages[vm.pages.length-1].default = true
                vm.selectedPage = vm.pages[vm.pages.length-1]
            }            
        }

        //add new item
        vm.add = function() {
        var addModal = $mdBottomSheet.show({
                templateUrl: "app/states/registru/addDocument.form.html",
                controller: "addDocumentController",
                controllerAs: 'vm',
                clickOutsideToClose: true,
                locals: {
                    tipdoc: tipdoc
                },
                resolve: {
                    contracte: qs => qs.getData({table: 'registru', where:[{parent:0}], attributes: ['id', 'nr', 'data']}),
                    maxNumber: qs => qs.max('registru', 'nr').then( r => r.data.max, err=> err)
                }
            });
            
            addModal.then(function(r) { return r;}, ()=>{})
/*            addModal.then(function(r) {
                r.docTypeLabel = vm.tipdoc.filter(function(e) { return e.id == r.docType})[0].name;
                vm.registru.push(r);
            }, 
            function() { console.log('err');})*/
        }

        vm.search = function() { 
            vm.searchActive = !vm.searchActive;
            if (vm.searchActive == false) { 
                vm.searchCriteria = '';
            }

        }
        
    vm.filter = state => {
        let initReg = angular.copy(vm.reg)
        
        if (state == true ) {
            let filterModal = $mdDialog.show({
                templateUrl: 'app/states/registru/filter/filterModal.html',
                controller: 'FilterController',
                controllerAs: 'vm',
                clickOutsideToClose: true,
                locals: {
                    tipdoc: tipdoc
                }
            })
        }
    }
        

        
        //remove item from registru        
        vm.remove = function (item) {
            console.log(item)
            var rmConfirm = gmDialog.confirm("STERGERE CONTRACT", "ATENTIE", "Se va șterge documentul și eventualele documente conexe!", "DA", "NU");

            rmConfirm.then(function (resp) {
                if (resp == true) {
                    //deletion -- needs new Express endpoint for dosar deletion!!!
                }
            })
    }
        //end remove item from registru


         
         
    }
    
    
    function getPagination(len, ipp) {
        let pages = Math.round(len/ipp)
        if ( len & ipp != 0 ) { pages = pages+1 }
        let paginator = [];
        let pageNumber = 0
        for ( var i = 0; i < len; i += ipp ) {
            pageNumber++
            paginator.push({
                pageNumber: pageNumber,
                offset: i,
                limit: ipp
            })
        }
        return paginator
        
        
    }
    
})();
(function() {
  'use strict';

  angular
    .module('app')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('index.settings', {
        url: '/settings',
        views: {
             'content@index': {
                templateUrl: 'app/states/settings/main.html',
                controller: 'SettingsController',
                controllerAs: 'vm',
                resolve: {
                        settings: function(qs, $q) {

                            var p1 = qs.get('settings').then(function(r) { return r.data.result; }, function() { return null;} );
                            var p2 = qs.get('set_tipdoc').then(function(r) { return r.data.result; }, function() { return null; } );

                            
                            return $q.all([p1,p2])
                                .then( 
                                function(r) { return {settings:r[0], tipdoc:r[1]}},
                                function() { return null; }
                            );
                        }
                    }                
             }
        }

        })
        

      
  }

    
})();
 
(function() {
  'use strict';

  angular
    .module('app')
    .controller( "SettingsController", SettingsController);
    
      /** @ngInject */
    
    function SettingsController($scope, settings, menuService) {
        
        var vm = this;
        $scope.$parent.vm.title = "SETĂRI";
        
        vm.tipdoc = settings.tipdoc;
        vm.settings = settings.settings;
        vm.settingsMenu = menuService.settings();

        
    }
    
})();
(function() {
  'use strict';

  angular
    .module('app')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('index.settings-antet', {
        url: '/settings-antet',
        views: {
             'content@index': {
                templateUrl: 'app/states/settings-antet/main.html',
                controller: 'settingsAntetController',
                controllerAs: 'vm'               
             }
        }

        })
        

      
  }

    
})();
 
(function() {
  'use strict';

  angular
    .module('app')
    .controller( "settingsAntetController", settingsAntetController);
    
      /** @ngInject */
    
    function settingsAntetController($scope) {
        
        var vm = this;
        vm.item = null;
        $scope.$parent.vm.title = "SETĂRI ANTET";
        


        
    }
    
})();
(function() {
  'use strict';

  angular
    .module('app')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('index.settings-other', {
        url: '/settings-other',
        views: {
             'content@index': {
                templateUrl: 'app/states/settings-other/main.html',
                controller: 'settingsOtherController',
                controllerAs: 'vm'               
             }
        }

        })
        

      
  }

    
})();
 
(function() {
  'use strict';

  angular
    .module('app')
    .controller( "settingsOtherController", settingsOtherController);
    
      /** @ngInject */
    
    function settingsOtherController($scope) {
        
        var vm = this;
        vm.item = null;
        $scope.$parent.vm.title = "ALTE SETĂRI";
        


        
    }
    
})();
(function() {
  'use strict';

  angular
    .module('app')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    $stateProvider
      .state('index.settings-tipdoc', {
        url: '/settings-tipdoc',
        views: {
             'content@index': {
                templateUrl: 'app/states/settings-tipdoc/main.html',
                controller: 'settingsTipdocController',
                controllerAs: 'vm', 
                resolve: {
                    tipdoc: function( qs ) {
                        return qs.get('set_tipdoc').then(function(r) { return r.data; });
                    } 
                }
             }
        }

        })
        

      
  }

    
})();
 
(function() {
  'use strict';

  angular
    .module('app')
    .controller( "settingsTipdocController", settingsTipdocController);
    
      /** @ngInject */
    
    function settingsTipdocController($scope, tipdoc, qs, gmDialog, $q ) {
        
        var vm = this, q, confirm, promise;
        $scope.$parent.vm.title = "SETĂRI TIP DOC.";
        vm.tipdoc = tipdoc.result;

        var  defaults = [
                {   name: "CONTRACT",
                    descriere: "Contract de arendare"},
                {   name: "ACT ADIȚIONAL",
                    descriere: "Act adițional la contr.arendare"},
                {   name: "NOTIFICARE",
                    descriere: "Notificare scrisă"},   
                {   name: "REZILIERE",
                    descriere: "Act de reziliere"}               
             ];
        

/*        if (vm.tipdoc.length == 0 ) {
              vm.tipdoc = angular.copy(defaults); 
        }  */      
        
        vm.restoreDefaults = () => {
            confirm = gmDialog.confirm("","ATENȚIE!", "Veți configura un set implicit de tipuri de documente. Toate tipurile create de Dvs. vor fi șterse! Continuați?", "DA", "NU");
            confirm.then( (r) => {
                if ( r == true ) {
                    // step1: remove old data
                    promise = [];
                    angular.forEach(vm.tipdoc, function(e) {
                        q = qs.remove('set_tipdoc', e.id)
                        promise.push(q)
                    })
                    $q.all(promise).then( () => {
                        vm.tipdoc = angular.copy(defaults) 
                        promise = [];
                        angular.forEach(vm.tipdoc, function(e,i) {
                            q = qs.create('set_tipdoc', e).then( (r) => vm.tipdoc[i].id = r.data.msg )
                            promise.push(q)
                        })
                        $q.all(promise).then( () => {
                            gmDialog.alert("SUCCES", "Tipurile de document implicite au fost setate!", "OK");
                        })
                                    
                    })
                    
                }
            })
            
        }
            
        vm.submit = (item) => {
            item.accessType = "shared";
            if ( angular.isNumber(item.id) ) {
                qs.update('set_tipdoc', angular.fromJson(item))
                gmDialog.alert("SUCCES!", "Documentul a fost actualizat!", "Închide");
            } else {
                // new resource
                q = qs.create('set_tipdoc', angular.fromJson(item))
                q.then( r =>  { 
                    vm.tipdoc[vm.tipdoc.indexOf(item)].id = r.data.msg; 
                    gmDialog.alert("SUCCES!", "Documentul a fost adăugat!", "Închide");
                })
            }
        }
        
        vm.removeItem = (item) => {
            if (angular.isNumber(item.id)) {
                confirm = gmDialog.confirm("", "ATENȚIE!", "Urmează să ștergeți un document existent! Continuați?", "DA", "NU");
                confirm.then( (r) => {
                    if ( r == true ) {
                        q = qs.remove('set_tipdoc', item.id);
                        q.then( () => {
                            console.log("del index", vm.tipdoc.indexOf(item));
                            vm.tipdoc.splice(vm.tipdoc.indexOf(item), 1)
                            gmDialog.alert("SUCCES!", "Documentul a fost șters!", "Închide");
                        })  
                    }
                }, ()=>{})
            }
        }
        

    }
    
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('FilterController', FilterController);

    /** @ngInject */
    function FilterController(tipdoc, $mdDialog, moment, qs, $q) {

        var vm = this, result=[]
        
       
       
        vm.dialogSize = 95;
        
        vm.filtru = {}
        vm.filtru.persoane = []
        vm.filtru.aplica = {}
        
        vm.foundPers = []
        vm.filtru.persoane = []
        
//        AUTCOMPLETE SHIT
        vm.searchTextChange = pers => { 
            qs.lookup('persoane', {
                lookInto: ['name'],
                attributes: ['id', 'name'],
                keyword: pers ? pers.toUpperCase() : null
            }).then( r => {vm.foundPers = r.data;}, err => vm.foundPers = [])
        }
        vm.selectedItemChange = item => {console.log(item); item ? vm.filtru.persoane.push(item): null; vm.searchText=null }
//        END AUTOCOMPLETE SHIT
        
        vm.filtru.dateStart = moment().startOf('year').toDate()
        vm.filtru.dateEnd = moment(moment()).add(10, 'years').toDate()
        
        
        vm.filtru.regDateStart = moment().startOf('year').toDate()
        vm.filtru.regDateEnd = moment().toDate()
        
        vm.filtru.status = {active:true, expirate:false, reziliate:false}
        

        vm.tickAll = () => {
            vm.filter.status.active = true
            vm.filter.status.reziliate = true
            vm.filter.status.expirate = true
        }
        
     
//        apply filters and generate new registru object
        vm.submit = filtru => {
            console.log(filtru)
            let ids = []
            let promisePersoane = $q.defer()
            let promiseRegDate = $q.defer()
            //persoane
            if ( filtru.persoane.length > 0 ) {
                let persoaneIds = []
                filtru.persoane.map( e => { persoaneIds.push({persoana:e.id}) })

                promisePersoane = qs.getData({table:'parti', where:persoaneIds, attributes:['parent']})
                
            } else {
                promisePersoane = $q.resolve([])
            }
            
            //inregistrare in intervalul
            if ( filtru.aplica.regDate ) {
                let regDataStart = moment(filtru.regDateStart).unix()
                let regDataEnd = moment(filtru.regDateEnd).unix()
                promiseRegDate = qs.getData({
                    table:'registru', 
                    where: [
                        {"data": {
                            "between": [regDataStart, regDataEnd] 
                        }} 
                    ],
                    attributes: ['id']
                })
            } else { promiseRegDate = $q.resolve([])}
            
            //anexe ( tarla, parcela, bl.fizic )
            if ( filtru.anexe ) {
                
            }
            
            
            $q.all([promisePersoane, promiseRegDate]).then( r => {
                console.log(r)
                // prepare first array ( persoane / parti )
                let arr1=[], arr2=[]
                if ( r[0].length > 0 ) {
                    r[0].map( e => arr1.push(e.parent))
                }
                //prepare second array ( regDate between)
                if ( r[1].length > 0 ) {
                    r[1].map( e => arr2.push(e.id ))
                }
                
                //daca nu a fost aleasa nici o persoana
                console.log(r[1])
                
                console.log( ids )
            })
        }
        
        
        

        vm.close = () => {
            $mdDialog.hide({action:'reset', reg: result})
        }
    }
    
    function intersect() {
          // - Arguments -> traditional array,
          // - First item ( arrays[0] ) = shortest to reduce iterations
          var arrays = Array.prototype.slice.call(arguments).sort(function(a, b) {
            return a.length - b.length;
          });
          // Use first array[0] as the base.
          var a = arrays.shift();
          var result = [];
          for (var i = a.length; i--;) {
            var val = a[i];
            // Prevent duplicates
            if (result.indexOf(val) < 0) {
              // Seek
              var found = true;
              for (var ii = arrays.length; ii--;) {
                if (arrays[ii].indexOf(val) < 0) {
                  found = false;
                  break;
                }
              }
              if (found) {
                result.push(val);
              }
            }
          }
          return result;
        }
    
    
})();
angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("app/index.html","<div ng-cloak><div ui-view=index.main layout-fill layout=column></div></div>");
$templateCache.put("app/states/_main/listBottomSheet.template.html","<md-bottom-sheet class=md-list><md-list><md-list-item ng-repeat=\"item in libo.items\" role=link md-ink-ripple><md-button ng-click=libo.itemClick($index) layout-fill aria-label=label><md-icon md-svg-icon={{item.icon}} aria-label={{item.name}} style=float:left></md-icon><md-button-text>{{item.name}}</md-button-text></md-button><md-divider></md-divider><!--            </div>--></md-list-item></md-list></md-bottom-sheet>");
$templateCache.put("app/states/_main/main.html","<div ui-view=navleft></div><div ui-view=toolbars flex=none layout=column></div><div layout=column flex ui-view=content></div><div layout=row style=\"background: navy; color:yellow; padding:5px; font-size: 12px; font-weight: 100\"><small>&copy; 2017, MAFTEI GABRIEL-CLAUDIU PFA ARAD</small> <span flex></span> <small>{{vm.app.version}}</small></div>");
$templateCache.put("app/states/addressBook/main-pf.html","<md-bottom-sheet flex style=padding:0><form name=modForm flex layout-fill layout-padding><md-toolbar class=\"md-accent md-hue-1\"><div class=md-toolbar-tools><span flex></span><h5><span ng-show=\"vm.item.id > 0\">MODIFICARE</span> <span ng-show=!vm.item.id>ADAUGARE</span> TITULAR PERSOANĂ FIZICĂ</h5><span flex></span><md-button class=md-icon-button ng-click=vm.remove(vm.item) aria-label=\"back to main\" ng-disabled=modForm.$invalid ng-h><md-icon md-svg-icon=action:ic_delete_forever_24px></md-icon><md-tooltip>șterge</md-tooltip></md-button><md-button class=md-icon-button ng-click=vm.submit(vm.item) aria-label=\"back to main\" ng-disabled=modForm.$invalid><md-icon md-svg-icon=navigation:ic_check_24px></md-icon><md-tooltip>confirmă</md-tooltip></md-button><md-button class=md-icon-button ng-click=vm.close() aria-label=\"back to main\"><md-icon md-svg-icon=navigation:ic_close_24px></md-icon><md-tooltip>inchide</md-tooltip></md-button></div></md-toolbar><md-content flex><md-card md-whiteframe=3 layout-padding flex=end><md-card-content><b>1. DATE GENERALE</b><md-divider></md-divider><br><section layout=row><input placeholder=\"Numele şi prenumele\" flex=50 ng-model=vm.item.name required> <input placeholder=\" cod numeric personal\" flex=15 ng-model=vm.item.cnp> <input flex=5 x ng-model=vm.item.content.ciTip> <input flex=5 style=width:50px placeholder=\" seria\" ng-model=vm.item.content.ciSeria> <input flex=10 placeholder=\" numărul\" ng-model=vm.item.content.ciNr> <input flex=end placeholder=\" autoritatea emitenta\" ng-model=vm.item.content.ciElib></section><section layout=row><input flex=10 placeholder=\" data nasterii\" ng-model=vm.item.content.dataNastere> <input flex=20 placeholder=\" localitatea\" ng-model=vm.item.content.locNastere> <input flex=20 placeholder=\" judetul\" ng-model=vm.item.content.judetNastere> <input flex=20 placeholder=\" ţara\" ng-model=vm.item.content.taraNastere> <input flex=15 placeholder=\" cetăţenia\" ng-model=vm.item.content.cetatenie> <input flex=15 placeholder=\" starea civilă\" ng-model=vm.item.content.stcivila></section></md-card-content></md-card><md-card md-whiteframe=3 layout-padding><md-card-content><b>2. DOMICILIUL</b><md-divider></md-divider><br><section layout=row><input flex=30 placeholder=\" localitatea\" ng-model=vm.item.content.dom.loc> <input flex=30 placeholder=\" strada\" ng-model=vm.item.content.dom.str> <input flex=10 placeholder=\" nr\" ng-model=vm.item.content.dom.nr> <input flex=10 placeholder=\" bl\" ng-model=vm.item.content.dom.bl> <input flex=5 placeholder=\" sc\" ng-model=vm.item.content.dom.sc> <input flex=5 placeholder=\" et\" ng-model=vm.item.content.dom.et> <input flex=10 placeholder=\" ap\" ng-model=vm.item.content.dom.ap></section><section layout=row><input flex=40 placeholder=\" judeţul\" ng-model=vm.item.content.dom.jud> <input flex=20 placeholder=\" codul poştal\" ng-model=vm.item.content.dom.zip> <input flex=40 placeholder=\" ţara\" ng-model=vm.item.content.dom.tara></section><section layout=row><input flex=40 placeholder=\" telefon\" ng-model=vm.item.content.dom.tel> <input flex=20 placeholder=\" fax\" ng-model=vm.item.content.dom.fax> <input flex=40 placeholder=\" e-mail\" ng-model=vm.item.content.dom.email></section></md-card-content></md-card><md-card md-whiteframe=3 layout-padding><md-card-content><b>3. REŞEDINŢA ÎN ROMÂNIA (dacă este cazul)</b><md-divider></md-divider><br><section layout=row><input flex=30 placeholder=\" localitatea\" ng-model=vm.item.content.rsd.loc> <input flex=30 placeholder=\" strada\" ng-model=vm.item.content.rsd.str> <input flex=10 placeholder=\" nr\" ng-model=vm.item.content.rsd.nr> <input flex=10 placeholder=\" bl\" ng-model=vm.item.content.rsd.bl> <input flex=5 placeholder=\" sc\" ng-model=vm.item.content.rsd.sc> <input flex=5 placeholder=\" et\" ng-model=vm.item.content.rsd.et> <input flex=10 placeholder=\" ap\" ng-model=vm.item.content.rsd.ap></section><section layout=row><input flex=40 placeholder=\" judeţul\" ng-model=vm.item.content.rsd.jud> <input flex=20 placeholder=\" codul poştal\" ng-model=vm.item.content.rsd.zip> <input flex=40 placeholder=\" ţara\" ng-model=vm.item.content.rsd.tara></section><br></md-card-content></md-card></md-content></form></md-bottom-sheet>");
$templateCache.put("app/states/addressBook/main-pj.html","<md-bottom-sheet flex style=padding:0><form name=modForm layout=column flex layout-fill><md-toolbar class=\"md-accent md-hue-1\"><div class=md-toolbar-tools><md-button class=md-icon-button ui-sref=\"index.addressBook({action:\'\', id:\'\'})\" aria-label=\"back to main\"><md-icon md-svg-icon=navigation:ic_chevron_left_24px></md-icon><md-tooltip>meniul principal</md-tooltip></md-button><h5>MODIFICARE TITULAR PERSOANĂ FIZICĂ</h5><span flex></span><md-button class=md-icon-button ng-click=vm.remove(vm.item) aria-label=\"back to main\" ng-disabled=modForm.$invalid><md-icon md-svg-icon=action:ic_delete_forever_24px></md-icon><md-tooltip>șterge</md-tooltip></md-button><md-button class=md-icon-button ng-click=vm.submit(vm.item) aria-label=\"back to main\" ng-disabled=modForm.$invalid><md-icon md-svg-icon=navigation:ic_check_24px></md-icon><md-tooltip>confirmpă</md-tooltip></md-button><md-button class=md-icon-button ng-click=vm.close() aria-label=\"back to main\"><md-icon md-svg-icon=navigation:ic_close_24px></md-icon><md-tooltip>inchide</md-tooltip></md-button></div></md-toolbar><section layout=column><md-card md-whiteframe=3 layout-padding><md-card-content><b>1. DATE GENERALE</b><md-divider></md-divider><br><section layout=row><input placeholder=\" Denumirea\" flex=50 ng-model=vm.item.name required> <input placeholder=\" Nr.înreg. Reg.Comerţului\" flex=25 ng-model=vm.item.regCom> <input placeholder=\" C.U.I / C.F.\" flex=25 ng-model=vm.item.cui required></section></md-card-content></md-card><md-card md-whiteframe=3 layout-padding><md-card-content><b>2. LOCALIZARE</b><md-divider></md-divider><br><section layout=row><input flex=30 placeholder=\" localitatea\" ng-model=vm.item.content.sed.loc> <input flex=30 placeholder=\" strada\" ng-model=vm.item.content.sed.str> <input flex=10 placeholder=\" nr\" ng-model=vm.item.content.sed.nr> <input flex=10 placeholder=\" bl\" ng-model=vm.item.content.sed.bl> <input flex=5 placeholder=\" sc\" ng-model=vm.item.content.sed.sc> <input flex=5 placeholder=\" et\" ng-model=vm.item.content.sed.et> <input flex=10 placeholder=\" ap\" ng-model=vm.item.content.sed.ap></section><section layout=row><input flex=40 placeholder=\" judeţul\" ng-model=vm.item.content.sed.jud> <input flex=20 placeholder=\" codul poştal\" ng-model=vm.item.content.sed.zip> <input flex=40 placeholder=\" ţara\" ng-model=vm.item.content.sed.tara></section></md-card-content></md-card><md-card md-whiteframe=3 layout-padding><md-card-content><b>3. DATE DE CONTACT</b><md-divider></md-divider><br><section layout=row><input flex=20 placeholder=\" telefon\" ng-model=vm.item.content.sed.tel> <input flex=20 placeholder=\" fax\" ng-model=vm.item.content.sed.fax> <input flex=30 placeholder=\" e-mail\" ng-model=vm.item.content.sed.email> <input flex=30 placeholder=\" site\" ng-model=vm.item.content.sed.www></section><br></md-card-content></md-card></section></form></md-bottom-sheet>");
$templateCache.put("app/states/addressBook/main.html","<md-toolbar class=\"md-accent md-hue-1\"><div class=md-toolbar-tools><md-button class=md-icon-button ui-sref=index.main aria-label=\"back to main\"><md-icon md-svg-icon=navigation:ic_chevron_left_24px></md-icon><md-tooltip>INAPOI</md-tooltip></md-button><h5>TOATE PERSOANELE</h5><span flex></span><md-button class=md-icon-button ng-click=\"show.search = !show.search; search = {}\" aria-label=\"adauga persoana\"><md-icon md-svg-icon=action:ic_search_24px></md-icon><md-tooltip>FILTRARE</md-tooltip></md-button><!--		add pf or pj--><md-menu><md-button aria-label=\"Optiuni adauga nou\" class=md-icon-button ng-click=$mdMenu.open()><md-icon md-svg-src=content:ic_add_24px></md-icon></md-button><md-menu-content width=3><md-menu-item><md-button ng-click=\"vm.create(\'pf\')\" class=\"md-accent md-hue-2\"><md-icon md-svg-src=content:ic_add_circle_outline_24px></md-icon>PERSOANĂ FIZICĂ</md-button></md-menu-item><md-menu-item><md-button ng-click=\"vm.create(\'pj\')\" class=\"md-accent md-hue-2\"><md-icon md-svg-src=content:ic_add_circle_outline_24px></md-icon>PERSOANĂ JURIDICĂ</md-button></md-menu-item></md-menu-content></md-menu><!--            back to registru--></div></md-toolbar><md-content flex=100 style=\"border:1px solid green\"><div layout=row flex ng-show=show.search class=md-padding><md-input-container flex=100><input ng-model=search.criteria class=md-padding style=font-size:25px placeholder=\"filtrează după orice criteriu...\" flex></md-input-container></div><md-list layout=column flex><md-list-item class=md-3-line ng-repeat=\"p in vm.contacts  | filter: p.name = search.criteria  | filter: p.cui = search.criteria  | filter: p.cnp = search.criteria\" ng-click=vm.update(p) ng-right-click=vm.remove(p)><!--        <md-list-item class=\"md-2-line\"  ng-repeat=\"p in vm.contacts\" ng-click=\"vm.update(p)\">--><div class=md-list-item-text><h3>{{$index+1}} {{p.name}}</h3><h4>{{p.cnp}} {{p.cui}}</h4><md-divider></md-divider></div></md-list-item></md-list></md-content>");
$templateCache.put("app/states/alerts/main.html","alerts");
$templateCache.put("app/states/contacts/add.html","<md-bottom-sheet layout=column><form name=addpersoana flex=100 layout-fill><div class=\"md-accent md-hue-2\" layout=row><h6 ng-init=\"vm.tip = 1\">Adăugare persoană &nbsp;</h6><md-switch ng-model=vm.tip ng-true-value=1 ng-false-value=0 aria-label=\"switch tip persoana\"><span ng-if=vm.tip>FIZICĂ</span> <span ng-if=!vm.tip>JURIDICĂ</span></md-switch><span flex></span><md-button class=md-icon-button aria-label=confirma aria-label=confirma ng-click=vm.submit(vm.item) ng-disabled=addpersoana.$invalid><md-icon md-svg-icon=navigation:ic_check_24px></md-icon></md-button><md-button class=md-icon-button aria-label=close ng-click=vm.close()><md-icon md-svg-icon=navigation:ic_close_24px></md-icon></md-button></div><md-content><div ng-if=\"vm.tip == 1\" ng-include=\"\'app/states/contacts/add.pf.html\'\"></div></md-content><md-content ng-if=\"vm.tip != 1\" ng-include=\"\'app/states/contacts/add.pj.html\'\"></md-content></form></md-bottom-sheet>");
$templateCache.put("app/states/contacts/add.pf.html","<md-content flex><md-card flex><md-card-content><b>1. DATE GENERALE</b><md-divider></md-divider><br><section layout=row><input placeholder=\"Numele şi prenumele\" flex=50 ng-model=vm.item.name required> <input placeholder=\" cod numeric personal\" flex=15 ng-model=vm.item.cnp> <input flex=5 x ng-model=vm.item.content.ciTip> <input flex=5 style=width:50px placeholder=\" seria\" ng-model=vm.item.content.ciSeria> <input flex=10 placeholder=\" numărul\" ng-model=vm.item.content.ciNr> <input flex=end placeholder=\" autoritatea emitenta\" ng-model=vm.item.content.ciElib></section><section layout=row><input flex=10 placeholder=\" data nasterii\" ng-model=vm.item.content.dataNastere> <input flex=20 placeholder=\" localitatea\" ng-model=vm.item.content.locNastere> <input flex=20 placeholder=\" judetul\" ng-model=vm.item.content.judetNastere> <input flex=20 placeholder=\" ţara\" ng-model=vm.item.content.taraNastere> <input flex=15 placeholder=\" cetăţenia\" ng-model=vm.item.content.cetatenie> <input flex=15 placeholder=\" starea civilă\" ng-model=vm.item.content.stcivila></section></md-card-content></md-card><md-card><md-card-content><b>2. DOMICILIUL</b><md-divider></md-divider><br><section layout=row><input flex=30 placeholder=\" localitatea\" ng-model=vm.item.content.dom.loc> <input flex=30 placeholder=\" strada\" ng-model=vm.item.content.dom.str> <input flex=10 placeholder=\" nr\" ng-model=vm.item.content.dom.nr> <input flex=10 placeholder=\" bl\" ng-model=vm.item.content.dom.bl> <input flex=5 placeholder=\" sc\" ng-model=vm.item.content.dom.sc> <input flex=5 placeholder=\" et\" ng-model=vm.item.content.dom.et> <input flex=10 placeholder=\" ap\" ng-model=vm.item.content.dom.ap></section><section layout=row><input flex=40 placeholder=\" judeţul\" ng-model=vm.item.content.dom.jud> <input flex=20 placeholder=\" codul poştal\" ng-model=vm.item.content.dom.zip> <input flex=40 placeholder=\" ţara\" ng-model=vm.item.content.dom.tara></section><section layout=row><input flex=40 placeholder=\" telefon\" ng-model=vm.item.content.dom.tel> <input flex=20 placeholder=\" fax\" ng-model=vm.item.content.dom.fax> <input flex=40 placeholder=\" e-mail\" ng-model=vm.item.content.dom.email></section></md-card-content></md-card><md-card><md-card-content><b>3. REŞEDINŢA ÎN ROMÂNIA (dacă este cazul)</b><md-divider></md-divider><br><section layout=row><input flex=30 placeholder=\" localitatea\" ng-model=vm.item.content.rsd.loc> <input flex=30 placeholder=\" strada\" ng-model=vm.item.content.rsd.str> <input flex=10 placeholder=\" nr\" ng-model=vm.item.content.rsd.nr> <input flex=10 placeholder=\" bl\" ng-model=vm.item.content.rsd.bl> <input flex=5 placeholder=\" sc\" ng-model=vm.item.content.rsd.sc> <input flex=5 placeholder=\" et\" ng-model=vm.item.content.rsd.et> <input flex=10 placeholder=\" ap\" ng-model=vm.item.content.rsd.ap></section><section layout=row><input flex=40 placeholder=\" judeţul\" ng-model=vm.item.content.rsd.jud> <input flex=20 placeholder=\" codul poştal\" ng-model=vm.item.content.rsd.zip> <input flex=40 placeholder=\" ţara\" ng-model=vm.item.content.rsd.tara></section><br></md-card-content></md-card></md-content>");
$templateCache.put("app/states/contacts/add.pj.html","<section layout=column><md-card md-whiteframe=3 layout-padding><md-card-content><b>1. DATE GENERALE</b><md-divider></md-divider><br><section layout=row><input placeholder=\" Denumirea\" flex=50 ng-model=vm.item.name required> <input placeholder=\" Nr.înreg. Reg.Comerţului\" flex=25 ng-model=vm.item.regCom> <input placeholder=\" C.U.I / C.F.\" flex=25 ng-model=vm.item.cui></section></md-card-content></md-card><md-card md-whiteframe=3 layout-padding><md-card-content><b>2. LOCALIZARE</b><md-divider></md-divider><br><section layout=row><input flex=30 placeholder=\" localitatea\" ng-model=vm.item.content.sed.loc> <input flex=30 placeholder=\" strada\" ng-model=vm.item.content.sed.str> <input flex=10 placeholder=\" nr\" ng-model=vm.item.content.sed.nr> <input flex=10 placeholder=\" bl\" ng-model=vm.item.content.sed.bl> <input flex=5 placeholder=\" sc\" ng-model=vm.item.content.sed.sc> <input flex=5 placeholder=\" et\" ng-model=vm.item.content.sed.et> <input flex=10 placeholder=\" ap\" ng-model=vm.item.content.sed.ap></section><section layout=row><input flex=40 placeholder=\" judeţul\" ng-model=vm.item.content.sed.jud> <input flex=20 placeholder=\" codul poştal\" ng-model=vm.item.content.sed.zip> <input flex=40 placeholder=\" ţara\" ng-model=vm.item.content.sed.tara></section></md-card-content></md-card><md-card md-whiteframe=3 layout-padding><md-card-content><b>3. DATE DE CONTACT</b><md-divider></md-divider><br><section layout=row><input flex=20 placeholder=\" telefon\" ng-model=vm.item.content.sed.tel> <input flex=20 placeholder=\" fax\" ng-model=vm.item.content.sed.fax> <input flex=30 placeholder=\" e-mail\" ng-model=vm.item.content.sed.email> <input flex=30 placeholder=\" site\" ng-model=vm.item.content.sed.www></section><br></md-card-content></md-card></section>");
$templateCache.put("app/states/document/editParteModal.html","<md-dialog flex=60><!--    <pre>{{vm.item.persoane.name}}</pre>--><md-dialog-header><md-toolbar class=\"md-accent md-hue-2\"><div class=md-toolbar-tools>CONTRACT - <span ng-show=vm.searchText>&nbsp; EDITARE </span><span ng-hide=vm.searchText>&nbsp; ADĂUGARE </span>&nbsp; PARȚI CONTRACTUALE <span flex></span><md-button class=md-icon-button ng-click=vm.close()><md-icon md-svg-icon=navigation:ic_close_24px></md-icon></md-button></div></md-toolbar></md-dialog-header><md-dialog-content class=md-padding><!-- persoana      --> <span layout=row layout-align=\"center center\" flex><span flex=20>Persoana &nbsp;&nbsp;</span><md-autocomplete flex md-autoselect=true placeholder=\"alegeti persoana....\" md-item-text=item.name md-items=\"item in vm.foundPers\" md-menu-class=autocomplete-custom-template md-min-length=1 md-delay=100 md-search-text=vm.searchText md-search-text-change=vm.searchTextChange(vm.searchText) md-select-on-match=true md-match-case-insensitive=true md-selected-item-change=vm.selectedItemChange(item) md-selected-item=vm.selectedItem><md-item-template><span class=item-title><span md-highlight-flags=^i md-highlight-text=vm.searchText>{{item.name}}</span></span></md-item-template><md-not-found>NU exista persoana, <span style=\"text-decoration: underline; font-weight: 800; color:navy\" ng-click=vm.addPerson()>ADAUGA</span></md-not-found></md-autocomplete></span><br><!--mandatar--> <span layout=row layout-align=\"center center\" flex ng-show=vm.item.mandatar><span flex=20>reprezentată de &nbsp;&nbsp;</span><md-autocomplete flex md-autocomplete-clear=vm.event() md-autoselect=true placeholder=\"alegeti reprezentantul....\" md-item-text=item.name md-items=\"item in vm.foundPersM\" md-menu-class=autocomplete-custom-template md-min-length=1 md-delay=100 md-search-text=vm.searchTextM md-search-text-change=vm.searchTextChangeM(vm.searchTextM) md-select-on-match=true md-match-case-insensitive=true md-selected-item-change=vm.selectedItemChangeM(item) md-selected-item=vm.selectedItemM><md-item-template><span class=item-title><span md-highlight-flags=^i md-highlight-text=vm.searchTextM>{{item.name}}</span></span></md-item-template><md-not-found>NU exista persoana, <span style=\"text-decoration: underline; font-weight: 800; color:navy\" ng-click=vm.addMandatar()>ADAUGA</span></md-not-found></md-autocomplete></span><!--in calitate de--> <span layout=row layout-align=\"center center\" flex ng-show=vm.item.mandatar><span flex=20></span> <span flex=20>in calitate de &nbsp;&nbsp;</span><md-input-container flex><input ng-model=vm.item.mandatar.calitate></md-input-container>&nbsp; </span><!--add blank mandatar if not exists        --> <span layout=row layout-align=\"center center\" flex ng-hide=vm.item.mandatar><md-button class=\"md-button md-raised\" ng-click=vm.addMandatarBlank(vm.item)><md-icon md-svg-icon=content:ic_add_24px></md-icon>ADAUGA REPREZENTANT</md-button></span><!--        <pre>{{vm.item|json}}</pre>--></md-dialog-content><md-dialog-actions><span flex></span><md-button class=\"md-warn md-hue-2 md-raised\" ng-disabled=\"!vm.item.titular.name || (vm.item.mandatar && vm.item.mandatar.name == null)\" ng-click=vm.submit(vm.item)><md-icon md-svg-icon=navigation:ic_check_24px></md-icon>CONFIRMĂ</md-button></md-dialog-actions></md-dialog>");
$templateCache.put("app/states/document/main.conex.html","<md-toolbar class=\"md-primary md-hue-1\"><div class=md-toolbar-tools layout-align=\"end center\"><i hide-xs><small>document aferent contractului {{vm.registru.parentData.nr}} / {{vm.registru.parentData.data*1000|date:\"dd.MM.yyyy\"}}</small></i></div></md-toolbar><md-content><section layout-gt-sm=row layout-xs=column flex=100><md-card flex-gt-sm=75 layout=column><md-toolbar layout=row class=\"md-accent md-hue-1\"><div layout-align=\"center center\" class=md-toolbar-tools><h4>CONȚINUT DOCUMENT</h4></div></md-toolbar><!--            <div text-angular=\"text1\" ng-model=\"vm.registru.detalii.data.content\" ng-change = \"vm.submitDetalii(vm.registru.detalii)\"></div>             --><textarea ui-tinymce ng-model=vm.registru.detalii.data.content ng-change=vm.submitDetalii(vm.registru.detalii)></textarea></md-card><md-card flex-gt-sm=25 layout=column><md-toolbar layout=row class=\"md-accent md-hue-1\"><div layout-align=\"center center\" class=md-toolbar-tools><h4>ISTORIC CONTRACT</h4></div></md-toolbar><md-list><md-list-item ui-sref=\"index.document({id: vm.registru.parentData.id})\"><span flex=20><small>{{vm.registru.parentData.data*1000|date:\'dd.MM.yyyy\'}}</small></span> &nbsp;&nbsp; <span flex=10><small>{{vm.registru.parentData.nr}}</small></span> &nbsp;&nbsp; <span flex><small>incheiat contract de arendare</small></span></md-list-item><md-list-item ui-sref=index.document({id:vm.registru.id})><span flex=20><small>{{vm.registru.data|date:\'dd.MM.yyyy\'}}</small></span> &nbsp;&nbsp; <span flex=10><small>{{vm.registru.nr}}</small></span> &nbsp;&nbsp; <span flex=end><small>incheiat {{vm.registru.set_tipdoc.name}}</small></span></md-list-item></md-list></md-card></section></md-content><!--<pre>{{vm.history | json}}</pre>-->");
$templateCache.put("app/states/document/main.contract.anexe.html","<form name=detalii form-on-change=vm.submitAnexe(vm.registru.anexes) layout=column layout-fill><section flex=10 layout-align=\"center start\" layout=row><span flex></span><md-button class=md-raised ng-click=\"vm.registru.anexes.push({parent: vm.registru.id})\"><md-icon md-svg-icon=content:ic_add_24px></md-icon>ADAUGĂ O ANEXĂ NOUĂ</md-button></section><md-list flex=10 layout=column><md-list-item layout-align=\"start center\" class=bg-header><span flex-gt-sm=5 flex-xs=30>NR.</span> <span flex-gt-sm=10 hide-xs>TARLAUA</span> <span flex-gt-sm=10 hide-xs>PARCELA</span> <span flex-gt-sm=10 flex-xs=45>SUPRAFATA</span> <span flex-gt-sm=10 hide-xs>BLOC FIZIC</span> <span flex-gt-sm=20 hide-xs>ACT PROPR.</span> <span flex-gt-sm=10 hide-xs>CAT.FOLOS.</span> <span flex-gt-sm=20 hide-xs>VECINI (N,E,S,V)</span> <span flex-gt-sm=10 flex-xs=25>ACTIUNI</span></md-list-item></md-list><md-list flex=55><md-content flex=100 style=height:55vh><md-list-item ng-repeat=\"item in vm.registru.anexes\" layout-align=\"start start\" ng-class=\"{\'bordered\': !item.id}\"><!--       gt-sm list item--><!--            <section layout=\"row\" flex-gt-sm=\"100\" layout-align = \"start start\">--> <span flex-gt-sm=5 flex-xs=30><md-input-container flex><label>NR.CRT</label><input ng-value=$index+1 ng-disabled></md-input-container></span>&nbsp; <span flex-gt-sm=10 hide-xs><md-input-container flex><label>TARLA</label><input ng-model=item.tarla></md-input-container></span>&nbsp; <span flex-gt-sm=10 hide-xs><md-input-container flex><label>PARCELĂ</label><input ng-model=item.parcela></md-input-container></span>&nbsp; <span flex-gt-sm=10 flex-xs=40><md-input-container flex><label>SUPRAFAȚĂ</label><input ng-model=item.ha dz ng-change=vm.calculateSumAnexe()></md-input-container></span>&nbsp; <span flex-gt-sm=10 hide-xs><md-input-container flex><label>bloc fizic</label><input ng-model=item.bloc_fizic></md-input-container></span>&nbsp; <span flex-gt-sm=20 hide-xs><md-input-container flex><label>act prop.</label><input ng-model=item.act_prop></md-input-container></span>&nbsp; <span flex-gt-sm=10 hide-xs><md-input-container flex><label>categ.</label><input ng-model=item.categ_folosinta></md-input-container></span>&nbsp; <span flex-gt-sm=20 hide-xs><md-input-container flex><label>vecini</label><input ng-model=item.vecini></md-input-container></span><span flex-gt-sm=10 flex-xs=30 layout=row><!--                        show mood if saved or not--><md-icon class=green md-svg-icon=social:ic_mood_24px ng-show=item.id></md-icon><md-icon class=red md-svg-icon=social:ic_mood_bad_24px ng-show=!item.id></md-icon><md-button class=md-icon-button style=padding:2px!important md-no-ink=\"\" ng-click=vm.removeAnexa(item)><md-icon class=red md-svg-icon=navigation:ic_close_24px></md-icon></md-button></span><!--            </section>--><!--        end of gt-sm list item--></md-list-item></md-content></md-list><md-list flex=10 layout=row><md-list-item flex=100 layout-align=\"end center\" class=bg-footer><span flex-gt-sm=5 flex-xs=30></span> <span flex-gt-sm=10 hide-xs></span> <span flex-gt-sm=10 hide-xs></span> <span flex-gt-sm=10 flex-xs=45>{{vm.sumAnexe}}</span> <span flex-gt-sm=60 hide-xs><small>în contract aveți {{vm.detalii.data.ha}} (diferență = {{vm.difHa}}) </small></span><span flex-gt-sm=10 flex-xs=25></span></md-list-item></md-list></form>");
$templateCache.put("app/states/document/main.contract.ards.html","<md-toolbar class=\"md-accent md-hue-0\" style=\"opacity: 0.5; margin:0; padding:0;min-height:40px\"><div class=md-toolbar-tools style=height:40px><h5>ARENDAȘI</h5><span flex></span><!--                ADD PARTE--><md-button class=md-icon-button style=\"margin-top: 0\" ng-click=\"vm.edit(\'arendas\')\"><md-icon md-svg-icon=content:ic_add_24px></md-icon></md-button><!--                END ADD PARTE--></div></md-toolbar><div class=md-padding layout=column><span ng-repeat=\"item in vm.registru.partis | filter:{calitate:\'arendas\'}\" layout=column><span layout=row flex layout-align=\"center center\">{{$index+1}} &nbsp;&nbsp; <strong>{{item.persoane.name}}</strong> &nbsp; &nbsp; <span ng-show=\"item.mandataris.length > 0 \">prin &nbsp; <strong>{{item.mandataris[0].persoane.name}}</strong> &nbsp;({{item.mandataris[0].calitate }}) </span><span flex></span><md-button class=\"md-icon-button md-warn\" ng-click=vm.removeParte(item)><md-icon md-svg-icon=navigation:ic_close_24px></md-icon></md-button><md-button class=\"md-icon-button md-accent\" ng-click=vm.edit(item)><md-icon md-svg-icon=editor:ic_mode_edit_24px></md-icon></md-button></span></span></div>");
$templateCache.put("app/states/document/main.contract.ardt.html","<md-toolbar class=\"md-accent md-hue-0\" style=\"opacity: 0.5; margin:0; padding:0;min-height:40px\"><div class=md-toolbar-tools style=height:40px><h5>ARENDATORI</h5><span flex></span><!--                ADD PARTE--><md-button class=md-icon-button style=\"margin-top: 0\" ng-click=\"vm.edit(\'arendator\')\"><md-icon md-svg-icon=content:ic_add_24px></md-icon></md-button><!--                END ADD PARTE--></div></md-toolbar><div class=md-padding layout=column><span ng-repeat=\"item in vm.registru.partis | filter:{calitate:\'arendator\'}\" layout=column><span layout=row flex layout-align=\"center center\">{{$index+1}} &nbsp;&nbsp; <strong>{{item.persoane.name}}</strong> &nbsp; &nbsp; <span ng-show=\"item.mandataris.length > 0 \">prin &nbsp; <strong>{{item.mandataris[0].persoane.name}}</strong> &nbsp;({{item.mandataris[0].calitate }}) </span><span flex></span><md-button class=\"md-icon-button md-warn\" ng-click=vm.removeParte(item)><md-icon md-svg-icon=navigation:ic_close_24px></md-icon></md-button><md-button class=\"md-icon-button md-accent\" ng-click=vm.edit(item)><md-icon md-svg-icon=editor:ic_mode_edit_24px></md-icon></md-button></span></span></div>");
$templateCache.put("app/states/document/main.contract.detalii.html","<!--                    <md-toolbar class=\"md-accent md-hue-0\" style=\"opacity: 0.5; margin:0; padding:0;min-height:40px\">\r\n                        <div class=\"md-toolbar-tools\" style=\"height:40px\">\r\n                            <h5>CLAUZE</h5>\r\n                        </div>\r\n                    </md-toolbar>--><form name=detalii form-on-change=vm.submitDetalii(vm.registru.detalii) layout-fill><div layout=column flex><!--                       de la pana la --><md-card flex class=\"md-padding md-whiteframe-z1\"><div layout-align=\"center center\" layout=row><span flex></span><md-input-container><label>De la</label><md-datepicker ng-model=vm.registru.detalii.data.dataStart md-hide-icons=calendar ng-change=\"vm.calculDurata(\'start\'); vm.submitDetalii(vm.registru.detalii)\"></md-datepicker></md-input-container><!-- sageata --><md-icon md-svg-icon=action:ic_trending_flat_24px></md-icon>&nbsp;<md-input-container><label>până la</label><md-datepicker ng-model=vm.registru.detalii.data.dataEnd md-hide-icons=calendar ng-change=\"vm.calculDurata(\'end\'); vm.submitDetalii(vm.registru.detalii)\"></md-datepicker></md-input-container><span flex=5></span><md-input-container flex=20 hide-xs><label>Durata (ani)</label><input ng-model=vm.durata ng-change=\"vm.calculDurata(\'interval\')\"></md-input-container><span flex></span></div></md-card><md-card layout-gt-sm=row layout-xs=column flex class=\"md-padding md-whiteframe-z1\"><md-input-container flex-gt-sm=10 flex-xs><label>Anexe:</label><input ng-model=vm.registru.anexes.length ng-disabled=true></md-input-container><span flex=5></span><md-input-container flex><label>categorie teren</label><input ng-model=vm.registru.detalii.data.catTeren></md-input-container><md-input-container flex><label>suprafața din contract</label><input ng-model=vm.registru.detalii.data.ha></md-input-container><md-input-container flex><label>suprafața din anexe</label><input ng-model=vm.sumAnexe dz ng-change=vm.calculateDiffHa()></md-input-container><md-input-container flex><label>dif. contract-anexe</label><input ng-model=vm.difHa dz><div md-message ng-show=\"vm.difHa != 0\" class=red><small>supr.contract # supr.anexe!</small></div></md-input-container></md-card><md-card layout=row flex class=\"md-padding md-whiteframe-z1\"><md-input-container flex><label>pretul contractului</label><input ng-model=vm.registru.detalii.data.pret></md-input-container></md-card><md-card layout=column flex class=\"md-padding md-whiteframe-z1\"><!--                            <md-input-container flex>--><label>Explicații</label><textarea ui-tinymce ng-model=vm.registru.detalii.data.explicatii ng-change=vm.submitDetalii(vm.registru.detalii)></textarea><!--                            </md-input-container>--></md-card></div></form>");
$templateCache.put("app/states/document/main.contract.header.html","<md-toolbar class=\"md-accent md-hue-0\" style=\"opacity: 0.5; margin:0; padding:0;min-height:40px\"><div class=md-toolbar-tools style=height:40px><h5>CONTRACT</h5></div></md-toolbar><div class=md-padding layout=column flex><section layout=row flex=100 layout-align=\"start start\"><md-input-container flex-gt-sm=30><label>Numărul</label><input ng-model=vm.registru.nr required></md-input-container><!--                    <span show-gt-sm flex=\"5\"></span>--> <span show-xs flex=10></span><md-input-container flex-gt-sm=33><label>Data</label><md-datepicker ng-model=vm.registru.data md-hide-icons=calendar></md-datepicker></md-input-container><span show-gt-sm flex=end></span></section></div>");
$templateCache.put("app/states/document/main.contract.html","<div layout-gt-sm=row flex><section layout-gt-sm=column layout-xs=column flex=100 flex-gt-sm=70><md-tabs md-border-bottom md-stretch-tabs=none flex md-dynamic-height><md-tab label=PĂRȚI><md-content layout-xs=column layout-gt-sm=column flex=100><!--        heading--><!--                    <md-card flex ng-include = \"\'app/states/document/main.contract.header.html\'\"></md-card>--><!--        end heading--><!--       ARENDATORI--><md-card flex ng-include=\"\'app/states/document/main.contract.ardt.html\'\"></md-card><!--        ARENDASI--><md-card flex ng-include=\"\'app/states/document/main.contract.ards.html\'\"></md-card></md-content></md-tab><md-tab label=CLAUZE><div layout=column flex ng-include=\"\'app/states/document/main.contract.detalii.html\'\"></div></md-tab><md-tab label=ANEXE><md-content layout=row flex=100><md-content layout=column flex=100 ng-include=\"\'app/states/document/main.contract.anexe.html\'\" style=\"overflow: hidden\"></md-content></md-content></md-tab><!--            <md-tab label=\"ISTORIC\">\r\n               <md-card layout=\"column\" flex class = \"md-padding\" ng-include = \"\'app/states/document/main.contract.istoric.html\'\"></md-card>\r\n            </md-tab>  --></md-tabs></section><div flex><div layout=column flex=100 ng-include=\"\'app/states/document/main.contract.istoric.html\'\"></div></div></div>");
$templateCache.put("app/states/document/main.contract.istoric.html","<div show-gt-sm hide-xs style=margin-top:20px>&nbsp;</div><md-card layout=column flex=100><md-toolbar class=\"md-accent md-hue-0\" style=\"opacity: 0.5; margin:0; padding:0;min-height:40px\"><div class=md-toolbar-tools style=height:40px layout-align=\"center center\"><h5>ISTORIC</h5></div></md-toolbar><md-list><span ng-show=\"vm.registru.parent == 0\"><md-list-item><div layout=row flex ui-sref=\"index.document({id: vm.registru.id })\"><span flex=20><small>{{vm.registru.data|date:\'dd.MM.yyyy\'}}</small></span> <span flex=10><small>{{vm.registru.nr}}</small></span> <span flex=end><small>incheiat {{vm.registru.set_tipdoc.name}}</small></span></div></md-list-item><md-list-item ng-repeat=\"act in vm.registru.childrenData.rows\" ui-sref=index.document({id:act.id})><span flex=20><small>{{act.date|date:\'dd.MM.yyyy\'}}</small></span> <span flex=10><small>{{act.nr}}</small></span> <span flex=end><small>incheiat {{act.set_tipdoc.name}}</small></span></md-list-item></span></md-list><!--</md-card>--></md-card>");
$templateCache.put("app/states/document/main.html","<md-progress-circular class=\"page-loading md-accent md-hue-2\" md-mode=indeterminate md-diameter=70 ng-if=vm.processing></md-progress-circular><md-toolbar class=\"md-accent md-hue-1\"><div class=md-toolbar-tools><md-button class=md-icon-button><md-icon md-svg-icon=navigation:ic_chevron_left_24px aria-label=Inapoi ui-sref=index.registru></md-icon></md-button><section layout=row flex=100 layout-align=\"center center\"><small>{{vm.tipDocName}} </small><!--                    &nbsp; nr. {{vm.registru.nr}} / {{vm.registru.data|date:\"dd.MM.yyyy\"}}--> <span flex=5></span> <span hide-xs><small>nr. </small>&nbsp;</span><md-input-container flex-gt-sm=10><label></label><small><input ng-model=vm.registru.nr required style=\"text-align: center\"></small></md-input-container><!--                    <span show-gt-sm flex=\"5\"></span>--><!--                    <span show-xs flex=\"10\"></span>--> <span hide-xs><small>din data de </small>&nbsp;</span><md-input-container flex-gt-sm=33><label></label><md-datepicker ng-model=vm.registru.data md-hide-icons=calendar></md-datepicker></md-input-container><span show-gt-sm flex=end></span></section><span flex></span><!--        UPDATE CONTRACT  BUTTON--><md-button class=md-icon-button ng-show=\"vm.registru.parent == 0\" aria-label=confirma ng-click=vm.updateContract()><md-icon md-svg-icon=navigation:ic_check_24px></md-icon></md-button><!--        UPDATE CONEX BUTTON--><md-button class=md-icon-button ng-show=\"vm.registru.parent != 0\" aria-label=confirma ng-click=vm.updateConex()><md-icon md-svg-icon=navigation:ic_check_24px></md-icon></md-button></div></md-toolbar><md-content flex layout=row><div flex layout=column><div ng-include=\"\'app/states/document/main.contract.html\'\" ng-if=\"vm.registru.parent == 0\"></div><div ng-include=\"\'app/states/document/main.conex.html\'\" ng-if=\"vm.registru.parent > 0\" flex></div><!--    <pre style = \"white-space: pre-wrap;\">{{vm.registru|json}}</pre>--></div></md-content>");
$templateCache.put("app/states/exception/template.html","<md-content><md-card md-whiteframe=3><md-card-header><md-card-header-text><div class=md-title>Eroare {{vm.error.code}} - {{vm.error.short}}</div><div class=md-subtitle>{{vm.error.long}}</div></md-card-header-text><md-card-subheader-text class=md-subtitle></md-card-subheader-text></md-card-header><md-card-actions><md-button md-whiteframe=3 style=float:right ui-sref=index.main><md-icon md-svg-icon=action:ic_home_24px></md-icon><md-button-text ng-href=/ ></md-button-text></md-button></md-card-actions></md-card></md-content>");
$templateCache.put("app/states/login/login.main.html","<div layout=column flex=100 style=\"background: none\"><md-toolbar class=\"md-accent md-hue-2\" style=background:navy><div class=md-toolbar-tools layout-align=\"center center\"><h1 show-gt-sm hide-xs style=\"font-weight: 800; font-size: 2em\">EVIDENȚĂ CONTRACTE</h1><h1 hide-gt-sm show-xs style=\"font-weight: 800; font-size: 1em\">EVIDENȚĂ CONTRACTE</h1></div></md-toolbar><div layout=column flex=90 style=\"background: url(\'assets/images/bkg.png\'); background-repeat: repeat\"><div layout=row flex=100 layout-align=\"center center\"><span ng-include=\"\'app/states/login/login.form.tpl\'\" flex-gt-sm=33></span></div></div><div layout=row style=\"background:navy; color:white; font-size:12px; font-weight: 100; padding:5px\"><span flex=5></span> <small>&copy; 2017, Maftei Gabriel-Claudiu P.F.A. Arad </small><span flex></span> <small>{{vm.app.version}}</small> <span flex=5></span></div></div>");
$templateCache.put("app/states/registru/addDocument.form.html","<form name=adddoc flex><md-bottom-sheet><md-card><md-toolbar class=\"md-accent md-hue-3\"><div class=md-toolbar-tools><h3>ADĂUGARE DOCUMENT NOU</h3><span flex></span><md-button class=md-icon-button ng-click=vm.close() aria-label=inchide><md-icon md-svg-icon=navigation:ic_close_24px></md-icon></md-button></div></md-toolbar><md-card-content class=md-padding><section layout-gt-sm=row layout-xs=column flex=100><md-input-container flex-gt-sm=33 flex-xs=100><label>Tip document</label><md-select ng-model=vm.item.docType ng-change=vm.docTypeChanged(vm.item.docType)><md-option ng-repeat=\"o in vm.tipdoc\" ng-value=o.id>{{o.name}}</md-option></md-select></md-input-container>{{doctype}} <span show-gt-sm flex=5></span> <span flex-xs=column flex-gt-sm=row layout-align=\"center center\"><md-input-container flex-gt-sm=50 flex-xs=50><label>Numărul</label><input ng-model=vm.item.nr required></md-input-container><span show-gt-sm flex=5></span><md-input-container flex-gt-sm=50 flex-xs=50><label>Data</label><md-datepicker ng-model=vm.item.data md-hide-icons=calendar></md-datepicker></md-input-container><span flex></span> </span><!--                    pentru contractul--><md-input-container ng-if=vm.showParentSelector flex-xs=100 flex-gt-sm=33><label>pentru contractul</label><md-select ng-model=vm.item.parent flex aria-label=\"alege parinte\"><md-option ng-repeat=\"c in vm.contracte\" ng-value=c.id>{{c.nr}} / {{c.data*1000|date:\"dd.MM.yyyy\"}}</md-option></md-select></md-input-container></section><section layout-gt-sm=row layout-xs=column flex-gt-sm=100 layout-align=\"center center\"><md-button class=\"md-warn md-hue-2 md-raised\" ng-disabled=adddoc.$invalid aria-label=adauga ng-click=vm.submit(vm.item)><md-icon md-svg-icon=content:ic_add_24px></md-icon>ADAUGĂ</md-button></section></md-card-content></md-card></md-bottom-sheet></form>");
$templateCache.put("app/states/registru/istoric.tpl.html","<md-dialog flex=90 md-no-ink><md-dialog-header><md-toolbar class=\"md-accent md-hue-2\"><div class=md-toolbar-tools>Detalii {{vm.item.docTypeLabel}} nr. {{vm.item.nr}} / {{vm.item.data*1000|date:\"dd.MM.yyyy\"}} <span flex></span><md-button class=md-icon-button ng-click=vm.close()><md-icon md-svg-icon=navigation:ic_close_24px></md-icon></md-button></div></md-toolbar></md-dialog-header><md-dialog-content><md-content flex><!--           <pjson data= \"{vm.item}\"></pjson>--><div layout-align=\"center center\" layout=row flex><i><strong>Document aferent contract nr. {{vm.item.nr}} / {{vm.item.data*1000 | date:\"dd.MM.yyyy\"}}</strong></i></div><section layout-gt-sm=row layout-xs=column><md-card flex><strong>Arendator(i)</strong><md-divider></md-divider><span ng-repeat=\"ardt in vm.item.parti | filter: calitate = \'arendator\' \">{{ardt.data.name}}</span></md-card><md-card flex><strong>Arendas(i)</strong><md-divider></md-divider><span class=md-padding><span ng-repeat=\"ardt in vm.item.parti | filter: calitate = \'arendas\' \">{{ardt.data.name}}</span></span></md-card></section><md-card flex layout=column ng-show=\"vm.item.docType > 1\"><strong>DETALII</strong><md-divider></md-divider>{{vm.item.detalii.data.text}}</md-card></md-content></md-dialog-content><!--    <md-dialog-actions>\r\n        <span flex></span>\r\n        <md-button class = \"md-raised\" ng-click=\"vm.close()\">INCHIDE</md-button>\r\n    </md-dialog-actions>--></md-dialog>");
$templateCache.put("app/states/registru/main.html","<md-toolbar class=\"md-toolbar-tools md-hue-1\" layout=row><span layout=row><md-icon md-svg-icon=navigation:ic_arrow_downward_24px ng-click=\"list.ordering = -1\"></md-icon>&nbsp;&nbsp;<md-icon md-svg-icon=navigation:ic_arrow_upward_24px ng-click=\"list.ordering = 0\"></md-icon><md-tooltip style=font-size:1.3em>ORDONARE</md-tooltip></span>&nbsp;&nbsp; <span flex ng-hide=vm.searchActive><strong>REGISTRU GENERAL</strong></span><md-input-container flex ng-if=vm.searchActive><input ng-model=vm.searchCriteria placeholder=caută... style=width:100% ng-show=vm.searchActive></md-input-container><!--                filter button--><md-button class=md-icon-button aria-label=search ng-click=vm.filter(true); aria-label=search ng-hide=vm.filterActive><md-icon md-svg-icon=action:ic_search_24px></md-icon><md-tooltip style=font-size:1.3em>FILTRARE AVANSATĂ</md-tooltip></md-button><!--    clear filter    --><md-button class=md-icon-button aria-label=search ng-click=vm.filter(false) aria-label=search ng-hide=!vm.filterActive><md-icon md-svg-icon=content:ic_remove_circle_outline_24px></md-icon><md-tooltip style=font-size:1.3em>ELIMINĂ FILTRELE</md-tooltip></md-button><!--                add new button    --><md-button class=md-icon-button aria-label=add ng-click=vm.add() aria-label=add><md-icon md-svg-icon=content:ic_add_24px></md-icon></md-button></md-toolbar><!--pagination--><!--<md-toolbar class = \"md-accent md-hue-1\">--><!--     <div class = \"md-toolbar-tools\">--><div layout=row flex=10 layout-align=\"center center\"><span flex=5></span> <small>Pagina &nbsp;</small><!--         button FIRST--><md-button class=\"md-fab md-mini md-raised\" hide-xs ng-click=\"vm.pageTick(\'start\')\"><md-icon md-svg-icon=av:ic_skip_previous_24px></md-icon></md-button><!--         end button FIRST--><!--         button back--><md-button class=\"md-fab md-mini md-raised\" hide-xs ng-click=\"vm.pageTick(\'prev\')\"><md-icon md-svg-icon=av:ic_fast_rewind_24px></md-icon></md-button><!--         end button back--> <span style=\"margin-top: 7px\"><small><!--         page selector--><md-select ng-model=selectedpage ng-change=vm.setSelectedPage(selectedpage) style=\"text-align: center\" aria-label=\"selected page\"><md-option ng-repeat=\"page in vm.pages\" ng-value=page ng-selected=\"page == vm.selectedPage \">{{page.pageNumber}}</md-option></md-select><!--         end page selector--> </small></span><!--         button forward--><md-button class=\"md-fab md-mini md-raised\" hide-xs ng-click=\"vm.pageTick(\'next\')\"><md-icon md-svg-icon=av:ic_fast_forward_24px></md-icon></md-button><!--         end button forward--><!--         button LAST--><md-button class=\"md-fab md-mini md-raised\" hide-xs ng-click=\"vm.pageTick(\'end\')\"><md-icon md-svg-icon=av:ic_skip_next_24px></md-icon></md-button><!--         end button LAST--> <small hide-xs>din {{vm.pages.length}} pagini ( total: {{vm.reg.count}} rezultate) </small><!--     <a ng-repeat = \"page in vm.pages\" ng-click = \"vm.setSelectedPage(page)\" flex>\r\n         <small ng-class = \"{\'bg-red\': page.default ==true}\">\r\n         &nbsp;{{page.pageNumber}}&nbsp;\r\n         </small>\r\n    </a>--> <span flex></span> <small>se afișează&nbsp;&nbsp; </small><small style=margin-top:7px ng-init=\"itemsPerPage = 50\"><md-select ng-model=itemsPerPage ng-change=vm.changePagination(itemsPerPage) aria-label=\"items per page\"><md-option ng-repeat=\"item in [10,20,50,100,\'toate\']\" ng-value=item>{{item}}</md-option></md-select></small><small>&nbsp; de elemente pe pagină </small><span flex=5></span></div><!--    </div>--><!--</md-toolbar>--><!--end pagination--><md-content flex><md-list><md-divider></md-divider><md-list-item ng-repeat=\"item in vm.reg.rows |orderBy:data:list.ordering |filter:vm.searchCriteria track by $index\" ng-if=\"!(item.filtered == true)\" layout-align=\"center start\" ui-sref=index.document({id:item.id}) ng-right-click=vm.remove(item)><span style=\"margin-top: -7px; margin-right:10px\" hide-xs><h1 style=padding:0px><span ng-show=\"$index < 9\">&nbsp;</span> {{$index+1}}</h1></span><!--    parent--><div layout=column flex ng-show=\"item.parent == 0\"><div layout=row flex><md-card class=md-whiteframe-z2 flex><div layout=row class=\"bg-grey md-padding\" flex><strong>{{item.set_tipdoc.name}} {{item.nr}} / {{item.data*1000|date:\"dd.MM.yyyy\"}}</strong> <span flex></span> <small hide-xs><strong>perioada: </strong>{{item.detalii.data.dataStart*1000|date:\"dd.MM.yyyy\"}} - {{item.detalii.data.dataEnd*1000|date:\"dd.MM.yyyy\"}} </small>&nbsp;&nbsp; <small hide-xs><strong>suprafața:</strong> {{item.detalii.data.ha }} ha <strong>pret: </strong>{{item.detalii.data.pret || \"nedefint\"}} </small>&nbsp;&nbsp;&nbsp;&nbsp;</div><div layout=row hide-xs class=md-padding><div layout=row flex=30 layout-align=\"start start\"><div><strong>Arendatori: &nbsp; </strong></div><span ng-repeat=\"part in item.partis | filter: {calitate:\'arendator\'}\"><small>{{part.persoane.name}}</small></span></div><div layout=row flex=30 layout-align=\"start start\"><div><strong>Arendași: &nbsp;</strong></div><span ng-repeat=\"part in item.partis | filter: {calitate:\'arendas\'}\"><small>{{part.persoane.name}}</small></span></div><span flex></span> IN VIGOARE</div></md-card></div></div><!--    children   --><div layout=row flex ng-show=\"item.parent > 0\"><md-card class=md-whiteframe-z2 flex><div layout=row class=\"bg-grey md-padding\"><strong>{{item.set_tipdoc.name}} {{item.nr}} / {{item.data*1000|date:\"dd.MM.yyyy\"}}</strong></div><div layout=row class=md-padding hide-xs><small>document aferent contractului {{item.parentData.nr}} / {{item.parentData.data*1000|date:\"dd.MM.yyyy\"}}</small></div></md-card></div></md-list-item></md-list><!--    <pjson data = \"{{vm.reg}}\"></pjson>--></md-content>");
$templateCache.put("app/states/settings/main.html","<md-content flex><div layout=row flex><div layout=column flex=100 layout-align=\"center cente\"><div layout=column flex=100><div layout=row layout-align=\"center center\" flex ng-repeat=\"item in vm.settingsMenu\"><span flex-gt-sm=10></span><md-card class=\"md-whiteframe-z2 md-padding\" layout-align=\"center center\" ui-sref={{item.state}} flex><h1>{{item.name}}</h1></md-card><span flex-gt-sm=10></span></div></div></div></div></md-content>");
$templateCache.put("app/states/settings-antet/main.html","settings antet");
$templateCache.put("app/states/settings-other/main.html","settings other");
$templateCache.put("app/states/settings-tipdoc/main.html","<md-toolbar class=\"md-accent md-hue-1\"><div class=md-toolbar-tools>Configurare tipuri de documente <span flex></span><md-button ng-click=vm.restoreDefaults()>IMPLICIT</md-button><md-button class=md-icon-button><md-icon md-svg-icon=navigation:ic_check_24px style=\"color: #0F0\" ng-click=vm.updateAll() aria-label=\"update all\"></md-icon>></md-button></div></md-toolbar><!--Note: for scrollShrink to work, the toolbar must be a sibling of a md-content element, placed before it.--><div layout=column flex><div layout=row style=\"background: #ABCDEF\"><span flex=5></span><h5 flex-gt-sm=10 flex-xs=15>Nr.crt</h5><h5 flex-gt-sm=30 flex-xs=30>DENUMIRE</h5><h5 flex-gt-sm=30 hide-xs>DESCRIERE</h5><h5 flex-gt-sm=0 show-xs flex-xs=40>PARINTE</h5><span flex></span><md-button class=md-raised ng-click=vm.tipdoc.push({})>ADAUGĂ</md-button></div><br><md-content flex><div layout=row flex=100 ng-repeat=\"item  in vm.tipdoc\"><form name=form1 layout-fill><div layout=row flex=100><span flex=5></span><h4 flex-gt-sm=10 flex-xs=20>{{$index+1}}</h4><md-input-container flex-gt-sm=30><label>Denumire</label><input name=den type=text ng-model=item.name required></md-input-container><md-input-container flex-gt-sm=30 flex hide-xs><label>Descriere</label><input name=desc type=text ng-model=item.descriere></md-input-container><!-- show confirm on row elements touched --> <span ng-hide=\"form1.$invalid || form1.den.$pristine || !form1.$dirty\" ng-show=\"form1.$dirty \"><md-button class=md-icon-button ng-click=vm.submit(item)><md-icon md-svg-icon=navigation:ic_check_24px style=\"color: green\" aria-label=checked></md-icon>></md-button></span><!-- end show confirm on row elements touched --> <span flex></span><md-button class=md-icon-button style=margin-top:4px aria-label=sterge ng-click=vm.removeItem(item)><md-icon md-svg-icon=navigation:ic_close_24px style=\"color: red\"></md-icon></md-button></div></form></div></md-content></div>");
$templateCache.put("app/states/_main/partials/content.html","<md-content><md-list><span ng-repeat=\"item in vm.mainMenu\"><md-list-item class=md-2-line style=\"background-color:{{item.bkgColor}}; color: {{item.textColor}}\" ng-click=vm.toggleChildren($index) ui-sref={{item.state}}><md-icon md-svg-icon={{item.icon}}></md-icon><div class=md-list-item-text><h3>{{item.name}}</h3><p><small>{{item.details}}</small></p><md-divider></md-divider></div></md-list-item><md-list-item ng-if=item.children[0].visibility><div layout-xs=column layout-gt-sm=row flex=100><span ng-repeat=\"c in item.children\" ui-sref={{c.state}}><md-button style=\"width:95%; text-align: left\" class=\"md-raised md-accent md-hue-2\"><md-icon md-svg-icon={{c.icon}}></md-icon>&nbsp; {{c.name}}</md-button></span></div><md-divider></md-divider></md-list-item></span></md-list></md-content>");
$templateCache.put("app/states/_main/partials/navleft.html","<!--left navigation panel--><!--    <md-sidenav layout=\"column\"class=\"md-sidenav-left md-whiteframe-z5\" md-component-id=\"left\" md-is-locked-open=\"$mdMedia(\'gt-md\')\" style = \"height: 100vh\">--><md-sidenav layout=column class=\"md-sidenav-left md-whiteframe-z5\" md-component-id=left style=\"height: 100vh\"><!--        user info panel--><md-toolbar class=\"animate-show md-whiteframe-z3 md-accent md-hue-3\" style=margin-top:2px><!-- title --><div class=md-toolbar-tools>{{vm.appName}}</div></md-toolbar><!--        main menu--><md-list><span ng-repeat=\"item in vm.leftMenu\"><md-list-item class=md-2-line style=\"background-color:{{item.bkgColor}}; color: {{item.textColor}}\" ng-click=\"vm.toggleChildren($index); vm.toggleSidenav(\'left\')\" ui-sref={{item.state}}><md-icon md-svg-icon={{item.icon}}></md-icon><div class=md-list-item-text><h3>{{item.name}}</h3><p><small>{{item.details}}</small></p><md-divider></md-divider></div></md-list-item></span></md-list></md-sidenav><!--end left navigation panel-->");
$templateCache.put("app/states/_main/partials/toolbars.html","<md-toolbar class=\"md-accent md-hue-3\"><!-- title --><div class=md-toolbar-tools><!--        <md-button class=\"md-icon-button\" ng-click=\"vm.toggleSidenav(\'left\')\" \r\n        aria-label=\"Menu\">\r\n            <md-icon md-svg-icon=\"navigation:ic_menu_24px\" aria-label=\"Menu\"></md-icon>\r\n        </md-button>--><md-button class=md-icon-button ng-if=\"vm.currentState && vm.currentState != \'index.main\'\"><md-icon md-svg-icon=action:ic_home_24px aria-label=Inapoi ui-sref=index.main></md-icon></md-button><span style=\"font-weight: 600; font-size:1em\">{{vm.title}} </span><span flex></span><md-icon md-svg-icon=social:ic_person_24px></md-icon>&nbsp; <small style=\"font-size: 0.7em\"><span show-gt-sm hide-xs>{{vm.local.user.surname}} {{vm.local.user.name}} (</span> {{vm.local.user.username}} <span show-gt-sm hide-xs>)</span></small><div layout=row hide-xs layout-align=\"center center\"><md-button class=\"md-raised md-primary md-hue-2 md-padding\" ui-sref=\"index.addressBook({id:\'s\'})\"><md-icon md-svg-icon=communication:ic_contact_phone_24px role=img aria-hidden=true hide-xs><md-tooltip md-direction=bottom style=\"font-size:1.2em; padding:10px; background: navy\">PERSOANE</md-tooltip></md-icon>&nbsp; CONTACTE</md-button><md-button class=\"md-raised md-warn md-hue-2\" ui-sref=index.registru><md-icon md-svg-icon=maps:ic_local_library_24px role=img aria-hidden=true hide-xs><md-tooltip md-direction=bottom style=\"font-size:1.2em; padding:10px; background: navy\">REGISTRU</md-tooltip></md-icon>&nbsp; REGISTRU</md-button><md-button class=\"md-raised md-accent md-hue-2\" ui-sref=logout><md-icon md-svg-icon=action:ic_power_settings_new_24px role=img aria-hidden=true hide-xs><md-tooltip md-direction=bottom style=\"font-size:1.2em; padding:10px; background: navy\">IEȘIRE</md-tooltip></md-icon>&nbsp; LOGOUT</md-button></div><md-button class=md-icon-button aria-label=\"Open Settings\" show-xs hide-gt-sm ng-click=vm.showListBottomSheet($event)><md-tooltip md-toolbar-bottom style=\"padding:0 10px 25px 10px\"><h1>ALTE SETĂRI</h1></md-tooltip><md-icon md-svg-icon=navigation:ic_more_vert_24px aria-label=More></md-icon></md-button></div></md-toolbar>");
$templateCache.put("app/states/registru/filter/filterModal.html","<md-dialog flex-xs=100 flex-gt-sm=80><md-dialog-header><md-toolbar class=\"md-accent md-hue-2\"><div class=md-toolbar-tools>REGISTRU - FILTRARE AVANSATĂ <span flex></span><md-button class=md-icon-button ng-click=vm.close()><md-icon md-svg-icon=navigation:ic_close_24px></md-icon></md-button></div></md-toolbar></md-dialog-header><md-dialog-content><section layout=row flex=100 layout-align=\"center start\"><md-card md-whiteframe=z3 flex class=md-padding ng-class=\"{\'bg-grey\':vm.filtru.persoane.length == 0}\"><span layout=row flex=100 layout-align=\"start start\"><h4 style=margin-top:28px>Filtru persoane: &nbsp; &nbsp; &nbsp;</h4><!--                    <md-input-container flex>\r\n\r\n                        <md-select ng-model=\"current.contact\" flex md-no-float placeholder = \"alege...\"\r\n                           ng-change=\"\r\n                           vm.filtru.persoane.push( current.contact); \r\n                           current.contact = null; \" \r\n                           placeholder=\"alegeti persoane...\" aria-label=\"persoane\">\r\n\r\n                            <md-option ng-repeat=\"p in vm.persoane \" ng-value=\"p.name\">\r\n                                <span layout = \"row\">{{p.name}}\r\n\r\n                                </span>\r\n                             </md-option>\r\n                        </md-select>\r\n                    <input ng-model = \"pers\" ng-change = \"vm.persLookup(pers)\">\r\n                     </md-input-container>--><md-autocomplete flex style=\"margin-top: 14px\" md-autoselect=true placeholder=\"alegeti persoana....\" md-item-text=item.name md-items=\"item in vm.foundPers\" md-menu-class=autocomplete-custom-template md-min-length=1 md-delay=200 md-search-text=vm.searchText md-search-text-change=vm.searchTextChange(vm.searchText) md-select-on-match=true md-match-case-insensitive=true md-selected-item-change=vm.selectedItemChange(item) md-selected-item=vm.selectedItem><md-item-template><span class=item-title><span md-highlight-flags=^i md-highlight-text=vm.searchText>{{item.name}}</span></span></md-item-template><md-not-found>NU exista asemnea persoana</md-not-found></md-autocomplete></span><md-chips class=custom-chips ng-model=vm.filtru.persoane readonly md-removable=true ng-show=\"vm.filtru.persoane.length != 0\"><md-chip-template><strong>{{$chip.name}} &nbsp;</strong></md-chip-template></md-chips></md-card></section><section layout=row flex=100><md-card md-whiteframe=z3 flex class=md-padding layout=row layout-align=\"center center\" ng-class=\"{\'bg-grey\':!vm.filtru.aplica.regDate}\"><span style=margin-top:16px><md-checkbox ng-model=vm.filtru.aplica.regDate aria-label=\"data registru\"></md-checkbox></span><span flex=45 layout-align=\"center center\" layout=row>Inregistrate în intervalul:<md-datepicker ng-model=\" vm.filtru.regDateStart\" md-max-date=vm.filtru.endDate ng-disabled=!vm.filtru.aplica.regDate aria-label=\"data registru\"></md-datepicker></span><span flex=50 layout-align=\"center center\" layout=row>și:<md-datepicker ng-model=\" vm.filtru.regDateEnd\" md--min-date=vm.filtru.endDate ng-disabled=!vm.filtru.aplica.regDate aria-label=\"data registru\"></md-datepicker></span></md-card></section><!--        <section layout=\"row\" flex=\"100\">\r\n            <md-card md-whiteframe=\"z3\" flex class=\"md-padding\" layout=\"row\" layout-align=\"center center\" ng-class = \"{\'bg-grey\':!vm.filtru.aplica.date}\">\r\n               <span style = \"margin-top:16px\" >\r\n                    <md-checkbox ng-model = \"vm.filtru.aplica.date\"  aria-label=\"data registru\"></md-checkbox>\r\n                </span>\r\n                \r\n                <span flex=\"50\" layout-align=\"center center\" layout=\"row\" >\r\n                Cu valabilitate la data: \r\n                <md-datepicker ng-model = \" vm.filtru.dateStart\" md-max-date = vm.filtru.endDate ng-disabled = \"!vm.filtru.aplica.date\">\r\n                </md-datepicker>\r\n                </span>\r\n\r\n                <span flex=\"50\" layout-align=\"center center\" layout=\"row\">\r\n                Până la data: \r\n                <md-datepicker ng-model = \" vm.filtru.dateEnd\" md--min-date = vm.filtru.endDate ng-disabled = \"!vm.filtru.aplica.date\">\r\n                </md-datepicker>\r\n                </span>\r\n            </md-card>\r\n\r\n        </section>--><section layout=row flex=100><md-card md-whiteframe=z4 flex class=md-padding layout=row layout-align=\"center center\" ng-class=\"{\'bg-grey\':!vm.filtru.anexe}\"><span flex>Filtrează după... <input ng-model=vm.filtru.anexe.tarla placeholder=tarla> <input ng-model=vm.filtru.anexe.parcela placeholder=parcela> <input ng-model=vm.filtru.anexe.blocFizic placeholder=\"bloc fizic\"></span></md-card></section><section layout=row flex=100><md-card md-whiteframe=z4 flex class=md-padding layout=row layout-align=\"center center\"><span flex>Arată &nbsp;&nbsp;&nbsp;<md-checkbox ng-model=vm.filtru.status.toate aria-label=\"arata filtrul\" ng-true-value=true ng-false-value=false ng-checked=true ng-change=\"vm.filtru.status.toate ? vm.filtru.status = {toate:true, active:true, reziliate:true, expirate:true}:vm.filtru.status = {toate:false, active:false, reziliate:false, expirate:false}\">Toate</md-checkbox>sau doar cele &nbsp;<md-checkbox ng-model=vm.filtru.status.active aria-label=\"filtru activ\">In vigoare</md-checkbox><md-checkbox ng-model=vm.filtru.status.reziliate aria-label=reziliate>Reziliate</md-checkbox><md-checkbox ng-model=vm.filtru.status.expirate aria-label=expirate>Expirate</md-checkbox></span></md-card></section><!--        <section layout=\"row\" flex=\"100\">\r\n            <pre>{{vm.filtru|json}}</pre>\r\n        </section>--></md-dialog-content><md-dialog-actions><md-button class=\"md-raised md-warn\" ng-click=\"vm.filtru = {persoane:[], anexe:{}, aplica:{}}\"><md-icon md-svg-icon=content:ic_remove_circle_outline_24px></md-icon>&nbsp; RESETEAZĂ</md-button><md-button class=\"md-raised md-accent\" ng-click=vm.submit(vm.filtru)><md-icon md-svg-icon=navigation:ic_check_24px></md-icon>&nbsp; APLICĂ</md-button></md-dialog-actions></md-dialog>");}]);
//# sourceMappingURL=../maps/scripts/app-484a32da40.js.map
