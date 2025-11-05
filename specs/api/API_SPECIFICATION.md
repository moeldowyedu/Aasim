# API Specification

## Overview

RESTful API specification for Aasim AI Judge Agent platform.

**Base URL:** `https://api.aasim.app/v1`
**Protocol:** HTTPS only
**Format:** JSON
**Authentication:** JWT Bearer Token

---

## Authentication

### Register

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123",
  "first_name": "John",
  "last_name": "Doe",
  "organization": "Tech Corp" // optional
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user",
      "created_at": "2024-11-05T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  }
}
```

---

### Login

Authenticate user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  }
}
```

---

### Refresh Token

Refresh expired JWT token.

**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  }
}
```

---

### Logout

Invalidate current session.

**Endpoint:** `POST /auth/logout`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## User Management

### Get Current User

Get authenticated user profile.

**Endpoint:** `GET /users/me`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user",
    "avatar_url": "https://cdn.aasim.app/avatars/user.jpg",
    "organization": "Tech Corp",
    "email_verified_at": "2024-11-05T10:00:00Z",
    "created_at": "2024-11-05T10:00:00Z"
  }
}
```

---

### Update User Profile

Update user information.

**Endpoint:** `PUT /users/me`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "organization": "New Corp",
  "phone": "+1234567890"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "organization": "New Corp",
    "phone": "+1234567890",
    "updated_at": "2024-11-05T11:00:00Z"
  }
}
```

---

## Submissions

### Create Submission

Create a new submission for evaluation.

**Endpoint:** `POST /submissions`

**Headers:**
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Request Body (Form Data):**
```
title: "My Project Submission"
description: "Description of the project"
submission_type: "competition" // competition|education|recruitment|review
files[]: <binary file 1>
files[]: <binary file 2>
criteria_id: "uuid-of-criteria" // optional
metadata: {"key": "value"} // optional JSON string
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "uuid": "650e8400-e29b-41d4-a716-446655440000",
    "title": "My Project Submission",
    "description": "Description of the project",
    "submission_type": "competition",
    "status": "pending",
    "files": [
      {
        "uuid": "750e8400-e29b-41d4-a716-446655440000",
        "file_type": "video",
        "original_filename": "presentation.mp4",
        "file_size": 15728640,
        "mime_type": "video/mp4"
      }
    ],
    "created_at": "2024-11-05T12:00:00Z"
  }
}
```

---

### Get Submissions

Get list of user submissions.

**Endpoint:** `GET /submissions`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` (int, default: 1)
- `per_page` (int, default: 20, max: 100)
- `status` (string: pending|processing|completed|failed)
- `type` (string: competition|education|recruitment|review)
- `sort` (string: created_at|updated_at, default: created_at)
- `order` (string: asc|desc, default: desc)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "uuid": "650e8400-e29b-41d4-a716-446655440000",
        "title": "My Project Submission",
        "submission_type": "competition",
        "status": "completed",
        "file_count": 2,
        "has_evaluation": true,
        "created_at": "2024-11-05T12:00:00Z",
        "processed_at": "2024-11-05T12:05:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 45,
      "total_pages": 3
    }
  }
}
```

---

### Get Submission Details

Get detailed information about a submission.

**Endpoint:** `GET /submissions/{uuid}`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "uuid": "650e8400-e29b-41d4-a716-446655440000",
    "title": "My Project Submission",
    "description": "Description of the project",
    "submission_type": "competition",
    "status": "completed",
    "files": [
      {
        "uuid": "750e8400-e29b-41d4-a716-446655440000",
        "file_type": "video",
        "original_filename": "presentation.mp4",
        "file_size": 15728640,
        "mime_type": "video/mp4",
        "duration": 300,
        "created_at": "2024-11-05T12:00:00Z"
      }
    ],
    "evaluation": {
      "uuid": "850e8400-e29b-41d4-a716-446655440000",
      "overall_score": 87.5,
      "confidence_score": 92.0,
      "status": "completed",
      "created_at": "2024-11-05T12:05:00Z"
    },
    "created_at": "2024-11-05T12:00:00Z",
    "processed_at": "2024-11-05T12:05:00Z"
  }
}
```

---

### Delete Submission

Delete a submission.

