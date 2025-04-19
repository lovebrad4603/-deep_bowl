import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (input.trim() === '') return;
    const { error } = await supabase.from('todos').insert([{ text: input, completed: false }]);
    if (!error) {
      setInput('');
      fetchTodos();
    }
  };

  const toggleTodo = async (todo) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', todo.id);
    if (!error) fetchTodos();
  };

  const deleteTodo = async (id) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (!error) fetchTodos();
  };

  const updateTodo = async (id) => {
    if (editText.trim() === '') return;
    const { error } = await supabase.from('todos').update({ text: editText }).eq('id', id);
    if (!error) {
      setEditId(null);
      setEditText('');
      fetchTodos();
    }
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.text.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'completed' && todo.completed) ||
      (filter === 'uncompleted' && !todo.completed);
    return matchesSearch && matchesFilter;
  });

  return (
    
    <div className="container py-5 d-flex flex-column align-items-center text-center" id="root">
      <h1 className="mb-4">📝 我的待辦清單</h1>

      {/* 新增 + 搜尋列 */}
      <div className="row mb-3 justify-content-center">
        <div className="col-md-8 mb-2">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="輸入待辦事項..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="btn btn-primary" onClick={addTodo}>
              新增
            </button>
          </div>
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 搜尋..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 篩選按鈕 */}
      <div className="mb-3">
        <div className="btn-group">
          <button
            className={`btn btn-outline-secondary ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            全部
          </button>
          <button
            className={`btn btn-outline-success ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            已完成
          </button>
          <button
            className={`btn btn-outline-warning ${filter === 'uncompleted' ? 'active' : ''}`}
            onClick={() => setFilter('uncompleted')}
          >
            未完成
          </button>
        </div>
      </div>

      {/* 卡片風格顯示待辦清單 */}
      <div className="row justify-content-center">
        <AnimatePresence>
          {filteredTodos.map((todo) => (
            <motion.div
              key={todo.id}
              className="col-12 col-sm-6 col-md-4 mb-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`card shadow-sm ${todo.completed ? 'border-success' : 'border-light'}`}
                style={{
                  cursor: 'pointer',
                  borderRadius: '10px',
                  transition: 'all 0.3s ease',
                }}
              >
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div className="form-check d-flex align-items-center">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo)}
                    />
                    {editId === todo.id ? (
                      <>
                        <input
                          type="text"
                          className="form-control me-2"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') updateTodo(todo.id);
                          }}
                        />
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => updateTodo(todo.id)}
                        >
                          儲存
                        </button>
                      </>
                    ) : (
                      <label
                        className="form-check-label"
                        style={{
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          cursor: 'pointer',
                        }}
                        onClick={() => toggleTodo(todo)}
                      >
                        {todo.text}
                      </label>
                    )}
                  </div>
                  <div className="ms-2">
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => {
                        setEditId(todo.id);
                        setEditText(todo.text);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      刪除
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
