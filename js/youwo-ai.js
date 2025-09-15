/**
 * 有物AI - 精简版DeepSeek联网聊天系统
 * 采用夸克AI风格的简洁界面设计
 * 集成火山引擎DeepSeek API + 联网搜索功能
 */

class YouwoAI {
    constructor() {
        // 从配置文件加载API配置
        this.config = window.YouwoAIConfig ?
            window.YouwoAIConfig.get() :
            {
                apiKey: '4dea1399-3986-471a-8f8c-b080f01fa103',
                baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
                model: 'bot-20250915112813-kx2qr',
                maxTokens: 4096,
                temperature: 0.7,
                topP: 0.9
            };

        // 当前AI模式 - 默认为全部
        this.currentMode = 'all';

        // 对话历史
        this.messages = [];

        // 是否正在发送请求
        this.isLoading = false;

        // 是否已开始对话
        this.hasStartedChat = false;
        
        // 模式定义
        this.modes = {
            industry: {
                name: '行业分析',
                icon: 'fas fa-industry',
                placeholder: '输入行业名称或关键词，如"新能源汽车"、"半导体"、"消费电子"...',
                systemPrompt: `你是VM(虚空有物科技)的专业行业研究分析师，专注于：
                - 产业链全景分析和竞争格局梳理
                - 商业模式解构和政策环境评估
                - 投资机会识别和风险点分析
                - 行业周期判断和时机把握

                请提供专业、深度、客观的行业分析，注重数据支撑和逻辑推理。`
            },

            company: {
                name: '公司研究',
                icon: 'fas fa-building',
                placeholder: '输入公司名称或股票代码，如"比亚迪"、"000858"、"宁德时代"...',
                systemPrompt: `你是VM的资深公司研究分析师，专注于：
                - 公司基本面分析和财务质量评估
                - 商业模式深度解析和竞争优势分析
                - 管理层评价和治理结构分析
                - DCF估值建模和投资评级

                请提供全面、客观的公司分析报告，强调投资价值和风险评估。`
            },

            stock: {
                name: '股票分析',
                icon: 'fas fa-chart-line',
                placeholder: '输入股票代码或技术分析需求，如"000001技术面"、"上证指数走势"...',
                systemPrompt: `你是VM的专业股票分析师，专注于：
                - 技术分析：趋势分析、技术指标、量价关系
                - 基本面分析：估值分析、财务分析
                - 交易策略：买卖时机、仓位管理、风险控制

                请提供专业的股票分析建议，必须强调风险提示和资金管理。`
            },

            advice: {
                name: '投资建议',
                icon: 'fas fa-lightbulb',
                placeholder: '描述您的投资需求，如"10万元如何配置"、"价值投资策略"...',
                systemPrompt: `你是VM的高级投资顾问，专注于：
                - 投资策略制定和资产配置建议
                - 风险管理和投资组合优化
                - 投资时机判断和策略调整
                - 个性化投资建议和财富管理

                请提供专业、实用的投资建议，特别注重风险管理和长期价值创造。`
            },

            data: {
                name: '数据解读',
                icon: 'fas fa-chart-bar',
                placeholder: '输入财报数据或经济指标，如"CPI数据分析"、"茅台财报解读"...',
                systemPrompt: `你是VM的数据分析师，专注于：
                - 财务报表深度分析和数据挖掘
                - 宏观经济指标解释和趋势分析
                - 统计建模和量化分析
                - 数据可视化和洞察提取

                请用通俗易懂的语言解释复杂数据，突出关键洞察和投资含义。`
            },

            all: {
                name: '全部',
                icon: 'fas fa-layer-group',
                placeholder: '请输入任何投研相关问题，AI将智能匹配最合适的分析角度...',
                systemPrompt: `你是VM(虚空有物科技)的全能AI助手，具备以下能力：
                - 行业研究与分析：产业链分析、竞争格局、投资机会识别
                - 公司研究：基本面分析、财务评估、商业模式解析
                - 股票分析：技术分析、估值建模、投资建议
                - 数据解读：财务报表分析、宏观经济指标解释
                - 智能搜索：根据需要自动联网获取最新信息

                请根据用户的具体需求，选择最合适的分析角度和方法，提供专业、准确的回答。`
            }
        };
        
        this.init();
    }
    
