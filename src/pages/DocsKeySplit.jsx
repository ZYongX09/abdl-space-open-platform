import DocToc from '../components/DocToc';

export default function DocsKeySplit() {
  return (
    <>
      <div className="page-header">
        <h1><i className="fa-solid fa-key" /> Key Split API 文档</h1>
        <p>ABDL-Space Key Split — API Key 代理与分发服务</p>
      </div>
      <div className="page-body" style={{ maxWidth: 720 }}>
        <DocToc />

        {/* ═══════════════ 概述 ═══════════════ */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="overview">概述</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <p>Key Split 是 ABDL-Space 提供的 API Key 代理与分发服务。通过 Key Split，你可以：</p>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li>将多个上游 API 服务商的 Key 统一管理</li>
              <li>生成子 Key 分发给他人使用，无需暴露原始 API Key</li>
              <li>为每个子 Key 设置独立的额度上限和速率限制</li>
              <li>查看详细的用量统计和请求日志</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>Key Split 兼容 <strong>OpenAI API 格式</strong>，支持所有兼容 OpenAI SDK 的工具和框架。</p>
          </div>
        </section>

        {/* ═══════════════ 基础信息 ═══════════════ */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="base">基础信息</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <p>Base URL: <code>https://api.abdl-space.top/v1</code></p>
            <p>鉴权: <code>Authorization: Bearer sk-your_sub_key</code></p>
            <p>Content-Type: <code>application/json</code></p>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
              子 Key 以 <code>sk-</code> 开头，在开放平台的 Key Split 页面创建。
            </p>
          </div>
        </section>

        {/* ═══════════════ 快速开始 ═══════════════ */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="quickstart">快速开始</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <p><strong>第一步：</strong>在开放平台添加渠道（上游 API 服务商）</p>
            <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0.75rem' }}>
              进入 <strong>Key Split → 渠道管理</strong>，填入上游服务商的 Base URL 和 API Key。
            </p>
            <p><strong>第二步：</strong>创建子 Key</p>
            <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0.75rem' }}>
              进入 <strong>Key Split → 子 Key 管理</strong>，创建一个子 Key。可设置额度上限和速率限制。
            </p>
            <p><strong>第三步：</strong>使用子 Key 调用 API</p>
            <pre>{`curl https://api.abdl-space.top/v1/chat/completions \\
  -H "Authorization: Bearer sk-your_sub_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "mimo-v2.5-pro",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'`}</pre>
          </div>
        </section>

        {/* ═══════════════ 支持的接口 ═══════════════ */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="endpoints">支持的接口</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <table className="doc-table">
              <thead>
                <tr><th>接口</th><th>方法</th><th>说明</th></tr>
              </thead>
              <tbody>
                <tr><td><code>/v1/chat/completions</code></td><td>POST</td><td>对话补全（主流接口）</td></tr>
                <tr><td><code>/v1/completions</code></td><td>POST</td><td>文本补全</td></tr>
                <tr><td><code>/v1/embeddings</code></td><td>POST</td><td>文本向量化</td></tr>
                <tr><td><code>/v1/models</code></td><td>GET</td><td>获取模型列表</td></tr>
                <tr><td><code>/v1/audio/transcriptions</code></td><td>POST</td><td>语音转文字</td></tr>
                <tr><td><code>/v1/audio/translations</code></td><td>POST</td><td>语音翻译</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ═══════════════ 对话补全 ═══════════════ */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="chat-completions">
            <span style={{ background: 'var(--primary)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700, marginRight: '0.5rem' }}>POST</span>
            /v1/chat/completions
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            创建对话补全请求，支持流式和非流式输出。
          </p>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>请求参数</h3>
          <table className="doc-table" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
            <thead>
              <tr><th>参数</th><th>类型</th><th>必填</th><th>说明</th></tr>
            </thead>
            <tbody>
              <tr><td><code>model</code></td><td>string</td><td>是</td><td>模型 ID，如 <code>mimo-v2.5-pro</code></td></tr>
              <tr><td><code>messages</code></td><td>array</td><td>是</td><td>消息数组，包含 role 和 content</td></tr>
              <tr><td><code>stream</code></td><td>boolean</td><td>否</td><td>是否流式输出，默认 <code>false</code></td></tr>
              <tr><td><code>temperature</code></td><td>number</td><td>否</td><td>采样温度，0-2，默认 1.0</td></tr>
              <tr><td><code>top_p</code></td><td>number</td><td>否</td><td>核采样，0-1，默认 1.0</td></tr>
              <tr><td><code>max_tokens</code></td><td>integer</td><td>否</td><td>最大输出 token 数</td></tr>
              <tr><td><code>frequency_penalty</code></td><td>number</td><td>否</td><td>频率惩罚，-2.0 到 2.0</td></tr>
              <tr><td><code>presence_penalty</code></td><td>number</td><td>否</td><td>存在惩罚，-2.0 到 2.0</td></tr>
              <tr><td><code>stop</code></td><td>string/array</td><td>否</td><td>停止序列</td></tr>
            </tbody>
          </table>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>请求示例</h3>
          <pre>{`// 非流式
{
  "model": "mimo-v2.5-pro",
  "messages": [
    {"role": "system", "content": "你是一个有帮助的助手。"},
    {"role": "user", "content": "介绍一下自己"}
  ],
  "temperature": 0.7,
  "max_tokens": 1024,
  "stream": false
}

// 流式
{
  "model": "mimo-v2.5-pro",
  "messages": [
    {"role": "user", "content": "写一首诗"}
  ],
  "stream": true
}`}</pre>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', marginTop: '1rem' }}>响应示例</h3>
          <pre>{`// 非流式响应
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1716847200,
  "model": "mimo-v2.5-pro",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "你好！我是 MiMo..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 128,
    "total_tokens": 153
  }
}

// 流式响应（SSE）
data: {"id":"chatcmpl-xxx","choices":[{"delta":{"content":"你"}}]}
data: {"id":"chatcmpl-xxx","choices":[{"delta":{"content":"好"}}]}
data: {"id":"chatcmpl-xxx","choices":[{"delta":{}}]}
data: {"id":"chatcmpl-xxx","choices":[{"delta":{},"finish_reason":"stop"}],"usage":{"prompt_tokens":25,"completion_tokens":2,"total_tokens":27}}
data: [DONE]`}
<p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
  注意: usage 字段通常出现在流式响应的最后一个 chunk 中，且仅在上游返回时才包含。
</p></pre>
        </section>

        {/* ═══════════════ Python SDK ═══════════════ */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="sdk-python">Python SDK 示例</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <p>安装 OpenAI Python SDK：</p>
            <pre>{`pip install openai`}</pre>
            <p style={{ marginTop: '0.75rem' }}>调用示例：</p>
            <pre>{`from openai import OpenAI

client = OpenAI(
    api_key="sk-your_sub_key",
    base_url="https://api.abdl-space.top/v1"
)

# 非流式
response = client.chat.completions.create(
    model="mimo-v2.5-pro",
    messages=[
        {"role": "system", "content": "你是一个有帮助的助手。"},
        {"role": "user", "content": "你好！"}
    ],
    temperature=0.7,
    max_tokens=1024
)
print(response.choices[0].message.content)

# 流式
stream = client.chat.completions.create(
    model="mimo-v2.5-pro",
    messages=[{"role": "user", "content": "写一首诗"}],
    stream=True
)
for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")`}</pre>
          </div>
        </section>

        {/* ═══════════════ Node.js SDK ═══════════════ */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="sdk-node">Node.js SDK 示例</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <pre>{`import OpenAI from "openai";

const client = new OpenAI({
    apiKey: "sk-your_sub_key",
    baseURL: "https://api.abdl-space.top/v1",
});

const response = await client.chat.completions.create({
    model: "mimo-v2.5-pro",
    messages: [
        { role: "system", content: "你是一个有帮助的助手。" },
        { role: "user", content: "你好！" }
    ],
    temperature: 0.7,
    max_tokens: 1024,
});

console.log(response.choices[0].message.content);`}</pre>
          </div>
        </section>

        {/* ═══════════════ 模型参数 ═══════════════ */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="parameters">模型参数说明</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <p style={{ marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
              以下为 OpenAI API 格式支持的常用参数。Key Split 作为代理会将参数原样透传给上游模型，实际支持哪些参数取决于上游服务商。
            </p>
            <table className="doc-table">
              <thead>
                <tr><th>参数</th><th>范围</th><th>默认值</th><th>说明</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>temperature</code></td>
                  <td>0 - 2.0</td>
                  <td>1.0</td>
                  <td>控制输出的随机性。值越高，输出越随机和有创意；值越低，输出越确定和保守。</td>
                </tr>
                <tr>
                  <td><code>top_p</code></td>
                  <td>0 - 1.0</td>
                  <td>1.0</td>
                  <td>核采样。模型只考虑概率质量前 top_p 的 token。建议与 temperature 二选一调整。</td>
                </tr>
                <tr>
                  <td><code>max_tokens</code></td>
                  <td>1 - 模型上限</td>
                  <td>模型默认</td>
                  <td>最大输出 token 数。不同模型上限不同。</td>
                </tr>
                <tr>
                  <td><code>frequency_penalty</code></td>
                  <td>-2.0 - 2.0</td>
                  <td>0</td>
                  <td>频率惩罚。正值降低重复用词的概率。</td>
                </tr>
                <tr>
                  <td><code>presence_penalty</code></td>
                  <td>-2.0 - 2.0</td>
                  <td>0</td>
                  <td>存在惩罚。正值鼓励引入新话题。</td>
                </tr>
                <tr>
                  <td><code>stream</code></td>
                  <td>true / false</td>
                  <td>false</td>
                  <td>流式输出。启用后通过 SSE 逐 token 返回。</td>
                </tr>
                <tr>
                  <td><code>stop</code></td>
                  <td>string / array</td>
                  <td>null</td>
                  <td>停止序列。遇到指定字符串时停止生成。</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ═══════════════ 错误码 ═══════════════ */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="errors">错误码</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <table className="doc-table">
              <thead>
                <tr><th>HTTP 状态码</th><th>错误信息</th><th>说明</th><th>处理建议</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>400</code></td>
                  <td>Path not allowed</td>
                  <td>请求的 API 路径不在白名单内</td>
                  <td>检查请求路径是否正确</td>
                </tr>
                <tr>
                  <td><code>401</code></td>
                  <td>Missing API key</td>
                  <td>未提供 Authorization 头，或 Key 格式不正确（长度不足）</td>
                  <td>检查请求头是否包含 <code>Authorization: Bearer sk-***</code>，Key 长度是否足够</td>
                </tr>
                <tr>
                  <td><code>401</code></td>
                  <td>Invalid API key</td>
                  <td>子 Key 无效或已禁用</td>
                  <td>检查子 Key 是否正确，是否已启用</td>
                </tr>
                <tr>
                  <td><code>413</code></td>
                  <td>Request body too large</td>
                  <td>请求体超过 10MB 限制</td>
                  <td>减少 messages 数量或缩短内容</td>
                </tr>
                <tr>
                  <td><code>429</code></td>
                  <td>Rate limit exceeded (N req/min)</td>
                  <td>子 Key 请求频率超过限制，N 为该子 Key 的实际限制值</td>
                  <td>降低请求频率，或联系管理员提高限额</td>
                </tr>
                <tr>
                  <td><code>429</code></td>
                  <td>Quota exceeded</td>
                  <td>子 Key 的 token 额度已用完</td>
                  <td>联系管理员重置额度或提高上限</td>
                </tr>
                <tr>
                  <td><code>502</code></td>
                  <td>All channels failed</td>
                  <td>所有上游渠道均不可用</td>
                  <td>稍后重试，或联系管理员检查渠道配置</td>
                </tr>
                <tr>
                  <td><code>503</code></td>
                  <td>No available channel</td>
                  <td>没有可用的上游渠道</td>
                  <td>联系管理员添加或启用渠道</td>
                </tr>
              </tbody>
            </table>
            <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              上游 API 返回的错误（如 401 认证失败、402 余额不足等）会直接透传给客户端。
            </p>
          </div>
        </section>

        {/* ═══════════════ 速率限制与额度 ═══════════════ */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="limits">速率限制与额度</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <table className="doc-table">
              <thead>
                <tr><th>限制类型</th><th>默认值</th><th>说明</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>速率限制</td>
                  <td>60 次/分钟</td>
                  <td>每个子 Key 每分钟最多请求数，由管理员自定义。设为 0 可完全禁用速率限制。</td>
                </tr>
                <tr>
                  <td>Token 额度</td>
                  <td>无限</td>
                  <td>子 Key 的 token 总量上限，设为 -1 表示无限。Token 数来自上游 API 返回的 usage 字段，不同厂商的计算方式可能不同。</td>
                </tr>
                <tr>
                  <td>请求体大小</td>
                  <td>10 MB</td>
                  <td>单次请求体最大 10MB</td>
                </tr>
                <tr>
                  <td>请求超时</td>
                  <td>120 秒</td>
                  <td>上游 API 请求超时时间</td>
                </tr>
              </tbody>
            </table>
            <p style={{ marginTop: '0.75rem' }}>
              <strong>流式输出：</strong>支持通过 SSE（Server-Sent Events）逐 token 返回，兼容所有 OpenAI SDK。
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              <strong>重试机制：</strong>当上游渠道返回 5xx 错误时，系统会自动切换到下一个可用渠道重试（最多 3 次）。
            </p>
          </div>
        </section>

        {/* ═══════════════ 最佳实践 ═══════════════ */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }} id="best-practices">最佳实践</h2>
          <div className="card" style={{ fontSize: '0.85rem' }}>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>妥善保管子 Key：</strong>子 Key 只在创建时显示一次，请及时保存。如遗失需重新创建。
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>合理设置额度：</strong>为每个子 Key 设置合适的 token 额度上限，避免意外消耗过多。
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>使用流式输出：</strong>对于长文本生成，建议使用流式输出以提升用户体验。
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>实现重试逻辑：</strong>遇到 429 或 5xx 错误时，建议使用指数退避重试。
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>监控用量：</strong>定期查看用量统计，及时发现异常消耗。
              </li>
            </ul>
          </div>
        </section>

      </div>
    </>
  );
}
