/**
 * 视觉优化的TODO系统
 * 提供美观、直观的任务管理界面
 */

class VisualTodoSystem {
    constructor() {
        this.todos = [];
        this.categories = ['高优先级', '中优先级', '低优先级', '已完成'];
        this.colors = {
            '高优先级': '#ff6b6b',
            '中优先级': '#ffd93d',
            '低优先级': '#6bcf7f',
            '已完成': '#4ecdc4'
        };
        this.draggedElement = null;
        this.isVisible = false;
        this.init();
    }

    init() {
        this.loadTodos();
        this.createTodoInterface();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
    }

    /**
     * 创建TODO界面
     */
    createTodoInterface() {
        // 创建主容器
        const todoContainer = document.createElement('div');
        todoContainer.id = 'visual-todo-system';
        todoContainer.className = 'visual-todo-system hidden';
        
        todoContainer.innerHTML = `
            <!-- TODO系统背景遮罩 -->
            <div class="todo-overlay" onclick="todoSystem.hideTodo()"></div>
            
            <!-- TODO主面板 -->
            <div class="todo-panel">
                <!-- 头部 -->
                <div class="todo-header">
                    <div class="todo-title">
                        <h2><i class="fas fa-tasks"></i> 项目管理看板</h2>
                        <div class="todo-stats">
                            <span class="stat-item">
                                <span class="stat-number" id="total-tasks">0</span>
                                <span class="stat-label">总任务</span>
                            </span>
                            <span class="stat-item">
                                <span class="stat-number" id="completed-tasks">0</span>
                                <span class="stat-label">已完成</span>
                            </span>
                            <span class="stat-item">
                                <span class="progress-circle" id="progress-circle">
                                    <span class="progress-text">0%</span>
                                </span>
                            </span>
                        </div>
                    </div>
                    <div class="todo-controls">
                        <button class="btn-icon" onclick="todoSystem.addNewTodo()" title="添加新任务">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="btn-icon" onclick="todoSystem.exportTodos()" title="导出TODO">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="btn-icon" onclick="todoSystem.hideTodo()" title="关闭">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <!-- 工具栏 -->
                <div class="todo-toolbar">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="todo-search" placeholder="搜索任务..." />
                        <button class="clear-search" onclick="todoSystem.clearSearch()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="filter-tabs">
                        <button class="filter-tab active" data-filter="all">全部</button>
                        <button class="filter-tab" data-filter="高优先级">高优先级</button>
                        <button class="filter-tab" data-filter="中优先级">中优先级</button>
                        <button class="filter-tab" data-filter="低优先级">低优先级</button>
                        <button class="filter-tab" data-filter="已完成">已完成</button>
                    </div>
                </div>

                <!-- 看板区域 -->
                <div class="kanban-board">
                    ${this.categories.map(category => `
                        <div class="kanban-column" data-category="${category}">
                            <div class="column-header">
                                <div class="column-title">
                                    <div class="category-color" style="background-color: ${this.colors[category]}"></div>
                                    <span>${category}</span>
                                    <span class="task-count">0</span>
                                </div>
                                <button class="add-task-btn" onclick="todoSystem.addTodoToCategory('${category}')">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <div class="tasks-container" data-category="${category}">
                                <!-- 任务卡片将在这里动态生成 -->
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- 任务详情面板 -->
                <div class="task-detail-panel" id="task-detail-panel">
                    <div class="task-detail-header">
                        <h3>任务详情</h3>
                        <button onclick="todoSystem.closeTaskDetail()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="task-detail-content">
                        <!-- 任务详情内容 -->
                    </div>
                </div>
            </div>

            <!-- 浮动操作按钮 -->
            <div class="fab-container">
                <button class="fab main-fab" onclick="todoSystem.toggleTodo()" title="打开/关闭TODO">
                    <i class="fas fa-tasks"></i>
                </button>
            </div>
        `;

        // 添加样式
        this.injectTodoStyles();
        
        document.body.appendChild(todoContainer);
    }

    /**
     * 注入TODO系统样式
     */
    injectTodoStyles() {
        if (document.getElementById('visual-todo-styles')) {
            return;
        }

        const styles = document.createElement('style');
        styles.id = 'visual-todo-styles';
        styles.textContent = `
            /* 视觉TODO系统样式 */
            .visual-todo-system {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                pointer-events: none;
                transition: all 0.3s ease;
            }

            .visual-todo-system.show {
                opacity: 1;
                pointer-events: all;
            }

            .todo-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
            }

