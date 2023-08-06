require("dotenv").config();
const express = require("express");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const cors = require("cors");

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.all("/", (req, res) => res.send(`API Works`));
doc
  .useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  })
  .then(async () => {
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    const headerValues = {
      SERIAL: "Serial_Number",
      DATE: "Date",
      TOWN: "Town",
      FROM: "From",
      TO: "To",
      KM: "KM",
      TICKET_FARE: "Ticket FARE 1.6",
      LODGING_HOTAL: "Lodging HOTAL",
      DA: "DA",
      TOTAL: "Par Day Total",
    };
    await sheet.setHeaderRow(Object.values(headerValues));

    app.post("/v1/sheet", async (req, res) => {
      const body = Object.keys(req.body);
      const data = { Serial_Number: String(rows.length + 1) };
      for (let i = 0; i < body.length; i++) {
        const key = body[i];
        if (headerValues[key]) {
          data[headerValues[key]] = req.body[key];
        }
      }
      const row = await sheet.addRow(data, {
        insert: true,
      });
      return res.status(200).json({
        index: row?.rowIndex,
      });
    });

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`App started on port: ${PORT} 🚀`);
    });
  });
