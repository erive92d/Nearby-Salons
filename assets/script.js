var apikeytomtom = "1BbnSjqoZvKrjDwXwmAFFUzKxYScA9hG";
var submitEl = document.querySelector(".button");



var containerSearch = document.querySelector(".control");
var mapEl = document.querySelector('.map')
var mainContainer = document.querySelector('.main-container')

//CURRENT LOCATION
var catLat;
var catLon;

//SALON INFOS
var salonName;
var salonLat;
var salonLon;
var address; //FOR FUTURE USE
var phone;
//autoCOMPLETE
var cardContainer = document.querySelector('.card-container')

function createInfos(name,address,phone) {
  // mainContainer.setAttribute('style','background:red;')
 
  console.log(address)
  var salonCard = document.createElement('div')
  
  salonCard.classList.add('salon-card')
  var salonName = document.createElement('a')
  salonName.classList.add('salon-name')
  salonName.href=`http://www.google.com/search?q=${name}`
  salonName.target = '__blank'
  var salonAddress = document.createElement('a')
  salonAddress.classList.add('salon-address')
  salonAddress.href=`https://www.google.com/maps/search/${address}/`
  salonAddress.target='__blank'
  var salonPhone = document.createElement('p')
  salonName.textContent = name
  salonAddress.textContent = address
  if(phone === undefined) {
    salonPhone.textContent = 'N/A'
  } else {
  salonPhone.textContent = phone
  }
  salonCard.append(salonName,salonAddress,salonPhone)
  cardContainer.append(salonCard)
}


var options = {
  searchOptions: {
    key: "1BbnSjqoZvKrjDwXwmAFFUzKxYScA9hG",
    language: "en-US",
    countrySet: "US",
    limit: 5,
   
  },
  autocompleteOptions: {
    key: "1BbnSjqoZvKrjDwXwmAFFUzKxYScA9hG",
    language: "en-US",
  },
};


//CLICKING THE SALON NAMES ON MAP



//SEARCH BAR  - STARTS HERE
var ttSearchBox = new tt.plugins.SearchBox(tt.services, options);
var searchBoxHTML = ttSearchBox.getSearchBoxHTML();
containerSearch.append(searchBoxHTML);

//ADDED ID INTO SEARCH BAR
$(".tt-search-box-input").attr("id", "searchInput");

$(".tt-search-box-input").attr("autocomplete", "off");





submitEl.addEventListener("click", function () {
  gettingLocation();
});

//2ND
function gettingLocation() {
  var labelText = $(".tt-searchbox-filter-label__text")[0].innerText;
  var nameVal = labelText; //input from Box
  var inputVal = $("#searchInput").val(); // input from Input value

  var realVal; //We want both nameVal and inputVal in one variable
  if (inputVal === "") {
    realVal = nameVal;
  } else {
    realVal = inputVal;
  }
  console.log(realVal)
  currentLocation(realVal);
}


//LASTLY SHOWING ON THE MAP
function showMap(locate, name) {
  console.log(name);
  console.log(locate); //ALL THE LOCATIONS WE NEED
  var allLocations = []; //GATHER THEM IN PAIRS, AS OBJECT
  for (var i = 0; i < locate.length; i += 2) {
    var lng = locate[i];
    var lat = locate[i + 1];

    var map = tt.map({
      container: "map",
      key: "1BbnSjqoZvKrjDwXwmAFFUzKxYScA9hG",
      center: [catLon, catLat],
      zoom: 13,
      style:
        "https://api.tomtom.com/style/1/style/20.4.5-*/?map=basic_night&poi=poi_main",
    });
    //AFTER ITERATION, PUSH THEM IN PAIRS
    new tt.Marker().setLngLat([catLon, catLat]).addTo(map);
    allLocations.push({ lat, lng }); //
  }
  console.log(allLocations); // ALL THE LOCATIONS FOR MARKERS

  for (var i = 0; i < allLocations.length; i++) {
    new tt.Popup().setLngLat(allLocations[i]).setText(name[i]).addTo(map);
  }
 
}

//STEP3
//WE NEED TO FIND THE PLACES NEARBY THE LAT AND LON THAT WE GOT FROM PREVIOUS STEP
//WE CAN ALSO FILTER OUT WHICH PLACES WE WANT TO GET THE INFOS FROM, IN THIS CASE, ITS SALON
//CHECK OUT THE LAST PARAMETER ON LINE 69 HOW I GOT THE CATEGORY
function nearBy(lon, lat) {
  fetch(
    "https://api.tomtom.com/search/2/nearbySearch/.json?key=1BbnSjqoZvKrjDwXwmAFFUzKxYScA9hG&radius=10000&lat=" +
      lat +
      "&lon=" +
      lon +
      "&limit=5&categorySet=9361068"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var dataResult = data.results;

      var lonLat = [];
      var salonArray = [];
      cardContainer.innerHTML = '';
      for (var i = 0; i < dataResult.length; i++) {
        console.log(dataResult[i].poi);
        phone = dataResult[i].poi.phone;
        address = dataResult[i].address.freeformAddress;
        salonName = dataResult[i].poi.name;
        salonLat = dataResult[i].position.lat;
        salonLon = dataResult[i].position.lon;
        console.log(address);
        console.log(salonName);
        console.log(salonLat);
        console.log(salonLon);
        lonLat.push(salonLon, salonLat);
        salonArray.push(salonName);
        createInfos(salonName,address,phone)
      }
      console.log(salonName);

      showMap(lonLat, salonArray);
    });
}

//GEOCODING THE LOCATION WE GOT FROM STEP2, WE NEED TO GET THE LATITUDE AND LONGITUDE
function currentLocation(location) {
  fetch(
    "https://api.tomtom.com/search/2/geocode/" +
      location +
      ".json?key=1BbnSjqoZvKrjDwXwmAFFUzKxYScA9hG&countryset=US"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var results = data.results;
      catLat = results[0].position.lat; //longitude
      catLon = results[0].position.lon; //latitude
      nearBy(catLon, catLat);
      
    });
}

//API FOR CATEGORIES
// fetch('https://api.tomtom.com/search/2/poiCategories.json?key=1BbnSjqoZvKrjDwXwmAFFUzKxYScA9hG')
// .then(function(response) {
//   return response.json()
// })
// .then(function(data) {
//   console.log(data)
// })
// category()

//new autocomplete

// var myLocation = Geolocation.getCurrentPosition(success)

// console.log(myLocation)
