import sys
import os
import pika
import ollama
import psycopg2
import json

def main():
    credentials = pika.PlainCredentials("user", "password")
    parameters = pika.ConnectionParameters(
        host="localhost", port=5672, credentials=credentials
    )
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()

    queue_name = "search"
    channel.queue_declare(queue=queue_name, durable=True)
    channel.basic_qos(prefetch_count=1)

    def callback(ch, method, properties, body):
        print("Start working")

        try:
            params = json.loads(body.decode())
            search_line = params["search_line"]
            uuid = params["uuid"]

            response = ollama.embeddings(
                model='nomic-embed-text',
                prompt=search_line
            )

            vector = response['embedding']
            conn = psycopg2.connect(dbname="books", user="postgres", password="postgres", host="localhost")
            book_cur = conn.cursor()
            book_cur.execute("SELECT string_agg(id::text, ',') as ids from (select id FROM book order by embedding <=> %s::vector limit 5)", (vector,))
            ids = book_cur.fetchone()[0]


            book_cur.execute("UPDATE search_result SET result = %s WHERE uuid = %s", (ids, uuid))
            conn.commit()
            book_cur.close()
            conn.close()
        
            ch.basic_ack(delivery_tag=method.delivery_tag)

        except Exception as e:
            print(f" [!] Помилка обробки завдання: {e.with_traceback()}")
            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)

    channel.basic_consume(queue=queue_name, on_message_callback=callback)
    channel.start_consuming()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
