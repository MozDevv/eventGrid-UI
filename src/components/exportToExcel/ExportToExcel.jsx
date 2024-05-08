import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import styles from "./export.module.css";

const ExportToExcel = ({ data, columns }) => {
  const downloadAsExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(dataBlob, "data.xlsx");
  };

  return (
    <button onClick={downloadAsExcel} className={styles.btn}>
      Export as Excel
    </button>
  );
};

export default ExportToExcel;
