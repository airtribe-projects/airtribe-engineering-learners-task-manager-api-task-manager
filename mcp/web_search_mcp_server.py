import sys
import json
from mcp.server.fastmcp import FastMCP

# Initialize the second MCP Server
mcp = FastMCP("WebSearchServer")

@mcp.tool()
def web_search(query: str) -> dict:
    """
    Perform a simulated web search for developer technologies, candidate backgrounds, or job requirements.
    
    Args:
        query: Search query string.
    """
    print(f"[MCP TOOL] web_search called for query: {query}", file=sys.stderr, flush=True)
    query_lower = query.lower()
    
    # Return structured search results based on common keywords
    if "python" in query_lower:
        results = [
            {
                "title": "Python 3.12 Features & Performance",
                "snippet": "Python 3.12 introduces new features like f-string syntax improvements, PEP 695 type parameter syntax, and isolation of subinterpreters.",
                "url": "https://docs.python.org/3/whatsnew/3.12.html"
            },
            {
                "title": "Effective Python: 90 Specific Ways to Write Better Python",
                "snippet": "Best practices for writing robust, clean, and highly performant Python code, focusing on generator expressions, concurrency, and OOP.",
                "url": "https://effectivepython.com"
            }
        ]
    elif "react" in query_lower:
        results = [
            {
                "title": "React 19 Release Overview",
                "snippet": "React 19 is here! Introducing Server Actions, asset loading, document metadata support, and new hooks like useActionState and useOptimistic.",
                "url": "https://react.dev/blog/2024/12/05/react-19"
            },
            {
                "title": "Next.js App Router Best Practices",
                "snippet": "Learn about layout structures, server-side data fetching, dynamic rendering, and static site generation techniques using Next.js.",
                "url": "https://nextjs.org/docs"
            }
        ]
    elif "kubernetes" in query_lower or "docker" in query_lower:
        results = [
            {
                "title": "Kubernetes Production Patterns",
                "snippet": "A guide to setting up secure, scalable, and resilient Kubernetes clusters. Covers ingress controllers, network policies, and persistent storage.",
                "url": "https://kubernetes.io/docs/setup"
            },
            {
                "title": "Dockerizing Microservices",
                "snippet": "How to optimize Dockerfiles, run multi-stage builds, and orchestrate local development containers with Docker Compose.",
                "url": "https://docs.docker.com/get-started"
            }
        ]
    else:
        results = [
            {
                "title": f"General search results for: {query}",
                "snippet": f"Found technical document references, library repositories, and developers blogs matching '{query}' in general indexing.",
                "url": f"https://www.google.com/search?q={query.replace(' ', '+')}"
            }
        ]
        
    return {
        "success": True,
        "query": query,
        "results": results
    }

if __name__ == "__main__":
    # Start the WebSearch stdio server
    mcp.run("stdio")
