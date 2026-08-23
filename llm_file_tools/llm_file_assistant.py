"""
LLM File Assistant Module
Integrates file system tools with LLM for intelligent file handling.
Supports OpenAI, Anthropic, and other LLM providers.
"""

import json
import os
from typing import Optional, List, Dict, Any, Callable
from abc import ABC, abstractmethod

from fs_tools import FileSystemTools, TOOLS, execute_tool


class LLMFileAssistant(ABC):
    """Abstract base class for LLM-based file assistants."""
    
    def __init__(self, system_prompt: Optional[str] = None):
        """
        Initialize the assistant.
        
        Args:
            system_prompt: Optional custom system prompt
        """
        self.system_prompt = system_prompt or self._get_default_system_prompt()
        self.conversation_history = []
        self.tools = TOOLS
    
    @staticmethod
    def _get_default_system_prompt() -> str:
        """Get default system prompt for the assistant."""
        return """You are a helpful file assistant with access to file system tools.
You can read files, list directories, write files, and search for keywords.
When users ask you to perform file operations, use the available tools to help them.

Available tools:
1. read_file - Read and extract content from resume files
2. list_files - List files in a directory
3. write_file - Write content to files
4. search_in_file - Search for keywords in files

Always be helpful and provide clear summaries of what you find.
When reading multiple files, provide a summary of key findings."""
    
    @abstractmethod
    def _call_llm(self, messages: List[Dict[str, str]], tools: List[Dict]) -> Dict[str, Any]:
        """
        Call the LLM with messages and tools.
        
        Args:
            messages: Conversation messages
            tools: Available tools
            
        Returns:
            LLM response
        """
        pass
    
    def process_user_query(self, query: str, max_iterations: int = 10) -> str:
        """
        Process a user query using the LLM and tools.
        
        Args:
            query: User's question or request
            max_iterations: Maximum number of tool calls
            
        Returns:
            Final response from the assistant
        """
        # Add user message to history
        self.conversation_history.append({
            "role": "user",
            "content": query
        })
        
        iterations = 0
        while iterations < max_iterations:
            iterations += 1
            
            # Get LLM response
            response = self._call_llm(self.conversation_history, self.tools)
            
            # Check if we have a final response
            if response.get("stop_reason") == "end_turn" or \
               response.get("finish_reason") == "stop" or \
               not response.get("tool_calls"):
                # No more tool calls, return final message
                final_message = response.get("content", "")
                self.conversation_history.append({
                    "role": "assistant",
                    "content": final_message
                })
                return final_message
            
            # Process tool calls
            assistant_message = response.get("content", "")
            tool_calls = response.get("tool_calls", [])
            
            if not tool_calls:
                # No tool calls, return the response
                self.conversation_history.append({
                    "role": "assistant",
                    "content": assistant_message
                })
                return assistant_message
            
            # Add assistant message with tool calls
            self.conversation_history.append({
                "role": "assistant",
                "content": assistant_message,
                "tool_calls": tool_calls
            })
            
            # Execute tool calls
            tool_results = []
            for tool_call in tool_calls:
                tool_name = tool_call.get("name") or tool_call.get("function", {}).get("name")
                tool_input = tool_call.get("input") or json.loads(tool_call.get("function", {}).get("arguments", "{}"))
                
                try:
                    result = execute_tool(tool_name, **tool_input)
                    tool_results.append({
                        "tool_use_id": tool_call.get("id") or tool_call.get("name"),
                        "content": json.dumps(result),
                        "is_error": False
                    })
                except Exception as e:
                    tool_results.append({
                        "tool_use_id": tool_call.get("id") or tool_call.get("name"),
                        "content": json.dumps({"error": str(e)}),
                        "is_error": True
                    })
            
            # Add tool results to history
            self.conversation_history.append({
                "role": "user",
                "content": tool_results
            })
        
        return "Maximum iterations reached without a final response."
    
    def reset_conversation(self):
        """Reset the conversation history."""
        self.conversation_history = []


class OpenAIFileAssistant(LLMFileAssistant):
    """LLM File Assistant using OpenAI's API."""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "gpt-4", system_prompt: Optional[str] = None):
        """
        Initialize OpenAI assistant.
        
        Args:
            api_key: OpenAI API key (uses OPENAI_API_KEY env var if not provided)
            model: Model to use (default: gpt-4)
            system_prompt: Optional custom system prompt
        """
        super().__init__(system_prompt)
        
        try:
            from openai import OpenAI
        except ImportError:
            raise ImportError("OpenAI library not installed. Install with: pip install openai")
        
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OpenAI API key not provided and OPENAI_API_KEY env var not set")
        
        self.client = OpenAI(api_key=self.api_key)
        self.model = model
    
    def _call_llm(self, messages: List[Dict[str, str]], tools: List[Dict]) -> Dict[str, Any]:
        """Call OpenAI API with tools."""
        # Convert tool results format for OpenAI
        openai_messages = []
        for msg in messages:
            if isinstance(msg.get("content"), list):
                # Tool results
                openai_messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
            else:
                openai_messages.append(msg)
        
        # Convert tools format for OpenAI
        openai_tools = []
        for tool in tools:
            openai_tools.append({
                "type": "function",
                "function": {
                    "name": tool["name"],
                    "description": tool["description"],
                    "parameters": tool["parameters"]
                }
            })
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=openai_messages,
            tools=openai_tools if tools else None,
            tool_choice="auto" if tools else None,
            temperature=0.7,
            max_tokens=4096
        )
        
        # Parse response
        content = response.choices[0].message.content or ""
        tool_calls = []
        
        if response.choices[0].message.tool_calls:
            for tool_call in response.choices[0].message.tool_calls:
                tool_calls.append({
                    "id": tool_call.id,
                    "name": tool_call.function.name,
                    "input": json.loads(tool_call.function.arguments)
                })
        
        return {
            "content": content,
            "tool_calls": tool_calls,
            "finish_reason": response.choices[0].finish_reason
        }


