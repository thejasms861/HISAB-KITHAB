import psycopg2
import socket

def check_port(host, port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex((host, port))
    sock.close()
    return result == 0

def check_postgres(port):
    print(f"Checking port {port}...")
    if not check_port("localhost", port):
        print(f"Port {port} is NOT open.")
        return False
    print(f"Port {port} is OPEN.")
    
    try:
        conn = psycopg2.connect(
            dbname="postgres", 
            user="postgres", 
            password="password", 
            host="localhost", 
            port=port
        )
        print(f"SUCCESS: Connected to Postgres on port {port}!")
        conn.close()
        return True
    except Exception as e:
        print(f"FAILED to connect on port {port}: {e}")
        return False

print("Starting connectivity check...")
check_postgres(5432)
check_postgres(5433)
