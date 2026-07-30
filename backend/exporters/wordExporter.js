// backend/exporters/wordExporter.js — ABSLAMC-format JD with logo

import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
  WidthType,
  BorderStyle,
  ImageRun,
} from "docx";

import fs from "fs";

import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const LOGO_PATH = path.join(__dirname, "..", "assets", "logo.jpg");

const thinBorder = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "999999" },

  bottom: { style: BorderStyle.SINGLE, size: 4, color: "999999" },

  left: { style: BorderStyle.SINGLE, size: 4, color: "999999" },

  right: { style: BorderStyle.SINGLE, size: 4, color: "999999" },

  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "999999" },

  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
};

const P = (text, opts = {}) =>
  new Paragraph({
    children: [
      new TextRun({ text: String(text == null ? "" : text), ...opts }),
    ],

    spacing: { after: opts.after || 80 },
  });

const bullet = (text, bold = false) =>
  new Paragraph({
    children: [new TextRun({ text: String(text || ""), bold })],

    bullet: { level: 0 },

    spacing: { after: 60 },
  });

const cellText = (text, opts = {}) =>
  new TableCell({
    children: [P(text, opts)],

    shading: opts.shading ? { fill: opts.shading } : undefined,

    columnSpan: opts.colSpan || undefined,

    width: opts.width,
  });

const labelCell = (text, colSpan) =>
  new TableCell({
    children: [P(text, { bold: true })],

    shading: { fill: "F2F2F2" },

    columnSpan: colSpan || undefined,
  });

const sectionBar = (text) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },

    borders: thinBorder,

    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [P(text, { bold: true })],

            shading: { fill: "E8E8E8" },
          }),
        ],
      }),
    ],
  });

const spacer = () => new Paragraph({ spacing: { after: 120 }, children: [] });

function buildLogo() {
  try {
    if (fs.existsSync(LOGO_PATH)) {
      const data = fs.readFileSync(LOGO_PATH);

      return new Paragraph({
        alignment: AlignmentType.LEFT,

        children: [
          new ImageRun({
            data,

            transformation: { width: 170, height: 75 },
          }),
        ],

        spacing: { after: 120 },
      });
    }
  } catch (e) {
    console.warn("Logo not loaded:", e.message);
  }

  return new Paragraph({
    children: [
      new TextRun({
        text: "ADITYA BIRLA GROUP",
        bold: true,
        size: 28,
        color: "8B0000",
      }),
    ],

    spacing: { after: 120 },
  });
}

function buildBasicDetails(b) {
  const rows = [];

  const fullRow = (label, value) =>
    new TableRow({
      children: [labelCell(label), cellText(value, { colSpan: 3 })],
    });

  const pairRow = (l1, v1, l2, v2) =>
    new TableRow({
      children: [labelCell(l1), cellText(v1), labelCell(l2), cellText(v2)],
    });

  rows.push(fullRow("Business", b.business));

  rows.push(fullRow("Unit", b.unit));

  rows.push(fullRow("Location", b.location));

  rows.push(
    pairRow(
      "Poornata Position Number of the job",
      b.positionNumber,
      "Reports to: Poornata Position Number",
      b.reportsToNumber,
    ),
  );

  rows.push(
    pairRow(
      "Poornata Position Title of the job",
      b.positionTitle,
      "Reports to: Poornata Position Title",
      b.reportsToTitle,
    ),
  );

  rows.push(
    pairRow(
      "Function",
      b.function,
      "Reports to: Function",
      b.reportsToFunction,
    ),
  );

  rows.push(
    pairRow(
      "Department",
      b.department,
      "Reports to: Department",
      b.reportsToDepartment,
    ),
  );

  rows.push(
    pairRow(
      "Designation of the Employee",
      b.designation,
      "Designation of the Manager",
      b.managerDesignation,
    ),
  );

  rows.push(fullRow("Date of writing/updation of JD", b.date));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: thinBorder,
    rows,
  });
}

function buildDimensions(dimensions, prevLabel, currLabel) {
  const header = new TableRow({
    tableHeader: true,

    children: [
      labelCell("S. No"),

      labelCell("Dimension"),

      labelCell(prevLabel),

      labelCell(currLabel),

      labelCell("Remarks"),
    ],
  });

  const rows = [header];

  (dimensions || []).forEach((d, i) => {
    rows.push(
      new TableRow({
        children: [
          cellText(d.sNo || String(i + 1)),

          cellText(d.name),

          cellText(d.fyPrevious),

          cellText(d.fyCurrent),

          cellText(d.remarks),
        ],
      }),
    );
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: thinBorder,
    rows,
  });
}

