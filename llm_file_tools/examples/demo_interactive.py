"""
Example 5: Interactive Assistant Demo
Run the assistant in interactive mode for manual testing.
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from llm_file_assistant import create_assistant


def print_banner():
    """Print banner."""
    print("\n")
    print("╔" + "=" * 58 + "╗")
    print("║" + " " * 12 + "INTERACTIVE FILE ASSISTANT" + " " * 21 + "║")
    print("╚" + "=" * 58 + "╝")
    print()


def print_help():
    """Print help information."""
    print("""
Available Commands:
  help           Show this help message
  exit/quit      Exit the assistant
  reset          Reset conversation history
  provider       Show current provider
  
Example Queries:
  - "List all files in resumes"
  - "Read the resume for John Doe"
  - "Find resumes mentioning Python"
  - "Create a summary of all candidates"
  - "Who has the most experience?"
  - "Search for DevOps skills"
  - "Compare Sarah Johnson and Michael Chen"
    """)


def main():
    """Main interactive loop."""
    print_banner()
    
    print("Choose LLM Provider:")
    print("  1. Mock (no API key required)")
    print("  2. OpenAI GPT-4 (requires OPENAI_API_KEY)")
    print("  3. Anthropic Claude (requires ANTHROPIC_API_KEY)")
    
    choice = input("\nEnter choice (1-3): ").strip()
    
    provider_map = {
        "1": "mock",
        "2": "openai",
        "3": "anthropic"
    }
    
    provider = provider_map.get(choice, "mock")
    
    print(f"\nInitializing {provider.upper()} assistant...")
    try:
        assistant = create_assistant(provider)
        print(f"✓ {provider.upper()} assistant ready!\n")
    except Exception as e:
        print(f"✗ Error initializing assistant: {e}")
        print("\nFalling back to mock assistant...")
        assistant = create_assistant("mock")
    
    print_help()
    
    # Main loop
    while True:
        try:
            query = input("\nYou: ").strip()
            
            if not query:
                continue
            
            # Check for commands
            if query.lower() in ["exit", "quit"]:
                print("Goodbye!")
                break
            elif query.lower() == "reset":
                assistant.reset_conversation()
                print("✓ Conversation history cleared")
                continue
            elif query.lower() == "help":
                print_help()
                continue
            elif query.lower() == "provider":
                print(f"Current provider: {provider.upper()}")
                continue
            
            # Process query
            print("\nProcessing...\n")
            response = assistant.process_user_query(query)
            print(f"Assistant: {response}")
            
        except KeyboardInterrupt:
            print("\n\nGoodbye!")
            break
        except Exception as e:
            print(f"✗ Error: {e}")
            import traceback
            traceback.print_exc()


if __name__ == "__main__":
    main()
