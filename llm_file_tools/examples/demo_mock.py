"""
Example 2: Mock LLM Assistant Demo
Demonstrates LLM integration using mock assistant (no API key required).
Great for testing and understanding function calling flow.
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from llm_file_assistant import create_assistant


def print_section(title):
    """Print a section header."""
    print("\n" + "=" * 60)
    print(title)
    print("=" * 60)


def demo_mock_assistant():
    """Demonstrate mock assistant."""
    print_section("LLM FILE ASSISTANT - MOCK DEMO")
    
    print("\nInitializing Mock Assistant...")
    assistant = create_assistant("mock")
    print("✓ Assistant ready!\n")
    
    # Demo 1: List files
    print_section("QUERY 1: List Files")
    query1 = "List all resume files in the resumes folder"
    print(f"User: {query1}")
    response1 = assistant.process_user_query(query1)
    print(f"Assistant: {response1}")
    
    # Demo 2: Read file
    print_section("QUERY 2: Read Resume")
    query2 = "Read the resume for Sarah Johnson"
    print(f"User: {query2}")
    response2 = assistant.process_user_query(query2)
    print(f"Assistant: {response2}")
    
    # Demo 3: Reset and new conversation
    print_section("DEMO: Reset Conversation")
    assistant.reset_conversation()
    print("✓ Conversation history cleared")
    print("Ready for new conversation\n")
    
    # Demo 4: Complex query
    print_section("QUERY 3: Complex Request")
    query3 = "How many candidates have Python experience in the resumes folder?"
    print(f"User: {query3}")
    response3 = assistant.process_user_query(query3)
    print(f"Assistant: {response3}")
    
    print_section("DEMO COMPLETE")
    print("✓ All demonstrations completed successfully!")


def demo_conversation_flow():
    """Show how conversation history works."""
    print_section("CONVERSATION FLOW DEMO")
    
    assistant = create_assistant("mock")
    
    print("Creating a multi-turn conversation...\n")
    
    # Turn 1
    print("Turn 1:")
    print('User: "What files are in the resumes folder?"')
    response = assistant.process_user_query("What files are in the resumes folder?")
    print(f"Assistant: {response}")
    
    # Turn 2
    print("\nTurn 2:")
    print('User: "Can you read the first one?"')
    response = assistant.process_user_query("Can you read the first one?")
    print(f"Assistant: {response}")
    
    print("\n✓ Multi-turn conversation demonstrated")
    print(f"  Total messages in history: {len(assistant.conversation_history)}")


def demo_tool_definitions():
    """Show available tools."""
    print_section("AVAILABLE TOOLS")
    
    from fs_tools import TOOLS
    
    print(f"\nTotal tools available: {len(TOOLS)}\n")
    
    for i, tool in enumerate(TOOLS, 1):
        print(f"{i}. {tool['name'].upper()}")
        print(f"   Description: {tool['description']}")
        print(f"   Parameters: {', '.join(tool['parameters']['required'])}")
        print()


def main():
    """Run all demos."""
    print("\n")
    print("╔" + "=" * 58 + "╗")
    print("║" + " " * 8 + "MOCK LLM ASSISTANT - DEMONSTRATION" + " " * 16 + "║")
    print("╚" + "=" * 58 + "╝")
    
    try:
        demo_tool_definitions()
        demo_mock_assistant()
        demo_conversation_flow()
        
        print_section("ALL DEMOS COMPLETED")
        print("✓ Mock assistant demonstrations complete!")
        print("\nNext Steps:")
        print("  1. Try demo_openai.py with real OpenAI API")
        print("  2. Try demo_anthropic.py with Anthropic API")
        print("  3. Run demo_interactive.py for interactive mode")
        print()
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
