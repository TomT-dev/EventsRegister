function clearscriptproperties(){
const sp = PropertiesService.getScriptProperties()

for (let i = 32 ; i < 56 ; i++){
  sp.deleteProperty(`registerEventIPM:0${i.toString()}`)
}

}



function cacheMembersEventsUsers(){
  cacheMembers();
  cacheEvents();
  cacheUsers(false);
}


function cacheMembers() {

  /*
  Now uses the member database automatically downloaded from Beacon every day
  Name: Member database v2024: id: 1B9n1ogYbbWZyI2S1eSBrhRlTPbicTkVDoAe2zv2D2dQ
  */

  const SS = SpreadsheetApp.openById('1B9n1ogYbbWZyI2S1eSBrhRlTPbicTkVDoAe2zv2D2dQ');
  const membersWs = SS.getSheetByName('currentMembers');
  const numRows = membersWs.getRange(1, 2).getDataRegion().getLastRow() - 1;
  Logger.log('numrows ' + numRows)
  const data = membersWs.getRange(2, 1, numRows, 6).getValues();
  Logger.log(data);
  let memberData = data.map(value => [value[0],value[2],value[3].toString().toUpperCase().slice(0,1),value[3],value[4],'','',value[5]])
  Logger.log(memberData[0]);
  //Logger.log(`[211.0, Mr, R, Robin, Adams, 01491 873303, , tarabridleway@btinternet.com]`)
  // [211.0, Mr, R, Robin, Adams, 01491 873303, , tarabridleway@btinternet.com]
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('memberData', JSON.stringify(memberData));

}


function getMembersFromProperties() {
  var scriptProperties = PropertiesService.getScriptProperties();
  // Logger.log(scriptProperties.getProperty('memberData'))
  return JSON.parse(scriptProperties.getProperty('memberData'));
}

function deleteMembersCache() {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.deleteProperty('memberData');
}

function listMembersInCache() {
  var scriptProperties = PropertiesService.getScriptProperties();
  Logger.log(scriptProperties.getProperty('memberData'));

}

function cacheEvents(){
  const SS = SpreadsheetApp.openById('1FwHzbMzO_iXtALkrQryf0YnjQf5uJ_ONh3-BCzCs_ss');
  const ws = SS.getSheetByName('CurrentIPMEvents');
  const numRows = ws.getRange(1, 2).getDataRegion().getLastRow() - 1;
  Logger.log('numrows ' + numRows)
  const eventsData = ws.getRange(2, 1, numRows, 4).getValues();
  Logger.log(eventsData);
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('eventsData', JSON.stringify(eventsData));


}

function getEventsFromProperties() {
   scriptProperties = PropertiesService.getScriptProperties();
  // return JSON.parse(scriptProperties.getProperty('eventsData'));

  // JSON does not have a primitive representation of Date objects that JSON.parse will tun back into a date automatically
  // which means that dates will be converted to date string by JODN.stringify
  // so we need to change it back to a date object
  //  but the Date's object constructor can take a date string by using the form new Date(date string)
  // so iterate through all events converting the only date fidle whihc is the first one to a date

  // get the events from the properties

  var temp = JSON.parse(scriptProperties.getProperty('eventsData'));
  Logger.log(temp)
  var tempArray = temp.map(value => { value[0] = new Date(value[0]); return value; });
  var events = tempArray.filter(value => value != null);
  Logger.log(events);

  return events;

}

function deleteEventsCache() {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.deleteProperty('eventsData');
}

function listEventsInCache() {
  var scriptProperties = PropertiesService.getScriptProperties();
  Logger.log(scriptProperties.getProperty('eventsData'));

}

function getNewSessionId(){
  var d = new Date();
  return d.getTime().toString();
}

function wipeRestoreUsersCache(){
  const SS = SpreadsheetApp.openById('1FwHzbMzO_iXtALkrQryf0YnjQf5uJ_ONh3-BCzCs_ss');
  const ws = SS.getSheetByName('Users');
  const numRows = ws.getRange(1, 2).getDataRegion().getLastRow() - 1;
  Logger.log('numrows ' + numRows)
  var usersData = ws.getRange(2, 1, numRows, 2).getValues();
  for(var i = 0 ; i <usersData.length ; i++){
    usersData[i].push('0000000000000');
  }
  Logger.log(usersData);
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('usersData', JSON.stringify(usersData));


}

