import pyclamd
import os
import sys

def scan_file(file_path):
    
    cd = pyclamd.ClamdNetworkSocket(
        host="127.0.0.1",
        port=3310
    )
    if not cd.ping():
        return {"error": "ClamAV not running"}

    full_path = os.path.abspath(file_path)

    result = cd.scan_file(full_path)

    if result is None:
        return {"status": "clean"}
    else:
        return{"status": "infected", "details": result}

if __name__ == "__main__":
    file_path = sys.argv[1]
    print(scan_file(file_path))