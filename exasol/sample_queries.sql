-- ==============================================================================
-- LoopCraft — Exasol Analytic Queries & Benchmarks
-- Demonstrating In-Memory Columnar Speed over High-Velocity Support Telemetry
-- ==============================================================================

OPEN SCHEMA LOOPCRAFT_ANALYTICS;

-- 1. Real-time Negative Feedback Cluster Detection
-- Scans conversational feedback to cluster failure categories across topics
SELECT 
    k.category,
    COUNT(i.interaction_id) AS total_queries,
    SUM(CASE WHEN i.rating = -1 THEN 1 ELSE 0 END) AS thumbs_down_count,
    ROUND(SUM(CASE WHEN i.rating = -1 THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(i.interaction_id), 0), 2) AS failure_rate_pct,
    AVG(i.latency_ms) AS avg_bot_latency_ms
FROM AI_INTERACTIONS i
JOIN KB_ARTICLES k ON i.kb_article_id = k.article_id
GROUP BY k.category
ORDER BY thumbs_down_count DESC;

-- 2. Stale Article Anomaly Detection
-- Identifies articles whose escalation rate increased by > 20% over prior week
SELECT 
    k.article_id,
    k.title,
    k.deflection_rate,
    k.escalation_count,
    COUNT(d.diagnostic_id) AS queued_corrections,
    CASE 
        WHEN k.deflection_rate < 50.0 THEN 'CRITICAL_STALE'
        WHEN k.deflection_rate < 75.0 THEN 'WARNING_DRIFT'
        ELSE 'HEALTHY'
    END AS health_status
FROM KB_ARTICLES k
LEFT JOIN AI_INTERACTIONS i ON k.article_id = i.kb_article_id
LEFT JOIN FEEDBACK_DIAGNOSTICS d ON i.interaction_id = d.interaction_id AND d.status = 'QUEUED_FOR_REVIEW'
GROUP BY k.article_id, k.title, k.deflection_rate, k.escalation_count
ORDER BY k.deflection_rate ASC;

-- 3. Deflection Recovery Impact (Pre vs Post Correction)
-- Computes the statistical jump in deflection before and after KB update
WITH interaction_stats AS (
    SELECT 
        i.kb_article_id,
        CASE 
            WHEN i.interaction_time >= TIMESTAMP '2026-03-01 00:00:00' THEN 'POST_CORRECTION'
            ELSE 'PRE_CORRECTION'
        END AS period,
        COUNT(*) AS volume,
        SUM(CASE WHEN i.rating = 1 THEN 1 ELSE 0 END) AS successful_deflections
    FROM AI_INTERACTIONS i
    WHERE i.kb_article_id IN ('KB-104', 'KB-201')
    GROUP BY i.kb_article_id, 
             CASE 
                WHEN i.interaction_time >= TIMESTAMP '2026-03-01 00:00:00' THEN 'POST_CORRECTION'
                ELSE 'PRE_CORRECTION'
             END
)
SELECT 
    kb_article_id,
    period,
    volume,
    successful_deflections,
    ROUND(successful_deflections * 100.0 / NULLIF(volume, 0), 2) AS deflection_rate_pct
FROM interaction_stats
ORDER BY kb_article_id, period DESC;
