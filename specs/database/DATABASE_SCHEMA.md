# Database Schema Specification

## Overview

This document defines the database schema for the Aasim AI Judge Agent platform using MariaDB 10.11+.

## Database Configuration

- **Database Name:** `aasim_db`
- **Character Set:** `utf8mb4`
- **Collation:** `utf8mb4_unicode_ci`
- **Engine:** InnoDB
- **Timezone:** UTC

---

## Tables

### 1. users

Stores user account information.

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('user', 'judge', 'admin') DEFAULT 'user',
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    organization VARCHAR(255),
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    email_verified_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    INDEX idx_email (email),
    INDEX idx_uuid (uuid),
    INDEX idx_role (role),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. password_resets

Manages password reset tokens.

```sql
CREATE TABLE password_resets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. sessions

Tracks user sessions and JWT tokens.

```sql
CREATE TABLE sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500) NOT NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token (token(255)),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 4. submissions

Stores submission requests for evaluation.

```sql
CREATE TABLE submissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    submission_type ENUM('competition', 'education', 'recruitment', 'review') NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    priority TINYINT DEFAULT 5,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_uuid (uuid),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_type (submission_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 5. submission_files

Stores uploaded files associated with submissions.

```sql
CREATE TABLE submission_files (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE,
    submission_id BIGINT UNSIGNED NOT NULL,
    file_type ENUM('video', 'audio', 'document', 'code', 'other') NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT UNSIGNED NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    duration INT NULL COMMENT 'Duration in seconds for video/audio',
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
    INDEX idx_uuid (uuid),
    INDEX idx_submission_id (submission_id),
    INDEX idx_file_type (file_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 6. evaluation_criteria

Defines criteria templates for evaluations.

```sql
CREATE TABLE evaluation_criteria (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    is_template BOOLEAN DEFAULT TRUE,
    created_by BIGINT UNSIGNED,
    is_public BOOLEAN DEFAULT FALSE,
    criteria_data JSON NOT NULL COMMENT 'Array of criteria with weights',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_uuid (uuid),
    INDEX idx_created_by (created_by),
    INDEX idx_is_public (is_public),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 7. evaluations

Stores AI evaluation results.

```sql
CREATE TABLE evaluations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE,
    submission_id BIGINT UNSIGNED NOT NULL,
    criteria_id BIGINT UNSIGNED NULL,
    ai_model VARCHAR(100) NOT NULL COMMENT 'e.g., gpt-4-vision, claude-3',
    overall_score DECIMAL(5,2) NOT NULL,
    confidence_score DECIMAL(5,2),
    processing_time INT COMMENT 'Processing time in seconds',
    ai_raw_response LONGTEXT,
    status ENUM('completed', 'partial', 'failed') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (criteria_id) REFERENCES evaluation_criteria(id) ON DELETE SET NULL,
    INDEX idx_uuid (uuid),
    INDEX idx_submission_id (submission_id),
    INDEX idx_criteria_id (criteria_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 8. evaluation_scores

Detailed scores for individual criteria.

```sql
CREATE TABLE evaluation_scores (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    evaluation_id BIGINT UNSIGNED NOT NULL,
    criterion_name VARCHAR(255) NOT NULL,
    criterion_weight DECIMAL(5,2) NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    max_score DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE CASCADE,
    INDEX idx_evaluation_id (evaluation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 9. evaluation_insights

AI-generated insights and recommendations.

```sql
CREATE TABLE evaluation_insights (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    evaluation_id BIGINT UNSIGNED NOT NULL,
    insight_type ENUM('strength', 'weakness', 'recommendation', 'observation') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority TINYINT DEFAULT 3 COMMENT '1=Low, 3=Medium, 5=High',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE CASCADE,
    INDEX idx_evaluation_id (evaluation_id),
    INDEX idx_type (insight_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 10. reports

Generated evaluation reports.

```sql
CREATE TABLE reports (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE,
    evaluation_id BIGINT UNSIGNED NOT NULL,
    report_format ENUM('json', 'pdf', 'html') NOT NULL,
    file_path VARCHAR(500),
    file_size BIGINT UNSIGNED,
    is_public BOOLEAN DEFAULT FALSE,
    share_token VARCHAR(64) UNIQUE,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE CASCADE,
    INDEX idx_uuid (uuid),
    INDEX idx_evaluation_id (evaluation_id),
    INDEX idx_share_token (share_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 11. competitions

Manages competition/event information.

```sql
CREATE TABLE competitions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    organizer_id BIGINT UNSIGNED NOT NULL,
    criteria_id BIGINT UNSIGNED,
    status ENUM('draft', 'active', 'closed', 'archived') DEFAULT 'draft',
    start_date TIMESTAMP NULL,
    end_date TIMESTAMP NULL,
    max_submissions INT DEFAULT 1,
    settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (criteria_id) REFERENCES evaluation_criteria(id) ON DELETE SET NULL,
    INDEX idx_uuid (uuid),
    INDEX idx_organizer_id (organizer_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 12. competition_participants

Links users to competitions.

```sql
CREATE TABLE competition_participants (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    competition_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    role ENUM('participant', 'judge', 'organizer') DEFAULT 'participant',
    status ENUM('registered', 'submitted', 'evaluated') DEFAULT 'registered',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_participation (competition_id, user_id),
    INDEX idx_competition_id (competition_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 13. activity_logs

Tracks user and system activities.

```sql
CREATE TABLE activity_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT UNSIGNED,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 14. notifications

User notifications system.

```sql
CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 15. api_keys

API keys for external integrations.

```sql
CREATE TABLE api_keys (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    key_prefix VARCHAR(20) NOT NULL,
    permissions JSON,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_key_hash (key_hash),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 16. system_settings

System configuration and settings.

```sql
CREATE TABLE system_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 17. webhook_logs

Tracks all webhook communications with N8n workflows.

```sql
CREATE TABLE webhook_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    submission_id BIGINT UNSIGNED NOT NULL,
    workflow_id VARCHAR(100),
    workflow_type VARCHAR(50) NOT NULL COMMENT 'video_audio_analysis, document_review, code_assessment, etc.',
    agent_name VARCHAR(100),
    webhook_type ENUM('outgoing', 'incoming') NOT NULL,
    endpoint VARCHAR(500),
    request_payload LONGTEXT,
    response_payload LONGTEXT,
    status_code INT,
    status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
    error_message TEXT,
    retry_count TINYINT DEFAULT 0,
    processing_time INT COMMENT 'Time in seconds',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
    INDEX idx_submission_id (submission_id),
    INDEX idx_workflow_id (workflow_id),
    INDEX idx_workflow_type (workflow_type),
    INDEX idx_webhook_type (webhook_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Relationships Diagram (Updated for N8n Integration)

```
users (1) ----< (*) submissions
users (1) ----< (*) sessions
users (1) ----< (*) evaluation_criteria
users (1) ----< (*) competitions
users (1) ----< (*) competition_participants
users (1) ----< (*) activity_logs
users (1) ----< (*) notifications
users (1) ----< (*) api_keys

submissions (1) ----< (*) submission_files
submissions (1) ----< (*) evaluations
submissions (1) ----< (*) webhook_logs [NEW for N8n]

evaluation_criteria (1) ----< (*) evaluations
evaluation_criteria (1) ----< (*) competitions

evaluations (1) ----< (*) evaluation_scores
evaluations (1) ----< (*) evaluation_insights
evaluations (1) ----< (*) reports

competitions (1) ----< (*) competition_participants
```

---

## N8n Integration Schema Changes

### Modified Table: evaluations

Add fields for N8n workflow tracking:

```sql
ALTER TABLE evaluations
ADD COLUMN workflow_id VARCHAR(100) AFTER ai_model,
ADD COLUMN workflow_type VARCHAR(50) COMMENT 'Type of N8n workflow used',
ADD COLUMN webhook_status ENUM('pending', 'sent', 'processing', 'completed', 'failed') DEFAULT 'pending',
ADD COLUMN n8n_callback_received_at TIMESTAMP NULL,
ADD INDEX idx_workflow_id (workflow_id),
ADD INDEX idx_webhook_status (webhook_status);
```

### Modified Table: submissions

Add N8n processing status:

```sql
ALTER TABLE submissions
ADD COLUMN n8n_processing_started_at TIMESTAMP NULL AFTER processed_at,
ADD COLUMN n8n_processing_completed_at TIMESTAMP NULL,
ADD COLUMN total_webhooks_sent INT DEFAULT 0,
ADD COLUMN total_webhooks_completed INT DEFAULT 0;
```

---

## Data Retention Policy (Updated)

- **Active Data:** Indefinite
- **Soft Deletes:** 90 days before hard delete
- **Session Data:** 30 days
- **Activity Logs:** 1 year
- **Password Resets:** 24 hours
- **Expired Reports:** Archive after 6 months
- **Webhook Logs:** 90 days (archive successful, keep failed for 1 year)

---

## Relationships Diagram

```
users (1) ----< (*) submissions
users (1) ----< (*) sessions
users (1) ----< (*) evaluation_criteria
users (1) ----< (*) competitions
users (1) ----< (*) competition_participants
users (1) ----< (*) activity_logs
users (1) ----< (*) notifications
users (1) ----< (*) api_keys

submissions (1) ----< (*) submission_files
submissions (1) ----< (*) evaluations

evaluation_criteria (1) ----< (*) evaluations
evaluation_criteria (1) ----< (*) competitions

evaluations (1) ----< (*) evaluation_scores
evaluations (1) ----< (*) evaluation_insights
evaluations (1) ----< (*) reports

competitions (1) ----< (*) competition_participants
```

---

## Indexes Strategy

1. **Primary Keys:** Auto-increment BIGINT for all tables
2. **UUIDs:** For public-facing identifiers (shareable, secure)
3. **Foreign Keys:** For referential integrity
4. **Composite Indexes:** For common query patterns
5. **Full-Text Indexes:** Consider for search features (future)

---

## Data Retention Policy

- **Active Data:** Indefinite
- **Soft Deletes:** 90 days before hard delete
- **Session Data:** 30 days
- **Activity Logs:** 1 year
- **Password Resets:** 24 hours
- **Expired Reports:** Archive after 6 months

---

## Backup Strategy

- **Full Backup:** Daily at 2 AM UTC
- **Incremental Backup:** Every 6 hours
- **Retention:** 30 days of backups
- **Testing:** Monthly restore tests

---

## Performance Considerations

1. **Partitioning:** Consider partitioning large tables (activity_logs) by date
2. **Archiving:** Move old data to archive tables
3. **Query Optimization:** Use EXPLAIN for slow queries
4. **Connection Pooling:** Implement connection pooling
5. **Caching:** Redis for frequently accessed data

---

**Document Version:** 1.0
**Last Updated:** 2024-11-05
