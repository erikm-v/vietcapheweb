// VietCaPhe contact form backend. Paste this into Google Apps Script and deploy it as a web app.
// Every submission is emailed to TO and, when the script is attached to a Google Sheet, added as a row.

const TO = "info@vietcaphe.com.au";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Hidden field that only bots fill in.
    if (data.website) return json({ ok: true });

    const name = clean(data.name, 200);
    const business = clean(data.business, 200);
    const email = clean(data.email, 200);
    const role = clean(data.role, 100);
    const message = clean(data.message, 5000);
    const interests = Array.isArray(data.interests)
      ? data.interests.map(function (i) { return clean(i, 100); }).join(", ")
      : "";

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, error: "Missing name or a valid email" });
    }

    const subject = clean(data.subject, 200) || "Website enquiry: " + (business || name);
    const body = [
      "Name: " + name,
      business ? "Business: " + business : null,
      "Email: " + email,
      "I am a: " + role,
      interests ? "Interested in: " + interests : null,
      "",
      message,
    ].filter(function (l) { return l !== null; }).join("\n");

    MailApp.sendEmail({ to: TO, replyTo: email, name: "VietCaPhe website", subject: subject, body: body });

    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    if (sheet) {
      const tab = sheet.getSheets()[0];
      if (tab.getLastRow() === 0) {
        tab.appendRow(["Received", "Name", "Business", "Email", "Role", "Interests", "Message"]);
      }
      tab.appendRow([new Date(), name, business, email, role, interests, message]);
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({ ok: true, status: "VietCaPhe contact form is live" });
}

// Run this once from the editor to grant the email permission and check delivery.
function testSetup() {
  MailApp.sendEmail(TO, "VietCaPhe form test", "Google Apps Script can send email to this address.");
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function clean(value, max) {
  return value == null ? "" : String(value).trim().slice(0, max);
}
