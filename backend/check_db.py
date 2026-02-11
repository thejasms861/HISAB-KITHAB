import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

DB_HOST = "localhost"
DB_USER = "postgres"
DB_PASS = "password"
DB_PORT = "5432"
TARGET_DB = "hisaabkitaab"

def check_db():
    try:
        # Connect to default 'postgres' database to check connectivity
        print(f"Attempting to connect to PostgreSQL at {DB_HOST}:{DB_PORT} as {DB_USER}...")
        conn = psycopg2.connect(
            dbname="postgres",
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST,
            port=DB_PORT
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        print("Successfully connected to PostgreSQL server.")

        # Check if target database exists
        cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{TARGET_DB}'")
        exists = cur.fetchone()

        if not exists:
            print(f"Database '{TARGET_DB}' not found. Creating it...")
            cur.execute(f"CREATE DATABASE {TARGET_DB}")
            print(f"Database '{TARGET_DB}' created successfully!")
        else:
            print(f"Database '{TARGET_DB}' already exists.")

        cur.close()
        conn.close()
        return True

    except psycopg2.OperationalError as e:
        print(f"Connection failed: {e}")
        return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return False

if __name__ == "__main__":
    check_db()
