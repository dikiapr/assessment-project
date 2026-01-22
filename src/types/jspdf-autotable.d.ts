declare module "jspdf-autotable" {
  import { jsPDF } from "jspdf";

  interface UserOptions {
    startY?: number;
    head?: any[][];
    body?: any[][];
    theme?: "striped" | "grid" | "plain";
    headStyles?: any;
    bodyStyles?: any;
    styles?: any;
    columnStyles?: any;
    margin?:
      | number
      | { top?: number; right?: number; bottom?: number; left?: number };
    tableWidth?: "auto" | "wrap" | number;
    [key: string]: any;
  }

  function autoTable(doc: jsPDF, options: UserOptions): void;

  export default autoTable;
}
