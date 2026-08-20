import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

export interface PdfMeta {
  title: string;
  subtitle?: string;
  classification?: string;
  preparedBy?: string;
  generatedAt?: Date;
}

const PAGE_W = 595.28; // A4 width in points
const PAGE_H = 841.89; // A4 height in points
const MARGIN = 36;
const CONTENT_W = PAGE_W - MARGIN * 2;
const HEADER_H = 26;
const FOOTER_H = 24;

/**
 * Captures a report section into a PNG image.
 */
async function captureSection(
  element: HTMLElement
): Promise<{
  dataUrl: string;
  width: number;
  height: number;
} | null> {
  if (
    !element ||
    element.offsetWidth === 0 ||
    element.offsetHeight === 0
  ) {
    return null;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: Math.min(2, window.devicePixelRatio || 1.5),
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });

    if (canvas.width <= 0 || canvas.height <= 0) {
      return null;
    }

    return {
      dataUrl: canvas.toDataURL("image/png"),
      width: canvas.width,
      height: canvas.height,
    };
  } catch (error) {
    console.error("Failed to capture PDF section:", error);
    return null;
  }
}

/**
 * Loads an image from a data URL.
 */
function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);

    image.onerror = () => {
      reject(new Error("Failed to load captured PDF image."));
    };

    image.src = dataUrl;
  });
}

/**
 * Creates a vertical slice of a captured section.
 */
async function createImageSlice(
  dataUrl: string,
  sourceWidth: number,
  sourceOffsetPx: number,
  sliceHeightPx: number
): Promise<HTMLCanvasElement> {
  const image = await loadImage(dataUrl);

  const canvas = document.createElement("canvas");

  canvas.width = sourceWidth;
  canvas.height = Math.max(1, Math.round(sliceHeightPx));

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create canvas context.");
  }

  context.drawImage(
    image,
    0,
    sourceOffsetPx,
    sourceWidth,
    canvas.height,
    0,
    0,
    sourceWidth,
    canvas.height
  );

  return canvas;
}

/**
 * Draws the running header and footer on content pages.
 */
function drawRunningHeader(
  pdf: jsPDF,
  meta: PdfMeta,
  pageNumber: number,
  totalContentPages: number
) {
  // Header separator
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.75);

  pdf.line(
    MARGIN,
    MARGIN + HEADER_H - 8,
    PAGE_W - MARGIN,
    MARGIN + HEADER_H - 8
  );

  // Report title
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8.5);
  pdf.setTextColor(38, 38, 47);

  pdf.text(
    meta.title,
    MARGIN,
    MARGIN + 8
  );

  // Classification
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);

  pdf.text(
    meta.classification || "Internal Use Only",
    PAGE_W - MARGIN,
    MARGIN + 8,
    {
      align: "right",
    }
  );

  // Footer separator
  pdf.setDrawColor(226, 232, 240);

  pdf.line(
    MARGIN,
    PAGE_H - MARGIN - FOOTER_H + 10,
    PAGE_W - MARGIN,
    PAGE_H - MARGIN - FOOTER_H + 10
  );

  // Generated date
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7.5);
  pdf.setTextColor(148, 163, 184);

  pdf.text(
    `Generated ${(meta.generatedAt || new Date()).toLocaleString()}`,
    MARGIN,
    PAGE_H - MARGIN - 4
  );

  // Page number
  pdf.text(
    `Page ${pageNumber} of ${totalContentPages}`,
    PAGE_W - MARGIN,
    PAGE_H - MARGIN - 4,
    {
      align: "right",
    }
  );
}

/**
 * Draws the PDF cover page.
 */
function drawCoverPage(
  pdf: jsPDF,
  meta: PdfMeta
) {
  // Background
  pdf.setFillColor(38, 38, 47);
  pdf.rect(
    0,
    0,
    PAGE_W,
    PAGE_H,
    "F"
  );

  // Application name
  pdf.setTextColor(116, 201, 72);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);

  pdf.text(
    "IS-AUDIT",
    MARGIN,
    120
  );

  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(26);

  const titleLines = pdf.splitTextToSize(
    meta.title,
    CONTENT_W
  );

  pdf.text(
    titleLines,
    MARGIN,
    160
  );

  // Subtitle
  if (meta.subtitle) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(203, 213, 225);

    pdf.text(
      meta.subtitle,
      MARGIN,
      160 + titleLines.length * 30 + 14
    );
  }

  // Metadata separator
  pdf.setDrawColor(70, 70, 82);
  pdf.setLineWidth(1);

  pdf.line(
    MARGIN,
    PAGE_H - 150,
    PAGE_W - MARGIN,
    PAGE_H - 150
  );

  // Metadata
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9.5);

  let y = PAGE_H - 128;

  const drawRow = (
    label: string,
    value: string
  ) => {
    pdf.setTextColor(148, 163, 184);

    pdf.text(
      label.toUpperCase(),
      MARGIN,
      y
    );

    pdf.setTextColor(255, 255, 255);

    pdf.text(
      value,
      MARGIN + 130,
      y
    );

    y += 18;
  };

  drawRow(
    "Classification",
    meta.classification || "Internal Use Only"
  );

  drawRow(
    "Prepared by",
    meta.preparedBy || "IS-Audit System"
  );

  drawRow(
    "Generated",
    (meta.generatedAt || new Date()).toLocaleString()
  );
}

