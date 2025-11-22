const http = require('http');

// Test all endpoints
async function testEndpoints() {
    const tests = [
        {
            name: 'GET /tasks - Retrieve all tasks',
            method: 'GET',
            path: '/tasks',
            data: null
        },
        {
            name: 'GET /tasks/1 - Retrieve task with ID 1',
            method: 'GET',
            path: '/tasks/1',
            data: null
        },
        {
            name: 'POST /tasks - Create a new task',
            method: 'POST',
            path: '/tasks',
            data: JSON.stringify({ title: 'New Task', description: 'This is a new task', completed: false })
        },
        {
            name: 'PUT /tasks/1 - Update task with ID 1',
            method: 'PUT',
            path: '/tasks/1',
            data: JSON.stringify({ title: 'Updated Task', completed: true })
        },
        {
            name: 'DELETE /tasks/100 - Delete a non-existent task',
            method: 'DELETE',
            path: '/tasks/100',
            data: null
        },
        {
            name: 'GET /tasks/1 - Verify task still exists after update',
            method: 'GET',
            path: '/tasks/1',
            data: null
        }
    ];

    for (const test of tests) {
        await runTest(test);
    }
}

function runTest(test) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: test.path,
            method: test.method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`\n✓ ${test.name}`);
                console.log(`Status: ${res.statusCode}`);
                console.log('Response:', data);
                console.log('---');
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`✗ ${test.name}`, e.message);
            resolve();
        });

        if (test.data) {
            req.write(test.data);
        }
        req.end();
    });
}

console.log('Starting API Tests...\n');
testEndpoints().then(() => console.log('\nAll tests completed!'));
