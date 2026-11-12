source venv/bin/activate
uvicorn app.main:app --reload --port 8000

//How get mac IP 
ipconfig getifaddr en0

--------------------------------------------------------
cd /Users/raveesha/MyProjects/UniWorkSL/backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload