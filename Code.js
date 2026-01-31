function doGet(e){

  var params = JSON.stringify(e);
  Logger.log(params);
  var action = e.parameter.action;

  if(action == 'clear'){

      template = HtmlService.createTemplateFromFile('clearStorage');
      return template.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  } else {

      template = HtmlService.createTemplateFromFile('allHtml');
      return template.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

}


function getThisSessionID(){
  var scriptProperties = PropertiesService.getScriptProperties();
  var sessionId = scriptProperties.getProperty('thisInstanceId');
  scriptProperties.deleteProperty('thisInstanceId');
  return sessionId
}

function getLoginErrorMessage(){
  var scriptProperties = PropertiesService.getScriptProperties();
  var loginErrorMsg = scriptProperties.getProperty('loginErrorMessage');
  scriptProperties.setProperty('loginErrorMessage','');
  return loginErrorMsg

}

function setLive(){
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('live', 'live'  );

}

function setTest(){
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('live', 'test'  );

}

function getLink(){
  var scriptProperties = PropertiesService.getScriptProperties();
  if(scriptProperties.getProperty('live') == 'live'){

  return 'https://script.google.com/macros/s/AKfycbw22WabnD6eI31IAd6XqKkAmpsz4364XR8ekwmiow7oh0M5LcZJ4aJkK-2zpOp_qkpo/exec';

  } else {

  return 'https://script.google.com/macros/s/AKfycbxiNxWkbw-LpQQI1ujei29Ui7vT7O6Uc_i9KXklzMU/dev'  ;

  }

}

function getEventListSelectHtml(){
  var scriptProperties = PropertiesService.getScriptProperties();
  var events = JSON.parse(scriptProperties.getProperty('eventsData'));  
  Logger.log(events);
  Logger.log(typeof events)
  eventsList = events.map(value => value[3].toString().replace("/", "-") + ', ' + new Date(value[0]).toLocaleDateString('en-GB')  + ', ' + value[1].slice(0,50));
  var eventsListHtml = '<option value="" disabled selected hidden>Select an event</option>';
        for (var i = 0; i < eventsList.length; i++) {
          eventsListHtml = eventsListHtml + `<option class = "eventSelectOption" value="${eventsList[i].toString().slice(0,19)}">${eventsList[i]}</option>`;
          //console.log(eventsListHtml);
        }

  Logger.log(eventsListHtml)
  return eventsListHtml;

}

function getEventList(sessionId){

  var sessionIdOK = checkSessionIdValid(sessionId);

  var response = {};

  if(sessionIdOK){
  var scriptProperties = PropertiesService.getScriptProperties();
  var events = JSON.parse(scriptProperties.getProperty('eventsData'));  
  Logger.log(events);
  Logger.log(typeof events)
  eventsList = events.map(value => value[3] + ', ' + new Date(value[0]).toLocaleDateString('en-GB')  + ', ' + value[1].slice(0,50));
  // eventsList = events.map(value => value[3] + ', ' + new Date(value[0]).toLocaleDateString('en-GB'));
  Logger.log(eventsList);
  Logger.log(eventsList[0]);
  new Date(events[0][0]).toLocaleDateString('en-GB');
  response.sessionIdOk = 'ok';
  response.eventsList = eventsList;
  response.sessionId = sessionId;
  Logger.log('response is');
  Logger.log(response);
  return response;
  } else {
    response.sessionIdOk = 'invalidSessionId';
    response.sessionId = sessionId;
     Logger.log('response is');
    Logger.log(response);
    return response;
  }
}

function play(){
  var landscapeLeftSideWidth,landscapeRightSideWidth,landscapeKeySize;
  var portraitLeftSideWidth, portraitRightSideWidth, portraitKeySize;
  var localStorage;
  var displaySettings = {"landscapeLeftSideWidth":"50%", 
                         "landscapeRightSideWidth":"50%",
                         "landscapeKeySize":40, 
                         "portraitLeftSideWidth":"50%",
                         "portraitRightSideWidth":"50%",
                         "portraitKeySize":40};

      if(!isLocalStorageKey(displaySettings[i][0].toString())){
        localStorage.setItem(displaySettings[i][0],displaySettings[i][1]);
        console.log( displaySettings[i][0] +  " set to " + localStorage.getItem(displaySettings[i][0]));
      } else {
        console.log(displaySettings[i][0] + " already set");
      }



}

function logDeviceDetails(deviceDetailsStringified){
  let deviceDetails = JSON.parse(deviceDetailsStringified)
  Logger.log(deviceDetails);
  const SS = SpreadsheetApp.openById('1FwHzbMzO_iXtALkrQryf0YnjQf5uJ_ONh3-BCzCs_ss');
  const devices = SS.getSheetByName('connectedDevices');
  const nextRow = devices.getRange(1, 2).getDataRegion().getLastRow() + 1;
  Logger.log('writing row ' + nextRow);
  var d = new Date();
  let deviceData = [[ d,
                      deviceDetails.sessionId,
                      deviceDetails.userName,
                      deviceDetails.primaryScreenMode,
                      deviceDetails.secondaryScreenMode,
                      deviceDetails.screenWidth,
                      deviceDetails.screenHeight,
                      deviceDetails.landscapeRightSideWidth,
                      deviceDetails.landscapeLeftSideWidth,
                      deviceDetails.userAgent]];
  Logger.log(deviceData);
  devices.getRange(nextRow,1,1,10).setValues(deviceData);
  return 'device details logged on server';
 
}

