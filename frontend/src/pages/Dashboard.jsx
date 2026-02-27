import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { tasksAPI } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

function Dashboard() {
    const { user } = useAuth();
    const { success, error } = useToast();

    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Filters
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, pages: 1 });

    const fetchTasks = useCallback(async () => {
        try {
            const params = { page: currentPage, limit: 12 };
            if (filterStatus) params.status = filterStatus;
            if (filterPriority) params.priority = filterPriority;

            const res = await tasksAPI.getAll(params);
            setTasks(res.data.data.tasks);
            setPagination({ total: res.data.total, pages: res.data.pages });
        } catch (err) {
            error('Failed to load tasks');
        }
    }, [currentPage, filterStatus, filterPriority, error]);

    const fetchStats = useCallback(async () => {
        try {
            const res = await tasksAPI.getStats();
            setStats(res.data.data.stats);
        } catch (err) {
            // Stats are non-critical
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchTasks(), fetchStats()]);
            setLoading(false);
        };
        loadData();
    }, [fetchTasks, fetchStats]);

    const handleCreateTask = async (data) => {
        try {
            await tasksAPI.create(data);
            success('Task created! 🎉');
            setShowModal(false);
            fetchTasks();
            fetchStats();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to create task';
            error(msg);
        }
    };

    const handleUpdateTask = async (data) => {
        try {
            await tasksAPI.update(editingTask._id, data);
            success('Task updated! ✅');
            setShowModal(false);
            setEditingTask(null);
            fetchTasks();
            fetchStats();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to update task';
            error(msg);
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await tasksAPI.delete(id);
            success('Task deleted');
            fetchTasks();
            fetchStats();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to delete task';
            error(msg);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await tasksAPI.update(id, { status: newStatus });
            success(`Status updated to ${newStatus}`);
            fetchTasks();
            fetchStats();
        } catch (err) {
            error('Failed to update status');
        }
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard" id="dashboard-page">
            {/* Header */}
            <div className="dashboard-header">
                <div className="dashboard-welcome">
                    <h1>
                        Welcome back, <span className="gradient-text">{user?.name}</span>
                    </h1>
                    <p>
                        {user?.role === 'admin'
                            ? "You're viewing all tasks across the platform."
                            : 'Here is an overview of your tasks.'}
                    </p>
                </div>
                <button className="btn btn-primary" onClick={openCreateModal} id="create-task-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New Task
                </button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="stats-grid">
                    <div className="stat-card stat-total">
                        <div className="stat-icon">📊</div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.total}</span>
                            <span className="stat-label">Total Tasks</span>
                        </div>
                    </div>
                    <div className="stat-card stat-todo">
                        <div className="stat-icon">📋</div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.todo}</span>
                            <span className="stat-label">To Do</span>
                        </div>
                    </div>
                    <div className="stat-card stat-progress">
                        <div className="stat-icon">🔄</div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.inProgress}</span>
                            <span className="stat-label">In Progress</span>
                        </div>
                    </div>
                    <div className="stat-card stat-done">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.done}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="filters-bar" id="filters-bar">
                <div className="filter-group">
                    <label>Status</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                        id="filter-status"
                    >
                        <option value="">All</option>
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Priority</label>
                    <select
                        value={filterPriority}
                        onChange={(e) => { setFilterPriority(e.target.value); setCurrentPage(1); }}
                        id="filter-priority"
                    >
                        <option value="">All</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                {(filterStatus || filterPriority) && (
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => { setFilterStatus(''); setFilterPriority(''); setCurrentPage(1); }}
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Tasks Grid */}
            {tasks.length === 0 ? (
                <div className="empty-state" id="empty-state">
                    <div className="empty-icon">📝</div>
                    <h2>No tasks yet</h2>
                    <p>Create your first task to get started!</p>
                    <button className="btn btn-primary" onClick={openCreateModal}>
                        Create Task
                    </button>
                </div>
            ) : (
                <>
                    <div className="tasks-grid" id="tasks-grid">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onEdit={openEditModal}
                                onDelete={handleDeleteTask}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="pagination" id="pagination">
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                ← Previous
                            </button>
                            <span className="pagination-info">
                                Page {currentPage} of {pagination.pages} ({pagination.total} tasks)
                            </span>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
                                disabled={currentPage === pagination.pages}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Task Modal */}
            {showModal && (
                <TaskModal
                    task={editingTask}
                    onClose={() => { setShowModal(false); setEditingTask(null); }}
                    onSave={editingTask ? handleUpdateTask : handleCreateTask}
                />
            )}
        </div>
    );
}

export default Dashboard;
