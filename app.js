const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;
let currentSession = null;
let codeEditor = null;
let sessions = [];

const elements = {
    loginScreen: document.getElementById('login-screen'),
    mainScreen: document.getElementById('main-screen'),
    githubLoginBtn: document.getElementById('github-login-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    userAvatar: document.getElementById('user-avatar'),
    userName: document.getElementById('user-name'),
    aiPrompt: document.getElementById('ai-prompt'),
    generateBtn: document.getElementById('generate-btn'),
    codeEditor: document.getElementById('code-editor'),
    previewFrame: document.getElementById('preview-frame'),
    saveBtn: document.getElementById('save-btn'),
    copyBtn: document.getElementById('copy-btn'),
    refreshPreviewBtn: document.getElementById('refresh-preview-btn'),
    newSessionBtn: document.getElementById('new-session-btn'),
    sessionsList: document.getElementById('sessions-list'),
    loadingOverlay: document.getElementById('loading-overlay')
};

async function init() {
    setupCodeEditor();
    setupEventListeners();
    await checkAuthStatus();
}

function setupCodeEditor() {
    codeEditor = CodeMirror.fromTextArea(elements.codeEditor, {
        mode: 'htmlmixed',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseBrackets: true,
        autoCloseTags: true,
        matchBrackets: true,
        indentUnit: 2,
        tabSize: 2,
        lineWrapping: true
    });

    codeEditor.on('change', () => {
        updatePreview();
    });
}

function setupEventListeners() {
    elements.githubLoginBtn.addEventListener('click', loginWithGitHub);
    elements.logoutBtn.addEventListener('click', logout);
    elements.generateBtn.addEventListener('click', generateCode);
    elements.saveBtn.addEventListener('click', saveSession);
    elements.copyBtn.addEventListener('click', copyCode);
    elements.refreshPreviewBtn.addEventListener('click', updatePreview);
    elements.newSessionBtn.addEventListener('click', createNewSession);

    supabase.auth.onAuthStateChange((event, session) => {
        (async () => {
            if (event === 'SIGNED_IN') {
                await handleAuthSuccess(session);
            } else if (event === 'SIGNED_OUT') {
                handleSignOut();
            }
        })();
    });
}

async function checkAuthStatus() {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        await handleAuthSuccess(session);
    } else {
        showLoginScreen();
    }
}

async function loginWithGitHub() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: window.location.origin + '/ai-coder.html'
        }
    });

    if (error) {
        console.error('Login error:', error);
        alert('Failed to login with GitHub. Please try again.');
    }
}

async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Logout error:', error);
    }
}

async function handleAuthSuccess(session) {
    currentUser = session.user;

    await createOrUpdateProfile();

    elements.userName.textContent = currentUser.user_metadata.user_name || 'User';
    elements.userAvatar.src = currentUser.user_metadata.avatar_url || 'https://via.placeholder.com/36';

    showMainScreen();
    await loadUserSessions();

    if (sessions.length === 0) {
        await createNewSession();
    } else {
        loadSession(sessions[0]);
    }
}

async function createOrUpdateProfile() {
    const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

    if (!existingProfile) {
        await supabase
            .from('profiles')
            .insert({
                id: currentUser.id,
                github_username: currentUser.user_metadata.user_name,
                avatar_url: currentUser.user_metadata.avatar_url
            });
    }
}

function handleSignOut() {
    currentUser = null;
    currentSession = null;
    sessions = [];
    showLoginScreen();
}

function showLoginScreen() {
    elements.loginScreen.classList.remove('hidden');
    elements.mainScreen.classList.add('hidden');
}

function showMainScreen() {
    elements.loginScreen.classList.add('hidden');
    elements.mainScreen.classList.remove('hidden');
}

async function loadUserSessions() {
    const { data, error } = await supabase
        .from('code_sessions')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error loading sessions:', error);
        return;
    }

    sessions = data || [];
    renderSessionsList();
}

function renderSessionsList() {
    elements.sessionsList.innerHTML = '';

    if (sessions.length === 0) {
        elements.sessionsList.innerHTML = '<p style="color: var(--text-secondary); padding: 12px; text-align: center;">No sessions yet</p>';
        return;
    }

    sessions.forEach(session => {
        const sessionItem = document.createElement('div');
        sessionItem.className = 'session-item';
        if (currentSession && currentSession.id === session.id) {
            sessionItem.classList.add('active');
        }

        const date = new Date(session.updated_at);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        sessionItem.innerHTML = `
            <div class="session-title">${session.title || 'Untitled Project'}</div>
            <div class="session-date">${formattedDate}</div>
        `;

        sessionItem.addEventListener('click', () => loadSession(session));
        elements.sessionsList.appendChild(sessionItem);
    });
}

function loadSession(session) {
    currentSession = session;
    elements.aiPrompt.value = session.prompt || '';
    codeEditor.setValue(session.code || '');
    renderSessionsList();
    updatePreview();
}

async function createNewSession() {
    const { data, error } = await supabase
        .from('code_sessions')
        .insert({
            user_id: currentUser.id,
            title: 'New Project',
            prompt: '',
            code: '<!DOCTYPE html>\n<html>\n<head>\n  <title>New Project</title>\n  <style>\n    body {\n      font-family: Arial, sans-serif;\n      padding: 20px;\n    }\n  </style>\n</head>\n<body>\n  <h1>Hello World!</h1>\n  <p>Start coding here...</p>\n</body>\n</html>',
            language: 'html'
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating session:', error);
        alert('Failed to create new session');
        return;
    }

    await loadUserSessions();
    loadSession(data);
}

async function saveSession() {
    if (!currentSession) {
        await createNewSession();
        return;
    }

    const prompt = elements.aiPrompt.value;
    const code = codeEditor.getValue();

    let title = 'Untitled Project';
    if (prompt) {
        title = prompt.substring(0, 50) + (prompt.length > 50 ? '...' : '');
    }

    const { error } = await supabase
        .from('code_sessions')
        .update({
            title: title,
            prompt: prompt,
            code: code
        })
        .eq('id', currentSession.id);

    if (error) {
        console.error('Error saving session:', error);
        alert('Failed to save session');
        return;
    }

    await loadUserSessions();

    const savedSession = sessions.find(s => s.id === currentSession.id);
    if (savedSession) {
        loadSession(savedSession);
    }
}

async function generateCode() {
    const prompt = elements.aiPrompt.value.trim();

    if (!prompt) {
        alert('Please enter a prompt describing what you want to build');
        return;
    }

    elements.loadingOverlay.classList.remove('hidden');

    try {
        const apiUrl = `${SUPABASE_URL}/functions/v1/generate-code`;
        const { data: { session } } = await supabase.auth.getSession();

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error('Failed to generate code');
        }

        const result = await response.json();

        if (result.code) {
            codeEditor.setValue(result.code);
            updatePreview();
            await saveSession();
        } else {
            throw new Error('No code generated');
        }
    } catch (error) {
        console.error('Error generating code:', error);
        alert('Failed to generate code. Please try again.');
    } finally {
        elements.loadingOverlay.classList.add('hidden');
    }
}

function updatePreview() {
    const code = codeEditor.getValue();
    const iframe = elements.previewFrame;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    iframeDoc.open();
    iframeDoc.write(code);
    iframeDoc.close();
}

function copyCode() {
    const code = codeEditor.getValue();
    navigator.clipboard.writeText(code).then(() => {
        const originalText = elements.copyBtn.textContent;
        elements.copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            elements.copyBtn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code:', err);
        alert('Failed to copy code');
    });
}

document.addEventListener('DOMContentLoaded', init);
