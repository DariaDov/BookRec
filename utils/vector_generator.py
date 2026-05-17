import ollama
import psycopg2

conn = psycopg2.connect(dbname="books", user="postgres", password="postgres", host="localhost")
book_cur = conn.cursor()
book_cur.execute("SELECT b.id, b.author || '. ' || b.title || '. ' || b.genre || '. ' || b.description as book_info FROM book b where b.embedding is null")
books =  book_cur.fetchall()
update_cur = conn.cursor()

for book in books:
    response = ollama.embeddings(
        model='nomic-embed-text',
        prompt=book[1][:2048]
    )

    vector = response['embedding']

    update_cur.execute("UPDATE book SET embedding = %s WHERE id = %s", (vector, book[0]))
    conn.commit()

book_cur.close()
update_cur.close()
conn.close()