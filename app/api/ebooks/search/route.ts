import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  // This is where you would typically search the database
  // for ebooks that match the query.
  // For now, we'll just return a static list of ebooks.

  const ebooks = [
    {
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      publicationDate: "1954-07-29",
      description:
        "The Lord of the Rings is an epic high-fantasy novel written by English author and scholar J. R. R. Tolkien.",
      coverImage: "https://covers.openlibrary.org/b/id/8264479-L.jpg",
      rating: 4.5,
      availability: "Available",
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      publicationDate: "1937-09-21",
      description:
        "The Hobbit, or There and Back Again is a children's fantasy novel by English author J. R. R. Tolkien.",
      coverImage: "https://covers.openlibrary.org/b/id/8264479-L.jpg",
      rating: 4.5,
      availability: "Available",
    },
  ];

  const filteredEbooks = ebooks.filter((ebook) =>
    ebook.title.toLowerCase().includes(query?.toLowerCase() ?? "")
  );

  return NextResponse.json(filteredEbooks);
}