class AnthropicFileAssistant(LLMFileAssistant):
    """LLM File Assistant using Anthropic's Claude API."""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "claude-3-sonnet-20240229", system_prompt: Optional[str] = None):
        """
        Initialize Anthropic assistant.
        
        Args:
            api_key: Anthropic API key (uses ANTHROPIC_API_KEY env var if not provided)
            model: Model to use (default: claude-3-sonnet-20240229)
            system_prompt: Optional custom system prompt
        """
        super().__init__(system_prompt)
        
        try:
            import anthropic
        except ImportError:
            raise ImportError("Anthropic library not installed. Install with: pip install anthropic")
        
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        if not self.api_key:
            raise ValueError("Anthropic API key not provided and ANTHROPIC_API_KEY env var not set")
        
        import anthropic
        self.client = anthropic.Anthropic(api_key=self.api_key)
        self.model = model
    
    def _call_llm(self, messages: List[Dict[str, str]], tools: List[Dict]) -> Dict[str, Any]:
        """Call Anthropic API with tools."""
        # Convert tool results format for Anthropic
        anthropic_messages = []
        for msg in messages:
            if isinstance(msg.get("content"), list):
                # Tool results - flatten to string
                anthropic_messages.append({
                    "role": msg["role"],
                    "content": json.dumps(msg["content"])
                })
            elif msg.get("tool_calls"):
                # Message with tool calls - format for Anthropic
                content = msg.get("content", "")
                tool_calls_text = "\n".join([f"Tool: {tc.get('name')}\nArgs: {json.dumps(tc.get('input'))}" for tc in msg.get("tool_calls", [])])
                anthropic_messages.append({
                    "role": msg["role"],
                    "content": f"{content}\n{tool_calls_text}" if content else tool_calls_text
                })
            else:
                anthropic_messages.append(msg)
        
        # Convert tools format for Anthropic
        anthropic_tools = [
            {
                "name": tool["name"],
                "description": tool["description"],
                "input_schema": tool["parameters"]
            }
            for tool in tools
        ]
        
        response = self.client.messages.create(
            model=self.model,
            max_tokens=4096,
            system=self.system_prompt,
            tools=anthropic_tools if tools else None,
            messages=anthropic_messages
        )
        
        # Parse response
        content = ""
        tool_calls = []
        
        for block in response.content:
            if hasattr(block, "text"):
                content += block.text
            elif hasattr(block, "type") and block.type == "tool_use":
                tool_calls.append({
                    "id": block.id,
                    "name": block.name,
                    "input": block.input
                })
        
        return {
            "content": content,
            "tool_calls": tool_calls,
            "stop_reason": response.stop_reason
        }


class MockFileAssistant(LLMFileAssistant):
    """Mock assistant for testing without API keys."""
    
    def __init__(self, system_prompt: Optional[str] = None):
        """Initialize mock assistant."""
        super().__init__(system_prompt)
    
    def _call_llm(self, messages: List[Dict[str, str]], tools: List[Dict]) -> Dict[str, Any]:
        """Mock LLM response."""
        # Simple rule-based responses for testing
        last_message = messages[-1].get("content", "").lower() if messages else ""
        
        if "list" in last_message and "file" in last_message:
            # Extract directory from message if possible
            import re
            match = re.search(r'(?:in|from)\s+["\']?([^"\']+)["\']?', last_message)
            directory = match.group(1) if match else "."
            
            return {
                "content": f"I'll list files in {directory}",
                "tool_calls": [{
                    "name": "list_files",
                    "input": {"directory": directory}
                }],
                "finish_reason": "tool_use"
            }
        
        elif "read" in last_message and ("file" in last_message or "resume" in last_message):
            # Mock file read
            return {
                "content": "I'll read that file for you.",
                "tool_calls": [{
                    "name": "read_file",
                    "input": {"filepath": "./resumes/sample.txt"}
                }],
                "finish_reason": "tool_use"
            }
        
        else:
            return {
                "content": "I've processed your request.",
                "tool_calls": [],
                "finish_reason": "end_turn"
            }


def create_assistant(provider: str = "mock", **kwargs) -> LLMFileAssistant:
    """
    Create an LLM file assistant.
    
    Args:
        provider: LLM provider ('openai', 'anthropic', or 'mock')
        **kwargs: Additional arguments for the assistant
        
    Returns:
        LLMFileAssistant instance
    """
    providers = {
        "openai": OpenAIFileAssistant,
        "anthropic": AnthropicFileAssistant,
        "mock": MockFileAssistant,
    }
    
    if provider not in providers:
        raise ValueError(f"Unknown provider: {provider}. Supported: {', '.join(providers.keys())}")
    
    return providers[provider](**kwargs)


if __name__ == "__main__":
    # Demo
    print("LLM File Assistant Demo")
    print("=" * 50)
    
    # Create mock assistant for demo
    assistant = create_assistant("mock")
    
    # Test query
    query = "List all PDF files in the resumes directory"
    print(f"\nUser: {query}")
    response = assistant.process_user_query(query)
    print(f"Assistant: {response}")
