# Backend Webhook Service Implementation

## Overview

Complete implementation guide for handling webhooks in the Aasim backend for N8n integration.

---

## Webhook Service Architecture

```
WebhookController → WebhookService → N8nService
                         ↓
                    WebhookLogger
                         ↓
                  WebhookRepository
```

---

## 1. Webhook Controller

```php
<?php
// src/Controllers/WebhookController.php

namespace App\Controllers;

use App\Services\WebhookService;
use App\Utils\WebhookVerifier;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class WebhookController
{
    private WebhookService $webhookService;
    private WebhookVerifier $verifier;

    public function __construct(WebhookService $webhookService, WebhookVerifier $verifier)
    {
        $this->webhookService = $webhookService;
        $this->verifier = $verifier;
    }

    /**
     * Handle evaluation results callback from N8n
     */
    public function evaluationCallback(Request $request, Response $response): Response
    {
        // Verify webhook signature
        if (!$this->verifier->verify($request)) {
            return $this->jsonResponse($response, [
                'success' => false,
                'error' => ['code' => 'INVALID_SIGNATURE', 'message' => 'Invalid webhook signature']
            ], 401);
        }

        $data = $request->getParsedBody();

        try {
            $result = $this->webhookService->handleEvaluationCallback($data);

            return $this->jsonResponse($response, [
                'success' => true,
                'message' => 'Results received and processed',
                'submission_id' => $result['submission_id']
            ]);
        } catch (\Exception $e) {
            return $this->jsonResponse($response, [
                'success' => false,
                'error' => ['code' => 'PROCESSING_ERROR', 'message' => $e->getMessage()]
            ], 500);
        }
    }

    /**
     * Handle report generation callback from N8n
     */
    public function reportCallback(Request $request, Response $response): Response
    {
        if (!$this->verifier->verify($request)) {
            return $this->jsonResponse($response, [
                'success' => false,
                'error' => ['code' => 'INVALID_SIGNATURE', 'message' => 'Invalid webhook signature']
            ], 401);
        }

        $data = $request->getParsedBody();

        try {
            $result = $this->webhookService->handleReportCallback($data);

            return $this->jsonResponse($response, [
                'success' => true,
                'message' => 'Report received and saved',
                'report_uuid' => $result['report_uuid']
            ]);
        } catch (\Exception $e) {
            return $this->jsonResponse($response, [
                'success' => false,
                'error' => ['code' => 'PROCESSING_ERROR', 'message' => $e->getMessage()]
            ], 500);
        }
    }

    /**
     * Handle error notifications from N8n
     */
    public function errorCallback(Request $request, Response $response): Response
    {
        if (!$this->verifier->verify($request)) {
            return $this->jsonResponse($response, [
                'success' => false,
                'error' => ['code' => 'INVALID_SIGNATURE', 'message' => 'Invalid webhook signature']
            ], 401);
        }

        $data = $request->getParsedBody();

        try {
            $this->webhookService->handleErrorCallback($data);

            return $this->jsonResponse($response, [
                'success' => true,
                'message' => 'Error logged and user notified'
            ]);
        } catch (\Exception $e) {
            return $this->jsonResponse($response, [
                'success' => false,
                'error' => ['code' => 'PROCESSING_ERROR', 'message' => $e->getMessage()]
            ], 500);
        }
    }

    /**
     * Handle progress updates from N8n
     */
    public function progressCallback(Request $request, Response $response): Response
    {
        if (!$this->verifier->verify($request)) {
            return $this->jsonResponse($response, [
                'success' => false,
                'error' => ['code' => 'INVALID_SIGNATURE', 'message' => 'Invalid webhook signature']
            ], 401);
        }

        $data = $request->getParsedBody();

        try {
            $this->webhookService->handleProgressCallback($data);

            return $this->jsonResponse($response, [
                'success' => true,
                'message' => 'Progress updated'
            ]);
        } catch (\Exception $e) {
            return $this->jsonResponse($response, [
                'success' => false,
                'error' => ['code' => 'PROCESSING_ERROR', 'message' => $e->getMessage()]
            ], 500);
        }
    }

    private function jsonResponse(Response $response, array $data, int $status = 200): Response
    {
        $response->getBody()->write(json_encode($data));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }
}
```

