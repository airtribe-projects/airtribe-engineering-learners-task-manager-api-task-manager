# Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd llm_file_tools
pip install -r requirements.txt
```

### Step 2: Run Basic Demo
```bash
python examples/demo_basic.py
```

Expected output:
- Lists all 5 sample resumes
- Reads John Doe's resume
- Shows keyword search results
- Creates a summary file in the `output/` directory

### Step 3: Run Complete Test Suite
```bash
python examples/demo_complete.py
```

This demonstrates:
- All file system tools
- Tool execution system
- LLM mock integration
- Multi-file analysis

## Testing File Tools Only

If you just want to use the file tools without LLM:

```python
from fs_tools import FileSystemTools

# List files
files = FileSystemTools.list_files("resumes")
print(f"Found {files['count']} files")

# Read a file
resume = FileSystemTools.read_file("resumes/resume_john_doe.txt")
print(resume["content"][:500])

# Search
results = FileSystemTools.search_in_file(
    "resumes/resume_john_doe.txt",
    "Python"
)
print(f"{results['match_count']} matches found")

# Write
FileSystemTools.write_file(
    "output/analysis.txt",
    "My analysis here..."
)
```

## Testing LLM Integration

### With Mock (No API Key)
```bash
python examples/demo_mock.py
```

### With OpenAI
1. Get API key from https://platform.openai.com/account/api-keys
2. Set environment variable: `set OPENAI_API_KEY=sk-...`
3. Run: `python examples/demo_openai.py`

### With Anthropic
1. Get API key from https://console.anthropic.com/account/keys
2. Set environment variable: `set ANTHROPIC_API_KEY=sk-ant-...`
3. Run: `python examples/demo_anthropic.py`

### Interactive Mode
```bash
python examples/demo_interactive.py
```

## Project Structure

```
llm_file_tools/
├── fs_tools.py                 # Core file system tools
├── llm_file_assistant.py       # LLM integration
├── requirements.txt            # Dependencies
├── README.md                   # Full documentation
│
├── resumes/                    # Sample data (5 resume files)
│   ├── resume_john_doe.txt
│   ├── resume_sarah_johnson.txt
│   ├── resume_michael_chen.txt
│   ├── resume_emily_rodriguez.txt
│   └── resume_david_martinez.txt
│
├── output/                     # Generated files
│   └── (created during demo)
│
└── examples/                   # Demo scripts
    ├── demo_basic.py          # File tools only
    ├── demo_mock.py           # LLM with mock
    ├── demo_openai.py         # LLM with OpenAI
    ├── demo_anthropic.py      # LLM with Anthropic
    ├── demo_interactive.py    # Interactive mode
    └── demo_complete.py       # Full test suite
```

## Common Issues

### Import Errors
```bash
# Make sure you're in the llm_file_tools directory
cd llm_file_tools

# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

### File Not Found
- Check that `resumes/` directory exists
- Use absolute paths if running from different directory

### API Key Not Working
```python
# Debug: Check environment variable
import os
print(os.getenv("OPENAI_API_KEY"))  # Should not be None

# Or pass directly
from llm_file_assistant import OpenAIFileAssistant
assistant = OpenAIFileAssistant(api_key="sk-...")
```

## Performance Tips

1. **Cache results**: Store file listings to avoid repeated calls
2. **Search before read**: Use search_in_file() to locate relevant resumes first
3. **Batch processing**: Use list_files() with filters for efficiency
4. **Mock first**: Test logic with mock LLM before using paid APIs

## Features Overview

### File System Tools ✓
- [x] Read files (TXT, PDF, DOCX)
- [x] List files with filtering
- [x] Write files with auto-create directories
- [x] Search with context
- [x] Error handling
- [x] Metadata extraction

### LLM Integration ✓
- [x] OpenAI (GPT-4, GPT-3.5)
- [x] Anthropic (Claude 3)
- [x] Mock (for testing)
- [x] Function calling
- [x] Tool orchestration
- [x] Conversation history
- [x] Error recovery

### Sample Data ✓
- [x] 5 diverse resumes
- [x] Various skill sets
- [x] Different experience levels

## Next Steps

1. **Read the full README.md** for comprehensive documentation
2. **Explore examples/** for more use cases
3. **Try with your own files** by replacing resumes/
4. **Integrate with your LLM** (OpenAI or Anthropic)
5. **Build on top** for your specific use case

## Getting Help

- Check README.md for detailed documentation
- Review docstrings in source files
- Run demo scripts to see features in action
- Check examples/ for usage patterns

---

**Questions?** Review the relevant example file in `examples/` directory!
