"""
Example 4: Anthropic Integration Demo
Demonstrates LLM integration with Anthropic's Claude.
Requires ANTHROPIC_API_KEY environment variable or API key.
"""

import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from llm_file_assistant import AnthropicFileAssistant


def print_section(title):
    """Print a section header."""
    print("\n" + "=" * 60)
    print(title)
    print("=" * 60)


def main():
    """Main demo."""
    print("\n")
    print("╔" + "=" * 58 + "╗")
    print("║" + " " * 8 + "ANTHROPIC CLAUDE INTEGRATION DEMO" + " " * 17 + "║")
    print("╚" + "=" * 58 + "╝")
    
    # Check for API key
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        print("\n⚠️  ANTHROPIC_API_KEY environment variable not set!")
        print("\nTo use this demo, set your Anthropic API key:")
        print("\nWindows (Command Prompt):")
        print("  set ANTHROPIC_API_KEY=sk-ant-...")
        print("\nWindows (PowerShell):")
        print('  $env:ANTHROPIC_API_KEY="sk-ant-..."')
        print("\nLinux/macOS:")
        print('  export ANTHROPIC_API_KEY="sk-ant-..."')
        print("\nYou can get an API key from: https://console.anthropic.com/account/keys")
        return
    
    try:
        print_section("Initializing Anthropic Assistant")
        
        # Create assistant with Claude 3 Sonnet
        assistant = AnthropicFileAssistant(
            api_key=api_key,
            model="claude-3-sonnet-20240229"
        )
        print("✓ Assistant initialized with Claude 3 Sonnet model")
        
        # Demo 1: List files
        print_section("QUERY 1: List Resume Files")
        query1 = "What resume files are available in the resumes folder? Provide a brief description."
        print(f"User: {query1}\n")
        print("Processing...")
        response1 = assistant.process_user_query(query1)
        print(f"\nAssistant Response:")
        print("-" * 60)
        print(response1)
        
        # Demo 2: Multi-file analysis
        print_section("QUERY 2: Skills Comparison")
        query2 = "Compare the technical skills of Emily Rodriguez and David Martinez based on their resumes."
        print(f"User: {query2}\n")
        print("Processing...")
        response2 = assistant.process_user_query(query2)
        print(f"\nAssistant Response:")
        print("-" * 60)
        print(response2)
        
        # Demo 3: Experience analysis
        print_section("QUERY 3: Experience Analysis")
        query3 = "Who has the most years of experience? Read their resume and summarize their top achievements."
        print(f"User: {query3}\n")
        print("Processing...")
        response3 = assistant.process_user_query(query3)
        print(f"\nAssistant Response:")
        print("-" * 60)
        print(response3)
        
        print_section("DEMO COMPLETE")
        print("✓ Anthropic integration demo completed successfully!")
        print("\nKey Features Demonstrated:")
        print("  ✓ Tool use with Anthropic Claude")
        print("  ✓ Advanced reasoning and analysis")
        print("  ✓ Multi-document synthesis")
        print("  ✓ Natural language understanding")
        
    except ImportError as e:
        print(f"\n✗ Error: {e}")
        print("\nPlease install Anthropic library:")
        print("  pip install anthropic")
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
