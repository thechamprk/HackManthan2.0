import { useMemo, useState } from 'react';
import { aiBreakdown } from '../services/groq';
import { tasksApi } from '../services/api';

const PRIORITIES = ['all', 'high', 'medium', 'low'];

function Todo() {
  const [goal, setGoal] = useState('');
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');

  const filteredItems = useMemo(
    () => items.filter((item) => filter === 'all' || item.priority === filter),
    [items, filter]
  );

  const streak = useMemo(() => {
    const days = new Set(
      items
        .filter((item) => item.done && item.completedAt)
        .map((item) => String(item.completedAt).slice(0, 10))
    );
    return days.size;
  }, [items]);

  async function handleBreakdown(event) {
    event.preventDefault();
    if (!goal.trim()) return;

    const data = await aiBreakdown(goal.trim());
    setItems(
      data.map((item, index) => ({
        id: `tmp_${Date.now()}_${index}`,
        text: item.text,
        tag: item.tag,
        priority: item.priority,
        estimatedMinutes: item.estimatedMinutes,
        done: false
      }))
    );
  }

  function updateItem(id, updates) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }

  function addManual() {
    setItems((prev) => [
      ...prev,
      {
        id: `tmp_${Date.now()}`,
        text: 'New task',
        tag: 'manual',
        priority: 'medium',
        estimatedMinutes: 20,
        done: false
      }
    ]);
  }

  async function saveToTasks() {
    const pending = items.filter((item) => item.text.trim());
    await Promise.all(
      pending.map((item) =>
        tasksApi.create({
          text: item.text,
          tag: item.tag,
          priority: item.priority,
          estimatedMinutes: item.estimatedMinutes,
          done: item.done,
          dueDate: new Date().toISOString()
        })
      )
    );
  }

  return (
    <div className="page-wrap">
      <div className="card">
        <form className="todo-form" onSubmit={handleBreakdown}>
          <input
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            placeholder="What do you need to get done?"
          />
          <button type="submit" className="btn-primary">Break Down Goal</button>
        </form>
        <div className="row-between">
          <div className="filter-row">
            {PRIORITIES.map((item) => (
              <button
                type="button"
                key={item}
                className={`chip${filter === item ? ' active' : ''}`}
                onClick={() => setFilter(item)}
              >
                {item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
          <div className="muted">Streak: {streak} day(s)</div>
        </div>
      </div>

      <div className="todo-grid">
        {filteredItems.map((item) => (
          <article className="card todo-card" key={item.id}>
            <div className="row-between">
              <input
                className="inline-input"
                value={item.text}
                onChange={(event) => updateItem(item.id, { text: event.target.value })}
              />
              <button type="button" className="btn-link" onClick={() => setItems((prev) => prev.filter((v) => v.id !== item.id))}>
                Delete
              </button>
            </div>
            <div className="row-between small muted">
              <span className={`priority ${item.priority}`}>{item.priority}</span>
              <span>{item.estimatedMinutes} min</span>
            </div>
            <div className="row-between small muted">
              <input
                value={item.tag}
                onChange={(event) => updateItem(item.id, { tag: event.target.value })}
                className="inline-input inline-small"
              />
              <label>
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={(event) =>
                    updateItem(item.id, {
                      done: event.target.checked,
                      completedAt: event.target.checked ? new Date().toISOString() : null
                    })
                  }
                />{' '}
                Done
              </label>
            </div>
          </article>
        ))}
      </div>

      <div className="row-gap">
        <button type="button" className="btn-secondary" onClick={addManual}>Add Manual Item</button>
        <button type="button" className="btn-primary" onClick={saveToTasks}>Save to Tasks</button>
      </div>
    </div>
  );
}

export default Todo;
