const pArea = document.querySelector("#pArea");
const startBtn = document.querySelector("#startBtn");
const resetBtn = document.querySelector("#resetBtn");
const scoreParagraph = document.getElementById("scoreParagraph")
const score = document.getElementById("score")
const highscores = document.getElementById("highscores")
const questionArray = ['Where is Cypress Hall?','Where is Sierra Hall','Where is Live Oak Hall?','Where is the Sierra Quad?','Where is Sequoia Hall?'];
const results = ['That is the correct location', 'That is the wrong location'];

//array to hold the boundaries
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

// Retrieve score from local storage
let leaderboardArr = (window.localStorage.getItem("leaderboard"))
if (leaderboardArr === null || leaderboardArr === undefined) {
    leaderboardArr = []
} else {
    leaderboardArr = JSON.parse(leaderboardArr)
}

// Refreshes the leaderboard html
refreshHtmlLeaderboard()

let isStarted = false;
let textHTML = `<p>${questionArray[0]}</p>`;

// position coordinates
let latitude = null;
let longitude = null;    

// stores user answers
let answers = [];  

// rectangle colors
const colorArrayrray = ['red','green'];

// count number of clicks
let counter = 0;   

// number of correct guess
let correctAmt = 0;

// Event listener for starting button
startBtn.addEventListener('click', startOnClick)
function startOnClick() {
    isStarted = true;
    document.getElementById("startBtn").style.display = "none";
    pArea.innerHTML = textHTML;
    initMap()
}
// Event listener for reset button
resetBtn.addEventListener('click', resetOnClick)
function resetOnClick() {
    isStarted = false;
    document.getElementById("resetBtn").style.display = "none";
    counter = 0;
    answers = []
    textHTML = `<p>${questionArray[0]}</p>`;
    pArea.innerHTML = ''
    document.getElementById("startBtn").style.display = "inline-block";
    scoreParagraph.style.display = "none"
    score.style.display = "none"
    correctAmt = 0;
    initMap()
}

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

    // Set rectangle locations
    const cypressHall = new google.maps.Rectangle({ bounds: boundsArray[0] }); 
    const sierraHall = new google.maps.Rectangle({ bounds: boundsArray[1] }); 
    const liveOak = new google.maps.Rectangle({ bounds: boundsArray[2] }); 
    const sierraQuad = new google.maps.Rectangle({ bounds: boundsArray[3] });  
    const sequoiaHall = new google.maps.Rectangle({ bounds: boundsArray[4] });    

    // remove listener passed 5 iterations
    if (counter >=5){
        google.maps.event.removeListener(doubleClickListener1);
    }
    
    let doubleClickListener1;
    if (isStarted) {
        doubleClickListener1 = google.maps.event.addListener(map, "dblclick", createCircle)
    }

    // listen to user double clicks inside map and create circles at click location
    function createCircle (userClick) {
        latitude = userClick.latLng.lat();
        longitude = userClick.latLng.lng();

        // create circle
        new google.maps.Circle({
            strokeColor: "#ff726f",
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: "#ff726f",
            fillOpacity: 0.75,
            map,
            center: new google.maps.LatLng(latitude,longitude),
            radius: 10
        });
    }
    
    // array to modify answer <p> tags
    const colorArray = [2,4,6,8,10];   
    let doubleClickListener2;

    if (isStarted) {
        doubleClickListener2 = google.maps.event.addListener(map , "dblclick", isWithinRectangle);
    }

    function isWithinRectangle () {
        
        // remove listener if user clicked 5 times
        if (counter >=4) {
            google.maps.event.removeListener(doubleClickListener1);
        }    
            
        if (counter >=4) {
            google.maps.event.removeListener(doubleClickListener2);
        }    
        
        // point holds object with position where user clicked
        const point = new google.maps.LatLng(latitude, longitude);
        
        // use the correct rectangle boundaries for location
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

        // if user clicked correctly, update questions and show green rectangle
        if (isWithinRectangle){
            correctAmt++;

            // if not last question, store result and load next question
            if (counter != 4) {
                textHTML += `<p>${results[0]}</p><p>${questionArray[counter+1]}</p>`;
            } 
            
            // if last question, store result 
            else{
                textHTML += `<p>${results[0]}</p>`;
                document.getElementById("resetBtn").style.display = "inline-block"
                scoreParagraph.style.display = "block"
                score.style.display = "block"
                score.innerHTML = correctAmt;
                updateScores(correctAmt)
            }
            
            pArea.innerHTML = textHTML;  
            answers.push('#84df82');

            for (let i = 0; i < answers.length; i++) {
                pArea.querySelector("p:nth-child(" + colorArray[i] + ")").style.backgroundColor = answers[i];
            } 

            // create a green rectangle for the location the user correctly guessed
            new google.maps.Rectangle({
                strokeColor: colorArrayrray[1],
                strokeOpacity: 1,
                strokeWeight: 2,
                fillOpacity: 0.40,
                fillColor: colorArrayrray[1],
                map,
                bounds: boundsArray[counter],
            });
        }
    
        // if user clicked incorrectly, update questions and show red rectangle
        else {

            // if not last question, store result and load next question
            if (counter != 4) {
                textHTML += `<p>${results[1]}</p><p>${questionArray[counter+1]}</p>`;
            } 
            
            // if last question, store result 
            else {
                textHTML += `<p>${results[1]}</p>`;
                document.getElementById("resetBtn").style.display = "inline-block"
                scoreParagraph.style.display = "block"
                score.style.display = "block"
                score.innerHTML = correctAmt;
                updateScores(correctAmt)
            }

            pArea.innerHTML = textHTML;
            answers.push('#DF8289');

            for (let i = 0; i < answers.length; i++){
                pArea.querySelector("p:nth-child(" + colorArray[i] + ")").style.backgroundColor = answers[i];
            }

            // create a red rectangle for the location the user incorrectly guessed
            new google.maps.Rectangle({
                strokeColor: colorArrayrray[0],
                strokeOpacity: 1,
                strokeWeight: 2,
                fillOpacity: 0.40,
                fillColor: colorArrayrray[0],
                map,
                bounds: boundsArray[counter],
            });
        } 
        
        // Increase user clicks
        counter++; 

    }      
}

// Update Leaderboard
function updateScores (correctAmt) {
    if (correctAmt > leaderboardArr[0] || leaderboardArr[0] === undefined)
        leaderboardArr.splice(0, 0, correctAmt)
        
    else if (correctAmt > leaderboardArr[1] || leaderboardArr[1] === undefined)
        leaderboardArr.splice(1, 0, correctAmt)
    
    else if (correctAmt > leaderboardArr[2] || leaderboardArr[2] === undefined)
        leaderboardArr.splice(2, 0, correctAmt)
    
    if (leaderboardArr.length > 3)
        leaderboardArr.splice(3)

    window.localStorage.setItem("leaderboard", JSON.stringify(leaderboardArr))
    refreshHtmlLeaderboard();
}

// Update Leaderboard html
function refreshHtmlLeaderboard () {
    highscores.innerHTML = ''

    // Add stored scores to page
    leaderboardArr.forEach(score => {
        highscores.innerHTML += `<p class="score">${score}</p>`
    })
}
