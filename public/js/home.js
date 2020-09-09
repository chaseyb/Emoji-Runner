$(document).ready(function () {
  //calls loadPoints on load
  loadUserData();

  //executes if a runner is bought
  $(".buy").on("click", function () {
    var currentPoints = $("#runner-points").text();
    var cost = $(this).attr("cost");
    if (currentPoints - cost < 0) {
      alert("Insufficent runner Tokens");
    } else {
      var boughtrunner = {
        name: $(this).attr("name"),
        link: $(this).attr("link"),
        lvl: $(this).attr("lvl"),
        UserId: $(this).attr("UserId")
      };

      //now that we have all the data, send a post to the database
      $.ajax("/api/user/id", {
        type: "POST",
        data: boughtrunner
      }).then(function (data) {
        var newPoints = {
          points: currentPoints - cost
        };

        $.ajax("/api/user/id", {
          type: "PUT",
          data: newPoints
        }).then(function (data) {
          $("#runner-points").text(data.points);
          location.reload();
        });
      });
    }
  });

  function loadUserData() {
    $.ajax("/api/user/id", {
      type: "GET"
    }).then(function (user) {
      //this needs to be an array because that is what is returned
      //gives data to the points section
      $("#runner-points").text(user[0].points);

      //give foreign key to all buttons
      $(".buy").attr("UserId", user[0].id);

      //put the id in the purchased nav
    });
  }

  //refreshes the submit button so it filters out the runners based on the runner lvl
  $("#refreshButton").on("click", function (e) {
    e.preventDefault();

    var lvl = $("input[name=exampleRadios1]:checked").val();

    window.location.assign(`/home/${lvl}`);
  });
});










