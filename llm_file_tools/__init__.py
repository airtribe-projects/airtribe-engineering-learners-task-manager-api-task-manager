"""
LLM File Tools - Resume Analysis System

A demonstration of LLM function calling/tool use for intelligent file operations.

Modules:
  - fs_tools: Core file system tools (read, list, write, search)
  - llm_file_assistant: LLM integration with multiple providers

Example:
    >>> from fs_tools import FileSystemTools
    >>> from llm_file_assistant import create_assistant
    >>> 
    >>> # Use file tools directly
    >>> files = FileSystemTools.list_files("resumes")
    >>> 
    >>> # Or use LLM to orchestrate tools
    >>> assistant = create_assistant("mock")
    >>> response = assistant.process_user_query("Find Python developers")
"""

__version__ = "1.0.0"
__author__ = "LLM Tools Team"

from fs_tools import FileSystemTools, TOOLS, execute_tool
from llm_file_assistant import (
    LLMFileAssistant,
    OpenAIFileAssistant,
    AnthropicFileAssistant,
    MockFileAssistant,
    create_assistant
)

__all__ = [
    "FileSystemTools",
    "TOOLS",
    "execute_tool",
    "LLMFileAssistant",
    "OpenAIFileAssistant",
    "AnthropicFileAssistant",
    "MockFileAssistant",
    "create_assistant",
]
