"use client";

import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function EbookPage() {
  // const [ebook, setEbook] = useState(null);
  // const [numPages, setNumPages] = useState(null);
  // const [pageNumber, setPageNumber] = useState(1);

  // useEffect(() => {
  //   async function getEbook() {
  //     const response = await fetch(`/api/ebooks/${params.id}`);
  //     const data = await response.json();
  //     setEbook(data);
  //   }

  //   getEbook();
  // }, [params.id]);

  // function onDocumentLoadSuccess({ numPages }) {
  //   setNumPages(numPages);
  // }

  // if (!ebook) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      Ebook
      {/* <h1>{ebook.title}</h1>
      <Document file={ebook.filePath} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p> */}
    </div>
  );
}
