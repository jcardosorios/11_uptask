const DEMO_PROJECTS_KEY = 'uptask_demo_projects';
const DEMO_USER_PROFILE_KEY = 'uptask_demo_user_profile';

export function generateId() {
    return self.crypto.randomUUID();
}

export function getDemoProjects() {
    const projectsJson = localStorage.getItem(DEMO_PROJECTS_KEY);
    if (projectsJson) {
        try {
            return JSON.parse(projectsJson);
        } catch (e) {
            console.error("Error parsing demo projects from localStorage", e);
            return [];
        }
    }
    return [];
}

export function saveDemoProjects(projects: any[]) {
    localStorage.setItem(DEMO_PROJECTS_KEY, JSON.stringify(projects));
}

export function getDemoUserProfile() {
    const profileJson = localStorage.getItem(DEMO_USER_PROFILE_KEY);
    if (profileJson) {
        try {
            return JSON.parse(profileJson);
        } catch (e) {
            console.error("Error parsing demo user profile from localStorage", e);
            return null;
        }
    }

    const defaultProfile = {
        _id: 'demo-user-001',
        name: 'Demo User',
        email: 'demo@example.com'
    };
    saveDemoUserProfile(defaultProfile);
    return defaultProfile;
}

export function saveDemoUserProfile(profile: any) {
    localStorage.setItem(DEMO_USER_PROFILE_KEY, JSON.stringify(profile));
}