---

## 2. Webhook Service

```php
<?php
// src/Services/WebhookService.php

namespace App\Services;

use App\Models\Submission;
use App\Models\Evaluation;
use App\Models\EvaluationScore;
use App\Models\EvaluationInsight;
use App\Models\Report;
use App\Repositories\WebhookLogRepository;
use App\Services\NotificationService;

class WebhookService
{
    private Submission $submissionModel;
    private Evaluation $evaluationModel;
    private EvaluationScore $scoreModel;
    private EvaluationInsight $insightModel;
    private Report $reportModel;
    private WebhookLogRepository $webhookLogRepo;
    private NotificationService $notificationService;

    public function __construct(
        Submission $submissionModel,
        Evaluation $evaluationModel,
        EvaluationScore $scoreModel,
        EvaluationInsight $insightModel,
        Report $reportModel,
        WebhookLogRepository $webhookLogRepo,
        NotificationService $notificationService
    ) {
        $this->submissionModel = $submissionModel;
        $this->evaluationModel = $evaluationModel;
        $this->scoreModel = $scoreModel;
        $this->insightModel = $insightModel;
        $this->reportModel = $reportModel;
        $this->webhookLogRepo = $webhookLogRepo;
        $this->notificationService = $notificationService;
    }

    /**
     * Handle evaluation results from N8n
     */
    public function handleEvaluationCallback(array $data): array
    {
        $submissionId = $data['submission_id'];
        $workflowId = $data['workflow_id'];
        $agent = $data['agent'];
        $results = $data['results'];

        // Log incoming webhook
        $this->webhookLogRepo->logIncoming([
            'submission_id' => $submissionId,
            'workflow_id' => $workflowId,
            'workflow_type' => $agent,
            'agent_name' => $agent,
            'payload' => json_encode($data),
            'status' => 'success'
        ]);

        // Get submission
        $submission = $this->submissionModel->findByUuid($submissionId);
        if (!$submission) {
            throw new \Exception('Submission not found');
        }

        // Create or update evaluation
        $evaluationId = $this->createOrUpdateEvaluation($submission['id'], $workflowId, $agent, $results);

        // Save scores
        $this->saveScores($evaluationId, $results['scores']);

        // Save insights
        $this->saveInsights($evaluationId, $results['insights']);

        // Update submission status
        $this->submissionModel->update($submission['id'], [
            'status' => 'completed',
            'processed_at' => date('Y-m-d H:i:s'),
            'n8n_processing_completed_at' => date('Y-m-d H:i:s'),
            'total_webhooks_completed' => $submission['total_webhooks_completed'] + 1
        ]);

        // Notify user
        $this->notificationService->notifyEvaluationComplete($submission['user_id'], $submissionId);

        return [
            'submission_id' => $submissionId,
            'evaluation_id' => $evaluationId
        ];
    }

    /**
     * Handle report generation callback from N8n
     */
    public function handleReportCallback(array $data): array
    {
        $submissionId = $data['submission_id'];
        $evaluationId = $data['evaluation_id'];
        $reportUrl = $data['report_url'];
        $reportFormat = $data['report_format'];
        $fileSize = $data['file_size'];

        // Get submission
        $submission = $this->submissionModel->findByUuid($submissionId);
        if (!$submission) {
            throw new \Exception('Submission not found');
        }

        // Get evaluation
        $evaluation = $this->evaluationModel->findByUuid($evaluationId);
        if (!$evaluation) {
            throw new \Exception('Evaluation not found');
        }

        // Create report record
        $reportId = $this->reportModel->create([
            'uuid' => $this->generateUuid(),
            'evaluation_id' => $evaluation['id'],
            'report_format' => $reportFormat,
            'file_path' => $reportUrl,
            'file_size' => $fileSize,
            'is_public' => false
        ]);

        $report = $this->reportModel->find($reportId);

        // Notify user
        $this->notificationService->notifyReportReady($submission['user_id'], $report['uuid']);

        return [
            'report_uuid' => $report['uuid']
        ];
    }

    /**
     * Handle error callback from N8n
     */
    public function handleErrorCallback(array $data): void
    {
        $submissionId = $data['submission_id'];
        $workflowId = $data['workflow_id'];
        $agent = $data['agent'];
        $error = $data['error'];

        // Get submission
        $submission = $this->submissionModel->findByUuid($submissionId);
        if (!$submission) {
            throw new \Exception('Submission not found');
        }

        // Log error webhook
        $this->webhookLogRepo->logIncoming([
            'submission_id' => $submissionId,
            'workflow_id' => $workflowId,
            'workflow_type' => $agent,
            'agent_name' => $agent,
            'payload' => json_encode($data),
            'status' => 'failed',
            'error_message' => $error['message']
        ]);

        // Update submission status
        $this->submissionModel->update($submission['id'], [
            'status' => 'failed'
        ]);

        // Notify user about error
        $this->notificationService->notifyEvaluationFailed(
            $submission['user_id'],
            $submissionId,
            $error['message']
        );
    }

    /**
     * Handle progress updates from N8n
     */
    public function handleProgressCallback(array $data): void
    {
        $submissionId = $data['submission_id'];
        $progress = $data['progress'];

        // Get submission
        $submission = $this->submissionModel->findByUuid($submissionId);
        if (!$submission) {
            throw new \Exception('Submission not found');
        }

        // Update submission metadata with progress
        $metadata = json_decode($submission['metadata'] ?? '{}', true);
        $metadata['progress'] = $progress;

        $this->submissionModel->update($submission['id'], [
            'metadata' => json_encode($metadata)
        ]);

        // Send real-time update via WebSocket or Server-Sent Events
        // TODO: Implement real-time notification
    }

    private function createOrUpdateEvaluation(int $submissionId, string $workflowId, string $agent, array $results): int
    {
        $evaluationId = $this->evaluationModel->create([
            'uuid' => $this->generateUuid(),
            'submission_id' => $submissionId,
            'ai_model' => $agent,
            'workflow_id' => $workflowId,
            'workflow_type' => $agent,
            'overall_score' => $results['overall_score'],
            'confidence_score' => $results['confidence'],
            'processing_time' => $results['processing_time'] ?? null,
            'ai_raw_response' => json_encode($results),
            'status' => 'completed',
            'webhook_status' => 'completed',
            'n8n_callback_received_at' => date('Y-m-d H:i:s')
        ]);

        return $evaluationId;
    }

    private function saveScores(int $evaluationId, array $scores): void
    {
        foreach ($scores as $score) {
            $this->scoreModel->create([
                'evaluation_id' => $evaluationId,
                'criterion_name' => $score['criterion'],
                'criterion_weight' => $score['weight'],
                'score' => $score['score'],
                'max_score' => 100,
                'comments' => $score['comments'] ?? null
            ]);
        }
    }

    private function saveInsights(int $evaluationId, array $insights): void
    {
        foreach ($insights as $insight) {
            $this->insightModel->create([
                'evaluation_id' => $evaluationId,
                'insight_type' => $insight['type'],
                'title' => $insight['title'],
                'description' => $insight['description'],
                'priority' => $insight['priority'] ?? 3
            ]);
        }
    }

    private function generateUuid(): string
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}
```