function testnewcacheUsers(){
  newcacheUsers(true);
}

function cacheUsers(update = false){

 
  const SS = SpreadsheetApp.openById('1FwHzbMzO_iXtALkrQryf0YnjQf5uJ_ONh3-BCzCs_ss');
  const ws = SS.getSheetByName('Users');
  const numRows = ws.getRange(1, 2).getDataRegion().getLastRow() - 1;
  Logger.log('number of users = ' + numRows)
  var usersData = ws.getRange(2, 1, numRows, 2).getValues();
  Logger.log(usersData);
  var updatedUsersData = [];
  var thisUser;
  var scriptProperties = PropertiesService.getScriptProperties();
  if (!update){

    Logger.log('overwriting users in cache') 
      for(var i = 0 ; i <usersData.length ; i++){
        usersData[i].push('0000000000000');
      }
    Logger.log(usersData);
    scriptProperties.setProperty('usersData', JSON.stringify(usersData));

  } else {

    Logger.log('updating users in cache');
    var currentUsersCache = getUsersFromProperties();
    Logger.log(currentUsersCache);

    // copy across the records for any current users
    for(var i = 0 ; i < currentUsersCache.length ; i++){
      thisUser = currentUsersCache[i][0].toString() + currentUsersCache[i][1].toString();
      for(var j = 0 ; j < usersData.length ; j++ ){
        if(thisUser == usersData[j][0].toString() + usersData[j][1].toString()){
         updatedUsersData.push([usersData[j][0],usersData[j][1],'0000000000000']) ;
        }
      }
    }
    Logger.log(updatedUsersData);
    
    // add records for any new users

    var allCurrentUsers = updatedUsersData.map(value => [value[0].toString() + value[1].toString() ]).toString();
    Logger.log(allCurrentUsers);

    for(var i = 0 ; i < usersData.length ; i++){
      thisUser = usersData[i][0].toString() + usersData[i][1].toString();
      if(allCurrentUsers.indexOf(thisUser)< 0){
        updatedUsersData.push([usersData[i][0],usersData[i][1],'0000000000000']) 
      }
    }

    Logger.log(updatedUsersData);

    scriptProperties.setProperty('usersData', JSON.stringify(updatedUsersData));    
  }

}

function getUsersFromProperties() {
  var scriptProperties = PropertiesService.getScriptProperties();
  return JSON.parse(scriptProperties.getProperty('usersData'));
}

function deleteUsersCache() {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.deleteProperty('usersData');
}

function listUsersInCache() {
  var scriptProperties = PropertiesService.getScriptProperties();
  Logger.log(JSON.parse(scriptProperties.getProperty('usersData')));

}


function getEventRegister(eventCode){
  var registeredMembers ;
  var eventCodeRegister = eventCode + '_Register'
  var scriptProperties = PropertiesService.getScriptProperties();
  if(scriptProperties.getProperty(eventCodeRegister) == null ){
    var data = getMembersFromProperties();
    Logger.log(data);
    registeredMembers = data.map(value => [value[0],value[1],value[2],value[3],value[4],false,false]);
    scriptProperties.setProperty(eventCodeRegister,JSON.stringify(registeredMembers));
       Logger.log('new register');
    Logger.log(registeredMembers);
    

  }else{

    registeredMembers = JSON.parse(scriptProperties.getProperty(eventCodeRegister));
    Logger.log('existing register');
    Logger.log(registeredMembers);
  };
  
  return registeredMembers;
}

function listAllRegisters(){
  var scriptProperties = PropertiesService.getScriptProperties();
  var registerKeys = scriptProperties.getKeys().map(value => {if(value.toLowerCase().indexOf('register')> -1){return value}}).filter(value => value != null);

  if(registerKeys.length > 0){

    for(var i = 0 ; i < registerKeys.length ; i++){
      Logger.log('printing ' + registerKeys[i]);
      Logger.log(JSON.parse(scriptProperties.getProperty(registerKeys[i])));
    }
  } else {
    Logger.log('There are no registers to list')
  }
}

