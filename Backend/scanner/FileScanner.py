import pyclamd
import json
import os
import sys


def scan_file(file_path):
    try:
        cd = pyclamd.ClamdNetworkSocket(
            host="127.0.0.1",
            port=3310
        )

        if not cd.ping():
            return {"status": "error", "message": "ClamAV not running"}

        full_path = os.path.abspath(file_path)

        if not os.path.exists(full_path):
            return {"status": "error", "message": "File does not exist"}

        result = cd.scan_file(full_path)

        if result is None:
            return {"status": "clean"}
        else:
            return {"status": "infected", "details": result}

    except Exception as e:
        return {"status": "error", "message": str(e)}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({
            "status": "error",
            "message": "No file path provided"
        }))
        sys.exit(1)

    file_path = sys.argv[1]
    result = scan_file(file_path)
    print(json.dumps(result))