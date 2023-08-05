import React, { useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import Table from "../components/Table";
import { csv } from "csvtojson";
import "../styles/Table.css";
const XLSX = require("xlsx");
import useAuth from "../hooks/useAuth";
import NetworkErrorHandler from "../components/NetworkErrorHandler";

function Upload() {
  const [currentFile, setCurrentFile] = useState(undefined);
  const [jsonArray, setJsonArray] = useState([]);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  const [networkErrorMessage, setNetworkErrorMessage] = useState("");

  const { auth } = useAuth();

  let files;

  const columns = useMemo(
    () => [
      {
        Header: "Detalles de Estudiantes",
        columns: [
          {
            Header: "Nombre",
            accessor: "NOMBRES",
          },
          {
            Header: "Email",
            accessor: "email",
          },
          {
            Header: "Carrera",
            accessor: "NBR_CARRERA",
          },
          {
            Header: "Rol",
            accessor: "rol",
          },
        ],
      },
    ],
    []
  );

  function updateProgressBar(startingWidth, maxWidth) {
    var element = document.getElementById("myprogressBar");
    var width = startingWidth;
    var identity = setInterval(scene, 10);
    function scene() {
      if (width >= maxWidth) {
        clearInterval(identity);
      } else {
        width++;
        element.style.width = width + "%";
      }
    }
  }

  function mergeCSVs(csv) {
    for (let i = 1; i < csv.length; i++) {
      const [, ...spl] = csv[i].split("\n");
      csv[i] = spl.join("\n");
    }

    const result = csv.join("\n");

    return result;
  }

  async function sendJson() {
    let data = jsonArray.map(
      ({
        CARNET,
        NOMBRES,
        COD_CARRERA,
        COD_MATERIA,
        COD_CLAVE,
        rol,
        email,
        name_1,
        NBR_CARRERA,
      }) => ({
        id_usuario: CARNET,
        nombre: NOMBRES,
        carrera: NBR_CARRERA,
        id_carrera: COD_CARRERA,
        id_materia: COD_MATERIA,
        num_seccion: COD_CLAVE,
        id_seccion: COD_MATERIA + COD_CLAVE,
        rol: rol,
        email: email,
        nombre_materia: name_1,
        hashed_password: CARNET,
      })
    );

    const purge = document.getElementById("purge").checked;

    const dataArr = [purge, data];

    let elementSuccess = document.getElementById("successText");
    elementSuccess.classList.add("hide");

    let elementFail = document.getElementById("failText");
    elementFail.classList.add("hide");

    let elementBar = document.getElementById("myprogressBar");
    elementBar.classList.add("progressBar");
    elementBar.classList.remove("red");

    updateProgressBar(1, 75);

    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/usuarios/bulkcreateusuario`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.accessToken,
          },
          body: JSON.stringify(dataArr),
        }
      );

      if (resp.status === 200) {
        let element = document.getElementById("successText");
        element.classList.remove("hide");

        let element2 = document.getElementById("failText");
        element2.classList.add("hide");

        let element1 = document.getElementById("myprogressBar");
        element1.classList.add("progressBar");
        element1.classList.remove("red");

        updateProgressBar(75, 100);
      }

      if (resp.status === 400) {
        let element = document.getElementById("failText");
        element.classList.remove("hide");

        let element2 = document.getElementById("successText");
        element2.classList.add("hide");

        let element1 = document.getElementById("myprogressBar");
        element1.classList.remove("progressBar");
        element1.classList.add("red");
      }
    } catch (error) {
      if (error.response && error.response.status) {
        setNetworkErrorMessage(error.response.status);
      } else {
        setNetworkErrorMessage('Error desconocido');
      }
    }
  }

  async function showImport(theData) {
    let jsonVar = await csv().fromString(theData);

    for (let i = 0; i < jsonVar.length; i++) {
      jsonVar[i].rol = "estudiante";
      jsonVar[i].email = jsonVar[i].CARNET + "@uca.edu.sv";
    }
    setJsonArray(jsonVar);
    setData(jsonVar);
    enableButton = false;
  }

  async function readFile() {
    const fileInput = document.getElementById("fileUpload");

    files = fileInput.files;
    let promises = [];
    let result;
    for (let file of files) {
      let fileType = file.name.split(".").pop().toLowerCase();
      if (fileType == "csv") {
        let filePromise = new Promise((resolve) => {
          let reader = new FileReader();
          reader.readAsText(file);
          reader.onload = () => resolve(reader.result);
        });

        promises.push(filePromise);
      } else if (fileType == "xlsx") {
        let workbook;
        let filePromise = new Promise((resolve) => {
          let reader = new FileReader();

          reader.onload = function (e) {
            var data = e.target.result;

            workbook = XLSX.read(data, { type: "binary" });

            workbook.SheetNames.forEach(function (y) {
              let csvFile = XLSX.utils.sheet_to_csv(workbook.Sheets[y]);

              resolve(csvFile);
            });
          };
          reader.readAsBinaryString(file);
        });

        promises.push(filePromise);
      } else {
        alert("Archivo de tipo incorrecto.");
      }
    }

    Promise.all(promises).then((fileContents) => {
      result = mergeCSVs(fileContents)
        .split(/\r?\n/)
        .filter((line) => line.trim() !== "")
        .join("\n");

      showImport(result);
    });
  }

  return (
    <Layout>
      <NetworkErrorHandler error={networkErrorMessage} setNetworkErrorMessage={setNetworkErrorMessage} />
      <div className="w-full lg:px-6 pt-5">
        <center>
          <h4>Importar Estudiantes</h4>
        </center>

        <div className="Upload">
          <div>
            {currentFile && (
              <div className="progress">
                <div
                  className="progress-bar progress-bar-info progress-bar-striped"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{ width: progress + "%" }}
                >
                  {progress}%
                </div>
              </div>
            )}

            <label className="btn btn-default">
              <input
                type="file"
                onChange={readFile}
                multiple="multiple"
                id="fileUpload"
              />
            </label>

            <button className="btn btn-success uploadButton" onClick={sendJson}>
              Importar
            </button>

            <br></br>

            <div className="container">
              <label className="switch" htmlFor="purge">
                <input type="checkbox" id="purge" />
                <div className="slider round"></div>
              </label>
            </div>

            <p> Purgar Información de Base de Datos </p>

            <br></br>

            <div className="alert alert-light" role="alert">
              {message}
            </div>
          </div>

          <br></br>

          <div id="Progress_Status">
            <div id="myprogressBar" className="progressBar"></div>
          </div>

          <p className="hide" id="successText">
            {" "}
            <b> Archivos importados exitosamente </b>
          </p>
          <p className="hide" id="failText">
            {" "}
            <b> Hubo un problema en el proceso de importado </b>
          </p>

          <br></br>

          <Table columns={columns} data={data} />
        </div>
      </div>
    </Layout>
  );
}

export default Upload;