/**
 * Exports all elements marked with:
 *
 * data-pdf-section
 *
 * into a downloadable A4 PDF.
 */
export async function exportSectionsToPdf(
  root: HTMLElement,
  meta: PdfMeta,
  filename: string
): Promise<void> {
  if (!root) {
    throw new Error(
      "PDF export failed: report root element was not found."
    );
  }

  const sections = Array.from(
    root.querySelectorAll<HTMLElement>(
      "[data-pdf-section]"
    )
  );

  if (sections.length === 0) {
    throw new Error(
      "Nothing to export — no report sections found."
    );
  }

  // Create PDF
  const pdf = new jsPDF({
    unit: "pt",
    format: "a4",
    compress: true,
  });

  // -------------------------------------------------------------------------
  // Cover page
  // -------------------------------------------------------------------------

  drawCoverPage(pdf, meta);

  // -------------------------------------------------------------------------
  // Content page dimensions
  // -------------------------------------------------------------------------

  const usableTop =
    MARGIN + HEADER_H + 6;

  const usableBottom =
    PAGE_H - MARGIN - FOOTER_H - 4;

  const usableHeight =
    usableBottom - usableTop;

  let cursorY = usableTop;

  let hasContentPage = false;

  /**
   * Creates a new content page.
   */
  const addContentPage = () => {
    pdf.addPage();

    hasContentPage = true;
    cursorY = usableTop;
  };

  // -------------------------------------------------------------------------
  // Render sections
  // -------------------------------------------------------------------------

  for (const section of sections) {
    const captured = await captureSection(section);

    if (!captured) {
      console.warn(
        "Skipping section because it could not be captured:",
        section
      );

      continue;
    }

    const imageHeight =
      (captured.height * CONTENT_W) /
      captured.width;

    if (
      !Number.isFinite(imageHeight) ||
      imageHeight <= 0
    ) {
      console.warn(
        "Skipping section with invalid dimensions."
      );

      continue;
    }

    // Create first content page.
    if (!hasContentPage) {
      addContentPage();
    }

    // -----------------------------------------------------------------------
    // Section fits completely on a page
    // -----------------------------------------------------------------------

    if (imageHeight <= usableHeight) {
      const remainingSpace =
        usableBottom - cursorY;

      if (
        imageHeight > remainingSpace &&
        cursorY > usableTop
      ) {
        addContentPage();
      }

      pdf.addImage(
        captured.dataUrl,
        "PNG",
        MARGIN,
        cursorY,
        CONTENT_W,
        imageHeight,
        undefined,
        "FAST"
      );

      cursorY += imageHeight + 14;

      continue;
    }

    // -----------------------------------------------------------------------
    // Section is larger than a single page
    // -----------------------------------------------------------------------

    let remainingHeight =
      imageHeight;

    let sourceOffsetPx = 0;

    const pixelsPerPoint =
      captured.height / imageHeight;

    let firstSlice = true;

    while (
      remainingHeight > 0
    ) {
      if (!firstSlice) {
        addContentPage();
      }

      const sliceHeightPt =
        Math.min(
          usableHeight,
          remainingHeight
        );

      const requestedSliceHeightPx =
        Math.round(
          sliceHeightPt *
            pixelsPerPoint
        );

      const remainingPixels =
        captured.height -
        sourceOffsetPx;

      const sliceHeightPx =
        Math.min(
          requestedSliceHeightPx,
          remainingPixels
        );

      if (sliceHeightPx <= 0) {
        break;
      }

      try {
        const sliceCanvas =
          await createImageSlice(
            captured.dataUrl,
            captured.width,
            sourceOffsetPx,
            sliceHeightPx
          );

        const actualSliceHeightPt =
          sliceCanvas.height /
          pixelsPerPoint;

        pdf.addImage(
          sliceCanvas.toDataURL("image/png"),
          "PNG",
          MARGIN,
          cursorY,
          CONTENT_W,
          actualSliceHeightPt,
          undefined,
          "FAST"
        );

        sourceOffsetPx +=
          sliceCanvas.height;

        remainingHeight -=
          actualSliceHeightPt;

        cursorY +=
          actualSliceHeightPt + 14;
      } catch (error) {
        console.error(
          "Failed to render PDF section slice:",
          error
        );

        break;
      }

      firstSlice = false;
    }
  }

  // -------------------------------------------------------------------------
  // Add headers and footers
  // -------------------------------------------------------------------------

  /*
   * IMPORTANT:
   *
   * getNumberOfPages() belongs directly to the jsPDF instance.
   * It must NOT be accessed through pdf.internal.
   */
  const totalPages =
    pdf.getNumberOfPages();

  // Page 1 is the cover page.
  const totalContentPages =
    Math.max(0, totalPages - 1);

  for (
    let pageNumber = 2;
    pageNumber <= totalPages;
    pageNumber++
  ) {
    pdf.setPage(pageNumber);

    drawRunningHeader(
      pdf,
      meta,
      pageNumber - 1,
      totalContentPages
    );
  }

  // -------------------------------------------------------------------------
  // Save PDF
  // -------------------------------------------------------------------------

  pdf.save(filename);
}