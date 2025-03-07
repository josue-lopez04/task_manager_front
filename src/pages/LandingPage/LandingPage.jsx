import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div>
            <header className="header">
                <h1 className="header-title">Task Manager</h1>
                <div className="header-links">
                    <Link to="/login">Login</Link>
                    <Link to="/register" className="register-link">Register</Link>
                </div>
            </header>

            <main className="main-content">
                <section className="hero-section">
                    <h2 className="hero-title">Manage your tasks efficiently</h2>
                    <p className="hero-description">
                        Streamline your workflow, collaborate with your team, and keep track of your tasks with our intuitive task management platform.
                    </p>
                    <Link to="/register" className="hero-button">Get Started</Link>
                </section>

                <img src="task.webp" alt="Task Management" className="hero-image"/>

                <section className="features-grid">
                    <div className="feature-card">
                        <h3 className="feature-title">Personal Tasks</h3>
                        <p className="feature-description">Organize your personal tasks with customizable status, priority, and due dates.</p>
                    </div>
                    <div className="feature-card">
                        <h3 className="feature-title">Collaborative Groups</h3>
                        <p className="feature-description">Create groups, invite team members, and collaborate on tasks together.</p>
                    </div>
                    <div className="feature-card">
                        <h3 className="feature-title">Kanban Board</h3>
                        <p className="feature-description">Visualize your workflow with a Kanban board to track task progress.</p>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <p>© 2025 Task Manager. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