**Endpoint:** `DELETE /submissions/{uuid}`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Submission deleted successfully"
}
```

---

## Evaluations

### Get Evaluation

Get evaluation details for a submission.

**Endpoint:** `GET /evaluations/{uuid}`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "uuid": "850e8400-e29b-41d4-a716-446655440000",
    "submission_uuid": "650e8400-e29b-41d4-a716-446655440000",
    "ai_model": "gpt-4-vision",
    "overall_score": 87.5,
    "confidence_score": 92.0,
    "processing_time": 45,
    "status": "completed",
    "scores": [
      {
        "criterion_name": "Technical Quality",
        "score": 92.0,
        "max_score": 100.0,
        "weight": 0.3,
        "comments": "Excellent code structure and best practices"
      },
      {
        "criterion_name": "Presentation",
        "score": 85.0,
        "max_score": 100.0,
        "weight": 0.25,
        "comments": "Clear articulation with good visual aids"
      },
      {
        "criterion_name": "Innovation",
        "score": 88.0,
        "max_score": 100.0,
        "weight": 0.25,
        "comments": "Creative approach to problem solving"
      },
      {
        "criterion_name": "Documentation",
        "score": 83.0,
        "max_score": 100.0,
        "weight": 0.2,
        "comments": "Good documentation, could be more detailed"
      }
    ],
    "insights": [
      {
        "type": "strength",
        "title": "Excellent Technical Implementation",
        "description": "Code follows industry best practices...",
        "priority": 5
      },
      {
        "type": "recommendation",
        "title": "Improve API Documentation",
        "description": "Consider adding more detailed API docs...",
        "priority": 3
      }
    ],
    "created_at": "2024-11-05T12:05:00Z"
  }
}
```

---

### Request Re-evaluation

Request a new evaluation for a submission.

**Endpoint:** `POST /submissions/{uuid}/evaluate`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "criteria_id": "uuid-of-criteria", // optional
  "ai_model": "gpt-4-vision" // optional
}
```

**Response:** `202 Accepted`
```json
{
  "success": true,
  "message": "Re-evaluation queued",
  "data": {
    "submission_uuid": "650e8400-e29b-41d4-a716-446655440000",
    "status": "processing"
  }
}
```

---

## Evaluation Criteria

### Get Criteria Templates

Get list of available evaluation criteria templates.

**Endpoint:** `GET /criteria`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `category` (string)
- `is_public` (boolean)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "criteria": [
      {
        "uuid": "950e8400-e29b-41d4-a716-446655440000",
        "name": "Hackathon Evaluation",
        "description": "Standard criteria for hackathon projects",
        "category": "competition",
        "is_public": true,
        "criteria_count": 5,
        "created_at": "2024-11-05T10:00:00Z"
      }
    ]
  }
}
```

---

### Get Criteria Details

Get detailed criteria configuration.

**Endpoint:** `GET /criteria/{uuid}`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "uuid": "950e8400-e29b-41d4-a716-446655440000",
    "name": "Hackathon Evaluation",
    "description": "Standard criteria for hackathon projects",
    "category": "competition",
    "criteria_data": [
      {
        "name": "Technical Quality",
        "description": "Code quality, architecture, best practices",
        "weight": 0.3,
        "max_score": 100
      },
      {
        "name": "Innovation",
        "description": "Creativity and uniqueness of solution",
        "weight": 0.25,
        "max_score": 100
      },
      {
        "name": "Presentation",
        "description": "Clarity and effectiveness of presentation",
        "weight": 0.25,
        "max_score": 100
      },
      {
        "name": "Documentation",
        "description": "Quality of documentation and README",
        "weight": 0.2,
        "max_score": 100
      }
    ],
    "is_public": true,
    "created_at": "2024-11-05T10:00:00Z"
  }
}
```

---

### Create Custom Criteria

Create custom evaluation criteria.

**Endpoint:** `POST /criteria`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "My Custom Criteria",
  "description": "Custom evaluation for my competition",
  "category": "competition",
  "is_public": false,
  "criteria_data": [
    {
      "name": "Creativity",
      "description": "Original thinking",
      "weight": 0.4,
      "max_score": 100
    },
    {
      "name": "Execution",
      "description": "Quality of implementation",
      "weight": 0.6,
      "max_score": 100
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "uuid": "a50e8400-e29b-41d4-a716-446655440000",
    "name": "My Custom Criteria",
    "description": "Custom evaluation for my competition",
    "category": "competition",
    "is_public": false,
    "criteria_data": [...],
    "created_at": "2024-11-05T13:00:00Z"
  }
}
```

---

## Reports

### Generate Report

Generate a downloadable report for an evaluation.