    // 初始化系统
    init() {
        this.bindEvents();
        this.updateModeDisplay();
        this.setDefaultActiveTab();  // 设置默认选中第一个tab
        this.autoResizeTextarea();
        console.log('🤖 有物AI精简版已启动');
    }

    // 设置默认选中第一个tab
    setDefaultActiveTab() {
        // 确保默认模式是全部
        this.currentMode = 'all';

        // 移除所有tab的active状态
        document.querySelectorAll('.vm-mode-chip').forEach(chip => {
            chip.classList.remove('active');
        });

        // 设置"全部"tab为active
        const allTab = document.querySelector('[data-mode="all"]');
        if (allTab) {
            allTab.classList.add('active');
        }

        console.log(`✅ 默认选中模式: ${this.modes[this.currentMode].name}`);
    }
    
    // 绑定事件监听
    bindEvents() {
        // 模式切换按钮
        document.querySelectorAll('.vm-mode-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.switchMode(mode);
            });
        });
        
        // 发送按钮
        document.getElementById('sendBtn').addEventListener('click', () => {
            this.sendMessage();
        });
        
        // 输入框事件
        const messageInput = document.getElementById('messageInput');
        
        // 回车发送
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // 自动调整高度
        messageInput.addEventListener('input', () => {
            this.autoResizeTextarea();
        });
    }
    
    // 切换AI模式
    switchMode(mode) {
        if (this.isLoading) return;
        
        this.currentMode = mode;
        
        // 更新按钮状态
        document.querySelectorAll('.vm-mode-chip').forEach(chip => {
            chip.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        
        // 更新模式显示
        this.updateModeDisplay();
        
        // 如果已开始对话，添加模式切换提示
        if (this.hasStartedChat) {
            this.addSystemMessage(`已切换到 ${this.modes[mode].name} 模式`);
        }
        
        console.log(`🔄 模式切换: ${this.modes[mode].name}`);
    }
    
    // 更新模式显示区域
    updateModeDisplay() {
        const modeInfo = this.modes[this.currentMode];
        document.getElementById('currentModeName').textContent = modeInfo.name;
        document.getElementById('currentModeIcon').className = modeInfo.icon;

        // 更新搜索框的placeholder
        this.updateInputPlaceholder();
    }

    // 更新输入框placeholder
    updateInputPlaceholder() {
        const messageInput = document.getElementById('messageInput');
        const modeInfo = this.modes[this.currentMode];
        if (messageInput && modeInfo.placeholder) {
            messageInput.placeholder = modeInfo.placeholder;
        }
    }
    
    // 发送消息主函数
    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();

        if (!message || this.isLoading) return;

        // 首次发送消息时，显示对话区域，隐藏欢迎区域
        if (!this.hasStartedChat) {
            this.hasStartedChat = true;
            document.getElementById('welcomeArea').classList.add('hidden');
            document.getElementById('chatArea').classList.remove('hidden');
        }

        // 设置加载状态
        this.setLoadingState(true);

        // 添加用户消息到界面
        this.addUserMessage(message);

        // 清空输入框
        messageInput.value = '';
        this.autoResizeTextarea();

        // 添加思考状态消息
        const thinkingMessage = this.addThinkingStatusMessage();
        const startTime = Date.now();

        try {
            // 调用API
            await this.callDeepSeekAPI(message);

        } catch (error) {
            console.error('❌ API调用失败:', error);
            this.addErrorMessage(`抱歉，请求失败了：${error.message || '网络错误，请稍后重试'}`);
        } finally {
            // 移除思考状态消息
            if (thinkingMessage) {
                thinkingMessage.remove();
            }

            // 恢复正常状态
            this.setLoadingState(false);
            messageInput.focus();
        }
    }
    
    // 调用API - 普通非流式调用
    async callDeepSeekAPI(userMessage) {
        const modeInfo = this.modes[this.currentMode];

        // 构建消息数组
        const messages = [
            {
                role: 'system',
                content: modeInfo.systemPrompt
            },
            // 保留最近6条对话历史
            ...this.messages.slice(-6),
            {
                role: 'user',
                content: userMessage
            }
        ];

        // 构建请求数据 - 非流式调用
        const requestData = {
            model: this.config.model,
            messages: messages,
            stream: false,  // 关闭流式输出
            temperature: this.config.temperature || 0.7,
            max_tokens: this.config.maxTokens || 4096,
            top_p: this.config.topP || 0.9
        };

        console.log('🚀 发送非流式API请求:', {
            endpoint: `${this.config.baseURL}/bots/chat/completions`,
            model: requestData.model,
            messagesCount: messages.length,
            stream: requestData.stream,
            apiKeyPrefix: this.config.apiKey ? this.config.apiKey.substring(0, 10) + '...' : 'null'
        });

        // 发送API请求
        const response = await fetch(`${this.config.baseURL}/bots/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        console.log('📡 API响应状态:', response.status, response.statusText);

        if (!response.ok) {
            let errorMessage = `HTTP ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                console.error('❌ API错误详情:', errorData);
                errorMessage = errorData.error?.message || errorData.message || errorMessage;

                // 特殊错误处理
                if (response.status === 401) {
                    errorMessage = 'API密钥无效或已过期，请检查配置';
                } else if (response.status === 403) {
                    errorMessage = 'API访问被拒绝，请检查权限设置';
                } else if (response.status === 404) {
                    errorMessage = '模型ID不存在，请检查模型配置';
                } else if (response.status === 429) {
                    errorMessage = 'API调用频率超限，请稍后重试';
                }
            } catch (e) {
                console.error('❌ 解析错误响应失败:', e);
            }
            throw new Error(errorMessage);
        }

        // 处理普通响应
        const responseData = await response.json();
        console.log('📊 API响应数据:', responseData);

        // 提取AI回复内容
        const aiResponse = responseData.choices?.[0]?.message?.content;
        if (!aiResponse) {
            console.error('❌ 响应数据格式异常:', responseData);
            throw new Error('API响应格式异常，未找到有效内容');
        }

        // 添加AI消息到界面，使用打字机效果
        this.addAIMessage(aiResponse);

        // 保存对话历史
        this.messages.push(
            { role: 'user', content: userMessage },
            { role: 'assistant', content: aiResponse }
        );

        console.log('✅ 非流式API调用成功');
        return aiResponse;
    }

    // 处理流式响应
    async handleStreamResponse(response, userMessage) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';
        let thinkingContent = '';
        let isInThinking = false;

        // 创建AI消息容器
        const chatArea = document.getElementById('chatArea');
        const messageDiv = document.createElement('div');
        const modeInfo = this.modes[this.currentMode];

        messageDiv.className = 'vm-message ai';
        messageDiv.innerHTML = `
            <div class="vm-message-content">
                <div class="vm-message-header">
                    <div class="vm-message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <span>有物AI · ${modeInfo.name}</span>
                </div>
                <div class="vm-thinking-section" id="thinking-section" style="display: none;">
                    <div class="vm-thinking-header">
                        <i class="fas fa-brain"></i>
                        <span>AI思维过程</span>
                        <button class="vm-thinking-toggle" onclick="this.parentElement.nextElementSibling.style.display = this.parentElement.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </div>
                    <div class="vm-thinking-content" id="thinking-content"></div>
                </div>
                <div class="vm-message-text" id="ai-response"></div>
            </div>
        `;

        chatArea.appendChild(messageDiv);
        this.scrollToBottom();

        const thinkingSection = messageDiv.querySelector('#thinking-section');
        const thinkingContentEl = messageDiv.querySelector('#thinking-content');
        const responseEl = messageDiv.querySelector('#ai-response');

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            const choice = parsed.choices?.[0];
                            if (!choice) continue;

                            const delta = choice.delta;
                            if (!delta) continue;

                            // 处理思维链内容
                            if (delta.thinking) {
                                if (!isInThinking) {
                                    isInThinking = true;
                                    thinkingSection.style.display = 'block';
                                }
                                thinkingContent += delta.thinking;
                                thinkingContentEl.textContent = thinkingContent;
                                this.scrollToBottom();
                            }

                            // 处理正常响应内容
                            if (delta.content) {
                                isInThinking = false;
                                fullResponse += delta.content;
                                responseEl.innerHTML = this.formatMessage(fullResponse) + '<span class="vm-typing-cursor">|</span>';
                                this.scrollToBottom();
                            }

                        } catch (e) {
                            console.warn('解析流式数据错误:', e);
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }

        // 移除光标
        responseEl.innerHTML = this.formatMessage(fullResponse);

        // 保存对话历史
        this.messages.push(
            { role: 'user', content: userMessage },
            { role: 'assistant', content: fullResponse }
        );

        console.log('✅ 流式API调用成功');
        return fullResponse;
    }
    
    // 设置加载状态
    setLoadingState(isLoading) {
        this.isLoading = isLoading;
        const sendBtn = document.getElementById('sendBtn');
        const messageInput = document.getElementById('messageInput');
        
        if (isLoading) {
            sendBtn.disabled = true;
            sendBtn.innerHTML = '<div class="vm-thinking-dots"><div class="vm-thinking-dot"></div><div class="vm-thinking-dot"></div><div class="vm-thinking-dot"></div></div>';
            messageInput.disabled = true;
        } else {
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
            messageInput.disabled = false;
        }
    }
    
    // 添加用户消息
    addUserMessage(message) {
        const chatArea = document.getElementById('chatArea');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'vm-message user';
        
        messageDiv.innerHTML = `
            <div class="vm-message-content">
                <div class="vm-message-header">
                    <div class="vm-message-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <span>您</span>
                </div>
                <div class="vm-message-text">${this.escapeHtml(message)}</div>
            </div>
        `;
        
        chatArea.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    // 添加AI消息 - 带逐字输出效果
    addAIMessage(message) {
        const chatArea = document.getElementById('chatArea');
        const messageDiv = document.createElement('div');
        const modeInfo = this.modes[this.currentMode];

        messageDiv.className = 'vm-message ai';
        messageDiv.innerHTML = `
            <div class="vm-message-content">
                <div class="vm-message-header">
                    <div class="vm-message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <span>有物AI · ${modeInfo.name}</span>
                </div>
                <div class="vm-message-text" id="ai-message-${Date.now()}"></div>
            </div>
        `;

        chatArea.appendChild(messageDiv);
        this.scrollToBottom();

        // 启动逐字输出
        const messageTextEl = messageDiv.querySelector('.vm-message-text');
        this.typewriterEffect(messageTextEl, message);
    }

    // 打字机效果
    async typewriterEffect(element, text) {
        const formattedText = this.formatMessage(text);
        element.innerHTML = '<span class="vm-typing-cursor">|</span>';

        // 解析HTML内容，但逐字显示
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = formattedText;

        let displayText = '';
        const plainText = tempDiv.textContent || tempDiv.innerText || '';

        for (let i = 0; i < plainText.length; i++) {
            displayText += plainText[i];

            // 重新应用格式化到当前显示的文本
            const currentFormatted = this.formatMessage(displayText);
            element.innerHTML = currentFormatted + '<span class="vm-typing-cursor">|</span>';

            this.scrollToBottom();

            // 控制打字速度
            const char = plainText[i];
            let delay = 30; // 基础延迟30ms

            if (char === '.' || char === '!' || char === '?') {
                delay = 200; // 句号后停顿
            } else if (char === ',' || char === ';') {
                delay = 100; // 逗号后小停顿
            } else if (char === ' ') {
                delay = 50; // 空格稍快
            }

            await new Promise(resolve => setTimeout(resolve, delay));
        }

        // 移除光标，显示最终格式化文本
        element.innerHTML = formattedText;
        this.scrollToBottom();
    }
    
    // 添加思考状态消息 - 精美多步骤展示
    addThinkingStatusMessage() {
        const chatArea = document.getElementById('chatArea');
        const messageDiv = document.createElement('div');
        const modeInfo = this.modes[this.currentMode];

        messageDiv.className = 'vm-message ai';
        messageDiv.innerHTML = `
            <div class="vm-message-content">
                <div class="vm-message-header">
                    <div class="vm-message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <span>有物AI · ${modeInfo.name}</span>
                </div>
                <div class="vm-thinking-process" style="
                    background: rgba(212, 175, 55, 0.03);
                    border: 1px solid rgba(212, 175, 55, 0.1);
                    border-radius: 12px;
                    padding: 16px;
                    margin-top: 8px;
                    font-size: 13px;
                    line-height: 1.5;
                ">
                    <div class="vm-thinking-header" style="
                        display: flex;
                        align-items: center;
                        margin-bottom: 12px;
                        font-size: 12px;
                        color: #D4AF37;
                        font-weight: 500;
                    ">
                        <i class="fas fa-brain" style="margin-right: 6px; font-size: 14px;"></i>
                        <span>AI深度分析中</span>
                    </div>
                    <div class="vm-thinking-steps">
                        <div class="vm-step" id="step-0" style="
                            display: flex;
                            align-items: center;
                            margin-bottom: 8px;
                            color: #888;
                            font-size: 12px;
                            opacity: 0;
                            transform: translateX(-10px);
                            transition: all 0.3s ease;
                        ">
                            <div class="vm-step-icon" style="
                                width: 16px;
                                height: 16px;
                                margin-right: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <div class="vm-thinking-dot-mini" style="
                                    width: 4px;
                                    height: 4px;
                                    background: #D4AF37;
                                    border-radius: 50%;
                                    animation: vm-pulse 1.5s ease-in-out infinite;
                                "></div>
                            </div>
                            <span>正在解析市场数据与趋势...</span>
                        </div>
                        <div class="vm-step" id="step-1" style="
                            display: flex;
                            align-items: center;
                            margin-bottom: 8px;
                            color: #888;
                            font-size: 12px;
                            opacity: 0;
                            transform: translateX(-10px);
                            transition: all 0.3s ease;
                        ">
                            <div class="vm-step-icon" style="
                                width: 16px;
                                height: 16px;
                                margin-right: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <div class="vm-thinking-dot-mini" style="
                                    width: 4px;
                                    height: 4px;
                                    background: #D4AF37;
                                    border-radius: 50%;
                                    animation: vm-pulse 1.5s ease-in-out infinite;
                                "></div>
                            </div>
                            <span>正在比对个股历史走势与行业基准...</span>
                        </div>
                        <div class="vm-step" id="step-2" style="
                            display: flex;
                            align-items: center;
                            margin-bottom: 8px;
                            color: #888;
                            font-size: 12px;
                            opacity: 0;
                            transform: translateX(-10px);
                            transition: all 0.3s ease;
                        ">
                            <div class="vm-step-icon" style="
                                width: 16px;
                                height: 16px;
                                margin-right: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <div class="vm-thinking-dot-mini" style="
                                    width: 4px;
                                    height: 4px;
                                    background: #D4AF37;
                                    border-radius: 50%;
                                    animation: vm-pulse 1.5s ease-in-out infinite;
                                "></div>
                            </div>
                            <span>正在推演多种可能的风险路径...</span>
                        </div>
                        <div class="vm-step" id="step-3" style="
                            display: flex;
                            align-items: center;
                            margin-bottom: 8px;
                            color: #888;
                            font-size: 12px;
                            opacity: 0;
                            transform: translateX(-10px);
                            transition: all 0.3s ease;
                        ">
                            <div class="vm-step-icon" style="
                                width: 16px;
                                height: 16px;
                                margin-right: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <div class="vm-thinking-dot-mini" style="
                                    width: 4px;
                                    height: 4px;
                                    background: #D4AF37;
                                    border-radius: 50%;
                                    animation: vm-pulse 1.5s ease-in-out infinite;
                                "></div>
                            </div>
                            <span>正在筛选更稳健的投资逻辑...</span>
                        </div>
                        <div class="vm-step" id="step-final" style="
                            display: flex;
                            align-items: center;
                            margin-top: 12px;
                            padding-top: 12px;
                            border-top: 1px solid rgba(212, 175, 55, 0.1);
                            color: #D4AF37;
                            font-size: 12px;
                            font-weight: 500;
                            opacity: 0;
                            transform: translateX(-10px);
                            transition: all 0.3s ease;
                        ">
                            <div class="vm-step-icon" style="
                                width: 16px;
                                height: 16px;
                                margin-right: 8px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <i class="fas fa-sparkles" style="font-size: 12px; color: #D4AF37;"></i>
                            </div>
                            <span>生成专业分析结果，深度思考中 <span class="vm-timer">0</span>秒...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        chatArea.appendChild(messageDiv);
        this.scrollToBottom();

        // 添加CSS动画
        if (!document.getElementById('vm-pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'vm-pulse-animation';
            style.textContent = `
                @keyframes vm-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.2); }
                }
            `;
            document.head.appendChild(style);
        }

        // 启动步骤动画
        this.startThinkingStepsAnimation(messageDiv);

        // 启动计时器
        const timerElement = messageDiv.querySelector('.vm-timer');
        const startTime = Date.now();

        const updateTimer = () => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            timerElement.textContent = elapsed;
        };

        // 每秒更新计时器
        const timerInterval = setInterval(updateTimer, 1000);

        // 将interval ID存储在元素上，以便清理
        messageDiv._timerInterval = timerInterval;

        // 覆盖remove方法，确保清理定时器
        const originalRemove = messageDiv.remove;
        messageDiv.remove = function() {
            if (this._timerInterval) {
                clearInterval(this._timerInterval);
            }
            originalRemove.call(this);
        };

        return messageDiv;
    }

    // 启动思考步骤动画
    startThinkingStepsAnimation(messageDiv) {
        const steps = ['step-0', 'step-1', 'step-2', 'step-3', 'step-final'];
        let currentStep = 0;

        const showNextStep = () => {
            if (currentStep > 0) {
                // 完成上一步
                const prevStep = messageDiv.querySelector(`#${steps[currentStep - 1]}`);
                if (prevStep) {
                    const icon = prevStep.querySelector('.vm-step-icon');
                    if (icon && currentStep < steps.length) {
                        icon.innerHTML = '<i class="fas fa-check" style="font-size: 10px; color: #D4AF37;"></i>';
                    }
                }
            }

            if (currentStep < steps.length) {
                // 显示当前步骤
                const currentStepEl = messageDiv.querySelector(`#${steps[currentStep]}`);
                if (currentStepEl) {
                    currentStepEl.style.opacity = '1';
                    currentStepEl.style.transform = 'translateX(0)';
                    this.scrollToBottom();
                }
                currentStep++;

                // 设置下一步的延迟时间
                const delay = currentStep === steps.length ? 0 : (800 + Math.random() * 400); // 0.8-1.2秒随机间隔
                if (currentStep < steps.length) {
                    setTimeout(showNextStep, delay);
                }
            }
        };

        // 开始动画
        setTimeout(showNextStep, 200);
    }

    // 添加AI思考状态 - 带思维链
    addThinkingMessage() {
        const chatArea = document.getElementById('chatArea');
        const messageDiv = document.createElement('div');
        const modeInfo = this.modes[this.currentMode];

        messageDiv.className = 'vm-message ai';
        messageDiv.innerHTML = `
            <div class="vm-message-content">
                <div class="vm-message-header">
                    <div class="vm-message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <span>有物AI · ${modeInfo.name}</span>
                </div>
                <div class="vm-thinking-chain">
                    <div class="vm-thinking-step" id="step-1">
                        <i class="fas fa-search"></i>
                        <span>正在分析您的问题...</span>
                        <div class="vm-thinking-dots">
                            <div class="vm-thinking-dot"></div>
                            <div class="vm-thinking-dot"></div>
                            <div class="vm-thinking-dot"></div>
                        </div>
                    </div>
                    <div class="vm-thinking-step hidden" id="step-2">
                        <i class="fas fa-cogs"></i>
                        <span>选择最佳分析角度...</span>
                        <div class="vm-thinking-dots">
                            <div class="vm-thinking-dot"></div>
                            <div class="vm-thinking-dot"></div>
                            <div class="vm-thinking-dot"></div>
                        </div>
                    </div>
                    <div class="vm-thinking-step hidden" id="step-3">
                        <i class="fas fa-brain"></i>
                        <span>深度分析中，生成专业洞察...</span>
                        <div class="vm-thinking-dots">
                            <div class="vm-thinking-dot"></div>
                            <div class="vm-thinking-dot"></div>
                            <div class="vm-thinking-dot"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        chatArea.appendChild(messageDiv);
        this.scrollToBottom();

        // 启动思维链动画
        this.startThinkingChain(messageDiv);

        return messageDiv;
    }

    // 启动思维链动画序列
    startThinkingChain(messageDiv) {
        const steps = ['step-1', 'step-2', 'step-3'];
        let currentStep = 0;

        const nextStep = () => {
            if (currentStep > 0) {
                // 完成当前步骤
                const prevStep = messageDiv.querySelector(`#${steps[currentStep - 1]}`);
                if (prevStep) {
                    prevStep.classList.add('completed');
                    const dots = prevStep.querySelector('.vm-thinking-dots');
                    if (dots) {
                        dots.innerHTML = '<i class="fas fa-check" style="color: #D4AF37;"></i>';
                    }
                }
            }

            if (currentStep < steps.length) {
                // 显示下一步
                const nextStepEl = messageDiv.querySelector(`#${steps[currentStep]}`);
                if (nextStepEl) {
                    nextStepEl.classList.remove('hidden');
                    this.scrollToBottom();
                }
                currentStep++;
                setTimeout(nextStep, 1500 + Math.random() * 1000); // 1.5-2.5秒随机间隔
            }
        };

        nextStep();
    }
    
    // 添加系统消息
    addSystemMessage(message) {
        const chatArea = document.getElementById('chatArea');
        const messageDiv = document.createElement('div');
        
        messageDiv.className = 'vm-message ai';
        messageDiv.innerHTML = `
            <div style="text-align: center; padding: 8px; margin: 8px 0;">
                <div style="display: inline-block; background: rgba(0,0,0,0.3); border: 1px solid rgba(212,175,55,0.3); border-radius: 16px; padding: 6px 12px; font-size: 12px; color: #D4AF37;">
                    <i class="fas fa-info-circle"></i> ${message}
                </div>
            </div>
        `;
        
        chatArea.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    // 添加错误消息
    addErrorMessage(message) {
        const chatArea = document.getElementById('chatArea');
        const messageDiv = document.createElement('div');
        
        messageDiv.className = 'vm-message ai';
        messageDiv.innerHTML = `
            <div class="vm-message-content">
                <div class="vm-message-header">
                    <div class="vm-message-avatar" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <span style="color: #ef4444;">系统提示</span>
                </div>
                <div class="vm-message-text">${this.escapeHtml(message)}</div>
            </div>
        `;
        
        chatArea.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    // 格式化消息内容（支持简单markdown）
    formatMessage(message) {
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #D4AF37;">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px;">$1</code>')
            .replace(/#{1,6}\s+(.*?)$/gm, '<h4 style="color: #D4AF37; margin: 12px 0 8px 0; font-size: 16px; font-weight: 600;">$1</h4>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
    }
    
    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 自动调整textarea高度和滚动条
    autoResizeTextarea() {
        const textarea = document.getElementById('messageInput');
        const originalHeight = textarea.style.height;

        // 重置高度以获取实际内容高度
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        const maxHeight = 140; // 最大高度，对应约3行
        const singleLineHeight = 56; // 单行高度

        // 设置实际高度
        const newHeight = Math.min(scrollHeight, maxHeight);
        textarea.style.height = newHeight + 'px';

        // 动态控制滚动条显示：只有当内容超过约2行时才显示滚动条
        if (scrollHeight > singleLineHeight + 20) { // 约2行的高度
            textarea.classList.add('multiline');
        } else {
            textarea.classList.remove('multiline');
        }
    }
    
    // 滚动到底部
    scrollToBottom() {
        const chatArea = document.getElementById('chatArea');
        setTimeout(() => {
            chatArea.scrollTop = chatArea.scrollHeight;
        }, 100);
    }

    // API连接测试函数
    async testAPIConnection() {
        try {
            console.log('🔍 测试API连接...');
            console.log('📋 当前配置:', {
                baseURL: this.config.baseURL,
                model: this.config.model,
                apiKey: this.config.apiKey ? this.config.apiKey.substring(0, 10) + '...' : 'null'
            });

            // 使用非流式格式进行测试
            const requestData = {
                model: this.config.model,
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant."
                    },
                    {
                        role: "user",
                        content: "Hello!"
                    }
                ],
                stream: false,  // 非流式调用
                temperature: 0.7,
                max_tokens: 100,
                top_p: 0.9
            };

            console.log('📤 发送测试请求:', JSON.stringify(requestData, null, 2));

            const response = await fetch(`${this.config.baseURL}/bots/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            console.log('📡 响应状态:', response.status, response.statusText);
            console.log('📋 响应头:', Object.fromEntries(response.headers.entries()));

            if (response.ok) {
                console.log('✅ API连接测试成功');

                try {
                    const responseData = await response.json();
                    console.log('📊 完整响应数据:', responseData);

                    // 检查响应格式
                    if (responseData.choices && responseData.choices.length > 0) {
                        const aiContent = responseData.choices[0].message?.content;
                        if (aiContent) {
                            console.log('✅ 成功接收到AI响应内容:', `"${aiContent}"`);
                            return true;
                        } else {
                            console.log('⚠️ 警告: 响应中没有content字段');
                            return false;
                        }
                    } else {
                        console.log('⚠️ 警告: 响应中没有choices数组或为空');
                        console.log('可能的原因:');
                        console.log('1. 模型配置问题');
                        console.log('2. API参数设置问题');
                        return false;
                    }

                } catch (parseError) {
                    console.error('❌ 解析响应数据失败:', parseError);
                    return false;
                }

            } else {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = { message: '无法解析错误响应' };
                }
                console.error('❌ API连接测试失败:');
                console.error('状态码:', response.status);
                console.error('状态文本:', response.statusText);
                console.error('错误详情:', errorData);

                // 在页面上显示错误信息
                if (document.getElementById('welcomeArea')) {
                    const errorMsg = document.createElement('div');
                    errorMsg.style.cssText = `
                        color: #ef4444;
                        background: rgba(239, 68, 68, 0.1);
                        border: 1px solid rgba(239, 68, 68, 0.3);
                        border-radius: 8px;
                        padding: 12px;
                        margin-top: 16px;
                        font-size: 13px;
                    `;
                    errorMsg.innerHTML = `
                        <strong>API 连接失败</strong><br>
                        状态码: ${response.status}<br>
                        错误: ${errorData.message || errorData.error?.message || '未知错误'}<br>
                        <small>请检查API密钥和模型ID是否正确</small>
                    `;
                    document.getElementById('welcomeArea').appendChild(errorMsg);
                }

                return false;
            }
        } catch (error) {
            console.error('❌ API连接测试错误:', error);
            console.error('错误类型:', error.name);
            console.error('错误消息:', error.message);

            // 在页面上显示网络错误
            if (document.getElementById('welcomeArea')) {
                const errorMsg = document.createElement('div');
                errorMsg.style.cssText = `
                    color: #ef4444;
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 8px;
                    padding: 12px;
                    margin-top: 16px;
                    font-size: 13px;
                `;
                errorMsg.innerHTML = `
                    <strong>网络连接错误</strong><br>
                    ${error.message || '无法连接到 API 服务器'}<br>
                    <small>请检查网络连接或尝试在本地服务器环境下运行</small>
                `;
                document.getElementById('welcomeArea').appendChild(errorMsg);
            }

            return false;
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化有物AI
    window.youwoAI = new YouwoAI();

    console.log('🚀 有物AI精简版已启动');
    console.log('📱 采用夸克AI风格的简洁界面');
    console.log('🧠 支持模式:', Object.keys(window.youwoAI.modes));

    // 自动测试API连接
    window.youwoAI.testAPIConnection();
});