function listAllRegisterRecords(){
  var scriptProperties = PropertiesService.getScriptProperties();
  var registerKeys = scriptProperties.getKeys().map(value => {if(value.toLowerCase().indexOf('register')> -1){return value}}).filter(value => value != null);
  var thisReg, temp;
  if(registerKeys.length > 0){

    for(var i = 0 ; i < registerKeys.length ; i++){
      Logger.log('printing ' + registerKeys[i]);

      temp = JSON.parse(scriptProperties.getProperty(registerKeys[i]));
      thisReg= temp.map(value => {if(value[5] || value[6] || value[7]){return value}}).filter(value => value != null);
      Logger.log(thisReg)
      //thisReg = scriptProperties.getProperty(registerKeys[i]).map(value => {if(value[5] || value[6] || value[7]){return value}}).filter(value => value != null);
      //Logger.log(JSON.parse(scriptProperties.getProperty(registerKeys[i]).map(value => {if(value[5] || value[6] || value[7]){return value}}).filter(value => value != null)));
    }
  } else {
    Logger.log('There are no registers to list')
  }
}

function exportAllRegisterRecords(){
  const ss = SpreadsheetApp.openById('1Gvub9aVR8_SYpRPWsAq5cNKOxIYlmWaXgvSMWMl1e5k');
  const ws = ss.getSheetByName('history');
  ws.clear()
  let nextRow = 2;
  const headerRow = [['eventCode', 'Mnum', 'Name',	'In_person',	'On_Zoom',	'Checked' ]];
  ws.getRange(1,1,1,6).setValues(headerRow);
  var scriptProperties = PropertiesService.getScriptProperties();
  var registerKeys = scriptProperties.getKeys().map(value => {if(value.toLowerCase().indexOf('register')> -1){return value}}).filter(value => value != null);
  var thisReg, temp, thisEventCode, numRows;
  if(registerKeys.length > 0){

    for(var i = 0 ; i < registerKeys.length ; i++){
      thisEventCode = registerKeys[i].slice(13);
      Logger.log('printing ' + thisEventCode);

      temp = JSON.parse(scriptProperties.getProperty(registerKeys[i]));
      thisReg= temp.map(value => {if(value[5] || value[6] || value[7]){return [thisEventCode,value[0],`${value[4]}, ${value[3]}, ${value[1]}`,value[5],value[6],value[7]]}}).filter(value => value != null);
      Logger.log(thisReg)
      numRows = thisReg.length;
      Logger.log(numRows)
      if(numRows > 0){
      ws.getRange(nextRow,1,numRows,6).setValues(thisReg);
      nextRow = nextRow + numRows;
      }
      
    }
  } else {
    Logger.log('There are no registers to list')
  }
}



function deleteAllRegisters(){
  
  var scriptProperties = PropertiesService.getScriptProperties();
  var registerKeys = scriptProperties.getKeys().map(value => {if(value.toLowerCase().indexOf('register')> -1){return value}}).filter(value => value != null);

  if(registerKeys.length > 0){
    listAllRegisters();
    for(var i = 0 ; i < registerKeys.length ; i++){
      Logger.log('deleting ' + registerKeys[i]);
      scriptProperties.deleteProperty(registerKeys[i]);  
      listAllRegisters();
    }
} else {
    Logger.log('There are no registers to delete')
  }


}

function testdeleteTheseRegisters(){
  deleteTheseRegisters(['IPM:038']);
}

function deleteTheseRegisters(registers) { // registers is an array of event codes
Logger.log('deleting ' + registers.length + ' registers: ' + registers);

	var scriptProperties = PropertiesService.getScriptProperties();
	var registerKeys = scriptProperties.getKeys().map(value => {
		if (value.toLowerCase().indexOf('register') > -1) {
			return value;
		}
	}).filter(value => value != null);
  Logger.log(registerKeys);
  var thisKey;

	if (registers.length > 0) {
		if (registerKeys.length > 0) {
			for (var i = 0; i < registerKeys.length; i++) {
        thisKey = registerKeys[i].slice(13);
				if (registers.toString().indexOf(thisKey) > -1) {
					Logger.log('deleting ' + registerKeys[i]);
					scriptProperties.deleteProperty(registerKeys[i]);
				}
			}
		} else {
			Logger.log('There are no registers to delete');
		}
	} else {
		Logger.log('No input /' + registers + '/');
	}



}

