$( document ).ready(function() {

    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyBTplXP1nVWYy9OPD588_G1L1Lq9NJwa54",
      authDomain: "trains-d209e.firebaseapp.com",
      databaseURL: "https://trains-d209e.firebaseio.com",
      projectId: "trains-d209e",
      storageBucket: "",
      messagingSenderId: "95686857107"
    };

    firebase.initializeApp(config);
    var database = firebase.database();

    
    // initialize time options, variables
    for (var i = 0; i < 24; i++) {
        $("#train-time-hr").append("<option>" + i);
    }
    
    for (var j = 0; j < 60; j++) {
        $("#train-time-min").append("<option>" + j);
    }

    var trainName = "";
    var destination = "";
    var frequency = "";
    var trainHr = "";
    var trainMin = "";
    var trainTime = "";

    
    //sumbit button action, firebase store
    $("#submit").click(function(event){

		// from form values to variables
		trainName = $("#train-name").val().trim();
		destination = $("#destination").val().trim();
        frequency = parseInt($("#frequency").val().trim());
        trainTimeHr = $("#train-time-hr").val().trim();
        trainTimeMin = $("#train-time-min").val().trim();
        trainTime = trainTimeHr + ":" + trainTimeMin;
        

		// make object to push to Firebase
		var trainInfo = {
			name:  trainName,
			destination: destination,
            trainTime: trainTime,
            frequency: frequency
		};
		database.ref().push(trainInfo);

	//	console.log("train name: " + trainInfo.name);
	//	console.log("train destination: " + trainInfo.destination); 
	//	console.log("train time: " + trainInfo.trainTime );
	//	console.log("train freq: " + trainInfo.frequency);

		// clear text-boxes
		$("#train-name").val("");
		$("#destination").val("");
	    $("#frequency").val("");

		// stop refresh
		return false;
	});



    database.ref().on("child_added", function(snapshot){

		// assign firebase variables to snapshots.
		var fireName = snapshot.val().name;
		var fireDestination = snapshot.val().destination;
		var fireFrequency = snapshot.val().frequency;
        var fireTrainTime = snapshot.val().trainTime;


         // time calculation
        var fireTrainTimeConverted = moment(fireTrainTime, "h:mm").subtract(1, "years");
        var differenceTime = moment().diff(moment(fireTrainTimeConverted), "minutes");
        var minutesPassed = differenceTime % fireFrequency;
        var minutesAway = fireFrequency - minutesPassed;
        var nextTrain = moment().add(minutesAway, "minutes").format("hh:mm");

        // Append train data to table 
        $("#schedule_list").append("<tr><td>" + fireName + "</td><td>" + fireDestination + "</td><td>" + fireFrequency + "</td><td>"
         + nextTrain + "</td><td>" + minutesAway +"</td></tr>" );


//		$("#schedule_list").append("<tr><td>" + fireName + "</td><td>" + fireDestination + "</td><td>" + fireFrequency + "</td><td>" + nextTrain + "</td><td>" + remainTime + "</td></tr>");
//
	});

})