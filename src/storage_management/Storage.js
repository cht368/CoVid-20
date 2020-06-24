import RNFS from 'react-native-fs';

export async function CheckItem (type, file) {
        var rootPath = RNFS.DocumentDirectoryPath
        if (type === "cache") {rootPath = RNFS.CachesDirectoryPath}
        fileUri = rootPath + "/" + file
        return RNFS.exists(fileUri)
        .then((res) => {
          return res
        })
        .catch((err) => {
          console.log(err)
          return false
        });
    }

    export async function GetItem (type, file) {
        var rootPath = RNFS.DocumentDirectoryPath
        if (type === "cache") {rootPath = RNFS.CachesDirectoryPath}
        fileUri = rootPath + "/" + file
        return RNFS.exists(fileUri)
        .then(() => {
            return (
              RNFS.readFile(fileUri, 'utf8')
                .then((res) => {
                  return JSON.parse(res);
                })
                // `unlink` will throw an error, if the item to unlink does not exist
                .catch((err) => {
                  return false;
                })
            );
        })
        .catch((err) => {
          return false;
        });
    }

    export async function GetItems (type, directory) {
        var rootPath = RNFS.DocumentDirectoryPath
        if (type === "cache") {rootPath = RNFS.CachesDirectoryPath}
        if (directory != "") {directory = "/" + directory}
        fileUri = rootPath + directory
        return RNFS.exists(fileUri)
        .then((res1) => {
            return (
              RNFS.readDir(fileUri)
                .then((res) => {
                  return res;
                })
                .catch((err) => {
                  return false;
                })
            );
        })
        .catch((err) => {
          return false;
        });
    }

    export async function SetItem (type, file, directory, content) {
        var rootPath = RNFS.DocumentDirectoryPath
        if (type === "cache") {rootPath = RNFS.CachesDirectoryPath}
        if (directory != "") {directory = "/" + directory}
        var fileUri = rootPath + directory + "/" + file;
        var fileDirectory = rootPath + directory
        return RNFS.exists(fileUri)
        .then((res) => {
          RNFS.mkdir(fileDirectory);
            return (
              RNFS.unlink(fileUri).then(() => {
              return RNFS.writeFile(fileUri, JSON.stringify(content), 'utf8')
//              RNFS.writeFile(fileUri, JSON.stringify(content), 'utf8')
                .then((res) => {
                  return true;
                })
                .catch((err) => {
                  return false;
                })
              })
                .catch((err) => {
                    return RNFS.writeFile(fileUri, JSON.stringify(content), 'utf8')
                      .then((res) => {
                        return true;
                      })
                      .catch((err) => {
                        return false;
                      })
                })
            );
        })
        .catch((err) => {
          return false;
        });
    }

    export async function SetItemObject (type, file, directory, content) {
        var rootPath = RNFS.DocumentDirectoryPath
        if (type === "cache") {rootPath = RNFS.CachesDirectoryPath}
        var fileUri = rootPath + "/" + directory + "/" + file;
        var fileDirectory = rootPath + "/" + directory
        return RNFS.exists(fileUri)
        .then((res) => {
          RNFS.mkdir(fileDirectory);
            return (
              RNFS.writeFile(fileUri, JSON.stringify(content), 'base64')
                .then((res) => {
                  return true;
                })
                .catch((err) => {
                  return false;
                })
            );
        })
        .catch((err) => {
          return false;
        });
    }

    export async function RemoveItem (type, file) {
        var rootPath = RNFS.DocumentDirectoryPath
        if (type === "cache") {rootPath = RNFS.CachesDirectoryPath}
        fileUri = rootPath + "/" + file
        return RNFS.exists(fileUri)
        .then(() => {
          console.log("file exists: ", fileUri);
          if (fileUri) {
            return (
              RNFS.unlink(fileUri)
                .then(() => {
                  console.log("FILE DELETED");
                  return true;
                })
                .catch((err) => {
                  console.log(err.message);
                  return false;
                })
            );
          }
        })
        .catch((err) => {
          console.log(err.message);
          return true;
        });
    }


//        try{
//            AsyncStorage.getItem("project_data")
//            .then((res)=>{
//                console.log("test new project", res)
//            })
//            .catch((error) => {
//              //this callback is executed when your Promise is rejected
//              console.log('Promise is rejected with error: ' + error);
//            })
//        }catch(err){
//        }