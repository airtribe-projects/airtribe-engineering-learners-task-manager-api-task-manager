import os
import sys
import json
import asyncio
from pathlib import Path
from typing import List, Dict, Any, Optional

import dotenv
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

# ---------------------------------------------------------------------------
# Setup and Configuration
# ---------------------------------------------------------------------------

# Load environment variables from Zomato project `.env` if available
ZOMATO_ENV_PATH = Path("D:/Airtribe/NewAir/task-manager-api-swdsm100040/zomato/.env")
if ZOMATO_ENV_PATH.exists():
    dotenv.load_dotenv(dotenv_path=ZOMATO_ENV_PATH)

api_key = os.environ.get("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY environment variable is not set.")

# Set Groq base URL and default model
os.environ["GROQ_BASE_URL"] = os.environ.get("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
model_name = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
if model_name == "llama-3.3-70b-specdec":
    model_name = "llama-3.3-70b-versatile"

# Setup Python interpreter path for stdio MCP clients
PYTHON_EXEC = str(Path("D:/Airtribe/NewAir/task-manager-api-swdsm100040/agentic_profile_matching/venv/Scripts/python.exe").resolve())

# Global session variables for the tools to delegate calls
fs_session: Optional[ClientSession] = None
search_session: Optional[ClientSession] = None

# ---------------------------------------------------------------------------
# LangChain Tool Wrappers (Delegating to MCP Server Sessions)
# ---------------------------------------------------------------------------

@tool
async def read_file(filepath: str) -> str:
    """
    Read and extract text content from a resume file.
    Supports PDF, TXT, and DOCX formats.
    
    Args:
        filepath: Path to the resume file.
    """
    global fs_session
    if not fs_session:
        return json.dumps({"success": False, "error": "MCP Filesystem Session not initialized"})
    try:
        response = await fs_session.call_tool("read_file", arguments={"filepath": filepath})
        return response.content[0].text
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

@tool
async def list_files(directory: str, extension: Optional[str] = None) -> str:
    """
    List all files in a directory with optional filtering by extension.
    
    Args:
        directory: Path to the directory.
        extension: Optional file extension to filter by (e.g. '.pdf', '.txt').
    """
    global fs_session
    if not fs_session:
        return json.dumps({"success": False, "error": "MCP Filesystem Session not initialized"})
    try:
        response = await fs_session.call_tool("list_files", arguments={"directory": directory, "extension": extension})
        return response.content[0].text
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

@tool
async def write_file(filepath: str, content: str) -> str:
    """
    Write content to a file. Automatically creates parent directories.
    
    Args:
        filepath: Path to the file.
        content: Content to write.
    """
    global fs_session
    if not fs_session:
        return json.dumps({"success": False, "error": "MCP Filesystem Session not initialized"})
    try:
        response = await fs_session.call_tool("write_file", arguments={"filepath": filepath, "content": content})
        return response.content[0].text
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

@tool
async def search_in_file(filepath: str, keyword: str, context_lines: int = 2) -> str:
    """
    Search for a case-insensitive keyword in a file. Returns matching lines and context.
    
    Args:
        filepath: Path to the file.
        keyword: Keyword to search for.
        context_lines: Number of surrounding lines of context.
    """
    global fs_session
    if not fs_session:
        return json.dumps({"success": False, "error": "MCP Filesystem Session not initialized"})
    try:
        response = await fs_session.call_tool("search_in_file", arguments={
            "filepath": filepath,
            "keyword": keyword,
            "context_lines": context_lines
        })
        return response.content[0].text
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

@tool
async def watch_directory(directory: str) -> str:
    """
    Monitor a directory for newly created resume files (.txt, .pdf, .docx).
    
    Args:
        directory: Path to the directory to watch.
    """
    global fs_session
    if not fs_session:
        return json.dumps({"success": False, "error": "MCP Filesystem Session not initialized"})
    try:
        response = await fs_session.call_tool("watch_directory", arguments={"directory": directory})
        return response.content[0].text
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

@tool
async def batch_process(filepaths: List[str], operation: str, keyword: Optional[str] = None, context_lines: int = 2) -> str:
    """
    Concurrently process multiple files using thread pools on the MCP server.
    
    Args:
        filepaths: List of file paths.
        operation: The operation to run ('read' or 'search').
        keyword: Optional keyword to search for (for 'search' operation).
        context_lines: Number of context lines to return (for 'search' operation).
    """
    global fs_session
    if not fs_session:
        return json.dumps({"success": False, "error": "MCP Filesystem Session not initialized"})
    try:
        response = await fs_session.call_tool("batch_process", arguments={
            "filepaths": filepaths,
            "operation": operation,
            "keyword": keyword,
            "context_lines": context_lines
        })
        return response.content[0].text
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

@tool
async def web_search(query: str) -> str:
    """
    Perform a simulated web search for technology information, market trends, or developer definitions.
    
    Args:
        query: Search query string.
    """
    global search_session
    if not search_session:
        return json.dumps({"success": False, "error": "MCP WebSearch Session not initialized"})
    try:
        response = await search_session.call_tool("web_search", arguments={"query": query})
        return response.content[0].text
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

# ---------------------------------------------------------------------------
# Multi-MCP LangGraph Agent Executor
# ---------------------------------------------------------------------------

class MatchingAgentExecutor:
    """Helper class to manage MCP servers lifecycle and run LangGraph matching agent."""
    def __init__(self):
        # Configure Filesystem Server connection
        self.fs_params = StdioServerParameters(
            command=PYTHON_EXEC,
            args=[str(Path(__file__).parent / "filesystem_mcp_server.py")],
            env={**os.environ}
        )
        # Configure WebSearch Server connection (Multi-MCP Bonus)
        self.search_params = StdioServerParameters(
            command=PYTHON_EXEC,
            args=[str(Path(__file__).parent / "web_search_mcp_server.py")],
            env={**os.environ}
        )
        
        # Tools to expose to the LLM agent
        self.tools = [
            read_file,
            list_files,
            write_file,
            search_in_file,
            watch_directory,
            batch_process,
            web_search
        ]

    async def run_query(self, query: str) -> str:
        global fs_session, search_session
        
        print(f"[AGENT] Initializing connection to MCP Servers using {PYTHON_EXEC}...", flush=True)
        
        # Establish connection to both servers concurrently
        async with stdio_client(self.fs_params) as (fs_read, fs_write), \
                   stdio_client(self.search_params) as (search_read, search_write):
                   
            async with ClientSession(fs_read, fs_write) as fs_sess, \
                       ClientSession(search_read, search_write) as search_sess:
                       
                # Initialize MCP sessions
                await fs_sess.initialize()
                await search_sess.initialize()
                
                # Set global variables so LangChain tools can reach the sessions
                fs_session = fs_sess
                search_session = search_sess
                
                print("[AGENT] MCP Sessions successfully established.", flush=True)
                
                # Initialize LLM model
                print(f"[AGENT] Configuring ChatOpenAI with Groq model: {model_name}...", flush=True)
                llm = ChatOpenAI(
                    model=model_name,
                    temperature=0.0,
                    api_key=api_key,
                    base_url=os.environ["GROQ_BASE_URL"]
                )
                
                # Compile LangGraph ReAct agent
                system_prompt = (
                    "You are an advanced Profile Matching Agent with access to multiple Model Context Protocol (MCP) servers.\n"
                    "Your tools include:\n"
                    "- list_files, read_file, search_in_file, write_file: for file system operations.\n"
                    "- watch_directory: to monitor directories for new resume uploads.\n"
                    "- batch_process: for parallel processing of multiple resumes.\n"
                    "- web_search: to look up technology trends, syntax definitions, or framework details.\n"
                    "You will coordinate these tools to find candidates matching job descriptions and generate summaries.\n\n"
                    "CRITICAL INSTRUCTIONS:\n"
                    "1. When using `batch_process`, you must pass a list of absolute file path strings as the `filepaths` argument.\n"
                    "2. If you do not know the file paths, you MUST call `list_files` first to retrieve the file list, and then pass the resulting paths as an array of strings in the next step to `batch_process`.\n"
                    "3. NEVER try to nest a tool call (such as a function dictionary) as a parameter to another tool."
                )
                
                print("[AGENT] Compiling LangGraph ReAct workflow...", flush=True)
                agent = create_react_agent(llm, self.tools, prompt=system_prompt)
                
                # Run the agent query
                print(f"[AGENT] Executing user query: {query}", flush=True)
                result = await agent.ainvoke({"messages": [("user", query)]})
                
                # Extract and return the final message
                final_response = result["messages"][-1].content
                
                # Clean up globals
                fs_session = None
                search_session = None
                
                return final_response


# CLI handler
async def main():
    if len(sys.argv) < 2:
        print("Usage: python matching_agent.py \"<user query>\"")
        print("Example: python matching_agent.py \"List all txt files in D:/Airtribe/NewAir/task-manager-api-swdsm100040/llm_file_tools/resumes\"")
        return
        
    query = sys.argv[1]
    executor = MatchingAgentExecutor()
    response = await executor.run_query(query)
    print("\n" + "="*50)
    print("Agent Response:")
    print("="*50)
    print(response)

if __name__ == "__main__":
    asyncio.run(main())
