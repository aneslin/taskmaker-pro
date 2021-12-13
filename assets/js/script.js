var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }
//sortable
$(".card .list-group").sortable({
  connectWith: $(".card .list-group"),
  scroll: false,
  tolerance: "pointer",
  helper: "clone",
  
  activate: function(event) {
    console.log("activate", this);
  },
  deactivate: function(event) {
    console.log("deactivate", this);
  },
  over: function(event) {
    console.log("over", event.target);
  },
  out: function(event) {
    console.log("out", event.target);
  },
 
  update: function(event) {
var tempArr = []
    $(this).children().each(function(){
     var text = $(this)
     .find("p")
     .text()
     .trim();

     var date = $(this)
     .find("span")
     .text()
     .trim();
  tempArr.push({
    text:text,
    date: date
  });

  });
  var arrName = $(this)
    .attr("id")
    .replace("list-", '');

  tasks[arrName] = tempArr;
  saveTasks();
  console.log(tempArr);
  }
})
  


  // loop over object properties
  $.each(tasks, function(list, arr) {

    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));

};

// edit a task text area and focus
$(".list-group").on("click", "p" ,function(){
  var text = $(this).text();
  var textInput = $("<textarea>")
  .addClass("form-control")
  .val(text);
  $(this).replaceWith(textInput);
  textInput.trigger("focus");

});
// saved edited task
$(".list-group").on("blur", "textarea", function(){
  //get current textare value
var text = $(this)
.val()
.trim()
//get parent ul attribute
var status = $(this)
  .closest(".list-group")
  .attr("id")
  .replace("list-", "");

  // get task position
  var index = $(this)
    .closest(".list-group-item")
    .index();
    //assemble new task
tasks[status][index] = text;
saveTasks();
//recreate p element
var taskP = $("<p>")
  .addClass("m-1")
  .text(text);

  //replace text areas with p element
  $(this).replaceWith(taskP);

})


// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


