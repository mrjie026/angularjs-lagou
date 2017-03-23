"use strict";angular.module("app",["ui.router","ngCookies","validation","ngAnimate"]),angular.module("app").value("dict",{}).run(["dict","$http",function(t,e){e.get("../data/city.json").then(function(e){t.city=e.data}),e.get("../data/salary.json").then(function(e){t.salary=e.data}),e.get("../data/scale.json").then(function(e){t.scale=e.data})}]),angular.module("app").config(["$provide",function(t){t.decorator("$http",["$delegate","$q",function(t,e){return t.post=function(n,a,i){var o=e.defer();return t.get(n).then(function(t){o.resolve(t)}).catch(function(t){o.reject(t)}),{success:function(t){o.promise.then(t)},error:function(t){o.promise.then(null,t)}}},t}])}]),angular.module("app").config(["$stateProvider","$urlRouterProvider",function(t,e){t.state("main",{url:"/main",templateUrl:"view/main.html",controller:"mainCtrl"}).state("position",{url:"/position/:id",templateUrl:"view/position.html",controller:"positionCtrl"}).state("company",{url:"/company/:id",templateUrl:"view/company.html",controller:"companyCtrl"}).state("search",{url:"/search",templateUrl:"view/search.html",controller:"searchCtrl"}).state("login",{url:"/login",templateUrl:"view/login.html",controller:"loginCtrl"}).state("register",{url:"/register",templateUrl:"view/register.html",controller:"registerCtrl"}).state("me",{url:"/me",templateUrl:"view/me.html",controller:"meCtrl"}).state("favorite",{url:"/favorite",templateUrl:"view/favorite.html",controller:"favorite"}).state("post",{url:"/post",templateUrl:"view/post.html",controller:"postCtrl"}),e.otherwise("main")}]),angular.module("app").config(["$validationProvider",function(t){var e={phone:/^1[\d]{10}$/,password:function(t){return(t+"").length>5},required:function(t){return!!t}},n={phone:{success:"",error:"11位手机号"},password:{success:"",error:"长度至少6位"},required:{success:"",error:"不能为空!"}};t.setExpression(e).setDefaultMsg(n)}]),angular.module("app").controller("companyCtrl",["$http","$state","$scope",function(t,e,n){t.get("../data/company.json?id="+e.params.id).then(function(t){n.company=t.data,n.$broadcast("click",{id:1})})}]),angular.module("app").controller("favorite",["$http","$scope",function(t,e){t.get("data/myFavorite.json").then(function(t){e.list=t.data})}]),angular.module("app").controller("loginCtrl",["cache","$http","$scope","$state",function(t,e,n,a){n.submit=function(){e.post("data/login.json").success(function(e){console.log(e),t.put("id",e.data.id),t.put("name",e.data.name),t.put("image",e.data.image),a.go("main")})}}]),angular.module("app").controller("mainCtrl",["$http","$scope",function(t,e){t.get("../data/positionList.json").then(function(t){e.list=t.data}).catch(function(t){console.log(t)})}]),angular.module("app").controller("meCtrl",["$state","cache","$http","$scope",function(t,e,n,a){e.get("name")&&(a.name=e.get("name"),a.image=e.get("image")),a.login_exit=function(){e.remove("id"),e.remove("name"),e.remove("image"),t.go("main")}}]),angular.module("app").controller("positionCtrl",["$log","cache","$q","$http","$state","$scope",function(t,e,n,a,i,o){function r(t){a.get("../data/company.json?id="+t).then(function(t){o.company=t.data})}o.isLogin=!!e.get("name"),o.message=o.isLogin?"投个简历":"去登录",function(){var t=n.defer();return a.get("../data/position.json?id="+i.params.id).then(function(e){o.position=e.data,e.data.posted&&(o.message="已投递"),t.resolve(e)}).catch(function(e){t.reject(err),console.log(e)}),t.promise}().then(function(t){r(t.companyId)}),o.go=function(){"已投递"!==o.message&&(o.isLogin?a.post("data/handle.json",{id:o.position.id}).success(function(e){t.info(e),o.message="已投递"}):i.go("login"))}}]),angular.module("app").controller("postCtrl",["$http","$scope",function(t,e){e.tabList=[{id:"all",name:"全部"},{id:"pass",name:"面试邀请"},{id:"fail",name:"不合适"}],t.get("data/myPost.json").then(function(t){e.positionList=t.data,console.log(t.data)}),e.filterObj={},e.tClick=function(t,n){switch(t){case"all":delete e.filterObj.state;break;case"pass":e.filterObj.state="1";break;case"fail":e.filterObj.state="-1"}}}]),angular.module("app").controller("registerCtrl",["$interval","$http","$scope","$state",function(t,e,n,a){n.submit=function(){e.post("data/regist.json",n.user).success(function(t){console.log(t),a.go("login")})};var i=60;n.send=function(){e.get("data/code.json").then(function(e){if(1===e.data.state){i=60,n.send_time="60s";var a=t(function(){i<=0?(t.cancel(a),n.send_time=""):(i--,n.send_time=i+"s")},1e3)}})}}]),angular.module("app").controller("searchCtrl",["dict","$http","$scope",function(t,e,n){n.name="",n.search=function(){e.get("../data/positionList.json?name="+n.name).then(function(t){n.positionList=t.data})},n.sheet={},n.search(),n.tabList=[{id:"city",name:"城市"},{id:"salary",name:"薪水"},{id:"scale",name:"公司规模"}],n.filterObj={};var a="";n.tClick=function(e,i){a=e,n.sheet.list=t[e],n.sheet.visible=!0},n.sClick=function(t,e){t?(angular.forEach(n.tabList,function(t){t.id===a&&(t.name=e)}),n.filterObj[a+"Id"]=t):(delete n.filterObj[a+"Id"],angular.forEach(n.tabList,function(t){if(t.id===a)switch(t.id){case"city":t.name="城市";break;case"salary":t.name="薪资";break;case"scale":t.name="公司规模"}}))}}]),angular.module("app").filter("filterByObj",function(){return function(t,e){var n=[];return angular.forEach(t,function(t){var a=!0;for(var i in e)t[i]!==e[i]&&(a=!1);a&&n.push(t)}),n}}),angular.module("app").directive("companyInfo",function(){return{restrict:"A",replate:!0,tepmlateUrl:"view/template/companyInfo.html"}}),angular.module("app").directive("appFoot",function(){return{restrict:"A",replace:!0,templateUrl:"view/template/foot.html"}}),angular.module("app").directive("appHead",["cache",function(t){return{restrict:"A",replace:!0,templateUrl:"view/template/head.html",link:function(e){e.name=t.get("name")||""}}}]),angular.module("app").directive("appHeadBar",function(){return{restrict:"A",replate:"ture",templateUrl:"view/template/headBar.html",scope:{text:"@"},link:function(t){t.back=function(){window.history.back()},t.$on("click",function(t,e){console.log(t,e)})}}}),angular.module("app").directive("appCompany",function(){return{restrict:"A",replate:!0,templateUrl:"view/template/positionCompany.html",scope:{company:"="}}}),angular.module("app").directive("appPositionClass",function(){return{restrict:"A",replate:!0,scope:{company:"="},templateUrl:"view/template/positionClass.html",link:function(t){t.showPositionList=function(e){t.positionList=t.company.positionClass[e].positionList,t.isActive=e},t.$watch("company",function(e){e&&t.showPositionList(0)})}}}),angular.module("app").directive("appDescription",function(){return{restrict:"A",replate:!0,templateUrl:"view/template/positionDescription.html"}}),angular.module("app").directive("appPositionInfo",["$http",function(t){return{restrict:"A",replate:!0,templateUrl:"view/template/positionInfo.html",scope:{inActive:"=",isLogin:"=",position:"="},link:function(e){e.$watch("position",function(t){t&&(e.position.select=e.position.select||!1,e.imagePath=e.isActive?"image/star-active.png":"image/star.png")}),e.favorite=function(){t.post("data/favorite.json",{id:e.position.id,select:e.position.select}).success(function(t){e.isActive=!e.isActive,e.imagePath=e.isActive?"image/star-active.png":"image/star.png"})}}}}]),angular.module("app").directive("appPositionList",["$http",function(t){return{restrict:"A",replace:!0,templateUrl:"view/template/positionList.html",scope:{data:"=",filterObj:"=",isFavorite:"="},link:function(e){e.select=function(e){t.post("data/favorite.json",{id:e.id,select:!e.select}).success(function(t){e.select=!e.select})}}}}]),angular.module("app").directive("appSheet",function(){return{restrict:"A",replate:!0,templateUrl:"view/template/sheet.html",scope:{list:"=",visible:"=",select:"&"}}}),angular.module("app").directive("appTab",function(){return{restrict:"A",replate:!0,templateUrl:"view/template/tab.html",scope:{list:"=",tabClick:"&"},link:function(t){t.click=function(e){t.selectId=e.id,t.tabClick(e)}}}}),angular.module("app").service("cache",["$cookies",function(t){this.put=function(e,n){t.put(e,n)},this.get=function(e){return t.get(e)},this.remove=function(e){t.remove(e)}}]);