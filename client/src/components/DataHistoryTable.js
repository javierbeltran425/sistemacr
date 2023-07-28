import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { InputText } from "primereact/inputtext";

export default function ExportDemo(props) {
  const [products, setProducts] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const dt = useRef(null);

  useEffect(() => {
    props.historyData && setProducts(props.historyData);
  }, [props.historyData]);

  const cols = [
    { field: "nombreAlumno", header: "Nombre del alumno" },
    { field: "correoAlumno", header: "Correo del alumno" },
    { field: "nombreMateria", header: "Materia" },
    { field: "seccion", header: "Seccion" },
    { field: "titulo", header: "Titulo" },
    { field: "descripcion", header: "Descripción" },
    { field: "tipo", header: "Tipo" },
    { field: "estado", header: "Estado" },
  ];

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0);

        doc.autoTable(exportColumns, products);
        doc.save("products.pdf");
      });
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(products);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "products");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  const header = (
    <div className="flex flex-column md:flex-row align-items-center justify-content-end gap-2">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Filtrar..."
        />
      </span>
      <div className="flex gap-2">
        <Button
          type="button"
          icon="pi pi-file"
          rounded
          onClick={() => exportCSV(false)}
          data-pr-tooltip="CSV"
        />
        <Button
          type="button"
          icon="pi pi-file-excel"
          severity="success"
          rounded
          onClick={exportExcel}
          data-pr-tooltip="XLS"
        />
        <Button
          type="button"
          icon="pi pi-file-pdf"
          severity="warning"
          rounded
          onClick={exportPdf}
          data-pr-tooltip="PDF"
        />
      </div>
    </div>
  );

  return (
    <div className="card">
      <Tooltip target=".export-buttons>button" position="bottom" />

      <DataTable
        globalFilter={globalFilter}
        ref={dt}
        value={products}
        header={header}
        tableStyle={{ minWidth: "50rem" }}
      >
        {cols.map((col, index) => (
          <Column key={index} field={col.field} header={col.header} />
        ))}
      </DataTable>
    </div>
  );
}
