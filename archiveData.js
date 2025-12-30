function populateMemberDataForTesting(){

  /* deprecated code
  Logger.log('function disabled, edit code to comment our next line to run');
  // return
  // clear the existing data
  const SS = SpreadsheetApp.openById('1FwHzbMzO_iXtALkrQryf0YnjQf5uJ_ONh3-BCzCs_ss');
  const membersWs = SS.getSheetByName('registerArchive');
  var numRows = membersWs.getRange(1, 2).getDataRegion().getLastRow() - 1;
  var numCols = membersWs.getRange(1, 2).getDataRegion().getLastColumn();
  var memberData
  Logger.log('numrows ' + numRows)
  if(numRows > 0){
  membersWs.getRange(2, 1, numRows, numCols).clear();
  } else {
    memberData = [];
  }
  */

  // now uses the Member database v2023

  const SS = SpreadsheetApp.openById('1B9n1ogYbbWZyI2S1eSBrhRlTPbicTkVDoAe2zv2D2dQ');
  const membersWs = SS.getSheetByName('currentMembers+Joiners');
  const numRows = membersWs.getRange(1, 2).getDataRegion().getLastRow() - 1;
  Logger.log('numrows ' + numRows)
  if(numRows > 0){
  const data = membersWs.getRange(2, 1, numRows, 6).getValues();
  Logger.log(data);
  let memberData = data.map(value => [value[0],value[2],value[3].toString().toUpperCase().slice(0,1),value[3],value[4],'','',value[5]]);
  } else {
    memberData = [];
  }
  Logger.log(memberData[0]);
  Logger.log(memberData);

  var scriptProperties = PropertiesService.getScriptProperties()

  // get the list of events which have registers saved

  var eventsWithRegTags = scriptProperties.getKeys().map(value => {if(value.indexOf('register')> -1){return value}}).filter(value => value != null);
  Logger.log(eventsWithRegTags);

  // get the full list of events

  var allEvents = getEventsFromProperties();
  Logger.log('number of events in allEvents = ' + allEvents.length);
  Logger.log(allEvents);

  // filter out the eventsWithReg

  var eventsWithReg = [];

  for(var i = 0 ; i < allEvents.length ; i++){
    // Logger.log(allEvents[i][3]);
    // Logger.log(eventsWithRegTags.toString().indexOf(allEvents[i][3]))
    // get event details
    if(eventsWithRegTags.toString().indexOf(allEvents[i][3]) > -1){
      Logger.log('match');
      eventsWithReg.push(allEvents[i].concat(['registerEvent' + allEvents[i][3]]));
    }
  }

  Logger.log('number of events in eventsWithReg = ' + eventsWithReg.length);
  Logger.log(eventsWithReg);

  // add eventsWithReg data to the registrations to form the register Archive

  var thisEventReg, regArchive = [];

  for(var j = 0 ; j < eventsWithReg.length ; j++){
    Logger.log(eventsWithReg[j]);

    thisEventReg = JSON.parse(scriptProperties.getProperty(eventsWithReg[j][4]));

      // merge with the individual event registers

      for(var k = 0 ; k < thisEventReg.length ; k++){
        if(thisEventReg[k][5] || thisEventReg[k][6] || thisEventReg[k][7]){

          regArchive.push(eventsWithReg[j].concat(thisEventReg[k]))

        }

      }

    Logger.log(regArchive);
    Logger.log(regArchive.length + ' records have been written')
    
  }

  // write the array out

  membersWs.getRange(2,1,regArchive.length,regArchive[0].length).setValues(regArchive);
  
}

function testarchiveEvent(){

  Logger.log(archiveEvent(['IPM:031']));

}

function archiveAllCurrentEventRegisters(){
   var scriptProperties = PropertiesService.getScriptProperties()
  var eventsWithRegTags = scriptProperties.getKeys().map(value => {if(value.indexOf('register')> -1){return value.slice(-7)}}).filter(value => value != null);
  Logger.log(eventsWithRegTags.sort());
 // archiveEvent(eventsWithRegTags.sort());

}
function archiveHistoricEventRegisters(){
   var scriptProperties = PropertiesService.getScriptProperties()
  var eventsWithRegTags = scriptProperties.getKeys().map(value => {if(value.indexOf('register')> -1){return value.slice(-7)}}).filter(value => value != null).toString();
  Logger.log(eventsWithRegTags);

    const SS = SpreadsheetApp.openById('1FwHzbMzO_iXtALkrQryf0YnjQf5uJ_ONh3-BCzCs_ss');
  const ws = SS.getSheetByName('Events');
  const numRows = ws.getRange(1, 2).getDataRegion().getLastRow() - 1;
  Logger.log('numrows ' + numRows)
  const eventsData = ws.getRange(2, 1, numRows, 9).getValues().map(value => [value[0],value[1],value[2],value[8]]);
  Logger.log(eventsData);
  

  
    Logger.log('typeof = ' + typeof eventsData[0][0] + ' ' + eventsData[0][0]);
    var d = new Date();
    Logger.log(d);
    d.setHours(0,0,0,0);
    midnight = d.getTime()
    Logger.log(d + ' ' + eventsData[0][0] + ' ' + midnight + ' ' + eventsData[0][0].getTime());

    var previousEvents = [];
    var previousEventsDetails = [];
    for(var i = 0 ; i < eventsData.length ; i++){
      if(eventsData[i][0].getTime() < midnight && eventsWithRegTags.toUpperCase().indexOf(eventsData[i][3].toString().toUpperCase()) > -1 ){
        Logger.log('before');
        previousEvents.push(eventsData[i][3]);
        previousEventsDetails.push(`${eventsData[i][3]}, ${getDateString(eventsData[i][0])}`)
      } else {
        Logger.log('after');
      }
    }

    Logger.log(previousEvents);
    Logger.log(previousEventsDetails);
  
  // archiveEvent(previousEvents);
  createPDFRegistersForTheseEvents(previousEventsDetails);
  // deleteTheseRegisters(previousEvents);

}

