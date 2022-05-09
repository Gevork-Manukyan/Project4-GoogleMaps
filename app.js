const qandA = document.querySelector(".questions");
const questionArray = ['Where is Cypress Hall?','Where is Sierra Hall','Where is Live Oak Hall?','Where is the Sierra Quad?','Where is Sequoia Hall?'];
const results = ['That is the correct location', 'Wrong, that was the not the correct location'];

//array to hold the 5 boundaries for the rectangles.
const boundsArray = [
    {
        // Cypress Hall
        north: 34.23604209328175,
        south: 34.236700640979436,
        east: -118.52930687953804,
        west: -118.53007310918174,
    },
    {
        // Sierra Hall
        north: 34.238113187747075,
        south: 34.238441362243115,
        east: -118.53005880181061,
        west: -118.53137308412114,
    },
    {
        // Live Oak Hall
        north: 34.23818857929854,
        south: 34.2383748404892,
        east: -118.52766090714607,
        west: -118.52877670600563,
    },
    {
        // Sierra Quad
        north: 34.23790918673989,
        south: 34.23910657689143,
        east: -118.52894300295104,
        west: -118.52965110607346,
    },
    {
        // Sequoia Hall
        north: 34.24016647473023,
        south: 34.24077402520013,
        east: -118.52760189855121,
        west: -118.52842265444309,
    }
];

let dataHTML = '';
dataHTML += `<p>${questionArray[0]}</p>`; 

// position coordinates
let latitude = null;
let longitude = null;    

// stores user answers
const answers = [];  

// rectangle colors
const colorArray = ['red','green'];

// Initialize and add the map
function initMap() {

    // Location of csun
    const csun = { lat: 34.238539355423484, lng: -118.52883183524906 };

    // Map centered at CSUN
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

    //Set rectangle locations
    cypressHall = new google.maps.Rectangle({ bounds: boundsArray[0] }); 
    sierraHall = new google.maps.Rectangle({ bounds: boundsArray[1] }); 
    liveOak = new google.maps.Rectangle({ bounds: boundsArray[2] }); 
    sierraQuad = new google.maps.Rectangle({ bounds: boundsArray[3] });  
    sequoiaHall = new google.maps.Rectangle({ bounds: boundsArray[4] });    

    //remove listener passed 5 iterations
    if (counter >=5){
        google.maps.event.removeListener(doubleClickListener1);
    }
    
    //listen to user double clicks inside map and run the immedialely invoked function expression 
    const doubleClickListener1 = google.maps.event.addListener(map, "dblclick", function (userClick) {
    
        //hold latitude and longituge when user clicks inside map
        latitude = userClick.latLng.lat();
        longitude = userClick.latLng.lng();

        //create circle when user clicks anywhere on map
        const cityCircle = new google.maps.Circle({
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
    });

    //create counter variable for each time user clicks inside map     
    let counter = 0;   
    
    //array to use to modify the even p tags content in a for loop and using queryselector appr.line 171
    const colorA = [2,4,6,8,10];   
    
    //var answerBlue = 0;
    const doubleClickListener2 = google.maps.event.addListener(map , "dblclick", isWithinRectangle);

    function isWithinRectangle(){
        
        // remove listeners if passed the 5 iterations
        if (counter >=4) {
            google.maps.event.removeListener(doubleClickListener1);
        }    
            
        if (counter >=4) {
            google.maps.event.removeListener(doubleClickListener2);
        }    
        
        //point holds object with position where user clicks
        const point = new google.maps.LatLng(latitude.toFixed(5),longitude.toFixed(5));
        
        //use the correct rectangle boundaries for each iteration.
        if (counter == 0){
            const isWithinRectangle = cypressHall.getBounds().contains(point);
        }
        if (counter == 1){
            const isWithinRectangle = sierraHall.getBounds().contains(point);
        }
        if (counter == 2){
            const isWithinRectangle = liveOak.getBounds().contains(point);
        }
        if (counter == 3){
            const isWithinRectangle = sierraQuad.getBounds().contains(point);
        }
        if (counter == 4){
            const isWithinRectangle = sequoiaHall.getBounds().contains(point);
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
            for (let i = 0; i < answers.length; i++) {
                document.querySelector("p:nth-child(" + colorA[i] + ")").style.backgroundColor = answers[i];
            } 

            //create a rectangle with green color after user clicks from the predefined bounds for this iteration
            const rectangle7 = new google.maps.Rectangle({
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

            for (let i = 0; i < answers.length; i++){
                document.querySelector("p:nth-child(" + colorA[i] + ")").style.backgroundColor = answers[i];
            }

            const rectangle7 = new google.maps.Rectangle({
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

    }      
}   