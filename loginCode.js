function testgetSessionId(){
  Logger.log(checkUserGetSessionId('tom','577'))

}

function checkUserGetSessionId(username,password) {
  //Logger.log('size = ' + screenSize + ' height = ' + screenHeight)
  Logger.log(`checkUserGetSessionId(${username} , ${password})`)
      username = username.toString().toLowerCase();
      var scriptProperties = PropertiesService.getScriptProperties();
      var users = JSON.parse(scriptProperties.getProperty('usersData'));
      Logger.log(users);
      var response = {};
      response.valid = false;
      var  flag = false, i = 0, j = 0;
  
      while( i < users.length && flag == false){


        if(users[i][0].toLowerCase() == username && users[i][1] == password){
          flag = true;
          var sessionId = getAndSetNewSessionId(username);
          Logger.log(users);
          response.sessionId = sessionId;
          response.valid = true;
          response.valid;
          response.userName = username;
        }

        i++;
      }

      Logger.log(response);
      

      if(!response.valid){
          // try caching users and then test again
          Logger.log('cachings users');
          cacheUsers(true);
          users = JSON.parse(scriptProperties.getProperty('usersData'));
          i = 0;
          while( i < users.length && flag == false){
            if(users[i][0].toLowerCase() == username && users[i][1] == password){
              flag = true;
              var sessionId = getAndSetNewSessionId(username);
              Logger.log(users);
              response.sessionId = sessionId;
              response.valid = true;
              
            }

            i++;
          }
      }


     
      Logger.log(`checkUserGetSessionId returning ${response}`)
      return response;
}

function getAndSetNewSessionId(username){

  var scriptProperties = PropertiesService.getScriptProperties();
  var users = JSON.parse(scriptProperties.getProperty('usersData'));
  Logger.log(users);
  var d = new Date();
  var newSessionId = d.getTime().toString();

  for(var i = 0 ; i < users.length ; i++){
    if(users[i][0] == username){
      users[i][2] = newSessionId
    }
  }
  scriptProperties.setProperty('usersData',JSON.stringify(users));
  Logger.log('users data after new id');

  Logger.log(JSON.parse(scriptProperties.getProperty('usersData')));

  return newSessionId

}

function testcheckSessionIdValid(){
  Logger.log(checkSessionIdValid('1674212723669'))
}

function checkSessionIdValid(sessionId){

  Logger.log(typeof sessionId + ' sessionId = ' + sessionId)

  if(sessionId == '00000000000'){
    return false;
  }
  var scriptProperties = PropertiesService.getScriptProperties();
  var users = JSON.parse(scriptProperties.getProperty('usersData'));
  Logger.log(users);
  var sessionIds = users.map(value => value[2]);
  Logger.log(sessionIds);

  sessionIdOK = sessionIds.includes(sessionId);
  Logger.log(sessionIdOK);
  return sessionIdOK;

}


function deleteValidSessionIds(){
  var scriptProperties = PropertiesService.getScriptProperties();
  Logger.log(scriptProperties.getProperty('validSessionIds'));
 scriptProperties.deleteProperty('validSessionIds');
 Logger.log(scriptProperties.getProperty('validSessionIds'));

}

function setupdummyids(){
  var scriptProperties = PropertiesService.getScriptProperties();
  Logger.log(scriptProperties.getProperty('validSessionIds'));
 scriptProperties.deleteProperty('validSessionIds');
 var zz = [];
 zz.push(['tom', '123456']);
 scriptProperties.setProperty('validSessionIds',JSON.stringify(zz));
 Logger.log(JSON.parse(scriptProperties.getProperty('validSessionIds')));
 Logger.log(JSON.parse(scriptProperties.getProperty('validSessionIds'))[0][0]);



}
