#!/usr/bin/env python3
"""Generate the public, fillable Paper Foundation India membership form."""

from pathlib import Path
from textwrap import wrap

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "downloads" / "paper-foundation-membership-application.pdf"

INK = HexColor("#17382A")
GREEN = HexColor("#225C3E")
MOSS = HexColor("#597864")
CREAM = HexColor("#F7F1E6")
PAPER = HexColor("#FFFDF8")
TAN = HexColor("#D8CBB8")
RUST = HexColor("#A85F43")


def label(pdf: canvas.Canvas, text: str, x: float, y: float) -> None:
    pdf.setFillColor(MOSS)
    pdf.setFont("Helvetica-Bold", 6.5)
    pdf.drawString(x, y, text.upper())


def text_field(
    pdf: canvas.Canvas,
    name: str,
    title: str,
    x: float,
    y: float,
    width: float,
    height: float = 22,
    multiline: bool = False,
) -> None:
    label(pdf, title, x, y + height + 5)
    pdf.acroForm.textfield(
        name=name,
        tooltip=title,
        x=x,
        y=y,
        width=width,
        height=height,
        borderWidth=0.7,
        borderColor=TAN,
        fillColor=PAPER,
        textColor=INK,
        forceBorder=True,
        fontName="Helvetica",
        fontSize=8,
        fieldFlags=4096 if multiline else 0,
    )


def build() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    width, height = A4
    pdf = canvas.Canvas(str(OUTPUT), pagesize=A4)
    pdf.setTitle("Paper Foundation India Membership Application")
    pdf.setAuthor("Paper Foundation India")
    pdf.setSubject("Fillable membership application")

    pdf.setFillColor(CREAM)
    pdf.rect(0, 0, width, height, stroke=0, fill=1)

    pdf.setFillColor(INK)
    pdf.rect(0, height - 122, width, 122, stroke=0, fill=1)
    pdf.setFillColor(PAPER)
    pdf.setFont("Times-Bold", 24)
    pdf.drawString(38, height - 50, "PAPER FOUNDATION INDIA")
    pdf.setFont("Helvetica-Bold", 7)
    pdf.drawString(39, height - 67, "REGISTERED NO. 50 OF 2025")
    pdf.setFillColor(HexColor("#BFD5C4"))
    pdf.setFont("Helvetica", 7)
    pdf.drawString(39, height - 86, "1303, Tower 3, Godrej Tropical Isle, Sector 146, Noida, Uttar Pradesh 201301")
    pdf.drawString(39, height - 99, "info@paperfoundation.org.in  |  +91 81303 42146  |  paperfoundation.org.in")

    pdf.setFillColor(RUST)
    pdf.rect(width - 150, height - 122, 150, 122, stroke=0, fill=1)
    pdf.setFillColor(PAPER)
    pdf.setFont("Helvetica-Bold", 7)
    pdf.drawString(width - 128, height - 39, "MEMBERSHIP")
    pdf.setFont("Times-Bold", 22)
    pdf.drawString(width - 128, height - 67, "Application")
    pdf.setFont("Helvetica", 7)
    pdf.drawString(width - 128, height - 88, "Fill digitally or by hand.")
    pdf.drawString(width - 128, height - 100, "Save before uploading.")

    pdf.setFillColor(PAPER)
    pdf.roundRect(28, height - 205, width - 56, 62, 5, stroke=0, fill=1)
    pdf.setFillColor(GREEN)
    pdf.setFont("Helvetica-Bold", 7)
    pdf.drawString(42, height - 160, "WHY THE FOUNDATION EXISTS")
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica", 7.6)
    purpose = (
        "To improve public understanding of paper, encourage responsible use and recovery, "
        "and connect education, research, forestry, manufacturing, design and public life."
    )
    text = pdf.beginText(42, height - 176)
    text.setLeading(11)
    for line in wrap(purpose, width=102):
        text.textLine(line.strip())
    pdf.drawText(text)

    left = 38
    gap = 14
    col = (width - 76 - gap) / 2
    text_field(pdf, "full_name", "Full name", left, 574, col)
    text_field(pdf, "email", "Email", left + col + gap, 574, col)
    text_field(pdf, "mobile", "Mobile", left, 527, col)
    text_field(pdf, "profession", "Profession", left + col + gap, 527, col)
    text_field(pdf, "organisation", "Organisation", left, 480, col)
    text_field(pdf, "designation", "Designation", left + col + gap, 480, col)
    text_field(pdf, "postal_address", "Postal address", left, 419, width - 76, 35, True)
    text_field(
        pdf,
        "paper_association",
        "Your work, study or association with paper",
        left,
        342,
        width - 76,
        50,
        True,
    )
    text_field(
        pdf,
        "contribution",
        "What would you like to contribute to the Foundation?",
        left,
        265,
        width - 76,
        50,
        True,
    )

    pdf.setFillColor(PAPER)
    pdf.roundRect(28, 151, width - 56, 88, 5, stroke=0, fill=1)
    pdf.setFillColor(GREEN)
    pdf.setFont("Helvetica-Bold", 7)
    pdf.drawString(42, 220, "DECLARATION AND SIGNATURE")
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica", 7.2)
    pdf.drawString(42, 205, "I confirm that the information in this application is accurate and may be used to review my membership.")
    pdf.setStrokeColor(TAN)
    pdf.line(42, 174, 355, 174)
    pdf.line(385, 174, 535, 174)
    pdf.setFillColor(MOSS)
    pdf.setFont("Helvetica-Bold", 6.2)
    pdf.drawString(42, 161, "APPLICANT SIGNATURE  |  ADD A DIGITAL SIGNATURE IN YOUR PDF EDITOR")
    pdf.drawString(385, 161, "DATE")

    pdf.setFillColor(INK)
    pdf.rect(0, 0, width, 118, stroke=0, fill=1)
    pdf.setFillColor(PAPER)
    pdf.setFont("Helvetica-Bold", 7)
    pdf.drawString(38, 94, "FOR FOUNDATION USE")
    pdf.acroForm.checkbox(
        name="accepted",
        tooltip="Application accepted",
        x=39,
        y=64,
        size=12,
        borderWidth=0.8,
        borderColor=HexColor("#BFD5C4"),
        fillColor=INK,
        buttonStyle="check",
    )
    pdf.setFont("Helvetica", 7)
    pdf.drawString(57, 68, "Accepted")
    pdf.acroForm.checkbox(
        name="not_accepted",
        tooltip="Application not accepted",
        x=112,
        y=64,
        size=12,
        borderWidth=0.8,
        borderColor=HexColor("#BFD5C4"),
        fillColor=INK,
        buttonStyle="check",
    )
    pdf.drawString(130, 68, "Not accepted")
    pdf.setStrokeColor(HexColor("#7F9B86"))
    pdf.line(294, 68, 535, 68)
    pdf.setFillColor(HexColor("#BFD5C4"))
    pdf.setFont("Helvetica-Bold", 6.2)
    pdf.drawString(294, 54, "AUTHORISED SIGNATURE")
    pdf.setFont("Helvetica", 6)
    pdf.drawString(38, 28, "Privacy: application details are used only for membership review, administration and related correspondence.")

    pdf.save()
    print(OUTPUT)


if __name__ == "__main__":
    build()
