import sys
import os
import json
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict, Any
from concurrent.futures import ThreadPoolExecutor

# Import the official MCP FastMCP wrapper
from mcp.server.fastmcp import FastMCP
import mcp.types as types

# Import watchdog for watch_directory capability
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Resolve absolute path to Milestone 1 fs_tools to reuse it
LLM_FILE_TOOLS_DIR = Path("D:/Airtribe/NewAir/task-manager-api-swdsm100040/llm_file_tools").resolve()
sys.path.append(str(LLM_FILE_TOOLS_DIR))

try:
    from fs_tools import FileSystemTools
except ImportError as e:
    print(f"Error importing fs_tools from {LLM_FILE_TOOLS_DIR}: {e}", file=sys.stderr)
    sys.exit(1)

# Initialize the MCP Server using FastMCP
mcp = FastMCP("FileSystemServer")

# Thread-safe storage for watched directories and detected resumes
new_resumes: List[Dict[str, Any]] = []
watchers: Dict[str, Observer] = {}

class ResumeHandler(FileSystemEventHandler):
    """Event handler for monitoring new resumes in a directory."""
    def __init__(self, directory: str):
        self.directory = directory

    def on_created(self, event):
        if not event.is_directory:
            file_path = Path(event.src_path)
            # Only monitor supported resume formats
            if file_path.suffix.lower() in ['.txt', '.pdf', '.docx']:
                try:
                    stat_info = file_path.stat()
                    entry = {
                        "filename": file_path.name,
                        "filepath": str(file_path),
                        "size_bytes": stat_info.st_size,
                        "detected_at": datetime.now().isoformat(),
                        "status": "new"
                    }
                    new_resumes.append(entry)
                    print(f"[WATCHER] Detected new resume: {file_path.name} in {self.directory}", file=sys.stderr, flush=True)
                except Exception as e:
                    print(f"[WATCHER] Error reading metadata for {file_path.name}: {e}", file=sys.stderr, flush=True)

# ---------------------------------------------------------------------------
# MCP Tools (Milestone 1 Core Functionality)
# ---------------------------------------------------------------------------

@mcp.tool()
def read_file(filepath: str) -> Dict[str, Any]:
    """
    Read and extract text content from a resume file.
    Supports PDF, TXT, and DOCX formats.
    
    Args:
        filepath: Path to the resume file.
    """
    print(f"[MCP TOOL] read_file called for: {filepath}", file=sys.stderr, flush=True)
    return FileSystemTools.read_file(filepath)

@mcp.tool()
def list_files(directory: str, extension: Optional[str] = None) -> Dict[str, Any]:
    """
    List all files in a directory with optional filtering by extension.
    
    Args:
        directory: Path to the directory to list.
        extension: Optional file extension to filter by (e.g. '.pdf', '.txt').
    """
    print(f"[MCP TOOL] list_files called for: {directory} (filter: {extension})", file=sys.stderr, flush=True)
    return FileSystemTools.list_files(directory, extension)

@mcp.tool()
def write_file(filepath: str, content: str) -> Dict[str, Any]:
    """
    Write content to a file. Automatically creates parent directories.
    
    Args:
        filepath: Path to the file to write.
        content: The text content to write.
    """
    print(f"[MCP TOOL] write_file called for: {filepath}", file=sys.stderr, flush=True)
    return FileSystemTools.write_file(filepath, content)

@mcp.tool()
def search_in_file(filepath: str, keyword: str, context_lines: int = 2) -> Dict[str, Any]:
    """
    Search for a case-insensitive keyword in a file. Returns matching lines and context.
    
    Args:
        filepath: Path to the file to search.
        keyword: Keyword to search for.
        context_lines: Number of surrounding lines of context to include.
    """
    print(f"[MCP TOOL] search_in_file called for: {filepath} (keyword: {keyword})", file=sys.stderr, flush=True)
    return FileSystemTools.search_in_file(filepath, keyword, context_lines)

# ---------------------------------------------------------------------------
# MCP Tools (Milestone 2 New Capabilities)
# ---------------------------------------------------------------------------

@mcp.tool()
def watch_directory(directory: str) -> Dict[str, Any]:
    """
    Monitor a directory for newly created resume files (.txt, .pdf, .docx).
    
    Args:
        directory: Path to the directory to watch.
    """
    print(f"[MCP TOOL] watch_directory called for: {directory}", file=sys.stderr, flush=True)
    try:
        path = Path(directory).resolve()
        if not path.exists():
            return {"success": False, "error": f"Directory does not exist: {directory}"}
        if not path.is_dir():
            return {"success": False, "error": f"Path is not a directory: {directory}"}
            
        dir_str = str(path)
        if dir_str in watchers:
            return {"success": True, "message": f"Already watching directory: {dir_str}"}
            
        # Set up background watchdog observer
        event_handler = ResumeHandler(dir_str)
        observer = Observer()
        observer.schedule(event_handler, path=dir_str, recursive=False)
        observer.start()
        
        watchers[dir_str] = observer
        return {
            "success": True,
            "message": f"Successfully started watching directory: {dir_str}",
            "currently_watched": list(watchers.keys())
        }
    except Exception as e:
        return {"success": False, "error": f"Failed to start watching directory: {str(e)}"}

@mcp.tool()
def batch_process(filepaths: List[str], operation: str, keyword: Optional[str] = None, context_lines: int = 2) -> Dict[str, Any]:
    """
    Concurrently process multiple files using thread pools.
    
    Args:
        filepaths: List of file paths to process.
        operation: The operation to run ('read' or 'search').
        keyword: Optional keyword to search for (for 'search' operation).
        context_lines: Number of context lines to return (for 'search' operation).
    """
    print(f"[MCP TOOL] batch_process called on {len(filepaths)} files (operation: {operation})", file=sys.stderr, flush=True)
    
    if operation not in ['read', 'search']:
        return {"success": False, "error": f"Unsupported operation: {operation}. Supported: 'read', 'search'"}
        
    results = {}
    
    def process_single(filepath: str) -> Dict[str, Any]:
        if operation == 'read':
            return FileSystemTools.read_file(filepath)
        elif operation == 'search':
            return FileSystemTools.search_in_file(filepath, keyword or '', context_lines)
            
    # Process concurrently using a ThreadPoolExecutor
    with ThreadPoolExecutor(max_workers=min(len(filepaths), 8)) as executor:
        future_to_file = {executor.submit(process_single, f): f for f in filepaths}
        for future in future_to_file:
            file = future_to_file[future]
            try:
                results[file] = future.result()
            except Exception as e:
                results[file] = {"success": False, "error": str(e)}
                
    return {
        "success": True,
        "operation": operation,
        "results": results,
        "count": len(filepaths)
    }

# ---------------------------------------------------------------------------
# MCP Resources
# ---------------------------------------------------------------------------

@mcp.resource("resumes://new-resumes")
def get_new_resumes() -> str:
    """
    Resource that exposes the list of all new resumes detected since directory watching started.
    """
    print("[MCP RESOURCE] Read resumes://new-resumes", file=sys.stderr, flush=True)
    return json.dumps(new_resumes, indent=2)

@mcp.resource("resumes://monitored-directories")
def get_monitored_directories() -> str:
    """
    Resource that lists all directories currently being monitored.
    """
    print("[MCP RESOURCE] Read resumes://monitored-directories", file=sys.stderr, flush=True)
    return json.dumps(list(watchers.keys()), indent=2)


if __name__ == "__main__":
    # Start the FastMCP stdio server
    mcp.run("stdio")