function buildAccountabilities(accountabilities) {
  const header = new TableRow({
    tableHeader: true,

    children: [
      new TableCell({
        children: [P("Accountability", { bold: true })],
        shading: { fill: "F2F2F2" },
        width: { size: 30, type: WidthType.PERCENTAGE },
      }),

      new TableCell({
        children: [P("Supporting Actions", { bold: true })],
        shading: { fill: "F2F2F2" },
        width: { size: 70, type: WidthType.PERCENTAGE },
      }),
    ],
  });

  const rows = [header];

  (accountabilities || []).forEach((a) => {
    const actions = (a.actions || []).map((act) => bullet(act));

    rows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [P(a.accountability, { bold: true })],
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),

          new TableCell({
            children: actions.length ? actions : [P("")],
            width: { size: 70, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
    );
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: thinBorder,
    rows,
  });
}

function buildRelationships(rel) {
  const r = rel || { internal: [], external: [] };

  const rows = [];

  rows.push(
    new TableRow({
      tableHeader: true,

      children: [
        labelCell("Relationship Type"),
        labelCell("Frequency"),
        labelCell("Nature"),
      ],
    }),
  );

  rows.push(
    new TableRow({
      children: [
        new TableCell({
          children: [P("Internal", { bold: true })],
          shading: { fill: "F2F2F2" },
          columnSpan: 3,
        }),
      ],
    }),
  );

  (r.internal || []).forEach((x) => {
    rows.push(
      new TableRow({
        children: [cellText(x.type), cellText(x.frequency), cellText(x.nature)],
      }),
    );
  });

  rows.push(
    new TableRow({
      children: [
        new TableCell({
          children: [P("External", { bold: true })],
          shading: { fill: "F2F2F2" },
          columnSpan: 3,
        }),
      ],
    }),
  );

  (r.external || []).forEach((x) => {
    rows.push(
      new TableRow({
        children: [cellText(x.type), cellText(x.frequency), cellText(x.nature)],
      }),
    );
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: thinBorder,
    rows,
  });
}

function buildSignOff(so) {
  const s = so || {};

  const rows = [
    new TableRow({
      children: [
        new TableCell({
          children: [P("SIGN-OFF:", { bold: true })],
          columnSpan: 3,
          shading: { fill: "E8E8E8" },
        }),
      ],
    }),

    new TableRow({
      children: [labelCell("Signature"), cellText(s.signature, { colSpan: 2 })],
    }),

    new TableRow({
      children: [labelCell("Name"), cellText(s.name, { colSpan: 2 })],
    }),

    new TableRow({
      children: [labelCell("Date"), cellText(s.date, { colSpan: 2 })],
    }),

    new TableRow({
      children: [
        new TableCell({
          children: [P("Job Analyst", { bold: true })],
          columnSpan: 3,
          shading: { fill: "F2F2F2" },
        }),
      ],
    }),

    new TableRow({
      children: [
        labelCell("Signature"),
        cellText(s.analystSignature, { colSpan: 2 }),
      ],
    }),

    new TableRow({
      children: [labelCell("Name"), cellText(s.analystName, { colSpan: 2 })],
    }),
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: thinBorder,
    rows,
  });
}

function splitLines(text) {
  if (!text) return [];

  return String(text)
    .split(/\n+/)

    .map((s) =>
      s
        .replace(/^\s*[\d]+[\.\)]\s*/, "")
        .replace(/^[-•]\s*/, "")
        .trim(),
    )

    .filter(Boolean);
}

export async function buildJDDocx(jd, generated) {
  const wd = (jd && jd.wizardData) || {};

  const b = wd.basic || {};

  const g = generated || {};

  const now = new Date();

  const yr = now.getFullYear();

  const prevLabel =
    "FY " + (yr - 1).toString().slice(2) + "-" + yr.toString().slice(2);

  const currLabel =
    "FY " + yr.toString().slice(2) + "-" + (yr + 1).toString().slice(2);

  const directReports = g.directReports || [];

  const children = [
    buildLogo(),

    new Paragraph({
      children: [
        new TextRun({ text: "Job Description", bold: true, size: 28 }),
      ],

      spacing: { after: 200 },
    }),

    sectionBar("Basic Details:"),

    spacer(),

    buildBasicDetails(b),

    spacer(),

    sectionBar("1)  Job Purpose:"),

    spacer(),

    P(g.jobPurpose || wd.jobPurpose || ""),

    spacer(),

    sectionBar("2)  Dimensions:"),

    spacer(),

    buildDimensions(wd.dimensions, prevLabel, currLabel),

    spacer(),

    sectionBar("3)  Job Context & Major Challenges:"),

    spacer(),

    P("Organisation Context", { bold: true, underline: {} }),

    P(g.orgContext || wd.orgContext || ""),

    spacer(),

    P("Job Context", { bold: true, underline: {} }),

    ...splitLines(g.jobContext || wd.jobContext).map((t) => bullet(t)),

    spacer(),

    P("Key Challenges for the role are as follows:", {
      bold: true,
      underline: {},
    }),

    ...splitLines(g.challenges).map((t) => bullet(t, true)),

    spacer(),

    sectionBar("4)  Principal Accountabilities"),

    spacer(),

    buildAccountabilities(g.accountabilities),

    spacer(),

    sectionBar("5)  Job Purpose of Direct Reports:"),

    spacer(),

    ...(directReports.length > 0
      ? directReports.map(
          (dr) =>
            new Paragraph({
              children: [
                new TextRun({ text: (dr.role || "") + " – ", bold: true }),

                new TextRun(dr.purpose || ""),
              ],

              spacing: { after: 100 },
            }),
        )
      : [
          P(
            wd.hasNoReportees
              ? "Individual Contributor role — no direct reports."
              : "",
          ),
        ]),

    spacer(),

    sectionBar("6)  Relationships:"),

    spacer(),

    buildRelationships(wd.relationships),

    spacer(),

    sectionBar("7)  Organizational Relationships (If Applicable) –"),

    spacer(),

    P(wd.orgRelationships || ""),

    spacer(),

    buildSignOff(wd.signOff),
  ];

  const doc = new Document({
    creator: "JAE JD Creator",

    title: (b.designation || "JD") + " - " + (b.lob || ""),

    sections: [{ properties: {}, children }],
  });

  return Packer.toBuffer(doc);
}