function archiveEvent(eventCodes){
  Logger.log(eventCodes);

  // sort the event codes and turn them into tags

  if(eventCodes.length > 0){

  var eventTags = eventCodes.sort().map(value => 'registerEvent' + value);
  
  } else {
    return 'no event codes supplied'
  }

  // get the existing data
  const SS = SpreadsheetApp.openById('1FwHzbMzO_iXtALkrQryf0YnjQf5uJ_ONh3-BCzCs_ss');
  const archiveWs = SS.getSheetByName('registerArchive');
  const allEventsWs = SS.getSheetByName('Events');
  var numRows = archiveWs.getRange(1, 2).getDataRegion().getLastRow() - 1;
  var numCols = archiveWs.getRange(1, 2).getDataRegion().getLastColumn();
  var allReg;
  Logger.log('numrows ' + numRows)
  if(numRows > 0){
  allReg = archiveWs.getRange(2, 1, numRows, numCols).getValues();
  } else {
    allReg = [];
  }
  Logger.log(allReg);

 

  // filter out the entries for these events, retaining the others

    var filteredReg = [];

  for(var i = 0 ; i < allReg.length ; i++){
    // Logger.log(allReg[i][3]);
    // Logger.log(eventTags.toString().indexOf(allReg[i][3]))
    // get event details
    if(eventTags.toString().indexOf(allReg[i][3])< 0){
      //Logger.log('match');
      filteredReg.push(allReg[i]);
    }
  }

  Logger.log(filteredReg.length + ' records left');

  // construct the arvive records for the events specified
  
  var scriptProperties = PropertiesService.getScriptProperties()

  // get the list of events which have registers saved

  // get the full list of events
  var allEvents, allEventsFull;

   if(allEventsWs.getRange(1, 2).getDataRegion().getLastRow() - 1 > 0){
    allEventsFull = allEventsWs.getRange(2, 1, allEventsWs.getRange(1, 2).getDataRegion().getLastRow() - 1, allEventsWs.getRange(1, 2).getDataRegion().getLastColumn()).getValues();
    allEvents = allEventsFull.map(value => [value[0],value[1],value[2],value[8]]);

  } else {
    allEvents = [];
  }

  Logger.log('number of events in allEvents = ' + allEvents.length);
  Logger.log(allEvents);
  

  // filter out the eventsTags

  var eventsWithReg = [];

  for(var i = 0 ; i < allEvents.length ; i++){
    // Logger.log(allEvents[i][3]);
    // Logger.log(eventsWithRegTags.toString().indexOf(allEvents[i][3]))
    // get event details
    if(eventTags.toString().indexOf(allEvents[i][3]) > -1){
      Logger.log('match');
      eventsWithReg.push(allEvents[i].concat(['registerEvent' + allEvents[i][3]]));
    }
  }

  Logger.log('number of events in eventsTags = ' + eventsWithReg.length);
  Logger.log(eventsWithReg);


  // add eventsWithReg data to the registrations to form the register Archive

  var thisEventReg, addReg2Archive = [];

  for(var j = 0 ; j < eventsWithReg.length ; j++){
    Logger.log(eventsWithReg[j]);

    thisEventReg = JSON.parse(scriptProperties.getProperty(eventsWithReg[j][4]));

      // merge with the individual event registers

      for(var k = 0 ; k < thisEventReg.length ; k++){
        if(thisEventReg[k][5] || thisEventReg[k][6] || thisEventReg[k][7]){

          addReg2Archive.push(eventsWithReg[j].concat(thisEventReg[k]))

        }

      }

    Logger.log(addReg2Archive);
    Logger.log('addReg2Archive.length = ' + addReg2Archive.length);
    
  }

  // merge and sort the retained and new records

  var saveReg = filteredReg.concat(addReg2Archive);
  Logger.log(saveReg);
  Logger.log('saveReg.length = ' + saveReg.length);

  // define sort routine

    var sortbyEventCode = function sortFunction(a, b) {
    if (a[3] === b[3]) {
      return 0;
    }
    else {
      return (a[3] < b[3]) ? -1 : 1;
    }
  };

  saveReg.sort(sortbyEventCode);

  // clear the data from the archive
  if(numRows > 0){
    Logger.log('clearing data from ws');
  archiveWs.getRange(2, 1, numRows, numCols).clear();
  }
  // write the array out  
  if(saveReg.length > 0){
    Logger.log('writing data to ws, writing ' + saveReg.length + ' rows, ' + saveReg[0].length + ' columns' );
    archiveWs.getRange(2,1,saveReg.length,saveReg[0].length).setValues(saveReg);
  }
  
  
}

function testgetDateString(){
  var d = new Date();
  getDateString(d);
}

function getDateString(dateVal) {
	var dateString = `${dateVal.getDate().toString().padStart(2,"0")}/${(dateVal.getMonth()+1).toString().padStart(2,"0")}/${dateVal.getFullYear()}`;
	Logger.log('date string returned = ' + dateString);
	return dateString;
}



