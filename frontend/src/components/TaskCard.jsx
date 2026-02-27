function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
    const priorityColors = {
        low: '#10b981',
        medium: '#f59e0b',
        high: '#ef4444',
    };

    const statusLabels = {
        todo: '📋 To Do',
        'in-progress': '🔄 In Progress',
        done: '✅ Done',
    };

    const formatDate = (date) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

    return (
        <div className={`task-card ${task.status === 'done' ? 'task-done' : ''}`} id={`task-${task._id}`}>
            <div className="task-card-header">
                <span
                    className="task-priority-badge"
                    style={{ backgroundColor: priorityColors[task.priority] + '20', color: priorityColors[task.priority] }}
                >
                    {task.priority}
                </span>
                <div className="task-actions">
                    <button className="task-action-btn" onClick={() => onEdit(task)} title="Edit" id={`edit-${task._id}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </button>
                    <button className="task-action-btn task-action-delete" onClick={() => onDelete(task._id)} title="Delete" id={`delete-${task._id}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                    </button>
                </div>
            </div>

            <h3 className="task-title">{task.title}</h3>
            {task.description && <p className="task-description">{task.description}</p>}

            <div className="task-card-footer">
                <select
                    className="task-status-select"
                    value={task.status}
                    onChange={(e) => onStatusChange(task._id, e.target.value)}
                    id={`status-${task._id}`}
                >
                    <option value="todo">📋 To Do</option>
                    <option value="in-progress">🔄 In Progress</option>
                    <option value="done">✅ Done</option>
                </select>

                {task.dueDate && (
                    <span className={`task-due-date ${isOverdue ? 'overdue' : ''}`}>
                        {isOverdue ? '⚠' : '📅'} {formatDate(task.dueDate)}
                    </span>
                )}
            </div>

            {task.createdBy && (
                <div className="task-author">
                    <span className="task-author-avatar">{task.createdBy.name?.charAt(0).toUpperCase()}</span>
                    <span className="task-author-name">{task.createdBy.name}</span>
                </div>
            )}
        </div>
    );
}

export default TaskCard;
