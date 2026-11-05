import os
import sys
import json
import asyncio
from pathlib import Path

# Resolve workspace and python executable paths
WORKSPACE_DIR = Path(__file__).parent.resolve()
PYTHON_EXEC = str(Path("D:/Airtribe/NewAir/task-manager-api-swdsm100040/agentic_profile_matching/venv/Scripts/python.exe").resolve())
RESUMES_DIR = "D:/Airtribe/NewAir/task-manager-api-swdsm100040/llm_file_tools/resumes"

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from matching_agent import MatchingAgentExecutor

# Define connection parameters
fs_params = StdioServerParameters(
    command=PYTHON_EXEC,
    args=[str(WORKSPACE_DIR / "filesystem_mcp_server.py")],
    env={**os.environ}
)

search_params = StdioServerParameters(
    command=PYTHON_EXEC,
    args=[str(WORKSPACE_DIR / "web_search_mcp_server.py")],
    env={**os.environ}
)

async def test_filesystem_server():
    """Scenario 1: Test Filesystem MCP Server tools directly."""
    print("\n" + "="*50)
    print("SCENARIO 1: Testing Filesystem MCP Server Tools")
    print("="*50)
    
    async with stdio_client(fs_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            
            # 1. List Files
            print("1. Testing list_files tool...")
            result = await session.call_tool("list_files", arguments={"directory": RESUMES_DIR})
            data = json.loads(result.content[0].text)
            assert data["success"] is True, f"list_files failed: {data}"
            print(f"   -> Success! Found {data['count']} files in {RESUMES_DIR}")
            for f in data["files"][:3]:
                print(f"      - {f['filename']} ({f['size_kb']} KB)")
                
            # 2. Read File
            print("\n2. Testing read_file tool...")
            test_file = str(Path(RESUMES_DIR) / "resume_john_doe.txt")
            result = await session.call_tool("read_file", arguments={"filepath": test_file})
            data = json.loads(result.content[0].text)
            assert data["success"] is True, f"read_file failed: {data}"
            print(f"   -> Success! Read file metadata: {data['metadata']}")
            print(f"   -> First 100 characters of content: {data['content'][:100]}...")
            
            # 3. Search in File
            print("\n3. Testing search_in_file tool...")
            result = await session.call_tool("search_in_file", arguments={
                "filepath": test_file,
                "keyword": "Python"
            })
            data = json.loads(result.content[0].text)
            assert data["success"] is True, f"search_in_file failed: {data}"
            print(f"   -> Success! Found {data['match_count']} occurrences of 'Python'")
            for match in data["matches"]:
                print(f"      - Line {match['line_number']}: {match['matched_text']} (position {match['position']})")
                
            # 4. Batch Process
            print("\n4. Testing batch_process tool...")
            files_to_process = [
                str(Path(RESUMES_DIR) / "resume_john_doe.txt"),
                str(Path(RESUMES_DIR) / "resume_sarah_johnson.txt")
            ]
            result = await session.call_tool("batch_process", arguments={
                "filepaths": files_to_process,
                "operation": "search",
                "keyword": "Developer"
            })
            data = json.loads(result.content[0].text)
            assert data["success"] is True, f"batch_process failed: {data}"
            print(f"   -> Success! Concurrently processed {data['count']} files.")
            for file, res in data["results"].items():
                print(f"      - {Path(file).name}: {res.get('match_count', 0)} matches for 'Developer'")
                
            # 5. Write File
            print("\n5. Testing write_file tool...")
            output_file = str(WORKSPACE_DIR / "output" / "test_write.txt")
            result = await session.call_tool("write_file", arguments={
                "filepath": output_file,
                "content": "Hello World from MCP Server!"
            })
            data = json.loads(result.content[0].text)
            assert data["success"] is True, f"write_file failed: {data}"
            print(f"   -> Success! Wrote to output path: {data['filepath']}")
            
            # 6. Watch Directory
            print("\n6. Testing watch_directory tool...")
            watch_dir = str(WORKSPACE_DIR / "watch_test")
            os.makedirs(watch_dir, exist_ok=True)
            result = await session.call_tool("watch_directory", arguments={"directory": watch_dir})
            data = json.loads(result.content[0].text)
            assert data["success"] is True, f"watch_directory failed: {data}"
            print(f"   -> Success! Monitoring directory: {watch_dir}")
            
            # Write a new resume file to test the watchdog watcher
            print("   -> Writing a mock resume to trigger watch event...")
            mock_resume_path = str(Path(watch_dir) / "resume_new_candidate.txt")
            with open(mock_resume_path, "w") as f:
                f.write("New candidate resume: Python & Machine Learning Engineer.")
                
            # Wait a moment for watcher thread to capture creation event
            await asyncio.sleep(1.0)
            
            # Check monitored directories and new resumes via resources
            print("   -> Reading resumes://new-resumes resource...")
            resources = await session.list_resources()
            # Find resumes://new-resumes content
            for resource in resources.resources:
                if str(resource.uri) == "resumes://new-resumes":
                    res_content = await session.read_resource(resource.uri)
                    new_res_list = json.loads(res_content.contents[0].text)
                    print(f"      - Resource resumes://new-resumes shows: {len(new_res_list)} new resumes detected!")
                    for nr in new_res_list:
                        print(f"        * Detected resume: {nr['filename']} at {nr['detected_at']}")
            
            # Cleanup watchdog test files
            if os.path.exists(mock_resume_path):
                os.remove(mock_resume_path)
            os.rmdir(watch_dir)

async def test_search_server():
    """Scenario 2: Test WebSearch MCP Server directly."""
    print("\n" + "="*50)
    print("SCENARIO 2: Testing WebSearch MCP Server Tools")
    print("="*50)
    
    async with stdio_client(search_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            
            print("1. Testing web_search tool with query 'Python 3.12'...")
            result = await session.call_tool("web_search", arguments={"query": "Python 3.12"})
            data = json.loads(result.content[0].text)
            assert data["success"] is True, f"web_search failed: {data}"
            print(f"   -> Success! Found {len(data['results'])} search results.")
            for r in data["results"]:
                print(f"      - [{r['title']}] {r['snippet'][:80]}... ({r['url']})")

async def test_agent_workflow():
    """Scenario 3: Test LangGraph Matching Agent with Multi-MCP Client Integration."""
    print("\n" + "="*50)
    print("SCENARIO 3: Testing LangGraph Agent Workflow (Multi-MCP)")
    print("="*50)
    
    executor = MatchingAgentExecutor()
    
    # 1. Ask the agent to locate resumes and search for specific skills
    query_1 = (
        f"List all files in {RESUMES_DIR} using list_files, and tell me "
        "which file corresponds to John Doe."
    )
    print(f"Query 1: {query_1}")
    response_1 = await executor.run_query(query_1)
    print("\nAgent Response 1:")
    print(response_1)
    
    # 2. Ask the agent a multi-step technology query that requires web search and file search
    query_2 = (
        f"1. Search in {RESUMES_DIR}/resume_emily_rodriguez.txt for her skills.\n"
        "2. Use web_search to find information about 'Kubernetes ingress controllers'.\n"
        "3. Synthesize a response explaining how Emily's skills match the concept of Kubernetes ingress."
    )
    print(f"\nQuery 2: {query_2}")
    response_2 = await executor.run_query(query_2)
    print("\nAgent Response 2:")
    print(response_2)

async def main():
    try:
        await test_filesystem_server()
        await test_search_server()
        await test_agent_workflow()
        print("\n" + "="*50)
        print("ALL TESTS COMPLETED SUCCESSFULLY!")
        print("="*50)
    except Exception as e:
        print(f"\nTest failed with error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