            .todo-panel {
                position: relative;
                width: 95%;
                max-width: 1400px;
                height: 90%;
                background: linear-gradient(145deg, rgba(26, 26, 26, 0.98), rgba(10, 10, 10, 0.98));
                border: 2px solid rgba(212, 175, 55, 0.3);
                border-radius: 20px;
                padding: 24px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                transform: scale(0.9);
                transition: all 0.3s ease;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .visual-todo-system.show .todo-panel {
                transform: scale(1);
            }

            /* 头部样式 */
            .todo-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 20px;
                border-bottom: 1px solid rgba(212, 175, 55, 0.2);
            }

            .todo-title h2 {
                color: var(--vm-gold);
                font-size: 24px;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .todo-stats {
                display: flex;
                gap: 24px;
                margin-top: 12px;
            }

            .stat-item {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .stat-number {
                font-size: 24px;
                font-weight: bold;
                color: var(--vm-gold);
            }

            .stat-label {
                font-size: 12px;
                color: #adb5bd;
                margin-top: 4px;
            }

            .progress-circle {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: conic-gradient(var(--vm-gold) 0deg, rgba(212, 175, 55, 0.2) 0deg);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
            }

            .progress-circle::before {
                content: '';
                position: absolute;
                width: 45px;
                height: 45px;
                background: var(--vm-black);
                border-radius: 50%;
            }

            .progress-text {
                position: relative;
                z-index: 1;
                font-size: 12px;
                font-weight: bold;
                color: var(--vm-gold);
            }

            .todo-controls {
                display: flex;
                gap: 8px;
            }

            .btn-icon {
                width: 40px;
                height: 40px;
                border: none;
                background: rgba(212, 175, 55, 0.1);
                color: var(--vm-gold);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .btn-icon:hover {
                background: rgba(212, 175, 55, 0.2);
                transform: translateY(-2px);
            }

            /* 工具栏样式 */
            .todo-toolbar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                gap: 20px;
            }

            .search-box {
                position: relative;
                flex: 1;
                max-width: 300px;
            }

            .search-box i {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: #6c757d;
            }

            .search-box input {
                width: 100%;
                padding: 12px 40px 12px 40px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(212, 175, 55, 0.2);
                border-radius: 8px;
                color: #f8f9fa;
                font-size: 14px;
                transition: all 0.3s ease;
            }

            .search-box input:focus {
                outline: none;
                border-color: var(--vm-gold);
                box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
            }

            .clear-search {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: #6c757d;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                opacity: 0;
                transition: all 0.3s ease;
            }

            .search-box input:not(:placeholder-shown) + .clear-search {
                opacity: 1;
            }

            .clear-search:hover {
                color: #f8f9fa;
                background: rgba(255, 255, 255, 0.1);
            }

            .filter-tabs {
                display: flex;
                gap: 4px;
            }

            .filter-tab {
                padding: 8px 16px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(212, 175, 55, 0.2);
                color: #adb5bd;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 12px;
                white-space: nowrap;
            }

            .filter-tab.active,
            .filter-tab:hover {
                background: var(--vm-gold);
                color: var(--vm-black);
                border-color: var(--vm-gold);
            }

            /* 看板样式 */
            .kanban-board {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                flex: 1;
                overflow: hidden;
            }

            .kanban-column {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(212, 175, 55, 0.1);
                border-radius: 12px;
                padding: 16px;
                display: flex;
                flex-direction: column;
                min-height: 0;
            }

            .column-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }

            .column-title {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                color: #f8f9fa;
            }

            .category-color {
                width: 12px;
                height: 12px;
                border-radius: 50%;
            }

            .task-count {
                background: rgba(212, 175, 55, 0.2);
                color: var(--vm-gold);
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: normal;
            }

            .add-task-btn {
                width: 28px;
                height: 28px;
                border: none;
                background: rgba(212, 175, 55, 0.1);
                color: var(--vm-gold);
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .add-task-btn:hover {
                background: rgba(212, 175, 55, 0.2);
                transform: scale(1.1);
            }

            .tasks-container {
                flex: 1;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 12px;
                min-height: 200px;
                padding: 4px;
            }

            /* 任务卡片样式 */
            .task-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(212, 175, 55, 0.1);
                border-radius: 8px;
                padding: 16px;
                cursor: move;
                transition: all 0.3s ease;
                position: relative;
                user-select: none;
            }

            .task-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
                border-color: rgba(212, 175, 55, 0.4);
            }

