var config = {
    apiKey: "AIzaSyCPrwMPsv9FTGbtUsqKkVHW6MEzLt7jLb4",
    authDomain: "traindetails-76422.firebaseapp.com",
    databaseURL: "https://traindetails-76422.firebaseio.com",
    projectId: "traindetails-76422",
    storageBucket: "traindetails-76422.appspot.com",
    messagingSenderId: "915753872712"
};
firebase.initializeApp(config);
// Create a variable to reference the database.
var database = firebase.database();
//initialize
var train_name = '';
var destination = '';
var time = 0;
var frequency = 0;
// Capture Button Click
$("#btn").on("click", function (event) {
    event.preventDefault();
    console.log("hi");
    // Grabbed values from text boxes
    train_name = $("#train_name").val().trim();
    destination = $("#destination").val().trim();
    var time = $("#time").val();
    var frequency = $("#frequency").val();
    //this will prevent page from submitting an empty form
    if ($.trim($("#destination").val()) === "" || $.trim($("#train_name").val()) === "" || $.trim($("#time").val()) === "" || $.trim($("#frequency").val()) === "") {
        alert('You did not fill out one or more of the fields');
        return false;
    }
    database.ref().push({
        Train_name: train_name,
        Destination: destination,
        Time: time,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});
database.ref().orderByChild("dateAdded").on("child_added", function (snapshot) {
    var sv = snapshot.val();
    ///math
    console.log(sv.frequency);
    console.log(sv.Time);
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(sv.Time, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);
    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    // Time apart (remainder)
    var tRemainder = diffTime % sv.frequency;
    console.log(tRemainder);
    // Minute Until Train
    var tMinutesTillTrain = sv.frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    var row = $("<tr>");
    row.attr('id', "id");
    row.append($("<td>").text(sv.Train_name));
    row.append($("<td>").text(sv.Destination));
    row.append($("<td>").text(sv.frequency));
    row.append($("<td>").text(moment(nextTrain).format('LT')));
    row.append($("<td>").text(tMinutesTillTrain));
    $("#table").append(row);
    //this step clears the text field after inputting to the screen and databse
    $("#train_name").val('');
    $("#destination").val('');
    $("#time").val('');
    $("#frequency").val('');
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});










