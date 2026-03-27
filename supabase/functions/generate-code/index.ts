import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GenerateCodeRequest {
  prompt: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { prompt }: GenerateCodeRequest = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const generatedCode = generateHTMLTemplate(prompt);

    return new Response(
      JSON.stringify({ code: generatedCode }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in generate-code function:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to generate code',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

function generateHTMLTemplate(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('todo') || lowerPrompt.includes('task')) {
    return generateTodoApp();
  } else if (lowerPrompt.includes('calculator')) {
    return generateCalculator();
  } else if (lowerPrompt.includes('form') || lowerPrompt.includes('contact')) {
    return generateForm();
  } else if (lowerPrompt.includes('card') || lowerPrompt.includes('profile')) {
    return generateProfileCard();
  } else if (lowerPrompt.includes('timer') || lowerPrompt.includes('countdown')) {
    return generateTimer();
  } else if (lowerPrompt.includes('gallery') || lowerPrompt.includes('image')) {
    return generateImageGallery();
  } else if (lowerPrompt.includes('quiz') || lowerPrompt.includes('trivia')) {
    return generateQuiz();
  } else if (lowerPrompt.includes('chart') || lowerPrompt.includes('graph')) {
    return generateChart();
  } else {
    return generateDefaultTemplate(prompt);
  }
}

function generateTodoApp(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 30px;
            max-width: 500px;
            width: 100%;
        }
        h1 {
            color: #667eea;
            margin-bottom: 25px;
            text-align: center;
        }
        .input-container {
            display: flex;
            gap: 10px;
            margin-bottom: 25px;
        }
        input[type="text"] {
            flex: 1;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        input[type="text"]:focus {
            outline: none;
            border-color: #667eea;
        }
        button {
            padding: 12px 24px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: background 0.3s;
        }
        button:hover {
            background: #5568d3;
        }
        .todo-list {
            list-style: none;
        }
        .todo-item {
            background: #f5f5f5;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s;
        }
        .todo-item:hover {
            background: #ebebeb;
            transform: translateX(5px);
        }
        .todo-item.completed {
            opacity: 0.6;
            text-decoration: line-through;
        }
        .todo-text {
            flex: 1;
            cursor: pointer;
        }
        .delete-btn {
            background: #e74c3c;
            padding: 8px 16px;
            font-size: 14px;
        }
        .delete-btn:hover {
            background: #c0392b;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>My Todo List</h1>
        <div class="input-container">
            <input type="text" id="todoInput" placeholder="Add a new task...">
            <button onclick="addTodo()">Add</button>
        </div>
        <ul id="todoList" class="todo-list"></ul>
    </div>

    <script>
        let todos = [];

        function addTodo() {
            const input = document.getElementById('todoInput');
            const text = input.value.trim();

            if (text) {
                todos.push({ id: Date.now(), text, completed: false });
                input.value = '';
                renderTodos();
            }
        }

        function toggleTodo(id) {
            todos = todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            );
            renderTodos();
        }

        function deleteTodo(id) {
            todos = todos.filter(todo => todo.id !== id);
            renderTodos();
        }

        function renderTodos() {
            const list = document.getElementById('todoList');
            list.innerHTML = todos.map(todo => \`
                <li class="todo-item \${todo.completed ? 'completed' : ''}">
                    <span class="todo-text" onclick="toggleTodo(\${todo.id})">\${todo.text}</span>
                    <button class="delete-btn" onclick="deleteTodo(\${todo.id})">Delete</button>
                </li>
            \`).join('');
        }

        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTodo();
        });
    </script>
</body>
</html>`;
}

function generateCalculator(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculator</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .calculator {
            background: #2c3e50;
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .display {
            background: #34495e;
            color: white;
            font-size: 36px;
            padding: 20px;
            text-align: right;
            border-radius: 10px;
            margin-bottom: 20px;
            min-height: 80px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            word-wrap: break-word;
        }
        .buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }
        button {
            padding: 25px;
            font-size: 20px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s;
            font-weight: 600;
        }
        button:hover {
            transform: scale(1.05);
        }
        .number, .decimal {
            background: #ecf0f1;
            color: #2c3e50;
        }
        .operator {
            background: #e67e22;
            color: white;
        }
        .equals {
            background: #27ae60;
            color: white;
        }
        .clear {
            background: #e74c3c;
            color: white;
        }
    </style>
</head>
<body>
    <div class="calculator">
        <div class="display" id="display">0</div>
        <div class="buttons">
            <button class="clear" onclick="clearDisplay()">C</button>
            <button class="operator" onclick="appendOperator('/')">/</button>
            <button class="operator" onclick="appendOperator('*')">×</button>
            <button class="operator" onclick="appendOperator('-')">-</button>

            <button class="number" onclick="appendNumber('7')">7</button>
            <button class="number" onclick="appendNumber('8')">8</button>
            <button class="number" onclick="appendNumber('9')">9</button>
            <button class="operator" onclick="appendOperator('+')">+</button>

            <button class="number" onclick="appendNumber('4')">4</button>
            <button class="number" onclick="appendNumber('5')">5</button>
            <button class="number" onclick="appendNumber('6')">6</button>
            <button class="equals" onclick="calculate()" style="grid-row: span 2">=</button>

            <button class="number" onclick="appendNumber('1')">1</button>
            <button class="number" onclick="appendNumber('2')">2</button>
            <button class="number" onclick="appendNumber('3')">3</button>

            <button class="number" onclick="appendNumber('0')" style="grid-column: span 2">0</button>
            <button class="decimal" onclick="appendNumber('.')">.</button>
        </div>
    </div>

    <script>
        let display = document.getElementById('display');
        let currentValue = '0';

        function updateDisplay() {
            display.textContent = currentValue;
        }

        function clearDisplay() {
            currentValue = '0';
            updateDisplay();
        }

        function appendNumber(num) {
            if (currentValue === '0' && num !== '.') {
                currentValue = num;
            } else {
                currentValue += num;
            }
            updateDisplay();
        }

        function appendOperator(op) {
            const lastChar = currentValue[currentValue.length - 1];
            if (['+', '-', '*', '/'].includes(lastChar)) {
                currentValue = currentValue.slice(0, -1) + op;
            } else {
                currentValue += op;
            }
            updateDisplay();
        }

        function calculate() {
            try {
                currentValue = String(eval(currentValue.replace('×', '*')));
                updateDisplay();
            } catch (e) {
                currentValue = 'Error';
                updateDisplay();
                setTimeout(() => {
                    currentValue = '0';
                    updateDisplay();
                }, 1500);
            }
        }
    </script>
</body>
</html>`;
}

function generateForm(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .form-container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 40px;
            max-width: 500px;
            width: 100%;
        }
        h1 {
            color: #667eea;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 600;
        }
        input, textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
            font-family: inherit;
            transition: border-color 0.3s;
        }
        input:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        textarea {
            resize: vertical;
            min-height: 120px;
        }
        button {
            width: 100%;
            padding: 15px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
        }
        button:hover {
            background: #5568d3;
        }
        .success-message {
            display: none;
            background: #27ae60;
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="form-container">
        <h1>Contact Us</h1>
        <p class="subtitle">We'd love to hear from you!</p>

        <form id="contactForm">
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" required>
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" required>
            </div>

            <div class="form-group">
                <label for="subject">Subject</label>
                <input type="text" id="subject" required>
            </div>

            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" required></textarea>
            </div>

            <button type="submit">Send Message</button>
        </form>

        <div class="success-message" id="successMessage">
            Thank you for your message! We'll get back to you soon.
        </div>
    </div>

    <script>
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const form = this;
            const successMessage = document.getElementById('successMessage');

            form.style.display = 'none';
            successMessage.style.display = 'block';

            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                successMessage.style.display = 'none';
            }, 3000);
        });
    </script>
</body>
</html>`;
}

function generateProfileCard(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile Card</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 400px;
            width: 100%;
            overflow: hidden;
        }
        .card-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 150px;
        }
        .card-body {
            padding: 30px;
            text-align: center;
            position: relative;
        }
        .avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 5px solid white;
            margin-top: -90px;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: white;
            font-weight: bold;
            margin-left: auto;
            margin-right: auto;
        }
        h1 {
            color: #333;
            margin-bottom: 5px;
        }
        .title {
            color: #667eea;
            margin-bottom: 20px;
        }
        .bio {
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .stats {
            display: flex;
            justify-content: space-around;
            margin-bottom: 30px;
        }
        .stat {
            text-align: center;
        }
        .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
        }
        .stat-label {
            color: #999;
            font-size: 14px;
        }
        .button {
            background: #667eea;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s;
        }
        .button:hover {
            background: #5568d3;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="card-header"></div>
        <div class="card-body">
            <div class="avatar">JD</div>
            <h1>John Doe</h1>
            <p class="title">Full Stack Developer</p>
            <p class="bio">
                Passionate about creating beautiful and functional web experiences.
                Love working with modern technologies and solving complex problems.
            </p>
            <div class="stats">
                <div class="stat">
                    <div class="stat-value">1.2k</div>
                    <div class="stat-label">Followers</div>
                </div>
                <div class="stat">
                    <div class="stat-value">432</div>
                    <div class="stat-label">Following</div>
                </div>
                <div class="stat">
                    <div class="stat-value">89</div>
                    <div class="stat-label">Projects</div>
                </div>
            </div>
            <button class="button">Follow</button>
        </div>
    </div>
</body>
</html>`;
}

function generateTimer(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Timer</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .timer-container {
            background: white;
            border-radius: 20px;
            padding: 50px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
        }
        h1 {
            color: #667eea;
            margin-bottom: 30px;
        }
        .timer-display {
            font-size: 72px;
            font-weight: bold;
            color: #333;
            margin-bottom: 40px;
            font-family: 'Courier New', monospace;
        }
        .controls {
            display: flex;
            gap: 15px;
            justify-content: center;
        }
        button {
            padding: 15px 30px;
            font-size: 16px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }
        .start {
            background: #27ae60;
            color: white;
        }
        .start:hover {
            background: #229954;
        }
        .pause {
            background: #e67e22;
            color: white;
        }
        .pause:hover {
            background: #d35400;
        }
        .reset {
            background: #e74c3c;
            color: white;
        }
        .reset:hover {
            background: #c0392b;
        }
    </style>
</head>
<body>
    <div class="timer-container">
        <h1>Timer</h1>
        <div class="timer-display" id="display">00:00</div>
        <div class="controls">
            <button class="start" onclick="startTimer()">Start</button>
            <button class="pause" onclick="pauseTimer()">Pause</button>
            <button class="reset" onclick="resetTimer()">Reset</button>
        </div>
    </div>

    <script>
        let seconds = 0;
        let interval = null;

        function updateDisplay() {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            document.getElementById('display').textContent =
                \`\${String(mins).padStart(2, '0')}:\${String(secs).padStart(2, '0')}\`;
        }

        function startTimer() {
            if (!interval) {
                interval = setInterval(() => {
                    seconds++;
                    updateDisplay();
                }, 1000);
            }
        }

        function pauseTimer() {
            clearInterval(interval);
            interval = null;
        }

        function resetTimer() {
            clearInterval(interval);
            interval = null;
            seconds = 0;
            updateDisplay();
        }
    </script>
</body>
</html>`;
}

function generateImageGallery(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Gallery</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            padding: 40px 20px;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 40px;
            font-size: 42px;
        }
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .gallery-item {
            position: relative;
            overflow: hidden;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transition: transform 0.3s;
            cursor: pointer;
            height: 250px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .gallery-item:hover {
            transform: scale(1.05);
        }
        .gallery-item-content {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: white;
            font-size: 24px;
            font-weight: bold;
        }
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        .modal-content {
            max-width: 90%;
            max-height: 90%;
            border-radius: 10px;
        }
        .close {
            position: absolute;
            top: 20px;
            right: 40px;
            color: white;
            font-size: 40px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h1>Image Gallery</h1>
    <div class="gallery" id="gallery"></div>

    <div class="modal" id="modal">
        <span class="close" onclick="closeModal()">&times;</span>
        <div class="modal-content" id="modalContent"></div>
    </div>

    <script>
        const images = [
            { id: 1, title: 'Image 1', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
            { id: 2, title: 'Image 2', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
            { id: 3, title: 'Image 3', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
            { id: 4, title: 'Image 4', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
            { id: 5, title: 'Image 5', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
            { id: 6, title: 'Image 6', color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }
        ];

        const gallery = document.getElementById('gallery');

        images.forEach(img => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.style.background = img.color;
            item.innerHTML = \`<div class="gallery-item-content">\${img.title}</div>\`;
            item.onclick = () => openModal(img);
            gallery.appendChild(item);
        });

        function openModal(img) {
            const modal = document.getElementById('modal');
            const content = document.getElementById('modalContent');
            content.style.background = img.color;
            content.style.padding = '100px';
            content.style.borderRadius = '10px';
            content.innerHTML = \`<h2 style="color: white; text-align: center;">\${img.title}</h2>\`;
            modal.style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('modal').style.display = 'none';
        }
    </script>
</body>
</html>`;
}

function generateQuiz(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz App</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .quiz-container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 40px;
            max-width: 600px;
            width: 100%;
        }
        h1 {
            color: #667eea;
            margin-bottom: 30px;
            text-align: center;
        }
        .question {
            font-size: 20px;
            margin-bottom: 25px;
            color: #333;
        }
        .options {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 25px;
        }
        .option {
            padding: 15px;
            background: #f5f5f5;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .option:hover {
            background: #ebebeb;
            border-color: #667eea;
        }
        .option.selected {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }
        button {
            width: 100%;
            padding: 15px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
        }
        button:hover {
            background: #5568d3;
        }
        .result {
            display: none;
            text-align: center;
        }
        .score {
            font-size: 48px;
            font-weight: bold;
            color: #667eea;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="quiz-container">
        <div id="quiz">
            <h1>Quick Quiz</h1>
            <div class="question" id="question"></div>
            <div class="options" id="options"></div>
            <button onclick="nextQuestion()">Next Question</button>
        </div>

        <div class="result" id="result">
            <h1>Quiz Complete!</h1>
            <div class="score" id="score"></div>
            <p>Great job!</p>
            <button onclick="restartQuiz()">Restart Quiz</button>
        </div>
    </div>

    <script>
        const questions = [
            {
                question: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                correct: 2
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correct: 1
            },
            {
                question: "What is 2 + 2?",
                options: ["3", "4", "5", "6"],
                correct: 1
            }
        ];

        let currentQuestion = 0;
        let score = 0;
        let selectedOption = -1;

        function loadQuestion() {
            const q = questions[currentQuestion];
            document.getElementById('question').textContent = q.question;

            const optionsDiv = document.getElementById('options');
            optionsDiv.innerHTML = '';

            q.options.forEach((opt, index) => {
                const div = document.createElement('div');
                div.className = 'option';
                div.textContent = opt;
                div.onclick = () => selectOption(index);
                optionsDiv.appendChild(div);
            });

            selectedOption = -1;
        }

        function selectOption(index) {
            selectedOption = index;
            const options = document.querySelectorAll('.option');
            options.forEach((opt, i) => {
                opt.classList.toggle('selected', i === index);
            });
        }

        function nextQuestion() {
            if (selectedOption === -1) {
                alert('Please select an answer!');
                return;
            }

            if (selectedOption === questions[currentQuestion].correct) {
                score++;
            }

            currentQuestion++;

            if (currentQuestion < questions.length) {
                loadQuestion();
            } else {
                showResult();
            }
        }

        function showResult() {
            document.getElementById('quiz').style.display = 'none';
            document.getElementById('result').style.display = 'block';
            document.getElementById('score').textContent = \`\${score} / \${questions.length}\`;
        }

        function restartQuiz() {
            currentQuestion = 0;
            score = 0;
            document.getElementById('quiz').style.display = 'block';
            document.getElementById('result').style.display = 'none';
            loadQuestion();
        }

        loadQuestion();
    </script>
</body>
</html>`;
}

function generateChart(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chart Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            padding: 40px 20px;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 40px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .chart-container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        .chart-title {
            font-size: 20px;
            color: #667eea;
            margin-bottom: 20px;
        }
        .bar-chart {
            display: flex;
            align-items: flex-end;
            justify-content: space-around;
            height: 300px;
            border-left: 2px solid #ccc;
            border-bottom: 2px solid #ccc;
            padding: 20px 10px 10px 10px;
        }
        .bar {
            flex: 1;
            margin: 0 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 5px 5px 0 0;
            position: relative;
            transition: all 0.3s;
            cursor: pointer;
        }
        .bar:hover {
            opacity: 0.8;
        }
        .bar-label {
            position: absolute;
            bottom: -25px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 14px;
            color: #666;
        }
        .bar-value {
            position: absolute;
            top: -25px;
            left: 50%;
            transform: translateX(-50%);
            font-weight: bold;
            color: #667eea;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Sales Dashboard</h1>

        <div class="chart-container">
            <div class="chart-title">Monthly Sales</div>
            <div class="bar-chart" id="barChart"></div>
        </div>
    </div>

    <script>
        const data = [
            { label: 'Jan', value: 120 },
            { label: 'Feb', value: 190 },
            { label: 'Mar', value: 150 },
            { label: 'Apr', value: 220 },
            { label: 'May', value: 180 },
            { label: 'Jun', value: 240 }
        ];

        const maxValue = Math.max(...data.map(d => d.value));
        const chart = document.getElementById('barChart');

        data.forEach(item => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            const height = (item.value / maxValue) * 250;
            bar.style.height = height + 'px';

            const value = document.createElement('div');
            value.className = 'bar-value';
            value.textContent = item.value;
            bar.appendChild(value);

            const label = document.createElement('div');
            label.className = 'bar-label';
            label.textContent = item.label;
            bar.appendChild(label);

            chart.appendChild(bar);
        });
    </script>
</body>
</html>`;
}

function generateDefaultTemplate(prompt: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Project</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 50px;
            max-width: 800px;
            width: 100%;
            text-align: center;
        }
        h1 {
            color: #667eea;
            margin-bottom: 20px;
            font-size: 42px;
        }
        p {
            color: #666;
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .button {
            background: #667eea;
            color: white;
            padding: 15px 40px;
            border: none;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        .button:hover {
            background: #5568d3;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Your Project</h1>
        <p>${prompt}</p>
        <button class="button" onclick="alert('Button clicked!')">Get Started</button>
    </div>
</body>
</html>`;
}
