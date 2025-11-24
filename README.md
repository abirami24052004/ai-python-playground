# AI Python Online Compiler

A full-stack browser-based Python IDE with an integrated AI assistant. Write, run, and debug Python code with real-time execution and AI-powered help.

## Features

✨ **Code Editor**
- Monaco Editor with Python syntax highlighting
- Line numbers, auto-indent, and autocomplete
- Dark theme optimized for coding

🚀 **Code Execution**
- Run Python code directly in the browser
- Custom stdin input support
- Real-time output display with error highlighting
- 3-second timeout protection

🤖 **AI Tutor**
- Ask questions about your code
- Get help with errors and debugging
- Code improvement suggestions
- Contextual assistance based on execution results

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite for fast development
- Monaco Editor for code editing
- Tailwind CSS for styling
- Shadcn UI components

**Backend:**
- FastAPI (Python)
- Subprocess for code execution
- CORS enabled for frontend communication

## Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- pip

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:8080` (or the port shown in terminal)

## Usage

1. **Write Code**: Use the Monaco editor to write your Python code
2. **Add Input**: Enter stdin values in the "Custom Input" textarea (optional)
3. **Run Code**: Click the "Run Code" button to execute
4. **View Output**: See stdout and stderr in the output console
5. **Ask AI**: Use the AI Tutor panel to ask questions about your code

## Project Structure

```
.
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── README.md           # Backend documentation
├── src/
│   ├── components/
│   │   ├── CodeEditor.tsx      # Monaco editor component
│   │   ├── CustomInput.tsx     # Stdin input component
│   │   ├── OutputConsole.tsx   # Output display component
│   │   └── AiTutorPanel.tsx    # AI chat interface
│   ├── pages/
│   │   └── Index.tsx           # Main application layout
│   └── index.css              # Design system and styles
└── README.md
```

## API Endpoints

### POST /run
Execute Python code with optional stdin.

**Request:**
```json
{
  "code": "print('Hello, World!')",
  "stdin": ""
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

### POST /ask_ai
Get AI assistance (currently placeholder).

**Request:**
```json
{
  "code": "x = 10",
  "question": "How do I improve this?",
  "last_run": null
}
```

## Integrating Real AI

The `/ask_ai` endpoint currently returns placeholder responses. To integrate a real LLM:

1. Choose an AI provider (OpenAI, Anthropic, Google AI)
2. Install the SDK: `pip install openai` (or equivalent)
3. Update the `get_ai_answer` function in `backend/main.py`

Example with OpenAI:
```python
from openai import OpenAI

client = OpenAI(api_key="your-api-key")

def get_ai_answer(code: str, question: str, last_run: Optional[dict]) -> str:
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{
            "role": "user",
            "content": f"Code: {code}\nQuestion: {question}"
        }]
    )
    return response.choices[0].message.content
```

See `backend/README.md` for detailed integration instructions.

## Security Considerations

⚠️ **This application executes arbitrary code. For production use:**

1. **Containerization**: Run in Docker containers
2. **Resource Limits**: Implement CPU/memory limits
3. **Sandboxing**: Use code execution sandboxes
4. **Authentication**: Add user authentication
5. **Rate Limiting**: Prevent abuse with rate limits

## Development

**Backend:**
- FastAPI with auto-reload: `uvicorn main:app --reload`
- Change timeout in `main.py`: `timeout=3` parameter
- Add more CORS origins as needed

**Frontend:**
- Hot reload enabled with Vite
- Monaco editor theme: `vs-dark`
- Design system in `src/index.css`

## Troubleshooting

**Backend not reachable:**
- Ensure FastAPI is running on port 8000
- Check CORS configuration in `main.py`

**Monaco editor not loading:**
- Clear browser cache
- Check console for errors

**Code execution timeout:**
- Default is 3 seconds
- Adjust in `backend/main.py` if needed

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for learning and development.

## Acknowledgments

- Monaco Editor by Microsoft
- FastAPI by Sebastián Ramírez
- Shadcn UI components
- Tailwind CSS team
