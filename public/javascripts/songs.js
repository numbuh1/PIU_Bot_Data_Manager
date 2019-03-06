// Userlist data array for filling in info box
var songData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the Song table on initial page load
  populateTable();

  // Add Song button click
  $('#btnAddSong').on('click', addSong);

  // Add Chart button click
  $('#btnSubmitAddChart').on('click', addChart);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/songlist', function( songs ) {
    var htmlContent = "";
    for (var i = 0; i < songs.length; i++) {
      htmlContent += 
        '<div class="col-md-3">' +
          '<div class="panel panel-default">' +
            '<div class="panel-heading">' +
              '<b>' + songs[i].name + '</b>' +
              '<div class="btn-group pull-right"><span class="glyphicon glyphicon-edit"></span> <span class="glyphicon glyphicon-remove"></span></div>' +
            '</div>' +
            '<div class="panel-body">' +
              '<img src="' + songs[i].image + '" style="width:100%">' +
              '<hr>' +
              '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>' +
                '<div class="form-control"><span class="label label-primary">' + songs[i].artist + '</span></div>' +
              '</div>' +
              '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-music"></span></span>' +
                '<div class="form-control">' + songs[i].bpm + '</div>' +
              '</div>' +
              '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-list"></span></span>' +
                '<div class="form-control"><span class="label label-success">' + songs[i].type + '</span> <span class="label label-info">' + songs[i].category + '</span></div>' +
              '</div>' +
              '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-home"></span></span>' +
                '<div class="form-control"><span class="label label-warning">Pump It Up ' + songs[i].origin.game + '</span> <span class="label label-danger">' + songs[i].origin.version + '</span></div>' +
              '</div>' +
              '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-film"></span></span>' +
                '<div class="form-control"><span class="label label-default">' + songs[i].visualizer + '</span></div>' +
              '</div>' +
              '<div class="input-group col-md-12" style="text-align: center; margin-top: 10px">' +
                '<button class="btn btn-default pull-right" data-toggle="modal" data-target="#chartForm" onclick="showCharts(\'' + songs[i]._id.toString() + '\', \'' + songs[i].name + '\')">Charts</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    }
    $('#songContainer').html(htmlContent);
  });
};

// Add Song
function addSong(event) {
  event.preventDefault();

  // If it is, compile all user info into one object
  var newSong = {
    'songName' : $('#songName').val(),
    'artist' : $('#artist').val(),
    'bpm' : $('#bpm').val(),
    'songType' : $('#songType').val(),
    'category' : $('#category').val(),
    'originGame' : $('#originGame').val(),
    'originVersion' : $('#originVersion').val(),
    'image' : $('#image').val(),
    'visualizer' : $('#visualizer').val()
  }

  // Use AJAX to post the object to our adduser service
  $.ajax({
    type: 'POST',
    data: newSong,
    url: '/addsong',
    dataType: 'JSON'
  }).done(function( response ) {

    // Check for successful (blank) response
    if (response.msg === '') {

      // Clear the form inputs
      $('#addSongForm input').val('');

      $('#btnCloseForm').click();

      // Update the table
      populateTable();

    }
    else {

      // If something goes wrong, alert the error message that our service returned
      alert('Error: ' + response.msg);

    }
  });
};

