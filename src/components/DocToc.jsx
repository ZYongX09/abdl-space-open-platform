import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * 文档页目录导航组件
 * 自动提取 .page-body 内的 h2 标题，生成右侧固定目录
 */
export default function DocToc() {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef(null);

  // 扫描 h2 标题
  useEffect(() => {
    const container = document.querySelector('.page-body');
    if (!container) return;

    const els = container.querySelectorAll('h2[id]');
    const items = Array.from(els).map(el => ({
      id: el.id,
      text: el.textContent.trim(),
    }));
    setHeadings(items);

    // IntersectionObserver 监听滚动
    observerRef.current = new IntersectionObserver(
      entries => {
        // 找到第一个进入视口的标题
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-100px 0px -40% 0px', threshold: 0 }
    );

    els.forEach(el => observerRef.current.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = useCallback(id => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  if (headings.length < 2) return null;

  return (
    <nav className="doc-toc" aria-label="本页目录">
      <div className="doc-toc-title">本页目录</div>
      <ul className="doc-toc-list">
        {headings.map(h => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`doc-toc-link ${activeId === h.id ? 'active' : ''}`}
              onClick={e => {
                e.preventDefault();
                scrollTo(h.id);
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
