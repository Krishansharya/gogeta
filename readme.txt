Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass


activate virtual environment
.\venv\Scripts\Activate

temporary path
$env:FLASK_ENV="development"