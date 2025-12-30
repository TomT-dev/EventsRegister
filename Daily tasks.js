function eventRegisterDailyProcessing() {
    cacheMembers();
    cacheEvents();
    cacheUsers(); 
    updateAllExisting_Current_Future_Registers();  
}
