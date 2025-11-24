from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import tempfile
import os
from typing import Optional

app = FastAPI(title="AI Python Online Compiler API")

# CORS configuration to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080"],  # Vite default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CodeExecutionRequest(BaseModel):
    code: str
    stdin: str = ""


class CodeExecutionResponse(BaseModel):
    stdout: str
    stderr: str
    status: str  # "success" | "runtime_error" | "timeout"


class AiQuestionRequest(BaseModel):
    code: str
    question: str
    last_run: Optional[dict] = None


class AiQuestionResponse(BaseModel):
    answer: str


@app.get("/")
async def root():
    return {"message": "AI Python Online Compiler API is running"}


@app.post("/run", response_model=CodeExecutionResponse)
async def run_code(request: CodeExecutionRequest):
    """
    Execute Python code with optional stdin input.
    
    - Creates a temporary Python file with the user's code
    - Executes it with subprocess with a 3-second timeout
    - Returns stdout, stderr, and execution status
    """
    try:
        # Create a temporary file to store the code
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as tmp_file:
            tmp_file.write(request.code)
            tmp_file_path = tmp_file.name

        try:
            # Execute the Python code
            result = subprocess.run(
                ['python', tmp_file_path],
                input=request.stdin,
                capture_output=True,
                text=True,
                timeout=3  # 3-second timeout to prevent infinite loops
            )

            # Determine execution status
            if result.returncode == 0:
                status = "success"
            else:
                status = "runtime_error"

            return CodeExecutionResponse(
                stdout=result.stdout,
                stderr=result.stderr,
                status=status
            )

        except subprocess.TimeoutExpired:
            # Handle timeout
            return CodeExecutionResponse(
                stdout="",
                stderr="Error: Code execution timed out after 3 seconds.\nThis usually means your code has an infinite loop or is taking too long to execute.",
                status="timeout"
            )

        finally:
            # Clean up: delete the temporary file
            if os.path.exists(tmp_file_path):
                os.remove(tmp_file_path)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


def get_ai_answer(code: str, question: str, last_run: Optional[dict]) -> str:
    """
    Placeholder function for AI tutor responses.
    
    TODO: Replace this with a real LLM API call (e.g., OpenAI, Anthropic, or Google)
    
    You would typically:
    1. Build a prompt that includes:
       - The user's code
       - Their question
       - The last execution result (if available)
    2. Call an LLM API with this prompt
    3. Return the AI's response
    
    Example prompt structure:
    ```
    You are a Python programming tutor. Help the user understand their code.
    
    User's Code:
    {code}
    
    Last Execution Result:
    stdout: {last_run.stdout}
    stderr: {last_run.stderr}
    status: {last_run.status}
    
    User's Question:
    {question}
    
    Provide a clear, helpful explanation.
    ```
    """
    
    # Placeholder response
    response = (
        "This is a placeholder AI tutor response.\n\n"
        "To enable real AI assistance, you need to:\n"
        "1. Get an API key from an LLM provider (OpenAI, Anthropic, Google AI, etc.)\n"
        "2. Install the required SDK (e.g., `pip install openai`)\n"
        "3. Replace this function with actual LLM API calls\n\n"
        f"Your question was: '{question}'\n\n"
        "The AI would analyze your code and provide:\n"
        "- Explanations of errors if any occurred\n"
        "- Suggestions for code improvements\n"
        "- Step-by-step guidance on concepts\n"
        "- Best practices and optimization tips"
    )
    
    if last_run and last_run.get("stderr"):
        response += f"\n\nI noticed there was an error in your last run. "
        response += "A real AI tutor would explain the error and suggest fixes."
    
    return response


@app.post("/ask_ai", response_model=AiQuestionResponse)
async def ask_ai(request: AiQuestionRequest):
    """
    AI tutor endpoint - currently returns placeholder responses.
    
    Replace the get_ai_answer function with real LLM integration
    to provide actual AI-powered assistance.
    """
    try:
        answer = get_ai_answer(
            code=request.code,
            question=request.question,
            last_run=request.last_run
        )
        
        return AiQuestionResponse(answer=answer)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
