// Userlist data array for filling in info box
var questionsData = [];
var checked = [];
var totalCorrect = 0; 
var totalQuestions = 0;

// DOM READY
$(document).ready(function() {
  // Populate the user table on initial page load
  populateTable();

  $('#testQuestion').hide();
  $('#quiz').hide();

  // Show Sample question when "btnSample" is clicked
  $('#btnSample').on('click', showSample);

  // Start QUIZ  when "btnStart" is clicked
  $('#btnStart').on('click', showQuiz);

  // Get Results from the Quiz
  $('#submitQuiz').on('click', showResults);

  // Static Question Testing
  $('#testQuestion').on('click', getAnswer);

  // Check Answer for the Test question displayed
  $('#btnAnswer').on('click', showAnswer);
  
  // Add User Question on button click
  $('#btnAddQuestion').on('click', addQuestion);

});

// FUNCTIONS

// Show view for Sample Quiz only
function showSample() {
  $('#testQuestion').show();
  $('#answer').hide();
  $( ".optionsRadios1" ).attr("disabled",false);
  $('#quiz').hide();
}

// Show Quiz view and hide Sample Quiz
function showQuiz() {
  $('#testQuestion').hide();
  $('#quiz').show();
  $( ".optionsRadios" ).attr("disabled",false);
  $('#results').hide();
  $('#score').hide();
}

// To fill HTML table with questions data
function populateTable() {
  // Empty content string
  var tableContent = ' ';
  // jQuery AJAX call for JSON
  $.getJSON( '/users/questions', function( data ) {
    // Stick our user data array into a questions variable in the global object
    questionsData = data;
    //Populating the Quiz from db
    populateQuiz(questionsData);

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><span id="question">' + this.question + '</span></td>';
      tableContent += '<td><span id="optionA">' + this.optionA + '</span></td>';
      tableContent += '<td><span id="optionB">' + this.optionB + '</span></td>';
      tableContent += '<td><span id="optionC">' + this.optionC + '</span></td>';
      tableContent += '<td><span id="optionD">' + this.optionD + '</span></td>';
      tableContent += '</tr>';
    });
    // Inject the whole content string into our existing HTML table
    $('#questions table tbody').html(tableContent);
  });
}

// Fetch mondodb questions to build Quiz
function populateQuiz(data){
  console.log("Quiz data from db: ", data);
  totalQuestions = data.length;
  $( "#totalQuestions" ).html(totalQuestions);

  // First Record from db
  $( "#quizQuestions" ).html(data[0].question);
  $( "#optionA" ).html(data[0].optionA);
  $( "#optionB" ).html(data[0].optionB);
  $( "#optionC" ).html(data[0].optionC);
  $( "#optionD" ).html(data[0].optionD);
  $('#TextBox').html(data[0].correct);
  $( ".optionsRadios" ).attr("checked",false);
  //console.log("clciked: ",$( ".optionsRadios" ));
  var currentRecord = [];
  currentRecord.id = data[0]._id;
  currentRecord.correct = data[0].correct;

  $(".optionsRadios").click(function(ele){

    if(!checked.includes(ele)){
      // console.log("ele: ",ele);
      var selectedOption = ele.target.value;
      var selectedValue = ele.target.nextSibling.innerHTML;

      //storing all the answers (selected by user) with correct answers & id from db
      currentRecord.selectedOption = selectedOption;
      currentRecord.selectedValue = selectedValue;
      checked.push(currentRecord);
    }

  });

    var c = 1; // Counter for NEXT Question
    // All other records fron db upon Clicking NEXT
    $("#nextQuestion").click(function(done){
      if(c < data.length ){
        currentRecord = [];
        $( ".optionsRadios" ).attr("checked",false);
        $( "#quizQuestions" ).html(data[c].question);
        $( "#optionA" ).html(data[c].optionA);
        $( "#optionB" ).html(data[c].optionB);
        $( "#optionC" ).html(data[c].optionC);
        $( "#optionD" ).html(data[c].optionD);
        $('#TextBox').html(data[c].correct);

        currentRecord.id = data[c]._id;
        currentRecord.correct = data[c].correct;
 
        c++;  
      } else {
        // hide NEXT button and show RESULT Button
        $('#nextQuestion').hide();
        $('#submitQuiz').show();
      }
    });
} 

// To Show the results after QUIZ
function showResults(event) {

  $( ".optionsRadios" ).attr("disabled",true);

  totalCorrect = 0;

  if(checked){
    checked.forEach(function(ele){
      if((ele.correct == ele.selectedValue) || (ele.correct == ele.selectedOption)){
        totalCorrect++;
      }
    });
    
    $("#results").show(1000);
    $("#results").html("<h1>Your Results!</h1>");
    $("#score").show(1000);

    //Color change of the results div
    if(totalCorrect !=0 && (totalCorrect >= (totalQuestions/2))){
      $("#score").css("backgroundColor", "lightgreen"); 
    }  else {
      $("#score").css("color", "red");
    }
    //Final score values
    var result = "Correct Answers: " + totalCorrect + " out of " + totalQuestions;
    $('#score').html(result);

  }
}

// To Add Custom Question that current User has inputted
function addQuestion(event) {
  event.preventDefault();
  // Validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addQuestion input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {
    // If it is, compile all questions
    var newQuestion = {
      'question': $('#addQuestion fieldset input#question').val(),
      'optionA':  $('#addQuestion fieldset input#optionA').val(),
      'optionB':  $('#addQuestion fieldset input#optionB').val(),
      'optionC':  $('#addQuestion fieldset input#optionC').val(),
      'optionD':  $('#addQuestion fieldset input#optionD').val(),
      'correct':  $('#addQuestion fieldset input#inputCorrect').val()
    };

    // Use AJAX to post the object to our newQuestion service
    // View all the question details as JSON 
    $.ajax({
      type: 'POST',
      data: newQuestion,
      url: '/users/addQuestion', // http://localhost:3000/users/addQuestion
      dataType: 'JSON'
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {
        // Clear the form inputs
        $('#addQuestion fieldset input').val('');
        // Update the table
        populateTable();
      }
      else {
        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);
      }
    });
  }
  else {
    // If errorCount is more than 0, error out
    alert('Please fill in all the fields');
    return false;
  }
}

function getAnswer(selected) {
  checked.answer = selected.target.value;
}

// To Show the Correct / Incorrect answer from the user's chosen option
function showAnswer(event) {
  $( ".optionsRadios1" ).attr("disabled",true);
  // display #answer block
  event.currentTarget.parentNode.nextSibling.style.display = "block"; 
  
  if (checked.answer === "optionB") {
    event.currentTarget.parentNode.nextSibling.style.backgroundColor = "green";
    event.currentTarget.parentNode.nextSibling.innerHTML = "Correct Answer";
  }
  else {
    event.currentTarget.parentNode.nextSibling.style.backgroundColor = "red";
    event.currentTarget.parentNode.nextSibling.innerHTML = "Incorrect Answer";

  }

}

