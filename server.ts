import "dotenv/config";
import express, { Request, Response } from "express";
import EmailRenderer from "./EmailRenderer";
import { EmailTemplate } from "./utils/email-templates.interfaces";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Email rendering service is running");
});

app.post("/render", async (req: Request, res: Response) => {
  try {
    const { template, args } = req.body;

    if (!template || !Object.values(EmailTemplate).includes(template)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing template name",
        error: { code: "INVALID_INPUT" },
      });
    }

    const html = await EmailRenderer.render(template as EmailTemplate, args);

    res.status(200).send(html);
  } catch (error: any) {
    console.error("Render error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during rendering",
      error: {
        code: "RENDER_ERROR",
        message: error.message,
      },
    });
  }
});

app.listen(port, () => {
  console.log(`Email rendering service listening at http://localhost:${port}`);
});
