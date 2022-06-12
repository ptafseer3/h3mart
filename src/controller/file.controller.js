const uploadFile = require("../middleware/upload");
const fs = require("fs");
const baseUrl = "http://localhost:3000/files/";
const caller = require("./xl");
const writer = require("xlsx");
const upload = async (req, res) => {
  var data = [];
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    await caller()
      .then(async (res) => {
        await new Promise((resolve, reject) => setTimeout(resolve, 5000));

        data = res;
      })
      .then(() => {
        const workbook = writer.utils.json_to_sheet(data);
        const sheet = writer.utils.book_new();
        writer.utils.book_append_sheet(sheet, workbook, "sheet1");
        const file = writer.writeFile(
          sheet,
          "./resources/static/assets/uploads/response.xlsx"
        );
      });
    const fileName = "response.xlsx";
    const directoryPath = __basedir + "/resources/static/assets/uploads/";
    res.download(directoryPath + fileName, fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
    // res.status(200).send({
    //   message: "Uploaded the file successfully: " + req.file.originalname,
    // });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

const downloadFile = (fileName) => {
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

module.exports = {
  upload,
  getListFiles,
  download,
};
