// Init the map
function initMap() {
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("autocomplete"),
    {
      types: ["geocode"],
    }
  );

  autocomplete.addListener("place_changed", searchNearbyPlaces);
}

//Search for the nearby places based on the location input
function searchNearbyPlaces() {
  document.getElementById("table_places").innerHTML = "";

  var place = autocomplete.getPlace();
  console.log("Infos do Local");
  console.log(place);

  //Focus the map in the center
  map = new google.maps.Map(document.getElementById("map"), {
    center: place.geometry.location,
    zoom: 15,
  });

  //Defines the radius for the search
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(
    {
      location: place.geometry.location,
      radius: "700",
      type: [document.getElementById("type").value],
    },
    callback
  );
  var select = document.getElementById("type");
  select.addEventListener("change", searchNearbyPlaces);
}

//Callback of the search
function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    console.log("Numero de Locais: " + results.length);
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  } else {
    alert("Nenhum resultado encontrado!");
  }
}

//Creates a marken on the map
function createMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
  });

  //The content shown when the marker is clicked
  var conteudo = `<div class='info_map_window'>
                      <span>${place.name}</span><br>
                      ${place.vicinity}<br><br>
                      <a href="https://www.google.com.br/maps/place/${place.vicinity}" target="_blank">Ver no Google Maps</a>
                    </div>`;

  //Size of the window that opens when the marker is clicked
  var infowindow = new google.maps.InfoWindow({
    content: conteudo,
    maxWidth: 180,
  });

  //Display the information from the map in a table, with more visible detais and images
  google.maps.event.addListener(marker, "click", function () {
    infowindow.open(map, this);
  });
  console.log(place);
  var table = document.getElementById("table_places");
  var row = table.insertRow();
  var cell1 = row.insertCell(0);
  document.getElementById("map").style.display = "block"; //Keeps the scrool bars from displaying on the side
  document.getElementById("table_places").style.display = "table"; //Keeps the scrool bars from displaying on the side
  cell1.innerHTML = `<strong>${place.name}</strong> <br> ${place.vicinity}`;
  cell1.classList.add("infos_places");
  if (place.photos) {
    let photoUrl = place.photos[0].getUrl();
    let cell2 = row.insertCell(1);
    cell2.classList.add("img_places");
    cell2.innerHTML = `<img width='100' height='100' src='${photoUrl}'>`;
  } else {
    let photoUrl = "./images/table_img_default.png";
    let cell2 = row.insertCell(1);
    cell2.classList.add("img_places");
    cell2.innerHTML = `<img width='100' height='100' src='${photoUrl}'>`;
  }
}
