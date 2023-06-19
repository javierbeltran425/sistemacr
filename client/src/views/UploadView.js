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
  let files;
  let pResults;
 

  const columns = useMemo(
    () => [
      {
        Header: "Detalles de Estudiantes",
        columns: [
          {
            Header: "Nombre",
            accessor: "name"
          },
          {
            Header: "Email",
            accessor: "email"
          },
          {
            Header: "Usuario",
            accessor: "username"
          },
          {
            Header: "Carrera",
            accessor: "company"
          },
          {
            Header: "Rol",
            accessor: "role"
          }
        ]
      }
    ],
    []
  );


async function createBulkUser(data){
    console.log(data);

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
        console.log("Ok!");
      }
    } catch (error) {
      console.error(error);
    }
  }

function mergeCSVs(csv){
  for(let i = 1; i < csv.length; i++) {
    const [, ...spl] = csv[i].split("\n");
   csv[i] = spl.join("\n");
}

  const result = csv.join("\n"); 

  return result;
}

async function sendJson(text){
  const jsonArray = await csv().fromString(text);
  console.log(jsonArray);
  try {
    const resp = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/usuarios/bulkcreateusuario`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonArray),
      }
    );

    if (resp.status === 200) {
      console.log("Ok!");
    }
    
  } catch (error) {
    console.error(error);
  }
}

async function readFile() {
  const fileInput = document.getElementById('fileUpload');
  files =  fileInput.files;
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
    .join("\n"); mergeCSVs(fileContents);

    sendJson(result);
   
})

  }

  return (
    <Layout>
  
<div className="w-full lg:px-6 pt-5">
  <h4>Importar Estudiantes</h4>

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
        <input type="file" multiple="multiple" id="fileUpload"/>
      </label>

      <button
        className="btn btn-success"
        onClick={readFile}
      >
        Upload
      </button>

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
