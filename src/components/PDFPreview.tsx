"use client";

interface PDFPreviewProps {
  fileUrl: string;
  fileName?: string;
}

export default function PDFPreview({
  fileUrl,
  fileName = "Dokumen",
}: PDFPreviewProps) {
  return (
    <div className="rounded-lg overflow-hidden shadow-md border border-gray-200 h-full flex flex-col">
      <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
        <p className="text-base font-semibold text-gray-700">📄 {fileName}</p>
      </div>
      <iframe
        src={`${fileUrl}#toolbar=1&navpanes=0&scrollbar=1`}
        className="w-full border-none flex-1"
        style={{ minHeight: "600px" }}
        title={fileName}
      />
    </div>
  );
}
