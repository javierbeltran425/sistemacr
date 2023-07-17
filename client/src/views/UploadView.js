import React, { useMemo, useState, useEffect } from "react";
import Table from "../components/Table";
import "../styles/Table.css";
import Layout from "../components/layout/Layout";
import {csv} from "csvtojson";

function Upload() {

  const [data, setData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [jsonArray, setJsonArray] = useState([]);
  let files;
  //let jsonArray;
  let enableButton = true;
  
  

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

String.prototype.pick = function(min, max) {
    var n, chars = '';

    if (typeof max === 'undefined') {
        n = min;
    } else {
        n = min + Math.floor(Math.random() * (max - min + 1));
    }

    for (var i = 0; i < n; i++) {
        chars += this.charAt(Math.floor(Math.random() * this.length));
    }

    return chars;
};


String.prototype.shuffle = function() {
  var array = this.split('');
  var tmp, current, top = array.length;

  if (top) while (--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
  }

  return array.join('');
};

function generateStartingPass(){
  let lowercase = 'abcdefghijklmnopqrstuvwxyz';
  let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let numbers = '0123456789';

  let all = lowercase + uppercase + numbers;

  let password = '';
  password += lowercase.pick(1);
  password += uppercase.pick(1);
  password += all.pick(4);
  password += numbers.pick(1);
  password = password.shuffle();

  return password;
}


function mergeCSVs(csv){
  for(let i = 1; i < csv.length; i++) {
    const [, ...spl] = csv[i].split("\n");
   csv[i] = spl.join("\n");
}

  const result = csv.join("\n"); 
  
  return result;
}

async function sendJson(){


  let data = jsonArray.map(({ CARNET, NOMBRES, COD_CARRERA, COD_MATERIA, COD_CLAVE, rol, email }) => ({id_usuario: CARNET, nombre: NOMBRES, id_carrera: COD_CARRERA, id_materia: COD_MATERIA, id_seccion: (COD_MATERIA + COD_CLAVE),  rol: rol, email: email}));

  for(let i = 0; i < data.length; i++) {
    data[i].hashed_password = generateStartingPass();
  }

  console.log(data);
  console.log(typeof JSON.stringify(data));

 try {
    const resp = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/usuarios/bulkcreateusuario`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (resp.status === 200) {
      window.alert("Alumnos importados exitosamente.");
    }
    
  } catch (error) {
    console.error("Error: ", error);
  }
}

async function showImport(theData){
  let jsonVar = await csv().fromString(theData);
 
  for(let i = 0; i < jsonVar.length; i++) {
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
      let filePromise = new Promise(resolve => {
          let reader = new FileReader();
          reader.readAsText(file);
          reader.onload = () => resolve(reader.result);
      });
      promises.push(filePromise);
  }
  
  Promise.all(promises).then(fileContents => {
   result = mergeCSVs(fileContents).split(/\r?\n/)
    .filter(line => line.trim() !== "")
    .join("\n"); 

    showImport(result);
   
})

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
        <input type="file" onChange ={readFile} multiple="multiple" id="fileUpload"/>
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
          <input type="checkbox" id="purge"/>
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