**Endpoint:** `POST /evaluations/{uuid}/reports`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "format": "pdf" // pdf|json|html
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "uuid": "b50e8400-e29b-41d4-a716-446655440000",
    "format": "pdf",
    "file_size": 245760,
    "download_url": "https://api.aasim.app/v1/reports/b50e8400/download",
    "expires_at": "2024-11-12T13:00:00Z",
    "created_at": "2024-11-05T13:00:00Z"
  }
}
```

---

### Download Report

Download a generated report.

**Endpoint:** `GET /reports/{uuid}/download`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
- Content-Type: `application/pdf` or `application/json` or `text/html`
- Binary file content

---

### Share Report

Generate a public share link for a report.

**Endpoint:** `POST /reports/{uuid}/share`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "expires_in_days": 7 // optional, default: 7, max: 30
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "share_url": "https://aasim.app/reports/share/abc123xyz789",
    "share_token": "abc123xyz789",
    "expires_at": "2024-11-12T13:00:00Z"
  }
}
```

---

## Competitions (Phase 3)

### Create Competition

**Endpoint:** `POST /competitions`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "title": "Hackathon 2024",
  "description": "Annual coding competition",
  "criteria_id": "uuid-of-criteria",
  "start_date": "2024-12-01T00:00:00Z",
  "end_date": "2024-12-31T23:59:59Z",
  "max_submissions": 3,
  "settings": {
    "allow_multiple_submissions": true,
    "public_leaderboard": true
  }
}
```

**Response:** `201 Created`

---

## Analytics (Admin Only)

### Get Dashboard Stats

**Endpoint:** `GET /analytics/dashboard`

**Headers:** `Authorization: Bearer {token}`

**Permissions:** Admin only

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "total_users": 1250,
    "total_submissions": 3450,
    "total_evaluations": 3200,
    "processing_queue": 15,
    "stats_period": "last_30_days",
    "submission_trend": [...]
  }
}
```

---

## Webhooks (N8n Integration)

### Overview

Aasim uses N8n workflows for all evaluation processing. The system sends submission data to N8n via webhooks and receives results back through callback webhooks.

**Architecture:**
```
Backend → POST to N8n → N8n Agents Process → N8n Callback → Backend
```

---

### Webhook Callback: Receive Evaluation Results

Receives evaluation results from N8n workflows.

**Endpoint:** `POST /webhooks/evaluation-callback`

**Headers:**
```
Content-Type: application/json
X-N8n-Signature: <hmac-sha256-signature>
X-Webhook-Secret: <shared-secret>
```

**Request Body (from N8n):**
```json
{
  "workflow_id": "n8n-workflow-123",
  "submission_id": "650e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "agent": "video_audio_analysis",
  "results": {
    "overall_score": 85.5,
    "confidence": 92.0,
    "scores": [
      {
        "criterion": "presentation_quality",
        "score": 88.0,
        "weight": 0.3,
        "comments": "Excellent delivery and visual aids"
      },
      {
        "criterion": "clarity",
        "score": 90.0,
        "weight": 0.25,
        "comments": "Very clear articulation"
      }
    ],
    "insights": [
      {
        "type": "strength",
        "title": "Strong vocal presence",
        "description": "Confident delivery with excellent tone",
        "priority": 5
      },
      {
        "type": "recommendation",
        "title": "Add more visual examples",
        "description": "Consider including more diagrams",
        "priority": 3
      }
    ]
  },
  "processing_time": 45,
  "timestamp": "2024-11-05T10:30:00Z"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Results received and processed",
  "submission_id": "650e8400-e29b-41d4-a716-446655440000"
}
```

**Agent Types:**
- `video_audio_analysis` - Video & Audio Analysis Agent
- `document_review` - Document Review Agent
- `code_assessment` - Source Code Assessment Agent
- `custom_evaluation` - Custom Evaluation Criteria Agent
- `consistency_check` - Objective & Consistent Scoring Agent

---

### Webhook Callback: Receive Report Results

Receives generated report from N8n report generation workflow.

**Endpoint:** `POST /webhooks/report-callback`

**Headers:**
```
Content-Type: application/json
X-N8n-Signature: <hmac-sha256-signature>
X-Webhook-Secret: <shared-secret>
```

**Request Body (from N8n):**
```json
{
  "workflow_id": "n8n-workflow-456",
  "submission_id": "650e8400-e29b-41d4-a716-446655440000",
  "evaluation_id": "850e8400-e29b-41d4-a716-446655440000",
  "report_url": "https://storage.aasim.app/reports/report-123.pdf",
  "report_format": "pdf",
  "file_size": 245760,
  "status": "completed",
  "timestamp": "2024-11-05T10:35:00Z"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Report received and saved",
  "report_uuid": "b50e8400-e29b-41d4-a716-446655440000"
}
```

---

### Webhook Callback: Receive Error Notifications

Receives error notifications when N8n workflow fails.

