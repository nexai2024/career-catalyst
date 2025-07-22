import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EbookCardProps {
  id: string;
  title: string;
  author: string;
  genre: string;
  publicationDate: string;
  description: string;
  coverImage: string;
  rating: number;
  availability: string;
}

export function EbookCard({
  id,
  title,
  author,
  genre,
  publicationDate,
  description,
  coverImage,
  rating,
  availability,
}: EbookCardProps) {
  async function borrowEbook() {
    await fetch("/api/ebooks/borrow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ebookId: id, userId: "1" }),
    });
  }

  async function purchaseEbook() {
    await fetch("/api/ebooks/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ebookId: id, userId: "1" }),
    });
  }

  return (
    <Card>
      <CardHeader>
        <img src={coverImage} alt={title} />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Author: {author}</p>
        <p>Genre: {genre}</p>
        <p>Publication Date: {publicationDate}</p>
        <p>Rating: {rating}</p>
        <p>Availability: {availability}</p>
        <p>{description}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={borrowEbook}>Borrow</Button>
        <Button onClick={purchaseEbook}>Purchase</Button>
      </CardFooter>
    </Card>
  );
}
