let everyVegobjekt = []
let filteredVegobjekter = []
//let filteredVegobjekterIndex = []


const initialize = () => {
  readFromJSON();
}

const readFromJSON = () => {
  $.getJSON("query_vegref_med_felt.json", function(json) {
    Object.entries(json).forEach(([key, val]) => {
      everyVegobjekt.push({key, val})
    });
  });

}

const populateTable = () => {
  filterByThreshold($("#dekkenum").val())
  buildHtmlTable("#dataTable", filteredVegobjekter);
}

const filterByThreshold = inputValue => {
  filteredVegobjekter = []
  Object.entries(everyVegobjekt).forEach(([key,value]) => {
    if(value["val"]['dekkebredde'] >= inputValue) {
      filteredVegobjekter.push(value);
    }
  });
  filteredVegobjekter.sort((a, b) => a["val"]["dekkebredde"] - b["val"]["dekkebredde"]);
}

// Builds the HTML Table out of myList.
function buildHtmlTable(selector, myList) {
  $("#dataTable").empty();
  var columns = addAllColumnHeaders(myList, selector);

  for (var i = 0; i < myList.length; i++) {
    var row$ = $('<tr/>');
    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      var cellValue = myList[i]["val"]["dekkebredde"];

      if ( colIndex == 0) {
        row$.append($('<td/>').html(cellValue));
      }
      else if (colIndex == 1) {
        var diff = myList[i]["val"]["dekkebredde"] - $("#dekkenum").val()
        diff = Math.round(diff * 100) / 100
        row$.append($('<td/>').html(diff));
      }
      else if (colIndex == 2) {

        row$.append($('<td/>').html(generateLink(myList[i]["key"])));
      }
    }
    $(selector).append(row$);
  }
}


const generateLink = objektId => {
  link1 = "https://www.vegvesen.no/nvdb/vegkart/v2/#kartlag:nib/hva:(~(farge:'2_2,filter:(~(operator:'*3d,type_id:4566,verdi:(~5492)),"
  link2 = "(operator:'*3d,type_id:4570,verdi:(~5506)),(operator:'*3d,type_id:4568,verdi:(~18)),(operator:'*3c*3d,type_id:4569,verdi:(~49))),id:532),"
  link3 = "(farge:'0_1,filter:(~(operator:'*3e*3d,type_id:5555,verdi:(~"+$("#dekkenum").val()+"))),id:583))/hvor:(fylke:(~3),"
  link4 = "kommune:(~602,626,219,220))/@261273,6645269,8/vegobjekt:"+objektId+":40a744:583"

  link = link1+link2+link3+link4
  //return '<a href='+link+' target="_blank">Link</a>'
  return '<button href = '+link+' type="button" class="btn btn-outline-dark">Søk her</button>'

  // <button type="button" class="btn btn-outline-secondary">Secondary</button>
}

function addAllColumnHeaders(myList, selector) {
  var columnSet = [];
  var headerTr$ = $('<tr/>');

  headerTr$.append($('<th/>').html("Dekkebredde"));
  columnSet.push("Dekkebredde");
  headerTr$.append($('<th/>').html("Differanse"));
  columnSet.push("Differanse");
  headerTr$.append($('<th/>').html("Vegkart lenke"));
  columnSet.push("Vegkart lenke");
  $(selector).append(headerTr$);

  return columnSet;
}


/*
def calculate_values(self):
"""
This method sorts a filtered list of tuples, populates the table with correct values
and updates the information screen after each search.
"""


def vegkart_button_click(self):
    """
    This method redirects a user to the vegkart with preconfigured inputs and search-values.
    """
*/
