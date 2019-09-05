let everyVegobjekt = []
let filteredVegobjekter = []


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
  updateInfoTable();
}

const filterByThreshold = inputValue => {
  filteredVegobjekter = []
  Object.entries(everyVegobjekt).forEach(([key,value]) => {
    if($("#ddmenu").val() == 1 && value["val"]['dekkebredde'] >= inputValue) {
      filteredVegobjekter.push(value);
    }
    else if($("#ddmenu").val() == 2 && value["val"]['dekkebredde'] < inputValue) {
      filteredVegobjekter.push(value);
    }
  });

  filteredVegobjekter.sort((a, b) => {
    return $("#ddmenu").val() == 1 ? a["val"]["dekkebredde"] - b["val"]["dekkebredde"] : b["val"]["dekkebredde"] - a["val"]["dekkebredde"]
  })
}

// Builds the HTML Table out of myList.
const buildHtmlTable = (selector, myList) => {
  $("#dataTable").empty();
  var columns = addAllColumnHeaders(selector);

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
  link3 = ""
  link4 = "kommune:(~602,626,219,220))/@261273,6645269,8/vegobjekt:"+objektId+":40a744:583"

  if($("#ddmenu").val() == 1) {
    link3 = "(farge:'0_1,filter:(~(operator:'*3e*3d,type_id:5555,verdi:(~"+$("#dekkenum").val()+"))),id:583))/hvor:(fylke:(~3),"
  }
  else if ($("#ddmenu").val() == 2) {
    link3 = "(farge:'0_1,filter:(~(operator:'*3c,type_id:5555,verdi:(~"+$("#dekkenum").val()+"))),id:583))/hvor:(fylke:(~3),"
  }

  finalLink = link1+link2+link3+link4
  //return '<button onclick=window.location.href="'+finalLink+'" target="_blank" type="button" class="btn btn-outline-dark">Søk her</button>'
  return '<a href='+finalLink+' target="_blank" class="btn btn-outline-dark">Søk her</a>'
}

const addAllColumnHeaders = selector => {
  var columnSet = [];
  var headerTr$ = $('<tr/>');

  headerTr$.addClass("thead-dark")  //makes the header dark 8)
  headerTr$.append($('<th/>').html("Dekkebredde"));
  columnSet.push("Dekkebredde");
  headerTr$.append($('<th/>').html("Differanse"));
  columnSet.push("Differanse");
  headerTr$.append($('<th/>').html("Vegkart lenke"));
  columnSet.push("Vegkart lenke");
  $(selector).append(headerTr$);

  return columnSet;
}

const updateInfoTable = () => {
  var temp = filteredVegobjekter.map(a => a["val"]["dekkebredde"]);
  var minDekkebredde = Math.min(...temp);
  var maxDekkebredde = Math.max(...temp);
  var avgDekkebredde = Math.round(temp.reduce((a,b) => a+b,0)/filteredVegobjekter.length*10)/10;
  var percentOver = 0;

  if($("#ddmenu").val() == 1) {
    percentOver = Math.round(filteredVegobjekter.length/everyVegobjekt.length*1000)/10
  }
  else if ($("#ddmenu").val() == 2) {
    percentOver = Math.round(filteredVegobjekter.length/everyVegobjekt.length*1000)/10
  }

  $("#infoMinDekkebredde").html(minDekkebredde+'m');
  $("#infoMaxDekkebredde").html(maxDekkebredde+'m');
  $("#infoAvgDekkebredde").html(avgDekkebredde+'m');
  $("#infoPercentBigger").html(percentOver+'%');
}

const vegkartRedirect = () => {
  link1 = "https://www.vegvesen.no/nvdb/vegkart/v2/#kartlag:nib/hva:(~(farge:'2_2,filter:(~(operator:'*3d,type_id:4566,verdi:(~5492)),"
  link2 = "(operator:'*3d,type_id:4570,verdi:(~5506)),(operator:'*3d,type_id:4568,verdi:(~18)),(operator:'*3c*3d,type_id:4569,verdi:(~49))),id:532),"
  link3 = ""
  link4 = "kommune:(~602,626,219,220))/@261273,6645269,8"

  if($("#ddmenu").val() == 1) {
    link3 = "(farge:'0_1,filter:(~(operator:'*3e*3d,type_id:5555,verdi:(~"+$("#dekkenum").val()+"))),id:583))/hvor:(fylke:(~3),"
  }
  else if ($("#ddmenu").val() == 2) {
    link3 = "(farge:'0_1,filter:(~(operator:'*3c,type_id:5555,verdi:(~"+$("#dekkenum").val()+"))),id:583))/hvor:(fylke:(~3),"
  }

  finalLink = link1+link2+link3+link4
  return finalLink
}
