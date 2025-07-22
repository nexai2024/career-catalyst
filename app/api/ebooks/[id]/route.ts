import { NextResponse } from "next/server";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) 
  {
  // This is where you would typically fetch the ebook from the database.
  // For now, we'll just return a static ebook.

  const ebook = {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    publicationDate: "1954-07-29",
    description:
      "The Lord of the Rings is an epic high-fantasy novel written by English author and scholar J. R. R. Tolkien.",
    coverImage: "https://covers.openlibrary.org/b/id/8264479-L.jpg",
    filePath: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    rating: 4.5,
    availability: "Available",
  };

  return NextResponse.json(ebook);
}
