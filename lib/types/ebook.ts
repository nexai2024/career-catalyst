// types/ebooks.ts

/**
 * Represents an Ebook in the library.
 */
export interface Ebook {
    id: string;
    title: string;
    author: string;
    genre: string;
    publicationDate: string; // Prisma's DateTime maps to JavaScript Date object
    description: string;
    coverImage: string;
    filePath: string;
    rating: number; // Prisma's Float maps to JavaScript number
    availability: string;
    createdAt: Date;
    updatedAt: Date;
    // If you included relations (e.g., reviews EbookReview[], borrows EbookBorrow[]),
    // they would be included here as arrays of the respective types,
    // typically optional if they might not be loaded in all queries.
    // Example if relations were brought back:
    // reviews?: EbookReview[];
    // borrows?: EbookBorrow[];
  }
  
  /**
   * Represents a record of an Ebook being borrowed.
   */
  export interface EbookBorrow {
    id: string;
    ebookId: string; // Foreign key to Ebook
    userId: string; // Foreign key to User
    borrowedAt: Date;
    dueDate: Date;
    returnedAt: Date | null; // Optional field in Prisma is `Type?`, maps to `Type | null` in TS
    createdAt: Date;
    updatedAt: Date;
    // Relations could be added if needed, e.g.:
    // ebook?: Ebook;
    // user?: User; // Assuming a User type exists
  }
  
  /**
   * Represents a review for an Ebook.
   */
  export interface EbookReview {
    id: string;
    ebookId: string; // Foreign key to Ebook
    userId: string; // Foreign key to User
    rating: number; // Prisma's Int maps to JavaScript number
    review: string;
    createdAt: Date;
    updatedAt: Date;
    // Relations could be added if needed, e.g.:
    // ebook?: Ebook;
    // user?: User; // Assuming a User type exists
  }
  
  // Assuming a User model similar to the one implicitly used in the SQL generation:
  /**
   * Represents a User in the system. (Assumed for relations)
   */
