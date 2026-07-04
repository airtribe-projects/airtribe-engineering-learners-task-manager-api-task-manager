"""
Example 1: Basic File Operations Demo
Demonstrates core file system tools without LLM.
"""

import sys
import os
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from fs_tools import FileSystemTools


def demo_list_files():
    """Demonstrate listing files."""
    print("=" * 60)
    print("DEMO 1: List Files")
    print("=" * 60)
    
    resumes_dir = Path(__file__).parent.parent / "resumes"
    result = FileSystemTools.list_files(str(resumes_dir))
    
    print(f"\nTotal files found: {result['count']}")
    print("\nFile Details:")
    for file in result["files"]:
        print(f"  • {file['filename']}")
        print(f"    Size: {file['size_kb']} KB")
        print(f"    Modified: {file['modified_date']}")


def demo_read_file():
    """Demonstrate reading a file."""
    print("\n" + "=" * 60)
    print("DEMO 2: Read Resume File")
    print("=" * 60)
    
    resume_path = Path(__file__).parent.parent / "resumes" / "resume_john_doe.txt"
    result = FileSystemTools.read_file(str(resume_path))
    
    if result["success"]:
        print(f"\nFile: {result['metadata']['filename']}")
        print(f"Size: {result['metadata']['size_bytes']} bytes")
        print(f"\nContent (first 500 chars):")
        print("-" * 60)
        print(result["content"][:500] + "...")
    else:
        print(f"Error: {result['error']}")


def demo_search():
    """Demonstrate searching in a file."""
    print("\n" + "=" * 60)
    print("DEMO 3: Search for Keywords")
    print("=" * 60)
    
    resume_path = Path(__file__).parent.parent / "resumes" / "resume_john_doe.txt"
    
    # Search for Python
    print("\nSearching for 'Python'...")
    result = FileSystemTools.search_in_file(
        str(resume_path), 
        "Python",
        context_lines=1
    )
    
    print(f"Found: {result['match_count']} matches\n")
    for i, match in enumerate(result["matches"][:2], 1):  # Show first 2
        print(f"Match {i}:")
        print(f"  Line {match['line_number']}: {match['full_line']}")


def demo_write_file():
    """Demonstrate writing a file."""
    print("\n" + "=" * 60)
    print("DEMO 4: Create Summary File")
    print("=" * 60)
    
    output_dir = Path(__file__).parent.parent / "output"
    
    # Read multiple resumes and create summary
    resumes_dir = Path(__file__).parent.parent / "resumes"
    
    summary_content = "# Resume Analysis Summary\n\n"
    summary_content += "## Files Analyzed\n\n"
    
    result = FileSystemTools.list_files(str(resumes_dir))
    
    for file in result["files"]:
        summary_content += f"- {file['filename']} ({file['size_kb']} KB)\n"
    
    # Write summary
    output_path = str(output_dir / "resume_summary.md")
    write_result = FileSystemTools.write_file(output_path, summary_content)
    
    if write_result["success"]:
        print(f"\n✓ Summary file created successfully!")
        print(f"  Path: {write_result['filepath']}")
        print(f"  Size: {write_result['size_bytes']} bytes")
        print(f"\nContent preview:")
        print("-" * 60)
        print(summary_content)
    else:
        print(f"Error: {write_result['error']}")


def main():
    """Run all demos."""
    print("\n")
    print("╔" + "=" * 58 + "╗")
    print("║" + " " * 10 + "FILE SYSTEM TOOLS - BASIC DEMO" + " " * 20 + "║")
    print("╚" + "=" * 58 + "╝")
    
    try:
        demo_list_files()
        demo_read_file()
        demo_search()
        demo_write_file()
        
        print("\n" + "=" * 60)
        print("✓ All demos completed successfully!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