---

## 3. N8n Service (Outgoing Webhooks)

```php
<?php
// src/Services/N8nService.php

namespace App\Services;

use GuzzleHttp\Client;
use App\Repositories\WebhookLogRepository;

class N8nService
{
    private Client $httpClient;
    private string $baseUrl;
    private string $webhookSecret;
    private WebhookLogRepository $webhookLogRepo;

    public function __construct(WebhookLogRepository $webhookLogRepo)
    {
        $this->httpClient = new Client(['timeout' => 30]);
        $this->baseUrl = $_ENV['N8N_BASE_URL'];
        $this->webhookSecret = $_ENV['N8N_WEBHOOK_SECRET'];
        $this->webhookLogRepo = $webhookLogRepo;
    }

    /**
     * Trigger video/audio analysis workflow
     */
    public function triggerVideoAudioAnalysis(array $submissionData): array
    {
        $endpoint = $this->baseUrl . $_ENV['N8N_VIDEO_AUDIO_WEBHOOK'];

        $payload = [
            'workflow_type' => 'video_audio_analysis',
            'submission_id' => $submissionData['uuid'],
            'callback_url' => $_ENV['WEBHOOK_CALLBACK_URL'] . '/evaluation-callback',
            'files' => $submissionData['files'],
            'criteria' => $submissionData['criteria'] ?? $this->getDefaultCriteria('video_audio')
        ];

        return $this->sendWebhook($endpoint, $payload, $submissionData['id'], 'video_audio_analysis');
    }

    /**
     * Trigger document review workflow
     */
    public function triggerDocumentReview(array $submissionData): array
    {
        $endpoint = $this->baseUrl . $_ENV['N8N_DOCUMENT_WEBHOOK'];

        $payload = [
            'workflow_type' => 'document_review',
            'submission_id' => $submissionData['uuid'],
            'callback_url' => $_ENV['WEBHOOK_CALLBACK_URL'] . '/evaluation-callback',
            'files' => $submissionData['files'],
            'criteria' => $submissionData['criteria'] ?? $this->getDefaultCriteria('document')
        ];

        return $this->sendWebhook($endpoint, $payload, $submissionData['id'], 'document_review');
    }

    /**
     * Trigger code assessment workflow
     */
    public function triggerCodeAssessment(array $submissionData): array
    {
        $endpoint = $this->baseUrl . $_ENV['N8N_CODE_WEBHOOK'];

        $payload = [
            'workflow_type' => 'code_assessment',
            'submission_id' => $submissionData['uuid'],
            'callback_url' => $_ENV['WEBHOOK_CALLBACK_URL'] . '/evaluation-callback',
            'files' => $submissionData['files'],
            'criteria' => $submissionData['criteria'] ?? $this->getDefaultCriteria('code')
        ];

        return $this->sendWebhook($endpoint, $payload, $submissionData['id'], 'code_assessment');
    }

    /**
     * Trigger custom evaluation workflow
     */
    public function triggerCustomEvaluation(array $submissionData, array $customCriteria): array
    {
        $endpoint = $this->baseUrl . $_ENV['N8N_CUSTOM_WEBHOOK'];

        $payload = [
            'workflow_type' => 'custom_evaluation',
            'submission_id' => $submissionData['uuid'],
            'callback_url' => $_ENV['WEBHOOK_CALLBACK_URL'] . '/evaluation-callback',
            'files' => $submissionData['files'],
            'custom_criteria' => $customCriteria
        ];

        return $this->sendWebhook($endpoint, $payload, $submissionData['id'], 'custom_evaluation');
    }

    /**
     * Trigger report generation workflow
     */
    public function triggerReportGeneration(array $evaluationData, string $format = 'pdf'): array
    {
        $endpoint = $this->baseUrl . $_ENV['N8N_REPORT_WEBHOOK'];

        $payload = [
            'workflow_type' => 'report_generation',
            'submission_id' => $evaluationData['submission_uuid'],
            'evaluation_id' => $evaluationData['uuid'],
            'callback_url' => $_ENV['WEBHOOK_CALLBACK_URL'] . '/report-callback',
            'evaluation_data' => $evaluationData,
            'report_format' => $format,
            'template' => 'standard'
        ];

        return $this->sendWebhook($endpoint, $payload, $evaluationData['submission_id'], 'report_generation');
    }

    /**
     * Send webhook to N8n
     */
    private function sendWebhook(string $endpoint, array $payload, int $submissionId, string $workflowType): array
    {
        // Add HMAC signature
        $signature = $this->generateSignature($payload);

        // Log outgoing webhook
        $logId = $this->webhookLogRepo->logOutgoing([
            'submission_id' => $submissionId,
            'workflow_type' => $workflowType,
            'endpoint' => $endpoint,
            'request_payload' => json_encode($payload),
            'status' => 'pending'
        ]);

        try {
            $response = $this->httpClient->post($endpoint, [
                'json' => $payload,
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-Webhook-Secret' => $this->webhookSecret,
                    'X-Signature' => $signature
                ]
            ]);

            $statusCode = $response->getStatusCode();
            $responseBody = (string) $response->getBody();

            // Update log as success
            $this->webhookLogRepo->update($logId, [
                'status' => 'success',
                'status_code' => $statusCode,
                'response_payload' => $responseBody
            ]);

            return [
                'success' => true,
                'status_code' => $statusCode,
                'response' => json_decode($responseBody, true)
            ];

        } catch (\Exception $e) {
            // Update log as failed
            $this->webhookLogRepo->update($logId, [
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);

            throw new \Exception('Failed to send webhook: ' . $e->getMessage());
        }
    }

    private function generateSignature(array $payload): string
    {
        return hash_hmac('sha256', json_encode($payload), $this->webhookSecret);
    }

    private function getDefaultCriteria(string $type): array
    {
        $criteria = [
            'video_audio' => [
                'presentation_quality' => 0.3,
                'clarity' => 0.25,
                'engagement' => 0.25,
                'professionalism' => 0.2
            ],
            'document' => [
                'content_quality' => 0.35,
                'structure' => 0.25,
                'formatting' => 0.2,
                'references' => 0.2
            ],
            'code' => [
                'code_quality' => 0.3,
                'architecture' => 0.25,
                'documentation' => 0.2,
                'best_practices' => 0.15,
                'testing' => 0.1
            ]
        ];

        return $criteria[$type] ?? [];
    }
}
```

