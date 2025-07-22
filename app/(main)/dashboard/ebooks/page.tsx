"use client";

import { EbookCard } from "@/components/ebook-card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Ebook } from "@/lib/types/ebook";

export default function EbooksPage() {
  const [ebooks, setEbooks] = useState<{ ebook: Ebook}[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function searchEbooks() {
      const response = await fetch(`/api/ebooks/search?query=${query}`);
      const data = await response.json();
      setEbooks(data);
    }

    searchEbooks();
  }, [query]);

  return (
    <div>
      <Input
        type="text"
        placeholder="Search for ebooks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {ebooks.map((ebook) => (
          <EbookCard key={ebook.ebook.title} {...ebook.ebook} />
        ))}
      </div>
    </div>
  );
}
