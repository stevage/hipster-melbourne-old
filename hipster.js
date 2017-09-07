mapboxgl.accessToken = 'pk.eyJ1Ijoic3RldmFnZSIsImEiOiJGcW03aExzIn0.QUkUmTGIO3gGt83HiRIjQw';
var map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/stevage/ciz68fsec00112rpal5hjru07?refresh=' + Math.random(),
    center: [144.97, -37.81],
    zoom: 15,
    minZoom: 14,
    maxZoom: 15.99
});

function getFeature(point) {
    return map.queryRenderedFeatures(point, { layers: ['hipster content'] })[0];
}

map.on('click', function(e) {
    var f = getFeature(e.point);

    if (!f) {
        return;
    }

    var p = f.properties;
    new mapboxgl.Popup()
        .setLngLat(f.geometry.coordinates)
        .setHTML('<div>' + 
                 '<h2>' + p.name + '</h2>' + 
                 '<p>' + p.keywords + '</p>' +
                 '</div>')
        .addTo(map);
});
map.on('load', function e() {
    map.addSource('hipster-geojson', {
        type: 'geojson',
        data: 'https://crossorigin.me/http://umap.openstreetmap.fr/en/datalayer/408207/'
    });
    // we basically clone the existing hipster content layer, then replace its source with a fresh geojson version.
    var contentLayer = JSON.parse(JSON.stringify(map.getStyle().layers.find(function(l) { return l.id === 'hipster content'; })));
    map.removeLayer('hipster content');
    contentLayer.source = 'hipster-geojson';
    delete contentLayer['source-layer'];
    map.addLayer(contentLayer);
    map.on('mousemove', function (e) {
        //var feature = ; //map.queryRenderedFeatures(e.point, { layers: layers });
        map.getCanvas().style.cursor = (getFeature(e.point)) ? 'pointer' : '';
    });
});
var collapsed = false;
document.querySelector('#collapsebtn').addEventListener('click', function(e) {
    collapsed = !collapsed;
    if (collapsed) {
        document.querySelector('.sidepanel').classList.add('collapsed');
    } else {
        document.querySelector('.sidepanel').classList.remove('collapsed');
    }
    map.resize();
});