// Show Charts
function showCharts(id, name) {
  $.getJSON( '/chartlist/' + id, function( charts ) {
    $("#chart-modal-title").html("<b>" + name + " StepCharts</b>");
    var sortedCharts = sortCharts(charts);
    var diffImg = "";
    var content = 
        '<input id="songId" type="hidden" value="' + id + '">' +
        '<input id="songName" type="hidden" value="' + name + '">' +
        '<div class="row">';
    for (var i = 0; i < sortedCharts.length; i++) {      
      if(sortedCharts[i].requirement != "") {
        sortedCharts[i].requirement = '<span class="glyphicon glyphicon-lock"></span> ' + sortedCharts[i].requirement;
      }
      switch(sortedCharts[i].type) {
        case "Single":
          diffImg = "https://pumpout.anyhowstep.com/images/Levels/S/single_lv" + sortedCharts[i].level + ".png";
          break;
        case "Double":
          diffImg = "https://pumpout.anyhowstep.com/images/Levels/D/double_lv" + sortedCharts[i].level + ".png";
          break;
        case "Single Performance":
          diffImg = "https://pumpout.anyhowstep.com/images/Levels/SP/sinper_lv" + sortedCharts[i].level + ".png";
          break;
        case "Double Performance":
          diffImg = "https://pumpout.anyhowstep.com/images/Levels/DP/douper_lv" + sortedCharts[i].level + ".png";
          break;
        case "Co-op":
          diffImg = "https://pumpout.anyhowstep.com/images/Levels/C/co-op_lv" + sortedCharts[i].level + ".png";
          break;
        default:
          break;
      }
      content +=       
        '<div class="col-md-12">' +
          '<div class="media">' +
            '<div class="btn-group pull-right">' +
              '<span class="glyphicon glyphicon-edit" onclick="showEditChart(\'' + sortedCharts[i]._id.toString() + '\')" data-toggle="modal" data-target="#chartEditForm"></span> ' +
              '<span class="glyphicon glyphicon-remove" onclick="removeChart(\'' + sortedCharts[i]._id.toString() + '\')"></span>' +
            '</div>' +
            '<div class="media-left">' +
              '<img src="' + diffImg + '" class="media-object" style="width:50px">' +
            '</div>' +
            '<div class="media-body">' +
              '<h4 class="media-heading">' +
                '<b>' + sortedCharts[i].stepmaker + '</b> ' +
                '<span class="badge" style="margin-bottom:5px; background-color: #f0ad4e">Pump It Up ' + sortedCharts[i].origin.game + '</span> ' +
                '<span class="badge" style="margin-bottom:5px; background-color: #d9534f">' + sortedCharts[i].origin.version + '</span>' +
              '</h4>' +
              '<p style="height: 20px">' + sortedCharts[i].requirement + '</p>' +
            '</div>' +
          '</div>' +
        '</div>';
    }
    $('#chart-modal-content').html(content + '</div>');
  });
}

// Sort charts
function sortCharts(charts) {  
  var ordering = {}, sortOrder = ['Single','Double','Single Performance', 'Double Performance', 'Co-op'];
  for (var i=0; i<sortOrder.length; i++)
    ordering[sortOrder[i]] = i;
  charts.sort( function(a, b) {
      return (ordering[a.type] - ordering[b.type]) || a.type.localeCompare(b.type) && (ordering[a.level] - ordering[b.level]) || a.level.localeCompare(b.level);
  });

  return charts;
}

// Add Chart
function addChart(event) {
  event.preventDefault();

  // If it is, compile all chart info into one object
  var newChart = {
    'song' : $('#songId').val(),
    'stepmaker' : $('#stepmaker').val(),
    'chartType' : $('#chartType').val(),
    'level' : $('#level').val(),
    'requirement' : $('#requirement').val(),
    'originGame' : $('#chartOriginGame').val(),
    'originVersion' : $('#chartOriginVersion').val()
  }

  if($('#chartId').val() == "") {
    // Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'POST',
      data: newChart,
      url: '/addchart',
      dataType: 'JSON'
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#chartEditForm input').val('');

        $('#btnCloseAddChartForm').click();

        // Update the table
        showCharts($('#songId').val(), $('#songName').val());

      }
      else {

        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);

      }
    }); 
  } else {
    // Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'POST',
      data: newChart,
      url: '/editchart/' + $('#chartId').val(),
      dataType: 'JSON'
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#chartEditForm input').val('');
        $('#chartId').val('');

        $('#btnCloseAddChartForm').click();

        // Update the table
        showCharts($('#songId').val(), $('#songName').val());

      }
      else {

        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);

        }
    });
  };
}

// Remove chart
function removeChart(id) {
  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this chart?');

  // Check and make sure the user confirmed
  if (confirmation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/deletechart/' + id
    }).done(function( response ) {

      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }

      // Update the table
      showCharts($('#songId').val(), $('#songName').val());

    });

  }
  else {

    // If they said no to the confirm, do nothing
    return false;

  }
}

// Show add chart form
function showAddChart() {
  $('#chartEditForm input').val('');
  $('#chartId').val('');
  $('#chartType').val('Single');
  $('#level').val('01');
}

// Show edit chart form
function showEditChart(id) {
  // jQuery AJAX call for JSON
  $.getJSON( '/chart/' + id, function( chart ) { 
    $('#chartId').val(chart._id.toString());
    $('#chartType').val(chart.type);
    $('#level').val(chart.level);
    $('#stepmaker').val(chart.stepmaker);
    $('#requirement').val(chart.requirement);
    $('#chartOriginGame').val(chart.origin.game);
    $('#chartOriginVersion').val(chart.origin.version);
  });
}