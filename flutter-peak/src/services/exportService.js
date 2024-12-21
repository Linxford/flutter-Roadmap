import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table, TableRow, TableCell } from 'docx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart } from 'chart.js/auto';

// Register autoTable with jsPDF
jsPDF.API.autoTable = autoTable;

export const exportToExcel = (data, filename = 'export') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToCSV = (data, filename = 'export') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};

export const exportToPDF = (data, columns, filename = 'export') => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text(filename, 14, 15);

  // Add timestamp
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

  doc.autoTable({
    head: [columns.map(col => col.header)],
    body: data.map(item => columns.map(col => item[col.key])),
    startY: 30,
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineColor: [100, 255, 218],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [0, 71, 161],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  doc.save(`${filename}.pdf`);
};

export const exportToWord = async (data, columns, filename = 'export') => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: filename,
          heading: 'Heading1',
        }),
        new Paragraph({
          text: `Generated on: ${new Date().toLocaleString()}`,
          spacing: { before: 400 },
        }),
        new Table({
          rows: [
            new TableRow({
              children: columns.map(col =>
                new TableCell({
                  children: [new Paragraph({ text: col.header })],
                  shading: { fill: '0D47A1', color: 'FFFFFF' },
                })
              ),
            }),
            ...data.map(item =>
              new TableRow({
                children: columns.map(col =>
                  new TableCell({
                    children: [new Paragraph({ text: String(item[col.key]) })],
                  })
                ),
              })
            ),
          ],
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
};

export const generateChartImage = async (chartData, type = 'bar') => {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');

  new Chart(ctx, {
    type,
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: chartData.title || '' },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });

  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob));
  });
};
