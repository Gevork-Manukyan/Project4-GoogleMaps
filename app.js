const qandA = document.querySelector(".questions");
const questionArray = ['Where is Cypress Hall?','Where is Sierra Hall','Where is Live Oak Hall?','Where is the Sierra Quad?','Where is Sequoia Hall?'];
const results = ['That is the correct location', 'Wrong, that was the not the correct location'];

//array to hold the 5 boundaries for the rectangles.
const boundsArray = [
    {
        // Cypress Hall
        north: 34.23670954559652,
        south: 34.23603447311616,
        east: -118.52927496547709,
        west: -118.530078770327,
    }, 
    {
        // Sierra Hall
        north: 34.23843939412626,
        south: 34.23811241328809,
        east: -118.53004049389573,
        west: -118.53137378924201,
    },
    {
        // Live Oak Hall
        north: 34.238365559854444,
        south: 34.23818624778191,
        east: -118.52761632053884,
        west: -118.52881564841013,
    },
    {
        // Sierra Quad
        north: 34.239114447323104,
        south: 34.23789618332654,
        east: -118.528936857078,
        west: -118.52965135027792,
    },
    {
        // Sequoia Hall
        north: 34.24078096176456,
        south: 34.240148112079396,
        east: -118.52760356164933,
        west: -118.5284201253064,
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

//create counter variable for each time user clicks inside map     
let counter = 0;   

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
    const cypressHall = new google.maps.Rectangle({ bounds: boundsArray[0] }); 
    const sierraHall = new google.maps.Rectangle({ bounds: boundsArray[1] }); 
    const liveOak = new google.maps.Rectangle({ bounds: boundsArray[2] }); 
    const sierraQuad = new google.maps.Rectangle({ bounds: boundsArray[3] });  
    const sequoiaHall = new google.maps.Rectangle({ bounds: boundsArray[4] });    

    //remove listener passed 5 iterations
    if (counter >=5){
        google.maps.event.removeListener(doubleClickListener1);
    }
    
    //listen to user double clicks inside map and run the immedialely invoked function expression 
    let doubleClickListener1 = google.maps.event.addListener(map, "dblclick", function (userClick) {

        //hold latitude and longituge when user clicks inside map
        latitude = userClick.latLng.lat();
        longitude = userClick.latLng.lng();

        //create circle when user clicks anywhere on map
        const cityCircle = new google.maps.Circle({
            strokeColor: "#ff726f",
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: "#ff726f",
            fillOpacity: 0.75,
            map,
            center: new google.maps.LatLng(latitude,longitude),
            radius: 15
        });
    });
    
    //array to use to modify the even p tags content in a for loop and using queryselector appr.line 171
    const colorA = [2,4,6,8,10];   
    
    let doubleClickListener2 = google.maps.event.addListener(map , "dblclick", isWithinRectangle);

    function isWithinRectangle(){
        
        // remove listeners if passed the 5 iterations
        if (counter >=4) {
            google.maps.event.removeListener(doubleClickListener1);
        }    
            
        if (counter >=4) {
            google.maps.event.removeListener(doubleClickListener2);
        }    
        
        //point holds object with position where user clicks
        const point = new google.maps.LatLng(latitude, longitude);
        
        //use the correct rectangle boundaries for each iteration.
        let isWithinRectangle
        if (counter == 0){
            isWithinRectangle = cypressHall.getBounds().contains(point);
        }
        else if (counter == 1){
            isWithinRectangle = sierraHall.getBounds().contains(point);
        }
        else if (counter == 2){
            isWithinRectangle = liveOak.getBounds().contains(point);
        }
        else if (counter == 3){
            isWithinRectangle = sierraQuad.getBounds().contains(point);
        }
        else if (counter == 4){
            isWithinRectangle = sequoiaHall.getBounds().contains(point);
        }

        if (isWithinRectangle){
            //if it isnt last question then store the result and the next question in variable dataHTML
            if (counter != 4) {
                dataHTML += `<p>${results[0]}</p><p>${questionArray[counter+1]}</p>`;
            } 
            
            //if its the last question store the result of that question    
            else{
                dataHTML += `<p>${results[0]}</p>`;
            }
            
            qandA.innerHTML = dataHTML;  
            answers.push('#90EE90');

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