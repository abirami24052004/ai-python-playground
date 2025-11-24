# AI Python Online Compiler - Backend

FastAPI backend for executing Python code and providing AI tutor assistance.

## Features

- **Code Execution**: Safely executes Python code with stdin support
- **Timeout Protection**: 3-second timeout prevents infinite loops
- **AI Tutor**: Placeholder endpoint ready for LLM integration
- **CORS Enabled**: Configured for frontend communication

## Installation

1. Make sure you have Python 3.8+ installed:
```bash
python --version
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

Start the development server:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST /run
Execute Python code with optional stdin input.

**Request:**
```json
{
  "code": "print('Hello, World!')",
  "stdin": "optional input\nline 2"
}
```

**Response:**
```json
{
  "stdout": "Hello, World!\n",
  "stderr": "",
  "status": "success"
}
```

Status values:
- `success`: Code executed without errors
- `runtime_error`: Code raised an exception
- `timeout`: Execution exceeded 3 seconds

### POST /ask_ai
Get AI tutor assistance (currently returns placeholder responses).

**Request:**
```json
{
  "code": "x = 10\nprint(x",
  "question": "Why am I getting a syntax error?",
  "last_run": {
    "stdout": "",
    "stderr": "SyntaxError: ...",
    "status": "runtime_error"
  }
}
```

**Response:**
```json
{
  "answer": "AI explanation here..."
}
```

## Integrating a Real LLM

To enable actual AI assistance, modify the `get_ai_answer` function in `main.py`:

### Option 1: OpenAI
```bash
pip install openai
```

```python
from openai import OpenAI

client = OpenAI(api_key="your-api-key")

def get_ai_answer(code: str, question: str, last_run: Optional[dict]) -> str:
    prompt = f"""You are a Python programming tutor.

User's Code:
{code}

Last Execution:
{last_run if last_run else 'No execution yet'}

Question: {question}

Provide clear, helpful guidance."""

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content
```

### Option 2: Anthropic Claude
```bash
pip install anthropic
```

```python
from anthropic import Anthropic

client = Anthropic(api_key="your-api-key")

def get_ai_answer(code: str, question: str, last_run: Optional[dict]) -> str:
    # Similar implementation with Claude API
    pass
```

### Option 3: Google AI
```bash
pip install google-generativeai
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Code Execution**: This API executes arbitrary Python code. In production:
   - Use containerization (Docker)
   - Implement resource limits
   - Run in isolated environments
   - Consider sandboxing solutions

2. **Rate Limiting**: Add rate limiting to prevent abuse

3. **Input Validation**: Validate code size and content

4. **Authentication**: Add authentication for production use

## Configuration

You can modify these settings in `main.py`:

- **Timeout**: Change `timeout=3` in the `/run` endpoint
- **CORS Origins**: Update `allow_origins` for your frontend URL
- **Port**: Change port in the uvicorn command

## Troubleshooting

**Issue**: Connection refused
- Make sure the server is running on port 8000
- Check firewall settings

**Issue**: Module not found
- Ensure all dependencies are installed: `pip install -r requirements.txt`

**Issue**: Timeout too short/long
- Adjust the `timeout` parameter in the subprocess.run call

## Development Tips

- Use `--reload` flag for auto-restart during development
- Check logs for detailed error messages
- Test with curl or Postman before connecting frontend

## Testing the API

Test with curl:
```bash
# Test code execution
curl -X POST http://localhost:8000/run \
  -H "Content-Type: application/json" \
  -d '{"code": "print(\"Hello\")", "stdin": ""}'

# Test AI tutor
curl -X POST http://localhost:8000/ask_ai \
  -H "Content-Type: application/json" \
  -d '{"code": "x=1", "question": "What does this do?"}'
```
