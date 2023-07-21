import React, { useMemo, useState, useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import Table from "../components/Table";
import "../styles/Table.css";
import Layout from "../components/layout/Layout";
import { csv } from "csvtojson";
const XLSX = require('xlsx');

import ContextUsuario from "../context/ContextUsuario";

function Upload() {
  const contextUsuario = useContext(ContextUsuario)
  const [data, setData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [jsonArray, setJsonArray] = useState([]);
  const [cookies] = useCookies(null);

  let files;
  //let jsonArray;
  let enableButton = true;

  useEffect(() => {
    cookies.id_usuario === "" && navigate('/')
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: "Detalles de Estudiantes",
        columns: [
          {
            Header: "Nombre",
            accessor: "NOMBRES"
          },
          {
            Header: "Email",
            accessor: "email"
          },
          {
            Header: "Carrera",
            accessor: "NBR_CARRERA"
          },
          {
            Header: "Rol",
            accessor: "rol"
          }
        ]
      }
    ],
    []
  );

  function mergeCSVs(csv) {
    for (let i = 1; i < csv.length; i++) {
      const [, ...spl] = csv[i].split("\n");
      csv[i] = spl.join("\n");
    }

    const result = csv.join("\n");

    return result;
  }

  async function sendJson() {


    let data = jsonArray.map(({ CARNET, NOMBRES, COD_CARRERA, COD_MATERIA, COD_CLAVE, rol, email, name_1, NBR_CARRERA }) =>
    ({
      id_usuario: CARNET,
      nombre: NOMBRES,
      carrera: NBR_CARRERA,
      id_carrera: COD_CARRERA,
      id_materia: COD_MATERIA,
      num_seccion: COD_CLAVE,
      id_seccion: (COD_MATERIA + COD_CLAVE),
      rol: rol,
      email: email,
      nombre_materia: name_1,
      hashed_password: CARNET
    }));

    const purge = document.getElementById('purge').checked;

    const dataArr = [purge, data];

    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/usuarios/bulkcreateusuario`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataArr),
        }
      );

      if (resp.status === 200) {
        alert("Informacion Importada Exitosamente");
      }


    } catch (error) {
      console.error("Error: ", error);
      alert("Error: ", error);

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

    const fileInput = document.getElementById('fileUpload');

    files = fileInput.files;
    let promises = [];
    let result;
    for (let file of files) {
      let fileType = file.name.split('.').pop().toLowerCase();
      if (fileType == 'csv') {
        let filePromise = new Promise(resolve => {
          let reader = new FileReader();
          reader.readAsText(file);
          reader.onload = () => resolve(reader.result);
        });

        promises.push(filePromise);

      } else if (fileType == 'xlsx') {

        let workbook;
        let filePromise = new Promise((resolve) => {
          let reader = new FileReader();

          reader.onload = function (e) {
            var data = e.target.result;

            workbook = XLSX.read(data, { type: 'binary' });

            workbook.SheetNames.forEach(function (y) {
              let csvFile = XLSX.utils.sheet_to_csv(workbook.Sheets[y]);

              //let csvFileProcessed = '"' + csvFile.split(',').join('","') + '"';
              //csvFileProcessed = csvFileProcessed.split('\n').join('"\n"');

              resolve(csvFile);

            })

          }
          reader.readAsBinaryString(file);

        });

        promises.push(filePromise);

      } else {
        alert("Archivo de tipo incorrecto.")
      }

    }

    Promise.all(promises).then(fileContents => {

      result = mergeCSVs(fileContents).split(/\r?\n/)
        .filter(line => line.trim() !== "")
        .join("\n");

      console.log(result);

      showImport(result);

    });

  }

  return (
    <Layout>

      <div className="w-full lg:px-6 pt-5">
        <center><h4>Importar Estudiantes</h4></center>

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
              <input type="file" onChange={readFile} multiple="multiple" id="fileUpload" />
            </label>

            <button
              className="btn btn-success uploadButton"
              onClick={sendJson}
            >
              Importar
            </button>

            <br></br>

            <div className="container">
              <label className="switch" htmlFor="purge">
                <input type="checkbox" id="purge" />
                <div className="slider round"></div>
              </label>
            </div>

            <p> Purgar Estudiantes de Base de Datos </p>

            <br></br>

            <div className="alert alert-light" role="alert">
              {message}
            </div>
          </div>
          <Table columns={columns} data={data} />
        </div>
      </div>
    </Layout>
  );
}

export default Upload;
