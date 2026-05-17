import requests
from minio import Minio
from io import BytesIO
import psycopg2

MINIO_URL = "localhost:9000" 
ACCESS_KEY = "minioadmin"
SECRET_KEY = "minioadmin"
BUCKET_NAME = "images"
SECURE = False

conn = psycopg2.connect(dbname="books", user="postgres", password="postgres", host="localhost")
book_cur = conn.cursor()
book_cur.execute("SELECT b.img FROM book b")
links =  [b[0] for b in book_cur.fetchall()]

# # Your list of links
# links = [
#     "https://example.com/image1.jpg",
#     "https://example.com"
# ]

client = Minio(MINIO_URL, access_key=ACCESS_KEY, secret_key=SECRET_KEY, secure=SECURE)

if not client.bucket_exists(BUCKET_NAME):
    client.make_bucket(BUCKET_NAME)
    print(f"Created bucket: {BUCKET_NAME}")
for url in links:
    try:
        filename = url.split("/")[-1]
        print(f"Processing: {filename}...")
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        file_data = response.content
        length = len(file_data)
        content_type = response.headers.get('content-type')

        client.put_object(
            BUCKET_NAME,
            filename,
            data=BytesIO(file_data),
            length=length,
            content_type=content_type
        )
        print(f"Successfully stored {filename} in MinIO.")
    except Exception as e:
        print(f"Error downloading {url}: {e}")