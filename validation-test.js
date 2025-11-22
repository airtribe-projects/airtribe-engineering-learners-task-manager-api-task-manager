/**
 * Comprehensive Validation and Error Handling Tests
 * This script tests all validation rules and error scenarios
 */

const http = require('http');

// Test cases for validation
const tests = [
    // ===== SUCCESSFUL REQUESTS =====
    {
        name: 'Create task - Valid request',
        method: 'POST',
        path: '/tasks',
        body: { title: 'Test Task', description: 'Valid task', completed: false },
        expectedStatus: 201,
        expectedSuccess: true
    },

    // ===== TITLE VALIDATION TESTS =====
    {
        name: 'Create task - Empty title',
        method: 'POST',
        path: '/tasks',
        body: { title: '', description: 'Description', completed: false },
        expectedStatus: 400,
        expectedError: 'Title is required'
    },
    {
        name: 'Create task - Null title',
        method: 'POST',
        path: '/tasks',
        body: { description: 'Description', completed: false },
        expectedStatus: 400,
        expectedError: 'Title is required'
    },
    {
        name: 'Create task - Whitespace only title',
        method: 'POST',
        path: '/tasks',
        body: { title: '   ', description: 'Description', completed: false },
        expectedStatus: 400,
        expectedError: 'Title is required'
    },

    // ===== DESCRIPTION VALIDATION TESTS =====
    {
        name: 'Create task - Missing description',
        method: 'POST',
        path: '/tasks',
        body: { title: 'Task', completed: false },
        expectedStatus: 400,
        expectedError: 'Description is required'
    },
    {
        name: 'Create task - Null description',
        method: 'POST',
        path: '/tasks',
        body: { title: 'Task', description: null, completed: false },
        expectedStatus: 400,
        expectedError: 'Description is required'
    },

    // ===== COMPLETED FIELD VALIDATION TESTS =====
    {
        name: 'Create task - completed is string "true"',
        method: 'POST',
        path: '/tasks',
        body: { title: 'Task', description: 'Desc', completed: 'true' },
        expectedStatus: 400,
        expectedError: 'Completed must be a boolean'
    },
    {
        name: 'Create task - completed is number',
        method: 'POST',
        path: '/tasks',
        body: { title: 'Task', description: 'Desc', completed: 1 },
        expectedStatus: 400,
        expectedError: 'Completed must be a boolean'
    },
    {
        name: 'Create task - completed is null',
        method: 'POST',
        path: '/tasks',
        body: { title: 'Task', description: 'Desc', completed: null },
        expectedStatus: 400,
        expectedError: 'Completed must be a boolean'
    },
    {
        name: 'Create task - completed missing',
        method: 'POST',
        path: '/tasks',
        body: { title: 'Task', description: 'Desc' },
        expectedStatus: 400,
        expectedError: 'Completed must be a boolean'
    },

    // ===== UPDATE VALIDATION TESTS =====
    {
        name: 'Update task - Empty title',
        method: 'PUT',
        path: '/tasks/1',
        body: { title: '' },
        expectedStatus: 400,
        expectedError: 'Title cannot be empty'
    },
    {
        name: 'Update task - Invalid completed type',
        method: 'PUT',
        path: '/tasks/1',
        body: { completed: 'false' },
        expectedStatus: 400,
        expectedError: 'Completed must be a boolean'
    },
    {
        name: 'Update task - Valid partial update (only title)',
        method: 'PUT',
        path: '/tasks/1',
        body: { title: 'Updated Title' },
        expectedStatus: 200,
        expectedSuccess: true
    },
    {
        name: 'Update task - Valid partial update (only completed)',
        method: 'PUT',
        path: '/tasks/1',
        body: { completed: true },
        expectedStatus: 200,
        expectedSuccess: true
    },

    // ===== 404 ERROR TESTS =====
    {
        name: 'Get task - Non-existent task ID',
        method: 'GET',
        path: '/tasks/99999',
        body: null,
        expectedStatus: 404,
        expectedError: 'Task not found'
    },
    {
        name: 'Update task - Non-existent task ID',
        method: 'PUT',
        path: '/tasks/99999',
        body: { title: 'Updated' },
        expectedStatus: 404,
        expectedError: 'Task not found'
    },
    {
        name: 'Delete task - Non-existent task ID',
        method: 'DELETE',
        path: '/tasks/99999',
        body: null,
        expectedStatus: 404,
        expectedError: 'Task not found'
    }
];

// Function to run tests
async function runTests() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║   TASK MANAGER API - VALIDATION & ERROR HANDLING TEST SUITE    ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        const result = await runTest(test);
        if (result) {
            passed++;
        } else {
            failed++;
        }
    }

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log(`║ Test Results: ${passed} PASSED, ${failed} FAILED                            ║`);
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
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
                try {
                    const response = JSON.parse(data);
                    const passed = validateResponse(test, res.statusCode, response);

                    if (passed) {
                        console.log(`✅ PASS: ${test.name}`);
                    } else {
                        console.log(`❌ FAIL: ${test.name}`);
                        console.log(`   Expected Status: ${test.expectedStatus}, Got: ${res.statusCode}`);
                        if (test.expectedError) {
                            console.log(`   Expected Error: "${test.expectedError}"`);
                            console.log(`   Got Message: "${response.message || 'N/A'}"`);
                        }
                    }
                    resolve(passed);
                } catch (e) {
                    console.log(`❌ FAIL: ${test.name} (Parse Error)`);
                    console.log(`   Error: ${e.message}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.log(`❌ FAIL: ${test.name}`);
            console.log(`   Connection Error: ${e.message}`);
            resolve(false);
        });

        if (test.body) {
            req.write(JSON.stringify(test.body));
        }
        req.end();
    });
}

function validateResponse(test, statusCode, response) {
    // Check status code
    if (statusCode !== test.expectedStatus) {
        return false;
    }

    // Check error message if expecting error
    if (test.expectedError) {
        return response.message && response.message.includes(test.expectedError);
    }

    // Check success flag if expecting success
    if (test.expectedSuccess) {
        return response.success === true;
    }

    return true;
}

// Wait for server and run tests
setTimeout(() => {
    runTests().catch(err => {
        console.error('Test suite error:', err);
        process.exit(1);
    });
}, 1000);
