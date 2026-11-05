# State Machine & Workflow Diagram (Agent ↔ MCP Interaction)

This document describes the state machine flow and communication sequence between the LangGraph matching agent, the MCP client, and the multiple MCP servers (Filesystem MCP Server and Web Search MCP Server).

---

## 1. LangGraph Agent State Machine Diagram

Below is the state transition diagram of the ReAct agent built with LangGraph. When a user sends a query, the agent iterates by calling tools through the MCP client and processing the results until the task is complete.

```mermaid
stateDiagram-v2
    [*] --> START
    START --> AgentNode : Initialize Agent State (Load messages)
    
    state AgentNode {
        [*] --> CallLLM : Invoke LLM with tools schema
        CallLLM --> CheckToolCall : Check LLM decision
    }
    
    CheckToolCall --> ActionNode : LLM decides to call tools (tool_calls present)
    CheckToolCall --> END : LLM decides to finish (no tool_calls)
    
    state ActionNode {
        [*] --> ParseTool : Extract tool name and arguments
        ParseTool --> DelegateToClient : Route execution to MCP Client Session
        
        state DelegateToClient {
            [*] --> RouteSession : Check tool provider
            RouteSession --> FilesystemSession : call_tool (read_file, list_files, etc.)
            RouteSession --> WebSearchSession : call_tool (web_search)
        }
        
        DelegateToClient --> AppendResult : Convert MCP response to ToolMessage
        AppendResult --> [*]
    }
    
    ActionNode --> AgentNode : Loop back with ToolMessage added to state
    END --> [*] : Close MCP client sessions and exit
```

---

## 2. Communication Sequence Diagram

Below is the sequence diagram illustrating how JSON-RPC 2.0 communication flows over stdio between the Agent, the MCP Client, and the independent MCP Server subprocesses.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Agent as MatchingAgent (LangGraph)
    participant Client as MCP Client Session
    participant FS_Server as Filesystem MCP Server
    participant Web_Server as WebSearch MCP Server

    User->>Agent: Submit Query (e.g. "Find Python candidates")
    
    Note over Agent, Client: Setup Connections
    Agent->>Client: Start MCP subprocesses (stdio)
    Client->>FS_Server: Launch & initialize handshake
    FS_Server-->>Client: Handshake response (success)
    Client->>Web_Server: Launch & initialize handshake
    Web_Server-->>Client: Handshake response (success)
    
    Note over Agent: ReAct Loop Start
    Agent->>Agent: Call LLM with user query and tool schemas
    
    alt Needs File Directory List
        Agent->>Client: call_tool("list_files", {"directory": "resumes"})
        Client->>FS_Server: JSON-RPC 2.0: call_tool (list_files)
        FS_Server->>FS_Server: Scan directory & filter extensions
        FS_Server-->>Client: JSON-RPC 2.0 response: file list
        Client-->>Agent: list_files result text
    end

    alt Needs to Process Resumes
        Agent->>Client: call_tool("batch_process", {"filepaths": [...], "operation": "read"})
        Client->>FS_Server: JSON-RPC 2.0: call_tool (batch_process)
        FS_Server->>FS_Server: Concurrent PDF/TXT/DOCX extraction via ThreadPoolExecutor
        FS_Server-->>Client: JSON-RPC 2.0 response: text contents
        Client-->>Agent: batch_process result text
    end

    alt Needs Technology Background Information
        Agent->>Client: call_tool("web_search", {"query": "React 19 Server Components"})
        Client->>Web_Server: JSON-RPC 2.0: call_tool (web_search)
        Web_Server->>Web_Server: Retrieve tech details & links
        Web_Server-->>Client: JSON-RPC 2.0 response: search snippets
        Client-->>Agent: web_search result text
    end

    Agent->>Agent: Call LLM to synthesize final response
    Agent-->>User: Return synthesized response (matches, summary, technology trends)
    
    Note over Agent, Client: Connection Teardown
    Agent->>Client: Terminate sessions
    Client->>FS_Server: Kill subprocess
    Client->>Web_Server: Kill subprocess
```
