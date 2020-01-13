const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const http = require("http").Server(app);
const upload = require("express-fileupload");

app.use(upload());
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));


const CHN_102 = [{
    name: "CHN_102_Chapter_1.pdf", //some name
    numberOfDownloads: 10, //number of downloads, increment by one after each download
    date: "01/01/2020"
  },
  {
    name: "CHN_102_Chapter_2.pdf", //some name
    numberOfDownloads: 5, //number of downloads, increment by one after each download
    date: "29/12/2019"
  },
  {
    name: "CHN_102_Chapter_3.pdf", //some name
    numberOfDownloads: 1, //number of downloads, increment by one after each download
    date: "23/12/2019"
  }
];

const CHN_104 = [{
    name: "CHN_104_Chapter_1.pdf", //some name
    numberOfDownloads: 10, //number of downloads, increment by one after each download
    date: "07/01/2020"
  },
  {
    name: "CHN_104_Chapter_2.pdf", //some name
    numberOfDownloads: 3, //number of downloads, increment by one after each download
    date: "05/01/2020"
  },
  {
    name: "CHN_104_Chapter_3.pdf", //some name
    numberOfDownloads: 2, //number of downloads, increment by one after each download
    date: "03/01/2020"
  }
];


const EEN_112 = [{
    name: "EEN_112_Chapter_1.pdf", //some name
    numberOfDownloads: 11, //number of downloads, increment by one after each download
    date: "03/01/2020"
  },
  {
    name: "EEN_112_Chapter_2.pdf", //some name
    numberOfDownloads: 10, //number of downloads, increment by one after each download
    date: "17/12/2019"
  },
  {
    name: "EEN_112_Chapter_3.pdf", //some name
    numberOfDownloads: 5, //number of downloads, increment by one after each download
    date: "13/12/2019"
  }
];




//RENDERS CHN-104 PAGE
app.get("/", function(req, res) {

  var filesArray = JSON.parse(JSON.stringify(CHN_102));
  for (var i = 0; i < filesArray.length - 1; i++) {
    for (var j = 0; j < filesArray.length - 1 - i; j++) {
      if (filesArray[j].numberOfDownloads < filesArray[j + 1].numberOfDownloads) {
        var fileAtJ = filesArray[j];
        filesArray[j] = filesArray[j + 1];
        filesArray[j + 1] = fileAtJ;
      }
    }
  }

  res.render("home", {
    courseName: "CHN_102",
    courseObject: CHN_102,
    filesArray: filesArray
  });
});



//RENDER COURSE PAGES:

app.get("/CHN_102", function(req, res) {

  var filesArray = JSON.parse(JSON.stringify(CHN_102));
  for (var i = 0; i < filesArray.length - 1; i++) {
    for (var j = 0; j < filesArray.length - 1 - i; j++) {
      if (filesArray[j].numberOfDownloads < filesArray[j + 1].numberOfDownloads) {
        var fileAtJ = filesArray[j];
        filesArray[j] = filesArray[j + 1];
        filesArray[j + 1] = fileAtJ;
      }
    }
  }

  res.render("course", {
    courseName: "CHN_102",
    courseObject: CHN_102,
    filesArray: filesArray
  });
});

app.get("/CHN_104", function(req, res) {

  var filesArray = JSON.parse(JSON.stringify(CHN_104));
  for (var i = 0; i < filesArray.length - 1; i++) {
    for (var j = 0; j < filesArray.length - 1 - i; j++) {
      if (filesArray[j].numberOfDownloads < filesArray[j + 1].numberOfDownloads) {
        var fileAtJ = filesArray[j];
        filesArray[j] = filesArray[j + 1];
        filesArray[j + 1] = fileAtJ;
      }
    }
  }

  res.render("course", {
    courseName: "CHN_104",
    courseObject: CHN_104,
    filesArray: filesArray
  });
});

app.get("/EEN_112", function(req, res) {

  var filesArray = JSON.parse(JSON.stringify(EEN_112));
  for (var i = 0; i < filesArray.length - 1; i++) {
    for (var j = 0; j < filesArray.length - 1 - i; j++) {
      if (filesArray[j].numberOfDownloads < filesArray[j + 1].numberOfDownloads) {
        var fileAtJ = filesArray[j];
        filesArray[j] = filesArray[j + 1];
        filesArray[j + 1] = fileAtJ;
      }
    }
  }

  res.render("course", {
    courseName: "EEN_112",
    courseObject: EEN_112,
    filesArray: filesArray
  });
});




app.get("/:courseName/:fileName", function(req, res) {
  var fileName = req.params.fileName;
  var courseName = req.params.courseName;

  if (courseName == "CHN_102") {
    CHN_102.forEach(function(file) {
      if (file.name == fileName) {
        file.numberOfDownloads++;
      }
    });
  } else if (courseName == "CHN_104") {
    CHN_104.forEach(function(file) {
      if (file.name == fileName) {
        file.numberOfDownloads++;
      }
    });
  } else if (courseName == "EEN_112") {
    EEN_112.forEach(function(file) {
      if (file.name == fileName) {
        file.numberOfDownloads++;
      }
    });
  }

  res.download(__dirname + "/allFiles/" + fileName, fileName);
});

app.get("/add", function(req, res) {
  res.render("add");
});

app.post("/add", function(req, res) {
  var file = req.files.filename;
  var filename = file.name;
  file.mv(__dirname + "/allFiles/" + filename, function(err) {
    var courseName = req.body.courseName;

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    newFile = {
      name: filename,
      numberOfDownloads: 0,
      date: today
    }
    if (courseName == "CHN_102") {
      CHN_102.push(newFile);
    } else if (courseName == "CHN_104") {
      CHN_104.push(newFile);
    } else if (courseName == "EEN_112") {
      EEN_112.push(newFile);
    }
    res.redirect("/" + courseName);
  });
});

app.listen(process.env.PORT || 4444, function() {
  console.log("Server started on port 4444...");
});
