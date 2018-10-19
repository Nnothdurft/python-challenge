let map = L.map("map", {
    center: [40.7655, -111.9444],
    zoom: 5
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(map);

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function magnitude(scale){
    switch (true){
        case (scale < 1):
            return "#00f522";
        case (scale < 2):
            return "#bbf500";
        case (scale < 3):
            return "#f6ff00";
        case (scale < 4):
            return "#ffbc00";
        case (scale < 5):
            return "#f80";
        case (scale >= 5):
            return "red";
        default:
            return "blue";
    }
}

d3.json(url, function(data){
    L.geoJson(data, {
        pointToLayer: function(feature){
            var geoMarker = {
                radius: feature.properties.mag*4,
                fillColor: magnitude(feature.properties.mag),
                color: "black",
                weight: 1,
                fillOpacity: 1
            };
            var coords = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
            return L.circleMarker(coords, geoMarker);
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup("<h2>Location: <br>" + feature.properties.place + "</h2> <hr> <h3>Magnitude: " + feature.properties.mag + "</h3>");
        }
    }).addTo(map);
})

let legend = L.control({position: 'bottomright'});

legend.onAdd = function(map){
    let div = L.DomUtil.create('div', 'info legend'),
    magnitudes = [1, 2, 3, 4, 5, 6],
    labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"]
    for(var i = 0; i < magnitudes.length; i++){
        div.innerHTML += 
            '<i style="background:' + magnitude(i) + '"></i> ' + labels[i] + '<br>';
    }
    return div;
};
legend.addTo(map);
