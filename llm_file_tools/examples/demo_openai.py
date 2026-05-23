"""
Example 3: OpenAI Integration Demo
Demonstrates LLM integration with OpenAI's GPT-4.
Requires OPENAI_API_KEY environment variable or API key.
"""

import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from llm_file_assistant import OpenAIFileAssistant


def print_section(title):
    """Print a section header."""
    print("\n" + "=" * 60)
    print(title)
    print("=" * 60)


def main():
    """Main demo."""
    print("\n")
    print("╔" + "=" * 58 + "╗")
    print("║" + " " * 10 + "OPENAI GPT-4 INTEGRATION DEMO" + " " * 19 + "║")
    print("╚" + "=" * 58 + "╝")
    
    # Check for API key
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("\n⚠️  OPENAI_API_KEY environment variable not set!")
        print("\nTo use this demo, set your OpenAI API key:")
        print("\nWindows (Command Prompt):")
        print("  set OPENAI_API_KEY=sk-...")
        print("\nWindows (PowerShell):")
        print('  $env:OPENAI_API_KEY="sk-..."')
        print("\nLinux/macOS:")
        print('  export OPENAI_API_KEY="sk-..."')
        print("\nYou can get an API key from: https://platform.openai.com/account/api-keys")
        return
    
    try:
        print_section("Initializing OpenAI Assistant")
        
        # Create assistant with GPT-4
        assistant = OpenAIFileAssistant(
            api_key=api_key,
            model="gpt-4"
        )
        print("✓ Assistant initialized with GPT-4 model")
        
        # Demo 1: List files
        print_section("QUERY 1: List Resume Files")
        query1 = "How many resume files are in the resumes folder? List their names."
        print(f"User: {query1}\n")
        print("Processing...")
        response1 = assistant.process_user_query(query1)
        print(f"\nAssistant Response:")
        print("-" * 60)
        print(response1)
        
        # Demo 2: Search across files
        print_section("QUERY 2: Search for Skills")
        query2 = "Search all resumes for Python experience. Who has it?"
        print(f"User: {query2}\n")
        print("Processing...")
        response2 = assistant.process_user_query(query2)
        print(f"\nAssistant Response:")
        print("-" * 60)
        print(response2)
        
        # Demo 3: Create analysis
        print_section("QUERY 3: Analyze Experience")
        query3 = "Read resumes for John Doe and Michael Chen. Compare their experience with Python and machine learning."
        print(f"User: {query3}\n")
        print("Processing...")
        response3 = assistant.process_user_query(query3)
        print(f"\nAssistant Response:")
        print("-" * 60)
        print(response3)
        
        print_section("DEMO COMPLETE")
        print("✓ OpenAI integration demo completed successfully!")
        print("\nKey Features Demonstrated:")
        print("  ✓ Tool function calling with OpenAI")
        print("  ✓ Multi-step file operations")
        print("  ✓ Natural language understanding")
        print("  ✓ Context-aware responses")
        
    except ImportError as e:
        print(f"\n✗ Error: {e}")
        print("\nPlease install OpenAI library:")
        print("  pip install openai")
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
