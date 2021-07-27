const excel = require('excel4node');

const columnHeaders = ['Member Name', 'Time-In', 'Time-Out'];
const columnData = ['name', 'timeIn', 'timeOut'];

class ExcelUtil {

    generateExcelFile(records) {
        const wb = new excel.Workbook();
        const ws = wb.addWorksheet('Attendance');
        ws.column(1).setWidth(30);
        ws.column(2).setWidth(20);
        ws.column(3).setWidth(20);

        var headerStyle = wb.createStyle({
            font: {
              size: 14,
              bold: true
            },
            height: 20
        });

        columnHeaders.forEach((header, i) => {
            ws.cell(1, (i + 1))
            .string(header)
            .style(headerStyle);
        });

        let ctr = 1;
        records.forEach((record) => {  
            ctr++;
            columnData.forEach((key, i) => {
                ws.cell(ctr, (i + 1))
                .string(record[key]);
            });
        });

        return wb;
    }
}

module.exports = new ExcelUtil();