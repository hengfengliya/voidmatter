/**
 * 有物AI配置文件
 * 用于管理API密钥、端点和其他配置项
 */

window.YOUWO_AI_CONFIG = {
    // 火山引擎配置
    volcano: {
        // 从环境变量或默认值获取API密钥
        apiKey: typeof process !== 'undefined' && process.env ?
                (process.env.ARK_API_KEY || '4dea1399-3986-471a-8f8c-b080f01fa103') :
                '4dea1399-3986-471a-8f8c-b080f01fa103',
        baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
        model: 'bot-20250915112813-kx2qr',  // 恢复原始bot模型ID
        maxTokens: 4096,
        temperature: 0.7,
        topP: 0.9
    },

    // 备用配置 - 如果主配置失效可以切换
    backup: {
        // 这里可以配置其他API服务商作为备用
        // 例如：OpenAI、阿里云、腾讯云等
        enabled: false,
        apiKey: '',
        baseURL: '',
        model: ''
    },

    // 系统设置
    system: {
        // 是否在页面加载时自动测试API连接
        autoTestConnection: true,

        // 是否显示详细的错误信息
        showDetailedErrors: true,

        // 连接超时时间（毫秒）
        connectionTimeout: 30000,

        // 重试次数
        maxRetries: 3
    },

    // 用户体验设置
    ui: {
        // 打字机效果速度（毫秒）
        typewriterSpeed: 30,

        // 是否启用思维链显示
        showThinking: true,

        // 最大对话历史条数
        maxHistoryMessages: 10
    }
};

// 配置验证函数
function validateConfig(config) {
    const errors = [];

    if (!config.volcano.apiKey) {
        errors.push('缺少API密钥');
    }

    if (!config.volcano.baseURL) {
        errors.push('缺少API基础URL');
    }

    if (!config.volcano.model) {
        errors.push('缺少模型ID');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// 获取当前配置
function getCurrentConfig() {
    const validation = validateConfig(window.YOUWO_AI_CONFIG);

    if (!validation.isValid) {
        console.warn('⚠️ 配置验证失败:', validation.errors);
    }

    return window.YOUWO_AI_CONFIG.volcano;
}

// 更新配置
function updateConfig(newConfig) {
    Object.assign(window.YOUWO_AI_CONFIG.volcano, newConfig);
    console.log('✅ 配置已更新');
}

// 导出配置管理函数
window.YouwoAIConfig = {
    get: getCurrentConfig,
    update: updateConfig,
    validate: validateConfig
};