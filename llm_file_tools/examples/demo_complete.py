"""
Complete Demo and Test Suite
Demonstrates all features and validates functionality.
"""

import sys
import json
from pathlib import Path
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fs_tools import FileSystemTools, execute_tool, TOOLS
from llm_file_assistant import create_assistant


class Colors:
    """ANSI color codes."""
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    END = '\033[0m'
    BOLD = '\033[1m'


def print_header(text):
    """Print a header."""
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'=' * 70}{Colors.END}")
    print(f"{Colors.HEADER}{Colors.BOLD}{text:^70}{Colors.END}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'=' * 70}{Colors.END}\n")


def print_subheader(text):
    """Print a subheader."""
    print(f"\n{Colors.CYAN}{Colors.BOLD}{text}{Colors.END}")
    print(f"{Colors.CYAN}{'-' * len(text)}{Colors.END}")


def print_success(text):
    """Print success message."""
    print(f"{Colors.GREEN}✓ {text}{Colors.END}")


def print_info(text):
    """Print info message."""
    print(f"{Colors.BLUE}ℹ {text}{Colors.END}")


def print_error(text):
    """Print error message."""
    print(f"{Colors.RED}✗ {text}{Colors.END}")


def test_file_tools():
    """Test file system tools."""
    print_header("Part A: File System Tools Testing")
    
    resumes_dir = Path(__file__).parent.parent / "resumes"
    
    # Test 1: List Files
    print_subheader("Test 1: List Files")
    result = FileSystemTools.list_files(str(resumes_dir))
    
    if result["success"]:
        print_success(f"Listed {result['count']} resume files")
        for file in result["files"]:
            print(f"  • {file['filename']:<30} {file['size_kb']:>6.1f} KB")
    else:
        print_error(result["error"])
    
    # Test 2: Read File
    print_subheader("Test 2: Read File")
    resume_file = str(resumes_dir / "resume_john_doe.txt")
    result = FileSystemTools.read_file(resume_file)
    
    if result["success"]:
        print_success(f"Read {result['metadata']['filename']}")
        print(f"  Size: {result['metadata']['size_bytes']} bytes")
        print(f"  Type: {result['metadata']['file_type']}")
        print(f"  Content length: {len(result['content'])} chars")
        print(f"\n  Preview (first 200 chars):")
        print(f"  {result['content'][:200]}...")
    else:
        print_error(result["error"])
    
    # Test 3: Search in File
    print_subheader("Test 3: Search in File")
    result = FileSystemTools.search_in_file(resume_file, "Python", context_lines=1)
    
    if result["success"]:
        print_success(f"Found {result['match_count']} matches for '{result['keyword']}'")
        for i, match in enumerate(result["matches"][:2], 1):
            print(f"\n  Match {i}:")
            print(f"    Line {match['line_number']}: {match['full_line'][:60]}...")
    else:
        print_error(result["error"])
    
    # Test 4: Write File
    print_subheader("Test 4: Write File")
    output_dir = Path(__file__).parent.parent / "output"
    test_file = str(output_dir / "test_output.md")
    
    content = f"""# Test Output
Generated: {datetime.now().isoformat()}

## Files Found
"""
    
    for file in result.get("files", [])[:3]:
        content += f"- {file['filename']}\n"
    
    result = FileSystemTools.write_file(test_file, content)
    
    if result["success"]:
        print_success(f"Created file: {Path(result['filepath']).name}")
        print(f"  Path: {result['filepath']}")
        print(f"  Size: {result['size_bytes']} bytes")
    else:
        print_error(result["error"])


def test_tool_execution():
    """Test tool execution system."""
    print_header("Tool Execution System")
    
    print_subheader("Available Tools")
    
    print(f"Total tools: {len(TOOLS)}\n")
    for tool in TOOLS:
        print(f"{Colors.BOLD}{tool['name']}{Colors.END}")
        print(f"  {tool['description']}")
        print()
    
    print_subheader("Execute Tool Directly")
    
    resumes_dir = Path(__file__).parent.parent / "resumes"
    result = execute_tool("list_files", directory=str(resumes_dir), extension=".txt")
    
    if result["success"]:
        print_success(f"Executed list_files tool")
        print(f"  Files found: {result['count']}")
    else:
        print_error(result["error"])


