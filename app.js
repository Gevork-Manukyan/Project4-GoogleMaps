var qandA = document.querySelector(".questions");
var questionArray = ['Where is the Matador statue?','Where is The Klotz Student Health Center','Where is the Matadome stadium?','Where is the Chicano House Building?','Where is the Sierra Tower?'];
var results = ['That is the correct location', 'Wrong, that was the not the correct location'];
//array to hold the 5 boundaries for the rectangles.
var boundsArray = [{
      north: 34.24006,
      south: 34.23976,
      east: -118.52760,
      west: -118.52804,},
      {north: 34.23847,
      south: 34.23785,
      east: -118.52591,
      west: -118.52669,
      },{
      north: 34.24255,
      south: 34.24131,
      east: -118.52535,
      west: -118.52682,
    },{
      north: 34.24272,
      south: 34.24240,
      east: -118.52976,
      west: -118.53032,
    },{
      north: 34.23915,
      south: 34.23848,
      east: -118.53002,
      west: -118.53035,
    }];

    var dataHTML = '';
    dataHTML += `<p>${questionArray[0]}</p>`; 

    // to hold the user position coordinates
    var latitude = null;
    var longitude = null;    

    //array to collect answers for changing css
    var answers = [];  

    //rectangle color
    var colorArray = ['red','green'];

    // Initialize and add the map
    function initMap() {

    // The location of csun for my map
    const csun = { lat: 34.238539355423484, lng: -118.52883183524906 };

    // The map, centered at CSUN
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
        center: csun,
        gestureHandling: "none",

        //disables the ability to zoom into street view
        zoomControl: false,

        //disables the satellite and street view options
        streetViewControl: false,

        //google's style allows us to change the way google map style
        //using json code from google's styling wizard  
        disableDefaultUI: true,
        styles: [
        {
            "elementType": "labels",
            "stylers": [
            {
                "visibility": "off"
            }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "stylers": [
            {
                "visibility": "off"
            }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "stylers": [
            {
                "visibility": "off"
            }
            ]
        }
        ]
        
    });

    //rectangles with appropriate boundaries to be able to use the getBounds() method 
    //for the comparison to see if user click is within its boundaries 
    mataStatue = new google.maps.Rectangle({ bounds: boundsArray[0] }); 
    klotz = new google.maps.Rectangle({ bounds: boundsArray[1] }); 
    matadome = new google.maps.Rectangle({ bounds: boundsArray[2] }); 
    chicano = new google.maps.Rectangle({ bounds: boundsArray[3] });  
    sTower = new google.maps.Rectangle({ bounds: boundsArray[4] });    

    //remove listener passed 5 iterations
    if (counter >=5){
        google.maps.event.removeListener(listener1);
    }
    
    //listen to user double clicks inside map and run the immedialely invoked function expression 
    var listener1 = google.maps.event.addListener(map, "dblclick", function (userClick) {
    
    //hold latitude and longituge when user clicks inside map
      latitude = userClick.latLng.lat();
      longitude = userClick.latLng.lng();
  
    //create circle when user clicks anywhere on map
     var cityCircle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.1,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map,
      center: new google.maps.LatLng(latitude,longitude),
      radius: 25
    });
    
    //will run every 100 milliseconds; gets the fill opacity of circle and reduces its opacity by 0.05
    setInterval(function() {
        cityCircle.set("fillOpacity",cityCircle.get("fillOpacity")-0.05);
    }, 100);

    //setTimout runs once after 500 milliseconds and nullifies the circle so its no longer seen
    setTimeout(function() {
            ityCircle.setMap(null);
        }, 500);
    }); //end addListener   

    //create counter variable for each time user clicks inside map     
    var counter = 0;   
    
    //array to use to modify the even p tags content in a for loop and using queryselector appr.line 171
    var colorA = [2,4,6,8,10];   
    
    //var answerBlue = 0;
    var listener2 = google.maps.event.addListener(map , "dblclick", isWithinRectangle);

    function isWithinRectangle(){
        // remove listeners if passed the 5 iterations
            
        if (counter >=4) {
            google.maps.event.removeListener(listener1);
        }    
            
        if (counter >=4) {
            google.maps.event.removeListener(listener2);
        }    
        
        //point holds object with position where user clicks
        var point = new google.maps.LatLng(latitude.toFixed(5),longitude.toFixed(5));
        
        //use the correct rectangle boundaries for each iteration.
        if (counter == 0){
            var isWithinRectangle = mataStatue.getBounds().contains(point);
        }
        if (counter == 1){
            var isWithinRectangle = klotz.getBounds().contains(point);
        }
        if (counter == 2){
            var isWithinRectangle = matadome.getBounds().contains(point);
        }
        if (counter == 3){
            var isWithinRectangle = chicano.getBounds().contains(point);
        }
        if (counter == 4){
            var isWithinRectangle = sTower.getBounds().contains(point);
        }

        if (isWithinRectangle){
            //if it isnt last question then store the result and the next question in variable dataHTML
            if (counter != 4) {
                // back ticks are needed else it doesnt work to interpolate the array 
                dataHTML += `<p>${results[0]}</p><p>${questionArray[counter+1]}</p>`;
                //if its the last question store the result of that question    
            } else{
                dataHTML += `<p>${results[0]}</p>`;
            }
            
            //display the data
            qandA.innerHTML = dataHTML;  

            // push the color to the end of the array
            answers.push('#90EE90');

            //modify background color for the results 
            for (let c=0; c < answers.length; c++) {
                document.querySelector("p:nth-child("+colorA[c]+")").style.backgroundColor = answers[c];
            } 

            //create a rectangle with green color after user clicks from the predefined bounds for this iteration
            let rectangle7 = new google.maps.Rectangle({
                strokeColor: colorArray[1],
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: colorArray[1],
                fillOpacity: 0.35,
                map,
                bounds: boundsArray[counter],
            });
        }
     
        //if user didnt click inside bounds then change result in the dataHTML variable then display and make rectangle red
        else {
           if (counter != 4) {
                dataHTML += `<p>${results[1]}</p><p>${questionArray[counter+1]}</p>`;
            } else {
                dataHTML += `<p>${results[1]}</p>`;
            }
            //display the data
            qandA.innerHTML = dataHTML;
            answers.push('#FA8072');

            for (let c=0; c < answers.length; c++){
                document.querySelector("p:nth-child("+colorA[c]+")").style.backgroundColor = answers[c];
            }

            let rectangle7 = new google.maps.Rectangle({
                strokeColor: colorArray[0],
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: colorArray[0],
                fillOpacity: 0.35,
                map,
                bounds: boundsArray[counter],
            });
        } 
      //add one every time user clicks 
     counter++; 
  } //ends isWithinRectangle()
      
}   //ends initMap()