import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TaskModal({ task, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || 'todo',
        priority: task?.priority || 'medium',
        dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="task-title">Title *</label>
                        <input
                            type="text"
                            id="task-title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter task title"
                            required
                            minLength={3}
                            maxLength={100}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="task-description">Description</label>
                        <textarea
                            id="task-description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the task..."
                            rows={3}
                            maxLength={500}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="task-status">Status</label>
                            <select id="task-status" name="status" value={formData.status} onChange={handleChange}>
                                <option value="todo">📋 To Do</option>
                                <option value="in-progress">🔄 In Progress</option>
                                <option value="done">✅ Done</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="task-priority">Priority</label>
                            <select id="task-priority" name="priority" value={formData.priority} onChange={handleChange}>
                                <option value="low">🟢 Low</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="high">🔴 High</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="task-dueDate">Due Date</label>
                        <input
                            type="date"
                            id="task-dueDate"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading} id="save-task-btn">
                            {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskModal;
