function initMap() {
    var location = { lat: 53.349804, lng: -6.260310 };
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 11,
        center: location
    });

    var stations = [
							{"number":1, "address":"Clarendon Row", "banking":0, "bike_stands":31, "name":"CLARENDON ROW", "position_lat":53.3409, "position_lng":-6.2625},
                            {"number":2, "address":"Blessington Street", "banking":0, "bike_stands":20, "name":"BLESSINGTON STREET", "position_lat":53.3568, "position_lng":-6.26814},
                            {"number":3, "address":"Bolton Street", "banking":0, "bike_stands":20, "name":"BOLTON STREET", "position_lat":53.3512, "position_lng":-6.26986},
                            {"number":4, "address":"Greek Street", "banking":0, "bike_stands":20, "name":"GREEK STREET", "position_lat":53.3469, "position_lng":-6.27298},
                            {"number":5, "address":"Charlemont Street", "banking":0, "bike_stands":40, "name":"CHARLEMONT PLACE", "position_lat":53.3307, "position_lng":-6.26018},
                            {"number":6, "address":"Christchurch Place", "banking":0, "bike_stands":20, "name":"CHRISTCHURCH PLACE", "position_lat":53.3434, "position_lng":-6.27012},
                            {"number":7, "address":"High Street", "banking":0, "bike_stands":29, "name":"HIGH STREET", "position_lat":53.3436, "position_lng":-6.27507},
                            {"number":8, "address":"Custom House Quay", "banking":0, "bike_stands":30, "name":"CUSTOM HOUSE QUAY", "position_lat":53.3479, "position_lng":-6.24805},
                            {"number":9, "address":"Exchequer Street", "banking":0, "bike_stands":24, "name":"EXCHEQUER STREET", "position_lat":53.343, "position_lng":-6.26358},
                            {"number":10, "address":"Dame Street", "banking":0, "bike_stands":16, "name":"DAME STREET", "position_lat":53.344, "position_lng":-6.2668},
                            {"number":11, "address":"Earlsfort Terrace", "banking":0, "bike_stands":30, "name":"EARLSFORT TERRACE", "position_lat":53.3343, "position_lng":-6.2585},
                            {"number":12, "address":"Eccles Street", "banking":0, "bike_stands":20, "name":"ECCLES STREET", "position_lat":53.3592, "position_lng":-6.26978},
                            {"number":13, "address":"Fitzwilliam Square West", "banking":0, "bike_stands":30, "name":"FITZWILLIAM SQUARE WEST", "position_lat":53.3361, "position_lng":-6.25282},
                            {"number":14, "address":"Fownes Street Upper", "banking":0, "bike_stands":30, "name":"FOWNES STREET UPPER", "position_lat":53.3446, "position_lng":-6.26337},
                            {"number":15, "address":"Hardwicke Street", "banking":0, "bike_stands":16, "name":"HARDWICKE STREET", "position_lat":53.3555, "position_lng":-6.26442},
                            {"number":16, "address":"Georges Quay", "banking":0, "bike_stands":20, "name":"GEORGES QUAY", "position_lat":53.3475, "position_lng":-6.25219},
                            {"number":17, "address":"Golden Lane", "banking":0, "bike_stands":20, "name":"GOLDEN LANE", "position_lat":53.3408, "position_lng":-6.26773},
                            {"number":18, "address":"Grantham Street", "banking":0, "bike_stands":30, "name":"GRANTHAM STREET", "position_lat":53.3341, "position_lng":-6.26544},
                            {"number":19, "address":"Herbert Place", "banking":0, "bike_stands":30, "name":"HERBERT PLACE", "position_lat":53.3344, "position_lng":-6.24557},
                            {"number":20, "address":"James Street East", "banking":0, "bike_stands":30, "name":"JAMES STREET EAST", "position_lat":53.3366, "position_lng":-6.24811},
                            {"number":21, "address":"Leinster Street South", "banking":0, "bike_stands":30, "name":"LEINSTER STREET SOUTH", "position_lat":53.3422, "position_lng":-6.25449},
                            {"number":22, "address":"Townsend Street", "banking":0, "bike_stands":20, "name":"TOWNSEND STREET", "position_lat":53.3459, "position_lng":-6.25461},
                            {"number":23, "address":"Custom House", "banking":0, "bike_stands":30, "name":"CUSTOM HOUSE", "position_lat":53.3483, "position_lng":-6.25466},
                            {"number":24, "address":"Cathal Brugha Street", "banking":0, "bike_stands":20, "name":"CATHAL BRUGHA STREET", "position_lat":53.3521, "position_lng":-6.26053},
                            {"number":25, "address":"Merrion Square East", "banking":0, "bike_stands":30, "name":"MERRION SQUARE EAST", "position_lat":53.3394, "position_lng":-6.24655},
                            {"number":26, "address":"Merrion Square West", "banking":1, "bike_stands":20, "name":"MERRION SQUARE WEST", "position_lat":53.3398, "position_lng":-6.25199},
                            {"number":27, "address":"Molesworth Street", "banking":0, "bike_stands":20, "name":"MOLESWORTH STREET", "position_lat":53.3413, "position_lng":-6.25812},
                            {"number":28, "address":"Mountjoy Square West", "banking":0, "bike_stands":30, "name":"MOUNTJOY SQUARE WEST", "position_lat":53.3563, "position_lng":-6.25859},
                            {"number":29, "address":"Ormond Quay Upper", "banking":0, "bike_stands":29, "name":"ORMOND QUAY UPPER", "position_lat":53.3461, "position_lng":-6.268},
                            {"number":30, "address":"Parnell Square North", "banking":0, "bike_stands":20, "name":"PARNELL SQUARE NORTH", "position_lat":53.3537, "position_lng":-6.2653},
                            {"number":31, "address":"Parnell Street", "banking":0, "bike_stands":20, "name":"PARNELL STREET", "position_lat":53.3509, "position_lng":-6.26512},
                            {"number":32, "address":"Pearse Street", "banking":0, "bike_stands":30, "name":"PEARSE STREET", "position_lat":53.3443, "position_lng":-6.25043},
                            {"number":33, "address":"Princes Street / O'Connell Street", "banking":1, "bike_stands":23, "name":"PRINCES STREET / O'CONNELL STREET", "position_lat":53.349, "position_lng":-6.26031},
                            {"number":34, "address":"Portobello Harbour", "banking":0, "bike_stands":30, "name":"PORTOBELLO HARBOUR", "position_lat":53.3304, "position_lng":-6.26516},
                            {"number":35, "address":"Smithfield", "banking":0, "bike_stands":30, "name":"SMITHFIELD", "position_lat":53.3477, "position_lng":-6.27821},
                            {"number":36, "address":"St. Stephen's Green East", "banking":0, "bike_stands":40, "name":"ST. STEPHEN'S GREEN EAST", "position_lat":53.3378, "position_lng":-6.25603},
                            {"number":37, "address":"St. Stephen's Green South", "banking":1, "bike_stands":30, "name":"ST. STEPHEN'S GREEN SOUTH", "position_lat":53.3375, "position_lng":-6.26199},
                            {"number":38, "address":"Talbot Street", "banking":0, "bike_stands":40, "name":"TALBOT STREET", "position_lat":53.351, "position_lng":-6.25294},
                            {"number":39, "address":"Wilton Terrace", "banking":0, "bike_stands":20, "name":"WILTON TERRACE", "position_lat":53.3324, "position_lng":-6.25272},
                            {"number":40, "address":"Jervis Street", "banking":0, "bike_stands":21, "name":"JERVIS STREET", "position_lat":53.3483, "position_lng":-6.26665},
                            {"number":41, "address":"Harcourt Terrace", "banking":0, "bike_stands":20, "name":"HARCOURT TERRACE", "position_lat":53.3328, "position_lng":-6.25794},
                            {"number":42, "address":"Smithfield North", "banking":0, "bike_stands":30, "name":"SMITHFIELD NORTH", "position_lat":53.3496, "position_lng":-6.2782},
                            {"number":43, "address":"Portobello Road", "banking":0, "bike_stands":30, "name":"PORTOBELLO ROAD", "position_lat":53.3301, "position_lng":-6.26804},
                            {"number":44, "address":"Upper Sherrard Street", "banking":0, "bike_stands":30, "name":"UPPER SHERRARD STREET", "position_lat":53.3584, "position_lng":-6.26064},
                            {"number":45, "address":"Deverell Place", "banking":0, "bike_stands":30, "name":"DEVERELL PLACE", "position_lat":53.3515, "position_lng":-6.25527},
                            {"number":47, "address":"Herbert Street", "banking":0, "bike_stands":40, "name":"HERBERT STREET", "position_lat":53.3357, "position_lng":-6.24551},
                            {"number":48, "address":"Excise Walk", "banking":0, "bike_stands":40, "name":"EXCISE WALK", "position_lat":53.3478, "position_lng":-6.24424},
                            {"number":49, "address":"Guild Street", "banking":0, "bike_stands":40, "name":"GUILD STREET", "position_lat":53.3479, "position_lng":-6.24093},
                            {"number":50, "address":"George's Lane", "banking":0, "bike_stands":40, "name":"GEORGES LANE", "position_lat":53.3502, "position_lng":-6.2797},
                            {"number":51, "address":"York Street West", "banking":0, "bike_stands":40, "name":"YORK STREET WEST", "position_lat":53.3393, "position_lng":-6.2647},
                            {"number":52, "address":"York Street East", "banking":0, "bike_stands":32, "name":"YORK STREET EAST", "position_lat":53.3388, "position_lng":-6.262},
                            {"number":53, "address":"Newman House", "banking":0, "bike_stands":40, "name":"NEWMAN HOUSE", "position_lat":53.3371, "position_lng":-6.26059},
                            {"number":54, "address":"Clonmel Street", "banking":0, "bike_stands":33, "name":"CLONMEL STREET", "position_lat":53.336, "position_lng":-6.26298},
                            {"number":55, "address":"Hatch Street", "banking":0, "bike_stands":36, "name":"HATCH STREET", "position_lat":53.334, "position_lng":-6.26071},
                            {"number":56, "address":"Mount Street Lower", "banking":0, "bike_stands":40, "name":"MOUNT STREET LOWER", "position_lat":53.338, "position_lng":-6.24153},
                            {"number":57, "address":"Grattan Street", "banking":0, "bike_stands":23, "name":"GRATTAN STREET", "position_lat":53.3396, "position_lng":-6.24378},
                            {"number":58, "address":"Sir Patrick's Dun", "banking":0, "bike_stands":40, "name":"SIR PATRICK DUN'S", "position_lat":53.3392, "position_lng":-6.24064},
                            {"number":59, "address":"Denmark Street Great", "banking":0, "bike_stands":20, "name":"DENMARK STREET GREAT", "position_lat":53.3556, "position_lng":-6.2614},
                            {"number":60, "address":"North Circular Road", "banking":0, "bike_stands":30, "name":"NORTH CIRCULAR ROAD", "position_lat":53.3596, "position_lng":-6.26035},
                            {"number":61, "address":"Hardwicke Place", "banking":0, "bike_stands":25, "name":"HARDWICKE PLACE", "position_lat":53.357, "position_lng":-6.26323},
                            {"number":62, "address":"Lime Street", "banking":0, "bike_stands":40, "name":"LIME STREET", "position_lat":53.346, "position_lng":-6.24358},
                            {"number":63, "address":"Fenian Street", "banking":0, "bike_stands":35, "name":"FENIAN STREET", "position_lat":53.3414, "position_lng":-6.24672},
                            {"number":64, "address":"Sandwith Street", "banking":0, "bike_stands":40, "name":"SANDWITH STREET", "position_lat":53.3452, "position_lng":-6.24716},
                            {"number":65, "address":"Convention Centre", "banking":1, "bike_stands":40, "name":"CONVENTION CENTRE", "position_lat":53.3474, "position_lng":-6.23852},
                            {"number":66, "address":"New Central Bank", "banking":0, "bike_stands":40, "name":"NEW CENTRAL BANK", "position_lat":53.3471, "position_lng":-6.23475},
                            {"number":67, "address":"The Point", "banking":0, "bike_stands":40, "name":"THE POINT", "position_lat":53.3469, "position_lng":-6.23085},
                            {"number":68, "address":"Hanover Quay", "banking":0, "bike_stands":40, "name":"HANOVER QUAY", "position_lat":53.3441, "position_lng":-6.23715},
                            {"number":69, "address":"Grand Canal Dock", "banking":0, "bike_stands":40, "name":"GRAND CANAL DOCK", "position_lat":53.3426, "position_lng":-6.2387},
                            {"number":71, "address":"Kevin Street", "banking":0, "bike_stands":40, "name":"KEVIN STREET", "position_lat":53.3378, "position_lng":-6.2677},
                            {"number":72, "address":"John Street West", "banking":0, "bike_stands":31, "name":"JOHN STREET WEST", "position_lat":53.3431, "position_lng":-6.27717},
                            {"number":73, "address":"Francis Street", "banking":0, "bike_stands":30, "name":"FRANCIS STREET", "position_lat":53.3421, "position_lng":-6.27523},
                            {"number":74, "address":"Oliver Bond Street", "banking":0, "bike_stands":30, "name":"OLIVER BOND STREET", "position_lat":53.3439, "position_lng":-6.28053},
                            {"number":75, "address":"James Street", "banking":0, "bike_stands":40, "name":"JAMES STREET", "position_lat":53.3435, "position_lng":-6.28741},
                            {"number":76, "address":"Market Street South", "banking":0, "bike_stands":38, "name":"MARKET STREET SOUTH", "position_lat":53.3423, "position_lng":-6.28766},
                            {"number":77, "address":"Wolfe Tone Street", "banking":0, "bike_stands":29, "name":"WOLFE TONE STREET", "position_lat":53.3489, "position_lng":-6.26746},
                            {"number":78, "address":"Mater Hospital", "banking":0, "bike_stands":40, "name":"MATER HOSPITAL", "position_lat":53.36, "position_lng":-6.26483},
                            {"number":79, "address":"Eccles Street East", "banking":0, "bike_stands":27, "name":"ECCLES STREET EAST", "position_lat":53.3581, "position_lng":-6.2656},
                            {"number":80, "address":"St James Hospital (Luas)", "banking":0, "bike_stands":40, "name":"ST JAMES HOSPITAL (LUAS)", "position_lat":53.3414, "position_lng":-6.29295},
                            {"number":82, "address":"Mount Brown", "banking":0, "bike_stands":22, "name":"MOUNT BROWN", "position_lat":53.3416, "position_lng":-6.29719},
                            {"number":83, "address":"Emmet Road", "banking":0, "bike_stands":40, "name":"EMMET ROAD", "position_lat":53.3407, "position_lng":-6.30819},
                            {"number":84, "address":"Brookfield Road", "banking":0, "bike_stands":30, "name":"BROOKFIELD ROAD", "position_lat":53.339, "position_lng":-6.30022},
                            {"number":85, "address":"Rothe Abbey", "banking":0, "bike_stands":35, "name":"ROTHE ABBEY", "position_lat":53.3388, "position_lng":-6.30395},
                            {"number":86, "address":"Parkgate Street", "banking":0, "bike_stands":38, "name":"PARKGATE STREET", "position_lat":53.348, "position_lng":-6.2918},
                            {"number":87, "address":"Collins Barracks Museum", "banking":0, "bike_stands":38, "name":"COLLINS BARRACKS MUSEUM", "position_lat":53.3475, "position_lng":-6.28525},
                            {"number":88, "address":"Blackhall Place", "banking":0, "bike_stands":30, "name":"BLACKHALL PLACE", "position_lat":53.3488, "position_lng":-6.28164},
                            {"number":89, "address":"Fitzwilliam Square East", "banking":0, "bike_stands":40, "name":"FITZWILLIAM SQUARE EAST", "position_lat":53.3352, "position_lng":-6.2509},
                            {"number":90, "address":"Benson Street", "banking":0, "bike_stands":40, "name":"BENSON STREET", "position_lat":53.3442, "position_lng":-6.23345},
                            {"number":91, "address":"South Dock Road", "banking":0, "bike_stands":30, "name":"SOUTH DOCK ROAD", "position_lat":53.3418, "position_lng":-6.23129},
                            {"number":92, "address":"Heuston Bridge (North)", "banking":0, "bike_stands":40, "name":"HEUSTON BRIDGE (NORTH)", "position_lat":53.3478, "position_lng":-6.29243},
                            {"number":93, "address":"Heuston Station (Central)", "banking":0, "bike_stands":40, "name":"HEUSTON STATION (CENTRAL)", "position_lat":53.3466, "position_lng":-6.29692},
                            {"number":94, "address":"Heuston Station (Car Park)", "banking":0, "bike_stands":40, "name":"HEUSTON STATION (CAR PARK)", "position_lat":53.347, "position_lng":-6.2978},
                            {"number":95, "address":"Royal Hospital", "banking":0, "bike_stands":40, "name":"ROYAL HOSPITAL", "position_lat":53.3439, "position_lng":-6.29706},
                            {"number":96, "address":"Kilmainham Lane", "banking":0, "bike_stands":30, "name":"KILMAINHAM LANE", "position_lat":53.3418, "position_lng":-6.30509},
                            {"number":97, "address":"Kilmainham Gaol", "banking":0, "bike_stands":40, "name":"KILMAINHAM GAOL", "position_lat":53.3421, "position_lng":-6.31002},
                            {"number":98, "address":"Frederick Street South", "banking":0, "bike_stands":40, "name":"FREDERICK STREET SOUTH", "position_lat":53.3415, "position_lng":-6.25685},
                            {"number":99, "address":"City Quay", "banking":0, "bike_stands":30, "name":"CITY QUAY", "position_lat":53.3466, "position_lng":-6.24615},
                            {"number":100, "address":"Heuston Bridge (South)", "banking":0, "bike_stands":25, "name":"HEUSTON BRIDGE (SOUTH)", "position_lat":53.3471, "position_lng":-6.29204},
                            {"number":101, "address":"King Street North", "banking":0, "bike_stands":30, "name":"KING STREET NORTH", "position_lat":53.3503, "position_lng":-6.27351},
                            {"number":102, "address":"Western Way", "banking":0, "bike_stands":40, "name":"WESTERN WAY", "position_lat":53.3549, "position_lng":-6.26942},
                            {"number":103, "address":"Grangegorman Lower (South)", "banking":0, "bike_stands":40, "name":"GRANGEGORMAN LOWER (SOUTH)", "position_lat":53.3547, "position_lng":-6.27868},
                            {"number":104, "address":"Grangegorman Lower (Central)", "banking":0, "bike_stands":40, "name":"GRANGEGORMAN LOWER (CENTRAL)", "position_lat":53.3552, "position_lng":-6.27842},
                            {"number":105, "address":"Grangegorman Lower (North)", "banking":0, "bike_stands":36, "name":"GRANGEGORMAN LOWER (NORTH)", "position_lat":53.356, "position_lng":-6.27838},
                            {"number":106, "address":"Rathdown Road", "banking":0, "bike_stands":40, "name":"RATHDOWN ROAD", "position_lat":53.3589, "position_lng":-6.28034},
                            {"number":107, "address":"Charleville Road", "banking":0, "bike_stands":40, "name":"CHARLEVILLE ROAD", "position_lat":53.3592, "position_lng":-6.28187},
                            {"number":108, "address":"Avondale Road", "banking":0, "bike_stands":35, "name":"AVONDALE ROAD", "position_lat":53.3594, "position_lng":-6.27614},
                            {"number":109, "address":"Buckingham Street Lower", "banking":0, "bike_stands":29, "name":"BUCKINGHAM STREET LOWER", "position_lat":53.3533, "position_lng":-6.24932},
                            {"number":110, "address":"Phibsborough Road", "banking":0, "bike_stands":40, "name":"PHIBSBOROUGH ROAD", "position_lat":53.3563, "position_lng":-6.27372},
                            {"number":111, "address":"Mountjoy Square East", "banking":0, "bike_stands":40, "name":"MOUNTJOY SQUARE EAST", "position_lat":53.3567, "position_lng":-6.25636},
                            {"number":112, "address":"North Circular Road (O'Connell's)", "banking":0, "bike_stands":30, "name":"NORTH CIRCULAR ROAD (O'CONNELL'S)", "position_lat":53.3578, "position_lng":-6.25156},
                            {"number":113, "address":"Merrion Square South", "banking":0, "bike_stands":40, "name":"MERRION SQUARE SOUTH", "position_lat":53.3386, "position_lng":-6.24861},
                            {"number":114, "address":"Wilton Terrace (Park)", "banking":0, "bike_stands":40, "name":"WILTON TERRACE (PARK)", "position_lat":53.3337, "position_lng":-6.24834},
                            {"number":115, "address":"Killarney Street", "banking":0, "bike_stands":30, "name":"KILLARNEY STREET", "position_lat":53.3548, "position_lng":-6.24758},
                            {"number":116, "address":"Broadstone", "banking":0, "bike_stands":30, "name":"BROADSTONE", "position_lat":53.3547, "position_lng":-6.27231},
                            {"number":117, "address":"Hanover Quay East", "banking":0, "bike_stands":40, "name":"HANOVER QUAY EAST", "position_lat":53.3437, "position_lng":-6.23175}
    ];

    var stationNameCell = document.getElementById("stationNameCell");
    var availabilityCell = document.getElementById("availabilityCell");


    stations.forEach(function (station) {
        var marker = new google.maps.Marker({
            position: { lat: station.position_lat, lng: station.position_lng },
            map: map,
            title: station.name,
        });

        
        marker.addListener('click', function () {

            stationNameCell.innerHTML = station.name;
            availabilityCell.innerHTML = "Available bikes: " + station.bike_stands;
        });
    });
}

const apiKey = '{YOUR API KEY HERE}';
const apiUrl = 'http://api.openweathermap.org/data/2.5/weather?q=Dublin,IE&appid={YOUR API KEY HERE}';

window.onload = function getWeather() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp_div');
    tempDivInfo.innerHTML = '';

    const temperature = Math.round(data.main.temp - 273.15);
    const temperatureHTML = `
        <p>${temperature}°C</p>
    `;
    tempDivInfo.innerHTML = temperatureHTML;

    const weatherCell = document.querySelector('.table_container table tr:nth-child(2) td');
    weatherCell.innerHTML = `${temperature}°C`;
}