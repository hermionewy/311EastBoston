'use strict';
(function() {
    // global variables


    // called once on page load
    var init = function () {

    };

    // called automatically on article page resize
    window.onResize = function (width) {

    };

    // called when the graphic enters the viewport
    window.enterView = function () {

    };


    // graphic code

    var dataUrl = "https://data.boston.gov/api/3/action/datastore_search?resource_id=2968e2c0-d479-49ba-a884-4ef523ada3c0&limit=1000";
    var satelliteURL = "https://api.mapbox.com/styles/v1/wuyuyanran/cjcz89pss0dae2rm638z9fycx/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid3V5dXlhbnJhbiIsImEiOiJjamN6ODhzczMwb2UyMndxb3lsN3JkZGNwIn0.kBRE1lc7gqCbjF7r2YKhow";
    var gray = 'https://api.mapbox.com/styles/v1/gabriel-florit/cjc6jt6kk3thh2rpbd5pa6a0r/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2FicmllbC1mbG9yaXQiLCJhIjoiVldqX21RVSJ9.Udl7GDHMsMh8EcMpxIr2gA';
    var mapid = 'mapid';
    var satellite = L.tileLayer(satelliteURL, {
        id: 'mapbox.street',
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    });
    // var satellite2 = L.tileLayer(satelliteURL, {
    //     id: 'mapbox.street',
    //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    // });


    // graphic code
    var typeSet = d3.set();
    var colorAdjustRec = [[42.401859, -71.074090],[42.401859, -70.956951], [42.347238, -70.956951], [42.347238, -71.074090] ];


    d3.queue()
        .defer(d3.json, './assets/bos_neighborhoods.json')
        .defer(d3.csv, './assets/EastBoston311.csv', parseCSV)
        .defer(d3.csv, './assets/eastBoston17.csv', parse17)
        //.defer(d3.csv, './assets/eastBoston17.csv', parseCSV)
        .await(function (err, geo, data0, data17) {
           //  console.log(geo);
           // console.log(data17);
           console.log(typeSet.values());
            var data = data0.sort(function(a, b){return b.hour-a.hour});
            var streetMap = L.geoJSON(geo, {
                style: function (d) {
                    return {
                        weight: 1,
                        opacity: 1,
                        color: 'darkgrey',
                        dashArray: '3',
                        fillOpacity: 0.1
                    }
                }
            });
            var baseMaps = {
                "Street": streetMap
            };
            var overlayMaps = {};
            var map = L.map(mapid, {
                center: [42.3731185, -71.011264],
                zoom: 14,
                scrollWheelZoom: false,
                zoomControl: false,
                attributionControl: false,
                doubleClickZoom: false,
                dragging: false
            });
            satellite.addTo(map);

            var polygon = L.polygon(colorAdjustRec, {
                color: '#000',
                fillOpacity:'0.6'
            }).addTo(map);

            var map2 = L.map('mapid2', {
                center: [42.3731185, -71.021264],
                zoom: 13,
                layers: [streetMap],
                scrollWheelZoom: false,
                zoomControl: false,
                attributionControl: false,
                //doubleClickZoom: false,
                //dragging: false
            });

            ///////////////Traffic
            var trafficData = data17.filter(function (t) {
                return t.reason == 'Enforcement & Abandoned Vehicles'
            });
            var trafficGroup = L.layerGroup().addTo(map2);
            //satellite2.addTo(map2);



            trafficData.forEach(function (t) {
                var c = L.circleMarker([t.lat, t.lng], {
                    stroke: false,
                    fillColor: 'red',
                    radius: 1.5,
                    opacity: 0.7
                }).bindPopup(t.case);
                trafficGroup.addLayer(c);
            });
            ///////////////Traffic
            //scrollytelling
            var controller = new ScrollMagic.Controller();

            var triggerEls =["#trigger-0", "#trigger-1", "#trigger-2","#trigger-3","#trigger-4"];
            var scenes = triggerEls.map(function(el) {
                var step = +el.split('-')[1];

                var scene = new ScrollMagic.Scene({
                    triggerElement: el,
                    triggerHook: 'onCenter',
                })

                scene
                    .on('enter', function(event) {
                        console.log('enter');
                        graphicUpdate(step);
                    })
                    .on('leave', function(event) {
                        var nextStep = Math.max(0, step - 1)
                        graphicUpdate(nextStep)
                    });

                scene.addTo(controller);
            });


            function showCircles(circledata, color) {
                trafficGroup.clearLayers();
                circledata.forEach(function (t) {
                    var c = L.circleMarker([t.lat, t.lng], {
                        stroke: false,
                        fillColor: color,
                        radius: 2,
                        opacity: 0.8
                    }).bindPopup(t.case);
                    trafficGroup.addLayer(c);
                });
            }
    function graphicUpdate(step) {

        if(step == 0){
            map2.flyTo([42.3751185, -71.001264], 13);

        } else if(step == 1){
            showCircles(trafficData, 'red');
            map2.flyTo([42.3751185, -71.001264], 14);

        } else if(step ==2){
            var environmentData = data17.filter(function (t) {
                return t.reason == 'Street Cleaning'
            });
            showCircles(environmentData, 'steelblue');
            //map2.flyTo([42.3751185, -71.001264], 13);
        }else if(step ==3){
            var environmentData = data17.filter(function (t) {
                return t.reason == 'Recycling'|| t.reason == 'Sanitation'
            });
            showCircles(environmentData, '#67A031');
            //map2.flyTo([42.3751185, -71.001264], 13);
        }else if(step ==4){
            var environmentData = data17.filter(function (t) {
                return t.reason == 'Highway Maintenance'
            });
            showCircles(environmentData, '#E36414');
            //map2.flyTo([42.3751185, -71.001264], 13);
        }

    }




    ///////////////////scrollytelling






            var circleGroup = L.layerGroup().addTo(map);

            var nestedData = d3.nest().key(function (d) {
                return d.hour;
            }).entries(data);



            animationCircles();
            var circlesByYear;

            d3.select('.stop-animation').on('click', function () {
                clearInterval(circlesByYear);

            });


            function animationCircles() {

                var random = getRandomNumber();

                var counter = 23;
                circleGroup.clearLayers();
                clearInterval(circlesByYear);
                var innercount = 0;

                circlesByYear = setInterval(requestByHour, 1000);

                function requestByHour() {
                   // console.log(nestedData[counter]);
                    //circleGroup.clearLayers();
                    document.getElementById("showYear").innerHTML = showTimeRight(nestedData[counter].key);

                    if(nestedData[counter].key>19 || nestedData[counter].key<5){
                        polygon.setStyle({
                            color: '#000',
                            fillOpacity:'0.6'
                        });
                    } else if(nestedData[counter].key==19 || nestedData[counter].key==5){
                        polygon.setStyle({
                            color: '#000',
                            fillOpacity:'0.5'
                        });
                    } else if(nestedData[counter].key==18 || nestedData[counter].key==6){
                        polygon.setStyle({
                            color: '#000',
                            fillOpacity:'0.4'
                        });
                    } else if(nestedData[counter].key<18 && nestedData[counter].key>6){
                        //7~17
                        polygon.setStyle({
                            color: '#000',
                            fillOpacity:'0.2'
                        });
                    }

                    if (counter >= 0 && nestedData[counter].values.length) {
                        //console.log(counter);
                        var innerLength = nestedData[counter].values.length; //start from 0:00
                        var step = 0;
                        var timer = setInterval(oneByone, 1000 / innerLength);

                        function oneByone() {
                            var innerObj = nestedData[counter].values[step];
                            step++;
                            if (!typeof innerObj === 'object') {
                            //    console.log(innerObj);
                                clearTimeout(timer);
                            } else if (innerObj) {
                                var circle = L.circleMarker([innerObj.lat, innerObj.lng], {
                                    radius: 2,
                                    color: 'gold',
                                    fillColor: colorType(innerObj.reason),
                                    weight:12,
                                    fillOpacity: 0.5,
                                    opacity: 0.4,
                                    className: 'objCircle'
                                });
                                var id = +(innerObj.id.toString().slice(10));

                                circle.on('add', function () {
                                    var newRadius = 2;
                                    var currentWeight = 5, currentOpacity =0.3;
                                    var interval = setInterval(function() {
                                        currentWeight = currentWeight - 0.2;
                                        currentOpacity = currentOpacity-0.01;
                                        if (currentWeight > 0) {
                                            circle.setStyle({
                                                radius: 2,
                                                color: 'gold',
                                                weight:currentWeight,
                                                opacity: currentOpacity,
                                                fillOpacity: 0.5,
                                                fillColor: colorType(innerObj.reason)
                                            });
                                            //circle.setRadius(currentRadius);
                                        } else {
                                            circle.setStyle({
                                                radius: 2,
                                                stroke:false,
                                                fillOpacity: 0.5,
                                                fillColor: colorType(innerObj.reason)
                                            });
                                            clearTimeout(interval);
                                        }
                                    }, 40);

                                    if (random.indexOf(id) != -1) {
                                        circle.bindTooltip({
                                            permanent: true,
                                            opacity: 0.6,
                                            offset: new L.Point(100, 200)
                                        }).setTooltipContent(innerObj.case)
                                            .openTooltip();
                                    }
                                });

                                circleGroup.addLayer(circle);
                            }
                            if (step >= innerLength) {
                                //console.log('finalThishour');
                                clearTimeout(timer);
                                return;
                            }
                        }

                        if (counter == 0) {
                            clearInterval(circlesByYear);
                         //   console.log('counter==0');
                            setTimeout(function () {
                                console.log('settimeout1');
                                return restartAnimation();
                            }, 4000);

                            function restartAnimation() {
                                console.log('restart the loop!');
                                random = getRandomNumber();
                                circleGroup.clearLayers();
                                circlesByYear = setInterval(requestByHour, 1000);
                            }

                            counter = 23;

                            return;
                        }
                        counter--;
                    } else {
                        clearInterval(circlesByYear);
                        setTimeout(function () {
                            console.log('settimeout2');
                            circleGroup.clearLayers();
                            setInterval(requestByHour, 1000);

                        }, 4000);
                        counter = 23
                        // clearTimeout(timer);
                        // clearTimeout(circlesByYear);
                    }
                }
            }

        });

    function getRandomNumber() {
        var randomNum = [];
        for (var i = 0; i < 6; i++) {
            var j = Math.floor(100 * Math.random()); //0~999
            randomNum.push(j);
        }
        return randomNum;
    }
    function isSolved(dt) {
        return dt? 'steelblue':'red';
    }

    function colorType(str) {
        return '#f02';
        // if(str=='Street Cleaning'){
        //         return 'steelblue'
        // } else if(str=='Code Enforcement'){
        //     return 'green'
        // } else if(str=='Sanitation'){
        //     return 'gold'
        // } else if(str =='Enforcement & Abandoned Vehicles'){
        //     return 'purple'
        // } else{
        //     return 'red'
        // }
    }

    function showTimeRight(num) {
        if(num>11){
            return (+num-11)+':00 PM'
        } else if(num>=0 && num<=11){
            return (+num+1)+':00 AM'
        } else{
            return 12+':00 AM'
        }
    }

	function parseCSV(d) {
        if(!typeSet.has(d['REASON'])){
            typeSet.add(d['REASON']);
        }
		return {
			case: d['CASE_TITLE'],
			department: d['Department'],
			location: d['Location'],
			lat: (d.Latitude)? +d.Latitude: 0,
			lng: (d.Longitude)? +d.Longitude: 0,
			reason: d['REASON'],
			type: d['TYPE'],
			neighborhood: d.neighborhood,
            date: parseTime(d['open_dt']),
            //close: (d['closed_dt'])?parseTime(d['closed_dt']):null,
            hour: d['open_dt'].split('T')[1].split(':')[0],
            id: +(d['CASE_ENQUIRY_ID'])
		}
    }
    // 2017-08-14T02:43:00
    //12/31/17 22:54
    function parse17(d) {
        if(!typeSet.has(d['REASON'])){
            typeSet.add(d['REASON']);
        }
        return {
            case: d['CASE_TITLE'],
            department: d['Department'],
            location: d['Location'],
            lat: (d.Latitude)? +d.Latitude: 0,
            lng: (d.Longitude)? +d.Longitude: 0,
            reason: d['REASON'],
            type: d['TYPE'],
            neighborhood: d.neighborhood,
            //date: parseTime2(d['open_dt']),
            // //close: (d['closed_dt'])?parseTime(d['closed_dt']):null,
            // hour: d['open_dt'].split('T')[1].split(':')[0],
            id: +(d['CASE_ENQUIRY_ID'])
        }
    }
    function parseTime2(str) {
        var m = +str.split('/')[0]-1,
            y = 2017,
            d = +str.split('/')[1],
            h = str.split(' ')[1].split(':')[0],
            minute = str.split(' ')[1].split(':')[1];
        return new Date(y, m, d, h, minute);
    }

    function parseTime(str) {
		var m = +str.split('T')[0].split('-')[1]-1,
			y = +str.split('T')[0].split('-')[0],
			d = +str.split('T')[0].split('-')[2],
			h = +str.split('T')[1].split(':')[0],
			minute = +str.split('T')[1].split(':')[1];
		return new Date(y, m, d, h, minute);
    }


	// run code
	init();
})();





