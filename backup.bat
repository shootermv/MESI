//BACK UP
//cd c:\
//stop mongo
C:\mongodb\bin\mongodump --dbpath c:/mongodb/data/db/ --out c:/data/backup


//RESTORE
//cd c:\
C:\mongodb\bin\mongorestore --dbpath  c:\DB c:\data\backup