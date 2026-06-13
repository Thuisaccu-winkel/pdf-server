export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { html } = req.body;
    if (!html) return res.status(400).json({ error: "HTML is required" });

    const response = await fetch("https://chrome.browserless.io/pdf?token=2UhEn5KHCStZtsl30993056e6fe7df3cabbb934744491e314", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        html: html,
        options: {
          format: "A4",
          printBackground: true,
          margin: { top: "15mm", bottom: "15mm", left: "15mm", right: "15mm" }
        }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error("Browserless fout: " + response.status + " " + err);
    }

    const pdf = await response.arrayBuffer();
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(pdf));
  } catch (error) {
    console.error("PDF error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