**Endpoint:** `POST /webhooks/error-callback`

**Headers:**
```
Content-Type: application/json
X-N8n-Signature: <hmac-sha256-signature>
X-Webhook-Secret: <shared-secret>
```

**Request Body (from N8n):**
```json
{
  "workflow_id": "n8n-workflow-789",
  "submission_id": "650e8400-e29b-41d4-a716-446655440000",
  "agent": "video_audio_analysis",
  "status": "failed",
  "error": {
    "code": "PROCESSING_ERROR",
    "message": "Failed to extract audio from video",
    "details": "Corrupted file format or unsupported codec",
    "retry_attempted": true,
    "retry_count": 3
  },
  "timestamp": "2024-11-05T10:32:00Z"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Error logged and user notified"
}
```

---

### Webhook Callback: Receive Progress Updates

Receives real-time progress updates during long-running evaluations.

**Endpoint:** `POST /webhooks/progress-callback`

**Headers:**
```
Content-Type: application/json
X-N8n-Signature: <hmac-sha256-signature>
X-Webhook-Secret: <shared-secret>
```

**Request Body (from N8n):**
```json
{
  "workflow_id": "n8n-workflow-123",
  "submission_id": "650e8400-e29b-41d4-a716-446655440000",
  "agent": "video_audio_analysis",
  "status": "processing",
  "progress": {
    "step": "audio_extraction",
    "step_number": 2,
    "total_steps": 5,
    "percentage": 40,
    "message": "Extracting audio from video file..."
  },
  "timestamp": "2024-11-05T10:30:30Z"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Progress updated"
}
```

---

### Get Webhook Logs

Retrieve webhook activity logs for a submission.

**Endpoint:** `GET /submissions/{uuid}/webhook-logs`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `type` (string): `outgoing` or `incoming`
- `status` (string): `pending`, `success`, `failed`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 123,
        "webhook_type": "outgoing",
        "agent_name": "video_audio_analysis",
        "endpoint": "https://n8n.aasim.app/webhook/video-audio-analysis",
        "status": "success",
        "status_code": 200,
        "retry_count": 0,
        "created_at": "2024-11-05T10:25:00Z"
      },
      {
        "id": 124,
        "webhook_type": "incoming",
        "agent_name": "video_audio_analysis",
        "status": "success",
        "status_code": 200,
        "created_at": "2024-11-05T10:30:00Z"
      }
    ]
  }
}
```

---

### Retry Failed Webhook

Manually retry a failed webhook delivery.

**Endpoint:** `POST /webhooks/retry/{log_id}`

**Headers:** `Authorization: Bearer {token}`

**Permissions:** Admin only

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Webhook retry queued",
  "log_id": 123
}
```

---

### Webhook Security

#### HMAC Signature Verification

All incoming webhooks from N8n must include an HMAC signature for verification.

**Signature Generation (N8n side):**
```javascript
const crypto = require('crypto');
const payload = JSON.stringify(data);
const secret = 'your-shared-secret';
const signature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');
```

**Signature Verification (Backend):**
```php
$signature = $_SERVER['HTTP_X_N8N_SIGNATURE'];
$payload = file_get_contents('php://input');
$secret = $_ENV['N8N_WEBHOOK_SECRET'];

$expectedSignature = hash_hmac('sha256', $payload, $secret);

if (!hash_equals($signature, $expectedSignature)) {
    http_response_code(401);
    die(json_encode(['error' => 'Invalid signature']));
}
```

#### IP Whitelisting

Configure firewall to only accept webhooks from N8n server IPs.

#### Shared Secret

Both backend and N8n must share the same webhook secret:
- Backend: `N8N_WEBHOOK_SECRET` in `.env`
- N8n: Configure in credentials/environment

---

## Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Error Codes

- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `422 Unprocessable Entity` - Validation failed
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## Rate Limiting

- **Anonymous:** 100 requests per hour
- **Authenticated Users:** 1000 requests per hour
- **Premium Users:** 5000 requests per hour

**Rate Limit Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1699189200
```

---

## Pagination

All list endpoints support pagination with the following query parameters:

- `page` (int): Page number (default: 1)
- `per_page` (int): Items per page (default: 20, max: 100)

**Pagination Response:**
```json
{
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

---

## File Upload Limits

- **Maximum File Size:** 500MB per file
- **Supported Formats:**
  - Video: MP4, MOV, AVI, WebM
  - Audio: MP3, WAV, AAC, M4A
  - Documents: PDF, DOC, DOCX
  - Code: ZIP, TAR.GZ (with source files)

---

**Document Version:** 1.0
**Last Updated:** 2024-11-05
