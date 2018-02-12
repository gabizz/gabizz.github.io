var app = angular.module('app', ['ngMaterial', 'ngAnimate']);


app.controller('main', main);


function main($scope) {

$scope.items = [
{
  name: "WORKSHOP SERVICE CUSTOMERS & ORDERS MANAGEMENT",
  desc: "angular 5 app with and node.js (express/sequelize/sqlite) and oauth authentication",
  link: "./apps/service/index.html"
},
{
    name: "EVIDENȚĂ DOSARE LEGEA 17/2014",
  desc:"angular.js(1.-latest) using angular-material + php backend - slim3 rest api ",
  link: "./apps/legea17/index.html"
},
{
  name: "REGISTRUL CONTRACTELOR DE ARENDARE",
  desc: "angular.js(1.-latest) using angular-material + express+sequelize+mysql backend",
  link: "./apps/arenda/index.html"
},
];

}
