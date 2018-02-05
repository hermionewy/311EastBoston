function PathAnime() {
    var _map, _path, _route=[], _info="", _style={color: 'red'};

    var exports= function (selection) {
        for (var i = 0, latlngs = [], len = _route.length; i < len; i++) {
            latlngs.push(new L.LatLng(_route[i][1], _route[i][0]));
        }
        console.log(_info);
        //_path.remove();
        _path.setLatLngs(latlngs);
        _path.setStyle(_style);

        // _map.fitBounds(L.latLngBounds(latlngs));
        //_map.addLayer(L.marker(latlngs[0]).bindPopup(_info));

        _map.addLayer(_path);

        function snake() {
            _path.snakeIn();
        }
        snake();
      //  path.bindPopup(_info).openPopup();
        _path.bindTooltip({permanent: true, opacity: 0.4, offset: new L.Point(100, 200)})
            .setTooltipContent("<div>"+_info+"</div>").openTooltip();

        // _path.on('snakeend', function(ev){
        //     _path.bindPopup(_info).openPopup();
        // });
    }
    exports.map = function(_){
        if(!arguments.length) return _map;
        _map = _;
        return this;
    }
    exports.route = function(_){
        if(!arguments.length) return _route;
        _route = _;
        return this;
    }
    exports.info = function(_){
        if(!arguments.length) return _info;
        _info = _;
        return this;
    }
    exports.style = function(_){
        if(!arguments.length) return _style;
        _style = _;
        return this;
    }
    exports.path = function (_) {
        if(!arguments.length) return _path;
        _path = _;
        return this;
    }
    return exports;
}