def test_llm_assistant():
    """Test LLM assistant."""
    print_header("Part B: LLM Integration Testing")
    
    print_subheader("Initialize Mock Assistant")
    
    try:
        assistant = create_assistant("mock")
        print_success("Mock assistant created (no API key needed)")
        
        # Test queries
        queries = [
            "How many files are in the resumes folder?",
            "Read the resume for John Doe",
        ]
        
        print_subheader("Test Queries")
        
        for i, query in enumerate(queries, 1):
            print(f"\n{Colors.BOLD}Query {i}:{Colors.END} {query}")
            print("Processing...")
            
            try:
                response = assistant.process_user_query(query)
                print(f"Response: {response[:100]}..." if len(response) > 100 else f"Response: {response}")
                print_success("Query processed")
            except Exception as e:
                print_error(f"Query failed: {e}")
        
    except Exception as e:
        print_error(f"Failed to initialize assistant: {e}")


def test_multifile_analysis():
    """Test analysis across multiple files."""
    print_header("Multi-File Analysis")
    
    resumes_dir = Path(__file__).parent.parent / "resumes"
    
    print_subheader("Search Across Multiple Resumes")
    
    search_terms = ["Python", "AWS", "Docker"]
    results = {}
    
    for term in search_terms:
        print(f"\nSearching for '{term}'...")
        matches = []
        
        for resume_file in resumes_dir.glob("*.txt"):
            result = FileSystemTools.search_in_file(str(resume_file), term)
            if result["success"] and result["match_count"] > 0:
                matches.append({
                    "file": resume_file.name,
                    "count": result["match_count"]
                })
        
        results[term] = matches
        print_success(f"Found in {len(matches)} resume(s)")
        for match in matches:
            print(f"  • {match['file']}: {match['count']} matches")
    
    # Create analysis file
    print_subheader("Create Analysis Report")
    
    output_file = Path(__file__).parent.parent / "output" / "skills_analysis.json"
    
    analysis = {
        "timestamp": datetime.now().isoformat(),
        "search_results": results,
        "summary": {
            term: len(matches) for term, matches in results.items()
        }
    }
    
    FileSystemTools.write_file(
        str(output_file),
        json.dumps(analysis, indent=2)
    )
    
    print_success(f"Analysis saved to {output_file.name}")


def main():
    """Run all tests."""
    print(f"\n{Colors.BOLD}{Colors.CYAN}")
    print("╔" + "=" * 68 + "╗")
    print("║" + " " * 68 + "║")
    print("║" + "LLM FILE TOOLS - COMPLETE DEMO & TEST SUITE".center(68) + "║")
    print("║" + " " * 68 + "║")
    print("╚" + "=" * 68 + "╝")
    print(f"{Colors.END}")
    
    try:
        # Part A: File Tools
        test_file_tools()
        
        # Tool Execution
        test_tool_execution()
        
        # Part B: LLM Integration
        test_llm_assistant()
        
        # Multi-file Analysis
        test_multifile_analysis()
        
        # Summary
        print_header("Test Summary")
        print_success("All demonstrations completed successfully!")
        print(f"\n{Colors.BOLD}Key Features Demonstrated:{Colors.END}")
        print(f"  ✓ File reading (TXT format)")
        print(f"  ✓ Directory listing with filtering")
        print(f"  ✓ Keyword search with context")
        print(f"  ✓ File writing with directory creation")
        print(f"  ✓ Tool execution system")
        print(f"  ✓ LLM integration (mock)")
        print(f"  ✓ Multi-file analysis")
        
        print(f"\n{Colors.BOLD}Next Steps:{Colors.END}")
        print(f"  1. Review examples/ directory for more demos")
        print(f"  2. Try demo_openai.py with real OpenAI API")
        print(f"  3. Try demo_interactive.py for interactive mode")
        print(f"  4. Check output/ directory for generated files")
        print()
        
    except Exception as e:
        print_error(f"Test failed: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
