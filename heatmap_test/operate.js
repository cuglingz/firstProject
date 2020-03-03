//加载高德底图
var url = "http://webrd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8";
var gaodeLayer = new L.TileLayer(url, {
    subdomains: "1234"
});

// //加载OSM底图
// var baseLayer = L.tileLayer(
//     'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '...',
//     maxZoom: 18
// } );

//设置heatmap样式
var cfg = {
    "radius": .07,
    "maxOpacity": .6,
    "minOpacity": .3,
    "scaleRadius": true,         //设置热力点是否平滑过渡
    "useLocalExtrema": true,     //使用局部极值
    "latField": "lat",
    "lngField": "lon",
    "valueField": "value"
};

var heatmapLayer = new HeatmapOverlay(cfg);

var map = new L.Map('map', {
    center: new L.LatLng(30.93555, 114.39201),
    zoom: 10,
    layers: [gaodeLayer, heatmapLayer]
});

var icon = L.icon({
    iconUrl: "./images/position.png",
});

$("#click-map").click(function () {
    map.on("click", function (e) {
        $("#lon").val(e.latlng.lng.toFixed(6))
        $("#lat").val(e.latlng.lat.toFixed(6))
        //var marker = L.marker([$("#lat").val(), $("#lon").val()],{icon}).addTo(map);
    });
});

//将数据添加到数据库，跨域
$("#add").click(function () {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://localhost:8080/insert?value=" + $("#val").val() + "&lon=" + $("#lon").val() + "&&lat=" + $("#lat").val();
    document.head.appendChild(script)
    alert("添加成功");
});

//根据区域范围查询要素点
var dataSet = [];
var marker;
$("#search").click(function () {
    $.get("http://localhost:8080/get1?minX=" + $("#min-lat").val() + "&minY=" + $("#min-lon").val() + "&maxX=" + $("#max-lat").val() + "&maxY=" + $("#max-lon").val(), function (data, status) {
        for (var i = 0; i < data.length; ++i) {
            marker = L.marker([data[i].lat, data[i].lon], { icon, title:data[i].value}).addTo(map);
            dataSet.push(data[i]);
        }
    });
});
//console.log(dataSet);

var testData = {
    max: 100,
    data: dataSet
};


$("#heatmap-show").click(function () {
    heatmapLayer.setData(testData);
});