            .task-card.dragging {
                opacity: 0.5;
                transform: rotate(5deg);
            }

            .task-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 8px;
            }

            .task-priority {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                flex-shrink: 0;
            }

            .task-title {
                font-weight: 600;
                color: #f8f9fa;
                font-size: 14px;
                line-height: 1.4;
                flex: 1;
                margin: 0 8px;
            }

            .task-menu {
                position: relative;
            }

            .task-menu-btn {
                width: 20px;
                height: 20px;
                border: none;
                background: none;
                color: #6c757d;
                cursor: pointer;
                border-radius: 4px;
                transition: all 0.3s ease;
            }

            .task-menu-btn:hover {
                color: #f8f9fa;
                background: rgba(255, 255, 255, 0.1);
            }

            .task-description {
                color: #adb5bd;
                font-size: 12px;
                line-height: 1.4;
                margin-bottom: 12px;
            }

            .task-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 11px;
                color: #6c757d;
            }

            .task-date {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .task-status {
                padding: 2px 6px;
                background: rgba(212, 175, 55, 0.2);
                color: var(--vm-gold);
                border-radius: 4px;
                font-size: 10px;
            }

            /* 浮动按钮 */
            .fab-container {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 9999;
            }

            .fab {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(45deg, var(--vm-gold), var(--vm-gold-bright));
                border: none;
                color: var(--vm-black);
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .fab:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(212, 175, 55, 0.6);
            }

            /* 响应式设计 */
            @media (max-width: 768px) {
                .todo-panel {
                    width: 98%;
                    height: 95%;
                    padding: 16px;
                }

                .kanban-board {
                    grid-template-columns: 1fr;
                    gap: 16px;
                }

                .todo-toolbar {
                    flex-direction: column;
                    gap: 12px;
                }

                .search-box {
                    max-width: none;
                }

                .fab {
                    width: 50px;
                    height: 50px;
                    font-size: 20px;
                }

                .fab-container {
                    bottom: 20px;
                    right: 20px;
                }
            }

            /* 拖拽相关样式 */
            .drop-zone {
                border: 2px dashed rgba(212, 175, 55, 0.5);
                background: rgba(212, 175, 55, 0.1);
                border-radius: 8px;
                min-height: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--vm-gold);
                font-size: 14px;
                margin: 8px 0;
            }

            .drag-over {
                border-color: var(--vm-gold);
                background: rgba(212, 175, 55, 0.2);
            }

            /* 动画效果 */
            .task-card-enter {
                animation: taskEnter 0.3s ease;
            }

            .task-card-exit {
                animation: taskExit 0.3s ease;
            }

            @keyframes taskEnter {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            @keyframes taskExit {
                from {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.9);
                }
            }
        `;

        document.head.appendChild(styles);
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 搜索功能
        const searchInput = document.getElementById('todo-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTodos(e.target.value);
            });
        }

        // 筛选标签
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.filterTodos(e.target.dataset.filter);
                this.updateActiveFilter(e.target);
            });
        });

        // 拖拽功能
        this.setupDragAndDrop();
    }

    /**
     * 设置键盘快捷键
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + T 打开TODO
            if ((e.ctrlKey || e.metaKey) && e.key === 't' && !e.shiftKey) {
                e.preventDefault();
                this.toggleTodo();
            }
            
            // ESC 关闭TODO
            if (e.key === 'Escape' && this.isVisible) {
                this.hideTodo();
            }
            
            // Ctrl/Cmd + N 新建任务
            if ((e.ctrlKey || e.metaKey) && e.key === 'n' && this.isVisible) {
                e.preventDefault();
                this.addNewTodo();
            }
        });
    }

    /**
     * 设置拖拽功能
     */
    setupDragAndDrop() {
        // 拖拽开始
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('task-card')) {
                this.draggedElement = e.target;
                e.target.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', e.target.outerHTML);
            }
        });

        // 拖拽结束
        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('task-card')) {
                e.target.classList.remove('dragging');
                this.draggedElement = null;
                
                // 清理所有拖拽样式
                document.querySelectorAll('.drag-over').forEach(el => {
                    el.classList.remove('drag-over');
                });
            }
        });

        // 拖拽经过
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            const container = e.target.closest('.tasks-container');
            if (container && this.draggedElement) {
                e.dataTransfer.dropEffect = 'move';
                container.classList.add('drag-over');
            }
        });

        // 拖拽离开
        document.addEventListener('dragleave', (e) => {
            const container = e.target.closest('.tasks-container');
            if (container) {
                // 检查是否真的离开了容器
                const rect = container.getBoundingClientRect();
                const x = e.clientX;
                const y = e.clientY;
                
                if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
                    container.classList.remove('drag-over');
                }
            }
        });

        // 拖拽放置
        document.addEventListener('drop', (e) => {
            e.preventDefault();
            const container = e.target.closest('.tasks-container');
            
            if (container && this.draggedElement) {
                const targetCategory = container.dataset.category;
                const taskId = this.draggedElement.dataset.taskId;
                
                // 更新任务分类
                this.moveTaskToCategory(taskId, targetCategory);
                
                // 添加放置动画
                container.classList.remove('drag-over');
                
                // 重新渲染
                this.renderTodos();
                this.updateStats();
                this.saveTodos();
                
                // 显示成功反馈
                this.showNotification('任务已移动', 'success');
            }
        });

        // 任务卡片内拖拽排序
        this.setupTaskReordering();
    }

    /**
     * 设置任务重新排序
     */
    setupTaskReordering() {
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            const container = e.target.closest('.tasks-container');
            const taskCard = e.target.closest('.task-card');
            
            if (container && this.draggedElement && taskCard && taskCard !== this.draggedElement) {
                const rect = taskCard.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                
                if (e.clientY < midpoint) {
                    container.insertBefore(this.draggedElement, taskCard);
                } else {
                    container.insertBefore(this.draggedElement, taskCard.nextSibling);
                }
            }
        });
    }

    /**
     * 移动任务到指定分类
     */
    moveTaskToCategory(taskId, newCategory) {
        const todo = this.todos.find(t => t.id === taskId);
        if (todo) {
            todo.category = newCategory;
            
            // 根据分类自动更新状态
            const statusMap = {
                '高优先级': 'pending',
                '中优先级': 'pending', 
                '低优先级': 'pending',
                '已完成': 'completed'
            };
            
            todo.status = statusMap[newCategory] || 'pending';
            
            // 如果移动到已完成，记录完成时间
            if (newCategory === '已完成' && !todo.completedAt) {
                todo.completedAt = new Date().toISOString();
            } else if (newCategory !== '已完成') {
                delete todo.completedAt;
            }
        }
    }

    /**
     * 显示通知
     */
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `todo-notification todo-notification-${type}`;
        notification.textContent = message;
        
        // 添加通知样式
        if (!document.getElementById('todo-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'todo-notification-styles';
            styles.textContent = `
                .todo-notification {
                    position: fixed;
                    top: 100px;
                    right: 30px;
                    background: rgba(26, 26, 26, 0.95);
                    border: 1px solid var(--vm-gold);
                    color: var(--vm-gold);
                    padding: 12px 20px;
                    border-radius: 8px;
                    z-index: 10002;
                    font-size: 14px;
                    font-weight: 500;
                    backdrop-filter: blur(10px);
                    transform: translateX(400px);
                    opacity: 0;
                    transition: all 0.3s ease;
                }
                
                .todo-notification.show {
                    transform: translateX(0);
                    opacity: 1;
                }
                
                .todo-notification-success {
                    border-color: #28a745;
                    color: #28a745;
                }
                
                .todo-notification-error {
                    border-color: #dc3545;
                    color: #dc3545;
                }
                
                .todo-notification-warning {
                    border-color: #ffc107;
                    color: #ffc107;
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    /**
     * 显示TODO系统
     */
    showTodo() {
        const todoSystem = document.getElementById('visual-todo-system');
        if (todoSystem) {
            todoSystem.classList.remove('hidden');
            setTimeout(() => {
                todoSystem.classList.add('show');
            }, 10);
            this.isVisible = true;
            this.renderTodos();
            this.updateStats();
        }
    }

    /**
     * 隐藏TODO系统
     */
    hideTodo() {
        const todoSystem = document.getElementById('visual-todo-system');
        if (todoSystem) {
            todoSystem.classList.remove('show');
            setTimeout(() => {
                todoSystem.classList.add('hidden');
            }, 300);
            this.isVisible = false;
        }
    }

    /**
     * 切换TODO系统显示/隐藏
     */
    toggleTodo() {
        if (this.isVisible) {
            this.hideTodo();
        } else {
            this.showTodo();
        }
    }

    /**
     * 加载TODO数据
     */
    loadTodos() {
        const saved = localStorage.getItem('vm-visual-todos');
        if (saved) {
            try {
                this.todos = JSON.parse(saved);
            } catch (error) {
                console.warn('Failed to load todos:', error);
                this.todos = this.getDefaultTodos();
            }
        } else {
            this.todos = this.getDefaultTodos();
        }
    }

    /**
     * 获取默认TODO数据
     */
    getDefaultTodos() {
        return [
            {
                id: '1',
                title: '完成网站性能优化',
                description: '实现懒加载、资源压缩、Service Worker缓存等功能',
                category: '已完成',
                priority: '高优先级',
                status: 'completed',
                createdAt: new Date().toISOString(),
                completedAt: new Date().toISOString()
            },
            {
                id: '2',
                title: '优化移动端响应式设计',
                description: '确保网站在各种设备上都有良好的用户体验',
                category: '高优先级',
                priority: '高优先级',
                status: 'in-progress',
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                title: '添加报告收藏功能',
                description: '允许用户收藏感兴趣的研究报告',
                category: '中优先级',
                priority: '中优先级',
                status: 'pending',
                createdAt: new Date().toISOString()
            },
            {
                id: '4',
                title: '实现SEO优化',
                description: '添加结构化数据标记，优化meta标签',
                category: '低优先级',
                priority: '低优先级',
                status: 'pending',
                createdAt: new Date().toISOString()
            }
        ];
    }

    /**
     * 保存TODO数据
     */
    saveTodos() {
        localStorage.setItem('vm-visual-todos', JSON.stringify(this.todos));
    }

    /**
     * 渲染TODO列表
     */
    renderTodos() {
        this.categories.forEach(category => {
            const container = document.querySelector(`[data-category="${category}"]`);
            if (container) {
                const tasks = this.todos.filter(todo => todo.category === category);
                container.innerHTML = tasks.map(todo => this.createTaskCard(todo)).join('');
                
                // 更新任务计数
                const countElement = container.parentElement.querySelector('.task-count');
                if (countElement) {
                    countElement.textContent = tasks.length;
                }
            }
        });
    }

    /**
     * 创建任务卡片HTML
     */
    createTaskCard(todo) {
        const priorityColor = this.colors[todo.priority] || '#6c757d';
        const statusText = {
            'pending': '待开始',
            'in-progress': '进行中',
            'completed': '已完成'
        }[todo.status] || '待开始';

        return `
            <div class="task-card" data-task-id="${todo.id}" draggable="true">
                <div class="task-header">
                    <div class="task-priority" style="background-color: ${priorityColor}"></div>
                    <div class="task-title">${todo.title}</div>
                    <div class="task-menu">
                        <button class="task-menu-btn" onclick="todoSystem.showTaskMenu('${todo.id}')">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                </div>
                <div class="task-description">${todo.description}</div>
                <div class="task-meta">
                    <div class="task-date">
                        <i class="fas fa-calendar"></i>
                        ${new Date(todo.createdAt).toLocaleDateString('zh-CN')}
                    </div>
                    <div class="task-status">${statusText}</div>
                </div>
            </div>
        `;
    }

    /**
     * 更新统计信息
     */
    updateStats() {
        const totalTasks = this.todos.length;
        const completedTasks = this.todos.filter(todo => todo.status === 'completed').length;
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // 更新数字
        const totalElement = document.getElementById('total-tasks');
        const completedElement = document.getElementById('completed-tasks');
        const progressElement = document.getElementById('progress-circle');

        if (totalElement) totalElement.textContent = totalTasks;
        if (completedElement) completedElement.textContent = completedTasks;
        
        // 更新进度圆环
        if (progressElement) {
            const progressText = progressElement.querySelector('.progress-text');
            if (progressText) progressText.textContent = `${progress}%`;
            
            // 更新圆环进度
            const angle = (progress / 100) * 360;
            progressElement.style.background = `conic-gradient(var(--vm-gold) ${angle}deg, rgba(212, 175, 55, 0.2) ${angle}deg)`;
        }
    }

    /**
     * 添加新任务
     */
    addNewTodo() {
        const title = prompt('请输入任务标题:');
        if (!title) return;

        const description = prompt('请输入任务描述 (可选):') || '';
        const priority = prompt('请选择优先级 (高优先级/中优先级/低优先级):', '中优先级') || '中优先级';

        const newTodo = {
            id: Date.now().toString(),
            title: title.trim(),
            description: description.trim(),
            category: priority,
            priority: priority,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        this.todos.push(newTodo);
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
    }

    /**
     * 搜索TODO
     */
    searchTodos(query) {
        const cards = document.querySelectorAll('.task-card');
        cards.forEach(card => {
            const title = card.querySelector('.task-title').textContent.toLowerCase();
            const description = card.querySelector('.task-description').textContent.toLowerCase();
            const isMatch = title.includes(query.toLowerCase()) || description.includes(query.toLowerCase());
            
            card.style.display = isMatch ? 'block' : 'none';
        });
    }

    /**
     * 清空搜索
     */
    clearSearch() {
        const searchInput = document.getElementById('todo-search');
        if (searchInput) {
            searchInput.value = '';
            this.searchTodos('');
        }
    }

    /**
     * 筛选TODO
     */
    filterTodos(filter) {
        const columns = document.querySelectorAll('.kanban-column');
        columns.forEach(column => {
            if (filter === 'all') {
                column.style.display = 'flex';
            } else {
                const category = column.dataset.category;
                column.style.display = category === filter ? 'flex' : 'none';
            }
        });
    }

    /**
     * 更新活动筛选器
     */
    updateActiveFilter(activeTab) {
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        activeTab.classList.add('active');
    }

    /**
     * 添加新任务到指定分类
     */
    addTodoToCategory(category) {
        const title = prompt('请输入任务标题:');
        if (!title) return;

        const description = prompt('请输入任务描述 (可选):') || '';

        const newTodo = {
            id: Date.now().toString(),
            title: title.trim(),
            description: description.trim(),
            category: category,
            priority: category,
            status: category === '已完成' ? 'completed' : 'pending',
            createdAt: new Date().toISOString()
        };

        if (category === '已完成') {
            newTodo.completedAt = new Date().toISOString();
        }

        this.todos.push(newTodo);
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
        this.showNotification('任务已添加', 'success');
    }

    /**
     * 显示任务菜单
     */
    showTaskMenu(taskId) {
        const todo = this.todos.find(t => t.id === taskId);
        if (!todo) return;

        const actions = [
            { label: '编辑', action: () => this.editTodo(taskId) },
            { label: '删除', action: () => this.deleteTodo(taskId) },
            { label: '复制', action: () => this.duplicateTodo(taskId) }
        ];

        // 简单的确认菜单
        const action = prompt(`选择操作:\n1. 编辑\n2. 删除\n3. 复制\n请输入数字:`);
        
        switch(action) {
            case '1':
                this.editTodo(taskId);
                break;
            case '2':
                this.deleteTodo(taskId);
                break;
            case '3':
                this.duplicateTodo(taskId);
                break;
        }
    }

    /**
     * 编辑任务
     */
    editTodo(taskId) {
        const todo = this.todos.find(t => t.id === taskId);
        if (!todo) return;

        const newTitle = prompt('编辑任务标题:', todo.title);
        if (newTitle === null) return;

        const newDescription = prompt('编辑任务描述:', todo.description);
        if (newDescription === null) return;

        todo.title = newTitle.trim();
        todo.description = newDescription.trim();
        todo.updatedAt = new Date().toISOString();

        this.saveTodos();
        this.renderTodos();
        this.showNotification('任务已更新', 'success');
    }

    /**
     * 删除任务
     */
    deleteTodo(taskId) {
        if (!confirm('确定要删除这个任务吗？')) return;

        this.todos = this.todos.filter(t => t.id !== taskId);
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
        this.showNotification('任务已删除', 'success');
    }

    /**
     * 复制任务
     */
    duplicateTodo(taskId) {
        const todo = this.todos.find(t => t.id === taskId);
        if (!todo) return;

        const newTodo = {
            ...todo,
            id: Date.now().toString(),
            title: todo.title + ' (副本)',
            status: 'pending',
            category: todo.category === '已完成' ? '中优先级' : todo.category,
            createdAt: new Date().toISOString()
        };

        delete newTodo.completedAt;
        delete newTodo.updatedAt;

        this.todos.push(newTodo);
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
        this.showNotification('任务已复制', 'success');
    }

    /**
     * 关闭任务详情
     */
    closeTaskDetail() {
        const panel = document.getElementById('task-detail-panel');
        if (panel) {
            panel.style.display = 'none';
        }
    }

    /**
     * 获取详细统计信息
     */
    getDetailedStats() {
        const stats = {
            total: this.todos.length,
            completed: this.todos.filter(t => t.status === 'completed').length,
            inProgress: this.todos.filter(t => t.status === 'in-progress').length,
            pending: this.todos.filter(t => t.status === 'pending').length,
            byCategory: {},
            byPriority: {},
            productivity: this.calculateProductivity()
        };

        // 按分类统计
        this.categories.forEach(category => {
            stats.byCategory[category] = this.todos.filter(t => t.category === category).length;
        });

        // 按优先级统计
        ['高优先级', '中优先级', '低优先级'].forEach(priority => {
            stats.byPriority[priority] = this.todos.filter(t => t.priority === priority).length;
        });

        return stats;
    }

    /**
     * 计算生产力指标
     */
    calculateProductivity() {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const completedThisWeek = this.todos.filter(todo => {
            if (!todo.completedAt) return false;
            const completedDate = new Date(todo.completedAt);
            return completedDate >= oneWeekAgo;
        }).length;

        const createdThisWeek = this.todos.filter(todo => {
            const createdDate = new Date(todo.createdAt);
            return createdDate >= oneWeekAgo;
        }).length;

        return {
            completedThisWeek,
            createdThisWeek,
            completionRate: createdThisWeek > 0 ? Math.round((completedThisWeek / createdThisWeek) * 100) : 0
        };
    }

    /**
     * 导入TODO数据
     */
    importTodos() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedTodos = JSON.parse(e.target.result);
                    
                    if (confirm(`确定要导入 ${importedTodos.length} 个任务吗？这将替换当前所有任务。`)) {
                        this.todos = importedTodos;
                        this.saveTodos();
                        this.renderTodos();
                        this.updateStats();
                        this.showNotification('任务导入成功', 'success');
                    }
                } catch (error) {
                    this.showNotification('导入失败：文件格式错误', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    /**
     * 清空所有任务
     */
    clearAllTodos() {
        if (!confirm('确定要清空所有任务吗？此操作不可撤销！')) return;

        this.todos = [];
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
        this.showNotification('所有任务已清空', 'warning');
    }

    /**
     * 导出TODO数据
     */
    exportTodos() {
        const dataStr = JSON.stringify(this.todos, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `vm-todos-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('TODO数据已导出', 'success');
    }
}

// 初始化视觉TODO系统
const todoSystem = new VisualTodoSystem();

// 导出到全局
if (typeof window !== 'undefined') {
    window.VisualTodoSystem = VisualTodoSystem;
    window.todoSystem = todoSystem;
}