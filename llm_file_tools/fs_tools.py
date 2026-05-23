"""
File System Tools Module
Provides tools for reading, writing, listing, and searching files.
Supports PDF, TXT, and DOCX formats.
"""

import os
import json
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict, Any
import re

try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None

try:
    from docx import Document
except ImportError:
    Document = None


class FileSystemTools:
    """Collection of file system tools for LLM integration."""

    @staticmethod
    def read_file(filepath: str) -> Dict[str, Any]:
        """
        Read resume files (PDF, TXT, DOCX).
        
        Args:
            filepath: Path to the file to read
            
        Returns:
            Dictionary with:
            - success: Boolean indicating success
            - content: Extracted text content
            - metadata: File metadata (name, size, modified date, type)
            - error: Error message if failed
        """
        try:
            file_path = Path(filepath)
            
            if not file_path.exists():
                return {
                    "success": False,
                    "content": None,
                    "metadata": None,
                    "error": f"File not found: {filepath}"
                }
            
            # Get file metadata
            stat_info = file_path.stat()
            metadata = {
                "filename": file_path.name,
                "filepath": str(file_path),
                "size_bytes": stat_info.st_size,
                "modified_date": datetime.fromtimestamp(stat_info.st_mtime).isoformat(),
                "file_type": file_path.suffix.lower()
            }
            
            # Read based on file type
            extension = file_path.suffix.lower()
            content = None
            
            if extension == ".txt":
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
            elif extension == ".pdf":
                if PdfReader is None:
                    return {
                        "success": False,
                        "content": None,
                        "metadata": metadata,
                        "error": "pypdf library not installed. Install with: pip install pypdf"
                    }
                try:
                    reader = PdfReader(file_path)
                    content = ""
                    for page_num, page in enumerate(reader.pages):
                        content += f"\n--- Page {page_num + 1} ---\n"
                        content += page.extract_text()
                except Exception as e:
                    return {
                        "success": False,
                        "content": None,
                        "metadata": metadata,
                        "error": f"Failed to read PDF: {str(e)}"
                    }
                    
            elif extension == ".docx":
                if Document is None:
                    return {
                        "success": False,
                        "content": None,
                        "metadata": metadata,
                        "error": "python-docx library not installed. Install with: pip install python-docx"
                    }
                try:
                    doc = Document(file_path)
                    content = ""
                    for para in doc.paragraphs:
                        if para.text.strip():
                            content += para.text + "\n"
                except Exception as e:
                    return {
                        "success": False,
                        "content": None,
                        "metadata": metadata,
                        "error": f"Failed to read DOCX: {str(e)}"
                    }
            else:
                return {
                    "success": False,
                    "content": None,
                    "metadata": metadata,
                    "error": f"Unsupported file type: {extension}. Supported: .txt, .pdf, .docx"
                }
            
            return {
                "success": True,
                "content": content,
                "metadata": metadata,
                "error": None
            }
            
        except Exception as e:
            return {
                "success": False,
                "content": None,
                "metadata": None,
                "error": f"Unexpected error reading file: {str(e)}"
            }

    @staticmethod
    def list_files(directory: str, extension: Optional[str] = None) -> Dict[str, Any]:
        """
        List all files in a directory with optional filtering by extension.
        
        Args:
            directory: Path to the directory
            extension: Optional file extension to filter (e.g., '.pdf', '.txt')
            
        Returns:
            Dictionary with:
            - success: Boolean indicating success
            - files: List of files with metadata
            - count: Total number of files found
            - error: Error message if failed
        """
        try:
            dir_path = Path(directory)
            
            if not dir_path.exists():
                return {
                    "success": False,
                    "files": [],
                    "count": 0,
                    "error": f"Directory not found: {directory}"
                }
            
            if not dir_path.is_dir():
                return {
                    "success": False,
                    "files": [],
                    "count": 0,
                    "error": f"Path is not a directory: {directory}"
                }
            
            files = []
            
            # Normalize extension filter
            if extension:
                if not extension.startswith('.'):
                    extension = '.' + extension
                extension = extension.lower()
            
            # Iterate through files
            for file_path in dir_path.iterdir():
                if file_path.is_file():
                    # Filter by extension if specified
                    if extension and file_path.suffix.lower() != extension:
                        continue
                    
                    stat_info = file_path.stat()
                    files.append({
                        "filename": file_path.name,
                        "filepath": str(file_path),
                        "size_bytes": stat_info.st_size,
                        "size_kb": round(stat_info.st_size / 1024, 2),
                        "modified_date": datetime.fromtimestamp(stat_info.st_mtime).isoformat(),
                        "file_type": file_path.suffix.lower()
                    })
            
            # Sort by filename
            files.sort(key=lambda x: x['filename'])
            
            return {
                "success": True,
                "files": files,
                "count": len(files),
                "error": None
            }
            
        except Exception as e:
            return {
                "success": False,
                "files": [],
                "count": 0,
                "error": f"Error listing files: {str(e)}"
            }

    @staticmethod
    def write_file(filepath: str, content: str) -> Dict[str, Any]:
        """
        Write content to a file, creating directories if needed.
        
        Args:
            filepath: Path to the file to write
            content: Content to write
            
        Returns:
            Dictionary with:
            - success: Boolean indicating success
            - filepath: Path to the written file
            - size_bytes: Size of written file
            - error: Error message if failed
        """
        try:
            file_path = Path(filepath)
            
            # Create parent directories if needed
            file_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Write file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            # Get file info
            stat_info = file_path.stat()
            
            return {
                "success": True,
                "filepath": str(file_path),
                "size_bytes": stat_info.st_size,
                "message": f"File written successfully",
                "error": None
            }
            
        except Exception as e:
            return {
                "success": False,
                "filepath": filepath,
                "size_bytes": 0,
                "message": None,
                "error": f"Error writing file: {str(e)}"
            }

    @staticmethod
    def search_in_file(filepath: str, keyword: str, context_lines: int = 2) -> Dict[str, Any]:
        """
        Search for keywords in file content with context.
        
        Args:
            filepath: Path to the file to search
            keyword: Keyword to search for (case-insensitive)
            context_lines: Number of lines to show before/after match
            
        Returns:
            Dictionary with:
            - success: Boolean indicating success
            - matches: List of matches with context
            - match_count: Total number of matches
            - error: Error message if failed
        """
        try:
            file_path = Path(filepath)
            
            if not file_path.exists():
                return {
                    "success": False,
                    "matches": [],
                    "match_count": 0,
                    "error": f"File not found: {filepath}"
                }
            
            # Read file content
            read_result = FileSystemTools.read_file(filepath)
            if not read_result["success"]:
                return {
                    "success": False,
                    "matches": [],
                    "match_count": 0,
                    "error": read_result["error"]
                }
            
            content = read_result["content"]
            lines = content.split('\n')
            keyword_lower = keyword.lower()
            
            matches = []
            for line_num, line in enumerate(lines):
                if keyword_lower in line.lower():
                    # Find all occurrences in the line
                    pattern = re.compile(re.escape(keyword), re.IGNORECASE)
                    for match in pattern.finditer(line):
                        # Get context lines
                        start_line = max(0, line_num - context_lines)
                        end_line = min(len(lines), line_num + context_lines + 1)
                        context = '\n'.join(lines[start_line:end_line])
                        
                        matches.append({
                            "line_number": line_num + 1,
                            "matched_text": line[match.start():match.end()],
                            "full_line": line,
                            "context": context,
                            "position": match.start()
                        })
            
            return {
                "success": True,
                "matches": matches,
                "match_count": len(matches),
                "keyword": keyword,
                "error": None
            }
            
        except Exception as e:
            return {
                "success": False,
                "matches": [],
                "match_count": 0,
                "error": f"Error searching in file: {str(e)}"
            }


