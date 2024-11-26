import Button from "@/components/ui/Button"
import { useEffect, useState } from 'react'

interface Book {
  id: number;
  title: string;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([])

  useEffect(() => {
    fetch('/api/test_db')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error('Error fetching books:', err))
  }, [])

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Library Management</h1>
      <Button>Add Book</Button>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Books</h2>
        <div className="grid gap-4">
          {books.map(book => (
            <div key={book.id} className="p-4 border rounded">
              <h3 className="font-medium">{book.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}