---

## 4. Webhook Verifier Utility

```php
<?php
// src/Utils/WebhookVerifier.php

namespace App\Utils;

use Psr\Http\Message\ServerRequestInterface as Request;

class WebhookVerifier
{
    private string $webhookSecret;

    public function __construct()
    {
        $this->webhookSecret = $_ENV['N8N_WEBHOOK_SECRET'];
    }

    /**
     * Verify HMAC signature from N8n webhook
     */
    public function verify(Request $request): bool
    {
        $signature = $request->getHeaderLine('X-N8n-Signature');

        if (empty($signature)) {
            return false;
        }

        $payload = (string) $request->getBody();
        $expectedSignature = hash_hmac('sha256', $payload, $this->webhookSecret);

        // Reset body stream for later use
        $request->getBody()->rewind();

        return hash_equals($expectedSignature, $signature);
    }

    /**
     * Verify webhook secret
     */
    public function verifySecret(Request $request): bool
    {
        $secret = $request->getHeaderLine('X-Webhook-Secret');
        return hash_equals($this->webhookSecret, $secret);
    }
}
```

---

## 5. Webhook Routes

```php
<?php
// Add to src/routes.php

// Webhook callbacks (from N8n)
$app->group('/api/v1/webhooks', function (RouteCollectorProxy $group) {

    $group->post('/evaluation-callback', [WebhookController::class, 'evaluationCallback']);
    $group->post('/report-callback', [WebhookController::class, 'reportCallback']);
    $group->post('/error-callback', [WebhookController::class, 'errorCallback']);
    $group->post('/progress-callback', [WebhookController::class, 'progressCallback']);

});

// Webhook management (authenticated)
$app->group('/api/v1', function (RouteCollectorProxy $group) {

    $group->get('/submissions/{uuid}/webhook-logs', [SubmissionController::class, 'getWebhookLogs']);
    $group->post('/webhooks/retry/{log_id}', [WebhookController::class, 'retryWebhook']);

})->add(new AuthMiddleware());
```

---

**Document Version:** 1.0
**Last Updated:** 2024-11-05