# Create tool definitions for LLM function calling
TOOLS = [
    {
        "name": "read_file",
        "description": "Read and extract content from resume files (PDF, TXT, DOCX). Returns the full text content and file metadata.",
        "parameters": {
            "type": "object",
            "properties": {
                "filepath": {
                    "type": "string",
                    "description": "Path to the file to read"
                }
            },
            "required": ["filepath"]
        }
    },
    {
        "name": "list_files",
        "description": "List all files in a directory with optional filtering by file extension. Returns file names, sizes, and modification dates.",
        "parameters": {
            "type": "object",
            "properties": {
                "directory": {
                    "type": "string",
                    "description": "Path to the directory to list"
                },
                "extension": {
                    "type": "string",
                    "description": "Optional file extension to filter by (e.g., '.pdf', '.txt', '.docx')"
                }
            },
            "required": ["directory"]
        }
    },
    {
        "name": "write_file",
        "description": "Write content to a file. Creates parent directories if they don't exist. Useful for creating summary files or processed output.",
        "parameters": {
            "type": "object",
            "properties": {
                "filepath": {
                    "type": "string",
                    "description": "Path to the file to write"
                },
                "content": {
                    "type": "string",
                    "description": "Content to write to the file"
                }
            },
            "required": ["filepath", "content"]
        }
    },
    {
        "name": "search_in_file",
        "description": "Search for keywords in file content. Returns matching lines with surrounding context. Case-insensitive search.",
        "parameters": {
            "type": "object",
            "properties": {
                "filepath": {
                    "type": "string",
                    "description": "Path to the file to search"
                },
                "keyword": {
                    "type": "string",
                    "description": "Keyword to search for (case-insensitive)"
                },
                "context_lines": {
                    "type": "integer",
                    "description": "Number of lines to show before/after match (default: 2)"
                }
            },
            "required": ["filepath", "keyword"]
        }
    }
]


def execute_tool(tool_name: str, **kwargs) -> Dict[str, Any]:
    """
    Execute a tool by name with given parameters.
    
    Args:
        tool_name: Name of the tool to execute
        **kwargs: Parameters for the tool
        
    Returns:
        Result from the tool
    """
    tools_map = {
        "read_file": FileSystemTools.read_file,
        "list_files": FileSystemTools.list_files,
        "write_file": FileSystemTools.write_file,
        "search_in_file": FileSystemTools.search_in_file,
    }
    
    if tool_name not in tools_map:
        return {
            "success": False,
            "error": f"Unknown tool: {tool_name}"
        }
    
    tool_func = tools_map[tool_name]
    return tool_func(**kwargs)


if __name__ == "__main__":
    # Quick test
    print("File System Tools Module")
    print("=" * 50)
    
    # Test list_files
    print("\nTesting list_files on current directory:")
    result = FileSystemTools.list_files(".")
    print(f"Files found: {result['count']}")
    for file in result.get('files', [])[:3]:
        print(f"  - {file['filename']} ({file['size_kb']} KB)")
